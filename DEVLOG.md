# Dev log

Append-only log of what got built, when, and why — written at the end of
(or when pausing) any nontrivial work session on this project. Newest
entry on top. Not a changelog for users; a memory aid for future sessions
(human or AI) so nobody has to re-derive context from git log + guesswork.

Each entry: **what shipped**, **why**, **what's still open**.

---

## 2026-08-31 (latest) — Election Paper II solved by two models that couldn't see each other

The entry below shipped Election Dec-2019 Paper II with **zero** usable questions:
the bank holds no answer for any of its 74, so `assemble.py` quarantined the lot.
This solves them. Bank 1,353 → **1,426**; the paper now contributes 73.

**Why a second solver, rather than a better one.** `solve.py`'s whole safety
property is *solve blind, then diff against the bank's inferred answer* — agree
means two independent derivations concur, disagree caps confidence and flags.
Election Paper II has nothing to diff against, so a lone solve would have shipped
its own self-assessed confidence completely unchecked. Model tier was never the
constraint here; these are diploma-level questions about mesh topology and `<OL>`
tags. The missing second opinion was.

So: two blind passes, **Sonnet and Opus**, deliberately different models —
two runs of one model agree without corroborating anything, because their errors
correlate. Pass B writes `.solved2.json` and was told in as many words not to open
pass A's output. Merge rules: agree → confidence is the *lower* of the two claims;
disagree → capped to medium with both answers shown; no pass B → `uncorroborated`,
capped to medium and said plainly.

**71 of 74 agreed.** The three that didn't are exactly the ones worth surfacing:

- **Q17** — "a set of one or more attributes taken collectively to uniquely
  identify a record". That is the definition of a *super key*; a candidate key is
  a *minimal* super key. Sonnet took the commonly-keyed answer, Opus the strict
  one. Genuinely contested, and the reader now sees both.
- **Q55** — how JavaScript is invoked; function call vs triggering event.
- **Q74** — both passes independently said the symbol figure was never extracted
  and their letter was a placeholder. They "disagreed" only about which
  placeholder. It stays quarantined rather than shipping a coin flip.

**Two pre-existing questions got more honest.** `CO2016B-P1-1` and `-51` had no
bank answer either and were previously badged with whatever confidence the solver
claimed. They are now `uncorroborated` and capped to medium.

**A provenance bug the browser check caught.** `disputeBlock()` hardcoded the
rival answer's label as "question bank" — true for the 16 bank disputes, a lie
for these two, where the bank held no answer at all and the rival is a second
model. `assemble.py` now emits `altSrc` and the UI renders "second solver" or
"question bank" from it. Verified both render correctly.

`assemble.py` also refused the build once, correctly: a solver wrote
`<a>...</a>` in an explanation and the closing-tag guard fired. The tags were the
subject matter, not formatting, so the explanation was rephrased rather than the
guard weakened.

**Verified:** reproducible md5 across runs, 1,426 unique ids, zero missing
answers, `tsc` clean, all ten tabs render, console clean, and both dispute
flavours labelled correctly in the browser.

**What's still open:** 540 questions still unverified — the 2018/2019 answers
other than Election P2 remain `unrated` straight from the bank. MIMER Computer
Operator Paper I is still missing from the corpus. The 10 quarantined
underline/passage questions still need their recovery pass.

---

## 2026-08-31 (late) — There were five Computer Operator sittings, not two. Bank 843 → 1,353

The user said the local question papers "didn't cover all past Computer Operator
or relevant papers". They were right, and it took three wrong answers from me
before the actual shape of the problem showed up.

**The finding.** MPSC has examined Computer Operator **five** times, not twice:

| Sitting | Papers | In the app before |
|---|---|---|
| SAD, 2016 | GE, P-I, P-II | yes |
| Mizoram Information Commission, 2016 | GE, P-I, P-II | yes |
| **MIMER, Feb 2018** | GE, P-I, P-II | no |
| **AH & Vety, May 2019** | GE, P-I, P-II | no |
| **Election Dept, Dec 2019** | GE, P-I, P-II | no |

Verified by scanning all 67 MPSC listing pages, not by trusting the local index.
Five sittings is the complete set — there is no sixth.

**Why nobody had seen them.** MPSC's listing pages put the post name in one
table cell and the paper links in the next. `mpsc-question-bank`'s scraper took
the *link text* as the title, so these papers sit on disk as `Paper-II(AH&Vety).pdf`,
`2.Technical Paper-I.pdf`, `3.Technical Paper-II.pdf` — the string "Computer
Operator" appears nowhere in the filename, the `paperId`, or `index.csv`.
BUILD_GUIDE §3's Tier 1 inventory was built by grepping the bank for "Computer
Operator", which is why it lists four papers and not ten. A keyword search
genuinely cannot find these; only the listing table can.

**The same flattening also destroyed a paper.** Two different URLs both save as
`2.Technical Paper-I.pdf` — MIMER Laboratory Technician and MIMER Computer
Operator — and one overwrote the other. The Computer Operator Technical Paper I
is *not* in the corpus. It is still live on MPSC
(`.../963bc976d8dfb7ce26c046ac1c4dba1b/technical-paper-i-compt.pdf`), has a clean
7-page text layer, and is the single highest-value thing left to recover.

**I imported 75 Laboratory Technician questions and did not notice.** The header
guard I wrote asked only for `MIZORAM INSTITUTE OF MEDICAL EDUCATION AND
RESEARCH`, which is true of every MIMER paper whatever the post — the same
too-loose-substring shape as the `/official/i` bug in CLAUDE.md. Bone types,
ketone bodies and Ziehl-Neelsen staining went into `staged/harvest.json` labelled
Computer Operator Technical Paper I, with a `prov` string asserting it. What
caught it was not the pipeline: two tagging agents refused to tag anatomy
against a computing syllabus and traced it to source. `header` is now a **list**
that must pin the *post*, not the employer, and there is a negative test proving
it rejects the Laboratory Technician paper and accepts the real Paper II.

**Three more real bugs found on the way:**

1. **`assemble.py` wrote before it validated.** Exactly the bug the entry below
   records fixing in `generate.py` — it was still live here, and shipped 1,363
   questions from a run that exited 1. Now nothing is written while any row is
   rejected; `--force` still allows it and says what it is letting through.
   Verified: a failing run leaves `questions.js` byte-identical.
2. **Cross-sitting dedup was gutting the newer papers.** MPSC reuses questions,
   and dropping the later copy left AH & Vety Paper I rendering 56 of its 75
   questions with no gap to show for it. Repeats are now kept and tagged
   `dup_of`, so every paper browses as it was actually sat.
3. **`tagging.py` told the tagger to leave GE `sub` null.** True when written;
   the taxonomy has since grown 37 GE leaves and `do_merge` rejects a null sub.
   The stale line had propagated into the batch `instructions` string and cost a
   full tagging round.

**MIMER Paper II was in the bank 91 times over for 75 questions** — 16 numbers
extracted twice, once keeping the printed fill-in-the-blank rule and once
stripping it. Options identical in all 16, so collapsing is safe; but 5 pairs
*disagreed on the answer*, and picking either would be a coin flip presented as
fact. Those 5 ship with no answer and a note naming both candidates.

**Shipped:** 843 → **1,353** questions, all 1,353 tagged to a leaf. Real past
questions went 453 → 963. Output is reproducible (identical md5 across runs),
zero duplicate ids, `tsc` clean, all ten tabs render with a clean console.

**111 quarantined, none silently dropped** — 89 no answer, 18 figure-only, 6
lost underline markers, 4 missing passages.

**What's still open:**

- **Election Dec-2019 Paper II contributes nothing.** All 74 of its questions
  have `answerIndex: -1` in the bank, so all 74 are quarantined. Solving them is
  the single biggest win available and needs the `SOLVE_BRIEF.md` Phase 3 pass.
- **The 2018/2019 answers are `unrated`** — straight from the bank's `inferred`
  values, never independently re-derived. The UI badges them honestly, but 437
  of them want a Phase 3 pass.
- **MIMER Computer Operator Paper I** needs downloading and parsing (see above).
- `extract_passages.py` and `patch_underlines.py` cover only the 2016 sittings;
  the 10 quarantined underline/passage questions need the same treatment.
- Agents flagged specific content defects worth chasing to source: `CO2019A-P2-1`
  calls SMTP a transport-layer protocol; `CO2019B-GE-13` reads "Gift of the cab";
  `CO2019B-GE-76` has two correct antonyms; `CO2019B-P1-57` references a VLOOKUP
  table the extractor never captured.
- **The scraper bug is unfixed in `mpsc-question-bank` itself.** It hid six
  Computer Operator papers and destroyed one. Other posts are certainly affected
  — Programmer under PHE-2018 (291 q) sits under `3./4./5.Technical Paper-*.pdf`
  by the same mechanism.

---

## 2026-08-31 (night) — The same two bugs were in the System Manager pipeline. Both fixed, all 363 generated ids stabilised

The System Analyst entry below found two bugs in `tools/system-analyst-build/`
and closed with a note that `tools/system-manager-build/` looked like it had the
same design. It did — both of them, in the same shapes.

**Bug 1, positional ids.** `generate.py:216` was
`for i, r in enumerate(out, 1): r["id"] = f"GEN-{paper}-U{unit}-{i:03d}"` — a
running counter over every batch in one list, so the id encoded where a question
sat among all the others. Authoring one batch would have renumbered everything
after it. Unlike the System Analyst side, nobody had triggered it yet, so it was
a trap rather than damage: the next Phase 4 run would have silently detached the
reader's Leitner boxes and the `mpsc-api` review records for every question after
the insertion point.

Ids are now derived from the question's own content, so they move only when the
question is rewritten, and a collision fails loudly instead of overwriting.

**Bug 2, validate-after-write.** `staged/generated.json` was written at line 220
and `problems` only reported at line 237 — after the success summary. Same as the
System Analyst pipeline, where that exact ordering had been quietly discarding
two authored questions for a day. Nothing is written now while any row is
rejected; `--force` still allows it and prints what it is about to discard.
Verified by feeding a deliberately broken row: exits 1, `staged/generated.json`
byte-identical before and after.

**All 363 generated ids changed once, and the reader's progress was carried
across.** `public/mpsc-system-manager/data/id-migration.js` maps every old id to
its new one, and `app.js` applies it once and records `S.migratedIds`. Validated
before shipping: every old generated id is covered, every target exists in the
bank, and no two old ids map to the same new one. Verified in the browser by
seeding progress on three pre-migration ids, reloading, and confirming it landed
on the same questions with attempts, box and star intact.

**The safety check that made this safe to do at all** was CLAUDE.md's own claim
that the pipeline reproduces its output byte-for-byte. It does — `assemble.py`
regenerated the committed `questions.js` to an identical md5 before any change
was made, which is what turned "regenerate 843 questions" from a gamble into a
verifiable operation. After the id change it is still reproducible across
repeated `generate.py --merge` + `assemble.py` runs. Bank size unchanged at 843,
zero duplicate ids.

Both apps were re-checked end to end afterwards: all ten tabs render in each,
console clean, System Analyst still 1,111 questions with 1,111 labels, `tsc`
passes.

**What's still open:**

- The System Manager bank's 843 questions are still **unlabelled** by study mode.
  `CLASSIFY_BRIEF.md`, `classify.py` and the side-file design all port with only
  a path change.
- Two `id-migration.js` files now exist, one per app, and both are disposable
  once no browser can still hold pre-migration progress. Neither has an expiry
  and nothing will remind anyone.
- The two `app.js` files have now taken the *same* fix twice in two days —
  `migrateIds()` is the fourth ported edit. BUILD_GUIDE.md §4 argued the fork was
  worth it; four is a reasonable point to re-open that.

---

## 2026-08-31 (later) — 27 .NET questions, and two silent-loss bugs the authoring pass exposed

Started as "is .NET coverage thin?". It was. Finishing it turned up two pipeline
bugs that were quietly losing and corrupting data, both older than this session.

**The measured gap.** TECH1 Unit 3 (.NET Technologies) is worth 30 marks across
22 leaves and had **30 questions with 9 leaves completely bare** — Object-Oriented
Programming in .NET, Dynamic Programming, Windows Controls, Web Services, LINQ
and Entity Framework, Design Pattern and UML, Reports, Threading, .NET
Interoperability. For comparison, Java/J2EE carries the same 30 marks across 9
leaves with only 1 bare. 27 questions authored, 3 per bare leaf; the unit is now
57 questions with every leaf covered.

Deliberately spread across four flavours rather than drifting into whichever is
easiest to write: 7 code-output prediction, 7 syntax/API recall, 7
conceptual/architectural, 6 configuration/deployment. Answer letters landed
A 7 / B 7 / C 7 / D 6.

**A System Analyst generation brief, because the shared one is actively wrong
here.** `tools/system-manager-build/GENERATE_BRIEF.md` is calibrated for a post
whose bar is *any graduate plus a one-year diploma*, and tells authors in as many
words not to write questions on **J2EE or design patterns**. System Analyst
requires B.E/B.Tech, MCA or M.Sc CS, has an entire J2EE unit, and names
`Design Pattern and UML` as a leaf — the exact two topics the shared brief
forbids. This was already worked around by hand once, out-of-band, in the TECH2
pass on 2026-08-30. There is now
`tools/system-analyst-build/GENERATE_BRIEF.md`, which inherits the shared output
schema and rules and overrides only the difficulty calibration, and `generate.py`
points at it.

### Bug 1 — `--merge` validated *after* writing, and had been dropping two questions

`do_merge()` collected rejected rows into `problems`, wrote `questions.js`
regardless, printed **"appended 252 authored questions"**, and only then
mentioned the rejects in a stderr footnote *below* the success line.

It had been silently discarding two questions since the TECH2 authoring pass. Two
hand-written IPC questions in `TECH2-U15-1.done.json` carried a `sub` whose
section list had lost `167, 172, 173` off the end, so it no longer matched the
syllabus leaf character-for-character, so both were rejected and dropped on every
merge from that day forward. The DEVLOG entry for that pass says the paper is
fully covered; that leaf was two questions short of what was actually authored.

Same shape as the OCR incident of 2026-08-04: no numbering gap, no error, a
reassuring count. Fixed both ends — the truncated `sub` is repaired (that leaf
went 3 → 5 questions), and **nothing is written while any row is rejected**.
`--force` still allows it but prints exactly what is about to be discarded first.
Verified by feeding it a deliberately broken row: exits 1, `questions.js`
untouched.

### Bug 2 — generated question ids were positional, so authoring anything renumbered everything

