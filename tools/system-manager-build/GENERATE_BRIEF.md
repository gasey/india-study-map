# Brief for question-generation agents (Phase 4)

You are authoring exam questions for the MUDAL System Manager written exam, for
syllabus subtopics that **no past paper covers**. Someone is sitting this exam.

## Why this exists

The System Manager technical syllabus reuses the 2019 Computer Operator syllabus,
so the closest past papers are the two 2016 Computer Operator sittings. MUDAL
**updated** that syllabus in July 2026 and added a large block of modern content —
Generative AI, LLMs, prompt engineering, AI ethics, cloud, containerisation,
ITIL/ITSM, NIC eOffice, DSC/PKI, Power Query, Microsoft 365. The 2016 papers
predate all of it, so entire units have **zero** past-paper coverage.

Measured: 70 of 120 TECH1 leaf subtopics and 90 of 133 TECH2 leaves have no
question at all. TECH2 Unit IV (Cyber Security / AI / Emerging Technologies) is
**30 marks with zero questions**. Your output is the only practice material those
marks will ever have — which also means an error here is uncorrected by anything.

A syllabus author who adds "Generative AI" and "Prompt Engineering" in 2026
intends to examine them. Treat this content as high-yield, not filler.

## Difficulty — this is the most common way to get it wrong

Calibrate to the **2016 Computer Operator papers**, NOT to the Informatics Officer
or Computer Science & Engineering papers. The qualification bar for this post is
*any graduate plus a one-year computer diploma* — not a CS degree.

Right level (real examples from the 2016 papers):
- "A group of four bits is also called"
- "In OSI reference model, which layer is responsible for error checking between Source and Destination?"
- "Which device transfers message in the form of broadcast?"

Wrong level — do NOT write questions like these:
- anything requiring a proof, a derivation, or an algorithm's complexity class
- compiler phases, automata, J2EE, design patterns
- "Which of the following is NOT a property of a B+ tree of order n…"

Aim for: definitions, purposes, canonical distinctions, standard terminology,
"which tool/protocol/tag does X", one-step reasoning. Factual recall an attentive
diploma-holder would have. Roughly 70% straightforward recall, 30% one-step
applied reasoning.

## Input

A JSON file with `paper`, `unit`, `unitTitle`, `unitMarks`, `targets` (the leaf
subtopics to cover, each with its section for context) and `perTarget` (how many
questions to write for each).

## Output

Write a JSON array to the path you are given:

```json
[
  {
    "sub": "Prompt Engineering",
    "q": "In prompt engineering, what does 'few-shot prompting' mean?",
    "opts": {
      "A": "Giving the model a small number of worked examples in the prompt",
      "B": "Limiting the model to a few words of output",
      "C": "Running the same prompt several times and averaging",
      "D": "Training the model again on a small dataset"
    },
    "ans": "A",
    "conf": "high",
    "exp": "Few-shot prompting supplies a handful of input-output examples inside the prompt itself so the model can infer the pattern, with no change to the model's weights. Retraining on new data is fine-tuning, which is a different technique."
  }
]
```

- `sub` — copied **character-for-character** from the `targets` list. It is matched
  by exact string equality against the concept guide; a paraphrase links to nothing.
- `opts` — exactly four, keys A–D. One unambiguously correct.
- `ans` — a single letter.
- `conf` — you are authoring these, so you should be able to write `high`. If you
  find yourself below `high`, the question is probably badly framed — rewrite it
  rather than shipping a hedge.
- `exp` — 1–3 sentences. Lead with the fact that makes the answer correct, then
  kill the most tempting distractor. Do not open with "The correct answer is (a)".

## Rules

1. **Cover every target.** `perTarget` questions for each subtopic in the list, no
   more, no less. Verify counts before writing.
2. **Distractors must be plausible and wrong** — same category, same register as
   the answer. "Banana" is not a distractor. A question where three options are
   obviously silly teaches nothing.
3. **Exactly one defensible answer.** This is authored content; there is no excuse
   for ambiguity. Watch for "all of the above" — avoid it entirely.
4. **Spread the answer letter.** Do not let A or C dominate; aim for a roughly even
   split across the batch. Real papers are uneven, but a generated set with 60% A
   is a tell that teaches pattern-matching instead of content.
5. **Be current and correct as of 2026.** These subtopics are modern by design.
   Do not date them to 2016 conventions the way the past papers do.
6. **Indian government IT context where the syllabus asks for it** — NIC eOffice,
   Digital India, DSC under the IT Act, CERT-In, DPDP Act 2023, UIDAI, DigiLocker,
   UPI. This is a state-government post; that framing is examinable.
7. **No figures or diagrams.** The app's schema is text-only. A question that needs
   an image cannot be used.
8. **Do not fabricate specifics you are unsure of** — version numbers, exact dates,
   section numbers of Acts, RFC numbers. If you cannot state it confidently, write
   the question at the conceptual level instead. A vague-but-true question beats a
   precise-but-wrong one.
9. Your final message is a one-line summary. The JSON goes in the file.
