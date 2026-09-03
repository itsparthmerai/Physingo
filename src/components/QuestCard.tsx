import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import type { Quest } from '../quests';

export function QuestCard({ quest, scale = 1 }: { quest: Quest; scale?: number }) {
  const pct = quest.target > 0 ? quest.progress / quest.target : 0;
  const fillAnim = useRef(new Animated.Value(pct)).current;
  const popAnim = useRef(new Animated.Value(quest.completed ? 1 : 0)).current;
  const wasCompleted = useRef(quest.completed);

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: pct, duration: 400, useNativeDriver: false }).start();
  }, [pct, fillAnim]);

  useEffect(() => {
    if (quest.completed && !wasCompleted.current) {
      popAnim.setValue(0);
      Animated.spring(popAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 160 }).start();
    }
    wasCompleted.current = quest.completed;
  }, [quest.completed, popAnim]);

  const iconScale = popAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.3, 1] });

  return (
    <View style={[styles.card, styles.shadow, quest.completed && styles.cardCompleted, { borderRadius: Math.round(16 * scale), padding: Math.round(14 * scale) }]}>
      <Animated.View
        style={[
          styles.iconWrap,
          quest.completed && styles.iconWrapCompleted,
          { width: Math.round(44 * scale), height: Math.round(44 * scale), borderRadius: Math.round(22 * scale), transform: [{ scale: iconScale }] },
        ]}
      >
        <Text style={{ fontSize: Math.round(20 * scale), color: colors.white }}>{quest.completed ? '✓' : quest.icon}</Text>
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { fontSize: Math.round(14 * scale) }]}>{quest.title}</Text>
        <Text style={[styles.description, { fontSize: Math.round(12 * scale) }]}>{quest.description}</Text>
        <View style={styles.trackRow}>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                quest.completed && styles.fillCompleted,
                { width: fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
          <Text style={styles.count}>
            {quest.progress}/{quest.target}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  cardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.successTint,
  },
  iconWrap: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCompleted: {
    backgroundColor: colors.success,
  },
  title: { fontWeight: '800', color: colors.text },
  description: { color: colors.textMuted, marginTop: 1, marginBottom: 8 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  fillCompleted: { backgroundColor: colors.success },
  count: { fontSize: 11, fontWeight: '700', color: colors.textMuted, minWidth: 40, textAlign: 'right' },
});
