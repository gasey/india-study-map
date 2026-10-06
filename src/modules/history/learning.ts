import type {
  Progress,
  Question,
  QuestionProgress,
  PracticeMode,
} from "./types";
export const emptyProgress = (): Progress => ({
  schemaVersion: 1,
  studied: {},
  notes: {},
  drafts: {},
  questions: {},
  flags: {},
  lastTopic: null,
});
export const questionKey = (q: Question) => `${q.id}@${q.revision}`;
export function nextReview(
  previous: QuestionProgress | undefined,
  correct: boolean,
  now = Date.now(),
): QuestionProgress {
  const streak = correct ? (previous?.streak ?? 0) + 1 : 0;
  const days = correct ? [1, 3, 7, 14, 30][Math.min(streak - 1, 4)] : 0;
  return {
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + Number(correct),
    streak,
    lastCorrect: correct,
    lastAt: now,
    dueAt: now + days * 86400000,
  };
}
export function filterPractice(
  questions: Question[],
  progress: Progress,
  mode: PracticeMode,
  now = Date.now(),
) {
  return questions.filter((q) => {
    const p = progress.questions[questionKey(q)];
    return (
      mode === "mixed" ||
      (mode === "new" && !p) ||
      (mode === "incorrect" && p && !p.lastCorrect) ||
      (mode === "due" && p && p.dueAt <= now)
    );
  });
}
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function topicStats(
  topicId: string,
  questions: Question[],
  progress: Progress,
) {
  const pool = questions.filter((q) => q.topicId === topicId);
  const attempted = pool.filter((q) => progress.questions[questionKey(q)]);
  const correct = attempted.filter(
    (q) => progress.questions[questionKey(q)].lastCorrect,
  );
  return {
    total: pool.length,
    attempted: attempted.length,
    correct: correct.length,
    accuracy: attempted.length
      ? Math.round((correct.length / attempted.length) * 100)
      : null,
  };
}
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const safeId = (key: string) =>
  /^[a-z0-9][a-z0-9@-]{0,100}$/.test(key) && key !== "constructor";
const number = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
export function parseProgress(value: unknown): Progress {
  if (!record(value) || value.schemaVersion !== 1)
    throw new Error("This is not a History Atlas v1 progress file.");
  const out = emptyProgress();
  for (const field of [
    "studied",
    "notes",
    "drafts",
    "questions",
    "flags",
  ] as const)
    if (!record(value[field]))
      throw new Error(`Missing or invalid ${field} data.`);
  for (const [key, v] of Object.entries(
    value.studied as Record<string, unknown>,
  )) {
    if (!safeId(key) || !number(v)) throw new Error("Invalid study progress.");
    out.studied[key] = v;
  }
  for (const field of ["notes", "drafts", "flags"] as const) {
    for (const [key, v] of Object.entries(
      value[field] as Record<string, unknown>,
    )) {
      if (!safeId(key) || typeof v !== "string" || v.length > 50000)
        throw new Error("Invalid note or draft.");
      out[field][key] = v;
    }
  }
  for (const [key, v] of Object.entries(
    value.questions as Record<string, unknown>,
  )) {
    if (
      !safeId(key) ||
      !record(v) ||
      !["attempts", "correct", "streak", "lastAt", "dueAt"].every((f) =>
        number(v[f]),
      ) ||
      typeof v.lastCorrect !== "boolean" ||
      !Number.isInteger(v.attempts) ||
      !Number.isInteger(v.correct) ||
      !Number.isInteger(v.streak) ||
      Number(v.attempts) < 1 ||
      Number(v.correct) > Number(v.attempts) ||
      Number(v.streak) > Number(v.correct)
    )
      throw new Error("Invalid question progress.");
    out.questions[key] = {
      attempts: Number(v.attempts),
      correct: Number(v.correct),
      streak: Number(v.streak),
      lastCorrect: v.lastCorrect,
      lastAt: Number(v.lastAt),
      dueAt: Number(v.dueAt),
    };
  }
  if (
    value.lastTopic !== null &&
    (typeof value.lastTopic !== "string" || !safeId(value.lastTopic))
  )
    throw new Error("Invalid last topic.");
  out.lastTopic = value.lastTopic as string | null;
  return out;
}
// Restore is additive: newer attempts win, existing nonempty notes/drafts are preserved.
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  const merged: Progress = {
    ...current,
    studied: { ...current.studied },
    questions: { ...current.questions },
    notes: { ...incoming.notes, ...current.notes },
    drafts: { ...incoming.drafts, ...current.drafts },
    flags: { ...incoming.flags, ...current.flags },
    lastTopic: current.lastTopic ?? incoming.lastTopic,
  };
  for (const [key, time] of Object.entries(incoming.studied))
    merged.studied[key] = Math.max(time, merged.studied[key] ?? 0);
  for (const [key, p] of Object.entries(incoming.questions))
    if (!merged.questions[key] || p.lastAt > merged.questions[key].lastAt)
      merged.questions[key] = p;
  for (const field of ["notes", "drafts", "flags"] as const)
    for (const [key, text] of Object.entries(incoming[field]))
      if (!merged[field][key]) merged[field][key] = text;
  return merged;
}
