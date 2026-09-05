# Extraction brief — ILM November 2023, CSE Paper III

You are transcribing **one rendered page** of a scanned MPSC question paper into
JSON. You are not solving anything and not judging anything. Transcribe.

## Your inputs and output

- Read exactly one image: the page PNG named in your task. It is 300 dpi, A4.
- Write exactly one file: the output path named in your task.
- **Do not read `questions.js`, `concepts.js` or any other bank file.** They are
  megabytes wide and reading one has already cost this project ~400k tokens.
  Nothing in them is relevant to transcribing a page.

## Write incrementally — this is not optional

Rewrite your whole output file after **every single question** you transcribe.
Do not hold the page in memory and write once at the end. Four agents were lost
mid-batch in an earlier pass because each was holding its work and none had
written a file; everything they had done was unrecoverable. A partial file is
useful, an unwritten one is not.

Start by writing `{"page": N, "questions": []}` before you transcribe anything,
so the file exists from the first moment.

## Output shape

```json
{
  "page": 2,
  "questions": [
    {
      "no": 8,
      "q": "Purpose of feasibility study in software engineering.",
      "opts": {
        "A": "To determine the financial viability of a software product",
        "B": "To assess the market potential of a software product",
        "C": "To evaluate the technical complexity of software development",
        "D": "To analyze the performance and scalability of existing software"
      },
      "flags": []
    }
  ]
}
```

`no` is the number **printed on the page**. Never renumber, never infer a number
you cannot see. Options map printed `(a)(b)(c)(d)` to keys `A B C D` in printed
order — if a paper prints five options, use `E` too.

## Rules that matter

1. **Transcribe what is printed, not what is correct.** If the paper prints a
   formula that is wrong, a stem that is ungrammatical, or two identical
   options, that is the data. Reconstructing "what they obviously meant" is how
   this bank previously acquired a confident answer to a question the paper
   never asked.
2. **Never reorder options.** An answer key is a letter. One reordered question
   silently injects a wrong answer.
3. **This page has bleed-through** from the reverse side — fainter, often
   mirrored text. Ignore it completely. If you cannot tell whether a line is
   real text or bleed-through, flag it (below) rather than guessing.
4. **Preserve mathematical notation as printed.** `A→B`, `A⊆B`, `n!/(r!(n−r)!)`,
   overbars, primes. If a glyph is genuinely unreadable at this resolution, put
   `?` where it is and flag the question. Do not silently normalise `A'` to `A`
   — the apostrophe is the content.
5. **A question may span a page break.** If the page begins mid-question (no
   number visible above the options) or ends with a stem whose options are not
   on this page, transcribe what you can see and flag it `partial_top` or
   `partial_bottom`. Do not invent the missing half. Do not skip it either.

## Flags

Add strings to `flags` when any of these apply. An empty list is the normal case.

- `partial_top` / `partial_bottom` — the question is cut by a page boundary
- `unreadable_glyph` — something is illegible; you left a `?`
- `duplicate_options` — two options are printed identically (this is sometimes
  genuinely what the paper did; transcribe both, just flag it)
- `has_figure` — the question depends on a diagram, table or circuit you cannot
  express in text. Transcribe the stem and options anyway and describe the
  figure in a `figure` field.
- `option_count` — there are not exactly four options

## When you finish

Your final message should be one line: the page number, how many questions you
transcribed, their number range, and any flags raised. Nothing else — your
output file is the deliverable, not your message.
