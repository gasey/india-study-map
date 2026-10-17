## Personal learning tracker — 11 October 2026

The module now has a browser-stored **My learning** section. Continue from
[HANDOFF-LEARNING-TRACKER.md](HANDOFF-LEARNING-TRACKER.md) for tracking/scoring
integration, migration, review intervals, future settings and website expansion.
Source/import coverage remains separate. Preserve stable question IDs and scoring
gates when importing or correcting content.

# UDC / LDC / Group B: subject practice contract

Updated 17 October 2026. User request: independent Maths/Arithmetic, English-only,
and Computer Knowledge sections; Maths organised by topic; future models must
follow this design when deriving answers or importing papers.

For the live MPSC archive audit and the remaining Gazetted English/Arithmetic
import queue, continue from [HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md).

For a repeatable review/solving workflow and a copyable prompt, read
[HANDOFF-REVIEW-GUIDE.md](HANDOFF-REVIEW-GUIDE.md). Its generated subject ledger
tracks English, Arithmetic, Computer, GK and Reasoning; answer readiness and
worked-guide completion are separate measures.

## Current design

The module has three dedicated tabs: **Maths / Arithmetic**, **English only**,
and **Computer Knowledge**. Their question pools are scoped with `sectionOf`
before topic, search, question-type or attempt filters. Existing general Browse
filters must never leak into these tabs. Progress and question IDs remain shared
with the rest of the module.

Maths and Computer Knowledge show topic cards. Each card shows both **ready to
practise** and **available to read** counts. Selecting a topic scopes both study
modes. Practise uses the existing `PracticeView` scoring gate; Read questions
uses the existing inline expandable paper browser, including source links,
images, explanations and correction tools. Source-review material remains
readable but never enters a scored drill merely because it acquired a topic tag.
Empty topics remain visible and disabled so future coverage gaps are apparent.

English has MCQs and Written English. Written mode opens Read questions and
contains descriptive prompts; it never presents a scored MCQ drill. MCQs have
Practise and Read questions. All three sections have search; MCQs also have All,
Not attempted and Previously wrong filters.

## Stable taxonomy

`src/modules/udc-ldc/studyTopics.ts` is the current display catalog.
Use these exact canonical `topic` IDs in new import/derivation inputs.

Maths:

- `number_system`: numbers, divisibility, fractions, roots and simplification
- `percentage`, `profit_loss`, `ratio_proportion`, `average`
- `simple_compound_interest`, `time_work`, `pipes_cisterns`
- `speed_distance_time`, `mixture_alligation`, `age_problems`
- `algebra`, `sequences_series`, `mensuration`, `trigonometry`
- `sets`, `statistics`, `data_interpretation`, `probability`
- `permutation_combination`

Computer Knowledge:

- `computer_basics`, `hardware_memory`, `operating_systems`
- `word_processing`, `spreadsheets`, `presentations`
- `internet_networking`, `security_privacy`, `databases`
- `programming`, `digital_collaboration`

Uncertain/unknown topics resolve to `mixed`, displayed as **Mixed / needs topic
review**. Broad old IDs (`general`, `simple_arithmetic`, `simple-arithmetic`,
`basic-computer-knowledge`, `computer-fundamentals`) must not silently be treated
as a precise subtopic. Hyphen/underscore versions of precise topic IDs resolve
identically. Unknown material must stay visible, not disappear from totals.

## Importing or deriving: required workflow

1. Read the printed question and any shared directions. Preserve its existing
   ID, paper ID, question number, option order, source link, passage and images.
2. Set `studySection` explicitly to `arithmetic`, `english` or `computer` from
   the question's content/printed subsection. A mixed paper's title is not
   sufficient to classify every question. Reasoning remains `reasoning`;
   assigning a Maths topic must not pull unrelated GK into Maths.
3. Set a canonical `topic` in durable generator inputs. Never hand-edit
   `mpsc-udc-ldc.ts` or `mpsc-group-b-general.ts`: both are generated.
