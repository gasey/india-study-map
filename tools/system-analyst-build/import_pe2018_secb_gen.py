#!/usr/bin/env python3
"""Import 24 AUTHORED practice MCQs covering P&E Aug 2018 Paper III Section B topics.

    python3 tools/system-analyst-build/import_pe2018_secb_gen.py

WHAT THESE ARE, AND WHAT THEY ARE NOT. MPSC never asked these questions. They
are authored practice MCQs (`src: 'generated'`), written to make the on-syllabus
part of that paper's Section B drillable in MCQ form. The Section B originals
are untouched and are NOT imported by this script.

WHY NOT JUST CONVERT SECTION B INTO MCQs. Because that is a known defect in this
bank, not a shortcut. Section B is 20 open-ended 5-mark prompts — "Explain
locking techniques for concurrency control", "What are the disadvantages of
database system?" — and none has a single correct letter. On 2026-09-05 the card
`MES2023_P1_B020` was REMOVED for exactly this: an import route lifted a
five-part exercise's parts into options A-E, keyed it 'A', and left a truncated
stem, so a five-part question taught a one-letter answer. These 24 are instead
standalone questions on the concepts each prompt examines, each with one
defensible answer.

They cannot masquerade as past-paper questions, and that is enforced by the app
rather than by convention: Past Papers groups only `src === 'past'` (app.js
~1229), and any non-past record renders a "practice" pill instead of a sitting
name (~2196).

SCOPE: 8 OF 20 SECTION B QUESTIONS. Only Q1-Q8 are on the 2026 syllabus (all
TECH2 Unit 3 DBMS). Q9-Q14 are data communications and Q15-Q20 software
engineering, both dropped by the 2026 syllabus. Q19 ("What is the importance of
data dictionary?") is excluded as a judgement call, read as the
systems-analysis artefact given that Q15-Q20 are all software engineering
rather than as the DBMS system catalogue; if that reading is ever revised it is
a ninth topic. Reasoning is recorded in `staged/pe2018-secb-gen/_input.json`.

3 MCQs per source topic = 24. Answer letters spread A6/B6/C7/D5.

HOW THEY WERE CHECKED, AND WHY THAT MATTERS MORE HERE THAN ANYWHERE ELSE. A
past-paper import can at least be compared against the printed paper. Authored
content has NO source of truth at all: if the author is wrong, nothing else in
the pipeline disagrees. So the 24 went to **two adversarial reviewers working
blind**, each told to try to refute every item — wrong key, a second defensible
option, an underspecified stem, an accidentally-true distractor, an explanation
contradicting its own key — and to default to flagging when unsure.

Both flagged the same single item and nothing else, and neither found a wrong
key anywhere: `GEN-PE2018-SB-007`, where "attribute as a function" is
text-dependent (Elmasri & Navathe give A : E -> P(V), the keyed option; Chen
1976 and Silberschatz give A : E -> V, which is option B). A third reviewer then
caught that the first stem fix had left the *explanation* calling E -> P(V) "the
standard formalisation" unattributed and option B "the tempting simplification"
— which would have taught a Silberschatz reader that their own textbook was
wrong. Stem and explanation were both rewritten; the options were never touched
and the keyed letter never changed.

THE REVIEW IS A BUILD DEPENDENCY, NOT A NOTE. This script refuses to import
while any reviewer flag lacks a recorded `reviewFix` on the question it flagged.
An adversarial pass whose findings can be ignored silently is theatre, so it is
wired in: delete the review files and the import fails; add a flag without
resolving it and the import fails.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DATA = ROOT / "public" / "mpsc-system-analyst" / "data"
QUESTIONS_FILE = DATA / "questions.js"
SYLLABUS_FILE = DATA / "syllabus.js"
STAGED_DIR = HERE / "staged" / "pe2018-secb-gen"
ALL_FILE = STAGED_DIR / "_all.json"
REVIEWS = ("review-1.json", "review-2.json")

SRC_KEY = "GEN-PE2018-SB"
# Shows only as a label in the sitting filter dropdown, where authored banks
# sort after real past papers. Names the paper for traceability while saying
# "Authored practice" first so it cannot be misread as a printed sitting.
SITTING = "Authored practice — P&E Aug 2018 Paper III, Section B topics"
# Deliberately contains "no official" and never a bare "official": provLine()
# badges an answer authoritative when the prov says "official" WITHOUT a
# preceding no/without/never. These are authored, so an authoritative badge
# would be the exact inversion of the truth.
PROV = ("Authored practice question — MPSC did not ask this. Written to cover a "
        "topic from Section B of the Junior Grade M.E.S. (P&E Dept) August 2018 "
        "Computer Science & Engineering Paper III, whose own Section B question is "
        "an open-ended 5-mark short-answer prompt with no single-letter answer and "
        "no official key. This MCQ was authored against the 2026 syllabus leaf "
        "shown above and then checked by two independent adversarial reviewers who "
        "each tried to refute it.")
NOTE = ("Authored practice question, not an MPSC exam question. It covers a topic "
        "that the August 2018 Paper III examined as an open-ended 5-mark Section B "
        "prompt; that original is short-answer and is not in the bank as an MCQ.")

EXPECTED = 24
VALID_UNIT = ("TECH2", "3")


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(rf"window\.{name}\s*=\s*(.*);\s*", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    indent = 2 if name == "SYLLABUS" else 1
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=indent) + ";\n",
                    encoding="utf-8")


def main():
    if not ALL_FILE.is_file():
        sys.exit(f"FAIL: missing {ALL_FILE}")
    staged = json.loads(ALL_FILE.read_text(encoding="utf-8"))
    by_id = {r["id"]: r for r in staged}

    if len(staged) != EXPECTED:
        sys.exit(f"FAIL: staged file has {len(staged)} questions, expected {EXPECTED}")

    # --- the adversarial review, enforced ---------------------------------
    flagged = {}
    for name in REVIEWS:
        path = STAGED_DIR / name
        if not path.is_file():
            sys.exit(f"FAIL: missing {path}. These questions are authored, so there "
                     f"is no printed paper to check them against — the two blind "
                     f"adversarial reviews are the only correctness evidence that "
                     f"exists, and importing without them is importing unchecked "
                     f"answers into someone's exam prep.")
        review = json.loads(path.read_text(encoding="utf-8"))
        if {r["id"] for r in review} != set(by_id):
            sys.exit(f"FAIL: {name} does not cover exactly the 24 staged questions")
        for r in review:
            if r.get("verdict") == "flag" or r.get("keyCorrect") is False:
                flagged.setdefault(r["id"], []).append(name)

    unresolved = sorted(i for i in flagged if not by_id[i].get("reviewFix"))
    if unresolved:
        sys.exit(f"FAIL: {len(unresolved)} question(s) were flagged by a reviewer and "
                 f"carry no `reviewFix` recording what was done about it: "
                 f"{unresolved}. Resolve the flag (fix the question, or record why "
                 f"the flag was rejected) before importing.")

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    valid = {p["id"]: {u["no"]: set(u["subtopics"]) for u in p["units"]}
             for p in syllabus["papers"]}
    paper, unit = VALID_UNIT

    records, letters = [], {}
    for n, r in enumerate(staged, 1):
        qid = r["id"]
        # A `sub` the syllabus does not have drops the question out of every
        # by-unit view silently, and `sub` is matched by exact string equality
        # against the concept guide, so a paraphrase links to nothing.
        if r["sub"] not in valid[paper][unit]:
            sys.exit(f"FAIL {qid}: sub {r['sub']!r} is not a subtopic of "
                     f"{paper} unit {unit}")
        if sorted(r["opts"]) != list("ABCD"):
            sys.exit(f"FAIL {qid}: options are {sorted(r['opts'])}, expected A-D")
        if r["ans"] not in r["opts"]:
            sys.exit(f"FAIL {qid}: answer {r['ans']} is not one of the options")
        if len({v.strip().lower() for v in r["opts"].values()}) != 4:
            sys.exit(f"FAIL {qid}: two options have the same text, so the key is "
                     f"arbitrary between them")
        # Authored content has no excuse for a hedge: GENERATE_BRIEF rule says a
        # sub-high confidence means the question is badly framed and should be
        # rewritten rather than shipped.
        if r.get("conf") != "high":
            sys.exit(f"FAIL {qid}: conf is {r.get('conf')!r}. Authored questions "
                     f"must be 'high' — rewrite the question instead of hedging.")
        # "All/none of the above" makes a generated set teachable by elimination.
        for k, v in r["opts"].items():
            if re.search(r"\b(all|none) of the (above|these)\b", v, re.I):
                sys.exit(f"FAIL {qid}: option {k} is an all/none-of-the-above")
        letters[r["ans"]] = letters.get(r["ans"], 0) + 1
        records.append({
            "id": qid,
            "src": "generated",
            "sitting": SITTING,
            "srcKey": SRC_KEY,
            "no": n,
            "paper": paper,
            "unit": unit,
            "sub": r["sub"],
            "q": r["q"],
            "opts": r["opts"],
            "ans": r["ans"],
            "exp": r["exp"],
            "conf": r["conf"],
            "prov": PROV,
            "note": NOTE,
        })

    # A generated set where one letter dominates teaches pattern-matching
    # instead of content. 24 questions over 4 letters is 6 each; allow slack
    # but not a runaway.
    worst = max(letters.values())
    if worst > EXPECTED // 2:
        sys.exit(f"FAIL: answer letters are skewed ({letters}) — one letter holds "
                 f"{worst} of {EXPECTED}")

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    before = len(questions)
    kept = [q for q in questions if q.get("srcKey") != SRC_KEY]
    replaced = before - len(kept)

    clash = sorted({q["id"] for q in kept} & {r["id"] for r in records})
    if clash:
        sys.exit(f"FAIL: {len(clash)} ids already exist under another srcKey, "
                 f"e.g. {clash[:3]}")

    # An authored question duplicating one already in the bank is wasted study
    # time at best, and at worst two cards teaching different answers to the
    # same question.
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    existing_stems = {norm(q["q"]): q["id"] for q in kept}
    dupes = [(r["id"], existing_stems[norm(r["q"])]) for r in records
             if norm(r["q"]) in existing_stems]
    if dupes:
        sys.exit(f"FAIL: {len(dupes)} authored question(s) duplicate a stem already "
                 f"in the bank: {dupes[:3]}")

    save_js(QUESTIONS_FILE, "QUESTIONS", kept + records)

    per_topic = {}
    for r in staged:
        per_topic[r["sectionBNo"]] = per_topic.get(r["sectionBNo"], 0) + 1

    print(f"{SITTING}")
    print(f"  {len(records)} authored practice MCQs imported (src=generated, NOT past)")
    print(f"  reviewed: 2 blind adversarial passes; "
          f"{len(flagged)} flagged and resolved ({sorted(flagged) or 'none'})")
    print(f"  per Section B topic: {dict(sorted(per_topic.items()))}")
    print(f"  answer letters: {dict(sorted(letters.items()))}")
    print(f"  placed: {paper} U{unit} — "
          f"{len({r['sub'] for r in records})} syllabus leaf/leaves")
    print(f"  bank {before} -> {len(kept) + len(records)}"
          + (f", replaced {replaced} existing {SRC_KEY} record(s)" if replaced else ""))


if __name__ == "__main__":
    main()
