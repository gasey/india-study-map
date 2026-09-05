# Handoff — System Analyst Technical Paper II (2026 syllabus)

**Status as of 2026-09-05: Paper II is complete and verified.** 120 questions and
32 concepts cover all four units of the 30 July 2026 syllabus, every leaf has
both, and every question carries a study-mode label. Nothing here is blocked.

Read this file first if you are picking up Paper II cold. Read `DEVLOG.md`
(entries of 2026-09-04 and 2026-09-05) for the narrative and the reasoning;
this file is the state and the next moves.

---

## The syllabus authority

`~/workspace/projects/personal/syllabusex.pdf`, sha256
`8b6619681c078ea3bbd4642916cb78f836f47ef817ce6848ccc5fb6e74a8f89d`, 10 pages —
ICT Department notification **File No. A-12038/68/2025-ICT, 30 July 2026**.
Paper II is on pages 5–6. Extract with `pdftotext -layout` (there is a real text
layer; this is not a scan).

**Its text layer has OCR damage.** Normalise these before quoting it to anyone:
`THCHNICAL`→TECHNICAL, `Polymoxphism`→Polymorphism, `I/0`→I/O,
`Apls`→APIs, `Kubemetes`→Kubernetes, `CSRE`→CSRF, `Iaas, Paas, Saas`→IaaS, PaaS,
SaaS, `Devops`→DevOps, `Devsecops`→DevSecOps, `Finops`→FinOps,
`Concurring Control`→Concurrency Control,
`Lockingtechniques forconcurrency`→Locking techniques for concurrency.
(`schemes and instances` is printed as-is and means *schemas* and instances.)

The four units and their marks: **1 Object Oriented Programming 40 · 2 Web
Technologies 60 · 3 Database Management Systems 60 · 4 Cloud Computing 40.**
The subtopic taxonomy in `syllabus.js` was checked leaf-by-leaf against this
text and is a faithful reading of it.

## Current state

| Unit | Marks | Questions | Concepts | Bare leaves |
|---|---|---|---|---|
| 1 Object Oriented Programming | 40 | 15 | 7 | 0 |
| 2 Web Technologies | 60 | 30 | 10 | 0 |
| 3 Database Management Systems | 60 | 54 | 8 | 0 |
| 4 Cloud Computing | 40 | 21 | 7 | 0 |

Bank 1,830 questions total; concepts 994 total; `modes.js` 521 labels with
**0 dead ids**. All 120 Paper II questions are labelled
(86 understand / 26 memorise / 8 calculate).

Of the 120 questions, **66 were authored** (`srcKey: "GEN-TECH2"`) because no
past paper for this post has ever examined Web Technologies or Cloud Computing.
The other 54 are real past-paper questions retagged onto the new syllabus by
`migrate_tech2_2026.py`.

## The pipelines

Both follow the same contract: `--export` writes batches, agents fill
`.done.json`, `--merge` **validates before writing and refuses to write while
any row is rejected**, and both are idempotent (they drop what they previously
appended and rebuild from disk).

    python3 tools/system-analyst-build/generate.py       --export --paper TECH2 | --merge
    python3 tools/system-analyst-build/author_concepts.py --export --paper TECH2 | --merge | --report
    python3 tools/system-analyst-build/classify.py        --export --paper TECH2 | --merge | --report

Briefs: `GENERATE_BRIEF.md` (questions — **its difficulty override is the thing
that matters**, this post is B.E/B.Tech/MCA/M.Sc, not diploma),
`CONCEPT_BRIEF.md` (concepts), `CLASSIFY_BRIEF.md` (study modes).

`author_concepts.py` and `CONCEPT_BRIEF.md` were **written on 2026-09-05** and
have only been run against Paper II. They are paper-agnostic by construction but
untested elsewhere.

### Two things that will bite you

1. **Agents must write output incrementally.** A first attempt at the 32
   concepts lost four agents and ~400k tokens to a session limit because each
   held its whole batch until the end and none had written a file. Tell
   authoring agents to rewrite their `.done.json` after every entry.
2. **Never let an agent read `questions.js` (1.8 MB) or `concepts.js` (3 MB).**
   That is what starved the first attempt. Pre-extract what they need —
   `staged/concepts/questions-U*.json` are per-unit extracts of 6–18 KB built
   for exactly this.

## Verification standard applied here

Do not lower it. The 66 authored questions went through an **adversarial pass
instructed to refute each key**, not to approve it:

- **0 wrong keys** across all 66.
- **5 real defects found and fixed at source**, then re-merged: two genuine
  ambiguities (an `fstream` stem where `basic_filebuf`'s single shared file
  position made the distractor observably identical to the key, verified by
  compiling; an XSS stem where escape-at-storage was a second true answer), one
  false explanation (`ios::trunc` is not what discards contents — `ofstream`
  with `ios::ate` truncates because output without `ios::in` maps to stdio
  `"w"`), one overstated stem (`flex: 1 1 0` needs `min-width: 0` to equalise,
  because flex items default to `min-width: auto`), and one C++-version-
  dependent absolute (a reference member must be *initialised not assigned*;
  since C++11 a default member initialiser works).
- The Unit 1 checker **compiled and ran 9 of its 12** questions under
  `g++ -std=c++17`; the Unit 3/4 checker read the NIST definitions out of
  SP 800-145 and SP 500-292 directly and **recomputed 16 calculations**.