Ids were a running counter over the whole corpus: `GEN-TECH2-U1-001`, `002`, …
incrementing globally in batch-filename order. That makes the id a function of
where a question sits among *all* the others. Adding 27 TECH1 Unit 3 questions —
TECH1 sorts before TECH2 — moved **225 of the 254** existing generated questions
onto new ids in one run.

Three things are keyed on question id, and all three break silently when it moves:

- `data/modes.js`, the study-mode labels written hours earlier — 227 stopped matching
- the reader's localStorage Leitner boxes
- the `mpsc-api` review records (`bank_id` + `question_id`)

None of them error. The labels just quietly stop applying.

Ids are now **derived from the question's own content** (`sha1` of
paper|unit|sub|stem, truncated), so they do not move when a neighbour is added,
removed or reordered, and change only if the question itself is rewritten.
Verified stable across repeated merges. A collision now fails loudly rather than
overwriting.

**The fallout was repaired rather than accepted:**

- The 227 moved labels were remapped onto the new ids by content match, in the
  staged classification batch files — fixing the *inputs* so `classify.py --merge`
  regenerates `modes.js` correctly, rather than hand-patching the generated file.
  First attempt over-reached and rewrote two *past-paper* ids: this bank contains
  genuinely duplicate questions across the 2021 and 2024 sittings, so a
  content-only match wrongly equated `TECH1_OLD-66` with `TECH1_2024-64`. Scoped
  to the generated family only, and all 1,082 labels survived — 857 kept in
  place, 225 remapped, distribution unchanged.
- `data/id-migration.js` carries the reader's progress across the one-time
  change; `app.js` applies it once and records `S.migratedIds`. Without it, 225
  questions' revision history would have vanished with no error. Verified in the
  browser: seeded progress on three pre-migration ids, reloaded, confirmed it
  landed on the same questions under their new ids with attempts, box and star
  intact.

**Also added:** `classify.py --export --only-new`, which exports only questions
that have no label yet. Re-exporting all 1,111 to label 29 wastes the effort and
invites an agent to quietly contradict an earlier one on a question nobody asked
it to revisit.

The 29 new questions (27 .NET + the 2 recovered IPC) are labelled. Bank-wide:
**1,111 questions, 1,111 labelled, 0 unlabelled** — calculate 68 (6.1%),
understand 692, memorise 351.

**On sourcing.** The question that started this was whether to pull questions from
Sanfoundry. Topic *patterns* — what gets examined, which clusters recur — are
facts and fine to learn from. The question text is not: this app is deployed
publicly at india-study-map.vercel.app, so the personal-use fair-dealing
provision in s.52(1)(a) does not cover it. The practical objection is stronger
anyway — scraped questions arrive untagged to syllabus leaves, with unverifiable
answer keys, which is precisely the silent-wrong-content risk this project's
rules exist to prevent. Authoring against a named leaf is both safer and
better-aimed.

**Verified in the browser:** all ten tabs render, console clean, TECH1 U3 now
reports 57 questions (5 calculate / 20 understand / 32 memorise), the new
questions carry mode badges, and a generated code-output question was read end to
end in the real runner — `A r = new C(); r.Show();` with `new` rather than
`override`, correctly keyed to `B`.

**What's still open:**

- The System Manager bank has the **same positional-id design** in
  `tools/system-manager-build/`. It has not been audited and will have the same
  renumbering problem the next time anyone authors a batch there.
- `id-migration.js` is disposable once no browser can still hold pre-migration
  progress. It has no expiry and nothing will remind anyone.
- 13 .NET leaves still sit at 1–2 questions. The 9 bare ones are covered; parity
  with Java's density would be another ~30.
- The agent's least-confident item is the UML sequence-diagram question, where a
  communication diagram is arguably partly defensible.

---

## 2026-08-31 — Every question now says how to study it: calculate, understand, or memorise

**Why.** The app had three ways to learn something — the Calc Lab drills a
method, the Study pane explains a concept, the Leitner boxes rehearse a fact —
and no idea which of the 1,082 questions belonged to which. So all three got the
same treatment: read the explanation, tick the box, come back in 3 days. That is
the right treatment for none of them. "Which section of the IT Act recognises
digital records" and "why does a five-year data centre contract include a
technology-refresh clause" are not the same kind of problem and do not reward the
same kind of revision.

**What shipped.** `public/mpsc-system-analyst/data/modes.js` — all 1,082
questions labelled, each with a mode, a confidence and a one-line reason:

| mode | n | share | what it means |
|---|---|---|---|
| `calculate` | 63 | 5.8% | a method produces the answer — route to Calc Lab |
| `understand` | 681 | 62.9% | reason it from the concept — route to the Study pane |
| `memorise` | 338 | 31.2% | no derivation path — route to the review boxes |

Confidence: 646 high, 385 medium, 51 low.

Four behaviours in the app, all four requested:

- **A badge** on every question card, in the quiz runner, the post-quiz review
  list and the paper browser.
