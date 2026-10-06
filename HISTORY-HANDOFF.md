# History Learning Atlas — handoff

Prepared 2026-10-07. Local implementation; **not deployed or pushed**.

## Where the work is

The implementation is in `/home/hruaia/workspace/codex/india-study-map`, a clean local clone of the existing project at commit `2a4ddd9` (`Expand JSO physics study guide`). The original project at `/home/hruaia/workspace/projects/personal/india-study-map` is outside this session's writable roots. Its source was read to build a compatible change.

The clone's `origin` points to that local project, not directly to GitHub. Do not blindly push this clone. Its `node_modules` is a read-only symlink to the existing project's dependencies. Production build and checks work with it; Vite dev mode needs its cache relocated or a normal local install. No dependency was added to the application.

The original user material consists of nine **PPTX presentations**, despite the request referring to PDFs. Their 1,100 slides and 32 embedded image occurrences were extracted. No OCR is claimed. Native charts, notes, animation and original slide layout are not reproduced; use the source presentation for those details.

## What is implemented

- `/history`, lazy-loaded within the existing React shell.
- Home Study module card, Atlas → History subtab, and More-menu entry for the other shell.
- 8 era groups; 72 topics: 63 starter lessons and 9 explicit gaps.
- Chronological learning path, topic search, era filters, connected collapsible mind map.
- Short lesson orientations and recall checkpoints linked to the full source slide text/images.
- 89 derived MCQs with shuffled questions/options, explanations and source references.
- Topic/era/style filters, new-question practice, latest-incorrect practice, due reviews, skipped-question handling and session summaries.
- 47 mains prompts with year/topic/search filters, writing space and word count.
- Browser-local reading progress, answer statistics, topic notes, mains drafts, question flags, export and validated merge/restore.
- Coverage overview, source browser, correction ledger and downloadable data.

The route lives beside Chronicle and the existing question banks. It does not insert unverified practice content into the API-backed official-question workflow. Vercel's SPA rewrite explicitly excludes the new JSON/media paths.

## Apply to the main checkout

A generated `history-module.patch` and `history-module-files.zip` are available in the parent workspace. The patch includes tracked changes and all new files, including source media. The ZIP includes the changed/new files and a manifest; it is not the entire website.

From the intended project checkout, inspect the current worktree and then:

```sh
git apply --check /home/hruaia/workspace/codex/history-module.patch
git apply /home/hruaia/workspace/codex/history-module.patch
npm run history:check
npm run build
npm run dev -- --host 127.0.0.1
```

If patch checking fails because the project has moved on, port the new `src/modules/history`, `public/history`, and `tools/history-build` directories, then merge the small integration edits in `Root.tsx`, module registry, shell navigation, `package.json`, `vercel.json`, and `DEVLOG.md`. Preserve any other work. Avoid extracting the ZIP over a changed checkout without reviewing the overlapping files.

No live site or external database changes have been made. Deployment needs the normal project workflow after browser QA; the original request did not include a specific production deployment instruction.

## Validation completed

- `npm run build`: TypeScript and Vite production build passed. Existing large app-chunk warning remains; the new module is lazy-loaded.
- `npm run history:check`: all source-reference/content-integrity, progress/review logic and server-render checks passed.
- Server-render tests cover all six sections, every topic page, gap restrictions and selected source correction/filtered-practice paths.
- All 1,100 source slides are indexed. Mains source paragraphs are compared verbatim with generated prompts.
- `git diff --check`: passed.

Actual browser interaction/layout QA could not run: this sandbox rejects local server binding (`listen EPERM`) and required Chrome process operations (`shutdown: Operation not permitted`). Playwright could not be downloaded because npm network name resolution was unavailable. Installed Chrome was also tried. Do not describe this as browser-tested.

## Browser checks still required

1. Open `/history` from Home, Atlas subnavigation and the More menu. Test both app skins and mobile widths around 390 px.
2. Search and filter the path; expand a mind-map era and topic; follow a connection. Check keyboard focus and horizontal overflow.
3. Open Harappa and a source range. Page through slides, display embedded images and confirm correction links. Compare selected extracts against the original presentation.
4. Mark a topic studied; write a note; reload; verify restoration. Check the all-studied state says “Revisit the foundations”.
5. Start a focused MCQ session. Submit one correct, one incorrect and one skipped question. Verify explanations, option locking, score denominator, early finish, mistake retry and due/new filters. Reload and verify submitted statistics remain.
6. Write a mains draft, filter away and back, then reload. Export progress, import into a fresh profile and verify notes/drafts and answer statistics. Test a malformed import and storage-disabled mode.
7. Open a gap topic: no studied button or invented MCQs should appear. Verify source and question fetch failures have a useful retry path.
8. Preview the production build and verify `/history/data/*.json` and `/history/media/*` return their actual content under the hosting rewrite rules.

## Next model: priorities

Read `tools/history-build/README.md` before changing content. Edit the curated `.mjs` inputs, not generated JSON. Keep topic/question IDs stable; increment question revisions for substantive changes.

First complete browser QA. Then expand substantive lessons and varied questions, especially the nine gaps: Bhakti/Sufi traditions; later Mughals/Marathas; colonial economy/education; Ambedkar/constitution-making; post-independence planning/foreign policy; Northeast/Mizoram; Industrial Revolution/colonialism; world wars/UN; ideologies/decolonisation/Cold War.

The current 89-question bank is a **starter**, with mainly foundation recall and limited application questions. It is not a full mock-exam bank. Do not equate reading all supplied slides with official syllabus completeness, or a few correct answers with mastery. Verify the intended exam's current syllabus before claiming complete coverage.

Review source inaccuracies systematically. The correction ledger includes verified corrections and explicit open issues, but 1,100 slides have not undergone a complete historical fact-check. Official paper/key verification, backend sync, automatic AI grading, printable summaries and full lesson enrichment remain separate future work.
