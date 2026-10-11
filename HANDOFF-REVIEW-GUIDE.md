# Group B review guide — how to continue this work

Updated 11 October 2026. This is the workflow guide for any model continuing the
UDC / LDC / Group B question bank. Read it together with
[HANDOFF-SUBJECT-PRACTICE.md](HANDOFF-SUBJECT-PRACTICE.md) (module contract) and
[HANDOFF-ARCHIVE-AUDIT.md](HANDOFF-ARCHIVE-AUDIT.md) (source/import audit).

The governing rule: **check printed wording and option order against the PDF;
record the official exam answer separately from an independent solution.**
An official key can contain a mistake or a later correction. A stored transcription, a topic tag, a peer-paper
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
- Durable **inputs** (edit the relevant input; guards vary by mechanism):
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

This ledger covers the Group B supplement/source library. The separate clerical
bank uses `build_bank.py`; follow [HANDOFF-UDC-BANK-BUILD.md](HANDOFF-UDC-BANK-BUILD.md)
and inspect that generator before changing it. Do not copy Group B JSON schemas
into a different bank. Earlier dated handoff totals are historical; generated
reports describe the local build, not necessarily the deployed site.

## 2. Pick the next work from the ledgers, not from memory

Open `subject-review-progress.json` and choose a paper where `pendingMcq` or
`pendingWrittenGuides` is non-zero. Useful fields per paper:

- `ready` / `readyOfficial` — practice-ready MCQs (official-key-backed or derived).
- `heldReviewed` + `heldItems[]` — checked but deliberately unscored, with reason.
- `workedGuidesReviewed` / `pendingMcqGuides` — does the question have a real
  worked explanation, or only key feedback (`keyOnlyFeedback`)?
- `missingMcq` — the recorded expected MCQ count minus recovered MCQs
  (`null` = unknown). Check cover, numbering and pages before treating this as
  a confirmed extraction gap; it does not prove the printed paper omitted items.

Prioritise papers with a **complete official key** and **readable** stems/options.
`english-review-progress.json` does the same for English sources.

The distinction the ledger protects: *the key gives an answer* is not the same as
*the question has a checked worked explanation*. The bank already has thousands of
key-only records (`keyOnlyFeedback`); converting them to worked guides is the
main remaining content task.

## 3. Read the source correctly

1. Match the paper by identity/hash, not filename. Check the PDF cover.
   Verify post/department, sitting, paper subject, booklet series, numbering,
   duration and marks. Shared filenames/URLs can point to the wrong paper.
2. Determine whether the PDF has a text layer:
   ```sh
   pdftotext -layout "<paper>.pdf" /tmp/paper.txt && wc -c /tmp/paper.txt
   pdfinfo "<paper>.pdf"
   ```
   - Text layer present: use `/tmp/paper.txt` as a transcription aid and preserve wording,
     capitalisation, punctuation, emphasis, blanks, section directions, passages.
   - Scan only (empty text, as with the December 2024 Paper-II): render pages and
     read them. For a vision-capable model use the page images directly:
     ```sh
     pdftoppm -f 1 -l 10 -scale-to 1600 -jpeg "<paper>.pdf" /tmp/review/paper
     ```
     Create the destination directory before rendering. OCR such as
     `tesseract page.jpg - --psm 4` is a transcription aid, not evidence that a
     page was visually checked. If visual inspection is unavailable, record that
     limitation and keep affected items pending.
   - **For both kinds of PDF, visually inspect every page used in the batch.**
     Check bold/italic/underline, blanks, punctuation, directions, passages,
     tables, mathematical notation and figures. Zoom unclear cells; do not
     reconstruct them from what an expected answer would require.
3. Read the **official final key** page(s) too, and register the key URL/sha in
   `verified-general-keys.json` if it is new.
   Match the exact paper and series; record key page, status/date and any
   corrigendum. See the existing registry entry schema before adding one.
4. Record the SHA256 of both PDFs; the guards in the durable inputs require them.

