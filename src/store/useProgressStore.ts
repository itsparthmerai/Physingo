import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOPICS, getTopicLessons } from '../content';

export interface LessonProgress {
  bestAccuracy: number;
  stars: number;
  timesCompleted: number;
}

export interface DailyActivity {
  date: string;
  xp: number;
  lessons: number;
}

interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  lessonProgress: Record<string, LessonProgress>;
  daily: DailyActivity;
  soundEnabled: boolean;
  completeLesson: (lessonId: string, xpEarned: number, accuracy: number) => void;
  isLessonUnlocked: (topicId: string, lessonId: string) => boolean;
  getTopicCompletedCount: (topicId: string) => number;
  getTotalLessonsCompleted: () => number;
  setSoundEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const dateA = new Date(a + 'T00:00:00Z').getTime();
  const dateB = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((dateB - dateA) / msPerDay);
}

function accuracyToStars(accuracy: number): number {
  if (accuracy >= 0.95) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

const initialDaily: DailyActivity = { date: '', xp: 0, lessons: 0 };

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      lessonProgress: {},
      daily: initialDaily,
      soundEnabled: true,

      completeLesson: (lessonId, xpEarned, accuracy) => {
        const today = todayString();
        const { lastActiveDate, streak, lessonProgress, xp, daily } = get();

        let newStreak = streak;
        if (lastActiveDate === null) {
          newStreak = 1;
        } else if (lastActiveDate !== today) {
          const diff = daysBetween(lastActiveDate, today);
          newStreak = diff === 1 ? streak + 1 : 1;
        }

        const existing = lessonProgress[lessonId];
        const stars = accuracyToStars(accuracy);
        const updated: LessonProgress = {
          bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, accuracy),
          stars: Math.max(existing?.stars ?? 0, stars),
          timesCompleted: (existing?.timesCompleted ?? 0) + 1,
        };

        const newDaily: DailyActivity =
          daily.date === today
            ? { date: today, xp: daily.xp + xpEarned, lessons: daily.lessons + 1 }
            : { date: today, xp: xpEarned, lessons: 1 };

        set({
          xp: xp + xpEarned,
          streak: newStreak,
          lastActiveDate: today,
          lessonProgress: { ...lessonProgress, [lessonId]: updated },
          daily: newDaily,
        });
      },

      isLessonUnlocked: (topicId, lessonId) => {
        const topic = TOPICS.find((t) => t.id === topicId);
        if (!topic) return false;
        const flat = getTopicLessons(topic);
        const index = flat.findIndex((l) => l.id === lessonId);
        if (index <= 0) return true;
        const prevLessonId = flat[index - 1].id;
        return Boolean(get().lessonProgress[prevLessonId]);
      },

      getTopicCompletedCount: (topicId) => {
        const topic = TOPICS.find((t) => t.id === topicId);
        if (!topic) return 0;
        const progress = get().lessonProgress;
        return getTopicLessons(topic).filter((l) => Boolean(progress[l.id])).length;
      },

      getTotalLessonsCompleted: () => {
        return Object.keys(get().lessonProgress).length;
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      resetProgress: () =>
        set({
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          lessonProgress: {},
          daily: initialDaily,
        }),
    }),
    {
      name: 'physingo-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

function currentDaily(state: Pick<ProgressState, 'daily'>): DailyActivity {
  return state.daily.date === todayString() ? state.daily : initialDaily;
}

export function useTodayActivity(): DailyActivity {
  return useProgressStore((s) => currentDaily(s));
}
