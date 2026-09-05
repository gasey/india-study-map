# CSE 2015 import — handoff

Started 2026-09-01, first merge landed 2026-09-02. Everything a new session
needs to continue is in this directory. **Read this before touching
`public/mpsc-system-analyst/data/`.**

## What this was

The user is sitting **MPSC System Analyst** (Mizoram Urban Development
Agency). The technical syllabus is the Informatics Officer syllabus approved
30 July 2026 — the PDF is `~/workspace/projects/personal/syllabusex.pdf`.
They are currently preparing **Technical Subject Paper I only**:

| unit | title | marks |
|---|---|---|
| 1 | Discrete Mathematics | 40 |
| 2 | Computer Architecture and Organization | 40 |
| 3 | Data Structures and Algorithms | 60 |
| 4 | Operating System | 60 |

Paper I is 200 marks: 50 MCQ × 2 marks (100) **plus 100 marks of conventional
essay questions**, with **1/3 negative marking on MCQs**. It counts for merit;
General English and General Studies are qualifying only.

## The source folder is mislabelled — this matters

`india-study-map/mpsc-cse-papers/` is **not** one 2015 sitting. It holds **18 papers
from 7 different MPSC sittings, 2010–2023**, and several filenames are simply
wrong (`computer-scienceengg-paper-i.pdf` is actually *Inspector of Legal
Metrology, December 2018*). The real identity of each file is read off its own
cover page and hard-coded in `scripts/parse2.py` → `SITTINGS`. Do not trust the
filenames.

Four of the PDFs are image-only scans and were OCR'd with tesseract at 300dpi.

## What shipped (merged into the live app 2026-09-02)

- **499 new Paper-I MCQs** across 13 source papers. TECH1 went 357 → 856 questions.
- **266 new concept cards** — TECH1 previously had **zero** concepts while every
  other paper had a full guide. This was the real "missing topic". Coverage is
  70/66/65/65 across units 1–4 and spans every subtopic in the official syllabus.
- Every new question carries a `conf` field (`high` 396 / `medium` 78 / `low` 25).
  **Note:** before this import, `conf` was used by `provLine()` in `app.js` but
  no question in the bank actually had it — all 784 rendered "derived · unrated".
- `app.js` / `styles.css`: descriptive-question support, plus option rendering
  widened from A–D to A–E (4 existing questions have a real 5th option that was
  being silently dropped).

## Data model decisions worth knowing

- **`srcKey` is one key per PRINTED paper** (`ILM2010_P1`, `ILM2010_P2`, …).
  The Past Papers tab groups by `srcKey`, and DEVLOG had flagged that grouping
  by sitting alone collapsed distinct papers into one mislabelled card. One key
  per printed paper fixes that without touching the grouping code.
- **`sitting` includes the paper number** (`"… , March 2010 · Paper I"`).
- Most source papers are only *partly* Paper-I material, so each record carries
  a `note` saying `Only the Paper-I-syllabus questions from this paper were
  imported (N of M)`, and the Past Papers card surfaces it. Do not let a card
  imply it is a complete real paper.
- **`prov` wording is load-bearing.** `provLine()` badges a question
  "official key" when `/official/i` matches and no `no|without|never` negation
  does. Every derived record therefore ends "…**no** official key exists for
  this sitting". A phrasing like "not an official answer" would slip past the
  negation and badge a guess as authoritative — this was caught during the
  descriptive work, do not reintroduce it.
- Descriptive questions carry `type: 'descriptive'`, an empty `ans`, and a
  `model` + `points` pair. The empty `ans` keeps them out of `ANSWERABLE`, and
  therefore out of every practice pool, mock test and statistic automatically —
  they cannot be auto-scored. They render only when browsing a past paper.

## Pipeline (scripts/, run in this order)

1. `parse2.py` — pdftotext/OCR dumps → `mcq.json` + `descriptive.json`.
   Resyncs on garbled question numbers and reconciles against the highest
   question number in the raw text, so a truncated parse cannot look complete.
2. `dedup.py` — drops questions already in the bank, and cross-sitting repeats.
3. `mkbatches.py` — assigns `N####` ids, splits into triage batches.
4. `check_triage.py` — validates agent labels. **Pools labels by their own id,
   not by filename** — two agents wrote correct labels into off-by-one
   filenames, and keying on the id recovered that work.
5. `finalize_labels.py` — resolves votes: adjudicated > agreed > single.
6. `merge.py` — dry-run by default; `--write` applies and keeps `.bak` files.
   Refuses to write if anything is unanswered or ids collide.
7. `gaps.py` — **known weak.** Its keyword matching is far too strict (it
   reports "no questions" for set theory when set-theory questions clearly
   exist). Do not report its output as a finding without rewriting it.

