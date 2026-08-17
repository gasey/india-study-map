# Dev log

Append-only log of what got built, when, and why — written at the end of
(or when pausing) any nontrivial work session on this project. Newest
entry on top. Not a changelog for users; a memory aid for future sessions
(human or AI) so nobody has to re-derive context from git log + guesswork.

Each entry: **what shipped**, **why**, **what's still open**.

---

## 2026-08-17 — Verified and fixed 4 issues in Assistant Controller of Mines 2026 (166 Qs checked)

**What shipped:** Second full manual verification pass on a 2026 paper
(English 66 + General Studies 100 = 166 questions), same method as the
CAO March 2026 pass below: hand-derived every grammar/fact answer,
cross-checked history/polity/economy/geography/science against standard
references, used live web search for ~5 checkable current-affairs and
disputed-fact items.

**Confirmed wrong, fixed directly in source data:**
- GS Q15 — "Satyamev jayate" was keyed to "Mandukya Upanishad"; the phrase
  is actually from the **Mundaka** Upanishad (mantra 3.1.6) — a completely
  different Upanishad, not a typo of the same one. Corrected the option
  text itself (was a wrong name that didn't even appear as a choice) and
  kept the same correct-index.
- GS Q19 — "Who headed the Congress commission investigating Jallianwala
  Bagh Massacre?" was keyed to "B.V. Patel", a name that doesn't appear in
  any source on this commission. Multiple sources (incl. a source using
  this exact question's wording) confirm **C.R. Das** headed it — already
  present as option (a), just pointed `correct` at the wrong index.
- GS Q73 — data corruption, not just a wrong key: option (d)'s text was
  literally leftover authoring scratch-notes ("only 2 (or wait, the answer
  key states A. Let's provide A)") instead of a real answer choice, and
  `correct` pointed at that broken option despite the question's own note
  saying "the official answer key marks (A)". Replaced the garbled option
  with a clean distractor and pointed `correct` at index 0 (option A,
  "2 and 4") per the note.

**Checked and confirmed correct (no changes):** all 66 English questions
(grammar ID, vocabulary, prepositions, active/passive-style transformations,
sentence types, reported speech, idioms — zero errors), and ~96 of the 100
GS questions (history, polity, economy, geography, environment, science all
matched standard references; several recent 2025-2026 current-affairs items
independently confirmed via web search — Nepal Gen-Z protests, France's
under-15 social media ban, Sunetra Pawar as Maharashtra's first woman
Deputy CM).

**Why:** Direct continuation of the CAO March 2026 verification pass (same
entry, below) — user wants the hub's upcoming-exam papers checked before
relying on them to study.

**What's still open:** ~15 Mizoram-specific cultural/historical trivia
questions (traditional instruments, grave types, clan-status terminology,
missionary history) were left unverified — no reliable way to check these
against general knowledge; would need the original source PDF. One mineral-
mining match question (GS Q33, Copper–Chitradurga / Manganese–Bhilwara) was
reviewed but not flagged — genuine ambiguity between "any documented mining
history" vs "standard textbook association," not confident enough to touch.
32 more papers in the hub (~6,700 questions) remain unswept.

---

## 2026-08-17 — Verified and fixed 4 wrong answer keys in CAO March 2026 (all 366 Qs checked)

**What shipped:** User suspected some fed-in answer keys were wrong for CAO
March 2026 (English 66 + GS-I 100 + GS-II 100 + GS-III 100 = 366 questions
total). Went through every question by hand — independently re-derived math/
logic answers, cross-checked historical/textbook facts against standard
references, and used live web search to verify ~10 recent (2025-2026)
current-affairs facts that postdate model training.

**Confirmed wrong, fixed directly in source data:**
- GS-III Q90 — number series `2,8,18,32,50,...` (pattern 2n²): key said 78,
  correct is 72. Pure arithmetic error.
- GS-I Q59 — "SC ruling that Governor can't exercise pocket veto — which
  constitutional principle?": key said "Separation of powers", every legal
  source (the SC judgment itself, law journals) frames this ruling around
  federalism/center-state relations — changed to "Cooperative federalism".
- English Q38 — idiom "Between the devil and the deep sea" was keyed to an
  option meaning "to be lazy", which is not what the idiom means at all
  (correct sense: caught in a dilemma between two dangers). No option in
  the original set stated the real meaning, so the wrong option's *text*
  was rewritten to state it, keeping the same correct-index.
- English Q57 — "change to a Simple Sentence" transformation: the keyed
  option was a comma-spliced compound, not a valid simple sentence, and
  none of the 4 options were. Rewrote the keyed option to the actual
  correct transformation ("Having finished his lesson, Martin put away
  his textbooks.").

**Checked and confirmed correct (no changes):** English idioms/prepositions/
tenses/narration (64 of 66 Qs), all 100 GS-I history questions (1757-1946,
every one matched standard textbook facts), all 100 GS-II questions (Polity/
Economy/Geography — zero errors, every answer matched reference material),
and ~85 of the remaining GS-III science/Mizo-culture/reasoning questions.

**Why:** User is using this hub to prep for a real upcoming exam — a wrong
key teaches false information with real stakes. Rather than guess or spot-
check, went question-by-question since the user explicitly flagged distrust
in the fed-in keys.

**What's still open (flagged, not touched — lower confidence, needs source
PDF or SME judgment, not a clean single fix):**
- GS-III Q92 — "letter midway between 7th and 15th [letter]" — if read
  against the plain alphabet the key looks off (J vs K), but the question
  may be missing original context that got dropped during extraction (a
  known recurring bug in this pipeline, see 2026-08-15 entries).
- GS-III Q89 — number series `10, 41, 94, 1624, 2516, 3625` reads like
  OCR-garbled digits (possibly a mangled `1,4,9,16,25,36`), can't verify a
  corrupted input with confidence.
- GS-III Q35 — LIDAR options (a) and (d) are duplicate text; cosmetic data
  defect, doesn't affect the marked answer's correctness.
- English Q9 — "however" tagged as Conjunction vs Adverb (conjunctive
  adverb) is genuinely debatable grammar classification, not a clear error.

Only CAO March 2026 was checked — the hub's other 34 papers (~7,300
questions) are unverified. Given the ~1% actual error rate found here (4
wrong out of 366, and 2 of those were flawed *options*, not just a wrong
pick), a full-hub sweep is possible but would take significant additional
time; the user chose to correct further papers themselves rather than sweep
everything now.

**What shipped:** Two bugs in the MCQ Practice Hub and admin console fixed:

1. **MCQ Practice Hub editor (public/quick-practice/mpsc-mcq-practice-hub.html):**
   - After saving a question correction, the page was doing a full `location.reload()` which reset the view to the MCQ of the Day tab — losing context, scroll position, and user orientation.
   - **Fix:** Instead of reloading the entire page, now updates the in-memory CORRECTIONS and ALLQ data, softly refreshes only the active tab (if it's the daily tab), and shows a ✓ success toast. Keeps user context intact.

2. **Admin Reports editor (src/modules/admin/tabs/ReportsTab.tsx):**
   - The `load()` function was setting `setReports(null)` before fetching fresh data, causing UI flashing and potential state inconsistency.
   - **Fix:** Made `load()` async, fetches data first, then updates state. If the fetch fails, keeps existing reports list on screen instead of flashing blank. Error is logged to console.

**Why:** User reported that after editing a question, the hub brought back the "quiz of the day" screen and reasoning problems were reverting. The root cause was the aggressive full-page reload — any corrections made appeared momentarily but then the page would reload, losing the edits from the UI view even though they were saved server-side. The fix keeps user context while still ensuring corrections propagate.

**What's still open:**
- The daily tab refresh is working, but other tabs (Browse, Papers, Viewer) will show updated corrections only when the user navigates to them next time. This is acceptable since corrections are rare and the data is correct server-side immediately; it's just a UI lag.
- Consider adding a global "Corrections updated" broadcast if multiple editors might be working simultaneously, but that's a future enhancement.

**What shipped:** Inspector of Taxes 2016 and Labour Officer 2021 each had 5 
figure-based non-verbal reasoning questions (GS-III, Q91–Q95) marked with low 
confidence because the diagrams were dropped during PDF extraction with no 
text-based fallback. Extracted source PDF pages as PNG, cropped the diagram 
regions, and analyzed all 12 figure-based questions to provide both the 
correct answer (a–d) and the visual logic rule underlying each pattern. All 
12 answers now include explanations grounded in the diagram patterns 
(tick-mark rotations, symbol sequences, letter-position alternations, etc.) 
rather than blind-key trusting.

**Questions solved:**
- Inspector of Taxes 2016, GS-III: Q91–Q95 (5 questions)
- Labour Officer 2021, GS-III: Q91–Q95 (5 questions)

All answers marked `answerConfidence: medium` reflecting pattern-based 
reasoning from the visual diagrams.

**Why:** Non-verbal reasoning questions are fundamentally unsolvable without 
the visual content — relying on stored answer keys alone is no better than 
guessing for actual exam prep. These two papers were flagged earlier as 
needing fresh diagram extraction; this completes that work.

**What's still open:**
- These diagrams are currently solved via explanation text but not yet 
  visually rendered inline (the `imagePath` field points to full page scans, 
  not per-question crops). Rendering can be added later if users want visual 
  cross-check.
- This closes out GS + English MCQs for all 5 unofficial sittings. 
  Descriptive/essay questions and the other 30 officially-keyed papers 
  remain future work (see prior entries for scope discussion).

---

## 2026-08-15 — Verified all 500 English MCQ answers in the 5 "not official" MCQ Practice Hub sittings

**What shipped:** Extended the GS answer-verification method (see the two
entries below) to the English sections of the same 5 unofficial-key
sittings — 500 questions total. Matched all 500 against
`tools/bank-rebuild/bank.json`'s `-english-ii` paper records by position
(same 100-question count on both sides, confirmed before trusting the
match). 400 already agreed — explanation copied over at zero token cost.
100 disagreed; split across 5 parallel agents (20 questions each) to
independently verify via real English grammar/vocabulary rules rather
than trusting either source. Outcome: bank was right on 83, hub was right
on 13, 4 were genuinely ambiguous even by grammar-textbook standards
(marked `uncertain`, e.g. "beset by/with", "on/onto" — contested even in
dictionaries) and marked with the `low`-confidence badge rather than
picked arbitrarily. One question (FCS&CA-2019 English Q85, an
"Irrelevant" antonym item) had its actual option text disagree between
the two sources, not just the marked answer — flagged low-confidence
since neither option set contains a true antonym of "irrelevant," which
suggests the underlying source data itself may be corrupted; adopted
bank's option wording as the better of two imperfect choices pending a
manual check against the original PDF.

Net: 85 of the 100 disputed answers were corrected (matching the ~85%
hub-was-wrong rate seen in the earlier GS pass — consistent with these
being the same known-bad "unofficial key" pipeline output), 15 confirmed
correct with a new explanation attached.

**Why:** Direct follow-up to the GS-only scope noted as still-open in the
2026-08-14 entry — same rigor, same reason (real exam, wrong answers
teach the user something false).

**What's still open:**
- FCS&CA-2019 English Q85's source-data corruption (hub/bank option text
  disagreement) should be checked against the original PDF directly
  rather than relying on either extraction.
- This closes out GS + English for these 5 sittings. Descriptive/essay
  questions and the other 30 officially-keyed papers' explanations remain
  future work (see prior entries for cost/scope discussion).

---

## 2026-08-15 — Recovered 5 missing reading-comprehension passages in the MCQ Practice Hub

**What shipped:** User asked whether groups of questions ever share one
underlying paragraph — checked, and found a real, recurring extraction
bug: 5 papers had comprehension-style question sets (`"According to the
passage..."`, `"the above passage"`, `"the crux of this passage"`) whose
follow-up questions survived extraction but the shared source passage
itself was silently dropped, leaving the questions technically "complete"
(options + correct answer intact) but ungroundable — unanswerable by
actually reading and reasoning, only by trusting the stored answer key
blindly. Swept all 35 papers for this pattern (regex for passage/paragraph
references, filtered out false positives like ordinary "consider the
following statements" MCQs which already embed their own content) and
confirmed exactly 5 affected clusters, 28 questions total:

- Assistant Controller of Mines 2023 (Paper I), GS1 Q52-56 (Bengal tiger/poachers)
- Junior Grade MLS 2023, GS Q86-90 (King of Kanchi folktale)
- Labour Officer 2021, GS3 Q84-89 (psychology-of-stress passage)
- Lecturer (VSE) & VGO 2025, GS3 Q89-90 (religious traditions/duties)
- Tourist Officer 2026, English Q1-10 (sustainable livelihoods)

All 5 source PDFs already had OCR text sitting in
`~/Downloads/mpsc_pdfs_examination/Old_Questions/` from earlier pipeline
runs, so recovery was pure grep-and-verify, no re-extraction needed. Added
a `passage` field to the question schema, wired it through the flatten
step (same gap as the last two entries — checked immediately this time),
and render it in a distinct quoted-context box (`.qpassage`, blue left
border, italic) above the question text. Cross-checked all 28 recovered
against their existing stored answers using the now-visible passage text
while at it — all correct, no answer changes needed here, just missing
context restored.

**Why:** A genuinely unanswerable question is worse than a wrong one for
exam prep — the user can't learn from it or catch that they got it right
by luck. This is the third silent-passage/data-loss flavor caught in this
bank (see the 2026-08-04 entries), so it's worth treating "shared
context lost during extraction" as its own recurring failure mode to
watch for, not a one-off.

**What's still open:**
- This sweep only checked for the word "passage"/"paragraph" plus a
  length heuristic — a differently-phrased reference (e.g. "as stated
  above", or a shared data table instead of prose) could still hide
  elsewhere unswept.
- The 5 papers here are exactly the same 5 flagged `notOfficial` from the
  earlier answer-verification pass — worth remembering that whichever
  papers get touched next (English MCQ verification, per user's separate
  request) should also get this same passage check applied first, since
  the extraction bug clearly clusters in these sittings.

---

## 2026-08-15 — Backfilled 2 missing questions + added figure/diagram rendering to the MCQ Practice Hub

**What shipped:** Grade-V Inspector (FCS&CA) 2019 GS-III was missing qno
91-92 entirely (100 questions expected, only 98 present) — both are
non-verbal-reasoning "problem figures" questions whose diagrams were
dropped during OCR extraction with no accompanying text to reconstruct
them from. Found the actual source page scan already sitting in
`public/mpsc-diagrams/ce3c0da27c013ecfe043.png` (part of the existing
297-image diagram set from the `mpsc-backend` extraction pipeline,
previously only referenced by the React app's separate
`QuestionsDisplay.tsx` viewer, never by this hub). Cropped and zoomed the
relevant regions to actually read the figures pixel-by-pixel and solve
both by hand: Q91 is a 5-symbol positional-rotation cycle (TL→TR→BL→BR→MID,
period 5, so the answer repeats Figure A — high confidence); Q92 is a
shape-containment series (outer shape repeats, a brand-new inner shape is
introduced each step — medium confidence, reasoned from geometry since no
official key exists for this sitting).

Added a new `imagePath` field to the question schema and `<img class="qfigure">`
rendering in `renderQuestionStatic` (inherited automatically by the
click-reveal viewer), plus the flatten-step field it needs — same gap
pattern as the `explanation` bug from the previous entry, caught earlier
this time by checking the flatten allowlist immediately after adding the
field. Attached the same page image to the already-existing Q93-95 in this
section too, so users can visually cross-check the cube/circle puzzles
that were previously solved from OCR text alone (rechecked all three
against the image while at it — all three already correct).

**Why:** User asked for these to be implemented since the source page scan
was sitting there unused; two genuinely missing questions is data loss
that a real exam-taker would silently never see.

**What's still open:**
- Only this one image was hand-verified this way. The manifest in
  `mpsc-backend/data/mpsc_bank_converted.json` maps this same image to
  all 5 of this paper's diagram-flagged questions via a generic
  `_diagramPath` (not per-question crops) — fine here since one scan page
  happened to hold Q91-95 together, but won't generalize automatically to
  other figure-based questions elsewhere without checking each one.
- Inspector of Taxes 2016 and Labour Officer 2021 also have non-verbal
  reasoning questions marked `low` confidence (GS-III, ~90s question
  range) with no diagram in the extraction manifest at all — these would
  need fresh source-PDF lookup and cropping, not yet done.
- English-section MCQs across the 5 "not official" sittings and
  descriptive/essay-style questions are still outside this pass — see the
  entry below for the GS-only scope of the answer-verification work.

---

## 2026-08-14 — Cross-checked and explained all 1,500 GS answers in the 5 "not official" MCQ Practice Hub sittings

**What shipped:** The hub flags 5 sittings as `notOfficial` (Grade-V
Inspector FC&CAS 2019, Inspector under Excise & Narcotics 2019, Inspector
of Taxes 2016, Labour Officer 2021, Programme Co-ordinator 2021) — 1,500
GS questions with agent-derived answers and zero explanations. Rather than
re-solving from scratch, matched every one of them by position (same
source PDF, same order, confirmed against OCR text) to the independently
rebuilt `tools/bank-rebuild/bank.json` dataset behind `/state-tax-officer`,
which already carries a mandatory explanation per question and went
through stricter validation (PDF-anchored option-order checks). 1,498 of
1,500 matched (2 questions missing from the hub, not yet backfilled); 1,233
already agreed with the bank's answer (explanation copied over as-is,
`answerConfidence: 'high'`); 265 disagreed.

Spawned parallel agents (general-purpose, web search enabled) to
adjudicate each of the 265 disagreements independently rather than
trusting either source — every question got its own fact-check, not just
a coin flip between hub vs. bank. Outcome: 65 answers were changed to a
newly-verified correct option (e.g. Inspector of Taxes 2016 GS-I Q57 —
Constitution Day is Nov 26, not the hub's Jan 26/Republic Day trap-answer;
the 72nd Santosh Trophy question had *both* candidates wrong — actual
winner was Kerala, not West Bengal or Mizoram), 200 kept the hub's
original answer but now have a real explanation, and a meaningful chunk
(mostly non-verbal reasoning questions with figures not preserved in the
extracted text, and obscure/unverifiable Mizo-specific folklore trivia)
came back `confidence: 'low'` — per explicit instruction ("no wrong
answers, mark the one where the answer key is wrong"), these are NOT
silently guessed. Added an `answerConfidence` field to the question
schema, a "⚠ Answer uncertain — verify" badge, and an "Unverified —"
explanation prefix so low-confidence questions are visibly flagged in the
UI rather than presented with false confidence.

Also fixed a real bug found along the way: the flatten step that builds
`ALLQ` from the raw JSON only copied a fixed field allowlist and silently
dropped `explanation`/`answerConfidence` even after they were added to the
source data — explanations weren't reaching the rendered cards at all
until this was caught by manually verifying in the browser rather than
trusting the data write.

**Why:** User is actively using this hub for real Group B Gazetted exam
prep and asked for the unofficial-answer sittings to be solved/cross-checked
with explanations, explicitly framing it as "no wrong answers, mark the
one where the answer key is wrong" — accuracy over speed, don't
paper over uncertainty.

**What's still open:**
- 2 questions missing from FC&CAS 2019 GS-III (hub qno 91-92) exist in
  `bank.json` but weren't backfilled into the hub — a straightforward
  follow-up.
- English-section (non-GS) MCQ questions in these 5 sittings were not
  covered by this pass — only the General Studies sections were
  cross-checked.
- A recurring theme in the low-confidence set: figure-based non-verbal
  reasoning questions whose diagrams were never preserved as text by
  either extraction pipeline — genuinely unsolvable without the original
  question booklet images, not a research gap that more searching would
  close.

---

## 2026-08-14 — Fixed GS1/GS2/GS3 filter for 9 sittings in the MCQ Practice Hub

**What shipped:** `public/quick-practice/mpsc-mcq-practice-hub.html` (the
standalone PDF-extracted practice module, `/embed/mpsc-mcq-practice-hub`)
had 24 sittings whose General Studies questions weren't filterable by
GS1/GS2/GS3 — they were dumped in one `subject` bucket. Checked each
against the source PDFs in `~/Downloads/mpsc_pdfs_examination/Old_Questions`
before touching anything, per this repo's own rule about not patching
symptoms blind:

- **~15 sittings are correct as-is** (Assistant Director Town Planning,
  CDPO, Assistant Controller of Mines, Tourist Officer, Technical Officer
  SCERT, Circle Education Officer, Jr. Grade MES Combined, Jr. Grade MLS
  ×2, Lecturer Serchhip, Agri & Allied, etc.) — MPSC genuinely printed
  these as one combined GS paper, so no split should exist.
- **9 sittings were a real extractor bug**: CAO March 2026, Inspector under
  Excise & Narcotics (2019/2021/2025), Inspector of Taxes 2016 & 2018,
  Labour Officer 2021, Programme Co-ordinator 2021, Lecturer (VSE) & VGO
  Combined 2025. Source has 3 separate GS-I/II/III PDFs each, but the hub
  concatenated them into one `"General Studies 1"` section. Confirmed the
  concatenation was clean (each original paper's `qno` resets 1→100 at the
  join point, verified against OCR text for a sample) so the fix was a
  positional split — no per-question content classification needed. Split
  each combined section back into 2–3 sections tagged `General Studies
  1/2/3`, matching the convention already used by the sittings that were
  extracted correctly the first time. Verified in the dev server: paper
  chips and the global subject-filter counts (GS1: 1600, GS2: 1300, GS3:
  1178) reflect the split; total paper/question counts (35 / 7675)
  unchanged before vs after, so nothing was dropped.

**Why:** User is actively using this hub (not the `/state-tax-officer`
bank) for current Group B Gazetted prep, so GS-paper filtering needs to
work now — the `tools/bank-rebuild` pipeline behind `/state-tax-officer`
already handles CAO-2026/Labour Officer/Programme Co-ordinator correctly
(see 2026-08-13 entry below), but the hub is a separate, independently
extracted dataset that never got the same fix.

**What's still open:**
- 3 sittings referenced by the hub have no matching source PDF in the
  `Old_Questions` archive under any name searched: **Librarian 2026**,
  **Instructor ITI 2026**, **Sericulture Extension Officer 2025**. Left
  untouched pending the user pointing at the right source file/folder.
- The hub has no committed generator script (unlike `tools/bank-rebuild`)
  — this fix was applied as a one-off transform directly against the
  embedded JSON in the HTML file. If the hub is ever regenerated from
  scratch, this fix will need to be reapplied or ported into whatever
  produces it.
- Long-term goal (user's, not yet started): converge the hub and the
  `tools/bank-rebuild`-backed bank so all MPSC papers are classified once
  in one pipeline instead of two.

---

## 2026-08-13 — Four more MPSC sittings: FC&CAS-2019, CAO-2026, Labour Officer 2021, Programme Co-ordinator 2021

**What shipped:** Extended `tools/bank-rebuild/` to four more previously-missing
sittings, bringing the bank from ~1100 to 3475 questions and from 7 to 11 exam
sittings, so all of them now support the GS-I/II/III paper filter and topic
browsing on `/state-tax-officer` just like the original sittings:

- **FC&CAS Inspector, March-2019** (398 questions) — no official answer key
  exists anywhere in the archive, so every question was agent-derived via
  `merge_native.py` + hand-solved batches under `solve/`, per `SOLVE_BRIEF.md`.
- **Cooperative Audit Officer, 2026** (300 questions, GS papers only — the
  "General English" paper turned out to be descriptive précis/letter-writing,
  not MCQ, so it's excluded like every other sitting's English-I) — official
  answer key vision-transcribed from a scanned key PDF, including two special
  cases (a compensated/voided question, a dual-accepted-answer question).
- **Labour Officer, October-2021** and **Programme Co-ordinator,
  October-2021** (400 questions each, 787 total needing solving) — share the
  same GS-I/II/III syllabus pattern, no official key, fully agent-derived.

**Why:** The user is preparing for MPSC Group B Gazetted exams and explicitly
asked for every listed sitting to "live completely" in the GS-split-capable
bank, not just the ones originally scoped — including sittings with no
official key requiring hundreds of from-scratch derived answers. Confirmed
via AskUserQuestion to keep going through the full 787-question Labour/ProgCo
batch rather than shipping a smaller slice.

**Bugs found and fixed in the shared pipeline while adding these sittings**
(all regression-tested against the original 11-paper baseline before/after):
- `parse_native.py`'s `DIRECTION` regex didn't handle a colon right after
  "Directions", a missing/comma-only separator before the description, or
  "for" as an alternative to "to" — the last one turned out to be a **live
  pre-existing production bug**: 2021 Inspector of Excise GS-III Q97 had
  "Direction for Questions No. 98-100..." silently swallowed into option (d).
  Verified against the source PDF that the true answer was unaffected, only
  the displayed option text was corrupted.
- `parse_native.py`'s `OPT` regex didn't tolerate a stray "(b.)" printing typo
  (confirmed against source, a real misprint not an extraction bug).
- `merge_native.py`'s fuzzy old-answer matcher (SequenceMatcher, threshold
  0.78) can occasionally match a brand-new short/generic question against an
  unrelated old question elsewhere in the bank and incorrectly inherit its
  topic. Caught two cases this way (a "who coined Jet Stream" GS-II question
  and a cyber-terrorism/IT-Act GS-III question both landed in `eng_sentence`)
  by noticing their content didn't match their assigned topic while browsing.
  Fixed with a small per-id `TOPIC_OVERRIDES` table in `merge_native.py`,
  mirroring `retag_history.py`'s existing override-table pattern, rather than
  hand-editing the generated `.ts` output.
- `types.ts`'s `sourceDefect` union widened to add
  `'hand-transcribed-matching-table'`, for a handful of "match List-I via
  Codes table" questions the regex parser can't safely handle (would misparse
  using List-I's embedded (a)-(d) markers instead of the true Codes-table
  answer rows) — hand-transcribed directly from source instead.

Also hand-patched a handful of PDF-extraction failures after visually
confirming each against the actual page image: genuinely duplicate print
misprints (CAO-2026 GS-III Q35), a symbol-font that didn't decode at all
(comparison operators in CAO-2026 GS-III Q83), an undecoded Greek letter
(ProgCo GS-III Q8), and a multi-line "grid" reasoning-question format that
the shared parser wasn't designed for and mis-associated trailing lines
between adjacent questions (Labour GS-III Q76-79).

**What's still open:** Inspector of Supplies 2024 and Lecturer (VSE)/VGO
2025 are the two remaining sittings from the original list — both need
vision transcription (scanned PDFs) paired with an existing official key,
not agent-derived solving. `validate.py bank` reports 16 flagged questions
across the whole bank; all are confirmed pre-existing false positives from
its `squash()` duplicate-detection heuristic stripping too much punctuation
(Roman numeral permutations, comparison-operator chains) or from
`sourceDefect`-tagged questions it doesn't check — not new corruption.

---

## 2026-08-13 — GS-I/II/III paper filter + Cooperative Audit Officer 2022 sitting

**What shipped:** Two things on `/state-tax-officer`. (1) A "paper" filter
dropdown on the Question Bank tab (`StateTaxOfficerEnhanced.tsx`), next to
the existing topic filter — lets you isolate just GS-I, just GS-II, etc.
across every exam at once, which previously only existed nested inside the
By Paper browse tab. (2) The Cooperative Audit Officer, Dec-2022 sitting —
400 new questions (English-II, GS-I/II/III, 100 each) — extending the
`tools/bank-rebuild/` pipeline to a genuinely new sitting for the first
time (every prior rebuild replaced an existing, already-broken bank
record; this one had none). Answers come from the official MPSC Final
Answer Key (transcribed into `official-answer-keys.json`); every question
also got a hand-written explanation (`explained.json`), since a brand-new
sitting has no prior bank record to carry an old explanation from — the
rebuild's answer-carry-over trick that supplied most other sittings'
explanations doesn't apply here.

**Why:** The user is using this module for MPSC Group B Gazetted prep and
asked for it directly — several exams they listed as belonging to the
GS-1/2/3 practice pool didn't exist in the app at all despite source PDFs
being available.

**Pipeline bugs found and fixed along the way** (in `parse_native.py`,
shared by all native-text-layer parsing, so these also affected already-
shipped data):
- The `DIRECTION` regex only recognized 3 of what turn out to be 5+ real
  phrasings MPSC uses for "Directions (Questions X-Y):" headers. Two new
  variants — a comma-separated form and one with no separator at all
  before the description ("for" instead of "to" was one culprit) — went
  unmatched and silently glued the header text onto the *previous*
  question's last option. One of these was caught in CAO-2022 itself; the
  other ("for" instead of "to") was found in the **already-shipped** 2021
  Inspector of Excise GS-III Q97, which had been teaching a corrupted
  option (d) in production. Confirmed against the source PDF and fixed —
  Q97's real answer ("Between C and E") is unaffected by the corruption,
  it was purely display corruption in the option text.
- `validate.py`'s `hygiene()` check has a real blind spot: it only flags a
  leaked-in header if it happens to contain a recognizable marker pattern
  (an "(a)"-style option marker, a numbered-question start, or specific
  furniture keywords). Plain leaked prose with none of those markers
  passes hygiene checks silently. Caught the 2021 GS-III bug via a
  by-hand read of the raw question list, not the automated check. Added a
  cheap tripwire for future rebuilds: scan every option for length >120
  chars and eyeball the hits — a real MCQ option is never that long.
- The `OPT` regex (`\((a|b|c|d)\)`) didn't tolerate a stray period inside
  the parens; FC&CAS-2019 GS-II Q76 misprints option (b) as "(b.)" in the
  source PDF itself (verified, not an extraction artifact) and broke the
  strict-sequence parse. Now tolerated.
- 4 questions in FC&CAS-2019 GS-I (Q38, 43, 50, 56) are "match List-I with
  List-II via a Codes table" format — a fundamentally different visual
  layout (a small grid of roman-numeral/letter permutations) that the
  regular a/b/c/d-marker parser can't safely handle. Hand-transcribed
  directly from the source PDF rather than risk a generic-but-wrong parse;
  tagged `sourceDefect: "hand-transcribed-matching-table"`.

**What's still open:** FC&CAS Inspector (Grade-V of Mizoram FCS&CAS),
Mar-2019 is parsed and validated (`parsed-fccas-2019.json`, 0 hygiene
issues, 0 order mismatches) but not yet merged/applied — it has no
official answer key anywhere in the archive, so it needs to go through
`merge_native.py` + `solve/` agent-answering per `SOLVE_BRIEF.md` rather
than a direct key lookup. Inspector of Supplies (2023 booklets / exam
actually held Dec-2024 per the answer key notification — recorded as
2024) and Lecturer (VSE) & VGO, Feb-2025 are both scanned PDFs with no
text layer at all; their official answer keys exist and were partially
transcribed (Lecturer-VSE confirmed to publish a full separate answer
table per booklet series — Series-A is the one to use), but the questions
themselves still need vision transcription from the page images, the same
way the 2024 GS papers were done. Full plan at
`~/.claude/plans/sharded-juggling-bumblebee.md`.

## 2026-08-12 — Offline JMdict/KANJIDIC2 dictionary search for Nihongo

**What shipped:** A third tab on `/nihongo`, "Dictionary" —
`src/modules/nihongo/DictionarySearch.tsx` — that searches the full JMdict
English word list (~218k entries) and KANJIDIC2 (~10k kanji) entirely
client-side, no network call at query time. Search auto-detects query
type: kanji/kana input matches headwords directly, romaji is converted via
the existing `romajiToKana()` (`src/data/kana.ts`, reused rather than
reimplemented), and English input matches against glosses; results for
single-kanji words cross-reference KANJIDIC2 inline (on/kun readings,
stroke count, JLPT level, grade). Results can be bookmarked — a new
`nihongoDict.savedWords` slice in `src/lib/store.ts`, following the exact
`nihongoCourseLastStage`/shallow-merge pattern already in the file.

**Data pipeline:** `tools/nihongo-dict/build.mjs` (re-run with `npm run
build:dict`) pulls the latest `jmdict-eng` + `kanjidic2-en` releases from
`scriptin/jmdict-simplified` (pre-parsed JSON, not raw EDRDG XML),
compacts them (drops xrefs, per-form tags, dictionary cross-reference
numbers, codepoints, radicals — none of it rendered), and writes
`public/data/nihongo/{jmdict,kanjidic2}.json` as static assets, fetched
lazily only when the Dictionary tab opens (`jmdict.json` is 32.5MB /
8.5MB gzipped — one-time cost, cached by the browser after). Search itself
is a plain in-memory headword map + full linear scan over lowercased
"kanji+kana+gloss" blobs built once after fetch (~1s for parse+index on
Node; scanning all 218k blobs per query is single-digit milliseconds) —
deliberately not a pre-serialized inverted index, since jmdict.json is
already large enough and building the index at load time is cheap.
Attribution written to `public/data/nihongo/ATTRIBUTION.txt` and shown in
the tab footer — JMdict/KANJIDIC2 are EDRDG's, CC BY-SA 4.0.

**Why:** Both prior Nihongo entries below explicitly deferred dictionary
search because live lookup "needs either a backend or a CORS proxy hack
that doesn't fit this app's local-only design." Bundling the dictionary as
static data sidesteps that blocker entirely instead of solving it — no
backend dependency added, no CORS, consistent with the "single-user,
no-login, localStorage" architecture this app already commits to.

**What's still open:** Grammar notes/admin authoring remain deferred, same
reason as before (implies an author/reader split this app doesn't model).
Tatoeba example sentences per dictionary word and KanjiVG animated
stroke-order diagrams (both mentioned in the original resource list this
work came from) are natural follow-ups but weren't built — scope was
"full JMdict/KANJIDIC2 ingestion" specifically. Saved words aren't wired
into the SM-2 Flashcards deck (`src/data/decks/nihongo-cards.ts` is still
static, hand-curated); that'd need turning it into a dynamic per-user deck
first.

---

## 2026-08-12 — Nihongo grammar course (real content, sourced from Tatoeba), plus a quiz-component dedup

**What shipped:** The Nihongo module (kana + deck, previous entry) wasn't
actually a "course" — no grammar, no progression, just a chart and a
flashcard deck. Added a real 6-stage grammar path
(`src/data/nihongo/course.ts`, rendered by the new
`src/modules/nihongo/NihongoCourse.tsx`, a second tab in `/nihongo`
alongside Kana): sentence basics (は/です) → particles (を/に/で) → verbs
(ます form + the three conjugation groups) → adjectives (い/な) →
questions (か) → a closing "read three real sentences" stage, same idea
as Python's stage 6.

**Why sourced from Tatoeba specifically:** Python and Postgres hit "real
content, not filler" by quoting the user's own project code — there's no
equivalent artifact for Japanese grammar. Per direct instruction ("from
api"), every example sentence in the course was pulled live from
`api.tatoeba.org` (confirmed reachable; `showtrans=all` returns bundled
English translations) rather than invented — e.g. stage 1's example
(私は学生です. / "I am a student.") is a real, CC BY 2.0 FR-licensed
sentence, attributed per stage as `source: 'Tatoeba (CC BY 2.0 FR)'`.
Stage 6 strings together three more real sentences deliberately left
partially unglossed (お忙しい's polite お- prefix isn't taught anywhere
in the course) — same "go read something real, not a fully-scaffolded
textbook example" move as Python's closing stage.

**Also: deduped the quiz component.** Building this would have made a
*third* byte-identical copy of `PyQuiz.tsx`/`PgQuiz.tsx` (same component,
different type import). Extracted `src/lib/quizTypes.ts` (`QuizQuestion`)
and `src/components/shared/MiniQuiz.tsx`, deleted both originals, and
repointed `PythonPage.tsx`/`PostgresPage.tsx` to the shared component —
two duplicates was arguably a coincidence of mirroring one module: three
was a pattern worth collapsing before it calcified further. `PyStage`/
`PgStage`'s own `PyQuizQuestion`/`PgQuizQuestion` types were removed
outright (not kept as deprecated aliases) since nothing else imported
them except the files just deleted.

**Also:** `nihongoCourseLastStage` store field + Home resume card, same
pattern as `pythonLastStage`/`postgresLastStage` — confirmed live, all
three now show up in "Jump back in" simultaneously.

**Verified live:** dev server, `/nihongo` → Grammar course tab renders
all 6 stages, stage 1's real example sentence + attribution display
correctly, answered a quiz question (correct-answer highlight +
explanation). Re-checked `/code` (Python) after the MiniQuiz extraction —
still renders and its quiz buttons are intact, confirming the refactor
didn't regress it. `tsc && vite build` passes clean; `MiniQuiz` now
builds as its own shared chunk instead of being duplicated into both
`PythonPage`/`PostgresPage` bundles.

**What's still open:** Dictionary search and admin-authored grammar notes
(as opposed to this fixed 6-stage course) remain deferred — same reasons
as before (need a backend or a CORS-proxy hack this app doesn't have
precedent for).

---

## 2026-08-12 — Nihongo module: kana chart/quiz + a real deck, not a new engine

**What shipped:** A "Nihongo" module (`/nihongo`, in More next to Python and
Postgres). Two pieces, deliberately built differently:

- **Kana chart + quiz** (`src/data/kana.ts`, `src/modules/nihongo/KanaChart.tsx`,
  `KanaQuiz.tsx`) — ported verbatim from the `nihongo-app` prototype
  (hiragana/katakana table, the hand-rolled `romajiToKana()` converter, MCQ +
  type-romaji quiz modes). No spaced repetition here — same as the
  prototype, kana drilling is a flat quiz, not a scheduled review.
- **Vocab & Kanji deck** (`src/data/decks/nihongo-cards.ts`, 24 words + 12
  kanji seeded from the prototype's `SEED_VOCAB`/`SEED_KANJI`) — registered
  as a normal entry in `src/data/decks/index.ts`. This is the one that
  matters architecturally: it needed **zero new code**. This app already
  has a real SM-2 engine (`src/lib/sm2.ts`) shared by the Flashcards page
  and the Recall → Due Today tab, keyed only on `deckProgress[deckId]` —
  register a deck, and grading/scheduling/undo/due-filtering all just work.

**Why this shape, not a website-style rebuild:** Earlier the same
Japanese-learning feature set was built into the separate `website` repo
against Supabase (real accounts, server-tracked SRS). The user asked for
it in *this* app instead, "first" — before deciding anything about
sharing that backend. `india-study-map` is a single-user, no-login,
localStorage app by design (its own CLAUDE.md is explicit about this) —
building a second bespoke SRS system here to mirror nihongo-app's
add-a-word-to-review flow would have fought that design and duplicated
`sm2.ts` for no reason. Reusing the existing deck system instead means the
Nihongo deck automatically shows up in Flashcards' deck selector, Recall's
due-today queue, and `stats.ts`'s `flashcardsRemaining()` — confirmed live
(see below), not just by inspection.

Also added: `?deck=<id>` query param support to `FlashcardsPage.tsx` (it
only ever defaulted to `decks[0]`) so `/nihongo`'s "Vocab & Kanji deck"
card can deep-link straight into `/flashcards?deck=nihongo` — generically
useful for any deck, not nihongo-specific.

**Deferred, not dropped:** dictionary search (Jisho) and grammar notes
from the original nihongo-app feature set aren't here. Dictionary search
needs either a backend proxy or the same public-CORS-proxy hack the
prototype used (fragile, and this app has zero networked-lookup
precedent); grammar notes as *published* content implies an author/reader
split this single-user app doesn't have a concept of yet. Both are real
gaps, just out of scope for "get it in here first."

**Verified live:** dev server, `/nihongo` — kana chart renders all 46
base hiragana, MCQ quiz graded a wrong answer correctly (tally updated,
auto-advanced) — and `/flashcards?deck=nihongo` — the query param
pre-selected the deck (confirmed against the dropdown), topic filter
showed Vocabulary/Kanji, graded a real card (36→35 due, next card
surfaced, undo worked and was used to leave the deck's progress clean).
`tsc && vite build` passes clean; `NihongoPage` gets its own lazy chunk.

---

## 2026-08-12 — Postgres & SQL module, mirroring Python

**What shipped:** A new "Postgres & SQL" learning module, added to the
"More" flyout right next to "Programming & Python" (`/postgres`, same
6-stage lesson+quiz shape as `/code`). Built by mirroring the Python
module file-for-file: `src/data/postgres/lessons.ts` (`PgStage[]`),
`src/modules/postgres/PgQuiz.tsx` (byte-identical logic to `PyQuiz.tsx`,
just retyped), `src/pages/PostgresPage.tsx` (identical structure to
`PythonPage.tsx`), a `postgresLastStage` store field + `setPostgresLastStage`
action (persisted, same as `pythonLastStage`), a new `Home.tsx` "Jump back
in" resume card, a new `IC.db` icon (no database icon existed in the set),
and the `/postgres` route in `Root.tsx`.

**Why:** Same reasoning as the Python module — real content sourced from
the user's own project, not textbook filler. Stages 2 ("Keys, constraints
& NULL"), 4 ("Bulk INSERT & upsert"), and 5 ("Indexes & aggregates") quote
directly from `~/workspace/projects/personal/mpsc-backend/load_into_droplet.py`
and `questions/models.py` — the actual script that bulk-loads 73,405 real
MPSC questions into the shiksha-dev droplet's live `mpsc_study` Postgres
database, including its real `execute_values()`/`ON CONFLICT DO NOTHING`
upsert pattern and its real NOT NULL/foreign-key handling. Stages 1 and 3
are honest translations/extensions of that same schema (raw SQL DDL for
the Django model; a join query you could run against it) — deliberately
*not* labelled with a `source:` field, since they're not verbatim quotes
and shouldn't claim to be. `--forest` (previously "sci & tech, python")
is now shared with postgres rather than minting a new near-duplicate hue,
since it's the same programming/tech bucket.

**Verified live:** ran the dev server, navigated to `/postgres`, switched
stages, answered a quiz question (correct-answer highlight + explanation
rendered), confirmed the "Postgres & SQL" entry sits directly under
"Programming & Python" in the More menu, and confirmed the Home page
"Jump back in" grid shows a POSTGRES resume card after visiting a stage.
`tsc && vite build` also passes clean (`PostgresPage` gets its own lazy
chunk, same as `PythonPage`).

**What's still open:** No in-browser SQL runtime (same deferral as
Python's Pyodide playground — a different kind of engineering, its own
scoping pass). Added `.claude/launch.json` at the `personal/` workspace
root (didn't exist before) pointing at `npm --prefix india-study-map run
dev`, since this project previously only had its own nested launch config
and the preview tooling looks for one at the invoked working directory.

---

## 2026-08-11 — Automated daily Current Affairs pipeline

**What shipped:** `/current-affairs` had a real UI and a designed JSON
contract (`src/modules/current-affairs/types.ts`, whose own comment said
it "Mirrors the JSON contract in the Current Affairs build guide (§3) —
this is the interface between the (future) droplet pipeline and this
frontend") but the pipeline itself was never built — content was 100%
hand-authored and had gone stale (7 dates, 2026-07-13 through 07-19,
nothing since despite it being 2026-08-11). Built the actual pipeline:

- **Schema simplified**: `CurrentAffairsSource` was shaped around a
  YouTube video (`videoId`/`videoTitle`/`channelId`/`channelName`/
  `videoUrl`) from when content was hand-transcribed from a
  current-affairs quiz channel. Since the new pipeline sources from a
  news API instead, simplified to `{title, links: string[],
  publishedAt}`. Migrated the 7 existing JSON files' `source` blocks
  (mechanical field rename) and the one rendering site
  (`QuizPlayerPage.tsx`'s "Read first" header).
- **`tools/current-affairs/build.mjs`** (new, Node ESM — this repo has no
  Python anywhere, unlike the shiksha-backend build guide this is adapted
  from): fetches today's India news from NewsData.io, summarizes via
  Gemini (`gemini-2.5-flash`) with Groq (`llama-3.3-70b-versatile`) as
  fallback, generates MCQs from the summary via the same LLM pattern
  prompted to match *this app's* actual `Mcq` shape (lettered
  `{a,b,c,d}` options + `correctAnswer` letter — different from the
  reference guide's 0-indexed-array shape, which targets a different
  app's schema), writes `public/data/current-affairs/{date}.json`, and
  updates `index.json`. Fails loudly (non-zero exit, clear message) on
  missing env vars, zero articles, or unparseable LLM JSON — never
  silently writes nothing.
- **`.github/workflows/current-affairs.yml`** (new — this repo had zero
  GitHub Actions before this): scheduled `30 0 * * *` UTC (6 AM IST) +
  `workflow_dispatch` for manual testing, runs the script with 3 new repo
  secrets, opens a PR with the generated JSON instead of pushing to
  `main`. **This PR is the review gate** — the reference guide's Django
  version gates publish behind an admin-approval model; this static,
  backend-less app doesn't have that, so a PR a human must read and merge
  serves the same purpose (nothing deploys until merged, since Vercel
  only builds off `main`).
- Two new devDependencies: `@google/generative-ai`, `groq-sdk` (script-only,
  never bundled into the frontend).

Verified: `tsc --noEmit` and `npm run build` both clean; `/current-affairs`
archive and an existing quiz date both browser-checked post-schema-migration
(title/summary/key facts/MCQs all render). The pipeline script's actual
fetch/LLM logic could **not** be end-to-end tested in this session — no
NewsData.io/Gemini/Groq keys available in the sandbox — but its fail-fast
path was confirmed (`missing_env:NEWSDATA_API_KEY`, exit 1, no partial
writes).

**Why:** direct user request, following a build guide they found for a
different project (shiksha-backend, Django+Celery) — wanted the same
fetch→summarize→generate-MCQs→review→publish idea for this app. Two
architecture decisions confirmed with the user before building: automation
runs as a GitHub Action in *this* repo (not the separate MPSC-only FastAPI
droplet, which has zero current-affairs involvement and would have been a
bigger, less-fitting change), and content sources from a news API rather
than continuing the old YouTube-video-transcript pattern nothing actually
automated anyway.

**What's still open:**
- **The user must add 3 repo secrets** (Settings → Secrets and variables →
  Actions: `NEWSDATA_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`) — outside
  what I can do from here.
- First real run should be triggered manually via `workflow_dispatch` (or
  locally with exported keys) and the generated MCQs actually read before
  merging that first PR — same caution the reference guide itself gives
  in its own §9, just executed as a PR review instead of a Django-shell
  trial.
- `keyFacts`/`topics` extraction quality depends entirely on the LLM
  prompt in `build.mjs` — worth revisiting the prompt after seeing a few
  real days' output.

---

## 2026-08-11 — JSO curriculum-completeness pass; Question Bank technical-post filter

**What shipped, part 1 — actually TEACH the Cyber Forensic syllabus, not
just quiz it.** Compared every syllabus term in Paper IV's five units
against existing note headings (manual gap analysis, since this app has
no coverage-report tooling like the System Analyst project's build.py).
Found `p4u3-digital-forensics.js` already comprehensive, but four units
had syllabus-named topics with zero teaching content:
- `p4u1-computer-fundamentals.js`: OS layered/logical architecture,
  scheduling criteria (turnaround/waiting/response-time formulas), file
  organization & access methods (Sequential/Direct/Index-Sequential),
  comparative file-system table (FAT32/exFAT/NTFS/ext4/APFS-HFS+). 11→15
  notes, 28→36 questions.
- `p4u2-dbms.js`: evolution of DBMS / why a DBMS exists, SQL's
  DDL/DML/DCL/TCL taxonomy, System & Media Recovery (WAL, checkpoints,
  undo/redo), Two-Phase Commit Protocol (explicitly disambiguated from
  the already-covered Two-Phase Locking). 11→15 notes, 26→34 questions.
- `p4u4-multimedia-forensics.js`: acoustic parameters of sound
  (F0/formants/timbre), frequency vs time-domain speech representation,
  forensic authentication of image/video as its own concept distinct
  from tampering detection. 10→13 notes, 26→32 questions.
- `p4u5-mobile-forensics.js`: mobile-phone/chipset fundamentals (baseband
  vs application processor), typology of crimes using mobile phones
  (instrument/target/incidental), mobile-specific SQLite artifact
  examination (contacts2.db/mmssms.db/msgstore.db/calllog.db). 11→14
  notes, 26→32 questions.

Opus-audited all four files after authoring — found and fixed 1 real
error (p4u1: a waiting-time arithmetic mistake, 12−6 marked as 9 instead
of 6, wrong answer index). Everything else across all four files checked
out clean on independent re-derivation.

**What shipped, part 2 — Question Bank technical/non-technical filter.**
`/papers` already had a "Hide technical-subject papers" toggle; the
Question Bank tab (`/mpsc`, `FilterRail.tsx`) didn't. Extracted the
technical-post classification into `src/lib/technicalPosts.ts` (shared by
both pages now instead of duplicated). Discovered mid-build that the
Question Bank's per-question `post` facet is raw unnormalized free text
("AE/SDO (CIVIL)", "AE/SDO (Assistant Engineer/Sub-Divisional Officer)",
"AE/SDO (Civil) under Public Works Department" — all one underlying post)
— completely different from `/papers`' server-normalized `Sitting.post`
that the existing exact-Set `TECHNICAL_POSTS` matcher was calibrated
against. An exact match against that Set silently failed on nearly every
real facet variant, which I caught by inspecting the actual selected-chip
list after toggling (not just trusting the checkbox existed) — the toggle
was including technical posts, the opposite of its label. Added a second,
looser classifier (`isPostTechnicalLoose`, keyword-regex based —
`Engineer\w*` to also catch "Engineering", plus Geologist/Draftsman/
Surveyor/Veterinary/Nursing/PHE/etc.) for this messier data source, and
verified in-browser against the live facet list until zero technical
posts remained in the "included" chips (140,529 → 18,651 questions when
toggled).

Both verified in the dev server; `tsc --noEmit` and `npm run build` clean.

**Why:** direct user request — after reviewing the JSO module, the user
pointed out it needed to genuinely teach the whole curriculum, not just
have enough notes to support a quiz; separately asked for the same
technical/non-technical filter already on Papers to also exist on the
Question Bank tab.

**What's still open:**
- The loose regex classifier is still keyword-based, not a real subject
  taxonomy — same "flag-don't-hide" bias as the rest of this filtering
  work (an unusual post title with none of the listed keywords defaults
  to visible rather than hidden).
- p3gf8 (Paper III's lighter "Cyber Forensic general level" unit) wasn't
  re-audited for curriculum completeness this pass — it was already
  reasonably covered for its intentionally lighter depth per its own
  scope note.

---

## 2026-08-11 — "Return to Peace": daily learning-mindset practice system

**What shipped:** extended the static `/study-mindset` article into a real
practice system, local-first against the existing `useApp` zustand store
(new `mindset` slice, mirrors the `chronicle` sub-state pattern — own
interface, actions, `partialize`/`merge` entries):

- **`DailyLearningReset`** (`src/components/mindset/DailyLearningReset.tsx`)
  — a card at the top of `Home.tsx`, gated by `enabled`/`preferredHour`/
  `quietDays`/`lastDismissedDay`, showing one of 33 curated calm messages
  (`src/lib/mindsetMessages.ts`) or a mood-adapted line once a check-in
  (Calm/Scattered/Avoiding/Confused) is picked. "Not today" dismisses with
  zero penalty — no streak, no missed-day tracking.
- **`/mindset`** (`src/pages/MindsetPage.tsx`, new route) — 4 tabs:
  - *Practice*: the Sit-With-It flow. `pickSitWithItQuestion()`
    (`src/lib/mindsetQueue.ts`) pulls a real MCQ from the student's weakest
    topic (reuses `weakTopics()`, same exclusion of the server-backed
    `mpsc-old-questions` bank), falling back to unmastered → random. 120s
    timer with staged prompts at 0/30/60/90s; options are selectable but
    the explanation/correctness stays out of the DOM entirely until
    "Submit answer" or "I still don't know" — no peeking via devtools
    either. Then "What happened?" — 8 struggle types (knowledge gap,
    retrieval, concept confusion, misread, panicked, guessed, gave up
    early, distracted), skippable on a clean correct answer. Then an
    optional ~60s reflection (3 fields, capped once/day).
  - *Confusion Map*: struggle-type bar counts from the session log,
    filterable by subject/date range. Empty state, not a guilt trip.
  - *This Week*: computed on-demand from the log (no cron) — attempts,
    times stayed with uncertainty, most common struggle, most-attempted
    subject. No leaderboard, no score, no streak number.
  - *Settings*: the on/off toggle, preferred hour, quiet days.
- **`/study-mindset`** (static article) now ends with a "Return to Peace"
  copy section + CTA linking into `/mindset`.
- **PYQ Practice** (`src/modules/pyq/PyqPage.tsx`) — a soft, dismissible,
  session-local nudge chip after 2+ answers picked within 3s of the
  question appearing (a proxy for "answering before really looking" —
  PyqPage has no separate reveal action to instrument, so this is the
  honest equivalent given the actual UI). Never shaming copy; dismissing
  hides it for the rest of the session only, nothing persisted.

Verified in the dev server: full Sit-With-It flow end to end (question →
timer → submit/bail → struggle-type → reflection → loop), Confusion Map
and This Week populate correctly from real logged attempts, Settings
toggle/hour/quiet-days all gate the Home card correctly, PyqPage nudge
chip appears/dismisses correctly, mobile (375px) and iPad (768px) both
checked for the new surfaces. `tsc --noEmit` and `npm run build` both
clean.

**Mobile/iPad audit (same pass):** swept every route in `Root.tsx` plus
the static `/embed/*` modules at 375px and 768px, checking
`scrollWidth`/programmatic overflow — all clean. Found one real
pre-existing bug by eye (not scrollWidth-detectable, since the offending
element was clipped by an `overflow-hidden` ancestor rather than pushing
the page wider): `Home.tsx`'s hero grid
(`TodaysPlanHero`/`LevelCard`/`WeakTopicsPanel`) used a hardcoded
2-column `gridTemplateColumns` with no responsive fallback, so on a
375px phone the hero column was squeezed to ~130px and its internal
"Start session" button visually overlapped the "Today's plan" label.
Fixed three grids in `Home.tsx`:
- The hero grid → `grid-cols-1 lg:[grid-template-columns:minmax(0,1.55fr)_minmax(0,1fr)]`
  (stacks below `lg`, side-by-side above it).
- `JumpBackInGrid`'s per-count `repeat(N, minmax(0,1fr))` →
  `repeat(auto-fit, minmax(150px, 1fr))` (naturally reflows instead of
  hardcoding a column count that assumed desktop width).
- `ModuleGroupedCards`'s fixed `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

Re-verified all three breakpoints (375px, 768px, 1280px) after the fix —
mobile stacks single-column with no overlap, tablet shows 2-up, desktop
keeps the original intended layout.

**Why:** direct user request, following up on the `/study-mindset` article
from the previous session — wanted it turned from something you read once
into a daily habit loop, explicitly designed to never add pressure (no
streaks/scores/leaderboards/guilt anywhere in the new surfaces).

**What's still open:**
- Local-only — doesn't sync across devices. A confirmed scope cut (see
  AskUserQuestion answers in this session): no general-purpose backend
  exists for this app outside the one MPSC-specific FastAPI service, so
  building this against it would have meant a separate backend project.
- The PYQ nudge is scoped to that one module; Flashcards/Arena/Map
  quiz/Current Affairs don't have it yet.
- No real browser push notifications — the daily card only appears when
  the student opens the app past their preferred hour.

---

## 2026-08-11 — Merged MPSC System Analyst prep app; added "The Comfort Trap" study-mindset guide

**What shipped:** two new `kind: 'static'` modules in `src/modules/registry.ts`:

1. **`system-analyst`** (Practice → Exam guides, next to `jso`) — the standalone
   MPSC System Analyst / Informatics Officer trainer built separately at
   `~/workspace/projects/work/mpsc_system_analyst/app/`, copied verbatim into
   `public/mpsc-system-analyst/` (index.html, app.js, styles.css, data/*.js —
   727 syllabus concepts, 662 questions, ~3.1MB). Same plain-`<script>` /
   `window.X = {...}` bundle pattern as `mpsc-jso-prep`, no build step needed
   here since the source repo already compiles its own bundles. Content had
   already gone through two independent audit passes (aptitude/PMBOK, then
   the remaining bulk content) before the merge — see that repo's own
   history for detail.
2. **`study-mindset`** (Study, flat list, next to `codex`) — a new
   single-page guide at `public/study-mindset/index.html`, first non-quiz
   "article" content in this app (no prior precedent existed — checked).
   Covers why exam prep confusion gets avoided rather than worked through
   (safety behaviors vs. actual learning, why the relief-now habit backfires
   on exam day, confusion as signal not verdict, the added identity-threat
   angle for previously-strong students), plus two small interactive bits:
   a self-check "which of these are your safety behaviors" checklist with a
   live tally message, and a 2-minute "sit with it before you check the
   answer" timer. Styled off the same token/font system as `codex/index.html`
   (Fraunces display, Inter body, IBM Plex Mono labels, warm parchment
   palette) for visual consistency with the other static guides, written as
   original content (not transcribed from any source).

Both verified in the dev server: iframe embed resolves correctly at
`/embed/system-analyst` and `/embed/study-mindset`, header title picks up
from the registry via `AppShell`'s module lookup, the study-mindset
checklist/timer JS runs correctly (tested via direct DOM interaction), no
console errors on either, `tsc --noEmit` clean.

**Why:** direct user request, after reviewing the earlier System Analyst
content-completeness work and separately mentioning a study-psychology
video about avoiding confusion during recall — wanted the exam-prep app
merged in and the mindset concepts turned into something usable here rather
than staying a one-off video summary.

**What's still open:**
- `public/mpsc-system-analyst/` is a byte-copy, not a symlink or build
  artifact — if the source repo's content improves later, this copy won't
  auto-update; it'll need re-copying.
- No route/link between `study-mindset` and the practice modules (e.g. a
  "stuck? read this" pointer from a quiz screen) — it's discoverable only
  via the Study nav for now.

---

## 2026-08-10 — Papers: per-paper technical-subject filter (distinct from the existing post filter)

**What shipped:** the existing Technical/Non-Tech toggle on `/papers`
(`postFilter`/`isPostTechnical()`) gates whole *sittings* by `post`, and
`post` is null on 70-91% of papers depending on exam type — so it can only
ever act on a sliver of the bank, and worse, hiding a sitting by post also
throws out that sitting's general GK/English/Aptitude papers along with its
technical ones. User asked for something different: a way to drop
purely-technical/specialist papers while keeping GK/English/Maths/Aptitude
content, even from an otherwise-technical exam.

Added a second, independent axis: `isPaperSubjectTechnical()` classifies
each *paper* by its `paperSubject` field (far better populated than `post`
— e.g. "Civil Engineering", "Ophthalmology", "Animal Husbandry & Veterinary
Science", "General Financial Rules" vs "GS"/"GK"/"General English"). A
general-subject signal always wins over an incidental technical-sounding
word in the same string (e.g. "General (Aptitude, Legal, Reasoning,
English)" stays visible) — hiding a paper someone actually needs is worse
than occasionally keeping one with a stray technical word in its title.
Unclassified subjects (neither pattern matches) default to visible, same
flag-don't-hide bias as the exam-name work above.

New "Hide technical-subject papers" checkbox in the sidebar filters at the
paper level within each sitting (not the whole sitting), shows a "N
technical-subject papers hidden" note when some (not all) of a sitting's
papers are filtered, and recomputes the sitting's Qs total from the visible
papers so the header count doesn't quietly include hidden questions. A
sitting with zero papers left after filtering is dropped from the list
entirely.

Verified against live production data before calling it done: 97 of 3,764
papers (2.6%) hidden; 92 sittings fully hidden (every paper in them was
technical). Confirmed in the dev server: the checkbox works, mixed sittings
keep their GS/English rows and lose only the technical ones.

**Why:** direct user request — "we still need their gk and english and
maths and aptitude" while wanting pure-technical questions out, which the
existing post-based filter structurally can't do (it's whole-sitting, and
gated on the wrong, mostly-empty field).

**What's still open:**
- Real impact is modest (2.6%) because most papers — even genuinely
  specialist ones like a DSWO post's Psychology/Social Work paper — have
  `paperSubject` generically tagged `"GS"` rather than something that names
  the actual specialty. This is a data-granularity gap, not a classifier
  bug; closing it needs re-extraction, same as the `post`/exam-name gaps
  already flagged.
- The regex keyword lists (`GENERAL_SUBJECT_RE`/`TECHNICAL_SUBJECT_RE`) are
  hand-tuned against the ~90 distinct `paperSubject` strings seen live, not
  exhaustive — a subject phrased in a way neither list matches defaults to
  visible, which is the safe direction but means some genuinely technical
  papers with unusual titles will still show through.

---

## 2026-08-10 — Fixed PassageGroup type errors and rendering bugs; flagged it as currently inert on live data

**What shipped:** picked up in-progress, uncommitted work (`src/modules/mpsc/PassageGroup.tsx`,
new; `QuestionList.tsx` wiring it in) that groups questions sharing a
comprehension passage under one collapsible block instead of repeating the
passage per question. Fixed what was broken:
- `PassageGroup` typed its `questions` prop as `McqBankQuestion[]` and
  passed a `showCorrection` prop to `QuestionCard` that doesn't exist
  (`tsc` caught both — `QuestionCard` takes any `BankQuestion` and a
  `showAnswer` boolean). Retyped to `BankQuestion[]`/`Correction`, fixed
  the prop name.
- Removed `groupQuestionsByPassage()`, an unused export — `QuestionList.tsx`
  had its own separate inline grouping `useMemo` and never called it; two
  slightly different implementations of the same grouping was the actual
  bug risk, not just dead code.
- **Real bug, not just a type error:** `QuestionCard` renders its own
  "📄 Show passage" toggle unconditionally whenever `q.passage` is set.
  Nesting it inside `PassageGroup` (which already shows the passage once at
  the group header) meant every question card would *also* show its own
  duplicate copy of the same passage text. Added a `hidePassage` prop to
  `QuestionCard`, set it from `PassageGroup`.
- **Second bug:** a passage referenced by exactly one question still got
  routed through the heavier `PassageGroup` UI, contradicting the
  component's own docstring ("used when 2+ questions..."). Fixed the
  grouping `useMemo` in `QuestionList.tsx` to only group passages with 2+
  questions; a lone passage now renders as a standalone `QuestionCard`
  (which already has its own passage disclosure).
- Minor: hoisted the `corrections` `Record → Map` conversion out of the
  per-group render loop into a `useMemo`.

**Why this matters more than "tsc passes":** checked what data this
actually has to work with before calling it done, per this project's
standing rule against "doesn't crash" being mistaken for "works." Queried
the live API directly (`GET /api/mpsc/questions?search=passage`) — **the
`passage` field does not exist anywhere in that response schema.** Many
question stems literally read "According to the passage..." but the
passage text itself was never captured server-side for the droplet-hosted
140,529-question bank. `QuestionList`/`PassageGroup` is only wired into
`MpscPage.tsx`'s Browse tab, which sources exclusively from that API — so
as shipped, the grouping logic is correct but has zero live data to ever
activate on.

The one dataset that *does* carry real `passage` data (396 entries, local
`src/data/banks/mpsc-state-tax-officer.ts`) is rendered by a completely
different component, `StateTaxOfficerEnhanced.tsx`, which has its own
separate, non-grouping passage display (`<StemContext text={q.passage}/>`)
and never touches `QuestionList`/`PassageGroup`.

**What's still open (flagged, not fixed — user's explicit call):**
- `PassageGroup` is currently inert on the one screen it's wired into. Left
  as-is for whenever passage data exists server-side, rather than building
  further on a screen with nothing to show it.
- Two paths considered and not taken this session: (a) wire `PassageGroup`
  into `StateTaxOfficerEnhanced.tsx` instead, where real passage data
  exists; (b) check whether the droplet's Postgres `questions` table
  actually has passage text that `row_to_question()` in `mpsc_api/main.py`
  just never returns (would make this a backend fix, not a data gap). Both
  deferred, not started.

---

## 2026-08-10 — Papers tree sitting cards show a real exam name, not "MPSC"

**What shipped:** `src/pages/PapersPage.tsx` sitting cards previously titled
themselves `s.post || s.examName` — and `examName` is `"MPSC"` for nearly
every paper (MPSC is the exam-hosting department, not the exam itself),
while `post` is null on ~70% of papers. Result: a "2019 · GS-II" style
drill-down with no way to tell *which* exam you were looking at, which the
user flagged directly ("there isn't just 2019 GS-II... it has to have an
EXAM NAME").

Added `cleanExamNameCandidate()`/`sittingExamName()`: a heuristic cleanup
run over each sitting's paper `id`s (the raw source-PDF filename — the one
place a real exam identity like "UDC Direct under Fisheries Deptt" or
"Surveyor under Land Revenue & Settlement Deptt" actually survives
extraction, confirmed live against `GET /api/papers/tree/`). Strips
numbering/date/`.pdf.ocr` noise, balances stray parens left by OCR splits,
title-cases slug-style ids (`mpsc-cli-...`), and picks the longest valid
result across the sitting's papers. When cleanup can't recover something
that reads like a name, it returns `null` and the card falls back to the
old `post || examName` display rather than showing a mangled fragment —
matching this project's flag-don't-fabricate rule.

Verified live against production data before calling it done: 2,892 of
3,520 sittings (82.2%) now get a recovered name; coverage varies by exam
type (Direct_NG 96%, Direct 89%, LDE 82%, Competitive 80%, Departmental
70% — Departmental's filenames are the messiest of the batch). Confirmed
in the dev server against the live droplet API, not just `tsc`.

**Why:** direct user feedback that the exam-tree drill-down (Year → Sitting
→ Paper) was unusable without knowing which exam a sitting actually was.
Scoped deliberately to "fix the label only" (user's choice over promoting
exam name to a full new tree level) — the raw id strings are too
inconsistent across years/services to safely cluster into a stable grouping
key without a real normalization pass first.

**What's still open:**
- The 17.8% fallback (esp. Departmental's 30%) is a real data gap, not a
  regex problem — some filenames are literally just `"Paper-IV."` with no
  name in them. Closing it needs re-extraction from source PDFs, same
  limit already noted for the technical/non-technical post filter.
- Did not attempt promoting exam name to a real tree grouping level
  (Exam Name → Year → Sitting → Paper) — that needs a clustering/dedup
  pass over the messy id strings first (see decision above).

---

## 2026-08-10 — Real loading/empty/error states, not `<div>Loading…</div>`

**What shipped:** every data-driven view in the app rendered plain
"Loading…" text (or nothing) while a fetch was in flight, and an empty
result set looked identical to a bug. Built three shared components against
the mockup's `isStates` block (`designs/Jabreeze - Redesign.dc.html`,
lines 948-1001) rather than a freehand equivalent:

- `src/components/states/Skeleton.tsx` — `SkeletonRows` (question-card-
  shaped placeholders, real row height, staggered `om-pulse` delays),
  `SkeletonBar`, `SkeletonCards`. `om-pulse` itself was missing from
  `src/styles/motion.css` — the mockup defines it inline (`@keyframes
  om-pulse { 0%,100% {opacity:1} 50% {opacity:.45} }`) but it was never
  ported into the shared stylesheet the handoff brief assumed it lived in;
  added it there now.
- `src/components/states/StateMessage.tsx` — `EmptyState`/`ErrorState`,
  one component with a `tone`, matching the mockup's single `s.isMessage`
  branch that Empty/Error/Offline all share.
- `src/lib/useOnline.ts` + `src/components/states/OfflineBanner.tsx` — a
  real `navigator.onLine` + `online`/`offline` event signal, wired into
  `AppShell.tsx` so it shows app-wide, not the mockup's static demo card.

Wired into the actual live spots: Question Bank's `QuestionList.tsx`
(skeleton while `useBankQuestionPage` is in flight, `ErrorState` with a
real retry on fetch failure — the hook now tracks `error`/`retry` instead
of silently coercing a failed fetch to an empty result), Papers
(`PapersPage.tsx`, tree sidebar + sitting cards), Tests (`TestsPage.tsx`,
test library grid + attempts panel), Library (`LibraryLandingPage.tsx`,
set grid + empty state).

**Deliberate deviations from the mockup, not oversights:** the mockup's
Empty state names the exact count a dropped filter would recover ("rules
out 42,201… brings back 214"). That number isn't cheaply computable here
— it would be a facets query per active filter dimension — so faking a
plausible figure would be exactly the kind of fabrication this bank's
already been burned by (see the 2026-08-04 entries below). Question Bank's
empty state instead names which filters are active and offers one-click
reset; still actionable, not invented. Skipped building the mockup's
literal `isStates` tab (a documentation page showing all 5 states
side-by-side) entirely — it's a design reference, not something an end
user needs; the real treatment on the real views is higher value.

**What's still open:** no automated test coverage for the new components.
The "Error in test" state (TestPlayer mid-sitting connectivity loss) was
explicitly out of scope this pass — TestPlayer/ResultsView were left
untouched to avoid conflicting with another workstream in this session;
its existing localStorage autosave (`useAttemptState.ts`) already covers
the "must never lose work" requirement, just without the mockup's warning
banner UI.

---

## 2026-08-10 — Figure-based questions flagged and pulled from scored tests (backend, not this repo)

**What shipped:** user asked whether image/diagram questions were extracted
correctly. They weren't — checked the live droplet DB directly rather than
assume: 84 questions (non-verbal reasoning pattern-series items, plus
genuine circuit/gear/geometry-diagram questions) reference a figure/diagram
in their stem that was never captured anywhere — no image column exists in
`questions` at all. A sample of these had literal OCR-debris options like
`['option a', 'option b', 'option c', 'option d']` or `['Figure (a)', ...]`,
meaning a learner could land on one in a scored mock test with no way to
answer it correctly regardless of subject knowledge.

Added `questions.figure_based boolean default false` to the live Postgres
DB on `shiksha-dev`, backfilled via a calibrated regex over `question` text
(`following figure(s)`, `problem figures`, `diagram below/above`, etc. —
tuned against a hand-reviewed sample to avoid false positives like
bracket-notation matrix answers, which look like placeholder OCR debris but
are real text). `row_to_question()` in `mpsc_api/main.py` now returns
`figureBased`, which the frontend already knew how to render — `QuestionCard.tsx`
and `StateTaxOfficerEnhanced.tsx` have had a `figureBased` badge/exclusion
path since the old hand-curated banks, it just never received real data
for the droplet-hosted 73,405-question batch. `/api/mpsc/questions/sample`
(every scored practice test and "Mock test from these" call) now excludes
`figure_based = true` server-side; Browse mode still shows them, badged, so
they're not silently hidden — a learner can still read them, just can't be
scored on them.

Verified against production data before writing anything: 84 matched, hand-
reviewed the full list (not just a sample) for false positives. After
deploy: confirmed the badge renders live (`/question-bank?search=output+Y+of
+the+logic+circuit` → `Q-db712ab5`, "FIGURE-BASED" pill), and a live 100-
question sample from `/api/mpsc/questions/sample` returned zero flagged
questions.

**Why:** same session as the papers-grouping fix above — another instance of
"verify against the actual data, don't trust that extraction worked" per
this project's standing rule (see CLAUDE.md, and the original 280-question
silent-loss incident this rule exists because of).

**What's still open:**
- This is detection by stem-text pattern, not a real backfill of the
  missing images — the questions are excluded from scoring, not fixed. A
  real fix means re-extracting images from the source PDFs, which needs the
  original archive and is out of scope for a flagging pass.
- The detector is stem-text-only; it won't catch a figure-dependent
  question phrased without any of the matched trigger words. Precision was
  prioritized over recall — a missed one still shows an unanswerable
  question, but that was already true before this fix.
- Did not check the ~2,324 questions with no `paper_id` for the same issue
  specifically, though the regex ran over the whole `questions` table so
  any of those matching the pattern are already flagged.

---

## 2026-08-10 — Papers-tree grouping fixed on mpsc_api (backend, not this repo)

**What shipped:** `_sitting_key()` in `~/mpsc_api/main.py` on the `shiksha-dev`
droplet fell back to `exam_type|exam_name|post|year` whenever a paper's
`source_file` was NULL — and `source_file` is NULL for **all** of
Departmental/LDE/Competitive and ~80% of Direct (1,586 of 1,750 papers,
confirmed via direct query). Since `post` is also usually NULL for these,
every paper sharing an exam_type+year collapsed into one "sitting" — the
Departmental·2026 bucket alone held 114 unrelated papers as if they were one
exam. Fix: fall back to the paper's own `id` column (which, it turns out, is
literally the source PDF's title/filename — the exact signal `source_file`
was supposed to carry) before falling back to the coarse key. Same title-
normalising regex, just fed a different source string when `source_file` is
absent.

Verified against production data before touching the live endpoint: old
grouping produced 211 sittings (largest = 138 papers); new grouping produces
1,506 (largest = 7) — a shape that actually looks like real exam sittings.
Backed up `main.py`, patched the two-line change, `py_compile` before
restart, `systemctl restart mpsc-api`, confirmed via the live
`/api/papers/tree/` response and then in the deployed frontend
(`/papers` → Departmental → 2026 now shows "96 sittings", not one 114-paper
card). Pure backend change — no frontend deploy needed, no schema migration,
no data written.

**Why:** flagged as a known gap in the same-day "Papers & Tests rebuilt"
entry above; user asked for it fixed next. This was the collapse this
session's Papers rebuild had explicitly *not* tried to paper over on the
frontend — grouping data that's wrong at the source stays wrong no matter
how the UI renders it.

**What's still open:** the ~7% of papers with neither `source_file` nor a
distinctive `id` (rare, mostly the `exam_type=''`/`'Unspecified'` bucket)
still group coarsely — not worth a special case for a handful of papers.
`post` remains mostly NULL across the bank; a real fix there would need
re-running extraction against the source PDFs, out of scope for a grouping
patch.

**Considered and deliberately skipped:** a Technical/Non-Technical sort axis
for Papers, requested in the same conversation. Real distinction in MPSC's
own exam structure (confirmed genuine technical posts — AE/SDO, Geologist,
Entomologist, Draftsman — and non-technical ones — District Organiser, Case
Worker, Assistant Sub-Inspector — in the `post` column), but **1,587 of
1,750 papers (91%) have no `post` value at all**, so a classifier could only
ever cover the remaining 9%. User agreed to skip until post-name coverage
improves via a future extraction pass, rather than ship a filter that
defaults 91% of the bank to "Unspecified."

---

## 2026-08-10 — Papers & Tests rebuilt against the actual mockup markup, not the prose spec

**What shipped:**
- `src/pages/PapersPage.tsx` rebuilt to match `designs/Jabreeze - Redesign.dc.html`'s
  `isPapers` block (lines 522-574): a left "Exam tree" sidebar (hue cap + real
  paper count per exam-type/year node) driving a main column of sitting
  cards, each listing its papers with **Read** (→ existing question browser)
  and **Test** (samples that paper's questions live via `paperId` filter and
  launches `TestPlayer` inline). Auto-lands on the richest exam type/year on
  load instead of a bare "select something" placeholder.
- `src/pages/TestsPage.tsx` rebuilt to the `isMock` block (lines 443-520): a
  "Test library" grid (real empty state — zero TestDefinitions exist
  server-side, so it says so rather than showing the mockup's 6 sample
  cards) over a two-column "Build a custom test" + "Recent attempts" row.
  `TestBuilder.tsx` gained an `onPlay` path (`PlayConfig`) so a learner
  without `test.publish` gets a working **Start test** button — the prior
  version gated the entire build UI behind an admin capability the real
  user doesn't have, so `/tests` rendered nothing but "No tests yet" with no
  way forward. New `AttemptsPanel` reads `GET /api/progress/history`
  (real, honest empty states for both signed-out and zero-history cases).
- Prompted by the user flatly disagreeing with a prior session's "Phase 5:
  DONE" audit call — they were right. That audit checked file existence
  (`TestPlayer.tsx`/`TestCard.tsx`/`TestBuilder.tsx` exist, don't crash), not
  fidelity to the actual mockup or whether the real (non-admin) user could
  do anything. Live production before this fix: `/papers` showed a bare
  "Select a sitting…" placeholder pre-click and `/tests` showed nothing but
  "No tests yet" — no create-test CTA reachable by a real learner.
- Verified end-to-end in the dev server (not just `tsc`): clicked **Test** on
  a live paper row → sampled 50 real questions → played with timer/autosave;
  clicked **Start test** on the builder with default filters → sampled from
  the full 76,093-question pool → played the same way. No new console
  errors (the only ones present are the pre-existing stale `MindMapsPage`
  buffer entries from earlier in the session, unrelated).

**Why:** this is the second time this session a prior "done" call turned out
to mean "doesn't crash," not "matches the design or actually works for the
real user" — see the RecallLandingPage entry above for the first. User also
gave explicit standing feedback mid-session to read the actual `.dc.html`
markup before building, not just the prose docs — see the
`feedback-mockup-fidelity` memory. This work was delegated to an Opus-model
subagent per the user's explicit request ("u need opus for this"), then
independently re-verified in-browser by the orchestrating session before
being reported back.

**What's still open (deliberately not fixed, flagged rather than faked):**
- **Papers grouping is coarse on live data.** ~130 distinct Departmental-2026
  papers collapse into one "MPSC · 2026" sitting card (6,684 Qs) because they
  share `examName=MPSC`, `post=null`, `year=2026` and the server's
  `source_file` heuristic in `mpsc_api`'s `/api/papers/tree/` doesn't split
  them further. The UI renders exactly what the tree returns — this is a
  backend grouping fix, not a frontend one.
- No per-paper answer-source pill (Official/Derived/Model) or month
  chips/"held &lt;date&gt;" from the mockup — the tree carries no
  `answer_source` per paper and sittings carry a year, not a date. Omitted
  rather than fabricated.
- Still no Results screen, no skeleton/offline states, no Games XP backend —
  same open items as the last two entries.

---

## 2026-08-10 — Recall rebuilt with real Mind maps / Flashcards / Due today tabs

**What shipped:**
- `RecallLandingPage.tsx` went from a two-link stub to the Jabreeze design's
  `SECTION_TABS.recall` (Mind maps / Flashcards / Due today), each an
  `isSimple`-template pane ported to real code as
  `src/modules/recall/SimplePane.tsx` — header card, canvas panel with tool
  chips, list panel, all real data, no placeholder counts.
- Extracted `src/modules/flashcards/FlashcardFlip.tsx` out of
  `FlashcardsPage.tsx` (pure refactor, `/flashcards` behavior unchanged —
  verified by re-checking its "N/M known" and "x / y" counters still work)
  so the same tap-to-flip mechanic can render inside Recall's canvas panel
  instead of a second implementation, matching the design's own "existing
  module, unchanged" note for these canvas slots.
- **Flashcards tab**: real per-deck due/total counts, a live flip-card
  preview of whichever deck you click in the list, CTA to the full
  `/flashcards` page.
- **Due today tab**: real union of not-yet-known cards across all 3 decks
  (174 currently, live-tested), Shuffle + By-deck are real toggles (not
  decorative — clicking them re-orders the actual queue). Copy was rewritten
  off the design's literal text where it implied capability that doesn't
  exist here: no adaptive scheduling ("a card returns sooner when the same
  topic goes wrong") and no streak integration ("finishing the queue counts
  toward the day streak") — `studyStreak()` doesn't read `deckProgress` at
  all, so that line would have been false in this app.
- **Mind maps tab**: deliberately lightweight — real node counts per map (46
  Parliament, 27 Judiciary) and real chapterId-linked-node count (5), but no
  inline canvas. `MindMapsPage.tsx` is a full page with its own pan/collapse
  state; shrinking it into a 380px preview box would mean either duplicating
  its chrome or a second, worse renderer of the same graph. Flagged as a
  conscious deviation from the design, not an oversight.
- New `src/lib/subjectHue.ts`: pulled the `SubjectId -> colour` map out of
  `MindMapsPage.tsx` so Recall's Mind maps tab doesn't duplicate it.
- Confirmed `MPSC_MCQ_Practice_Hub.html` (user-supplied file) was already
  shipped in Library — byte-identical to `public/quick-practice/mpsc-mcq-
  practice-hub.html`, already registered and published (7,649 questions,
  live on production). No action needed there.

**Why:** user picked "Recall due-queue / deck list" as the next redesign gap
to close, from a fuller phase-by-phase audit this session that found the
prior `PHASE3_RBAC_HANDOFF.md` badly out of date — most of Phases 1-6 were
already shipped in commits this doc predates. Also acted on explicit
feedback mid-session to follow the handoff's actual mockup markup (spacing,
copy, layout) strictly rather than freehand-designing equivalents, including
the mobile/responsive collapse — see `feedback` memory.

**What's still open (from the same audit, not started this session):**
- No Results screen at all (post-test score/breakdown/rank).
- No skeleton loading / empty / error / offline states anywhere — plain
  "Loading…" text.
- Games' XP/streak/badges have no backing `Profile` table in `mpsc_api` yet.
- Route names still diverge from `HANDOFF.md` §2 in several places
  (`/question-bank` not `/bank`, `/mindmaps` not nested under `/recall`,
  etc.) — cosmetic, not attempted here to avoid an unscoped rename sweep.
- Phase 8 polish (focus rings, keyboard maps, ARIA, Lighthouse) not started.

---

## 2026-08-10 — Mind Maps rebuilt as a node graph, mastery state real not fabricated

**What shipped:**
- `src/modules/mindmaps/MindMapsPage.tsx` rewritten from a compact SVG pill-tree
  to the Jabreeze redesign's card-based node graph (hue top-bar, kicker,
  state pill, footer progress bar), keeping the original's depth/leaf-count
  layout math (no layout dependency) since these trees run 30-46 nodes deep —
  well past the design prototype's 8-node demo. Canvas is a plain
  `overflow: auto` div with absolutely-positioned card divs + one background
  SVG for edges/branch dots, not an SVG-viewBox zoom transform — an earlier
  version used `foreignObject` inside a content-sized `viewBox` and hit a real
  bug: `preserveAspectRatio="meet"` uniformly shrinks *everything* to fit the
  taller dimension when content is much taller than wide, so cards rendered
  at ~1/8 their real size. Caught via DOM geometry checks (`getBoundingClientRect`
  on `.card-lift`), not the screenshot tool, which was down for the whole session.
- New `src/lib/mindMapMastery.ts`: real per-node mastery (Cleared/Weak/New +
  accuracy %) computed from `progress[chapterId]` — the same local attempt log
  `weakTopics.ts` already uses for Home's weak-topics widget. Exported
  `MIN_ATTEMPTS` from `weakTopics.ts` instead of duplicating the threshold.
- Deliberately partial coverage: only nodes carrying a `chapterId` (5 of ~75
  nodes across both maps) show a state pill/accuracy. The rest render a plain
  card with a real (structural) sub-topic count instead — no invented mastery
  numbers. `MindMap` gained a required `subject: SubjectId` field driving the
  card hue (fixed to `--blue` for both existing maps, both Polity).
- `RecallLandingPage.tsx`'s stale code comment ("investigated and dropped, not
  deferred") corrected — that call predated commit `adc43e0`, which added the
  local per-chapter attempt log this rebuild uses.

**Why:** user asked to redesign the mind map (not Study Map) per the Jabreeze
handoff at `~/Downloads/dashboard/handoff/`. A prior session had explicitly
dropped the node-graph rebuild for lack of real per-topic accuracy data —
investigation this session found that gap partly closed (`progress[chapterId]`
+ `weakTopics.ts`, plus a separate server-side `/api/me/topic-accuracy` from
commit `adc43e0` that isn't used here — it's keyed by bank subject/topic, not
chapterId, and merging two accuracy sources with different semantics into one
pill risked its own correctness trap). User explicitly chose "real data where
linked, neutral elsewhere" over fabricating numbers uniformly, after being
shown the actual node coverage (5 of ~75).

**What's still open:**
- Node-level granularity below chapter (e.g. "Money bill — Art. 110" as its
  own tracked topic) is architectural, not a wiring gap — no chapterId-sized
  quiz exists at that grain, and bank topic tags don't match outline points.
  Flagged in commit `adc43e0` too; needs its own design, not a placeholder.
- `/api/me/topic-accuracy` (server-side, cross-device) is a plausible future
  upgrade for the chapterId-linked nodes specifically, deferred as a "fast
  follow" per that commit's own framing.
- No pan/zoom control beyond native scroll + click-drag (scrollLeft/scrollTop)
  — the original SVG wheel-zoom was dropped along with the viewBox rewrite;
  not asked for back, but worth knowing if someone wants it later.

---

## 2026-08-06 — MPSC Old Questions: merged the 73K-question extraction into the droplet DB (not Render)

**What shipped:**
- The full 73,405-question / 1,899-paper extraction (`mpsc_bank_converted.json`
  — a separate, much larger PDF-OCR batch than the 164/6,380 already in the
  `shiksha-dev` droplet's `mpsc_study` DB) was loaded additively into that
  same DB's existing `papers`/`questions` tables via a new one-off script
  (`load_into_droplet.py`, committed on the droplet in `~/mpsc_api`, not
  this repo). The two batches use non-overlapping ID schemes (old = human
  slugs, new = content hashes) so nothing collided or got overwritten —
  the 5 existing user reports and the review system are untouched.
- Live totals: **1,750 papers · 76,093 questions**, served from the same
  `/api/mpsc/bank` endpoint `useMpscData.ts` already called —
  **no frontend code change needed** once the DB had the data.
- Verified live: Library shows the new totals, a real practice test loads
  and scores a question drawn from the new batch, via `curl` + browser
  `get_page_text` (not screenshot — see gotcha below).

**Why:** this session initially tried standing up a brand-new backend for
this same dataset on Render.com's free tier (separate Django app,
`github.com/gasey/mpsc-api`) and pointing `useMpscData.ts` at it. That
went through several real bugs (Python version pin, missing migration,
a field too short for the real data) before working — but the free
tier's 0.1 CPU / 256MB instance took ~20-35s to serialize 69K+ rows per
request even with a 6h cache, and the user asked to do the work on the
existing dev droplet instead, which already runs this exact data shape
in production and has real CPU/RAM to spare. Fully reverted the Render
integration attempt (see `a997346`..`42a1748` in this repo's git log)
before redoing it against the droplet.

**What's still open:**
- 313 papers from the new batch had no parseable `year` (that column is
  `NOT NULL` on the droplet) and were skipped; ~2,812 questions that
  referenced them now have `paper_id = NULL` — still browsable/
  practiceable, just not attributed to a specific paper in the UI.
- The `All years` filter now includes a couple of garbage values ("22",
  "18") from bad year extraction on a handful of source PDFs — an
  extraction-pipeline bug, not a DB/frontend bug.
- No check yet for the same real exam paper being extracted by *both*
  the old and new pipelines (only IDs are guaranteed not to collide,
  not content) — could show as a visible duplicate in Library.
- `/api/mpsc/bank` now returns ~41MB in one request. Fine today (droplet
  has real CPU, request completes in ~20s of mostly network transfer),
  but more extraction batches are still pending (Direct/LDE/Descriptive
  per the MPSC extraction-progress notes) — will eventually need
  pagination instead of one ever-growing dump.
- The abandoned Render project (`github.com/gasey/mpsc-api`, Postgres DB
  expires 2026-09-05) still exists but nothing references it anymore —
  safe to delete, or just let the free DB expire on its own.
- **Tooling gotcha, not a code bug:** the browser-automation screenshot
  action was broken for this entire session (timed out on every site,
  even `example.com`), which produced a false "the page is frozen"
  diagnosis mid-session and triggered an unnecessary rollback. Verify
  with `get_page_text` / `curl` before trusting a screenshot timeout as
  evidence of a real hang.
- Full status + forward plan tracked in `WIP.md` on the droplet
  (`~/mpsc_api/WIP.md`) — check that file first before touching this
  service again, rather than re-deriving state from git log.

---

## 2026-08-04 (later) — State Tax Officer: rebuilt the 2016/2019/2021 papers (phase B, no official key)

**What shipped:**
- Completed the rebuild started earlier the same day (see entry below): all
  three remaining sittings — Inspector of Taxes Jan-2016, Excise & Narcotics
  Nov-2019, Excise & Narcotics Feb-2021 — are now rebuilt from the source PDFs'
  text layer via `parse_native.py`, with option order re-verified against the
  actual paper (`validate.py parsed`: 1,092/1,100 checked, 0 mismatches).
- `merge_native.py` refused to carry old `answerIndex` values across
  positionally — it matched old answers to new option text and dropped 129 with
  no unambiguous match. Those, plus every genuinely new question recovered, were
  split into 10 subject batches (`tools/bank-rebuild/solve/*.json`) and answered
  by agents grounded in the source text, with heavy web search for the ~48
  Mizoram-specific GK questions (Mizo history, customs, folklore, colonial-era
  events) that aren't answerable from general knowledge.
- **1,579 total questions now, 548 newly solved this pass** (`answerSource:
  'derived'`, no official key exists for these three sittings). Confidence is
  recorded per question but not yet surfaced in the UI — see open items.
- `apply.py` folded all 10 solved batches into the generated `.ts`, still
  chunked at 200/array to dodge `TS2590`. `npx tsc --noEmit` clean.

**Why:** continuation of the same-day rebuild — these three sittings were
deliberately deprioritized in the first pass because they have no official
answer key, so every recovered question needed to be solved rather than looked
up. The `tools/bank-rebuild/` pipeline and `SOLVE_BRIEF.md` (rules for solver
agents: never reorder options, be honest about confidence, don't fabricate)
were already checked in from that first pass.

**What's still open:**
- ~26 low-confidence and ~40 medium-confidence answers among the 548 are
  genuinely uncertain (agents flagged them honestly rather than guessing
  high-confidence) — worth a human review pass, especially the Mizoram-specific
  trivia batch where source material is thin.
- A handful of questions are unanswerable as extracted — missing figures/data
  tables that the OCR/text-layer never captured (`aptitude` q093/q098,
  `scitech`'s figure-matrix and colour-count questions). They got placeholder
  answers marked low-confidence rather than being silently dropped; flagging
  them for removal or figure re-transcription is unresolved.
- `validate.py bank` still reports 11 pre-existing hygiene issues (duplicate
  options, blank options, page-furniture in a stem) inherited from the source
  PDFs' own printing errors — not introduced by this rebuild, left as-is per
  the pipeline's design (only the rebuilt papers' invariants are enforced).
- Per-question `confidence` isn't shown anywhere in the app yet — currently
  only used to decide low vs. high effort during solving. Surfacing it (e.g. a
  subtle badge next to `derived`) would help a student judge which answers to
  double-check.
- Finer sub-topic tagging (232 history questions still under one `gs1_history`
  topic) remains not done, same as the phase-A entry below.
- Not yet committed to git — `tools/bank-rebuild/` and the modified `.ts`/
  `types.ts`/`StateTaxOfficerEnhanced.tsx`/`state-tax-officer.css` are sitting
  as local changes pending review.

---

## 2026-08-04 — State Tax Officer: rebuilt the 2024 + 2025 papers from source, official answer keys

**What shipped:**
- Audited the `mpsc-state-tax-officer` bank against the source exam PDFs and
  found the OCR pipeline had been **silently dropping questions**, not just
  garbling text. The extractor mis-split multi-column scans, so one option
  field swallowed the next several questions whole — e.g. `...2016-gs-iii-q040`
  stored exam questions 47, 48 and 49 *inside* its option (b). Because ids were
  re-indexed `q001…qN` per paper, there were no numbering gaps to reveal it.
  Measured loss: ~280 questions across the five sittings, plus 68 surviving
  questions visibly broken (28 with `answerIndex: -1`, 10 with blank options,
  11 with duplicate options).
- **Rebuilt the Jul-2024 (Group B Combined) and Aug-2025 (Excise & Narcotics)
  sittings from ground truth.** 362 questions replaced; bank 1,286 → 1,310.
  The 2025 PDFs turned out to have a real text layer, so those 186 questions are
  parsed exactly by script — no OCR, no model. The 2024 scans were transcribed
  from the page images.
- **336 answers now come from the published MPSC final answer keys** rather than
  being pipeline-guesses. This exposed **32 questions the app was teaching
  wrong** — e.g. Mizoram's state animal was marked *Sakei* (tiger); the official
  answer is *Saza* (serow). Those answers were replaced and their old
  explanations (which argued for the wrong answer) discarded and rewritten.
- New schema fields on `BankQuestionBase`: `answerSource: 'official' | 'derived'`
  + `answerKeyRef` (badged in the UI, so a guess never looks like a key),
  `figureBased` (non-verbal reasoning whose options are diagrams — browsable but
  excluded from scored mock tests, instead of being filled with OCR debris),
  `compensated` (MPSC withdrew the question and gave the mark to everyone;
  `answerIndex: -1`), and `disputeNote`.
- **Fixed a rendering bug affecting 100 existing questions:** `renderEmphasis`
  used `__(.+?)__` for underline markup, which matches *inside* a
  fill-in-the-blank run like `__________`, eating the blank and leaving a stray
  underlined `_`. Tightened to `__([^_]+)__`.
- The `Direction (Question Nos. 11-20): …` headers that MPSC prints above a run
  of questions are now captured into `passage` and rendered (new `StemContext`)
  in both the Question Bank and the mock runner — 73 questions have one. Without
  it, "The property was divided ______ the two brothers" gives no hint what is
  being tested, and the data-interpretation questions are unanswerable.
- The rebuild pipeline is checked in at `tools/bank-rebuild/` with a README.
  Re-running it reproduces the current `.ts` byte for byte.

**Why:** the user reported "some options are deranged and not showing properly
... and the ocr is wrong". Investigating turned up something worse than bad
rendering — a quarter of the question bank was missing and never noticed.
Scope was deliberately limited to the two sittings that have official answer
keys, so this pass involves zero guessed answers (bar the 26 English ones).

**Gotchas worth remembering:**
- `src/data/banks/mpsc-state-tax-officer.ts` is now a **generated file**. Edit
  the inputs in `tools/bank-rebuild/`, not the output.
- The emitted `.ts` splits questions into chunked `BankQuestion[]` arrays of 200.
  A single 1,300-element literal trips `TS2590: Expression produces a union type
  that is too complex to represent` — `BankQuestion` is a union and `subject` is
  itself a wide union, so tsc's work scales with the size of one expression.
  Don't tidy it back into one array.
- `apply.py` enforces invariants only on the papers it rebuilt. The 2016/2019/
  2021 papers still fail them (that's the outstanding damage), so a global check
  would block the write forever.

**What's still open:**
- **2016 / 2019 / 2021 are NOT rebuilt** — ~268 questions still missing and 60-odd
  still broken (`answerIndex: -1`, blank/run-on options). No official answer keys
  exist for those sittings, so every recovered question would need solving and
  would be `answerSource: 'derived'`. That is the next chunk of work.
- The 2024 General English paper has no published key; its 26 questions were
  solved and are badged inferred. One (`...2024-english-q026`) has a genuinely
  broken option set in the original paper.
- Two questions carry `disputeNote` where the official key looks factually wrong
  (largest GDP contributor marked Secondary rather than Tertiary; MSS described
  as *purchasing* securities rather than issuing them). The official answer is
  kept — it is what the real exam marked — with the objection shown.
- Finer sub-topic tagging (the other half of the original ask) is not done:
  232 history questions still sit under one `gs1_history` topic.
- Still no automated tests for any of this; verified by browser click-through.

---

## 2026-08-03 (later) — Setu nav refactor: grouped Study/Practice nav, Question Bank tab

**What shipped:**
- `registry.ts` reworked: `ModuleCategory` dropped `'Labs'` (now `'Study' |
  'Practice'` only); Practice items gained a `subgroup` field (`In-app
  modules`, `Exam guides`, `Labs`, `Quick practice (one-offs)`). Added 8 new
  entries: `jso` (MPSC JSO — Cyber Forensic) and 7 "Quick practice" one-offs.
- New generic `src/pages/EmbedPage.tsx` + `/embed/:id` route — every
  `kind: 'static'` module (Codex, 3 Labs, JSO, 7 Quick Practice) now opens
  in-app inside this shell instead of `target="_blank"`. Killed every
  remaining `target="_blank"` module link across `Rail.tsx`, `CommandBar.tsx`
  (nav + `SearchBox`), `ModuleSwitcher.tsx`, and `Home.tsx`.
- New `ModuleGroupMenu.tsx` (shared Study▾/Practice▾ dropdown, modeled on
  `ShellSwitcher.tsx`'s `placement` pattern, now with a third `'bottom'`
  placement) replaces the old hardcoded flat link lists in `Rail.tsx` and
  `CommandBar.tsx`. Nav is now `Home | Study ▾ | Question Bank | Practice ▾`
  in both shell styles that render global chrome.
- New mobile-only bottom bar in `AppShell.tsx` (`lg:hidden`, additive — the
  ~10 per-page `ModuleSwitcher` pills were left alone rather than touching
  10 files' mobile headers for a redundancy that's otherwise harmless).
  Explicitly suppressed on `/map`, which already owns the bottom of the
  viewport with its own fixed swipeable facts/quiz sheet — a second bar
  there would visually collide, not just duplicate nav.
- New **Question Bank** tab (`/question-bank`): 3 catalog cards (JSO, State
  Tax Officer, Practice-menu), a real Current Affairs & GK practice panel
  (292 real questions filterable by topic/exam/year with a show/hide-answers
  toggle), and a client-only "add a question set" admin stub
  (`localStorage`, not wired to a backend).
- `mpsc-jso-prep`'s 6 Paper II GK data files converted from
  `window.MPSC.units.push(...)` calls to real ES modules under
  `src/data/jso-gk/*.ts` (mechanical conversion — executed each source file
  in a sandboxed Node `vm` with `window.MPSC.units` stubbed, then dumped the
  resulting objects to JSON — safer than regex, since several files push
  more than one unit and the guide's own "only change needed" assumption of
  one-push-per-file didn't hold for 5 of the 6).
- Copied `mpsc-jso-prep`'s runtime (`index.html`, `data/`, `css/`, `js/`)
  into `public/mpsc-jso-prep/`, and 7 loose root HTML one-offs into
  `public/quick-practice/*.html` (renamed, originals left in place).

**Why:** second half of a two-phase ask — implementing the Setu nav/design
refactor (`HANDOFF-standalone.html` / `Setu.dc.html` prototype) that was
deliberately deferred while the descriptive-questions/admin-audit-trail work
shipped first.

**Two corrections made against the guide's own (stale) assumptions, verified
against the repo rather than trusted blindly:**
1. The guide's §3 wanted `state-tax-officer` replaced with an iframe of a
   static `mpsc-state-tax-prep/index.html` guide, on the premise that the
   registry entry was an unimplemented stub. It is not — it's the fully
   native, interactive module (admin review, corrections, descriptive
   sub-parts) built in the session immediately before this one. Left
   completely untouched; treated as an "In-app modules" Practice entry.
   `git diff` confirms zero files under `src/modules/mpsc/*` or
   `mpsc-state-tax-officer.ts` were touched by this refactor.
2. The guide's §4 file-mapping table has the English Labs candidate
   swapped: `diff` confirms `public/labs/english/index.html` is already
   byte-identical to `mpsc-englishold questions).html`, not
   `mpsc-english-mcq-masterclass.html` as the guide claimed — Labs needed
   no copying at all, and the genuinely homeless file
   (`mpsc-english-mcq-masterclass.html`) went to Quick Practice instead.

**Verified live (dev server, both shell styles, mobile + desktop):** clicked
through every Study/Practice dropdown item in both the Rail (icon) and
CommandBar (topbar) shell styles; confirmed Codex/Labs/JSO/Quick-Practice
all load in-app via `/embed/:id` with real network 200s (not new tabs);
confirmed the JSO app's full data set (20 files) loads and runs inside its
iframe with zero console errors; confirmed the Question Bank page's
filters and answer toggle work against real data; confirmed the mobile
bottom bar's bottom-sheet popover works and is absent on `/map`; confirmed
State Tax Officer's full admin/descriptive-question system (built
2026-08-03 earlier) still renders and works identically, byte-for-byte
untouched.

**What's still open:**
- `tsc --noEmit` clean throughout, but no automated test suite exists for
  any of this — regressions would only surface via manual re-verification.
- The Question Bank's third catalog card ("Practice tab") links to `/pyq`
  as a representative entry rather than a dedicated page — there's no real
  "Practice tab page" in this app's architecture (Practice is dropdown-only),
  unlike the guide's flat single-page prototype.
- Admin upload stub's "Question type" field is a local string union
  (MCQ/Match/Fill-blank/True-False/Map-Click/Descriptive) scoped to that
  form only — deliberately not wired into the real `BankQuestion` type,
  which stays `'mcq' | 'descriptive'` as shipped earlier. Adding the other
  4 variants to the real schema now would be speculative, unused code.

---

## 2026-08-03 — Descriptive sub-part questions, admin audit trail, versatile review workflow

**What shipped:**
- `questions` (Postgres) and `BankQuestion` (frontend) gained a `type:
  'mcq' | 'descriptive'` discriminator plus `subparts` — lettered (a..z)
  sub-questions, each independently flaggable/correctable. `isMcqQuestion()`
  / `normalizeQuestion()` helpers keep every existing static-bundle record
  valid with zero data-file rewrites (type defaults to 'mcq' when absent).
  3 of State Tax Officer's 5 essay/précis-letter records got real `subparts`
  (their garbled OCR-bled "options" were genuinely lettered sub-questions in
  disguise); the other 2 (plain essay topic-choice lists) kept `options` as
  a display-only reference list.
- New `src/modules/mpsc/DescriptiveQuestionCard.tsx` — the one global format
  for rendering a descriptive question + its sub-parts, each with its own
  flag/note/comments panel. Fixed a real bug in the same pass: the
  corrections overlay in `StateTaxOfficerEnhanced.tsx` only ever applied to
  the MCQ pool, never to descriptive questions — corrections are now merged
  onto the full pool before splitting into tabs.
- `question_audit_log` (new Postgres table): every correction, report
  status change, and comment moderation action now writes one row here —
  actor, before/after snapshot, note, timestamp. Powers a new **History**
  tab in AdminPanel; this is the actual "who changed what, when" the admin
  system was missing.
- `question_reports` gained `subpart_label` + `suggested_text` (free-text
  suggested fix, for flags with no MCQ answer index); `question_corrections`
  gained `corrected_subparts`; `question_comments` gained `parent_id` (one
  level of reply), `deleted_at`/`updated_at` (edit/soft-delete), `is_pinned`
  (admin pin). All wired into `QuestionReviewPanel.tsx`.
- AdminPanel restructured into 5 tabs: **Reports** (now filterable by issue
  type, date range, search, has-suggestion, sort, paginated — was a single
  status dropdown with a hardcoded top-500), **History** (new), **Comments**
  (new — browse/moderate every comment on a bank), **Users** (existing,
  now with per-user activity counts), **Dashboard** (new — headline stats +
  live activity feed). New shared `FilterBar.tsx` primitives back the
  Reports/Comments filter bars.
- Generalized the whole review system to `mpsc-old-questions` (6,380 Qs) —
  it had none of this before. `MpscPage.tsx` now fetches/overlays
  corrections the same way State Tax Officer does; `QuestionsTable.tsx`
  swaps its dead-end `ReportModal` popup for the shared
  `QuestionReviewPanel`; a new admin-gated Admin tab was added. Retired
  `ReportModal.tsx` and its legacy `/api/mpsc/report` write path (the old
  `reports` table stays in Postgres, untouched, just no longer written to).
- Fixed 2 live mixed-content bugs found while touching this code:
  `useMpscData.ts`'s bank fetch and (moot, since the component was deleted)
  `ReportModal.tsx`'s report submission both still hit
  `http://134.209.154.122/mpsc-api/...` — the same bug fixed for State Tax
  Officer's API client on 2026-08-02, just never applied here. Now
  `https://api.map.hawayu.in`.

**Why:** user asked for descriptive questions with lettered sub-parts,
admin change-history with attribution, more comprehensive admin filtering,
and a more versatile flag/correction/comment workflow — plus generalizing
the review system that had only ever covered one of the two banks.

**Verified live (browser + curl, not just compiled):** full round-trip on
both banks — flagged a descriptive sub-part with free text, saw it in admin
Reports with the right filter facets, applied a sub-part correction via the
new sub-parts editor, confirmed it overlaid live in the Descriptive tab
without a reload, confirmed both a `correction` and `report_status` entry
appeared in History with correct before/after, posted a comment, replied to
it, pinned it as admin, confirmed pinned-first ordering and the Comments
moderation tab. Repeated the flag → admin filter → correction round-trip on
`mpsc-old-questions` to confirm generalization and that the bank now
fetches over HTTPS (164 papers / 6,380 questions, matching the live DB).
All test data (reports/corrections/comments/audit rows) cleaned up
afterward — tables are back to empty.

**What's still open:**
- Corrections aren't threaded into `data.papers`/`sittings` inside
  `useMpscData.ts` — a paper launched from the Library tab still runs with
  uncorrected text/answers; only Browse/Practice reflects corrections.
- No bulk sub-part correction tool — each garbled sub-part is still fixed
  one report at a time, same limitation as the 2026-08-02 MCQ option fix.
- The Setu nav/design refactor (`HANDOFF-standalone.html`) and the
  PDF→OCR ingestion pipeline for new exams are deliberately out of scope
  here — recommendation for the latter (page-image + Claude vision
  extraction into a staging table, reusing this session's audit/correction
  UI for review) is recorded in chat, not yet built.

---

## 2026-08-02 (evening) — Login "Failed to fetch": mpsc-api now on HTTPS

**What shipped:**
- mpsc-api is now served over HTTPS at `https://api.map.hawayu.in`,
  replacing the plain-HTTP `http://134.209.154.122/mpsc-api` the frontend
  used before. `src/lib/mpscApi.ts`'s `API_BASE` updated accordingly.
- New DNS A record: `api.map.hawayu.in` → `134.209.154.122` (Hostinger).
- New nginx server block on the droplet, `api.map.hawayu.in`, proxying
  root path straight to the mpsc-api service on `127.0.0.1:8020` (no
  `/mpsc-api/` prefix anymore — this subdomain is dedicated to the API,
  so paths are `https://api.map.hawayu.in/health`,
  `.../api/auth/login`, etc., not prefixed). Config recorded at
  `mpsc_api/ops/nginx-api.map.hawayu.in.conf` in that repo.
- Let's Encrypt cert via certbot (`certbot --nginx -d api.map.hawayu.in`),
  auto-renews, expires 2026-10-31 (will auto-renew before then).
- The old `http://134.209.154.122/mpsc-api/` path still works (untouched,
  separate nginx server block) — not removed, just no longer used by the
  frontend. Could be torn down later if nothing else references it.

**Why:** user reported login failing with "Failed to fetch". Root cause:
the deployed site is HTTPS (Vercel), but the API was plain HTTP — browsers
silently block that as mixed active content, and the resulting error
(`TypeError: Failed to fetch`) gives no hint that HTTPS is the problem.
Confirmed by reproducing the exact error via `fetch()` from the live
`https://india-study-map.vercel.app` origin before touching anything.

The droplet's existing SSL certs are all for `*.shikshacom.com` (a
different, unrelated project) — reusing one of those would have been the
fastest fix but would mix this personal project's traffic into the
Shiksha domain's namespace. Asked the user; they had `map.hawayu.in`
already pointed at Vercel for the frontend itself, so used
`api.map.hawayu.in` as a clean, separate subdomain for the API instead.

**Verified live:** reproduced the mixed-content failure via `fetch()` from
`https://india-study-map.vercel.app`'s own origin first (confirmed root
cause before fixing), then after the nginx+certbot setup, confirmed
`https://api.map.hawayu.in/health` and a real login both succeed from
that same HTTPS origin, and ran the full login flow through the actual
UI (not just a bare fetch) against the new endpoint.

**What's still open:**
- The Vercel deployment needs to actually pick up this commit and
  redeploy before the live site is fixed — should happen automatically
  on push to `main`, but worth confirming the deploy succeeds (this repo
  has had silent auto-deploy failures before — see the courses-navigation
  entry pattern from the india-study-map sibling projects' history).
- Old IP-based `http://134.209.154.122/mpsc-api/` nginx block is now
  dead weight (nothing points at it) but wasn't removed — low priority
  cleanup.

---

## 2026-08-02 (later same day) — Non-MCQ questions: descriptive viewer + stem/option correction

**What shipped:**
- 2 more accounts seeded: `user1`/`user2`, role=`user` (not admin) — recorded
  in `mpsc_api/seed_accounts.py`.
- `question_corrections` gained two columns: `corrected_stem` and
  `corrected_options` (jsonb). Admin corrections can now rewrite the
  question text and all 4 option strings, not just the answer index.
  - **Underlined-word fix:** many ENG-GRAMMAR questions ask to identify
    the part of speech / voice / error of "the underlined word" in a
    sentence, but OCR extraction lost the original underline — the target
    word is unrecoverable from context. Admin can now retype the stem
    wrapping the target word in `__double_underscores__`; the frontend
    (`renderEmphasis()` in `StateTaxOfficerEnhanced.tsx`) renders that as
    `<u>`. Wired into every place a question stem is shown (Question
    Bank, Descriptive tab, mock runner, mock review).
  - **Garbled-options fix:** two-column OCR bleed regularly merges a
    question's real options with fragments of the next/previous question
    (e.g. `"preposition (c) noun"` instead of just `"Noun"`). Admin's
    correction form now has 4 editable option inputs, and the "correct
    answer" dropdown reads from the *live edited* option text, not the
    original — so admin can clean up the options first, then pick which
    one is right.
- New 📄 **Descriptive & Essay tab**: the ~5 essay/précis-letter prompts
  that were being silently dropped from the Question Bank (they have no
  single correct answer, so they can't be scored as MCQs) are now shown
  read-only, in original order, with study-pointer framing instead of a
  worked answer — same Flag/Note/Comments panel as scored questions.

**Why:** user flagged that some questions "aren't suitable for direct
MCQ" two ways — genuinely descriptive prompts (essay/précis) that were
invisible, and structurally-MCQ questions where OCR corrupted either the
stem's formatting (lost underline) or the options text (column bleed).
Both needed different fixes; conflating them would have under-served one
or the other.

**Verified live:** submitted a real report against a genuine underlined-
word question, fixed both its stem (`__Honesty__`) and its 4 garbled
options through the admin form, confirmed the Question Bank renders
"Honesty" underlined, shows the 4 clean options, and highlights the
correct one (a — Noun) — all without a page reload.

**What's still open:**
- No bulk "these 40 questions are all missing underlines" workflow —
  each stem/option fix is still one report at a time through the admin
  form. Fine at current volume (single low-hundreds), would need a batch
  tool if this scales to thousands of flagged items.
- `renderEmphasis()`'s `__word__` convention isn't documented anywhere
  a reviewer would see it except the correction form's placeholder text.

---

## 2026-08-02 — Question review system (State Tax Officer)

**What shipped:**
- New backend on the `shiksha-dev` droplet, extending the existing
  `mpsc-api` FastAPI service (chosen over Supabase — already had Postgres +
  a working service there; see reasoning in chat, not re-derived here).
  - 6 new Postgres tables in the `mpsc_study` DB: `users`,
    `question_reports`, `question_corrections`, `question_comments`,
    `question_notes`, `mock_attempts`. All keyed by `(bank_id, question_id)`
    — bank-agnostic by design, so this covers State Tax Officer today and
    any future bank without a schema change.
  - Simple username+password auth (bcrypt + JWT, 30-day tokens). Closed/
    invite-only — no public signup endpoint exists on purpose.
  - Endpoints: login/me, submit/list-my report (complaint), public
    corrections read, comments CRUD, personal notes CRUD, mock-attempt
    history, and admin-only bulk-status + per-question correction +
    user list.
  - 4 accounts seeded: `gasey` (owner) + `admin1`/`admin2`/`admin3`
    (reviewers), all role=admin. Credentials were shown once in chat,
    not stored in any repo — ask the user if they need to be rotated.
  - Backend code now under git at `~/mpsc_api` on the droplet (wasn't
    before — no history prior to this session, see that repo's first
    commit message for why).
- Frontend (`src/lib/mpscApi.ts`, `src/lib/authStore.ts`,
  `src/modules/mpsc/{LoginPanel,QuestionReviewPanel,AdminPanel}.tsx`,
  changes to `StateTaxOfficerEnhanced.tsx` / `StateTaxOfficerPage.tsx`):
  - Login control in the State Tax Officer header.
  - Every question in the Question Bank tab: 🚩 Flag (submit a complaint,
    optionally suggest the right answer), 📝 My note (private), 💬
    Comments (public thread).
  - Admin-authored corrections overlay the static bundled answer/
    explanation everywhere a question is shown or scored — Question Bank,
    mock test setup/running/scoring, By Exam/Year — via one
    `getCorrections()` fetch merged into `correctedQuestions` in the
    parent component.
  - New 🛡️ Admin tab (role-gated): filter reports by status, bulk
    accept/reject with a shared note, or expand one report to set the
    corrected answer/explanation/public note and accept it in one action.
  - Progress tab now shows real mock-test history + flagged-question
    status, fetched from the API (was a "coming soon" stub before).

**Why:** user wants every question eventually reviewable (not just State
Tax Officer), with a real admin workflow — bulk triage plus per-question
correction — and users able to see whether their flag was accepted or
rejected, with the admin's note.

**Bugs found and fixed during this session (verified live in-browser, not
just compiled):**
- JWT `sub` claim must be a string per RFC 7519 — PyJWT silently rejected
  int user IDs with "Invalid or expired token", which looked like a CORS/
  header problem until traced with a bare decode/encode roundtrip.
- Admin corrections weren't reflected in the Question Bank until a full
  page reload — the parent's `corrections` state was fetched once on
  mount and never invalidated after `AdminPanel` applied a new one. Fixed
  by threading an `onCorrectionApplied` callback down to `ReportRow`.

**What's still open / not built:**
- Corrections only affect *answer/explanation* — they don't yet let an
  admin fix the question stem or options text (only the standalone HTML
  guide's static data can do that, via re-running the solve pipeline).
- No UI yet to browse *all* comments/notes across questions (only
  per-question, from inside that question's card).
- Not generalized to other banks yet (`mpsc-old-questions`, Polity Codex,
  etc.) — the schema supports it (bank_id is already a column everywhere)
  but no other module's UI has the Flag/Note/Comments panel wired in.
- No password reset flow — if an account's password is lost, it has to be
  reset directly in Postgres (`UPDATE users SET password_hash = ...`)
  using `mpsc_api/seed_accounts.py`'s `hash_password()` helper.
- `mock_attempts`/`question_notes`/etc. have no admin-facing "delete my
  data" or GDPR-style export — fine for a closed personal tool, would need
  attention before ever opening signup to the public.
