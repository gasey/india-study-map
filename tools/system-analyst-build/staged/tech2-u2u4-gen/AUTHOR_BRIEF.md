# Authoring brief — TECH2 Units 2 & 4 depth pass

You are authoring multiple-choice questions for the **MPSC (Mizoram Public
Service Commission) System Analyst** exam, Technical Paper II. A real person is
studying from these for a real exam. There is **no official answer key and no
past paper** for this material — MPSC has never examined these units, because the
syllabus naming them is from 2026. So if you are wrong, nothing downstream
disagrees with you. Write accordingly.

Your questions will afterwards go to two independent adversarial reviewers whose
job is to refute them. Write so that they cannot.

## Difficulty — the most common way to get this wrong

System Analyst requires **B.E/B.Tech, MCA, or M.Sc (CS/IT) or higher**. The
reference standard is the **Informatics Officer** papers, not a clerical IT post.

Assume the reader knows what a class, a thread, a socket, an HTTP request and a
foreign key are. **Do not define them.** Aim for roughly **50% recall of
specifics a practitioner would actually hold, 50% one-step applied reasoning.**

Too easy (do not write these):
- "What does HTML stand for?"
- "Which of these is a cloud provider?"

Right level:
- "A `fetch()` call to a different origin succeeds in returning a 200, but
  JavaScript cannot read the response body. Which response header is missing?"
- "A pod is `Running` but the Service sends it no traffic. Which check explains it?"
- "Which OWASP Top 10 category covers an IDOR that exposes another user's order?"

## Flavour mix

A batch that is all one flavour produces a unit that drills one skill. Carry all
four across your batch:

1. **Specific recall a practitioner holds** — which header, which HTTP status,
   which `kubectl` noun, which CSS property, which Nginx directive.
2. **Conceptual / architectural** — why a thing exists, what it trades off, how
   two named approaches differ.
3. **Behaviour prediction** — a short config/code fragment (≤ 6 lines) and what
   it does. The trap must be a real semantic, not a typo.
4. **Operational / diagnostic** — a symptom, and what explains or fixes it.

## Rules (violating any of these makes the question unusable)

1. **Write exactly the number of questions asked for.** Count before returning.
2. **`sub` must be copied character-for-character** from the `leaf` field of your
   brief. It is matched by exact string equality; a paraphrase links to nothing
   and the import will reject it.
3. **Exactly one defensible answer.** This is authored content; there is no
   excuse for ambiguity. If the correct answer depends on which cloud provider,
   which tool version, which framework or which spec revision is assumed, then
   **the stem must name that assumption** — otherwise the question is broken.
   This is the single most common failure in this subject area.
4. **Distractors must be plausible and wrong** — same category and register as
   the key. Three obviously-silly options teach nothing. **Never use "all of the
   above" or "none of the above".**
5. **No accidentally-true distractors.** A distractor that is a true statement
   competes with the key even if it doesn't answer the question. Check each one.
6. **Spread the answer letter** roughly evenly across your batch. Do not let one
   letter dominate.
7. **Be correct as of 2026.** Cloud and web tooling move fast. Do not write a
   fact that was true in 2019 and has since changed.
8. **Do not fabricate specifics you are unsure of** — version numbers, RFC
   numbers, exact dates, port numbers, CVE ids, section numbers of Acts. If you
   cannot state it confidently, write the question at the conceptual level. **A
   vague-but-true question beats a precise-but-wrong one.**
9. **No figures, diagrams, tables or images.** The schema is text-only. A
   question needing a picture cannot be used.
10. **Do not duplicate the existing questions** listed in your brief's
    `existing_stems`. Same fact asked a different way is still a duplicate.
    Cover different ground within the leaf.
11. **Indian government IT context is examinable** where the syllabus invites it
    — DPDP Act 2023, CERT-In directions, MeitY cloud empanelment, Digital India,
    DigiLocker, UPI, India's data-localisation rules. Use it where it fits
    naturally; do not force it.
12. `conf` should be `"high"`. If you are below high, the question is badly
    framed — rewrite it rather than shipping a hedge. But do **not** inflate: if
    a question genuinely rests on a convention that varies, either pin the
    convention in the stem or drop the question and write a different one.

## Output

Write a JSON array to the output path you are given. Nothing else in the file.

```json
[
  {
    "sub": "<copied character-for-character from your brief's leaf field>",
    "q": "<the question stem>",
    "opts": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "ans": "B",
    "conf": "high",
    "exp": "<1-3 sentences. Lead with the fact that makes the key correct, then kill the most tempting distractor by name. Do not open with 'The correct answer is'.>"
  }
]
```

Exactly four options, keys A–D, one unambiguously correct.

Your final chat message is a one-line summary. The JSON goes in the file.
