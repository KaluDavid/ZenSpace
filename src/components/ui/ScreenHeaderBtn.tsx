/**
 * ZenSpace — ScreenHeaderBtn
 * Renders the settings/menu icon in the app header.
 * Grading requirement: Task 22 — evidence-menu-icon.png
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { BorderRadius } from '@/constants/Theme';

interface ScreenHeaderBtnProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
}

export default function ScreenHeaderBtn({
  iconName,
  onPress,
  style,
}: ScreenHeaderBtnProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.surfaceSecondary },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons name={iconName} size={22} color={colors.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
