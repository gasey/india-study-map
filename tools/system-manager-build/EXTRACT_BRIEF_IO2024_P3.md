# Brief for vision extraction agents — Informatics Officer Technical Paper III, November 2024

You are transcribing real Mizoram PSC exam questions from scanned page images, for a
study app used by someone sitting the MUDAL System Manager exam.

Read `EXTRACT_BRIEF.md` first — every rule there still applies. Then read
`EXTRACT_BRIEF_IO2024.md`, which covers the *same sitting*: everything it says about
the published answer key, about answering blind, and about not pre-filtering by
syllabus applies here unchanged. This brief states only what is different about
**Paper III**.

## What is different: the subject

Paper II was e-Governance and IT procurement. **Paper III is IT project management,
software quality, and IT human-resource management** — project life cycles, scope and
schedule, risk, procurement, quality models and standards, teams and leadership.

The practical consequence for you is vocabulary, not difficulty: expect PMBOK-style
terms (WBS, critical path, earned value, stakeholder register), quality vocabulary
(CMMI, ISO 9001, Six Sigma, V&V) and HR/organisational-behaviour vocabulary
(Maslow, Herzberg, Tuckman, matrix organisation). Transcribe the term as printed even
where the printing is odd — do not "correct" CMMI to CMM or expand an acronym the
paper left short.

## What is different: count, layout and the compensated question

- **Exactly 100 questions**, numbered 1–100, 2 marks each, across **14 page images**.
- Question stems here are longer than Paper II's and options are printed **one per
  line** almost throughout. Later pages hold fewer questions each because of it.
- **Question 79 is marked "Compensated"** in MPSC's final key — the Commission
  withdrew it and awarded it to every candidate. You will not know this while
  reading, and you should not try to guess which one it is. Transcribe and answer
  it normally.
- Some questions are "Which of the following is NOT ..." or "All of the following
  EXCEPT". The negation is load-bearing and is sometimes printed in caps and
  sometimes not. Transcribe the stem exactly; do not normalise the emphasis away.

## Your page range

You will be given a specific page range and the question numbers expected on it.
Transcribe **every question that begins within your pages**, and only those. If a
question's options run over onto the next page, still transcribe it in full — the
next agent has been told to start at their first *whole* question, so an overlap is
better than a gap.

If your pages do not yield exactly the question numbers you were told to expect, say
so explicitly in your final message. A count mismatch is a real finding, not an
inconvenience: this build exists partly because an earlier extractor dropped ~280
questions with no numbering gap to reveal it.

## Input and output

Pages are at `tools/system-manager-build/pages/IO2024-P3-<NN>.png` (01–14).
Read them in order with the Read tool.

Write the same JSON record shape `EXTRACT_BRIEF.md` specifies — `no`, `q`, `opts`,
`ans`, `conf`, `exp`, `needs_figure`, `page` — to the path you are given.

Your final message is a one-line summary only: the numbers you covered, and anything
you flagged. The JSON goes in the file.
