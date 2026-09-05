# Brief for vision extraction agents — Informatics Officer Technical Paper II, November 2024

You are transcribing real Mizoram PSC exam questions from scanned page images, for a
study app used by someone sitting the MUDAL System Manager exam.

Read `EXTRACT_BRIEF.md` first — every rule there still applies. This brief only states
what is **different** about this paper.

## What is different: an official answer key exists

Unlike the 2016 Computer Operator papers, MPSC published a final answer key for this
paper (Notification No. IO/1/2019-MPSC, 27 November 2024). That key — not your
answer — becomes the app's answer.

**You will not be shown the key, and that is deliberate.** You still answer every
question to the best of your ability, exactly as if no key existed. Your answer is
then compared against MPSC's. The comparison is the point:

- Where you agree, that is independent corroboration that the option letters were
  transcribed in the right order.
- Where you disagree, it is a signal — either the transcription is wrong, or the
  question is genuinely contested. Both get looked at by a human.

So **do not** hedge toward what you think an examiner "probably" wanted, and do not
inflate `conf` because you assume a key will cover for you. An honest `medium` that
disagrees with MPSC is useful. A dishonest `high` that happens to agree teaches
nothing and hides a real transcription error.

## What is different: this is not a Computer Operator paper

This paper was set for **Informatics Officer**, a harder post than the one the app
targets. Its subject matter, however, is e-Governance, IT governance, IT procurement
and digital-office practice — not the CS theory that made Informatics Officer
Technical Paper *I* unusable for this build.

Transcribe **all 100 questions** regardless of whether you think they fit the System
Manager syllabus. Syllabus mapping is a separate, later pass with the syllabus in
front of it. Do not pre-filter, and do not skip a question because it looks
off-topic — that decision is not yours to make here, and a question you drop is
invisible to the pass that would have caught it.

## What is different: layout and count

- **Exactly 100 questions**, numbered 1–100, 2 marks each, across 11 page images.
- Options are printed **one per line** in most questions and in **two columns** in
  the short ones. Where two columns are used the order is (a) left, (b) right,
  (c) left, (d) right. As always, transcribe in **letter order**, not visual order.
- Some questions carry a roman-numeral statement list (i, ii, iii / I, II, III)
  before the options. Transcribe that list as part of the `q` text, on its own
  lines, so the options still make sense.
- Question 52 is marked **"Compensated"** in MPSC's key, meaning the Commission
  awarded it to everyone rather than scoring it. You will not know this while
  reading. Transcribe and answer it normally.

## Input and output

Pages are at `tools/system-manager-build/pages/IO2024-P2-<NN>.png` (01–11).
Read them in order with the Read tool.

Write the same JSON record shape `EXTRACT_BRIEF.md` specifies — `no`, `q`, `opts`,
`ans`, `conf`, `exp`, `needs_figure`, `page` — to the path you are given.

Your final message is a one-line summary only: the numbers you covered, and anything
you flagged. The JSON goes in the file.
