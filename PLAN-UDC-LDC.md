# Plan — MPSC clerical cadre (LDC / UDC / Assistant): solve every past question, ship it in parts

Written 2026-09-26. Scope and surfaces decided with the user this session.

Companion reading: `CLAUDE.md`, `HANDOFF-UDC.md`, `tools/bank-rebuild/README.md`,
`tools/bank-rebuild/SOLVE_BRIEF.md`, and the sibling repo's
`../mpsc-question-bank/{README,HANDOFF}.md`.

---

## 1. The exam, from the official syllabuses

Three different blueprints apply to this cadre. They are **not** interchangeable
— the section weights differ, and that difference is what drives the taxonomy.

### A. LDC, Direct recruitment under MPSC — 400 marks
*(Advertisement Group 'B' Non-Gazetted No.08 of 2024-2025, Schedule-III)*

| Paper | Section | Q | Marks |
|---|---|---|---|
| I-A | General Knowledge | 50 | 100 |
| I-A | General English | 25 | 50 |
| I-B | Essay writing | — | 20 |
| I-B | English Comprehension | — | 30 |
| II | Computer Knowledge (Schedule IV) | 50 | 100 |
| II | Simple Arithmetic | 25 | 50 |
| II | General Intelligence & Reasoning | 25 | 50 |

Plus: **Typing test** (30 wpm, qualifying, *before* the written exam),
**Skill test** (Word/Excel/PowerPoint, 3 questions each, 30 marks each, min 36 to
pass, qualifying only), and the **Mizo Language Proficiency Test** (2 hrs, 50
marks, pass 20 — exempt if you took Mizo at HSLC or as MIL).
Note: the skill test is *not* conducted for UDC and Assistant Grade.

### B. Assistant Grade & UDC, Direct recruitment under various departments — 400 marks

| Paper | Section | Q | Marks |
|---|---|---|---|
| I-A | General Knowledge | 50 | 100 |
| I-A | General English | 25 | 50 |
| I-B | Précis writing | — | 10 |
| I-B | Essay writing | — | 20 |
| I-B | English Comprehension | — | 20 |
| II | Basic Computer Knowledge | 35 | 70 |
| II | Simple Arithmetic | 30 | 60 |
| II | General Intelligence & Reasoning | 35 | 70 |

Set at a level **higher than UDC** where separate exams are held.

### C. Group B Non-Gazetted, General Competitive — 400 marks
*(the umbrella scheme many `Direct_NG` papers follow)*

| Paper | Section | Marks |
|---|---|---|
| General English | Essay (≤300 w) 20 · Idioms & Phrases 16 · Comprehension 12 · Grammar/Parts of Speech 20 · Composition 16 · Correct usage & vocabulary 16 | 100 |
| GS Paper-I | Modern Indian History & Culture (from mid-19th C) 60 · Indian Polity 30 · Indian Economy 30 · Geography of India 30 | 150 |
| GS Paper-II | Current Events & GK 50 · Science & Technology in India 30 · **Mizoram** history/culture/traditions 30 · Simple Arithmetic 20 · **Aptitude Test 20** | 150 |

GS-II Aptitude breaks down further: Numerical & Figurework 4, Verbal Analysis &
Vocabulary 6, Visual/Spatial/3-D 4, Abstract Reasoning 6.

### ⚠️ Negative marking — new, and the app must model it

**Mizoram Gazette Extraordinary Ex-582/2025, No.A.12038/25/2025-GSW-DPAR, dated
12 Aug 2025, published 18 Aug 2025.** Amends the Mizoram Ministerial Service
(Competitive Examination) Regulations 2023, Schedules I, II and III — i.e.
**Assistant Grade, UDC and LDC all three**:

- −1/3 of the question's marks for every wrong MCQ answer
- more than one answer marked = wrong, same penalty
- **blank = no penalty**

So on a 2-mark question a wrong answer costs 0.667. Papers sat **before Aug 2025
have no penalty; from Aug 2025 onward they do.** The test player must score each
paper under its own rule and, on penalised papers, teach the skip decision —
guessing is only worth it above ~1-in-3 confidence. This is not cosmetic; it
changes optimal exam strategy and nothing in the app currently models it.

---

## 2. What we actually have (measured 2026-09-26)

