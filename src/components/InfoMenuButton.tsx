import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Colors from '../Colors';

interface InfoMenuButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
  component?: React.ReactNode;
}
function InfoMenuButton({
  title,
  onPress,
  iconName,
  component,
}: InfoMenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessible
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {component || (
        <>
          {iconName && (
            <Ionicons name={iconName} color={Colors.dwgDarkColor} size={20} />
          )}
          <Text style={styles.title}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 40,
    padding: 10,
    borderColor: Colors.dwgDarkColor,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'flex-start',
  },
  title: {
    color: Colors.dwgDarkColor,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.5,
  },
});
export default InfoMenuButton;
