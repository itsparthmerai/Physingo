import React, { useEffect, useRef } from 'react';
import { Pressable, Text, View, Animated, StyleSheet, Platform } from 'react-native';
import { colors, shade } from '../theme/colors';

export function LessonNode({
  title,
  index,
  stars,
  locked,
  topicColor,
  onPress,
  scale = 1,
}: {
  title: string;
  index: number;
  stars: number;
  locked: boolean;
  topicColor: string;
  onPress: () => void;
  scale?: number;
}) {
  const completed = stars > 0;
  const isNext = !locked && !completed;
  const size = Math.round(84 * scale);

  const pressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  function animatePressTo(toValue: number) {
    Animated.spring(pressAnim, { toValue, useNativeDriver: true, friction: 6, tension: 200 }).start();
  }

  useEffect(() => {
    if (!isNext) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isNext, pulseAnim]);

  const pressScale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] });
  const ringScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const ringOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  const face = locked ? colors.locked : completed ? colors.xp : topicColor;
  const edge = locked ? colors.lockedDark : completed ? colors.xpDark : shade(topicColor, -22);

  return (
    <View
      style={[
        styles.wrapper,
        { width: Math.round(100 * scale) },
        index % 2 === 1 && styles.offsetRight,
        index % 2 === 0 && index !== 0 && styles.offsetLeft,
      ]}
    >
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {isNext && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: topicColor,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
        )}
        <Pressable
          onPress={onPress}
          disabled={locked}
          onPressIn={() => !locked && animatePressTo(1)}
          onPressOut={() => !locked && animatePressTo(0)}
        >
          <Animated.View
            style={[
              styles.node,
              styles.shadow,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: face,
                borderBottomColor: edge,
                borderBottomWidth: Math.round(5 * scale),
                transform: [{ scale: pressScale }],
              },
            ]}
          >
            <Text style={{ fontSize: Math.round(22 * scale) }}>{locked ? '🔒' : completed ? '⭐' : '▶'}</Text>
            {completed && (
              <View style={styles.starsRow}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Text key={i} style={styles.smallStar}>
                    {i < stars ? '★' : '☆'}
                  </Text>
                ))}
              </View>
            )}
          </Animated.View>
        </Pressable>
      </View>
      <Text style={[styles.label, { width: Math.round(100 * scale), fontSize: Math.round(12 * scale) }]} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  offsetRight: { alignSelf: 'flex-end', marginRight: 30 },
  offsetLeft: { alignSelf: 'flex-start', marginLeft: 30 },
  ring: {
    position: 'absolute',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  starsRow: { flexDirection: 'row', marginTop: 2 },
  smallStar: { fontSize: 10, color: colors.white },
  label: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 4,
  },
});