Source: `../mpsc-question-bank/` — 3,715 PDFs, `pdfs/index.csv` (3,848 rows),
`bank/mpsc_bank_v2.json` (1,938 papers / 77,751 questions).

### Papers in scope

| | count |
|---|---|
| Clerical papers in `index.csv` | **165** |
| …downloaded to disk | **165** (zero missing downloads) |
| …already parsed into `bank_v2` | **100** (3,471 questions / 44 sittings) |
| **…on disk but NOT in the bank** | **28** ← the gap |

Plus 37 titles that match the word "Assistant" but are a different cadre
(Assistant Director, Assistant Architect, Veterinary Assistant Surgeon) and are
out of scope.

### 🔴 The 28 unparsed papers include the most important ones you have

`LDC under MPSC Paper-I 2025` and `Paper-II 2025` — **the actual LDC exam,
February 2025, under MPSC** — are sitting on disk with clean OCR text and are
absent from the bank. So are:

- `Assistant UDC under MPSC paper-I` / `paper-II`
- `UDC Combined Paper-I/II, Series A–D, May-2025` (8 files = 2 real papers × 4 booklets)
- `Assistant, UDC LDE Paper-I…IV Oct-2024` (8 files)
- `Assistant Audit & Account Officer` 2024 — Arithmetic / General English / GK (3)
- `3.UDC to ASST. LDE November 2015 Paper III`
- 5 Veterinary Assistant Surgeon papers (out of scope, ignore)

Verified: every one has a `*.pdf.ocr.txt` sidecar, and the LDC-2025 OCR is clean
and well-formed (reads `COMPETITIVE EXAMINATION FOR THE POST OF LOWER DIVISION
CLERK … FEBRUARY-2025 … PAPER-I … PART-A (Multiple Choice Questions) (150
Marks)`, then numbered questions with lettered options).

**Parsing these 28 is the highest-value single task in the whole project**, and
it needs no model call to the extent the OCR is clean. It comes before anything
else.

### Answer provenance across the 100 banked papers

| `answerSource` | count | trust |
|---|---|---|
| `key` | 613 | from a key |
| `inferred` | **2,643** | a model guessed. **Not trustworthy.** |
| `derived` | 14 | agent-solved, confidence recorded |
| no answer (`-1`) | **691 MCQ** | — |
| **`explanation` present** | **0 of 3,471** | every explanation must be written |

### 3. Missing answer keys — the direct answer to your question

`pdfs/Answer_Keys/` holds **120 key PDFs**. Two facts nobody had checked:

**(a) 76 of the 120 are scans with no text layer, and NONE of the 120 has an OCR
sidecar.** `mpsc_ocr.py` was only ever run over `Old_Questions/`. Running it over
`Answer_Keys/` is free, self-hosted (`pdftoppm` → `tesseract`), takes minutes, and
unblocks 76 keys that are currently unreadable. **This is why key parsing was
never built.** It is a one-command fix and it has been sitting there.

**(b) Only two keys touch this cadre at all:**

| Key | Covers | State |
|---|---|---|
| `Provisional Answer Key of UDC, Assistant under MPSC..pdf` (No.ASST/1/2019-MPSC, 5 Apr 2024) | Assistant Grade & UDC under MPSC, Apr 2024 | ✅ clean text layer, 6,241 chars, parseable today |
| `Final Answer key of LDC - Commissioner for PwD … 2026..pdf` | LDC, Commissioner for PwD, 2026 | ❌ scan, 2 chars of text — **needs the OCR run above** |

**So for the remaining ~42 sittings there is no key, and there never will be.**
MPSC did not publish keys for the 2010–2021 clerical papers; the practice started
around 2023. Two specific gaps are worth chasing on the website:

- **LDC under MPSC, Feb 2025** — a 2025 MPSC exam, so a provisional/final key
  plausibly exists and simply wasn't in the Aug-2026 scrape.
- **UDC Combined, May 2025** — `HANDOFF-UDC.md` already flagged this as an open
  question and noted `Answer_Keys/` was never exhaustively searched.

Everything else: solved, not keyed. Which is why §6 is built the way it is.

### 4. Re-scraping the website for missing papers — yes, and here's the shape

`tools/mpsc_pdf_scraper_examination.py` and `tools/mpsc_pdf_scraper.py` already
exist, and `pdfs/index.csv` records `title, category, filename, pdf_url,
source_page` for all 3,848 files — so a re-scrape is a **diff**, not a redo.

