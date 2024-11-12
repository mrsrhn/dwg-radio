import { action, makeObservable, observable, computed } from 'mobx';

import TrackPlayer, {
  Capability,
  State,
  Event,
  PlaybackState,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
  PitchAlgorithm,
  AppKilledPlaybackBehavior,
  AddTrack,
} from 'react-native-track-player';
import * as Network from 'expo-network';
import { Config } from '../types/config';

export type Channel = 'lyra' | 'radio' | 'pur';

export type ChannelIndex = 0 | 1 | 2;

class PlayerStore {
  isConnected = true;

  playbackState: State = State.None;

  isPlaying = false;

  selectedChannel: ChannelIndex = 1;

  config: Config;

  currentMetaData: unknown = undefined;

  channels: AddTrack[];

  constructor(config: Config) {
    makeObservable(this, {
      isPlaying: observable,
      playbackState: observable,
      selectedChannel: observable,
      currentMetaData: observable,
      isConnected: observable,
      selectedChannelKey: computed,
    });
    this.config = config;

    this.channels = [
      this.config.configBase.urlLyra,
      this.config.configBase.urlRadio,
      this.config.configBase.urlPur,
    ].map((url) => ({
      url,
      // Setting Pitchalgorithm is a workaround for this bug: https://github.com/doublesymmetry/react-native-track-player/issues/2124#issuecomment-1729441871
      pitchAlgorithm: PitchAlgorithm.Voice,
      isLiveStream: true,
    }));
    this.init();
  }

  private init = async () => {
    this.updateConnectionState();
    await TrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.SpokenAudio,
      iosCategoryOptions: [
        IOSCategoryOptions.AllowAirPlay,
        IOSCategoryOptions.AllowBluetooth,
        IOSCategoryOptions.AllowBluetoothA2DP,
        IOSCategoryOptions.InterruptSpokenAudioAndMixWithOthers,
      ],
    });

    this.registerEvents();

    await TrackPlayer.updateOptions({
      capabilities: [Capability.Play, Capability.Pause],
      android: {
        // This is the default behavior
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.PausePlayback,
      },
    });

    await TrackPlayer.add(this.channels);
  };

  setIsConnected = action((isConnected: boolean) => {
    this.isConnected = isConnected;
  });

  setCurrentMetaData = action((metaData: unknown) => {
    this.currentMetaData = metaData;
  });

  setIsPlaying = action((isPlaying: boolean) => {
    this.isPlaying = isPlaying;
  });

  setSelectedChannel = action((channel: ChannelIndex) => {
    this.selectedChannel = channel;
  });

  updateChannel = async (selectedChannel: ChannelIndex) => {
    TrackPlayer.load(this.channels[selectedChannel]);
    this.setSelectedChannel(selectedChannel);
  };

  togglePlayer = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      this.stop();
    } else {
      this.play();
    }
  };

  stop = () => {
    TrackPlayer.pause();
  };

  play = async () => {
    await TrackPlayer.play();
    this.seekToLivePosition();
  };

  private seekToLivePosition = async () => {
    const { buffered } = await TrackPlayer.getProgress();
    if (buffered) {
      TrackPlayer.seekTo(buffered - 5);
    }
  };

  private registerEvents = () => {
    TrackPlayer.addEventListener(Event.MetadataCommonReceived, (metadata) => {
      this.setCurrentMetaData(metadata);
    });
    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
      this.seekToLivePosition();
    });
    TrackPlayer.addEventListener(
      Event.PlaybackState,
      this.onPlaybackStateChange
    );
    TrackPlayer.addEventListener(Event.RemoteDuck, (e) => {
      if (e.paused) return;
      this.play();
    });
  };

  setPlaybackState = action((playbackState: State) => {
    this.playbackState = playbackState;
  });

  private onPlaybackStateChange = async (event: PlaybackState) => {
    this.setPlaybackState(event.state);
    this.updateConnectionState();
    console.log('changed state', event.state);

    switch (event.state) {
      case State.Playing:
        this.setIsPlaying(true);
        break;
      case State.Paused:
        this.setIsPlaying(false);
        break;
      default:
        break;
    }
  };

  private updateConnectionState = async () => {
    const networkState = await Network.getNetworkStateAsync();
    this.setIsConnected(networkState.isInternetReachable ?? false);

    if (!networkState.isInternetReachable) {
      this.startConnectionCheckInterval();
    }
  };

  private startConnectionCheckInterval = () => {
    async function checkConnection(): Promise<boolean> {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isInternetReachable ?? false;
    }

    const intervalId = setInterval(async () => {
      if (await checkConnection()) {
        clearInterval(intervalId);
        this.setIsConnected(true);
      }
    }, 3000);
  };

  get selectedChannelKey(): 'lyra' | 'radio' | 'pur' {
    return this.selectedChannel === 0 ? 'lyra' : this.selectedChannel === 1 ? 'radio' : 'pur';
  }
}

export default PlayerStore;
