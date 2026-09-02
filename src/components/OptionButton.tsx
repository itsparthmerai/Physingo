import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

export function OptionButton({
  label,
  state,
  onPress,
  disabled,
}: {
  label: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        state === 'selected' && styles.selected,
        state === 'correct' && styles.correct,
        state === 'incorrect' && styles.incorrect,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          (state === 'correct' || state === 'incorrect') && styles.textOnColor,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.85,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: '#E6FFFB',
  },
  correct: {
    borderColor: colors.successDark,
    backgroundColor: colors.success,
  },
  incorrect: {
    borderColor: colors.errorDark,
    backgroundColor: colors.error,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  textOnColor: {
    color: colors.white,
  },
});
