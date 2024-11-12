import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import { Image, ImageSource } from 'expo-image';
import { ScalingDot } from 'react-native-animated-pagination-dots';
import { Channel } from '../stores/playerStore';
import useStores from '../hooks/useStores';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';

interface ChannelData {
  key: Channel;
  imgSource: ImageSource;
}

const CHANNELS: ChannelData[] = [
  { key: 'lyra', imgSource: require('../../assets/channels/lyra.jpg') },
  { key: 'radio', imgSource: require('../../assets/channels/radio.jpg') },
  { key: 'pur', imgSource: require('../../assets/channels/pur.jpg') },
];

const DWGPager = observer(() => {
  const { playerStore } = useStores();
  const { configStrings } = useConfig();
  const pagerRef = useRef<PagerView>(null);

  const onPageSelect = useCallback(
    (page: number) => {
      if (page >= 0 && page <= 2) {
        playerStore.updateChannel(page as 0 | 1 | 2);
      }
    },
    [playerStore]
  );
  
  const onGoBack = () => {
    switch (playerStore.selectedChannel) {
      case 0:
        pagerRef.current?.setPage(2);
        onPageSelect(2);
        break;
      case 1:
        pagerRef.current?.setPage(0);
        onPageSelect(0);
        break;
      case 2:
        pagerRef.current?.setPage(1);
        onPageSelect(1);
        break;
      default:
        break;
    }
  };

  const onGoForward = () => {
    switch (playerStore.selectedChannel) {
      case 0:
        pagerRef.current?.setPage(1);
        onPageSelect(1);
        break;
      case 1:
        pagerRef.current?.setPage(2);
        onPageSelect(2);
        break;
      case 2:
        pagerRef.current?.setPage(0);
        onPageSelect(0);
        break;
      default:
        break;
    }
  };

  const { width } = Dimensions.get('window');
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(1)).current;
  const inputRange = [0, CHANNELS.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, CHANNELS.length * width],
  });

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    []
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onGoBack}
        style={styles.goBackButton}
        accessible
        accessibilityLabel={configStrings.accessSwitchChannelBackward}
        accessibilityRole="button"
      />
      <PagerView
        ref={pagerRef}
        style={styles.viewPager}
        initialPage={1}
        onPageScroll={onPageScroll}
        onPageSelected={(e) => onPageSelect(e.nativeEvent.position)}
      >
        {CHANNELS.map((channel) => (
          <SafeAreaView style={styles.page} key={channel.key}>
            <Image
              style={styles.channelImage}
              source={channel.imgSource}
              contentFit="cover"
            />
          </SafeAreaView>
        ))}
      </PagerView>
      <ScalingDot
        data={CHANNELS}
        scrollX={scrollX as Animated.Value}
        inActiveDotOpacity={0.6}
        dotStyle={styles.paginationDot}
        activeDotColor={Colors.dwgDarkColor}
        inActiveDotColor={Colors.dwgGreyColor}
      />
      <Pressable
        onPress={onGoForward}
        style={styles.goForwardButton}
        accessible
        accessibilityLabel={configStrings.accessSwitchChannelForward}
        accessibilityRole="button"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
    backgroundColor: Colors.dwgBackgroundColor,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
  },
  channelImage: {
    width: '90%',
    height: '70%',
    marginHorizontal: '5%',
    borderRadius: 20,
  },
  paginationDot: {
    width: 7,
    height: 7,
    backgroundColor: '#347af0',
    borderRadius: 5,
    marginHorizontal: 7,
  },
  goBackButton: {
    width: 50,
    height: '10%',
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
  },
  goForwardButton: {
    width: 50,
    height: '10%',
    zIndex: 999,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default DWGPager;
