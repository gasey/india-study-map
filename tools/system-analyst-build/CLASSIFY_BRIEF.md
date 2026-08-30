# Brief for question-classifier agents

You are labelling real MPSC exam questions with **how the reader should study
them** — not with what the answer is. The label routes each question into one of
three tools the app already has, so a wrong label sends someone to the wrong
machine.

Read `tools/bank-rebuild/SOLVE_BRIEF.md` first if you have not: the honesty rules
there about confidence apply here unchanged.

## What this label is, and is not

This is a **judgement about study method**, not a fact that can be checked
against a source. That makes it a different kind of claim from an answer key,
and it changes what "being careful" means:

- A wrong answer teaches a false fact before a real exam. That is why solving is
  held to the "verify against source" standard.
- A wrong label here only routes someone to the wrong study mode. Milder — but
  it still wastes the scarcest thing the reader has, which is revision time.

So: no fabrication, no inflated confidence, and when you genuinely cannot decide,
say so through `confidence` rather than by guessing decisively.

## The three modes

### `calculate`
A **procedure or formula produces the answer.** Someone who knows the method can
derive it cold, with no memory of this particular question.

> *Decisive test:* could you write a generator that produces this same question
> with different numbers, and compute the new answer mechanically?

Examples: subnetting and host counts · base conversion · LCM/HCF, percentages,
time-and-work · earned-value figures (CV, SPI, EAC) · OSPF cost from bandwidth ·
predicting the output of a code fragment · counting communication channels with
n(n−1)/2.

A number appearing in the stem is **not** enough. "The IPv6 header is how many
bytes?" is a remembered constant, not a calculation.

### `understand`
**Reasoning from a concept gets you there.** Someone who genuinely understands
the topic, but has memorised no list and never seen this question, can still
eliminate the wrong options and land on the right one.

> *Decisive test:* does the correct answer *follow from* what the thing is —
> or would you have to have been told it separately?

Examples: "What is the primary purpose of NAT?" · "Why does a five-year data
centre contract normally include a technology-refresh clause?" · "Two VLANs
cannot communicate without which kind of device?" · most "which is the BEST
course of action" scenario questions.

### `memorise`
The answer is an **arbitrary convention, name, number or list membership** with
no derivation path. Nothing about understanding the topic yields it.

> *Decisive test:* could a competent practitioner who genuinely understands this
> topic still get it wrong, purely for never having committed it to memory?
> If yes, it is `memorise`.

Examples: port numbers · RFC / IEEE / 802.11 numbers · IT Act and IPC section
numbers · Constitutional article numbers · years, launch dates, scheme targets ·
maximum ranges and data rates · exact IOS command spellings (`copy tftp flash`) ·
which items appear on a textbook's enumerated list of inputs/outputs · full forms
and expansions.

**PMBOK process inputs/outputs (TECH3 Units 4–13) are usually `memorise`.** The
47-process grid is an arbitrary enumeration; that a particular tool is listed
under a particular process is a convention of the guide, not something derivable
from what project management *is*. Label `understand` only where the question
genuinely turns on reasoning — "which is the BEST response to this situation" —
rather than on recalling the grid.

## The hard boundary

`understand` vs `memorise` is where nearly all the difficulty lives, and it is
genuinely fuzzy. Two rules make it decidable:

**1. Judge against a competent practitioner, not against yourself.** You may know
that HTTP is port 80, but that knowledge came from memorising it, not from
understanding HTTP. Ask where the knowledge *comes from*, not whether you have it.

**2. When honestly torn, choose `memorise`.** The two errors are not
symmetrical:

- Labelled `memorise` when it was really `understand` → it enters tighter
  spaced-repetition rotation and the reader sees it more often. Cost: some time.
- Labelled `understand` when it was really `memorise` → longer intervals, the
  reader forgets it, and drops a mark in the exam. Cost: the mark.

Bias toward the cheaper mistake. Set `confidence: "medium"` when you do this, so
the bias is visible rather than hidden.

## Negative-form questions ("which is NOT…", "…EXCEPT", "identify the false")

These split on what the list is:

- If the listed properties **follow from what the thing is**, so the odd one out
  is recognisably inconsistent → `understand`.
- If the list is an **enumerated set from a textbook**, where the odd one out is
  only wrong because it is not on the list → `memorise`.

## Input

A JSON array. Each entry: `id`, `paper`, `unit`, `sub`, `question`, `options`
(object keyed A–D), `answer` (the correct letter), and `explanation` where the
bank has one.

The explanation is often the strongest signal available. An explanation that
works through a method points to `calculate`; one that reasons from a definition
points to `understand`; one that simply asserts a fact ("Section 66A covers
offensive messages") points to `memorise`.

## Output

A JSON array, one object per input question, **same order, ids copied verbatim**:

```json
[ { "id": "TECH1_2024-7", "mode": "calculate", "confidence": "high",
    "why": "Host count from the mask: 2^(32-19) - 2, computable from the stem." } ]
```

- `mode` — exactly one of `"calculate"`, `"understand"`, `"memorise"`.
- `confidence` — `"high"` | `"medium"` | `"low"`. Honest. Use `"medium"` where
  you applied the tie-break rule above, `"low"` where the question is defective
  or the mode genuinely depends on the reader's background. **Do not inflate** —
  this drives a visible badge and a review interval.
- `why` — one short sentence naming *what makes it that mode*. Not a restatement
  of the question, and not an explanation of the answer. "Arbitrary section
  number, no derivation path" is a good `why`; "This is about the IT Act" is not.

## Rules

1. Every input question appears exactly once, in the input order, with the id
   copied verbatim. Verify before writing.
2. Never label from the `sub` alone. Two questions under "Sub-netting" can be a
   calculation and a remembered constant respectively — read each stem.
3. Do not let the paper drive the label. TECH3's aptitude units are mostly
   `calculate`, but its PMBOK units are mostly `memorise`; TECH2 is heavily
   `understand` with a hard core of `memorise` scheme names, targets and Act
   sections. Read the question.
4. If a question is broken or unanswerable as printed, label it on what it was
   evidently *trying* to ask and set `confidence: "low"`.
5. `calculate` is the smallest bucket by a long way. Measured over the full
   System Analyst bank after the first pass: **5.8%** — 63 questions in 1,082,
   and they cluster hard in the aptitude units and GS economics. If you are
   labelling much more than that, you are probably counting "has a number in
   it" as a calculation. Re-read the decisive test.

   (An earlier draft of this brief guessed 12%, from a keyword heuristic that
   counted "how many bytes is the IPv6 header" and "how many districts does
   Mizoram have" as calculations. Both are remembered constants. The agents
   were right and the heuristic was wrong — which is the whole reason the
   rule pre-pass in `classify.py` is a cross-check and not a classifier.)
