# Group B continuation handoff — 9 October 2026

Repository: `/home/hruaia/workspace/projects/personal/india-study-map`

## Where things stand

The user asked to finish every remaining **"source checked · not scored"** item
and every incomplete paper in the Group B question bank, then deploy the result.
That work is done, committed, pushed and live. This document records the final
state so a future session does not have to re-derive it.

All previously imported unchecked items were already reviewed in the preceding
sessions. This session resolved the items that were still **held** (checked but
unscored) and deployed the whole Group B body of work.

**This does not mean every question is scoreable.** Some printed items are
genuinely defective and some source pages do not survive; those remain held
unscored with a written reason. The scoring gate was not cleared merely to
reduce a counter.

| Measure | Final result |
| --- | ---: |
| General papers | 49 |
| Total items | 3,709 |
| MCQs | 3,582 |
| Written prompts with guidance | 127 |
| Practice-ready MCQs | 3,540 |
| Ready with official answers | 1,618 |
| Ready with derived answers | 1,922 |
| Imported items awaiting text review | 0 |
| Checked items held unscored (`heldReviewed`) | 39 |
| …of those, shown as "held" in the library | 36 |
| MPSC-compensated items (own pill) | 6 |
| MCQs missing from the source | 13 |

Counters come from `tools/udc-ldc-build/build-report.json`. `sourceReview: true`
still prevents scoring; `sourceReviewed: true` distinguishes a checked, held
item from an unchecked extraction. The library counts held items as
`sourceReview && sourceReviewed && !compensated`, so the three MPSC-compensated
held items show their own "MPSC compensated · not scored" pill instead of the
held counter (39 − 3 = 36).

## What this session changed

The 120 remaining held items were split into five per-paper batches, re-checked
against the printed source pages, and repaired under the protocol in the
previous handoff (one durable input file, per-item sourced explanation, no
answer fields inside question rows). Fixed items cleared `unscored` and, for
papers without an official single-letter key, received a paper-level
`derivedAnswers` entry with the same worked explanation. For papers that *do*
have an official single-letter key, no derived answer was added — clearing
`unscored` is enough and provenance stays `official`.

Final generated totals moved from 3,420 → **3,540** practice-ready
(1,614 → **1,618** official) and 159 → **39** held. The remaining 13 missing
questions are unchanged (see below).

### Held items that remain (39)

Each has a precise reason in `group-b-text-repairs.json`; do not invent answers.

- **Defective / underdetermined printed items**
  - `inspector-stats-2026-p2` Q28 — all four printed PET statements are true,
    but no option offers "I, II, III and IV".
  - `hfw-2026-p1` Q22 — the source phrase is malformed and no offered
    replacement repairs it; Q25 — options (b) and (c) are both grammatical.
  - `jao-2025-p1` Q11, Q13 (two valid tense forms), Q36 (no matching option for
    "mealy-mouthed"), Q37 (no fixed "small hours" range plus an am/pm typo),
    Q52 (assertive ∧ affirmative), Q55 (simple ∧ assertive), Q58 (both C and D
    error-free).
  - `jao-2025-p2` Q83 — D could be M's son *or* nephew/niece.
  - `je-2016-english` Q42 (rarely ∧ occasionally), Q52 (phrase where a clause is
    asked for).
  - `je-2025-gk` Q14 — options (a) and (c) both print "326 BC", defeating a
    unique index.
  - `je-2025-english` Q12 (in searching ∧ searching), Q22 (no accurate synonym),
    Q26 (explicit answer absent).
  - `je-agri-2026-p1` Q29 — no option preserves the affirmative sense of "not
    very bad".
  - `si-excise-2024-p1` Q7 (current Lok Sabha is 543; options are 552/545/554/
    532), Q33 (Kelvin **and** Rankine are absolute scales), Q53 (no past-ability
    form), Q54 (no past-obligation form), Q56 (A and B are both "to"), Q66 (b
    and d are both correct comparatives), Q70 (b and d are both punctuated
    correctly), Q71 and Q72 (every jumble can be reordered).
  - `si-excise-2024-p2` Q52 (ambiguous nested fraction), Q91 (figure-sequence
    rule not determinable).
  - `si-fcs-2025-p2` Q30 (options (a) and (c) both name Jan Dhan Yojana),
    Q100 (shape sequence admits more than one rotation rule).
  - `steno-2024-english` Q36 (imprecise/outdated wording).
  - `steno2-2015-gk` Q44 (Latvia), Q100 (UN headquarters).
- **MPSC-compensated, build-flagged (own pill)** — `aao-2024-arithmetic` Q30,
  `si-police-2026-p1` Q48, `si-police-2026-p2` Q78.
- **Reported compensated by MPSC but no key file attached yet** —
  `aao-2025-p2` Q6 and `si-excise-2025-p2` Q82. These still count as held until a
  full official key is added to `verified-general-keys.json`.

