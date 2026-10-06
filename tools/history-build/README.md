# History content authoring

This module turns the nine supplied MS Academy PPTX presentations into a learning path and question practice. It lives at `/history` in India Study Map. Start with `HISTORY-HANDOFF.md` for the delivery state and browser verification limits.

## Files to edit

| File | Responsibility | Rebuild behaviour |
| --- | --- | --- |
| `curriculum.mjs` | Eras, topic summaries, checkpoints, related topics, source ranges, coverage gaps, corrections | Curated input; never overwritten |
| `questions.mjs` | Original practice MCQs, explanations, answer indexes, revisions, source references | Curated input; never overwritten |
| `build.mjs` | Builds runtime JSON and maps transcribed mains prompts to topics | Does not change extracted source text |
| `extract.py` | Reads PPTX slide order, text and supported images with the Python standard library | Replaces `sources.json`; copies source media |
| `public/history/data/curriculum.json` | Runtime curriculum and mains prompts | Generated: do not hand-edit |
| `public/history/data/questions.json` | Runtime MCQs | Generated: do not hand-edit |
| `public/history/data/sources.json` | Original source text, slide numbers, filenames, SHA-256 hashes | Generated: do not hand-edit |
| `src/modules/history/` | React views, styles, progress and review logic | Independent of content generation |

Commands from the project root:

```sh
# Only when the source presentations change:
python3 tools/history-build/extract.py --source-dir /absolute/path/to/presentations

# After editing authoring inputs:
npm run history:build
npm run history:check
npm run build
```

No model API or API key is required. A model can read and edit the authoring inputs directly; end users only download the generated JSON and source images.

## Learning model

The learning loop is **read → explain from memory → practise → revisit**.

Eight era groups are teaching categories, not mutually exclusive historical boundaries. Topics are in learning order inside each era. The mind map uses these groups and explicit `related` links. Chronicle remains the separate continuous timeline.

Each starter topic has a short orientation, at least three checkpoints, source reading and at least one MCQ. A `gap` identifies a topic that still needs a lesson; it cannot be marked studied and has no MCQs. The source reader preserves original wording and displays correction notices separately. All teaching slides are indexed, including cover and image slides. The 14 mains-question slides are indexed in the separate writing desk.

This is a source-derived curriculum, not a claim of complete coverage of a current official MPSC syllabus. In particular, full lesson authoring and a larger MCQ bank are still needed.

## Topic contract

Use a stable lowercase hyphenated ID. Example authoring helper:

```js
t(
  'new-topic', 'ancient', 'Human-readable title', 'Historical period',
  'An explanation of what this topic helps the learner understand.',
  ['First concrete checkpoint', 'Second checkpoint', 'Third checkpoint'],
  [r('ancient', 12, 15)], // 1-based presentation slide numbers, inclusive
  ['harappa'],           // existing topic IDs for connections
  'starter'
)
```

Do not rename IDs when rewording titles: reading progress and notes use them. Keep gaps visible until substantive content and source references are available. If adding a new source type, extend extraction and validation deliberately; the current extractor handles the nine named PPTX files, not arbitrary PDFs or OCR.

Do not reinterpret a whole era merely because a filename includes it. Some decks span multiple periods. Source ranges were assigned by their actual contents; overlaps are intentional. The validator rejects orphaned slides and out-of-range references.

## MCQ contract

```js
q(
  'h090', 'harappa', 'A clear, unambiguous question?',
  ['Plausible option A', 'Correct option B', 'Plausible option C', 'Plausible option D'],
  1, // zero-based answer index
  'Why B is correct, and what distinction rules out the distractors.',
  'ancient', 24,
  'foundation' // or 'application'
)
```

Every question must have exactly four distinct options, one supported answer, an explanation, a stable ID, a positive `revision`, a valid topic, and valid source references. The UI shuffles options while retaining their original indexes; never calculate correctness from displayed letters.

The helper initially emits a single-slide reference. Add a range in `rangeCorrections`, or explicit additional `sources`, when a heading or continuation slide is necessary. All references must fit within the lesson's mapped sources. Add `evidence: [{ title, url }]` for an external authority, especially when correcting an error in the slides.

The current MCQs are newly authored **derived practice**, not official PYQs. `reviewStatus: 'source-checked'` means compared to the supplied source passages, with explicit supplements for corrections; it is not an independent historian's certification. Do not infer an official key from a lecture deck or an AI answer. Do not turn an unresolved source claim into a quiz answer.

Increment `revision` when the answer, options or substantive claim changes. Progress keys use `id@revision`, so stale attempts will no longer imply recall of a corrected question. Add new questions with new IDs; do not reuse retired IDs.

Aim next for several distinct question types per topic: comparison, sequence, cause/effect, statement evaluation and evidence interpretation. Avoid inflating counts through synonymous questions or implausible distractors. The first bank is predominantly foundation recall and should be expanded before it is treated as an exam simulator.

## Mains prompts

`build.mjs` preserves the 47 extracted prompt paragraphs exactly, including source wording, marks and any alternative question within one paragraph. It carries the year forward across the continuation slides for 2025. `pyqMapping` explicitly links every paragraph to a topic. A length guard prevents silent text loss if a presentation changes.

These prompts have not been checked against original official papers. Do not relabel them as official-key-verified. The writing desk saves user drafts and counts words; it does not grade answers or supply model answers.

## Corrections and provenance

Keep original extraction untouched. Add an item to `reviews` with the source ID, slide number, topic ID, `open` or `corrected` status, a precise note, and evidence links. Corrected items require at least one evidence link. Where the same error is repeated in another deck, attach a separate review to that slide so the reader sees it in context.

The initial review includes Harappan phase dates, Prarthana Samaj, Andhra naming, Poona Pact details, and Sarojini Naidu's Congress presidency. Open issues include Rashtrakuta/Chola dates and a Gupta patronage generalisation. Other slide claims remain unaudited. In particular, don't mistake typed source text for a fact-checked textbook.

## Progress contract

Storage key: `history-atlas:v1:<user-id>` or `history-atlas:v1:guest`.

Progress is browser-local and profile-scoped. It does not sync to the existing question-bank API, award XP, or migrate guest progress automatically when logging in. Export and restore support moving work between browsers or profiles.

- `studied`: topic ID → timestamp, explicitly set by the learner.
- `notes`, `drafts`, `flags`: topic ID, mains ID, or question revision key → text.
- `questions`: question revision key → attempt/correct counts, latest correctness, streak, last and next review timestamps.
- `lastTopic`: reading resume pointer.

Wrong answers become due immediately. Successive correct responses use 1, 3, 7, 14 and 30 day intervals. This is a simple review schedule, not a scientifically calibrated mastery estimate. Topic accuracy uses the latest response to each unique question, so repeatedly answering one question does not inflate topic coverage.

Export files use schema version 1. Imports are validated and merged: later question timestamps win, and existing nonempty notes and drafts take precedence. Unknown but safe IDs are retained for future content compatibility. Corrupt stored progress is not silently overwritten. Storage failures produce an export reminder. Quiz session position is not persisted; submitted answer statistics are.

## Checks and limitations

`history:check` verifies IDs, references, coverage, prompt preservation, duplicate options, generated-file freshness, review scheduling, question revisions, progress restoration, and server-rendering of all six views and all topic pages. It does not prove historical accuracy or replace browser tests.

Before deployment, use a normal browser to exercise the checklist in `HISTORY-HANDOFF.md`, including mobile layout, keyboard controls, source images, complete quiz flows and import/export.
