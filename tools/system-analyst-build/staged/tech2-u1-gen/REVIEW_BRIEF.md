# Review brief — TECH2 Unit 1 (Object Oriented Programming) depth pass

You are adversarially reviewing authored multiple-choice questions for the
**MPSC (Mizoram Public Service Commission) System Analyst** exam, Technical
Paper II. A real person is studying from these for a real exam.

**These are authored questions with no official answer key.** Unlike the Units 2
and 4 pass, MPSC *has* examined this material — four past-paper questions in the
bank sit on Unit 1 leaves — but those four are separate records and are not in
your batch. Everything you are reviewing was written by an author, and nothing
downstream disagrees with a wrong question except you. If you wave something
through, it ships and it teaches the user something false.

You are reviewing **blind**: another reviewer is covering the same questions
independently and you must not try to guess or match their findings. Converging
by accident is the signal; converging by imitation destroys it.

## The language is C++

The Unit 1 syllabus paragraph in MPSC's notification is unambiguously C++ —
operator overloading, virtual functions, pointers to object, I/O streams, file
handling, exception handling. Judge every question as C++ unless its stem names
another language. A question whose keyed answer would be correct in Java or
Python but is wrong in C++ is a **wrong-key** flag, not a stylistic quibble.

Where a question turns on exact language or library behaviour, **compile it and
run it** rather than trusting recall. You have a shell. `g++ -std=c++17` is
available. This is the single highest-value thing you can do here: the previous
Unit 1 review found two defects this way that reading alone would have missed.

## What counts as a flag

Flag a question if **any** of these hold:

1. **The key is wrong.** The keyed letter is not the best answer.
2. **More than one option is defensible.** A distractor that is *also true*
   competes with the key even if the key is "more correct". If the stem does
   not exclude it, that is a flag.
3. **The answer depends on an unstated assumption** — compiler, standard
   revision, or implementation-defined behaviour. C++ has a lot of this: if
   changing an unnamed assumption changes the answer, the stem must pin it.
   Undefined behaviour presented as having one predictable result is a flag.
4. **The explanation teaches something false**, even when the key is right.
   **This is the defect this programme exists to catch.** Both flags raised in
   the last Unit 1 review were of exactly this shape: a correct key justified by
   a rule stated too broadly — "failbit is the bit the boolean conversion
   reports" (badbit also makes it false), and "opening for output without
   ios::in is what discards the contents" (ios::app does not). Read every
   explanation as a claim to be falsified, not as prose supporting a key you
   have already agreed with. A rule stated more broadly than it holds is a flag
   even when the sentence it appears in reaches the right conclusion.
5. **A fabricated or wrong specific** — a header name, a member function that
   does not exist, a wrong signature, a misattributed standard revision.
6. **Duplicate** of another question in your batch, or of one of the existing
   stems listed in the brief (same fact, reworded).
7. **Below the required level.** System Analyst requires B.E/B.Tech, MCA or
   M.Sc(CS/IT). A question answerable without that knowledge, or one that
   defines what a class or an object is, is too easy.

Do **not** flag: house style, phrasing you'd word differently, answer-letter
distribution, or a question being merely easy-ish if still level-appropriate.

## Method

Work question by question. For each one, **before** looking at the keyed answer,
decide what you think the answer is. Then compare. Where you disagree with the
key, assume **you** may be the one who is wrong and check cppreference or the
actual compiler behaviour before flagging — but do not talk yourself out of a
real disagreement either.

Then, separately, attack each distractor: is there a reading under which it is
true or correct? If yes, and the stem doesn't rule it out, flag it.

Then, separately again, read the explanation on its own terms and ask whether
every general claim in it is actually true as stated. This is the pass that
catches defect type 4, and it is easy to skip because the key is already right.

Be honest about severity. Do not pad the list to look thorough, and do not
suppress a marginal finding to look agreeable. Zero flags is an acceptable
result if the batch is clean; several is acceptable if it is not.

## Output

Write JSON to the output path you are given. Nothing else in the file.

```json
{
  "reviewer": "<your label, as given in your prompt>",
  "reviewed": <count of questions you actually reviewed>,
  "flags": [
    {
      "id": "GEN-T2U1-001",
      "type": "wrong-key | ambiguous | unstated-assumption | bad-explanation | wrong-specific | duplicate | too-easy",
      "severity": "high | medium | low",
      "detail": "<what is wrong, and what the fix should be. Be specific enough that someone can act on it without re-deriving your reasoning. If you verified by compiling, say what you ran and what it printed.>",
      "suggested": "<corrected key letter, or corrected wording>"
    }
  ],
  "notes": "<1-3 sentences on the batch as a whole, including what you verified by compiling.>"
}
```

`id` **must** be copied exactly from the question you are flagging. A flag whose
id does not match a real question cannot be resolved and will block the import.

Your final chat message is a one-line summary. The JSON goes in the file.
