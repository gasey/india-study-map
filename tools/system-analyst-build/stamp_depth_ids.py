#!/usr/bin/env python3
"""Stamp import-time ids onto a depth-pass batch, keyed by its `_batch.json`.

    python3 tools/system-analyst-build/stamp_depth_ids.py --dir <batch dir> [--check]

WHY. import_depth_gen.py resolves a reviewer flag by finding a `reviewFix` on
the question whose id the reviewer cited. Authors never write ids — they are
derived at import, after the review gate runs — so without this step the set of
fixable ids is empty and ANY flag becomes permanently unresolvable. That is not
a strict gate, it is an unsatisfiable one, and it is indistinguishable from the
outside. Stamping makes the reviewer-to-question link explicit and auditable.

The id is a pure function of the import ordering (records sorted by slug,
counted, formatted `<idPrefix>-<nnn>`), recomputed here from the same inputs the
importer uses. Once `_all.json` exists — the snapshot the review batches were
cut from — this refuses to write unless the recomputed ids match it
question-for-question, comparing stems and not merely counts. If those ever
disagree, the ids reviewers cited are not the ids the questions will receive,
and stamping would silently attach a fix to a neighbouring question.
"""

import argparse
import json
import sys
from pathlib import Path


def die(msg):
    sys.exit("stamp_depth_ids: " + msg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    GEN = Path(args.dir).resolve()
    man = GEN / "_batch.json"
    if not man.exists():
        die("no _batch.json in %s" % GEN)
    prefix = json.loads(man.read_text())["idPrefix"]

    briefs = sorted(GEN.glob("*.brief.json"))
    if not briefs:
        die("no brief files in %s" % GEN)

    records = []
    for bp in briefs:
        slug = json.loads(bp.read_text())["slug"]
        done = GEN / ("%s.done.json" % slug)
        if not done.exists():
            die("%s: no .done.json — author did not finish" % slug)
        batch = json.loads(done.read_text())
        if not isinstance(batch, list):
            die("%s: expected a JSON array" % slug)
        for i, q in enumerate(batch):
            records.append({"_slug": slug, "_i": i, "q": q})

    ordered = sorted(records, key=lambda x: (x["_slug"], x["_i"]))
    for n, r in enumerate(ordered, 1):
        r["_id"] = "%s-%03d" % (prefix, n)

    all_path = GEN / "_all.json"
    if all_path.exists():
        allj = json.loads(all_path.read_text())
        if len(allj) != len(ordered):
            die("derived %d questions but _all.json has %d" % (len(ordered), len(allj)))
        for r, a in zip(ordered, allj):
            if r["_id"] != a.get("id"):
                die("id order drift: derived %s where _all.json has %s — the ids reviewers "
                    "cited are not the ids these questions will receive."
                    % (r["_id"], a.get("id")))
            if r["q"].get("q") != a.get("q"):
                die("%s: stem mismatch between .done.json and _all.json — same id, different "
                    "question. Refusing to stamp." % r["_id"])

    if args.check:
        print("check ok: %d questions%s" % (len(ordered),
              ", ids match _all.json question-for-question" if all_path.exists() else ""))
        return

    by_slug = {}
    for r in records:
        by_slug.setdefault(r["_slug"], []).append(r)
    for slug, rs in sorted(by_slug.items()):
        path = GEN / ("%s.done.json" % slug)
        batch = json.loads(path.read_text())
        for r in rs:
            q = batch[r["_i"]]
            if q.get("id") not in (None, r["_id"]):
                die("%s#%d already carries a different id %r" % (slug, r["_i"] + 1, q["id"]))
            batch[r["_i"]] = {"id": r["_id"], **{k: v for k, v in q.items() if k != "id"}}
        path.write_text(json.dumps(batch, indent=1, ensure_ascii=False) + "\n")

    print("stamped %d ids with prefix %s across %d files" % (len(records), prefix, len(by_slug)))


if __name__ == "__main__":
    main()
