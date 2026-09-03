import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import type { Quest } from '../quests';

export function QuestCard({ quest }: { quest: Quest }) {
  const pct = quest.target > 0 ? quest.progress / quest.target : 0;
  return (
    <View style={[styles.card, quest.completed && styles.cardCompleted]}>
      <View style={[styles.iconWrap, quest.completed && styles.iconWrapCompleted]}>
        <Text style={styles.icon}>{quest.completed ? '✓' : quest.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.description}>{quest.description}</Text>
        <View style={styles.trackRow}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${pct * 100}%` },
                quest.completed && styles.fillCompleted,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardCompleted: {
    borderColor: colors.success,
    backgroundColor: '#EAFBE0',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCompleted: {
    backgroundColor: colors.success,
  },
  icon: { fontSize: 20, color: colors.white },
  title: { fontSize: 14, fontWeight: '800', color: colors.text },
  description: { fontSize: 12, color: colors.textMuted, marginTop: 1, marginBottom: 8 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  fillCompleted: { backgroundColor: colors.success },
  count: { fontSize: 11, fontWeight: '700', color: colors.textMuted, minWidth: 40, textAlign: 'right' },
});
