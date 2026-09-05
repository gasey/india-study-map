#!/usr/bin/env python3
"""Import the on-syllabus part of MES P&E August 2018 CSE Paper III into TECH2.

    python3 tools/system-analyst-build/import_pe2018_p3.py

THIS PAPER HAS A DIFFERENT SHAPE FROM THE FIRST TWO PAPER IIIs. ILM Nov 2023
and ILM Dec 2018 are 100 MCQs each, full stop. This one is split: Section A is
50 MCQs at 2 marks, Section B is 20 short-answer questions at 5 marks. Only
Section A is imported here.

SECTION B IS DEFERRED, NOT DROPPED. Decided with the user on 2026-09-05 and
recorded in `staged/pe2018-p3/README.md` and DEVLOG, so it stays a known gap
rather than becoming a silent omission — this bank has already had one of
those (the OCR extractor that lost ~280 questions with no numbering gap to
reveal it). Section B is not off-syllabus filler: several of its questions are
core TECH2 Unit 3 (views and SQL updates, account- vs relation-level
privileges, locking for concurrency control). It is deferred because a
descriptive question needs an AUTHORED MODEL ANSWER, not a chosen letter, with
no key to check that answer against, and `SOLVE_BRIEF.md` is written for MCQs
and does not cover it. 60 such questions exist across the three remaining
papers, so the brief is worth writing once.

WHY ONLY 20 OF 50. The paper was set for the pre-2026 syllabus. All 50 Section
A questions were classified leaf-by-leaf against `syllabus.js` and 30 came back
off-syllabus in two clean blocks: data communications and networking (Q20-Q35 —
OSI encapsulation, duplex modes, transmission media, TCP/UDP/SMTP internals,
topology, multiplexing, optical fibre) and software engineering (Q36-Q48 and
Q50 — process models, the SDLC, testing, configuration management, the ethics
code). Neither subject is a unit of TECH1 (Discrete Maths / Architecture / Data
Structures / OS) or TECH2 (OOP / Web / DBMS / Cloud); the 2026 syllabus dropped
both outright. The reason recorded against every excluded question is in
`staged/pe2018-p3/_classified.json`, so the 30 are recoverable if the syllabus
ever widens.

The surviving set is Q1-Q19 plus Q49 — not a prefix. Q49 ("construction of
object-oriented software begins with the creation of") sits inside the
software-engineering block but is genuinely TECH2 Unit 1 OOP, and Q48 and Q50
on either side of it are not. Worth stating because "the classifier just took
the opening run" would be a reasonable suspicion given the shape of the first
two papers, and here it demonstrably did not.

WHERE THEY LAND. All 20 in TECH2: 19 in Unit 3 (Database Management Systems)
and 1 in Unit 1 (OOP, Q49). Not one maps to TECH1 — the expected shape, since
Paper III is the DBMS/networking paper.

ANSWERS ARE DERIVED, NOT OFFICIAL. No Paper III from any sitting has an
official MPSC key. Two solvers worked these 20 without seeing each other's
output and **all 20 agreed**; `conf` is the LOWER of their two self-ratings
(17 high, 2 medium, 1 low), applied by `merge_solves.py` rather than by hand.

The one `low` is Q17 ("Which forms are based on the concept of functional
dependency: 1NF/2NF/3NF/4NF"), which has no unique answer as printed — 3NF
removes transitive functional dependencies and 2NF partial ones, so both fit
the stem. It is keyed (c) as the conventional textbook identification and the
note says (b) is equally defensible. The two mediums are Q16 (the stem
over-generalises: a composite key is required of a many-to-many associative
table but not of the many side of a plain one-to-many) and Q49 (the solvers
split high/medium on self-rating, not on the answer).

TRANSCRIPTION PROVENANCE. This PDF has a clean text layer, so Section A was
transcribed from `pdftotext -layout` output in three slices. `-layout`
preserves the printed two-column option arrangement, so the live risk is
silent option permutation rather than dropped text: read `(a) (b)` / `(c) (d)`
in the wrong order and the stored answer letter now points at a different
option. **Both solvers independently re-derived all 20 option orders from the
source PDF and both reported zero permutations** — which is a stronger check
than the transcription spot-check alone, because neither solver was told what
the other found.

Q5's option (b) is printed "Indivisbile" in the paper; the misspelling is
carried through rather than repaired, and it is the keyed answer. Q11's stem
prints curly quotes around ”Comp Sci”, which is what the paper shows and is the
point of the question rather than extractor damage.

IDEMPOTENT. questions.js is mutated in place by the scripts in this directory
rather than regenerated, so this script strips any existing PE2018_P3 records
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
STAGED = HERE / "staged" / "pe2018-p3-import.json"

SRC_KEY = "PE2018_P3"
# MUST match the string Paper II from this same sitting already uses
# ("Jr. Grade of M.E.S. (P&E Dept), August 2018 · Paper II"). The sitting name
# is the grouping key for the By Year / By Paper views, so a prettier-but-
# different spelling of the same exam splits one sitting into two that each
# look complete. The first cut of this file wrote "Junior Grade, Mizoram
# Engineering Service (Power & Electricity), August 2018 · Paper III" and the
# Past Papers list duly showed the August 2018 sitting twice under two names.
SITTING = "Jr. Grade of M.E.S. (P&E Dept), August 2018 · Paper III"
# Phrased "no official ... key" on purpose. provLine() in app.js badges an
# answer authoritative when the prov mentions an official key WITHOUT a
# preceding no/without/never — word this carelessly and 20 derived answers
# render with the blue "official key" pill, which is the exact inversion of
# the truth this file is trying to record.
PROV = ("Junior Grade, Mizoram Engineering Service under the Power & Electricity "
        "Department, August 2018, Computer Science & Engineering Paper III, "
        "Section A (source PDF kept at mpsc-cse-papers/"
        "computer-scienceengg-paper-iii-pe.pdf; transcribed from that PDF's text "
        "layer, with option order re-derived from the source independently by "
        "both solvers). There is no official MPSC answer key for Paper III from "
        "any sitting, so this answer is derived by two independent solvers who "
        "agreed, and its confidence is the lower of their two self-ratings.")

EXPECTED = 20
PAPER_LEN = 50


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
        sys.exit(f"FAIL: missing {STAGED} — run merge_solves.py first")
    staged = json.loads(STAGED.read_text(encoding="utf-8"))

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    valid = {p["id"]: {u["no"]: set(u["subtopics"]) for u in p["units"]}
             for p in syllabus["papers"]}

    if len(staged) != EXPECTED:
        sys.exit(f"FAIL: staged file has {len(staged)} questions, expected {EXPECTED}")

    # Deliberately NOT contiguous — this is the surviving subset of 1..50 (in
    # fact Q1-Q19 plus Q49), so a contiguity check would be wrong here. Check
    # instead that the numbers are a strictly increasing subset of the paper.
    nos = [r["no"] for r in staged]
    if nos != sorted(set(nos)) or not (1 <= nos[0] and nos[-1] <= PAPER_LEN):
        sys.exit(f"FAIL: staged question numbers are not a strictly increasing "
                 f"subset of 1..{PAPER_LEN} — a question was duplicated or misnumbered")

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
        # layer looks like, and the key/non-empty/distinct checks all pass on
        # {"A":"A","B":"B","C":"C","D":"D"}. Fails only when EVERY option is its
        # own key, so a question that legitimately has single-letter options
        # (ILM Dec 2018's Q30 asks which attribute of R(A,B,C,D,E) is not a key)
        # still imports.
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

    # The static app finds the "N of M imported" line with an anchored
    # /^Only the / test across the sitting's questions. If per-question note
    # text were prepended to EVERY record, no record would match and the card
    # would show a bare "20 MCQ" that reads as the paper's full length — the
    # exact defect fixed on 2026-09-05 for the two ILM Paper III cards.
    if not any(r["note"].startswith("Only the ") for r in records):
        sys.exit("FAIL: no record's note starts with 'Only the ', so the sitting "
                 "card would silently omit the '20 of 50' coverage line")

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    before = len(questions)
    kept = [q for q in questions if q.get("srcKey") != SRC_KEY]
    replaced = before - len(kept)

    existing = {q["id"] for q in kept}
    clash = sorted(existing & {r["id"] for r in records})
    if clash:
        sys.exit(f"FAIL: {len(clash)} ids already exist under another srcKey, "
                 f"e.g. {clash[:3]}")

    # The sitting name is the grouping key for By Year / By Paper, so a Paper III
    # that spells its sitting differently from the Paper I/II already in the bank
    # splits one exam into two cards that each look complete. That is what this
    # file did on its first run. Every remaining Paper III has sibling papers in
    # the bank, so the sitting prefix must already be present; if it is not, the
    # candidates sharing this month and year are almost certainly the intended
    # spelling.
    prefix = SITTING.split(" · ")[0]
    known = {q["sitting"].split(" · ")[0] for q in kept if q.get("sitting")}
    if prefix not in known:
        month_year = re.search(r"([A-Z][a-z]+ \d{4})", SITTING)
        near = sorted(p for p in known
                      if month_year and month_year.group(1) in p)
        sys.exit(f"FAIL: sitting prefix {prefix!r} appears nowhere else in the "
                 f"bank, so this import would create a second card for an exam "
                 f"that already has one."
                 + (f" Did you mean one of: {near}?" if near else
                    " Check the existing sitting names before inventing a new one."))

    save_js(QUESTIONS_FILE, "QUESTIONS", kept + records)

    conf_counts = {c: sum(1 for r in records if r["conf"] == c)
                   for c in ("high", "medium", "low")}
    where = {}
    for r in records:
        key = f"{r['paper']} U{r['unit']}"
        where[key] = where.get(key, 0) + 1

    print(f"{SITTING}")
    print(f"  {len(records)} of {PAPER_LEN} Section A questions imported "
          f"(the rest are off the 2026 syllabus)")
    print(f"  placed: {where}")
    print(f"  confidence: {conf_counts}  (all derived — no official key for Paper III)")
    print(f"  bank {before} -> {len(kept) + len(records)}"
          + (f", replaced {replaced} existing {SRC_KEY} record(s)" if replaced else ""))
    print(f"  Section B (20 short-answer questions) is DEFERRED — see "
          f"staged/pe2018-p3/README.md")


if __name__ == "__main__":
    main()
