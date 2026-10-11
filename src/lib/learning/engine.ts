import type { AttemptEvent, AttemptInput, LearningPolicy, LearningState, LegacyProgress, QuestionLearning, SourceProgress } from './types';

export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;
export const HISTORY_LIMIT = 16;
export const REPLAY_LIMIT = 4096;
export const MAX_BACKUP_CHARS = 100_000_000;
export const DEFAULT_POLICY: LearningPolicy = {
  wrongDelayMs: 10 * MINUTE,
  successIntervalsMs: [4 * 60 * MINUTE, DAY, 2 * DAY, 4 * DAY, 7 * DAY],
  minimumEvidence: 5,
  sessionSize: 15,
  newItemFraction: 0.2,
};
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
export const safeId = (id: unknown): id is string => typeof id === 'string' && id.length > 0 && id.length <= 300 && !unsafeKeys.has(id);
const dict = <T>(): Record<string, T> => Object.create(null) as Record<string, T>;
export function createAttemptId(prefix = 'attempt'): string {
  return `${prefix.slice(0, 80)}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
}
export function emptyLearningState(moduleId: string): LearningState {
  return { version: 1, moduleId, revision: 0, updatedAt: 0, clearedAt: 0, legacyMigrated: false, policy: { ...DEFAULT_POLICY, successIntervalsMs: [...DEFAULT_POLICY.successIntervalsMs] }, questions: dict(), recentEventIds: [] };
}
const orderEvents = (a: AttemptEvent, b: AttemptEvent) => a.at - b.at || a.eventId.localeCompare(b.eventId);
function recentUnion(...lists: AttemptEvent[][]): AttemptEvent[] {
  const byId = new Map<string, AttemptEvent>();
  for (const list of lists) for (const event of list) byId.set(event.eventId, event);
  return [...byId.values()].sort(orderEvents).slice(-HISTORY_LIMIT);
}
export function summarizeQuestion(sources: Record<string, SourceProgress>, legacy?: LegacyProgress): QuestionLearning {
  const rows = Object.values(sources);
  const recent = recentUnion(...rows.map(row => row.recent));
  const latest = recent[recent.length - 1];
  const latestSource = rows.filter(row => row.recent.length).sort((a, b) => {
    const ea = a.recent[a.recent.length - 1], eb = b.recent[b.recent.length - 1];
    return orderEvents(eb, ea);
  })[0];
  const known = rows.reduce((sum, row) => sum + row.attempts, 0);
  const lastIsLegacy = legacy && (!latest || legacy.at > latest.at);
  return {
    sources, legacy,
    attempts: known + (legacy?.n ?? 0),
    correct: rows.reduce((sum, row) => sum + row.correct, 0),
    wrong: rows.reduce((sum, row) => sum + row.wrong, 0),
    legacyAttempts: legacy?.n ?? 0,
    lastCorrect: lastIsLegacy ? legacy.lastCorrect : latest?.correct,
    lastAttemptAt: lastIsLegacy ? legacy.at : latest?.at,
    studiedCount: rows.reduce((sum, row) => sum + row.studiedCount, 0),
    studiedAt: Math.max(0, ...rows.map(row => row.studiedAt ?? 0)) || undefined,
    recent,
    streak: latestSource?.streak ?? 0,
    spacedSuccesses: latestSource?.spacedSuccesses ?? 0,
    // An old attempt can be queued without claiming to know its full history.
    dueAt: latestSource?.dueAt ?? (legacy ? legacy.at : undefined),
  };
}
function emptySource(): SourceProgress {
  return { attempts: 0, correct: 0, wrong: 0, studiedCount: 0, recent: [], updatedAt: 0, streak: 0, spacedSuccesses: 0 };
}
function cleanEvent(input: AttemptInput, now: number): AttemptEvent {
  if (!safeId(input.questionId) || typeof input.correct !== 'boolean') throw new Error('Invalid question attempt.');
  const eventId = input.eventId ?? createAttemptId();
  if (!safeId(eventId)) throw new Error('Invalid attempt identifier.');
  const at = input.at ?? now;
  if (!Number.isFinite(at) || at < 0 || at > now + DAY) throw new Error('Invalid attempt time.');
  const out: AttemptEvent = { questionId: input.questionId, correct: input.correct, eventId, at };
  if (input.selectedIndex !== undefined && Number.isInteger(input.selectedIndex) && input.selectedIndex >= 0 && input.selectedIndex < 100) out.selectedIndex = input.selectedIndex;
  if (input.durationMs !== undefined && Number.isFinite(input.durationMs) && input.durationMs >= 0) out.durationMs = Math.min(input.durationMs, DAY);
  if (input.confidence && ['sure', 'unsure', 'guess'].includes(input.confidence)) out.confidence = input.confidence;
  if (input.source && ['practice', 'browse', 'exam', 'review'].includes(input.source)) out.source = input.source;
  if (typeof input.mistakeReason === 'string') out.mistakeReason = input.mistakeReason.trim().slice(0, 240);
  return out;
}
export function applyAttempts(state: LearningState, inputs: AttemptInput[], sourceId: string, now = Date.now()): LearningState {
  if (!safeId(sourceId)) throw new Error('Invalid learning source.');
  if (!inputs.length) return state;
  const events = inputs.map(input => cleanEvent(input, now)).sort(orderEvents);
  const seen = new Set(state.recentEventIds);
  const questions = { ...state.questions };
  let changed = false;
  for (const event of events) {
    const current = questions[event.questionId] ?? summarizeQuestion(dict());
    if (event.at < state.clearedAt || seen.has(event.eventId) || current.recent.some(row => row.eventId === event.eventId)) continue;
    if (event.at === current.lastAttemptAt) event.at += 1;
    const source = { ...(current.sources[sourceId] ?? emptySource()) };
    source.attempts += 1;
    source.correct += Number(event.correct);
    source.wrong += Number(!event.correct);
    source.recent = recentUnion(source.recent, [event]);
    source.updatedAt = Math.max(source.updatedAt, event.at);
    // Early repetitions count as attempts, but cannot earn a longer interval or mastery.
    // Guesses/unsure correct answers also need another recall at the short interval.
    const isLatest = event.at >= (current.lastAttemptAt ?? 0);
    if (isLatest) {
      source.streak = event.correct ? current.streak + 1 : 0;
      const uncertain = event.confidence === 'guess' || event.confidence === 'unsure';
      if (!event.correct || uncertain) {
        source.spacedSuccesses = 0;
        source.dueAt = event.at + state.policy.wrongDelayMs;
      } else if (current.lastAttemptAt === undefined || (current.dueAt !== undefined && event.at >= current.dueAt)) {
        source.spacedSuccesses = Math.min(current.spacedSuccesses + 1, state.policy.successIntervalsMs.length);
        source.dueAt = event.at + state.policy.successIntervalsMs[source.spacedSuccesses - 1];
      } else {
        source.spacedSuccesses = current.spacedSuccesses;
        source.dueAt = current.dueAt ?? event.at + state.policy.successIntervalsMs[0];
      }
    } else {
      source.streak = current.streak;
      source.spacedSuccesses = current.spacedSuccesses;
      source.dueAt = current.dueAt;
    }
    questions[event.questionId] = summarizeQuestion({ ...current.sources, [sourceId]: source }, current.legacy);
    seen.add(event.eventId);
    changed = true;
  }
  return changed ? { ...state, questions, recentEventIds: [...seen].slice(-REPLAY_LIMIT), revision: state.revision + 1, updatedAt: now } : state;
}
export function markQuestionStudied(state: LearningState, questionId: string, sourceId: string, now = Date.now()): LearningState {
  if (!safeId(questionId) || !safeId(sourceId)) throw new Error('Invalid question identifier.');
  const current = state.questions[questionId] ?? summarizeQuestion(dict());
  // Double taps and strict-mode callbacks should not inflate a reading count.
  if (current.studiedAt && now - current.studiedAt < MINUTE) return state;
  const source = { ...(current.sources[sourceId] ?? emptySource()) };
  source.studiedCount += 1;
  source.studiedAt = now;
  source.updatedAt = now;
  return { ...state, questions: { ...state.questions, [questionId]: summarizeQuestion({ ...current.sources, [sourceId]: source }, current.legacy) }, revision: state.revision + 1, updatedAt: now };
}
export function annotateLearningAttempt(state: LearningState, eventId: string, patch: { mistakeReason?: string }, now = Date.now()): LearningState {
  for (const [id, question] of Object.entries(state.questions)) {
    for (const [sourceId, source] of Object.entries(question.sources)) {
      if (!source.recent.some(event => event.eventId === eventId)) continue;
      const nextSource = { ...source, updatedAt: now, recent: source.recent.map(event => event.eventId === eventId ? { ...event, mistakeReason: patch.mistakeReason?.trim().slice(0, 240) } : event) };
      return { ...state, questions: { ...state.questions, [id]: summarizeQuestion({ ...question.sources, [sourceId]: nextSource }, question.legacy) }, revision: state.revision + 1, updatedAt: now };
    }
  }
  return state;
}
export function migrateLegacy(state: LearningState, raw: unknown): LearningState {
  if (state.legacyMigrated) return state;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Old progress has an invalid format.');
  const questions = { ...state.questions };
  for (const [id, row] of Object.entries(raw)) {
    if (!safeId(id) || !row || typeof row !== 'object') throw new Error('Old progress contains an invalid question.');
    const p = row as LegacyProgress;
    if (!Number.isSafeInteger(p.n) || p.n < 1 || typeof p.lastCorrect !== 'boolean' || !Number.isFinite(p.at) || p.at < 0) throw new Error('Old progress contains invalid counts.');
    const current = questions[id];
    const legacy = current?.legacy && current.legacy.n > p.n ? current.legacy : { n: p.n, lastCorrect: p.lastCorrect, at: p.at };
    questions[id] = summarizeQuestion(current?.sources ?? dict(), legacy);
  }
  return { ...state, questions, legacyMigrated: true, revision: state.revision + 1 };
}
/** Merge cumulative counters by their original browser identity. Reimporting a backup
 * cannot count it twice; unrelated browser histories retain separate counters. */
export function mergeLearningStates(a: LearningState, b: LearningState): LearningState {
  if (a === b) return a;
  if (a.moduleId !== b.moduleId) throw new Error('This backup belongs to a different module.');
  if (a.clearedAt !== b.clearedAt) return a.clearedAt > b.clearedAt ? a : b;
  if (a === b) return a;
  const questions = { ...a.questions };
  for (const [id, incoming] of Object.entries(b.questions)) {
    const current = questions[id];
    if (current === incoming) continue;
    if (!current) { questions[id] = incoming; continue; }
    const sources = { ...current.sources };
    for (const [sourceId, other] of Object.entries(incoming.sources)) {
      const existing = sources[sourceId];
      if (existing === other) continue;
      if (!existing) { sources[sourceId] = other; continue; }
      const later = existing.updatedAt >= other.updatedAt ? existing : other;
      const correct = Math.max(existing.correct, other.correct), wrong = Math.max(existing.wrong, other.wrong);
      sources[sourceId] = { ...later, attempts: correct + wrong, correct, wrong, studiedCount: Math.max(existing.studiedCount, other.studiedCount), studiedAt: Math.max(existing.studiedAt ?? 0, other.studiedAt ?? 0) || undefined, recent: existing.updatedAt >= other.updatedAt ? recentUnion(other.recent, existing.recent) : recentUnion(existing.recent, other.recent) };
    }
    const legacy = !current.legacy ? incoming.legacy : !incoming.legacy ? current.legacy : current.legacy.n >= incoming.legacy.n ? current.legacy : incoming.legacy;
    questions[id] = summarizeQuestion(sources, legacy);
  }
  const later = a.updatedAt >= b.updatedAt ? a : b;
  return { ...later, questions, legacyMigrated: a.legacyMigrated || b.legacyMigrated, revision: Math.max(a.revision, b.revision), updatedAt: Math.max(a.updatedAt, b.updatedAt), recentEventIds: [...new Set([...a.recentEventIds, ...b.recentEventIds])].slice(-REPLAY_LIMIT) };
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 1_000_000_000;
const stamp = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 8.64e15;
/** Strict input validation. Derived totals are rebuilt, never trusted from a file. */
export function parseLearningState(json: string, moduleId: string): LearningState {
  if (json.length > MAX_BACKUP_CHARS) throw new Error('This learning backup is too large.');
  let value: unknown;
  try { value = JSON.parse(json); } catch { throw new Error('The learning backup is not valid JSON.'); }
  if (!object(value) || value.version !== 1 || value.moduleId !== moduleId || !object(value.questions)) throw new Error('This is not a supported learning backup for this module.');
  if (!count(value.revision) || !stamp(value.updatedAt) || !stamp(value.clearedAt) || typeof value.legacyMigrated !== 'boolean') throw new Error('The learning backup has invalid metadata.');
  const policy = value.policy;
  if (!object(policy) || !stamp(policy.wrongDelayMs) || policy.wrongDelayMs < MINUTE || policy.wrongDelayMs > DAY || !Array.isArray(policy.successIntervalsMs) || policy.successIntervalsMs.length < 1 || policy.successIntervalsMs.length > 10 || !policy.successIntervalsMs.every((n, i, all) => stamp(n) && n >= MINUTE && n <= 30 * DAY && (i === 0 || n >= all[i - 1])) || !count(policy.minimumEvidence) || policy.minimumEvidence < 3 || policy.minimumEvidence > 100 || !count(policy.sessionSize) || policy.sessionSize < 10 || policy.sessionSize > 20 || typeof policy.newItemFraction !== 'number' || policy.newItemFraction < 0 || policy.newItemFraction > 0.5) throw new Error('The learning backup has invalid review settings.');
  if (!Array.isArray(value.recentEventIds) || value.recentEventIds.length > REPLAY_LIMIT || !value.recentEventIds.every(safeId)) throw new Error('The learning backup has invalid event identifiers.');
  const entries = Object.entries(value.questions);
  if (entries.length > 100_000) throw new Error('The learning backup contains too many questions.');
  const questions = dict<QuestionLearning>();
  for (const [id, q] of entries) {
    if (!safeId(id) || !object(q) || !object(q.sources) || Object.keys(q.sources).length > 64) throw new Error('The learning backup contains an invalid question.');
    const sources = dict<SourceProgress>();
    for (const [sourceId, row] of Object.entries(q.sources)) {
      if (!safeId(sourceId) || !object(row) || !count(row.attempts) || !count(row.correct) || !count(row.wrong) || row.correct + row.wrong !== row.attempts || !count(row.studiedCount) || !stamp(row.updatedAt) || !count(row.streak) || !count(row.spacedSuccesses) || row.spacedSuccesses > 10 || (row.dueAt !== undefined && !stamp(row.dueAt)) || (row.studiedAt !== undefined && !stamp(row.studiedAt)) || !Array.isArray(row.recent) || row.recent.length > HISTORY_LIMIT) throw new Error('The learning backup contains invalid progress counts.');
      const recent = row.recent.map(event => {
        if (!object(event) || event.questionId !== id || !safeId(event.eventId) || !stamp(event.at) || typeof event.correct !== 'boolean') throw new Error('The learning backup contains an invalid attempt.');
        return cleanEvent(event as unknown as AttemptInput, Math.max(Date.now(), event.at));
      }).sort(orderEvents);
      if (new Set(recent.map(e => e.eventId)).size !== recent.length || recent.length > row.attempts || recent.filter(e => e.correct).length > row.correct || recent.filter(e => !e.correct).length > row.wrong) throw new Error('The learning backup contains inconsistent attempt history.');
      if (row.attempts > 0 && recent.length === 0) throw new Error('The learning backup is missing its latest attempt.');
      sources[sourceId] = { attempts: row.attempts, correct: row.correct, wrong: row.wrong, studiedCount: row.studiedCount, studiedAt: row.studiedAt as number | undefined, updatedAt: row.updatedAt, streak: row.streak, spacedSuccesses: row.spacedSuccesses, dueAt: row.dueAt as number | undefined, recent };
    }
    let legacy: LegacyProgress | undefined;
    if (q.legacy !== undefined) {
      const p = q.legacy;
      if (!object(p) || !count(p.n) || p.n < 1 || typeof p.lastCorrect !== 'boolean' || !stamp(p.at)) throw new Error('The learning backup contains invalid old progress.');
      legacy = { n: p.n, lastCorrect: p.lastCorrect, at: p.at };
    }
    questions[id] = summarizeQuestion(sources, legacy);
  }
  return { version: 1, moduleId, revision: value.revision, updatedAt: value.updatedAt, clearedAt: value.clearedAt, legacyMigrated: value.legacyMigrated, policy: policy as unknown as LearningPolicy, questions, recentEventIds: [...value.recentEventIds] as string[] };
}
