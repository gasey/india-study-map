# Group B review guide — how to continue this work

Updated 11 October 2026. This is the workflow guide for any model continuing the
UDC / LDC / Group B question bank. Read it together with
[HANDOFF-SUBJECT-PRACTICE.md](HANDOFF-SUBJECT-PRACTICE.md) (module contract) and
[HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md) (source/import audit).

The single rule that governs everything: **the printed source page and the
official key are the truth.** A stored transcription, a topic tag, a peer-paper
match or a confident-looking explanation is only a lead until it is checked
against the source. Never invent a stem, an option, a page number or an answer to
make an item look complete. Holding an item unscored with a written reason is
always preferred to guessing.

## 1. What the bank is and where the truth lives

- Live app repository: `/home/hruaia/workspace/projects/personal/india-study-map`
  (remote `git@github.com:gasey/india-study-map.git`, aliased live at
  https://map.hawayu.in).
- Source PDFs are served from `public/papers/group-b/` and the sibling archive
  `../mpsc-question-bank/pdfs/Old_Questions/`.
- `tools/udc-ldc-build/build_group_b.py` regenerates the Group B bank, library and
  the progress ledgers. **Never hand-edit** the generated files:
  `src/data/banks/mpsc-group-b-general.ts` and
  `src/data/banks/mpsc-group-b-library.json`.
- Durable **inputs** (safe to edit, all guarded by hashes or exact-match asserts):
  - `group-b-text-repairs.json` — the canonical reviewed repair file: source
    SHA256 guards, checked stems/options/pages, `nonMcq` removals, worked
    `derivedAnswers`, held explanations and complete `written` tasks.
  - `reviewed-study-guides.json` — worked guides added on top of records that
    already carry an official single-choice key (see §4).
  - `verified-general-keys.json` — official key registrations with download URL.
  - `jao-2026-series-b-reviewed.json`, `language-written-repairs.json`,
    `enrich_2018_papers.py` — paper-specific reviewed inputs.
  - `src/data/banks/mpsc-study-topic-tags.json` — reviewed topic classification
    (IDs only; it makes no answer claim).
- Generated **ledgers** (regenerated each build, commit them):
  - `tools/udc-ldc-build/build-report.json` — whole-bank totals.
  - `tools/udc-ldc-build/english-review-progress.json` — per English source.
  - `tools/udc-ldc-build/subject-review-progress.json` — every subject
    (English / Arithmetic / Computer / GK / Reasoning), per paper and per
    section (`tools/udc-ldc-build/subject_review_progress.py`).

## 2. Pick the next work from the ledgers, not from memory

Open `subject-review-progress.json` and choose a paper where `pendingMcq` or
`pendingWrittenGuides` is non-zero. Useful fields per paper:

- `ready` / `readyOfficial` — practice-ready MCQs (official-key-backed or derived).
- `heldReviewed` + `heldItems[]` — checked but deliberately unscored, with reason.
- `workedGuidesReviewed` / `pendingMcqGuides` — does the question have a real
  worked explanation, or only key feedback (`keyOnlyFeedback`)?
- `missingMcq` — printed questions not recovered from the source (`null` = unknown).

Prioritise papers with a **complete official key** and **readable** stems/options.
`english-review-progress.json` does the same for English sources.

The distinction the ledger protects: *the key gives an answer* is not the same as
*the question has a checked worked explanation*. The bank already has thousands of
key-only records (`keyOnlyFeedback`); converting them to worked guides is the
main remaining content task.

## 3. Read the source correctly

1. Match the paper by identity/hash, not filename. Check the PDF cover.
2. Determine whether the PDF has a text layer:
   ```sh
   pdftotext -layout "<paper>.pdf" /tmp/paper.txt && wc -c /tmp/paper.txt
   pdfinfo "<paper>.pdf"
   ```
   - Text layer present: read `/tmp/paper.txt` with `-layout` and preserve wording,
     capitalisation, punctuation, emphasis, blanks, section directions, passages.
   - Scan only (empty text, as with the December 2024 Paper-II): render pages and
     read them. For a vision-capable model use the page images directly:
     ```sh
     pdftoppm -f 1 -l 10 -scale-to 1600 -jpeg "<paper>.pdf" /tmp/review/paper
     ```
     Where no vision channel is available, `tesseract page.jpg - --psm 4` reads
     these MPSC scans well enough to corroborate stems and option order — but OCR
     is a lead, not proof; hold anything the OCR garbles (fractions, tables).
3. Read the **official final key** page(s) too, and register the key URL/sha in
   `verified-general-keys.json` if it is new.
4. Record the SHA256 of both PDFs; the guards in the durable inputs require them.

Emphasis markup (only where the scan prints it):
`**bold**`, `*italic*`, `__underline__`, `***bold italic***`, `__*underlined italic*__`.
A run of three or more underscores is a printed blank; keep the stem blank empty
and store any reveal answer in the answer field. Run
`node tools/udc-ldc-build/check-question-text.mjs` after renderer/emphasis work.

## 4. Two ways to make an item practice-ready

Pick the mechanism that matches the record:

A. **`group-b-text-repairs.json`** — the general repair/derivation file. Use it to
   add checked stems/options, `derivedAnswers` (worked answer + explanation) for
   papers without an official key, remove non-MCQ rows, or supply written tasks.
   This is where provenance, `sourceReview` gates and compensated detection are
   computed.

B. **`reviewed-study-guides.json`** — for a record that *already* has an official
   single-choice `answerSource: 'official'` and a `answerKeyRef`, but only
   key-feedback as its explanation. Add a batch:
   ```jsonc
   {
     "batches": [{
       "paperId": "mpsc-group-b-ng-2024-paper-2-a",
       "sourceHref": "/papers/group-b/<paper>.pdf",
       "sourceSha256": "<sha>",
       "keyHref": "/papers/group-b/<key>.pdf",
       "keySha256": "<sha>",
       "reviewedOn": "2026-10-11",
       "evidence": "printed pages/stems checked; independent derivation matched key",
       "questions": {
         "<question id>": {
           "expectedQuestion": "<exact stored stem>",
           "expectedOptions": ["…"],
           "expectedOfficialAnswerIndex": 0,
           "independentAnswerIndex": 0,
           "explanation": "worked derivation / rule, ending at the printed choice",
           "page": 5
         }
       }
     }]
   }
   ```
   `reviewed_study_guides.py` asserts the stem, options, official index and key
   reference still match, so a stale entry fails the build instead of silently
   overwriting. If your independent answer **differs** from the official key the
   item is automatically held unscored with a dispute note — do not force it
   through. Generate the `expected*` fields from the built bank (see §6) so you
   never retype a stem.

For **written prompts** use `type: 'descriptive'` task records in
`group-b-text-repairs.json` with `guidance`/`modelAnswer` as an approach outline —
never a fabricated single answer. A written guide is source-reviewed but never
enters MCQ scoring.

## 5. Give each question a section and a topic

- Set `studySection` to `english|arithmetic|computer|gk|reasoning` from the
  question's content, not the paper title (mixed papers are common).
- Add a canonical `topic` only from `src/modules/udc-ldc/studyTopics.ts`
  (Maths/Computer) or `TOPIC_SECTION` in `filters.ts`. Put ID-based
  classification for existing questions in
  `src/data/banks/mpsc-study-topic-tags.json`.
- Unknown material resolves to `mixed` and stays visible. Broad legacy tags are
  not precise subtopics. A topic label verifies nothing about the answer.

## 6. Verify, build and check

```sh
# 1. regenerate bank + ledgers (asserts integrity, no answer fields in rows)
python3 tools/udc-ldc-build/build_group_b.py

# 2. tests (27 Python tests)
python3 -m unittest discover -s tools/udc-ldc-build -p 'test_*.py'
node tools/udc-ldc-build/check-question-text.mjs

# 3. production build
npm run build
git diff --check
```

To produce a `reviewed-study-guides.json` batch without retyping stems, read the
built bank (the part arrays parse with `json.JSONDecoder().raw_decode` from each
`const groupBQuestionsPartN` start — a regex ending at the first `];` can
truncate a stem containing `];`), pull `expectedQuestion`/`expectedOptions`/
`expectedAnswerIndex` by id, and pair them with your `independentAnswerIndex`,
`explanation` and `page`.

Browser verification uses Chrome DevTools Protocol on `127.0.0.1:9222` against the
Vite `/udc-ldc` route (or a URL argument):

```sh
# terminal A
npm run dev            # or: npm run preview
# terminal B: launch a Chromium with remote debugging, open the /udc-ldc tab at 127.0.0.1:5173
python3 tools/udc-ldc-build/browser-check.py
python3 tools/udc-ldc-build/browser-check.py https://map.hawayu.in/udc-ldc
```

`browser-check.py` hardcodes expected counts and per-paper assertions; update any
that a verified change moved (they are the acceptance test, not an oracle).

## 7. Publish

```sh
git add -A && git commit -m "<paper/batch>: <what was reviewed>"
git push origin main
vercel --prod --yes --scope gaseys-projects   # --scope is required
```

Confirm the deployment is READY and aliased to https://map.hawayu.in, then run
`browser-check.py` against the live URL. Only claim a deploy after READY + alias.

## 8. Holding items (do this honestly)

An item stays unscored, with a reason, when the printed question is defective
(two correct options, no matching option, a broken figure), when the source page
is missing, or when an independent solution conflicts with a single official key.
Record the exact reason (`disputeNote`/`sourceNote`) next to the item. Never clear
a hold merely to reduce a counter.

## 9. Model / effort guidance

Use a **medium**-effort small model for a bounded paper with a readable scan,
known option order and a complete official key; a **low**-effort model for
metadata/format-only edits. Use the strongest reasoning model for damaged OCR,
overlapping numbering, ambiguous grammar or key conflicts. Effort is a
recommendation, not a guarantee — evidence controls readiness. Do not auto-switch
a running task or spawn agents without authorisation.

## 10. First concrete batch (worked example)

`reviewed-study-guides.json` ships with one batch:
`mpsc-group-b-ng-2024-paper-2-a` (MPSC Combined Group B NG, Paper-II, December
2024, Series A) — Computer Knowledge Q1–8 (page 2) and Simple Arithmetic Q36–45
(pages 5–6). The paper and key are scans with no text layer, so the printed pages
were read with Tesseract and each independent derivation was worked out and
matched the MPSC final key. This turned 18 key-only records into checked worked
guides and resolved Q36's stale transcribed conflict. Use it as the template for
the next paper: pick a ledger row, read the scan and key, add the batch, rebuild.
