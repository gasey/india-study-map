# Brief for concept-authoring agents — System Analyst

You are writing **concept-guide entries**, not questions. Each entry is the
revision note for one syllabus leaf: the thing the reader opens in the Study
pane when they get a question wrong and want to actually learn the topic.

`tools/system-analyst-build/GENERATE_BRIEF.md` governs **difficulty and tone**
here too, and its override is the important part: this post requires
**B.E/B.Tech, MCA or M.Sc (CS/IT)**. Do not write to a diploma level. Assume the
reader knows what a class, a socket, a foreign key, a VM and an HTTP request
are — the concept entry is where you go *deeper* than that, not where you
re-explain it.

## One entry per leaf, and it is the only one that leaf will ever get

The pipeline allows exactly one concept per `paper|unit|sub`, which is the
convention every paper in this app except TECH1 follows. So **everything the
reader needs for that leaf has to be in your single entry.**

That matters more here than it did for the older papers, because the 2026
Technical Paper II leaves are *wide*. A leaf like

> `JavaScript, the DOM, event handling, asynchronous programming, JSON and Fetch`

names six topics, and your one entry is the note for all six. Do not pick a
favourite and write a tight note on that — walk the leaf's named parts in
order, giving each enough to answer a question on it. These entries should run
**longer than the 400-character minimum**, and carry more `facts` than the
minimum four: 6–10 is right for a leaf that bundles this much. The minimums in
the validator are there to catch a stub, not to describe a good entry.

## Output

A JSON array written to the path you are given, one object per target:

```json
[
  {
    "sub": "Constructors and destructors",
    "def": "A one-or-two-sentence definition that would stand as a textbook gloss.",
    "exp": "The body of the note. Several paragraphs, separated by \\n\\n.",
    "facts": ["A crisp, checkable statement.", "Another.", "…"],
    "traps": ["The specific way an exam question catches people here.", "…"],
    "mnem": "A memory hook, or \"\" if the topic genuinely has none.",
    "rel": ["Another leaf's sub string", "…"]
  }
]
```

### `sub`

Copied **character-for-character** from the `targets` list in your todo file.
These strings are long and contain punctuation. A paraphrase is rejected.

### `def` — minimum 60 characters

One or two sentences. What the thing *is*. Precise enough to be quoted.

### `exp` — minimum 400 characters, and this is the substance

Several paragraphs separated by blank lines (`\n\n`). Match the shape the
existing TECH1 entries use:

- Start from the mechanism, not the vocabulary. *Why* it works this way.
- **Show worked detail where the topic has any.** A normalization
  decomposition, a functional-dependency closure, a subnet calculation, an
  availability-to-downtime conversion, the actual order a constructor chain
  runs in. A concept note on a calculable topic with no calculation in it is
  half a note.
- Include a line on **exam shape** — how MPSC actually asks about this leaf,
  and where the marks get lost. The paper is MCQ (100 marks) plus
  conventional/essay (100 marks), so say when a leaf is essay-shaped.
- Where the syllabus names concrete technology (Terraform, Kubernetes, Nginx,
  PHP, `ifstream`), use it. This syllabus is specific on purpose.

Plain text with `\n\n` between paragraphs. No Markdown headings, no bullet
syntax — the app renders this as prose. Unicode is fine and encouraged where it
helps (`⊆`, `π`, `σ`, `2ⁿ`), but **no private-use / Symbol-font characters** —
`check_symbol_residue.py` tracks those and this bank has been cleaned of them
once already.

### `facts` — at least 4

Crisp, individually checkable statements. These are what the reader drills.
Each should stand alone out of context. Numbers, names, exact distinctions.

### `traps` — at least 2

The specific ways an exam question catches people on **this** leaf. Not generic
advice. "Read the question carefully" is not a trap; "'how many proper subsets'
means 2ⁿ − 1, and only 2ⁿ − 2 if it says *non-empty* proper subsets" is.

If a trap is a near-miss distinction (the classic ones here: Type 1 vs Type 2
hypervisor, CSRF vs XSS defences, `flex-basis: 0` vs `auto`, requests vs
limits, BCNF vs 3NF, constructor vs destructor order), name both sides.

### `mnem`

A genuine memory hook, or `""`. Do not invent a strained acronym to fill the
field — an empty string is a perfectly good answer and 119 of the existing 962
entries have one.

### `rel` — related leaves

A list of **`sub` strings of other leaves**, not ids. Your todo file has
`siblingSubtopics` listing every leaf of your unit; prefer those. An entry that
resolves to no concept is **dropped silently by the app**, so the pipeline
rejects unresolvable ones — copy the sibling strings exactly. 2–5 entries is
right.

## Rules

1. **Cover every target in your todo file, exactly once.** Count before writing.
2. **Do not fabricate.** No invented version numbers, RFC numbers, statute
   sections, or exact dates. If you cannot state it confidently, write the
   concept at a level where you can. A vague-but-true note beats a
   precise-but-wrong one — and unlike a question, a wrong *fact* here is read as
   authoritative reference material.
3. **No figures or diagrams.** Text only. If a topic really needs a diagram
   (an ER model, a network topology), describe it in words the reader can draw
   from.
4. **Be current as of 2026.** These leaves are modern by design; do not date
   them to older conventions.
5. **The bank is your calibration.** Your todo file gives
   `questionsInBank` per target. Read some of those questions in
   `public/mpsc-system-analyst/data/questions.js` — your note should be the
   thing that lets a reader answer them. If a leaf has 0 questions, the note
   carries that leaf alone.
6. Your final message is a one-line summary. The JSON goes in the file.
