# Handoff — building the UDC / LDC bank

Written 2026-10-03. Read this before editing anything under `src/data/banks/`
or re-running `tools/udc-ldc-build/build_bank.py`. `DEVLOG.md`'s three
2026-10-03 entries have the narrative; this file is the operational part.

---

## The one rule

**`src/data/banks/mpsc-udc-ldc.ts` is generated. Never hand-edit it.**

Everything in it comes from `tools/udc-ldc-build/build_bank.py` (run it from
the repo root) plus the upstream inputs in the sibling repo
`../mpsc-question-bank/state/`. A hand-edit survives exactly until the next
build, and the next build reports success while destroying it. That has
happened twice now — see the DEVLOG entries for both. If the bank needs
something the pipeline does not produce, add an *input file* next to the
build tool, never an edit to the `.ts`.

Current shape: 3,339 questions, 5 attached figures, 428 unanswered.

---

## Durable inputs that live with the build

These two are the answer to "the pipeline cannot express this". Both are
applied by `build_bank.py`, both carry a `_README` explaining themselves, and
both are guarded so a stale key fails the build instead of silently doing
nothing.

### `tools/udc-ldc-build/figure-attachments.json`

Figures recovered from source scans, keyed by **bank question id**
(`slug-qNNN`, e.g. `mpsc-ldc-2026apr-paper-2-q081`). Applied *after* the
`figureBased` logic — a recovery is newer information than the staging that
produced the `figureBased` flag. `figureRecovered: true` clears `figureBased`
so the question rejoins scored tests.

Do not key these by paper + qnum. OCR renumbering makes number keys circular:
you cannot look up a question by the number it was mis-scanned as.

### `tools/udc-ldc-build/answer-arbitration.json`

Hand-recorded answers where two overlays disagreed. Keyed by
`<paper>::q<num>`, matching `state/adjudicate/_resolved.json`. Applied
**last**, after `solved-html`.

- `answerIndex: 0-3` picks a side.
- `answerIndex: null` **withdraws** the answer — ships `answerIndex -1`. The
  right call when the question is unanswerable from source and every
  overlay's answer was a placeholder.
- `confidence` looks optional and **is not**. `answerConfidence` drives the
  bank's "weak answers needing review" count (`UdcLdcPage.tsx:87`), so
  omitting it on a *shipped* answer silently drops the question out of that
  tally and makes an arbitrated question look better-sourced than it is.
  Only a withdrawn answer has nothing to say.
- `question` and `options` optionally repair **text** read off the scan, and are
  applied after everything else. Use them when the stem or options are damaged,
  not merely ugly — and note that picking the right *index* out of four strings
  of OCR garbage is not picking the right answer. The build aborts if a
  repaired option list leaves the answer pointing outside it.
- `evidence` records where a decision was checked and how. Prefer it over
  asserting a decision "rests on reasoning": the image-only papers read
  reliably via `pdftoppm` + `tesseract` over ink-profile crops, and one entry
  here was wrong precisely because nobody did that.

---

## Overlay precedence

`load_derived()` appends these in order and **later wins on collision**:

```
solve-derived  -> solve-round*  -> adjudicate -> crosscheck -> restale
               -> solved-html   -> ARBITRATION
```

Two things about that order are load-bearing and have each been gotten wrong:

- **`solve-round*` must stay before `adjudicate`.** Placed after, it silently
  undid an entire adjudication round — the re-solved answers were overwritten
  by the very answers the round existed to correct, and the only symptom was
  that the bank's confidence counts did not move after a round reporting 96
  answers raised to high.
- **`restale` after `adjudicate` is correct, not a bug.** `restale` re-solves
  questions whose *source text was repaired*, so it saw better input and
  legitimately wins. Do not "fix" the four known disagreements by reordering
  — that is what `answer-arbitration.json` is for.

---

## The guards

