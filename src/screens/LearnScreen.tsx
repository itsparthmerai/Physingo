import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList } from '../navigation/MainTabs';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TOPICS } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { StatPill } from '../components/StatPill';
import { TopicCard } from '../components/TopicCard';
import { colors } from '../theme/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Learn'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function LearnScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.appName}>Physingo</Text>
        <View style={styles.statsRow}>
          <StatPill icon="🔥" value={streak} />
          <StatPill icon="⚡" value={xp} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Study tracks</Text>
        <View style={styles.grid}>
          {TOPICS.map((topic) => (
            <View key={topic.id} style={styles.cardSlot}>
              <TopicCard
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                color={topic.color}
                completed={getTopicCompletedCount(topic.id)}
                total={topic.lessons.length}
                onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
              />
            </View>
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
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13,
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
  cardSlot: { width: '47%' },
});
