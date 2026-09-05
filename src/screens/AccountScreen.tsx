import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TopicStackParamList } from '../navigation/TopicStack';
import { TOPICS, getTopicLessons } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

type Props = NativeStackScreenProps<TopicStackParamList, 'Home'>;

export function AccountScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);
  const setSoundEnabled = useProgressStore((s) => s.setSoundEnabled);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);
  const { scale, contentMaxWidth } = useResponsive();

  function confirmReset() {
    Alert.alert(
      'Reset all progress?',
      'This clears your XP, streak, and lesson history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetProgress },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: rs(26, scale) }]}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.shadow, { backgroundColor: colors.streakTint, borderColor: colors.streak }]}>
              <Text style={[styles.summaryEmoji, { fontSize: rs(26, scale) }]}>🔥</Text>
              <Text style={[styles.summaryValue, { fontSize: rs(22, scale), color: colors.streak }]}>{streak}</Text>
              <Text style={[styles.summaryLabel, { fontSize: rs(12, scale) }]}>Day streak</Text>
            </View>
            <View style={[styles.summaryCard, styles.shadow, { backgroundColor: colors.xpTint, borderColor: colors.xpDark }]}>
              <Text style={[styles.summaryEmoji, { fontSize: rs(26, scale) }]}>⚡</Text>
              <Text style={[styles.summaryValue, { fontSize: rs(22, scale), color: colors.xpDark }]}>{xp}</Text>
              <Text style={[styles.summaryLabel, { fontSize: rs(12, scale) }]}>Total XP</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { fontSize: rs(16, scale) }]}>Your tracks</Text>
          {TOPICS.map((topic) => {
            const completed = getTopicCompletedCount(topic.id);
            const totalLessons = getTopicLessons(topic).length;
            const pct = totalLessons > 0 ? completed / totalLessons : 0;
            return (
              <Pressable
                key={topic.id}
                style={({ pressed }) => [styles.topicRow, styles.shadow, pressed && styles.pressed]}
                onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
              >
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
              </Pressable>
            );
          })}

          <Text style={[styles.sectionTitle, { fontSize: rs(16, scale) }]}>Settings</Text>
          <View style={[styles.settingsCard, styles.shadow]}>
            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Sound effects</Text>
                <Text style={styles.settingHint}>Correct, incorrect, and lesson-complete sounds</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'android' ? colors.white : undefined}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
            onPress={confirmReset}
          >
            <Text style={styles.dangerButtonText}>Reset all progress</Text>
          </Pressable>

          <Text style={styles.about}>Physingo v1.0.0</Text>
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
  title: { fontWeight: '800', color: colors.text },
  content: { padding: 16, paddingBottom: 40 },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  pressed: { opacity: 0.8 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  summaryEmoji: { marginBottom: 6 },
  summaryValue: { fontWeight: '800' },
  summaryLabel: { color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontWeight: '800', color: colors.text, marginBottom: 12, marginTop: 4 },
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
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  settingHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  dangerButton: {
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.errorTint,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  dangerButtonPressed: { opacity: 0.7 },
  dangerButtonText: { color: colors.errorDark, fontWeight: '700', fontSize: 14 },
  about: { textAlign: 'center', color: colors.textMuted, fontSize: 12 },
});
