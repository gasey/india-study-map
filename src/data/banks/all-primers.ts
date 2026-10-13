import scitech from './science-guide.json';
import aptitude from './primers-aptitude.json';
import economy from './primers-economy.json';
import english from './primers-english.json';
import geography from './primers-geography.json';
import history from './primers-history.json';
import mizoram from './primers-mizoram.json';
import polity from './primers-polity.json';
import engGrammar from './primers-eng-grammar.json';
import engSentence from './primers-eng-sentence.json';
import engComprehension from './primers-eng-comprehension.json';
import gs1Current from './primers-gs1-current.json';
import gs2Economy from './primers-gs2-economy.json';
import gs2Geography from './primers-gs2-geography.json';

export interface Primer {
  unit: string;
  subtopic: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  primer: string;
  analogy: string;
  traps: string[];
  formulae: string[];
}

/**
 * Every MPSC concept primer, across all 14 unit files, merged into one list.
 * Each primer's `unit` field (e.g. 'GS3-SCITECH', 'ENG-GRAMMAR') is the
 * source of truth for category filtering — see PRIMER_CATEGORIES below.
 */
export const allPrimers: Primer[] = [
  ...(scitech as Primer[]),
  ...(aptitude as Primer[]),
  ...(economy as Primer[]),
  ...(english as Primer[]),
  ...(geography as Primer[]),
  ...(history as Primer[]),
  ...(mizoram as Primer[]),
  ...(polity as Primer[]),
  ...(engGrammar as Primer[]),
  ...(engSentence as Primer[]),
  ...(engComprehension as Primer[]),
  ...(gs1Current as Primer[]),
  ...(gs2Economy as Primer[]),
  ...(gs2Geography as Primer[]),
];

/** Human-readable label for each raw `unit` code, for the category filter UI. */
export const UNIT_LABELS: Record<string, string> = {
  'GS3-SCITECH': 'Science',
  'GS3-APTITUDE': 'Aptitude',
  'GS2-ECONOMY': 'Economy',
  'GS2-GEOGRAPHY': 'Geography',
  'GS1-HISTORY': 'History',
  'GS3-MIZORAM': 'Mizoram GK',
  'GS2-POLITY': 'Polity',
  'ENG-VOCAB': 'English Vocabulary',
  'ENG-GRAMMAR': 'English Grammar',
  'ENG-SENTENCE': 'English Sentence',
  'ENG-COMPREHENSION': 'English Comprehension',
  'GS1-CURRENT': 'Current Affairs',
};

export const PRIMER_CATEGORIES: string[] = Array.from(new Set(allPrimers.map((p) => p.unit))).sort();