The last scrape was Aug 2026; it is now late Sep 2026, and MPSC posts
continuously. Categories in `index.csv` that the bank never parsed at all
include `Direct_2023-2025` (350) and `Direct_2025-2027` (176), so there may be
newer clerical papers beyond the 28 already found.

Proposed, in this order:
1. **List-only pass** over the `source_page` URLs already in `index.csv` (the
   `old-question-*`, `answer-key`, `syllabus` pages) — collect links, diff
   against `index.csv`, and *report* what's new. No downloads.
2. Show you the diff. **Then** download only the new clerical papers and any new
   answer keys, on your go-ahead.
3. Append to `index.csv`, OCR the new files, feed them into the same parse path
   as the 28.

I will not mass-download from the site without showing you the diff first.

---

## 5. The taxonomy — subject / topic / paper / exam, maths and aptitude separate

Derived from the official syllabuses above, not invented. **Seven top-level
subjects.** Arithmetic and Reasoning are separate because MPSC itself prints them
as separate sections with separate mark allocations — your instinct matches the
regulation.

| id | Subject | Where it comes from | Sub-topics |
|---|---|---|---|
| `gk` | General Knowledge & Current Events | A/B Paper-I, C GS-I+II | current-affairs · modern-indian-history · art-culture · polity-constitution · geography · economy · general-science · science-tech |
| `mizoram` | Mizoram GK, History & Culture | named block in all three (30 marks in C) | pre-british · colonial-lushai-chiefs · post-independence · customary-law · folklore-song-dance · festivals · current-mizoram |
| `english` | General English | A/B Paper-I, C General English | vocabulary · spelling · grammar-parts-of-speech · sentence-structure · synonyms · antonyms · sentence-completion · idioms-phrases · composition-transformation · correct-usage · comprehension |
| `computer` | Basic Computer Knowledge | A Paper-II (Schedule IV), B Paper-II | **see the mark-weighted tree below** |
| `arithmetic` | Simple Arithmetic | A/B Paper-II, C GS-II | number-system · simplification · roots · averages · discounts · percentages · profit-loss · ratio-proportion · partnership · chain-rule · time-work · time-distance · simple-compound-interest · mensuration · permutations-combinations · heights-distances · line-graphs · bar-graphs · pie-charts · tabulation · fractions-decimals · simple-geometry · simple-statistics |
| `reasoning` | General Intelligence & Reasoning / Aptitude | A/B Paper-II, C GS-II Aptitude | analogies · similarities-differences · spatial-visualization · spatial-orientation · problem-solving · analysis · judgement · decision-making · visual-memory · discrimination · observation · relationship-concepts · arithmetical-reasoning · figural-classification · number-series · non-verbal-series · coding-decoding · statement-conclusion · syllogism · abstract-reasoning · verbal-analysis |
| `descriptive` | Written (Part B) | A/B Paper-I Part B, C essay | essay · precis · comprehension · letter |

**Computer Knowledge carries official mark weights** (LDC Schedule IV, 100
marks) — so the app can show "you are weakest in the 24-mark Word block", which
is far more actionable than a flat topic list:

- **I. Fundamentals of Computer — 20**: Introduction 2 · Basic Organization 2 · Processor & Memory 4 · Secondary Storage 2 · Input-Output Devices 2 · Computer Software 4 · Classification 2 · IT & Society 2
- **II. Operating Systems — 16**: Introduction 2 · Windows 7+ Overview 2 · Opening Screen Elements 2 · File Management 4 · Start Menu 2 · Shortcuts 2 · Accessories 2
- **III. Office Automation — 64**: Word Processing **24** (Intro 2 · Formatting 6 · AutoCorrect 2 · Spell/Grammar 2 · Find&Replace 2 · Look of Document 4 · Graphics 2 · Tables 2 · Mail Merge 2) · Excel **16** (Intro 2 · Formulas 2 · Cell Referencing 2 · Editing/Formatting/Printing 4 · Statistical Functions 2 · What-if & Data Tables 2 · Charts 2) · PowerPoint **10** (Intro 2 · Views 2 · Editing 2 · Special Effects 4) · Internet **14** (Intro 4 · Services/WWW/HTTPS/Search 4 · Electronic Mail 6)

