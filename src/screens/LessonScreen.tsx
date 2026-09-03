import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getLesson } from '../content';
import { Question } from '../content/types';
import { useProgressStore } from '../store/useProgressStore';
import { ProgressBar } from '../components/ProgressBar';
import { HeartsDisplay } from '../components/HeartsDisplay';
import { OptionButton, OptionState } from '../components/OptionButton';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const MAX_HEARTS = 5;
const XP_PER_CORRECT = 10;
const PERFECT_BONUS = 20;

function isAnswerCorrect(question: Question, answer: unknown): boolean {
  switch (question.type) {
    case 'mcq':
      return answer === question.correctIndex;
    case 'true-false':
      return answer === question.correctAnswer;
    case 'fill-blank': {
      const text = String(answer ?? '').trim().toLowerCase();
      return question.acceptedAnswers.some((a) => a.trim().toLowerCase() === text);
    }
    case 'multi-select': {
      const selected = [...((answer as number[]) ?? [])].sort();
      const correct = [...question.correctIndices].sort();
      return selected.length === correct.length && selected.every((v, i) => v === correct[i]);
    }
    default:
      return false;
  }
}

export function LessonScreen({ route, navigation }: Props) {
  const { lessonId } = route.params;
  const data = useMemo(() => getLesson(lessonId), [lessonId]);
  const completeLesson = useProgressStore((s) => s.completeLesson);

  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null);
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [multiAnswer, setMultiAnswer] = useState<number[]>([]);
  const [failed, setFailed] = useState(false);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.prompt}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const { topic, lesson } = data;
  const question = lesson.questions[index];
  const total = lesson.questions.length;

  function resetAnswerState() {
    setMcqAnswer(null);
    setTfAnswer(null);
    setFillAnswer('');
    setMultiAnswer([]);
    setSubmitted(false);
  }

  function currentAnswer(): unknown {
    switch (question.type) {
      case 'mcq':
        return mcqAnswer;
      case 'true-false':
        return tfAnswer;
      case 'fill-blank':
        return fillAnswer;
      case 'multi-select':
        return multiAnswer;
    }
  }

  function hasAnswer(): boolean {
    switch (question.type) {
      case 'mcq':
        return mcqAnswer !== null;
      case 'true-false':
        return tfAnswer !== null;
      case 'fill-blank':
        return fillAnswer.trim().length > 0;
      case 'multi-select':
        return multiAnswer.length > 0;
    }
  }

  function handleCheck() {
    const correct = isAnswerCorrect(question, currentAnswer());
    setWasCorrect(correct);
    setSubmitted(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  }

  function handleContinue() {
    if (!wasCorrect && hearts <= 0) {
      setFailed(true);
      return;
    }
    if (index + 1 >= total) {
      const accuracy = correctCount / total;
      const xpEarned = correctCount * XP_PER_CORRECT + (accuracy === 1 ? PERFECT_BONUS : 0);
      completeLesson(lessonId, xpEarned, accuracy);
      navigation.replace('LessonResult', { lessonId, correct: correctCount, total, xpEarned });
      return;
    }
    setIndex((i) => i + 1);
    resetAnswerState();
  }

  function handleRetry() {
    setIndex(0);
    setHearts(MAX_HEARTS);
    setCorrectCount(0);
    setFailed(false);
    resetAnswerState();
  }

  if (failed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.failedContainer}>
          <Text style={styles.failedEmoji}>💔</Text>
          <Text style={styles.failedTitle}>Out of hearts!</Text>
          <Text style={styles.failedSubtitle}>Review the material and try this lesson again.</Text>
          <Pressable style={[styles.primaryButton, { marginTop: 24 }]} onPress={handleRetry}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Exit Lesson</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function optionState(i: number): OptionState {
    if (!submitted) {
      if (question.type === 'mcq' && mcqAnswer === i) return 'selected';
      if (question.type === 'multi-select' && multiAnswer.includes(i)) return 'selected';
      return 'default';
    }
    if (question.type === 'mcq') {
      if (i === question.correctIndex) return 'correct';
      if (i === mcqAnswer) return 'incorrect';
      return 'default';
    }
    if (question.type === 'multi-select') {
      const isCorrectOption = question.correctIndices.includes(i);
      const wasSelected = multiAnswer.includes(i);
      if (isCorrectOption) return 'correct';
      if (wasSelected && !isCorrectOption) return 'incorrect';
      return 'default';
    }
    return 'default';
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <ProgressBar progress={(index + (submitted ? 1 : 0)) / total} />
        <HeartsDisplay hearts={hearts} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.topicTag}>{topic.icon} {lesson.title}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        {question.type === 'mcq' &&
          question.options.map((opt, i) => (
            <OptionButton
              key={i}
              label={opt}
              state={optionState(i)}
              disabled={submitted}
              onPress={() => setMcqAnswer(i)}
            />
          ))}

        {question.type === 'true-false' && (
          <View style={styles.tfRow}>
            <View style={styles.tfOption}>
              <OptionButton
                label="True"
                state={
                  !submitted
                    ? tfAnswer === true
                      ? 'selected'
                      : 'default'
                    : question.correctAnswer === true
                    ? 'correct'
                    : tfAnswer === true
                    ? 'incorrect'
                    : 'default'
                }
                disabled={submitted}
                onPress={() => setTfAnswer(true)}
              />
            </View>
            <View style={styles.tfOption}>
              <OptionButton
                label="False"
                state={
                  !submitted
                    ? tfAnswer === false
                      ? 'selected'
                      : 'default'
                    : question.correctAnswer === false
                    ? 'correct'
                    : tfAnswer === false
                    ? 'incorrect'
                    : 'default'
                }
                disabled={submitted}
                onPress={() => setTfAnswer(false)}
              />
            </View>
          </View>
        )}

        {question.type === 'fill-blank' && (
          <TextInput
            style={[
              styles.textInput,
              submitted && (wasCorrect ? styles.textInputCorrect : styles.textInputIncorrect),
            ]}
            placeholder="Type your answer"
            value={fillAnswer}
            onChangeText={setFillAnswer}
            editable={!submitted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}

        {question.type === 'multi-select' && (
          <>
            <Text style={styles.hint}>Select all that apply</Text>
            {question.options.map((opt, i) => (
              <OptionButton
                key={i}
                label={opt}
                state={optionState(i)}
                disabled={submitted}
                onPress={() =>
                  setMultiAnswer((prev) =>
                    prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i]
                  )
                }
              />
            ))}
          </>
        )}

        {submitted && (
          <View style={[styles.feedbackBanner, wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            <Text style={styles.feedbackTitle}>{wasCorrect ? 'Correct!' : 'Not quite'}</Text>
            {question.explanation ? <Text style={styles.feedbackText}>{question.explanation}</Text> : null}
            {!wasCorrect && question.type === 'fill-blank' && (
              <Text style={styles.feedbackText}>
                Accepted answer: {question.acceptedAnswers[0]}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!submitted ? (
          <Pressable
            style={[styles.primaryButton, !hasAnswer() && styles.disabledButton]}
            disabled={!hasAnswer()}
            onPress={handleCheck}
          >
            <Text style={styles.primaryButtonText}>Check</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  closeIcon: { fontSize: 20, color: colors.textMuted },
  content: { padding: 20, paddingBottom: 40 },
  topicTag: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 12 },
  prompt: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 20 },
  hint: { fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  tfRow: { flexDirection: 'row', gap: 12 },
  tfOption: { flex: 1 },
  textInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.card,
  },
  textInputCorrect: { borderColor: colors.successDark, backgroundColor: '#EAFBE0' },
  textInputIncorrect: { borderColor: colors.errorDark, backgroundColor: '#FFEAEA' },
  feedbackBanner: {
    marginTop: 20,
    borderRadius: 14,
    padding: 16,
  },
  feedbackCorrect: { backgroundColor: '#EAFBE0' },
  feedbackIncorrect: { backgroundColor: '#FFEAEA' },
  feedbackTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  feedbackText: { fontSize: 14, color: colors.text },
  footer: { padding: 16 },
  primaryButton: {
    backgroundColor: colors.success,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: colors.locked },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  secondaryButton: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  failedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  failedEmoji: { fontSize: 56, marginBottom: 12 },
  failedTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  failedSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
