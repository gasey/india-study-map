/** Focused deterministic checks for the learning engine and persistence fallback.
 * Run: node tools/learning-check.mjs */
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange, IDBObjectStore } from 'fake-indexeddb';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const scratch = await mkdtemp(path.join(tmpdir(), 'learning-check-'));
try {
  const outfile = path.join(scratch, 'learning.mjs');
  await build({ stdin: { contents: `export * from './src/lib/learning/engine'; export * from './src/lib/learning/storage'; export * from './src/lib/learning/indexedDb'; export * from './src/modules/udc-ldc/learningModel';`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent' });
  const e = await import(pathToFileURL(outfile));
  const at = 1_700_000_000_000;
  let passes = 0;
  const check = (label, fn) => { fn(); passes++; console.log(`✓ ${label}`); };
  const start = () => e.emptyLearningState('udc-ldc');
  const answer = (state, questionId, correct, time = at, meta = {}) => e.applyAttempts(state, [{ questionId, correct, at: time, eventId: `${questionId}:${time}:${state.revision}`, ...meta }], 'browser-a', time);
  check('legacy migration preserves totals without fabricating correct/wrong history', () => {
    const state = e.migrateLegacy(start(), { old: { n: 12, lastCorrect: false, at } });
    assert.equal(state.questions.old.attempts, 12); assert.equal(state.questions.old.legacyAttempts, 12);
    assert.equal(state.questions.old.correct, 0); assert.equal(state.questions.old.wrong, 0); assert.deepEqual(state.questions.old.recent, []);
    assert.equal(e.migrateLegacy(state, { old: { n: 12, lastCorrect: false, at } }), state);
  });
  check('explicit reading does not answer or schedule a question', () => {
    const state = e.markQuestionStudied(start(), 'read', 'browser-a', at);
    assert.equal(state.questions.read.attempts, 0); assert.equal(state.questions.read.studiedCount, 1); assert.equal(state.questions.read.dueAt, undefined);
    assert.equal(e.markQuestionStudied(state, 'read', 'browser-a', at + 10), state);
  });
  check('wrong answers get a short recall; early successes cannot earn mastery', () => {
    let state = answer(start(), 'q', false);
    assert.equal(state.questions.q.dueAt, at + 10 * e.MINUTE);
    for (let i = 1; i <= 20; i++) state = answer(state, 'q', true, at + i * 1000);
    assert.equal(state.questions.q.spacedSuccesses, 0); assert.equal(state.questions.q.dueAt, at + 10 * e.MINUTE);
    state = answer(state, 'q', true, at + 10 * e.MINUTE);
    assert.equal(state.questions.q.spacedSuccesses, 1); assert.equal(state.questions.q.dueAt, at + 10 * e.MINUTE + 4 * 60 * e.MINUTE);
  });
  check('spaced successful reviews advance and cap at seven days; lapse resets', () => {
    let state = answer(start(), 'q', true);
    assert.equal(state.questions.q.dueAt - at, 4 * 60 * e.MINUTE);
    for (let i = 0; i < 9; i++) state = answer(state, 'q', true, state.questions.q.dueAt);
    assert.equal(state.questions.q.dueAt - state.questions.q.lastAttemptAt, 7 * e.DAY);
    const now = state.questions.q.dueAt;
    state = answer(state, 'q', false, now);
    assert.equal(state.questions.q.spacedSuccesses, 0); assert.equal(state.questions.q.dueAt, now + 10 * e.MINUTE);
  });
  check('guessed correct answers stay on a short interval', () => {
    const state = answer(start(), 'q', true, at, { confidence: 'guess' });
    assert.equal(state.questions.q.correct, 1); assert.equal(state.questions.q.spacedSuccesses, 0); assert.equal(state.questions.q.dueAt, at + 10 * e.MINUTE);
  });
  check('event IDs deduplicate bulk exam replay and bounded histories retain counters', () => {
    const rows = Array.from({ length: 120 }, (_, i) => ({ questionId: `q${i % 3}`, correct: i % 2 === 0, at: at + i, eventId: `exam:${i}` }));
    const state = e.applyAttempts(start(), rows, 'browser-a', at + 120);
    assert.equal(e.applyAttempts(state, rows, 'browser-a', at + 120), state);
    assert.equal(state.questions.q0.attempts, 40); assert.equal(state.questions.q0.recent.length, e.HISTORY_LIMIT);
    assert.equal(state.questions.q0.correct + state.questions.q0.wrong, 40);
  });
  check('mistake annotation updates history without creating an attempt', () => {
    const state = answer(start(), 'q', false, at, { eventId: 'annotate-me' });
    const annotated = e.annotateLearningAttempt(state, 'annotate-me', { mistakeReason: 'Misread the question' }, at + 1000);
    assert.equal(annotated.questions.q.attempts, 1); assert.equal(annotated.questions.q.recent[0].mistakeReason, 'Misread the question');
  });
  check('backup merge is idempotent and preserves independent browser histories', () => {
    const a = answer(start(), 'q', true);
    const b = e.applyAttempts(start(), [{ questionId: 'q', correct: false, at: at + 100, eventId: 'b' }], 'browser-b', at + 100);
    const merged = e.mergeLearningStates(a, b);
    assert.equal(merged.questions.q.attempts, 2); assert.equal(merged.questions.q.lastCorrect, false);
    assert.deepEqual(e.mergeLearningStates(merged, b).questions.q, merged.questions.q);
    const parsed = e.parseLearningState(JSON.stringify(e.compactLearningState(merged)), 'udc-ldc');
    assert.deepEqual(parsed.questions.q.recent, merged.questions.q.recent);
  });
  check('invalid module, schema, counters and unsafe IDs are rejected', () => {
    assert.throws(() => e.parseLearningState('{broken', 'udc-ldc'));
    assert.throws(() => e.parseLearningState(JSON.stringify(e.emptyLearningState('other')), 'udc-ldc'));
    assert.throws(() => e.applyAttempts(start(), [{ questionId: '__proto__', correct: true }], 'a', at));
    const bad = JSON.parse(JSON.stringify(answer(start(), 'q', true)));
    bad.questions.q.sources['browser-a'].attempts = 200;
    assert.throws(() => e.parseLearningState(JSON.stringify(bad), 'udc-ldc'));
  });
  const question = (id, overrides = {}) => ({ id, subject: 'computer', studySection: 'computer', topic: 'computer_basics', topicLabel: 'Computer fundamentals', difficulty: 'easy', question: `Question ${id}`, options: ['A', 'B'], answerIndex: 0, explanation: 'Because.', ...overrides });
  check('weak topics need distinct evidence; reading and unknown topics are not weak', () => {
    const bank = Array.from({ length: 10 }, (_, i) => question(`q${i}`));
    let state = start();
    for (let i = 0; i < 20; i++) state = answer(state, 'q0', false, at + i);
    let model = e.buildLearningDashboard(bank, state, at + e.DAY);
    assert.equal(model.topics[0].status, 'building'); assert.equal(model.topics[0].evidence, 1);
    for (let i = 1; i < 5; i++) state = answer(state, `q${i}`, false, at + 100 + i);
    model = e.buildLearningDashboard(bank, state, at + e.DAY);
    assert.equal(model.topics[0].status, 'weak'); assert.equal(model.summary.repeatMistakes, 1);
    assert.equal(e.buildLearningDashboard(bank, start(), at).topics[0].status, 'unseen');
  });
  check('written and held reading counts survive while scored queues exclude them', () => {
    const bank = [question('ok'), question('written', { type: 'descriptive' }), question('held', { sourceReview: true }), question('broken', { sourceDefect: 'duplicate-options' })];
    let state = e.markQuestionStudied(start(), 'written', 'a', at); state = e.markQuestionStudied(state, 'held', 'a', at);
    const model = e.buildLearningDashboard(bank, state, at);
    assert.equal(model.summary.studied, 2); assert.equal(model.summary.readableTotal, 4); assert.equal(model.summary.total, 1);
    assert.deepEqual(model.queues.new, ['ok']); assert.equal(model.subjects[0].readQuestionIds.length, 4);
  });
  check('bounded reading moves past studied items without losing printed order or held questions', () => {
    const bank = Array.from({ length: 45 }, (_, i) => question(`read-${i}`, i === 21 ? { type: 'descriptive' } : {}));
    let state = start();
    for (const q of bank.slice(0, 20)) state = e.markQuestionStudied(state, q.id, 'a', at);
    const model = e.buildLearningDashboard(bank, state, at);
    assert.deepEqual(model.subjects[0].readQuestionIds.slice(0, 20), bank.slice(20, 40).map(q => q.id));
    assert.deepEqual(model.topics[0].readQuestionIds.slice(0, 20), bank.slice(20, 40).map(q => q.id));
    assert.equal(new Set(model.subjects[0].readQuestionIds).size, 45);
    assert.equal(model.summary.attempts, 0);
    for (const q of bank.slice(20)) state = e.markQuestionStudied(state, q.id, 'a', at);
    assert.deepEqual(e.buildLearningDashboard(bank, state, at).subjects[0].readQuestionIds, bank.map(q => q.id));
  });
  check('manageable sessions mix due recall with genuinely unseen questions', () => {
    const bank = Array.from({ length: 50 }, (_, i) => question(`q${i}`));
    const rows = bank.slice(0, 30).map(q => ({ questionId: q.id, correct: false, at, eventId: `due:${q.id}` }));
    const state = e.applyAttempts(start(), rows, 'a', at);
    const model = e.buildLearningDashboard(bank, state, at + e.DAY);
    assert.equal(model.queues.mixed.length, 15); assert.equal(model.queues.mixed.filter(id => !state.questions[id]).length, 3);
    assert.equal(new Set(model.queues.mixed).size, model.queues.mixed.length);
  });
  check('full-bank canonical backup is accepted at 20,000 questions', () => {
    const rows = Array.from({ length: 20_000 }, (_, i) => ({ questionId: `scale-${i}`, correct: i % 3 !== 0, at, eventId: `scale-event-${i}`, selectedIndex: 1, durationMs: 12000, confidence: 'sure', source: 'practice' }));
    const state = e.applyAttempts(start(), rows, 'browser-a', at);
    const json = JSON.stringify(e.compactLearningState(state));
    const restored = e.parseLearningState(json, 'udc-ldc');
    assert.equal(Object.keys(restored.questions).length, 20_000); assert.ok(json.length < e.MAX_BACKUP_CHARS);
    console.log(`  20,000-question backup: ${(Buffer.byteLength(json) / 1024 / 1024).toFixed(1)} MiB; IndexedDB avoids localStorage quota.`);
  });
  class MemoryStorage {
    data = new Map(); blocked = false;
    getItem(key) { return this.data.get(key) ?? null; }
    setItem(key, value) { if (this.blocked) throw new Error('Quota'); this.data.set(key, value); }
    removeItem(key) { this.data.delete(key); }
  }
  const memory = new MemoryStorage();
  memory.setItem('jabreeze.udcldc.progress.v1', JSON.stringify({ old: { n: 8, lastCorrect: true, at } }));
  let store = new e.LearningStore({ moduleId: 'udc-ldc', legacyKey: 'jabreeze.udcldc.progress.v1', storage: memory, disableIndexedDb: true });
  await store.record('fresh', false, { eventId: 'fresh-event' });
  check('fallback persistence migrates legacy and batch replay remains idempotent', () => { assert.equal(store.getSnapshot().learning.questions.old.attempts, 8); assert.equal(store.getSnapshot().learning.questions.fresh.attempts, 1); });
  const backup = store.exportProgress();
  assert.equal((await store.importProgress(backup)).added, 0);
  memory.blocked = true;
  await store.record('quota', true, { eventId: 'quota-event' });
  check('quota failure is visible and unsaved progress remains exportable', () => { assert.equal(store.getSnapshot().storageStatus.kind, 'memory'); assert.equal(e.parseLearningState(store.exportProgress(), 'udc-ldc').questions.quota.attempts, 1); });
  memory.blocked = false;
  await store.record('recovery', true, { eventId: 'recovery-event' });
  check('saving retries preserve prior in-memory attempts', () => { const saved = e.parseLearningState(memory.getItem(store.key), 'udc-ldc'); assert.equal(saved.questions.quota.attempts, 1); assert.equal(saved.questions.recovery.attempts, 1); });
  await store.reset(); store.dispose();
  store = new e.LearningStore({ moduleId: 'udc-ldc', legacyKey: 'jabreeze.udcldc.progress.v1', storage: memory, disableIndexedDb: true });
  await store.recordMany([]);
  check('explicit reset is not undone by the preserved legacy key', () => { assert.equal(Object.keys(store.getSnapshot().learning.questions).length, 0); });
  store.dispose();
  const corrupt = new MemoryStorage(); corrupt.setItem('jabreeze.learning.udc-ldc.v1', '{broken');
  const recovered = new e.LearningStore({ moduleId: 'udc-ldc', storage: corrupt, disableIndexedDb: true });
  await recovered.record('safe', true, { eventId: 'safe-event' });
  check('corrupt original is preserved before fallback storage is replaced', () => { assert.equal(corrupt.getItem(`${recovered.key}.recovery`), '{broken'); assert.equal(recovered.getSnapshot().storageStatus.kind, 'recovered'); });
  recovered.dispose();
  const full = new MemoryStorage();
  const savedState = e.applyAttempts(e.emptyLearningState('full-startup'), [{ questionId: 'saved', correct: true, at, eventId: 'saved-event' }], 'saved-browser', at);
  full.setItem('jabreeze.learning.full-startup.v1', JSON.stringify(e.compactLearningState(savedState)));
  const originalSaved = full.getItem('jabreeze.learning.full-startup.v1');
  full.blocked = true;
  const fullStartup = new e.LearningStore({ moduleId: 'full-startup', storage: full, disableIndexedDb: true });
  await fullStartup.recordMany([]);
  check('full storage during startup still restores history before attempting new writes', () => {
    assert.equal(fullStartup.getSnapshot().ready, true);
    assert.equal(fullStartup.getSnapshot().learning.questions.saved.attempts, 1);
    assert.equal(full.getItem('jabreeze.learning.full-startup.v1'), originalSaved);
  });
  fullStartup.dispose();
  let opening;
  globalThis.indexedDB = { open: () => (opening = {}) };
  const stalled = new e.LearningStore({ moduleId: 'stalled-open', storage: new MemoryStorage(), storageTimeoutMs: 20 });
  await stalled.record('usable', true, { eventId: 'stalled-event' });
  check('an IndexedDB open that never responds stops loading and supports fallback progress', () => {
    assert.equal(stalled.getSnapshot().ready, true);
    assert.equal(stalled.getSnapshot().storageStatus.kind, 'recovered');
    assert.equal(stalled.getSnapshot().learning.questions.usable.attempts, 1);
  });
  let lateClosed = false;
  opening.result = { close: () => { lateClosed = true; } };
  opening.onsuccess();
  check('a database opening after its timeout is closed instead of replacing fallback history', () => {
    assert.equal(lateClosed, true);
    assert.equal(stalled.getSnapshot().learning.questions.usable.attempts, 1);
  });
  stalled.dispose();
  let aborted = false;
  const stalledTransaction = {
    objectStore: () => ({ get: () => ({ transaction: stalledTransaction }) }),
    abort: () => { aborted = true; stalledTransaction.onabort?.(); },
  };
  await assert.rejects(e.readLearningDatabase({ transaction: () => stalledTransaction }, 'stalled-read', undefined, 20), /timed out/);
  check('a read request that never responds aborts instead of hanging history loading', () => assert.equal(aborted, true));
  // Exercise the real IndexedDB transaction code using an in-memory IDB implementation.
  globalThis.indexedDB = new IDBFactory();
  globalThis.IDBKeyRange = IDBKeyRange;
  const shared = new MemoryStorage();
  const tabA = new e.LearningStore({ moduleId: 'transaction-test', storage: shared });
  const tabB = new e.LearningStore({ moduleId: 'transaction-test', storage: shared });
  await Promise.all(Array.from({ length: 30 }, (_, i) => (i % 2 ? tabA : tabB).record('shared-question', i % 2 === 0, { eventId: `concurrent-${i}` })));
  const database = await e.openLearningDatabase();
  let persisted = await e.readLearningDatabase(database, 'transaction-test');
  check('IndexedDB concurrent tabs retain every attempt in atomic transactions', () => {
    assert.equal(persisted.questions['shared-question'].attempts, 30);
    assert.equal(persisted.questions['shared-question'].correct, 15);
    assert.equal(persisted.questions['shared-question'].wrong, 15);
  });
  await tabA.record('shared-question', false, { eventId: 'concurrent-1' });
  persisted = await e.readLearningDatabase(database, 'transaction-test');
  check('IndexedDB replay of a saved exam answer is idempotent across tabs', () => assert.equal(persisted.questions['shared-question'].attempts, 30));
  await tabA.record('second-question', true, { eventId: 'second-1' });
  const originalPut = IDBObjectStore.prototype.put;
  let questionWrites = 0;
  IDBObjectStore.prototype.put = function (...args) { if (this.name === 'questions') questionWrites++; return originalPut.apply(this, args); };
  try { await tabA.record('second-question', true, { eventId: 'second-2' }); }
  finally { IDBObjectStore.prototype.put = originalPut; }
  check('a normal answer writes only its changed question, not all history', () => assert.equal(questionWrites, 1));
  IDBObjectStore.prototype.put = function () { throw new DOMException('Storage is full', 'QuotaExceededError'); };
  try { await tabA.record('database-quota', false, { eventId: 'database-quota' }); }
  finally { IDBObjectStore.prototype.put = originalPut; }
  check('IndexedDB write failure preserves unsaved attempts and reports the issue', () => {
    assert.equal(tabA.getSnapshot().storageStatus.kind, 'memory');
    assert.equal(e.parseLearningState(tabA.exportProgress(), 'transaction-test').questions['database-quota'].wrong, 1);
  });
  await tabA.record('database-retry', true, { eventId: 'database-retry' });
  persisted = await e.readLearningDatabase(database, 'transaction-test');
  check('IndexedDB retries save the previous unsaved answer without duplication', () => {
    assert.equal(persisted.questions['database-quota'].attempts, 1);
    assert.equal(persisted.questions['database-retry'].attempts, 1);
  });
  const reloaded = new e.LearningStore({ moduleId: 'transaction-test', storage: shared });
  await reloaded.recordMany([]);
  check('IndexedDB reload restores committed history', () => assert.equal(reloaded.getSnapshot().learning.questions['second-question'].attempts, 2));
  await tabA.reset();
  await tabB.record('after-reset', true, { eventId: 'after-reset' });
  persisted = await e.readLearningDatabase(database, 'transaction-test');
  check('a stale tab cannot resurrect cleared history', () => { assert.equal(persisted.questions['shared-question'], undefined); assert.equal(persisted.questions['after-reset'].attempts, 1); });
  reloaded.dispose(); tabA.dispose(); tabB.dispose();
  await new Promise((resolve, reject) => {
    const tx = database.transaction('modules', 'readwrite');
    tx.objectStore('modules').put({ moduleId: 'damaged-database', version: 999 });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
  const damaged = new e.LearningStore({ moduleId: 'damaged-database', storage: new MemoryStorage() });
  await damaged.record('fallback', true, { eventId: 'fallback' });
  check('invalid database content is preserved with a visible recovery notice', () => {
    assert.equal(damaged.getSnapshot().storageStatus.kind, 'recovered');
    assert.equal(damaged.getSnapshot().learning.questions.fallback.attempts, 1);
  });
  const untouched = await new Promise((resolve, reject) => {
    const request = database.transaction('modules', 'readonly').objectStore('modules').get('damaged-database');
    request.onsuccess = () => resolve(request.result); request.onerror = reject;
  });
  assert.equal(untouched.version, 999);
  damaged.dispose(); database.close();
  console.log(`Learning checks passed: ${passes}`);
} finally { await rm(scratch, { recursive: true, force: true }); }
