# Handoff — Programmer 2018 papers, and the two apps' opposite import rules

Written 2026-09-03, after importing the MUDAL Technical Paper I practice volumes
into the System Manager app and Programmer 2018 Technical Paper I into the System
Analyst app. `DEVLOG.md`'s two 2026-09-03 entries carry the full narrative; this
file is the operational part. Read it before importing more questions into
either app.

See also `HANDOFF-UDC.md`, which is still current for the clerical/UDC papers.

---

## The single most important thing: the two apps have OPPOSITE conventions

Getting this backwards will either corrupt a mock test or produce a pointless
extra paper. It is not a style preference; each app's Mock Test behaves
differently.

| | **System Manager** (`public/mpsc-system-manager/`) | **System Analyst** (`public/mpsc-system-analyst/`) |
|---|---|---|
| Data files | **Fully GENERATED.** `assemble.py` + `gen_syllabus.py` rewrite `questions.js`/`syllabus.js` from scratch every run. | **Mutated in place.** Scripts load the JSON out of the `.js`, edit, write back. |
| Never do | Hand-edit `data/*.js`. The next pipeline run silently deletes your work. | Write a non-idempotent import script. |
| Mock Test pool | `TECH1 + TECH2` only | draws on `TECH1` |
| Adjacent exams' papers | **Quarantine** into their own paper (`UDC`, `TECH1P`) with `counts_for_merit: false` + `in_exam: false`. | **Import straight into `TECH1`.** It holds 982 such questions across 15 `srcKey`s (CSE, ILM, MES, JE, and now PROG2018_P1). |

Why the difference: System Manager's `TECH1` holds 75 genuine 2016 Computer
Operator questions and its mock is meant to *simulate that paper*, so foreign or
authored material must stay out of the pool. System Analyst's `TECH1` was never
pure — it is a drill pool by construction, 982 questions from 15 sittings — so
adding another real MPSC sitting to it is the established, correct move there.

**Authored** material is a separate question from **foreign** material. Even in
System Analyst, questions nobody sat in a real exam would deserve quarantining;
`TECH1P` in System Manager exists because the MUDAL volumes are authored, not
merely because they are outside the syllabus.

## Where the source material is

**Programmer 2018 question papers** — five PDFs, currently in `~/Downloads/`:

```
general-english-paper-i-prog.pdf     general-english-paper-ii-prog.pdf
technical-paper-i-prog.pdf           technical-paper-ii-prog.pdf
technical-paper-iii-prog.pdf
```

All five are: *MPSC, General Competitive Examinations for recruitment to the post
of PROGRAMMER under Public Health Engineering Department, JULY 2018.*

**Only Technical Paper I has been copied into the repo**, at
`tools/system-analyst-build/sources/programmer-2018-technical-paper-i.pdf`.
**Copy the others in as you import them.** `~/Downloads` is volatile, and
`HANDOFF-UDC.md` records two audit agents concluding a whole imported paper was
fabricated purely because they could not find its source. PDFs are already
tracked in this repo (18 of them), so committing them is normal here.

**Older MPSC papers and official answer keys** live in the sibling repo
`~/workspace/projects/personal/mpsc-question-bank/` — see `HANDOFF-UDC.md`.
Every PDF there has a sibling `*.pdf.ocr.txt`; read the `.ocr.txt`.
**There is no Programmer answer key in `pdfs/Answer_Keys/`.** I checked. The only
`Programmer.pdf` in that repo is an exam schedule, not a paper or a key.

## What is already imported

| Paper | Where | Q | Answers |
|---|---|---|---|
| Programmer 2018 **Technical Paper I** | System Analyst `TECH1`, `srcKey: PROG2018_P1` | 100 | derived, two blind passes agreed 100/100 |
| MUDAL TECH1 Practice **Vol 1 + Vol 2** | System Manager `TECH1P`, `srcKey: MUDALPRAC-V1/V2` | 349 | authored key, independently re-derived |

Counts after: System Manager **1845**, System Analyst **1409**.

## What is NOT imported — and where it was agreed to go

The user chose **System Manager `TECH2`** as the destination for Papers II and
III (asked and answered 2026-09-03). Do not put them in System Analyst.

1. **Programmer 2018 Technical Paper II** — C++/OOP (overloading, templates,
   abstract classes, access specifiers) then DBMS (functional dependencies,
   concurrency, ACID, lost-update). 100 questions. Matches System Manager
   `TECH2`'s DBMS unit; the C++ half matches nothing in either syllabus, so
   expect to park or drop a chunk of it. **Decide that explicitly and log it** —
   silently dropping questions is this project's signature failure.
