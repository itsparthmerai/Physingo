export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'multi-select';

interface QuestionBase {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation?: string;
}

export interface McqQuestion extends QuestionBase {
  type: 'mcq';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface FillBlankQuestion extends QuestionBase {
  type: 'fill-blank';
  acceptedAnswers: string[];
}

export interface MultiSelectQuestion extends QuestionBase {
  type: 'multi-select';
  options: string[];
  correctIndices: number[];
}

export type Question = McqQuestion | TrueFalseQuestion | FillBlankQuestion | MultiSelectQuestion;

export interface Lesson {
  id: string;
  title: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type TopicId =
  | 'anatomy'
  | 'goniometry'
  | 'special-tests'
  | 'differential-diagnosis'
  | 'documentation'
  | 'hep';

export interface Topic {
  id: TopicId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  units: Unit[];
}
