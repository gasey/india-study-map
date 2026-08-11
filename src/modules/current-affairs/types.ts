// Mirrors the JSON contract this app's automated pipeline writes —
// tools/current-affairs/build.mjs, run daily by
// .github/workflows/current-affairs.yml. Keep in sync with the fixtures
// in public/data/current-affairs/.
//
// `source` used to be shaped around a YouTube video (videoId/videoTitle/
// channelId/channelName/videoUrl) from when this module's content was
// hand-transcribed from a current-affairs quiz channel. The pipeline
// sources from a news API instead, so this is now source-agnostic.

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
  title: string;
  links: string[];
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
