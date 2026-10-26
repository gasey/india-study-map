import { useMemo, useSyncExternalStore } from 'react';
import { LearningStore } from '@/lib/learning/storage';
export { createAttemptId } from '@/lib/learning/engine';
export type { AttemptInput, AttemptMetadata, LearningState, StorageStatus } from '@/lib/learning/types';

/** Compatibility view used by existing bank filters. Explicit reading is not an attempt. */
export interface QuestionProgress { n: number; lastCorrect: boolean; at: number }
export type ProgressMap = Record<string, QuestionProgress>;
const stores = new Map<string, LearningStore>();
function getStore(moduleId: string): LearningStore {
  let active = stores.get(moduleId);
  if (!active) {
    active = new LearningStore({
      moduleId,
      ...(moduleId === 'udc-ldc' ? { legacyKey: 'jabreeze.udcldc.progress.v1' } : {}),
    });
    stores.set(moduleId, active);
  }
  return active;
}
export function useProgress(moduleId = 'udc-ldc') {
  const active = getStore(moduleId);
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
