"""Fold verification output into committed per-paper answer files.

Run:  python3 tools/practice-hub-build/merge_answers.py <batch-answers-dir> [adjudications.json]

The verification pass runs over ~20-question batches and writes one file each.
This collects them into `answers/<paperId>.json`, which is an AUTHORED PIPELINE
INPUT that stage.py applies -- not a patch written onto staged/*.json.

That distinction matters. If verified answers were written straight into
staged/*.json, the next `stage.py` run would silently wipe every one of them and
the only symptom would be validate.py suddenly failing on 476 null answers. The
same rule the README already states for data/papers.js applies here: generated
files are never the place to keep authored work.

Adjudications (the second, independent opinion on every answer that disagreed
with the highlight) override the first pass where they disagree with it, and are
recorded so the override is visible rather than silent.
"""
import json
import os
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "answers")
FIELDS = ("answer", "conf", "why", "topic", "flag")


def main():
    # Comma-separated dirs, later ones overriding earlier. That is how the
    # re-verification of the questions whose underline was recovered supersedes
    # the first pass, which judged them from text that had lost the underline.
    dirs = sys.argv[1].split(",")
    adj_path = sys.argv[2] if len(sys.argv) > 2 else None
    os.makedirs(OUT, exist_ok=True)

    by_paper = defaultdict(dict)
    seen = 0
    for di, src in enumerate(dirs):
        within = defaultdict(set)
        for name in sorted(os.listdir(src)):
            if not name.endswith(".json"):
                continue
            pid = name.split("__")[0]
            for rec in json.load(open(os.path.join(src, name))):
                qid = rec["id"]
                if qid in within[pid]:
                    raise SystemExit(f"{pid}: duplicate answer for {qid} within {src}")
                within[pid].add(qid)
                if di and qid in by_paper[pid]:
                    print(f"  override {pid}/{qid} from {os.path.basename(src)}")
                by_paper[pid][qid] = {k: rec.get(k) for k in FIELDS}
                seen += 1

    overrides = 0
    if adj_path and os.path.exists(adj_path):
        for a in json.load(open(adj_path)):
            qid = a["id"]
            # Question ids are only unique within a paper, so an adjudication
            # that does not name its batch is resolved by finding the paper that
            # actually holds the id -- and rejected outright if more than one
            # does, rather than being written to whichever matched first.
            pid = a.get("batch", "").split("__")[0]
            if not pid:
                owners = [p for p, qs in by_paper.items() if qid in qs]
                if len(owners) != 1:
                    print(f"  WARNING adjudication for {qid} matches {owners or 'no'} "
                          f"paper(s); skipped")
                    continue
                pid = owners[0]
            if qid not in by_paper.get(pid, {}):
                print(f"  WARNING adjudication for unknown {pid}/{qid}")
                continue
            cur = by_paper[pid][qid]
            if cur["answer"] != a["answer"]:
                overrides += 1
            note = (f"[adjudicated: {a['verdict']}] ")
            by_paper[pid][qid] = {
                "answer": a["answer"], "conf": a["conf"],
                "why": note + a["why"], "topic": cur["topic"],
                "flag": a.get("flag") or cur.get("flag"),
            }

    for pid, answers in sorted(by_paper.items()):
        path = os.path.join(OUT, pid + ".json")
        json.dump(dict(sorted(answers.items())), open(path, "w"),
                  indent=1, ensure_ascii=False)
        confs = defaultdict(int)
        flagged = 0
        for a in answers.values():
            confs[a["conf"]] += 1
            if a.get("flag"):
                flagged += 1
        print(f"{pid}: {len(answers)} answers "
              f"(high {confs['high']}, medium {confs['medium']}, low {confs['low']}), "
              f"{flagged} flagged")
    print(f"\n{seen} answers merged; {overrides} overridden by adjudication")


if __name__ == "__main__":
    main()
