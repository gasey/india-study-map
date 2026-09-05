#!/usr/bin/env python3
"""
Import the Informatics Officer Technical Paper II, November 2024 into the
System Manager build.

WHY AN INFORMATICS OFFICER PAPER IS HERE. BUILD_GUIDE.md §2 rules Informatics
Officer papers out of this build as "too hard". That is right about Technical
Paper I — CS theory: addressing modes, OSPF, UML, spanning tree — and it is
wrong about Technical Paper II, which is an e-Governance / IT-governance /
IT-procurement paper at conceptual difficulty. It lands on TECH2 Units IV and
V, the two thinnest sections in the build, where before this every question was
authored because no past paper covered them.

WHY IT IS WORTH THE TROUBLE. MPSC published a final answer key for it. Every
other past question in this app is a Computer Operator paper answered by
derivation, because the Commission never published a key for any Computer
Operator sitting. These are the first past questions in the System Manager bank
whose answers are the Commission's own.

PIPELINE

    render_pages.py                 -> pages/IO2024-P2-01..11.png  (200dpi)
    vision pass, 4 agents           -> staged/io2024-p2-part-{a,b,c,d}.json
      (EXTRACT_BRIEF_IO2024.md; transcribes AND answers blind)
    hand transcription of both keys -> staged/io2024-p2-key.json
    two independent mapping passes  -> staged/io2024-p2-map-pass{1,2}.json
    THIS SCRIPT                     -> extracted/IO2024-P2.json
                                       staged/io2024-p2-manifest.json
    assemble.py                     -> public/mpsc-system-manager/data/questions.js

WHAT THIS SCRIPT ENFORCES

  * All 100 questions present, contiguous 1-100, no duplicates. This is the
    check the 2026-08-04 silent-loss incident exists to make non-optional: an
    extractor dropped ~280 questions with no numbering gap to reveal it.
  * Every shipped tag is a real (TECH2, unit, sub) triple from taxonomy.json.
  * Only questions BOTH mapping passes independently put on the syllabus ship.
    Where the passes disagree at all -- on/off, or on which leaf -- the question
    is held back and listed in the manifest for a human call. Importing a
    harder post's paper into this syllabus is exactly the judgement worth being
    conservative about, and a disagreement is the signal that it was a close
    one.
  * Nothing is dropped silently. Every question not shipped is written to
    staged/io2024-p2-manifest.json with the reason.

Usage:  python3 tools/system-manager-build/import_io2024_p2.py
"""

import json
import os
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
EXTRACTED = os.path.join(HERE, "extracted")

SRCKEY = "IO2024-P2"
EXPECT = 100
PAPER = "TECH2"

# Questions both mapping passes agreed were on-syllabus, that a human review on
# 2026-09-06 nevertheless rejected. The passes are good at "is this subject on
# the syllabus"; they were over-eager about which LEAF, and a question filed
# under a leaf it does not actually test is worse than a missing one -- it
# teaches the reader that the leaf means something it does not.
#
# The tell for the Software Asset Management block: that leaf's own authored
# questions are licence-compliance ("40 licences installed on 55 computers").
# These five are about open-source vs proprietary licensing as a philosophy,
# which is a different subject wearing similar words.
REVIEW_EXCLUDE = {
    71: "open-source popularity — licensing philosophy, not Software Asset Management",
    72: "copyleft redistribution terms — licensing law, not Software Asset Management",
    73: "proprietary vs open-source licensing models — not Software Asset Management",
    76: "definition of FOSS — licensing terminology, not Software Asset Management",
    77: "support risk of OSS in e-Governance — procurement opinion, not asset management",
    94: "near-duplicate of Q93; both ask which contract head covers Force Majeure",
}


def load(name):
    path = os.path.join(STAGED, name)
    if not os.path.isfile(path):
        sys.exit(f"FAIL: missing {os.path.relpath(path)}")
    return json.load(open(path, encoding="utf-8"))


