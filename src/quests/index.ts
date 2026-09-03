import { useProgressStore } from '../store/useProgressStore';
import { TOPICS, getTopicLessons } from '../content';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

export function useDailyQuests(): Quest[] {
  const daily = useProgressStore((s) => s.daily);
  const today = todayString();
  const xpToday = daily.date === today ? daily.xp : 0;
  const lessonsToday = daily.date === today ? daily.lessons : 0;

  return [
    {
      id: 'daily-xp-10',
      title: 'Warm Up',
      description: 'Earn 10 XP today',
      icon: '⚡',
      progress: clamp(xpToday, 10),
      target: 10,
      completed: xpToday >= 10,
    },
    {
      id: 'daily-xp-30',
      title: 'Keep Going',
      description: 'Earn 30 XP today',
      icon: '🔥',
      progress: clamp(xpToday, 30),
      target: 30,
      completed: xpToday >= 30,
    },
    {
      id: 'daily-lessons-2',
      title: 'Double Session',
      description: 'Complete 2 lessons today',
      icon: '📖',
      progress: clamp(lessonsToday, 2),
      target: 2,
      completed: lessonsToday >= 2,
    },
  ];
}

export function useObjectiveQuests(): Quest[] {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const lessonsCompleted = useProgressStore((s) => s.getTotalLessonsCompleted());
  const getTopicCompletedCount = useProgressStore((s) => s.getTopicCompletedCount);

  const topicCounts = TOPICS.map((t) => ({
    completed: getTopicCompletedCount(t.id),
    total: getTopicLessons(t).length,
  }));
  // Study tracks vary in size (e.g. Anatomy has far more lessons than others), so
  // "best track" is the one closest to fully complete, not the one with the most raw completions.
  const bestTopic = topicCounts.reduce((best, t) => {
    const ratio = t.total > 0 ? t.completed / t.total : 0;
    const bestRatio = best.total > 0 ? best.completed / best.total : 0;
    return ratio > bestRatio ? t : best;
  }, topicCounts[0] ?? { completed: 0, total: 1 });
  const topicsStarted = topicCounts.filter((t) => t.completed >= 1).length;

  return [
    {
      id: 'obj-first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🐾',
      progress: clamp(lessonsCompleted, 1),
      target: 1,
      completed: lessonsCompleted >= 1,
    },
    {
      id: 'obj-streak-3',
      title: 'Getting Warmed Up',
      description: 'Reach a 3-day streak',
      icon: '🔥',
      progress: clamp(streak, 3),
      target: 3,
      completed: streak >= 3,
    },
    {
      id: 'obj-streak-7',
      title: 'Committed',
      description: 'Reach a 7-day streak',
      icon: '🔥',
      progress: clamp(streak, 7),
      target: 7,
      completed: streak >= 7,
    },
    {
      id: 'obj-xp-100',
      title: 'Rising Star',
      description: 'Earn 100 total XP',
      icon: '⭐',
      progress: clamp(xp, 100),
      target: 100,
      completed: xp >= 100,
    },
    {
      id: 'obj-xp-500',
      title: 'Scholar',
      description: 'Earn 500 total XP',
      icon: '🏆',
      progress: clamp(xp, 500),
      target: 500,
      completed: xp >= 500,
    },
    {
      id: 'obj-topic-master',
      title: 'Topic Master',
      description: 'Fully complete every lesson in one study track',
      icon: '🎓',
      progress: bestTopic.completed,
      target: bestTopic.total,
      completed: bestTopic.total > 0 && bestTopic.completed >= bestTopic.total,
    },
    {
      id: 'obj-well-rounded',
      title: 'Well-Rounded',
      description: 'Complete at least one lesson in every study track',
      icon: '🧭',
      progress: clamp(topicsStarted, TOPICS.length),
      target: TOPICS.length,
      completed: topicsStarted >= TOPICS.length,
    },
  ];
}
