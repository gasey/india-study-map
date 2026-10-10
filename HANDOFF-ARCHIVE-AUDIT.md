# MPSC archive audit and continuation plan

Updated 10 October 2026. This handoff records the source-page audit, English/Arithmetic imports, answer-key coverage, and current scan-review backlog.

## User request

Audit these official MPSC archives for unknown or inaccessible links, continue
building the UDC/LDC/Group B English-only and Maths/Arithmetic practice pools,
include Gazetted (G) exams where possible, and leave a clear continuation plan.

## Audit completed

All eight archive pages below returned HTTP 200 when fetched directly. The web
preview tool showed internal errors for `2019`, `old-question-2023-2024`, and
`old-question-ng`, but direct page fetches succeeded; these are preview-tool
failures, not page outages.

The title scan found 214 unique PDF attachment links explicitly labelled
General English or Arithmetic across the eight pages. Direct PDF checks found
212 links returning HTTP 200 and two returning HTTP 404:

- [AE (Civil) CoTerminus under PWD, 2015 — General English](https://mpsc.mizoram.gov.in/uploads/attachments/a7a3bbdaf032027388373457b9bf095d/ae-civil-coterminus-under-pwd-2015-general-english.pdf)
- [General English Paper-I](https://mpsc.mizoram.gov.in/uploads/attachments/a1ab98dab14448ef57e2e3559ab81ec1/general-english-paper-i.pdf) — generic page label; identify the exam from its table row / surrounding links before replacing it with a similar PDF. The same URL may be shared by more than one archive entry.

All archive HTML pages were identifiable. The rest of the title-matched PDF
links returned HTTP 200 with PDF content types. Exact URL duplicates were
counted once. A page-title match only establishes the listed subject; check the
PDF cover before importing and record any mismatch, duplicate booklet, or
specialist-subject paper.

## Archive inventory and status

Counts below are unique attachment URLs with the displayed subject explicitly
labelled General English or Arithmetic; they are audit counts, not counts of
new papers. Cross-page duplicates exist. `2019–20 G` is already covered by the
2019–2020 import described in [HANDOFF-GROUP-B.md](HANDOFF-GROUP-B.md).

| Archive | General English links | Arithmetic links | Progress |
| --- | ---: | ---: | --- |
| [2014–2018 G](https://mpsc.mizoram.gov.in/page/Old%20Question%20Paper-17-08-21-17-08-22) | 71 | 1 | Imported eligible new English/Arithmetic links; 80 archive URLs in the overall 7-page G scan were already identical to sources in the bank. One English link returns 404. |
| [2019–2020 G](https://mpsc.mizoram.gov.in/page/2019) | 40 | 0 | Imported: 111 archive papers, including all listed General English and clerical/combined papers. Check source catalog before adding any overlap. |
| [2020–2021 G](https://mpsc.mizoram.gov.in/page/2020-2021) | 8 | 0 | Imported eligible new General English PDFs; optional English literature and technical subjects were excluded. |
| [2021–2022 G](https://mpsc.mizoram.gov.in/page/old-question-2021-2022) | 8 | 0 | Existing ASCE and Jr. Grade MAH/Veterinary Officer English sources were reused; additional eligible new English PDFs imported. |
| [2022–2023 G](https://mpsc.mizoram.gov.in/page/old-question-2022-2023) | 7 | 0 | Imported eligible new English links. Mathematics in MCS Main remains excluded as optional specialist subject, not arithmetic. |
| [2023–2025 G](https://mpsc.mizoram.gov.in/page/old-question-2023-2024) | 33 | 0 | Imported eligible new General English PDFs; existing 40 GS/Knowledge/Math/Arithmetic PDFs were reused. |
| [2025–2027 G](https://mpsc.mizoram.gov.in/page/old-question-g-2025-2027) | 26 | 2 | Imported eligible new English PDFs and the distinct JAO 2026 Series B GK/Arithmetic/Reasoning booklet. Its 15 arithmetic questions are separated from GK and Reasoning. |
| [2024–2027 NG](https://mpsc.mizoram.gov.in/page/old-question-ng) | 19 | 1 | Imported the distinct Assistant LESO April 2026 General English paper (66 MCQs, official final key); AAO 2024 Arithmetic is an exact duplicate. AAO/SI alternate English series B–D are duplicate question sets. |

## Continuation steps

### Solving progress

The English archive import is complete, but its questions are not fully
source-reviewed or solved. A first scan-verified batch is complete for the
August 2026 Assistant Controller of Mines General English paper:

- Part B MCQs 1–10, 16–25, 27–28, 30–43, 45–63, and 65–66 have exact
  stems/options checked against printed pages 3–12, with derived answers and
  explanations. These 57 are practice-ready; the paper remains excluded from
  full Exam mode because other MCQs and its separate written section remain.
- MCQs 11–15 remain held. The extraction cuts off the end of each sentence;
  recover the complete text and options from printed page 5 before scoring.
- Q26 and Q29 each have multiple grammatically acceptable rewrites; Q44 has
  two potentially defensible meanings; Q64 has formal “whom” and widely
  accepted “who” object usage. Keep all four held unless an official key or
  stronger source evidence resolves the choice.
- Part A contains written prompts with numbering that overlaps Part B. Keep
  the written section distinct; do not merge its numbering into the MCQ set.
- Repairs: `tools/udc-ldc-build/group-b-text-repairs.json`, keyed by the archive
  source slug. Generation logic and the exam marking metadata are in
  `tools/udc-ldc-build/group_b_sources.py`.

Current bank: 352 papers / 22,676 records; 3,829 practice-ready (1,684
official-key-backed). The latest build report is authoritative. The English
archive backlog still needs page-by-page transcription and worked solutions;
legacy inferred answers are candidates only and must not be scored without
reasoning and scan checks.

1. Read the module contract in [HANDOFF-SUBJECT-PRACTICE.md](HANDOFF-SUBJECT-PRACTICE.md)
   and current import inventory in [HANDOFF-GROUP-B.md](HANDOFF-GROUP-B.md).
2. Compare each candidate's exam, year, subject and canonical source against
   `src/data/banks/mpsc-group-b-library.json` and the cached PDFs under
   `../mpsc-question-bank/pdfs/Old_Questions/`. Match by source identity or PDF
   content/hash and cover, not filename alone. Reuse registered sources; do not
   create duplicate papers for reused MPSC PDF URLs.
3. The eligible new G archive import is complete: 109 new English sources and
   one distinct JAO booklet were added. The 2019–2020 G page was already
   included. Continue with content quality review below; do not re-add exact
   duplicates. A paper called Mathematics is not automatically Arithmetic.
4. For JAO GK/Arithmetic/Reasoning papers, classify question by question;
   preserve GK and Reasoning in their proper sections and route only verified
   arithmetic questions to Maths/Arithmetic. Treat alternate series as separate
   only if their question sets differ; otherwise record the duplicate booklet.
5. Keep all newly extracted items unscored and source-review-gated until each
   stem, options, answer and official key have been verified. Do not guess
   answers, promote uncertain source text into Exam mode, or change stable IDs.
6. Record per-paper totals, extraction gaps, duplicate decisions, and broken or
   mislabelled links in the progress section below. Then update the relevant
   `HANDOFF-*.md` files in both repositories and rebuild the generated bank.

## Progress

- [x] Import NG Assistant LESO April 2026 General English, its 66-item
      extraction and the official final key. Three written prompts are retained
      separately. The key was visually checked from the official key PDF page 1.

- [x] Fetch all eight supplied archive pages and count relevant unique PDF URLs.
- [x] Check all 214 title-matched English/Arithmetic attachment URLs; 212
      responded with PDF/HTTP 200 and the two 404s are listed above.
- [x] Confirm 2019–2020 G and the 2021 ASCE / Veterinary English PDFs have
      prior import notes; identify 2023–2025 G GS/GK/Math/Arithmetic import.
- [x] Match Gazetted archive candidates against the bank and import distinct
      eligible sources: 109 English papers and the distinct JAO 2026 Series B
      GK/Arithmetic/Reasoning booklet (15 arithmetic questions).
- [x] Preserve all new official PDFs and register their source URLs; rebuild
      the generated bank (351 papers, 22,607 question records).
- [x] Re-run the production build after the JAO solved-question updates;
      TypeScript and Vite both passed.
- [x] `git diff --check` passed after the source and generator edits.
- [x] Source-check all JAO Series B questions against PDF pages 2–12. Restored
      the merged Q1 and missing Q2–Q8 and Q43; corrected OCR-damaged fractions,
      options and a number table. 95 questions are practice-ready: 14 manually
      solved, 81 matched to Series A by exact stem/options and source-checked.
      Matched answers are independent solutions with medium confidence, not an
      official key. Five exceptions remain held: Q7 has no exact choice; Q40's
      figure answer is unverified; Q41/Q44 have image options; Q43 wording is
      ambiguous. At that build the bank had 351 papers / 22,607 records and 3,706 ready
      questions (1,618 official-key-backed); see the latest snapshot below.
- [x] Scan source questions/options Q46–Q100. Their exact Series A matches have
      worked guides, with medium confidence and no claim of official-key status.
- [ ] Review English punctuation, typography, blanks, shared directions, OCR
      and solving guides across the 109 imported English PDFs before granting
      further questions practice-ready status.
- [x] Reconcile the NG English/Arithmetic candidates: Assistant LESO English
      is distinct and imported with its final key; 4 alternate booklet URLs were
      byte-distinct but their question sets match existing series, and the AAO
      arithmetic PDF is a byte-identical duplicate.
- [x] Recheck the two inaccessible PDFs. The CoTerminus 2015 AE/Civil English
      URL still returns 404. The generic English Paper-I URL also returns 404 and
      is reused under Assistant Librarian 2013 and Inspector of Legal Metrology
      2018; the 2017 MHS row also contains this stray link, alongside its valid
      MHS-specific Paper-I URL. No matching cached source was found for the two
      affected exam papers, so leave both unavailable.
- [x] Production build passed (`npm run build`), commit `8a6cf13` was pushed to
      `main`, and Vercel reports production deployment
      `dpl_FdihmjPp65YYpx6m3NDt7HTTXzEL` as READY at `https://map.hawayu.in`.
- [ ] Visual browser verification remains unavailable: the in-app browser
      denied access to the active map tab and forbids retrying through another
      browser or CDP route. Do not work around that restriction.

## Notes for the next model

### Transcription, solving and quality-review rules

- Preserve printed wording, capitalization, punctuation, bold/italic emphasis,
  underlining, section directions, passage context, subpart labels and visible
  blank space. Keep shared instructions attached to every affected prompt.
- Do not silently repair a source typo or awkward sentence. Transcribe what is
  printed; if the app needs a normalized rendering, retain the literal source
  text and document the display correction in `sourceNote` with a scan link.
- For fill-in-the-blank items, keep the blank empty in the stem. Store a verified
  answer separately. Preserve the printed number/length of blanks when visible;
  use descriptive Written English for free-response blanks and MCQ only when
  the source actually prints options.
- Never invent missing choices or wording to make a question look complete.
  Keep extraction gaps, broken numbering, OCR uncertainty and uncertain
  punctuation review-gated; distinguish parser gaps from confirmed omissions.
- A solving guide for an MCQ should explain the rule or method, show essential
  steps, and connect the result to the printed choice. For English, explain the
  relevant grammar, punctuation, usage or context. For Arithmetic, show setup,
  calculation and units. For written prompts, provide a rubric/outline rather
  than a fabricated one-answer key.
- Keep extraction unscored/source-review-gated until the stem/options are
  checked against the scan and the answer has a worked derivation or key.
  Where no official key exists, a verified independent derivation may be
  practice-ready when clearly labeled derived; never call it an official key.
  A topic label or copied explanation alone does not verify an answer.

### Import snapshot and exceptions

- The Gazetted addition consists of 109 new English source PDFs and one JAO 2026
  Series B booklet with a distinct question set. NG added Assistant LESO General
  English as the only distinct English source in the audited page. The generated
  bank now has 352 papers / 22,676 records; 3,829 are practice-ready
  (1,684 official-key-backed).
- The JAO Series B set has 60 GK, 17 Reasoning and 15 Arithmetic questions.
  After page 2–12 scan review, 14 were manually solved and 82 exact Series A
  stem/options matches supplied independent solutions; Q40 remains held among
  those matches. Ninety-five questions are practice-ready; five exceptions
  remain held. The Series A answers are derived, medium-confidence answers,
  not an official key.
- ACF General English 2009 had no recoverable parser prompts; eight written
  prompts were manually transcribed in
  `tools/udc-ldc-build/language-written-repairs.json`, preserving source
  wording and visible blanks. Verify layout against its PDF before changing
  the text.
- Thirty new PDFs use OCR extraction. Forty-three PDFs have parser question
  number gaps (172 missing intermediate integer markers in aggregate); these
  are review leads, not confirmed missing printed questions.
- The JAO Series B solving/transcription repair is durable in
  `tools/udc-ldc-build/jao-2026-series-b-reviewed.json`; generator logic lives
  in `group_b_sources.py`. It preserves the Q7 no-correct-option exception and
  leaves visual/ambiguous items held. Q46–Q100 are source-checked and matched
  to Series A stems/options; copied independent solutions remain medium
  confidence and are not labeled as official key answers.
- The two HTTP 404 sources above remain unavailable, with their affected exam rows
  identified. NG English/Arithmetic candidates were audited and reconciled;
  review them separately if that scope is requested.

The counts above are from live archive pages as checked on 10 October 2026 and
may change when MPSC updates the pages. The 214 count is a subject-title audit,
not a count of outstanding additions. Exact page/source records and the latest
application state are in the sibling import handoffs. The in-app preview
browser previously declined localhost access; that attempt must not be retried
through a workaround. Use the approved local verification route if one becomes
available.
