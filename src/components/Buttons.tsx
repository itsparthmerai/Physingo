import React, { useRef } from 'react';
import { Pressable, Text, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Variant = 'primary' | 'success' | 'danger' | 'neutral';

const VARIANT_COLORS: Record<Variant, { face: string; edge: string; text: string }> = {
  primary: { face: colors.primary, edge: colors.primaryPressed, text: colors.white },
  success: { face: colors.success, edge: colors.successPressed, text: colors.white },
  danger: { face: colors.error, edge: colors.errorPressed, text: colors.white },
  neutral: { face: colors.card, edge: colors.cardBorderBottom, text: colors.text },
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'success',
  scale = 1,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  scale?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const { face, edge, text } = VARIANT_COLORS[variant];
  const edgeHeight = Math.round(4 * scale);
  const radius = Math.round(16 * scale);

  function animateTo(toValue: number) {
    Animated.timing(pressAnim, { toValue, duration: 90, useNativeDriver: true }).start();
  }

  const translateY = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, edgeHeight] });
  const scaleAnim = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.99] });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      style={[
        styles.edgeLayer,
        {
          backgroundColor: disabled ? colors.lockedDark : edge,
          borderRadius: radius,
          paddingBottom: edgeHeight,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.face,
          {
            backgroundColor: disabled ? colors.locked : face,
            borderRadius: radius,
            paddingVertical: Math.round(15 * scale),
            transform: [{ translateY }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.label, { color: disabled ? colors.textMuted : text, fontSize: Math.round(16 * scale) }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  scale = 1,
  color = colors.textMuted,
}: {
  label: string;
  onPress: () => void;
  scale?: number;
  color?: string;
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  function animateTo(toValue: number) {
    Animated.timing(opacity, { toValue, duration: 90, useNativeDriver: true }).start();
  }

  return (
    <Pressable onPress={onPress} onPressIn={() => animateTo(0.55)} onPressOut={() => animateTo(1)}>
      <Animated.Text style={[styles.ghostLabel, { color, fontSize: Math.round(15 * scale), opacity }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edgeLayer: {
    width: '100%',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '800',
  },
  ghostLabel: {
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 14,
  },
});
