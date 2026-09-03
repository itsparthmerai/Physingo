import React, { useRef } from 'react';
import { Pressable, Text, View, Animated, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export function TopicCard({
  title,
  description,
  icon,
  color,
  completed,
  total,
  onPress,
  scale = 1,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
  onPress: () => void;
  scale?: number;
}) {
  const pct = total > 0 ? completed / total : 0;
  const done = completed === total && total > 0;
  const pressAnim = useRef(new Animated.Value(0)).current;

  function animateTo(toValue: number) {
    Animated.timing(pressAnim, { toValue, duration: 100, useNativeDriver: true }).start();
  }

  const scaleAnim = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });

  return (
    <Pressable onPress={onPress} onPressIn={() => animateTo(1)} onPressOut={() => animateTo(0)}>
      <Animated.View
        style={[
          styles.card,
          styles.shadow,
          {
            borderRadius: Math.round(18 * scale),
            borderBottomColor: color,
            padding: Math.round(14 * scale),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: color,
              width: Math.round(48 * scale),
              height: Math.round(48 * scale),
              borderRadius: Math.round(14 * scale),
            },
          ]}
        >
          <Text style={{ fontSize: Math.round(24 * scale) }}>{icon}</Text>
        </View>
        <Text style={[styles.title, { fontSize: Math.round(15 * scale) }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.description, { fontSize: Math.round(12 * scale), lineHeight: Math.round(16 * scale) }]} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
          </View>
          <Text style={[styles.count, { fontSize: Math.round(11 * scale) }]}>
            {done ? '✓ Complete' : `${completed}/${total}`}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 4,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontWeight: '800', color: colors.text, marginBottom: 2 },
  description: { color: colors.textMuted, minHeight: 32 },
  footer: { marginTop: 12, gap: 6 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  count: { fontWeight: '700', color: colors.textMuted },
});
