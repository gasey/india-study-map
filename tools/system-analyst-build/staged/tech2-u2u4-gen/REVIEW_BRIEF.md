# Review brief — TECH2 Units 2 & 4 depth pass

You are adversarially reviewing authored multiple-choice questions for the
**MPSC System Analyst** exam, Technical Paper II. A real person is studying
from these for a real exam.

**There is no official answer key and no past paper for this material.** MPSC
has never examined these units. Nothing downstream disagrees with a wrong
question except you. If you wave something through, it ships and it teaches
the user something false.

You are reviewing **blind**: another reviewer is covering the same questions
independently and you must not try to guess or match their findings. Converging
by accident is the signal; converging by imitation destroys it.

## What counts as a flag

Flag a question if **any** of these hold:

1. **The key is wrong.** The keyed letter is not the best answer.
2. **More than one option is defensible.** The commonest failure in this
   subject. A distractor that is *also true*, or *also fixes the symptom*,
   competes with the key even if the key is "more correct". If the stem does
   not exclude it, that is a flag.
3. **The answer depends on an unstated assumption** — which cloud provider,
   tool version, framework, driver setting, or spec revision. If changing an
   unnamed assumption changes the answer, the stem must pin it.
4. **The explanation teaches something false**, even when the key is right.
   A correct key with a wrong rationale still miseducates. This is a real
   flag, not a nitpick — one such case was found in tonight's earlier pass.
5. **A fabricated or wrong specific** — RFC number, status code, header name,
   CLI noun, Act section, port, date, version.
6. **Stale as of 2026** — true in 2019, since changed.
7. **Duplicate** of another question in your batch (same fact, reworded).
8. **Below the required level** — defines what a class/thread/HTTP request is,
   or is answerable without the B.E/MCA-level knowledge the post requires.

Do **not** flag: house style, phrasing you'd word differently, answer-letter
distribution, or a question being merely easy-ish if still level-appropriate.

## Method

Work question by question. For each one, before looking at the keyed answer,
decide what you think the answer is. Then compare. Where you disagree with the
key, assume **you** may be the one who is wrong and check the actual spec or
documented behaviour before flagging — but do not talk yourself out of a real
disagreement either.

Then, separately, attack each distractor: is there a reading under which it is
true or correct? If yes, and the stem doesn't rule it out, flag it.

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
      "id": "GEN-T2U2-001",
      "type": "wrong-key | ambiguous | unstated-assumption | bad-explanation | wrong-specific | stale | duplicate | too-easy",
      "severity": "high | medium | low",
      "detail": "<what is wrong, and what the fix should be. Be specific enough that someone can act on it without re-deriving your reasoning.>",
      "suggested": "<optional: corrected key letter, or corrected wording>"
    }
  ],
  "notes": "<1-3 sentences on the batch as a whole.>"
}
```

`id` **must** be copied exactly from the question you are flagging. A flag whose
id does not match a real question cannot be resolved and will block the import.

Your final chat message is a one-line summary. The JSON goes in the file.
