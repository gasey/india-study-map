// Mirrors the JSON contract in the Current Affairs build guide (§3) — this
// is the interface between the (future) droplet pipeline and this frontend.
// Keep in sync with the fixtures in public/data/current-affairs/.

export type Difficulty = 'easy' | 'medium' | 'hard';
export type OptionKey = 'a' | 'b' | 'c' | 'd';

export interface Mcq {
  id: string;
  question: string;
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
}

export interface CurrentAffairsSource {
  videoId: string;
  videoTitle: string;
  channelId: string;
  channelName: string;
  videoUrl: string;
  publishedAt: string;
}

export interface CurrentAffairsDay {
  schemaVersion: 1;
  date: string;
  source: CurrentAffairsSource;
  summary: string;
  keyFacts: string[];
  topics: string[];
  mcqs: Mcq[];
}

export interface ArchiveDayEntry {
  date: string;
  title: string;
  mcqCount: number;
  topics: string[];
}

export interface ArchiveManifest {
  schemaVersion: 1;
  updatedAt: string;
  days: ArchiveDayEntry[];
}
