#!/usr/bin/env python3
"""Cross-card consistency checks for the System Analyst bank.

    python3 tools/system-analyst-build/check_bank_consistency.py

WHY THIS EXISTS. DEVLOG 2026-09-03 (end of day) found `TECH1_CSE_195` carrying
an answer this project had already overturned on its duplicate
`MES2015_PAPER1_029`, and closed with: "`apply_audit_corrections.py` should
arguably resolve corrections by *stem* as well as by id, or the build should
fail when two cards share a stem and disagree on the answer. Either would have
caught 195 automatically." This is that check.

It is not hypothetical. The same entry recorded a manual sweep of all 21
duplicate pairs that concluded only 207 and 195 were broken. That sweep missed
two more, because it compared the keyed option's TEXT and the two copies of
MES2015 Q21 both key the string `y=A+B` — under different letters, one of them
wrong, because one copy had dropped an apostrophe and collapsed two options
into one. A machine comparing letters and option lists finds that in a second;
a human comparing answer text does not. Hence: letters AND lists AND order.

THE FIVE CHECKS, and why each is the severity it is.

  ERROR  `ans` is neither a key of `opts` nor the bank's parked-card convention
         (`ans: ""` plus a note saying why). app.js keeps a card out of every
         MCQ view via `q.ans && q.ans.length === 1`, so `ans: ""` is a
         deliberate, supported state — but `ans: "E"` on a four-option card, or
         an empty answer with no explanation, is just broken data.

  ERROR  Two cards share a stem AND substantially share an option list, but key
         DIFFERENT option text, or one is answerable and the other is parked.
         This is the 195 failure: the bank teaches two different answers to one
         question depending on which sitting you happen to practise.

  WARN   Two such cards agree on the keyed text but place it under different
         LETTERS, or list the options in a different order. Both cannot be
         faithful to one printed page, so one copy mis-transcribed the order —
         the 192 failure. Warned rather than errored because it does not
         currently teach a wrong fact, it just means one copy is unfaithful.

  WARN   A card whose key points into a set of DUPLICATED option strings. Note
         carefully that duplicated options are NOT themselves a bug: these are
         decades-old scans and some papers really did print `(a)` twice, and
         transcribing that faithfully is correct. What is a bug is keying one
         of the duplicates, because then the "right" letter is arbitrary and
         the student is marked wrong for picking the identical other one. 193
         was exactly this.

  ERROR  An MCQ whose options were carved out of a DESCRIPTIVE card's stem.
         Checks 2-4 all skip cards with no options, so until 2026-09-05 a
         descriptive card and an MCQ of the same question were never compared
         at all. MES2023_P1_B020 lived in that gap: the printed Section B Q20
         lists five sequences (a)-(e) and asks the candidate to classify each,
         and one import route lifted the five out of the stem, made them
         options A-E and keyed 'A'. Errors rather than warns because the card
         is answerable — it reaches mocks and practice teaching a one-letter
         answer to a five-part question. Detected by requiring BOTH that the
         MCQ's stem is a prefix of the descriptive stem AND that the option
         texts still appear inside it; either alone gives false positives.

WHAT IT DOES NOT FLAG. Cards sharing a stem whose option lists barely overlap
are different questions that happen to be phrased alike — "Identify the
correctly spelled word:" is four distinct authored cards, and an earlier
draft of this script reported all of them plus "Process is" as answer
conflicts. Requiring the option sets to overlap removes that entire class.
Case and whitespace are normalised away everywhere, so `Immunity from noise`
and `immunity from noise` are one string, not a finding.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
QUESTIONS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "questions.js"

# How much of two cards' option lists must coincide before we treat them as the
# same question rather than two questions with a similar stem.
OVERLAP = 0.5


def load(path):
    body = path.read_text(encoding="utf-8").split("=", 1)[1].strip()
    if not body.endswith(";"):
        sys.exit(f"FAIL: {path} does not end in ';' — not the expected window.X = [...] shape")
    return json.loads(body[:-1])


def norm_stem(s):
    """Fold case, punctuation and spacing — for deciding if two STEMS match.

    Aggressive on purpose: the same printed stem gets transcribed with
    different quotes, dashes and trailing periods by different import routes,
    and none of that changes the question.
    """
    return " ".join(re.sub(r"[^a-z0-9]", " ", (s or "").lower()).split())


def norm_opt(s):
    """Fold case and spacing ONLY — for deciding if two OPTIONS match.

    Deliberately NOT norm_stem. Options in this bank are frequently Boolean or
    algebraic, where the punctuation IS the content: `y=A+B`, `y=A'B` and
    `y=A'+B` are three different answers that collapse to one string the moment
    you strip `'`, `+` and `=`. The first version of this script used the
    aggressive fold for both and reported 33 cards as having a key pointing
    into duplicated options; almost all of them were this artifact, and it
    would have sent someone to "fix" three perfectly good distinct options.
    Whitespace still folds, because `y = A + B` and `y=A+B` are one option.
    """
    return re.sub(r"\s+", "", (s or "")).lower()


def norm_opt_strict(s):
    """Fold whitespace only — for comparing two options WITHIN one card.

    Case must survive here. `GEN-31` asks which sentence is correctly
    punctuated and its options (a) and (b) differ by exactly one capital
    letter, `submit` vs `Submit`; case-folding declares the card broken when
    the capital IS the answer. Across two cards the opposite is true — one
    import route lowercased a whole paper — so the looser fold is right there
    and this one is right here.
    """
    return re.sub(r"\s+", "", (s or ""))


def main():
    questions = load(QUESTIONS_FILE)
    errors, warnings = [], []

    # ---- check 1: the answer field itself -----------------------------------
    for q in questions:
        opts = q.get("opts") or {}
        if not opts:
            continue                      # descriptive cards carry no options
        ans = q.get("ans")
        if ans in opts:
            continue
        if ans == "" and (q.get("note") or "").strip():
            continue                      # parked-card convention, documented
        if ans == "":
            errors.append(f"{q['id']}: ans is \"\" but the card has no note saying why — "
                          f"an empty answer with no reason reads as missing data")
        else:
            errors.append(f"{q['id']}: ans {ans!r} is not one of {sorted(opts)}")

    # ---- check 2: key pointing into duplicated option text ------------------
    for q in questions:
        opts = q.get("opts") or {}
        if not opts or q.get("ans") not in opts:
            continue
        buckets = defaultdict(list)
        for k, v in opts.items():
            buckets[norm_opt_strict(v)].append(k)
        twins = buckets[norm_opt_strict(opts[q["ans"]])]
        if len(twins) > 1:
            warnings.append(f"{q['id']}: key ({q['ans']}) points into duplicated option text — "
                            f"options {sorted(twins)} are the same string, so the key is "
                            f"arbitrary between them: {opts[q['ans']]!r}")

    # ---- checks 3 & 4: cards that are the same question ---------------------
    groups = defaultdict(list)
    for q in questions:
        if q.get("q") and (q.get("opts") or {}):
            groups[norm_stem(q["q"])].append(q)

    pairs = 0
    for stem, cards in sorted(groups.items()):
        if len(cards) < 2:
            continue
        for i in range(len(cards)):
            for j in range(i + 1, len(cards)):
                a, b = cards[i], cards[j]
                sa = {norm_opt(v) for v in a["opts"].values()}
                sb = {norm_opt(v) for v in b["opts"].values()}
                if not sa or not sb:
                    continue
                if len(sa & sb) / max(len(sa), len(sb)) < OVERLAP:
                    continue              # different question, similar stem
                pairs += 1
                ka, kb = a.get("ans"), b.get("ans")
                ta = norm_opt(a["opts"].get(ka, "")) if ka in a["opts"] else None
                tb = norm_opt(b["opts"].get(kb, "")) if kb in b["opts"] else None

                if (ta is None) != (tb is None):
                    live, parked = (a, b) if tb is None else (b, a)
                    errors.append(
                        f"{a['id']} / {b['id']}: same question, but {live['id']} keys "
                        f"({live['ans']}) while {parked['id']} is parked as unanswerable — "
                        f"the bank teaches two different things depending on the sitting")
                elif ta is not None and ta != tb and ka != kb:
                    errors.append(
                        f"{a['id']} / {b['id']}: same question, DIFFERENT answers — "
                        f"{a['id']} ({ka}) {a['opts'][ka]!r} vs {b['id']} ({kb}) {b['opts'][kb]!r}")
                elif ta is not None and ta != tb:
                    # Same letter, differently worded option. Two import routes
                    # transcribing one printed page loosely ("All of these" vs
                    # "All of the mentioned"); they still teach the same thing,
                    # so this is a fidelity nit, not a contradiction.
                    warnings.append(
                        f"{a['id']} / {b['id']}: both key ({ka}) but its text differs — "
                        f"{a['opts'][ka]!r} vs {b['opts'][kb]!r}")
                elif ka != kb:
                    warnings.append(
                        f"{a['id']} / {b['id']}: same answer text under different letters "
                        f"({ka} vs {kb}) — one copy mis-transcribed the option order")
                else:
                    order_a = [norm_opt(a["opts"][k]) for k in sorted(a["opts"])]
                    order_b = [norm_opt(b["opts"][k]) for k in sorted(b["opts"])]
                    if order_a == order_b:
                        continue
                    # Distinguish the two ways the lists can differ, because the
                    # fixes are different: a permutation means one copy renumbered
                    # the printed options (serious — the letters are the answer),
                    # while differing strings mean one copy transcribed some
                    # option loosely (a fidelity nit).
                    if sorted(order_a) == sorted(order_b):
                        warnings.append(
                            f"{a['id']} / {b['id']}: identical option set in a DIFFERENT "
                            f"ORDER — one copy renumbered what the paper printed")
                    else:
                        only_a = [x for x in order_a if x not in order_b]
                        only_b = [x for x in order_b if x not in order_a]
                        warnings.append(
                            f"{a['id']} / {b['id']}: same question and key, but option text "
                            f"differs — only in {a['id']}: {only_a}; only in {b['id']}: {only_b}")

    # ---- check 5: an MCQ whose options were carved out of a descriptive stem --
    #
    # Checks 3 and 4 only group cards that HAVE options, so a descriptive card and
    # an MCQ card of the same question were never compared. That is how
    # MES2023_P1_B020 survived: the source is a 5-mark Section B question listing
    # five sequences (a)-(e) to classify, and one import route lifted those five
    # out of the stem, made them options A-E and keyed one of them. The stems are
    # not equal — the descriptive copy still carries the list, the MCQ copy does
    # not — so equality on norm_stem finds nothing either.
    #
    # The signature that IS reliable: the MCQ's stem is a prefix of the
    # descriptive card's stem, and the MCQ's option texts are still sitting inside
    # that stem. Both conditions together mean the options came OUT of this
    # question rather than being a coincidence of phrasing.
    descriptive = [q for q in questions
                   if q.get("q") and not (q.get("opts") or {})]
    mcq = [q for q in questions if q.get("q") and (q.get("opts") or {})]
    for d in descriptive:
        ds = norm_stem(d["q"])
        if not ds:
            continue
        dflat = re.sub(r"\s+", "", ds)
        for m in mcq:
            ms = norm_stem(m["q"])
            # Require a substantial prefix: a short stem like "process is" is a
            # prefix of plenty of unrelated questions.
            if len(ms) < 25 or not ds.startswith(ms):
                continue
            texts = [norm_opt(v) for v in m["opts"].values()]
            inside = sum(1 for t in texts if t and re.sub(r"[^a-z0-9]", "", t.lower()) in
                         re.sub(r"[^a-z0-9]", "", dflat))
            if inside < max(2, len(texts) - 1):
                continue
            errors.append(
                f"{m['id']} / {d['id']}: {m['id']} is an MCQ whose options were carved out "
                f"of {d['id']}'s stem ({inside}/{len(texts)} option texts still appear in it). "
                f"The printed question asks the candidate to work through all of them, so "
                f"keying one letter ({m.get('ans')!r}) teaches a wrong answer — "
                f"{m['id']} is a mangled duplicate, not a second question")

    print(f"{len(questions)} cards, {pairs} same-question pair(s) compared")
    if warnings:
        print(f"\n{len(warnings)} WARNING(S):")
        for w in warnings:
            print(f"  ! {w}")
    if errors:
        print(f"\n{len(errors)} ERROR(S):")
        for e in errors:
            print(f"  x {e}")
        sys.exit(1)
    print("\nno cross-card contradictions")


if __name__ == "__main__":
    main()
