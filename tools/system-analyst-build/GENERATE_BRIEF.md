# Brief for question-generation agents — System Analyst

**Read `tools/system-manager-build/GENERATE_BRIEF.md` first.** Its Output section,
its nine Rules and its JSON schema apply here unchanged. This file overrides one
thing, and it is the thing that matters most.

## The override: difficulty

The shared brief is calibrated for the **System Manager** post at MUDAL, whose
qualification bar is *any graduate plus a one-year computer diploma*. It therefore
tells you, in as many words:

> do NOT write questions like these … compiler phases, automata, **J2EE, design
> patterns**

**That instruction does not apply to this post and must not be followed here.**

System Analyst requires **B.E/B.Tech, MCA, or M.Sc (Computer Science / IT), or
higher**. Its syllabus contains an entire Java/J2EE unit (TECH1 Unit 4) and names
`Design Pattern and UML` as a leaf of TECH1 Unit 3 — the exact two topics the
shared brief tells you to avoid. Writing to the System Manager level here produces
questions a candidate for this post would find trivial, on a paper that decides
merit.

This was already worked around once by hand, in the TECH2 e-governance authoring
pass of 2026-08-30, where agents were told out-of-band to pitch above the shared
brief. This file exists so the next session does not have to know that.

### Calibrate to the Informatics Officer papers

The 2021 and 2024 Informatics Officer papers **are** this syllabus. They are the
reference, not the Computer Operator papers.

Right level for this post:

- "In immediate addressing, the operand field contains ______"
- "Which method sends a redirect response to the client from a servlet?"
- "A route crosses two links; with default K-values what is the EIGRP metric?"

Assume the reader knows what a class, a thread, a socket and a foreign key are.
Do not define them. Aim for roughly **50% recall of specifics a practitioner
would hold, 50% one-step applied reasoning** — a harder mix than the shared
brief's 70/30.

## Flavour mix for programming units (TECH1 Units 3 and 4)

These units examine four distinguishable things, and a batch should carry all
four rather than drifting into whichever is easiest to write:

1. **Syntax and API recall** — which method, class, attribute or namespace does
   X. `Response.Redirect` vs `Server.Transfer`, `[Serializable]`, which assembly
   holds `System.Data`. Heavily examined; write these confidently.
2. **Conceptual / architectural** — why the CLR does X, WCF versus ASMX web
   services, what an assembly manifest is for, when Entity Framework's change
   tracker matters.
3. **Code-output prediction** — a short C# or Java fragment, and what it prints
   or throws. Keep it to ~6 lines and make the trap a real language semantic
   (boxing, `ref`/`out`, string immutability, integer division), not a typo.
4. **Configuration and deployment** — `web.config` sections, the GAC, strong
   names, side-by-side versioning, publish models. The syllabus names
   `Application Deployment` and `.NET Assemblies` as leaves, so this is fair game.

## Two System Analyst specifics

- **`sub` must match the System Analyst syllabus** character-for-character —
  `tools/system-analyst-build/generate.py --merge` rejects anything that is not a
  leaf of the named paper and unit. Note this syllabus's own spellings:
  `Sub-netting` is hyphenated, `IPv6` is its own leaf.
- **Version-pin nothing you are unsure of.** Rule 8 of the shared brief matters
  more here than there, because .NET and Java questions invite exact version
  claims. "Introduced in .NET Framework 3.0" is the kind of specific that is
  easy to get wrong and impossible for a reader to catch. If unsure, write the
  question at the conceptual level.

## Study modes

Every question in this bank now carries a study-mode label (see
`CLASSIFY_BRIEF.md` and `data/modes.js`). You do **not** assign it — the
classifier does, in a separate pass. But it is worth knowing that the four
flavours above map onto it: syntax/API recall and configuration land in
`memorise`, conceptual in `understand`, code-output in `calculate`. A batch that
is all one flavour produces a unit that is all one mode, which is exactly the
imbalance the labelling pass was built to expose.
