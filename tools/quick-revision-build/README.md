# quick-revision-build

Generates `public/quick-practice/quick-revision/data.js` — the question data behind
the **Quick Revision** page (four MPSC papers from the August 2026 sitting).

```
python3 tools/quick-revision-build/build.py
```

`data.js` is generated. Edit the inputs here and re-run; don't hand-edit the output.

## Inputs

```
staged/    transcription of the four marked booklets, one JSON per paper
checks/    independent factual review of the marked answers
```

### staged/

Transcribed from the marked PDFs in `~/Downloads/`. Each question's `answer` is the
option the booklet highlighted in **cyan** — that is the only answer the source
actually asserts, and it is what the page shows.

Two fields can disagree with it, and they mean different things:

- `keyAnswer` — the official MPSC key differed, per a **handwritten margin note on
  the booklet itself**. Only Q59 of the Staff Nurse GK paper has one.
- `note` — a real property of the source: a margin note, a printing defect, or the
  absence of any mark. Not an opinion about whether the mark is right.

Answers were not read off the rendered page alone. Each extraction pass located the
highlight annotations (or detected them by pixel colour at 150 dpi), read the option
letter under each rectangle, and reconciled that against a visual read of every page.
The two agreed on all 320 questions. Counts found: 60 / 99 / 60 / 100 cyan highlights
and exactly one pink one.

### checks/

A separate pass that asks only: *is the marked answer actually correct?* It never
edits `answer`. Verdicts:

| verdict | shown as |
| --- | --- |
| `wrong` | "Looks wrong — likely (x)" + explanation |
| `disputable` **with** an `alt` | "Two defensible answers" |
| `disputable` **without** an `alt` | "Worth knowing" — context only, no caution |
| `unverified` | nothing |
| `void` | nothing; needs a `voidReason` |

`unverified` is a reviewer saying it could not check the claim — several Mizo
customary-law questions landed here. That is not evidence the mark is wrong, so it
must not render as a warning. `void` is a finding later shown to be mistaken; it
stays in the file as a record of what was checked.

## Why the build asserts so much

`build.py` fails rather than emitting a questionable record. It refuses to build if:

- question numbering has a gap or a duplicate
- a review names a question that doesn't exist
- a review's `marked` letter disagrees with the transcription — this actually
  happened: the first pass over the SAS-I English paper misread Q48's highlight and
  argued for the option that was already marked
- a dispute's `alt` equals the marked answer, or a dispute has no explanation
- an underlined word can't be found in its own question stem

The bank this project feeds has had one silent-data-loss and one silent-corruption
incident (see DEVLOG 2026-08-04). A loud failure is cheaper than a wrong answer.

## Two things deliberately not shown

- **Part-A of both English papers** is descriptive (essay, letter, précis,
  comprehension) with no marked answer, so it can't drive a reveal-or-score drill.
  It is preserved in the staged JSON under `partA` and disclosed on the paper card
  rather than dropped.
- **Extractor content opinions.** The extraction pass sometimes editorialised about
  whether a mark looked right. That job belongs to `checks/`, which was done
  independently and in one case overruled it — leaving both in would print a green
  "Answer (d)" above a note arguing for (a). Dropped by explicit id in
  `DROPPED_NOTES`, with a reason.