def main():
    # --- the transcription, reassembled from the four page-range passes ---
    questions = []
    for part in "abcd":
        questions.extend(load(f"io2024-p2-part-{part}.json"))
    questions.sort(key=lambda q: q["no"])

    nos = [q["no"] for q in questions]
    if sorted(nos) != list(range(1, EXPECT + 1)):
        dupes = sorted({n for n, c in Counter(nos).items() if c > 1})
        missing = [n for n in range(1, EXPECT + 1) if n not in set(nos)]
        sys.exit(f"FAIL: expected contiguous 1-{EXPECT}; missing={missing} dupes={dupes}")

    # --- MPSC's key, and what the blind pass made of the same questions ---
    key = load("io2024-p2-key.json")
    final, compensated = key["final"], set(key.get("compensated", []))

    agree, disagree = 0, []
    for q in questions:
        official = final.get(str(q["no"]))
        if official is None:
            continue
        if q["ans"] == official:
            agree += 1
        else:
            disagree.append((q["no"], q["ans"], official, q.get("conf")))

    # A wrong option-column order would scatter disagreements across questions
    # the pass was SURE of. Disagreements concentrated in its own low/medium
    # flags mean the transcription is sound and the questions are just hard.
    hi_conf_disagree = [d for d in disagree if d[3] == "high"]

    # --- the two independent syllabus mappings ---
    p1, p2 = load("io2024-p2-map-pass1.json"), load("io2024-p2-map-pass2.json")
    for name, m in (("pass1", p1), ("pass2", p2)):
        got = sorted(int(k) for k in m)
        if got != list(range(1, EXPECT + 1)):
            sys.exit(f"FAIL: {name} does not classify exactly 1-{EXPECT}")

    tax = {(r["paper"], str(r["unit"]), r["sub"])
           for r in load("taxonomy.json") if r["paper"] == PAPER}

    ship, held = [], []
    for q in questions:
        k = str(q["no"])
        a, b = p1[k], p2[k]
        a_on, b_on = "off_syllabus" not in a, "off_syllabus" not in b

        if not a_on and not b_on:
            held.append({**q, "_reason": "off_syllabus",
                         "_detail": f"both passes agree this is off the System Manager "
                                    f"syllabus. pass1: {a['off_syllabus']} "
                                    f"pass2: {b['off_syllabus']}"})
            continue
        if a_on != b_on:
            on, off = (a, b) if a_on else (b, a)
            held.append({**q, "_reason": "mapping_disagreement_on_off",
                         "_detail": f"one pass placed this at {on['unit']}/{on['sub']!r}, "
                                    f"the other called it off-syllabus: "
                                    f"{off['off_syllabus']}"})
            continue
        if (a["unit"], a["sub"]) != (b["unit"], b["sub"]):
            held.append({**q, "_reason": "mapping_disagreement_leaf",
                         "_detail": f"both passes say on-syllabus but disagree on where: "
                                    f"{a['unit']}/{a['sub']!r} vs {b['unit']}/{b['sub']!r}"})
            continue

        if q["no"] in REVIEW_EXCLUDE:
            held.append({**q, "_reason": "rejected_on_review",
                         "_detail": f"both passes mapped this to {a['unit']}/{a['sub']!r}, "
                                    f"but human review rejected it: "
                                    f"{REVIEW_EXCLUDE[q['no']]}"})
            continue

        triple = (PAPER, str(a["unit"]), a["sub"])
        if triple not in tax:
            sys.exit(f"FAIL: Q{q['no']} tagged {triple} which is not a TECH2 taxonomy leaf")

        rec = {k2: q[k2] for k2 in ("no", "q", "opts", "ans", "conf", "exp",
                                    "needs_figure", "page")}
        rec["unit"], rec["sub"] = str(a["unit"]), a["sub"]
        ship.append(rec)

    # Q52 stays in `ship` if it mapped cleanly. assemble.py sets its answer from
    # the key -- which is null, because MPSC compensated it -- and its own
    # quarantine rule then holds it back for having no usable answer. That is
    # the honest outcome and it is recorded in staged/quarantine.json, so it is
    # flagged here rather than dropped here.
    comp_shipped = sorted(r["no"] for r in ship if r["no"] in compensated)

    # A REVIEW_EXCLUDE entry that never fires is a claim about this import that
    # is no longer true -- the mapping changed under it, or the number was wrong
    # to begin with. Either way it now documents a decision the build is not
    # making, which is how a file starts lying about itself. Fail loudly.
    fired = {h["no"] for h in held if h["_reason"] == "rejected_on_review"}
    stale = sorted(set(REVIEW_EXCLUDE) - fired)
    if stale:
        sys.exit(f"FAIL: REVIEW_EXCLUDE names Q{stale} but the mapping no longer "
                 f"proposes them for shipping — re-review and remove the entries")

    os.makedirs(EXTRACTED, exist_ok=True)
    out = os.path.join(EXTRACTED, f"{SRCKEY}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(ship, f, indent=1, ensure_ascii=False)
        f.write("\n")

    manifest = {
        "_comment": [
            "Every one of the paper's 100 questions is accounted for here: those",
            "that shipped, and those held back with the reason. Nothing is dropped",
            "silently -- a held question can be revisited, an invisible one cannot.",
            "",
            "'(X of 100)' is the only honest way to describe this import, and this",
            "file is what backs that claim.",
        ],
        "srcKey": SRCKEY,
        "source_paper_questions": EXPECT,
        "shipped": len(ship),
        "held": len(held),
        "blind_vs_official_key": {
            "_comment": "The vision pass answered every question WITHOUT seeing the "
                        "key; this is that answer set scored against MPSC's. It "
                        "measures the transcription, not the reader's exam.",
            "scored": agree + len(disagree),
            "agreed": agree,
            "disagreed": len(disagree),
            "disagreements": [{"no": n, "blind": bl, "official": of, "blind_conf": c}
                              for n, bl, of, c in disagree],
            "high_confidence_disagreements": len(hi_conf_disagree),
        },
        "compensated_questions_shipped_answerless": comp_shipped,
        "held_questions": [
            {"no": h["no"], "reason": h["_reason"], "detail": h["_detail"],
             "q": h["q"][:160]}
            for h in sorted(held, key=lambda h: h["no"])
        ],
    }
    with open(os.path.join(STAGED, "io2024-p2-manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # --- report ---
    print(f"transcription : {len(questions)} questions, contiguous 1-{EXPECT}")
    print(f"blind vs key  : {agree}/{agree + len(disagree)} agree "
          f"({len(disagree)} disagree, {len(hi_conf_disagree)} of them high-confidence)")
    if hi_conf_disagree:
        print("  WARNING: a high-confidence disagreement can mean the options were")
        print("  transcribed out of column order. Check these against the scan:")
        for n, bl, of, _ in hi_conf_disagree:
            print(f"    Q{n}: blind={bl} key={of}")
    print(f"\nshipped       : {len(ship)} of {EXPECT} -> {os.path.relpath(out)}")
    per_unit = Counter(r["unit"] for r in ship)
    for u in sorted(per_unit):
        print(f"  unit {u:<4} {per_unit[u]:>3}")
    print(f"\nheld back     : {len(held)}")
    for reason, n in Counter(h["_reason"] for h in held).most_common():
        print(f"  {reason:<32} {n:>3}")
    if comp_shipped:
        print(f"\nnote: Q{comp_shipped} mapped on-syllabus but MPSC compensated it; "
              f"assemble.py\n      will quarantine it for having no official answer.")
    print(f"\nmanifest      : staged/io2024-p2-manifest.json")
    print("NEXT: python3 tools/system-manager-build/assemble.py")


if __name__ == "__main__":
    main()
