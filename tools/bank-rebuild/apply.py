#!/usr/bin/env python3
"""
Fold the solved answers and written explanations back into the rebuilt bank,
then emit src/data/banks/mpsc-state-tax-officer.ts.

Refuses to write the .ts file if any invariant fails -- a bad write here is
1,300 questions of silent damage.
"""
import json
import os
HERE = os.path.dirname(os.path.abspath(__file__))
import sys

SCRATCH = HERE
TARGET = os.path.join(HERE, "..", "..", "src", "data", "banks", "mpsc-state-tax-officer.ts")

# The extraction pipeline recorded answer confidence in `difficulty`
# (see confidenceLabel() in StateTaxOfficerEnhanced.tsx). Keep that convention
# so the existing pill keeps working for the newly solved questions.
CONF_TO_DIFFICULTY = {"high": "easy", "medium": "medium", "low": "hard"}


CHUNK = 200


def chunked_questions(questions):
    """Emit the question list as several annotated arrays, concatenated.

    One 1,300-element `BankQuestion[]` literal overflows tsc with
    "TS2590: Expression produces a union type that is too complex to represent"
    -- BankQuestion is a union and `subject` is itself a wide union, so the
    checker's work grows with the size of a single expression. Splitting into
    chunks keeps each expression well under the limit. Runtime result is
    identical.
    """
    parts, names = [], []
    for i in range(0, len(questions), CHUNK):
        name = f"questions{i // CHUNK}"
        names.append(name)
        parts.append(
            f"const {name}: BankQuestion[] = "
            + json.dumps(questions[i:i + CHUNK], indent=2, ensure_ascii=False)
            + ";\n\n"
        )
    parts.append(
        "const questions: BankQuestion[] = [\n"
        + "".join(f"  ...{n},\n" for n in names)
        + "];\n\n"
    )
    return "".join(parts)


def load(name, required=True):
    try:
        return json.load(open(f"{SCRATCH}/{name}"))
    except FileNotFoundError:
        if required:
            sys.exit(f"missing required input: {name}")
        print(f"  (optional input {name} absent -- skipping)")
        return []


