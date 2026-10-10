# UDC / LDC / Group B: subject practice contract

Updated 10 October 2026. User request: independent Maths/Arithmetic, English-only,
and Computer Knowledge sections; Maths organised by topic; future models must
follow this design when deriving answers or importing papers.

For the live MPSC archive audit and the remaining Gazetted English/Arithmetic
import queue, continue from [HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md).

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
that source-review items never enter scoring. On this run local preview browser
access was declined, so visual verification is still outstanding; do not claim
that check passed. The local implementation is not yet published.

Completed checks: TypeScript, production build and `git diff --check` pass.
All 114 stored tags reference existing questions and resolve to the correct
subject; broad legacy tags resolve to Mixed; source-review gates are preserved.

Next content task: classify the remaining Mixed questions in durable inputs,
using the printed source where stored text is uncertain. A missing topic is a
classification gap, separate from a missing/held answer.

Archive import and OCR/source exceptions are tracked in
[HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md). Latest import: 109 new G
General English PDFs, one distinct JAO Series B booklet, and NG Assistant LESO
2026 General English with its final key. All new items remain
review-gated until the source/punctuation/key quality pass is done.
