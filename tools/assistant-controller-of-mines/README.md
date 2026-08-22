# assistant-controller-of-mines — bank generator

Generates `src/data/banks/assistant-controller-of-mines-2026.ts` (166 MCQs:
66 General English Part-B + 100 General Studies) from
`~/Downloads/ASSISTANT CONTROLLER OF MINES - 2026.html`, a "Marked Answer
Key" for a mock MPSC Assistant Controller of Mines paper.

**The `.ts` is generated. Edit `parse.py`/`build_bank.py`, not the bank
file.**

## Rebuild

```bash
cd tools/assistant-controller-of-mines
python3 parse.py                                              # HTML -> parsed.json
python3 build_bank.py ../../src/data/banks/assistant-controller-of-mines-2026.ts
```

## Provenance — read before trusting this as an authoritative key

The source HTML is not a transcription of a real government-published
answer key. Three questions carry a leaked LLM reasoning trace right in the
markup, e.g. General Studies Q33:

> \* Note: Official key marks (B) for Q33. Let's fix this to match the key
> exactly.

That's a model talking to itself about a key it's describing, not quoting.
So this whole document was authored by an LLM working from some described
answer set, not transcribed from an MPSC PDF. `answerSource` is `'derived'`
on every question for exactly that reason — there is no independently
verifiable "official" key behind it, unlike `mpsc-state-tax-officer.ts`'s
`answerKeyRef`-bearing PYQ records.

**Self-corrections.** 3 questions (English Q9, GS Q33, GS Q67) have TWO
`<ul class="opts">` blocks in the source: an initial marking, the note
above reasoning about it, then a corrected block. `parse.py` always takes
the **last** `<ul>` in a question's block — correct for both the 3
corrected questions and the 163 with only one block.

**GS Q67 carries a real, unresolved `disputeNote`.** Its own correction
note reads: "The Bairabi-Sairang has 32 tunnels, but options are 44-47" —
i.e. even after "fixing" the answer to 45, the note-writer flags that none
of the 4 printed options obviously matches reality. The bank keeps 45 as
the answer (the source's own final key) but surfaces the note as a
`disputeNote`, same as `mpsc-state-tax-officer.ts` does for its own
factually-doubtful official-key answers.

## Underline handling

24 words/phrases across the English section are wrapped in `<u>` in the
source. For most of them (parts-of-speech ID questions like "what part of
speech is the word 'weekly'?") the underline is purely redundant — the word
is separately named in quotes. But for the word-transformation block
(English 26-30, "She faced the approaching army *bravely*. (to Noun)") and
the advanced classification block (English 31-35, "choose the correct
degree of the target word") the underline is the **only** indication of
which word is being asked about — stripping it would make the question
ambiguous or unanswerable.

`parse.py` therefore converts every `<u>word</u>` to `__word__` uniformly
(never strips it, even where redundant) — the same convention already used
by `mpsc-state-tax-officer.ts` and rendered by `src/lib/renderEmphasis.tsx`.
This required adding a `renderEmphasis()` call to `PyqPage.tsx`'s question
stem, which didn't call it before — see the DEVLOG entry for why that's a
generically correct fix, not a one-off patch.

## Topic assignment

The source has no per-question topic label, but reading start to finish
shows the questions cluster tightly by number within each section (e.g.
English 41-46 are all idioms, GS 88-95 are all Mizoram history/culture).
`build_bank.py`'s `ENGLISH_RANGES`/`GS_RANGES` tables assign topic by
number range — far more reliable here than keyword matching on question
text, and it was verified by actually reading every question, not guessed.
If the source paper's structure changes on a future re-run, re-verify the
ranges by reading the HTML again before trusting the table.

## Difficulty

Flat `'medium'` on every question — the source carries no difficulty
signal, and hand-grading 166 questions wasn't worth the time for what is
otherwise a fast, low-ambiguity mechanical import (BeautifulSoup, not OCR
or manual transcription). Don't mistake it for a judged rating.

## Tags — deliberately empty

Every question ships with `tags: []`. An earlier draft tagged
mining/Mizoram-history/Mizoram-current-affairs questions `['mines',
'mizoram']` to drive "View on map" cross-linking — this was wrong and
reverted: the bare `'mizoram'` tag is carried by exactly three *polity* map
chapters (judiciary, states-reorganisation, sixth-schedule), so it linked
a **Jharkhand** geology question (Q68, Singhbhum Shear Zone) to "Judiciary,
Writs & PIL" purely because the tag existed on that chapter, not because
the two are related. This bank has no verified per-question correspondence
to real map chapters (unlike the Statistical Handbook bank, where every
tag was checked against an actual river/mountain/district in
`mizoram-geography.ts`), so it ships untagged rather than guess again.
