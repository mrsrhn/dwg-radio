import { makeObservable, observable, action, computed, reaction } from 'mobx';
import TrackPlayer from 'react-native-track-player';
import { AppState } from 'react-native';

import { Config } from '../types/config';
import PlayerStore from './playerStore';

interface HistoryEntry {
  artist: string;
  datetime: string;
  raw_title: string;
  title: string;
}

class HistoryStore {
  config: Config;

  playerStore: PlayerStore;

  historyRadio: HistoryEntry[] = [];

  historyPur: HistoryEntry[] = [];

  historyLyra: HistoryEntry[] = [];

  constructor(config: Config, playerStore: PlayerStore) {
    makeObservable(this, {
      historyRadio: observable,
      historyLyra: observable,
      historyPur: observable,
      currentHistory: computed,
      currentTitle: computed,
      currentArtist: computed,
    });
    this.config = config;
    this.playerStore = playerStore;
    this.init();

    reaction(
      () =>
        JSON.stringify([
          this.playerStore.currentMetaData,
          this.playerStore.selectedChannel,
          this.playerStore.isConnected,
        ]),
      () => this.updateCurrentHistory()
    );

    AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        this.updateCurrentHistory();
      }
    });
  }

  init() {
    this.getHistoryRadio().then(this.updateNowPlayingMetadata)
    this.getHistoryLyra();
    this.getHistoryPur();
  }

  updateNowPlayingMetadata = (historyData: HistoryEntry[]) => {
    TrackPlayer.updateNowPlayingMetadata({
      title: historyData[0].title,
      artist: historyData[0].artist,
      artwork: require('../../assets/dwgradio.png'),
    });
  }

  setHistoryRadio = action((history: HistoryEntry[]) => {
    this.historyRadio = history;
  });

  setHistoryPur = action((history: HistoryEntry[]) => {
    this.historyPur = history;
  });

  setHistoryLyra = action((history: HistoryEntry[]) => {
    this.historyLyra = history;
  });

  getHistoryRadio = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryRadio
    );
    this.setHistoryRadio(data);
    return data
  }

  getHistoryLyra = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryLyra
    );
    this.setHistoryLyra(data);
    return data
  }

  getHistoryPur = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryPur
    );
    this.setHistoryPur(data);
    return data
  }

  updateHistoryRadio = async () => {
    this.updateNowPlayingMetadata(this.historyRadio);
  };

  updateHistoryLyra = async () => {
    this.updateNowPlayingMetadata(this.historyLyra);
  };

  updateHistoryPur = async () => {
    this.updateNowPlayingMetadata(this.historyPur);
  };

  updateCurrentHistory = async () => {
    await Promise.all([this.getHistoryRadio(),
    this.getHistoryLyra(),
    this.getHistoryPur()])
    switch (this.playerStore.selectedChannelKey) {
      case 'lyra':
        this.updateHistoryLyra();
        break;
      case 'pur':
        this.updateHistoryPur();
        break;
      case 'radio':
        this.updateHistoryRadio();
        break;
      default:
        break;
    }
  };

  get currentHistory() {
    switch (this.playerStore.selectedChannelKey) {
      case 'radio':
        return this.historyRadio;
      case 'lyra':
        return this.historyLyra;
      case 'pur':
        return this.historyPur;
      default:
        return [];
    }
  }

  get currentTitle() {
    return this.currentHistory[0]?.title ?? '';
  }

  get currentArtist() {
    return this.currentHistory[0]?.artist ?? '';
  }

  static async getHistory(url: string) {
    const { data } = await (await fetch(url)).json();
    return data as HistoryEntry[];
  }
}

export default HistoryStore;
