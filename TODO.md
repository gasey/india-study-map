# TODO

One list of what is actually open, across both study apps and the shared bank.
**Written 2026-09-06.** Newest state wins; `DEVLOG.md` carries the narrative.

## How to not let this file rot

This project has lost real time twice to notes that outlived the thing they
described — a "12 live wrong answers" item that had been fixed a day earlier and
survived in three files, and a `CLAUDE.md` line saying a 3,715-PDF corpus was
deleted when it had only moved. Both cost more than the work they described.

So: **before acting on any item here, verify it is still true.** Every item below
carries a *Check* line — a command or a file to look at that answers "is this
still open?" in under a minute. If the check says done, delete the item in the
same commit. An item without a check does not belong in this file.

Status keys: **OPEN** · **BLOCKED** (needs the user) · **DONE** (delete on sight).

---

## 1. The recovered corpus — biggest available win

`/home.old/hruaia/Downloads/mpsc_pdfs_examination/` is intact: 3,715 PDFs,
`Old_Questions/`, `Answer_Keys/`, `Syllabus/`, `index.csv`. Two files used to say
it was deleted; both are corrected. Nobody has inventoried it since.

- **OPEN — Informatics Officer Technical Paper III, Nov 2024.** 100 questions,
  same official MPSC key already transcribed for Paper II. Subject is IT
  project / quality / HR management; the fit is narrower than Paper II's, mostly
  System Manager TECH2 Unit V (Project Management Fundamentals, Documentation
  Standards). Expect a low yield — Paper II gave 18 of 100 — but they would be
  official-key answers.
  *Reuse:* add to `PAPERS` in `render_pages.py`, copy
  `EXTRACT_BRIEF_IO2024.md`, then follow `import_io2024_p2.py`.
  *Check:* `ls tools/system-manager-build/extracted/ | grep IO2024-P3`
- **OPEN — Informatics Officer General English Papers I and II, Nov 2024.** Same
  sitting, same key. The System Manager GE paper is 100 marks and counts for
  merit.
  *Check:* `grep -c IO2024-GE public/mpsc-system-manager/data/questions.js`
- **OPEN — inventory the rest.** No one has listed what else in those 3,715 PDFs
  is on-syllabus for either post, or which sittings have published keys.
  `tools/system-analyst-build/staged/answer-keys-inventory.json` covers 120 key
  files and is the place to start.
  *Check:* is there a file naming the corpus's on-syllabus papers? Today, no.

## 2. Question depth

- **OPEN — System Manager TECH2 is thin.** 111 of 136 leaves hold fewer than 6
  questions. Unit V alone has 11 leaves sitting at exactly 2. All leaves are
  covered (0 bare), so this is depth, not gaps. A depth pass on Unit V's thin
  leaves (~44 authored questions to reach 6 each) was offered on 2026-09-06 and
  deferred by the user.
  *Check:* the leaf-count script in the 2026-09-06 DEVLOG entry, or re-derive
  from `syllabus.js` + `questions.js`.
- **OPEN — System Manager TECH1 depth** has never been measured the way TECH2
  was. Do that before authoring anything for it.
  *Check:* same script, `paper === 'TECH1'`.

## 3. Correctness — answers that may be wrong

- **BLOCKED on the user — the 20 SPLIT audit findings.** `SPLIT-FINDINGS-REVIEW.md`,
  written 2026-09-02, still says "Nothing in this document has been applied" and
  every item ends with a **Decision** line waiting for an answer. All 20 split
  the same way (`subject` upheld, `skeptic` refuted). The 49 CONFIRMED findings
  are already applied; these are the leftovers.
  *Check:* `head -5 SPLIT-FINDINGS-REVIEW.md` — if it still says nothing applied,
  it is still open.
