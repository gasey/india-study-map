# Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023 — Paper III — extracted

Source: `mpsc-cse-papers/jr-grade-of-mes-electrical-wing-under-pe-deptt-computer-engg-paper-iii.pdf`,
worked 2026-09-05. Last unmined MPSC paper in the repo at the time this pass
started (0 of 70 questions were in the bank).

Same shape as `pe2018-p3`: Section A is 50 MCQs (2 marks each, OMR sheet),
Section B is 20 short-answer/descriptive questions (5 marks each, answer
sheet). Unlike `pe2018-p3`, this pass classifies **both** sections rather than
deferring Section B — see "Section B classification, not import" below for
what that does and does not mean.

## Status

- [x] `_source.txt` — full `pdftotext -layout` dump, both sections
- [x] Section A question numbers 1–50 present, no gaps
- [x] Section B question numbers 1–20 present, no gaps
- [x] Transcription — `text-001-025.json` / `text-026-050.json` (Section A),
      `textB-001-020.json` (Section B), merged into `_merged.json` (Section A only)
- [x] Every question checked against a 150dpi render of its source page, not
      just the text layer (see "What the text layer got wrong" below)
- [x] Syllabus classification against `_syllabus-2026.json` (copied verbatim
      from `pe2018-p3/`) — **26 on, 44 off**
- [ ] Solve pass (model answers for Section B, keys for Section A) — not done
      in this pass, staging + classification only
- [ ] Import — not done in this pass; nothing under `public/` was touched

## Reconciliation

| Section | Expected | Extracted | Gaps |
|---|---|---|---|
| A (MCQ) | 50 | 50 | none |
| B (descriptive) | 20 | 20 | none |

No question was dropped, silently or otherwise.

## What the text layer got wrong

Two symbols were dropped by `pdftotext`, both recovered by rendering the page
as a PNG at 150dpi and reading it directly:

- **Section A Q21, option (d)** — the text layer produced a blank string
  where the printed page has the infinity symbol `∞` (the cost recorded for a
  link that has gone down, in a distance-vector routing puzzle). Confirmed on
  page 3.
- **Section B Q2** — all five `→` arrows in the functional-dependency set
  `F = {CH → G, A → BC, B → CFH, E → A, F → EG}` were dropped, printing as
  bare spaces (`CH  G`). Confirmed on page 6.

Both are recorded with a `note` field on the affected question in
`text-001-025.json` / `textB-001-020.json` rather than silently repaired.

Two more things look like extraction damage and are not — confirmed by
rendering the page:

- **Section B Q9** prints the file size as `106 bits` (no caret), two
  sentences before `10^8 meters per second` (caret present). Zoomed 3x on the
  150dpi render: same font, same size, no dropped superscript — genuinely
  printed that way. The packet math (1000 packets × 1000 bits = 10⁶ bits)
  makes `10^6` the obviously intended reading, but the question is
  transcribed as literally printed (`106 bits`), with a note explaining the
  likely intent rather than silently correcting it.
- **Section B Q19**'s program module prints `x = x - y,` with a trailing
  comma where a semicolon is expected. Confirmed on page 7 as printed, not an
  OCR artifact. Preserved verbatim.

## The wrapped-line trap (documented in `mpsc-cse-papers/README.md`)

Section B Q12's stem wraps onto a line beginning `46.4 ms.` (`_source.txt`
line 282). A splitter keyed on the bare pattern `^\s*\d+\.` would misread that
line as the start of question 46, tearing Q12 in half and desynchronising
every question after it. Extraction here was anchored on the expected next
question number rather than the bare numbering pattern, so this did not
happen — reconciliation confirms 20/20 Section B questions intact and in
order.

