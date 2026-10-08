# Group B general-paper supplement

Run `python3 tools/udc-ldc-build/build_group_b.py` from the site repository.
Generated output: `src/data/banks/mpsc-group-b-general.ts` and
`mpsc-group-b-library.json`. Never hand-edit either output.

## Progress — 8 October 2026

49 general papers, 3,437 items: 3,330 MCQs and 107 written prompts.
1,667 questions are ready for practice, including 1,555 official answers and
112 independently derived answers. 1,737 items still need source review.
Extracted counts are coverage, not a
claim that the text is correct. The paper library shows these totals and
per-paper counts separately from key candidates awaiting review.

Additional scan repairs: AAO English Q2, AAO Arithmetic Q71 and SI Police
Paper-II Q53–54 were checked against the printed pages and keyed from the
final official source. Five Inspector of Statistics Paper-II math questions
(Q54, Q55, Q67, Q71, Q91) now have readable text/options checked against the
scan. Four have worked, derived answers; Q55 remains unscored because its
printed calculation is ambiguous. AAO 2025 Paper-II Q60 also has a scan-checked
transcription and worked probability solution. Partial repairs are source-hash
guarded and do not mark the rest of an OCR paper as reviewed.

The official MPSC final keys for the March 2025 Stenographer Grade-III General
Knowledge and General English papers are now attached. All 100 General
Knowledge questions were transcribed from printed pages 1–8, including OCR
gaps and merged rows, and matched against the final key. The paper is now
eligible for Exam mode. English MCQs B1–B75 were also checked against pages
2–9 and matched to the final key. Its written Section A prompts remain to be
recovered, so the full English paper stays out of Exam mode. Other OCR items
stay gated until their printed question numbers, wording, and options are checked.

Sub-Inspector of Excise Paper-I (April 2025) Section B Q1–30 is scan-checked,
keyed to the July final answer key, and includes brief grammar/vocabulary
explanations. Conventional Section A Q1–3 is also recovered from pages 1–2:
the précis and letter include response guidance, and the Chaplin passage task
includes all subquestions, choices, and an answer guide. Written responses
remain unscored; the MCQ section stays out of full-paper Exam mode because the
paper also has 40 conventional marks.

AAO/AAAO 2024 General English Q1–100 is transcribed and checked against the
final key. Q2, Q23, Q37 and Q77 are held out because their final-key cells
conflict with the printed grammar/meaning; Q33 has multiple defensible
comparative forms and is also unscored. The paper remains out of Exam mode
until those five answer conflicts are clarified.

AAO/AAAO 2024 Arithmetic Q1–41 is now scan-checked and keyed with worked
calculations. Q7’s printed endpoint gives 27 terms (D); the legacy inferred
candidate 26 (C) was rejected after checking the scan and arithmetic. Q30 is
held unscored because its printed wall dimensions are smaller than a brick; the
official final key compensates the item. Q37’s scan omits the requested variable;
the readable stem marks “[of a]” as an editorial completion supported by its
polynomial and answer choices.

The December 2024 combined exam has all 75 Paper I and 100 Paper II MCQs.
Paper II Q84–100 were recovered from the complete Series B with matching
key choices; six figure questions now have source images. Q64 is compensated.
The November 2024 technical sitting contributes its general papers only;
subject-specific technical subjects and gazetted exams are excluded.

## Durable inputs

- `group-b-final-key.json`: December 2024 combined exam final key, Series A.
- `group-b-recovered.json`: the 17 recovered Paper II questions.
- `verified-general-keys.json`: source-checked keys, multi-answer cells,
  compensated items and per-question corrigendum links. It includes AAO 2024,
  JAO, Circle Officer, SI Statistics, Research Investigator, SI Police and
  Radiotherapy and 2025 Stenographer Grade-III keys. A filename saying provisional can contain a final key;
  status must come from the printed notification.
- `group-b-text-repairs.json`: all 100 AAO 2024 GK question numbers, stems,
  and option sets checked against printed pages 1–11. OCR omissions, option
  bleed, and text corruption are repaired. Q73 uses the 15 October 2024
  corrigendum (B), rather than the superseded final key (D). Q13's final key
  accepts both B and D; it remains unscored, so this paper is excluded from
  single-answer Exam mode. Preserve printed spellings.
- `extracted/`: cached geometric extraction, guarded by source PDF SHA256.
  Text repairs apply after extraction and never rewrite the OCR cache.

Repair guards reject changed PDFs, missing review evidence, incomplete final
numbering, invalid option sets, and answer overrides. Repairs contain text
only; scoring answers always come from a matched official key.

## Verification

`python3 -m unittest discover -s tools/udc-ldc-build -p 'test_group_b_repairs.py'`
checks full and partial recovery plus mutation failures. `npm run build` checks TypeScript and
production bundling. `browser-check.py` uses a local Chrome CDP session at
port 9222 and the Vite `/udc-ldc` route to check mobile/desktop browsing,
progress totals, figures, key comparison, AAO recovery and corrigendum,
exam exclusion and Statistics scoring.

## Next work

Recover the remaining incomplete AAO English/arithmetic scans and other scanned general
papers. Match keys for the complete native papers that currently lack them.
Then continue the wider source-review queue. Keep question recovery, source
review and ready-to-score counts separate.
