#!/usr/bin/env python3
"""Import MPSC Programmer (PHE Dept) July 2018 Technical Paper I into System Analyst TECH1.

    python3 tools/system-analyst-build/import_prog2018_p1.py

WHY THIS PAPER BELONGS IN TECH1. The System Analyst Technical Subject Paper I
syllabus (ICT Dept Informatics Officer, 30 July 2026) is Discrete Mathematics /
Computer Architecture / Data Structures & Algorithms / Operating System. The
Programmer 2018 Technical Paper I is 100 questions covering three of those four
units almost exactly — Q1-34 and Q100 data structures, Q35-64 architecture and
digital logic, Q65-99 operating systems. It contributes nothing to Unit 1
(Discrete Mathematics), which the paper simply does not test.

TECH1 already holds 882 drill questions imported from adjacent exams (CSE Paper
I, ILM, MES, JE), so importing another exam's paper directly into TECH1 is the
established convention in this app — unlike the System Manager app, where
authored practice is quarantined into its own paper because a Mock Test draws
from TECH1+TECH2 there.

ANSWERS ARE DERIVED, NOT OFFICIAL. MPSC published no answer key for this
sitting; `pdfs/Answer_Keys/` in the mpsc-question-bank repo has none. Each
answer was produced by TWO independent derivations that did not see each
other's work, then diffed. All 100 agreed. Confidence stored per question is
the LOWER of the two derivations' self-ratings, so a question either solver
hedged on cannot read as certain. Three questions (27, 37, 56) carry a note
naming the specific ambiguity.

IDEMPOTENT. questions.js is mutated in place by the scripts in this directory
rather than regenerated wholesale, so this script strips any existing
PROG2018_P1 records before appending. Re-running it is a no-op on the output.
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
STAGED = HERE / "staged" / "prog2018-p1.json"

SRC_KEY = "PROG2018_P1"
SITTING = ("Programmer under Public Health Engineering Department, July 2018 — "
           "Technical Paper I")
# Says "no official ... key" deliberately: provLine() in app.js badges an answer
# as authoritative when the prov string mentions an official key WITHOUT a
# preceding no/without/never. Phrase this wrongly and 100 derived answers render
# with the blue "official key" pill.
PROV = ("Transcribed from the scanned " + SITTING + " (source PDF kept at "
        "tools/system-analyst-build/sources/programmer-2018-technical-paper-i.pdf). "
        "MPSC published no official answer key for this paper; the answer is "
        "derived by two independent solvers who agreed.")


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(rf"window\.{name}\s*=\s*(.*);\s*", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    # Matches the indentation import_2026_tech1.py established, so the diff of a
    # 1300-record file stays reviewable.
    indent = 2 if name == "SYLLABUS" else 1
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=indent) + ";\n",
                    encoding="utf-8")


def main():
    if not STAGED.is_file():
        sys.exit(f"FAIL: missing {STAGED}")
    staged = json.loads(STAGED.read_text(encoding="utf-8"))

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    tech1 = next(p for p in syllabus["papers"] if p["id"] == "TECH1")
    valid = {u["no"]: set(u["subtopics"]) for u in tech1["units"]}

    if len(staged) != 100:
        sys.exit(f"FAIL: staged file has {len(staged)} questions, expected 100")
    if [r["no"] for r in staged] != list(range(1, 101)):
        sys.exit("FAIL: staged question numbers are not a contiguous 1..100 — "
                 "a question was dropped or duplicated")

    records = []
    for r in staged:
        qid = f"{SRC_KEY}_{r['no']:03d}"
        # A tag naming a unit or subtopic the syllabus does not have would drop
        # the question out of every by-unit view silently, so it fails the build.
        if r["unit"] not in valid:
            sys.exit(f"FAIL {qid}: unit {r['unit']!r} is not a TECH1 unit")
        if r["sub"] not in valid[r["unit"]]:
            sys.exit(f"FAIL {qid}: sub {r['sub']!r} is not a subtopic of unit {r['unit']}")
        if sorted(r["opts"]) != list("ABCD"):
            sys.exit(f"FAIL {qid}: options are {sorted(r['opts'])}, expected A-D")
        if r["ans"] not in r["opts"]:
            sys.exit(f"FAIL {qid}: answer {r['ans']} is not one of the options")
        if r["conf"] not in ("high", "medium", "low"):
            sys.exit(f"FAIL {qid}: conf {r['conf']!r} is not high/medium/low")
        records.append({
            "id": qid,
            "src": "past",
            "sitting": SITTING,
            "srcKey": SRC_KEY,
            "no": r["no"],
            "paper": "TECH1",
            "unit": r["unit"],
            "sub": r["sub"],
            "q": r["q"],
            "opts": r["opts"],
            "ans": r["ans"],
            "exp": r["exp"],
            "conf": r["conf"],
            "prov": PROV,
            "note": r.get("note", ""),
        })

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    before = len(questions)
    kept = [q for q in questions if q.get("srcKey") != SRC_KEY]
    replaced = before - len(kept)

    # Guard against colliding with an unrelated import that already used these
    # ids under a different srcKey — that would silently shadow real questions.
    existing = {q["id"] for q in kept}
    clash = sorted(existing & {r["id"] for r in records})
    if clash:
        sys.exit(f"FAIL: {len(clash)} ids already exist under another srcKey, "
                 f"e.g. {clash[:3]}")

    save_js(QUESTIONS_FILE, "QUESTIONS", kept + records)

    conf_counts = {c: sum(1 for r in records if r["conf"] == c)
                   for c in ("high", "medium", "low")}
    unit_counts = {u: sum(1 for r in records if r["unit"] == u)
                   for u in sorted(valid)}
    print(f"OK  {QUESTIONS_FILE.relative_to(ROOT)}")
    print(f"    {before} -> {len(kept) + len(records)} questions "
          f"({replaced} prior {SRC_KEY} records replaced, {len(records)} written)")
    print(f"    confidence: {conf_counts}")
    print(f"    TECH1 units: {unit_counts}  (unit 1 Discrete Mathematics is "
          f"untouched — this paper tests none)")
    print(f"    {sum(1 for r in records if r['note'])} questions carry an "
          f"ambiguity note")


if __name__ == "__main__":
    main()
