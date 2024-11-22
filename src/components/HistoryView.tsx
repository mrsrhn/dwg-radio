import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HistoryItem from './HistoryItem';
import getTimeFromIsoDate from '../utils/getTimeFromIsoDate';
import useStores from '../hooks/useStores';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';
import { observer } from 'mobx-react-lite';

const HistoryView = observer(() => {
  const { historyStore } = useStores();
  const { configStrings } = useConfig();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{configStrings.lastPlayedString}</Text>

      {historyStore.currentHistory.slice(1).map((item, index) => (
        <View key={`${item.raw_title}_${index}`}>
          <HistoryItem
            title={item.title}
            artist={item.artist}
            time={getTimeFromIsoDate(item.datetime)}
          />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Colors.dwgBackgroundColor,
  },
  title: {
    paddingVertical: 10,
    fontSize: 15,
    textAlign: 'center',
    color: Colors.dwgDarkColor,
    fontWeight: 'bold',
  },
});

export default HistoryView;
