import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { questions } from "./questions.mjs";
// Bundle the same pure functions the UI uses. No browser or new test dependency needed.
const result = await build({
  entryPoints: [
    fileURLToPath(
      new URL("../../src/modules/history/learning.ts", import.meta.url),
    ),
  ],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const {
  emptyProgress,
  filterPractice,
  mergeProgress,
  nextReview,
  parseProgress,
  questionKey,
  shuffled,
  topicStats,
} = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
const now = 1800000000000;
let p = emptyProgress();
const q = questions[0],
  key = questionKey(q);
assert.equal(filterPractice(questions, p, "new", now).length, questions.length);
assert.equal(filterPractice(questions, p, "incorrect", now).length, 0);
assert.equal(filterPractice(questions, p, "due", now).length, 0);
p.questions[key] = nextReview(undefined, false, now);
assert.equal(filterPractice(questions, p, "incorrect", now).length, 1);
assert.equal(filterPractice(questions, p, "due", now).length, 1);
assert.equal(
  filterPractice(questions, p, "new", now).length,
  questions.length - 1,
);
let previous = p.questions[key];
for (const days of [1, 3, 7, 14, 30, 30]) {
  previous = nextReview(previous, true, now);
  assert.equal(previous.dueAt, now + days * 86400000);
}
assert.equal(previous.attempts, 7);
assert.equal(previous.correct, 6);
assert.equal(nextReview(previous, false, now).streak, 0);
p.questions[key] = nextReview(p.questions[key], true, now);
assert.equal(filterPractice(questions, p, "incorrect", now).length, 0);
assert.equal(filterPractice(questions, p, "due", now).length, 0);
assert.equal(filterPractice(questions, p, "due", now + 86400000).length, 1);
assert.equal(topicStats(q.topicId, questions, p).correct, 1);
const revised = { ...q, revision: q.revision + 1 };
assert.equal(
  filterPractice([revised], p, "new", now).length,
  1,
  "Revised answer keys require new evidence.",
);
assert.deepEqual(parseProgress(JSON.parse(JSON.stringify(p))), p);
for (const bad of [
  null,
  [],
  {},
  { ...p, schemaVersion: 2 },
  { ...p, questions: { [key]: { ...p.questions[key], correct: 999 } } },
  { ...p, notes: { invalid: 2 } },
  { ...p, lastTopic: "__proto__" },
  { ...p, questions: { [key]: { ...p.questions[key], dueAt: Infinity } } },
  { ...p, studied: { constructor: 123 } },
  { ...p, questions: { [key]: { ...p.questions[key], attempts: 1.5 } } },
])
  assert.throws(() => parseProgress(bad));
const incoming = emptyProgress();
incoming.notes[q.topicId] = "Imported";
incoming.drafts["mains-1-1"] = "Draft";
incoming.studied[q.topicId] = now;
incoming.questions[key] = nextReview(p.questions[key], false, now + 1);
p.notes[q.topicId] = "Keep mine";
const merged = mergeProgress(p, incoming);
assert.equal(merged.notes[q.topicId], "Keep mine");
assert.equal(merged.drafts["mains-1-1"], "Draft");
assert.equal(merged.questions[key].lastCorrect, false);
assert.equal(
  p.questions[key].lastCorrect,
  true,
  "Merge must not mutate current progress.",
);
assert.equal(
  mergeProgress(merged, p).questions[key].lastCorrect,
  false,
  "An older import cannot roll back newer attempts.",
);
for (const random of [() => 0, () => 0.5, () => 0.99999]) {
  const original = [0, 1, 2, 3];
  const order = shuffled(original, random);
  assert.deepEqual([...order].sort(), original);
  assert.deepEqual(original, [0, 1, 2, 3]);
  for (const question of questions)
    assert.equal(
      order.filter((index) => index === question.answerIndex).length,
      1,
      "Every shuffled question must retain exactly one correct answer.",
    );
}
console.log(
  "Learning checks passed: review intervals, retry queues, revision resets, topic statistics, progress validation/merge and option shuffling.",
);
