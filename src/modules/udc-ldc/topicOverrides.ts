import type { BankQuestion } from '@/data/banks/types';
import topicOverrides from '../../../tools/udc-ldc-build/mizo-economy-topic-overrides.json';

const mizoramIds = new Set(topicOverrides.mizoram);
const economyIds = new Set(topicOverrides.economy);

/** Apply the durable topic audit without changing a question's answer or source gates. */
export function withTopicOverride(q: BankQuestion): BankQuestion {
  const mizoram = mizoramIds.has(q.id);
  const economy = economyIds.has(q.id);
  if (!mizoram && !economy) return q;
  const tags = Array.from(new Set([...(q.tags ?? []), ...(mizoram ? ['mizoram'] : []), ...(economy ? ['economy'] : [])]));
  if (q.id.startsWith('mpsc-group-b-')) {
    return {
      ...q,
      tags,
      topic: mizoram ? 'mizoram_gk' : 'economy',
      topicLabel: mizoram ? 'Mizoram — General' : 'Economy',
    };
  }
  return { ...q, tags, gkTopic: mizoram ? 'mizoram' : 'economy' };
}

export function hasTopic(q: BankQuestion, topic: 'mizoram' | 'economy'): boolean {
  if (q.tags?.includes(topic)) return true;
  if (topic === 'mizoram') return q.gkTopic === 'mizoram' || q.topic.startsWith('mizoram_') || q.topicLabel.startsWith('Mizoram —');
  return q.gkTopic === 'economy' || q.topic === 'economy' || q.topicLabel === 'Economy';
}
