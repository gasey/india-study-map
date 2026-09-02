# The 20 SPLIT findings — for review

**Written 2026-09-02. Nothing in this document has been applied.** The bank
files are untouched by it. Each item ends with a **Decision** line; answer
those and a follow-up session can apply them mechanically.

Context: the 93-agent bank-wide audit raised 83 findings, each adjudicated by
two independent Sonnet agents with different lenses (`subject` = re-solve from
first principles; `skeptic` = actively try to refute). Both uphold → CONFIRMED
(49, already applied). Neither → REFUTED (14, dropped). One each → **SPLIT
(20)** — these, which `HANDOFF-VERIFY-AUTHOR.md` says to surface rather than
decide silently.

---

## Read the word "SPLIT" carefully

All 20 split the *same way*: `subject` upheld, `skeptic` refuted. Not one
went the other way. That is not a coincidence and it changes how to read the
tally.

The skeptic's brief tells it to find the reading under which the stored answer
survives, and to **default to `refuted: true` when genuinely uncertain**. So a
SPLIT is not "the two judges disagreed 50/50." It is closer to: *an independent
solver found something real, and an adversary — told to defend the stored
answer — could construct a defence.* The interesting question for each is
whether that defence is a genuine reading or a rationalisation.

In practice the skeptic's defence falls into three recognisable shapes, and
they are not equally strong:

1. **"I checked the source PDF and the auditor's premise is factually wrong."**
   Strong. Twice this actually *solved* the question (§3).
2. **"This is a stock Indian competitive-exam MCQ and the setter meant the
   conventional answer, not the rigorous one."** Genuinely weighty for an exam
   you are sitting — the goal is to predict what MPSC keys, not what is true.
   But it is also the shape most prone to being an excuse.
3. **"The caveat is already disclosed elsewhere on the card."** Weakest as a
   reason to do nothing; usually true but beside the point.

---

## 0. First: one of these findings uncovered an official answer key

**This is the largest thing in the document and it is not really about the
finding that produced it.**

Chasing `ILM2023_P2_020`, the `subject` adjudicator went looking for the source
paper and found an **official MPSC final answer key for the sitting**, in a
directory the pipeline never consulted:

```
~/Downloads/mpsc_pdfs_examination/Answer_Keys/
  Inspector of Legal Metrology under FCS&CA Deptt. Final Answer Key..pdf   (8 Mar 2024)
  Corrigendum of Final Answer Key of Inspector, Legal Metrology ...pdf     (14 Mar 2024)
```

Verified here, not taken on trust. Notification No. ILM/1/2018-MPSC covers the
Technical Competitive Examination **held 4–6 October 2023** and contains
per-paper keys including **Computer Science & Engineering Paper-I, II and
III**. The 14 March corrigendum supersedes it; for CS Paper-I the two are
byte-for-byte identical in substance (its real changes are to the Physics
papers), so nothing is ambiguous about which key governs.

Every one of the bank's 136 ILM2023 records currently carries provenance
ending **"no official key exists for this sitting."** That statement is false.

Checked all 136 stored answers against the official key:

| | |
|---|---|
| ILM2023 records in bank | 136 (P1 97, P2 39) |
| Agree with official key | **123** |
| Disagree | **12** |
| Q29 of Paper-I | keyed *(Compensated)* — no correct answer exists |

The 91% agreement rate is itself the proof that the numbering lines up (random
would be ~25%), so the 12 disagreements are real, not an alignment artifact.

**The 12 questions where the app currently teaches an answer MPSC marked wrong:**

| id | Q# | bank says | official key |
|---|---|---|---|
| `ILM2023_P1_006` | 6 | D | **B** |
| `ILM2023_P1_009` | 9 | A | **B** |
| `ILM2023_P1_027` | 27 | D | **B** |
| `ILM2023_P1_028` | 28 | A | **B** |
| `ILM2023_P1_035` | 35 | B | **A** |
| `ILM2023_P1_046` | 46 | D | **A** |
| `ILM2023_P1_058` | 58 | B | **C** |
| `ILM2023_P1_066` | 66 | D | **A** |
| `ILM2023_P1_080` | 80 | B | **D** |
| `ILM2023_P1_093` | 93 | A | **D** |
| `ILM2023_P2_008` | 8 | C | **B** |
| `ILM2023_P2_020` | 20 | B | **C** |

The remaining 123 can be re-provenanced from `derived` to `official key`,
which is the difference between a blue *official key* badge and an unrated
derived one on 123 cards.

Two things follow that are bigger than this table:

- **The whole `Answer_Keys/` directory should be swept against the whole
  bank.** It holds ~40+ MPSC final keys. If ILM2023 was sitting there unread,
  others may be too. Every sitting in either app whose provenance claims no key
  exists is worth re-checking against that directory before any more answers
  are derived by agent.
