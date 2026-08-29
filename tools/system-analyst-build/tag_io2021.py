#!/usr/bin/env python3
"""
Tag the 195 newly recovered 2021 Informatics Officer questions to syllabus
subtopics, so the Study tab can link them to concepts.

They were appended with unit/sub null. app.js links a concept to its questions
on `paper + unit + sub`, so until they carry a leaf they are unreachable from
the concept guide — the same gap the General English questions had in the System
Manager app before their re-tag.

  --export   write tagging batches (questions + that paper's allowed leaves)
  --merge    validate every tag against the syllabus and apply to questions.js

`sub` must match a syllabus leaf VERBATIM; the merge rejects anything else,
because a paraphrase links to nothing and fails silently.

Usage:
  python3 tools/system-analyst-build/tag_io2021.py --export
  python3 tools/system-analyst-build/tag_io2021.py --merge
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
BATCHES = os.path.join(HERE, "staged", "tagging")
APP = os.path.join(ROOT, "public", "mpsc-system-analyst", "data")
BATCH_SIZE = 25
TARGET_SRCKEYS = {"TECH2_2021", "TECH3_2021"}


def load(name):
    text = open(os.path.join(APP, f"{name}.js"), encoding="utf-8").read()
    var = {"questions": "QUESTIONS", "syllabus": "SYLLABUS"}[name]
    m = re.search(rf"window\.{var}\s*=\s*([\[{{].*[\]}}]);\s*$", text, re.S)
    if not m:
        sys.exit(f"FAIL: cannot parse window.{var} out of {name}.js")
    return json.loads(m.group(1))


def leaves(syl, paper):
    out = []
    for p in syl["papers"]:
        if p["id"] != paper:
            continue
        for u in p["units"]:
            for s in (u.get("subtopics") or []):
                out.append({"unit": str(u["no"]), "unitTitle": u["title"], "sub": s})
    return out


def do_export():
    qs = load("questions")
    syl = load("syllabus")
    todo = [q for q in qs if q.get("srcKey") in TARGET_SRCKEYS and not q.get("sub")]
    if not todo:
        print("nothing to tag — all 2021 questions already carry a subtopic")
        return

    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    by_paper = {}
    for q in todo:
        by_paper.setdefault(q["paper"], []).append(q)

    written = []
    for paper, group in sorted(by_paper.items()):
        allowed = leaves(syl, paper)
        for i in range(0, len(group), BATCH_SIZE):
            chunk = group[i:i + BATCH_SIZE]
            n = i // BATCH_SIZE + 1
            while os.path.exists(os.path.join(BATCHES, f"{paper}-{n}.done.json")):
                n += 1
            path = os.path.join(BATCHES, f"{paper}-{n}.todo.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "paper": paper,
                    "instructions": (
                        "Tag each question to one (unit, sub) from allowed_leaves. Write "
                        "{\"<id>\": {\"unit\": \"...\", \"sub\": \"...\"}} to this filename "
                        "with .todo.json replaced by .done.json. `sub` must be copied "
                        "VERBATIM — it is matched by exact string equality."),
                    "allowed_leaves": allowed,
                    "questions": [{"id": q["id"], "q": q["q"], "opts": q["opts"]} for q in chunk],
                }, f, indent=2, ensure_ascii=False)
            written.append((os.path.basename(path), len(chunk), len(allowed)))

    print(f"{len(todo)} untagged 2021 questions -> {len(written)} batch(es)")
    for name, n, na in written:
        print(f"  {name:<20} {n:>3} questions, {na} allowed leaves")


def do_merge():
    qs = load("questions")
    syl = load("syllabus")
    valid = {}
    for p in syl["papers"]:
        for L in leaves(syl, p["id"]):
            valid[(p["id"], L["unit"], L["sub"])] = True

    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    byid = {q["id"]: q for q in qs}
    problems, tags = [], {}
    for path in done:
        data = json.load(open(path, encoding="utf-8"))
        for qid, t in (data.get("tags", data) if isinstance(data, dict) else {}).items():
            q = byid.get(qid)
            if not q:
                problems.append(f"{qid}: not a question in the app")
                continue
            unit, sub = str(t.get("unit")), t.get("sub")
            if (q["paper"], unit, sub) not in valid:
                near = [k[2] for k in valid
                        if k[0] == q["paper"] and str(k[2]).lower() == str(sub).lower()]
                hint = f" (case mismatch with {near[0]!r}?)" if near else ""
                problems.append(f"{qid}: ({q['paper']}, {unit}, {sub!r}) is not a leaf{hint}")
                continue
            tags[qid] = (unit, sub)

    n = 0
    for q in qs:
        if q["id"] in tags:
            q["unit"], q["sub"] = tags[q["id"]]
            n += 1

    with open(os.path.join(APP, "questions.js"), "w", encoding="utf-8") as f:
        f.write("window.QUESTIONS = " + json.dumps(qs, indent=1, ensure_ascii=False) + ";\n")

    print(f"tagged {n} questions -> {os.path.relpath(os.path.join(APP, 'questions.js'), os.getcwd())}")
    per = Counter(byid[q]["paper"] for q in tags)
    for p, c in sorted(per.items()):
        print(f"  {c:>4}  {p}")
    still = [q["id"] for q in qs if q.get("srcKey") in TARGET_SRCKEYS and not q.get("sub")]
    print(f"\n  {len(still)} of the 2021 set still untagged")
    total_tagged = sum(1 for q in qs if q.get("sub"))
    print(f"  app-wide: {total_tagged}/{len(qs)} questions carry a subtopic")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems[:30]:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    a = ap.parse_args()
    if a.export:
        do_export()
    elif a.merge:
        do_merge()
    else:
        ap.error("pass --export or --merge")


if __name__ == "__main__":
    main()
