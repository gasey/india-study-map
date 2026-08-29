#!/usr/bin/env python3
"""
Phase 2 step 5 — tag every question to a syllabus (paper, unit, sub) triple.

Two modes:
  --export   write per-paper batch files for the tagging pass to fill in
  --merge    combine the filled batches into staged/tags.json, validating
             every tag against the taxonomy before writing

WHY THE VERBATIM MATCH MATTERS: app.js links a concept to its questions with
`q.paper === c.paper && q.sub === c.sub` (app.js:410) and keys concepts as
`paper|unit|sub` (app.js:104). A `sub` that is paraphrased, or that names a
SECTION rather than a leaf, links to nothing and fails silently. So the merge
step rejects any tag that isn't an exact leaf.

GENERAL ENGLISH: the official syllabus enumerates no subtopics for GE, so GE
questions are tagged to a unit only and `sub` stays null. Do not invent leaves.

Usage:
  python3 tools/system-manager-build/tagging.py --export
  # …tagging pass fills staged/tagging/<paper>-<n>.todo.json -> .done.json…
  python3 tools/system-manager-build/tagging.py --merge
"""

import argparse
import glob
import json
import os
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
EXTRACTED = os.path.join(HERE, "extracted")
BATCHES = os.path.join(STAGED, "tagging")

BATCH_SIZE = 40   # small enough that an agent stays accurate across a batch

P2_PAPER = {"CO2016A-P2": "TECH2", "CO2016B-P2": "TECH2"}


def all_questions():
    """Every question needing a tag, from both harvest and the vision pass."""
    rows = []
    hp = os.path.join(STAGED, "harvest.json")
    if os.path.isfile(hp):
        for r in json.load(open(hp, encoding="utf-8")):
            rows.append({"id": r["id"], "paper": r["paper"], "q": r["q"], "opts": r["opts"]})
    for path in sorted(glob.glob(os.path.join(EXTRACTED, "*.json"))):
        key = os.path.splitext(os.path.basename(path))[0]
        paper = P2_PAPER.get(key)
        if not paper:
            continue
        for r in json.load(open(path, encoding="utf-8")):
            rows.append({"id": f"{key}-{r['no']}", "paper": paper,
                         "q": r["q"], "opts": r["opts"]})
    return rows


def load_taxonomy():
    path = os.path.join(STAGED, "taxonomy.json")
    if not os.path.isfile(path):
        sys.exit("FAIL: staged/taxonomy.json missing — run export_taxonomy.py first")
    return json.load(open(path, encoding="utf-8"))


def load_units():
    """paper -> [(unit, title)], for GE where there are no leaves."""
    syl = os.path.join(os.path.dirname(os.path.dirname(HERE)),
                       "public", "mpsc-system-manager", "data", "syllabus.js")
    import re
    text = open(syl, encoding="utf-8").read()
    data = json.loads(re.search(r"window\.SYLLABUS\s*=\s*(\{.*\});\s*$", text, re.S).group(1))
    return {p["id"]: [(u["no"], u["title"], u["marks"]) for u in p["units"]]
            for p in data["papers"]}


def do_export():
    tax = load_taxonomy()
    units = load_units()
    rows = all_questions()
    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    by_paper = defaultdict(list)
    for r in rows:
        by_paper[r["paper"]].append(r)

    written = []
    for paper, qs in sorted(by_paper.items()):
        leaves = [{"unit": t["unit"], "unitTitle": t["unitTitle"],
                   "section": t["section"], "sub": t["sub"]}
                  for t in tax if t["paper"] == paper]
        for i in range(0, len(qs), BATCH_SIZE):
            chunk = qs[i:i + BATCH_SIZE]
            n = i // BATCH_SIZE + 1
            path = os.path.join(BATCHES, f"{paper}-{n}.todo.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "paper": paper,
                    "instructions": (
                        "For each question in `questions`, add an entry to a JSON object "
                        "keyed by question id: {\"<id>\": {\"unit\": \"<unit no>\", "
                        "\"sub\": \"<leaf subtopic VERBATIM>\"}}. Write it to the same "
                        "filename with .todo.json replaced by .done.json. `sub` must be "
                        "copied character-for-character from `allowed_leaves` — it is "
                        "matched by string equality. If the paper is GE, set sub to null "
                        "and tag the unit only."
                    ),
                    "allowed_units": [{"unit": u, "title": t, "marks": m}
                                      for u, t, m in units.get(paper, [])],
                    "allowed_leaves": leaves,
                    "questions": chunk,
                }, f, indent=2, ensure_ascii=False)
            written.append((path, len(chunk)))

    print(f"exported {len(written)} batch(es) to {os.path.relpath(BATCHES, os.getcwd())}/")
    for path, n in written:
        print(f"  {n:>3} questions  {os.path.basename(path)}")
    print(f"\ntotal {sum(n for _, n in written)} questions to tag")


