import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { TopicStackParamList } from '../navigation/TopicStack';
import { getTopic, getTopicLessons } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { LessonPath } from '../components/LessonPath';
import { UnitBanner } from '../components/UnitBanner';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

const PATH_HORIZONTAL_PADDING = 16;

type Props = CompositeScreenProps<
  NativeStackScreenProps<TopicStackParamList, 'Topic'>,
  NativeStackScreenProps<RootStackParamList>
>;

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

  const allLessons = getTopicLessons(topic);
  const completed = allLessons.filter((l) => Boolean(lessonProgress[l.id])).length;
  const showUnitHeaders = topic.units.length > 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, styles.shadow, { backgroundColor: topic.color }]}>
        <Pressable
          onPress={() => navigation.navigate('MainTabs', { screen: 'Learn', params: { screen: 'Home' } })}
          hitSlop={12}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={[styles.icon, { fontSize: rs(36, scale) }]}>{topic.icon}</Text>
        <Text style={[styles.title, { fontSize: rs(22, scale) }]}>{topic.title}</Text>
        <Text style={[styles.description, { fontSize: rs(13, scale) }]}>{topic.description}</Text>
        <Text style={[styles.progressLabel, { fontSize: rs(12, scale) }]}>
          {completed}/{allLessons.length} lessons complete
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.path}>
        {topic.units.map((unit, unitIndex) => (
          <View key={unit.id} style={styles.unitGroup}>
            {showUnitHeaders && (
              <View style={styles.bannerBleed}>
                <UnitBanner unit={unit} index={unitIndex} topicIcon={topic.icon} scale={scale} />
              </View>
            )}
            <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
              <LessonPath
                nodes={unit.lessons.map((lesson) => ({
                  lesson,
                  locked: !isLessonUnlocked(topic.id, lesson.id),
                  stars: lessonProgress[lesson.id]?.stars ?? 0,
                }))}
                topicColor={topic.color}
                scale={scale}
                themeIndex={unitIndex}
                onPressLesson={(lessonId) => navigation.navigate('Lesson', { lessonId })}
              />
            </View>
          </View>
        ))}
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
  path: { paddingTop: 8, paddingHorizontal: PATH_HORIZONTAL_PADDING, paddingBottom: 40 },
  unitGroup: { marginTop: 24 },
  bannerBleed: {
    marginHorizontal: -PATH_HORIZONTAL_PADDING,
    marginBottom: 20,
  },
});