4. Existing questions can receive durable, ID-based classification in
   `src/data/banks/mpsc-study-topic-tags.json`. This file is outside the bank
   generators so rebuilds preserve the classification. Its 114 initial tags
   were assigned by reading stored Maths/Computer stems, not by verifying PDF
   scans or answer keys. These tags make no claim about answer correctness.
   Stored overrides take precedence over `topic`; revisit the override when
   correcting a stem or changing a question's classification.
5. If a question spans topics, use the main method needed to solve it. If the
   stem/image is too unclear to establish that method, leave it Mixed and record
   the next review action. Do not use runtime keyword guesses to hide the gap.
6. A worked Maths explanation needs the setup, units, intermediate calculation,
   final value and its match to the printed option. Preserve fractions, powers,
   radicals and diagrams; attach the source crop when text loses notation.
   Computer explanations must distinguish versions when the answer depends on
   a product or standard. Topic assignment alone never sets `sourceReviewed`,
   supplies an answer index, changes confidence, or grants Exam eligibility.
7. For a new topic, update the catalog and `TOPIC_SECTION` in `filters.ts`, plus
   the relevant generator taxonomy if used. Check the ID's resolved section,
   source coverage and both topic counts. Existing IDs/progress must survive.

## English transcription and solving-guide quality

Apply these rules to all imported/archive questions, including older papers:

- Match the official PDF exactly for wording, capitalization, punctuation,
  bold/italic emphasis, underlining, visible blank runs, section directions,
  passages and subpart labels. Keep shared instructions connected to all
  dependent questions.
- Do not quietly fix a typo or rewrite awkward source English. Record a
  correction or uncertain OCR reading in `sourceNote` and retain enough source
  context to audit it against the PDF.
- In fill-in-the-blank stems, leave the blank unfilled. Store an answer only in
  the answer field after verification. Use Written English for a free response;
  use MCQ only when choices are printed in the paper. Never manufacture choices.
- A useful English MCQ explanation names the grammar, punctuation, usage or
  context rule and says why the selected printed choice fits. A useful Maths
  explanation shows setup, intermediate steps and units. A written prompt gets
  a rubric or approach outline, not an invented unique answer.
- Preserve anomalous numbering, missing blocks and source typos as review
  evidence. Parser number gaps are not proof of omitted printed questions.
  Keep unclear stems/options, answer keys and explanations behind the existing
  source-review and scoring gates until scan verification is complete.
- Topic classification, peer-paper matches and imported explanations are
  useful leads; none alone verifies an answer or makes a question practice-ready.

## Implementation and checks

- `SubjectStudyView.tsx`: scoped pools, topic cards, modes, English types and search.
- `studyTopics.ts`: canonical catalog and durable tag resolution.
- `filters.ts`: canonical section resolution and scoring predicate.
- `UdcLdcPage.tsx`: independent tabs, reuses existing practice and browse views.
- `mpsc-study-topic-tags.json`: reviewed classification inputs, not answer keys.

TypeScript and production build checks are required. Browser verification must
click each tab, select a populated topic, read an inline paper group, answer an
eligible MCQ and switch English to Written. Check narrow-screen wrapping and
that source-review items never enter scoring. The in-app browser denied
access, so visual verification is still outstanding;
its security policy forbids alternate browser/CDP routes. The implementation is
published at `https://map.hawayu.in` (Vercel reports the production deployment
READY).

Completed checks: TypeScript, production build and `git diff --check` pass.
All 114 stored tags reference existing questions and resolve to the correct
subject; broad legacy tags resolve to Mixed; source-review gates are preserved.

Next content task: classify the remaining Mixed questions in durable inputs,
using the printed source where stored text is uncertain. A missing topic is a
classification gap, separate from a missing/held answer.

Archive import and OCR/source exceptions are tracked in
[HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md). Latest import: 109 new G
General English PDFs, one distinct JAO Series B booklet, and NG Assistant LESO
2026 General English with its final key. Mines and LESO have completed
source/explanation reviews; LESO Q58 stays held. Remaining archive material
stays review-gated until its source and solution checks pass.

## Combined typography and official-key conflicts — 10 October 2026

