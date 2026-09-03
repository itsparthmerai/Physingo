import React, { useRef } from 'react';
import { Pressable, Text, Animated, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

const STATE_STYLE: Record<OptionState, { bg: string; border: string; edge: string; text: string }> = {
  default: { bg: colors.card, border: colors.border, edge: colors.cardBorderBottom, text: colors.text },
  selected: { bg: colors.primaryTint, border: colors.primary, edge: colors.primaryDark, text: colors.text },
  correct: { bg: colors.success, border: colors.successDark, edge: colors.successPressed, text: colors.white },
  incorrect: { bg: colors.error, border: colors.errorDark, edge: colors.errorPressed, text: colors.white },
};

export function OptionButton({
  label,
  state,
  onPress,
  disabled,
  scale = 1,
}: {
  label: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
  scale?: number;
}) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const s = STATE_STYLE[state];

  function animateTo(toValue: number) {
    Animated.timing(pressAnim, { toValue, duration: 90, useNativeDriver: true }).start();
  }

  const scaleAnim = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => !disabled && animateTo(1)}
      onPressOut={() => !disabled && animateTo(0)}
    >
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: s.bg,
            borderColor: s.border,
            borderBottomColor: s.edge,
            borderRadius: Math.round(14 * scale),
            paddingVertical: Math.round(14 * scale),
            paddingHorizontal: Math.round(16 * scale),
            marginBottom: Math.round(10 * scale),
            transform: [{ scale: scaleAnim }],
          },
          state === 'default' && styles.shadow,
          state === 'selected' && styles.shadowSelected,
        ]}
      >
        <Text style={[styles.text, { color: s.text, fontSize: Math.round(16 * scale) }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  shadowSelected: {
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  text: {
    fontWeight: '700',
  },
});
