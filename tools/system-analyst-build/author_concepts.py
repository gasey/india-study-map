#!/usr/bin/env python3
"""
Author concept-guide entries for syllabus leaves that have no concept at all.

  --export [--paper TECH2] [--unit N]   write authoring batches
  --merge                               validate and write data/concepts.js
  --report                              per-unit concept coverage

WHY THIS EXISTS. `generate.py` authors QUESTIONS for bare leaves. Nothing
authored CONCEPTS -- they were written straight into `concepts.js` by hand, so
when the 30 July 2026 notification replaced Technical Paper II wholesale, the
new paper arrived with 120 questions and **zero** concepts. The Syllabus tab
read "0 concepts" for all four units and the Study pane was empty for a paper
worth 200 marks. Doing that by hand again is how the next syllabus change
produces the same hole.

ONE CONCEPT PER LEAF, WHICH IS THE APP'S CONVENTION AND NOT AN ARBITRARY ONE.
-----------------------------------------------------------------------------
Measured with --report: GE, GS, TECH1_LEGACY, TECH2_LEGACY and TECH3 all run
exactly one concept per syllabus leaf (leaves == concepts, 0 bare, every unit).
**TECH1 is the sole exception** -- 266 concepts across 27 leaves, authored at a
finer granularity than the syllabus ("Sets, subsets, power set, cardinality"
under the leaf "Sets, mappings and relations"), which is why --report shows all
7 of its leaves as bare while it holds 70 concepts for unit 1. Both shapes
render fine; the Study pane lists concepts per UNIT, not per leaf.

This pipeline enforces one-per-leaf because that is what the report counts as
coverage, what the Syllabus tab's "N concepts" line reads against, and what
Calc Lab needs:

    const conceptFor = g => CON.find(c =>
      c.paper === g.paper && String(c.unit) === String(g.unit) && c.sub === g.sub);

That resolver is used ONLY by the Calc Lab generators (`g` is a generator, not
a question -- questions are not concept-linked at all), so a duplicate does not
break the reader's Study pane. It does make one of the two unreachable from a
generator, and it double-counts coverage. Rejecting it is cheap; leave the
invariant in place.

PROGRESS IS KEYED ON paper|unit|sub, NOT ON THE ID.
---------------------------------------------------
    const conceptKey = c => `${c.paper}|${c.unit}|${c.sub}`;

so the reader's "known / learning" state survives any renumbering. That means
ids are free -- but they are still derived from content here rather than
counted, because `generate.py` learned that a running counter renumbers
everything after an insertion (see its `gen_id` comment), and a stable id costs
nothing.

`rel` LINKS BY `sub` STRING, NOT BY ID.
---------------------------------------
    CON.find(x => x.sub === r && x.paper === c.paper && x.unit === c.unit)
      || CON.find(x => x.sub === r && x.paper === c.paper)
      || CON.find(x => x.sub === r)

with a trailing `.filter(Boolean)`. An unresolvable `rel` entry is therefore
dropped SILENTLY and the reader just sees a shorter list of related concepts.
--merge resolves every `rel` against that same three-step chain and rejects the
batch if any entry would vanish.

That resolution runs as a SECOND PASS, after every row has been structurally
validated. It cannot run inline: authors are told to draw `rel` from the unit's
sibling leaves, so in a batch introducing a unit's first concepts, row #1
necessarily points at rows that come later in the same file. Resolving inline
saw only the rows accepted so far, so row #1 could never carry a `rel`, was
rejected, and cascaded to every row referring back to it.

VALIDATE BEFORE WRITING, NEVER AFTER -- same rule as generate.py, for the same
reason: a row that fails validation must not go missing underneath a success
line. Nothing is written while any row is rejected.

IDEMPOTENT. Authored concepts carry `"src": "authored-2026-syllabus"`. --merge
drops every concept bearing that marker and rebuilds them from the batch files,
so the result depends only on what is on disk. The 962 pre-existing concepts
have no such field and are never touched.
"""

import argparse
import glob
import hashlib
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
BATCHES = os.path.join(HERE, "staged", "concepts")
APP = os.path.join(ROOT, "public", "mpsc-system-analyst", "data")

