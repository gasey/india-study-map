#!/usr/bin/env python3
"""Import the on-syllabus part of ILM November 2023 CSE Paper III into TECH2.

    python3 tools/system-analyst-build/import_ilm2023_p3.py

WHY ONLY 36 OF 100. This paper was set for the pre-2026 syllabus and most of it
tests subjects the current one does not contain. All 100 questions were
classified leaf-by-leaf against `syllabus.js`; 64 came back off-syllabus in
three clean blocks — software engineering (SDLC, SRS, SQA, cohesion/coupling,
risk, metrics), data communications (topologies, duplex, RIP, OSI, CRC, media),
and systems analysis (fact-finding, DFDs). None of those is a unit of TECH1
(Discrete Maths / Architecture / Data Structures / OS) or TECH2 (OOP / Web /
DBMS / Cloud). The full classification, including the reason recorded against
every excluded question, is kept in `staged/ilm2023-p3/_classified.json` — the
64 are recoverable from there if the syllabus ever widens again.

WHY TECH2 AND NOT TECH1. All 36 land in TECH2: 34 in Unit 3 (Database
Management Systems) and 2 in Unit 2 (Web Technologies — ICANN/domain-name
administration and the HTTP port). Not one maps to TECH1, which is the expected
shape: Paper III is the DBMS/networking paper and TECH1 is maths, architecture,
data structures and OS.

ANSWERS ARE DERIVED, NOT OFFICIAL. MPSC's official key for this sitting covers
`cse_paper_1` and `cse_paper_2` only — Paper III has no key, in the staged file
or anywhere in this repo. Following the convention `import_prog2018_p1.py` set,
each answer comes from TWO independent solvers who did not see each other's
work. **All 36 agreed.** Stored `conf` is the LOWER of the two solvers'
self-ratings, so a question either one hedged on cannot read as certain: 31
high, 5 medium, 0 low.

TRANSCRIPTION PROVENANCE. The source PDF is a pure scan (10-character text
layer), so all nine pages were rendered at 300 dpi and read by eye, one agent
per page. Pages 2 and 5 were then re-read independently and matched line by
line. See `staged/ilm2023-p3/README.md` for what was and was not re-verified.

IDEMPOTENT. questions.js is mutated in place by the scripts in this directory
rather than regenerated, so this script strips any existing ILM2023_P3 records
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
STAGED = HERE / "staged" / "ilm2023-p3-import.json"

SRC_KEY = "ILM2023_P3"
SITTING = "Inspector of Legal Metrology, November 2023 · Paper III"
# Phrased "no official ... key" on purpose. provLine() in app.js badges an
# answer authoritative when the prov mentions an official key WITHOUT a
# preceding no/without/never — word this carelessly and 36 derived answers
# render with the blue "official key" pill, which is the exact inversion of
# the truth this file is trying to record.
PROV = ("Inspector of Legal Metrology, November 2023, Computer Science & Engineering "
        "Paper III (source scan kept at mpsc-cse-papers/"
        "computer-science-engineering-paper-iii.pdf; transcribed from the rendered "
        "page, that PDF has no usable text layer). MPSC's official final answer key "
        "for this sitting covers Papers I and II only and there is no official key "
        "for Paper III, so this answer is derived by two independent solvers who "
        "agreed, and its confidence is the lower of their two self-ratings.")

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
