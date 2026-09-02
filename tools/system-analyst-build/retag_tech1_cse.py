#!/usr/bin/env python3
"""Retag the 41 TECH1_CSE_* questions that were filed into the wrong unit.

    python3 tools/system-analyst-build/retag_tech1_cse.py           # dry run
    python3 tools/system-analyst-build/retag_tech1_cse.py --write   # apply

WHAT WENT WRONG. `import_2026_tech1.py` tags its 217 questions with a regex
`classify()` that returns `(unit, unit_title)` — so for units 1/2/3 the `sub`
field is the UNIT TITLE, not a syllabus leaf. A tag that just restates the unit
carries no information, so every by-topic consumer has to fall back on the
question text. That is how a run of DBMS, networking, OS, graphics and OOP
questions ended up under "Discrete Mathematics" and "Data Structures and
Algorithms": DBMS questions are full of the word *relation*, networking of
*set of rules*, conics of *set of points*, and all three route straight into
Sets, Relations and Functions.

WHY A SEPARATE SCRIPT. `import_2026_tech1.py` cannot be re-run to fix this —
its `fetch_questions()` shells out over ssh to the shiksha-dev droplet, so the
block has to be patched in place like every other slice of questions.js. And
this is not an answer correction, so it does not belong in
`apply_audit_corrections.py`, whose payload schema is answer-shaped
(`old_ans`/`ans`/`conf`) and whose docstring binds it to one dated audit.

WHERE THE TAGS CAME FROM. Each of the 41 was read against its own question text
and options, and each carries a `why` in the payload. They were previously
listed in `clusters.py: MISFILED`, where `build_study_guide.py` excluded them
locally — this script fixes the bank so that per-consumer workaround can go.

THREE KINDS OF MOVE, and the script reports them separately because they mean
different things:

  * 4 stay in TECH1. Disk geometry is unit 2 material and the OS questions are
    unit 4 material; they were simply mis-filed inside a paper they belong to.
  * 30 move to TECH1_LEGACY (DBMS -> unit 5, networking -> unit 1). This is a
    DEMOTION, not just a retag: TECH1_LEGACY is `counts_for_merit: false` and
    `legacy: true`, so those 30 leave merit mocks, the dashboard and the
    Weakest-units table. That is the honest outcome — DBMS and networking are
    in no unit of the 2026 syllabus, and TECH2 (E-Governance) and TECH3
    (Project Management/Aptitude) do not cover them either — but it is a real
    change to what the trainer drills, so it is called out on every run.
  * 7 are PARKED in a new non-merit `OFFSYL` paper. Computer graphics and
    language-level OOP appear in no paper of either syllabus. Parking follows
    the house idiom for material that must stay practiceable without polluting
    merit scoring (TECH1_LEGACY here, UDC in the System Manager app): mint a
    real paper with real units and `counts_for_merit: false`, rather than
    leaving a `unit` value that resolves nowhere. An unresolvable unit does not
    error in app.js — it silently drops the question from every by-unit view
    while still inflating the "All units" practice pool, which is worse than
    the bug being fixed here.

VALIDATION. Every target `(paper, unit, sub)` must resolve to a real subtopic
leaf in syllabus.js — the guard from `import_prog2018_p1.py`. This is the check
that stops the original defect being re-introduced, since `classify()`'s unit
titles would fail it.

IDEMPOTENT. A record's current `(paper, unit, sub)` must equal either the
payload's `old` or its `new`; anything else means the bank moved since the
payload was written and the script stops rather than clobbering a newer fix.
Re-running reports 0 changed. It FAILS LOUDLY on an id that is not in the bank
rather than skipping it — a typo'd id must not read as success.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
QUESTIONS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "questions.js"
SYLLABUS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "syllabus.js"
PAYLOAD = HERE / "staged" / "tech1-cse-retag.json"


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(rf"window\.{name}\s*=\s*(.*);\s*", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    # indent=1 matches import_2026_tech1.py and apply_audit_corrections.py, so the
    # diff of a 1400-record file stays reviewable. Only ever called for QUESTIONS —
    # see require_papers() for why syllabus.js is not written back.
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def require_papers(syllabus, new_papers):
    """Fail unless every paper the payload depends on is already in syllabus.js.

    This script deliberately does NOT write syllabus.js. That file is
    hand-maintained and hand-wrapped (several subtopic arrays put multiple
    entries per line), so a load/save round-trip through json.dumps reflows
    ~190 lines of unrelated text and buries the real change. A parked paper is
    a one-time schema addition a human should make and read; the payload
    carries its definition only so this message can print it.
    """
    have = {p["id"] for p in syllabus["papers"]}
    missing = [p for p in new_papers if p["id"] not in have]
    if missing:
        ids = ", ".join(p["id"] for p in missing)
        sys.exit(
            f"FAIL: {SYLLABUS_FILE.relative_to(ROOT)} has no paper {ids}.\n"
            f"This script does not edit syllabus.js — add the paper by hand, "
            f"matching the file's existing indentation. The payload's "
            f"`new_papers` entry has the definition to paste:\n\n"
            + json.dumps(missing, ensure_ascii=False, indent=2)
        )


def main():
    write = "--write" in sys.argv

    if not PAYLOAD.is_file():
        sys.exit(f"FAIL: missing {PAYLOAD}")
    payload = json.loads(PAYLOAD.read_text(encoding="utf-8"))
    retags = payload["retags"]

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    by_id = {q["id"]: q for q in questions}

    unknown = [r["id"] for r in retags if r["id"] not in by_id]
    if unknown:
        sys.exit(f"FAIL: {len(unknown)} retag id(s) are not in the bank: {unknown}")

    require_papers(syllabus, payload.get("new_papers", []))

    leaves = {p["id"]: {u["no"]: set(u.get("subtopics") or []) for u in p["units"]}
              for p in syllabus["papers"]}

    for r in retags:
        paper, unit, sub = r["new"]["paper"], r["new"]["unit"], r["new"]["sub"]
        if paper not in leaves:
            sys.exit(f"FAIL {r['id']}: paper {paper!r} is not in syllabus.js")
        if unit not in leaves[paper]:
            sys.exit(f"FAIL {r['id']}: unit {unit!r} is not a unit of {paper}")
        # The guard that keeps the original bug out: classify() wrote unit
        # TITLES into `sub`, and a unit title is never a subtopic leaf.
        if sub not in leaves[paper][unit]:
            sys.exit(f"FAIL {r['id']}: sub {sub!r} is not a subtopic of {paper} unit {unit}. "
                     f"A `sub` that merely restates the unit is what caused this bug.")

    changed = 0
    already = 0
    moves = {"kept": 0, "demoted": 0, "parked": 0}
    for r in retags:
        q = by_id[r["id"]]
        old, new = r["old"], r["new"]
        cur = (q.get("paper"), q.get("unit"), q.get("sub"))
        want = (new["paper"], new["unit"], new["sub"])
        was = (old["paper"], old["unit"], old["sub"])
        if cur not in (was, want):
            sys.exit(f"FAIL {r['id']}: bank has {cur}, but the payload was written against "
                     f"{was}. The card was retagged since this payload was authored; "
                     f"re-check it rather than applying a stale retag blind.")

        if cur == want:
            already += 1
        else:
            changed += 1
        q["paper"], q["unit"], q["sub"] = want

        if new["paper"] == "TECH1":
            moves["kept"] += 1
        elif new["paper"] == "OFFSYL":
            moves["parked"] += 1
        else:
            moves["demoted"] += 1

        if not write:
            arrow = "  (already)" if cur == want else ""
            print(f"  {r['id']}  {was[0]} u{was[1]} [{was[2]}]"
                  f"  ->  {want[0]} u{want[1]} [{want[2]}]{arrow}")
            print(f"      {q['q'][:96]}")

    if write:
        save_js(QUESTIONS_FILE, "QUESTIONS", questions)

    verb = "retagged" if write else "would retag"
    print(f"\n{verb} {len(retags)} question(s) in {QUESTIONS_FILE.relative_to(ROOT)}")
    print(f"  {moves['kept']} stay in TECH1 (mis-filed inside the right paper)")
    print(f"  {moves['demoted']} moved to TECH1_LEGACY — DEMOTED out of merit mocks, "
          f"the dashboard and Weakest-units")
    print(f"  {moves['parked']} parked in OFFSYL — on no syllabus for this post")
    print(f"  {changed} record(s) changed, {already} already up to date")
    if not write:
        print("\ndry run — re-run with --write to apply")


if __name__ == "__main__":
    main()
