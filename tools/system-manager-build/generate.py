#!/usr/bin/env python3
"""
Phase 4 — author questions for syllabus leaves that no past paper covers.

The 2016 Computer Operator papers predate a large block of the 2026 syllabus, so
70 of 120 TECH1 leaves and 90 of 133 TECH2 leaves have zero questions. TECH2 Unit
IV (Cyber Security / AI / Emerging Technologies) is 30 marks with none at all.

Allocation is driven by unit marks AND by how much coverage a unit already has,
not by leaf count alone: a 30-mark unit with nothing needs more attention than a
20-mark unit that is already half covered.

  --export [--unit TECH2:IV]   write generation batches (all gaps, or one unit)
  --merge                      validate and stage into staged/generated.json

Every generated `sub` is checked against the taxonomy on merge — a paraphrased
subtopic links to no concept and fails silently, so it is rejected here.

Usage:
  python3 tools/system-manager-build/generate.py --export --unit TECH2:IV
  # ...agents fill staged/generating/<name>.todo.json -> .done.json...
  python3 tools/system-manager-build/generate.py --merge
"""

import argparse
import glob
import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
BATCHES = os.path.join(STAGED, "generating")
ROOT = os.path.dirname(os.path.dirname(HERE))
SYL = os.path.join(ROOT, "public", "mpsc-system-manager", "data", "syllabus.js")
LETTERS = ["A", "B", "C", "D"]
TARGETS_PER_BATCH = 11          # ~33 questions per batch at 3 each


def load_syllabus():
    text = open(SYL, encoding="utf-8").read()
    return json.loads(re.search(r"window\.SYLLABUS\s*=\s*(\{.*\});\s*$", text, re.S).group(1))


def load_taxonomy():
    path = os.path.join(STAGED, "taxonomy.json")
    if not os.path.isfile(path):
        sys.exit("FAIL: staged/taxonomy.json missing — run export_taxonomy.py")
    return json.load(open(path, encoding="utf-8"))


def existing_counts():
    """(paper, unit, sub) -> how many questions already exist."""
    tags_path = os.path.join(STAGED, "tags.json")
    if not os.path.isfile(tags_path):
        return Counter()
    tags = json.load(open(tags_path, encoding="utf-8"))
    hp = os.path.join(STAGED, "harvest.json")
    paper_of = {}
    if os.path.isfile(hp):
        for r in json.load(open(hp, encoding="utf-8")):
            paper_of[r["id"]] = r["paper"]
    for path in glob.glob(os.path.join(HERE, "extracted", "*.json")):
        key = os.path.splitext(os.path.basename(path))[0]
        for r in json.load(open(path, encoding="utf-8")):
            paper_of[f"{key}-{r['no']}"] = "TECH2"
    c = Counter()
    for qid, t in tags.items():
        p = paper_of.get(qid)
        if p and t.get("sub"):
            c[(p, str(t["unit"]), t["sub"])] += 1

    # Count questions already AUTHORED by earlier Phase 4 runs too. They are
    # pre-tagged and never enter tags.json, so without this a re-run re-targets
    # units that have already been filled.
    gp = os.path.join(STAGED, "generated.json")
    if os.path.isfile(gp):
        for g in json.load(open(gp, encoding="utf-8")):
            c[(g["paper"], str(g["unit"]), g["sub"])] += 1
    return c


def per_target(unit_marks, n_leaves, n_uncovered, covered_frac):
    """How many questions per uncovered leaf.

    A unit with high marks and low existing coverage gets more per leaf. Capped
    at 4 — beyond that a single subtopic starts generating near-duplicates.
    """
    density = unit_marks / max(1, n_leaves)      # marks riding on each leaf
    base = 2
    if density >= 1.6:
        base += 1
    if covered_frac < 0.15:                      # essentially untouched
        base += 1
    return max(2, min(4, base))


