# Brief for answer-key verifier agents

You are auditing questions that are **already in the app** and already have an
answer. Someone is revising for a real Mizoram PSC exam from these cards. A
wrong key here does not just lose a mark — it teaches a false fact and it gets
*rehearsed*, which is worse than not studying at all.

Read `tools/bank-rebuild/SOLVE_BRIEF.md` for the house honesty rules on
confidence; they apply here unchanged.

## What you are given

A JSON array. Each entry:

| field | meaning |
|---|---|
| `id` | stable question id — **copy verbatim**, never invent |
| `app` | `system-analyst` or `system-manager` |
| `paper`, `unit`, `sub` | where it sits in the syllabus |
| `sitting` | the exam it came from, if any |
| `q` | the question stem |
| `opts` | object keyed `A`/`B`/`C`/`D` (sometimes more) |
| `ans` | **the key currently stored in the app** — the thing you are auditing |
| `exp` | the stored explanation |
| `conf` | stored confidence, where the bank tracks one |
| `prov` | provenance — how the stored answer was arrived at |
| `note` | any existing caveat |

## Your job

For **each** question, decide independently what the correct option is, then
compare with `ans`. Work the problem yourself before you look at `exp` — the
explanation is part of what you are auditing, not evidence.

Report **only problems**. A question you agree with produces no output.

### The four problem types

- `wrong_answer` — you are confident `ans` names the wrong option. Give the
  option letter you believe is right in `should_be`.
- `explanation_contradicts` — `ans` is right but `exp` argues for a different
  option, states a false fact, or explains a different question entirely. This
  is a real defect: the reader believes the prose, not the highlight.
- `broken_question` — the stem is truncated, options are duplicated or blank,
  required data (a figure, a table, a code listing) never made it into the text,
  or no option is defensible. Say precisely what is missing.
- `ambiguous` — two or more options are genuinely defensible, or the question
  turns on a convention textbooks disagree about. Do **not** use this as a
  hedge for "I'm not sure"; use it when the *question* is at fault, not you.

### Provenance changes the bar, but never the honesty

- `prov` naming an **official MPSC answer key**: the key is authoritative even
  when you disagree. Report the disagreement — MPSC keys do contain errors, and
  the reader deserves to know — but say so in `note_suggestion` rather than
  demanding the stored answer be overwritten, and set `confidence` honestly.
- `prov` describing a **derived** answer (agent-solved, no official key): the
  stored answer carries no more authority than your own reasoning. If you are
  confident it is wrong, say so plainly.

## Output

Call `StructuredOutput` with a `findings` array. Empty array is the expected,
common result — do not manufacture findings to look thorough.

Each finding:

- `id` — copied verbatim from the input.
- `type` — one of the four above.
- `should_be` — the option letter you believe correct. Required for
  `wrong_answer`; omit otherwise.
- `confidence` — `high` | `medium` | `low`. This is confidence *that the
  finding is real*, not confidence in the subject matter. Be honest: an
  inflated rating here wastes a verification pass, and a deflated one lets a
  real error survive.
- `reason` — 1–3 sentences. Lead with the fact that decides it. Name the
  authority where one exists (a standard result, a defining property, the
  arithmetic). "I think B looks better" is not a reason.
- `fix` — for `wrong_answer` and `explanation_contradicts`, the replacement
  explanation text, written in the bank's existing voice: no "the correct
  answer is (b)" opener, lead with the deciding fact, then say why the most
  tempting distractor fails. Omit for the other two types.
- `note_suggestion` — optional short caveat for the card's `note` field, for
  ambiguity or a disputed official key.

## Rules

1. **Never reorder or renumber options.** `should_be` indexes `opts` exactly as
   given.
2. Only report `id`s that appear in your input. An id you did not receive is a
   fabrication.
3. Arithmetic questions get worked, not eyeballed. Page-replacement counts,
   subnet host counts, SJF average waiting time, K-map minimisation, tree-height
   bounds and complexity classes are where real errors hide, and they are all
   checkable in a few lines. Show the decisive step in `reason`.
4. Do not report style. Awkward phrasing, British/American spelling, a
   sub-topic tag you would have chosen differently — none of these are findings.
   Preserved original misspellings from scanned papers are deliberate.
5. Do not fabricate. If you cannot verify a claim — obscure Mizoram GK, a dated
   current-affairs item, a vendor-specific detail — either leave it alone or
   report it at `low` confidence saying explicitly that you could not verify it.
6. A question whose stored answer is right and whose explanation is right
   produces **nothing**. Most questions should produce nothing.
