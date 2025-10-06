import { makeObservable, observable, action } from 'mobx';
import { Platform } from 'react-native';
import Timer from 'react-native-background-timer-android';

import { Config } from '../types/config';
import PlayerStore from './playerStore';

const SLEEP_TIMER_INTERVAL = 1000;

class SleepTimerStore {
  config: Config;

  playerStore: PlayerStore;

  sleepTimerProgress: number | undefined = undefined;

  sleepTimerInterval?: number | NodeJS.Timeout;

  constructor(config: Config, playerStore: PlayerStore) {
    makeObservable(this, {
      sleepTimerProgress: observable,
    });
    this.config = config;
    this.playerStore = playerStore;
  }

  setSleepTimerProgress = action((value: number | undefined) => {
    this.sleepTimerProgress = value;
  });

  setDwgInterval = (callback: () => void, ms: number) => {
    if (Platform.OS === 'android') {
      return Timer.setInterval(callback, ms);
    }
    return setInterval(callback, ms);
  };

  clearDwgInterval = (interval: NodeJS.Timeout | number) => {
    if (Platform.OS === 'android' && typeof interval === 'number') {
      return Timer.clearInterval(interval);
    }
    return clearInterval(interval);
  };

  activateSleepTimer = (
    durationInMinutes: number,
    callbackAfterFinish: () => void
  ) => {
    if (this.sleepTimerInterval) {
      this.clearDwgInterval(this.sleepTimerInterval as NodeJS.Timeout);
      this.setSleepTimerProgress(undefined);
    }
    this.setSleepTimerProgress(durationInMinutes * 60);

    this.sleepTimerInterval = this.setDwgInterval(
      () => this.timerCallback(callbackAfterFinish),
      SLEEP_TIMER_INTERVAL
    );
    if (!this.playerStore.isPlaying) {
      this.pauseSleepTimer();
    }
  };

  timerCallback = (callbackAfterFinish?: () => void) => {
    if (this.sleepTimerProgress === 0 || !this.sleepTimerProgress) {
      if (this.sleepTimerInterval) {
        this.clearDwgInterval(this.sleepTimerInterval);
      }
      this.playerStore.stop();
      this.setSleepTimerProgress(undefined);
      callbackAfterFinish?.();
    } else {
      this.setSleepTimerProgress(this.sleepTimerProgress - 1);
    }
  };

  pauseSleepTimer = () => {
    if (this.sleepTimerInterval) {
      this.clearDwgInterval(this.sleepTimerInterval as NodeJS.Timeout);
    }
  };

  continueSleepTimer = () => {
    this.sleepTimerInterval = this.setDwgInterval(this.timerCallback, 1000);
  };

  stopSleepTimer = () => {
    this.pauseSleepTimer();
    this.setSleepTimerProgress(undefined);
  };
}

export default SleepTimerStore;
