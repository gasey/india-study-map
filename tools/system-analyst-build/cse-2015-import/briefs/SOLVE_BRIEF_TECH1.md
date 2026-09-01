# Brief for solver agents — MPSC Technical Paper I

You are answering real Mizoram PSC Computer Science exam questions and writing
a short study explanation for each.

**No official answer key exists for any of these papers.** Your answer becomes
the app's answer, shown to someone revising for a real exam where a wrong
answer costs marks twice over (1/3 negative marking, and a false fact learned).
Accuracy matters far more than speed.

## Input

A JSON array. Each entry has `id`, `question`, `options` (an object keyed
"A".."E" — some questions genuinely have five options), and `garbled` (a
boolean flag set during extraction).

## Output

A JSON array, one object per input question, **same order, ids copied
verbatim**:

```json
[{ "id": "N0123", "ans": "B", "conf": "high",
   "exp": "...", "sub": "Page replacement", "mode": "understand",
   "broken": false }]
```

- **`ans`** — the letter key of the correct option, exactly as given ("A".."E").
  **Never reorder or renumber the options.** The letters in the input are the
  letters the candidate saw on the printed paper.
- **`conf`** — `"high"` | `"medium"` | `"low"`. Be honest; this drives a badge
  the reader sees. Use `"high"` only when you are certain. Use `"low"` when the
  options are defective, when two answers are equally defensible, or when OCR
  damage leaves real doubt about what was asked. **Do not inflate.** An
  inflated score is worse than a low one, because it tells the reader to stop
  thinking.
- **`exp`** — 1–4 sentences. Lead with the fact or the working that makes the
  answer correct. Where a distractor is a classic trap, say why it is wrong.
  Do **not** begin with "The correct answer is (b)" — the UI already highlights
  it. For anything computational (complexity, Gantt charts, page faults, base
  conversion, K-maps, address translation, counting), **show the actual
  working**, not just the result.
- **`sub`** — the specific topic, under 40 characters (e.g. "Page replacement",
  "Addressing modes", "AVL rotations"). This groups questions in the UI, so
  prefer a name you would reuse across similar questions over a unique one.
- **`mode`** — how the reader should study it: `"calculate"` (a procedure or
  formula produces the answer), `"understand"` (reasoning from the concept gets
  you there), or `"memorise"` (an arbitrary convention, name or list with no
  derivation path).
- **`broken`** — `true` if the question cannot be answered correctly as
  printed: no correct option, duplicated options, or OCR damage that destroyed
  the meaning. Still give your best `ans`, set `conf: "low"`, and explain the
  defect plainly in `exp`.

## Rules

1. Every input question must appear exactly once. **Count before you write.**
2. Never write an explanation that contradicts your own `ans`.
3. These are scanned papers. Mathematical symbols are frequently mangled:
   `A>B` for `A→B`, `AUB` for `A∪B`, `ANB` for `A∩B`, `p  q` for `p → q`,
   stray `` characters for `∈` `¬` `≤`. Where the intent is clearly
   recoverable, answer the question as it was obviously meant and say so in one
   clause. Where it is not recoverable, set `broken: true` and `conf: "low"`.
   **Do not silently guess at a mangled formula.**
4. These papers contain genuine printing errors — duplicated options,
   misspellings, occasionally no correct answer at all. Do not pretend a broken
   question is fine.
5. **Do not fabricate.** If you cannot verify something, write a shorter honest
   explanation grounded in what the options actually say, and set `conf: "low"`.
   A hedged explanation is far better than an invented fact.
6. Where a question is ambiguous because two options are both defensible under
   different textbook conventions, pick the one the Indian-syllabus standard
   texts (Mano for architecture, Galvin/Silberschatz for OS, Horowitz-Sahni for
   data structures, Kenneth Rosen for discrete maths) would mark correct, note
   the ambiguity in `exp`, and set `conf: "medium"`.

Write your answers with the Write tool to the output path you are given.
Reply with only: the count written, how many you marked `broken`, and the
confidence tally.
