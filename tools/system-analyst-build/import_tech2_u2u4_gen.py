#!/usr/bin/env python3
"""Import the TECH2 Unit 2 / Unit 4 depth pass into the System Analyst bank.

    python3 tools/system-analyst-build/import_tech2_u2u4_gen.py [--dry-run]

WHAT THIS IMPORTS, AND WHY IT IS AUTHORED. Technical Paper II Units 2 (Web
Technologies, 60 marks) and 4 (Cloud Computing, 40 marks) are 100 of the paper's
200 marks and **no MPSC paper has ever examined them**. That is not a gap in the
extraction pipeline: the syllabus naming Kubernetes, OWASP and Model Context
Protocol is from 2026, and a scan of all 1488 past-paper records in this bank
finds 4 questions mentioning any web term (2 of them in a General Studies paper)
and *zero* mentioning cloud at all. Extraction cannot reach content that was
never printed, so these 100 marks can only be authored.

The 2026-09-04 pass closed every bare leaf at 3 questions each. This pass takes
Units 2 and 4 to a target of 12 per leaf, which is the first depth pass either
unit has had.

SOURCE OF TRUTH FOR THE SYLLABUS. Authors were given the **verbatim unit text
from MPSC's notification** (File No. A-12038/68/2025-ICT,
`~/workspace/projects/personal/syllabusex.pdf`, sha256 `8b6619681c078ea3bbd4...`)
rather than the subtopic labels alone, so questions are written against the words
MPSC will set from. That PDF's text layer has OCR damage in exactly the places
that matter -- `Kubemetes`, `CSRE` for CSRF, `Apls` for APIs, `Polymoxphism` --
and those normalisations were stated in the prompts so no author had to guess.

WHY THE REVIEW IS A BUILD DEPENDENCY. Authored content has no source of truth:
a past-paper import can be diffed against the printed paper, but if the author of
an authored question is wrong, nothing else in the pipeline disagrees. So every
question goes to two independent adversarial reviewers working blind, and this
script REFUSES TO IMPORT while any reviewer flag lacks a recorded `reviewFix` on
the question it flagged. An adversarial pass whose findings can be ignored
silently is theatre. Delete the review files and the import fails; add a flag
without resolving it and the import fails.

THEY ARE NOT PAST-PAPER QUESTIONS, AND THE APP ENFORCES THAT. Records carry
`src: 'generated'`. Past Papers groups only `src === 'past'` (app.js ~1229), and
any non-past record renders a "practice" pill instead of a sitting name (~2196),
so these cannot be mistaken for questions MPSC actually asked.
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GEN = ROOT / "tools/system-analyst-build/staged/tech2-u2u4-gen"
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
SYLLABUS = ROOT / "tools/system-analyst-build/staged/pe2018-p3/_syllabus-2026.json"

SRC_KEY = "GEN-TECH2-U2U4"
SITTING = "Authored practice — Technical Paper II depth pass (Web Technologies & Cloud Computing)"

PROV = (
    "Authored practice question — MPSC did not ask this. Technical Paper II Units 2 "
    "(Web Technologies) and 4 (Cloud Computing) are 100 of that paper's 200 marks and no "
    "MPSC paper for this post has ever examined them: the 2026 syllabus that names them "
    "is newer than every past paper held here, so there is no official key and nothing to "
    "extract. Written against the verbatim unit text of MPSC's notification "
    "(File No. A-12038/68/2025-ICT), then checked by two independent adversarial reviewers "
    "who each worked blind and tried to refute it."
)
NOTE = (
    "Authored practice question, not an MPSC exam question. Unit 2 and Unit 4 of the 2026 "
    "syllabus have no past-paper coverage anywhere in this bank, so every question on them "
    "is authored rather than recovered."
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
                # The exact-leaf rule is what links a question to the syllabus tree;
                # a paraphrase silently links to nothing.
                problems.append("%s: sub %r is not this brief's leaf (must match character-for-character)"
                                % (tag, q.get("sub")))
            elif q["sub"] not in leaves:
                problems.append("%s: sub %r is not a leaf of TECH2 unit %s" % (tag, q["sub"], unit))
            opts = q.get("opts") or {}
            if sorted(opts) != ["A", "B", "C", "D"]:
                problems.append("%s: options must be exactly A-D, got %s" % (tag, sorted(opts)))
            elif len({str(v).strip().lower() for v in opts.values()}) != 4:
                problems.append("%s: duplicate option text" % tag)
            elif all(str(opts[k]).strip().lower() == k.lower() for k in opts):
                # Guards the 2026-09-05 corruption shape {"A":"A","B":"B",...}, which
                # passes every "keys are A-D, non-empty, distinct" check.
                problems.append("%s: options are just the letters — extraction corruption shape" % tag)
            if q.get("ans") not in opts:
                problems.append("%s: ans %r is not one of its own options" % (tag, q.get("ans")))
            for k, v in opts.items():
                if re.search(r"\b(all|none) of the above\b", str(v), re.I):
                    problems.append("%s: option %s uses 'all/none of the above'" % (tag, k))
            records.append({"_slug": slug, "unit": unit, **q})

    # Structural faults are reported before the review gate: a malformed batch
    # is the author's to fix and should not need two reviews to surface.
    if problems:
        die("%d problem(s) — nothing written:\n  - %s" % (len(problems), "\n  - ".join(problems)))

    # ---- the review gate --------------------------------------------------
    reviews = sorted(GEN.glob("review-*.json"))
    if len(reviews) < 2:
        die("found %d review file(s) in %s; this import requires two independent "
            "adversarial reviews. Authored content has no key to check against, so the "
            "review is the only guard there is." % (len(reviews), GEN))

    # Flags are keyed by the id the reviewer saw, so every record must carry the
    # id it will be imported under. Authors do not write ids; stamp_u2u4_ids.py
    # does, after proving the stamped ids match the ones the reviewers were shown.
    # Without this the set of fixable ids below is empty and ANY flag becomes
    # permanently unresolvable — a gate that cannot be satisfied, which reads
    # exactly like a gate that is merely strict.
    unstamped = [r["_slug"] for r in records if not r.get("id")]
    if unstamped:
        die("%d question(s) carry no id, so reviewer flags cannot be matched to them "
            "(affected leaves: %s). Run:\n  python3 tools/system-analyst-build/stamp_u2u4_ids.py"
            % (len(unstamped), ", ".join(sorted(set(unstamped)))))

    known_ids = {r["id"] for r in records}

    flagged = {}
    for rp in reviews:
        try:
            data = json.loads(rp.read_text())
        except json.JSONDecodeError as e:
            die("%s is not valid JSON (%s)" % (rp.name, e))
        for fl in data.get("flags", []):
            if fl.get("id") not in known_ids:
                # A mistyped id would otherwise be unresolvable-by-construction,
                # and the error would blame a question that does not exist.
                die("%s flags id %r, which is not one of the %d authored questions. "
                    "Fix the id in the review file." % (rp.name, fl.get("id"), len(known_ids)))
            flagged.setdefault(fl["id"], []).append((rp.name, fl))

    # A flag is resolved only by a recorded reviewFix on the question it names.
    fixed_ids = {q["id"] for q in records if q.get("id") and q.get("reviewFix")}
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

    # ---- assign stable ids, keyed per unit --------------------------------
    prefix, bank, suffix = load_bank()
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
            # The stamped id is the one the reviewers cited and the one any
            # reviewFix was written against. If the derived id has since moved —
            # a leaf renamed, a question added or dropped — importing anyway
            # would silently rekey every fix onto a neighbouring question.
            die("id drift: %r was reviewed as %s but would import as %s. A fix "
                "recorded against the old id would land on the wrong question. "
                "Re-run stamp_u2u4_ids.py and re-check the review files."
                % (r["q"][:60], r["id"], qid))
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
    per_unit = Counter(q["unit"] for q in out)
    print("authored questions ready : %d" % len(out))
    print("  unit 2 (Web)           : %d" % per_unit["2"])
    print("  unit 4 (Cloud)         : %d" % per_unit["4"])
    print("  answer spread          : %s" % dict(sorted(spread.items())))
    print("  reviews consumed       : %s" % ", ".join(r.name for r in reviews))
    print("  flags resolved         : %d" % len(flagged))

    if args.dry_run:
        print("\n--dry-run: bank not written")
        return

    merged = bank + out
    BANK.write_text(prefix + json.dumps(merged, indent=1, ensure_ascii=False) + suffix)
    print("\nbank %d -> %d records" % (len(bank), len(merged)))


if __name__ == "__main__":
    main()
