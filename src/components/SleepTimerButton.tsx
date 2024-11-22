import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from '@react-native-menu/menu';
import { observer } from 'mobx-react-lite';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';
import useStores from '../hooks/useStores';
import generateTimeString from '../utils/generateTimeString';

const SLEEP_TIMER_OPTIONS = [5, 10, 15, 30, 60, 120];

const SleepTimerButton = observer(() => {
  const { configStrings } = useConfig();
  const { sleepTimerStore } = useStores();
  const [currentSleepTimerOption, setCurrentSleepTimerOption] = useState('0');

  const actions: MenuAction[] = useMemo(
    () => [
      {
        id: '0',
        title: configStrings.off,
        state: currentSleepTimerOption === '0' ? 'on' : 'off',
      },
      ...SLEEP_TIMER_OPTIONS.map(
        (option) =>
          ({
            id: `${option}`,
            title: `${option} ${configStrings.minutes}`,
            image: '',
            state: option.toString() === currentSleepTimerOption ? 'on' : 'off',
          } as MenuAction)
      ),
    ],
    [configStrings.minutes, configStrings.off, currentSleepTimerOption]
  );

  const onPressAction = (e: NativeActionEvent) => {
    if (e.nativeEvent.event === '0') {
      sleepTimerStore.stopSleepTimer();
    } else {
      sleepTimerStore.activateSleepTimer(
        parseInt(e.nativeEvent.event, 10),
        () => setCurrentSleepTimerOption('0')
      );
    }
    setCurrentSleepTimerOption(e.nativeEvent.event);
  };

  return (
    <MenuView
      title={configStrings.sleepTimer}
      onPressAction={onPressAction}
      actions={actions}
      accessible
      accessibilityLabel={`${configStrings.sleepTimer}: ${
        currentSleepTimerOption === '0'
          ? configStrings.off
          : `${currentSleepTimerOption} ${configStrings.minutes}`
      }`}
      accessibilityRole="button"
    >
      <Pressable
        style={({ pressed }) => [
          sleepTimerStore.sleepTimerProgress
            ? styles.containerActive
            : styles.containerInactive,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="timer-outline"
          size={30}
          color={
            sleepTimerStore.sleepTimerProgress ? 'white' : Colors.dwgDarkColor
          }
        />
        <View style={styles.timeRemainingContainer}>
          {sleepTimerStore.sleepTimerProgress ? (
            <Text style={styles.text}>
              {generateTimeString(sleepTimerStore.sleepTimerProgress)}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </MenuView>
  );
});

const styles = StyleSheet.create({
  containerInactive: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  containerActive: {
    flexDirection: 'row',
    backgroundColor: Colors.dwgDarkColor,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeRemainingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.5,
  },
});

export default SleepTimerButton;