def do_export(only_unit):
    syl = load_syllabus()
    tax = load_taxonomy()
    have = existing_counts()
    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    by_unit = defaultdict(list)
    for t in tax:
        by_unit[(t["paper"], t["unit"])].append(t)

    written, plan = [], []
    for p in syl["papers"]:
        for u in p["units"]:
            key = (p["id"], str(u["no"]))
            leaves = by_unit.get(key, [])
            if not leaves:
                continue
            if only_unit and f"{key[0]}:{key[1]}" != only_unit:
                continue
            uncovered = [t for t in leaves if not have.get((key[0], key[1], t["sub"]))]
            if not uncovered:
                continue
            covered_frac = (len(leaves) - len(uncovered)) / len(leaves)
            n = per_target(u["marks"], len(leaves), len(uncovered), covered_frac)
            plan.append((key, u["title"], u["marks"], len(leaves), len(uncovered), n,
                         len(uncovered) * n))

            for i in range(0, len(uncovered), TARGETS_PER_BATCH):
                chunk = uncovered[i:i + TARGETS_PER_BATCH]
                bn = i // TARGETS_PER_BATCH + 1
                name = f"{key[0]}-U{key[1]}-{bn}"
                path = os.path.join(BATCHES, f"{name}.todo.json")
                with open(path, "w", encoding="utf-8") as f:
                    json.dump({
                        "paper": key[0], "unit": key[1], "unitTitle": u["title"],
                        "unitMarks": u["marks"], "perTarget": n,
                        "brief": "tools/system-manager-build/GENERATE_BRIEF.md",
                        "targets": [{"sub": t["sub"], "section": t["section"]} for t in chunk],
                    }, f, indent=2, ensure_ascii=False)
                written.append((name, len(chunk), len(chunk) * n))

    print(f"{'unit':<34} {'mk':>3} {'leaves':>6} {'uncov':>6} {'per':>4} {'new':>5}")
    for (pid, uno), title, marks, nl, nu, n, tot in plan:
        print(f"{pid + ' U' + uno + ' ' + title[:22]:<34} {marks:>3} {nl:>6} {nu:>6} {n:>4} {tot:>5}")
    print(f"\n{len(written)} batch(es) -> {os.path.relpath(BATCHES, os.getcwd())}/")
    for name, nt, nq in written:
        print(f"  {name:<18} {nt:>2} targets -> {nq:>3} questions")
    print(f"\ntotal to author: {sum(q for _, _, q in written)} questions")