- **A study-mode filter** in Practice, plus three one-click drills ("drill the
  by-heart ones") that respect the paper/unit selection and ignore the rest.
  The pool line now also shows the mix of whatever is selected, so you see the
  split *before* committing to a session.
- **Mode-paced spaced repetition.** The same Leitner box no longer buys every
  question the same interval: `memorise` comes back at 0.6× and `understand` at
  1.4×, because an arbitrary section number decays far faster than a principle
  you actually follow. Verified in the browser — same box 2, three different
  intervals: 1.0d / 1.4d / 0.6d. A question you get *wrong* still returns
  immediately whatever its mode.
- **A per-unit mix table on the dashboard**, sorted grind-first, so you can see
  which units need calendar time and which need insight before starting them.

**The rubric did the work, not the model.** `CLASSIFY_BRIEF.md` follows
`SOLVE_BRIEF.md`'s precedent and turns on two rules that make the hard boundary
decidable:

1. *Judge against a competent practitioner, not yourself.* You may know HTTP is
   port 80, but that came from memorising it, not from understanding HTTP. Ask
   where the knowledge comes from, not whether you happen to have it.
2. *When honestly torn, choose `memorise`* — because the two errors are not
   symmetrical. Mislabel a memorise item as understand and the reader forgets it
   and drops a mark; mislabel the other way and they merely see it a bit too
   often. Bias to the cheaper mistake, and set `confidence: medium` so the bias
   is visible rather than hidden.

**The rule pre-pass is a cross-check, not a classifier — and it lost.**
`classify.py` carries a deliberately narrow regex pass whose only job is to
disagree with the agents on `--merge`. It disagreed **4 times in 1,082 (0.4%)**,
and the agents were right in all four: my heuristic counted "how many bytes is
the IPv6 header" and "how many districts does Mizoram have" as *calculations*.
They are remembered constants.

That same heuristic is why the brief originally told agents `calculate` was
"about 12%" of the bank. The real figure is **5.8%**. The brief has been
corrected, with the wrong guess left in it as a note — it is the clearest
possible argument for why the two opinions are kept separate.

**Honest about what this label is.** Unlike an answer key, it cannot be verified
against the source PDF. "Is this rote?" is partly a judgement and partly depends
on what the reader already knows. So it does not meet CLAUDE.md's
verify-against-source bar, and it is not claimed to. What makes that acceptable
is the failure mode: a mis-labelled question sends you to the wrong study mode,
it does not teach you a false fact. Different risk class from solving, and the
reason this was safe to automate at all.

**Why a side-file and not a field on the question.** `generate.py --merge` is
idempotent by dropping every `GEN-` question and rebuilding it from
`staged/generating/`. A `mode` written into `questions.js` would have survived on
the past-paper questions and been silently erased from the ~425 generated ones on
the next run — a partial, invisible loss of exactly the kind this project has
already been bitten by twice. The labels live in their own file keyed on question
id, which no other pipeline touches, and which ports to the System Manager bank
with no schema change.

**Found in passing, and worth its own session: ~20 questions whose answer key
contradicts their own explanation.** Five agents independently reported these
without being asked to look — `TECH3_2024-21` is keyed "Quality control" while
its explanation argues Quality assurance throughout; `TECH1_2024-89` and
`TECH1_OLD-100` are the same question verbatim keyed to different answers. One of
each pair is wrong, and this is the real thing CLAUDE.md is about. Spawned as a
separate task with the full list, and asked for a *systematic* detector rather
than working the anecdotal list, since GE and GS were tagged by an agent that was
not looking for it.

**Interrupted by a session limit mid-run and resumed without loss** — because the
pipeline writes per batch. 29 of 56 batches were on disk when three agents were
cut off; those were validated (693 labels, zero problems) and only the missing 27
were re-run. The relaunched agents were told explicitly to write each file as
soon as it was labelled rather than holding everything to the end.

**Verified in the browser:** dashboard mix table ranks GS Indian History at 100%
by-heart and TECH3 abstract reasoning at 0%, which is the right answer; Practice
filters report 63 / 681 / 337 and re-slice correctly per paper; the mode drills
respect the paper scope; badges render in all three places; the Review tab's
due-by-mode buttons filter the due pool. Console clean. Screenshot tool timed out
again in this environment, so this is DOM assertions rather than an image.

**What's still open:**

- **The System Manager bank (843) is not labelled yet.** The brief, the pipeline
  and the side-file design all port with no changes; only `classify.py`'s paths
  are System Analyst-specific.
- The `understand` / `memorise` boundary is a line, not a fact. The agents flagged
  their own least stable calls — the FOSS licence-family items, PMBOK
  ITTO questions with an off-domain distractor, and scheme-name-to-objective
  mappings. 51 items are `low` confidence and would be the place to start a
  review pass.
- The mode pace multipliers (0.6 / 1.0 / 1.4) are a judgement, not a measurement.
  Once there is enough answer history, the honest version is to derive them from
  observed forgetting rates per mode rather than asserting them.
- Nothing yet uses the label to *route* the reader — a `memorise` question you
  keep failing could offer a mnemonic, and a `calculate` one could offer the
  matching Calc Lab generator by name. The data is now there to do it.

---

## 2026-08-30 — Calc Lab in the System Analyst app: 32 generators ported, 21 written for the routing/switching leaves the other syllabus does not have

Follows the System Manager Calc Lab shipped earlier the same day (its own entry
sits below this one once that work is committed). This is the System Analyst
half: same feature, a different syllabus, and a third of the content is new.

**The gap, measured before writing anything.** The System Manager entry counted
one subnetting calculation in 843 questions. The System Analyst bank is worse
where it matters most, because TECH1 is a *merit-bearing* paper and its Unit 1
is the entire networking core:

| TECH1 Unit 1 leaf | Questions in the 1,082-question bank |
|---|---|
| EIGRP and OSPF | 4 |
| Sub-netting | **2** — and only `TECH1_2024-7` is a real calculation |
| Spanning Tree Protocol | 2 |
| Network Address Translation | 2 |
| Virtual LANs | 1 |
| IOS and Security Device Manager | 1 |
| **IP Routing** | **0** |

40 questions across all seventeen leaves. Six of them cannot be drilled from the
bank at all. The concept cards for these topics are good — they were written in
the Phase 5 pass and carry the real cost tables, AD values and election rules —
but reading a card does not build the fluency an OSPF cost question wants.

**What shipped: `public/mpsc-system-analyst/data/calc.js`** — 53 generators in
11 groups. 32 are ported from the System Manager file, 21 are new:

- **OSPF & EIGRP** (6, new) — OSPF cost from bandwidth (10^8 ÷ bw, truncated,
  floored at 1), the EIGRP composite metric with default K-values, DR/BDR
  election, the five area types by what each one blocks, the `network` statement's
  wildcard, and AD comparison between two protocols offering the same prefix
- **Spanning Tree Protocol** (4, new) — root bridge election, Root Port by
  cumulative path cost, 802.1D states and timers, PortFast/BPDU Guard/RSTP
- **IP routing & path selection** (3, new) — longest-prefix match against a real
  four-entry table, default AD values, the default route
- **VLANs & trunking** (3, new) — 802.1Q tagging and the native-VLAN exception,
  native-VLAN mismatch, counting broadcast domains
- **Network Address Translation** (3, new) — choosing the variant, reading a
  translation table under PAT and static NAT, the inside/outside local/global grid
- **Cisco IOS command modes** (2, new) — prompt-to-mode, and which command does what
- plus the 32 ported: subnetting (12), IPv6 (3), number systems (6), DBMS (4),
  Java traps (7)

**Retagging was the substance of the port, not a find-and-replace.** The two
syllabi genuinely differ and `conceptFor()` matches the full `paper|unit|sub`
triple, so a stale tag silently breaks the "read the concept" link rather than
erroring:

- The leaf is `Sub-netting`, hyphenated — not `Subnetting`.
- IPv6 is its own TECH1 Unit 1 leaf here, not folded into an `IPv4 and IPv6` leaf.
- The System Manager's `IP Addressing` leaf does not exist. Address classes and
  the RFC 1918 ranges both live inside the `Sub-netting` concept's own facts here,
  so that is where those two generators point.
- Number systems went to `Basic Computer System`, whose facts already carry
  "1 byte = 8 bits; 1 KB = 1024 bytes". No derived concept was needed — unlike
  the System Manager, which had to invent one.
- The Java traps went to TECH1 Unit 4 `OOPS and Core Java`, a real leaf, rather
  than the System Manager's three-leaf spread.
- **Six generators were dropped**: first/best/worst fit, internal and external
  fragmentation, page count, address splitting and cache EAT. This syllabus has
  no operating-systems or computer-organisation unit, so they have no leaf to
  hang from and would have been orphans. `address-lines` survived because the
  `Basic Computer System` concept does teach the address bus.

A check that every generator's triple resolves against **both** `syllabus.js`
and `concepts.js` runs as part of the build notes; all 53 resolve.

**Testing: 132,500 fuzzed items and 88,757 independently re-derived answers.**
Two harnesses in `tools/system-analyst-build/`, reusing the pattern that caught
four duplicate-option bugs in the System Manager build:

- `calc-fuzz.mjs` — every generator over 2,500 seeds, asserting four *distinct*
  options, an answer key that points at a real option, no leaked placeholders,
  and at least three worked steps. Duplicate options are the headline check:
  they mean two letters are correct and the item marks a right answer wrong.
- `calc-verify.mjs` — parses each generated question's **text** and recomputes
  the answer from scratch, sharing no code with `calc.js`. Its IPv4 arithmetic
  works on decimal octet arrays where `calc.js` uses 32-bit ints; its IPv6
  routines work on strings where `calc.js` uses arrays of numbers; expressions
  go through a hand-written recursive-descent parser rather than JavaScript.

**Honest result: the suites found two bugs, and both were in the tests.** Unlike
the System Manager run, no generator was wrong — the new distractors were built
distinct-by-construction from the start precisely because that run had already
named the failure mode. What the suites did catch:

- The fuzzer's placeholder detector flagged `exception-type` and `pass-semantics`
  on ~1,300 seeds. Both were **real content**: one teaches that floating-point
  division by zero yields `NaN`, the other offers Java's `null` as a distractor.
  Fixed by making the check *stricter and explicit* — an allowlist naming which
  generator may say `NaN` and why — rather than loosening the regex for everyone.
- The verifier's own regexes were wrong twice: `[\d.]+` greedily swallowed a
  sentence's full stop out of a NAT address, and the OSPF bandwidth pattern
  missed `a T1 serial link (1544 kbps)` where the speed sits in parentheses.

`calc-verify.mjs` covers **36 of 53** generators. The other 17 are lookup items —
"which exception does this throw", "which OSPF area type is described" — whose
answers are hand-authored facts, not arithmetic; re-deriving them would mean
writing the same table twice and proving nothing. The tool prints them as
`n/a — unverified` with a reason each, and **fails** if a generator has neither a
verifier nor a declared reason, so the coverage gap cannot widen silently.

**The Study pane had the same `derived`/`prov` gap the System Manager did.** It
rendered neither the pill nor the provenance note. No System Analyst concept
currently carries `derived: true`, so nothing is mis-presented today — but the
gap was latent, and the first derived card added would have read as official by
omission, which is the exact failure mode fixed twice already this week. Both
lines are now in place.

**Verified in the browser**, per the standing rule: dev server, the real route
(`/mpsc-system-analyst/index.html`), all **53 generators driven through the
actual drill UI** — four options rendered, a stem, a worked solution of at least
three steps after answering. Console clean. The "read the concept" link was
followed and lands on TECH1 Unit 1 `EIGRP and OSPF`, confirming the `sub`-as-id
resolution ported correctly. One caveat: the screenshot tool timed out
repeatedly in this environment, so the visual check is text-extraction and DOM
assertions rather than an image.

**What's still open:**

- The 17 lookup-only generators are unverified by construction. A future pass
  could cross-check their hand-authored facts against the concept cards' `facts`
  arrays, which is where those claims already live — that would be a real check
  rather than a duplicated table.
- Calc Lab progress (`S.calc`) is per-generator and deliberately outside the
  Leitner schedule, so a topic you are weak at in Calc Lab does not raise its
  weight in Daily Test. Linking the two is the obvious next step.
- `.claude/launch.json` briefly carried a second config on port 5273 so this
  worktree could run alongside another session's server. It has been reverted;
  if you hit "port 5173 in use" again, that is why.
- The two `app.js` files and the two `calc.js` files remain a deliberate fork
  (BUILD_GUIDE.md §4). Three ported bug-fix-shaped edits now have to be made
  twice. Worth revisiting if a fourth appears.

---

## 2026-08-30 — Calc Lab: the procedural topics had concepts but no practice. 38 generators, plus two derived concept cards

**The gap, measured before writing anything.** The concept guide explains
subnetting, IP addressing and ER modelling well — worked /26 examples, the
block-size shortcut, every Chen symbol. What it could not do is build fluency,
because the question bank had nothing to drill against:

| Topic | Real calculation questions in the 843-question bank |
|---|---|
| Subnetting | **1** |
| Hex / base conversion | **1** — and borrowed from `mpsc-jso-prep`, its own `prov` says "Not a past System Manager question" |
| Memory allocation | 0 |

Subnetting and base conversion are procedural skills. Reading a 250-word card
once teaches nothing durable, and a pool of one teaches you that one answer.

**What shipped: `public/mpsc-system-manager/data/calc.js`** — 38 seeded
generators across 6 groups, producing unlimited items, each with a worked
step-by-step solution and a named trap:

- **IP addressing & subnetting** (12) — hosts per subnet, network/broadcast/host
  range, subnet count, mask↔prefix, wildcard masks, same-subnet decision, VLSM
  sizing, route summarisation, class identification, private/APIPA/loopback
- **IPv6** (3) — compress, expand, address type
- **Number systems** (5) — base conversion all directions, binary→hex by nibbles,
  two's complement, storage units, bit capacity
- **DBMS** (4) — highest normal form, dependency type, ER→table mapping, degree
  vs cardinality
- **Memory allocation, paging & cache** (7) — first/best/worst fit, internal and
  external fragmentation, page counts, address splitting, address lines, EAT
- **Programming traps** (7) — integer division/modulo (including the C-vs-Python
  sign difference), operator precedence, loop off-by-one, exception types,
  try/catch/finally, short-circuit evaluation, pass-by-value

Every generator computes its answer arithmetically and derives distractors from
*named* mistakes, so nothing carries a hardcoded key that could drift from the
stem. The nine normalisation scenarios are the deliberate exception, hand-authored
verbatim — substituting random attribute names into a dependency structure is
exactly how you silently produce a scenario whose stated answer is no longer true.

**Fuzzing caught three real bugs that reading the code did not.** 76,000 generated
items checked for structural validity, then 8,000 re-derived by an independent
second implementation (`scratchpad/verify.js`) that parses the question text and
recomputes the answer from scratch:

- `network-address` — `netOf(ip, p-1)`, `netOf(ip, 24)` and `net + 1` all
  collapse onto the correct answer for many (ip, prefix) pairs. Three-option items.
- `ipv6-compress` — when every hextet is already four digits wide, the "leading
  zeros wrongly retained" distractor is textually identical to the answer.
- `integer-division` and `loop-iterations` — trunc/round, and `end` vs
  `end - start`, collapse in the common cases.

All four produced **duplicate options**, which means two letters correct. Exactly
the class of silent-wrong-content `CLAUDE.md` exists to prevent, and invisible to
inspection. Fixed by supplying distractor candidates that are distinct by
construction; the fuzz + independent-verify pair now runs clean.

**Two derived concept cards**, because two drills had no concept behind them:

- `Number Systems and Data Representation` (TECH1 Unit I) — the syllabus lists no
  number-system leaf, and `Functional Components of a Computer` contains zero
  mentions of binary, hex, byte or nibble. But the 2016 Computer Operator Paper I
  — which *is* this syllabus — asks "A group of four bits is also called"
  (`CO2016A-P1-4`).
- `Normalisation` (TECH2 Unit II) — the syllabus lists Data Models and ER
  Modelling but no normalisation leaf, while five 1NF/2NF/3NF/BCNF questions
  already sat in the bank orphaned under "Relational Database Management System".

Added via a new `TECH_DERIVED` map in `concepts.py`, not by hand-editing the
generated `.js`. They ship `derived: true` with their own provenance string,
placed at the end of their unit so every official concept keeps its id. 296 → 298.

**Also fixed, found while wiring the drill's "read the concept" link:**

- `VIEWS.study` takes an option named `sub` but reads it as a concept **id** —
  passing the actual subtopic string silently lands on the paper overview instead
  of the concept. Now resolved through `conceptFor()`, matching the full
  `paper|unit|sub` triple because six leaf names are reused across units.
- **The Study pane never surfaced `derived`/`prov` at all.** All 37 General
  English derived cards have read as official since Phase 5. Same failure mode as
  the inverted confidence badge fixed yesterday: derived content presented as
  authoritative by omission. The pane now shows a `derived — not in the official
  syllabus` pill and the provenance note.

Calc Lab progress lives in `S.calc`, keyed by generator id, deliberately **not**
merged into `S.questions` — generated items have no stable id, so a Leitner box
cannot apply and would corrupt the due counts.

**Verified in the browser**, per the standing rule: all tabs render, console clean,
dashboard reads 298 of 298, drills reveal answer + steps + trap, the concept link
lands on the right card, and the derived badge shows.

**What's still open:**

- **The System Analyst port.** The CCNA topics the user actually asked about —
  `IP Routing`, `Spanning Tree Protocol`, `EIGRP and OSPF`, `IOS and Security
  Device Manager`, `Virtual LANs`, `Network Address Translation` — are **SA
  TECH1 Unit 1 leaves and are not in the System Manager syllabus at all**. SM's
  networking unit stops at generic `Routing and Switching`. Those generators
  (OSPF/EIGRP metric calculation, STP root-bridge election, VLAN/trunk, NAT
  translation tables, IOS command syntax) belong in the SA Calc Lab, along with
  a port of the 26 generators that are syllabus-neutral.
- `calc.js` and the two `app.js` copies remain a **fork, not a shared module**.
  The Calc Lab view will need patching in both.
- Aptitude generators (percentage/ratio/time-and-work for TECH2 Unit V
  `Numerical Ability`) were scoped out deliberately — the existing Aptitude Hub
  module covers that ground.

---

## 2026-08-29 (late) — The confidence badge was inverted on 309 questions, live. Fixed, ported to System Analyst, and both apps now lead with the syllabus

**The bug: `provLine()` badged 309 derived answers as coming from an official
answer key.** It decided by testing `/official/i` against the provenance string —
but almost every derived string in the System Manager app *ends* "...No official
MPSC key exists", and the regex matched the word inside the negation.

So the one control whose entire job is telling a reader which answers to distrust
was telling them the exact opposite, on 309 of 843 questions, in production.

Fixed to test that an official key *exists* rather than that the word appears:

    /official/i.test(prov) && !/\b(?:no|without|never)\s+official/i.test(prov)

Verified in the browser: those questions now render `derived · high/medium/low`,
and in System Analyst — which has genuinely mixed provenance — the 2024 paper
still shows 100 blue `official key` badges while the 2021 papers show derived
with an honest confidence split (60 high / 35 medium / 5 low).

This is a good argument for building the badge before the data rather than after.
It shipped when every answer in the app was derived, so there was no
official-key case to contrast against and nothing looked wrong. The bug only
became visible once a second app with real official keys existed.

**Ported to System Analyst**, which `CLAUDE.md` listed as lacking the badge
entirely:

- `provLine()` with the negation fix, wired into all three render sites. That app
  mixes four kinds of answer — 274 from MPSC's published final key, 96 agreed by
  two independent solvers, 4 from a single unverified solver, and 195 newly
  blind-solved — and they were previously indistinguishable.
- The concept→question link now matches the full `paper|unit|sub` triple rather
  than `paper + sub`. TECH1 reuses the leaf name "Threading" across units, so the
  collision was live, if narrower than System Manager's six.
- `rel` cross-links resolve nearest-first (same unit, then paper, then anywhere).
- `of 727` is derived from the syllabus instead of hardcoded.

`CLAUDE.md`'s known-rough-edges entry is updated, including the warning about the
negation, since that trap will recur for anyone touching the helper.

**Both apps now open on a Syllabus view.** The first question a candidate has is
not "how am I doing" — the progress counters read zero before you start — but
"where are the marks", and in both exams the answer is uneven in a way that
should drive revision:

- **System Manager**: Unit I of Technical Paper I is 60 of 400 marks, more than
  Word Processing and Presentation Software combined.
- **System Analyst**: General English and General Studies are 200 marks that earn
  **nothing** toward merit and only need 50% to pass, while merit is decided by
  the three technical papers plus the interview — 700 marks. Revising the wrong
  200 is a real risk, so the view splits "counts for merit" from "qualifying
  only" and states the merit total explicitly.

Each unit renders as a row whose background bar is drawn to scale from its marks,
expanding to the official subtopic list with concept and question counts
attached. Everything reads from `syllabus.js`, so the marks shown are the
paper's own.

**Current totals:** System Manager 843 questions / 296 concepts; System Analyst
857 questions / 727 concepts. Both build clean, `tsc` passes, no console errors.

**What's still open:**

- The 195 new System Analyst questions remain untagged (`unit`/`sub` null), so
  the Study tab cannot link them to concepts.
- 26 System Analyst disagreements and 16 System Manager ones await a human call.
- System Analyst still hardcodes `EXAM_HINT = '2026-11-01'`, an invented date —
  the same thing fixed in the System Manager fork.

---

## 2026-08-29 (night) — System Analyst: recovered the 2021 Informatics Officer papers. 857 questions, and the bank's answers for that sitting turn out to be ~29% wrong

**What shipped:** the two missing 2021 Informatics Officer technical papers,
solved and added to the System Analyst app. **857 questions, up from 662**, every
one carrying an explanation (the 2021 papers had none).

| Sitting | Paper | Before | Now |
|---|---|---|---|
| Nov 2024 | Tech I / II / III | 275 | 275 |
| 2021 | Technical Paper I | 100 | 100 |
| 2021 | **Technical Paper II** | **0** | **100** |
| 2021 | **Technical Paper III** | **0** | **95** |

**My earlier estimate was wrong and the data said so.** I described Paper III as
"pure harvest, no solving — 92 already answered". Auditing the bank showed those
92 are `answerSource: "inferred"` — unverified, no official key — and that
*neither paper has a single explanation*. The 8 labelled `key` have no answer at
all; the label is aspirational. So this was ~200 derivations, not a copy job.

**The headline finding: the bank's 2021 answers are far less reliable than its
2016 ones.** Blind-solved and diffed, the agreement rate is **71% (66 agree, 26
disagree)** against **94% for the Computer Operator papers**. Roughly one in
three of that sitting's stored answers is wrong.

Five disagreements I verified independently, and the solver is right in four:

| Question | Bank | Verified | Fact |
|---|---|---|---|
| Define Scope outputs | scope statement + WBS | scope statement + RTM updates | WBS is created by Create WBS, a later process |
| "begins 10 days before predecessor finishes" | Start-to-Start | **Finish-to-Start** | FS with a 10-day lead |
| NOT an activity attribute | leads and lags | time when to perform | Leads/lags *are* attributes; dates come from Develop Schedule |
| Thursday + 59 days | Monday | **Sunday** | 59 mod 7 = 3 |
| Scope change routed through process | scope management | change control | genuinely arguable |

The fifth is a real judgement call rather than a bank error, which is the right
proportion — a solver that disagreed with everything would be the worrying one.

**Model choice was split on whether a cross-check exists**, not on blanket cost.
Paper III has 92 priors to diff against, so the diff is a genuine safety net and
Sonnet solved it. Paper II has *nothing* — `answerIndex: -1` on all 100, no key,
no prior — so the model's output is the only answer those questions will ever
have, and Opus solved it. Haiku was not used for either; it is right for tagging
against a fixed taxonomy, not for deriving degree-level answers with no key.
The Paper II agents were told explicitly that nothing would check them and that a
truthful "medium" beats a hopeful "high", since the badge is what tells a reader
which answers to distrust.

**Agent honesty held up under that instruction.** They flagged genuinely
defective items rather than papering over them — a "signs of poor governance"
question where two options are both correct, a security-lifecycle question whose
options A and D name the same stage, a team-composition "false statement"
question where all four options are defensibly true — and listed medium-confidence
items they could not verify instead of quietly rating them high.

5 figure-dependent questions were quarantined rather than shipped unanswerable.

**What's still open:**

- **The 195 new questions are UNTAGGED** (`unit`/`sub` null), so the Study tab
  cannot link them to concepts. Same gap the General English questions had in the
  System Manager app until they were re-tagged. A tagging pass would fix it.
- **26 disagreements want a human decision** —
  `tools/system-analyst-build/staged/disagreements.json`. Given the 71% agreement
  rate, this list is more consequential than System Manager's was.
- **System Analyst still has the two bugs fixed only in the System Manager fork**:
  it shares the `mpsc_sa_v1` localStorage key logic pattern, and links questions
  to concepts on `paper + sub` without the unit, which collides where a leaf name
  repeats. It also has no `prov`/`conf` badge, so its 4 "single solver —
  treat with caution" questions look identical to the 274 official-key ones.

---

## 2026-08-29 (evening) — Phase 5 complete: 296/296 concepts, ~81,000 words. The whole build is done, and a subagent caught the pipeline about to silently destroy its own output

**Phase 5 is finished.** Every one of the 296 syllabus subtopics has a concept —
259 official technical leaves plus the 37-item derived General English breakdown.
**~81,000 words, mean 273 per concept**, every unit of every paper covered.

| Paper | Units | Concepts |
|---|---|---|
| General English | 6/6 | 37 |
| Technical Paper I | 5/5 | 123 |
| Technical Paper II | 5/5 | 136 |

Final state: **843 questions, all tagged and all explained; 296 concepts, 275 of
them with drillable questions attached.** The 21 without are correct by design —
Précis and Letter Writing can never have MCQs, and a handful of vocabulary
subtopics simply were not set in these two papers.

**A subagent caught a bug that would have destroyed finished work silently.**
`concepts.py --export` numbers batches over *remaining* work, so once a unit is
partly done a re-export restarts at `-1` — a filename whose `.done.json` already
exists. The IT Governance agent noticed mid-task that the todo files had been
re-partitioned under it and wrote: "any agent handed that recycled filename would
write over my TECH2-UV-1.done.json." I had already dispatched exactly that agent.

Backed up the file, redirected the running agent to safe paths, and fixed
`--export` to skip past any batch number already claimed by a `.done.json`. The
second agent had independently spotted it too and never touched the file, so
nothing was lost.

Worth recording *why* this one matters: **the loss would have been silent.** No
error, no count mismatch — nine finished concepts replaced by nine different ones
under the same name, and the merge would have reported a plausible total. The
pipeline asserts hard on question counts at every stage because this bank has a
history of losing data quietly; it had no equivalent protection against
clobbering its own output. Same failure family as the four bank data-loss classes
found earlier, and the fifth time today that writing output early or checking a
count was what saved the work.

**Two validator fixes, both the same lesson twice.** `concepts.py`'s HTML check
flagged any tag-like token, so the Web Technologies concepts could not name an
element while teaching HTML — narrowed to closing tags only, exactly as
`assemble.py` was narrowed earlier after it false-positived on eight explanations.
A web agent hit this and worked around it by dropping angle brackets entirely
before I fixed it.

**And one display bug caught in the browser, not by tsc.** The dashboard read
"296 of 259 syllabus sub-topics defined" — `TOTAL_SUBTOPICS` counted only official
syllabus leaves while the guide now includes the derived General English
breakdown. The denominator now derives from both sources: the syllabus's own
leaves plus whatever derived subtopics the concepts define. Reads 296 of 296.

**What's still open:**

- The 16 Phase 3 disagreements still want a human decision (they ship safely with
  the corrected answer, capped confidence and a visible conflict note).
- The MIC General English paper's lost direction lines are unrecovered.
- `generate.py --merge` still silently drops unknown fields.
- 20 of the 37 derived General English subtopics have no questions, listed in
  `staged/coverage-gaps-GE.json` — mostly correct by design, but one-word
  substitution and spelling could be filled from the ~6,300 GE questions in the
  bank if that ever seems worth doing.

---

## 2026-08-29 (later) — All 34 General English concepts were orphaned; found by an agent, not by me. 218/296 concepts, 843/843 questions now tagged

**The bug.** Every General English concept was unreachable from its questions.
`app.js` links concept to questions on `paper + unit + sub`, and all 160 GE
questions carried `sub: null` — so not one of the 34 GE concepts could show a
"Practise N questions" button. **75 marks of study material with no drill
attached.**

I introduced it. When the tagging pass ran, GE had no concepts, so I instructed
that agent to tag the unit only and leave `sub` null — correct then, because the
official MUDAL syllabus enumerates no GE subtopics and inventing them would have
misrepresented it. It became wrong the moment Phase 5 authored a derived
breakdown, and nothing re-checked the assumption. Two concept-writing agents
flagged it independently, one citing the exact source line.

**The fix.** `export_taxonomy.py` now imports `GE_DERIVED` from `concepts.py`
instead of treating General English as subtopic-less, so concepts and questions
share one source of truth. The validator immediately did its job — it began
rejecting all 40 null GE tags rather than passing them silently.

**The derived breakdown was also wrong, and the questions proved it.** Reading
the tagged bank showed Unit 4 is mostly preposition gap-fills and verb-form
choices, with only ~6 of ~28 items being parts-of-speech identification, and that
six Unit 6 marks ask what *notion* a sentence expresses — none of which the
existing subtopics covered. Added three: "Prepositions and their correct use",
"Verb forms and tense in context", and "Sentence types by function: assertive,
interrogative, imperative, exclamatory". That is the derived list being corrected
by evidence rather than by my guess at what General English contains. Total
targets went 293 → 296.

**Result, verified in the browser:** 160/160 GE questions re-tagged, **843/843
questions now carry a leaf subtopic** (was 683), and clicking the "Idioms and
phrases" concept offers "Practise 32 questions" and drills into them. 198 of 218
concepts now have questions attached.

The 20 GE concepts still without questions are almost all correct-by-design:
Précis and Letter Writing can never have MCQs, and one-word substitution,
spelling, active/passive and direct/indirect simply were not set in these two
papers. They are listed in `staged/coverage-gaps-GE.json`.

**Also completed this round:** all 37 General English concepts (Units 1–6) and
TECH1 Unit II Operating Systems at 29/29. 218 of 296 concepts, ~59,500 words.

**Judgement worth recording.** The Unit II agent kept the four monitoring tools
distinct by giving each an anchoring sentence plus a cross-cutting "X versus Y"
trap naming the others, so the boundary is taught from both sides — Task Manager
is *now*, Resource Monitor is *which file or connection*, Performance Monitor is
*counters over time*, Event Viewer is *the past record*. It also wrote Command
Prompt against the bank's actual DOS-era question set rather than as a modern
shell overview, which is the right call when the questions are what the candidate
will meet.

**What's still open:**

- **78 concepts remain**: TECH1 Word (8 of 17 left), Excel (9 of 18 left),
  PowerPoint (14), TECH2 Web (26) and IT Governance (21). Word and Excel are
  mid-flight.
- The `--merge` unknown-field warning is still unwritten.
- The 16 Phase 3 disagreements and the MIC paper's lost direction lines remain.

---

## 2026-08-29 — System Manager Phase 4 complete: 843 questions, every technical subtopic covered, and the app can finally run a full-length mock

**What shipped:** Phase 4 finished — **363 authored questions** across all nine
uncovered units, bringing the bank to **843 questions, every one carrying an
explanation** (453 past-paper, 390 authored).

**Every unit now has at least 1.5 questions per mark:**

| Unit | Marks | Questions | Q/mark |
|---|---|---|---|
| TECH1 I Fundamentals | 60 | 115 | 1.9 |
| TECH1 II Operating Systems | 25 | 74 | 3.0 |
| TECH1 III Word | 20 | 43 | 2.1 |
| TECH1 IV Excel | 25 | 48 | 1.9 |
| TECH1 V PowerPoint | 20 | 30 | 1.5 |
| TECH2 I Networking | 35 | 66 | 1.9 |
| TECH2 II DBMS | 35 | 85 | 2.4 |
| TECH2 III Web | 25 | 64 | 2.6 |
| TECH2 IV Cyber/AI | 30 | 99 | 3.3 |
| TECH2 V IT Governance | 25 | 59 | 2.4 |

TECH2 Unit I — the worst ratio this morning at 35 marks and 16 questions — is now
at 66. The only zero rows left are GE Précis and Letter Writing, which are
**handwritten in the real exam and can never have MCQs**; they are covered by
concepts instead.

**The app can now simulate the real paper.** Verified in the browser: a
75-question, 2-hour Technical Paper II mock runs in exam mode. Previously every
paper was short of its target and the mock sampled whatever existed. All three
papers now exceed 75 answerable questions (GE 160, TECH1 294, TECH2 373).

**Concepts with drillable questions went from 76 to 134 of 149** — the
alternation was the right call. A concept with no questions is half a feature,
and finishing all 293 concepts first would have left most of them that way.

**Why the concept-first ordering mattered.** Six of the ten batches were told to
read `concepts.js` and test what the existing concepts teach — same terminology,
same flagged traps. Agents reported doing exactly that, citing concept ids and
reusing their near-miss distractors: two-phase commit against 2PL, transaction
log against audit trail with the names swapped, JSON-in-PostgreSQL not making it
NoSQL, "containers are more secure" as a deliberately wrong option. The result is
a closed loop — read the concept, drill questions that test that concept's own
stated traps.

**Phase 3's corrections propagated all the way through.** Agents were told any
SRAM/DRAM question must have DRAM slower, and prototyping-vs-evolutionary must
follow the corrected reading. So the bank's wrong answers, the blind-solve
corrections, the concepts and now the generated questions all agree.

**Answer-letter spread across all 363: A 26% / B 24% / C 26% / D 22%** — no
letter dominant, so the set cannot be gamed by pattern-matching.

**Judgement the agents showed, worth recording as evidence the brief works:**
- One recast a resistive-vs-capacitive touchscreen question because "responds to
  any object" would have made infrared equally correct.
- The aptitude agent kept Data Interpretation figures inline ("1,250 rising to
  1,500") because the schema is text-only and "refer to the table below" would
  have produced an unusable question — the same failure mode that quarantined 7
  figure-dependent past questions.
- Several declined to name Azure products, Copilot licensing, ITIL version
  numbers, GFR rule numbers or Wi-Fi throughput figures, per the
  no-invented-specifics rule, and said so.

**What's still open:**

- **144 of 293 concepts remain**: TECH1 Units II–V, TECH2 Units III and V, and
  the four MCQ General English units. 15 concepts still have no questions.
- **`generate.py --merge` silently drops unknown fields.** One agent added a
  non-schema `why` key; output was correct, but a genuine typo (`exp` vs
  `explanation`) would vanish just as quietly. Worth warning on unknown keys.
- The 16 Phase 3 disagreements still want a human decision, and the MIC General
  English paper's lost direction lines are still unrecovered.

---

## 2026-08-28 (night) — System Manager Phase 5 begins: the Study tab is no longer empty, and the 25 handwritten General English marks finally have material

**What shipped:** the Phase 5 concept pipeline, and the first and most important
slice of its content — **15 concepts covering Précis Writing (10 marks) and
Letter Writing (15 marks)**.

1. **`concepts.py` + `CONCEPT_BRIEF.md`.** Export/merge either the whole 293-item
   set or a named slice (`--only GE:1,GE:2`). The merge validates word count
   (90–520 across `def`+`exp`, target ~240), rejects HTML leakage — `app.js`
   escapes these strings so a stray tag renders literally — checks facts/traps
   counts, requires every `sub` to match a target verbatim, and verifies that
   every `rel` cross-link resolves to a concept that exists, since an unresolved
   one renders as an empty "Study alongside" chip.

2. **The General English breakdown is derived, and says so.** The official
   syllabus lists GE's six components with their marks and enumerates *no*
   subtopics. Rather than invent leaves and pass them off as official, the
   derived breakdown lives in `concepts.py`, and every GE concept ships with
   `derived: true` plus a provenance string stating that the official syllabus
   enumerates none. Technical concepts still map 1:1 onto the 259 real leaves.

3. **Why these 15 first.** Précis and Letter Writing are handwritten in the real
   exam. They cannot be drilled as MCQs, so there is not one practice question
   for them anywhere in the app and there never can be — these concepts are the
   only place 25 of the exam's 400 marks are taught. Both units end with a full
   worked example (a 210-word passage compressed to 70 with a note on what was
   cut and why; a complete official letter to a Deputy Commissioner with a note
   on why each part sits where it does), because format and compression are learnt
   by seeing one done.

4. **Fixed the `rel` cross-link resolution.** It matched on `sub` alone, so with
   six leaf names reused across units a link to "Encryption" could resolve to
   Cyber Security when the author meant Database Security. Now resolves
   nearest-first: same unit, then same paper, then anywhere. Same bug class as
   the question↔concept link fixed earlier today.

**Why:** with 579 questions all carrying explanations, practice was reasonably
served and the Study tab was the one tab with nothing in it — the app was
practice-only. Within that gap, the handwritten GE marks were the sharpest point:
not under-covered but *entirely* uncovered, and uncoverable by any amount of
further question generation.

Verified in the browser: 15 concepts in the tree, detail pane renders def, three
explanation paragraphs, 5 facts, 4 traps and 3 working cross-link chips; the
worked précis renders as 10 paragraphs and the worked letter as 19 with its
layout intact; no HTML leakage. The pane correctly says "No questions tagged to
this sub-topic yet" for these — which is honest, not a gap: there will never be
MCQs for a handwritten component.

**Follow-up the same night — TECH2 Unit IV concepts done, 48/293 total.** All 33
Unit IV subtopics now have a concept, so the 30-mark block that had nothing this
morning now has 99 questions *and* 12,600 words explaining them. **The
study→practice loop is closed for it**: every one of the 33 concepts resolves to
its 3 authored questions on the full `paper|unit|sub` triple, and the "Practise 3
questions" button drills straight from the concept into them — verified in the
browser end to end.

Run as one agent per batch, each told to write its file before doing anything
else. After three session-limit deaths today that granularity matters: a death
now costs one batch, and `--export` skips concepts already on disk.

The batching was by confusion cluster, not just by count — Encryption / Digital
Certificates / PKI to one author so they stay distinct rather than overlapping,
and the AI ⊃ ML ⊃ Deep Learning nesting to another so it is stated consistently.

**Factual spot-check passed.** The agents reached for Indian-government specifics
and every one I checked is correct: CERT-In under §70B of the IT Act 2000 with
its 2022 six-hour incident reporting and 180-day log directions, NCIIPC for
critical information infrastructure, 1930 as the cyber-fraud helpline, Cyber
Swachhta Kendra as the Botnet Cleaning and Malware Analysis Centre, the CCA
licensing CAs and operating the Root Certifying Authority of India, Class 3 as the
surviving DSC class, Bhashini under MeitY, and the DPDP Act's data fiduciary /
data principal terms. They also hedged where told to — no DSC validity periods, no
retention-period years, no model parameter counts or release dates.

**Second follow-up — TECH1 Unit I done, 93/293 concepts, ~24,800 words.** The
exam's largest unit (60 marks, 45 leaves) is now fully written. Unlike Unit IV
these concepts back onto *real past questions* — all 71 of Unit I's tagged
questions sit under 23 of the 45 concepts, so "Practise 5 questions" on Cache
Memory drills genuine 2016 Computer Operator items.

Five agents, one batch each, all five survived. Batching was again by confusion
cluster: NAS/SAN and backup-vs-DR to one author, the SRAM/DRAM and NVMe
distinctions to another, system-vs-application software and
prototyping-vs-evolutionary to a third.

**Phase 3's findings were fed back into Phase 5, and it paid off.** Two of the
blind solve's disagreements with the bank became explicit traps in the study
material: the SRAM/DRAM concept now carries "options claiming DRAM is faster are
wrong, and this error appears in real papers", and the SDLC concept distinguishes
throwaway from evolutionary prototyping — the two questions where the bank's
stored answer was wrong. Study material and corrected answers now agree instead
of contradicting each other.

**Two agents did better than instructed, worth noting as pattern.** One checked
the already-written TECH2 "AI Ethics and Responsible AI" file before writing its
own Unit I "AI Ethics", and deliberately kept to the Unit I framing rather than
duplicating. Another flagged DBMS classification (system or application software)
as genuinely textbook-dependent rather than asserting one side. Both are the
right instinct for content someone will revise from.

Factual spot-checks passed again: optical media specs (CD 780 nm/700 MB, DVD
650 nm/4.7 GB, Blu-ray 405 nm/25 GB), ISO/IEC 7816 and 14443 for contact and
contactless smart cards, API Setu, MeghRaj, GIGW, C-DAC's BOSS, the Public
Records Act 1993 and RPwD Act 2016, and Indian copyright protecting a computer
programme as a literary work. Agents again hedged where told — no dpi figures, no
licence version numbers, no DPDP sections, no Digital India launch years.

Current totals: 579 questions, 93 concepts, 5.5 facts and 4.0 traps per concept,
every concept carrying at least one cross-link. `tsc` clean, no console errors.

**Third follow-up — TECH2 Units I and II done. 149/293 concepts, ~40,400 words,
185 of the exam's 400 marks now carrying study material.**

| Unit | Marks | Concepts |
|---|---|---|
| TECH1 I — Fundamentals | 60 | 45/45 |
| TECH2 I — Computer Networking | 35 | 32/32 |
| TECH2 II — Database Management | 35 | 24/24 |
| TECH2 IV — Cyber Security / AI | 30 | 33/33 |
| GE 1–2 — Précis + Letter Writing | 25 | 15/15 |

**The write-first instruction is now proven, and should be standard here.** A
session limit hit mid-round and the harness reported four agents as failed — but
three of them had already written their JSON and only one batch was actually
lost. Contrast the first tagging round this morning, where two agents died
holding everything in memory and lost all of it. Tell every long-running agent to
write its output before verifying, and make the batch the unit of loss.

**Handling the duplicate leaf names from the authoring side, not just the lookup
side.** Earlier today the *lookup* was fixed so a question doesn't surface under
the wrong unit's concept. This round the *prompts* were fixed too: the Unit I
agent was told to write `Firewalls` as a network device and explicitly not the
security control, the Unit II agent to write `Tables` as a database relation and
not the HTML tag, and `Encryption` as at-rest/in-transit/TDE/key-management
rather than general cryptography. Verified in the shipped data — the two
`Encryption` concepts read differently and drill different question pools (Unit
II has 0 tagged, Unit IV has 3), which is exactly what the unit-aware fix was for.

**Past-paper questions were fed into the concept prompts again**, so the study
material answers what the papers actually ask: which OSI layer does source-to-
destination error checking (transport), which device broadcasts (hub), which
topology gives maximum connectivity (mesh), what the external level maps to
(view level), and that BCNF is stricter than 3NF.

Spot-checks passed: SQL Server 1433 and PostgreSQL 5432, the DORA sequence,
share-vs-NTFS permissions resolving to the most restrictive, the NIST five
essential cloud characteristics. Agents again declined to invent — no Azure
product names, no Windows Server edition matrices, no per-standard Wi-Fi
throughput figures, no licence version numbers.

**What's still open:**

- **144 of 293 concepts remain**: TECH1 Units II–V (Operating Systems 25, Word
  20, Excel 25, PowerPoint 20), TECH2 Units III and V (Web 25, IT Governance 25),
  and the four MCQ General English units.
- **Only 76 of 149 concepts have questions tagged to them.** The rest wait on
  Phase 4's remaining 264 authored questions. Worth alternating now rather than
  finishing all concepts first — a concept with no drill is half a feature.
- **Phase 4 has five of six units left** — 264 questions, worst ratio being
  TECH2 Unit I (35 marks, 16 questions, 25 of 32 leaves bare).
- **Session limits interrupted this three times today.** Both concept agents died
  before writing anything, so these 15 were authored inline instead. For a small
  high-value slice that was the right call; for the remaining 278 it will not
  scale, so those want the incremental-write agent pattern that worked for
  tagging and solving, run in mark-weighted slices.

---

## 2026-08-28 (evening) — System Manager Phase 4 closes the 30-mark hole; two more bank data-loss classes found (phantom options, lost underlines); 579 questions live

**What shipped:**

1. **Phase 4 — TECH2 Unit IV authored from zero to 99 questions.** 30 of the
   exam's 400 marks had no past-paper coverage at all: MUDAL added Cyber
   Security / AI / Digital Governance in the July 2026 syllabus update and the
   2016 Computer Operator papers predate all of it. `generate.py --export` sizes
   each unit's allocation from unit marks *and* existing coverage (a 30-mark unit
   with nothing gets more per leaf than a 20-mark unit already half covered), and
   `--merge` validates every `sub` against the taxonomy, rejects duplicate
   options / "all of the above" / short explanations, and warns on answer-letter
   skew. Result: **all 33 leaves covered, answer spread A 25% / B 25% / C 26% /
   D 23%.** `GENERATE_BRIEF.md` puts the difficulty calibration first, because
   pitching at CS-degree level is the obvious failure mode here — the bar for
   this post is any graduate plus a one-year computer diploma.

2. **Found a fabricated-content bug I had introduced.** The sentence-analysis
   blocks in both General English papers print only three options, and the bank
   pads `options` to length 4 with a literal `null`. `harvest.py` ran that
   through `str()`, producing **13 questions with a phantom option D reading
   "None"** — which looks exactly like "None of these" and is pickable. Both my
   validators missed it: four keys were present and `"None"` is truthy. Now
   filtered at source with the `answerIndex` remapped onto the surviving options,
   and `assemble.py` rejects placeholder option text and any `ans` pointing
   outside the options that exist. `app.js` already handled 3-option questions.
   Verified: 13 questions render with exactly three options, zero bare "None",
   and no solver had picked the phantom D.

3. **Fourth bank data-loss class: underline markers.** `SOLVE_BRIEF.md` says
   underlined words arrive as `__like this__`. The bank carries them for 18 of
   the SAD General English questions but **lost them for Q39–44 and Q54–58 — the
   two blocks where the underline IS the question.** "Identify the parts of
   speech for the underlined word in: This phone is much better than that" is
   unanswerable as stored; much/better/than/that are four different parts of
   speech and the options offer four different answers. Recovered by reading a
   300dpi render of pages 5–6 (pdftotext cannot see underlining) into
   `patch_underlines.py`. `assemble.py` now **fails the build** if any question
   mentions an underlined word with no marker surviving — that check is what
   found the second block after the first was fixed.

   **One of them is provably defective:** Q41 underlines "effect", a noun, but
   the printed options are Preposition / Verb / Adverb / Adjective. No correct
   answer exists. The bank said Verb, the blind solve said Preposition — both
   wrong. It now ships low-confidence with the defect stated.

4. **`qText()` renders `__markers__` as real underlines** — and the first cut of
   it was wrong in a way only the browser showed. `/__(.+?)__/` matched five
   underscores inside a fill-in-the-blank run (`preparation __________ the
   function`), rendering 54 stray underlined `_` characters. The capture has to
   exclude underscores. Verified: 11 correct underlines, 18 blanks intact, zero
   strays.

**Why:** Phase 4 exists because roughly half of Technical Paper II's syllabus
postdates the only past papers that match it. Unit IV was the extreme case —
30 marks, nothing. The two bugs above were both found *while* doing Phase 4
rather than by looking for them, which is the pattern for this bank: every time
a new consumer touches the data, another thing the extractor dropped surfaces.
Four classes so far — questions, passages, underline markers, and option lists
padded with nulls. Assume there are more.

**Current state:** 579 questions, all 579 with explanations, 485 high confidence /
58 medium / 9 low / 27 unrated (the authored jso-prep ones). 419 tagged to a leaf.
7 quarantined, all figure-dependent. `tsc` clean, no console errors, all 8 tabs
render.

**What's still open:**

- **Phase 4 is one unit of six.** Still uncovered: TECH2 Unit I (35 marks, only
  16 questions, 25 of 32 leaves bare) is the worst remaining ratio, then TECH1
  Unit II (21 of 29 leaves), TECH1 Unit I (22 of 45), TECH2 Unit V (16 of 21).
  `generate.py --export` with no `--unit` plans all of them.
- **The MIC General English paper lost its direction lines.** The bank schema has
  no `direction` field at all, so the shared instruction above each block is gone.
  The SAD paper survived only because its extractor folded the direction into each
  question stem. This left the MIC sentence-analysis block (Q49–56) ambiguous and
  the solver had to infer the task — it flagged this itself, and its answers there
  disagree with the bank in three places. Worth recovering the way the underlines
  were.
- **One solver self-reported a compromised blind diff:** while hunting for the
  missing underline markers it opened `staged/harvest.json` and saw the withheld
  bank answers for CO2016A-GE-39–48. It stopped, re-reasoned independently, and
  in fact disagrees with the bank on GE-41 — but the agreement figure for those
  10 questions is not fully independent evidence and shouldn't be counted as such.
  GE-39–44 have since been overridden by the underline recovery anyway.
- **Concepts are still empty** (Phase 5) — the Study tab is the one tab with
  nothing in it, and the only place the 25 handwritten GE marks can be taught.

---

## 2026-08-28 (later still) — System Manager: all 487 questions tagged; Phase 3 verification finds the bank's answers are ~6% wrong; a leaf-name collision was cross-linking DBMS questions to HTML concepts

**What shipped:**

1. **Every question tagged — 487/487.** `tagging.py --export/--merge` splits into
   40-question batches carrying only that paper's allowed leaves, and the merge
   rejects any tag that isn't an exact `(paper, unit, sub)` leaf. Spread:
   TECH1 Unit I 70 / II 32 / III 22 / IV 24 / V 14; TECH2 Unit I 16 / II 63 /
   III 50 / V 27; GE unit 5 (vocabulary) 63 / 6 (sentence formation) 33 /
   3 (comprehension) 32 / 4 (parts of speech) 32. TECH1's distribution tracks the
   real mark weighting well — Unit I is 60 of 150 marks (40%) and drew 43% of the
   questions.

2. **TECH2 Unit IV has zero questions, confirmed from data.** Cyber Security /
   AI / Digital Governance is 30 marks and the 2016 papers contain nothing for
   it. The guide predicted this from reading the syllabus; it is now measured.
   `tagging.py --merge` writes `staged/coverage-gaps-*.json` — 70 of 120 TECH1
   leaves and 90 of 133 TECH2 leaves have no question at all. That is Phase 4's
   target list, derived rather than guessed.

3. **Fixed a live cross-linking bug: six leaf names are reused across units.**
   `conceptKey` is `paper|unit|sub`, but the reverse lookup at app.js:455 matched
   `paper` + `sub` only. In the shipped data `TECH2`/`Tables` is 2 MS-Access
   questions (Unit II, Database Administration) **and** 3 HTML `<table>`
   questions (Unit III, HTML5) — all five surfaced under both concepts, so
   someone studying HTML tables got served MS Access questions. Also affects
   `Encryption` (Database Security / Cyber Security), `Firewalls` (Network
   Devices / Cyber Security), and TECH1's `SmartArt`, `Accessibility Features`,
   `Microsoft 365 Collaboration`. Now matches the full triple. **The System
   Analyst app has the identical line and the same latent bug.**

4. **Phase 3 solve pass: blind, then diffed.** `solve.py` exports questions
   *without* the bank's existing answer. Rubber-stamping is the failure mode that
   matters — a solver shown "the answer is (b)" will tend to justify (b). Solving
   independently and diffing gives real evidence: agreement means two independent
   derivations concur; disagreement means one is definitely wrong, so the merge
   **caps confidence at medium** regardless of what the solver claimed and writes
   a prov string admitting the conflict. Comprehension questions carry their
   recovered passage, without which a solver would be guessing.

   Both Technical Paper I sittings done — 150 answers, 94% agreement with the
   bank, **9 disagreements**.

**Why this mattered — the bank's inferred answers are roughly 6% wrong,** and every
one of those would have taught a false fact before a real exam. Four I verified
independently and the solver is right in all four:

| Question | Bank | Verified | Fact |
|---|---|---|---|
| Max columns in a Word table | 65 | **63** | Word's limit is 63 |
| 8 KB memory, associative cache word size | 20 bits | **21 bits** | 13 tag + 8 data |
| Chapters in the IT Act 2000 | 11 | **13** | 13 chapters, 94 sections, 4 schedules |
| Why DRAM is used as main memory | "higher speed" | "less power" | DRAM is *slower* than SRAM |

The IT Amendment Bill one is the nicest catch: the bank said October 2008, but the
bill *passed* in December 2008 and came into *force* in October 2009 — the bank had
conflated the two. That is exactly the class of error a confirm-the-existing-answer
pass would have rubber-stamped.

**What's still open:**

- **120 General English answers still verifying** (2 agents running). 27 jso-prep
  questions stay `unrated` by design — they were authored with explanations, not
  derived from a paper.
- **The 9 disagreements need a human decision.** They ship with the verified
  answer, capped confidence, and a visible "conflicts with bank answer" note, so
  they are safe as-is — but `staged/disagreements.json` is the list to review.
  Two are genuinely arguable rather than clear bank errors (P1-37 "not a system
  tool", where Backup did move out of System Tools in Windows 7; and P1-57 Fill
  Series).
- **Concepts are still empty** (Phase 5). The Study tab remains the one tab with
  nothing in it, and it is where the 25 handwritten General English marks have to
  be taught.
- Session limits interrupted the first tagging attempt and cost all its work;
  every agent now writes each batch before starting the next. That pattern should
  be the default for anything long-running here.

---

## 2026-08-28 (later) — System Manager Phase 2: the OCR sidecars turned out to be unusable, so Paper II is recovered by vision instead; 407 questions shipping; prov/conf badge built

**What shipped:** the Phase 2 harvest pipeline under `tools/system-manager-build/`,
and `data/questions.js` now holds **407 questions** (rising to ~480 once the
second Paper II sitting lands).

1. **`harvest.py`** — Tier 1 from `mpsc_bank_v2.json` (Computer Operator
   Technical Paper I ×2 = 150, General English ×2 = 160) plus Tier 4 from
   `mpsc-jso-prep`. Handles two schema traps that would have shipped broken
   data: this app's `opts` is an **object keyed A–D** with a **letter** `ans`
   (every other bank in the repo uses an array + 0-based index), and jso-prep
   explanations are **HTML** while `app.js` renders `exp` through `esc()`, so
   tags would have displayed literally to the reader.
2. **Paper II recovered by a vision pass, not from the OCR sidecars.** This is
   the significant change from the plan. Measured, each paper holds exactly 75
   questions and text extraction cannot find them all: the existing `.ocr.txt`
   sidecars yield 61/75 and 63/75, and re-OCR is *worse* — `tesseract --psm 3`
   58, `--psm 6` 42, `--psm 4` 53, `--psm 11/12` 32/33. The missing questions
   **are in the scan**; only their numbers are mangled (`» §.` for 5, `22°` for
   22), so a numbering-gap check catches the loss but cannot repair it. These are
   1-bit CCITTFax scans throwing `Bad RTC code` errors with two-column options,
   which is what defeats tesseract. `render_pages.py` renders them at 400dpi
   instead, and the pages are cleanly legible — so extraction and answer
   derivation happen in one vision pass, absorbing Phase 3 for these two papers.
3. **`validate_extract.py`, written before the extraction ran** so the checks
   couldn't be shaped to fit the output: 75 per paper, contiguous 1–75, four
   distinct non-empty options, valid `ans`/`conf`, explanation present and not
   opening with "the correct answer", and an explanation that names only a
   different option than `ans` is flagged as a possible contradiction.
4. **Both sittings extracted: 150/150 questions, 143 shippable.** CO2016A-P2
   high 58 / medium 12 / low 2; CO2016B-P2 high 63 / medium 6 / low 2. Verified
   against the source images rather than trusting the agents' reports — page 1 of
   each paper checked question by question, all correct including the
   **two-column option mapping** (the one error that would have silently
   corrupted every answer) and the mid-paper switches to single-column layout.
   Defect claims verified real, not invented to dodge hard questions: CO2016A-P2
   Q27 genuinely prints options (a) and (c) as word-for-word identical; its Q74
   clock angle at 12:25 is genuinely 137.5° with no matching printed option; and
   CO2016B-P2 Q34's stem really is just "HTML is a" with no correct option among
   the four (HTML is a markup language). 7 figure-dependent reasoning questions
   quarantined across the two papers.

   **The validator earned its keep and then cost some.** It caught CO2016B-P2
   Q34 as "question text missing or too short" — but that was a false positive
   from a `len < 10` threshold against a legitimate 9-character stem. Confirmed
   against the page image, then split the check: under 5 chars is a hard failure,
   5–15 is a warning for a human to eyeball, because genuine brevity and OCR
   truncation are indistinguishable from inside the script. Same lesson as the
   HTML check in `assemble.py`, which flagged eight Web Technologies
   explanations for containing "HTML" — they legitimately *discuss* `<H1>`,
   `<OL>` etc. in prose, and since `app.js` escapes `exp` those render correctly
   as visible text. Narrowed to closing tags only (`</p>`), which is the thing
   prose never writes and real leftover markup always does.
5. **`prov`/`conf` badge built** — `CLAUDE.md` lists this as a known gap. One
   shared `provLine()` helper used at all three explanation render sites:
   `official key` (blue), `derived · high/medium/low` (green/amber/red), and
   `derived · unrated` (amber) when `conf` is absent, so an unrated answer can
   never read as authoritative by omission. Verified in the browser against real
   data — the rendered counts match the validator exactly.
6. **`export_taxonomy.py`** — the 259 leaves as tagging input, and
   **`assemble.py`** — merges every source into `questions.js` with a quarantine
   policy: figure-dependent and answerless questions are excluded from the app
   but written to `staged/quarantine.json` rather than dropped. Low-confidence
   answers *do* ship, behind their badge, which is the honest presentation.

**Why:** `BUILD_GUIDE.md` was a plan that had never been run, so its claims about
the sources had never been tested. Four more of them were wrong, all now marked
⚠️CORRECTED in the guide:

- **The two 2016 sittings do not "overlap substantially"** — exact-text dedup
  finds 0 duplicates, fuzzy matching at 0.85 finds 1 near-pair in 5,625 for
  Paper I and 0 for GE. They are essentially disjoint, so Paper I yields 150
  distinct questions, not ~100 post-dedup.
- **Only 2 of the 5 jso-prep files are on-syllabus** (27 questions, not 67) —
  there is no forensics anywhere in the System Manager syllabus.
- **Tier 2 was scoped ~30× too narrow** — 6,321 GE questions in the bank across
  ~125 papers, not the 199 in three named JE papers.
- **The guide's own `questions.js` example tags `sub` to a *section* name**
  ("Introduction to Computing"). `app.js` matches `sub` by string equality
  (app.js:410), so a question tagged that way links to no concept at all. Tags
  must be leaves.

**Also corrected: the paper structure is 75 × 2 marks, not the 150 × 1 I assumed
in Phase 1.** All six 2016 Computer Operator papers state "Time Allowed: 2 hours
/ Full Marks: 150 / equal marks of 2 each" ⇒ 75 questions, and GE states 3 hours
/ 100 marks / 1 mark each. The bank's Paper I records independently confirm it
(75 questions, contiguous 1–75). `gen_syllabus.py` now asserts
`questions × marks_per_question == mcq_marks` per paper.

7. **Found and fixed a third silent-data-loss case in the bank: every
   comprehension passage is missing.** 32 of the 160 General English questions
   are passage-attached comprehension items, and `mpsc_bank_v2.json` holds no
   passage for any of them. As extracted they were unanswerable — "Find the word
   *in the passage* which means 'intruding beyond acceptable limits'", and five
   consecutive "Which of the following statements is correct?" items with no
   statements to check. This sits alongside the two incidents in DEVLOG
   2026-08-04; the pattern is now established enough to assume it. Surfaced only
   because the GE tagging pass put 32 questions under "Comprehension" and the
   earlier bank audit had shown zero passages — the two facts together didn't add
   up.

   Per `CLAUDE.md`, went to the source PDFs rather than patching the UI. The
   passages are all there and these are text-layer PDFs, so `pdftotext` recovers
   them cleanly. `extract_passages.py` pulls all four (the SAD paper prints
   **one** passage for 16 questions; the MIC paper prints **three**, for 5/6/5 —
   so "one passage per paper" would have been the wrong assumption).
   `assemble.py` attaches them and now **fails the build** if any question
   references a passage without one attached, so it can't regress silently.
   `app.js` renders them via `passageBlock()` — collapsible, open by default,
   height-capped with its own scroll. Verified in the browser: 16 blocks on the
   SAD paper, and the MIC paper's three distinct passages land on exactly the
   right question ranges.

**What's still open:**
- **Nothing is tagged yet** (0/407 have a `unit`/`sub`). Until the tagging pass
  runs, Practice can't filter by unit and no question links to a concept. This is
  the next step and needs a model.
- **308 of 407 have no explanation** — the bank's Tier 1 records ship with empty
  `exp` and `conf: null`, showing `derived · unrated`. Phase 3 has to verify
  those 300 answers and write explanations; that is now the bulk of the
  remaining question work.
- **2 questions have no answer at all** in the bank (`CO2016B-P1-1`, `-51`),
  quarantined.
- The `anthropic` SDK is **not installed**. Phases 4–5 (~250k output tokens) need
  it for Batch + prompt caching; the extraction and tagging passes don't, since
  they follow the repo's existing agent-plus-brief convention
  (`SOLVE_BRIEF.md`, now joined by `EXTRACT_BRIEF.md`).
- Sonnet 5's introductory pricing ends **2026-08-31**.

---

## 2026-08-28 — MUDAL System Manager: Phase 1 foundation. Shell cloned, syllabus generated from the PDF, module registered — and the "reuse app.js as-is" assumption turned out to be false in 7 places

**What shipped:** Phase 1 of `tools/system-manager-build/BUILD_GUIDE.md` — a
new static app at `/mpsc-system-manager/index.html` for the MUDAL System
Manager post (400 marks: General English 100, Technical Paper I 150,
Technical Paper II 150; all three count for merit).

1. **`tools/system-manager-build/gen_syllabus.py`** — generates
   `data/syllabus.js` with the technical syllabus transcribed verbatim from
   the official PDF (approved by the MUDAL Board 28.07.2026). Written as a
   self-verifying generator rather than a hand-authored JSON blob: it asserts
   every per-section leaf count, both 150-mark unit totals, GE's 100, and the
   grand total before it writes. Re-running it *is* the check.
2. **The syllabus has 259 technical subtopics, not the 261 the build guide
   claimed.** Word Processing has 17 leaves (guide said 18), Electronic
   Spreadsheet 18 (said 19). Everything else matched. Found by counting off
   the PDF instead of trusting the guide's own skeleton table — the same
   instinct `CLAUDE.md` asks for with question content.
3. **Each unit carries both `sections[]` and a flat `subtopics[]`.** The PDF
   groups leaves under numbered sections; `app.js` ignores `unit.subtopics`
   entirely, but Phases 2/5 need a taxonomy to classify against. Sections give
   the tagging prompt context, the flat list is the 259-item target. All 259
   `paper|unit|sub` keys verified unique — that tuple is `app.js`'s concept key.
4. **Seven hardcoded System Analyst assumptions fixed in the cloned `app.js`.**
   The guide said "reuse as-is, no changes expected". Two were real bugs, not
   cosmetics:
   - `KEY = 'mpsc_sa_v1'` — both apps are served from the **same origin**, so
     System Manager would have read and written System Analyst's localStorage
     progress store. Silent cross-app data corruption. Now `mpsc_sm_v1`.
   - The quick mock filtered on `counts_for_merit` as a stand-in for
     "technical". For System Analyst that worked because GE/GS were
     qualifying-only; for System Manager **every** paper counts for merit, so
     General English leaked into the technical quick mock. Now filters
     `TECH1`/`TECH2` explicitly.
   - Plus: an invented exam date (`EXAM_HINT = '2026-11-01'` — no date has been
     announced; now reads `SYL.exam_date`/`application_deadline` and renders
     "exam date not announced"), a dashboard line claiming 600 merit marks and
     a 50% qualifying cutoff that don't exist for this post (now renders
     `SYL.scoring_note`), `of 727` subtopics hardcoded (now derived from `SYL`),
     the `shortPaper` map including a `TECH3` this post doesn't have, and empty
     states pointing at a `build/build.py` that doesn't exist.
