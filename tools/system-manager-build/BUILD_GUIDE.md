# MUDAL System Manager — Study App Build Guide

**Status:** **Phase 1 done** (2026-08-28) — app shell cloned, `syllabus.js` generated and
verified against the PDF, module registered, all 8 tabs boot clean. Phases 2–5 not started.
**Corrections found while doing Phase 1 are marked ⚠️CORRECTED inline below.** The three
biggest: the technical syllabus has **259** subtopics not 261; `app.js` was **not** reusable
as-is (7 hardcoded System Analyst assumptions, one a data-corrupting shared localStorage
key); and Tier 2 is **~6,300 General English questions**, not 199.
**Written:** 2026-08-28. **For:** a fresh Claude Code session in `india-study-map`.
**Read first:** `india-study-map/CLAUDE.md` (the "verify content against source" rule
governs this entire build) and `tools/bank-rebuild/SOLVE_BRIEF.md` (the answer-solving
rules — Phase 3 reuses them verbatim).

---

## 1. Goal

A self-contained study app for the **System Manager** post at Mizoram Urban Development
Agency Ltd. (MUDAL), served at `/mpsc-system-manager/index.html`, covering the full
official syllabus with a concept study guide, browsable past questions with
hidden/reveal answers, and a comprehensive mock test.

This is a **content build, not a UI build.** The app shell already exists — see §4.

---

## 2. Ground truth: the exam

Source of truth is the official syllabus PDF, approved by the MUDAL Board of Directors
on 28.07.2026. It is public but **not indexed by search engines** — three levels deep on
the UD&PA site:

- Landing page: `https://udpa.mizoram.gov.in/post/syllabus-for-various-posts-under-mizoram-urban-development-agency-limited-mudal`
- Syllabus: `https://udpa.mizoram.gov.in/uploads/attachments/2026/08/3a5d5559798198c8427c8d275219a0d7/syllabus-for-system-manager.pdf`
- Question pattern (all posts): `https://udpa.mizoram.gov.in/uploads/attachments/2026/08/47ca0b9b7f50bad9e6f3df4a0ad73a7b/question-pattern.pdf`

Local copies: `~/Downloads/syllabus-for-system-manager-MUDAL.pdf`,
`~/Downloads/MUDAL-question-pattern.pdf`. Advertisement:
`~/Downloads/advertisement-mizoram-urban-development-agency-ltd.pdf`.

### Structure — 400 marks total

| Paper | Marks | Format | Counts for merit |
|---|---|---|---|
| General English (same syllabus as Junior Engineer) | 100 | **Mixed** — see below | Yes |
| Technical Paper I | 150 | All MCQ | Yes |
| Technical Paper II | 150 | All MCQ | Yes |

**General English is NOT all-MCQ.** Précis Writing 10 and Letter Writing 15 are
handwritten; Comprehension 15, Grammar/Parts of Speech 20, Correct Usage & Vocabulary 20,
Formation of Sentences 20 are MCQ. **25 of 100 GE marks cannot be drilled as MCQs** —
the Study tab has to carry those, not the Practice tab.

Unlike Assistant Engineer / System Analyst, the question-pattern PDF has **no
qualifying-only or 50%-cutoff clause for System Manager** — all three papers count.

Technical content derives from the *Prescribed Syllabus for Computer Operator under the
Govt. of Mizoram, 2019, as updated by MUDAL for this post*. This is why Computer Operator
past papers are the highest-value source (§3) and why Informatics Officer / CS&E papers
are too hard.

**Closing note in the syllabus, surface this in the UI:** questions may also come from
other topics prescribed for the post's educational qualification, and there is no
guarantee every listed topic appears.

**No exam date announced.** Don't hardcode a countdown — the app shell already reads a
user-set target date.

### Syllabus skeleton (259 technical subtopics)

⚠️**CORRECTED 2026-08-28.** This section originally said 261. Counted off the PDF during
Phase 1, the real total is **259** — Word Processing has **17** leaves (not 18) and
Electronic Spreadsheet has **18** (not 19). Both tables below are fixed. Every other unit
matched exactly. `gen_syllabus.py` asserts these numbers, so a future edit that drifts
fails loudly instead of silently.

Full bullet list is in the PDF; this is the unit/marks skeleton the data files must match.

**Technical Paper I (150)**

| Unit | Title | Marks | Sections | Subtopics |
|---|---|---|---|---|
| I | Fundamentals of Computer | 60 | Introduction to Computing (6), Computer Architecture (5), Processor and Memory (5), Storage Technologies (6), Input and Output Devices (7), Computer Software (6), Programming Fundamentals (4), Information Technology and Society (6) | 45 |
| II | Operating Systems | 25 | OS Fundamentals (4), Microsoft Windows (6), Linux Fundamentals (4), File and Storage Management (5), System Administration (7), Command Line (3) | 29 |
| III | Word Processing | 20 | Microsoft Word | 17 |
| IV | Electronic Spreadsheet | 25 | Microsoft Excel | 18 |
| V | Presentation Software | 20 | Microsoft PowerPoint | 14 |

**Technical Paper II (150)**