- **OPEN — 676 `derived · unrated` answers in the System Analyst bank.** Measured
  2026-09-06. Note the DEVLOG's 2026-09-05 figure of "188 unrated" is not
  comparable — it was scoped to the 746 MES + Informatics Officer cards that
  audit covered, not the whole bank. Bank-wide the concentration is
  `GEN` 287 (authored practice), `SYSTEM_ANALYST_2026_CSE_PREP` 281,
  `TECH1_OFFICIAL` 69, `MES2015_CSE` 39. The `TECH1_OFFICIAL` 69 are the highest
  priority: they are the earlier IO sitting, whose answers a 2026-08-29 pass
  found ~29% wrong.
  *Check:* count questions in `public/mpsc-system-analyst/data/questions.js`
  with no `conf` whose `prov` is not an official key.
- **OPEN — System Manager's Computer Operator answers are all derived.** MPSC
  never published a key for any Computer Operator sitting, so all 352 past
  answers in that app are inferred. Nothing to import; this is a permanent
  caveat, listed so nobody re-discovers it as news.
  *Check:* the Past Papers intro in `app.js` states it.
- **OPEN — 5 blind-vs-key disagreements in IO2024-P2** (Q8, 18, 32, 82, 96). All
  fell in the off-syllabus set so none shipped. If Paper III is imported, run the
  same comparison and treat any *high-confidence* disagreement as a transcription
  bug until proven otherwise — Paper II had zero of those, which is what made its
  option-lettering trustworthy.
  *Check:* `staged/io2024-p2-manifest.json` → `blind_vs_official_key`.

## 4. Known data gaps

- **OPEN — MES2023 Paper I Section A Q27 was never imported** (49 of 50).
  *Check:* search the System Analyst bank for `MES2023` Q27.
- **OPEN — 6 System Manager questions quarantined** for an underline marker the
  extractor lost, and **4** for a reading passage never extracted. Both need a
  page render read by eye, as `patch_underlines.py` did for SAD GE Q39–44.
  `extract_passages.py` covers only the two 2016 sittings; it needs extending to
  the 2018/2019 papers.
  *Check:* `python3 tools/system-manager-build/assemble.py` prints both counts.
- **OPEN — history sub-tagging exists but is lopsided.** `CLAUDE.md`'s "Known
  rough edges" still says 232 questions "sit under one broad `gs1_history`
  topic" and that "finer sub-topic tagging was never done". Both are now wrong:
  measured 2026-09-06, `mpsc-state-tax-officer.ts` has **530** history questions
  already split into `_ancient` 2, `_art_culture` 4, `_medieval` 3 and
  `_modern` **521**. So the tagging was done — it just puts 98% in one bucket,
  which is barely better than the single bucket it replaced. The real work is
  splitting `gs1_history_modern`. Fix the `CLAUDE.md` line at the same time.
  *Check:* `grep -oE '"topic": *"gs1_history[a-z_]*"' src/data/banks/mpsc-state-tax-officer.ts | sort | uniq -c`
- **OPEN — the 76 held-back IO2024-P2 questions** are a coherent e-Governance
  policy set with an official key. They do not fit the System Manager syllabus,
  but they are recorded in `staged/io2024-p2-manifest.json` and would suit any
  future e-governance-facing post.

## 5. Uncommitted / in-flight work

- **OPEN — System Analyst TECH2 Unit 1 generation is staged but not imported.**
  `tools/system-analyst-build/staged/tech2-u1-gen/` and `tech2-u1-review/` exist
  along with `import_tech2_u1_gen.py`, `make_u1_briefs.py` and
  `apply_u1_review_fixes.py`. This predates the 2026-09-06 session and was not
  written by it. Someone should finish or discard it.
  *Check:* `git status --short tools/system-analyst-build/`
- **OPEN — `stamp_u2u4_ids.py` has uncommitted local edits** from before
  2026-09-06. Unreviewed.
  *Check:* `git diff tools/system-analyst-build/stamp_u2u4_ids.py`

## 6. Environment papercut

- **OPEN — the in-app browser serves a stale `app.js`** through a server restart,
  `force: true` navigation and cache-busting query strings. Loading the page from
  `127.0.0.1` instead of `localhost` is a different cache key and picks up the
  new file immediately. Until that is fixed properly, **verify a UI change by
  checking `typeof` a newly-added function before trusting what you see** — the
  page will otherwise render old code with new data and look fine.
  *Check:* still reproducible as of 2026-09-06.