MARKER = "authored-2026-syllabus"
TARGETS_PER_BATCH = 10

# Minimums. Deliberately modest -- they catch a stub, not a short-but-good
# entry. The existing TECH1 concepts run far longer than these.
MIN_DEF, MIN_EXP = 60, 400
MIN_FACTS, MIN_TRAPS = 4, 2


def load(name):
    var = {"concepts": "CONCEPTS", "syllabus": "SYLLABUS", "questions": "QUESTIONS"}[name]
    text = open(os.path.join(APP, f"{name}.js"), encoding="utf-8").read()
    m = re.fullmatch(rf"window\.{var}\s*=\s*(.*);\s*", text, re.S)
    if not m:
        sys.exit(f"FAIL: cannot parse window.{var} out of {name}.js")
    return json.loads(m.group(1))


def save_concepts(data):
    with open(os.path.join(APP, "concepts.js"), "w", encoding="utf-8") as f:
        f.write("window.CONCEPTS = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")


def leaves(syl):
    """(paper, unit, sub) -> unitTitle, in syllabus order."""
    out = {}
    for p in syl["papers"]:
        for u in p["units"]:
            for s in (u.get("subtopics") or []):
                out[(p["id"], str(u["no"]), s)] = u["title"]
    return out


def do_report():
    syl, con = load("syllabus"), load("concepts")
    have = Counter((c["paper"], str(c["unit"])) for c in con)
    print(f"{'unit':<52} {'mk':>3} {'leaves':>6} {'conc':>5} {'bare':>5}")
    for p in syl["papers"]:
        for u in p["units"]:
            subs = u.get("subtopics") or []
            if not subs:
                continue
            defined = {c["sub"] for c in con
                       if c["paper"] == p["id"] and str(c["unit"]) == str(u["no"])}
            bare = [s for s in subs if s not in defined]
            flag = "   <-- BARE" if len(bare) == len(subs) and subs else ""
            print(f"{p['id'] + ' U' + str(u['no']) + ' ' + u['title'][:38]:<52} "
                  f"{u['marks']:>3} {len(subs):>6} {have[(p['id'], str(u['no']))]:>5} "
                  f"{len(bare):>5}{flag}")
    authored = [c for c in con if c.get("src") == MARKER]
    print(f"\n{len(con)} concepts total, {len(authored)} authored by this pipeline")


def do_export(only_paper, only_unit):
    syl, con = load("syllabus"), load("concepts")
    qs = load("questions")
    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    nq = Counter((q["paper"], str(q["unit"]), q.get("sub")) for q in qs if q.get("sub"))
    plan, written = [], []
    for p in syl["papers"]:
        if only_paper and p["id"] != only_paper:
            continue
        for u in p["units"]:
            if only_unit and str(u["no"]) != str(only_unit):
                continue
            subs = u.get("subtopics") or []
            if not subs:
                continue
            defined = {c["sub"] for c in con
                       if c["paper"] == p["id"] and str(c["unit"]) == str(u["no"])}
            bare = [s for s in subs if s not in defined]
            if not bare:
                continue
            plan.append((p["id"], u["no"], u["title"], u["marks"], len(subs), len(bare)))

            for i in range(0, len(bare), TARGETS_PER_BATCH):
                chunk = bare[i:i + TARGETS_PER_BATCH]
                bn = i // TARGETS_PER_BATCH + 1
                name = f"{p['id']}-U{u['no']}-{bn}"
                while os.path.exists(os.path.join(BATCHES, f"{name}.done.json")):
                    bn += 1
                    name = f"{p['id']}-U{u['no']}-{bn}"
                path = os.path.join(BATCHES, f"{name}.todo.json")
                with open(path, "w", encoding="utf-8") as f:
                    json.dump({
                        "paper": p["id"], "unit": str(u["no"]),
                        "unitTitle": u["title"], "unitMarks": u["marks"],
                        "brief": "tools/system-analyst-build/CONCEPT_BRIEF.md",
                        # The sibling leaves of the same unit, so an author can
                        # point `rel` at something that exists instead of
                        # guessing a name and having the app silently drop it.
                        "siblingSubtopics": subs,
                        "targets": [{"sub": s, "questionsInBank": nq[(p["id"], str(u["no"]), s)]}
                                    for s in chunk],
                    }, f, indent=2, ensure_ascii=False)
                written.append((name, len(chunk)))

    print(f"{'unit':<50} {'mk':>3} {'leaves':>6} {'bare':>5}")
    for pid, uno, title, marks, nl, nb in plan:
        print(f"{pid + ' U' + str(uno) + ' ' + title[:36]:<50} {marks:>3} {nl:>6} {nb:>5}")
    for name, n in written:
        print(f"  {name}.todo.json  ({n} concept(s))")
    print(f"\n{len(written)} batch(es) -> {os.path.relpath(BATCHES, os.getcwd())}/")
    print(f"total to author: {sum(n for _, n in written)} concepts")


