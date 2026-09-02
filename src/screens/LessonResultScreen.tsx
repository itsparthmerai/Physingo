import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonResult'>;

export function LessonResultScreen({ route, navigation }: Props) {
  const { correct, total, xpEarned } = route.params;
  const accuracy = Math.round((correct / total) * 100);
  const perfect = correct === total;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.emoji}>{perfect ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}</Text>
        <Text style={styles.title}>{perfect ? 'Perfect Lesson!' : 'Lesson Complete!'}</Text>

        <View style={styles.statsCard}>
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
            <Text style={[styles.statValue, { color: colors.xp }]}>+{xpEarned} XP</Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 24 },
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
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 15, color: colors.textMuted },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.success,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
});
