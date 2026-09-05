# Brief — classify past-paper questions against the 2026 syllabus

You decide, for each question, whether it belongs to the current MPSC System
Analyst syllabus and if so exactly where. You are **not** solving anything.
Do not write answers.

## Inputs and output

- The syllabus: `staged/ilm2023-p3/_syllabus-2026.json` — two papers, four units
  each, with the exact subtopic strings.
- Your slice of questions: named in your task.
- Your output file: named in your task.

**Do not read `questions.js` or `concepts.js`.** They are megabytes wide and
irrelevant here.

## Write incrementally

Rewrite your entire output file after **every question**. Start by writing `[]`
before you classify anything. An agent that holds twenty results in memory and
dies at nineteen has produced nothing.

## Output shape

One object per question, in the order given:

```json
[
  {
    "no": 10,
    "verdict": "on",
    "paper": "TECH2",
    "unit": "3",
    "sub": "Database design, functional dependencies and normal forms",
    "why": "Fifth normal form is a normal form; sits squarely in this leaf.",
    "confidence": "high"
  },
  {
    "no": 17,
    "verdict": "off",
    "paper": null, "unit": null, "sub": null,
    "why": "Software engineering objectives. The 2026 syllabus dropped software engineering entirely — no unit of TECH1 or TECH2 covers SDLC, SRS, SQA, cohesion/coupling or process models.",
    "confidence": "high"
  }
]
```

`verdict` is exactly `"on"` or `"off"`.

## The rule that governs everything

**`sub` must be copied character-for-character from `_syllabus-2026.json`.** Not
paraphrased, not re-capitalised, not shortened. A downstream merge validates
every `sub` against the syllabus leaves and refuses to write the whole batch if
one does not match. Copy and paste it.

Same for `paper` (`"TECH1"` or `"TECH2"`) and `unit` (the string `"1"`–`"4"`).

## How to decide "off"

Be honest and be willing to say `off` a lot. The 2026 syllabus is **narrower
than the paper it came from**. This paper was set for a different, older
syllabus, and large parts of it test subjects the current one simply does not
contain. Known examples, all `off`:

- **Software engineering** — SDLC and process models, SRS, feasibility studies,
  cohesion and coupling, SQA, risk categories, cost of maintenance, software
  project management. TECH1 is Discrete Maths / Architecture / Data Structures /
  OS. TECH2 is OOP / Web / DBMS / Cloud. Neither contains software engineering.
- **Systems analysis and design** — the analyst's fact-finding methods,
  interviews, questionnaires, DFDs, feasibility.
- **General data communications and networking** — topologies, duplex modes,
  RIP and routing protocols, OSI layers, error detection, transmission media.
  Be careful here: TECH2 Unit 2 has *"Web architecture, client-server
  communication, HTTP/HTTPS, DNS and hosting"*. A question about **DNS, HTTP,
  HTTPS or the client-server web model** is `on` under that leaf. A question
  about **bus vs star topology, half-duplex, RIP, or a netmask calculation** is
  `off` — those are data communications, not web architecture. Judge by what
  the question actually tests, not by the word "network" appearing.

Do not stretch a question to fit a leaf. If it needs a paragraph of
justification to belong, it does not belong — mark it `off` and say why. A
wrongly-included question pollutes a real exam-prep pool; a wrongly-excluded one
is recoverable from this file.

Conversely do not mark `off` out of laziness. DBMS, SQL, normalisation,
transactions, concurrency, ER modelling are all squarely `on` under TECH2 Unit
3. Operating systems, scheduling, deadlocks, memory and file systems are all
squarely `on` under TECH1 Unit 4.

## `confidence`

`high` / `medium` / `low`, your honest read of your own verdict. Use `medium`
or `low` freely — a reviewer reads the low-confidence ones first, which is the
point. Do not inflate.

## Final message

One line: your range, how many `on`, how many `off`, and the numbers of any you
rated `low`. Your output file is the deliverable.
