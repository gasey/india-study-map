# Brief — transcribe MCQs from a `pdftotext -layout` dump

Same job and same rules as `EXTRACT_P3_BRIEF.md`, but your input is the paper's
extracted **text**, not a rendered image. Read that brief's rules; this file
covers only what differs.

## Inputs and output

- The text dump: named in your task. It is the whole paper — find your assigned
  question range inside it.
- Your output file: named in your task.

**Do not read `questions.js` or `concepts.js`.**

## Write incrementally

Rewrite the whole output file after **every question**. Write
`{"range": "...", "questions": []}` first so the file exists immediately.

## Output shape

```json
{
  "range": "1-20",
  "questions": [
    { "no": 9,
      "q": "__________ clause is an additional filter that is applied to the result.",
      "opts": {"A": "Select", "B": "Group-by", "C": "Having", "D": "Order by"},
      "flags": [] }
  ]
}
```

## What the layout does to you

`-layout` preserves the printed two-column option arrangement, so a line often
holds **two** options:

```
     (a) Select                                          (b) Group-by
     (c) Having                                          (d) Order by
```

Read them **left to right, then down** — that is (a), (b), (c), (d) → keys
A, B, C, D. Getting this wrong silently permutes the options, and since an
answer is stored as a letter, a permuted question teaches a wrong answer. This
is the single most likely way to corrupt this batch.

**An option can span several lines.** Code and SQL frequently wrap:

```
     (c) DELETE FROM instructor
          WHERE dept_name IN (SELECT dept name
          FROM department
          WHERE building = ’ MilleniumCenter’);
```

That is all one option. Join continuation lines with a single space unless the
content is code, in which case join with `\n` so it stays readable. Do not drop
the continuation.

**A stem can span several lines too**, and may carry a table or a short program.
Keep it as one `q` string, using `\n` where the line break is meaningful.

## Preserve what is printed

The dump contains the paper's own typography — curly quotes `’ ‘`, spacing
oddities like `dept name` where the paper means `dept_name`, and real
misprints. Transcribe them as they are and flag the question rather than
tidying. The rule this bank runs on is that the paper is the data.

Normalise only one thing: a run of underscores marking a blank stays a run of
underscores.

## Flags

`unreadable_glyph`, `duplicate_options`, `has_figure`, `option_count`,
`partial` — same meanings as the image brief. Add `layout_ambiguous` when the
column arrangement made the option order genuinely unclear; say which question
in your final message so a human can check that one against the page image.

## Final message

One line: your range, how many questions, their numbers, and any flags.
