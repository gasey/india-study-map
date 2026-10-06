export interface SourceRef {
  sourceId: string;
  from: number;
  to: number;
}
export interface Slide {
  number: number;
  paragraphs: string[];
  imageCount: number;
  images: string[];
}
export interface SourceDocument {
  id: string;
  filename: string;
  sha256: string;
  slideCount: number;
  slides: Slide[];
}
export interface Era {
  id: string;
  title: string;
  period: string;
  color: string;
  question: string;
}
export interface Topic {
  id: string;
  eraId: string;
  title: string;
  period: string;
  summary: string;
  checkpoints: string[];
  sources: SourceRef[];
  related: string[];
  status: "starter" | "gap";
}
export interface Review {
  id: string;
  topicId: string;
  sourceId: string;
  slide: number;
  status: "corrected" | "open";
  note: string;
  evidence: {
    title: string;
    url: string;
  }[];
}
export interface MainsQuestion {
  id: string;
  year: number;
  topicId: string;
  prompt: string;
  sources: SourceRef[];
  provenance: string;
  officialPaperVerified: boolean;
}
export interface Curriculum {
  schemaVersion: number;
  version: string;
  title: string;
  description: string;
  syllabusStatus: string;
  eras: Era[];
  topics: Topic[];
  reviews: Review[];
  mainsQuestions: MainsQuestion[];
}
export interface Question {
  id: string;
  revision: number;
  topicId: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  sources: SourceRef[];
  difficulty: "foundation" | "application";
  provenance: string;
  reviewStatus: string;
  evidence?: {
    title: string;
    url: string;
  }[];
}
export interface HistoryData {
  curriculum: Curriculum;
  questions: Question[];
  documents: SourceDocument[];
}
export interface QuestionProgress {
  attempts: number;
  correct: number;
  streak: number;
  lastCorrect: boolean;
  lastAt: number;
  dueAt: number;
}
export interface Progress {
  schemaVersion: 1;
  studied: Record<string, number>;
  notes: Record<string, string>;
  drafts: Record<string, string>;
  questions: Record<string, QuestionProgress>;
  flags: Record<string, string>;
  lastTopic: string | null;
}
export type PracticeMode = "mixed" | "new" | "incorrect" | "due";
