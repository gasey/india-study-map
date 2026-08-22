# statistical-handbook — Mizoram Statistical Handbook 2024 bank generator

Generates `src/data/banks/mizoram-statistical-handbook-2024.ts` (176 questions:
169 MCQ + 7 descriptive) from the **Statistical Handbook Mizoram 2024**,
Directorate of Economics & Statistics, Government of Mizoram — the 25th in the
series, 279 pp., 48 chapters.

**The `.ts` output is GENERATED. Edit the `q_*.py` batches here, not the bank
file.** Re-running reproduces the output deterministically.

## Rebuild

```bash
cd tools/statistical-handbook
python3 build_bank.py ../../src/data/banks/mizoram-statistical-handbook-2024.ts
```

`build_bank.py` refuses to emit unless every question passes: unique id,
4 distinct options, `answerIndex` in range, non-empty explanation, no duplicate
question text, and a topic that maps to a known subject.

## How the source was read

`pdftotext -layout` handles the numeric tables well, but the handbook is
bilingual (English + Hindi in the same cells) and the extractor interleaves the
Devanagari into the English lines. The pipeline therefore strips Devanagari
per-line before parsing.

Two sections defeat text extraction entirely — the dense bordered tables of
**"Mizoram at a Glance" (pp. v–viii)** and **"State Information" (pp. ix–xiv)**.
Those were read as page images instead. Every question is written only from a
figure verified in one of those two views.

An earlier attempt to have subagents transcribe page-range slices was abandoned:
it is expensive, and the point of failure (a silently mis-transcribed number)
is exactly the kind of error this repo has been bitten by before. Reading the
tables directly is cheaper and auditable.

## Source inconsistencies the questions work around

The handbook is not internally consistent. These are real defects in the printed
source, not extraction artefacts, and questions either avoid them or name the
table explicitly:

| Conflict | Handling |
|---|---|
| Mizoram Census 2011 population: **10,97,206** (state chapters) vs **10,91,014** (Table 47.1, All-India); literacy 91.33% vs 91.58% | Questions name the table; the explanation flags the discrepancy |
| Forest cover quoted against **both** ISFR 2021 (17,820.03 sq km, 84.53%) and ISFR 2023 (17,990.46 sq km, 85.34%) | Every forest question states which report |
| Annual normal rainfall **2,090.33 mm** (Table 2.1) vs **2,213.51 mm** (Table 2.2) | Only Table 2.1 used, and named |
| Table 20.3 per-district "% electrified" doesn't reconcile with its own counts (Kolasib 36/36 shown as 99.21%) | Only village counts and the state total (98.19%) used |
| Table 13.6 files **Dampa Tiger Reserve** under the "National Park" heading | The National Parks question answers "2 (Murlen, Phawngpui)" and notes Dampa is a tiger reserve |
| Table 24.10 (drop-out rate) is entirely NA; Table 24.11 (GER) prints ratios (`1:14`), not percentages | Neither table used |
| TOC lists Table 31.1 as the **2018** Assembly election; the table itself is **2023** | Questions use 2023, per the table |

## Flagging source contradictions

`q()` in `qlib.py` takes an optional `source_note=` kwarg. Use it only when
the HANDBOOK ITSELF contradicts this exact figure elsewhere — two tables
in the same publication disagree — not for ordinary distractor context.
It renders as a distinct "⚠ Source note" callout on `/pyq` and shows up in
the admin console's Questions tab (checkbox: "Only ⚠ contradictions").
This is `sourceNote` on the schema, deliberately separate from the
pre-existing `disputeNote` (which means "we think a published *exam key*
is wrong" — a concept that doesn't apply to this bank, since it has no
exam key at all).

Currently set on 6 questions — see the table above for which contradiction
each one documents.

## Tagging

Tags drive the "View on map" cross-link, which matches question tags against
chapter tags. A tag carried by *every* question is worse than no tag — `mizoram`
belongs only to three **polity** chapters (judiciary, states-reorganisation,
sixth-schedule), so tagging all 176 questions with it made a forest question
link to "Judiciary, Writs & PIL".

`build_bank.py` therefore normalises tags: `mizoram` is kept only on
`polity_admin` questions, and content-matched tags from the map's real
vocabulary (`tlawng`, `kaladan`, `karnaphuli`, `mizo-hills`, `purvanchal`,
`tropic-of-cancer`, `northeast`, …) are attached by scanning the question text.
If you add chapters with new tags, extend `TEXT_TAGS`.

## answerSource

`derived` throughout. The underlying *statistics* are official; the question
framing is authored. Nothing here comes from a published MPSC paper with an
official key, so nothing should carry `official`.