5. **Registered in `src/modules/registry.ts`** after `system-analyst`.
   `concepts.js`/`questions.js` stubbed as empty arrays, each carrying its
   schema and the phase that fills it as a header comment.

**Why:** The build guide was written as a plan and never executed, so its
numbers had never been checked against source. Doing Phase 1 was the cheapest
way to find out which of its claims held — and three didn't. Recording the
corrections inline in the guide (marked ⚠️CORRECTED) matters more than the
code here, because Phases 2–5 are the expensive model-driven ones and they
were about to be run against a taxonomy that was wrong by two entries and an
`app.js` that would have silently merged two apps' progress.

Worth naming: **both real bugs were caught by loading the page, not by reading
the code.** `npx tsc --noEmit` is clean either way — these are static assets,
TypeScript never sees them. Exactly what `CLAUDE.md` means by "typecheck
passing is necessary but not sufficient."

**Also corrected in the guide:** its Tier 2 question inventory named 3 Junior
Engineer General English papers (199 questions). The bank actually holds
**6,321 GE questions across ~125 papers** — MPSC largely reuses a common GE
paper across posts, and System Manager's GE components are exactly what those
test. So General English is selection-constrained, not supply-constrained;
Phase 2 should target ~600–800 well-matched questions weighted to the four MCQ
components, dedup on normalised question text, and prefer the ~80-question
Paper-I sittings over the harder 100-question Paper-IIs.

