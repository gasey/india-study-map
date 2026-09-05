# P&E Dept, August 2018, CSE Paper III — Section A extracted

Source: `mpsc-cse-papers/computer-scienceengg-paper-iii-pe.pdf`, worked 2026-09-05.
Third Paper III to be processed, after ILM Nov 2023 and ILM Dec 2018.

## This paper has a different shape from the first two

ILM Nov 2023 and ILM Dec 2018 are 100 MCQs each, full stop. This one — and the
other two remaining papers — is split:

| Section | Content | Marks each |
|---|---|---|
| A | 50 multiple-choice questions | 2 |
| B | 20 short-answer (descriptive) questions | 5 |

`_full.txt` is the whole `pdftotext -layout` dump. It is split into
`_source.txt` (Section A, the MCQs, what the extraction agents read) and
`_sectionB.txt` (Section B, kept verbatim).

## Section B is DEFERRED, not dropped

Decided 2026-09-05 with the user: import Section A now, give Section B its own
pass later. It is recorded here and in DEVLOG so it stays a known gap rather
than becoming a silent omission — this bank has had one of those already.

Section B is **not** off-syllabus filler. Much of it is core TECH2 Unit 3:

> 5. What is the significance of views in SQL? Give SQL statement to update data.
> 7. Discuss the types of privileges at the account level and at the relational level.
> 8. Explain locking techniques for concurrency control.

The reason to defer is that a descriptive question needs an **authored model
answer**, not a chosen letter, and there is no key to check that answer against.
`SOLVE_BRIEF.md` is written for MCQs and does not cover it. Doing it properly
needs its own brief. 60 such questions exist across the three remaining papers.

The bank does support the format — `type: 'descriptive'`, rendered by
`DescriptiveQuestionCard.tsx`, and the static app already counts essay questions
separately in its Past Papers cards.

## Status

- [x] `_full.txt` extracted; split into `_source.txt` + `_sectionB.txt`
- [x] Section A question numbers 1–50 present, no gaps
- [x] Transcription (3 slices → `text-001-017` / `-018-034` / `-035-050`)
- [x] Mechanical verification + spot-check against source
- [x] Syllabus classification against `_syllabus-2026.json` — **20 on, 30 off**
- [x] Two independent solve passes; conf = lower of the two — **20/20 agreed**
- [x] Import — `import_pe2018_p3.py`, bank 1901 → 1921
- [ ] **Section B — deferred, needs its own brief**

## Results

20 of 50 Section A questions imported (`PE2018_P3_*`): 19 in TECH2 Unit 3
(DBMS), 1 in Unit 1 (OOP). The surviving set is **Q1–Q19 plus Q49** — not a
prefix. Q49 sits inside the off-syllabus software-engineering block but is
genuinely OOP, while Q48 and Q50 either side of it are not.

Both solvers agreed on all 20 answers. Stored `conf` is the lower of their two
self-ratings, applied by `merge_solves.py` rather than by hand: **17 high, 2
medium, 1 low**. The merge inputs are `solveA.json` / `solveB.json` and the
per-question notes are in `_notes.json`.

**Both solvers independently re-derived all 20 option orders from the source
PDF, and both reported zero permutations.** That is a stronger check than the
transcription spot-check alone, because neither was told what the other found —
and option permutation was the headline risk for this text-layer paper.

### Corroboration from a second sitting

`check_bank_consistency.py` flagged that `PE2018_P3_005` and `ILM2018_P3_002`
are the same question — *"A domain is atomic if elements of the domain are
considered to be ____ units"* — with identical options **except** that this
paper misprints (b) as `Indivisbile` where ILM Dec 2018 prints `Indivisible`.
MPSC reused the question across two sittings. Two independent solver pairs, in
two separate sessions, both keyed it (B). With no official key for any Paper
III, that cross-sitting agreement is the strongest corroboration available, and
the warning is expected rather than a defect: the misprint is preserved
deliberately.

### The three answers that are not clean

- **Q17** (`low`) — *"Which forms are based on the concept of functional
  dependency: 1NF/2NF/3NF/4NF"* has no unique answer. 3NF removes transitive
  FDs and 2NF partial FDs, so both fit; only 1NF and 4NF are excludable. Keyed
  (c) as the conventional textbook identification, with (b) recorded as equally
  defensible.
- **Q16** (`medium`) — the stem over-generalises. A composite key is required of
  the associative table resolving a many-to-many relationship, but the many side
  of a plain one-to-many needs only its own key plus a foreign key, so the
  printed "must" does not hold for half the question.
- **Q49** (`medium`) — the solvers split high/medium on **self-rating, not on
  the answer**; the wording turns on whether the setter wanted "analysis and
  design models" or "analysis model" alone.

### Preserved misprints

`Indivisbile` (Q5 option b, the keyed answer) and the curly quotes around
`”Comp Sci”` in Q11's stem. Both are what the paper prints, both are carried
through rather than repaired, and both are recorded in the questions' `note`.

### A naming bug this import created and then fixed

The first run invented the sitting name *"Junior Grade, Mizoram Engineering
Service (Power & Electricity), August 2018 · Paper III"* while Paper II from the
**same sitting** was already in the bank as *"Jr. Grade of M.E.S. (P&E Dept),
August 2018 · Paper II"*. Since the sitting name is the grouping key for the By
Year / By Paper views, Past Papers showed the August 2018 sitting twice, under
two names, each looking complete. Caught in the browser. `import_pe2018_p3.py`
now fails when the sitting prefix appears nowhere else in the bank and suggests
the near-matches, so the two remaining Paper IIIs cannot repeat it.

## What to watch for here

Same as ILM Dec 2018: `-layout` preserves the printed two-column option
arrangement, so the live risk is **silent option permutation**, not dropped
text. And when something looks like extractor damage, check the rendered page
before repairing it — in the Dec 2018 paper the two most convincing "extractor
bugs" (`courseid` for `course_id`, and a Symbol-font arrow) both turned out to
be exactly what the paper prints.
