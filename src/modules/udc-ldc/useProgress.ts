import { useMemo, useSyncExternalStore } from 'react';
import { LearningStore } from '@/lib/learning/storage';
export { createAttemptId } from '@/lib/learning/engine';
export type { AttemptInput, AttemptMetadata, LearningState, StorageStatus } from '@/lib/learning/types';

/** Compatibility view used by existing bank filters. Explicit reading is not an attempt. */
export interface QuestionProgress { n: number; lastCorrect: boolean; at: number }
export type ProgressMap = Record<string, QuestionProgress>;
let store: LearningStore | undefined;
function getStore(): LearningStore {
  return store ??= new LearningStore({ moduleId: 'udc-ldc', legacyKey: 'jabreeze.udcldc.progress.v1' });
}
export function useProgress() {
  const active = getStore();
  const snapshot = useSyncExternalStore(active.subscribe, active.getSnapshot, active.getSnapshot);
  const progress = useMemo<ProgressMap>(() => {
    const result: ProgressMap = Object.create(null) as ProgressMap;
    for (const [id, q] of Object.entries(snapshot.learning.questions)) {
      if (q.attempts > 0 && q.lastCorrect !== undefined) result[id] = { n: q.attempts, lastCorrect: q.lastCorrect, at: q.lastAttemptAt ?? 0 };
    }
    return result;
  }, [snapshot.learning]);
  return {
    ...snapshot, progress,
    record: active.record, recordMany: active.recordMany, reset: active.reset,
    markStudied: active.markStudied, annotateAttempt: active.annotateAttempt,
    exportProgress: active.exportProgress, importProgress: active.importProgress,
  };
}