**What's still open:**

- 🔴 **The application deadline is 29 Aug 2026, 4:00 PM — tomorrow.** Confirm
  the application actually went in before spending anything on Phases 2–5.
  All of it is worthless if it didn't.
- ⏳ Sonnet 5's introductory pricing ends 2026-08-31; Phases 2 and 4 are the
  Sonnet-heavy ones.
- **Verification gap:** all 8 tabs were confirmed rendering with zero console
  errors via page-text and DOM inspection, through both the direct route and
  the SPA's `/embed/system-manager` iframe. Screenshots were **not** captured —
  the Browser pane's screenshot action timed out three times. No visual
  confirmation of layout/theming was obtained.
- Two paper-structure figures are **assumptions, not source**: MUDAL publishes
  marks and "All MCQ" only, no question count and no duration. `questions: 150`
  / `marks_per_question: 1` / `duration_hours: 2` exist so the mock has a
  target length; every paper carries a `pattern_note` saying so and the
  mock-test tab states it on screen.
- **GE units carry `subtopics: []` deliberately** — the official syllabus
  enumerates none. Phase 5 must author a derived breakdown and label it
  derived rather than backfilling it into `syllabus.js` as official.
- `app.js` is now a **fork**, not a shared module. Shared-logic fixes need
  patching in both copies. Extracting the common core is unjudged work — worth
  it only if a third exam app appears.
