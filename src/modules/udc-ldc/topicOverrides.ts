import type { BankQuestion } from '@/data/banks/types';
import topicOverrides from '../../../tools/udc-ldc-build/mizo-economy-topic-overrides.json';
import scienceOverrides from '../../../tools/udc-ldc-build/science-topic-overrides.json';

const mizoramIds = new Set(topicOverrides.mizoram);
const economyIds = new Set(topicOverrides.economy);
const scienceIds = new Set(scienceOverrides.science);
const scienceExcludedIds = new Set(scienceOverrides.exclude);

/** Apply the durable topic audit without changing a question's answer or source gates. */
export function withTopicOverride(q: BankQuestion): BankQuestion {
  const mizoram = mizoramIds.has(q.id);
  const economy = economyIds.has(q.id);
  const science = scienceIds.has(q.id);
  if (!mizoram && !economy && !science) return q;
  const tags = Array.from(new Set([...(q.tags ?? []), ...(mizoram ? ['mizoram'] : []), ...(economy ? ['economy'] : []), ...(science ? ['science'] : [])]));
  if (q.id.startsWith('mpsc-group-b-')) {
    return {
      ...q,
      tags,
      topic: mizoram ? 'mizoram_gk' : economy ? 'economy' : 'science_general',
      topicLabel: mizoram ? 'Mizoram — General' : economy ? 'Economy' : 'General Science',
    };
  }
  return { ...q, tags, gkTopic: mizoram ? 'mizoram' : economy ? 'economy' : 'general-science' };
}

export function hasTopic(q: BankQuestion, topic: 'mizoram' | 'economy' | 'science'): boolean {
  if (topic === 'science' && scienceExcludedIds.has(q.id)) return false;
  if (q.tags?.includes(topic)) return true;
  if (topic === 'mizoram') return q.gkTopic === 'mizoram' || q.topic.startsWith('mizoram_') || q.topicLabel.startsWith('Mizoram —');
  if (topic === 'economy') return q.gkTopic === 'economy' || q.topic === 'economy' || q.topicLabel === 'Economy';
  return q.gkTopic === 'general-science' || q.gkTopic === 'science-tech' || q.topic.startsWith('science_') || q.topicLabel === 'General Science';
}