### Missing questions (13)

`steno-2024-gk` Q67–79 are absent from the source. The published MPSC PDF is a
seven-page scan in which printed **page 6 is omitted** (page 5 ends at Q66, PDF
page 6 starts at Q80). Every copy found (Scribd, Wayback, local) descends from
the same defective scan. Answer letters were recovered from the official final
key (12 Dec 2024), but no question stems/options exist to transcribe, so the 13
items stay missing rather than invented. Full report:
[`tools/udc-ldc-build/steno-2024-gk-missing-page.md`](tools/udc-ldc-build/steno-2024-gk-missing-page.md).

## Deployment — DONE

Committed as `9f591bb` ("Group B: resolve held items across five review
batches") and pushed to `origin/main` (`git@github.com:gasey/india-study-map.git`).

Production deploy (the `--scope` flag is required):

```bash
vercel --prod --yes --scope gaseys-projects
```

- **Deployment ID:** `dpl_8CAbXpB9rD2rST24bxDWWeEUinQr`
- **URL:** `https://india-study-daqafd4b5-gaseys-projects.vercel.app`
- **Alias:** `https://map.hawayu.in`
- **Status:** READY

Live verification: the full `browser-check.py` suite was run against
`https://map.hawayu.in/udc-ldc` and passed — 49 papers, the corrected
ready/official/held/missing totals, held scoring gates, Exam eligibility,
figures, key comparison, corrigendum, source links, and mobile/desktop layout,
with no runtime exceptions.

## Remaining external dependencies

1. **Stenographer GK November 2024 Q67–79** — need a complete scan (printed page
   6). Do not reconstruct from the answer key alone.
2. **ASI 2024 Q3** — needs the exact 29 October 2024 district electoral-roll
   table (village-council totals are a different population).
3. **ASI 2024 Q45** — needs a folklore source establishing the printed broad
   "fastest human being" claim.
4. **Independent papers without official keys** — keep `derived` provenance
   explicit and keep them out of full-paper Exam mode.
5. **`aao-2025-p2` and `si-excise-2025-p2`** — attach the full official keys so
   the compensated cells (Q6 and Q82) are recognised as compensated.

## Durable files and regeneration rules

- `tools/udc-ldc-build/group-b-text-repairs.json` is the canonical durable input:
  source SHA256 guards, checked stems/options/pages, `nonMcq` removals, worked
  `derivedAnswers`, held explanations, and complete `written` tasks.
- `group_b_sources.py` applies those repairs and computes provenance, the
  source-review gate, compensated detection and Exam eligibility.
- `build_group_b.py` regenerates the bank, library and report and asserts
  integrity (no `answer`/`answerIndex` in rows, held rows need an explanation,
  derived answers need a reviewed in-range index, compensated items need
  `answerIndex < 0`).
- **Never hand-edit** `src/data/banks/mpsc-group-b-general.ts` or
  `src/data/banks/mpsc-group-b-library.json`.
- Source archive is the sibling `../mpsc-question-bank/pdfs/Old_Questions/`;
  cached geometric extraction is under `tools/udc-ldc-build/extracted/`. Do not
  rewrite the OCR cache to make repairs look native.

## Validation

The final local state passed:

```bash
python3 tools/udc-ldc-build/build_group_b.py
python3 -m unittest discover -s tools/udc-ldc-build -p test_group_b_repairs.py
npm run build
python3 tools/udc-ldc-build/browser-check.py            # local 127.0.0.1:5173
python3 tools/udc-ldc-build/browser-check.py https://map.hawayu.in/udc-ldc
git diff --check
```

All **24 tests** passed, consecutive builds are byte-identical, and the browser
check passed both locally and against production.

**Arithmetic reading mode (this session).** The stem/option styling that the
clerical bank's arithmetic already enjoyed was extended to the Group B
quantitative papers via `textMode(q)` in `filters.ts`, resolved through
`sectionOf` so both banks share it. Quantitative stems get the gold-ruled
serif/tabular box, reasoning gets its lighter accent, and math stems render
`plain`, so a `*` or `_` in an expression is never read as emphasis. The
browser check pins the split on the mixed Computer/Arithmetic/Reasoning paper
(30 math / 35 reasoning / 120 math options).

`browser-check.py` uses a Chrome CDP session at `127.0.0.1:9222` and the Vite
`/udc-ldc` route (or a URL argument). Its hardcoded progress assertions now
expect **3,540 ready**, **1,618 official**, **36 held** and **13 missing**.
There is now also an Exam-mode assertion: AAO 2024 General English has become
eligible (its last held items were fixed) while AAO 2024 Arithmetic stays out
(it still has a compensated item). Update these counts if further verified
repairs change them.

When extracting generated question arrays for an audit, use
`json.JSONDecoder().raw_decode` from each `const groupBQuestionsPartN` start; a
regex ending at the first `];` can truncate a string containing that text.
