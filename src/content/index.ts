import { Topic, Lesson, Question } from './types';
import { anatomy } from './anatomy';
import { goniometry } from './goniometry';
import { specialTests } from './specialTests';
import { differentialDiagnosis } from './differentialDiagnosis';
import { documentation } from './documentation';
import { hep } from './hep';

export const TOPICS: Topic[] = [anatomy, goniometry, specialTests, differentialDiagnosis, documentation, hep];

export function getTopic(topicId: string): Topic | undefined {
  return TOPICS.find((t) => t.id === topicId);
}

export function getLesson(lessonId: string): { topic: Topic; lesson: Lesson } | undefined {
  for (const topic of TOPICS) {
    const lesson = topic.lessons.find((l) => l.id === lessonId);
    if (lesson) return { topic, lesson };
  }
  return undefined;
}

export type { Topic, Lesson, Question };
