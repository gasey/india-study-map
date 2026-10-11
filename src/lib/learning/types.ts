/** Generic, module-scoped learning data. No bank content or answer keys are stored. */
export type Confidence = 'sure' | 'unsure' | 'guess';
export type AttemptSource = 'practice' | 'browse' | 'exam' | 'review';
export interface AttemptMetadata {
  eventId?: string;
  at?: number;
  selectedIndex?: number;
  durationMs?: number;
  confidence?: Confidence;
  mistakeReason?: string;
  source?: AttemptSource;
}
export interface AttemptInput extends AttemptMetadata { questionId: string; correct: boolean }
export interface AttemptEvent extends AttemptInput { eventId: string; at: number }
export interface LearningPolicy {
  wrongDelayMs: number;
  successIntervalsMs: number[];
  minimumEvidence: number;
  sessionSize: number;
  newItemFraction: number;
}
export interface SourceProgress {
  attempts: number;
  correct: number;
  wrong: number;
  studiedCount: number;
  studiedAt?: number;
  recent: AttemptEvent[];
  updatedAt: number;
  /** Scheduling state, carried beyond the bounded event history. */
  spacedSuccesses: number;
  dueAt?: number;
  streak: number;
}
export interface LegacyProgress { n: number; lastCorrect: boolean; at: number }
export interface QuestionLearning {
  sources: Record<string, SourceProgress>;
  legacy?: LegacyProgress;
  attempts: number;
  correct: number;
  wrong: number;
  legacyAttempts: number;
  lastCorrect?: boolean;
  lastAttemptAt?: number;
  studiedAt?: number;
  studiedCount: number;
  recent: AttemptEvent[];
  streak: number;
  spacedSuccesses: number;
  dueAt?: number;
}
export interface LearningState {
  version: 1;
  moduleId: string;
  revision: number;
  updatedAt: number;
  clearedAt: number;
  legacyMigrated: boolean;
  policy: LearningPolicy;
  questions: Record<string, QuestionLearning>;
  /** Bounded replay protection; recent per-question events provide a second guard. */
  recentEventIds: string[];
}
export interface StorageStatus {
  kind: 'ready' | 'memory' | 'recovered' | 'error';
  message?: string;
}
export type AreaStatus = 'unseen' | 'building' | 'weak' | 'developing' | 'strong';
export interface LearningArea {
  id: string;
  label: string;
  subjectId: string;
  subjectLabel: string;
  total: number;
  scorable: number;
  studied: number;
  scorableStudied: number;
  attempted: number;
  evidence: number;
  accuracy: number | null;
  due: number;
  repeatMistakes: number;
  status: AreaStatus;
  trend: 'improving' | 'declining' | 'steady' | 'unknown';
  questionIds: string[];
  readQuestionIds: string[];
}
export interface LearningMistake {
  questionId: string;
  question: string;
  subjectLabel: string;
  topicLabel: string;
  wrongCount: number;
  attempts: number;
  lastCorrect: boolean;
  lastAttemptAt: number;
  dueAt?: number;
  mistakeReason?: string;
  confidence?: Confidence;
}
export interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
}
export interface LearningDashboardModel {
  summary: {
    total: number;
    readableTotal: number;
    studied: number;
    scorableStudied: number;
    attempted: number;
    attempts: number;
    accuracy: number | null;
    knownAttempts: number;
    legacyAttempts: number;
    due: number;
    mistakes: number;
    repeatMistakes: number;
    secure: number;
    unseen: number;
  };
  subjects: LearningArea[];
  topics: LearningArea[];
  mistakes: LearningMistake[];
  recommendations: LearningRecommendation[];
  queues: { due: string[]; mistakes: string[]; weak: string[]; new: string[]; mixed: string[] };
  policy: LearningPolicy;
}
