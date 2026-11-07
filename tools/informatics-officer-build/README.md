# Informatics Officer module

Authority: [ICT Department publication](https://dict.mizoram.gov.in/post/syllabus-for-direct-recruitment-to-the-post-of-informatics-officer-under-ict-department), notification A-12038/68/2025-ICT dated 30 July 2026.

The module lives in `public/mpsc-informatics-officer/` and opens through
`/embed/informatics-officer`. Shared assets load first, `module.js` maps the
corpus to the notified syllabus, and `lessons.js` adds introductory study notes.
The shared System Analyst runtime accepts optional `TRAINER_CONFIG`; its default
configuration still serves the existing System Analyst page.

From the repository root:

```sh
python3 tools/informatics-officer-build/import_keys.py
node tools/informatics-officer-build/check.mjs
node tools/informatics-officer-build/runtime-check.mjs
npm run build
```

Extraction uses PyMuPDF and only Set A: 9, 16, 15 and 16 pages respectively for
Technical I, II, III and GS. Original PDFs retain all sets. The answer is the
bold option text; an accidentally bold option label alone is not enough.
Four source label defects are explicitly normalised and noted. Import fails
on missing/duplicate question numbers, missing options, or ambiguous keys.
Paper I A56–65 are compensated, with null answers, and cannot enter tests.
Never infer their answers from other sets or treat the compensation as an
Informatics Officer scoring rule. Source checksums are stored with the PDFs.

Imported questions keep source sitting, number, option order and page links.
Technical Set A topic boundaries were reviewed: I = 20/20/30/30 questions,
II = 20/30/30/20, III = 30/30/20/20. GS mappings are explicit question-number
lists. Shared data is filtered by existing paper/unit/subtopic tags; historical
sources retain their own names and provenance. Earlier sittings can be partial
extracts. Shared corpus answers and current-affairs claims were not all re-audited.

The official syllabus includes substantial written work. Timed technical drills
represent only the MCQ component, with a full-paper three-hour time allowance.
They are not full mixed-format exam simulations. English MCQs use one point as
a study convention; the notification supplies section marks but not MCQ counts.
The GS mock uses 100 one-mark questions as a stated practice format.

The runtime check uses a minimal DOM stub for templates and logic. It does not
verify layout or real browser behaviour. Browser access to the local preview was
declined during this task; that check remains pending before deployment.