Store `**word**` for bold, `*word*` for italics, `__word__` for underline,
`***word***` for bold italics and `__*word*__` for underlined italics. Use these
only where the scan prints that emphasis. The renderer has bounded local
scanners, so nested marks cannot consume later text or printed blank runs.
Runs of three or more underscores are blanks. Leave the question blank empty;
store reveal answers separately. Run `check-question-text.mjs` after changing
the renderer or recovering combined marks.

If source instructions and emphasis disagree, preserve both and annotate the
source exception. Mines Q31–35 say “underlined” while their targets are bold.
Preserve source spelling, punctuation and awkward grammar in stems/options;
explain the issue in `sourceNote` and the worked guide.

When an independently worked answer and an official key coexist, keep
`answerSource: official` plus its `answerKeyRef` and store the independent
answer in `independentAnswerIndex`/`independentAnswerSource: solved`. Show the
worked explanation. A material key conflict must remain unscored with
`sourceReview` and a `disputeNote`; LESO B58 and AAO 2024 Q23/Q37/Q77 are
regression examples. The generator holds these conflicts automatically.
Written passages, directions, subpart labels and guides can be source-reviewed
without ever entering MCQ scoring. Preserve stable IDs when correcting display
numbering (Mines `-written-4` is displayed as 3.4).

The English review ledger is regenerated with the bank. Its counts and gates
are separate from topic classification. Remaining English Mixed topics and
8,421 pending English MCQs are continuation work, not completed coverage.

Shared context is rendered by `QuestionContext.tsx` in Read, Practice and Exam.
Read questions initially collapses the passage behind “Read passage”; Practice
and Exam initially open it. Source directions use `QuestionText`, preserving
typography and line breaks. Do not store a needed passage only in import data
without showing it alongside the question. Context blanks never reveal an
answer merely because an MCQ option was selected.

This context/formatting update is published from app content commit `49ff3ae`
in deployment `dpl_5BsDcBvgUYqGVQQHNaXKK6nojnY8` (READY), aliased to
https://map.hawayu.in. Visual browser verification remains outstanding.

## Reviewed study guides and the subject progress ledger — 11 October 2026

Two durable additions let future models measure and extend review without
touching generated files:

- `reviewed-study-guides.json` (applied by `reviewed_study_guides.py`) attaches a
  checked worked guide to a record that already carries an official single-choice
  key. It never clears an existing gate, and if the independent answer differs
  from the key the item is held unscored with a dispute note. Use it to turn
  key-only feedback into a real worked explanation. Generate the `expected*`
  fields from the built bank so a stale entry fails the build instead of
  overwriting a checked stem.
