import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TOPICS } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { StatPill } from '../components/StatPill';
import { LessonNode } from '../components/LessonNode';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const lessonProgress = useProgressStore((s) => s.lessonProgress);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.appName}>Physingo</Text>
        <View style={styles.statsRow}>
          <StatPill icon="🔥" value={streak} />
          <StatPill icon="⚡" value={xp} />
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <StatPill icon="👤" value="Profile" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {TOPICS.map((topic) => (
          <View key={topic.id} style={styles.topicSection}>
            <View style={[styles.topicHeader, { backgroundColor: topic.color }]}>
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </View>
            <View style={styles.path}>
              {topic.lessons.map((lesson, index) => {
                const locked = !isLessonUnlocked(topic.id, lesson.id);
                const stars = lessonProgress[lesson.id]?.stars ?? 0;
                return (
                  <LessonNode
                    key={lesson.id}
                    title={lesson.title}
                    index={index}
                    stars={stars}
                    locked={locked}
                    topicColor={topic.color}
                    onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
                  />
                );
              })}
            </View>
          </View>
        ))}
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
  scrollContent: { paddingBottom: 40 },
  topicSection: { marginBottom: 24 },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  topicIcon: { fontSize: 30 },
  topicTitle: { fontSize: 18, fontWeight: '800', color: colors.white },
  topicDescription: { fontSize: 12, color: colors.white, opacity: 0.9, marginTop: 2 },
  path: { paddingTop: 16, paddingHorizontal: 16 },
});