- This is the `CLAUDE.md` rule landing again — *verify against source, don't
  trust the pipeline's own output.* The pipeline asserted no key existed; the
  assertion was never checked.

**Decision:** apply the 12 corrections + re-provenance the 123? And separately,
authorise a full `Answer_Keys/` × bank sweep?

*(Note: applying these makes `ILM2023_P2_020` below moot — the official key
settles it at C.)*

---

## 1. Official-key questions — explanation hygiene only (3)

House rule (`VERIFY_BRIEF.md`): where provenance names an official MPSC key,
the key outranks the agent. A disagreement becomes a warning note, never an
overwrite. **No stored answer changes in this group.** All three are System
Analyst `TECH1_LEGACY`, Informatics Officer Technical Paper-I 2024.

### 1.1 `TECH1_2024-8` — the explanation is wrong; the key is fine

> How many class A, B and C network IDs can exist? — **(A) 2,113,658** · (B) 16,382 · (C) 126 · (D) 128

The auditor caught the stored explanation summing to 2,113,662 and then waving
it off as "in the 2.1-million range, matching option (a)" — a 4-off gap papered
over.

The skeptic didn't defend the explanation; it **solved** the discrepancy.
Option (b) is printed as 16,382 = 2¹⁴−2, mirroring (c) 126 = 2⁷−2. The setter
applies a uniform −2 to every class. Do the same for class C — 2²¹−2 =
2,097,150 — and 126 + 16,382 + 2,097,150 = **2,113,658 exactly**. The missing 4
is precisely the two 2s.

Both adjudicators independently confirmed 2,113,658 is what MPSC printed
(subject rendered the source PDF page). So the option is right, the key is
right, and only the explanation is wrong — it derives the answer by a route
that doesn't reach it.

**Decision:** rewrite the explanation to the uniform-−2 derivation? *(This one
is a clear yes in my reading — the current text teaches sloppy arithmetic on a
question that is actually exactly consistent.)*

### 1.2 `TECH1_2024-99` — leftover derived-answer boilerplate

> The objective of ________ is to design tests likely to uncover possible bugs — **(A) Fault-based testing**

The explanation ends "…confidence is marked low," while `prov` says *Official
MPSC final answer key*. The record hedges about an answer it also calls
authoritative.

The skeptic's rebuttal is narrowly correct and misses the point: it verified
that `provLine()` shows only the blue *official key* pill here and never
consults `conf`, so no *badge* contradicts anything. True — but the sentence is
still sitting in prose the reader reads, and it reads as boilerplate carried
over from a derived-answer template.

**Decision:** delete the trailing hedge sentence from the explanation?

### 1.3 `TECH1_2024-38` — genuinely ambiguous, and the card says so in the wrong place

> Web-based systems have advantage over installed type applications in — (A) Functional accessibility · **(D) Update anomaly avoidance**

The stored explanation's own last sentence is "This question is genuinely
ambiguous between (a) and (d)" — buried in prose under a confident-looking D
highlight. The skeptic argues D is precisely correct terminology for the
card's own `sub` (client-server model) and A is vague marketing language, so
there's nothing to flag.

Both agree D stays either way. The only question is whether the A-vs-D caveat
belongs in the visible `note`.

**Decision:** surface the caveat in `note`, or leave it in the explanation?

---

## 2. Defective questions that already say they're defective (3)

In each of these the auditor is factually right that the item is broken, and
the skeptic's defence is the same each time: *the card already discloses this
— `conf: low`, `prov` ends "question defective as printed", and the explanation
spells it out.* The dispute is purely about whether to duplicate that caveat
into the `note` field.

One of the skeptics actually read `provLine()` and confirmed the reader sees a
red *derived · low confidence* pill plus the "question defective as printed"
provenance string directly under the explanation. So the disclosure is real and
visible, not theoretical.

| id | the defect |
|---|---|
| `ILM2023_P1_014` | Stem describes an **Euler circuit**; the four options are TSP / Four-Colour / Bipartite / Chromatic Number. The concept named is not among them. Stored A is an admitted placeholder. Both adjudicators confirmed against the scanned PDF that this is the setter's error, faithfully extracted. |
| `ILM2010_P2_143` | *"…stored in two forms ______ and ______"* — needs **both** C (row major) and D (column major). Single-select can't express it. Verified printed exactly this way. |
| `ILM2010_P2_100` | Option D reads `"both (b) and (c) are valid (e) none of the above statements is true"` — **two options merged, with an embedded `(e)` label**. Unlike the other two, this one *is* extraction damage: a fifth option was lost. |