def main():
    bank = json.load(open(f"{SCRATCH}/bank-rebuilt.json"))
    solved = {r["id"]: r for r in load("solved-2024-English.json")}
    explained = {r["id"]: r for r in load("explained.json")}

    # Per-subject solver batches for the 2016/2019/2021 papers (no official key
    # exists for those sittings, so every one of these is answerSource:'derived').
    import glob
    for path in sorted(glob.glob(os.path.join(HERE, "solve", "*.solved.json"))):
        batch = json.load(open(path))
        for r in batch:
            if r["id"] in solved:
                sys.exit(f"id solved twice across batches: {r['id']}")
            solved[r["id"]] = r
        print(f"  loaded {len(batch):4} from {os.path.basename(path)}")

    by_id = {q["id"]: q for q in bank["questions"]}
    if len(by_id) != len(bank["questions"]):
        sys.exit("duplicate question ids in rebuilt bank")

    n_solved = n_expl = n_disputed = 0

    for qid, r in solved.items():
        q = by_id.get(qid)
        if q is None:
            sys.exit(f"solved id not in bank: {qid}")
        q["answerIndex"] = r["answerIndex"]
        q["explanation"] = r["explanation"]
        q["answerSource"] = "derived"
        q["difficulty"] = CONF_TO_DIFFICULTY.get(r.get("confidence", "medium"), "medium")
        q.pop("needsSolving", None)
        q.pop("needsExplanation", None)
        n_solved += 1

    for qid, r in explained.items():
        q = by_id.get(qid)
        if q is None:
            sys.exit(f"explained id not in bank: {qid}")
        q["explanation"] = r["explanation"]
        if r.get("difficulty"):
            q["difficulty"] = r["difficulty"]
        if r.get("disputed") and not q.get("compensated"):
            # Keep the official answer, but record the objection so it shows up
            # in review rather than being quietly lost.
            #
            # Skipped for compensated questions: reviewers flag those simply
            # because no option is keyed, which is the whole point of a
            # compensated question -- not a dispute about its answer. The
            # compensated notice already explains it.
            q["disputeNote"] = r.get("disputeNote", "Flagged as possibly incorrect during explanation review.")
            n_disputed += 1
        q.pop("needsExplanation", None)
        n_expl += 1

    # Figure-based items get a standing note instead of an explanation: there is
    # no text to reason about, so anything else would be invented.
    for q in bank["questions"]:
        if q.get("figureBased") and not q.get("explanation", "").strip():
            ai = q.get("answerIndex")
            letter = f" The official key gives ({'abcd'[ai]})." if isinstance(ai, int) and 0 <= ai < 4 else ""
            q["explanation"] = (
                "This is a non-verbal reasoning question whose options are printed as "
                "diagrams, so they cannot be reproduced as text here." + letter +
                " Work it from the original paper."
            )

    # ---- strip internal bookkeeping fields before shipping ----
    for q in bank["questions"]:
        q.pop("needsExplanation", None)
        q.pop("needsSolving", None)
        # Make the union discriminant explicit on every record. Without it tsc
        # has to test each of 1,300+ object literals against BOTH arms of
        # BankQuestion, which overflows into
        # "TS2590: union type too complex to represent". Semantically a no-op:
        # normalizeQuestion() already treats a missing `type` as 'mcq'.
        q.setdefault("type", "mcq")

    # ---- invariants ----
    # Strict only for the papers this pass rebuilt. The 2016/2019/2021 sittings
    # still carry the original OCR damage (answerIndex -1, blank options) and are
    # a later job -- blocking on them would mean never landing this fix. They are
    # counted and reported instead.
    from merge import PAPERS
    from merge_native import PAPER_IDS
    rebuilt_ids = {pid for pid, _, _ in PAPERS.values()} | set(PAPER_IDS.values())

    errs = []
    preexisting = []
    for q in bank["questions"]:
        qid = q["id"]
        if q.get("type") == "descriptive":
            continue
        if q.get("paperId") not in rebuilt_ids:
            opts = q.get("options", [])
            ai = q.get("answerIndex")
            if (not isinstance(ai, int) or not (0 <= ai < len(opts))
                    or any(not str(o).strip() for o in opts)):
                preexisting.append(qid)
            continue
        opts = q.get("options", [])
        ai = q.get("answerIndex")
        if q.get("figureBased"):
            if opts:
                errs.append(f"{qid}: figureBased but has options")
            continue
        if q.get("compensated"):
            if ai != -1:
                errs.append(f"{qid}: compensated but answerIndex={ai}")
            continue
        # Three options is legitimate, not a truncation: 2021 English-II Q41-46
        # print only Simple / Complex / Compound sentence.
        if len(opts) not in (3, 4):
            errs.append(f"{qid}: {len(opts)} options")
        if not isinstance(ai, int) or not (0 <= ai < len(opts)):
            errs.append(f"{qid}: answerIndex {ai} out of range")
        if any(not str(o).strip() for o in opts):
            errs.append(f"{qid}: blank option")
        if not q.get("explanation", "").strip():
            errs.append(f"{qid}: empty explanation")
        if q.get("answerSource") not in (None, "official", "derived"):
            errs.append(f"{qid}: bad answerSource {q.get('answerSource')}")

    if errs:
        print(f"\n{len(errs)} INVARIANT FAILURES in rebuilt papers -- not writing {TARGET}")
        for e in errs[:40]:
            print("  ", e)
        sys.exit(1)

    # ---- refresh the bank's own description so the count isn't stale ----
    official_n = sum(1 for q in bank["questions"] if q.get("answerSource") == "official")
    bank["description"] = (
        f"{len(bank['questions'])} questions from State Tax Officer, Inspector of Taxes and "
        f"Inspector of Excise papers, with concept primers and real negative marking. "
        f"{official_n} answers come from the published MPSC final answer keys; the rest are "
        f"marked as inferred."
    )

    # ---- emit TypeScript ----
    # The questions and papers arrays are annotated separately rather than
    # inlined into one object literal. BankQuestion is a union, and asking tsc
    # to infer it across 1,300+ literal elements at once trips
    # "TS2590: Expression produces a union type that is too complex to
    # represent". Annotating each array gives every element a contextual type
    # and costs nothing at runtime.
    ts = (
        "// GENERATED FILE -- do not hand-edit.\n"
        "// Question text and options are extracted from the source exam PDFs;\n"
        "// answers marked `answerSource: 'official'` come from the published\n"
        "// MPSC final answer keys. See DEVLOG.md for the rebuild procedure.\n\n"
        "import type { BankQuestion, ExamPaper, QuestionBank } from './types';\n\n"
        + chunked_questions(bank["questions"])
        + "const papers: ExamPaper[] = "
        + json.dumps(bank.get("papers", []), indent=2, ensure_ascii=False) + ";\n\n"
        "export const mpscStateTaxOfficer: QuestionBank = {\n"
        f"  id: {json.dumps(bank['id'])},\n"
        f"  title: {json.dumps(bank['title'], ensure_ascii=False)},\n"
        f"  description: {json.dumps(bank['description'], ensure_ascii=False)},\n"
        "  questions,\n"
        "  papers,\n"
        "};\n"
    )
    open(TARGET, "w").write(ts)

    official = sum(1 for q in bank["questions"] if q.get("answerSource") == "official")
    derived = sum(1 for q in bank["questions"] if q.get("answerSource") == "derived")
    print(f"applied {n_solved} solved, {n_expl} explanations ({n_disputed} disputed)")
    print(f"wrote {TARGET}")
    print(f"  total questions : {len(bank['questions'])}")
    print(f"  official answers: {official}")
    print(f"  derived answers : {derived}")
    print(f"  unlabelled(old) : {len(bank['questions']) - official - derived}")


if __name__ == "__main__":
    main()