**The classification rule — this is the part that goes wrong if you get it
backwards.** Tag a question by **the paper section it was printed under**, read
from the paper's own section headings in the OCR text. Only fall back to
content-based classification where the section heading is genuinely missing.

`arithmetical reasoning` sits in the Reasoning list while `Numerical &
Figurework` sits in Aptitude, and both look like arithmetic — content-guessing
will scatter them. The paper already tells you the answer. This is the same
lesson as the GS1/GS2/GS3 hub bug: **split on structural evidence, never on
content judgement.** And per `CLAUDE.md`, any per-id lookup table must *report*
unmatched ids, never absorb them into a default — that is exactly how
`retag_history.py` silently piled 521 of 530 questions into one bucket.

Cross-cutting axes, all independently filterable: **exam** (LDC / UDC /
Assistant / combined) · **scheme** (A / B / C) · **recruitment mode** (Direct /
Direct_NG / LDE) · **year** · **sitting** · **paper** (I / II / III / IV) ·
**section** · **subject** → **topic** · **difficulty** · **answer provenance** ·
**negative-marking regime**.

---

## 6. Answers: double-entry, because 2,643 are model guesses

For each MCQ, solve it **independently** — the solver never sees the existing
`inferred` value — then reconcile:

| independent solve vs existing | `answerSource` | UI badge |
|---|---|---|
| official key agrees | `official` | blue **official key** |
| official key disagrees | `official` (key wins) | blue + note the solve differed |
| agrees with old `inferred` | `derived`, corroborated | `derived · high/medium` |
| **disagrees** with old `inferred` | → `adjudicate/`, stronger model | `derived · medium/low` until resolved |
| no prior answer (the 691) | `derived` | `derived · <conf>` |

This costs one extra comparison and turns 2,643 liabilities into second
opinions. It also measures *how wrong* the inferred pipeline was — a number
worth knowing, since the same pipeline touched the other 74k questions.

**Never let a derived answer read as authoritative.** `CLAUDE.md` records that a
bare `/official/i` test once badged 309 derived answers as official. `provLine()`
must test that a key *exists*.

---

## 7. Where it shows — four views on one bank

You asked for System-Manager-style practice, hub-style browsing, quick-revision,
and exam display. Those are four views, one dataset, one module at `/udc-ldc`.

1. **Practice (System Analyst / Manager style)** — the main surface. Drill by
   syllabus unit with official mark weights, daily test, streak, accuracy per
   unit, concepts panel, provenance badge on every answer. Port the patterns from
   `public/mpsc-system-manager/` (`app.js` + `data/{questions,syllabus,concepts,repeats,calc}.js`).
   Bring `repeats.js` — **repeated-question detection across sittings is exactly
   what PYQ study is for**, and with 128 papers in one narrow cadre the repeat
   rate should be high.
2. **Browse (MPSC practice-hub style)** — by **year**, by **exam**, by **paper**.
   Expand a group and read questions inline, not just a "Start Test" button —
   this is an explicit standing requirement in `CLAUDE.md`.
3. **Quick revision** — the `public/quick-practice/quick-revision/` pattern:
   condensed, high-yield, one-liners per topic. Good for the Computer and Mizoram
   GK blocks, where the syllabus is finite and enumerable.
4. **Exam display** — the paper rendered as MPSC printed it, in section order
   with real mark values, a 3-hour timer, and **scoring under that paper's own
   negative-marking regime** (§1). This is the mode that tells you whether you'd
   actually clear the cut-off.

### 5. Pipeline & Reconciliation view — cross-check against the website

The view that makes "done in parts" honest, and the one that caught a real
divergence the day it was built. Fed by `../mpsc-question-bank/tools/reconcile.py`
→ `state/reconciliation.json`.

**It reconciles three sources that are currently assumed to agree and don't:**

| source | what it is | clerical papers |
|---|---|---|
| `site` | `pdfs/index.csv` + `state/scrape_diff.json` — what MPSC published | **122** |
| `local` | PDFs on disk, `*.ocr.txt`, `bank/mpsc_bank_v2.json` | 122 downloaded, 122 with text, **100 parsed** |
| `live` | the droplet's `papers`/`questions` tables — what the website actually serves | **4** |

