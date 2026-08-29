#!/usr/bin/env python3
"""
Phase 2 step 5 input — export the syllabus as a flat tagging taxonomy.

Every question must be tagged to a (paper, unit, sub) triple where `sub` is a
LEAF subtopic string copied verbatim from syllabus.js. That verbatim match is
load-bearing: app.js links a concept to its questions with
`q.paper === c.paper && q.sub === c.sub` (app.js:410) and keys concepts as
`paper|unit|sub` (app.js:104). A `sub` that is a section name, or a paraphrase,
silently links to nothing.

Emits two files:
  staged/taxonomy.json  machine-readable, for a validator to check tags against
  staged/taxonomy.txt   compact prompt-ready listing, grouped by paper/unit/section

Note BUILD_GUIDE.md §4's questions.js example tags `sub: "Introduction to
Computing"` - that is a SECTION, not a leaf, and would not link. Tag to leaves.

Usage:  python3 tools/system-manager-build/export_taxonomy.py
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SYL = os.path.join(ROOT, "public", "mpsc-system-manager", "data", "syllabus.js")
STAGED = os.path.join(HERE, "staged")


def load_syllabus():
    if not os.path.isfile(SYL):
        sys.exit(f"FAIL: {SYL} not found — run gen_syllabus.py first")
    text = open(SYL, encoding="utf-8").read()
    m = re.search(r"window\.SYLLABUS\s*=\s*(\{.*\});\s*$", text, re.S)
    if not m:
        sys.exit("FAIL: could not parse window.SYLLABUS out of syllabus.js")
    return json.loads(m.group(1))


def main():
    syl = load_syllabus()
    os.makedirs(STAGED, exist_ok=True)

    # General English has no official subtopics, but Phase 5 authored a DERIVED
    # breakdown and the concepts are keyed to it. Import that single source of
    # truth so GE questions can be tagged to the same strings — otherwise the
    # 34 GE concepts can never link to their 160 questions.
    sys.path.insert(0, HERE)
    from concepts import GE_DERIVED

    flat, lines, seen = [], [], set()
    for p in syl["papers"]:
        pid = p["id"]
        derived = pid == "GE"
        lines.append(f"\n=== PAPER {pid} — {p['name']} ({p['marks']} marks) ===")
        if derived:
            lines.append("  NOTE: the official syllabus enumerates NO subtopics for General")
            lines.append("  English. The subtopics below are DERIVED (authored in")
            lines.append("  concepts.py) so that questions and concepts can be linked.")
            lines.append("  They are not official and must not be presented as such.")
        for u in p["units"]:
            lines.append(f"\n  UNIT {u['no']} — {u['title']} ({u['marks']} marks)")
            if derived:
                _, subs = GE_DERIVED.get(str(u["no"]), (u["title"], []))
                for sub in subs:
                    key = (pid, str(u["no"]), sub)
                    if key in seen:
                        sys.exit(f"FAIL: duplicate taxonomy key {key}")
                    seen.add(key)
                    flat.append({"paper": pid, "unit": str(u["no"]),
                                 "unitTitle": u["title"], "section": "(derived)",
                                 "sub": sub, "derived": True})
                    lines.append(f"        - {sub}")
                if not subs:
                    lines.append("    (no derived subtopics for this unit)")
                continue
            if not u.get("subtopics"):
                lines.append("    (no leaf subtopics in the official syllabus)")
                continue
            for sec in u.get("sections", []):
                lines.append(f"    [{sec['no']}] {sec['title']}")
                for sub in sec["subtopics"]:
                    key = (pid, str(u["no"]), sub)
                    if key in seen:
                        sys.exit(f"FAIL: duplicate taxonomy key {key}")
                    seen.add(key)
                    flat.append({
                        "paper": pid,
                        "unit": str(u["no"]),
                        "unitTitle": u["title"],
                        "section": sec["title"],
                        "sub": sub,
                    })
                    lines.append(f"        - {sub}")

    with open(os.path.join(STAGED, "taxonomy.json"), "w", encoding="utf-8") as f:
        json.dump(flat, f, indent=2, ensure_ascii=False)

    header = [
        "SYSTEM MANAGER TAGGING TAXONOMY",
        "",
        "Tag every question to exactly one (paper, unit, sub) triple below.",
        "`sub` MUST be copied VERBATIM — it is matched by string equality against",
        "the concept guide, so a paraphrase links to nothing. Section headings in",
        "[brackets] are context only; never use one as `sub`.",
        f"",
        f"{len(flat)} leaf subtopics across {len(syl['papers'])} papers.",
    ]
    with open(os.path.join(STAGED, "taxonomy.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(header + lines) + "\n")

    print(f"exported {len(flat)} leaf subtopics")
    for p in syl["papers"]:
        n = sum(1 for r in flat if r["paper"] == p["id"])
        print(f"  {p['id']:<6} {n:>3} leaves")
    print(f"\n  {os.path.relpath(os.path.join(STAGED, 'taxonomy.json'), os.getcwd())}")
    print(f"  {os.path.relpath(os.path.join(STAGED, 'taxonomy.txt'), os.getcwd())}")


if __name__ == "__main__":
    main()