Every one asserts an *outcome*, not that its input is well-formed. Same
reason each time: an entry that stops matching looks exactly like one that was
never needed, and a build that quietly stops applying work reports success.

| guard | catches |
| --- | --- |
| adjudicated verdicts held | a later overlay overwrote an adjudication round |
| arbitrations applied | a recorded decision silently reverted to the losing overlay |
| arbitration text repaired | a repaired stem/option list reverted to the OCR garbage |
| arbitration options in range | repaired options that leave the answer pointing outside them |
| figure attachments | an `imagePath` with no file under `public/question-images/` |
| figure orphan ids | a figure entry matching no question in the build |

**The generated `.ts` is now written only after all of these pass.** It used to
be written *before* the checks, so a failing build left its bad output on disk
and the natural next step — `npm run build` — compiled it. Do not move that
write back up.

A guard checks that work was *applied*, not that it was *right*. A
self-consistent but incorrect `answerIndex` passes every guard here, by design —
judging correctness is what the `evidence` block and the scan are for. Do not
"fix" this by making a guard second-guess the answer.

If you add a fifth input file, give it a guard in the same style and **prove
it fires** by deliberately breaking it (orphan id, renamed paper, out-of-range
index). A guard never observed failing is a comment.

---

## Open items, most valuable first

1. **Audit the 213 non-arbitration records that differ from HEAD** (131
   `explanation`, 92 `question`, 36 `options`, 10 `answerConfidence`, 3
   `disputeNote`). These come from uncommitted drift in
   `../mpsc-question-bank/state/staged/` and `state/solve-derived/`, not from
   anything changed on 2026-10-03. `imagePath` differs on **zero** records.
2. **Leave three SVGs unattached.** `reasoning-dice-positions`,
   `reasoning-mirror-mn`, `reasoning-paper-pieces`. Their source scans are lost
   and the puzzles are invented; attaching them would present a fabricated
   figure as a real exam item. Do not "finish the job".

---

## Reading the image-only source papers

Both `~/hello-rescue/2/ldc-under-mpsc-paper-ii-2025.pdf` (LDC Paper-II 2025,
12 pages) and `~/hello-rescue/2/udc-combined-paper-ii-d-may-2025.pdf` have **no
text layer** — `pdftotext` returns nothing. They are still readable:

```
pdftoppm -r 600 -png -f 7 -l 7 <pdf> /tmp/page     # render
tesseract /tmp/page-07.png out --psm 4 tsv        # text + bounding boxes
```

Two techniques that mattered:

- **Stacked fractions defeat plain OCR.** The discount question's options are
  printed as stacked mixed fractions and flatten into punctuation soup. Crop by
  ink profile, find the fraction bar as the longest horizontal ink run, then
  read numerator and denominator as separate crops.
- **When a figure looks like noise, measure it.** For the dice question, four
  OCR modes returning garbage is suggestive; an ink-column profile finding *one*
  cluster spanning x 418–1923 instead of four separate dice is proof that no pip
  structure survives. Render the crop as text art to read glyphs that OCR
  refuses to name.

`view_image` is unavailable to this model, so reading a page means rendering and
OCRing it — do not conclude a scan is unreadable without trying.

## Verifying, honestly

```
python3 tools/udc-ldc-build/build_bank.py   # must exit 0
npm run lint                                # tsc --noEmit
npm run build                              # vite
git diff --check                           # whitespace
```

Two consecutive builds must be byte-identical, logs included. Note that
`python3 ... | tail` reports `tail`'s exit status, not the build's — check
`$?` directly or the build will look green while exiting 1.

There is no official answer key for any of the UDC/LDC/Combined sittings these
four arbitration entries cover. Verified against both
`../mpsc-question-bank/pdfs/Answer_Keys/` (196 PDFs) and the 194 ingested
papers in `state/official-answer-keys.json`. The only UDC/Assistant key in the
corpus is the April-2024 sitting, which is the one already used to measure
`solved-html` at 158/159.