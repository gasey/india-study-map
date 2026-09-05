# ILM November 2023, CSE Paper III — extracted, not yet imported

100 questions transcribed from
`mpsc-cse-papers/computer-science-engineering-paper-iii.pdf` on 2026-09-05.
**Nothing here is in the bank yet.** These are raw transcriptions: no answers,
no syllabus tagging, no ids.

## Why this paper was extracted at all

No Paper III from any sitting had ever been imported — see
`mpsc-cse-papers/README.md`. Five of them sit in that folder. This is the first.

## What was done

The PDF is a pure scan (10-character text layer), so `pdftotext` returns
nothing and every page had to be rendered at 300 dpi and read by eye. One agent
per page, each reading only its own page image, each rewriting its output file
after every question — the incremental-write rule from
`EXTRACT_P3_BRIEF.md`, which exists because an earlier batch lost four agents
and ~400k tokens to agents that held their work and wrote nothing.

`page-1.json` … `page-9.json` are the per-page outputs. `_merged.json` is all
100 in one array with a `_page` field added.

## Verification done

Mechanical: 100 questions, numbered 1–100 with **no gaps and no duplicates**,
every one carrying exactly four options and a non-empty stem.

Against source, which is the check that counts: pages 2 and 5 were re-read
independently from the rendered images and compared line by line to the agents'
JSON. Both matched exactly, including the things most likely to be "corrected"
by a careless transcriber:

- Q14 (d) `Four -wire circuit` — the stray space is in the paper.
- Q50 (d) `IEFE` — the paper misprints IETF. Left as printed.
- Q48's negations are asymmetric as printed: (a) has no outer `¬` while
  (b), (c), (d) do. That asymmetry is the question.

The remaining seven pages are verified mechanically but **not** re-read against
source. If an answer derived from this batch ever looks wrong, re-read the page
image before trusting the transcription.

## Known content oddities, transcribed as printed

- **Q4 carries a figure** (an S—R—R—D router chain) and is flagged `has_figure`.
  It is answerable from the description, but check the image before keying it.
- **Q30** option (d) reads "Neither I nor III" though the stem lists only items
  I and II.
- **Q26** option (a) prints "People , Performance, Payment, Product" with a
  stray space.

None of these were repaired. The rule this bank runs on is that the paper is the
data — a previous pass acquired a confident answer to a question the paper never
asked by "fixing" a stem.

## What still has to happen before import

1. **Syllabus classification.** Which of the 100 fall under the 2026 TECH1
   syllabus, which under TECH2, which under neither. The paper is heavy on
   DBMS, networking and software engineering, so a real split is expected
   rather than a clean single-paper assignment.
2. **Solving.** MPSC's official key for this sitting covers `cse_paper_1` and
   `cse_paper_2` **only** — Paper III has no key in
   `staged/ilm2023-official-key.json`. Every answer will therefore be
   `derived`, and must carry an honest `conf`. Follow `SOLVE_BRIEF.md`: do not
   inflate confidence, do not fabricate, flag the unanswerable rather than
   guessing.
3. **Import**, with `sitting: "Inspector of Legal Metrology, November 2023 · Paper III"`
   and ids in the `ILM2023_P3_*` shape.

Do not delete this directory until those three are done and the app reports the
imported count.