`ILM2010_P2_100` deserves separating from the other two. The others are faithful
reproductions of bad exam questions; this one is our pipeline losing data, and
the embedded `(e)` is the tell. It belongs in the source-recovery queue (§3),
not in a note-wording decision.

**Decision:** (a) add `note` caveats to all three, or rely on the existing
`conf`/`prov`/`exp` disclosure? (b) queue `ILM2010_P2_100` for source-PDF
recovery of the lost option (e)?

---

## 3. Answer is right; the *stem* is damaged (2)

These two are the strongest results in the whole SPLIT set, and neither is
really a judgement call — in both, an adjudicator went to the source PDF and
**resolved the question outright**. The stored answers are correct. What's
broken is the text the reader sees.

### 3.1 `ILM2010_P1_053` — the blank connectives decode cleanly

The stem renders as *"whether p ␣ q does not imply p ␣ q"* — blanks where
logical operators should be. Stored answer A (True), explanation admits it is
guessing at the symbols.

Both adjudicators cracked it independently. The stem holds Symbol-font PUA
codepoints U+F0DB, U+F0AE, U+F0D8; the standard Symbol→Unicode vendor mapping
(byte N → U+F000+N) gives **⇔, →, ¬**. The subject then rendered page 9 of the
source PDF and read it directly: *"p ⇔ q does not imply p → ¬q"*, printed
cleanly, no OCR damage in the original.

Truth table: p=q=T gives p⇔q true, p→¬q false. So the implication fails, the
statement is **True**, and stored **A is correct**. The explanation's hedged
guess was right all along.

**Fix is mechanical:** replace three PUA codepoints with `⇔ → ¬`, drop the
"OCR-damaged, cannot be verified" hedge, raise `conf`. Answer untouched.

### 3.2 `MES2023_P2_017` — the missing page reference string is recoverable

> Consider the following page reference string. For LRU with 5 frames, the number of page faults is? — (A) 10 (B) 14 **(C) 8** (D) 11

No reference string is present. The card admits C is a placeholder guess.

The skeptic read the source PDF, recovered the string —
**`12342156212376321236`** — simulated LRU with 5 frames, and got **8 page
faults**, matching stored C exactly. The question is answerable and the stored
answer is right; only our transcription of the stem is incomplete.

**Fix:** paste the reference string into the stem, rewrite the explanation as a
real derivation, raise `conf`. Answer untouched.

> **Both of these are already in scope for the source-recovery pass** described
> in `tools/RECOVER_BRIEF.md` (28 damaged System Analyst stems). That workflow
> was launched and **died before returning anything** — 28 agents started, 0
> results. It needs relaunching; `resumeFromRunId` will not reach it from a new
> session.

**Decision:** confirm these two ride along with the relaunched recovery pass
rather than being hand-patched here?

---

## 4. Live answer disputes — a different letter is proposed (3)

**These are the ones that matter most.** All three are System Manager, all
derived with no official key, and in each the subject adjudicator names a
specific replacement answer. Get these wrong and the app teaches a false fact
with negative marking attached.

### 4.1 `CO2019A-P2-1` — SMTP vs TCP · stored **A**, proposed **C**

> Which of the following **transport layer** protocols is used to support electronic mail? — **(A) SMTP** · (B) IP · (C) TCP · (D) UDP

Subject (high confidence): the stem's own qualifier is "transport layer". SMTP
is application-layer and fails it regardless of its role in email; IP is
network-layer. Of the two actual transport-layer options, TCP is the one that
carries mail. Verified against the source PDF OCR that the "transport layer"
wording is the exam-setter's, not ours.

Skeptic: agrees the strict taxonomy gives TCP, and agrees the qualifier is the
setter's. Argues this is a *Computer Operator* clerical exam where
"SMTP = the email protocol" is the fact being tested, and — notably — that
**`DEVLOG.md` already logged this exact question** as a source-paper defect and
a prior pass deliberately left `ans: "A"` in place.

That last point is the real content here: this was already looked at once and
consciously left alone. Worth knowing before overturning it.

**Decision:** flip to C, or keep A with a note explaining the stem's
mislabelling? *(A note may serve better than either bare answer — the trap is
the question, and knowing that is what helps in the exam hall.)*

### 4.2 `CO2019B-GE-45` — 'above' · stored **A** (adverb), proposed **C** (noun)

> Our blessings come from above. *(part of speech of 'above')*

Subject (high confidence): 'above' is the object of the preposition 'from', and
traditional school grammar — the convention MPSC English papers follow —
reclassifies such a word as a **noun** (same treatment as 'now' in "till now").
This is Wren & Martin's own canonical example sentence for 'above' as a noun.
Corroborating: this is one of an 11-question run (`CO2019B-GE-38..48`) lifted
from that drill set, and the other ten all match the standard key exactly —
#45 is the lone outlier.