def do_merge(force=False):
    tax = load_taxonomy()
    valid = {(t["paper"], t["unit"], t["sub"]) for t in tax}
    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    problems, out, seen_q = [], [], {}
    for path in done:
        name = os.path.basename(path).replace(".done.json", "")
        m = re.match(r"(TECH[12]|GE)-U([IVX0-9]+)-(\d+)", name)
        if not m:
            problems.append(f"{name}: cannot parse paper/unit from filename")
            continue
        paper, unit = m.group(1), m.group(2)
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{name}: invalid JSON — {e}")
            continue

        for i, r in enumerate(rows, 1):
            tag = f"{name}#{i}"
            sub = r.get("sub")
            if (paper, unit, sub) not in valid:
                near = [t["sub"] for t in tax if t["paper"] == paper
                        and str(t["sub"]).lower() == str(sub).lower()]
                hint = f" (case mismatch with {near[0]!r}?)" if near else ""
                problems.append(f"{tag}: sub {sub!r} is not a leaf of {paper} U{unit}{hint}")
                continue
            opts = r.get("opts") or {}
            if sorted(opts.keys()) != LETTERS:
                problems.append(f"{tag}: option keys {sorted(opts.keys())}")
                continue
            vals = [str(opts[k]).strip() for k in LETTERS]
            if any(not v for v in vals):
                problems.append(f"{tag}: empty option")
                continue
            if len(set(v.lower() for v in vals)) < 4:
                problems.append(f"{tag}: duplicate option text")
                continue
            if any(re.search(r"all of the above|all of these", v, re.I) for v in vals):
                problems.append(f"{tag}: uses 'all of the above' — the brief forbids it")
                continue
            if r.get("ans") not in LETTERS:
                problems.append(f"{tag}: ans={r.get('ans')!r}")
                continue
            q = (r.get("q") or "").strip()
            exp = (r.get("exp") or "").strip()
            if len(q) < 15:
                problems.append(f"{tag}: question too short")
                continue
            if len(exp) < 30:
                problems.append(f"{tag}: explanation too short")
                continue
            k = re.sub(r"[^a-z0-9]+", " ", q.lower()).strip()
            if k in seen_q:
                problems.append(f"{tag}: duplicate question text (also {seen_q[k]})")
                continue
            seen_q[k] = tag
            out.append({"paper": paper, "unit": unit, "sub": sub, "q": q,
                        "opts": {k2: opts[k2].strip() for k2 in LETTERS},
                        "ans": r["ans"], "conf": r.get("conf", "high"), "exp": exp})

    # VALIDATE BEFORE WRITING, NEVER AFTER.
    #
    # This used to write staged/generated.json here and only report `problems`
    # thirty lines further down, after the success summary. A row that failed
    # validation was simply absent from the output with a reassuring count above
    # it — the same shape as the OCR incident in DEVLOG 2026-08-04, and the same
    # bug found and fixed in the System Analyst pipeline on 2026-08-31, where it
    # had been quietly discarding two authored questions for a full day.
    if problems and not force:
        print(f"{len(problems)} PROBLEM(S) — staged/generated.json NOT written:",
              file=sys.stderr)
        for p in problems[:40]:
            print(f"  - {p}", file=sys.stderr)
        if len(problems) > 40:
            print(f"  … and {len(problems) - 40} more", file=sys.stderr)
        print(f"\n{len(out)} row(s) would have been kept and {len(problems)} DROPPED.\n"
              f"Fix the batch files, or re-run with --force to stage anyway.",
              file=sys.stderr)
        sys.exit(1)
    if problems:
        print(f"--force: staging anyway, DISCARDING {len(problems)} row(s):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print("", file=sys.stderr)

    # IDS MUST BE STABLE, because other things are keyed on them.
    #
    # These used to be `enumerate(out, 1)` — a running counter over every batch
    # in one list, so the id encoded WHERE a question sat among all the others
    # and authoring one new batch renumbered everything after it. On the System
    # Analyst side that moved 225 of 254 questions in a single run, silently
    # detaching their study-mode labels, the reader's Leitner boxes and their
    # mpsc-api review records — none of which error when the key stops matching.
    #
    # Derived from the question's own content instead, so an id moves only when
    # the question itself is rewritten.
    def gen_id(r):
        h = hashlib.sha1(
            f"{r['paper']}|{r['unit']}|{r['sub']}|{r['q']}".encode("utf-8")
        ).hexdigest()[:6]
        return f"GEN-{r['paper']}-U{r['unit']}-{h}"

    seen_ids = {}
    for r in out:
        r["id"] = gen_id(r)
        if r["id"] in seen_ids:
            sys.exit(f"FAIL: id collision on {r['id']} — {r['q'][:70]!r}")
        seen_ids[r["id"]] = r["q"]

    with open(os.path.join(STAGED, "generated.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"staged {len(out)} generated questions -> staged/generated.json\n")
    per = Counter((r["paper"], r["unit"]) for r in out)
    for (p, u), n in sorted(per.items()):
        print(f"  {n:>4}  {p} Unit {u}")
    ans = Counter(r["ans"] for r in out)
    total = max(1, len(out))
    print("\n  answer spread: " + "  ".join(
        f"{L} {ans.get(L, 0)} ({100 * ans.get(L, 0) // total}%)" for L in LETTERS))
    skew = max(ans.values()) / total if out else 0
    if skew > 0.4:
        print(f"  WARNING: answer letters are skewed ({int(skew * 100)}% on one letter) — "
              f"the brief asks for a roughly even split")
    covered = {(r["paper"], r["unit"], r["sub"]) for r in out}
    print(f"\n  distinct leaves covered: {len(covered)}")

    # Rejects were reported and acted on above, before the write. Nothing is
    # reported here, because a problem printed after a success line is a problem
    # nobody reads.


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--force", action="store_true",
                    help="stage even though rows were rejected, discarding them")
    ap.add_argument("--unit", help="restrict to one unit, e.g. TECH2:IV")
    a = ap.parse_args()
    if a.export:
        do_export(a.unit)
    elif a.merge:
        do_merge(a.force)
    else:
        ap.error("pass --export or --merge")


if __name__ == "__main__":
    main()
