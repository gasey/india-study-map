# Brief for concept-authoring agents (Phase 5)

You are writing the study guide for the MUDAL System Manager exam. **This is the
product**, not a supplement — the Study tab is what the candidate reads to learn
a topic, and the questions only test it afterwards.

Someone is sitting this exam. Everything here has to be true.

## Output schema

A JSON array. One object per assigned subtopic, in the order given:

```json
[
  {
    "paper": "TECH1",
    "unit": "I",
    "unitTitle": "Fundamentals of Computer",
    "sub": "Cache Memory",
    "def": "One paragraph. What it is, precisely, in a form the reader could repeat in an exam.",
    "exp": "Multi-paragraph explanation.\n\nParagraphs separated by a blank line — the app splits on \\n\\n and wraps each in a <p>.",
    "facts": ["An exam-checkable fact", "Another"],
    "traps": ["A confusion the examiner exploits", "Another"],
    "mnem": "Optional memory aid, or an empty string",
    "rel": ["Another subtopic's exact sub string"]
  }
]
```

- `paper`, `unit`, `unitTitle`, `sub` — copy **verbatim** from your input file. `sub`
  is matched by exact string equality to link this concept to its questions
  (`app.js`: `q.paper === c.paper && q.unit === c.unit && q.sub === c.sub`). A
  paraphrase silently links to nothing.
- `def` + `exp` together should run **~240 words**. Not 500. Not 80. The reader is
  revising a 259-subtopic syllabus and cannot absorb an essay per subtopic.
- `facts` — 3–6 entries. Things an examiner can turn into an MCQ: numbers, names,
  orderings, canonical definitions, "X is used for Y".
- `traps` — 2–4 entries. The distractor patterns and near-miss confusions that
  actually appear. This is the highest-value field; it is what a plain textbook
  does not give you. Be concrete: "X vs Y — they differ in Z", not "be careful".
- `mnem` — only where a genuine aid exists. An empty string is better than a
  contrived one.
- `rel` — 0–3 sibling subtopics worth reading alongside, each the **exact** `sub`
  string of another concept. Omit or leave empty if none.

Plain text only in every field. **No HTML and no markdown** — the app escapes
these strings, so tags and asterisks render literally to the reader.

## Register

Write for an adult graduate with a one-year computer diploma who is revising
under time pressure. Direct, concrete, no filler. Say the thing.

- Do not open with "In today's digital world…" or any scene-setting.
- Do not pad with restatements of the subtopic name.
- Prefer the concrete instance to the abstract gesture: "SMTP sends mail, IMAP
  and POP3 retrieve it" beats "several protocols handle mail transfer".
- Where a term has an Indian-government-specific meaning or usage, give that —
  this is a Mizoram state-government PSU post.

## Accuracy rules

1. **Never state a specific you are not sure of.** Version numbers, exact dates,
   statutory section numbers, port numbers, RFC numbers, retention periods,
   parameter counts. If you cannot state it confidently, write the concept at the
   conceptual level and omit the specific. A vague-but-true guide is useful; a
   precise-but-wrong one teaches a false fact before a real exam.
2. **Be correct as of 2026.** Much of this syllabus was added by MUDAL in July
   2026 and is deliberately modern. Do not describe it in 2016 terms.
3. Where the technology has genuinely moved on, say so — the candidate may meet a
   dated question drawn from an older paper, and knowing both is useful.
4. Do not invent a mnemonic that does not actually spell anything.
5. `facts` must not contradict `def`/`exp`.

## Rules

1. **Every assigned subtopic, exactly once, in order.** Verify before writing.
2. Stay inside your assigned subtopic. Cross-reference siblings with `rel`
   instead of duplicating their content — the reader is going through the whole
   unit, so repetition wastes their time and your word budget.
3. Your final message is a one-line summary. The JSON goes in the file.