Briefs given to the agents are in `briefs/`. Model split used: Haiku for
triage, Sonnet for solving and most concept authoring, Opus for conflict
adjudication and the first half of the concept guide.

## Still open

1. ~~**Descriptive questions are NOT merged yet.**~~ **DONE 2026-09-02.** All
   100 Section-B questions are triaged; the 36 TECH1 ones have model answers and
   are merged (`descriptive_done.json` → `scripts/merge_descriptive.py --write`),
   the other 64 are parked in `staged/parked-descriptive-2026-09-02.json`.
   Brief: `briefs/DESCRIPTIVE_BRIEF.md`. Two notes for whoever comes next:
   - The count was **98, and it should have been 100** — the parser dropped the
     *last* question of MES2023 Paper I (a heap question, real Paper I material)
     and Q9 of Paper III. Reconciling extracted numbers against themselves
     cannot catch a dropped trailing question. Both were recovered from the
     scans. Every Section B on these papers is 20 questions; check against that.
   - `merge.py` reads `descriptive_done.json` (singular). An earlier version of
     this file said `descriptive_done_a.json` / `_b.json`; that was wrong.
     In any case **use `scripts/merge_descriptive.py`, not `merge.py`** —
     `merge.py` rebuilds questions.js from `existing + new_q + desc_recs` and
     cannot be re-run now that the 499 MCQs are already in the bank (it will
     refuse on id collisions, which is the correct behaviour but not useful).
2. **52 imported questions have OCR-mangled maths symbols** — `A>B` for `A→B`,
   `AUB` for `A∪B`, `ANB` for `A∩B`, stray glyphs for `∈` `¬`. They are flagged
   in `prov` as "OCR damage in source scan" and were answered on recovered
   intent, but they read badly. A careful repair pass against the source PDFs
   would help; do not bulk regex them without checking each against the scan.
3. **25 low-confidence + 78 medium-confidence answers** have had no second
   opinion. These papers have no official key, so an adversarial re-check of
   those 103 by a stronger model is the highest-value remaining correctness work.
4. **712 non-Paper-I questions are parked**, classified but unsolved, in
   `../staged/parked-non-tech1-2026-09-02.json` (TECH2 265, TECH3 283, off-
   syllabus 164). A later session can solve them without redoing extraction.
5. **18 question numbers were never recovered** from the scans (mostly the
   Nov-2015 Paper I scan, which is already cleanly in the bank from an earlier
   import — the 18 re-OCR'd twins were deliberately dropped rather than shipped
   garbled). See `staged/parse_report.json`.
6. Topic tags are uneven: 74 unit-1 questions still sit under the generic
   "Discrete Mathematics" tag and 75 unit-2 under "Computer Architecture and
   Organization", inherited from the pre-existing bank rather than this import.

## Defects found 2026-09-02 in the *existing* bank (all fixed, scripts kept)

These were not caused by this import; they were found while verifying it.

- `scripts/fix_2015_dupes.py` — 10 duplicated ids (`MES2015_PAPER1_041`–`050`)
  were in the committed bank at HEAD. Double-counted in every pool; Q50's two
  copies disagreed on the answer and Q46's other copy had an empty `ans`.
  **`merge.py` could never have caught this** — its collision check compares
  only *new* ids against existing ones, never the existing bank against itself.
  A duplicate-id assertion over the whole file is worth adding to any future
  merge.
- `scripts/fix_unit_tags.py` — 5 Discrete-Maths questions tagged unit 4.
- Q46's kept copy had been marked "UNANSWERABLE AS PRINTED: inorder alone does
  not determine a tree". Plausible, and wrong — only one of the four printed
  preorders reconstructs against the given inorder. Confident, well-written
  provenance notes are still worth testing.

## Reading the scans

`pdftotext` maps Symbol-font glyphs to private-use codepoints rather than
losing them: `` = ⊕, `` = ≥, and a literal `F` in a set-valued table
is Φ/∅. Equations set as images drop out of the text layer entirely — render the
page (`pdftoppm -r 150 -png`) and read it. That is how the induction formula in
MES2023 P-I Q3 and the NFA table in Q5 were recovered. `mpsc-cse-papers/…-paper-i.pdf`
for MES2015 has **no text layer at all** (6 bytes); it is image-only.

## Verified, not assumed

The merge was checked in-browser at `localhost:5173/mpsc-system-analyst/`:
1283 questions / 962 concepts load with no console errors; the Study tab shows
266 TECH1 concepts where it showed none; Past Papers renders 13 separate paper
cards each with its honest "N of M" note and a "derived answers" badge; a
sample question card shows the right unit name, topic and a
"derived · high confidence" pill. The page-replacement figures in the
Belady's-anomaly card (FIFO 15 / LRU 12 / OPT 9 on the Silberschatz string;
FIFO 9→10 on the anomaly string) were re-derived by simulation and match.
