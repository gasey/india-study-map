#!/usr/bin/env python3
"""Freeze a staged authoring batch into `_all.json` and split it for reviewers.

    python3 tools/system-analyst-build/make_review_batches.py \
        --dir tools/system-analyst-build/staged/tech2-u1-gen --batches 2

WHY `_all.json` IS A SEPARATE ARTEFACT. The importer derives each question's id
from the import ordering — records sorted by (unit, _slug), counted per unit,
formatted GEN-T2U<unit>-<nnn>. Reviewers, though, have to cite an id *before*
the import runs. `_all.json` is the point where that ordering is fixed and
written down: reviewers cite ids from it, `stamp_u2u4_ids.py` later refuses to
stamp unless the ordering still reproduces it question-for-question, and the
importer refuses to import if a stamped id disagrees with the id it derives.

So this script must be run BEFORE reviewers see anything, and re-running it
after a `.done.json` has been edited will move ids out from under any review
already written against them. It therefore refuses to overwrite an existing
`_all.json` unless `--force` is given, and prints what would move.

The ordering here is copied from the importer rather than reimplemented: sorted
by (unit, slug), which for a single-unit batch is simply leaf order.
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

FIELDS = ("id", "sub", "q", "opts", "ans", "exp", "conf")


def die(msg):
    sys.exit("make_review_batches: " + msg)


def derive(gen):
    """Recompute (id, question) in the importer's own order."""
    briefs = sorted(gen.glob("*.brief.json"))
    if not briefs:
        die("no brief files in %s" % gen)

    records = []
    for bp in briefs:
        b = json.loads(bp.read_text())
        slug, unit = b["slug"], b["unit"]
        done = gen / ("%s.done.json" % slug)
        if not done.exists():
            die("%s: no .done.json — author did not finish, so the ordering is not "
                "final and ids fixed now would shift once it lands" % slug)
        batch = json.loads(done.read_text())
        if not isinstance(batch, list):
            die("%s: expected a JSON array" % slug)
        if len(batch) != b["need"]:
            die("%s: wrote %d questions, brief asked for %d" % (slug, len(batch), b["need"]))
        for q in batch:
            records.append({"_slug": slug, "_unit": unit, "q": q})

    counters = Counter()
    out = []
    for r in sorted(records, key=lambda x: (x["_unit"], x["_slug"])):
        counters[r["_unit"]] += 1
        q = dict(r["q"])
        q["id"] = "GEN-T2U%s-%03d" % (r["_unit"], counters[r["_unit"]])
        out.append({k: q[k] for k in FIELDS if k in q})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--batches", type=int, default=2)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    gen = Path(args.dir).resolve()
    if not gen.is_dir():
        die("--dir %s is not a directory" % gen)

    allq = derive(gen)
    all_path = gen / "_all.json"

    if all_path.exists() and not args.force:
        old = json.loads(all_path.read_text())
        moved = [(o.get("id"), n.get("id"))
                 for o, n in zip(old, allq) if o.get("q") != n.get("q")]
        if len(old) != len(allq) or moved:
            die("_all.json already exists and this run would change it "
                "(%d -> %d questions, %d stems moved). Any review already written "
                "cites the old ids. Re-run with --force only if no review exists yet."
                % (len(old), len(allq), len(moved)))
        print("_all.json already matches; nothing to do")
        return

    all_path.write_text(json.dumps(allq, indent=1, ensure_ascii=False) + "\n")

    # Split into contiguous batches so each reviewer sees whole leaves where
    # possible — a reviewer who holds a whole leaf can spot duplicates within it.
    n = args.batches
    size = -(-len(allq) // n)
    names = "abcdefghij"
    unit = allq[0]["id"].split("-")[1].lower() if allq else "x"
    for i in range(n):
        chunk = allq[i * size:(i + 1) * size]
        if not chunk:
            continue
        p = gen / ("_review-batch-%s%s.json" % (unit, names[i]))
        p.write_text(json.dumps(chunk, indent=1, ensure_ascii=False) + "\n")
        print("%-28s %3d questions  %s..%s" % (p.name, len(chunk),
                                               chunk[0]["id"], chunk[-1]["id"]))

    print("\n_all.json frozen: %d questions" % len(allq))
    print("answer spread   : %s" % dict(sorted(Counter(q["ans"] for q in allq).items())))


if __name__ == "__main__":
    main()
