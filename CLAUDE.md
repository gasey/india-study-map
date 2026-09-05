# CLAUDE.md — india-study-map

Personal-use, India-focused exam-prep app (React + Vite + TypeScript SPA).
Not part of the Shiksha ecosystem — a separate solo project. The user is
personally studying for MPSC (Mizoram Public Service Commission) exams
using this app, so correctness of question/answer content is not
cosmetic — a wrong answer teaches the user something false for a real exam.

## What the user wants from you, specifically

- **Verify content against source, don't trust the pipeline's own output.**
  This bank has already had one silent-data-loss incident (an OCR extractor
  that quietly dropped ~280 questions with no numbering gap to reveal it —
  see DEVLOG 2026-08-04) and one silent-corruption incident (a comprehension
  question rendered as a garbled MCQ with blank options — same date). If
  something in the app looks "off" (garbled text, missing options, a
  question that doesn't quite make sense), the right instinct is to go
  check the original source PDF, not to patch around the symptom in the UI.

  **Where the source PDFs are:** in-repo at `mpsc-cse-papers/` (the 18 CSE
  Paper I/II/III PDFs — see that dir's `README.md` for the PDF→sitting
  mapping, which the filenames do *not* make obvious), plus
  `tools/system-analyst-build/sources/` and
  `tools/system-manager-build/sources/`. The
  `~/Downloads/mpsc_pdfs_examination/` path that older DEVLOG entries and
  `tools/bank-rebuild/*.py` still hardcode **no longer exists on this
  machine** — that was the `Old_Questions/` + `Answer_Keys/` corpus, and it
  is gone, so those parsers cannot be re-run as written. Don't burn time
  looking for it; if a question traces back to that corpus, the staged JSON
  under `tools/*/staged/` is the most upstream copy left.
- **Browse, not just quiz.** Every "group by X" view (By Exam, By Year, By
  Paper) must let you expand a group and actually read the questions
  inline — not just fire a mock test. This was explicitly requested after
  the first cut of By Paper only had "Start Test" buttons.
- **Match the real exam's structure.** "By Paper" means Year → sitting →
  Paper I/II/III, GS-I/II/III, English-I/II — the way MPSC actually prints
  the papers, not an arbitrary topic/keyword filter.
- **Always verify UI changes in the browser before calling them done** —
  start the dev server (`.claude/launch.json` has an `india-study-map`
  config), navigate to the actual route, click through the real flow,
  check the console. Typecheck passing is necessary but not sufficient.
- **Write a DEVLOG.md entry for anything nontrivial** — new feature,
  schema change, new endpoint, a real bug found+fixed, a design decision.
  Newest entry on top. Format: **what shipped**, **why**, **what's still
  open**. Small copy/typo tweaks don't need one. This is an explicit
  standing instruction, not a one-off — see DEVLOG.md's own header.
- **Commit messages explain the *why*, not just the *what*** — this repo's
  history already does this well; keep matching that bar.
- Only commit/push when asked. Show a summary of what changed first.

## Architecture pointers

- `src/data/banks/` — question banks (`mpsc-state-tax-officer.ts`,
  `mpsc-old-questions.ts`, `polity-codex.ts`), schema in `types.ts`
  (`BankQuestion` = `McqBankQuestion | DescriptiveBankQuestion`, discriminated
  by `type`). Use `isMcqQuestion()` / `type === 'descriptive'` to split a
  pool — never filter by `topic` string to infer type, that's a trap (see
  the `descriptiveQuestions` bug fixed 2026-08-04: it was filtering on
  `topic === 'essay' | 'eng_precis_letter'` and silently dropped any
  descriptive question with a different topic tag).
- **`src/data/banks/mpsc-state-tax-officer.ts` is a GENERATED file** for
  the sittings the rebuild pipeline covers. Pipeline + README live in
  `tools/bank-rebuild/`. Re-running it reproduces the file byte-for-byte.
  Edit the inputs there, not the `.ts` output — *except* for the small
  set of hand-curated records that predate the pipeline entirely (the
  2016 English Paper I essay/précis/comprehension questions) and aren't
  touched by `apply.py`; those are fine to hand-edit directly since the
  next `dump-bank.mjs` run just re-baselines from the current `.ts` anyway.
- `src/modules/mpsc/StateTaxOfficerEnhanced.tsx` — the State Tax Officer
  module's main component. `QuestionCard` and `BrowseGroupCard` are shared
  building blocks used by the Question Bank, By Exam, By Year, and By
  Paper tabs — extend those rather than re-duplicating card markup.
- `src/modules/mpsc/DescriptiveQuestionCard.tsx` — the one global render
  format for `type: 'descriptive'` questions (essay prompts, lettered
  sub-parts a–z). Each sub-part is independently flaggable/correctable.
- Question review system (flag/correct/comment/note, admin panel) is
  backed by `mpsc-api`, a FastAPI service on the `shiksha-dev` droplet —
  not Supabase, not local. Bank-agnostic by schema (`bank_id` +
  `question_id` keys), so it already covers any future bank with zero
  schema changes.
- `tools/bank-rebuild/SOLVE_BRIEF.md` — the rules given to any agent/model
  asked to answer a batch of recovered questions with no official key:
  never reorder options, be honest about confidence (don't inflate to
  "high"), don't fabricate facts, flag genuinely broken/unanswerable
  questions rather than silently picking an answer.

## Known rough edges (as of 2026-08-04)

- 2016/2019/2021 sittings are rebuilt but their answers are
  `answerSource: 'derived'` (agent-solved, no official MPSC key exists) —
  ~66 of those 548 answers are self-flagged medium/low confidence, worth a
  human review pass eventually, especially the Mizoram-specific GK batch.
- 232 history questions still sit under one broad `gs1_history` topic —
  finer sub-topic tagging was never done.
- A handful of questions are unanswerable as extracted (missing
  figures/data tables the OCR never captured) and carry low-confidence
  placeholder answers rather than being dropped.
- ~~Per-question `confidence` is tracked in data but not yet surfaced as a
  UI badge.~~ **Fixed 2026-08-29** in both the System Analyst and System
  Manager static apps: a shared `provLine()` helper renders `official key`
  (blue) when an official answer key exists, else `derived · high/medium/low`
  from `conf`, or `derived · unrated` when `conf` is absent — so an unrated
  answer can never read as authoritative by omission. Note the helper must
  test that an official key *exists*, not that the word "official" appears:
  most derived provenance strings end "...no official key for this sitting",
  and a bare `/official/i` badged 309 derived answers as authoritative.

## Full history

See `DEVLOG.md` (append-only, newest on top) for the complete narrative of
what's been built and why — treat it as more authoritative than trying to
reconstruct intent from `git log` alone.
