# Brief for descriptive (Section B) answer agents — MPSC Technical Paper I

You are writing **model answers** to real Mizoram PSC conventional/essay
questions. These become the answer the app shows to someone revising for a real
exam. There is **no official MPSC answer** to any of these, so what you write is
the only answer the reader gets. Accuracy matters far more than fluency.

## Exam context — this sets the length

Section B is **"Short answer type question", 20 questions, 5 marks each**.
These are *short answers*, not long essays. Aim for **130–220 words** of model
answer. A 600-word treatise is wrong for the format and buries the marks.

For Paper I the four units are Discrete Mathematics, Computer Architecture &
Organization, Data Structures & Algorithms, and Operating System.

## Input

A JSON array. Each entry has `id`, `q` (the question, verbatim from the paper),
`unit` ("1"–"4"), `sub`, and sometimes `garbled` / `repaired` / `recovered`.

Question text may contain newlines and plain-text tables — that is deliberate,
the app renders question text with `white-space: pre-wrap`.

## Output

A JSON array, one object per input question, **same order, ids copied
verbatim**:

```json
[{ "id": "D000", "paper": "TECH1", "unit": "4", "sub": "Process concept",
   "ans": "...", "points": ["...", "..."], "conf": "high",
   "incomplete": false }]
```

- **`ans`** — the model answer. Plain text. Separate paragraphs with a **blank
  line**; the renderer turns those into separate paragraphs. Do not use
  markdown (`**bold**`, `#`, `-` bullets) — it is escaped and shown literally.
  Put the list-like content in `points` instead.
- **`points`** — 3–6 **marking points**: the specific things an examiner ticks.
  Each a short phrase or sentence, not a paragraph. These are what the reader
  self-checks against, so make them concrete and checkable ("states that SJF
  gives the minimum average waiting time = 13 ms"), not vague ("explains SJF").
- **`conf`** — `"high"` | `"medium"` | `"low"`. Honest. This drives a badge the
  reader sees. `"high"` only when the answer is standard textbook material you
  are certain of. `"low"` when the question is defective, ambiguous, or you are
  reasoning past OCR damage. **Do not inflate** — an inflated badge tells the
  reader to stop thinking, which is worse than a hedge.
- **`unit`** / **`sub`** — copy the input's values unless they are plainly wrong
  for the question, in which case correct them and say so in the answer.
- **`incomplete`** — `true` if the question as printed is missing information
  needed to answer it fully (a figure, a data table, a truncated formula).

## Rules

1. Every input question must appear exactly once. **Count before you write.**
2. **Show the working for anything computational.** These questions include
   Gantt charts, SCAN disk seek totals, effective access time, deadlock
   resource bounds, merge sort traces, permutation counts, NFA→DFA subset
   construction. Give the actual numbers and the arithmetic that produces them,
   then state the result. A model answer that asserts a number without the
   derivation is worth little to someone learning to reproduce it under exam
   conditions.
3. **Answer the question actually asked.** "Explain one method for avoiding
   deadlock" wants *one* method (Banker's algorithm) explained properly —
   not a survey of prevention, avoidance, detection and recovery. Questions
   asking for a diagram ("draw a logic diagram", "with suitable diagrams")
   cannot show one, so describe the construction precisely enough to draw it —
   name each gate and its inputs.
4. **Some of these papers contain genuine printing errors.** Where the paper
   itself is wrong (e.g. a job table that numbers five jobs 1,2,3,4,4), say so
   in one clause, state the reading you are answering under, and continue. Do
   not silently correct it and do not refuse to answer.
5. **Do not fabricate.** If part of a question cannot be answered from what is
   printed, answer the part that can be, name what is missing, set
   `incomplete: true` and lower `conf`. A shorter honest answer beats an
   invented one.
6. Where two textbook conventions differ, follow the Indian-syllabus standard
   texts — Mano for architecture, Galvin/Silberschatz for OS,
   Horowitz–Sahni/Cormen for data structures, Kenneth Rosen for discrete
   mathematics — note the ambiguity in one clause, and set `conf: "medium"`.
7. Write for someone revising, not for a marker. Lead with the substance.

Write your answers with the Write tool to the output path you are given.
Reply with only: the count written, the confidence tally, and how many you
marked `incomplete`.