2. **Programmer 2018 Technical Paper III** — **a mixed paper, not a networking
   paper.** 100 questions, verified numbered 1–100 with no gaps. Composition:

   | Q | Content | Destination |
   |---|---|---|
   | 1–75 | Networking and web: OSI, topologies, firewalls, Telnet, DHCP, routers/bridges, class C addressing, HTML/XML/DTD/XSL, CGI, SMTP, HTTP, byte stuffing | System Manager `TECH2` Unit I — the agreed target, and a genuinely good fit |
   | 76–83 | Number series and arithmetic word problems (percentages, discount, pipes-and-cisterns) | **Not** System Manager. Fits System Analyst `TECH3` "Project Management and **Aptitude**" |
   | 84–90 | Verbal analogies ("Poet is to verse as sculptor is to ___") | Same as above |
   | 91–100 | **Non-verbal reasoning. The question IS a diagram** — figure series and figure analogies, with options literally printed as "A B C D" under pictures | **Not importable.** Text-only schema cannot carry them; set `needs_figure: true` and let `assemble.py` quarantine them, exactly as the 18 existing figure-dependent questions are handled |

   So Paper III yields ~75 questions for System Manager, ~15 for System Analyst
   `TECH3` if wanted, and 10 that must be dropped **deliberately and logged**.
   Do not let the 10 vanish without a record — that is the 2026-08-04 failure.

   *(An earlier draft of this handoff claimed Paper III "ends at question 90".
   That was wrong — an artifact of a grep requiring a trailing space after the
   number, which missed `100.` and the bare-numbered figure questions. Both
   Paper II and Paper III are complete 1–100. Recorded here because the same
   regex will mislead the next person the same way.)*
3. **General English Paper I** — 3 hours, 100 marks. Splits cleanly, and the
   paper says so itself:
   - **Section A (20 marks)** — "answered only on the Answer Sheet provided",
     i.e. handwritten. Not MCQs. The System Analyst schema already has a
     `type`/`sectionB`/`model`/`points` shape for conventional questions (36
     records use it); System Manager has `DescriptiveQuestionCard` and the
     `type: 'descriptive'` discriminator. Use those, do not invent a third.
   - **Section B (80 marks)** — "answered only on the OMR Response Sheet",
     numbered **1–80**. These are the importable MCQs.
4. **General English Paper II** — 2 hours, 100 marks, 100 questions at 1 mark.
   Starts with parts-of-speech identification on underlined words. **Underlined
   words are the known trap** — the extractor loses the underline marker and the
   question becomes unanswerable; see `patch_underlines.py` and the 6 quarantined
   questions in the System Manager bank.

## How to add a batch

### System Manager (generated pipeline)

1. Put the source in `tools/system-manager-build/sources/`.
2. Write/extend an importer that emits a staged JSON into
   `tools/system-manager-build/staged/`. Follow `import_practice.py`: it asserts
   hard on anything it does not fully understand rather than dropping a row.
3. Add a `*_META` dict mapping `srcKey -> (sitting label, ...)` in
   `assemble.py`, plus a block appending rows. Copy the `PRACTICE_META` block.
4. If it is a new paper, add it to `gen_syllabus.py`. **Derive question counts
   from the staged file** (see `practice_paper()`), never hardcode them — the
   invariant `questions x marks_per_question == paper marks` will otherwise fail
   in a confusing place when the source changes.
5. Rebuild, run each script **twice**, confirm byte-identical output, and diff
   pre-existing question ids to prove none changed.

### System Analyst (in-place mutation)

1. Put the source in `tools/system-analyst-build/sources/`.
2. Write a script modelled on `import_prog2018_p1.py`. It **must be idempotent**:
   strip existing records for your `srcKey` before appending, so re-running is a
   no-op. Verify with `cmp` across two runs.
3. `id` convention is `{SRCKEY}_{NNN}` (e.g. `PROG2018_P1_042`).
4. Validate every `unit`/`sub` against the live `syllabus.js` and **exit** on a
   mismatch — an unknown subtopic drops the question out of every by-unit view
   with no error.
5. `save_js` indent is **1** for `QUESTIONS`, **2** for `SYLLABUS`. Keep it, or
   you produce a 1400-record whole-file diff.

## Answering questions with no official key

`tools/bank-rebuild/SOLVE_BRIEF.md` is the standing brief. What worked well on
Programmer Paper I and is worth repeating:

