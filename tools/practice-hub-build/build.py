#!/usr/bin/env python3
"""Build the MPSC Practice Hub 2 data bundle.

Reads every `staged/*.json` paper and emits one generated JS file the static
app loads as a plain <script>:

    public/mpsc-practice-hub-2/data/papers.js

Adding a paper is: drop `staged/<paperId>.json`, add its count to
`expected.json`, run `validate.py`, run this. No app code changes — the app
derives its exam list, paper list, topic filters and section headings entirely
from this bundle. That is the whole design constraint: nothing about a
specific paper is allowed to live in app.js.

    python3 tools/practice-hub-build/build.py
    python3 tools/practice-hub-build/build.py --skip-validate   # not advised
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from taxonomy import GROUPS, GROUP_LABELS, GROUP_ORDER, resolve  # noqa: E402

HERE = Path(__file__).parent
REPO = HERE.parent.parent
STAGED = HERE / "staged"
OUT_DIR = REPO / "public" / "mpsc-practice-hub-2" / "data"
OUT_FILE = OUT_DIR / "papers.js"


def load_papers() -> list[dict]:
    papers = []
    for p in sorted(STAGED.glob("*.json")):
        papers.append(json.loads(p.read_text()))
    # Newest sitting first, then Paper I before Paper II.
    papers.sort(key=lambda d: (-int(d.get("year", 0)), d.get("exam", ""), d.get("paper", "")))
    return papers


def enrich(papers: list[dict]) -> dict:
    """Attach derived fields and compute the bundle-level indexes."""
    topic_counts: dict[str, int] = {}
    total_q = 0
    total_disagree = 0
    total_flagged = 0
    conf_counts = {"high": 0, "medium": 0, "low": 0}
    defaulted_marks: list[str] = []

    for paper in papers:
        qs = paper.get("questions") or []

        # Marks per MCQ decide the mock-test score, so getting this wrong makes
        # a mock silently lie about how you did. Only the paper knows its own
        # scheme, so `markPerQuestion` belongs in the staged JSON. The fallback
        # below exists so a new paper still builds — but it announces itself
        # rather than defaulting in silence, which is the exact failure mode
        # CLAUDE.md records for retag_history.py.
        if "markPerQuestion" not in paper:
            guess = 2 if int(paper.get("maxMarks") or 0) >= 200 else 1
            paper["markPerQuestion"] = guess
            defaulted_marks.append(f"{paper['paperId']} -> {guess}")
        p_disagree = p_flagged = 0
        p_topics: dict[str, int] = {}

        for q in qs:
            topic = q.get("topic") or "other"
            group, label, _known = resolve(topic)
            q["topicGroup"] = group
            q["topicLabel"] = label
            # `key` is the stable identity used for every localStorage attempt
            # record. Namespaced by paper so two papers can both have a "Q1".
            q["key"] = f"{paper['paperId']}:{q['id']}"
            q["disagrees"] = bool(q.get("marked") and q["marked"] != q["answer"])

            topic_counts[topic] = topic_counts.get(topic, 0) + 1
            p_topics[topic] = p_topics.get(topic, 0) + 1
            if q["disagrees"]:
                p_disagree += 1
            if q.get("flag"):
                p_flagged += 1
            conf = q.get("conf")
            if conf in conf_counts:
                conf_counts[conf] += 1

        # Section headings for the browse view: consecutive runs of questions
        # sharing a `direction`. Derived, not authored, so a new paper with
        # different direction blocks needs no code change.
        sections = []
        for q in qs:
            d = q.get("direction")
            if sections and sections[-1]["direction"] == d:
                sections[-1]["ids"].append(q["id"])
            else:
                sections.append({"direction": d, "ids": [q["id"]]})
        paper["sections"] = sections

        paper["stats"] = {
            "questions": len(qs),
            "descriptive": len(paper.get("descriptive") or []),
            "disagreements": p_disagree,
            "flagged": p_flagged,
            "topics": p_topics,
        }
        paper["label"] = f"{paper['exam']} — {paper['paper']}"
        paper["sittingLabel"] = f"{paper['exam']} · {paper['sitting']}"

        total_q += len(qs)
        total_disagree += p_disagree
        total_flagged += p_flagged

    topics = []
    for slug, count in topic_counts.items():
        group, label, known = resolve(slug)
        topics.append({"slug": slug, "label": label, "group": group,
                       "count": count, "known": known})
    topics.sort(key=lambda t: (GROUP_ORDER.index(t["group"]), t["label"]))

    if defaulted_marks:
        print("NOTE: markPerQuestion was not declared and has been guessed for:")
        for line in defaulted_marks:
            print(f"      {line}")
        print("      Confirm against the booklet and set it explicitly in staged/.")

    return {
        "topics": topics,
        "groups": [{"slug": g, "label": lbl} for g, lbl in GROUPS],
        "totals": {
            "papers": len(papers),
            "questions": total_q,
            "disagreements": total_disagree,
            "flagged": total_flagged,
            "confidence": conf_counts,
        },
    }


def render(papers: list[dict], meta: dict) -> str:
    body = json.dumps(papers, ensure_ascii=False, indent=1, sort_keys=False)
    meta_s = json.dumps(meta, ensure_ascii=False, indent=1, sort_keys=False)
    return (
        "/* GENERATED FILE — do not edit by hand.\n"
        " * Source: tools/practice-hub-build/staged/*.json\n"
        " * Rebuild: python3 tools/practice-hub-build/build.py\n"
        " * Editing this file directly means the next build silently reverts you.\n"
        " */\n"
        f"window.PH2_PAPERS = {body};\n\n"
        f"window.PH2_META = {meta_s};\n"
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-validate", action="store_true")
    args = ap.parse_args()

    if not args.skip_validate:
        rc = subprocess.call([sys.executable, str(HERE / "validate.py")])
        if rc != 0:
            print("\nbuild aborted: validate.py failed", file=sys.stderr)
            return rc
        print()

    papers = load_papers()
    if not papers:
        print("no staged papers found", file=sys.stderr)
        return 1

    meta = enrich(papers)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(render(papers, meta), encoding="utf-8")

    t = meta["totals"]
    print(f"wrote {OUT_FILE.relative_to(REPO)}  ({OUT_FILE.stat().st_size:,} bytes)")
    print(f"  {t['papers']} papers, {t['questions']} questions, "
          f"{len(meta['topics'])} topics")
    print(f"  {t['disagreements']} answers disagree with the marked key, "
          f"{t['flagged']} flagged")
    print(f"  confidence: {t['confidence']['high']} high / "
          f"{t['confidence']['medium']} medium / {t['confidence']['low']} low")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
