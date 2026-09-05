# Handoff — bank-wide answer-key audit + System Analyst TECH1 gap authoring

**Started:** 2026-09-02. **Status: audit complete and adjudicated. The 49
CONFIRMED findings are applied to both banks. The 20 SPLIT findings are written
up in `SPLIT-FINDINGS-REVIEW.md` and awaiting the user's call — nothing from
them has been applied. Part 3 (authoring) has not started.**

If you are picking this up cold, read this whole file before touching
`public/mpsc-system-*/data/`. The expensive part (a 93-agent audit of every
question in both apps) is **done** — do not re-run it.

**Read `SPLIT-FINDINGS-REVIEW.md` before doing anything else.** Adjudicating
one of the SPLIT findings turned up an official MPSC answer key for a sitting
the bank believes has none — 12 stored answers are provably wrong and 123 more
can be upgraded from `derived` to `official key`. That is a bigger correctness
win than everything else outstanding, and it implies the whole
`~/Downloads/mpsc_pdfs_examination/Answer_Keys/` directory needs sweeping
against both banks. See §0 of that file.

---

## What the user asked for

Verbatim intent, in three parts:

1. **Verify the questions in the System Analyst and System Manager apps.** Flag
   a warning where a question is wrong; correct it where possible. The user
   explicitly said Sonnet or Haiku is fine if sufficient — so the audit runs on
   Sonnet, not Opus.
2. **Author the missing syllabus questions** — but *for now, System Analyst
   Technical Paper I only*.
3. **Add the missing concepts and explanations** for that same paper, for
   learning.

Two scoping decisions the user made when asked:

- **Full sweep, via a multi-agent workflow** — all 3,254 questions, both apps,
  including GE and GS. Not scoped down to technical papers or to derived
  answers. The user opted into the token cost explicitly.
- **Fill real gaps only** for authoring — compare the syllabus line-by-line
  against what exists and author only where coverage is genuinely thin or
  absent. *Not* an even-coverage-per-leaf quota.

---

## The two syllabus PDFs, and which app each governs

| PDF | Governs |
|---|---|
| `~/workspace/projects/personal/syllabusex.pdf` | **System Analyst** technical papers |
| `~/Downloads/syllabus-for-system-manager-MUDAL.pdf` | **System Manager** |

The first one is worth a paragraph, because its title does not say "System
Analyst" anywhere. It is the ICT Department's **Informatics Officer** syllabus,
notified 30 July 2026 (No. A-12038/68/2025-ICT), and the System Analyst app's
own `syllabus.js` already declares it as the authority for its technical papers
(`syllabus_authority.technical_papers`). So it *is* the right yardstick. Confirmed,
not assumed.

`pdftotext -layout` handles it, with the usual OCR damage in the scanned
headings — "THCHNICAL", "Sparming" for "Spanning", "Isomoaphism", "Kubemetes",
"Leaming". Read past those; the topic lists themselves are legible. A clean text
dump is at
`scratchpad/syllabusex.txt` (regenerate with `pdftotext -layout` if the
scratchpad is gone).

### Informatics Officer Technical Paper I — the four units, 200 marks

This is the only paper in scope for authoring.

| # | Unit | Marks |
|---|---|---|
| 1 | Discrete Mathematics | 40 |
| 2 | Computer Architecture and Organization | 40 |
| 3 | Data Structures and Algorithms | 60 |
| 4 | Operating System | 60 |

Paper structure: 50 MCQs at 2 marks = 100, plus 100 marks of conventional
essay. **Negative marking is one-third of the question's marks** for a wrong
MCQ answer — which is exactly why a wrong stored key is worse than no question.

---

## Current state of the two banks

Counts as of the start of this session:

| App | Questions | Concepts |
|---|---|---|
| System Analyst | 1,409 | 962 |
| System Manager | 1,845 | (separate `concepts.js`) |

System Analyst by paper/source:

```
GE  | GEN                          100
GS  | GEN                          139
TECH1 | ILM2010_P1 104, ILM2010_P2 88, ILM2018_P1 43, ILM2018_P2 14,
        ILM2023_P1 97, ILM2023_P2 39, JE2016_P1 2, JE2016_P2 27,
        MES2015_CSE 50, MES2015_CSE_P2 10, MES2018_P2 21,
        MES2023_P1 70, MES2023_P2 20, PROG2018_P1 100,
        SYSTEM_ANALYST_2026_CSE_PREP 297          → 882 + 297 = 1,122 with legacy
TECH1_LEGACY | TECH1_OFFICIAL      140
TECH3 | GEN                         48
```

