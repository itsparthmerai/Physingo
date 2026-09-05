import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TopicStackParamList } from '../navigation/TopicStack';
import { TOPICS, getTopicLessons } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { StatPill } from '../components/StatPill';
import { TopicCard } from '../components/TopicCard';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

type Props = NativeStackScreenProps<TopicStackParamList, 'Home'>;

const SLOT_WIDTH: Record<number, `${number}%`> = { 2: '47%', 3: '31%' };

export function LearnScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);
  const { scale, columns, contentMaxWidth } = useResponsive();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={[styles.appName, { fontSize: rs(26, scale) }]}>Physingo</Text>
        <View style={styles.statsRow}>
          <StatPill icon="🔥" value={streak} tint={colors.streakTint} textColor={colors.streak} scale={scale} />
          <StatPill icon="⚡" value={xp} tint={colors.xpTint} textColor={colors.xpDark} scale={scale} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: rs(16, Math.min(scale, 1.2)) }]}>
        <View style={{ maxWidth: contentMaxWidth * (columns / 2), alignSelf: 'center', width: '100%' }}>
          <Text style={[styles.sectionLabel, { fontSize: rs(13, scale) }]}>Study tracks</Text>
          <View style={[styles.grid, { gap: rs(12, scale) }]}>
            {TOPICS.map((topic) => (
              <View key={topic.id} style={{ width: SLOT_WIDTH[columns] ?? '47%' }}>
                <TopicCard
                  title={topic.title}
                  description={topic.description}
                  icon={topic.icon}
                  color={topic.color}
                  completed={getTopicCompletedCount(topic.id)}
                  total={getTopicLessons(topic).length}
                  scale={scale}
                  onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
                />
              </View>
            ))}
          </View>
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
  appName: {
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
