## MPSC paper import — 10 October 2026 (latest)

The Group B/general-paper catalog now contains **95 papers and 6,774 question records** (6,624 MCQ, 150 written). Of these, 3,611 are ready, including 1,618 with official keys; 3,033 remain source-review items. The latest PDFs are in `public/papers/group-b/`, registered in `tools/udc-ldc-build/group_b_sources.py`, and extracted into the generated bank. The 2018 addition covers MES PWD and Power & Electricity English/General Studies, Veterinary Officer English I/II, JE I&WR English, Assistant Jailor English, ASI Home (three papers), Assistant Grade (two), and ACF English/GK. The 2017/2014/2012 addition covers ATO English, Fishery Extension Officer English I/II, Grade-V MHS English I/II, HFW Lab Technician English, MCON Lecturer English I, Assistant Professor Geography English, ADA (three), MES PHE 2014 (two), and MES Power & Electricity 2012 (three).

All new practice records remain unscored unless a verified answer key exists. Text extraction is incomplete for some PDFs; source counts and question gaps must be checked before treating a paper as complete. Four written-only 2018 English papers have source PDFs registered but still need their descriptive prompts transcribed to become question records.

Production deployment completed: `https://map.hawayu.in` (`dpl_Aqmf3pBtRHoHeWLShVnd2ARqGbR9`, READY). The `/udc-ldc` route and sample PDFs return HTTP 200.

Several archive links were mismatched and were not imported under the requested title: Assistant Jailor GS-I/II resolve to Inspector of Taxes; the PWD JE English link resolves to a 2020 Agriculture JE; Legal Metrology English I is unavailable and English II resolves to FEO 2017; the shared 2017 English URL supplied for MES PHE, Lecturer Civil, High School Teacher, and Staff Nurse opens a GDMO paper; the MES PHE 2017 GS URL returns 404; and the Assistant Librarian links are broken/mismatched. ACF GK was corrected to the official ACF file. Do not add the incorrect files under requested exam names.

# Group B continuation handoff — 10 October 2026

Repository: `/home/hruaia/workspace/projects/personal/india-study-map`

## Where things stand

### New paper added — MIMER General English Common Paper (February 2018)

The library now includes **MIMER common recruitment**, the
official common General English paper used for recruitment to various posts
under MIMER: **Lab Technician, Medical Record Technician, Staff Nurse and
Computer Operator**. MPSC's four archive listings link to the same official
PDF URL. `SHARED_POSTS` in `group_b_sources.py` records the four associations;
the library search and paper post filter expose all of them with one question
set. The existing `mimer-labtech-2018-english` IDs are preserved for saved progress.
Source: `../mpsc-question-bank/pdfs/Old_Questions/Direct_2014-2018/1.General English Common Paper.pdf`.
Its extracted questions are in `tools/udc-ldc-build/extracted/mimer-labtech-2018-english.json`;
the durable source-list entry and archive folder mapping are in
`tools/udc-ldc-build/group_b_sources.py`. The builder copied the source to
`public/papers/group-b/mimer-labtech-2018-english.pdf`.

The import contains **80 MCQs plus the Section A essay prompt**. It is marked
review-required: the sibling MPSC bank has 79 inferred answers and one
unanswered/defective idiom item (Q13, “Sweeping Statement”), but no official
answer key. The imported items remain unscored until their text and answers
are reviewed against the PDF; do not promote inferred answers to official or
practice-ready status. The 20-mark essay is present as a descriptive prompt
awaiting response guidance. Rebuild with
`python3 tools/udc-ldc-build/build_group_b.py`.

The common reading passage for Q1–12 is restored in the extracted input and
rendered with each question. English answer review remains open.

### Computer Operator under MIMER — Technical Paper I

The user explicitly includes this paper under **Computer Knowledge**. Its 75
questions are imported by `tools/udc-ldc-build/mimer_sources.py`, reusing the
existing System Manager text extraction and independent solutions. The source
is `tools/system-manager-build/sources/mimer-2018-computer-operator-technical-paper-i.pdf`,
SHA-256 `77c20d338d31decfcf18545c5507f9c66b113e3905547123dfe56e979b714477`.
Do not use the archive's ambiguous `2.Technical Paper-I.pdf`: that file is the
Laboratory Technician paper after a filename collision.

71 questions have derived answers/explanations ready for practice. Q23, Q36,
Q37 and Q69 remain unscored with candidate answers; the last also has conflicting
blind solves. The full paper stays excluded from Exam mode while any are held.
Its cover specifies 150 marks, 75 two-mark MCQs and two hours; no penalty is stated.
Solutions come from `tools/system-manager-build/staged/solved.json`, with relevant
`audit_corrections.json` applied afterwards. Future models should resolve the
four uncertain answers there, then regenerate both consumers. All answers stay
derived unless a verified official key is attached.

### Sub-Inspector under Excise & Narcotics — March 2014

