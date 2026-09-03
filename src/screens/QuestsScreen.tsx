import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyQuests, useObjectiveQuests } from '../quests';
import { QuestCard } from '../components/QuestCard';
import { StatPill } from '../components/StatPill';
import { useProgressStore } from '../store/useProgressStore';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

export function QuestsScreen() {
  const streak = useProgressStore((s) => s.streak);
  const xp = useProgressStore((s) => s.xp);
  const dailyQuests = useDailyQuests();
  const objectiveQuests = useObjectiveQuests();
  const dailyDone = dailyQuests.filter((q) => q.completed).length;
  const { scale, contentMaxWidth } = useResponsive();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: rs(26, scale) }]}>Quests</Text>
        <View style={styles.statsRow}>
          <StatPill icon="🔥" value={streak} tint={colors.streakTint} textColor={colors.streak} scale={scale} />
          <StatPill icon="⚡" value={xp} tint={colors.xpTint} textColor={colors.xpDark} scale={scale} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { fontSize: rs(13, scale) }]}>Today's quests</Text>
            <Text style={[styles.sectionCount, { fontSize: rs(13, scale) }]}>
              {dailyDone}/{dailyQuests.length}
            </Text>
          </View>
          {dailyQuests.map((q) => (
            <QuestCard key={q.id} quest={q} scale={scale} />
          ))}

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={[styles.sectionLabel, { fontSize: rs(13, scale) }]}>Objectives</Text>
          </View>
          {objectiveQuests.map((q) => (
            <QuestCard key={q.id} quest={q} scale={scale} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontWeight: '800', color: colors.text, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 8 },
  content: { padding: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionLabel: {
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: { fontWeight: '700', color: colors.textMuted },
});
