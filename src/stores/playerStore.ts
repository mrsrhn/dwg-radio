import { action, makeObservable, observable } from 'mobx';

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
} from 'react-native-track-player';
import * as Network from 'expo-network';
import { Config } from '../types/config';

export type Channel = 'lyra' | 'radio' | 'pur';

class PlayerStore {
  isConnected = true;

  playbackState: State = State.None;

  isLoaded = false;

  isPlaying = false;

  selectedChannel: Channel = 'radio';

  config: Config;

  currentMetaData: unknown = undefined;

  constructor(config: Config) {
    makeObservable(this, {
      isPlaying: observable,
      playbackState: observable,
      selectedChannel: observable,
      currentMetaData: observable,
      isConnected: observable,
    });
    this.config = config;
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

    const channels = [
      this.config.configBase.urlLyra,
      this.config.configBase.urlRadio,
      this.config.configBase.urlPur,
      // Setting Pitchalgorithm is a workaround for this bug: https://github.com/doublesymmetry/react-native-track-player/issues/2124#issuecomment-1729441871
    ].map((url) => ({ url, pitchAlgorithm: PitchAlgorithm.Voice }));
    await TrackPlayer.add(channels);
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

  setIsLoaded = action((isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  });

  setSelectedChannel = action((channel: Channel) => {
    this.selectedChannel = channel;
  });

  updateChannel = async (selectedChannel: Channel) => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    if (currentTrack === undefined) return;

    switch (selectedChannel) {
      case 'lyra':
        if (currentTrack === 0) {
          break;
        } else if (currentTrack === 1) {
          TrackPlayer.skipToPrevious();
          break;
        } else {
          await TrackPlayer.skipToPrevious();
          TrackPlayer.skipToPrevious();
          break;
        }
      case 'radio':
        if (currentTrack === 0) {
          TrackPlayer.skipToNext();
          break;
        } else if (currentTrack === 1) {
          break;
        } else {
          TrackPlayer.skipToPrevious();
          break;
        }
      case 'pur':
        if (currentTrack === 0) {
          await TrackPlayer.skipToNext();
          TrackPlayer.skipToNext();
          break;
        } else if (currentTrack === 1) {
          TrackPlayer.skipToNext();
          break;
        } else {
          break;
        }
      default:
        break;
    }
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
    await this.seekToLivePosition();
    await TrackPlayer.play();
  };

  private seekToLivePosition = async () => {
    // React Native Track Player cannot seek to the live position in a stream,
    // so we switch channels for a moment
    if (this.selectedChannel === 'pur') {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.skipToNext();
    } else {
      await TrackPlayer.skipToNext();
      await TrackPlayer.skipToPrevious();
    }
  };

  private registerEvents = () => {
    TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, (metadata) =>
      this.setCurrentMetaData(metadata)
    );
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
}

export default PlayerStore;
