# Brief for vision extraction agents — Computer Operator Technical Paper II, 2016

You are transcribing **and answering** real Mizoram PSC exam questions from scanned
page images, for a study app used by someone sitting the MUDAL System Manager exam.

**No official answer key exists for these papers.** Your answer becomes the app's
answer. A wrong answer teaches a false fact before a real exam. Accuracy over speed.

This brief is the vision-pass counterpart to `tools/bank-rebuild/SOLVE_BRIEF.md`,
whose rules all still apply. Read that too if anything here is silent.

## Why images and not the OCR text

There are `.ocr.txt` sidecars for these PDFs. **Do not use them.** They are 1-bit fax
scans and text extraction finds only 61 of 75 questions; re-OCR does worse. The
rendered page images are cleanly legible. Work only from the images.

## Input

Page images at `tools/system-manager-build/pages/`, named `<srcKey>-<page>.png`,
listed in `pages/manifest.json`. Read them **in page order** with the Read tool.

Each paper contains **exactly 75 questions**, numbered 1–75, 2 marks each.
Options are printed in **two columns**: (a) top-left, (b) top-right, (c) bottom-left,
(d) bottom-right. Read them in **letter order (a, b, c, d)**, not visual order —
getting this wrong silently corrupts every answer.

## Output

Write a JSON array to the path you are given. One object per question, in order:

```json
[
  {
    "no": 1,
    "q": "The rules followed by interconnected computers to communicate between them is",
    "opts": { "A": "Hop", "B": "Consensus", "C": "Agreement", "D": "Protocols" },
    "ans": "D",
    "conf": "high",
    "exp": "A protocol is the agreed set of rules governing format, timing and error handling for data exchange between hosts. Hop counts router traversals; the other two are ordinary words with no networking meaning.",
    "needs_figure": false,
    "page": 1
  }
]
```

- `no` — the printed question number. Integer.
- `opts` — keys `A`–`D` mapping to printed `(a)`–`(d)`. **Never reorder, never
  renumber.** Transcribe the option text verbatim, including odd spacing fixes
  (`HalfDuplex` → `Half Duplex` is fine; changing the meaning is not).
- `ans` — a single letter `A`–`D`.
- `conf` — `"high"` | `"medium"` | `"low"`. Be honest; do not inflate. This drives a
  visible badge. Use `"low"` where the options are defective or two answers are
  equally defensible.
- `exp` — 1–3 sentences. Lead with the fact that makes the answer correct; name the
  trap where a distractor is a classic one. Do **not** open with "The correct answer
  is (d)" — the UI already highlights it. For aptitude/reasoning, show the working.
- `needs_figure` — `true` if the question cannot be answered from text alone because
  it depends on a printed diagram, image, or figure. See below.
- `page` — the page image number you read it from. Lets a human re-check fast.

## Figure-dependent questions

These papers contain visual/spatial reasoning items — e.g. CO2016B-P2 question 75
shows six numbered shape fragments to reassemble. The app's question schema is
**text-only**; it has no image field. So:

- Set `needs_figure: true`, still transcribe the question text and options, still
  give your best `ans` and `exp`.
- The validator quarantines these instead of shipping them. Do **not** silently
  rewrite a figure question into a text one, and do **not** drop it — a flagged
  question can be revisited; a dropped one is invisible.

## Rules

1. **All 75, exactly once each.** Before writing, verify you have every number
   1–75 with no gaps and no duplicates. A missing question is the specific failure
   this whole approach exists to prevent — the previous OCR pipeline silently dropped
   ~280 questions with no numbering gap to reveal it.
2. If a question genuinely spans a page break, read both pages and join it. Do not
   emit a truncated question.
3. These papers contain real printing errors — duplicated options, misspellings,
   occasionally no correct option at all. Pick the closest, set `conf: "low"`, and
   say so plainly in `exp`. Do not pretend a broken question is fine.
4. Never write an `exp` that contradicts your own `ans`.
5. Do not fabricate. If you cannot verify something, write a shorter honest
   explanation grounded in what the option says and set `conf: "low"`.
6. These are 2016 papers: "Windows XP", "Windows Server 2003" etc. are correct in
   period context. Answer as the paper intended, but if the correct answer is now
   dated, note that in `exp` — the reader is studying for a 2026 exam.
7. Your final message must be a one-line summary only (counts, and anything you
   flagged). The JSON goes in the file, not in your reply.
