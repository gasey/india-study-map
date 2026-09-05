#!/usr/bin/env python3
"""Generate per-leaf authoring briefs for a TECH2 depth pass, for any unit.

    python3 tools/system-analyst-build/make_depth_briefs.py \
        --unit 1 --target 18 --outdir tools/system-analyst-build/staged/tech2-u1-gen2 \
        --srckey GEN-TECH2-U1D2 --idprefix GEN-T2U1B

Replaces the one-script-per-batch pattern (make_u1_briefs.py was the third
near-copy). The unit's verbatim notification text lives in
`staged/syllabus-verbatim.json`, so a new batch needs no new code.

WHY A BATCH MANIFEST. Each batch writes `_batch.json` into its own directory
holding srcKey, id prefix, sitting label and provenance. `import_depth_gen.py`
reads it, so a second batch on the same unit cannot silently reuse the first
batch's ids — the id prefix is data, not a constant recompiled per script. The
U1 batch-1 ids are GEN-T2U1-001..068; a batch-2 run must not collide with them.

EXISTING STEMS. Every brief carries every existing stem in the unit — not just
its own leaf's — because the commonest duplication failure is two adjacent
leaves reaching the same fact from opposite sides. That is exactly how
GEN-T2U4-006 duplicated GEN-T2U4-014: different sub-topic tags, so neither
author could see the other's work.

PRIORITY CONCEPTS. `--priority` marks syllabus phrases the unit currently
under-covers, measured by a keyword sweep over existing question text rather
than guessed. A leaf at 12 questions can still leave a named syllabus phrase on
one question, which is coverage on paper and a gap in practice.
"""

import argparse
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
SYLLABUS = ROOT / "tools/system-analyst-build/staged/pe2018-p3/_syllabus-2026.json"
VERBATIM = ROOT / "tools/system-analyst-build/staged/syllabus-verbatim.json"

LANGUAGE = {
    "1": ("Write in C++ unless a question is genuinely language-neutral. The syllabus is "
          "explicitly C++ (operator overloading, virtual functions, pointers to object, I/O "
          "streams, file handling), and every existing Unit 1 question is C++. Do not write a "
          "question whose answer would differ in Java or Python without the stem naming the "
          "language."),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--unit", required=True)
    ap.add_argument("--target", type=int, required=True)
    ap.add_argument("--outdir", required=True)
    ap.add_argument("--srckey", required=True)
    ap.add_argument("--idprefix", required=True)
    ap.add_argument("--sitting", default=None)
    ap.add_argument("--priority", default="",
                    help="semicolon-separated syllabus phrases this batch should prioritise")
    args = ap.parse_args()

    unit = args.unit
    syl = json.loads(SYLLABUS.read_text())["TECH2"][unit]
    leaves = syl["subtopics"]
    verb = json.loads(VERBATIM.read_text())[unit]

    src = BANK.read_text()
    bank = json.loads(src[src.index("["):src.rindex("]") + 1])
    existing = [q for q in bank
                if q.get("paper") == "TECH2" and str(q.get("unit")) == unit]

    # A batch must not reuse an id prefix already present in the bank.
    if any(str(q.get("id", "")).startswith(args.idprefix + "-") for q in bank):
        raise SystemExit("id prefix %r is already used in the bank — pick another"
                         % args.idprefix)

    have = Counter(q["sub"] for q in existing)
    stems = [{"leaf": q.get("sub"), "q": q["q"],
              "ans_text": (q.get("opts") or {}).get(q.get("ans"), "")}
             for q in existing]
    priority = [p.strip() for p in args.priority.split(";") if p.strip()]

    out = Path(args.outdir)
    out.mkdir(parents=True, exist_ok=True)

    sitting = args.sitting or ("Authored practice — Technical Paper II depth pass (%s)"
                               % verb["title"])
    (out / "_batch.json").write_text(json.dumps({
        "unit": unit,
        "srcKey": args.srckey,
        "idPrefix": args.idprefix,
        "sitting": sitting,
        "target_per_leaf": args.target,
    }, indent=1, ensure_ascii=False) + "\n")

    total = 0
    for i, leaf in enumerate(leaves, 1):
        need = args.target - have.get(leaf, 0)
        if need <= 0:
            print("L%02d already at %d — skipped" % (i, have.get(leaf, 0)))
            continue
        slug = "U%sX-L%02d" % (unit, i)
        (out / ("%s.brief.json" % slug)).write_text(json.dumps({
            "slug": slug,
            "unit": unit,
            "unit_title": verb["title"],
            "marks": verb["marks"],
            "leaf": leaf,
            "need": need,
            "already_on_this_leaf": have.get(leaf, 0),
            "target_per_leaf": args.target,
            "language": LANGUAGE.get(unit, ""),
            "priority_concepts": priority,
            "verbatim_syllabus": verb["verbatim"],
            "verbatim_syllabus_ocr_notes": verb.get("ocr_notes", []),
            "existing_stems": stems,
        }, indent=1, ensure_ascii=False) + "\n")
        total += need
        print("%s  need %2d  (have %2d)  %s" % (slug, need, have.get(leaf, 0), leaf[:58]))

    print("\n%d questions to author; unit %s: %d -> %d"
          % (total, unit, len(existing), len(existing) + total))


if __name__ == "__main__":
    main()
