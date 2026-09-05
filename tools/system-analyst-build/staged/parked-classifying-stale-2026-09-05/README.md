# Parked: 684 study-mode labels for questions that are not in the bank

Moved out of `staged/classifying/` on 2026-09-05. 36 batches whose every row
referenced a question id that no longer exists, plus their `.todo.json`
siblings, plus the dead rows stripped from three mixed TECH3 batches.

## Why they were moved

`classify.py --merge` exits on any problem — the same validate-before-write
guard `generate.py` has — and these batches produced **684** of them, all
`id '...' is not in the bank`. So **no study-mode label had been written since
31 August**, and the new Technical Paper II labels could not land either.

The dead ids come from the same place as the parked question batches next door
(`parked-legacy-syllabus-2026-09-04/`):

- `GEN-TECH1-U3-*` — the TECH1 Unit 3 .NET authoring pass that was never merged
  into `questions.js`, so its questions never existed to be labelled.
- `TECH1_OLD-*`, and the old TECH2 e-governance ids — questions the 30 July 2026
  syllabus migration removed or re-papered.

`modes.js` itself had been carrying them: of its 1,111 labels, **684 pointed at
ids not in the bank**, so 62% of the file was dead weight. `app.js` degrades
gracefully — `modeOf()` returns null and `MODE_PACE[...] || 1` falls back — so
nothing was visibly broken, which is exactly why it went unnoticed.

## This was proven safe before anything moved

Comparing the post-park label set against the currently-live *valid* set:

    live labels that are valid  : 427
    labels after parking stale  : 521
    WOULD LOSE A LABEL          : 0
    newly labelled              : 94   (all TECH2)

Zero labels lost. `modes.js` now holds **521 labels and 0 dead ids**.

## The three mixed batches

`TECH3-UA-01`, `TECH3-UB-01` and `TECH3-UD-01` each held a mix of live and dead
rows, so they stayed in `staged/classifying/` and only their dead rows were
removed (21→12, 18→12, 17→12). Their diffs are in the 2026-09-05 commit.

Separately, `TECH1-U5-01.done.json` kept only **4** of its 30 rows. The other 26
labelled the DBMS questions `migrate_tech2_2026.py` moved into TECH2 Unit 3, and
sorted earlier than the new `TECH2-U3-02` batch so they won the id conflict. The
4 that remain are the data-warehousing questions that deliberately stayed behind
in `TECH1_LEGACY`.

## Recovering them later

Only worth doing for the `GEN-TECH1-U3-*` rows, and only **after** the parked
questions next door are actually merged into the bank. The order matters: land
the questions first, then restore these labels, then re-run
`classify.py --merge` and check the count rises by the number restored.

Everything else here labels questions that no longer exist in any paper. Those
are not worth recovering — re-export from the current bank instead.