Checkers to run after any change:
`check_bank_consistency.py` (4 warnings, all pre-existing TECH1/CSE/MES, none in
Paper II) and `check_symbol_residue.py` (0 private-use residue across 1,830).

## Open items, most valuable first

1. **`staged/tech2-2026/` — 265 double-solved questions, still no import
   script.** It must special-case the 29 questions ILM Nov-2023 Paper II's
   official key covers rather than importing all 265 as `derived`, or it will
   label an authoritative answer agent-derived and get **N0162** wrong. **q44 is
   still swallowed inside option (d) of N0139** and must be recovered in the
   same pass. Full detail in the DEVLOG entry of 2026-09-03.
2. **32 keyed-but-unimported `cse_paper_2` questions** (q39, q44, q71–100) — the
   largest block of keyed material not in the app.
3. **254 authored questions are parked and unreachable**, in
   `staged/parked-legacy-syllabus-2026-09-04/` (see its README). Their `sub`
   strings match `TECH2_LEGACY`/`TECH1_LEGACY` leaves, but `generate.py`'s
   filename regex `(TECH\d|GE|GS)-U([0-9A-D]+)-(\d+)` cannot name a `_LEGACY`
   paper. Needs a pipeline change, then re-merge, then confirm the app reports
   254 `GEN-` questions. **Do not delete that directory until it does.**
4. **1,309 questions still have no study-mode label**, TECH1's 945 among them.
   `classify.py --export --paper TECH1` is the next batch.
5. **TECH1's 266 concepts do not map to its 2026 syllabus leaves.**
   `author_concepts.py --report` shows all 27 TECH1 leaves as bare while unit 1
   alone holds 70 concepts — they are authored at a finer granularity
   ("Sets, subsets, power set, cardinality" under the leaf "Sets, mappings and
   relations"). This is a **reporting artifact, not breakage**: the Study pane
   lists concepts per unit and renders fine. Decide whether TECH1 should be
   re-tagged to leaves or whether the report should model both shapes — but do
   **not** "fix" it by running `author_concepts.py --export --paper TECH1`,
   which would author 27 duplicate concepts on top of good ones.
6. **358 `rel` links in TECH1's concepts resolve to nothing and are dropped
   silently by the app.** Measured across all 994 concepts: TECH1 358, GS 3,
   TECH1_LEGACY 3, GE 1, TECH3 1, **TECH2 0**. `app.js` resolves `rel` by `sub`
   string with a trailing `.filter(Boolean)`, so the reader just sees a shorter
   list of related concepts and nothing errors. Almost certainly the same 2026
   migration: TECH1's concepts point at leaf names that were renamed. Worth a
   pass — `author_concepts.py`'s second-pass validator has the exact resolution
   logic to reuse.
7. **3 rule/agent study-mode disagreements** printed by `classify.py --merge`
   (`GEN-158`, `GEN-215`, `TECH1_OLD-3`). The agent looks right in all three —
   a district count is recall, not computation — but they are flagged for a
   human.
8. **Unit 4 bundles more than 21 questions can cover.** Zero Trust and IAM have
   no dedicated question and Sustainable Cloud Computing has no leaf of its own
   in `syllabus.js`; all three are carried by the concept notes instead. A
   second question pass on Unit 4 would be worthwhile.

## Things not to re-derive

- **The ILM-2023 official key is applied.** Earlier revisions of this file and
  of the 2026-09-05 DEVLOG entry listed it as the top open item with "12 live
  wrong answers". That was **wrong** — it had been applied on 2026-09-04 by
  `apply_official_keys.py`, and the claim survived because three places still
  said `NOT YET APPLIED`: this file, that DEVLOG entry, and the `_note` field
  of `staged/ilm2023-official-key.json` itself. Verified 2026-09-05 against
  the data, not the prose: all **12** disagreements now hold MPSC's letter,
  **136/136** records pass `provLine()`'s official-key test, `ILM2023_P1_029`
  is `ans: ""` (compensated), and a dry run reports *0 changed, 136 already up
  to date, 100.0% agreement*. Re-check with:

      python3 tools/system-analyst-build/apply_official_keys.py --sitting ILM2023

  Note the applier is `apply_official_keys.py` (**plural**). The DEVLOG entry
  of 2026-09-04 names `apply_official_key.py`, which was correct when written
  and was generalised into the plural form by commit `4222fe1`.
- **`staged/parked-classifying-stale-2026-09-05/`** holds 684 classification
  rows whose question ids are not in the bank. Before parking them it was
  proven that **0 currently-live valid labels would be lost and 94 gained**;
  `modes.js` had been 62% dead ids. Do not restore them.
- The 287 questions with `srcKey: 'GEN'` (no hyphen, ids `GEN-1`…`GEN-287`) are
  GE/GS/TECH3 only and are **not** touched by `generate.py --merge`, which keys
  its rebuild on `startswith("GEN-")`. They are not the missing generated
  questions; that was checked.
- Concept progress is keyed on `paper|unit|sub`, **not** on concept id, so ids
  are free to change. `rel` links by `sub` string and unresolvable entries are
  dropped **silently** by `app.js` — `author_concepts.py` validates them in a
  second pass for that reason.