Measured 2026-09-26: bank holds **3,471 questions**, the live site serves **90**,
and the overlap between them is **zero**. 100 banked papers are not served; the
4 served papers are not in the bank — and two of those are 6-question and
3-question fragments of `UDC Combined Paper-I` Series B and C, which is the
duplicate-booklet trap from `HANDOFF-UDC.md` showing up in production data.

**Per-paper pipeline progress.** One row per paper, with the stage it has
reached — `on-site → downloaded → ocr → banked → solved → live` — plus
`questions / answered / from a key / explained`, and a **∆ column against the
live site**. Sort by "furthest behind" to get the work queue for free. Current
furthest-stage tally: `banked 100 · ocr 13 · live 4 · downloaded 5`.

**Upload progress.** Do not build a new job tracker — two tables already exist
on the droplet and **both have zero rows**:

- `ingest_jobs` (`pdf_key`, `stage`, `status`, `error`, `updated_at`) — a
  per-PDF stage tracker, exactly this feature, never used.
- `import_runs` (`filename`, `status`, `parsed_papers`, `parsed_questions`,
  `written_questions`, `written_question_ids`, `payload`, `error`, `actor_id`,
  `created_at`, `applied_at`) — with a **dry-run → apply** flow where a count
  mismatch on apply rolls back and fails loudly. `ImportTab.tsx` says this was
  built *because* IMP-0138 lost 280 questions silently.

So wire the Phase-1 parser to write `ingest_jobs` rows as it walks each PDF, and
push every bank update through the existing dry-run/apply path rather than a
direct write. The count check is the whole point: **parsed-in must equal
rows-written, or nothing lands.** That is the guard that would have caught both
historical silent-loss incidents — and it caught my own answer-key parser losing
more than half its data in Phase 0.

**Reconciliation, not just coverage.** Three explicit states per paper, because
"missing" has three different fixes:
- *behind* — in the bank, not served → needs publishing
- *ahead* — served, not in the bank → the live data came from somewhere else and
  is unaudited (all 4 current cases)
- *diverged* — both sides have it with different question counts → investigate

⚠️ **Join on the file BASENAME, never the path.** The droplet stores
`source_file` as `mpsc_pdfs_examination/Old_Questions/…` while the bank uses
`Old_Questions/…`; exact-path overlap between them is **zero**, so a
path-keyed join silently matches nothing and reports perfect agreement. This is
`README.md` "Open problems" #3, and it is a booby trap for exactly this feature.

Reuse from `src/modules/mpsc/`: `QuestionCard`, `BrowseGroupCard`,
`DescriptiveQuestionCard`, `FilterRail`, `TestBuilder`/`TestPlayer`,
`useAttemptState.ts`. Do not re-duplicate card markup. Flag/correct/comment goes
to the existing `mpsc-api` — bank-agnostic by schema (`bank_id` + `question_id`),
zero backend change.

---

## 8. Admin corrections with full, attributed history

**Most of this already exists and works.** Verified against the live droplet
(`ssh shiksha-dev`, FastAPI at `/root/misc/mpsc_api`, Postgres `mpsc_study`) on
2026-09-26 — not read off a handoff doc. Build on it; do not start a parallel
system.

### What is already live

| Piece | State |
|---|---|
| `question_corrections` | 163 rows. `UNIQUE (bank_id, question_id)`, FK `updated_by → users(id)`. Fields: `corrected_answer_index`, `corrected_explanation`, `corrected_note`, `corrected_stem`, `corrected_options` (jsonb), `corrected_subparts` (jsonb), `updated_by`, `updated_at` |
| `question_audit_log` | 191 rows. `bank_id`, `question_id`, `subpart_label`, `action`, `actor_id`, **`before` jsonb**, **`after` jsonb**, `note`, `created_at` |
| Actions logged | `correction`, `comment_pinned`, `role_assigned`, `password_reset`, `signup` |
| RBAC | **Phase 3 is deployed.** `owner` (gasey) / `admin` ×3 / `learner` ×3. Caps incl. `correction.write` rank 4, `audit.read` rank 5, `user.role.assign` rank 6 |
| API | `POST /api/admin/corrections`, `GET /api/admin/audit-log` — **already filterable by `questionId`, `actorId`, `action`, date range** (`mpscApi.ts:584`) |
| UI | `src/modules/admin/` — `QuestionEditor.tsx` (writes a correction record; original extraction never overwritten), `tabs/AuditLogTab.tsx`, `QuestionsTab.tsx`, `RoleMatrix.tsx` |

