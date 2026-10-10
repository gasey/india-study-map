import type { BankQuestion } from '@/data/banks/types';
import storedTags from '@/data/banks/mpsc-study-topic-tags.json';

/** Stable topic IDs shared with tools/practice-hub-build/taxonomy.py.
 * Resolve existing metadata only: a keyword in a stem is not a reviewed tag. */
export const MATH_TOPICS = [
  ['number_system', 'Numbers & simplification'],
  ['percentage', 'Percentages'],
  ['profit_loss', 'Profit & loss'],
  ['ratio_proportion', 'Ratio & proportion'],
  ['average', 'Averages'],
  ['simple_compound_interest', 'Simple & compound interest'],
  ['time_work', 'Time & work'],
  ['pipes_cisterns', 'Pipes & cisterns'],
  ['speed_distance_time', 'Speed, distance & time'],
  ['mixture_alligation', 'Mixtures & alligation'],
  ['age_problems', 'Ages'],
  ['algebra', 'Algebra'],
  ['sequences_series', 'Sequences & progressions'],
  ['mensuration', 'Geometry & mensuration'],
  ['trigonometry', 'Trigonometry'],
  ['sets', 'Sets'],
  ['statistics', 'Statistics'],
  ['data_interpretation', 'Data interpretation'],
  ['probability', 'Probability'],
  ['permutation_combination', 'Permutations & combinations'],
  ['mixed', 'Mixed / needs topic review'],
] as const;

export type MathTopicId = typeof MATH_TOPICS[number][0];
const known = new Set<string>(MATH_TOPICS.map(([id]) => id));
const tags: Record<string, string> = storedTags.tags;

export function mathTopicOf(q: BankQuestion): MathTopicId {
  const topic = (tags[q.id] ?? q.topic).replace(/-/g, '_');
  return known.has(topic) ? topic as MathTopicId : 'mixed';
}

export const COMPUTER_TOPICS = [
  ['computer_basics', 'Computer fundamentals'],
  ['hardware_memory', 'Hardware, storage & memory'],
  ['operating_systems', 'Operating systems & GUI'],
  ['word_processing', 'Word processing'],
  ['spreadsheets', 'Spreadsheets & Excel'],
  ['presentations', 'Presentations & PowerPoint'],
  ['internet_networking', 'Internet & networking'],
  ['security_privacy', 'Security & privacy'],
  ['databases', 'Databases'],
  ['programming', 'Programming'],
  ['digital_collaboration', 'Communication & collaboration'],
  ['mixed', 'Mixed / needs topic review'],
] as const;

export type StudyTopicId = MathTopicId | typeof COMPUTER_TOPICS[number][0];
export function studyTopicOf(q: BankQuestion, subject: 'arithmetic' | 'computer'): StudyTopicId {
  if (subject === 'arithmetic') return mathTopicOf(q);
  const topic = (tags[q.id] ?? q.topic).replace(/-/g, '_');
  return COMPUTER_TOPICS.some(([id]) => id === topic) ? topic as StudyTopicId : 'mixed';
}
