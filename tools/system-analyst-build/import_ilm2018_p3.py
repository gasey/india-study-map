#!/usr/bin/env python3
"""Import the on-syllabus part of ILM December 2018 CSE Paper III into TECH2.

    python3 tools/system-analyst-build/import_ilm2018_p3.py

WHY ONLY 36 OF 100. Like November 2023, this paper was set for the pre-2026
syllabus and most of it tests subjects the current one does not contain. All
100 questions were classified leaf-by-leaf against `syllabus.js`; 64 came back
off-syllabus in two clean blocks — data communications and the OSI model
(Q36-Q70: layering, transmission media, multiplexing, error detection, TCP/FTP/
SMTP) and software engineering (Q71-Q100: process models, SRS, coupling, LOC
estimation, design metrics, SQA). Neither is a unit of TECH1 (Discrete Maths /
Architecture / Data Structures / OS) or TECH2 (OOP / Web / DBMS / Cloud). The
full classification, including the reason recorded against every excluded
question, is kept in `staged/ilm2018-p3/_classified.json` — the 64 are
recoverable from there if the syllabus ever widens again.

WHY TECH2 AND NOT TECH1. All 36 land in TECH2: 35 in Unit 3 (Database
Management Systems) and 1 in Unit 4 (the definition of a distributed system).
Not one maps to TECH1. The 35 are a near-contiguous run, Q1-Q35 — this paper
opens with a long DBMS block and then leaves the syllabus entirely.

ANSWERS ARE DERIVED, NOT OFFICIAL. No Paper III from any sitting has an
official MPSC key. Following the convention `import_prog2018_p1.py` set, each
answer comes from TWO independent solvers who did not see each other's work.
**All 36 agreed.** Stored `conf` is the LOWER of the two solvers' self-ratings,
so a question either one hedged on cannot read as certain: 34 high, 2 medium,
0 low. The two mediums are Q11 (ROLLBACK vs. Oracle FLASHBACK for "undo the
work of transaction after last commit") and Q32 (both the tree/graph-based
protocol and timestamp ordering are conflict-serializable and deadlock-free, so
the question is not cleanly single-answer as printed).

TRANSCRIPTION PROVENANCE. Unlike November 2023 — a pure scan that had to be
read from rendered images — this PDF has a clean text layer, so the paper was
transcribed from `pdftotext -layout` output by five agents, one per 20-question
slice. `-layout` preserves the printed two-column option arrangement, so the
live risk was silent option permutation rather than dropped text; option order
was checked against the source, including against the rendered page-4 image for
the block where the two columns nearly collide.

The paper contains genuine misprints that are preserved rather than repaired:
Q19 prints "Langauge" twice, Q31's SQL prints `courseid`/`deptname`/`totcred`
with the underscores missing, Q63 prints "syatem", Q67 "trasnport". The Q31 case
was checked against the rendered page because it looks exactly like extractor
damage — it is not, the paper really is printed that way. See
`staged/ilm2018-p3/README.md`.

IDEMPOTENT. questions.js is mutated in place by the scripts in this directory
rather than regenerated, so this script strips any existing ILM2018_P3 records
before appending. Re-running is a no-op on the output.
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
STAGED = HERE / "staged" / "ilm2018-p3-import.json"

SRC_KEY = "ILM2018_P3"
SITTING = "Inspector of Legal Metrology, December 2018 · Paper III"
# Phrased "no official ... key" on purpose. provLine() in app.js badges an
# answer authoritative when the prov mentions an official key WITHOUT a
# preceding no/without/never — word this carelessly and 36 derived answers
# render with the blue "official key" pill, which is the exact inversion of
# the truth this file is trying to record.
PROV = ("Inspector of Legal Metrology, December 2018, Computer Science & Engineering "
        "Paper III (source scan kept at mpsc-cse-papers/"
        "computer-scienceengg-paper-iii.pdf; transcribed from that PDF's text "
        "layer and checked against the rendered page). There is no official MPSC "
        "answer key for Paper III from any sitting, so this answer is derived by "
        "two independent solvers who agreed, and its confidence is the lower of "
        "their two self-ratings.")

EXPECTED = 36


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
    if not STAGED.is_file():
        sys.exit(f"FAIL: missing {STAGED}")
    staged = json.loads(STAGED.read_text(encoding="utf-8"))

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    valid = {p["id"]: {u["no"]: set(u["subtopics"]) for u in p["units"]}
             for p in syllabus["papers"]}

    if len(staged) != EXPECTED:
        sys.exit(f"FAIL: staged file has {len(staged)} questions, expected {EXPECTED}")

    # The numbers are deliberately NOT contiguous here — they are the surviving
    # subset of 1..100 — so the contiguity check prog2018 uses would be wrong.
    # Check instead that they are a strictly increasing subset of the paper.
    nos = [r["no"] for r in staged]
    if nos != sorted(set(nos)) or not (1 <= nos[0] and nos[-1] <= 100):
        sys.exit("FAIL: staged question numbers are not a strictly increasing "
                 "subset of 1..100 — a question was duplicated or misnumbered")

    records = []
    for r in staged:
        qid = f"{SRC_KEY}_{r['no']:03d}"
        paper = r["paper"]
        # A tag naming a unit or subtopic the syllabus does not have would drop
        # the question out of every by-unit view silently, so it fails the build.
        if paper not in valid:
            sys.exit(f"FAIL {qid}: paper {paper!r} is not in syllabus.js")
        if r["unit"] not in valid[paper]:
            sys.exit(f"FAIL {qid}: unit {r['unit']!r} is not a {paper} unit")
        if r["sub"] not in valid[paper][r["unit"]]:
            sys.exit(f"FAIL {qid}: sub {r['sub']!r} is not a subtopic of "
                     f"{paper} unit {r['unit']}")
        if sorted(r["opts"]) != list("ABCD"):
            sys.exit(f"FAIL {qid}: options are {sorted(r['opts'])}, expected A-D")
        if r["ans"] not in r["opts"]:
            sys.exit(f"FAIL {qid}: answer {r['ans']} is not one of the options")
        if r["conf"] not in ("high", "medium", "low"):
            sys.exit(f"FAIL {qid}: conf {r['conf']!r} is not high/medium/low")
        # An option whose text is just its own letter is what a stripped option
        # layer looks like; the mechanical key/non-empty/distinct checks all pass
        # on {"A":"A","B":"B","C":"C","D":"D"}. Q30 legitimately has single-letter
        # options (it asks which attribute of R(A,B,C,D,E) is not a key), so this
        # fails only when EVERY option is its own key.
        if all(str(r["opts"][k]).strip() == k for k in "ABCD"):
            sys.exit(f"FAIL {qid}: every option is just its own letter — the "
                     f"option text was lost before import")
        records.append({
            "id": qid,
            "src": "past",
            "sitting": SITTING,
            "srcKey": SRC_KEY,
            "no": r["no"],
            "paper": paper,
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

    existing = {q["id"] for q in kept}
    clash = sorted(existing & {r["id"] for r in records})
    if clash:
        sys.exit(f"FAIL: {len(clash)} ids already exist under another srcKey, "
                 f"e.g. {clash[:3]}")

    save_js(QUESTIONS_FILE, "QUESTIONS", kept + records)

    conf_counts = {c: sum(1 for r in records if r["conf"] == c)
                   for c in ("high", "medium", "low")}
    where = {}
    for r in records:
        where[f"{r['paper']} U{r['unit']}"] = where.get(f"{r['paper']} U{r['unit']}", 0) + 1

    print(f"{SITTING}")
    print(f"  {len(records)} of 100 questions imported (the rest are off the 2026 syllabus)")
    print(f"  placed: {where}")
    print(f"  confidence: {conf_counts}  (all derived — no official key for Paper III)")
    print(f"  bank {before} -> {len(kept) + len(records)}"
          + (f", replaced {replaced} existing {SRC_KEY} record(s)" if replaced else ""))


if __name__ == "__main__":
    main()
