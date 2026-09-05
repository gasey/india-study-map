#!/usr/bin/env python3
"""Import the TECH2 Unit 1 (Object Oriented Programming) depth pass.

    python3 tools/system-analyst-build/import_tech2_u1_gen.py [--dry-run]

WHY THIS IS AUTHORED, AND HOW THAT DIFFERS FROM THE U2/U4 PASS. Unit 1 is 40 of
Technical Paper II's 200 marks across 7 syllabus leaves, and the bank held only
16 questions on it — at 4/1/3/1/1/3/3 per leaf, so three leaves sat at a single
question each. This brings every leaf to 12, matching Unit 4 (also 40 marks,
also 7 leaves).

Unlike Units 2 and 4, **OOP has genuinely been examined**: four past-paper
questions in this bank sit on Unit 1 leaves (`TECH1_CSE_096`, `TECH1_CSE_100`,
`TECH1_CSE_101`, `PE2018_P3_049`). So the provenance text here must NOT repeat
the U2/U4 claim that no MPSC paper has ever covered this material — it has. The
gap is depth, not existence, and saying otherwise would be a false statement
shown to the user under every answer. Those four are past-paper records and are
untouched by this import.

SOURCE OF TRUTH. Authors were given the **verbatim Unit 1 paragraph from MPSC's
notification** (File No. A-12038/68/2025-ICT, `~/workspace/projects/personal/
syllabusex.pdf`, sha256 `8b6619681c078ea3bbd4…`, re-verified before the run),
extracted with pdftotext rather than retyped. Its OCR damage was listed for the
authors rather than silently corrected — `Polymoxphism` for Polymorphism, `I/0`
with a digit zero for I/O, `Function of Overloading` for Function Overloading.
The syllabus wording is unambiguously C++, so the briefs pinned the language.

WHY THE REVIEW IS A BUILD DEPENDENCY. Authored content has no source of truth:
a past-paper import can be diffed against the printed paper, but if the author
of an authored question is wrong, nothing else in the pipeline disagrees. Every
question goes to two independent adversarial reviewers working blind, and this
script REFUSES TO IMPORT while any reviewer flag lacks a recorded `reviewFix`.

THE ID GATE, WHICH THE U2/U4 IMPORTER GOT WRONG. Flags are keyed by the id the
reviewer saw. Authors do not write ids — they are derived here, after the gate
runs — so if records reach the gate without ids, the set of fixable ids is empty
and ANY flag is permanently unresolvable. That bug shipped in the U2/U4 importer
and read exactly like a gate being strict rather than broken. Here the id check
is explicit and up front: records must carry ids (written by stamp_u2u4_ids.py
after it proves they match what reviewers were shown), a flag naming an unknown
id is rejected, and a stamped id that disagrees with the derived id is a hard
stop rather than a silent rekey onto a neighbouring question.

THEY ARE NOT PAST-PAPER QUESTIONS, AND THE APP ENFORCES THAT. Records carry
`src: 'generated'`. Past Papers groups only `src === 'past'` (app.js ~1229), and
any non-past record renders a "practice" pill instead of a sitting name (~2196).
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GEN = ROOT / "tools/system-analyst-build/staged/tech2-u1-gen"
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
SYLLABUS = ROOT / "tools/system-analyst-build/staged/pe2018-p3/_syllabus-2026.json"

SRC_KEY = "GEN-TECH2-U1D"
SITTING = "Authored practice — Technical Paper II depth pass (Object Oriented Programming)"

PROV = (
    "Authored practice question — MPSC did not ask this. Object Oriented Programming is 40 "
    "of Technical Paper II's 200 marks, and while a handful of past questions in this bank "
    "do touch it, four across seven syllabus leaves is nowhere near enough to practise from "
    "— three leaves held a single question each before this pass. So the depth is authored "
    "rather than recovered, and there is no official key for it. Written in C++ against the "
    "verbatim unit text of MPSC's notification (File No. A-12038/68/2025-ICT), then checked "
    "by two independent adversarial reviewers who each worked blind and tried to refute it."
)
NOTE = (
    "Authored practice question, not an MPSC exam question. Unit 1 does have some past-paper "
    "coverage in this bank, but only four questions across seven leaves, so these were "
    "written to give the unit practisable depth."
)


def die(msg):
    print("FAIL: " + msg, file=sys.stderr)
    sys.exit(1)


def load_bank():
    text = BANK.read_text()
    start, end = text.index("["), text.rindex("]") + 1
    return text[:start], json.loads(text[start:end]), text[end:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    syl = json.loads(SYLLABUS.read_text())["TECH2"]
    briefs = sorted(GEN.glob("*.brief.json"))
    if not briefs:
        die("no brief files in %s" % GEN)

    # ---- gather authored questions, one file per syllabus leaf ------------
    records, problems = [], []
    for bp in briefs:
        brief = json.loads(bp.read_text())
        slug, unit, leaf, need = brief["slug"], brief["unit"], brief["leaf"], brief["need"]
        done = GEN / ("%s.done.json" % slug)
        if not done.exists():
            problems.append("%s: no .done.json — author did not finish" % slug)
            continue
        try:
            batch = json.loads(done.read_text())
        except json.JSONDecodeError as e:
            problems.append("%s: .done.json is not valid JSON (%s)" % (slug, e))
            continue
        if not isinstance(batch, list):
            problems.append("%s: expected a JSON array, got %s" % (slug, type(batch).__name__))
            continue
        if len(batch) != need:
            problems.append("%s: wrote %d questions, brief asked for %d" % (slug, len(batch), need))

        leaves = syl[unit]["subtopics"]
        for i, q in enumerate(batch, 1):
            tag = "%s#%d" % (slug, i)
            for f in ("sub", "q", "opts", "ans", "exp"):
                if not q.get(f):
                    problems.append("%s: missing field '%s'" % (tag, f))
            if q.get("sub") != leaf:
                problems.append("%s: sub %r is not this brief's leaf (must match "
                                "character-for-character)" % (tag, q.get("sub")))
            elif q["sub"] not in leaves:
                problems.append("%s: sub %r is not a leaf of TECH2 unit %s" % (tag, q["sub"], unit))
            opts = q.get("opts") or {}
            if sorted(opts) != ["A", "B", "C", "D"]:
                problems.append("%s: options must be exactly A-D, got %s" % (tag, sorted(opts)))
            elif len({str(v).strip().lower() for v in opts.values()}) != 4:
                problems.append("%s: duplicate option text" % tag)
            elif all(str(opts[k]).strip().lower() == k.lower() for k in opts):
                problems.append("%s: options are just the letters — extraction corruption shape" % tag)
            if q.get("ans") not in opts:
                problems.append("%s: ans %r is not one of its own options" % (tag, q.get("ans")))
            for k, v in opts.items():
                if re.search(r"\b(all|none) of the above\b", str(v), re.I):
                    problems.append("%s: option %s uses 'all/none of the above'" % (tag, k))
            records.append({"_slug": slug, "unit": unit, **q})

    # Structural faults are the author's to fix and should not need two reviews
    # to surface, so they are reported before the review gate rather than after.
    if problems:
        die("%d problem(s) — nothing written:\n  - %s" % (len(problems), "\n  - ".join(problems)))

    # ---- duplicate check across the whole batch and against the live bank --
    prefix, bank, suffix = load_bank()
    seen = {}
    for r in records:
        k = " ".join(r["q"].split()).strip().lower()
        if k in seen:
            die("duplicate stem between %s and %s: %r" % (seen[k], r["_slug"], r["q"][:80]))
        seen[k] = r["_slug"]
    bank_stems = {" ".join((q.get("q") or "").split()).strip().lower() for q in bank}
    clashes = [r["q"][:80] for r in records
               if " ".join(r["q"].split()).strip().lower() in bank_stems]
    if clashes:
        die("%d authored stem(s) already exist in the bank:\n  - %s"
            % (len(clashes), "\n  - ".join(clashes)))

    # ---- the id gate ------------------------------------------------------
    unstamped = sorted({r["_slug"] for r in records if not r.get("id")})
    if unstamped:
        die("%d question(s) carry no id, so reviewer flags cannot be matched to them "
            "(affected leaves: %s). Run:\n  python3 tools/system-analyst-build/"
            "stamp_u2u4_ids.py --dir tools/system-analyst-build/staged/tech2-u1-gen"
            % (len(unstamped), ", ".join(unstamped)))
    known_ids = {r["id"] for r in records}

    # ---- the review gate --------------------------------------------------
    reviews = sorted(GEN.glob("review-*.json"))
    if len(reviews) < 2:
        die("found %d review file(s) in %s; this import requires two independent "
            "adversarial reviews. Authored content has no key to check against, so the "
            "review is the only guard there is." % (len(reviews), GEN))

    flagged = {}
    for rp in reviews:
        try:
            data = json.loads(rp.read_text())
        except json.JSONDecodeError as e:
            die("%s is not valid JSON (%s)" % (rp.name, e))
        for fl in data.get("flags", []):
            if fl.get("id") not in known_ids:
                die("%s flags id %r, which is not one of the %d authored questions. "
                    "Fix the id in the review file." % (rp.name, fl.get("id"), len(known_ids)))
            flagged.setdefault(fl["id"], []).append((rp.name, fl))

    fixed_ids = {r["id"] for r in records if r.get("reviewFix")}
    unresolved = []
    for qid, fls in flagged.items():
        if qid not in fixed_ids:
            unresolved.append("%s flagged by %s (%s): %s"
                              % (qid, ", ".join(n for n, _ in fls), fls[0][1].get("type"),
                                 fls[0][1].get("detail", "")[:160]))
    if unresolved:
        die("%d reviewer flag(s) have no recorded reviewFix on the question they flagged.\n"
            "An adversarial pass whose findings can be ignored is theatre, so this is a hard "
            "stop rather than a warning. Resolve each, record the fix in the question's "
            "'reviewFix' field, then re-run:\n  - %s" % (len(unresolved), "\n  - ".join(unresolved)))

    # ---- assign stable ids ------------------------------------------------
    existing = {q["id"] for q in bank}
    counters = Counter()
    out = []
    for r in sorted(records, key=lambda x: (x["unit"], x["_slug"])):
        unit = r["unit"]
        counters[unit] += 1
        qid = "GEN-T2U%s-%03d" % (unit, counters[unit])
        if qid in existing:
            die("id collision: %s already in the bank" % qid)
        if r["id"] != qid:
            die("id drift: %r was reviewed as %s but would import as %s. A fix recorded "
                "against the old id would land on the wrong question. Re-stamp and re-check "
                "the review files." % (r["q"][:60], r["id"], qid))
        out.append({
            "id": qid,
            "src": "generated",
            "sitting": SITTING,
            "srcKey": SRC_KEY,
            "no": counters[unit],
            "paper": "TECH2",
            "unit": unit,
            "sub": r["sub"],
            "q": r["q"],
            "opts": r["opts"],
            "ans": r["ans"],
            "exp": r["exp"],
            "conf": r.get("conf", "high"),
            "prov": PROV,
            "note": NOTE,
            **({"reviewFix": r["reviewFix"]} if r.get("reviewFix") else {}),
        })

    spread = Counter(q["ans"] for q in out)
    per_leaf = Counter(q["sub"] for q in out)
    print("authored questions ready : %d" % len(out))
    print("  answer spread          : %s" % dict(sorted(spread.items())))
    print("  reviews consumed       : %s" % ", ".join(r.name for r in reviews))
    print("  flags resolved         : %d" % len(flagged))
    for leaf, n in sorted(per_leaf.items()):
        print("  %-62s %d" % (leaf[:62], n))

    if args.dry_run:
        print("\n--dry-run: bank not written")
        return

    merged = bank + out
    BANK.write_text(prefix + json.dumps(merged, indent=1, ensure_ascii=False) + suffix)
    print("\nbank %d -> %d records" % (len(bank), len(merged)))


if __name__ == "__main__":
    main()