| Unit | Title | Marks | Sections | Subtopics |
|---|---|---|---|---|
| I | Computer Networking | 35 | Network Fundamentals (7), Network Devices (6), Network Services (5), Wireless Networking (3), Windows Server Administration (6), Cloud Networking (5) | 32 |
| II | Database Management System | 35 | Database Fundamentals (5), SQL (4), Database Administration (8), Database Security (4), Modern Databases (3) | 24 |
| III | Web Technologies | 25 | Internet Technologies (4), HTML5 (8), CSS3 (3), JavaScript (5), Modern Web Concepts (6) | 26 |
| IV | Cyber Security, AI and Emerging Technologies | 30 | Cyber Security (12), Artificial Intelligence (12), Digital Governance Systems (9) | 33 |
| V | IT Governance, Business Communication and Aptitude | 25 | IT Governance (9), Business Communication (5), Aptitude and Analytical Ability (7) | 21 |

**General English (100)** — 6 units: Précis Writing 10, Letter Writing 15, Comprehension
15, Grammar: Parts of Speech 20, Correct Usage and Vocabularies 20, Formation of
Sentence 20.

---

## 3. Source inventory — where the questions come from

### Tier 1 — exact syllabus match (the Computer Operator papers)

The SM technical syllabus *is* the Computer Operator syllabus. These are the closest
past questions in existence, and they sit at the right difficulty (sample: "A group of
four bits is also called", "The second generation of computer was based on").

In `mpsc-question-bank/bank/mpsc_bank_v2.json` (58 MB; key `questions`):

| `paperId` | Q | Answered |
|---|---|---|
| `Old_Questions/Direct_2014-2018/2.Computer Operator (Contract) under SAD 2016 Technical Paper I.pdf` | 75 | 75 |
| `Old_Questions/Direct_2014-2018/2.Computer Operator (CB) under Mizoram Information Commission 2016 Paper I.pdf` | 75 | 73 |
| `Old_Questions/Direct_2014-2018/1.Computer Operator (Contract) under SAD 2016 General English.pdf` | 80 | 80 |
| `Old_Questions/Direct_2014-2018/1.Computer Operator (CB) under Mizoram Information Commission 2016 General English.pdf` | 80 | 80 |

⚠️ **All Computer Operator answers are `answerSource: "inferred"` — no official key.**
Phase 3 must verify them. This is non-negotiable per `CLAUDE.md`.

**Not in the bank but recoverable** — Technical Paper II for both 2016 sittings. The
extractor never ingested them; the source PDFs and OCR sidecars both exist:

- `mpsc-question-bank/pdfs/Old_Questions/Direct_2014-2018/3.Computer Operator (Contract) under SAD 2016 Technical Paper II.pdf.ocr.txt` (14,024 B)
- `mpsc-question-bank/pdfs/Old_Questions/Direct_2014-2018/3.Computer Operator (CB) under Mizoram Information Commission 2016 Paper II.pdf.ocr.txt` (13,231 B)

That's ~150 more Tier-1 questions. Extracting them is the single highest-value item in
this build.

⚠️**CORRECTED 2026-08-28 — do NOT extract from the `.ocr.txt` sidecars. They are not
recoverable to full coverage.** Measured, each paper holding exactly 75 questions
(confirmed from the papers' own headers, below):

| Source | Of 75 questions findable |
|---|---|
| Existing `.ocr.txt` sidecar | 61 (SAD) / 63 (CB) |
| Re-OCR, `tesseract --psm 3` @400dpi | 58 |
| Re-OCR, `--psm 6` / `4` / `11` / `12` | 42 / 53 / 32 / 33 |

The missing questions **are present in the scan** — only their numbers are OCR-mangled
(`» §.` for 5, `22°` for 22), so a numbering-gap check catches the loss but can't repair it.
The PDFs are 1-bit CCITTFax scans that throw `Bad RTC code` stream errors, and the options
are laid out in two columns, which is what wrecks tesseract.

**Use a vision pass over rendered page images instead.** Verified legible: rendering with
`pdftoppm -r 400 -gray -png` produces pages a vision model reads cleanly, two-column options
included. 8 pages per paper, 16 total. At ~2.3k image tokens per page that is ~37k input
tokens for both papers — cheap enough that this should also **derive the answers in the same
pass**, merging Phase 2 extraction with Phase 3 for these two papers. Nothing is gained by
transcribing from a degraded intermediate when the original is readable.

Assert on 75 per paper and contiguous numbering 1–75 regardless of method.

### Paper structure, from the source papers' own headers

Read off all six 2016 Computer Operator papers — this is the best available evidence for
what MUDAL's unpublished System Manager question count and duration will be, since the
technical syllabus and the 150-mark totals are identical:

| Paper | Header | ⇒ Questions |
|---|---|---|
| Technical Paper I & II | `Time Allowed: 2 hours` · `Full Marks: 150` · `equal marks of 2 each` | **75** |
| General English | `Time Allowed: 3 hours` · `Full Marks: 100` · `equal marks of 1 each` | 80 MCQ + 20 handwritten marks |

`syllabus.js` now carries 75 q × 2 marks / 2 hours for the technical papers (was an assumed
150 × 1) and 3 hours for GE, each with a `pattern_note` saying it is derived from this
precedent rather than published. `gen_syllabus.py` asserts
`questions × marks_per_question == mcq_marks` per paper and 400 total.

### Tier 2 — General English (SM's GE = JE's GE)

| `paperId` | Q |
|---|---|
| `Old_Questions/Departmental_2019-2020/JE General English..pdf` | 80 |
| `Old_Questions/Direct_2019-2020/General English (JE).pdf` | 79 |
| `Old_Questions/Direct_NG_2024-2027/JE under Agri&Farmer Welfare March-2026 Paper-I (Gen. English)..pdf` | 40 |

Plus the 160 Computer Operator GE questions above. Note these are MCQ-only — they cover
75 of the 100 GE marks. Précis and letter writing need Study-tab content, not questions.

⚠️**CORRECTED 2026-08-28 — this tier was scoped far too narrowly.** The three JE papers
above are 199 questions. The bank actually holds **6,321 General English questions across
~125 papers**. MPSC largely reuses a common General English paper across posts, and SM's GE
components (Comprehension, Grammar/Parts of Speech, Correct Usage & Vocabularies, Formation
of Sentences) are exactly what those papers test — so most of that pool is on-syllabus by
construction, not just the three JE sittings.

Practical consequence for Phase 2: **GE is not question-constrained, it is
selection-constrained.** Don't bulk-import 6,321 questions. Two cautions before filtering:

- The `General English Paper-II` papers (100 q each) belong to posts examined at a higher
  level than SM. Prefer the ~80-question Paper-I / single-paper sittings.
- Dedup is now the dominant cost, not extraction — the same item recurs across sittings for
  years. Dedup on normalised question text, not on `id`.

Target something like 600–800 of the best-matched GE questions, weighted to the four MCQ
components by their marks (15/20/20/20).

### Tier 3 — harder papers, cherry-pick only

Degree-level (Informatics Officer, CS&E). Most is off-syllabus for SM — compilers,
automata, J2EE. Filter to on-syllabus items only; do not bulk-import.

| `paperId` | Q | Answered |
|---|---|---|
| `Old_Questions/Direct_2020-2021/Informatics Officer - Technical Paper-I.pdf` | 100 | 98 |
| `Old_Questions/Direct_2020-2021/Informatics Officer - Technical Paper-III.pdf` | 100 | 92 |
| `Old_Questions/Direct_2020-2021/Informatics Officer - Technical Paper-II.pdf` | 100 | **0** |
| `4./5./6./7./8.Computer Science&Engg Paper-I/II/III` (Direct_2014-2018) | ~500 | most |

### Tier 4 — already-authored, high-quality explanations

`mpsc-jso-prep/data/` — schema in `_schema.js`. Directly relevant files:
`p4u1-computer-fundamentals.js` (14 q), `p4u2-dbms.js` (13), `p4u3-digital-forensics.js`
(14), `p4u4-multimedia-forensics.js` (13), `p4u5-mobile-forensics.js` (13). Record shape:
`{q, o:[4], a:<0-based index>, e:'<p>html</p>'}`.

⚠️**Only `p4u1` and `p4u2` are on-syllabus (27 questions).** Digital, multimedia and mobile
forensics are JSO-specific — there is no forensics anywhere in the System Manager syllabus.
`harvest.py` pulls only those two, and assigns `p4u1`→`TECH1`, `p4u2`→`TECH2` per the *SM*
syllabus, not JSO's paper numbering.

⚠️**`e` is HTML and must be flattened.** `app.js` renders explanations with `esc(q.exp)`, so
any surviving tag displays literally to the reader. `harvest.py` strips them.

### Tier 5 — the existing System Analyst corpus

`public/mpsc-system-analyst/data/questions.js` — 662 questions, 375 real past + 287
generated. Same employer, same advertisement, adjacent syllabus. Mine for on-syllabus
overlap (networking, DBMS, e-governance, aptitude) but remember it targets a
CS-degree-level exam.

### Coverage gap — this is the important part

The 2016 Computer Operator papers predate roughly **half of Technical Paper II**. There
is zero past-paper coverage for: Generative AI, LLMs, prompt engineering, AI ethics,
AI-assisted sysadmin/data analysis, ITIL/ITSM, IT asset management, business continuity
planning, NIC eOffice, Digital Signature Certificates, PKI, Power Query, Power Pivot,
Microsoft 365 collaboration, Copilot, cloud/Azure fundamentals, containerization,
NVMe, PWAs, REST/JSON, web accessibility. **Phase 4 exists to fill exactly this.**

---

## 4. Target: file layout and data contract

Clone `public/mpsc-system-analyst/` → `public/mpsc-system-manager/`.

```
public/mpsc-system-manager/
  index.html          # re-brand: title, .brand-mark "SM", .brand-text
  app.js              # 50 KB — reuse as-is, no changes expected
  styles.css          # 14 KB — reuse as-is
  data/
    syllabus.js       # window.SYLLABUS = {...};
    concepts.js       # window.CONCEPTS = [...];
    questions.js      # window.QUESTIONS = [...];
```

`app.js` reads exactly three globals and nothing else:

```js
const SYL = window.SYLLABUS || { papers: [] };
const CON = window.CONCEPTS || [];
const QS  = window.QUESTIONS || [];
```

**Everything the brief asked for is already implemented in `app.js`.** Tabs: Dashboard,
Study, Daily Test, Practice, Past Papers, Mock Test, Review, Progress. It already has
spaced repetition (`isDue`, due/star/unseen/wrong pools), filters by paper/unit/source,
hidden→reveal answers, a timed mock, a progress heatmap, streaks, weakest-unit
detection, and localStorage backup/restore. Do not rebuild any of this.

⚠️**CORRECTED 2026-08-28 — the *features* are all reusable, but "reuse as-is, no changes
expected" was wrong.** `app.js` had seven hardcoded System Analyst assumptions. All are
fixed in `public/mpsc-system-manager/app.js`; listed here so the next person knows the two
files have deliberately diverged:

| Was | Problem | Fix |
|---|---|---|
| `KEY = 'mpsc_sa_v1'` | **Data corruption.** Same origin as the SA app, so both apps would read and write one shared progress store | `'mpsc_sm_v1'` |
| `weightedPick(… counts_for_merit)` for the quick mock | Used `counts_for_merit` as a stand-in for "technical". Every SM paper counts for merit, so General English leaked into the technical quick mock | filter `paper === 'TECH1' \|\| 'TECH2'` explicitly |
| `EXAM_HINT = '2026-11-01'` | Invents an exam date that was never announced, and hardcodes the apply deadline too | reads `SYL.exam_date` (null) / `SYL.application_deadline`; renders "exam date not announced" |
| Dashboard: "Merit is decided by Technical Papers I–III (600 marks)… only need 50% to qualify" | Flatly wrong for SM — 400 marks, no qualifying paper | renders `SYL.scoring_note` |
| `CON.length} of 727` | 727 is SA's subtopic count | `TOTAL_SUBTOPICS`, derived from `SYL` so it can't drift |
| `shortPaper` map | Hardcoded SA paper names incl. a `TECH3` that SM doesn't have | SM's two technical paper names |
| Empty states + Past Papers blurb | Referenced `python3 build/build.py` and the Informatics Officer papers | point at `tools/system-manager-build/` and the Computer Operator papers |

Two of these (`KEY`, the quick-mock filter) are silent-wrong-behaviour bugs, not cosmetics —
exactly the class of thing `CLAUDE.md` means by "typecheck passing is necessary but not
sufficient." Both were caught by loading the page, not by reading the code.

**If you fix shared logic later, patch both `app.js` copies.** They are a fork, not a
shared module.

### Schemas — match these exactly

**`syllabus.js`** — top-level keys: `post`, `employer`, `advertisement`, `pay`,
`vacancies`, `application_deadline`, `application_fee`, `eligibility[]`,
`selection_stages[]`, `syllabus_authority{}`, `scoring_note`, `papers[]`, `interview`,
`past_paper_sources`.

Paper: `{id, name, marks, questions, marks_per_question, duration_hours, type,
counts_for_merit, authority, units[]}`
Unit: `{no, title, marks, subtopics: [string, ...]}`

Use paper ids `GE`, `TECH1`, `TECH2`. For `GE`, set
`type: "Mixed - Précis and Letter Writing are handwritten; remainder MCQ"` and
`counts_for_merit: true`.

**`concepts.js`** — one record per syllabus subtopic. Keys:

```json
{
  "id": "c1",
  "paper": "TECH1",
  "unit": "1",
  "unitTitle": "Fundamentals of Computer",
  "sub": "Cache Memory",
  "def": "One-paragraph definition. What it is, precisely.",
  "exp": "Multi-paragraph explanation, \\n\\n separated. ~240 words total across def+exp.",
  "facts": ["Exam-checkable fact", "..."],
  "traps": ["Common confusion or distractor pattern", "..."],
  "mnem": "Optional mnemonic, or empty string"
}
```

Calibration from the System Analyst corpus: **727 concepts, 241 words average across
`def`+`exp`, 2.4 MB total.** For System Manager, ~290 concepts ≈ 70k words.

**`questions.js`** — note this schema differs from every other bank in the repo:
`opts` is an **object keyed A–D**, and `ans` is a **letter**, not an index.

```json
{
  "id": "CO2016A-1",
  "src": "past",
  "sitting": "Computer Operator (Contract) under SAD, 2016",
  "srcKey": "CO2016A",
  "no": 1,
  "paper": "TECH1",
  "unit": "1",
  "sub": "Introduction to Computing",
  "q": "In what form are data represented in a digital computer?",
  "opts": {"A": "Decimal", "B": "Binary", "C": "Character", "D": "Symbols"},
  "ans": "B",
  "exp": "Why B is right and why the others are wrong.",
  "prov": "Verified against source PDF (no official key published)",
  "note": ""
}
```

`src` is `"past"` or `"generated"`. `prov` is the provenance string shown in the UI —
be honest in it. Add `"conf": "high" | "medium" | "low"` on any answer that isn't from
an official key, and surface it (see §8, open item).

### Registration

Add to `src/modules/registry.ts` immediately after the `system-analyst` entry (~line 184),
matching its shape:

```ts
{
  id: 'system-manager',
  title: 'MUDAL System Manager',
  category: 'Practice',
  subgroup: 'Exam guides',
  tagline: '<N> concepts, <N> questions — Study guide, Daily test, Mock test',
  glyph: '🗂️',
  kind: 'static',
  path: '/mpsc-system-manager/index.html',
},
```

---

## 5. Phases

### Phase 1 — foundation ✅ DONE 2026-08-28 (no model)

1. ✅ `cp -r public/mpsc-system-analyst public/mpsc-system-manager`
2. ✅ Re-brand `index.html` (title, brand mark `SM`, brand text).
3. ✅ `data/syllabus.js` — generated by `gen_syllabus.py`, **259** technical subtopics
   transcribed verbatim from the PDF plus the 6 GE units. The script asserts every
   per-section leaf count, both 150-mark unit totals, and the 259 grand total before it
   writes, so re-running it is the check. Edit the script, not the `.js`.
4. ✅ `concepts.js` / `questions.js` stubbed as empty arrays, each carrying its schema and
   the phase that fills it as a header comment.
5. ✅ Registered in `src/modules/registry.ts` right after `system-analyst`.
6. ✅ Verified in the browser at `/mpsc-system-manager/index.html` and through the SPA at
   `/embed/system-manager`. All 8 tabs render, zero console errors, 400 marks and 259
   subtopics shown correctly, countdown reads "exam date not announced". `npx tsc --noEmit`
   clean. This step is what caught the 7 `app.js` bugs in §4 — do not skip it in later phases.

**Deliberately not done in Phase 1:** the `prov`/`conf` UI badge (see §8). It needs a real
render change in the answer-explanation block, and with an empty bank there is nothing to
render it against. Do it as the first task of Phase 3, when derived answers actually exist.

**GE subtopics are empty on purpose.** The official syllabus lists the six GE components
with marks and enumerates *no* subtopics. Each GE unit therefore carries `subtopics: []`
plus a `subtopics_source` string saying so. Phase 5 must author a derived breakdown and
label it derived — do not backfill it into `syllabus.js` as though it were official.

**Two paper-structure figures are assumptions, not source.** MUDAL publishes marks and
"All MCQ" only — no question count, no duration. `questions: 150` / `marks_per_question: 1`
/ `duration_hours: 2` exist so the mock test has a target length, and every paper carries a
`pattern_note` saying they are assumptions. The mock-test tab says so on screen too.

### Phase 2 — harvest (Python + Haiku 4.5)

Write the pipeline under `tools/system-manager-build/` so it is re-runnable, mirroring
the `tools/bank-rebuild/` convention. Output an intermediate JSON, not the final `.ts`/`.js`.

1. **Extract from the bank.** Filter `mpsc_bank_v2.json` by the Tier-1/2 `paperId`
   values in §3. Do **not** filter by `subject` — 69,757 of 77,751 records are tagged
   `"gk"`, the field is useless.
2. **Recover Computer Operator Paper II** — 150 questions (75 per sitting).
   ⚠️**Not from the `.ocr.txt` sidecars** — see §3, they cap at 61/75 and re-OCR is worse.
   Render the PDFs with `pdftoppm -r 400 -gray -png` and run a **vision pass** over the 16
   page images, deriving answers in the same pass (this absorbs Phase 3 for these papers).
   Watch for the failure mode that bit `bank-rebuild` before: an extractor that silently
   drops questions with no numbering gap to reveal it (DEVLOG 2026-08-04).
   **Assert on 75 per paper and on contiguous numbering 1–75.**
3. **Pull Tier 4** from `mpsc-jso-prep/data/p4u*.js` — convert `a` (0-based index) →
   `ans` (letter), and `o[]` → `opts{}`.
4. **Cherry-pick Tier 3 and 5** by keyword match against the syllabus subtopic list, then
   have a model confirm on-syllabus. Reject anything needing a CS degree.
5. **Tag every question** to `paper` / `unit` / `sub` — **Haiku 4.5**, classification
   against the fixed taxonomy from `syllabus.js`.
6. **Dedup** across sources. ⚠️**CORRECTED 2026-08-28 — the two 2016 sittings do NOT
   "overlap substantially".** Measured: exact-text dedup finds **0** duplicates, and fuzzy
   matching at 0.85 finds **1** near-pair in 75×75 for Paper I and **0** for General
   English. They are essentially disjoint papers, so Paper I yields 150 distinct questions,
   not ~100 post-dedup. `harvest.py` dedups on exact normalised text and *reports*
   near-duplicates for human review rather than dropping them — a question the examiner
   genuinely reused across sittings is signal worth keeping.

Expected yield: ~700–900 usable questions. ⚠️**Revised 2026-08-28:** with the corrected
Tier 2 (§3) the realistic ceiling is **~1,400–1,700** — Tier 1 310 in-bank + ~150 recovered
from the Paper II sidecars, Tier 4 67, Tier 3/5 cherry-picks, and 600–800 selected GE. The
binding constraint is answer *verification* (Phase 3), not question supply.

### Phase 3 — verify answers (Opus 4.8, Batch API)

Every Tier-1 answer is `inferred`. For each:

1. Re-derive the answer from the source PDF / OCR text.
2. Set `conf` to `high` / `medium` / `low` — **honestly**. Do not inflate to `high`.
3. Where the extracted question is broken (missing figure, truncated options), **flag it
   rather than guessing an answer**. A dropped question is better than a false one.
4. Write `prov` to say exactly where the answer came from.

Follow `tools/bank-rebuild/SOLVE_BRIEF.md` verbatim: never reorder options, don't
fabricate facts, be honest about confidence.

### Phase 4 — generate questions for uncovered units (Sonnet 5, Batch API)

Fill the coverage gap listed at the end of §3. Target ~600 new questions, weighted by
unit marks (Unit I of Paper I is 60 marks — it deserves ~40% of Paper I's questions).

- `src: "generated"`, `prov: "Authored to cover a syllabus unit with no past-paper coverage"`.
- Match the difficulty of the 2016 Computer Operator papers, **not** the Informatics
  Officer papers. The qualification bar is any graduate + a 1-year computer diploma.
- Every question must map to a real subtopic string from `syllabus.js`.

### Phase 5 — concept study guide ⏳ IN PROGRESS (started 2026-08-28)

**Pipeline:** `concepts.py --export [--only PAPER:UNIT] / --merge`, brief in
`CONCEPT_BRIEF.md`. The merge validates word count (90–520 across `def`+`exp`,
target ~240), rejects HTML (the app escapes these strings, so a stray tag renders
literally), checks facts/traps counts, requires every `sub` to match a target
verbatim, and verifies each `rel` resolves — an unresolved cross-link renders as
an empty "Study alongside" chip.

**Total is 293, not 259.** The 259 technical leaves plus a 34-item **derived**
General English breakdown, which lives in `concepts.py`. The official syllabus
enumerates no GE subtopics, so every GE concept ships `derived: true` with a
provenance string saying so. Do not present it as official.

**Done so far:** GE Units 1–2 (15) and TECH2 Unit IV (33). TECH1 Unit I (45) in
progress.

**What worked, after three session-limit deaths:**

- **One agent per batch of ~9**, each instructed to write its file *before* any
  other exploration. A death then costs one batch, and `--export` skips concepts
  already on disk, so re-running is safe and resumable.
- **Batch by confusion cluster, not by count.** Encryption / Digital Certificates
  / PKI to one author so they stay distinct; the AI ⊃ ML ⊃ Deep Learning nesting
  to one author so it is stated consistently; NAS/SAN and backup/DR likewise.
  Splitting a confusion pair across authors produces two overlapping treatments.
- **Name the near-duplicate subtopics explicitly in the prompt.** "Digital
  Transformation and e-Governance" (TECH1 U-I) and "Digital India and
  e-Governance" (TECH1 U-I) will otherwise get the same content twice; tell one
  author to stay generic and the other to stay Indian and concrete.
- **Repeat the no-invented-specifics rule per batch, with examples of the traps in
  that subject area.** It works: agents hedged on DSC validity periods, retention
  years, TOTP timing, FAR/FRR rates and model parameter counts, while still
  stating the substantive facts. Spot-checked Indian-context claims (CERT-In under
  §70B, the 2022 six-hour/180-day directions, CCA and RCAI, Class 3 DSC, Cyber
  Swachhta Kendra, helpline 1930, Bhashini, DPDP's fiduciary/principal terms,
  ISO/IEC 7816 and 14443) were all correct.
- **Feed Phase 3's findings back in.** Where the blind solve found the bank wrong,
  say so in the concept prompt. The SRAM/DRAM concept now carries the trap
  "options claiming DRAM is faster are wrong, and this error appears in real
  papers" — study material and corrected answers agree instead of contradicting.

### Phase 5 — original plan (Opus 4.8, Batch API)

One `concepts.js` record per subtopic: **259 technical** + a derived GE breakdown, ~240
words each.

⚠️`sub` **must match a leaf subtopic string in `syllabus.js` verbatim.** `app.js` links a
concept to its questions with `q.paper === c.paper && q.sub === c.sub` (app.js:410) and keys
concepts as `paper|unit|sub` (app.js:104). All 259 `paper|unit|sub` keys are unique, verified
in Phase 1. Note §4's `questions.js` example tags `sub: "Introduction to Computing"` — that
is a *section* name, not a leaf, and a question tagged that way will never link to a
concept. Phase 2 step 5 must classify to **leaf** subtopics. Each unit in `syllabus.js`
carries both `sections[]` (the PDF's own grouping, for context in the tagging prompt) and a
flat `subtopics[]` (the 259 leaves — this is the taxonomy to classify against).

Two things to get right that a generic pass will miss:

- **GE Précis and Letter Writing (25 marks) are handwritten.** These concepts must teach
  *method* — structure, compression ratio, salutation conventions, worked examples — not
  MCQ facts. This is the only place those 25 marks are covered anywhere in the app.
- **Aptitude (Paper II Unit V) is 7 subtopics inside a 25-mark unit** shared with IT
  Governance and Business Communication. Don't over-invest; cross-link to the existing
  Aptitude Hub module instead.

Cross-link related concepts via the `rel` key if you adopt it (the System Analyst corpus
has it; `app.js` tolerates its absence).

---

### Environment prerequisite (checked 2026-08-28)

`pdftotext`, `pdftoppm`, `tesseract` and `ocrmypdf` are all installed. **The `anthropic`
Python SDK is NOT** (`ModuleNotFoundError: No module named 'anthropic'`) — `pip install
anthropic` before any of Phases 2–5's model steps. Credentials were not verified; env
inspection is blocked in this sandbox, so confirm the API key separately.

## 6. Model and cost guide

Pricing verified 2026-08-28 (per MTok): **Opus 4.8** $5/$25 · **Sonnet 5** $3/$15
(introductory $2/$10 **through 2026-08-31 only**) · **Haiku 4.5** $1/$5.

| Stage | Model | Rationale |
|---|---|---|
| Phase 2 tagging | **Haiku 4.5** | Classification against a fixed taxonomy; errors are visible and cheap to fix |
| Phase 3 answer verification | **Opus 4.8** | No official key exists; a wrong answer teaches a false fact before a real exam |
| Explanations where the answer is already known | **Sonnet 5** | Well-scoped — the hard decision is already made |
| Phase 4 question generation | **Sonnet 5** | Bulk generation from a clear spec |
| Phase 5 concept prose | **Opus 4.8** | This *is* the study guide; depth and accuracy are the product |
| JSON assembly, dedup, schema validation | **none — Python** | Don't pay a model to do string work |

**Total job ≈ 250k output tokens.** All-Opus, un-optimised, that is roughly $9. With the
two levers below it lands near **$3**.

- **Batch API: −50%.** Phases 3–5 are not latency-sensitive. Use it.
  `client.messages.batches.create(requests=[...])`, poll `processing_status` until
  `"ended"`, then stream results. Results arrive **in any order — key by `custom_id`,
  never by position.**
- **Prompt caching: cache reads ≈ 0.1× input.** Every call in a phase shares a large
  stable prefix (the syllabus, the schema, style exemplars). Put it in `system` with
  `cache_control: {"type": "ephemeral", "ttl": "1h"}` and keep the per-item content
  *after* it. Caching is a prefix match — any byte change invalidates everything after
  it, so don't interpolate a timestamp or item ID into the prefix. Verify with
  `usage.cache_read_input_tokens`; if it's zero across calls, something in the prefix is
  varying.
- Minimum cacheable prefix on Opus 4.8 is **4096 tokens** — below that it silently
  won't cache. The syllabus prefix clears this easily; a short one wouldn't.

**The conclusion: don't downgrade to save money here.** The spread between all-Haiku and
all-Opus is a few dollars. Batching and caching save more than the tier choice does, and
they cost nothing in quality.

---

## 7. Rules for this build

Lifted from `india-study-map/CLAUDE.md` and `tools/bank-rebuild/SOLVE_BRIEF.md` — they
apply with full force here because this is content for a real exam the user is sitting.

1. **Verify against source, don't trust the pipeline's own output.** This bank has
   already had one silent-data-loss incident and one silent-corruption incident (both
   DEVLOG 2026-08-04). If something looks off, open the source PDF in
   `mpsc-question-bank/pdfs/`.
2. **Assert on counts.** Every extraction step states how many questions it expects and
   fails loudly if it gets fewer.
3. **Never reorder options.** Answer letters are positional.
4. **Be honest about confidence.** `medium` and `low` are correct answers to give.
5. **Flag broken questions, don't guess.** Missing figures and truncated options exist
   in the OCR.
6. **Verify UI changes in the browser** before calling anything done.
7. **Write a DEVLOG.md entry** for each phase — what shipped, why, what's still open.
   Newest on top. This is a standing instruction, not a one-off.
8. Only commit or push when asked; show a summary of what changed first.

---

## 7b. ⚠️Six leaf subtopic names are reused across units — tag on the full triple

The syllabus reuses six leaf names in more than one unit:

| Paper | Leaf | Units |
|---|---|---|
| TECH1 | `SmartArt` | III Word · V PowerPoint |
| TECH1 | `Accessibility Features` | III Word · V PowerPoint |
| TECH1 | `Microsoft 365 Collaboration` | III Word · IV Excel |
| TECH2 | `Tables` | II Database Administration · III HTML5 |
| TECH2 | `Encryption` | II Database Security · IV Cyber Security |
| TECH2 | `Firewalls` | I Network Devices · IV Cyber Security |

`conceptKey` is `paper|unit|sub`, so concepts stay distinct — but the reverse lookup
at app.js:455 originally matched `x.paper === c.paper && x.sub === c.sub`, **ignoring
the unit**. Live in the shipped data: `TECH2`/`Tables` has 2 MS-Access questions under
Unit II and 3 HTML-`<table>` questions under Unit III, and all five surfaced under both
concepts — so someone studying HTML tables was served MS Access questions. Fixed here
by matching the full triple.

**The System Analyst app has the same line and the same latent bug**; whether it bites
depends on whether its syllabus reuses any leaf name. Check before trusting its Study
tab. Any validator comparing leaf counts must compare on `(paper, unit, sub)`, not on
`sub` alone — counting unique `sub` strings undercounts TECH1 by 3 and TECH2 by 3.

## 7a. ⚠️The bank dropped every comprehension passage (found 2026-08-28)

**32 of the 160 General English questions are comprehension items attached to a
reading passage, and `mpsc_bank_v2.json` holds none of the passages** — every Tier-1
record has an empty `passage`/`passageId`. Shipped as extracted they are simply
unanswerable: *"Find the word in the passage which means 'intruding beyond acceptable
limits'"*, and five consecutive *"Which of the following statements is correct?"* items
in the MIC paper with no statements to check against.

This is a third silent-data-loss instance in this bank, alongside the two in DEVLOG
2026-08-04. **Assume any bank paper with a comprehension section has lost its passage
and check before shipping.** The passages are present in both source PDFs — these are
text-layer PDFs, so `pdftotext` recovers them cleanly (unlike the Paper II scans).

Recovered by `extract_passages.py` into `staged/passages.json`:

| Passage | Questions |
|---|---|
| SAD — "Manners and civilised society" (507 words) | Q17–32 (16) |
| MIC — "Religious thought and human need" | Q17–21 (5) |
| MIC — "The jester and the king" | Q22–27 (6) |
| MIC — "Wave energy as a power source" | Q28–32 (5) |

Note the two papers differ in shape: SAD prints **one** passage for 16 questions, MIC
prints **three**. Don't assume one passage per paper. The MIC headers are also
inconsistently cased in the text layer (`Passage -1`, `PASSAGE -2`, `Passage- 3`), so
match them case-insensitively.

`assemble.py` attaches `passage`/`passageTitle`/`passageId` by (srcKey, question no) and
then **fails the build** if any remaining question matches /in the passage|according to
the passage/ without one attached — so this can't silently regress. `app.js` renders it
via `passageBlock()` as a collapsible block, open by default, height-capped with its own
scroll so a 500-word passage doesn't push the options off-screen.

## 8. Open items and known traps

- 🔴 **Application deadline is 29 Aug 2026, 4:00 PM — that is TOMORROW as of this Phase 1
  build (2026-08-28).** Confirm the application actually went in before spending money on
  Phases 2–5. Everything downstream is worthless if it didn't. The app header shows the
  live countdown.
- ⏳ **Sonnet 5's introductory $2/$10 pricing ends 2026-08-31** (§6). Phases 2 and 4 are the
  Sonnet-heavy ones. Running them before the 31st is worth roughly a third of their cost —
  but only after the deadline item above is confirmed.
- ✅ **`prov`/`conf` badge is now BUILT** (2026-08-28). A shared `provLine(q)` helper in
  `app.js` renders one badge under every explanation, at all three render sites (browse,
  quiz, review). States, verified in the browser: `official key` (blue) when `prov` matches
  /official/i, else `derived · high` (green) / `medium` (amber) / `low` (red) from `conf`,
  and `derived · unrated` (amber) when `conf` is absent — so an unrated answer can never
  read as authoritative by omission. **The System Analyst app still lacks this**; port
  `provLine` over if that app matters.
- **Mizo Language Proficiency Certificate** to Middle School standard is required to sit
  this post's exam at all.
- **No exam date announced** — the countdown must stay user-set.
- **`prov` and `conf` are not yet surfaced as UI badges.** The System Analyst app has the
  same gap (`CLAUDE.md`: "Per-question `confidence` is tracked in data but not yet
  surfaced as a UI badge"). Given how many System Manager answers will be `derived`
  rather than official, this app needs the badge more than System Analyst does.
  Consider it part of Phase 1 rather than deferring.
- **`subject` field in `mpsc_bank_v2.json` is useless** — 90% of records are `"gk"`.
  Filter on `paperId`. Confirmed in Phase 1: the bank holds 77,751 questions total.
- **11,458 MCQs in the bank still have `answerIndex: -1`**, and 120 parsed answer keys in
  `mpsc-question-bank/state/answer_keys_parsed.json` sit unused. Neither the Computer
  Operator nor the Informatics Officer entry in that file has any parsed answers
  (both show 0), so it will not help Phase 3 — verify from the question PDFs directly.
- **Informatics Officer Technical Paper-II 2021 has 0 of 100 answers** in the bank. If
  you cherry-pick from it, every answer needs deriving.
- **The 2024 Informatics Officer technical papers are not in the bank** but exist as OCR
  in `pdfs/Old_Questions/Direct_2023-2025/`. 275 of them are already transcribed into
  `public/mpsc-system-analyst/data/questions.js` — reuse that, don't re-extract.
