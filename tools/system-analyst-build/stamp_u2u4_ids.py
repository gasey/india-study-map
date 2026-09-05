#!/usr/bin/env python3
"""Stamp each authored U2/U4 question with the id the importer will give it.

    python3 tools/system-analyst-build/stamp_u2u4_ids.py [--check]

WHY THIS EXISTS. The importer resolves a reviewer flag by looking for a
`reviewFix` on the question whose `id` the reviewer cited:

    fixed_ids = {q["id"] for q in records if q.get("id") and q.get("reviewFix")}

but `records` is built from the per-leaf `*.done.json` files, and the authors
never wrote an `id` — the importer *derives* ids itself, after the review gate
has already run. So `fixed_ids` was unconditionally empty: any flag at all
would have been unresolvable, and the import would have hard-stopped forever
with no way to satisfy it. The gate was not merely strict, it was unsatisfiable.

Reviewers, meanwhile, see the ids in `_review-batch-*.json`, which came from
`_all.json`. This script makes that link explicit by writing those same ids
into the `.done.json` files, so a flag can actually be matched to a question.

WHY STAMPING IS SAFE. The id is a pure function of the import ordering:
records sorted by (unit, _slug), counted per unit, formatted GEN-T2U<unit>-<nnn>.
This script recomputes that ordering from the briefs and the `.done.json`
files — the same inputs the importer uses — and refuses to write unless the
result matches `_all.json` question-for-question, comparing stems and not just
counts. If the two ever disagree, the ids the reviewers saw are not the ids the
questions will get, and stamping would silently attach a fix to the WRONG
question. That is the failure this repo has been bitten by before, so it is a
hard stop rather than a warning.

`--check` verifies without writing.
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_GEN = ROOT / "system-analyst-build/staged/tech2-u2u4-gen"

# Set from --dir. Defaults to the U2/U4 batch this script was written for; the
# id format is derived from each brief's unit number, so the same code serves
# any authored batch (Unit 1 yields GEN-T2U1-nnn without further configuration).
GEN = DEFAULT_GEN


def die(msg):
    sys.exit("stamp_u2u4_ids: " + msg)


def derive():
    """Recompute (id, question) in the importer's own order."""
    briefs = sorted(GEN.glob("*.brief.json"))
    if not briefs:
        die("no brief files in %s" % GEN)

    records = []
    for bp in briefs:
        b = json.loads(bp.read_text())
        slug, unit = b["slug"], b["unit"]
        done = GEN / ("%s.done.json" % slug)
        if not done.exists():
            die("%s: no .done.json — author did not finish" % slug)
        batch = json.loads(done.read_text())
        if not isinstance(batch, list):
            die("%s: expected a JSON array" % slug)
        for i, q in enumerate(batch):
            records.append({"_slug": slug, "_unit": unit, "_i": i, "q": q})

    counters = Counter()
    for r in sorted(records, key=lambda x: (x["_unit"], x["_slug"])):
        counters[r["_unit"]] += 1
        r["_id"] = "GEN-T2U%s-%03d" % (r["_unit"], counters[r["_unit"]])
    return records


def main():
    global GEN
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--dir", default=None,
                    help="staged batch directory (default: the U2/U4 batch)")
    args = ap.parse_args()
    if args.dir:
        GEN = Path(args.dir).resolve()
        if not GEN.is_dir():
            die("--dir %s is not a directory" % GEN)

    records = derive()

    # ---- the guard: derived ids must match the ids reviewers actually saw ----
    all_path = GEN / "_all.json"
    if not all_path.exists():
        die("_all.json missing — cannot verify the ids reviewers were shown")
    allj = json.loads(all_path.read_text())

    ordered = sorted(records, key=lambda x: (x["_unit"], x["_slug"]))
    if len(ordered) != len(allj):
        die("derived %d questions but _all.json has %d" % (len(ordered), len(allj)))

    for r, a in zip(ordered, allj):
        if r["_id"] != a.get("id"):
            die("id order drift: derived %s where _all.json has %s. The ids the "
                "reviewers cited are NOT the ids these questions will receive; "
                "stamping now would attach fixes to the wrong questions."
                % (r["_id"], a.get("id")))
        if r["q"].get("q") != a.get("q"):
            die("%s: stem mismatch between .done.json and _all.json. Same id, "
                "different question — refusing to stamp." % r["_id"])

    if args.check:
        print("check ok: %d questions, ids match _all.json question-for-question"
              % len(ordered))
        return

    # ---- write ids back, one file per leaf, preserving author field order ----
    by_slug = {}
    for r in records:
        by_slug.setdefault(r["_slug"], []).append(r)

    touched = 0
    for slug, rs in sorted(by_slug.items()):
        path = GEN / ("%s.done.json" % slug)
        batch = json.loads(path.read_text())
        for r in rs:
            q = batch[r["_i"]]
            if q.get("id") not in (None, r["_id"]):
                die("%s#%d already carries a different id %r" % (slug, r["_i"] + 1, q["id"]))
            # id first, then the author's own fields in their original order
            batch[r["_i"]] = {"id": r["_id"], **{k: v for k, v in q.items() if k != "id"}}
        path.write_text(json.dumps(batch, indent=1, ensure_ascii=False) + "\n")
        touched += 1

    print("stamped ids into %d .done.json files (%d questions)" % (touched, len(records)))


if __name__ == "__main__":
    main()
