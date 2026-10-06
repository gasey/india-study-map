import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eras, topics, reviews, metadata } from "./curriculum.mjs";
import { questions as authoredQuestions } from "./questions.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const read = (name) =>
  JSON.parse(
    fs.readFileSync(
      path.join(root, "public/history/data", name + ".json"),
      "utf8",
    ),
  );
const c = read("curriculum"),
  { questions } = read("questions"),
  { documents } = read("sources");
const unique = (items, label) =>
  assert.equal(
    new Set(items.map((x) => x.id)).size,
    items.length,
    `Duplicate ${label} ID`,
  );
const text = (value, label) =>
  assert.ok(typeof value === "string" && value.trim(), `Empty ${label}`);
const map = new Map(documents.map((d) => [d.id, d]));
const topicMap = new Map(c.topics.map((t) => [t.id, t]));
assert.equal(c.schemaVersion, 1);
assert.equal(read("questions").schemaVersion, 1);
assert.equal(read("sources").schemaVersion, 1);
unique(documents, "source");
unique(c.eras, "era");
unique(c.topics, "topic");
unique(questions, "question");
unique(c.mainsQuestions, "mains");
unique(c.reviews, "review");
assert.deepEqual(
  c.topics,
  topics,
  "Generated curriculum is stale; run history:build.",
);
assert.deepEqual(c.eras, eras);
assert.deepEqual(c.reviews, reviews);
assert.equal(c.version, metadata.version);
assert.deepEqual(
  questions,
  authoredQuestions,
  "Generated questions are stale; run history:build.",
);
const coverage = new Map(documents.map((d) => [d.id, new Set()]));
function refs(references, owner, mark = false) {
  assert.ok(Array.isArray(references), `Missing references: ${owner}`);
  for (const r of references) {
    const d = map.get(r.sourceId);
    assert.ok(d, `Unknown source: ${owner}`);
    assert.ok(
      Number.isInteger(r.from) &&
        Number.isInteger(r.to) &&
        r.from >= 1 &&
        r.from <= r.to &&
        r.to <= d.slideCount,
      `Invalid slide range: ${owner}`,
    );
    if (mark)
      for (let n = r.from; n <= r.to; n++) coverage.get(r.sourceId).add(n);
  }
}
for (const d of documents) {
  assert.equal(d.slides.length, d.slideCount, `Slide count mismatch: ${d.id}`);
  assert.match(d.sha256, /^[a-f0-9]{64}$/);
  d.slides.forEach((s, i) => {
    assert.equal(s.number, i + 1, `Slide order: ${d.id}`);
    assert.ok(Array.isArray(s.paragraphs));
    assert.ok(s.paragraphs.every((p) => typeof p === "string"));
    assert.ok(s.images.length <= s.imageCount);
    for (const image of s.images) {
      assert.match(image, /^\/history\/media\/[a-z0-9.-]+$/i);
      assert.ok(
        fs.existsSync(path.join(root, "public", image)),
        `Missing image: ${image}`,
      );
    }
  });
}
for (const t of c.topics) {
  assert.ok(
    c.eras.some((e) => e.id === t.eraId),
    `Unknown era: ${t.id}`,
  );
  text(t.title, t.id);
  text(t.summary, t.id);
  assert.ok(t.checkpoints.length >= 3);
  t.checkpoints.forEach((p) => text(p, t.id));
  assert.ok(["starter", "gap"].includes(t.status));
  assert.equal(
    t.sources.length === 0,
    t.status === "gap",
    `Unsupported topic must be a gap: ${t.id}`,
  );
  refs(t.sources, t.id, true);
  t.related.forEach((id) =>
    assert.ok(
      topicMap.has(id) && id !== t.id,
      `Broken connection: ${t.id} → ${id}`,
    ),
  );
}
for (const q of questions) {
  assert.ok(topicMap.has(q.topicId), `Unknown topic: ${q.id}`);
  assert.notEqual(
    topicMap.get(q.topicId).status,
    "gap",
    `MCQ on unbuilt lesson: ${q.id}`,
  );
  text(q.prompt, q.id);
  text(q.explanation, q.id);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map((o) => o.toLowerCase().trim())).size, 4);
  q.options.forEach((o) => text(o, q.id));
  assert.ok(
    Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < 4,
    `Invalid answer: ${q.id}`,
  );
  assert.ok(Number.isInteger(q.revision) && q.revision >= 1);
  assert.equal(q.provenance, "derived");
  assert.ok(["foundation", "application"].includes(q.difficulty));
  assert.ok(q.sources.length);
  refs(q.sources, q.id);
  for (const ref of q.sources)
    assert.ok(
      topicMap
        .get(q.topicId)
        .sources.some(
          (r) =>
            r.sourceId === ref.sourceId && r.from <= ref.from && r.to >= ref.to,
        ),
      `Question source outside its lesson: ${q.id}`,
    );
}
const sourcePrompts = documents
  .find((d) => d.id === "mains-pyq")
  .slides.flatMap((s) =>
    s.paragraphs.filter((p, i) => !(i === 0 && /^20\d{2}\b/.test(p))),
  );
assert.deepEqual(
  c.mainsQuestions.map((q) => q.prompt),
  sourcePrompts,
  "Mains source text was lost, reordered or changed.",
);
for (const q of c.mainsQuestions) {
  assert.ok(topicMap.has(q.topicId));
  text(q.prompt, q.id);
  assert.ok(q.year >= 2012 && q.year <= 2025);
  assert.equal(q.officialPaperVerified, false);
  refs(q.sources, q.id, true);
}
for (const r of c.reviews) {
  assert.ok(topicMap.has(r.topicId));
  refs([{ sourceId: r.sourceId, from: r.slide, to: r.slide }], r.id);
  assert.ok(["open", "corrected"].includes(r.status));
  if (r.status === "corrected") assert.ok(r.evidence.length);
  r.evidence.forEach((e) => assert.match(e.url, /^https:\/\//));
}
for (const d of documents) {
  assert.equal(
    coverage.get(d.id).size,
    d.slideCount,
    `Unmapped source slides: ${d.id}`,
  );
}
assert.ok(
  c.topics
    .filter((t) => t.status === "starter")
    .every((t) => questions.some((q) => q.topicId === t.id)),
  "Starter topic has no practice question.",
);
console.log(
  `Content checks passed: ${documents.length} sources, ${documents.reduce((n, d) => n + d.slideCount, 0)} mapped slides, ${c.topics.length} topics, ${questions.length} MCQs, ${c.mainsQuestions.length} mains prompts.`,
);
console.log(
  "Checks validate structure and provenance links, not the historical accuracy of every source claim.",
);
