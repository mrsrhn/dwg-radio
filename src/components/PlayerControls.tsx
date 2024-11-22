import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import useStores from '../hooks/useStores';
import Colors from '../Colors';
import SleepTimerButton from './SleepTimerButton';
import useConfig from '../hooks/useConfig';
import { State } from 'react-native-track-player';

const PLAYBUTTON_SIZE = 70;

interface PlayerControlsProps {
  onInfoMenuButton: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = observer(
  ({ onInfoMenuButton }) => {
    const { playerStore } = useStores();
    const { configStrings } = useConfig();

    const isBuffering = playerStore.playbackState === State.Buffering;

    const playButtonIconName = playerStore.isPlaying
      ? 'pause-circle-outline'
      : 'play-circle-outline';

    return (
      <View style={styles.container}>
        <View style={styles.sideButtonsContainer}>
          <SleepTimerButton />
        </View>
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={playerStore.togglePlayer}
            accessible
            accessibilityLabel={
              playerStore.isPlaying
                ? configStrings.accessPause
                : configStrings.accessContinue
            }
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View
                style={[
                  {
                    height: PLAYBUTTON_SIZE,
                  },
                  pressed && styles.pressed,
                ]}
              >
                {isBuffering ? (
                  <ActivityIndicator
                    color={Colors.dwgDarkColor}
                    size={PLAYBUTTON_SIZE}
                  />
                ) : (
                  <MaterialIcons
                    color={Colors.dwgDarkColor}
                    style={{
                      height: PLAYBUTTON_SIZE,
                    }}
                    size={PLAYBUTTON_SIZE}
                    name={playButtonIconName}
                  />
                )}
              </View>
            )}
          </Pressable>
        </View>
        <View style={styles.sideButtonsContainer}>
          <Pressable
            onPress={onInfoMenuButton}
            accessible
            accessibilityLabel={configStrings.accessOpenInfoMenu}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                size={30}
                color={Colors.dwgDarkColor}
                style={[pressed && styles.pressed]}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  sideButtonsContainer: {
    flexBasis: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});

export default PlayerControls;