The three official papers now have imported module records. Paper I (General
English) has nine descriptive prompts. General Studies Paper I has 75 MCQs.
General Studies Paper II has 34 of an expected 75 MCQs. Its available PDF has
only four pages and contains printed pages 2, 4, 6 and 8; 41 MCQs from the
missing printed pages are not recoverable from this scan. This is the General
Studies Paper II listing, not a Paper III. The source data is
`tools/udc-ldc-build/extracted/si-excise-2014.json` and the adapter is
`tools/udc-ldc-build/si_excise_2014.py`. All imported 2014 MCQs remain
unscored and source-review-gated; 32 General Studies II legacy answer candidates are
shown only as unverified candidates. Its cover is missing, so duration and
marks metadata are not inferred. Obtain the missing pages and review all
transcriptions before enabling full-paper exam mode.

### Additional 2018 source imports

The module now imports the complete available question sequences from seven
additional official PDFs: Sub Inspector (UB), Home Department, October 2018
(English 80 MCQs plus one essay; GK 100 MCQs; Mathematics 100 MCQs); Senior
Horticulture Demonstrator, April 2018 (English 80 MCQs plus one essay); and
Sub-Inspector FCS&CA, November 2018 (English 80 MCQs plus one essay; General
Studies I 75 MCQs; General Studies II 75 MCQs).

All 590 new MCQs remain unscored pending text and answer review. Three essays
await guidance. The English reading passages are attached to their question
groups. Three-choice alternatives are preserved where printed. SHD English
Q24 duplicates the label (d), so its four alternatives are stored by their
printed visual order and kept unscored. UB Mathematics Q46's spaced `(d )`
marker was recovered from the scan. Mathematics and FCS&CA GS II retain original
question crops for fractions/diagrams; English items that depend on source
emphasis also have crops. Mathematical text still needs source review.

Inputs are `tools/udc-ldc-build/extracted/{slug}.json`. The source registrations
live in `group_b_sources.py`; `enrich_2018_papers.py` retains official source
URLs, restores passages, applies source-hash-pinned text repairs and generates
crops. `extract_general_papers.py` calls it after extraction. Re-extract only
these seven registered rows with `extract_one(row)` when their inputs change;
the broader practice-hub parser retains its default four-option behavior.
The separate `extract_si_police_ub_2018.py` and aggregate
`extracted/si-police-ub-2018.json` are earlier extraction drafts; the module
consumes the individual registered `{slug}.json` inputs described above.
Verification for these seven imports: all 24 review tests and the production
build passed. Comparison by question ID confirms all 3,709 committed earlier
records are unchanged; every new source image referenced by the module exists.

### Programmer, Sericulture and Station Officer — 10 October 2026

Seven more official 2018 papers are imported: Programmer under PHE (English
Papers I and II), Sericulture Extension Officer (English Papers I and II), and
Station Officer, Fire & Emergency Services (English, GK and Mathematics).
They add **640 unscored MCQs and three descriptive prompts**. Covers confirm
80 MCQs plus one 20-mark essay in Programmer Paper I, Sericulture Paper I and
Station Officer English; 100 MCQs in each Paper II; and 100 one-mark MCQs in
the Station Officer GK and Mathematics papers. All new MCQs remain source-review gated with no scored
answers. Programmer Paper I's three-choice block is preserved; the shared
passages are attached to Programmer Paper I Q1–8/Q25–32, SEO Paper I Q17–32,
and Station Officer English Q1–12. Crops preserve underlined/italicized words.
SEO Paper II Q58 duplicates the printed (b) label; its options are displayed
in visual order and the item stays unscored.

Source URLs and source-hash-aware enrichment are in
`tools/udc-ldc-build/enrich_2018_papers.py`; registrations and individual
extraction inputs are in `group_b_sources.py` and
`tools/udc-ldc-build/extracted/{slug}.json`. Rebuild with
`python3 tools/udc-ldc-build/extract_general_papers.py` when regenerating source
inputs, then run the Group B builder. The image crop boundary retains both
rows of answer choices and avoids including the next question number.

The user also asked to verify Middle School Teacher (3 papers), Primary School
Teacher (3 papers), and six UDC sets (EF&CC, Irrigation & Water Resources,
Agriculture (Crop Husbandry), Excise, SAD and Tourism; 2 papers each). All 18
supplied MPSC URLs returned readable PDFs whose titles match the requested
posts and papers. These were verified as sources only and are not yet imported
in the Group B library. The EF&CC UDC Paper I PDF is a complete two-page,
125-mark descriptive English paper with seven grouped prompts, not an MCQ
paper or a truncated scan; Paper II is the separate GK paper.

The Group B module now has **68 papers** and **5,219 question records**. The
generated source and library are the
authority for exact review counters; the table below records the state before
the October 2026 additions.

Validation for the MIMER additions: type checking, the 24 Group B review tests,
the production build and repeat-build byte equality passed. The SI Excise
addition and fourteen further 2018 imports pass all 24 review tests and the
production build. 5,219 records are present; 1,510 have been appended since
the 49-paper baseline. GPT-6 Luna handled
the bounded source inventory and adapter implementation; the parent reviewed
the schema, integration, provenance and scoring gates. Changes are local to
the checkout; that earlier update was deployed; the latest additions are also live at `https://map.hawayu.in`.

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