Emphasis markup (only where the scan prints it):
`**bold**`, `*italic*`, `__underline__`, `***bold italic***`, `__*underlined italic*__`.
A run of three or more underscores is a printed blank; keep the stem blank empty
and store any reveal answer in the answer field. Run
`node tools/udc-ldc-build/check-question-text.mjs` after renderer/emphasis work.

## 4. Write durable repairs or add worked guides

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
       "keyHref": "/papers/group-b/<key>.pdf#page=5",
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

The guide adapter adds explanations to existing keyed records. It does **not**
clear an existing source-review, figure or compensation hold.

For **written prompts**, the durable repair uses `written[number]` with `q`,
`page` and `explanation`; the generator emits `type: 'descriptive'`. Do not add
invented `guidance` or `modelAnswer` input fields. See the template in §11.
Describe an approach or sample response as independent study guidance. Written
work never enters MCQ scoring.

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

# 2. checks when verification is requested/authorised; report actual results
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
`expectedOfficialAnswerIndex` by id, and pair them with your `independentAnswerIndex`,
`explanation` and `page`.

For a content batch, inspect the changed IDs, answer provenance, source pages,
holds, section/topic routing and generated count deltas. Check that existing IDs
and learner progress remain stable. Rebuild twice only when deterministic
regeneration is part of the requested verification. Documentation-only edits
do not require regenerating the bank or a production build.

Browser visual verification remains outstanding under an existing access
restriction for this task. **Do not bypass it with another browser, shell
automation or a CDP connection.** Use the approved browser tool if access is
restored. Report permitted build/server-render checks separately from visual
checks. `browser-check.py` contains fixed expectations: inspect these when
maintaining it, but do not run it as an alternate access route.

## 7. Publish

Check current session authorisation before pushing or deploying. The user has
authorised both in this conversation; do not ask again for the same action.
An unrelated future session must establish its own scope.

This is a shared checkout. Inspect `git status --short`, `git log -1` and the
diff before editing and again before committing. Preserve unrelated changes;
do not reset, stash or stage the entire tree. Stage only your reviewed inputs,
their generated outputs and handoffs, inspect the staged diff, and commit only
those paths. If another task has staged files, exclude them from your commit.

After the scoped commit:

```sh
git push origin main
# For a requested runtime deployment, using the existing authenticated project:
vercel deploy --prod --yes
```

If push reports divergence, inspect incoming commits and reconcile the specific
changes; never force-push to hide the mismatch. Confirm deployment READY and
the alias https://map.hawayu.in before claiming it is live. Record content commit,
deployment ID/URL and checks performed. A documentation-only guide update needs
a Git push, not a fresh runtime deployment. A local build is not a deployment.

## 8. Holding items (do this honestly)

An item stays unscored, with a reason, when the printed question is defective
(two correct options, no matching option, a broken figure), when the source page
is missing, or when an independent solution conflicts with a single official key.
Record the exact reason (`disputeNote`/`sourceNote`) next to the item. Never clear
a hold merely to reduce a counter.

## 9. Model / effort guidance

