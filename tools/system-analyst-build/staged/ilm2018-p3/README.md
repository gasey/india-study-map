# ILM December 2018, CSE Paper III — imported

100 questions transcribed from `mpsc-cse-papers/computer-scienceengg-paper-iii.pdf`
on 2026-09-05; the 36 on-syllabus ones are **in the bank** (`ILM2018_P3_*`,
imported by `import_ilm2018_p3.py`). The other 64 stay here in
`_classified.json` with a recorded reason each.

This is the second Paper III to be worked, after ILM Nov 2023
(`staged/ilm2023-p3/`, imported as 36 on-syllabus questions in a7b87c2).

## Where the source PDFs actually live

`mpsc-cse-papers/` **inside this repo** — not `~/Downloads/mpsc_pdfs_examination/`,
which CLAUDE.md still names and which does not exist on this machine.

The five Paper IIIs and their sittings:

| PDF | Sitting |
|---|---|
| `computer-science-engineering-paper-iii.pdf` | ILM, November 2023 — **imported** |
| `computer-scienceengg-paper-iii.pdf` | ILM, December 2018 — *this directory* |
| `computer-scienceengg-paper-iii-pe.pdf` | P&E Dept, August 2018 |
| `jr-grade-of-mes-electrical-wing-under-pe-deptt-computer-engg-paper-iii.pdf` | MES Electrical Wing / P&E, July 2023 |
| `jr-grade-of-mizoram-engineering-service-mes-2015-computer-science-engineering-paper-iii.pdf` | MES 2015 / P&E, November 2015 |

## What was done

Unlike Nov 2023 (a pure scan that had to be read page-by-page from 300 dpi
images), this PDF has a **clean text layer**, so `pdftotext -layout` gives the
whole paper as text — `_source.txt`. Five agents each transcribed a 20-question
slice from that dump under `EXTRACT_TEXTLAYER_BRIEF.md`, rewriting their output
file after every question.

`text-001-020.json` … `text-081-100.json` are the per-slice outputs.

The `-layout` mode preserves the paper's printed two-column option arrangement,
so the dominant corruption risk here is **option permutation** — reading
`(a) (b)` / `(c) (d)` in the wrong order silently rewrites which letter is
correct. That is the thing to check first if an answer from this batch ever
looks wrong.

## Verification done

Mechanical: 100 questions, numbered 1–100 with **no gaps and no duplicates**,
every one carrying exactly four options (keys A–D), a non-empty stem, and no
two options with identical text.

Against source, which is the check that counts:

- Q1–Q10 and Q19–Q20 compared line by line against `_source.txt`.
- Q30, Q32–Q38 compared against the **rendered page-4 image**, not the text
  dump. Q37 is the highest-risk item on that page — its second column starts
  almost flush against option (a)'s text — and its order is correct.
- All option orders checked read left-to-right-then-down. No permutations found.

### The `course_id` question, and why the dump was right

Q31's SQL prints `courseid`, `deptname`, `totcred`, `’DATABASESystems’` and
`’CompSci.’` — no underscores, missing spaces. This looks exactly like
`pdftotext` dropping glyphs, and it is the Silberschatz `course_id` /
`dept_name` example, so the obvious conclusion is that the extractor broke it.

**It didn't.** Page 4 was rendered at 200 dpi and read directly: the *paper*
prints it that way. MPSC lost the underscores when they retyped the example.
The transcription is faithful and must stay as it is.

Recording this because the tempting "fix" — restoring the underscores to make
the SQL valid — would silently edit the paper, and a later reader would find no
trace of the decision. Q30's arrows are the mirror image: the dump encodes them
as PUA `U+F0AE` (Symbol-font `→`), the page really does print `→`, so rendering
them as `→` is a faithful decode rather than a repair.

## Status

- [x] `_source.txt` extracted; all 100 question numbers present, no gaps
- [x] Transcription — 5 slices, `text-001-020.json` … `text-081-100.json`
- [x] Mechanical verification (above); merged to `_merged.json`
- [x] Spot-check against source text **and** against the page-4 image
- [x] Syllabus classification — **36 on, 64 off** (`_classified.json`)
- [x] Two independent solve passes — **agreed on all 36**; conf = lower of the two
- [x] Imported: bank 1865 -> 1901, verified in the browser

