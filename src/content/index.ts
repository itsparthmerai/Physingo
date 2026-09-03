import { Topic, Unit, Lesson, Question } from './types';
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

/** Flattened, in-order list of every lesson in a topic, spanning all its units. */
export function getTopicLessons(topic: Topic): Lesson[] {
  return topic.units.flatMap((u) => u.lessons);
}

export function getLesson(lessonId: string): { topic: Topic; unit: Unit; lesson: Lesson } | undefined {
  for (const topic of TOPICS) {
    for (const unit of topic.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { topic, unit, lesson };
    }
  }
  return undefined;
}

export type { Topic, Unit, Lesson, Question };
