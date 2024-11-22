import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';
import { Image } from 'expo-image';

interface HistoryItemProps {
  title: string;
  artist: string;
  time: string;
  url?: string;
  hasBeenPlayed?: boolean;
  highlighted?: boolean;
}

function HistoryItem(props: HistoryItemProps) {
  const { title, artist, time, url, hasBeenPlayed, highlighted } = props;
  const { configStrings } = useConfig();

  const openInDwgLoad = () => {
    if (url?.length) {
      Alert.alert('', configStrings.openInDwgLoad, [
        {
          text: configStrings.cancel,
          style: 'cancel',
        },
        {
          text: configStrings.openInDwgLoadButton,
          onPress: () => {
            Linking.openURL(url);
          },
        },
      ]);
    }
  };

  const clickable = url !== undefined && url.length > 0 && hasBeenPlayed;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${title}, ${configStrings.accessFrom} ${artist}, ${configStrings.accessPlayedAt} ${time} ${configStrings.accessClock}`}
    >
      <Pressable
        onPress={() => (clickable ? openInDwgLoad() : () => {})}
        style={styles.titleContainer}
      >
        {({ pressed }) => (
          <>
            <View>
              <Text
                style={{
                  ...(highlighted ? styles.titleHighlighted : styles.title),
                  ...(pressed && clickable ? styles.titlePressed : {}),
                }}
              >
                {title}
              </Text>
              <Text style={styles.artist}>{artist}</Text>
            </View>
            {clickable ? (
              <View
                style={{
                  ...styles.externalLinkContainer,
                  ...(pressed && clickable ? styles.titlePressed : {}),
                }}
                accessibilityLabel={configStrings.accessOpenInDwgLoad}
              >
                <Image
                  style={styles.externalLinkImage}
                  source={require('../../assets/external-link.svg')}
                />
              </View>
            ) : null}
          </>
        )}
      </Pressable>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingHorizontal: Dimensions.get('window').width > 320 ? 20 : 0,
  },
  titleContainer: {
    textAlign: 'left',
    maxWidth: '75%',
    flexDirection: 'row',
  },
  externalLinkContainer: {
    paddingTop: 3,
    paddingLeft: 3,
    alignContent: 'flex-start',
    maxWidth: '5%',
  },
  externalLinkImage: {
    width: 10,
    height: 10,
    paddingLeft: 2,
  },
  timeContainer: { width: '20%', flex: 1 },
  title: {
    color: Colors.dwgDarkColor,
  },
  titleHighlighted: {
    color: Colors.dwgDarkColor,
    fontWeight: 'bold',
  },
  artist: {
    color: Colors.dwgGreyColor,
    fontSize: 12,
  },
  time: {
    textAlign: 'right',
    color: Colors.dwgGreyColor,
    fontSize: 12,
  },
  titlePressed: {
    opacity: 0.5,
  },
});

export default HistoryItem;
