# Group B continuation handoff — 9 October 2026

Repository: `/home/hruaia/workspace/projects/personal/india-study-map`

The user requested continued Group B work, then asked to finish the remaining
review and deployment. Their latest request is to prepare this handoff for
another model. Completing the review and deploying the verified changes are
already authorised; no further deployment confirmation is needed. The latest
request changes the immediate deliverable to this handoff.

## Current result and limits

All previously imported unchecked items have now been reviewed. **This does
not mean every question can be answered or every paper has a final key.**

| Measure | Current local result |
| --- | ---: |
| General papers | 49 |
| Total items | 3,709 |
| MCQs | 3,582 |
| Written prompts with guidance | 127 |
| Practice-ready MCQs | 3,420 |
| Ready with official answers | 1,614 |
| Ready with derived answers | 1,806 |
| Imported items awaiting text review | 0 |
| Checked items held unscored | 159 |
| MCQs missing from the source | 13 |

The counters are generated in `tools/udc-ldc-build/build-report.json`.
`sourceReview: true` still prevents scoring; new `sourceReviewed: true`
distinguishes a checked, held item from an unchecked extraction. Do not clear
the scoring gate merely to remove a counter. The library now displays pending,
held and missing counts separately. Some held items need factual evidence;
others have inherently defective choices or ambiguous premises.

**Production has NOT been updated with this work.** All changes are local and
uncommitted, including work inherited from the preceding sessions. Preserve
them; do not reset or discard the working tree.

## Deployment failure and next concrete action

`vercel --prod --yes` was attempted with escalation and returned:

```json
{"status":"error","reason":"deploy_failed","message":"Not authorized"}
```

This was a Vercel deployment error, not a reported automatic safety-review
rejection. The linked account and project were then checked:

- `vercel whoami`: `gasey`.
- `vercel project inspect india-study-map`: project
  `prj_ard48NufWDfvc67AgQoKpEmwkWyr`, owned by `gaseys-projects`.
- `.vercel/project.json` matches that project and organisation
  `team_lxm5AwEbsL7SFf0WxuQxQTUT`.
- `vercel ls india-study-map`: readable production deployments exist.
- `vercel inspect https://map.hawayu.in`: current production is Ready,
  `dpl_HjWJayBwRmkGsNXQKbGdBB9tqUwi`, created 9 October at 12:02 IST,
  `https://india-study-dmvpth7f9-gaseys-projects.vercel.app`.
- Aliases include `https://map.hawayu.in` and
  `https://india-study-map.vercel.app`.

The cause of the write denial is unresolved; do not assume login is missing,
because whoami and project reads succeeded. A retry with the explicit owning
scope, after checking credentials/project deployment permissions, is a
reasonable next step. No scoped retry has been attempted. Do not bypass a
confirmed access denial by creating another project or publishing elsewhere.
If access cannot be restored in-session, report the exact blocked deployment
and the verified local result honestly.

After a successful deployment, verify the live `/udc-ldc` route, counters,
figures and PDFs. The browser checker now accepts an optional URL:

```bash
python3 tools/udc-ldc-build/browser-check.py https://map.hawayu.in/udc-ldc
```

This live invocation is **not yet run**. Update the deployment/validation log
only after actual success.

## Completed source batches

- JAO January 2025 Paper-II Q47–100: nine additional OCR omissions recovered,
  fifty worked answers and seven source crops. Full paper has 96 ready items;
  Q24, Q41, Q83 and Q94 are held. Its English paper was completed previously.
- Inspector of Statistics English February 2017, technical common English
  November 2024, ASI English November 2024 and MVI English September 2025:
  removed 29 fake MCQs; restored 10, 10, 12 and 13 conventional tasks with
  passages, exercises, printed emphasis and guidance. The technical paper
  skips printed Q3; preserve that numbering.
- JE Agriculture English March 2026: 32 MCQs and two conventional tasks,
  29 derived answers; Q10, Q29 and Q32 held.
- JE English April 2025: 60 MCQs and three conventional tasks, 49 derived
  answers. Recovered Q21–43. **PDF positions 5–6 contain printed pages 7–8;
  PDF positions 7–8 contain printed pages 5–6.** Source links deliberately
  follow PDF positions. Eleven ambiguous/defective MCQs remain held.
- Stenographer English November 2024: 60 MCQs, two written tasks, 39 derived
  answers; removed phantom OCR Q66. Twenty-one held items have explanations.
- ASI GK/reasoning November 2024: all 100 MCQs and 93 derived answers;
  four source crops (Q62, Q87–89). Cover confirms 200 marks, two hours and no
  negative marking. Q3, Q14, Q29, Q45, Q47, Q48 and Q94 are held.
