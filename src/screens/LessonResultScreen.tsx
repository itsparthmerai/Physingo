import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getLesson } from '../content';
import { PrimaryButton } from '../components/Buttons';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonResult'>;

export function LessonResultScreen({ route, navigation }: Props) {
  const { lessonId, correct, total, xpEarned } = route.params;
  const accuracy = Math.round((correct / total) * 100);
  const perfect = correct === total;
  const topicId = getLesson(lessonId)?.topic.id;
  const { scale, contentMaxWidth } = useResponsive();

  const emojiAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(emojiAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }),
      Animated.timing(contentAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [emojiAnim, contentAnim]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={{ width: '100%', maxWidth: contentMaxWidth, alignItems: 'center' }}>
          <Animated.Text
            style={[
              styles.emoji,
              {
                fontSize: rs(64, scale),
                transform: [{ scale: emojiAnim }],
              },
            ]}
          >
            {perfect ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
          </Animated.Text>

          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
              opacity: contentAnim,
              transform: [
                { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
              ],
            }}
          >
            <Text style={[styles.title, { fontSize: rs(24, scale) }]}>
              {perfect ? 'Perfect Lesson!' : 'Lesson Complete!'}
            </Text>

            <View style={[styles.statsCard, styles.shadow]}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Accuracy</Text>
                <Text style={styles.statValue}>{accuracy}%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Correct answers</Text>
                <Text style={styles.statValue}>{correct} / {total}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>XP earned</Text>
                <Text style={[styles.statValue, { color: colors.xpDark }]}>+{xpEarned} XP</Text>
              </View>
            </View>

            <PrimaryButton
              label="Continue"
              variant="success"
              scale={scale}
              onPress={() =>
                topicId
                  ? navigation.navigate('MainTabs', { screen: 'Learn', params: { screen: 'Topic', params: { topicId } } })
                  : navigation.navigate('MainTabs', { screen: 'Learn', params: { screen: 'Home' } })
              }
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { marginBottom: 12 },
  title: { fontWeight: '800', color: colors.text, marginBottom: 24 },
  statsCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
    marginBottom: 32,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 15, color: colors.textMuted },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
});