Several other Section B stems carry numeric data across wrapped lines (Q2's
FD set, Q3's three tables, Q9's link/packet figures, Q13's token-bucket rate,
Q18's task-duration table, Q19's code block, Q20's LOC/cost figures); all were
individually checked against the rendered page images, not just the text
layer, given this repo's prior silent-data-loss incidents.

## A print-quality issue that is not an extraction bug

**Section A Q21** reads "After the update in **the previous question**, the
link N1-N2 goes down..." — but Q20 (the actual previous question) is an
unrelated protocol/OSI-layer matching question, not a network topology setup
that N1/N2/N3 could refer to. This looks like a question recycled from a
textbook or question bank alongside its original neighbour, with only one of
the pair reprinted here. It is preserved verbatim as a defect in the source
paper's setting, not repaired or dropped.

## Section B classification, not import

Both sections are classified here (`_classified.json` covers all 70), unlike
`pe2018-p3` where Section B was explicitly deferred. **Classification is not
the same as import.** Do not read the presence of Section B in
`_classified.json` as a decision to import these 7 on-syllabus descriptive
questions as `type: 'descriptive'` records.

Worth knowing before that decision is made: `import_pe2018_secb_gen.py`
(`tools/system-analyst-build/import_pe2018_secb_gen.py`) records that a card
called `MES2023_P1_B020` — Section B of **this same July 2023 sitting's Paper
I** — was removed from the live bank on 2026-09-05 because an import route had
lifted a five-part exercise's parts into MCQ options A–E, keyed it 'A', and
left a truncated stem. That script's chosen fix, for Paper III (P&E Aug 2018)
Section B, was **not** to import the originals as `type: 'descriptive'` but to
author new standalone MCQs covering the same on-syllabus topics
(`src: 'generated'`), reviewed by two blind adversarial passes. Whether this
paper's 7 on-syllabus Section B questions (Q1–Q7, all TECH2 Unit 3 DBMS)
should follow the `type: 'descriptive'` route the app already supports, or the
authored-MCQ route used for the Aug 2018 sitting, is a decision for whoever
does the solve/import pass — this pass only stages and classifies.

## Results

**26 of 70 questions on-syllabus** against the 2026 syllabus:

| Paper | Unit | Topic | On-syllabus count |
|---|---|---|---|
| TECH2 | 3 | Database Management Systems | 25 (18 Section A + 7 Section B) |
| TECH2 | 2 | Web Technologies | 1 (Section A Q33) |

Section A is cleanly banded by topic in printed order: Q1–18 database
management systems, Q19–32 data communications/networking, Q33 web/HTTP, Q34
networking (TCP congestion control), Q35–50 software engineering. Section B
follows the same shape: Q1–7 DBMS, Q8–14 networking, Q15–20 software
engineering — exactly the split flagged going in.

Zero OOP (TECH2 Unit 1) or Cloud Computing (TECH2 Unit 4) questions appear
anywhere in either section — unlike `pe2018-p3`, which had one OOP hit (its
Q49). Nothing in this paper touches TECH1 at all (Discrete Maths, Computer
Architecture, Data Structures, Operating Systems) — expected, since Paper III
in this exam family is consistently DBMS/networking/software-engineering
focused, not TECH1 territory.

### The one Web Technologies hit, and why it barely qualifies

**Section A Q33**: *"Identify the protocol primarily used for browsing
data."* Options: (a) FTP (b) TCP (c) TFTP (d) HTTP.

Marked `on`, confidence **medium**. It sits in the middle of a long run of
data-communications/networking questions (Q19–32, Q34) that are all `off` per
the 2026 syllabus's explicit dropping of data communications/networking. Q33
is different only because its entire content is naming HTTP as the web's
protocol — the "HTTP/HTTPS" fragment of TECH2 Unit 2's first subtopic,
*"Web architecture, client-server communication, HTTP/HTTPS, DNS and
hosting."* It is a thin, bare-recall fit (there's no web architecture,
client-server framing, or hosting content here — just "which protocol is
HTTP"), which is why confidence is medium rather than high, but per the task's
own instruction not to manufacture Web Technologies hits, this one genuine
inclusion should not be inflated with confidence it doesn't have, nor omitted
because it's thin.

No other question in either section comes close: nothing touches HTML, CSS,
JavaScript, the DOM, frontend frameworks, REST/backend, Git/Docker/CI-CD,
OWASP/web security, MVC/microservices, or AI-assisted web development — the
other nine subtopics under TECH2 Unit 2 are entirely unrepresented in this
paper.

### Borderline calls, recorded honestly

- **Q2** (`medium`) — "Which of the following data models support for schema
  evaluation?" (semi-structured data model). Filed under "Database system
  concepts, architecture..." rather than the relational-model leaf, since it's
  comparing data-model architectures generally, not relational-model
  internals specifically.
- **Q8** (`medium`) — "commands" used to select columns, but the four options
  (Projection/Selection/Join/Union) are relational-algebra operation names,
  not SQL keywords. Filed under the relational-algebra leaf.
- **Q16** (`medium`) — SQL's ROLLUP operator is beyond "basic query
  statements" as the leaf frames it, but it's still unambiguously a SQL
  feature and there's no other SQL leaf to place it under.
- **Section B Q1** (`medium`) — "difference between SQL and NoSQL." NoSQL is
  never named anywhere in the 2026 syllabus. Filed under "Database system
  concepts, architecture..." as the closest overview leaf, not stretched into
  a leaf that names it directly, because none does.
- **Section B Q7** (`medium`) — stored procedures go beyond "basic query
  statements" the same way ROLLUP does; same reasoning, same leaf.
- **Q39** (`off`, considered and rejected) — "high cohesion / low coupling"
  modular design question. Neither the OOP unit's subtopic list nor the Web
  Technologies architecture leaf ("MVC, microservices, SOLID, event-driven
  systems...") names cohesion/coupling, and stretching a generic software-design
  principle into either would be the same mistake the task brief warns
  against for networking questions — so it stays off.

## What to watch for here

Same watch-outs as `pe2018-p3` and `ilm2023-p3`: `-layout` mode preserves the
two-column option layout faithfully (confirmed against rendered pages for all
50 Section A questions), so silent option permutation is not a risk here.
The actual risks that materialized were dropped Symbol-adjacent glyphs (`∞`,
`→`) and one wrapped-line numbering trap, both handled as described above.