def do_merge(force=False):
    syl, con = load("syllabus"), load("concepts")
    valid = leaves(syl)

    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    before = len(con)
    con = [c for c in con if c.get("src") != MARKER]
    if before != len(con):
        print(f"rebuilding: dropped {before - len(con)} previously authored "
              f"concept(s) before re-applying\n")

    # Every paper|unit|sub already spoken for, and every `sub` that exists
    # anywhere -- the two things `rel` resolution and the one-per-leaf rule
    # need. Both are computed AFTER the drop, so a re-run sees the same world
    # the first run did.
    taken = {(c["paper"], str(c["unit"]), c["sub"]): c.get("id") for c in con}
    # The three lookups app.js tries, in order, when resolving a `rel` entry.
    rel_pu = {(c["paper"], str(c["unit"]), c["sub"]) for c in con}
    rel_p = {(c["paper"], c["sub"]) for c in con}
    rel_any = {c["sub"] for c in con}

    problems, out = [], []
    for path in done:
        name = os.path.basename(path).replace(".done.json", "")
        m = re.match(r"([A-Z0-9_]+)-U([0-9A-D]+)-(\d+)$", name)
        if not m:
            problems.append(f"{name}: cannot parse paper/unit from filename")
            continue
        paper, unit = m.group(1), m.group(2)
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{name}: invalid JSON — {e}")
            continue
        if not isinstance(rows, list):
            problems.append(f"{name}: top level is {type(rows).__name__}, expected a list")
            continue

        for i, r in enumerate(rows, 1):
            tag = f"{name}#{i}"
            sub = r.get("sub")
            key = (paper, unit, sub)
            if key not in valid:
                near = [k[2] for k in valid
                        if k[0] == paper and str(k[2]).lower() == str(sub).lower()]
                hint = f" (case mismatch with {near[0]!r}?)" if near else ""
                problems.append(f"{tag}: sub {sub!r} is not a leaf of {paper} U{unit}{hint}")
                continue
            # One concept per leaf. `conceptFor` uses Array.find, so a second
            # one is unreachable rather than duplicated.
            if key in taken:
                problems.append(f"{tag}: {paper} U{unit} {sub!r} already has a concept "
                                f"({taken[key]}) — a second is unreachable via conceptFor")
                continue

            d, e = (r.get("def") or "").strip(), (r.get("exp") or "").strip()
            if len(d) < MIN_DEF:
                problems.append(f"{tag}: def is {len(d)} chars, minimum {MIN_DEF}")
                continue
            if len(e) < MIN_EXP:
                problems.append(f"{tag}: exp is {len(e)} chars, minimum {MIN_EXP}")
                continue
            facts, traps = r.get("facts"), r.get("traps")
            for fld, val, lo in (("facts", facts, MIN_FACTS), ("traps", traps, MIN_TRAPS)):
                if not isinstance(val, list) or len(val) < lo:
                    problems.append(f"{tag}: {fld} must be a list of at least {lo}, "
                                    f"got {len(val) if isinstance(val, list) else type(val).__name__}")
                    break
            else:
                if any(not str(x).strip() for x in facts + traps):
                    problems.append(f"{tag}: an empty string in facts/traps")
                    continue
                rel = r.get("rel") or []
                if not isinstance(rel, list):
                    problems.append(f"{tag}: rel must be a list")
                    continue
                # `rel` is NOT checked here -- see the second pass below. It
                # cannot be, because a batch's rows legitimately point at each
                # other and only the rows already appended to `out` would be
                # visible at this point.
                taken[key] = tag
                out.append({
                    "_tag": tag,
                    "paper": paper, "unit": unit, "unitTitle": valid[key], "sub": sub,
                    "def": d, "exp": e,
                    "facts": [str(x).strip() for x in facts],
                    "traps": [str(x).strip() for x in traps],
                    "mnem": (r.get("mnem") or "").strip(),
                    "rel": rel,
                })

    # SECOND PASS: `rel` resolution, against the whole post-merge universe.
    #
    # This has to be separate from the loop above. `rel` entries point at
    # sibling leaves of the same unit, and the authors are told to draw them
    # from `siblingSubtopics` -- so in a batch that introduces a unit's first
    # concepts, row #1 necessarily references rows that come after it. Checking
    # `rel` inline resolved only against the rows already appended to `out`,
    # which meant row #1 could never carry a `rel` at all, was rejected, and
    # then cascaded: every later row referring back to it lost its referent too.
    # Both authoring agents for TECH2 U1 and U3 hit this and correctly
    # diagnosed it as a bug here rather than mangling their `rel` lists to work
    # around it.
    #
    # A row rejected in the first pass is NOT in `out`, so it correctly does not
    # count towards resolution -- it will not exist after the merge either.
    pu = rel_pu | {(r["paper"], r["unit"], r["sub"]) for r in out}
    pp = rel_p | {(r["paper"], r["sub"]) for r in out}
    pa = rel_any | {r["sub"] for r in out}
    kept = []
    for r in out:
        dead = [x for x in r["rel"]
                if (r["paper"], r["unit"], x) not in pu
                and (r["paper"], x) not in pp and x not in pa]
        if dead:
            problems.append(f"{r['_tag']}: rel entr{'y' if len(dead) == 1 else 'ies'} "
                            f"{dead!r} resolve to no concept — app.js would drop "
                            f"them silently")
            continue
        kept.append(r)
    out = kept

    if problems and not force:
        print(f"{len(problems)} PROBLEM(S) — concepts.js NOT written:", file=sys.stderr)
        for p in problems[:40]:
            print(f"  - {p}", file=sys.stderr)
        if len(problems) > 40:
            print(f"  ... and {len(problems) - 40} more", file=sys.stderr)
        print(f"\n{len(out)} row(s) would have been kept and {len(problems)} DROPPED.\n"
              f"Fix the batch files, or re-run with --force to merge anyway.", file=sys.stderr)
        sys.exit(1)
    if problems:
        print(f"--force: merging anyway, DISCARDING {len(problems)} row(s):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print("", file=sys.stderr)

    existing_ids = {c.get("id") for c in con}
    for r in out:
        h = hashlib.sha1(f"{r['paper']}|{r['unit']}|{r['sub']}".encode("utf-8")).hexdigest()[:6]
        cid = f"c-{r['paper']}-U{r['unit']}-{h}"
        if cid in existing_ids:
            sys.exit(f"FAIL: id collision on {cid} — {r['sub']!r}")
        existing_ids.add(cid)
        # `_tag` is bookkeeping for the second pass's error messages and must
        # not reach the app.
        con.append({"id": cid, **{k: v for k, v in r.items() if k != "_tag"},
                    "src": MARKER})

    save_concepts(con)
    print(f"appended {len(out)} authored concepts -> {len(con)} total")
    per = Counter((r["paper"], r["unit"]) for r in out)
    for (p, u), c in sorted(per.items()):
        print(f"  {c:>4}  {p} Unit {u}")
    print(f"\n  mean exp length: {sum(len(r['exp']) for r in out) // max(1, len(out))} chars")
    print(f"  with a mnemonic: {sum(1 for r in out if r['mnem'])}/{len(out)}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--paper")
    ap.add_argument("--unit")
    ap.add_argument("--force", action="store_true",
                    help="merge even though rows were rejected, discarding them")
    a = ap.parse_args()
    if a.export:
        do_export(a.paper, a.unit)
    elif a.merge:
        do_merge(a.force)
    elif a.report:
        do_report()
    else:
        ap.error("one of --export / --merge / --report")


if __name__ == "__main__":
    main()
