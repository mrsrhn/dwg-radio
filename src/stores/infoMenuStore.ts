import { makeObservable, computed } from 'mobx';

import { Config } from '../types/config';
import PlayerStore from './playerStore';

interface ChannelInfo {
  title: string;
  infoString: string;
}

class InfoMenuStore {
  config: Config;

  playerStore: PlayerStore;

  constructor(config: Config, playerStore: PlayerStore) {
    makeObservable(this, {
      channelInfo: computed,
    });

    this.config = config;
    this.playerStore = playerStore;
  }

  get channelInfo(): ChannelInfo {
    const { configStrings } = this.config;
    switch (this.playerStore.selectedChannelKey) {
      case 'radio':
        return {
          title: configStrings.radio,
          infoString: configStrings.infoStringRadio,
        };
      case 'pur':
        return {
          title: configStrings.pur,
          infoString: configStrings.infoStringPur,
        };
      case 'lyra':
        return {
          title: configStrings.lyra,
          infoString: configStrings.infoStringLyra,
        };
      default:
        return { title: '', infoString: '' };
    }
  }
}

export default InfoMenuStore;
