# Brief for source-recovery agents

You are repairing a question whose text was **damaged on the way out of a
scanned PDF**, not one whose answer is wrong. Someone is revising for a real
Mizoram PSC exam from these cards, and this paper's MCQs carry **one-third
negative marking** — a question with two identical options or a missing
operator is worse than no question at all, because it burns time and can only
lose marks.

Your output is the text *as the paper actually printed it*. Nothing else.

## Read the page with your eyes, not with `pdftotext`

This is the rule that matters most, and it is why this job needs an agent
rather than a script.

`pdftotext` **silently destroys mathematics**. It collapses superscripts
(`2ⁿ` → `2n`, which is how two different options became the identical string
`"2n"`), and it *drops symbols outright* — a previous import in this repo found
`Ω` vanishing entirely, leaving `f(n)=(g(n))`. Several of these questions also
carry raw Symbol-font Private-Use-Area codepoints (`U+F0D9`, `U+F0AE`, …) where
`∧` and `→` should be. **Do not guess what a PUA codepoint meant from an
encoding table.** Look at the page.

Render the page and read the image:

```
cd /home/hruaia/workspace/projects/personal/india-study-map
pdftoppm -r 200 -f <page> -l <page> -png "<pdf path>" /tmp/<yourid>-page
```

then use the Read tool on the resulting `.png`. Bump `-r` to 300 if a
subscript or an overbar is not legible. The `.pdf.ocr.txt` sidecar next to the
PDF in the `mpsc-question-bank` corpus is useful for *locating* the question
quickly — never for transcribing it.

## Finding your question

Your input file gives `paper_q_no` where the bank recorded the paper's own
question number; the question is that numbered item in the PDF. Where
`paper_q_no` is `null` the bank's number is a synthetic index, **not** the
paper's — locate the question by its stem text instead. Papers here run
100–150 questions over 6–20 pages, so estimate the page, render it, and adjust.

Confirm you have the right question by matching the stem *and* at least one
option against the damaged version you were given. A question number alone is
not enough — this corpus contains several papers with near-identical
filenames, and one of them is known to be mislabelled.

## What to return

- `q` — the stem exactly as printed, with real Unicode for any notation
  (`∧ ∨ ¬ → ⇔ ∈ ∪ ∩ ⊂ ≥ ≡ α Σ ⌈ ⌉`, superscripts as `²`/`ⁿ` or `2^n`, whichever
  the surrounding bank style already uses).
- `opts` — an object keyed `"A"`–`"D"`. **Never reorder or renumber options.**
  Option A is whatever the paper printed as (a).
- `ans_unchanged` — `true` if the repair does not alter which option is
  correct. If fixing the text *does* change the answer (e.g. the two identical
  options turn out to be `2ⁿ` and `n²`, and the stored key pointed at the wrong
  one), set this `false` and give `ans` plus a one-line `ans_reason`.
- `needs_figure` — `true` when the question depends on a printed K-map,
  circuit, truth table or diagram that no amount of transcription can carry
  into a text-only card. Say what the figure shows in `figure_note`. This is an
  honest outcome, not a failure.
- `changed` — `false` if the card was already correct and needs no repair. Also
  an honest outcome.
- `confidence` — `high` | `medium` | `low`, in the *transcription*. Honest
  ratings only: a page you could not fully read is `low`, and say why in
  `notes`.

## Rules

1. **Transcribe, do not correct.** If the paper printed a typo, a wrong
   spelling, or even a mathematically false option, that is what goes in.
   Preserved original misspellings are deliberate house convention. You are
   recovering what the candidate saw.
2. **Two identical options may be genuine.** Some MPSC papers really do print a
   duplicated option. If the page shows two identical options, say so and set
   `changed: false` — do not invent a plausible distractor to fill the gap. A
   fabricated option is far worse than a known-defective question.
3. **Never invent a figure's contents.** If the K-map is unreadable at 300 dpi,
   return `needs_figure: true` with `confidence: low`. Do not reconstruct it
   from the options.
4. If you cannot find the question in the PDF at all, return `found: false` and
   describe where you looked. Do not substitute a similar question.