- `subject-review-progress.json` (from `subject_review_progress.py`) reports every
  subject (English, Arithmetic, Computer, GK, Reasoning) per paper. It separates
  `keyOnlyFeedback` ("the key gives an answer") from `workedGuidesReviewed` ("the
  question has a checked worked explanation") and lists `heldItems` with reasons.
  It is read-only and never changes readiness.
- The full continuation workflow, formatting rules, exception handling, model
  guidance and publish steps are in
  [HANDOFF-REVIEW-GUIDE.md](HANDOFF-REVIEW-GUIDE.md).

First batch: Combined Group B (NG) Paper-II, December 2024, Series A
(`mpsc-group-b-ng-2024-paper-2-a`) — Computer Knowledge Q1–8 and Simple
Arithmetic Q36–45, read from the scanned pages and matched to the final key. The
bank stays at 352 papers / 22,676 records, 3,834 practice-ready (1,752 official);
2,480 MCQs now carry worked guides and 552 official records are still key-only.

## Subject classification and English guide update — 13 October 2026

Durable ID tags now cover both banks. The separate clerical bank has 547
Arithmetic records (501 MCQs and 46 descriptive items); 527 have a precise
Maths topic and 20 remain Mixed because OCR is unclear, prompts span multiple
topics, or there is no clock category. Its 255 Computer questions are all tagged
to canonical computer topics. The MIMER 2018 compiler and firmware questions
were corrected to Programming and Hardware/Memory. All 858 clerical English
records and its Reasoning records already use their matching subject routes.

In the Group B supplement, all 707 Arithmetic and 110 Computer records resolve
to canonical topics or documented Mixed cases. JAO Series B now routes Q31–50
to Reasoning and Q51–100 to GK; Q39, Q41 and Q44 have specific reasoning topic
overrides. English remains routed to the English section; 36 Inspector of Excise
(August 2025) MCQs now have source-checked worked guides against the final key.

The tag audit found 1,446 durable overrides, all pointing to existing question
IDs across the generated banks. The Group B build report still has 8,771 MCQs
marked unreviewed; topic classification and worked guides do not count as full
source review. English has 7,136 pending MCQ worked guides and 903 pending
written guides in the Group B ledger. `python3 tools/udc-ldc-build/build_group_b.py`,
`git diff --check` and `npm run build` completed successfully for this update.

## Mixed-topic classification sweep — 17 October 2026

Durable ID tags in `src/data/banks/mpsc-study-topic-tags.json` now cover every
classifiable Mixed Maths question in both banks. Tags are runtime-only and never
touch generated banks, readiness or scoring. After a rebuild the Group B ledger
`tools/udc-ldc-build/subject-review-progress.json` shows arithmetic
`mixedTopicRecords` falling from 35 to 12.

Group B arithmetic Mixed: 35 → 12. The 23 reclassified records are:

- the merged ADA 2014 20-in-1 arithmetic record, split cleanly into 20 usable
  sub-questions (`mpsc-group-b-ada-2014-arithmetic-1(i)`…`1(xx)`) and tagged
  `number_system` (10), `average`, `ratio_proportion` (2), `probability`,
  `speed_distance_time` (2), `time_work`, `mensuration` (2), `percentage`;
- three JR Accounts Officer 2025 data-interpretation MCQs (Q21/Q27/Q28) tagged
  `data_interpretation`.

The remaining 12 Group B Mixed records are deliberate and now carry an explicit
`"mixed"` tag so the gap is documented rather than merely untagged:

- four clock problems — `mpsc-group-b-asi-home-2018-mathematics-Q50`/`-Q58`,
  `mpsc-group-b-si-stats-2026-p2-A4`, and JR Accounts Officer 2025 Q30. The
  taxonomy has no Maths `clock` topic; `calendar_clock` belongs to Reasoning, so
  these arithmetic-section items stay Mixed rather than being misrouted.
- one physics item, `mpsc-group-b-inspector-stats-2026-p2-Q98` (javelin
  release-angle mechanics) with no canonical Maths topic here.
- seven ACF 2023 degree-level Mathematics items
  (`mpsc-group-b-archive2325-acf-2023-mathematics-A1`, `A2`, `A4`, `A5`, `A6`,
  `B8`, `B11`): matrices, multivariable limits, Clairaut's equation, resisted
  motion, a vector triple-product proof and bisection/convergence — none maps to
  a canonical topic in this catalog.

The clerical LDC/UDC bank (`mpsc-udc-ldc`) is down to **18 Mixed** arithmetic
records. Two more were classified this date: `mpsc-udc-efcc-2018-paper-2-q094`
(fraction/simplification) → `number_system`, and
`mpsc-asst-2014-paper-2-d02` (equation solving) → `algebra`. The remaining 18
are deliberately Mixed: their stored OCR stem is unreadable or incomplete,
the prompt spans unrelated methods (multi-part descriptive items), or it asks a
clock angle with no clock topic. Clerical tags are applied at runtime, so no
clerical rebuild is needed; `build_bank.py` does not consume tags.

The 20 ADA 2014 "merged 20-in-1" source record in
`tools/udc-ldc-build/extracted/ada-2014-arithmetic.json` is split cleanly into 20
usable records with correct per-item stems/options before tagging.

Verification for this sweep: 1,481 tags parse, every tag ID exists in a built
bank, and every arithmetic/computer tag resolves into that section's catalog
(the only non-catalog tags are the pre-existing reasoning tags on the JR
Accounts Officer paper, which is intended). Mixed recount via the real routing
tables: clerical 18 (all arithmetic), Group B 12 (all arithmetic).
`python3 tools/udc-ldc-build/build_group_b.py` is idempotent,
`npm run lint` (tsc) and `npm run build` pass, and `git diff --check` is clean.
Browser visual verification remains outstanding under the workspace access
restriction.