Skeptic: checked the sibling items and found **none of the other ten actually
exercises this preposition-governs-an-adverb pattern** — they test
conjunction-vs-preposition 'till', pronoun 'that/what', and so on. So the
"10-for-10 consistency" argument is an appeal to convention, not a demonstrated
pattern. Also found published sources keying it both ways.

The skeptic's rebuttal lands on the *corroboration*, not on the grammar rule.
The grammar rule itself went unchallenged.

**Decision:** flip to C (noun)?

### 4.3 `CO2018M-GE-44` — Either vs Each · stored **B**, proposed **C**

> ______ of the two books is costly. — (A) Neither · **(B) Either** · (C) Each · (D) None of these

Subject: a flat declarative "X of the two ___ is Y" asserts the property of
both individually — the textbook slot for **each**. "Either" means one or the
other, unspecified which, and wants a choice/permission frame.

Skeptic: that premise is too narrow. "Either of the two roads leads to the
station" / "Either of the two answers is correct" are standard declaratives
with no permission frame at all, and match this template exactly.

Both cite the same Indian grammar canon (Wren & Martin, Hari Mohan Prasad) and
reach opposite readings. Both medium confidence. **This one is genuinely
unsettled** — the only item in the whole set where I'd say the two arguments
are actually of equal weight.

**Decision:** flip to C, keep B, or note both readings?

---

## 5. Ambiguity notes — no answer change proposed (8)

In all eight, both adjudicators agree the stored answer stays. The auditor's
claim is only that the item has more than one defensible option, and the
skeptic's reply is consistently *"yes, strictly — but this is a stock exam MCQ
and the setter's intended answer is the stored one."*

For an exam you are actually sitting, the skeptic's argument has real force:
you need the answer MPSC would key. But it also cuts the other way — knowing
*why* a question is loose is exactly what stops you second-guessing yourself in
the hall. That argues for notes rather than silence.

| id | question | stored | the competing option |
|---|---|---|---|
| `TECH1_CSE_020` | Minimum time input must be *maintained* at a flip-flop input | B hold time | A setup time — stem never says before/after the clock edge. Skeptic: "maintained" *is* the definition of hold. Source-verified as printed. |
| `TECH1_CSE_067` | aRb partially ordered ⇒ a,b are ___ | D reflexive+transitive | A partial order needs **antisymmetry** too; no option states it. Skeptic found the identical stem+key circulating externally — faithfully reproduced, not corrupted. |
| `TECH1_CSE_100` | Which language does not support all 4 types of inheritance? | B Java | Kotlin *and* Smalltalk share Java's single-class-inheritance restriction. Only C++ is the outlier. Three options satisfy the criterion. |
| `ILM2018_P1_033` | Sorting algorithms whose best = worst | C merge+heap | A heap+**selection** — selection sort is non-adaptive, Θ(n²) always, so best = worst just as surely. |
| `CO2019B-GE-19` | Closest in meaning to 'alarming' | C distressing | D frightening. Cambridge/Longman *define* alarming via "frightening"; Merriam-Webster's thesaurus omits distressing; Oxford groups them. Dictionaries genuinely disagree. |
| `CO2016A-P1-28` | Characteristic of a good programming language | D easy to learn | C portability — both are standard criteria (Sebesta). The card's own explanation concedes "this item is somewhat loose". |
| `CO2016B-P2-34` | HTML is a … | B scripting language | **None of the four is correct** — HTML is a *markup* language, an option not offered. Skeptic: coaching material overwhelmingly keys "scripting language". |
| `CO2016B-P2-71` | Opposite of 'coward' | D brave | C valiant — both are courage synonyms. Skeptic's register argument (valiant describes acts, brave describes people) is the more persuasive of the eight. |

`CO2016B-P2-34` is the odd one out: it is not "two defensible options" but
"zero correct options", which is a stronger claim than the rest of the group.

**Decision:** add `note` caveats to all eight, to a subset, or to none?

---

## Suggested order of work

1. **The ILM2023 official key** (§0) — 12 wrong answers fixed, 123 upgraded to
   authoritative. Biggest correctness win available, and it is not a judgement
   call.
2. **Sweep `Answer_Keys/` against both banks** — this find implies others.
3. **Relaunch the recovery pass** (`tools/RECOVER_BRIEF.md`) and let §3's two
   items ride along.
4. **§4's three answer disputes** — the only items that change what you are
   taught, and the only ones that genuinely need your call.
5. **§1, §2, §5 note/explanation wording** — cosmetic by comparison; batch them.
