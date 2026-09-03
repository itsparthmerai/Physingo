import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getTopic } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { LessonNode } from '../components/LessonNode';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Topic'>;

export function TopicScreen({ route, navigation }: Props) {
  const { topicId } = route.params;
  const topic = getTopic(topicId);
  const lessonProgress = useProgressStore((s) => s.lessonProgress);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);
  const { scale, contentMaxWidth } = useResponsive();

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
      <View style={[styles.header, styles.shadow, { backgroundColor: topic.color }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={[styles.icon, { fontSize: rs(36, scale) }]}>{topic.icon}</Text>
        <Text style={[styles.title, { fontSize: rs(22, scale) }]}>{topic.title}</Text>
        <Text style={[styles.description, { fontSize: rs(13, scale) }]}>{topic.description}</Text>
        <Text style={[styles.progressLabel, { fontSize: rs(12, scale) }]}>
          {completed}/{topic.lessons.length} lessons complete
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.path}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
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
                scale={scale}
                onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
              />
            );
          })}
        </View>
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
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  backButton: { marginBottom: 8 },
  backIcon: { fontSize: 20, color: colors.white },
  icon: { marginBottom: 6 },
  title: { fontWeight: '800', color: colors.white },
  description: { color: colors.white, opacity: 0.9, marginTop: 4 },
  progressLabel: {
    fontWeight: '700',
    color: colors.white,
    opacity: 0.85,
    marginTop: 12,
  },
  path: { paddingTop: 24, paddingHorizontal: 16, paddingBottom: 40 },
});
