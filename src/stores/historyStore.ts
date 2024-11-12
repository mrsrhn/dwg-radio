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

    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        this.updateCurrentHistory();
      }
    });
  }

  init() {
    this.updateHistoryRadio();
    this.updateHistoryLyra();
    this.updateHistoryPur();
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

  updateHistoryRadio = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryRadio
    );
    this.setHistoryRadio(data);

    TrackPlayer.updateMetadataForTrack(1, {
      title: data[0].title,
      artist: data[0].artist,
    });
  };

  updateHistoryLyra = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryLyra
    );
    this.setHistoryLyra(data);
    TrackPlayer.updateMetadataForTrack(0, {
      title: data[0].title,
      artist: data[0].artist,
    });
  };

  updateHistoryPur = async () => {
    const data = await HistoryStore.getHistory(
      this.config.configBase.urlHistoryPur
    );
    this.setHistoryPur(data);
    TrackPlayer.updateMetadataForTrack(2, {
      title: data[0].title,
      artist: data[0].artist,
    });
  };

  updateCurrentHistory = async () => {
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