Task-specific recommendation: **GPT-6 Luna, medium** for a bounded batch of
straightforward questions with readable sources and an attributed key;
**Luna, low** for metadata or formatting edits. Use **GPT-6.1 Sol, xhigh** for
damaged OCR, overlapping numbering, ambiguous grammar or key conflicts. Stronger
reasoning cannot replace missing source evidence. OpenAI recommends selecting
models by task needs and measured results; these project choices are judgment,
not a published benchmark. See [model selection](https://developers.openai.com/api/docs/guides/model-selection)
and [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna).
Effort is a
recommendation, not a guarantee — evidence controls readiness. Do not auto-switch
a running task or spawn agents without authorisation.

## 10. First concrete batch (worked example)

`reviewed-study-guides.json` ships with one batch:
`mpsc-group-b-ng-2024-paper-2-a` (MPSC Combined Group B NG, Paper-II, December
2024, Series A) — Computer Knowledge Q1–8 (page 2) and Simple Arithmetic Q36–45
(pages 5–6). The source cover and pages 2, 5 and 6, plus the final key's
**Paper-II Series A page 5**, were visually inspected on 11 October 2026.
Q37 was also checked at higher resolution: its denominator is `√96 × 5`,
with 5 outside the root. The independent solutions match the final key.
The existing batch contains 18 worked guides and addresses Q36's stale
transcribed conflict. This is a bounded example, not completion of the paper.

Paper SHA256: `c45fbaf9a23d97cd767ac2e0036831d1bd1bf40baa960d644017176ac252cff9`.
Key SHA256: `122276716def67fbb1936075b17ef1402ff9fef7d6689b0122cf6c6ff609f805`.
Use the batch as a schema example; independently check the next paper's evidence.

## 11. General repair template and limits

This is a schematic example, not real exam content. Replace placeholders with
source-checked material; merge into the existing `papers` map rather than
replacing it. `paper-slug` is the source registration slug, not the full emitted
`mpsc-group-b-…` paper ID. Consult `group_b_sources.py:reviewed_extraction`.

```json
{
  "papers": {
    "paper-slug": {
      "sourceSha256": "<actual source PDF SHA256>",
      "expectedMcq": 100,
      "partialReview": true,
      "reviewedOn": "2026-10-11",
      "evidence": "<pages visually checked, exact paper/series and review scope>",
      "questions": {
        "1": {
          "n": 1,
          "page": 2,
          "q": "<printed stem with its blank and emphasis>",
          "opts": {
            "a": "<printed A>",
            "b": "<printed B>",
            "c": "<printed C>",
            "d": "<printed D>"
          },
          "part": null
        }
      },
      "derivedAnswers": {
        "1": {
          "answerIndex": 0,
          "explanation": "<independent rule/calculation, then the printed choice>"
        }
      },
      "written": {
        "4": {
          "page": 8,
          "questionNumber": "3.4",
          "q": "<complete printed written prompt/subparts>",
          "direction": "<printed instructions and limits, if present>",
          "passage": "<full relevant printed passage, if present>",
          "explanation": "<independent approach/sample guide; not an official model answer>",
          "sourceNote": "<source exception or guidance attribution, if needed>"
        }
      }
    }
  }
}
```

- Set `expectedMcq` from verified paper evidence; 100 above is only an example.
  Leave `partialReview: true` until the entire expected set is accounted for.
  Full-paper Exam mode has separate completeness requirements.
- Text repair rows use `q`/`opts`/`n`; guide-adapter rows use
  `expectedQuestion`/`expectedOptions` and stable IDs. Do not mix these schemas.
- Keep answer indices out of `questions`. Derived indices are zero-based
  **in the checked printed option order**. The generator separates derived
  evidence from official candidates and holds solved conflicts.
- A held repair row can use `unscored: true` with an explanatory `explanation`
  and optional `reviewNote`. Use the mechanism already implemented for that
  paper; do not insert a guessed derived answer just to satisfy a schema.
- Use `nonMcq` only for visually confirmed false MCQs from OCR, not to conceal
  missing questions. Written prompts are emitted separately. Preserve existing
  written IDs: a corrected display number such as `3.4` need not change ID `…-written-4`.
- Optional written `answers` can hold checked short responses in the existing
  schema. Essay/précis/letter guidance belongs in `explanation`; do not turn it
  into four invented choices. Omit absent directions/passages.

## 12. Subject-specific solving and polish

Every explanation should identify the relevant rule or facts, show the essential
steps, and reach the actual printed choice. Discuss a distracting option when
it resolves a likely confusion. Do not pad explanations with generic study tips
or call an independently authored solution an official explanation.

### English and written work

- Read the shared instruction first: synonym versus antonym, incorrect versus
  correct sentence, contextual meaning versus dictionary meaning. Attach the
  relevant direction and passage to each affected question using supported fields.
- Preserve commas, apostrophes, quotation marks, capitalisation and printed
  emphasis. Do not add an emphasised target word because OCR lost one; inspect
  the page. Do not silently modernise a printed grammatical error.
- Keep the printed blank in the stem. Explain the completed sentence in feedback
  and, where the schema supports it, store the reveal answer separately. Avoid
  revealing it in the question title or directions before the learner answers.
- Explain agreement, tense, article, preposition, idiom or voice changes with
  the actual sentence. Preserve differences between acceptable usage and the
  expected exam choice. If the instruction allows multiple printed choices but
  the scoring key gives one, document the ambiguity and apply the hold rules.
- For comprehension, derive answers from the supplied passage. For précis,
  preserve the stated word limit, main argument and required title; label any
  sample as a sample. For letters/essays, give structure, content points and
  conventions without fabricating missing dates, recipients or official answers.

### Maths / Arithmetic

- Check the extent of roots, fraction bars, powers, brackets, signs, decimal
  points, percentages and units visually. Preserve their grouping explicitly
  in transcription; an OCR result that happens to match a key is insufficient.
- Show givens → formula/relation → substitution → calculation → units/choice.
  Evaluate multiplication/division left to right at equal precedence; retain
  exact values until rounding is required. Check cost versus selling price,
  rate versus time, percent versus percentage points, and total versus average.
- Recheck a result by substitution, estimation or a second short calculation
  when useful. Record assumptions actually needed; a missing assumption can
  make the question ambiguous. Do not adjust a number to force an option.
- Examples from the checked batch: Q37 yields
  `sqrt(48600 / (25 × 96)) = 4.5`; Q39 uses `260 / 6.5 = 40` oranges;
  Q44's inner multiplication/division gives `11 × 24 ÷ 8 × 3 − 69 = 30`.
  These steps explain why typography and operation order matter.
- Use a reviewed canonical topic (for example `time_work` or `profit_loss`),
  not a generic paper label. Mixed remains available when a topic is uncertain.

### Computer Knowledge

- State the concept and distinguish adjacent terms: RAM versus storage,
  system versus application software, MICR versus OMR/OCR, Internet versus Web.
  Explain why the selected option fits the printed wording.
- Check software version, operating system and exam date for shortcuts, menus,
  file formats, capacities and product claims. Use the named version's official
  documentation for uncertain/version-dependent facts; cite it in the explanation.
- Avoid absolute claims that exceed the question: SSDs usually improve random
  access and resist shock because they have no moving parts; that does not mean
  every SSD outperforms every HDD in every workload or lasts longer under all use.
- General computer knowledge can occur in a paper called Technical Paper-I.
  Include the user's requested computer knowledge scope; do not indiscriminately
  import unrelated specialist technical questions based on that title.

### General Studies / General Knowledge

- Identify the time frame in the stem or exam. Keep the historical exam answer;
  do not replace it with today's officeholder, law, statistic or classification.
- Verify uncertain facts, current affairs, law and numerical claims against
  authoritative primary sources (official publications, statutes, reports).
  Include the relevant date/page and link near the explanation. Distinguish a
  historical answer from a separately labelled present-day update.
- For matching/statement questions, check every statement or pair, including
  words such as NOT, ONLY, ALL and INCORRECT. An answer letter alone explains nothing.

### Reasoning / Intelligence

- Show the tested pattern or logical implication. A few examples may support
  multiple rules; do not claim uniqueness when the printed question is ambiguous.
- For figures, matrices and spatial questions, keep the source image and
  option labels/order. Missing or unreadable figures remain held. A textual guess
  or replacement image is not source recovery.
- For charts/tables shared across questions, retain labels, units, totals and
  the common instruction. Verify each calculated value against the chart.

### Old-paper exceptions

Log incorrect archive links, repeated URLs, mismatched covers, missing pages,
skipped/duplicated numbers, merged subparts, damaged option labels and source
typos with precise paper/question/page references. Correct extraction mistakes
from the page; preserve printed defects with an annotation. Do not invent a
missing Paper-III (the 2014 Excise SI request lists English and GS-I/GS-II only).
Keep specialist optional Mathematics distinct from general arithmetic scope.

## 13. Key attribution, duplicates and inaccessible sources

Read [COVERAGE-REPORT.md](COVERAGE-REPORT.md) and
[KEY-ATTRIBUTION-AUDIT.md](KEY-ATTRIBUTION-AUDIT.md), plus their JSON outputs in
`tools/udc-ldc-build/`. They prioritise candidates; **their tier labels and
similarity/agreement scores are not source verification**. In particular, an
upstream file labelled `key` or a solved-bank answer is not automatically an
official key. Statistical agreement cannot replace a checked paper/series header
and relevant printed key cells. Review tool assumptions before acting on a tier.

Confirm exam, subject, sitting, series, numbering and actual option order before
registering a key. Use the latest applicable final key/corrigendum and preserve
its reference. Withdrawn, compensated or multiple-accepted choices do not become
ordinary single-answer drills. Do not bulk-register plausible filename matches.

When importing a peer solution, match the complete checked stem and actual
option texts. Equal option sets alone are insufficient: order may differ.
Map a verified selected option into the target order explicitly, preserving
provenance, or hold it if the mapping/content is uncertain. Repeated papers
and common English papers should retain exam attribution without duplicating
questions accidentally or moving saved progress to new IDs.

For inaccessible/unidentified links, use the archive audit's source inventory
and exception notes. Record original archive URL, attachment URL, HTTP/access
result, attempted allowed retrieval, local hash/cover if available, and next
action. A wrong cover is a mismatch even if download succeeds. A failed request
does not prove the source does not exist. Use an attributable official replacement
only after checking its cover; keep the original problem recorded. Do not bypass
an access restriction. Mark unresolved items pending/blocked with a reason;
do not turn unknown counts into zero.

## 14. Copyable continuation prompt

Paste this into the next model's task, adjusting scope and publication permission:

```text
Continue the India Study Map UDC/LDC/Group B source review and worked guides.
Read HANDOFF-REVIEW-GUIDE.md, HANDOFF-SUBJECT-PRACTICE.md and
HANDOFF-ARCHIVE-AUDIT.md first. Inspect git status/current HEAD and preserve
other work. Read the current subject-review-progress.json and English ledger;
use coverage/key-attribution reports only as candidate queues.

Pick a bounded pending paper or question range and state its exact scope.
Prefer readable sources with an attributed final key. Cover English, Maths,
Computer, GK and Reasoning according to the queue; do not assume this ledger
includes the separate clerical bank. Visually inspect source/key pages and
record paper/series identity, hashes, pages and any corrigendum. Independently
solve each checked question, compare with the official answer, and preserve
punctuation, emphasis, blanks, directions, passages and option order.

Save changes in the implemented durable input schema. Preserve IDs and learner
progress. Add concise worked explanations, written study guidance and reviewed
section/topic tags. Keep incomplete sources, defective questions, missing
figures, multiple keys and answer conflicts unscored with precise reasons.
Never fabricate missing text or clear a hold to improve a total.

Regenerate only the relevant bank and reports for a content change. Within the
session's authorised verification scope, inspect deltas/IDs/provenance, run the
existing checks and production build, and record actual outcomes. Obey browser
restrictions; do not use an alternate access route. For documentation-only edits,
check the docs without rebuilding content. Commit only this batch's files.
Push/deploy only when authorised in the active session; claim live only after
READY and alias confirmation.

Update the handoff with completed ranges, ready vs worked-guide counts, held
IDs/reasons, extraction gaps/unknowns, inaccessible links, checks and the next
concrete batch. Distinguish local, pushed and deployed status. Report bounded
completion honestly; do not claim the whole backlog is solved.
```

Use Luna medium for the straightforward bounded work; escalate ambiguous or
conflicting cases to GPT-6.1 Sol xhigh with the source evidence and exact issue.
Do not silently switch the active model or delegate without authorisation.
