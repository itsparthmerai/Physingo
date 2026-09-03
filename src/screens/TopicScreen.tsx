import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getTopic } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { LessonNode } from '../components/LessonNode';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Topic'>;

export function TopicScreen({ route, navigation }: Props) {
  const { topicId } = route.params;
  const topic = getTopic(topicId);
  const lessonProgress = useProgressStore((s) => s.lessonProgress);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);

  if (!topic) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Topic not found.</Text>
      </SafeAreaView>
    );
  }

  const completed = topic.lessons.filter((l) => Boolean(lessonProgress[l.id])).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { backgroundColor: topic.color }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.icon}>{topic.icon}</Text>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.description}>{topic.description}</Text>
        <Text style={styles.progressLabel}>
          {completed}/{topic.lessons.length} lessons complete
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.path}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  notFound: { padding: 20, fontSize: 16, color: colors.text },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: { marginBottom: 8 },
  backIcon: { fontSize: 20, color: colors.white },
  icon: { fontSize: 36, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '800', color: colors.white },
  description: { fontSize: 13, color: colors.white, opacity: 0.9, marginTop: 4 },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    opacity: 0.85,
    marginTop: 12,
  },
  path: { paddingTop: 24, paddingHorizontal: 16, paddingBottom: 40 },
});
