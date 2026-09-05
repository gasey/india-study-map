# MPSC Computer Science & Engineering question papers

18 PDFs, six sittings, **2010–2023**. Renamed from `CSE 2015/` on 2026-09-05:
that name described one sitting in the folder and misled every reader who took
it at face value, including a session that concluded these papers "are not on
this machine at all" and logged the MES/Informatics-Officer answer audit as
blocked on missing sources. They were here, tracked in git, the whole time.

**The filenames do not say which sitting a paper belongs to.** Three different
naming conventions overlap and two of them collide on the word
"computer-science-engineering". Always check the table below or the paper's own
cover page — the cover is unambiguous, the filename is not. A filename collision
in this material has already destroyed a paper once (DEVLOG 2026-09-03).

## What each file actually is

| File | Sitting | Paper | Questions in bank |
|---|---|---|---|
| `inspector-of-legal-metrology-2010-…-i.pdf` | ILM, March 2010 | I | 104 |
| `inspector-of-legal-metrology-2010-…-ii.pdf` | ILM, March 2010 | II | 88 |
| `computer-scienceengg-paper-i.pdf` | **ILM, December 2018** | I | 43 |
| `computer-scienceengg-paper-ii.pdf` | **ILM, December 2018** | II | 14 |
| `computer-scienceengg-paper-iii.pdf` | **ILM, December 2018** | III | **36** of 100 |
| `computer-science-engineering-paper-i.pdf` | **ILM, November 2023** | I | 97 |
| `computer-science-engineering-paper-ii.pdf` | **ILM, November 2023** | II | 39 |
| `computer-science-engineering-paper-iii.pdf` | **ILM, November 2023** | III | **36** of 100 |
| `computer-scienceengg-paper-ii-pe.pdf` | MES P&E, August 2018 | II | 21 |
| `computer-scienceengg-paper-iii-pe.pdf` | MES P&E, August 2018 | III | **0** |
| `jr-grade-…-mes-2015-…-paper-i.pdf` | MES, November 2015 | I | 50 |
| `jr-grade-…-mes-2015-…-paper-ii.pdf` | MES, November 2015 | II | 10 |
| `jr-grade-…-mes-2015-…-paper-iii.pdf` | MES, November 2015 | III | **0** |
| `jr-grade-of-mes-electrical-wing-…-paper-i.pdf` | MES P&E Electrical Wing, July 2023 | I | 70 |
| `jr-grade-of-mes-electrical-wing-…-paper-ii.pdf` | MES P&E Electrical Wing, July 2023 | II | 20 |
| `jr-grade-of-mes-electrical-wing-…-paper-iii.pdf` | MES P&E Electrical Wing, July 2023 | III | **0** |
| `junior-engineer-je-…-paper-i.pdf` | JE Contract, Rural Development, November 2016 | I | 2 |
| `junior-engineer-je-…-paper-ii.pdf` | JE Contract, Rural Development, November 2016 | II | 27 |

Note the two near-identical prefixes: `computer-scienceengg-` is **ILM December
2018** (plus the two `-pe` files, which are **MES P&E August 2018**), while
`computer-science-engineering-` is **ILM November 2023**. One hyphen apart, five
years and two posts different.

## Paper III: two of five imported (as of 2026-09-05)

For years every Paper III here had **zero** questions in the bank — ~350 MCQs
unreachable. No decision to skip them was ever recorded; the imports simply
never covered Paper III. Two are now in:

| Sitting | Section A | Section B | Status |
|---|---|---|---|
| ILM, Nov 2023 | 100 MCQ (2 mk each) | **none** | **imported** — 36 on-syllabus |
| ILM, Dec 2018 | 100 MCQ (2 mk each) | **none** | **imported** — 36 on-syllabus |
| MES P&E, Aug 2018 | 50 MCQ (100 mk) | 20 × 5 mk | pending |
| MES P&E Electrical, Jul 2023 | 50 MCQ (100 mk) | 20 × 5 mk | pending |
| MES, Nov 2015 | 50 MCQ (100 mk) | 20 × 5 mk | pending |

**Only three of the five have a Section B, not five.** An earlier version of
this file said "roughly 350 MCQs plus five Section B sets"; that was written
from the file listing before the papers were opened. The two ILM papers are
pure MCQ — ILM Nov 2023's cover reads *"All questions carry equal marks of 2
each"* with no Part A/B split (100 × 2 = its Full Marks 200) and its last page
ends at Q100. Nothing was dropped from either import. The 350 total was right
by coincidence: 100 + 100 + 50 + 50 + 50.

Only ~36 of each 100-MCQ ILM paper survives classification, because these
papers were set for the pre-2026 syllabus and the 2026 one dropped software
engineering, data communications and systems analysis outright. Expect a
similar rate on the remaining three. Per-question exclusion reasons are kept in
`tools/system-analyst-build/staged/<sitting>/_classified.json` so the excluded
questions are recoverable if the syllabus ever widens.

### Two extraction traps in the three pending papers

Both would corrupt an import silently:

- **MES Nov 2015 prints "Part A" / "Part B", not "SECTION - A/B".** Grepping
  for `SECTION` finds the split in the other two papers and returns *nothing*
  here — which reads as "this paper has no Section B" rather than as a failed
  match.
- **A wrapped line can impersonate a question number.** In MES Jul 2023,
  Section B Q12 continues onto a line beginning `46.4 ms.`, which any
  `^\s*\d+\.` splitter reads as question 46 — tearing Q12 in half and
  desynchronising every question after it. Section B stems wrap freely and
  carry numeric data, so anchor the splitter on the expected next number, not
  on the bare pattern.

The ILM 2023 official answer key covers `cse_paper_1` and `cse_paper_2` **only**,
so Paper III has no key in `staged/ilm2023-official-key.json`. Its answers must
be derived, or a key found in MPSC's `Answer_Keys` folder — which is *not* in
this repo.

## Which of these are scans

`pdftotext` returns nothing useful for:

- `computer-science-engineering-paper-i/ii/iii.pdf` (ILM Nov 2023) — a
  10-character text layer; every claim about these pages has to be made by
  looking at a rendered image.
- `jr-grade-…-mes-2015-…-paper-i.pdf` — 1-character text layer.

Render with `pdftoppm -png -r 300` (600 for overbars and Symbol-font brackets,
which is what the ILM 2010 and MES 2015 repairs needed).

Everything else has a real text layer.

## What is missing from this folder

- **MES P&E August 2018 Paper I** — only II and III are here.
- **Every Informatics Officer paper.** The November 2024 sitting, the earlier
  sitting and the 2021 pair are all in the bank but have no source here, so the
  149 `derived · unrated` answers on that material cannot be checked against
  source.