- **Two independent passes, differently framed.** Give pass B a prompt that does
  *not* name which questions are tricky, so the two are not anchored on the same
  reading. All 100 agreed, which is far stronger evidence than one pass.
- **Store `conf` as the LOWER of the two self-ratings.** A question either solver
  hedged on must not render as certain.
- **Where both agree but one hedged, use `note`, not `alt`.** `disputeBlock()`
  renders "Disputed — two derivations disagree" and labels the rival "question
  bank"; setting `alt` when the solvers actually agreed asserts something false.
- Force explicit computation in the prompt for anything numeric. Recognising a
  familiar-looking option is exactly how these get missed.

## Traps that have already bitten

- **`provLine()` badges on the word "official", not on a key existing.** It tests
  `/official/i && !/\b(?:no|without|never)\s+official/i`. Your prov string must
  read "…no official answer key…". Phrase it wrongly and derived answers render
  the blue **official key** pill — the exact inverse of the truth. This already
  mis-badged 309 answers once.
- **`pdftotext` silently destroys mathematics.** It flattens superscripts
  (n² → `n2`) and **drops symbols entirely** — Paper I Q34's options came out as
  `f(n)=(g(n))` with the Ω simply gone. Read the PDF pages **visually** (the Read
  tool renders them) for any paper with notation. This is the difference between
  a correct question and a meaningless one.
- **Markdown/layout structure leaks into the last option.** Parsing markdown, the
  `---` before each answer-key heading landed inside option D on the last
  question of every unit (`.csv ---`) — 10 questions, and **every count and key
  assertion still passed**. Assert that no stem or option contains `---`, `#` or
  `|`. Found only by rendering a card in the browser.
- **Counts are not a corruption check.** Both of this project's data incidents
  (~280 questions lost; a comprehension question rendered as a blank-option MCQ)
  and both found this session were invisible to counting. Look at rendered
  questions in the browser.
- **A volume's own answer key can be wrong.** The MUDAL practice Vol 2 keyed
  `=MID("SYSTEM",3,3)` as `TEM`; it is `STE`. Never import a supplied key
  unverified. Keep corrections in a table in the importer, not by editing the
  source, so `sources/` stays byte-faithful and every departure is declared.
- **Preserve the paper's own typos** ("earsed", "seperate", "recieving",
  "Crome"). They are what the candidate saw. Note them; do not fix them.
- **The Practice tab's Source filter offers only `past` and `generated`.** A new
  `src` value would be unreachable from that dropdown. Authored material should
  use `src: "generated"`.
- **`shortPaper()` falls back to the syllabus `name`**, so a new paper needs no
  `app.js` edit — but give it a real `name`, or 15 call sites print the bare id.
- **Static server caching.** `preview_start` the `static-apps` config; **restart
  to get a new port** when data changes. Cache headers keep serving stale
  `questions.js` even in a fresh tab. A new port is a new origin and a clean
  cache.
- **Screenshots time out** on a 100-question browse page. Verify via
  `read_page` / DOM text instead; it is better evidence anyway.

## Open questions worth resolving

- **Where should Paper III's 15 aptitude/verbal-reasoning questions go?** They
  are real MPSC questions and System Analyst has a `TECH3` "Project Management
  and Aptitude" paper that fits them, but the user only agreed to Papers II/III
  going to System Manager `TECH2`, where they do not belong. Ask before placing.
- **Paper II's C++/OOP half has no home in either syllabus.** Roughly the first
  half of its 100 questions are C++ language mechanics; the DBMS half fits
  System Manager `TECH2`. Same question as above — ask, then log the decision.
- Does an official key exist for the **May 2025** UDC sitting? Would make 35 more
  answers authoritative. `pdfs/Answer_Keys/` was never exhaustively searched.
- **Nobody has audited the other generated files for hand-edits** living in the
  silent-deletion trap. Two were found by accident (the UDC paper, and the
  Syllabus tab's "Recommended reading" panel). A deliberate sweep is cheap.
- The 349 `TECH1P` questions had **one** independent re-derivation each, not the
  two-pass agreement Programmer Paper I got. A second pass would upgrade them.
- Number systems, Boolean logic and gates appear in MUDAL practice Vol 2 Unit I
  but have **no leaf in the official TECH1 syllabus**; ~12 questions are parked
  under "Functional Components of a Computer". Vol 2's own closing note warns the
  real paper may range outside the listed syllabus, so keeping them is right, but
  the tag is a compromise.
- The 232 `gs1_history` questions still sit under one broad topic (long-standing;
  see `CLAUDE.md`).
