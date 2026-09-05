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
| `computer-scienceengg-paper-iii.pdf` | **ILM, December 2018** | III | **0** |
| `computer-science-engineering-paper-i.pdf` | **ILM, November 2023** | I | 97 |
| `computer-science-engineering-paper-ii.pdf` | **ILM, November 2023** | II | 39 |
| `computer-science-engineering-paper-iii.pdf` | **ILM, November 2023** | III | **0** |
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

## No Paper III has ever been imported

Every Paper III here has **zero** questions in the bank — roughly 350 MCQs plus
five Section B sets. This was not a decision anyone recorded; it looks like the
imports simply never covered Paper III. Sizes: ILM Dec 2018 and ILM Nov 2023 are
100 questions each; the three MES/P&E Paper IIIs are 50 MCQs plus a Section B.

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
