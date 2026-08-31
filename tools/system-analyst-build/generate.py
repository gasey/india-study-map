#!/usr/bin/env python3
"""
Author questions for System Analyst syllabus leaves that no past paper covers.

MPSC has run the Informatics Officer exam twice (2021, 2024), which is every
past paper this post has. Between them they leave 108 of Technical Paper II's
212 leaves with no question at all — 200 marks of syllabus, roughly half of it
untested by anything in the app.

Allocation is driven by unit marks AND existing coverage: a 20-mark unit that is
half bare needs more than a 5-mark unit with one gap. Capped at 3 per leaf,
beyond which a single subtopic starts producing near-duplicates.

  --export [--paper TECH2] [--unit N]   write generation batches
  --merge                               validate and append to questions.js

Every generated `sub` is checked against the syllabus on merge — a paraphrased
subtopic links to no concept and fails silently, so it is rejected here.

Usage:
  python3 tools/system-analyst-build/generate.py --export --paper TECH2
  python3 tools/system-analyst-build/generate.py --merge
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
ROOT = os.path.dirname(os.path.dirname(HERE))
BATCHES = os.path.join(HERE, "staged", "generating")
APP = os.path.join(ROOT, "public", "mpsc-system-analyst", "data")
LETTERS = ["A", "B", "C", "D"]
TARGETS_PER_BATCH = 9


def load(name):
    text = open(os.path.join(APP, f"{name}.js"), encoding="utf-8").read()
    var = {"questions": "QUESTIONS", "syllabus": "SYLLABUS"}[name]
    m = re.search(rf"window\.{var}\s*=\s*([\[{{].*[\]}}]);\s*$", text, re.S)
    if not m:
        sys.exit(f"FAIL: cannot parse window.{var} out of {name}.js")
    return json.loads(m.group(1))


def coverage():
    qs = load("questions")
    c = Counter()
    for q in qs:
        if q.get("ans") and q.get("sub"):
            c[(q["paper"], str(q["unit"]), q["sub"])] += 1
    return c


def per_target(marks, n_leaves, covered_frac):
    """More per leaf where the marks are dense and the coverage is thin."""
    density = marks / max(1, n_leaves)
    n = 2
    if density >= 1.2:
        n += 1
    if covered_frac < 0.25:
        n += 1
    return max(2, min(3, n))


def do_export(only_paper, only_unit):
    syl = load("syllabus")
    have = coverage()
    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

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
            bare = [s for s in subs if not have.get((p["id"], str(u["no"]), s))]
            if not bare:
                continue
            frac = (len(subs) - len(bare)) / len(subs)
            n = per_target(u["marks"], len(subs), frac)
            plan.append((p["id"], u["no"], u["title"], u["marks"], len(subs), len(bare), n))

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
                        "paper": p["id"], "unit": str(u["no"]), "unitTitle": u["title"],
                        "unitMarks": u["marks"], "perTarget": n,
                        # System Analyst's OWN brief, which inherits the shared
                        # one but overrides its difficulty calibration — the
                        # shared file is pitched at a diploma-level post and
                        # tells authors to avoid J2EE and design patterns, both
                        # of which are named leaves of this syllabus.
                        "brief": "tools/system-analyst-build/GENERATE_BRIEF.md",
                        "targets": [{"sub": s} for s in chunk],
                    }, f, indent=2, ensure_ascii=False)
                written.append((name, len(chunk), len(chunk) * n))

    print(f"{'unit':<46} {'mk':>3} {'leaves':>6} {'bare':>5} {'per':>4} {'new':>5}")
    for pid, uno, title, marks, nl, nb, n in plan:
        print(f"{pid + ' U' + str(uno) + ' ' + title[:34]:<46} {marks:>3} {nl:>6} {nb:>5} {n:>4} {nb * n:>5}")
    print(f"\n{len(written)} batch(es) -> {os.path.relpath(BATCHES, os.getcwd())}/")
    print(f"total to author: {sum(q for _, _, q in written)} questions")


def do_merge(force=False):
    syl = load("syllabus")
    valid = {}
    for p in syl["papers"]:
        for u in p["units"]:
            for s in (u.get("subtopics") or []):
                valid[(p["id"], str(u["no"]), s)] = u["title"]

    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    qs = load("questions")
    # --merge must be IDEMPOTENT. Agents run it themselves to self-verify, so it
    # gets called several times over the same .done.json files; an unconditional
    # append duplicated questions into the app (caught at 6 extra copies). Drop
    # everything this pipeline previously appended and rebuild it from the batch
    # files, so the result depends only on what is on disk, not on how many times
    # anyone ran it.
    before = len(qs)
    qs = [q for q in qs if not str(q.get("srcKey", "")).startswith("GEN-")]
    if before != len(qs):
        print(f"rebuilding: dropped {before - len(qs)} previously appended "
              f"question(s) before re-applying\n")
    existing_ids = {q["id"] for q in qs}

    # Key duplicates on the stem AND the options. Stem alone collides on generic
    # wording — this bank has a real pair of unrelated questions both stemmed
    # "Which of the following statement is false?", which a stem-only key would
    # wrongly reject as a duplicate.
    def qkey(q):
        stem = re.sub(r"[^a-z0-9]+", " ", (q.get("q") or "").lower()).strip()
        opts = "|".join(sorted(re.sub(r"[^a-z0-9]+", " ", str(v).lower()).strip()
                               for v in (q.get("opts") or {}).values()))
        return f"{stem}||{opts}"

    seen_q = {qkey(q): q["id"] for q in qs}

    problems, out = [], []
    for path in done:
        name = os.path.basename(path).replace(".done.json", "")
        m = re.match(r"(TECH\d|GE|GS)-U([0-9A-D]+)-(\d+)", name)
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
                near = [k[2] for k in valid
                        if k[0] == paper and str(k[2]).lower() == str(sub).lower()]
                hint = f" (case mismatch with {near[0]!r}?)" if near else ""
                problems.append(f"{tag}: sub {sub!r} is not a leaf of {paper} U{unit}{hint}")
                continue
            opts = r.get("opts") or {}
            if sorted(opts.keys()) != LETTERS:
                problems.append(f"{tag}: option keys {sorted(opts.keys())}")
                continue
            vals = [str(opts[k]).strip() for k in LETTERS]
            if any(not v for v in vals) or len(set(v.lower() for v in vals)) < 4:
                problems.append(f"{tag}: empty or duplicate option text")
                continue
            if any(re.search(r"all of the above|all of these", v, re.I) for v in vals):
                problems.append(f"{tag}: uses 'all of the above' — the brief forbids it")
                continue
            if r.get("ans") not in LETTERS:
                problems.append(f"{tag}: ans={r.get('ans')!r}")
                continue
            q, exp = (r.get("q") or "").strip(), (r.get("exp") or "").strip()
            if len(q) < 15 or len(exp) < 30:
                problems.append(f"{tag}: question or explanation too short")
                continue
            k = re.sub(r"[^a-z0-9]+", " ", q.lower()).strip()
            if k in seen_q:
                problems.append(f"{tag}: duplicate question text (also {seen_q[k]})")
                continue
            seen_q[k] = tag
            out.append({"paper": paper, "unit": unit, "sub": sub, "q": q,
                        "opts": {x: opts[x].strip() for x in LETTERS},
                        "ans": r["ans"], "conf": r.get("conf", "high"), "exp": exp})

    # VALIDATE BEFORE WRITING, NEVER AFTER.
    #
    # This used to collect `problems`, write questions.js regardless, print
    # "appended N authored questions" and only then mention the rejects in a
    # stderr footnote. A row that failed validation was simply missing from the
    # output, with a reassuring success line above it and no numbering gap to
    # reveal the loss — the same shape as the OCR incident in DEVLOG 2026-08-04,
    # and exactly what CLAUDE.md's "verify, don't trust the pipeline" rule is
    # about.
    #
    # It hid a real loss for a full authoring pass: two hand-written IPC
    # questions in TECH2-U15-1 carried a `sub` that had silently dropped
    # "167, 172, 173" from the end of the syllabus leaf's section list, so both
    # were rejected and discarded on every merge from that day on.
    #
    # Now nothing is written while any row is rejected. --force still allows it,
    # but prints exactly what is about to be lost first.
    if problems and not force:
        print(f"{len(problems)} PROBLEM(S) — questions.js NOT written:", file=sys.stderr)
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

    # IDS MUST BE STABLE, because other things are keyed on them.
    #
    # These used to be a running counter over `out` — GEN-TECH2-U1-001, 002, …
    # incrementing globally across every batch in filename order. That makes the
    # id a function of WHERE the question sits in the whole corpus, so authoring
    # one new batch renumbers everything after it. Adding 27 TECH1 Unit 3
    # questions moved 225 of the 254 existing generated questions to new ids in
    # a single run.
    #
    # Three things are keyed on question id and all three break silently when it
    # moves: data/modes.js (study-mode labels), the reader's localStorage Leitner
    # boxes, and the mpsc-api review records (bank_id + question_id). None of
    # them error — the labels simply stop matching and the progress quietly
    # attaches to a different question.
    #
    # So the id is now derived from the question's own content. It does not move
    # when a neighbour is added, removed or reordered, and it only changes if the
    # question itself is rewritten.
    def gen_id(r):
        h = hashlib.sha1(
            f"{r['paper']}|{r['unit']}|{r['sub']}|{r['q']}".encode("utf-8")
        ).hexdigest()[:6]
        return f"GEN-{r['paper']}-U{r['unit']}-{h}"

    for r in out:
        qid = gen_id(r)
        if qid in existing_ids:
            # Two questions hashing to the same id means identical paper/unit/sub
            # and stem, which the duplicate check above should already have
            # caught. Fail rather than silently overwrite one with the other.
            sys.exit(f"FAIL: id collision on {qid} — {r['q'][:70]!r}")
        existing_ids.add(qid)
        qs.append({
            "id": qid, "src": "generated",
            "sitting": "Authored to cover a syllabus subtopic with no past-paper coverage",
            "srcKey": f"GEN-{r['paper']}", "no": None,
            "paper": r["paper"], "unit": r["unit"], "sub": r["sub"],
            "q": r["q"], "opts": r["opts"], "ans": r["ans"], "conf": r["conf"],
            "exp": r["exp"],
            "prov": "Authored from the syllabus. MPSC has held this exam twice and neither "
                    "past paper covers this subtopic. Not a past question.",
            "note": "",
        })

    with open(os.path.join(APP, "questions.js"), "w", encoding="utf-8") as f:
        f.write("window.QUESTIONS = " + json.dumps(qs, indent=1, ensure_ascii=False) + ";\n")

    print(f"appended {len(out)} authored questions -> app total {len(qs)}")
    per = Counter((r["paper"], r["unit"]) for r in out)
    for (p, u), c in sorted(per.items()):
        print(f"  {c:>4}  {p} Unit {u}")
    ans = Counter(r["ans"] for r in out)
    tot = max(1, len(out))
    print("\n  answer spread: " + "  ".join(
        f"{L} {ans.get(L,0)} ({100*ans.get(L,0)//tot}%)" for L in LETTERS))
    if out and max(ans.values()) / tot > 0.4:
        print(f"  WARNING: {int(100*max(ans.values())/tot)}% on one letter — the brief "
              f"asks for a roughly even spread")
    print(f"  distinct leaves covered: {len({(r['paper'],r['unit'],r['sub']) for r in out})}")
    # Any rejects were reported and acted on above, before the write. Nothing is
    # reported down here, because a problem printed after a success line is a
    # problem nobody reads.


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--paper")
    ap.add_argument("--unit")
    ap.add_argument("--force", action="store_true",
                    help="merge even though rows were rejected, discarding them")
    a = ap.parse_args()
    if a.export:
        do_export(a.paper, a.unit)
    elif a.merge:
        do_merge(a.force)
    else:
        ap.error("pass --export or --merge")


if __name__ == "__main__":
    main()