- Remaining conventional sections: Stenographer March 2025 (two tasks),
  Stenographer Grade-II May 2025 (four tasks, including the complete twelve-part
  comprehension exercise), Radiotherapy April 2026 (four tasks with both
  passages and all subquestions).
- Mixed written/MCQ papers are excluded from full-paper Exam mode, including
  key-backed native sections; MCQ practice remains available.

## External source dependencies worth continuing

1. Stenographer GK November 2024 Q67–79: printed page 6 is absent. The current
   official PDF was reopened on 9 October and still has seven pages:
   `https://mpsc.mizoram.gov.in/uploads/attachments/2024/11/c66383d4101785ece2e97ef9f4d22a78/steno-grade-iii-general-knowledge-november-2024.pdf`.
   Do not invent the absent questions. Seek a complete scan or another booklet.
2. ASI 2024 Q3: needs the exact district voter table for the 29 October 2024
   draft/final roll comparison. Village-council electoral totals are a different
   population and cannot substitute. Current stem/options are checked.
3. ASI 2024 Q45: Aihniara is described as quick at accomplishing work
   (`tuan rang`), but the source checked does not establish the printed broad
   “fastest human being” claim. A matching folklore source or key is needed.
4. Several independently solved papers still lack matched official final keys.
   Keep derived provenance explicit and do not make them full-paper Exam
   eligible on the strength of an inferred key.
5. Other held items: each `unscored` repair has its explanation. Figures are
   restored where recoverable; some earlier visual items remain genuinely
   unresolved. A uniquely justified answer or official clarification is needed
   before changing their gate.

## Durable files and regeneration rules

Read `tools/udc-ldc-build/GROUP-B.md` and the newest `DEVLOG.md` entries.

- `tools/udc-ldc-build/group-b-text-repairs.json` is the canonical durable input:
  source SHA256 guards, checked stems/options/pages, `nonMcq` removals, worked
  `derivedAnswers`, held explanations and complete `written` tasks.
- `group_b_sources.py` applies those repairs. It now retains papers whose only
  rows are newly recovered written tasks, supplies marking metadata for the
  new batches, emits `sourceReviewed`, and excludes mixed papers from Exam.
- `build_group_b.py` generates the bank, library and split progress counters.
- **Never hand-edit** `src/data/banks/mpsc-group-b-general.ts` or
  `src/data/banks/mpsc-group-b-library.json`.
- Source archive is the sibling `../mpsc-question-bank/pdfs/Old_Questions/`;
  cached geometric extraction is under `tools/udc-ldc-build/extracted/`.
  Do not rewrite the OCR cache to make repairs look native.
- New PNGs under `public/question-images/group-b/`: JAO Q65, Q80, Q86, Q89,
  Q94–96; ASI Q62, Q87–89. Include these untracked files when committing.
- UI changes: `src/data/banks/types.ts`,
  `src/modules/udc-ldc/{GroupBPaperLibrary,AnswerSources,UdcLdcPage}.tsx`.
- Scratch helpers and rendered pages are in `/tmp/`; they are not needed to
  rebuild. **Do not rerun scratch repair scripts blindly**: later corrections
  (JE Q17, emphasis cleanup) were applied to the canonical JSON after them.

## Validation already completed

The current local bank passed:

```bash
python3 tools/udc-ldc-build/build_group_b.py
python3 -m unittest discover -s tools/udc-ldc-build -p test_group_b_repairs.py
npm run build
python3 tools/udc-ldc-build/browser-check.py
git diff --check
```

All **24 tests** passed. Consecutive builds were byte-identical for the bank,
library and report. Browser checks passed on mobile and desktop, including all
49 library sources, the new pending/held/missing counters, conventional-only
paper retention, JE page links and underlines, ASI diagrams/worked answers,
scoring gates, official-key comparison, corrigendum and Exam eligibility. No
runtime exceptions were detected. The production build has the existing large
bundle warning but completes successfully.

The last final build includes the cleaned JE Agriculture underline markers
and mixed-paper exclusion. The optional live-URL browser path has not been
exercised yet. Hardcoded progress assertions in the browser checker currently
expect 3,420 ready, 159 held and 13 missing; update these if additional verified
repairs change the counts.

The local Vite server was started on `127.0.0.1:5173` and headless Chrome CDP
on `127.0.0.1:9222`; check whether they still exist. The sandbox blocked a
local socket on a later browser run, so it was rerun with approved escalation.
The approved prefix is `python3 tools/udc-ldc-build/browser-check.py`.

When extracting generated question arrays for an audit, use
`json.JSONDecoder().raw_decode` from each `const groupBQuestionsPartN` start.
A regex ending at the first `];` can truncate a string containing that text.

No subagents were used. No deployment succeeded, and no changes were committed
or pushed in this continuation.
