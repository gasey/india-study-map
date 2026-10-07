# NCERT History MCQ module

For a future model or contributor, start with [HANDOFF.md](HANDOFF.md): it maps the route, authoring data, stable IDs, QA, and the later study-guide work.

The site serves the separate `/ncert-history` practice module. It contains 80 newly authored MCQs across 39 available NCERT chapter PDFs for Classes 8–12. `questions.mjs` is the editable content; `chapters.json` and `source-pages.json` are checked authoring metadata. `public/ncert-history/*.json` is generated runtime data. The old Class 9 standalone History PDFs returned 404 on 7 October 2026; current Class 9 History chapters 4–5 are included.

Run `npm run ncert-history:build`, `npm run ncert-history:check`, and `npm run build`. If the extracted PDF text is at `/home/hruaia/ncert-history/sources` (or `NCERT_SOURCE_DIR` points to it), the build and check also confirm every evidence anchor and PDF page. Else they validate against `source-pages.json`. When adding a new question, check its answer in the original NCERT PDF and add its page to `source-pages.json`; do not infer a key from the earlier open-ended exercise extraction.

The page allows browse, class/book/chapter/search filters, 10/20/all-question sessions, answer feedback, source PDF links, and local browser progress. Questions and answer keys are newly authored practice content; they are not official NCERT questions or official keys. The NCERT PDFs are linked rather than copied into the website. The original open-ended exercise extraction remains separately at `/home/hruaia/ncert-history/output/` and is not published in this module.

A study guide can be authored later. This module contains no placeholder guide or generated explanations beyond the MCQ feedback.
