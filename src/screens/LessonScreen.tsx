import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getLesson } from '../content';
import { Question } from '../content/types';
import { useProgressStore } from '../store/useProgressStore';
import { ProgressBar } from '../components/ProgressBar';
import { HeartsDisplay } from '../components/HeartsDisplay';
import { OptionButton, OptionState } from '../components/OptionButton';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { sounds } from '../audio/sounds';
import { colors } from '../theme/colors';
import { useResponsive, rs } from '../theme/responsive';

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
  const { scale, contentMaxWidth } = useResponsive();

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

  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (submitted) {
      feedbackAnim.setValue(0);
      Animated.spring(feedbackAnim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }).start();
    }
  }, [submitted, feedbackAnim]);

  useEffect(() => {
    questionAnim.setValue(0);
    Animated.timing(questionAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [index, questionAnim]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.prompt}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const { topic, lesson } = data;

  if (lesson.questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.failedContainer}>
          <Text style={styles.failedEmoji}>🚧</Text>
          <Text style={styles.failedTitle}>Coming soon</Text>
          <Text style={styles.failedSubtitle}>
            {lesson.title} hasn't been added yet. Check back soon!
          </Text>
          <View style={{ marginTop: 20 }}>
            <GhostButton label="Go Back" onPress={() => navigation.goBack()} scale={scale} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
      sounds.playCorrect();
    } else {
      setHearts((h) => Math.max(0, h - 1));
      sounds.playIncorrect();
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
      sounds.playComplete();
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
          <View style={{ width: '100%', maxWidth: 420, marginTop: 24 }}>
            <PrimaryButton label="Try Again" onPress={handleRetry} variant="success" scale={scale} />
            <View style={{ alignItems: 'center', marginTop: 4 }}>
              <GhostButton label="Exit Lesson" onPress={() => navigation.goBack()} scale={scale} />
            </View>
          </View>
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

  const feedbackTranslateY = feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <ProgressBar progress={(index + (submitted ? 1 : 0)) / total} color={topic.color} />
        <HeartsDisplay hearts={hearts} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.content,
            {
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              width: '100%',
              opacity: questionAnim,
              transform: [
                {
                  translateY: questionAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.topicTag, { color: topic.color, fontSize: rs(13, scale) }]}>
            {topic.icon} {lesson.title}
          </Text>
          <Text style={[styles.prompt, { fontSize: rs(20, scale) }]}>{question.prompt}</Text>

          {question.type === 'mcq' &&
            question.options.map((opt, i) => (
              <OptionButton
                key={i}
                label={opt}
                state={optionState(i)}
                disabled={submitted}
                scale={scale}
                onPress={() => setMcqAnswer(i)}
              />
            ))}

          {question.type === 'true-false' && (
            <View style={styles.tfRow}>
              <View style={styles.tfOption}>
                <OptionButton
                  label="True"
                  scale={scale}
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
                  scale={scale}
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
                { fontSize: rs(16, scale), paddingVertical: rs(14, scale) },
                submitted && (wasCorrect ? styles.textInputCorrect : styles.textInputIncorrect),
              ]}
              placeholder="Type your answer"
              placeholderTextColor={colors.textMuted}
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
                  scale={scale}
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
            <Animated.View
              style={[
                styles.feedbackBanner,
                wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
                { opacity: feedbackAnim, transform: [{ translateY: feedbackTranslateY }] },
              ]}
            >
              <Text style={styles.feedbackTitle}>{wasCorrect ? 'Correct!' : 'Not quite'}</Text>
              {question.explanation ? <Text style={styles.feedbackText}>{question.explanation}</Text> : null}
              {!wasCorrect && question.type === 'fill-blank' && (
                <Text style={styles.feedbackText}>
                  Accepted answer: {question.acceptedAnswers[0]}
                </Text>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }}>
          {!submitted ? (
            <PrimaryButton
              label="Check"
              onPress={handleCheck}
              disabled={!hasAnswer()}
              variant="success"
              scale={scale}
            />
          ) : (
            <PrimaryButton
              label="Continue"
              onPress={handleContinue}
              variant={wasCorrect ? 'success' : 'primary'}
              scale={scale}
            />
          )}
        </View>
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  content: {},
  topicTag: { fontWeight: '800', marginBottom: 12 },
  prompt: { fontWeight: '700', color: colors.text, marginBottom: 20 },
  hint: { fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  tfRow: { flexDirection: 'row', gap: 12 },
  tfOption: { flex: 1 },
  textInput: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderBottomColor: colors.cardBorderBottom,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    color: colors.text,
  },
  textInputCorrect: { borderColor: colors.successDark, borderBottomColor: colors.successPressed, backgroundColor: colors.successTint },
  textInputIncorrect: { borderColor: colors.errorDark, borderBottomColor: colors.errorPressed, backgroundColor: colors.errorTint },
  feedbackBanner: {
    marginTop: 20,
    borderRadius: 14,
    padding: 16,
  },
  feedbackCorrect: { backgroundColor: colors.successTint },
  feedbackIncorrect: { backgroundColor: colors.errorTint },
  feedbackTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  feedbackText: { fontSize: 14, color: colors.text },
  footer: { padding: 16 },
  failedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  failedEmoji: { fontSize: 56, marginBottom: 12 },
  failedTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  failedSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