def do_merge():
    tax = load_taxonomy()
    valid = {(t["paper"], t["unit"], t["sub"]) for t in tax}
    subs_by_paper = defaultdict(set)
    for t in tax:
        subs_by_paper[t["paper"]].add(t["sub"])
    units = load_units()
    valid_units = {p: {u for u, _, _ in v} for p, v in units.items()}

    paper_of = {r["id"]: r["paper"] for r in all_questions()}
    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/ — "
                 f"run the tagging pass first")

    problems, tags = [], {}
    for path in done:
        data = json.load(open(path, encoding="utf-8"))
        # tolerate either {id: {...}} or {"tags": {id: {...}}}
        entries = data.get("tags", data) if isinstance(data, dict) else {}
        for qid, t in entries.items():
            if qid in tags:
                problems.append(f"{qid}: tagged twice")
            paper = paper_of.get(qid)
            if not paper:
                problems.append(f"{qid}: not a known question id")
                continue
            unit, sub = str(t.get("unit")), t.get("sub")
            if unit not in valid_units.get(paper, set()):
                problems.append(f"{qid}: unit {unit!r} not a unit of {paper}")
                continue
            if sub is None:
                if subs_by_paper.get(paper):
                    problems.append(f"{qid}: sub is null but {paper} has leaf subtopics")
                    continue
            elif (paper, unit, sub) not in valid:
                near = [s for s in subs_by_paper[paper] if s.lower() == str(sub).lower()]
                hint = f" (case mismatch with {near[0]!r}?)" if near else ""
                problems.append(f"{qid}: ({paper}, {unit}, {sub!r}) is not a leaf{hint}")
                continue
            tags[qid] = {"unit": unit, "sub": sub}

    total = len(paper_of)
    untagged = [q for q in paper_of if q not in tags]

    os.makedirs(STAGED, exist_ok=True)
    with open(os.path.join(STAGED, "tags.json"), "w", encoding="utf-8") as f:
        json.dump(tags, f, indent=2, ensure_ascii=False)

    print(f"merged {len(tags)}/{total} tags -> staged/tags.json")
    per = Counter(paper_of[q] for q in tags)
    for p in sorted(per):
        print(f"  {per[p]:>4}  {p}")
    if untagged:
        print(f"\n{len(untagged)} still untagged"
              + (f": {', '.join(untagged[:8])}" + ("…" if len(untagged) > 8 else "")
                 if len(untagged) <= 40 else ""))

    # coverage: which leaves got no question at all? that's Phase 4's target list.
    hit = Counter((paper_of[q], t["sub"]) for q, t in tags.items() if t["sub"])
    for paper in sorted(subs_by_paper):
        cold = sorted(s for s in subs_by_paper[paper] if not hit.get((paper, s)))
        print(f"\n{paper}: {len(subs_by_paper[paper]) - len(cold)}"
              f"/{len(subs_by_paper[paper])} leaves have >=1 question; "
              f"{len(cold)} have none")
        if cold:
            path = os.path.join(STAGED, f"coverage-gaps-{paper}.json")
            json.dump(cold, open(path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
            print(f"      uncovered leaves -> staged/coverage-gaps-{paper}.json "
                  f"(this is Phase 4's target list)")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems[:40]:
            print(f"  - {p}", file=sys.stderr)
        if len(problems) > 40:
            print(f"  … and {len(problems) - 40} more", file=sys.stderr)
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
