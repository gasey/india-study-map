#!/usr/bin/env python3
"""
Phase 5 — build the concept study guide (data/concepts.js).

Technical concepts map 1:1 onto the 259 syllabus leaves. General English does NOT:
the official syllabus lists its six components with marks and enumerates no
subtopics at all, so the GE breakdown below is **derived** and every GE concept
is flagged `derived: true` and carries a provenance note. Do not present a
derived breakdown as though it were the official syllabus.

GE units 1 and 2 are the priority: Precis Writing (10 marks) and Letter Writing
(15 marks) are HANDWRITTEN in the real exam. They cannot be drilled as MCQs, so
these concepts are the only place those 25 marks - 6% of the whole exam - are
taught anywhere in the app. They must teach METHOD (structure, ratio, format,
worked examples), not MCQ facts.

  --export [--only GE:1,GE:2]   write authoring batches
  --merge                       validate and write data/concepts.js

Usage:
  python3 tools/system-manager-build/concepts.py --export --only GE:1,GE:2
  # ...agents fill staged/concepts/<name>.todo.json -> .done.json...
  python3 tools/system-manager-build/concepts.py --merge
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
BATCHES = os.path.join(STAGED, "concepts")
ROOT = os.path.dirname(os.path.dirname(HERE))
SYL = os.path.join(ROOT, "public", "mpsc-system-manager", "data", "syllabus.js")
OUT = os.path.join(ROOT, "public", "mpsc-system-manager", "data", "concepts.js")
BATCH_SIZE = 9          # ~2,200 words of prose per batch

# --- DERIVED General English breakdown -------------------------------------
# The official syllabus gives no subtopics for GE. These are authored so the
# Study tab can teach the four MCQ components and, critically, the two
# handwritten ones. Flagged `derived` in the output.
GE_DERIVED = {
    "1": ("Precis Writing", [
        "What a precis is and is not",
        "The one-third rule and word-count discipline",
        "Finding the controlling idea",
        "What to cut: illustration, repetition and rhetoric",
        "Third person and reported speech",
        "Supplying an apt title",
        "A worked precis, start to finish",
    ]),
    "2": ("Letter Writing", [
        "Formal, official and informal letters",
        "The parts of an official letter",
        "Salutations and subscriptions",
        "Subject line, reference and enclosures",
        "Applications and representations",
        "Tone and register in government correspondence",
        "Common letter-writing errors that cost marks",
        "A worked official letter, start to finish",
    ]),
    "3": ("Comprehension of given passages", [
        "How to read an unseen passage under time pressure",
        "Main idea, tone and the author's stance",
        "Inference questions and answering in your own words",
        "Vocabulary-in-context questions",
        "Why lifting sentences verbatim loses marks",
    ]),
    "4": ("Grammar: Parts of Speech", [
        "The eight parts of speech and how to tell them apart",
        "Words that change part of speech with their slot",
        "Identifying the part of speech of an underlined word",
        # Added after reading the tagged questions: the real Unit 4 bank is
        # mostly preposition choice and verb-form gap-fills, and only ~6 of ~28
        # items are parts-of-speech identification. Without these two the
        # majority of the unit's questions have no concept to attach to.
        "Prepositions and their correct use",
        "Verb forms and tense in context",
    ]),
    "5": ("Correct Usage and Vocabularies", [
        "Synonyms and antonyms",
        "One-word substitution",
        "Idioms and phrases",
        "Commonly confused pairs",
        "Spelling and common misspellings",
    ]),
    "6": ("Formation of Sentence", [
        "Simple, compound and complex sentences",
        "Clause types: noun, adjective and adverb",
        "Active and passive voice",
        "Direct and indirect speech",
        "Joining and splitting sentences",
        "Subject-verb agreement and sequence of tenses",
        # Six real marks ask assertive / interrogative / imperative /
        # exclamatory, which none of the structural subtopics covers. Added so
        # those questions have a home rather than being taught as an aside.
        "Sentence types by function: assertive, interrogative, imperative, exclamatory",
    ]),
}


# --- DERIVED technical additions -------------------------------------------
# Two topics the MUDAL syllabus does not enumerate as leaves but that the exam
# demonstrably reaches, so the Study tab has to carry them:
#
#   Number Systems and Data Representation — TECH1 Unit I lists no number-system
#   leaf, and "Functional Components of a Computer" contains no mention of
#   binary, hex, byte or nibble. Yet the 2016 Computer Operator Technical Paper
#   I, which IS this syllabus, asks "A group of four bits is also called"
#   (CO2016A-P1-4), and the syllabus's own closing note says questions may come
#   from other topics prescribed for the post's qualification.
#
#   Normalisation — TECH2 Unit II lists Data Models and ER Modelling but no
#   normalisation leaf, while five normalisation questions (1NF/2NF/3NF/BCNF,
#   transitive dependency) already sit in the shipped bank orphaned under
#   "Relational Database Management System". A 35-mark unit should not teach
#   ER modelling and then leave the reader to meet BCNF for the first time in
#   the exam hall.
#
# Both ship `derived: true` with their own provenance string. Do not present
# them as official — same rule as the General English breakdown above.
TECH_DERIVED = {
    ("TECH1", "I"): ["Number Systems and Data Representation"],
    ("TECH2", "II"): ["Normalisation"],
}

DERIVED_PROV = {
    "GE": ("The official syllabus lists this General English component "
           "with its marks only and enumerates no subtopics. This "
           "breakdown is derived, not official."),
    "TECH": ("The official syllabus does not list this as a subtopic. It is "
             "added because past questions for this post reach it and the "
             "syllabus states that questions may come from other topics "
             "prescribed for the post's educational qualification. Derived, "
             "not official."),
}


def load_syllabus():
    text = open(SYL, encoding="utf-8").read()
    return json.loads(re.search(r"window\.SYLLABUS\s*=\s*(\{.*\});\s*$", text, re.S).group(1))


def all_targets():
    """[(paper, unit, unitTitle, sub, derived)] over the whole syllabus."""
    syl = load_syllabus()
    out = []
    for p in syl["papers"]:
        for u in p["units"]:
            uno = str(u["no"])
            if p["id"] == "GE":
                title, subs = GE_DERIVED.get(uno, (u["title"], []))
                for s in subs:
                    out.append((p["id"], uno, u["title"], s, True))
            else:
                for sec in u.get("sections", []):
                    for s in sec["subtopics"]:
                        out.append((p["id"], uno, u["title"], s, False))
                # Derived technical leaves sit at the end of their unit, so the
                # stable-id ordering below keeps every official concept's id
                # unchanged when one of these is added.
                for s in TECH_DERIVED.get((p["id"], uno), []):
                    out.append((p["id"], uno, u["title"], s, True))
    return out


def do_export(only):
    targets = all_targets()
    if only:
        want = {x.strip() for x in only.split(",")}
        targets = [t for t in targets if f"{t[0]}:{t[1]}" in want]
        if not targets:
            sys.exit(f"FAIL: --only {only!r} matched no targets")

    have = set()
    for path in glob.glob(os.path.join(BATCHES, "*.done.json")):
        for c in json.load(open(path, encoding="utf-8")):
            have.add((c.get("paper"), str(c.get("unit")), c.get("sub")))
    todo = [t for t in targets if (t[0], t[1], t[3]) not in have]

    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    by_unit = {}
    for t in todo:
        by_unit.setdefault((t[0], t[1]), []).append(t)

    written = []
    for (paper, unit), ts in sorted(by_unit.items()):
        for i in range(0, len(ts), BATCH_SIZE):
            chunk = ts[i:i + BATCH_SIZE]
            n = i // BATCH_SIZE + 1
            # Batch numbers are assigned over REMAINING work, so a second export
            # would otherwise reuse a name whose .done.json already exists — and
            # the agent handed that name overwrites finished concepts. Skip past
            # any number already claimed. (Hit for real on TECH2-UV-1, where a
            # re-export handed the business-communication batch the filename
            # holding nine finished IT Governance concepts.)
            while os.path.exists(os.path.join(BATCHES, f"{paper}-U{unit}-{n}.done.json")):
                n += 1
            name = f"{paper}-U{unit}-{n}"
            path = os.path.join(BATCHES, f"{name}.todo.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "paper": paper, "unit": unit, "unitTitle": chunk[0][2],
                    "derived": chunk[0][4],
                    "brief": "tools/system-manager-build/CONCEPT_BRIEF.md",
                    "targets": [{"paper": c[0], "unit": c[1], "unitTitle": c[2],
                                 "sub": c[3]} for c in chunk],
                }, f, indent=2, ensure_ascii=False)
            written.append((name, len(chunk)))

    print(f"{len(todo)} concept(s) to author"
          + (f" ({len(targets) - len(todo)} already done)" if len(targets) != len(todo) else ""))
    for name, n in written:
        print(f"  {name:<16} {n:>2} concepts")
    print(f"\n-> {os.path.relpath(BATCHES, os.getcwd())}/")


def do_merge():
    targets = {(t[0], t[1], t[3]): t for t in all_targets()}
    derived_subs = {(t[0], t[1], t[3]) for t in all_targets() if t[4]}
    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    problems, out, seen = [], [], set()
    for path in done:
        name = os.path.basename(path).replace(".done.json", "")
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{name}: invalid JSON — {e}")
            continue
        for i, c in enumerate(rows, 1):
            tag = f"{name}#{i}"
            key = (c.get("paper"), str(c.get("unit")), c.get("sub"))
            if key not in targets:
                problems.append(f"{tag}: {key} is not a Phase 5 target "
                                f"(sub must match verbatim)")
                continue
            if key in seen:
                problems.append(f"{tag}: duplicate concept for {key}")
                continue
            seen.add(key)

            d, e = (c.get("def") or "").strip(), (c.get("exp") or "").strip()
            words = len((d + " " + e).split())
            if words < 90:
                problems.append(f"{tag}: only {words} words across def+exp (want ~240)")
                continue
            if words > 520:
                problems.append(f"{tag}: {words} words across def+exp — too long (want ~240)")
                continue
            # Detect leftover FORMATTING markup, not element names in prose. The
            # Web Technologies concepts legitimately teach HTML and must be able
            # to write an element name in angle brackets — the app escapes these
            # strings, so it renders as visible text, which is exactly right.
            # Match only CLOSING tags: real markup always has one, prose naming an
            # element never does. Same narrowing already applied in assemble.py
            # after it false-positived on eight Web Technologies explanations.
            for field in ("def", "exp"):
                v = c.get(field) or ""
                if re.search(r"</[a-z]+\s*>", v, re.I):
                    problems.append(f"{tag}: {field} contains HTML formatting markup — "
                                    f"the app escapes it, so tags render literally")
            facts = c.get("facts") or []
            traps = c.get("traps") or []
            if not 2 <= len(facts) <= 8:
                problems.append(f"{tag}: {len(facts)} facts (want 3-6)")
            if not 1 <= len(traps) <= 6:
                problems.append(f"{tag}: {len(traps)} traps (want 2-4)")

            rec = {
                "id": "", "paper": key[0], "unit": key[1],
                "unitTitle": targets[key][2], "sub": key[2],
                "def": d, "exp": e,
                "facts": [str(x).strip() for x in facts],
                "traps": [str(x).strip() for x in traps],
                "mnem": (c.get("mnem") or "").strip(),
            }
            if c.get("rel"):
                rec["rel"] = [str(x).strip() for x in c["rel"]]
            if key in derived_subs:
                rec["derived"] = True
                rec["prov"] = DERIVED_PROV["GE" if key[0] == "GE" else "TECH"]
            out.append(rec)

    # stable ids in syllabus order
    order = {k: i for i, k in enumerate(targets)}
    out.sort(key=lambda c: order[(c["paper"], c["unit"], c["sub"])])
    for i, c in enumerate(out, 1):
        c["id"] = f"c{i}"

    # `rel` targets must exist, else the "Study alongside" chips render empty
    subs = {c["sub"] for c in out}
    for c in out:
        for r in c.get("rel", []):
            if r not in subs:
                problems.append(f"{c['id']} ({c['sub']}): rel {r!r} matches no concept")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* GENERATED by tools/system-manager-build/concepts.py — do not hand-edit.\n"
                "   One record per syllabus subtopic. Records marked `derived: true` are\n"
                "   authored rather than official: the whole General English breakdown (the\n"
                "   syllabus enumerates no GE subtopics), plus the two technical topics in\n"
                "   TECH_DERIVED that past questions reach but the syllabus does not list.\n"
                "   Each carries a `prov` string saying so. */\n")
        f.write("window.CONCEPTS = " + json.dumps(out, indent=2, ensure_ascii=False) + ";\n")

    print(f"wrote {len(out)}/{len(targets)} concepts -> {os.path.relpath(OUT, os.getcwd())}")
    per = Counter((c["paper"], c["unit"]) for c in out)
    for (p, u), n in sorted(per.items()):
        tot = sum(1 for k in targets if k[0] == p and k[1] == u)
        print(f"  {n:>3}/{tot:<3} {p} Unit {u}")
    wc = sum(len((c["def"] + " " + c["exp"]).split()) for c in out)
    print(f"\n  {wc:,} words, mean {wc // max(1, len(out))} per concept")
    nd_ge = sum(1 for c in out if c.get("derived") and c["paper"] == "GE")
    nd_tech = sum(1 for c in out if c.get("derived") and c["paper"] != "GE")
    print(f"  {nd_ge + nd_tech} derived ({nd_ge} General English, {nd_tech} technical)")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems[:40]:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--only", help="restrict to units, e.g. GE:1,GE:2")
    a = ap.parse_args()
    if a.export:
        do_export(a.only)
    elif a.merge:
        do_merge()
    else:
        ap.error("pass --export or --merge")


if __name__ == "__main__":
    main()