**The audit trail is genuinely correct.** I checked whether `before` was being
written: of 180 `correction` rows, 163 have `before = null` and 17 have it
populated — which is exactly right, because 163 are a question's *first*
correction (nothing preceded it) and 17 are re-edits. Traced one question edited
three times (`assistant-director-town-planning-2023__0__1`): rows 31 (actor 1,
before null), 33 (actor 1, before set), 174 (actor 3, before set). **Who, when,
from-what, to-what is all captured today.** No migration needed.

### The four real gaps

1. **No per-question history view.** `AuditLogTab` is a global reverse-chron
   feed. While correcting a question you cannot see that it has already been
   edited three times, by whom, or what they changed. The data and the API
   filter both exist — this is a missing panel, nothing more.
   → Add a **History** section inside `QuestionEditor`: reverse-chron timeline,
   each entry `actorUsername · createdAt · field-level before→after diff`, with
   the current live value pinned at top. Computed by diffing the `before`/`after`
   JSONB per field, so it reads "answerIndex 2 → 1, explanation changed" rather
   than dumping two JSON blobs.
2. **No revert.** Restoring an earlier version means replaying the audit log by
   hand. → Add a **Revert to this version** action per history entry. It must
   write a *new* correction (and therefore a new audit row attributed to whoever
   clicked it), never rewrite history. An undo is an edit, not an erasure.
3. **`audit.read` (rank 5) outranks `correction.write` (rank 4).** An `editor`
   can change an answer but cannot see who changed it before them — backwards for
   a system whose point is attribution. → Either drop `audit.read` to rank 4, or
   add a narrower `audit.read_question` cap at rank 4 so editors see the history
   of the question in front of them without getting the site-wide feed. **This is
   a permission change on live accounts — needs your say-so** (§11).
4. **Wire the new bank.** The schema is bank-agnostic by design (`bank_id` +
   `question_id` text, no FK into any questions table), so `mpsc-udc-ldc` needs
   **configuration, not migration**. Corrections currently exist for exactly one
   bank, `mpsc-practice-hub`.

### One latent footgun found

There are **two `users` tables** — `public.users` and `learn.users`. A bare
`information_schema` query over the table *name* returns both, with doubled
columns and mismatched types (`id integer` vs `id uuid`). Whichever one
`search_path` resolves to is the one auth uses. Anything that joins
`actor_id → users.id` must qualify the schema explicitly or it will silently
bind to the wrong table. Worth a deliberate look before adding audit joins.

### Correction provenance must reach the learner view too

A corrected answer should not silently look like an extracted one. Extend
`provLine()` with a third state alongside `official key` and `derived · <conf>`:
**`corrected by <user> · <date>`**, linking to the history panel. The standing
rule from `CLAUDE.md` holds — the badge must test that a key *exists*, never
that the word "official" appears; a bare `/official/i` once badged 309 derived
answers as authoritative.

---

## 9. Pipeline

New `tools/udc-ldc-build/`, same shape as the proven `tools/bank-rebuild/`.
Reuses `SOLVE_BRIEF.md` verbatim.

```
tools/udc-ldc-build/
  ocr_keys.sh          # mpsc_ocr.py over Answer_Keys/  -> unblocks 76 scanned keys
  parse_new.py         # the 28 unparsed papers, from *.ocr.txt  -> staged/
  extract.py           # the 100 banked papers -> staged/<sittingId>.json
  dedupe_series.py     # Series A-D -> one booklet per sitting (assert, don't assume)
  repair.py            # the 22 broken-option MCQ, against *.ocr.txt
  classify.py          # section headings -> subject/topic per §5; reports stragglers
  parse_keys.py        # answer-key PDFs -> official-answer-keys.json
  scrape_diff.py       # list-only site pass -> report new files vs index.csv
  solve/ adjudicate/   # bank-rebuild convention: <batch>.json -> <batch>.solved.json
  apply.py             # -> src/data/banks/mpsc-udc-ldc.ts (idempotent, byte-identical)
  LEDGER.md            # one row per sitting: stage, counts, accuracy-vs-key, date
```