System Manager by paper: `GE` 388, `TECH1` 440, `TECH1P` 349 (authored practice,
quarantined — `counts_for_merit: false`), `TECH2` 512, `UDC` 70.

Question record shape differs slightly between the apps — **this matters when
writing a patch script**:

- System Analyst: `id, src, sitting, srcKey, no, paper, unit, sub, q, opts, ans, exp, prov, note`
- System Manager: same **plus `conf`** (`high`/`medium`/`low`)

`opts` is an object keyed `"A"`–`"D"`, not an array. `ans` is the letter.

---

## Part 1 — the audit (AUDIT COMPLETE, ADJUDICATION IN FLIGHT)

> **Status, 2026-09-02 later that day.** The audit stage is **finished**: all
> **93/93** batches returned, **3,253** questions audited, **83** unique findings
> raised. Those findings are recovered and safe on disk — see *Recovering the
> results* below. What is still running is the adversarial adjudication.
>
> Two usage-limit interruptions hit this work. The first killed the run mid-way;
> the second killed it again after a resume. Both were recovered from
> `journal.jsonl` with no re-audit, which is the whole reason that file matters.

### What was launched

```
Run ID:      wf_c0d1c769-404
Task ID:     witn3idbt
Script:      ~/.claude/projects/-home-hruaia-workspace-projects-personal-india-study-map/
             7408eab3-7f38-4c65-aebb-c4499cd2e4ba/workflows/scripts/
             verify-mpsc-banks-wf_c0d1c769-404.js
Transcript:  ~/.claude/projects/-home-hruaia-workspace-projects-personal-india-study-map/
             7408eab3-7f38-4c65-aebb-c4499cd2e4ba/subagents/workflows/wf_c0d1c769-404
```

**Shape.** A `pipeline` over 93 batches, no barrier:

- **Stage 1 "Audit"** — 93 Sonnet `general-purpose` agents, one per batch of 35
  questions. Each reads `tools/VERIFY_BRIEF.md` (new this session, see below)
  and its own batch file, solves every question independently *before* reading
  the stored explanation, and returns only findings. Clean batches return an
  empty array, which is the expected outcome.
- **Stage 2 "Refute"** — every finding is adjudicated by **two** independent
  Sonnet agents with deliberately *different* lenses:
  - `subject` — re-solve the underlying problem from first principles, siding
    with neither party.
  - `skeptic` — actively try to refute the finding; find the reading under which
    the *stored* answer is right after all. Defaults to `refuted: true` when
    genuinely uncertain.

  Both refuters read the real question from the batch file, never the auditor's
  paraphrase. A finding is `CONFIRMED` only when both uphold it; one-for-two is
  `SPLIT`; zero is `REFUTED`.

### Where the input lives

93 batch files of 35 questions, sorted so each batch is topically coherent
(`app → paper → sub → id`):

```
scratchpad/verify/batch-001.json … batch-093.json
scratchpad/verify/manifest.json
```

Alongside them, a per-question projection of the *whole* bank — one small file
each, 3,254 of them — which is what the adjudicators read:

```
scratchpad/verify/q/<id>.json      # stem, opts, ans, exp, prov
scratchpad/verify/f/<id>.json      # one recovered finding (new session's scratchpad)
```

**These live in a session scratchpad and are not guaranteed to survive** —
though in practice the launching session's copies outlived the session itself,
and a later session read them across the session boundary by absolute path.
Check before regenerating. Regenerate with
the node one-liner recorded in the transcript, or re-derive: read both
`questions.js` files, project each record to
`{app, id, paper, unit, sub, sitting, q, opts, ans, exp, conf, prov, note}`,
sort by `app+paper+sub+id`, slice into 35s.

### Recovering the results if the chat died

This procedure is no longer hypothetical — it was used twice. Read it before
re-running anything expensive.

**`resumeFromRunId` is same-session only.** This is the trap. If the chat that
launched the run is gone, `resumeFromRunId` cannot reach its cache no matter
what run ID you pass, because the run lives under the *old session's* directory.
A new session must re-derive the results from disk and launch a **narrowed**
workflow covering only what is genuinely missing.

**Step 1 — read the journal, not the transcripts.**

```
<session>/subagents/workflows/wf_c0d1c769-404/journal.jsonl
```

It holds one `{type:"started"|"result", key, agentId, result}` record per agent.
It is small (~220 KB for 431 agents). The sibling `agent-<id>.jsonl` files are
full conversations and will overflow a context window — grep them, never `Read`
them whole.

