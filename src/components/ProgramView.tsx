import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';
import HistoryItem from './HistoryItem';

import { Ionicons } from '@expo/vector-icons';

import { getStringsForProgramHeader } from '../utils/splitItemsByDate';
import useStores from '../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { indexForLastDay } from '../stores/programStore';
import useRadioProgram from '../hooks/useRadioProgramItems';

const PLACEHOLDER = '{{}}';

const ProgramView = observer(() => {
  const { configStrings } = useConfig();
  const { programStore } = useStores();
  const { programItems, currentlyPlaying, programDatesToShow } =
    useRadioProgram(programStore.radioProgramToDisplay);

  const { previousDayString, selectedDayString, nextDayString } =
    getStringsForProgramHeader(
      programStore.radioProgramToDisplay,
      programDatesToShow
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.backButtonContainer}
          onPress={() => programStore.updateRadioProgramToDisplay('backward')}
          accessible
          accessibilityLabel={configStrings.accessShowProgramOfDay.replace(
            PLACEHOLDER,
            previousDayString
          )}
        >
          {({ pressed }) => (
            <>
              <View
                style={[styles.chevronContainer, pressed && styles.pressed]}
              >
                {programStore.radioProgramToDisplay !== 0 && (
                  <Ionicons
                    name="chevron-back-outline"
                    color={Colors.dwgDarkColor}
                    size={20}
                  />
                )}
              </View>
              <Text style={[styles.date, pressed && styles.pressed]}>
                {previousDayString}
              </Text>
            </>
          )}
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {programStore.isShowingProgramForToday
              ? configStrings.today
              : selectedDayString}
          </Text>
        </View>
        <Pressable
          style={styles.forwardButtonContainer}
          onPress={() => programStore.updateRadioProgramToDisplay('forward')}
          accessible
          accessibilityLabel={configStrings.accessShowProgramOfDay.replace(
            PLACEHOLDER,
            nextDayString
          )}
        >
          {({ pressed }) => (
            <>
              <Text style={[styles.date, pressed && styles.pressed]}>
                {nextDayString}
              </Text>
              <View
                style={[styles.chevronContainer, pressed && styles.pressed]}
              >
                {programStore.radioProgramToDisplay !== indexForLastDay && (
                  <Ionicons
                    name="chevron-forward-outline"
                    color={Colors.dwgDarkColor}
                    size={20}
                  />
                )}
              </View>
            </>
          )}
        </Pressable>
      </View>
      {programItems.map((item, index) => (
        <View key={item.id}>
          <HistoryItem
            title={item.title}
            artist={item.artist}
            time={item.time}
            hasBeenPlayed={item.hasBeenPlayed}
            url={item.url}
            highlighted={index === currentlyPlaying}
          />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.dwgBackgroundColor,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronContainer: { width: 20 },
  titleContainer: { alignItems: 'center' },
  title: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.dwgDarkColor,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: Colors.dwgDarkColor,
    alignItems: 'center',
  },
  backButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  forwardButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ProgramView;
