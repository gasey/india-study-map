import { annotateLearningAttempt, applyAttempts, createAttemptId, emptyLearningState, markQuestionStudied, mergeLearningStates, migrateLegacy, parseLearningState, safeId } from './engine';
import { compactLearningState, openLearningDatabase, readLearningDatabase, updateLearningDatabase } from './indexedDb';
import type { AttemptInput, AttemptMetadata, LearningState, StorageStatus } from './types';

export interface LearningSnapshot { learning: LearningState; ready: boolean; storageStatus: StorageStatus }
export interface LearningStoreOptions { moduleId: string; legacyKey?: string; storage?: Storage; disableIndexedDb?: boolean }
/** IndexedDB is primary and updates questions independently in one transaction.
 * localStorage remains a migration path and fallback. Its cross-tab consistency
 * is best effort where Web Locks is unavailable. */
export class LearningStore {
  readonly key: string;
  private storage?: Storage;
  private database?: IDBDatabase;
  private channel?: BroadcastChannel;
  private sourceId = createAttemptId('browser');
  private listeners = new Set<() => void>();
  private pending: Promise<void> = Promise.resolve();
  private snapshot: LearningSnapshot;
  private damagedRaw?: string;
  private recoveryNotice?: string;
  private persisted = false;
  private disposed = false;
  constructor(private options: LearningStoreOptions) {
    this.key = `jabreeze.learning.${options.moduleId}.v1`;
    this.snapshot = { learning: emptyLearningState(options.moduleId), ready: false, storageStatus: { kind: 'ready' } };
    try {
      this.storage = options.storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
      if (!this.storage) throw new Error('Browser storage unavailable');
      const source = this.storage.getItem(`${this.key}.source`);
      if (safeId(source)) this.sourceId = source;
      else this.storage.setItem(`${this.key}.source`, this.sourceId);
      this.snapshot.learning = this.readLocal();
    } catch {
      this.snapshot.storageStatus = { kind: 'memory', message: 'Browser storage is unavailable. Progress is kept for this open page; export a backup before leaving.' };
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.onStorage);
      if (typeof BroadcastChannel !== 'undefined') {
        try { this.channel = new BroadcastChannel(this.key); this.channel.onmessage = () => this.refresh(); } catch { /* storage events remain available */ }
      }
    }
    this.pending = this.initialize();
  }
  private async initialize(): Promise<void> {
    try {
      if (this.options.disableIndexedDb) throw new Error('Database disabled');
      this.database = await openLearningDatabase();
      if (this.disposed) { this.database.close(); return; }
      const learning = await updateLearningDatabase(this.database, this.snapshot.learning, mergeLearningStates, state => state);
      this.persisted = true;
      this.publish(learning, this.statusAfterSave());
    } catch {
      if (this.database) {
        this.recoveryNotice = 'The saved learning database could not be read. Its data is preserved; this page is using fallback storage. Export a backup before leaving.';
        this.snapshot.storageStatus = { kind: 'recovered', message: this.recoveryNotice };
      }
      this.database?.close(); this.database = undefined;
      // A working localStorage fallback remains useful on restrictive browsers.
      this.publish(this.snapshot.learning, this.snapshot.storageStatus.kind === 'memory' || this.snapshot.storageStatus.kind === 'recovered' ? this.snapshot.storageStatus : { kind: 'ready', message: 'Using browser local storage. Export backups regularly; its capacity is smaller than the browser learning database.' });
    }
  }
  getSnapshot = (): LearningSnapshot => this.snapshot;
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  dispose = (): void => { this.disposed = true; if (typeof window !== 'undefined') window.removeEventListener('storage', this.onStorage); this.channel?.close(); this.database?.close(); this.listeners.clear(); };
  private publish(learning: LearningState, status = this.snapshot.storageStatus): void {
    if (this.disposed) return;
    this.snapshot = { learning, ready: true, storageStatus: status };
    this.listeners.forEach(listener => listener());
  }
  private statusAfterSave(): StorageStatus {
    return this.recoveryNotice ? { kind: 'recovered', message: this.recoveryNotice } : { kind: 'ready', message: this.database ? undefined : 'Using browser local storage. Export backups regularly; its capacity is smaller than the browser learning database.' };
  }
  private readLocal(): LearningState {
    let learning = emptyLearningState(this.options.moduleId);
    const raw = this.storage?.getItem(this.key);
    if (raw) {
      try { learning = parseLearningState(raw, this.options.moduleId); }
      catch {
        this.damagedRaw = raw;
        this.recoveryNotice = 'Saved progress could not be read. The original data is being kept for recovery; new progress remains usable.';
        this.snapshot.storageStatus = { kind: 'recovered', message: this.recoveryNotice };
      }
    }
    if (!learning.legacyMigrated && this.options.legacyKey) {
      const legacy = this.storage?.getItem(this.options.legacyKey);
      if (legacy) {
        try { learning = migrateLegacy(learning, JSON.parse(legacy)); }
        catch {
          this.recoveryNotice = 'Old progress could not be read. It has been left untouched; new learning progress can still be saved.';
          this.snapshot.storageStatus = { kind: 'recovered', message: this.recoveryNotice };
        }
      } else learning = { ...learning, legacyMigrated: true };
    }
    return learning;
  }
  private onStorage = (event: StorageEvent): void => {
    if (event.key === this.key || event.key === `${this.key}.changed` || event.key === null) this.refresh();
  };
  private refresh(): void {
    const run = async () => {
      try {
        const disk = this.database ? await readLearningDatabase(this.database, this.options.moduleId, this.persisted ? this.snapshot.learning : undefined) : this.readLocal();
        if (disk) this.publish(mergeLearningStates(this.snapshot.learning, disk));
      } catch {
        this.publish(this.snapshot.learning, { kind: 'error', message: 'Saved learning data could not be refreshed. Your current page still has its progress; export a backup before leaving.' });
      }
    };
    this.pending = this.pending.then(run, run);
  }
  private notifyTabs(): void {
    try { this.channel?.postMessage({ changed: true }); } catch { /* page is closing */ }
    if (!this.channel) try { this.storage?.setItem(`${this.key}.changed`, createAttemptId('change')); } catch { /* persistence itself already succeeded */ }
  }
  private transact(change: (state: LearningState) => LearningState): Promise<void> {
    const commit = async () => {
      let candidate = this.snapshot.learning;
      if (this.database) {
        try {
          const next = await updateLearningDatabase(this.database, this.snapshot.learning, mergeLearningStates, base => { candidate = change(base); return candidate; });
          this.persisted = true;
          this.publish(next, this.statusAfterSave());
          this.notifyTabs();
          return;
        } catch {
          // Keep both the existing database and unsaved page data; a later action
          // retries persistence. Do not silently replace the database on errors.
          if (candidate === this.snapshot.learning) candidate = change(candidate);
          this.persisted = false;
          this.publish(candidate, { kind: 'memory', message: 'The browser could not save new progress. It is kept in this page; export a backup before leaving. Saving will retry on your next action.' });
          return;
        }
      }
      let base = this.snapshot.learning;
      try { if (this.storage) base = mergeLearningStates(base, this.readLocal()); } catch { /* keep unsaved page work */ }
      const next = change(base);
      try {
        if (!this.storage) throw new Error('Browser storage unavailable');
        // A failed recovery copy leaves corrupt original data intact.
        if (this.damagedRaw !== undefined) {
          this.storage.setItem(`${this.key}.recovery`, this.damagedRaw);
          this.damagedRaw = undefined;
          this.recoveryNotice = 'Unreadable saved data was preserved in a browser recovery copy. New progress is being saved normally.';
        }
        this.storage.setItem(this.key, JSON.stringify(compactLearningState(next)));
        this.persisted = true;
        this.publish(next, this.statusAfterSave());
        this.notifyTabs();
      } catch {
        this.persisted = false;
        this.publish(next, { kind: 'memory', message: 'Browser storage is full or unavailable. New progress is kept in this page; export a backup before leaving.' });
      }
    };
    const run = async () => {
      if (!this.database && typeof navigator !== 'undefined' && navigator.locks?.request) await navigator.locks.request(this.key, commit);
      else await commit();
    };
    const result = this.pending.then(run);
    this.pending = result.catch(() => {});
    return result;
  }
  record = (questionId: string, correct: boolean, metadata: AttemptMetadata = {}): Promise<void> => this.recordMany([{ questionId, correct, ...metadata }]);
  recordMany = (inputs: AttemptInput[]): Promise<void> => {
    const now = Date.now();
    const prepared = inputs.map(input => ({ ...input, eventId: input.eventId ?? createAttemptId(), at: input.at ?? now }));
    return this.transact(state => applyAttempts(state, prepared, this.sourceId, now));
  };
  markStudied = (questionId: string): Promise<void> => { const at = Date.now(); return this.transact(state => markQuestionStudied(state, questionId, this.sourceId, at)); };
  annotateAttempt = (eventId: string, patch: { mistakeReason?: string }): Promise<void> => this.transact(state => annotateLearningAttempt(state, eventId, patch));
  exportProgress = (): string => JSON.stringify(compactLearningState(this.snapshot.learning), null, 2);
  importProgress = async (json: string): Promise<{ added: number }> => {
    const incoming = parseLearningState(json, this.options.moduleId);
    let added = 0;
    await this.transact(state => {
      // Backup files are additive, never reset instructions. A user may explicitly
      // restore a backup after clearing local history without discarding new work.
      const next = mergeLearningStates(state, { ...incoming, clearedAt: state.clearedAt });
      added = Object.values(next.questions).reduce((sum, q) => sum + q.attempts, 0) - Object.values(state.questions).reduce((sum, q) => sum + q.attempts, 0);
      return { ...next, revision: state.revision + 1, updatedAt: Date.now(), policy: state.policy };
    });
    return { added };
  };
  reset = (): Promise<void> => this.transact(state => ({ ...emptyLearningState(this.options.moduleId), legacyMigrated: true, clearedAt: Math.max(Date.now(), state.clearedAt + 1), revision: state.revision + 1, updatedAt: Date.now(), policy: state.policy }));
}