**Batch = one sitting**, newest first. ~50 sittings once the 28 land.

### Model tiering (as requested)

| Work | Model |
|---|---|
| Deterministic — key parsing, OCR, filename parsing, series dedupe, section-heading classification | **no model** |
| Reading `.ocr.txt` to pair questions with options, JSON reshaping, mechanical edits | **Haiku** |
| Solving GK / English / arithmetic / reasoning / computer batches per `SOLVE_BRIEF.md`; writing the scripts once the schema is fixed; the React views once the shape is settled | **Sonnet** — the bulk |
| Schema + id strategy; adjudicating solve-vs-inferred disagreements; Mizoram-specific GK; "did MPSC print it that way or is it a bug" | **Opus** |

Rule: **deciding the shape → Opus; filling in a known shape → Sonnet; mechanical
→ Haiku; deterministic → no model.** The habit of reaching for a model is what
produced 2,643 inferred answers while 120 keys sat unread on disk.

Solver runs bill against **weekly OAuth quota**
(`~/.mpsc_claude_oauth_token__<slug>`, via `claude setup-token`), not credits.
Do not use `sk-ant-api03-…` console keys — credit-billed, and what burned money
in July.

---

## 10. Phases

### Phase 0 — ✅ DONE 2026-09-26. Full write-up: `../mpsc-question-bank/PHASE0-RESULTS.md`

1. ✅ **OCR'd all answer keys** (`tools/ocr_answer_keys.py`) — 76 OCR'd, 44 had a
   text layer, 0 failures. The LDC-PwD 2026 key is readable for the first time.
2. ✅ **Parsed all 120 keys** (`tools/parse_answer_key_pdfs.py`) — 118 parsed,
   **42,208 answers** → `state/official-answer-keys.json`. Two silent-data-loss
   bugs found and fixed in the parser itself (heading-driven sectioning was
   losing >half the data while reporting success; subject-less labels collided).
   Compensated questions are detected **structurally, as numbering gaps** — the
   `(Compensated)` text is split across lines by the columnar layout and cannot
   be matched as a word. Corrigendum precedence is still **not applied**; it
   needs the exam↔key matching that Phase 1 builds.
3. ✅ **Site diff** (`tools/scrape_diff.py`, list-only) — 158 new files, 5 new
   in-scope papers (Bench Clerk Grade II 2026 I–V), a **live LDC recruitment
   advertisement**, and a new LDC syllabus that is **identical** to the one in
   §1 bar a header line. **No new key exists for LDC Feb-2025 or UDC May-2025** —
   settled as a negative result.
4. ✅ **Downloaded 8 approved files** (`tools/fetch_new.py`), `index.csv` backed
   up and appended.
5. ✅ **`audit.read_question` cap added at rank 4** on the live API, so editors
   can see who edited a question before them without getting the site-wide feed.
   Verified across all six roles; no regression for admin/owner.

**Phase 1 now has 33 papers to parse, not 28** — the 5 new Bench Clerk papers
join the list and are not yet OCR'd.

### Phase 1 — parse the 28 missing papers
LDC Feb-2025 Paper-I/II first. Dedupe Series A–D to one booklet per sitting,
asserting the others really are reorderings (compare sorted question-text sets).
Watch the OCR trap from `HANDOFF-UDC.md`: **question numbers stack in a column
and the texts follow below**, so `^\d+\.` pairs them wrongly — read the block,
pair deliberately, then verify against a key where one exists.

**Exit test:** LDC 2025 Paper-I yields exactly 50 GK + 25 English MCQ in Part A
and the Part B descriptive prompts, matching the published blueprint. The
syllabus gives you a per-section expected count for every paper in scope — use it
as an assertion on every parse. That check is precisely what would have caught
the 2026-08-04 silent loss of ~280 questions.

### Phase 2 — calibrate the solver against known truth
Solve the Apr-2024 Assistant/UDC sitting blind, diff against its official key
**in code, not by eye**, record accuracy in `LEDGER.md`.

A gate, not a formality. If the solver scores poorly where truth is known, the
other ~48 sittings need a different approach — decide that here for the price of
35 questions, not after 3,000.

### Phase 3 — ship `/udc-ldc` on the LDC 2025 + Apr 2024 sittings
All four views end-to-end on ~170 questions. Browse, practice, quick-revision,
exam display with negative marking, coverage panel, flag a question. Verify in
the browser per `CLAUDE.md` — dev server, real route, real clicks, check the
console. Typecheck is necessary, not sufficient.

