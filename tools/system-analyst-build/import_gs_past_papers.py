#!/usr/bin/env python3
"""Import General Studies questions from MPSC engineering past papers.

    python3 tools/system-analyst-build/import_gs_past_papers.py             # dry run
    python3 tools/system-analyst-build/import_gs_past_papers.py --write

WHY. Before this, all 139 General Studies questions in the bank were AUTHORED
("Authored practice question") - not one came from a real MPSC paper. Authored
questions can cover a syllabus leaf, but they cannot teach how the Commission
actually asks: what it considers fair game, how it words options, how much of the
paper is Mizoram-specific. These papers supply that, and both sittings imported
here have a published official answer key, so every answer is authoritative
rather than agent-derived.

STATIC ONLY, BY REQUEST. A General Studies paper is roughly a fifth
current-affairs, and a 2023 or 2025 news question is worth nothing for a later
exam - worse than nothing when the answer has since changed. Each question
therefore carries an explicit keep/drop decision with a reason, staged in
<sitting>-tags.json. Dropped questions are printed on every run, never silently
discarded, so pulling one back is a one-field edit. The GS syllabus does have a
12-mark Current Affairs unit; it stays authored-only on purpose, because
past-paper current affairs is the one category that cannot be recycled.

WHAT IS VERIFIED BEFORE ANYTHING IS WRITTEN:

  * the source file's questions and key are staged as JSON with the sha256 of
    the PDFs they came from - those PDFs live in the mpsc-question-bank repo, so
    the import must not depend on them being present;
  * every kept question has all four options, none empty, and a key entry;
  * every kept question names a real leaf of the GS syllabus, checked against
    syllabus.js rather than trusted - a `sub` that is not a leaf silently breaks
    every by-topic view (DEVLOG 2026-09-04);
  * ids are new. Re-running never duplicates: existing ids are compared field by
    field and reported as unchanged.

IDEMPOTENT. Second run reports 0 added, 0 changed.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
APP = ROOT / "public" / "mpsc-system-analyst" / "data"
QUESTIONS_FILE = APP / "questions.js"
SYLLABUS_FILE = APP / "syllabus.js"
STAGED = HERE / "staged"

SITTINGS = [
    {
        "name": "MES2025_GS",
        "source": "gs-mes2025-source.json",
        "tags": "gs-mes2025-tags.json",
        "sitting": "Jr. Grade of MES (Combined), October 2025 · General Studies",
        "id_prefix": "MES2025_GS_",
        "prov": ("Jr. Grade of MES (Combined), 1-6 October 2025, General Studies, Q{no}; "
                 "answer from MPSC's official final answer key, Notification No. "
                 "Jr. Gr. of MES(DR)/25(1)-2025-MPSC (EXAM) dated 13 November 2025 "
                 "(supersedes the 7 October 2025 provisional key)"),
    },
]


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"window\.{name}\s*=\s*([\[{{].*[\]}}])\s*;\s*$", text, re.S)
    if not m:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(m.group(1))


def save_js(path, name, data):
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def gs_leaves(syllabus):
    gs = next(p for p in syllabus["papers"] if p["id"] == "GS")
    return {u["no"]: set(u["subtopics"]) for u in gs["units"]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    by_id = {q["id"]: q for q in questions}
    leaves = gs_leaves(load_js(SYLLABUS_FILE, "SYLLABUS"))

    added = changed = 0
    for cfg in SITTINGS:
        src = json.loads((STAGED / cfg["source"]).read_text(encoding="utf-8"))
        tagdoc = json.loads((STAGED / cfg["tags"]).read_text(encoding="utf-8"))
        key = {int(k): v for k, v in src["key"].items()}
        paper = {q["no"]: q for q in src["questions"]}
        tags = {t["no"]: t for t in tagdoc["tags"]}

        print(f"\n=== {cfg['name']} — {cfg['sitting']}")
        missing_tags = sorted(set(paper) - set(tags))
        if missing_tags:
            sys.exit(f"FAIL: {len(missing_tags)} question(s) have no keep/drop decision: "
                     f"{missing_tags}. Every question must be decided explicitly; an "
                     f"undecided one would be dropped silently.")

        kept = [t for t in tagdoc["tags"] if t.get("keep")]
        dropped = [t for t in tagdoc["tags"] if not t.get("keep")]

        # --- validate before writing a single record ----------------------
        problems = []
        for t in kept:
            n = t["no"]
            q = paper.get(n)
            if q is None:
                problems.append(f"Q{n}: kept but not in the parsed paper")
                continue
            if sorted(q["opts"]) != ["A", "B", "C", "D"]:
                problems.append(f"Q{n}: options are {sorted(q['opts'])}, expected A-D")
            if any(not v.strip() for v in q["opts"].values()):
                problems.append(f"Q{n}: has an empty option — parser damage, not importable")
            if n not in key:
                problems.append(f"Q{n}: no official key entry")
            elif key[n] not in q["opts"]:
                problems.append(f"Q{n}: key says {key[n]!r}, which is not one of its options")
            unit, sub = t.get("unit"), t.get("sub")
            if unit not in leaves:
                problems.append(f"Q{n}: unit {unit!r} is not a GS unit")
            elif sub not in leaves[unit]:
                problems.append(f"Q{n}: sub {sub!r} is not a leaf of GS unit {unit}")
            if not (t.get("exp") or "").strip():
                problems.append(f"Q{n}: kept with no explanation")
        if problems:
            print(f"  {len(problems)} problem(s):")
            for p in problems[:20]:
                print(f"      {p}")
            sys.exit("FAIL: refusing to import an invalid batch")

        # --- build ---------------------------------------------------------
        for t in kept:
            n = t["no"]
            q = paper[n]
            qid = f"{cfg['id_prefix']}{n:03d}"
            rec = {
                "id": qid,
                "src": "past",
                "sitting": cfg["sitting"],
                "srcKey": cfg["name"],
                "no": n,
                "paper": "GS",
                "unit": t["unit"],
                "sub": t["sub"],
                "q": q["q"],
                "opts": dict(sorted(q["opts"].items())),
                "ans": key[n],
                "exp": t["exp"],
                "conf": "official",
                "prov": cfg["prov"].format(no=n),
                "note": "",
            }
            if qid in by_id:
                if json.dumps(by_id[qid], sort_keys=True, ensure_ascii=False) != \
                   json.dumps(rec, sort_keys=True, ensure_ascii=False):
                    by_id[qid].clear()
                    by_id[qid].update(rec)
                    changed += 1
            else:
                questions.append(rec)
                by_id[qid] = rec
                added += 1

        print(f"  {len(kept)} kept, {len(dropped)} dropped as time-bound or off-syllabus")
        for t in dropped:
            print(f"      Q{t['no']:>3} — {t['reason']}")

    print(f"\n{added} question(s) added, {changed} updated")
    if args.write:
        save_js(QUESTIONS_FILE, "QUESTIONS", questions)
        print(f"wrote {QUESTIONS_FILE.relative_to(ROOT)}")
    else:
        print("dry run — re-run with --write to apply")


if __name__ == "__main__":
    main()