## Solve result

Two solvers worked the 36 without seeing each other's output. **36/36 agreement,
0 disagreements.** Stored `conf` is the lower of the two self-ratings: 34 high,
2 medium, 0 low.

The two mediums are genuine ambiguities in the questions, not solver weakness:

- **Q11** — "undo the work of transaction after last commit" reads as ROLLBACK
  (undo work since the last commit) or Oracle FLASHBACK (undo already-committed
  work). Keyed ROLLBACK.
- **Q32** — both the tree/graph-based protocol and timestamp ordering are
  conflict-serializable and deadlock-free in Silberschatz.

**Q32 was keyed against both solvers, deliberately.** Both chose (C) graph-based
at medium confidence, but `check_bank_consistency.py` found the identical
question already in the bank as `TECH1_CSE_134` keyed (B) — corrected A->B by the
2026-09-02 audit and upheld by two independent adjudicators whose note records
that (C) was considered and rejected. Two adjudicators who weighed (C) outrank two
solvers who hedged on it, so this record was aligned to (B) rather than the
audited one flipped. The record carries a note stating both readings.

Q30 is worth one line: it looks defective (all four options seem to be keys) but
is not. `B -> C` then `BC -> A` makes **B alone a superkey**, so `{B,C}` is a
superkey that is *not* minimal, hence not a candidate key — while A, E and D all
are. Exactly one defensible answer, (c).

## Classification result

36 of 100 survive, which is exactly the Nov 2023 yield by coincidence.

- 35 land in **TECH2 Unit 3** (DBMS) — a near-contiguous run, Q1–Q35.
- 1 lands in **TECH2 Unit 4** — Q53, the definition of a distributed system.
- 0 land in TECH1, which is right: TECH1 is discrete maths, architecture, data
  structures and OS, and this paper tests none of them.

The 64 off-syllabus questions are three clean blocks: data communications and
OSI (Q36–Q70), and software engineering (Q71–Q100). Neither subject exists in
the 2026 syllabus.

Every one of the 36 `sub` values was re-validated here against the syllabus JSON
— verbatim leaf match, and paper/unit consistent with where that leaf actually
lives. All 8 medium-confidence calls were reviewed by hand; in every case the
doubt is *which* Unit 3 leaf applies (data types vs. query statements,
transactions vs. plain SQL), not whether the question is on-syllabus.

## A false alarm worth remembering

The Q21–40 classifier reported, unprompted, that questions 21–40 had lost their
option text and held only the literal strings `"A"`, `"B"`, `"C"`, `"D"` — i.e.
it claimed a fresh silent-corruption incident.

**It was wrong.** No question in that range has placeholder options. What almost
certainly confused it is **Q30**, whose options genuinely *are* `A`, `E`, `B,C`,
`D` — because the question asks which attribute of `R(A,B,C,D,E)` is not a key.
A real question that looks exactly like corruption.

Two things follow, and both are worth keeping:

1. The agent's *verdicts* were still correct on inspection, but it had misread
   its own input while producing them. Agent self-reports are evidence, not
   findings — check the artefact.
2. The mechanical check that ran before this **would not have caught real
   corruption of that kind.** It validated that `opts` had keys A–D, non-empty
   values, and no two identical values. A payload of `{"A":"A","B":"B","C":"C","D":"D"}`
   passes all three. The check that actually settles it is comparing option text
   against the source, which is what was done.


## Provenance of the answers

There is no official MPSC answer key for Paper III from any sitting, so all 36
answers are `derived`. Confidence is the lower of two independent solvers'
self-ratings, and the app renders them as `derived · high/medium confidence` —
verified in the browser that none is badged `official key`, which is the
`provLine()` trap described in CLAUDE.md.

Do not delete this directory: `_classified.json` is the only record of why each
of the 64 excluded questions was excluded.