- The `prov`/`conf` UI badge is still not built (both this app and System
  Analyst). Deferred to the start of Phase 3, when derived answers exist to
  render it against.

---

## 2026-08-22 (yet later) — PYQ Practice gets a real Browse mode; bank picker is a pill row now; descriptive questions' top-level explanation finally renders

**What shipped:** Prompted by the user noticing two real gaps after the
Statistical Handbook bank shipped — "no descriptive or essay type made?"
and "no browse questions" — plus a UX complaint about the bank `<select>`
("bad for navigation"):

1. **Bank picker is now a horizontal pill row, not a `<select>`.**
   Switching banks is the primary navigation act on this page; a native
   dropdown hides every option behind a click with no visual scan.
2. **A genuine Browse mode**, alongside the existing Practice (one-at-a-
   time, click-to-reveal, scored) mode. Browse shows the full filtered
   list at once, answers already visible, no scoring — this is what
   `CLAUDE.md`'s "browse, not just quiz" standing requirement actually
   needs, which Practice's untimed-but-still-click-to-reveal loop never
   satisfied. New `McqBrowseCard` (local to `PyqPage.tsx`) renders MCQs
   read-only; descriptive questions render via the ALREADY bank-agnostic
   `DescriptiveQuestionCard` — it just had no page rendering it outside
   `StateTaxOfficerEnhanced`. Subject/topic dropdowns now source from the
   full pool (both types) in Browse mode and the MCQ-only pool in
   Practice mode, so Browse can reach descriptive-only topics that
   Practice deliberately can't score.