**Step 2 — dedupe by `key`, last write wins.** A resumed run re-executes some
calls, so raw record counts overstate progress. For this run, 97 audit records
deduped to exactly the 93 real batches.

**Step 3 — separate the stages by result shape.** The journal does *not* record
an agent's label, so shape is what you have: audit results carry
`{checked, findings}`, adjudications carry `{refuted, confidence, reasoning}`
(plus optional `corrected_should_be`).

**Step 4 — to attribute an adjudication to its finding, go through `agentId`.**
Since verdicts carry no question id, map `result.agentId` →
`agent-<agentId>.jsonl` → that agent's **first user message** → the
`Question id: <id>` line the prompt embeds. The lens is recoverable from the
prompt text too: the string `job is to REFUTE` marks `skeptic`, `first
principles` marks `subject`. All 34 stray verdicts were attributed this way with
zero ambiguity.

**Step 5 — relaunch narrowed.** Feed the recovered findings into a refute-only
workflow and skip the audit entirely.

### The refute-only resume (current run)

```
Run ID:      wf_991869c1-f3d
Task ID:     wgwcxy1vn
Script:      ~/.claude/projects/-home-hruaia-workspace-projects-personal-india-study-map/
             23fdbb69-27d5-4b8f-a84d-2dd16c53c805/workflows/scripts/
             refute-mpsc-findings-wf_0fbff3c0-e6b.js
```

It takes the 83 recovered findings, skips the 16 already fully adjudicated, and
runs only the missing lenses — **132 agent calls instead of a 431-agent
re-run.** Its return value is `{votes: [{id, lens, refuted, confidence,
corrected_should_be}], failed_count}`: deliberately **no `reasoning`**, because
132 full rationales will not fit in context. Pull the reasoning for the handful
of findings you actually need to present out of that run's own `journal.jsonl`.

Two economies worth keeping if this is ever re-run:

- **Adjudicators read one ~1 KB file, not a 35-question batch.** Each finding is
  written to its own `f/<id>.json` and each question to `q/<id>.json`. The first
  attempt had every refuter re-reading the whole batch file; fixing that saved
  on the order of 1.8M tokens.
- **Pass ids through `args`, not prose.** `args` may arrive as a **JSON
  string** rather than an object — the script defends with
  `typeof args === 'string' ? JSON.parse(args) : args`. Without that guard it
  dies instantly on `args.todo` being undefined.

### The return shape

```jsonc
{
  totals: { raised, confirmed, split, refuted, batches_with_no_result },
  confirmed: [ { id, type, should_be?, confidence, reason, fix?, note_suggestion?,
                 batch, votes[], upheld, total_votes, verdict, corrected_should_be? } ],
  split:     [ … same shape … ],
  refuted:   [ { id, type, reason } ]     // trimmed, kept only for the record
}
```

Four finding types, defined in the brief: `wrong_answer`,
`explanation_contradicts`, `broken_question`, `ambiguous`.

### `tools/VERIFY_BRIEF.md` — new, and worth keeping

Written this session, sitting alongside the existing `SOLVE_BRIEF.md` /
`CLASSIFY_BRIEF.md` / `GENERATE_BRIEF.md` house briefs. The two rules in it that
carry the most weight:

- **Provenance changes the bar, not the honesty.** Where `prov` names an
  official MPSC key, that key is authoritative even when the agent disagrees —
  the disagreement goes in `note_suggestion`, not into an overwrite. Where `prov`
  describes a derived answer, the stored answer has no more standing than the
  auditor's own reasoning.
- **Most questions must produce nothing.** An empty findings array is the
  correct output for a clean batch. This is stated twice on purpose, because a
  verifier that feels obliged to find something will invent something.

---

## Part 2 — applying the findings (CONFIRMED APPLIED; SPLIT AWAITING USER)

