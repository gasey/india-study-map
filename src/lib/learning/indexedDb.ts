import { parseLearningState } from './engine';
import type { LearningState, QuestionLearning } from './types';

/** Store each question separately so a single answer does not rewrite the bank. */
export function openLearningDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB is unavailable.')); return; }
    const request = indexedDB.open('jabreeze.learning', 1);
    let rejected = false;
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('modules')) db.createObjectStore('modules', { keyPath: 'moduleId' });
      if (!db.objectStoreNames.contains('questions')) {
        const questions = db.createObjectStore('questions', { keyPath: ['moduleId', 'id'] });
        questions.createIndex('moduleId', 'moduleId');
      }
    };
    request.onerror = () => { rejected = true; reject(request.error ?? new Error('Learning database could not be opened.')); };
    request.onblocked = () => { rejected = true; reject(new Error('Learning database is blocked by another tab.')); };
    request.onsuccess = () => {
      if (rejected) { request.result.close(); return; }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}
function result<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function complete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('Learning transaction was aborted.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Learning transaction failed.'));
  });
}
type ModuleMetadata = Omit<LearningState, 'questions'>;
export function compactLearningState(state: LearningState): ModuleMetadata & { questions: Record<string, Pick<QuestionLearning, 'sources' | 'legacy'>> } {
  const questions: Record<string, Pick<QuestionLearning, 'sources' | 'legacy'>> = Object.create(null);
  for (const [id, q] of Object.entries(state.questions)) questions[id] = { sources: q.sources, legacy: q.legacy };
  return { ...state, questions };
}
export async function readLearningDatabase(db: IDBDatabase, moduleId: string, current?: LearningState): Promise<LearningState | undefined> {
  const transaction = db.transaction(['modules', 'questions'], 'readonly');
  const done = complete(transaction);
  void done.catch(() => {});
  const metadata = await result(transaction.objectStore('modules').get(moduleId)) as ModuleMetadata | undefined;
  if (!metadata) { await done; return undefined; }
  if (current && metadata.revision === current.revision && metadata.updatedAt === current.updatedAt && metadata.clearedAt === current.clearedAt) { await done; return current; }
  const records = await result(transaction.objectStore('questions').index('moduleId').getAll(moduleId)) as Array<{ id: string; data: Pick<QuestionLearning, 'sources' | 'legacy'> }>;
  await done;
  const questions = Object.fromEntries(records.map(row => [row.id, row.data]));
  return parseLearningState(JSON.stringify({ ...metadata, questions }), moduleId);
}
export async function writeLearningDatabase(db: IDBDatabase, previous: LearningState | undefined, next: LearningState): Promise<void> {
  const transaction = db.transaction(['modules', 'questions'], 'readwrite');
  const done = complete(transaction);
  const { questions, ...metadata } = next;
  transaction.objectStore('modules').put(metadata);
  const store = transaction.objectStore('questions');
  for (const [id, q] of Object.entries(questions)) {
    if (previous?.questions[id] === q) continue;
    store.put({ moduleId: next.moduleId, id, data: { sources: q.sources, legacy: q.legacy } });
  }
  for (const id of Object.keys(previous?.questions ?? {})) if (!questions[id]) store.delete([next.moduleId, id]);
  await done;
}

/** Read, merge, and write in ONE IndexedDB transaction, including browsers without
 * Web Locks. readwrite transactions across tabs serialize at the database level. */
export async function updateLearningDatabase(
  db: IDBDatabase,
  memory: LearningState,
  merge: (a: LearningState, b: LearningState) => LearningState,
  change: (state: LearningState) => LearningState,
): Promise<LearningState> {
  const transaction = db.transaction(['modules', 'questions'], 'readwrite');
  const done = complete(transaction);
  // Attach a rejection handler immediately, even if validation throws first.
  void done.catch(() => {});
  try {
    const moduleStore = transaction.objectStore('modules');
    const questionStore = transaction.objectStore('questions');
    const metadata = await result(moduleStore.get(memory.moduleId)) as ModuleMetadata | undefined;
    let disk: LearningState | undefined;
    if (metadata) {
      if (metadata.revision === memory.revision && metadata.updatedAt === memory.updatedAt && metadata.clearedAt === memory.clearedAt) disk = memory;
      else {
        const records = await result(questionStore.index('moduleId').getAll(memory.moduleId)) as Array<{ id: string; data: Pick<QuestionLearning, 'sources' | 'legacy'> }>;
        disk = parseLearningState(JSON.stringify({ ...metadata, questions: Object.fromEntries(records.map(row => [row.id, row.data])) }), memory.moduleId);
      }
    }
    const base = disk ? merge(memory, disk) : memory;
    const next = change(base);
    const { questions, ...header } = next;
    moduleStore.put(header);
    for (const [id, q] of Object.entries(questions)) if (disk?.questions[id] !== q) questionStore.put({ moduleId: next.moduleId, id, data: { sources: q.sources, legacy: q.legacy } });
    for (const id of Object.keys(disk?.questions ?? {})) if (!questions[id]) questionStore.delete([next.moduleId, id]);
    await done;
    return next;
  } catch (error) {
    try { transaction.abort(); } catch { /* already failed or committed */ }
    throw error;
  }
}