3. **Found and fixed a real pre-existing bug while verifying #2's
   Mizoram essay questions**: `DescriptiveQuestionCard.tsx` never
   rendered a descriptive question's top-level `explanation`/`guidance`/
   `wordLimit` — only per-*subpart* versions of those fields. Every one
   of the Mizoram bank's 6 non-subpart essay questions was showing a
   bare stem with its entire "MODEL FRAMEWORK" answer invisible. This
   wasn't new-content-specific: it affected `mpsc-state-tax-officer.ts`'s
   4 pre-existing descriptive questions too (verified in the browser —
   the 2016 essay prompt's "This is an essay question: the candidate
   picks one topic..." framing note, and the précis/letter/idiom
   question's "This single item bundles three separate descriptive
   tasks..." note, were BOTH silently missing before this fix, on a page
   that's been live a while). Fixed by rendering `explanation` always
   (it's a required field on every `BankQuestion`, MCQ or descriptive —
   treated as core content, not a spoiler) plus `guidance`/`wordLimit`
   when present, in the same box, above any subparts.

**Why:** The Mizoram bank's 7 descriptive/essay questions were fully
authored data with nowhere reachable to render (see the 2026-08-22
"later" entry above) — Practice mode structurally excludes them (no
single answerIndex to score), and no generic page had ever wired in
`DescriptiveQuestionCard`. Building Browse mode was the fix for "no
module for it" that didn't require inventing a whole new page: the hard
part (the card, the review panel, the correction overlay) already
existed and was already bank-agnostic, just never actually used outside
one bank-specific page.

**A wasted-motion note for future browser verification in this repo:**
several `computer` clicks in this session landed on the wrong element
because (a) the screenshot tool downsamples to a max width, so a
literal `(x, y)` computed from a wider viewport's DOM coordinates lands
somewhere else in screenshot-space, and (b) firing two `computer` actions
in one message reuses stale coordinates once the first click has already
changed the layout. Fix: set the viewport width to match the intended
screenshot width (e.g. 800x700) before computing click coordinates from a
screenshot, and click-then-verify one action at a time rather than
batching sequential UI interactions.

**Verified:** typecheck clean. In the browser: pill row switches banks
correctly across all 4; Practice mode unchanged (Polity Codex, MPSC State
Tax Officer both drill normally); Browse mode on the Mizoram bank shows
all 176 questions read-only, filtering to "Descriptive & Essay" surfaces
exactly the 7 essay questions via `DescriptiveQuestionCard` with per-
subpart flag buttons and "Study pointer" reveals on the short-notes
question; the top-level-explanation fix confirmed live on both the new
Mizoram essays (guidance + word limit + full framework now visible) and
the pre-existing State Tax Officer descriptive tab (no regression, no
duplicated content). No console errors anywhere in this pass.

**What's still open:**
- Browse mode has no pagination/virtualization — fine at 176-3479
  questions today (State Tax Officer's own By-Exam/By-Year/By-Paper tabs
  already render similarly large lists), but worth watching if a much
  larger bank ever gets added.
- Session progress/mastery tracking is Practice-only, by design — Browse
  has no "I got this right" signal to record. If that's ever wanted,
  it needs its own affordance (e.g. a manual "mark as reviewed"), not a
  silent repurposing of the existing scoring path.
- Not asked to commit/push this round — everything above is local only.

---

## 2026-08-22 (later still) — New bank: Assistant Controller of Mines 2026 (166 questions)

**What shipped:** A fourth bank, `assistant-controller-of-mines-2026`, built
from `~/Downloads/ASSISTANT CONTROLLER OF MINES - 2026.html` — 166 MCQs
(66 General English Part-B + 100 General Studies) for a mock MPSC
Assistant Controller of Mines paper. Generator in
`tools/assistant-controller-of-mines/` (`parse.py` + `build_bank.py`, own
README). Unlike the Statistical Handbook bank, this source is clean,
well-structured HTML with explicit ✔-marked answers, so extraction is a
BeautifulSoup parse rather than manual page-image transcription — much
faster, and the parser's own sanity checks (question numbers 1..N with no
gaps, exactly 4 options, exactly one marked correct) caught nothing wrong.

**Provenance, worth being honest about:** this is not a real government-
published key. Three questions carry a leaked LLM reasoning trace directly
in the markup — GS Q33: *"Official key marks (B) for Q33. Let's fix this to
match the key exactly."* That's a model describing and correcting a key it
was told about, not transcribing one. So the whole file was LLM-authored
mock content, not sourced from an MPSC PDF. `answerSource` is `'derived'`
throughout for exactly that reason. `parse.py` takes the corrected
(second) answer block wherever the source self-corrects (3 questions), and
GS Q67 keeps a `disputeNote` because even its own correction admits doubt:
*"The Bairabi-Sairang has 32 tunnels, but options are 44-47."* Verified
this renders as the red "Disputed:" banner in the browser.

**Topics assigned by number range**, not per-question — the source has no
topic labels, but content clusters tightly by number (verified by reading
every question start to finish, not guessed). 19 topics: 9 English
sub-skills (parts-of-speech, error-spotting, word-transformation,
vocabulary, idioms, one-word-sub, antonyms, sentence-transformation,
correct-usage) and 10 GS buckets, including two the post itself makes
distinctive — **Mining & Minerals** and **Mizoram History & Culture /
Mizoram Current Affairs**. `difficulty` is a flat `'medium'` default (no
signal in the source; see tools README before mistaking it for a judged
rating).

**Two generic fixes this bank needed, both bank-agnostic, both landing in
shared code:**
1. **`renderEmphasis()` wired into `PyqPage.tsx`'s question stem.** 24
   words in the English section are `<u>`-marked in the source; for the
   word-transformation and advanced-classification questions (English
   26-35) the underline is the *only* signal of which word is being asked
   about, not decorative — stripping it would make the question
   unanswerable. The `__word__` → `<u>` convention already existed
   (`src/lib/renderEmphasis.tsx`, already used by `mpsc-state-tax-officer.ts`
   and rendered by `StateTaxOfficerEnhanced`/`QuestionCard`) but `PyqPage`
   never called it — every underline would have shown as literal
   double-underscores. Verified in the browser: "fast" renders correctly
   underlined on English Q2.
2. **Caught and reverted a repeat of this session's earlier tagging bug.**
   First draft tagged mining/Mizoram-culture/Mizoram-current-affairs
   questions `['mines', 'mizoram']` for map cross-linking — same mistake
   as the Statistical Handbook bank's first draft, except this time the
   blanket tag was *also substantively wrong*, not just imprecise: it
   linked GS Q68 (Singhbhum Shear Zone, which is in **Jharkhand**) to
   "Judiciary, Writs & PIL" purely because `'mizoram'` happens to be a tag
   on that chapter. Caught it live in the browser while spot-checking, not
   by inspection — a reminder that this specific mistake needs an actual
   click-through, not just a code read, to catch. Fixed by shipping the
   whole bank with `tags: []`: there's no verified per-question
   correspondence to real map chapters here (unlike the Statistical
   Handbook bank, where every tag was checked against an actual
   river/mountain/district), so wrong links are the worse failure mode
   than no links.

**Verified:** typecheck clean. In the browser: bank appears in the `/pyq`
selector as "Assistant Controller of Mines 2026 (166)", all 19 topics
populate with non-empty pools, underline renders correctly, the disputed
tunnel-count question shows its banner, the Mining & Minerals topic (post-
fix) shows zero "On the map" links on every question checked, no console
errors, scoring/session-tracking works across a bank switch.

**What's still open:**
- Topic-range boundaries were read once, carefully, but not independently
  re-verified — if that ever matters, re-read the source HTML rather than
  trusting the range table blindly.
- No admin-side review of this content yet (same `getCorrections`/
  `QuestionReviewPanel`/Questions-tab plumbing as every other bank applies
  automatically, untested against this bank specifically).
- If the user has more sittings/papers in a similar HTML format, the
  parser in `tools/assistant-controller-of-mines/parse.py` should mostly
  reuse — the range-based topic tables would need re-deriving per paper.

---

## 2026-08-22 (later) — PYQ Practice gets flag/correct/comment; a new admin Questions tab; `sourceNote` for source-vs-itself contradictions

**What shipped:** Three connected pieces, prompted by wanting admin-side
editing + edit history for the Statistical Handbook bank's known
contradictions, but built bank-agnostically since none of this existed
for `/pyq` at all before today:

1. **`PyqPage.tsx` now has the full review loop.** It previously read
   `bank.questions` straight off the static bundle with no flag/note/
   comment UI and no correction overlay — any bank rendered there
   (Polity Codex, MPSC State Tax Officer, and now the Statistical
   Handbook) was effectively uneditable from a learner's seat, because
   there was no way to file the report that would let an admin act.
   `PyqPage` now fetches `getCorrections(bankId)` on bank change, overlays
   `answerIndex`/`options`/`explanation`/`stem` at render time (same
   never-rewrite-the-original pattern as `StateTaxOfficerEnhanced.tsx`),
   shows a "✓ corrected by admin" pill plus the admin's public note, and
   renders `<QuestionReviewPanel>` so anyone logged in can flag/note/
   comment on any question in any bank shown there.
