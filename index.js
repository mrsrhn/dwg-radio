import { registerRootComponent } from 'expo';
import TrackPlayer, { State } from 'react-native-track-player';
import App from './App.tsx';
import BackgroundTimer from 'react-native-background-timer';
import { rootStore } from './src/providers/storeProvider';

registerRootComponent(App);

BackgroundTimer.runBackgroundTimer(async () => {
  const playerState = await TrackPlayer.getPlaybackState();
  if (rootStore.playerStore.isPlaying && playerState.state !== State.Playing) {
    const track = await TrackPlayer.getActiveTrack();
    await TrackPlayer.stop();
    await TrackPlayer.load(track);
    await TrackPlayer.play();
  }
}, 3000);

TrackPlayer.registerPlaybackService(() => async () => {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
});
