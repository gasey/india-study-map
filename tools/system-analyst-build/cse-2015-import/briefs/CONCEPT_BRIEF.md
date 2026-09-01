# Brief for concept-guide authors — MPSC Technical Paper I

You are writing the **study guide** for someone sitting the Mizoram PSC
System Analyst exam (post: System Analyst, Mizoram Urban Development Agency;
technical syllabus = Informatics Officer, ICT Department, approved 30 July
2026). They are a working engineer revising for a real exam in which
**Technical Paper I is 200 marks and counts for merit** — General English and
General Studies are qualifying only, so this paper is where the exam is won.

Paper I has four units:

| unit | title | marks |
|---|---|---|
| 1 | Discrete Mathematics | 40 |
| 2 | Computer Architecture and Organization | 40 |
| 3 | Data Structures and Algorithms | 60 |
| 4 | Operating System | 60 |

The paper is **50 MCQs × 2 marks (100) + conventional essay questions (100)**,
with **negative marking of 1/3 on MCQs**. That matters for how you write:
a reader who half-remembers a fact will lose marks by guessing, so the
`traps` field below is not decoration — it is the highest-value part.

## The one rule that overrides everything

**Do not write anything you are not sure is true.** This guide is the reader's
source of truth for a real exam. A confidently-worded wrong fact is worse than
no entry at all. If you are unsure of a specific number, threshold, or
attribution, either omit it or state the uncertainty in words ("commonly
quoted as ~X, though implementations vary"). Never invent a date, a theorem
name, an author, or a numeric constant to make an entry look complete.

Where genuine disagreement exists between standard textbooks (Mano vs.
Stallings on some architecture terms; Galvin vs. Tanenbaum on some OS terms),
say so briefly rather than picking one and asserting it.

## Tone

Write for a competent engineer who has not touched this material since
university. Plain, direct, concrete. Prefer a worked number to an abstraction.
Short sentences. No filler, no "in today's fast-paced world", no restating the
question. Indian exam papers phrase things in a particular older idiom — where
a term has a textbook name the paper will use, use that name.

## Output format

Write a JSON array to the output file you are given. One object per concept:

```json
{
  "id": "<YOUR-PREFIX>-01",
  "paper": "TECH1",
  "unit": "3",
  "unitTitle": "Data Structures and Algorithms",
  "sub": "Binary search",
  "def": "One sentence. What the thing IS. No hedging, no lead-in.",
  "exp": "The teaching body. 120-260 words...",
  "facts": ["...", "..."],
  "traps": ["...", "..."],
  "mnem": "A memory hook, or \"\" if none is genuinely useful.",
  "rel": ["Other concept names this connects to"]
}
```

Field notes:

- **`id`** — use the exact prefix you are told, numbered `-01`, `-02`, …
  These are placeholders; they get renumbered on merge. Just keep them unique
  within your file.
- **`unit` / `unitTitle`** — exactly as in the table above. Copy the title
  string verbatim; it is matched against the syllabus.
- **`sub`** — the specific topic, under 45 characters. This is the card title
  the reader sees.
- **`def`** — a single sentence, self-contained. It appears alone in
  collapsed views, so it must make sense with nothing around it.
- **`exp`** — 120–260 words of actual teaching. Explain the *why*, not just
  the *what*. Where a formula exists, give it and define every symbol. Where a
  worked example takes three lines, include it — a concrete trace beats a
  paragraph of prose. If the topic has a standard exam framing ("given this
  reference string, how many page faults under LRU"), show that shape.
- **`facts`** — 4–8 crisp, individually-checkable statements. These are what
  the reader revises the night before. Put exam-examinable specifics here:
  complexities, formulas, capacities, standard names. One idea per string.
- **`traps`** — 3–6 entries. The distractors this topic actually generates in
  MCQs, and the confusions that cost marks. Be specific: not "students confuse
  these", but "LRU and FIFO give the same result on this reference string, so
  the question must be read for which is asked". This field is where your
  value is highest — with 1/3 negative marking, knowing the trap is worth more
  than knowing the fact.
- **`mnem`** — only if a real one exists. An honest `""` is much better than a
  forced acronym. Do not invent strained mnemonics to fill the field.
- **`rel`** — 2–5 names of adjacent concepts, as plain strings.

## Coverage

You are given an explicit topic list. Cover every topic on it. If a topic on
your list genuinely needs two cards to be taught properly, write two. If two
listed topics are better taught as one card, merge them and say so in your
final reply. Aim for the target count you are given, but coverage and
correctness beat hitting a number exactly.

Do not stray outside your assigned list — other agents are covering the
neighbouring topics, and duplicates cost the reader time.

## Before you write the file

Check: every `exp` is 120–260 words; every `traps` array has ≥3 entries;
every `unit`/`unitTitle` pair matches the table; the JSON parses; ids are
unique. Then write the file with the Write tool.

Reply with only: the count written, and any topic you merged, split, or could
not cover confidently.