2. **New admin tab: Questions** (`src/modules/admin/tabs/QuestionsTab.tsx`,
   registered in `AdminConsolePage.tsx`). `ReportsTab` only surfaces
   questions someone has already flagged — `QuestionEditor.tsx`'s own
   header comment anticipated this gap ("a bank-agnostic Reports tab —
   and, later, a Questions browse tab — can both open it") but nothing
   had built the second half. This tab lists every question in a
   bank, lets an admin open the same `QuestionEditor` on any of them with
   no pre-existing report (`reportIds` was already optional server-side,
   so this needed zero backend change), and shows a per-question edit
   history panel (`adminListAuditLog({bankId, questionId})`) with actor,
   timestamp, and before/after — the "who edited it, when" that was
   previously only visible by scrolling the *global* Audit Log tab. A
   checkbox filters to "Only ⚠ contradictions."
3. **New schema field `sourceNote?: string`** (`src/data/banks/types.ts`),
   distinct from the existing `disputeNote`. `disputeNote` means "we think
   the published exam key is wrong but keep it, that's what MPSC printed";
   `sourceNote` means "the reference book contradicts itself across two of
   its own tables" — a different kind of problem a self-authored bank like
   the Statistical Handbook can actually have (there's no exam key to
   dispute). Populated on 6 of its 176 questions: the two Census 2011
   population/literacy figures that differ between the state chapters and
   Table 47.1/47.3, the ISFR-2021-vs-2023 forest-cover dual figure, the
   Table 2.1-vs-2.2 rainfall normal, the 2018-labelled-but-actually-2023
   election table, and Table 13.6's Dampa-filed-under-"National Park"
   defect. Renders as a distinct amber "⚠ Source note" callout on
   `PyqPage` (separate from the red `disputeNote` banner) and surfaces in
   the new Questions tab as a pill + a full-text callout when selected.
   `tools/statistical-handbook/qlib.py`'s `q()` helper takes an optional
   `source_note=` kwarg — see its docstring before adding more.

**Why:** Requested directly — admin-side editing of answers/corrections
with edit history showing who edited what, and a way to mark where the
source material contradicts itself. The backend (`mpsc-api`) and the
`QuestionEditor`/audit-log plumbing were already genuinely bank-agnostic
per this repo's own earlier claim, but the *reader-facing* trigger UI and
the *browse-without-a-report* admin entry point only existed inside
`StateTaxOfficerEnhanced.tsx`'s bespoke card and the `mpsc-old-questions`-
specific `QuestionCard.tsx` chain — `PyqPage`, which is what actually
renders the Statistical Handbook bank, had none of it. Fixing that once,
bank-agnostically, was the only way "editing the Mizoram bank's answers"
was ever going to be reachable at all.

**Verified:** typecheck clean project-wide. In the browser: selected the
Statistical Handbook bank on `/pyq`, filtered to Population & Census, hit
the literacy-rate question, confirmed the amber "⚠ Source note" callout
renders with the exact contradiction text, confirmed Flag/My note/
Comments all open and correctly gate on login ("Log in (top right) to
flag, note, or comment"), confirmed no console errors, confirmed bank
switching (Polity Codex ↔ Mizoram) doesn't throw despite the new
per-bank `getCorrections` fetch. **Not verified: the admin Questions tab
itself**, for a mundane reason — it's gated on a real `admin.stats`
capability against the live `mpsc-api` droplet, and I don't have (and
didn't create) an admin account on it. Confirmed the gate itself works
(anonymous → "You don't have access to the admin console"). The tab
reuses `AdminTable`/`QuestionEditor`/`adminListAuditLog` exactly as
`ReportsTab`/`AuditLogTab` already do in production, so the risk surface
is narrow, but someone with admin creds should click through it once —
particularly the "Only ⚠ contradictions" checkbox and opening the editor
on a question with no prior report.

**What's still open:**
- The admin Questions tab needs a real admin-credential smoke test (see
  above).
- `PyqPage`'s correction overlay and `sourceNote` badge are now wired for
  *every* bank rendered there, not just the Statistical Handbook — worth
  knowing if a future Polity Codex or State Tax Officer edit ever sets
  `sourceNote`, it'll now show up here too, which is intended but untested
  against those banks specifically.
- `disputeNote` still isn't rendered anywhere in `PyqPage` for the
  `mpsc-state-tax-officer` bank's own disputed questions when browsed via
  `/pyq` (as opposed to `/state-tax-officer`) until now — it is now,
  since this session added that render path, but it was never checked
  against real disputeNote-bearing State Tax Officer rows in the browser.
- No bulk view of `sourceNote` across all banks — the Questions tab's
  "Only ⚠ contradictions" filter is per-bank, matching how everything else
  in the admin console works, but a cross-bank contradiction dashboard
  doesn't exist if that's ever wanted.

---

## 2026-08-22 — New bank: Mizoram Statistical Handbook 2024 (176 questions)

**What shipped:** A third question bank, `mizoram-stat-handbook-2024`,
built from the *Statistical Handbook Mizoram 2024* (Directorate of
Economics & Statistics, 25th in the series, 279 pp., 48 chapters).
**169 MCQs + 7 descriptive/essay prompts across 15 MCQ topics** —
geography and boundaries, Census 2011 demography, state symbols/peaks/
rivers/heritage, GSDP and budget, forest and wildlife, climate,
agriculture, health and NFHS-5, education, power, transport, tourism,
election/MPSC/local administration, crime, and all-India comparison.

Generator lives in `tools/statistical-handbook/` with its own README.
**The `.ts` is generated — edit the `q_*.py` batches, not the bank file.**
`build_bank.py` refuses to emit unless every record passes validation
(unique id, 4 distinct options, `answerIndex` in range, non-empty
explanation, no duplicate question text, known topic→subject mapping).

**Why:** MPSC leans heavily on Mizoram-specific statistics, and this
handbook is the authoritative source for almost all of them. It also
feeds Mains/essay answer-writing, which is why the 7 descriptive prompts
carry model frameworks with figures and source tables rather than just a
question stem. Note Table 32.1: of 133 posts MPSC advertised in 2023-24,
all 83 persons recommended were **Group B Gazetted** — the grade this
prep is aimed at.

**On sourcing — the part worth remembering.** `pdftotext -layout` reads
the numeric tables fine, but the handbook is bilingual and the extractor
interleaves Devanagari into the English lines, so the pipeline strips it
per line. Two sections defeat text extraction outright — "Mizoram at a
Glance" (pp. v–viii) and "State Information" (pp. ix–xiv), both dense
bordered bilingual tables — and those were read as **page images**
instead. Every question comes from a figure verified in one of those two
views. I first tried fanning out subagents to transcribe page-range
slices; that burned a large amount of budget and its failure mode is a
silently mis-transcribed number, which is precisely the class of bug
this repo has been bitten by twice. Reading the tables directly is
cheaper and auditable. Don't repeat the fan-out.

**The handbook contradicts itself in seven places**, all documented in
the tools README and in the bank file's header comment. The important
ones: Mizoram's Census 2011 population is 10,97,206 in the state
chapters but 10,91,014 in Table 47.1 (literacy likewise 91.33% vs
91.58%); forest cover is quoted against both ISFR 2021 (84.53%) and ISFR
2023 (85.34%); annual normal rainfall is 2,090.33 mm in Table 2.1 but
2,213.51 mm in Table 2.2. Questions name the table rather than pretending
one figure is canonical. Table 20.3's per-district "% electrified" column
doesn't reconcile with its own counts (Kolasib 36/36 printed as 99.21%),
so only counts and the state total are used; Tables 24.10 and 24.11
(drop-out, GER) are unusable as printed and are untouched. Also: the TOC
lists Table 31.1 as the 2018 Assembly election, but the table itself is
**2023** — the TOC is stale.

**Two fixes made along the way:**

1. **Tag normalisation.** Cross-linking ("View on map") matches question
   tags against chapter tags, and `mizoram` is carried by only three
   *polity* chapters (judiciary, states-reorganisation, sixth-schedule).
   Tagging all 176 questions `mizoram` therefore made a question about
   district forest cover link to "Judiciary, Writs & PIL" — noise on
   every single card. `build_bank.py` now keeps `mizoram` only on
   `polity_admin` questions and content-matches the map's real
   vocabulary (`tlawng`, `kaladan`, `karnaphuli`, `mizo-hills`,
   `purvanchal`, `tropic-of-cancer`, `northeast`, …). The Tlawng
   question now links to Rivers of India and Geography of Mizoram.
2. **`PyqPage` dropdowns (pre-existing bug, first exposed here).** The
   drill filters to MCQs (`filter(isMcqQuestion)` — correct, descriptive
   questions can't be click-scored) but built its subject/topic
   dropdowns from the *unfiltered* pool. This bank is the first
   registered bank containing descriptive questions, so it surfaced a
   "Descriptive & Essay" topic that could never match — selecting it
   dropped the user on "No questions match these filters" with no
   explanation. Both dropdowns now derive from the same `mcqPool` the
   drill uses.

Verified in the browser at `/pyq`: bank appears in the selector as
"Mizoram Statistical Handbook 2024 (176)", all 15 MCQ topics populate,
answering scores correctly, explanations and map cross-links render, and
the console is clean. Typecheck passes.

**What's still open:**
- **The 7 descriptive questions have no UI.** `/pyq` is MCQ-only by
  design, and `DescriptiveQuestionCard` currently only renders inside
  the State Tax Officer module, which is bound to its own bank. They are
  correct in the data and will render the moment any bank-agnostic view
  picks them up — but today they're unreachable. This is the main
  follow-up.
- Coverage is deliberately uneven: chapters with high exam yield
  (demography, forest, NFHS-5, all-India) are worked hard; low-yield
  administrative chapters (co-operation, sericulture, legal metrology,
  printing & stationery, forensic science) are untouched. Roughly 30 of
  the 48 chapters contributed questions.
- Figures from chapters 5–7 (banking, labour, state finance beyond the
  At-a-Glance budget lines) were extracted but not turned into
  questions — several of those tables have arithmetic defects that need
  a careful pass before they're safe to quote.
- `answerSource` is `derived` throughout, correctly: the statistics are
  official, the question framing is not. Nothing here should ever be
  flipped to `official`.

---

## 2026-08-18 — Per-question attempt history + a "Mistakes" tab in the Hub

**What shipped:** Two additions to the existing localStorage attempt
tracker (`HIST`, keyed by uid: `seenCount`/`wrongCount`/`lastResult`/
`lastAt`) that previously only fed the terse "Previously missed" badge
and the Test tab's "only questions I've gotten wrong" filter:

1. **Click-to-reveal in the Viewer now counts as an attempt.** Only Test
   submission and MCQ of the Day submission called `recordResult()`
   before — revealing an answer by clicking it in the Viewer went
   untracked. It now calls the same `recordResult(uid, isCorrect)`, so
   Viewer browsing feeds the same history as taking a real test.
2. **A human-readable attempt-history line** ("You've attempted this 2
   times, missed it 2 times (100%) · last attempt: incorrect on
   8/18/2026") appended to every question card wherever the answer is
   already shown — same `showAnswer` gate as the comment thread, for the
   same reason: "you missed this before" is itself a spoiler on an
   unanswered card, so it's absent from the Daily quiz and Test while
   in progress, and appears in Test review, Analyze, Corrections, and
   the Viewer once revealed.
3. **A new "Mistakes" tab** — every question with `wrongCount > 0`,
   ranked by raw miss count first (a question missed 4 times outranks
   one seen once and missed, even though both show 100%), miss rate as
   tiebreaker, then most-recent. Same search/subject-filter shape as the
   Corrections tab. Re-renders every time the tab is opened (not just
   once at load) via a small `TAB_ACTIVATE_HOOKS` registry, since HIST
   changes from *other* tabs during the same session and a stale list
   would defeat the point.

**Why:** asked directly — "how much we did wrong" per question, plus a
summary of what's frequently missed, so revision time goes to actual
weak spots instead of guesswork. All local: nothing added here talks to
the network, matching the footer's existing "stored only in this
browser" claim.

**Verified in-browser** (dev server, real click flows, not simulated):
first-click-correct shows "always correct"; a genuine miss shows
"missed it 1 time (100%)"; missing the same question again correctly
accumulates to "2 times, missed it 2 times"; the Mistakes tab picks up a
fresh miss immediately on tab-open with no reload (the activate-hook);
ranking puts the 2/2 question above the 1/1 question; a question
answered correctly on first try never appears in Mistakes; the Daily
quiz's unrevealed cards show zero attempt-history lines and zero comment
buttons, same spoiler guard as before.

**What's still open:**
- History is per-browser localStorage only — no cross-device sync, and
  clearing site data resets it. That's the same limitation the existing
  progress tracking already had; not new here.
- No decay/recency weighting — a mistake from months ago counts exactly
  as much as one from today. Could matter once there's enough history to
  make "recently missed" a meaningfully different signal.

---

## 2026-08-17 — Corrections tab: edit history inline, one request instead of N

**What shipped:** The Corrections tab's per-question "Show full edit
history" button is gone. The whole bank's correction history now loads in
**one** `/api/admin/audit-log?bankId=…&action=correction&limit=500` call,
gets grouped by `questionId` client-side, and every corrected question
renders its revisions inline with no click. Same request the account
widget's Edit History modal already makes; the promise is cached so the
tab's search/subject filters re-render from memory instead of refetching.

**Why:** the old design cost one request per question whose history you
opened — 20 corrections meant up to 20 round-trips to read them all. This
started as the user asking whether showing history per-question inline
would be *costly*; it isn't, and measuring made that concrete: the Hub
already ships **4.2 MB** of HTML per load and fetches all corrections
(**12.7 KB**) synchronously before first render. A few dozen audit rows
are rounding error next to that, so there was never a reason to hide
history behind a click.

**Verified against a local mock of mpsc-api** (scratchpad copy of the page
with `API_BASE` repointed — the shipped file was never touched), because
the real audit-log endpoint needs credentials this session didn't have:
- **exactly 1** audit-log request on load, URL as designed — not 20
- 3 seeded revisions grouped correctly onto 2 of the 20 cards; remaining
  18 say "No edit history recorded"; correct "1 edit"/"2 edits" plurals;
  "Latest" tag on the newest; nothing stuck on "Loading"
- the oldest revision of a question (`before: null`) correctly falls back
  to the original extraction — shows `Correct answer: a → c`, **not**
  `(blank) → c`, i.e. the fix from earlier today still holds on this path
- 401 path (invalid token against the real API): all 20 cards say
  "Edit history unavailable (status 401)" and the **public** before/after
  diff still renders, so a history failure never blanks the tab

**What's still open:**
- `limit=500` is a real ceiling. If it's ever hit, the count line appends
  "history capped at the newest 500 edits" rather than silently implying
  that's all there is — but there's no pagination past it.
- The global Edit History modal still does its own separate fetch on open.
  It could share `AUDIT_HISTORY`, but it lists *all* action types (not
  just corrections) so the cached correction-only payload isn't a drop-in.
- Unrelated data nit spotted while reading real corrections: one
  explanation contains malformed markup (`<u> … <u>`, no closing tag) and
  so renders as literal text. Content bug, not a rendering one.

---

## 2026-08-17 — Per-question comment threads in the MCQ Practice Hub

**What shipped:** A "Comments (n)" toggle on question cards in the Hub,
opening an inline thread. Backed entirely by mpsc-api's *existing*
comment endpoints (`/api/questions/comments` GET/POST/PATCH/DELETE +
`/pin`) — no backend change was needed, because that API is keyed on
`bankId` + `questionId` and the Hub's `paperId__sectionIdx__qno` uids
work as-is. Reading is public (verified: GET returns 200 logged-out,
POST returns 401), matching how corrections already work, so comments
are visible without logging in. Writes are capability-gated to match
`RoleMatrix.tsx`: `comment.create` to post/reply, `comment.edit_own` /
`comment.delete_own` on your own, `comment.moderate` to pin or delete
anyone's. Pinned comments sort first, then oldest-first so a thread
reads top-to-bottom; replies are one level deep (the API's `parentId`
models exactly one), nested under their parent.

**Why the placement rule matters:** the comment button is attached *only
where the answer is already on screen* — `renderQuestionStatic`'s
`showAnswer` branch, plus the click-reveal handler after reveal, plus
Corrections tab cards. A comment saying "the key is wrong, it's (c)"
would otherwise spoil an in-progress test or an unrevealed Viewer card.
Verified: the daily quiz (10 cards, rendered `showAnswer=false`) gets 0
comment buttons; High-Yield (100 cards) and Corrections (20) get one
each; the Viewer's default click-to-reveal mode has none before the
click and one after.

**Also answered along the way** (the question that prompted this): showing
per-question edit history is *not* costly. The Hub already ships 4.2 MB
of HTML per load; all 20 corrections are 12.7 KB, already fetched
synchronously on every load. History data is under 1% of that.

**What's still open:**
- The authenticated write path (post/edit/delete/pin) is **verified only
  against a stubbed fetch**, not a real round-trip — no credentials
  available in-session. Payload shape and capability gating are
  confirmed; the server's actual acceptance of them is not.
- Per-question correction history is still a click-to-expand button doing
  **one request per question opened**. One bulk call
  (`?bankId=…&action=correction&limit=200`, the same request the global
  Edit History modal already makes) would let history render inline for
  every corrected question with 1 request instead of N. Recommended but
  not done — was scoped out in favour of comments.
- No comment count is shown until the thread is opened (the count comes
  from the fetch). A bulk `/api/admin/comments?bankId=` call could
  pre-populate counts, but it's admin-gated, so not usable for the
  public read path.

---

## 2026-08-17 — Added a "Corrections" tab to the MCQ Practice Hub

**What shipped:** A new nav tab in `mpsc-mcq-practice-hub.html` (alongside
Papers/Viewer/etc.) that lists every question with a live correction,
one card per question, with a human-readable before/after diff (question
text, each changed option, correct answer, explanation/note — only the
fields that actually differ from the original extraction) plus search and
subject filtering. The diff is built entirely from data already public
(the `/api/questions/corrections` overlay every tab already loads), so
it's visible to everyone, not just logged-in editors. For users with the
`audit.read` capability, each card additionally has a "Show full edit
history" expander that lazily fetches that question's own audit-log
entries (`?questionId=<uid>&action=correction`) and renders each past
revision the same human-readable way, with a collapsed raw-JSON fallback
in case a future backend entry doesn't match the expected field shape.

**Why:** The Hub already had a "Corrected" chip per question and a
logged-in-only "Edit History" modal (a flat, ungrouped audit-log dump,
raw JSON before/after), but there was no way to browse *what's been
fixed so far* as its own view — asked for directly by the user.

**What's still open:** Verified against the 7 corrections live on the
droplet at time of writing (3 were genuine no-op saves — same stem/
options/answer resubmitted — and the diff correctly renders nothing for
those). The full-history field-name mapping (`stem`/`options`/
`answerIndex`/`explanation`/`note`) is inferred from the same shape the
public corrections endpoint already returns, not confirmed against
backend source (not in this repo) — the raw-JSON fallback exists
specifically to not hide data if that inference is ever wrong.

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
