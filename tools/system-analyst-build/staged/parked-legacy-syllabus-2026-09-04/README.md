# Parked: 254 authored questions orphaned by the 2026 syllabus migration

Moved out of `staged/generating/` on 2026-09-04. **Nothing here is lost** — these
are the complete `.todo.json`/`.done.json` pairs from the authoring passes of
2026-08-30 (TECH2 e-governance) and the TECH1 Unit 3 .NET pass, 254 authored
questions in total.

## Why they were moved

They were never in the app. `window.QUESTIONS` held **zero** questions with a
`GEN-` `srcKey`, and `generate.py --merge` rejected all 254 rows:

    254 PROBLEM(S) — questions.js NOT written:
      - TECH1-U3-1#1: sub 'Object-Oriented Programming (in .NET)' is not a leaf of TECH1 U3
      - TECH2-U15-1#1: sub '...' is not a leaf of TECH2 U15

The cause is the 2026 syllabus migration, not a bug in the authoring. The ICT
notification of 30 July 2026 (File No. A-12038/68/2025-ICT) replaced both
technical papers' units and subtopics **wholesale**:

- Old TECH2 was E-Governance, 19 units. New TECH2 is Object Oriented Programming
  / Web Technologies / Database Management Systems / Cloud Computing, 4 units.
  Not one topic survives, so `TECH2-U5` .. `TECH2-U19` name units that no longer
  exist and every `sub` in them is a dead leaf.
- TECH1 Unit 3's .NET leaves (`Web Services`, `LINQ and Entity Framework`,
  `Design Pattern and UML`, `Threading`, ...) were likewise replaced.

`migrate_tech2_2026.py` kept the old syllabus as a first-class `TECH2_LEGACY`
(19 units, `legacy: true`, `counts_for_merit: false`), so this content is still
*revisable material* — it is only unreachable, not irrelevant.

The merge guard behaved correctly: it refused to write anything rather than
dropping the rejected rows behind a success line. That guard exists because it
once did the opposite — see the comment block in `generate.py:do_merge`.

## Why they were not simply re-merged

`generate.py` derives the target paper from the filename via

    re.match(r"(TECH\d|GE|GS)-U([0-9A-D]+)-(\d+)", name)

which cannot express `TECH2_LEGACY` or `TECH1_LEGACY` at all. Re-pointing these
254 questions at the legacy papers therefore needs a pipeline change, not a
rename — and it is a different job from authoring the new syllabus. Left as an
open item in `DEVLOG.md`.

## Recovering them later

The `.done.json` rows are unchanged and still carry their original `sub`
strings, which **do** match leaves of `TECH2_LEGACY` / `TECH1_LEGACY` in
`syllabus.js`. So a recovery pass needs to:

1. Teach the filename regex (or an explicit field in the batch file) to name a
   `_LEGACY` paper.
2. Re-run `--merge`, which will validate the subs against the legacy paper's
   leaves and should accept them.
3. Check the count lands at 254, not fewer — a partial accept is the failure
   mode worth watching for.

Do **not** delete this directory until that has happened and the app reports
254 `GEN-` questions.
