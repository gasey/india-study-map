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
- **No `answerIndex` key at all decides only text and/or a note, and leaves the
  answer exactly as the overlays produced it.** This is not the same thing as
  `answerIndex: null`, and reading it as the same thing strips a good answer off
  a question whose only problem was a damaged stem. Write the null out loud if
  you mean to withdraw. Three entries are answerless: q92, q95 and q96.
- `confidence` looks optional and **is not**. `answerConfidence` drives the
  bank's "weak answers needing review" count (`UdcLdcPage.tsx:87`), so
  omitting it on a *shipped* answer silently drops the question out of that
  tally and makes an arbitrated question look better-sourced than it is.
  Only a withdrawn answer has nothing to say. It also works the other way: on an
  answerless entry, setting it pulls a flagged question back into the tally,
  which is what the q79 entry does — its solver badged it `high`, so left alone
  it would never have been looked at by the one person who needs to look at it.
- `question` and `options` optionally repair **text** read off the scan, and are
  applied after everything else. Use them when the stem or options are damaged,
  not merely ugly — and note that picking the right *index* out of four strings
  of OCR garbage is not picking the right answer. The build aborts if a
  repaired option list leaves the answer pointing outside it.
- `note` appends a warning to the reader's `disputeNote` on a question whose
  **answer is not in doubt**. For a question the reader should treat with care —
  an under-determined puzzle, say. Applied on its own: an entry carrying only a
  note changes nothing else, which is the point.
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
| arbitration note applied | a `note` that stopped reaching the reader's `disputeNote` |
| arbitration confidence | an entry's `confidence` that stopped reaching the record |
| answerless entry left the answer alone | an entry with no `answerIndex` that withdrew the answer anyway, or had it re-seated downstream |
| arbitration options in range | repaired options that leave the answer pointing outside them |
| figure attachments | an `imagePath` with no file under `public/question-images/` |
| figure orphan ids | a figure entry matching no question in the build |

The "answerless entry" guard is the awkward one and is worth understanding before
you touch it. The withdrawal it exists to catch happens in `load_derived()`,
long before the question loop, so there is no before-value to compare against
and the loop's capture is already too late. It therefore asks the *artifact* a
question instead: is this absence of an answer a recorded withdrawal, opening
with `WITHDRAWAL_MARK`? Hence that constant — the code that writes the
withdrawal and the guard that recognises one must not drift, so they share a
name. Its second half, catching a re-seat after the loop, uses the loop's
capture and is straightforward.

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

1. **Leave three SVGs unattached.** `reasoning-dice-positions`,
   `reasoning-mirror-mn`, `reasoning-paper-pieces`. Their source scans are lost
   and the puzzles are invented; attaching them would present a fabricated
   figure as a real exam item. Do not "finish the job".
2. **q79 is flagged, not answered** — see the audit below. Either recover the
   lost clue off the page image, or accept that the paper is defective and
   withdraw the answer the way q100 was withdrawn.

---

## The 2026-10-03 audit of upstream drift, and what it turned up

The 213 records that had drifted from the last committed build were audited.
Almost all of it was an improvement, and the interesting part was what the
improvements *broke*.

**Clean.** 0 option lists got worse. 58 explanations gained text and none lost
all of it. The 89 stem changes are upstream math repair and cleanup doing their
job: `22 + 5/3 and V2 -3V3` → `2√2 + 5√3 and √2 - 3√3`, `12m*6mx4m` →
`12m × 6m × 4m`, `Ifx:y=3:2andx+y` → `If x:y = 3:2 and x + y`.

**Two real regressions, both from the same thing — a cleanup that was right
about the parser and wrong about the question bank.**

- q92 lost its Directions block, stripped as boilerplate shared by a group of
  questions. In a standalone bank it is not boilerplate, it is the question: the
  shipped answer is "If only conclusion I follows", which holds *only* because
  the directions say to take "All men are dogs" as true. A reader using
  real-world knowledge instead picks "If neither I nor II follows" and concludes
  the bank is wrong.
- q95 and q96 lost the `Table: row 1 = ..., row 2 = ...` form to a `|`-joined
  linearisation that does not say which letters share a row. q96's became
  `"C | F | I ? | O | L"`, which read as rows is wrong and read as columns is
  right.

Both are repaired now, from the recorded vision corrections and — for both grids
— from the scans, read cell by cell off the printed rules rather than trusting
the OCR. q96's grid is 3×2 (vertical rules at x=425/719/1013/1305, horizontal at
y=2701/2810/2919) reading `C F I` over `? O L`.

**A systemic fragility, unfixed.** 12 questions lost `answerSource:
transcribed` → `derived`, and 3 of those lost confidence too. **No answer
changed** — every one of the 12 still points at the same option — but the
provenance got weaker, and that will recur on every future upstream text
improvement. The cause is that `align_answers()` re-seats a solver's answer by
matching *text*, and `_same_question()` normalises by keeping only alphanumerics,
which throws away exactly the symbols a maths stem is made of: `V2` (OCR for
`√2`) and `√2` normalise to the same thing only by accident, and on stems as
short as these the prefix test fails and the answer is dropped as stale.

The obvious fix — teach `_norm` that `V` before a digit is a `√` — is **not**
made here, and should not be made casually. `_same_question` exists to stop an
answer sliding onto a *different* question, which it once did invisibly; loosening
it trades a cosmetic mislabel for a chance of a wrong answer on a question whose
text nobody has read. If you do it, measure how many answers change seats, not
just how many are recovered.

**13 orphaned `vision-corrections.json` anchors, all benign.** Anchors are
matched against stem+options, and a failed match is a *note*, not an error. All
13 no longer match — because the corrections describe the *damaged* text, and
that text no longer exists: the parser's math repair now produces the corrected
form directly. Checked each against the staged output; all 13 have landed. No
action needed, but this is the shape a silent upstream break takes here.

**q79 changed its answer for no reason, and is now flagged.** Between two
rebuilds it went from index 1 ("Tailor and Cook") to index 3 ("Washer man and
Cook"). Brute force over all 4! seatings × 4! trade assignments, keeping those
satisfying all four printed clues: 40 survive, giving five distinct (trade of A,
trade of B) pairs, of which **three are printed options** — indices 1, 2 and 3.
The answer does not depend on which way "right of" is read. So both the old and
the new answer are consistent with the paper and neither is forced by it. The
stem is OCR-damaged (the clue numbers came through as `IL`, `IH` and `1V`), so a
clue may have been lost in transcription.

The answer is left as the build produced it and the entry carries a `note` saying
so, with confidence forced to `low` so it lands in the weak-answer review tally.
Recording *which* index happens to be shipped would give the accident a standing
it has not earned.

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