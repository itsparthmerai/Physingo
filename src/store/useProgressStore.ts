import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOPICS, getTopicLessons } from '../content';

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 20 * 60 * 1000; // each heart takes 20 minutes to regenerate

/**
 * Pure, timestamp-based heart regeneration. Given the last-known hearts count and the
 * timestamp the current regen countdown started at (null when hearts are already full),
 * returns the up-to-date hearts count and regen anchor as of `now`. Leftover progress
 * toward the next heart (if more than one regen interval has elapsed) is preserved by
 * advancing the anchor by exact multiples of HEART_REGEN_MS rather than resetting it.
 */
export function computeHeartsSync(
  hearts: number,
  regenStartedAt: number | null,
  now: number
): { hearts: number; regenStartedAt: number | null } {
  if (hearts >= MAX_HEARTS || regenStartedAt === null) {
    return { hearts, regenStartedAt: null };
  }
  const elapsed = now - regenStartedAt;
  if (elapsed < HEART_REGEN_MS) {
    return { hearts, regenStartedAt };
  }
  const regenerated = Math.floor(elapsed / HEART_REGEN_MS);
  const newHearts = Math.min(MAX_HEARTS, hearts + regenerated);
  const newRegenStartedAt = newHearts >= MAX_HEARTS ? null : regenStartedAt + regenerated * HEART_REGEN_MS;
  return { hearts: newHearts, regenStartedAt: newRegenStartedAt };
}

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

/** The subset of progress that gets synced to the cloud (device-local prefs like soundEnabled are excluded). */
export interface SyncableProgress {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  lessonProgress: Record<string, LessonProgress>;
  daily: DailyActivity;
  hearts: number;
  heartRegenStartedAt: number | null;
}

interface ProgressState extends SyncableProgress {
  soundEnabled: boolean;
  completeLesson: (lessonId: string, xpEarned: number, accuracy: number) => void;
  isLessonUnlocked: (topicId: string, lessonId: string) => boolean;
  getTopicCompletedCount: (topicId: string) => number;
  getTotalLessonsCompleted: () => number;
  setSoundEnabled: (enabled: boolean) => void;
  loseHeart: () => void;
  refreshHearts: () => void;
  hydrateFromRemote: (data: SyncableProgress) => void;
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
      hearts: MAX_HEARTS,
      heartRegenStartedAt: null,

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

      loseHeart: () => {
        const { hearts, heartRegenStartedAt } = get();
        const synced = computeHeartsSync(hearts, heartRegenStartedAt, Date.now());
        const nextHearts = Math.max(0, synced.hearts - 1);
        const nextRegenStartedAt = synced.regenStartedAt ?? Date.now();
        set({ hearts: nextHearts, heartRegenStartedAt: nextHearts >= MAX_HEARTS ? null : nextRegenStartedAt });
      },

      refreshHearts: () => {
        const { hearts, heartRegenStartedAt } = get();
        const synced = computeHeartsSync(hearts, heartRegenStartedAt, Date.now());
        if (synced.hearts !== hearts || synced.regenStartedAt !== heartRegenStartedAt) {
          set({ hearts: synced.hearts, heartRegenStartedAt: synced.regenStartedAt });
        }
      },

      hydrateFromRemote: (data) => set(data),

      resetProgress: () =>
        set({
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          lessonProgress: {},
          daily: initialDaily,
          hearts: MAX_HEARTS,
          heartRegenStartedAt: null,
        }),
    }),
    {
      name: 'physingo-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getSyncableProgress(state: ProgressState = useProgressStore.getState()): SyncableProgress {
  const { xp, streak, lastActiveDate, lessonProgress, daily, hearts, heartRegenStartedAt } = state;
  return { xp, streak, lastActiveDate, lessonProgress, daily, hearts, heartRegenStartedAt };
}

function currentDaily(state: Pick<ProgressState, 'daily'>): DailyActivity {
  return state.daily.date === todayString() ? state.daily : initialDaily;
}

export function useTodayActivity(): DailyActivity {
  return useProgressStore((s) => currentDaily(s));
}

/** Live, ticking hearts value that accounts for regeneration without waiting for a store write. */
export function useHearts(): { hearts: number; maxHearts: number; msUntilNextHeart: number | null } {
  const hearts = useProgressStore((s) => s.hearts);
  const heartRegenStartedAt = useProgressStore((s) => s.heartRegenStartedAt);
  const refreshHearts = useProgressStore((s) => s.refreshHearts);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    refreshHearts();
    const id = setInterval(() => {
      setNow(Date.now());
      refreshHearts();
    }, 1000);
    return () => clearInterval(id);
  }, [refreshHearts]);

  const synced = computeHeartsSync(hearts, heartRegenStartedAt, now);
  const msUntilNextHeart =
    synced.regenStartedAt === null ? null : Math.max(0, HEART_REGEN_MS - (now - synced.regenStartedAt));

  return { hearts: synced.hearts, maxHearts: MAX_HEARTS, msUntilNextHeart };
}

/** Formats a millisecond duration as "m:ss" for a heart-regen countdown. */
export function formatHeartCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