Shipping the surface early means every later batch is just data, and you get the
most exam-relevant paper you own usable this week.

### Phase 4 — grind the rest
Per sitting: classify → solve (Sonnet) → diff vs inferred → adjudicate (Opus) →
`apply.py` → ledger → spot-check. Newest first. Each batch independently
resumable; nothing depends on anything earlier except the ledger.

### Phase 5 — descriptive, repeats, polish
201 descriptive questions have `modelAnswer: null` everywhere — don't build
reveal-on-click before the data exists. Then repeated-question detection across
sittings, the 47 diagram questions, and a targeted audit of the 405
vision-extracted questions.

---

## 11. Traps already paid for — do not rediscover these

- **Series A/B/C/D are the same paper reordered** (verified on May-2025).
  Importing four booklets = 4× duplicates. One per sitting.
- **OCR detaches question numbers from bodies** in these clerical papers.
- **Preserve the paper's typos in options** — May-2025 prints "Crome". That is
  what the candidate saw. Note it; never silently correct.
- **Never hand-edit a generated file.** 35 hand-typed UDC questions once sat in
  `public/mpsc-system-manager/data/*.js`, one pipeline run from silent deletion.
- **A default-valued lookup silently accumulates** — `retag_history.py`, 521 of
  530 questions in one bucket, 73 not even history. Report stragglers.
- **Where an official key exists, do not set `alt`** — it renders a DISPUTED
  block that contradicts the badge directly beneath it.
- **Verify against source, not the pipeline's output.** This archive has had one
  silent-data-loss incident (~280 questions, no numbering gap) and one
  silent-corruption incident. Both produced zero errors.
- `~/Downloads/mpsc_pdfs_examination/` resolves to nothing — the home dir was
  renamed. Working copy is `../mpsc-question-bank/pdfs/`; the original survives at
  `/home.old/hruaia/Downloads/mpsc_pdfs_examination/`.
- **`mpsc-question-bank` is not a git repo** and `.gitignore` excludes
  `bank/*.json`. The 58 MB `mpsc_bank_v2.json` everything here depends on is
  unversioned. Back it up before any script writes near it.

---

## 12. Known future work — format and syllabus drift across years

⚠️ **Deferred deliberately, not overlooked.** Everything built so far assumes
the *current* blueprints (§1). They came from the 2024-25 / 2026-27 syllabus
PDFs, and `blueprint_for()` in `tools/parse_papers.py` hardcodes their question
counts — 75 for Paper-I, 100 for Paper-II, with fixed section boundaries.

The in-scope corpus spans **2010 to 2026**. MPSC has demonstrably changed this
exam over that period:

- negative marking arrived only in **Aug 2025** (§1)
- the Assistant/UDC and LDC schemes differ from each other *today*, so older
  sittings very likely differ again
- the Group B Non-Gazetted scheme (blueprint C) is a third structure entirely

So for pre-2024 papers the blueprint gate will refuse correct parses and the
position-based section assignment (`gk` 1-50, `english` 51-75) will mislabel.

**When that work starts:** derive each sitting's blueprint from the syllabus in
force *at that time* rather than from today's, key it by year-range, and let
`blueprint_for()` resolve year → blueprint. `pdfs/Syllabus/` holds 113 syllabus
PDFs including older ones. Until then, a `None` blueprint means "no gate" — the
parser reports but cannot refuse, which is why those papers must not be staged
blind.

The six papers staged so far are all 2024-2025 sittings, so they sit safely
inside the current blueprints.

## 13. Open questions

1. **LDE priority.** 54 of the 100 banked papers are LDE (departmental
   promotion). Same syllabus, good practice, but if you are sitting the Direct
   exam they are second-tier. Current plan interleaves them by year — say the
   word and they go last.
2. **Mizo Language Proficiency Test** is a qualifying paper for LDC (unless you
   took Mizo at HSLC). Not in scope above. Do you need it?
3. **Typing and skill tests** are qualifying and practical — out of scope for a
   question bank, but a 30 wpm typing drill is cheap to build if you want it.
4. `mpsc-question-bank` has no git history at all. `git init` before this project
   starts writing to it?
