import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TOPICS } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>🔥</Text>
            <Text style={styles.summaryValue}>{streak}</Text>
            <Text style={styles.summaryLabel}>Day streak</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>⚡</Text>
            <Text style={styles.summaryValue}>{xp}</Text>
            <Text style={styles.summaryLabel}>Total XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Topics</Text>
        {TOPICS.map((topic) => {
          const completed = getTopicCompletedCount(topic.id);
          const totalLessons = topic.lessons.length;
          const pct = totalLessons > 0 ? completed / totalLessons : 0;
          return (
            <View key={topic.id} style={styles.topicRow}>
              <View style={[styles.topicIconWrap, { backgroundColor: topic.color }]}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <View style={styles.topicTrack}>
                  <View style={[styles.topicFill, { width: `${pct * 100}%`, backgroundColor: topic.color }]} />
                </View>
              </View>
              <Text style={styles.topicCount}>{completed}/{totalLessons}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backIcon: { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  content: { padding: 16, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  summaryEmoji: { fontSize: 26, marginBottom: 6 },
  summaryValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  topicIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIcon: { fontSize: 20 },
  topicTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 },
  topicTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  topicFill: { height: '100%', borderRadius: 4 },
  topicCount: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});
