# Handoff — UDC / Assistant / Group B computer questions

Written 2026-09-02. Read this before adding more clerical computer questions to
the System Manager app. `DEVLOG.md`'s 2026-09-02 (night) entry has the full
narrative; this file is the operational part.

---

## Where the source material actually is

**Not in this repo.** The clerical papers live in a sibling repo:

⚠️**CORRECTED 2026-09-06.** This section used to add "and not in
`~/Downloads/mpsc_pdfs_examination/` (that path is named in `CLAUDE.md` but does
not exist on this machine)". The second half was wrong. That corpus was never
deleted — the home directory was renamed, so the `~/Downloads/...` path resolves
to nothing while the files sit intact at
**`/home.old/hruaia/Downloads/mpsc_pdfs_examination/`** (3,715 PDFs, with
`Old_Questions/`, `Answer_Keys/`, `Syllabus/` and `index.csv`). It is a real
source of official MPSC answer keys — the Informatics Officer Paper II import of
2026-09-06 came from there. Check it before concluding a paper is unavailable.
The advice below still holds for the clerical papers specifically:

```
~/workspace/projects/personal/mpsc-question-bank/
  pdfs/Old_Questions/Direct_NG_2024-2027/   <- the clerical papers
  pdfs/Answer_Keys/                         <- official keys
```

Every PDF has a sibling `*.pdf.ocr.txt`. **Read the `.ocr.txt`, not the PDF.**

Two audit agents in the session that produced this file both concluded the UDC
questions were fabricated, purely because they searched this repo and `~/Downloads`
and found no source. The source existed the whole time. If something looks
unsourced, check the sibling repo before concluding anything.

## What is already imported

| srcKey | Sitting | Q | Answers |
|---|---|---|---|
| `UDC2025MAY-P2` | Combined UDC Examination, May 2025, Paper-II Series A, Q1–35 | 35 | derived |
| `UDCASST2024APR-P2` | Assistant Grade & UDC under MPSC, April 2024, Paper-II, Q1–35 | 35 | **official key** |

Both are verbatim transcriptions. The April 2024 set is keyed by
`pdfs/Answer_Keys/Provisional Answer Key of UDC, Assistant under MPSC..pdf`
(notification No.ASST/1/2019-MPSC, 5 April 2024) — the only official key
anywhere in this app.

## What is NOT yet imported

All four have a Basic Computer Knowledge section, all in
`pdfs/Old_Questions/Direct_NG_2024-2027/` unless noted:

1. **Combined Group B (NG) Paper-II December-2024** (Booklets A–D)
2. **Surveyor under Land Revenue & Settlement Deptt., 2026 Paper-II** — its
   computer section is labelled **70 marks**, the largest single haul available.
3. **Assistant, UDC Paper-II Series A–D** — a different sitting from the two
   already imported. Check carefully that it is not a reprint of the April 2024
   paper before importing.
4. **UDC Direct under Fisheries Deptt Paper-II** (in `Direct_2021-2022/`) —
   computer questions are scattered around Q66–75, not a contiguous block.

Check `pdfs/Answer_Keys/` for a matching key for each **before** deriving answers.
A key turns the whole batch from `derived` into authoritative.

## How to add a batch

**Never hand-edit `public/mpsc-system-manager/data/*.js`.** They carry a
`GENERATED … do not hand-edit` header and are rebuilt from the pipeline. The
existing 35 UDC questions were hand-typed into them and were one routine
pipeline run away from being silently deleted; that is now fixed, do not
reintroduce it.

1. Append records to `tools/system-manager-build/staged/udc.json`:
   ```json
   {
     "srcKey": "GROUPB2024DEC-P2", "no": 1,
     "unit": "4", "sub": "Networking",
     "q": "...", "opts": {"A": "...", "B": "...", "C": "...", "D": "..."},
     "ans": "B", "exp": "...", "conf": "high",
     "note": "optional", "alt": "C"
   }
   ```
   `unit` must be one of the seven UDC buckets `"1"`–`"7"` defined in
   `gen_syllabus.py` (Hardware / Operating Systems / MS Office / Networking /
   Web & Internet / Security & Citizenship / Cloud & Mobile).

2. Add the sitting to `UDC_META` in `tools/system-manager-build/assemble.py`:
   `srcKey -> (sitting label, official_key_exists, key citation)`. That tuple is
   what builds the provenance string, and `provLine()` in `app.js` decides the
   blue **official key** badge by testing for the word "official" *without* a
   preceding no/without/never. Get the flag wrong and a derived answer reads as
   authoritative, or vice versa.

3. If you add units or change counts, update the `UDC` paper block in
   `gen_syllabus.py`. Unit `marks` are imported-question-count × 2 and the
   paper's `marks` must equal `questions × 2` or the script refuses to write.

4. Rebuild and confirm reproducibility:
   ```
   python3 tools/system-manager-build/assemble.py
   python3 tools/system-manager-build/gen_syllabus.py
   ```
   Run each twice; the output files must be byte-identical the second time.
   Diff non-UDC records against a backup — they must all be unchanged.

5. Verify in the browser. `preview_start` the `static-apps` config, then
   `/mpsc-system-manager/`. **Restart the server to change port** — the static
   server's cache headers mean script tags keep serving the old data even in a
   fresh tab, which cost real time in the last session. A new port is a new
   origin and a clean cache.

## Traps that have already bitten

- **Series A/B/C/D are the same paper reordered.** Verified on the May-2025 set:
  identical questions, rotated order, different booklet letter. Importing four
  series as four sittings yields 4× duplicates. Import one series per sitting.
- **The OCR detaches question numbers from question bodies.** In these papers the
  numbers stack in a column (`24. 25. 26. … 33.`) and the texts follow in order
  below. A naive `^\d+\.` regex pairs them wrongly. Read the block, pair by hand,
  then verify: for the April 2024 paper, 23 consecutive answers matching the
  official key confirmed the pairing before anything was written.
- **Verify answers against the key programmatically, not by eye.** Eyeballing 35
  answers found the one Q29 mismatch, but only because the key was parsed and
  diffed in code. Do the diff in code.
- **Where an official key exists, do not set `alt`.** It renders a DISPUTED block
  reading "No official answer key exists for this paper", which contradicts the
  badge directly beneath it. `assemble.py` now guards against this; put the
  caveat in `note`.
- **Preserve the paper's typos in options** (the May-2025 paper prints "Crome").
  They are what the candidate saw. Note them rather than silently correcting.

## Open questions worth resolving

- Does an official key exist for the **May 2025** sitting? If so, 35 more answers
  become authoritative. `pdfs/Answer_Keys/` was not exhaustively searched.
- The user also asked about **"programmer" questions**. The only Programmer file
  in the bank is `pdfs/Exam_Schedules/Programmer.pdf`, which is a schedule, not a
  question paper. Either a paper needs sourcing, or the ask meant the
  programming-adjacent questions inside these clerical papers. Worth asking.
- Nobody has audited the other generated files for hand-edits living in the same
  silent-deletion trap. Two were found by accident (the UDC paper, and the
  Syllabus tab's "Recommended reading" panel). A deliberate sweep would be cheap.
