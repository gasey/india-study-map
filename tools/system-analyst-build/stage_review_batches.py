#!/usr/bin/env python3
"""Build `_all.json` and cut blind-review batches for a depth-pass batch dir.

    python3 tools/system-analyst-build/stage_review_batches.py \
        --dir tools/system-analyst-build/staged/tech2-u1-gen2 --batches 2

Run AFTER stamp_depth_ids.py, so every question already carries the id it will
be imported under. `_all.json` is the snapshot the review batches are cut from,
and stamp_depth_ids.py checks stamped ids against it question-for-question on
every later run — so it must be written from the same ordering the importer
uses (records sorted by slug, then position).

Reviewers see `id, sub, q, opts, ans, exp, conf`. They are shown the keyed
answer deliberately: the job is not to sit an exam, it is to refute a claim,
and a reviewer who cannot see the key cannot catch the failure mode that
actually dominates here — a correct key reached by a false rule in the
explanation. The blindness that matters is between the two reviewers, not
between a reviewer and the answer.
"""

import argparse
import json
from pathlib import Path

FIELDS = ("id", "sub", "q", "opts", "ans", "exp", "conf")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--batches", type=int, default=2)
    args = ap.parse_args()

    GEN = Path(args.dir).resolve()
    if not (GEN / "_batch.json").exists():
        raise SystemExit("no _batch.json in %s" % GEN)

    records = []
    for bp in sorted(GEN.glob("*.brief.json")):
        slug = json.loads(bp.read_text())["slug"]
        done = GEN / ("%s.done.json" % slug)
        if not done.exists():
            raise SystemExit("%s: no .done.json — author did not finish" % slug)
        for i, q in enumerate(json.loads(done.read_text())):
            records.append((slug, i, q))

    ordered = [q for _, _, q in sorted(records, key=lambda r: (r[0], r[1]))]
    missing = [i for i, q in enumerate(ordered) if not q.get("id")]
    if missing:
        raise SystemExit("%d question(s) have no id — run stamp_depth_ids.py --dir %s first"
                         % (len(missing), GEN))

    ids = [q["id"] for q in ordered]
    if len(set(ids)) != len(ids):
        raise SystemExit("duplicate ids among the authored questions")

    (GEN / "_all.json").write_text(json.dumps(ordered, indent=1, ensure_ascii=False) + "\n")

    # Split by leaf boundaries where possible so a reviewer sees related
    # questions together and can spot within-leaf duplication.
    n = args.batches
    size = (len(ordered) + n - 1) // n
    names = "abcdefgh"
    for b in range(n):
        chunk = ordered[b * size:(b + 1) * size]
        if not chunk:
            continue
        out = [{k: q[k] for k in FIELDS if k in q} for q in chunk]
        (GEN / ("_review-batch-%s.json" % names[b])).write_text(
            json.dumps(out, indent=1, ensure_ascii=False) + "\n")
        print("_review-batch-%s.json : %d questions (%s .. %s)"
              % (names[b], len(out), out[0]["id"], out[-1]["id"]))

    print("_all.json            : %d questions" % len(ordered))


if __name__ == "__main__":
    main()
