# NCERT History module handoff

This is an independent `/ncert-history` module in India Study Map. The first release has 80 authored practice MCQs, covering 39 available chapter PDFs across Classes 8–12. It is a starter set, not a complete question bank. The study guide requested by the user is future work.

The page follows the UDC/LDC question-card interaction: Browse shows the full question and four answer buttons; tapping a choice reveals the verdict, explanation, and PDF source. Practice uses the same card with immediate feedback and a next-question control. The 394 extracted chapter-end prompts in the separate working directory are mostly open-ended textbook exercises, not 394 ready-to-score MCQs.

## Where to work

- `src/modules/ncert-history/NcertHistoryPage.tsx` and `ncert-history.css`: the browser page. Its own element scrolls vertically because the app shell clips overflow.
- `tools/ncert-history-build/questions.mjs`: editable MCQ text, answer indexes, explanations and source anchors. Each entry is `[chapterId, prompt, fourOptions, correctIndex, explanation, anchor]`.
- `tools/ncert-history-build/chapters.json`: chapter metadata and official NCERT PDF URLs. Some chapter PDFs contain more than one theme.
- `tools/ncert-history-build/source-pages.json`: verified PDF page for each generated question ID.
- `public/ncert-history/{chapters,questions}.json`: generated runtime files; rebuild after editing authoring data.
- `src/components/shell/collectibleTabs.ts`, `src/components/shell/MoreFlyout.tsx`, `src/modules/registry.ts`, and `src/Root.tsx`: route and separate navigation. Keep NCERT outside Bank.

## Add questions safely

Read the relevant original PDF from `chapters.json`. Write a fresh MCQ with four distinct options and verify the answer and explanation against the source. Choose a short literal text anchor from the PDF and add the one-based PDF page to `source-pages.json`. `build.mjs` generates IDs in chapter order (`chapterId-qNN`), so **append questions after existing questions for that chapter without changing their relative order**; changing an existing ID would detach saved browser progress. The script shuffles displayed option order deterministically, while the browser reshuffles it for each quiz session.

If available, place page-separated extracted PDF text at `/home/hruaia/ncert-history/sources/<chapterId>.txt`, or set `NCERT_SOURCE_DIR` to another folder. Build and validation then check anchors and page numbers against that text. Without extracted text, they check against the checked-in page map, so a human review of the original PDF remains essential. The old open-ended exercise extraction at `/home/hruaia/ncert-history/output/` is external working material, not part of this repository or the published MCQs. Do not treat those prompts as official answer keys.

Run `npm run ncert-history:build`, `npm run ncert-history:check`, and `npm run build`. For interaction QA, start the Vite server, launch Chrome with remote debugging on port 9222 at `/ncert-history`, then run `python3 tools/ncert-history-build/browser-check.py`. That script checks a 390px viewport, independent navigation, actual vertical scrolling, and a quiz path. Also inspect a desktop viewport when changing layout.

## Study guide follow-up

Add guide content as an explicitly separate view inside the NCERT module, grouped by class, book and chapter using the stable `chapterId` values. Keep authored guide data in `tools/ncert-history-build/` and generate a public JSON file, following the question pipeline. Cite official PDF pages for factual claims and distinguish summaries from NCERT text. The existing MCQ explanations are brief feedback, not a study guide. Useful next steps are chapter summaries, timelines, key terms, source-based prompts and revision checkpoints; their exact design can be chosen when the guide is built.

## Current limits

The older standalone Class 9 History PDF links on NCERT were unavailable when collected on 7 October 2026; current integrated Class 9 History chapters are included. The MCQs and answer keys are original practice material, not NCERT-issued questions or keys. Progress lives only in local browser storage under `ncert-history-mcq-progress-v1`.