> **Status, 2026-09-02 later still.** Adjudication finished: **83 findings →
> 49 CONFIRMED, 20 SPLIT, 14 REFUTED.**
>
> - **CONFIRMED — applied.** System Analyst via a new idempotent
>   `tools/system-analyst-build/apply_audit_corrections.py` reading
>   `staged/audit-corrections.json`; System Manager via a corrections overlay
>   added to `assemble.py` reading `staged/audit_corrections.json` (that file is
>   generated — the overlay runs after tagging, before quarantine). Both
>   re-runs are byte-stable, counts unchanged (1409 / 1845), verified in the
>   browser with no console errors.
>   Note the `note_mode` field on each correction: 9 cards already carried a
>   stale note from an earlier flagging pass that the correction contradicts, so
>   each payload says per-card whether to **replace** or **preserve** the note.
> - **SPLIT — written up, not applied.** `SPLIT-FINDINGS-REVIEW.md`, one
>   decision per finding. All 20 split the same way (subject upheld, skeptic
>   refuted), which is an artifact of the skeptic's brief telling it to default
>   to `refuted` under uncertainty — read a SPLIT as "real finding, arguable
>   defence", not "50/50".
> - **REFUTED — dropped**, kept in the triage file for the record.
>
> **Recovered artifacts, if you need them again.** The triage and both lenses'
> full reasoning are reassembled at
> `<scratchpad>/145c4c32-…/triage-full.json` and `verdicts-final.json`.
> 15 of the SPLIT verdicts had empty `reasoning` (the refute-only workflow
> deliberately omits it to fit context); all 15 were recovered from the run
> journals by mapping `agentId` → `agent-<id>.jsonl` → the `/f/<ID>.json` path
> embedded in the agent's first user message, with the lens read off the prompt
> text (`REFUTE` → skeptic, `first principles` → subject). Note that trick
> keys on the **finding-file path**, not a `Question id:` line — the prompt has
> no such line.

**Still open from the triage:**

1. The 20 SPLIT decisions in `SPLIT-FINDINGS-REVIEW.md`.
2. **The ILM2023 official key** (§0 of that file) — 12 wrong stored answers,
   123 re-provenanceable, and a strong hint that other sittings marked "no
   official key exists" have keys sitting unread in `Answer_Keys/`.

When applying anything further:

1. **Triage by verdict.** `CONFIRMED` findings are the actionable set. `SPLIT`
   ones need a human read — surface them to the user rather than deciding
   silently. `REFUTED` ones are logged and dropped.
2. **Respect the generated-file rule.** Per `CLAUDE.md`, several of these files
   are pipeline output. For System Manager, `questions.js` is generated by
   `tools/system-manager-build/assemble.py` — **edit the staged inputs there and
   re-run**, do not hand-edit the `.js`. For System Analyst, the convention is
   idempotent importer scripts in `tools/system-analyst-build/` (see
   `import_prog2018_p1.py` for the pattern: strip prior records with the same
   `srcKey`, append, byte-identical on re-run).
   A corrections pass will most likely need a **new** script in each build dir,
   e.g. `apply_corrections.py`, taking a JSON of confirmed findings and rewriting
   `ans` / `exp` / `note` by id. Make it idempotent and make it fail loudly on an
   unknown id.
3. **Preserve what the original printed.** The house convention (established by
   the UDC work, DEVLOG 2026-09-03) is that when a stored answer is corrected,
   the superseded one is retained — `srcAns` for a printed source answer, or a
   `note` explaining the correction. Do not silently overwrite.
4. **Flag rather than fix where the source is authoritative.** For
   `official key` questions the user wants a *warning*, not a rewrite.
5. **Verify in the browser.** `.claude/launch.json` has an `india-study-map`
   config. Per `CLAUDE.md` this is mandatory, not optional — typecheck passing
   is necessary but not sufficient. Note from DEVLOG: screenshotting a large
   browse page times out the renderer, so read the rendered DOM text instead.
6. **Write the DEVLOG entry.** Newest on top; **what shipped / why / what's
   still open**. This is a standing instruction.

---

## Part 2b — the extraction-damage sweep (SCAN DONE, RECOVERY RUN DIED)

Applying the audit findings made it obvious several were not isolated defects
but symptoms of systemic extraction damage, so both banks were scanned directly
rather than trusting the audit's coverage. The scan found roughly twice what
the audit had surfaced:

| damage | System Analyst | System Manager | audit had caught |
|---|---|---|---|
| Raw Symbol-font PUA glyphs (U+F0xx) rendering blank to the reader | 19 | 0 | 4 |
| Duplicate option text (lost exponent/formatting) | 9 | 2 | 5 |

Every PUA question is an ILM or MES import. The PUA glyphs are **not** garbage:
they are Symbol-font remnants under the standard byte N → U+F000+N mapping, so
they decode deterministically (0xDB → ⇔, 0xAE → →, 0xD8 → ¬, per
`unicode.org/Public/MAPPINGS/VENDORS/APPLE/SYMBOL.TXT`). Where a stem was
checked against the source PDF the decode matched the scan exactly — see §3.1
of `SPLIT-FINDINGS-REVIEW.md`.

