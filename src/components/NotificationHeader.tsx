import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '../hooks/useNotifications';

import Colors from '../Colors';

interface NotificationHeaderProps {
  notification: Notification;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  notification,
}) => {
  const [visible, setVisible] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;

  const onClose = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 50,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -10;
      },
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -10) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start(); // Return to original position
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{ transform: [{ translateY }] }}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.row,
            {
              backgroundColor: notification.color || styles.row.backgroundColor,
            },
          ]}
        >
          <View style={styles.icon}>
            {/* @ts-expect-error icon is a string which could be not in the Ionicons library */}
            <Ionicons name={notification.icon} color="white" size={24} />
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
            {notification.link && (
              <TouchableOpacity
                key={notification.link.title}
                onPress={() => Linking.openURL(notification.link!.url)}
              >
                <Text style={styles.buttonText}>{notification.link.title}</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  row: {
    borderRadius: 10,
    marginHorizontal: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.dwgBaseColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    paddingTop: 10,
  },
  column: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    flexDirection: 'column',
  },
  buttonText: {
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    color: 'white',
    fontSize: 12,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationHeader;
