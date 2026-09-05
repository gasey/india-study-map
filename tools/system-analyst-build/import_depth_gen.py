#!/usr/bin/env python3
"""Import any TECH2 depth-pass batch described by a `_batch.json` manifest.

    python3 tools/system-analyst-build/import_depth_gen.py \
        --dir tools/system-analyst-build/staged/tech2-u1-gen2 [--dry-run]

Generalises import_tech2_u2u4_gen.py and import_tech2_u1_gen.py, which had
diverged into near-copies. Batch identity (srcKey, id prefix, sitting) comes
from the manifest, so a second batch on the same unit cannot inherit the first
batch's ids by construction.

PROVENANCE IS DERIVED, NOT TYPED. The U2/U4 batch's prov says no MPSC paper has
ever examined those units, which is true of them and FALSE of Unit 1 — four past
questions sit on Unit 1 leaves. Copying that sentence into a Unit 1 import would
have printed a false claim under every answer. So this script counts the unit's
actual `src == 'past'` records and writes the sentence that matches. A fact the
bank can check itself should never be a constant someone remembers to edit.

THE ID GATE. Reviewer flags are keyed by the id the reviewer saw. Authors do not
write ids, so if records reach the review gate without them the set of fixable
ids is empty and ANY flag is unresolvable — a gate that cannot be satisfied,
which is indistinguishable from a gate being strict. That bug shipped once here.
Ids must be stamped before import, a flag naming an unknown id is rejected, and
a stamped id disagreeing with the derived id is a hard stop rather than a silent
rekey onto a neighbouring question.
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
SYLLABUS = ROOT / "tools/system-analyst-build/staged/pe2018-p3/_syllabus-2026.json"


def die(msg):
    print("FAIL: " + msg, file=sys.stderr)
    sys.exit(1)


def load_bank():
    text = BANK.read_text()
    a, b = text.index("["), text.rindex("]") + 1
    return text[:a], json.loads(text[a:b]), text[b:]


def provenance(unit, title, bank, leaves):
    """Write the provenance sentence the bank's own contents support."""
    past = [q for q in bank if q.get("paper") == "TECH2"
            and str(q.get("unit")) == unit and q.get("src") == "past"]
    if past:
        gap = ("while a handful of past questions in this bank do touch it, %d across %d "
               "syllabus leaves is nowhere near enough to practise from" % (len(past), len(leaves)))
    else:
        gap = ("no MPSC paper for this post has ever examined it: the 2026 syllabus naming it "
               "is newer than every past paper held here, so there is nothing to extract")
    return (
        "Authored practice question — MPSC did not ask this. %s is %s of Technical Paper II's "
        "200 marks, and %s. So the depth is authored rather than recovered, and there is no "
        "official key for it. Written against the verbatim unit text of MPSC's notification "
        "(File No. A-12038/68/2025-ICT), then checked by two independent adversarial reviewers "
        "who each worked blind and tried to refute it." % (title, "40 marks" if unit in ("1", "4")
                                                           else "60 marks", gap)
    ), (
        "Authored practice question, not an MPSC exam question. It was written to give this "
        "unit practisable depth, not recovered from a past paper."
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    GEN = Path(args.dir).resolve()
    man_path = GEN / "_batch.json"
    if not man_path.exists():
        die("no _batch.json in %s — this is not a depth-pass batch directory" % GEN)
    man = json.loads(man_path.read_text())
    unit, src_key, id_prefix = man["unit"], man["srcKey"], man["idPrefix"]

    syl = json.loads(SYLLABUS.read_text())["TECH2"][unit]
    leaves = syl["subtopics"]

    briefs = sorted(GEN.glob("*.brief.json"))
    if not briefs:
        die("no brief files in %s" % GEN)

    records, problems = [], []
    for bp in briefs:
        b = json.loads(bp.read_text())
        slug, leaf, need = b["slug"], b["leaf"], b["need"]
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
            problems.append("%s: expected a JSON array" % slug)
            continue
        if len(batch) != need:
            problems.append("%s: wrote %d questions, brief asked for %d" % (slug, len(batch), need))
        for i, q in enumerate(batch, 1):
            tag = "%s#%d" % (slug, i)
            for f in ("sub", "q", "opts", "ans", "exp"):
                if not q.get(f):
                    problems.append("%s: missing field '%s'" % (tag, f))
            if q.get("sub") != leaf:
                problems.append("%s: sub %r is not this brief's leaf (must match "
                                "character-for-character)" % (tag, q.get("sub")))
            elif q["sub"] not in leaves:
                problems.append("%s: sub %r is not a leaf of unit %s" % (tag, q["sub"], unit))
            opts = q.get("opts") or {}
            if sorted(opts) != ["A", "B", "C", "D"]:
                problems.append("%s: options must be exactly A-D, got %s" % (tag, sorted(opts)))
            elif len({str(v).strip().lower() for v in opts.values()}) != 4:
                problems.append("%s: duplicate option text" % tag)
            elif all(str(opts[k]).strip().lower() == k.lower() for k in opts):
                problems.append("%s: options are just the letters — corruption shape" % tag)
            if q.get("ans") not in opts:
                problems.append("%s: ans %r is not one of its own options" % (tag, q.get("ans")))
            for k, v in opts.items():
                if re.search(r"\b(all|none) of the above\b", str(v), re.I):
                    problems.append("%s: option %s uses 'all/none of the above'" % (tag, k))
            records.append({"_slug": slug, **q})

    if problems:
        die("%d problem(s) — nothing written:\n  - %s" % (len(problems), "\n  - ".join(problems)))

    prefix, bank, suffix = load_bank()

    norm = lambda s: " ".join(str(s).split()).strip().lower()
    seen = {}
    for r in records:
        k = norm(r["q"])
        if k in seen:
            die("duplicate stem between %s and %s: %r" % (seen[k], r["_slug"], r["q"][:80]))
        seen[k] = r["_slug"]
    bank_stems = {norm(q.get("q") or "") for q in bank}
    clash = [r["q"][:90] for r in records if norm(r["q"]) in bank_stems]
    if clash:
        die("%d authored stem(s) already exist in the bank:\n  - %s"
            % (len(clash), "\n  - ".join(clash)))

    unstamped = sorted({r["_slug"] for r in records if not r.get("id")})
    if unstamped:
        die("%d question(s) carry no id, so reviewer flags cannot be matched to them "
            "(leaves: %s). Run:\n  python3 tools/system-analyst-build/stamp_depth_ids.py "
            "--dir %s" % (len(unstamped), ", ".join(unstamped), GEN))
    known = {r["id"] for r in records}

    reviews = sorted(GEN.glob("review-*.json"))
    if len(reviews) < 2:
        die("found %d review file(s) in %s; this import requires two independent adversarial "
            "reviews. Authored content has no key to check against, so the review is the only "
            "guard there is." % (len(reviews), GEN))

    flagged = {}
    for rp in reviews:
        try:
            data = json.loads(rp.read_text())
        except json.JSONDecodeError as e:
            die("%s is not valid JSON (%s)" % (rp.name, e))
        for fl in data.get("flags", []):
            if fl.get("id") not in known:
                die("%s flags id %r, which is not one of the %d authored questions."
                    % (rp.name, fl.get("id"), len(known)))
            flagged.setdefault(fl["id"], []).append((rp.name, fl))

    fixed = {r["id"] for r in records if r.get("reviewFix")}
    unresolved = ["%s flagged by %s (%s): %s"
                  % (qid, ", ".join(n for n, _ in fls), fls[0][1].get("type"),
                     fls[0][1].get("detail", "")[:160])
                  for qid, fls in flagged.items() if qid not in fixed]
    if unresolved:
        die("%d reviewer flag(s) have no recorded reviewFix on the question they flagged.\n"
            "An adversarial pass whose findings can be ignored is theatre, so this is a hard "
            "stop. Resolve each, record it in 'reviewFix', then re-run:\n  - %s"
            % (len(unresolved), "\n  - ".join(unresolved)))

    PROV, NOTE = provenance(unit, syl.get("title", "This unit"), bank, leaves)
    existing_ids = {q["id"] for q in bank}
    counter, out = 0, []
    for r in sorted(records, key=lambda x: (x["_slug"],)):
        counter += 1
        qid = "%s-%03d" % (id_prefix, counter)
        if qid in existing_ids:
            die("id collision: %s already in the bank" % qid)
        if r["id"] != qid:
            die("id drift: %r was reviewed as %s but would import as %s — a fix recorded "
                "against the old id would land on the wrong question."
                % (r["q"][:60], r["id"], qid))
        out.append({
            "id": qid, "src": "generated", "sitting": man["sitting"], "srcKey": src_key,
            "no": counter, "paper": "TECH2", "unit": unit, "sub": r["sub"], "q": r["q"],
            "opts": r["opts"], "ans": r["ans"], "exp": r["exp"],
            "conf": r.get("conf", "high"), "prov": PROV, "note": NOTE,
            **({"reviewFix": r["reviewFix"]} if r.get("reviewFix") else {}),
        })

    print("authored questions ready : %d" % len(out))
    print("  batch / id prefix      : %s / %s" % (src_key, id_prefix))
    print("  answer spread          : %s" % dict(sorted(Counter(q["ans"] for q in out).items())))
    print("  reviews consumed       : %s" % ", ".join(r.name for r in reviews))
    print("  flags resolved         : %d" % len(flagged))
    print("  provenance             : %s..." % PROV[:96])

    if args.dry_run:
        print("\n--dry-run: bank not written")
        return

    BANK.write_text(prefix + json.dumps(bank + out, indent=1, ensure_ascii=False) + suffix)
    print("\nbank %d -> %d records" % (len(bank), len(bank) + len(out)))


if __name__ == "__main__":
    main()