A 28-question source-read work list is staged in `tools/RECOVER_BRIEF.md`, and
all five source PDFs are present in the repo under `mpsc-cse-papers/`.

**The `recover-damaged-stems` workflow (`wf_7b642dd6-162`) was launched and
died before returning anything — 28 agents started, 0 results in its journal.**
It must be relaunched from scratch; `resumeFromRunId` is same-session-only and
cannot reach it. Nothing from it was applied, so there is no partial state to
reconcile.

`apply_audit_corrections.py` was already extended to handle stem and option
rewrites in anticipation of that pass, so the applier is ready when the
recovery results land.

One item needs no PDF: `GEN-161` is our own authored question with a defective
option, and it is a pre-pipeline hand-curated record (`srcKey: "GEN"`, not the
`GEN-{paper}-U{unit}` form `generate.py` emits), so it is not regenerated and
can be hand-edited directly.

---

## Part 3 — System Analyst TECH1 gaps (ANALYSIS DONE, AUTHORING NOT STARTED)

Scope: **Technical Paper I only.** Not TECH1_LEGACY, not TECH2, not TECH3.

### Concepts — 266 exist, and coverage is already good

`public/mpsc-system-analyst/data/concepts.js`, records shaped
`{id, paper, unit, unitTitle, sub, def, exp, facts, traps, mnem, rel}`.
TECH1 holds 70 / 66 / 65 / 65 across units 1–4.

Checked leaf-by-leaf against the syllabus text. The overwhelming majority of
syllabus phrases already have a concept. **The genuine gaps found:**

- **Unit 1 — Fuzzy sets.** The syllabus names "Fuzzy sets — Basic properties" as
  its own bullet, and the bank has **11 questions** on it but only **one**
  concept (`Fuzzy sets — membership & properties`). Needs splitting out:
  fuzzy set operations (union/intersection/complement via max/min), α-cuts and
  support/core/height, fuzzy relations and composition, and the
  crisp-vs-fuzzy contrast that the questions actually turn on.
- **Unit 2 — "Elements of the Design of control unit from Control Flow
  Diagram."** Named explicitly in the syllabus; no concept covers it. Hardwired
  and microprogrammed control units are both covered, but the control-flow-
  diagram-to-design derivation is not.
