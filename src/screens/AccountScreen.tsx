import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList } from '../navigation/MainTabs';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { TOPICS } from '../content';
import { useProgressStore } from '../store/useProgressStore';
import { colors } from '../theme/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Account'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function AccountScreen({ navigation }: Props) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);
  const setSoundEnabled = useProgressStore((s) => s.setSoundEnabled);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);

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
        <Text style={styles.title}>Account</Text>
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

        <Text style={styles.sectionTitle}>Your tracks</Text>
        {TOPICS.map((topic) => {
          const completed = getTopicCompletedCount(topic.id);
          const totalLessons = topic.lessons.length;
          const pct = totalLessons > 0 ? completed / totalLessons : 0;
          return (
            <Pressable
              key={topic.id}
              style={styles.topicRow}
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

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
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

        <Pressable style={styles.dangerButton} onPress={confirmReset}>
          <Text style={styles.dangerButtonText}>Reset all progress</Text>
        </Pressable>

        <Text style={styles.about}>Physingo v1.0.0</Text>
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
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12, marginTop: 4 },
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
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  dangerButtonText: { color: colors.error, fontWeight: '700', fontSize: 14 },
  about: { textAlign: 'center', color: colors.textMuted, fontSize: 12 },
});