- **Unit 4 — File systems.** The syllabus spends a full clause on this ("File
  system; File concept — File Organisation and access mechanism; File
  directories") and the bank has **19 questions** tagged `File systems` — but
  exactly **one** concept, `File systems: organisation & directories`, carrying
  all of it. This is the widest gap in the paper. Wants splitting into: file
  concept/attributes/operations; access methods (sequential, direct, indexed);
  directory structures (single-level, two-level, tree, acyclic-graph);
  allocation methods (contiguous, linked, indexed); free-space management.
- **Unit 4 — "Operating System Design issues"** (the I/O chapter's own clause)
  has no concept.
- **Unit 4 — "Multiple Based Registers"** is thin; fixed- and variable-partition
  multiprogramming are covered, the multiple-base-register scheme is not.

Everything else in the four units maps to an existing concept. Unit 3 in
particular is complete against the syllabus — including the easily-missed
`packing`/`space array`, `threaded trees`, and `external search` clauses.

### Questions — where to look for gaps

> **Do not trust `tools/system-analyst-build/cse-2015-import/scripts/gaps.py`.**
> It exists, it answers exactly this question, and its answer is wrong in the
> dangerous direction — it reports **180 of the 266 TECH1 concepts as having no
> matching question**, which would justify authoring hundreds of duplicates.
>
> The cause is its matcher: it tokenises the concept's `sub` string and requires
> `len(overlap) >= len(tokens) - 1` against a question's `sub` + stem. For a
> concept titled *"Sets, subsets, power set, cardinality"* that demands four of
> five distinctive words in a single question — so it scores zero, while a plain
> regex finds **six** real questions (`TECH1_CSE_076`, `TECH1_CSE_124`,
> `ILM2010_P1_046`, `ILM2010_P1_058`, …). *"Process generation: fork, exec,
> zombies"* likewise reads as zero and has two (`MES2023_P2_011`,
> `MES2015_CSE_P2_003`).
>
> This is the `CLAUDE.md` rule — *verify content against source, don't trust the
> pipeline's own output* — landing on a gap-analysis tool instead of an
> extractor. Its per-unit **counts** (concept cards, total practice questions)
> are fine; only the "topics with NO matching question" list is unusable.
>
> The gap analysis therefore has to be **semantic**, not lexical: agents that
> read a unit's concept list alongside its actual question stems and judge
> coverage. That is the shape of the second workflow, and it must run before any
> authoring, or the "fill real gaps only" instruction turns into mass
> duplication.

TECH1 (excluding legacy) is 982 questions. The `sub` tags are **not** a clean
taxonomy: some questions carry the syllabus's own subtopic strings
(`"Posets, lattices and mathematical induction"`, 10 questions) while imported
papers carry free-form tags (`"Fuzzy defuzzification"`, `"Booth's algorithm"`).
Any gap analysis that groups on `sub` alone will produce noise. Map to the
`syllabus.js` `units[].subtopics` leaves instead, or to the 266 concept `sub`
values, which are the finer and better-behaved taxonomy.

The known thin areas, mirroring the concept gaps: **fuzzy sets** beyond
membership, **control unit design from a control flow diagram**, and the
**file-system** cluster in unit 4.

Note when authoring: PROG2018_P1 (100 questions, imported 2026-09-03)
contributes **zero** to unit 1. That paper simply does not test discrete
mathematics — a zero there is a real property of the source, not a tagging bug.

### House rules for authored content

- `tools/bank-rebuild/SOLVE_BRIEF.md` governs any agent asked to answer
  questions: never reorder options, be honest about confidence (do not inflate
  to `high`), do not fabricate, flag broken questions rather than silently
  picking.
- Explanations do **not** open with "The correct answer is (b)" — the UI already
  highlights it. Lead with the deciding fact, then say why the tempting
  distractor fails.
- Authored material carries provenance saying so. Precedent: System Manager's
  `TECH1P` paper is `counts_for_merit: false` + `in_exam: false` specifically so
  invented questions cannot leak into a "past paper" mock test.
  **Decide deliberately whether authored System Analyst questions go into
  `TECH1` or a quarantined sibling paper.** The 2026-09-03 DEVLOG entry lays out
  the argument both ways: System Analyst's `TECH1` already mixes 882 questions
  from adjacent real exams, so it has no past-paper purity to protect — but
  authored-from-nothing questions are a different category again from another
  authority's real paper.
- `provLine()` in the app renders `official key` (blue) versus
  `derived · high/medium/low`, and `derived · unrated` when `conf` is absent.
  **It must test that an official key exists, not that the word "official"
  appears** — most derived provenance strings end "…no official key for this
  sitting", and a bare `/official/i` once badged 309 derived answers as
  authoritative. Do not reintroduce that.

---

## Standing project rules that bit previous sessions

From `CLAUDE.md` and the DEVLOG, the ones most likely to matter here:

- **Verify against source; never trust the pipeline's own output.** This bank
  has had one silent-data-loss incident (~280 questions dropped with no
  numbering gap to reveal it) and one silent-corruption incident. If something
  looks off, go read the original PDF.
- **`pdftotext` silently destroys mathematics.** It collapses superscripts
  (n² → `n2`) and *drops symbols outright* — a previous import found Ω vanishing
  entirely, leaving `f(n)=(g(n))`. For anything with real notation, have agents
  read the PDF pages **visually**.
- Never filter by `topic`/`sub` string to infer a question's *type*. Use the
  discriminant field.
- Only commit or push when asked; show a summary of what changed first.

---

## Immediate next actions, in order

Steps 1–4 of the original plan are done (audit recovered, triaged, CONFIRMED
applied via idempotent scripts, browser-verified, DEVLOG written). What remains:

1. **Apply the ILM2023 official key** — 12 wrong answers, 123 re-provenanced.
   §0 of `SPLIT-FINDINGS-REVIEW.md`. Not a judgement call; the highest-value
   correctness work available.
2. **Sweep `~/Downloads/mpsc_pdfs_examination/Answer_Keys/` against both
   banks.** If ILM2023's key went unread, others may have too. Any sitting
   whose `prov` claims no key exists is a candidate.
3. **Get the user's decisions on the 20 SPLIT findings**, then apply them.
   §4 (three live answer disputes) is the part that changes what the app
   teaches; the rest is note/explanation wording.
4. **Relaunch the `recover-damaged-stems` workflow** (Part 2b) and apply its
   results through `apply_audit_corrections.py`.
5. Then, and only then, start Part 3 authoring — concepts first (the user's
   third ask names concepts and explanations explicitly), questions after.
