#!/usr/bin/env python3
"""
Label every question with HOW to study it: calculate | understand | memorise.

The three modes route to three tools the app already has — Calc Lab drills the
calculations, the Study pane carries the concepts, and the Leitner boxes are
where arbitrary facts have to live. Until now nothing said which question
belonged to which, so all 1,082 were revised the same way.

  --export [--paper TECH2]   write classification batches for agents
  --merge                    validate the batches and write data/modes.js
  --report                   distribution, disagreements and coverage

WHY A SIDE-FILE AND NOT A FIELD ON THE QUESTION
-----------------------------------------------
`generate.py --merge` is idempotent by DROPPING every question this pipeline
previously appended and rebuilding them from staged/generating/*.done.json. A
`mode` written into questions.js would therefore survive on the past-paper
questions and be silently erased from the ~425 generated ones the next time
anyone ran generate.py — a partial, invisible data loss of exactly the kind
CLAUDE.md exists to prevent.

So the labels live in their own file, keyed on question id:

    window.QUESTION_MODES = { "TECH1_2024-1": {"mode": "...", "conf": "..."} }

which no other pipeline touches. It also ports to the System Manager bank with
no schema change, the same way the review API is keyed on bank_id + question_id.

THE RULE PRE-PASS IS A CROSS-CHECK, NOT A CLASSIFIER
----------------------------------------------------
`rule_hint()` below marks the questions a regex can be confident about. It does
NOT decide anything. Its output is diffed against the agents' labels on --merge,
and disagreements are printed for a human to look at. A pipeline that agreed
with itself would prove nothing; the point is to have two opinions.
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
BATCHES = os.path.join(HERE, "staged", "classifying")
APP = os.path.join(ROOT, "public", "mpsc-system-analyst", "data")
MODES = ("calculate", "understand", "memorise")
CONFS = ("high", "medium", "low")
PER_BATCH = 70


def load(name):
    text = open(os.path.join(APP, f"{name}.js"), encoding="utf-8").read()
    var = {"questions": "QUESTIONS", "syllabus": "SYLLABUS"}[name]
    m = re.search(rf"window\.{var}\s*=\s*([\[{{].*[\]}}]);\s*$", text, re.S)
    if not m:
        sys.exit(f"FAIL: cannot parse window.{var} out of {name}.js")
    return json.loads(m.group(1))


# --------------------------------------------------------------- rule hints
# Deliberately narrow. Each pattern is here because it is nearly always right,
# not because it covers a lot; anything it is unsure about returns None and the
# agent's label stands unchallenged.

_CALC_STEM = re.compile(
    r"\bcalculate\b|\bcompute\b|what is the value of|find the (value|number|LCM|HCF|average)"
    r"|how many (subnets|hosts|usable|bits|bytes|pages|channels)"
    r"|\bLCM\b|\bHCF\b|output of the (following|above)|what will be (printed|the output)",
    re.I)
_MEM_STEM = re.compile(
    r"\bin which year\b|\bwhich year\b|\bfull form\b|\bstands for\b"
    r"|which section of|\bunder section\b|\bwhich article\b"
    r"|\bport number\b|\bwhich port\b|\bRFC\s*\d|\bIEEE\s*802",
    re.I)


def rule_hint(q):
    """A mode a regex is confident about, or None. Never the final word."""
    stem = q.get("q") or ""
    opts = [str(v).strip() for v in (q.get("opts") or {}).values()]
    if _MEM_STEM.search(stem):
        return "memorise"
    if _CALC_STEM.search(stem):
        return "calculate"
    # Every option a bare quantity, and the stem asks for one => a computation.
    if opts and all(re.fullmatch(r"[^A-Za-z]*\d[\d,. ]*(%|bytes?|bits?|KB|MB|GB|ns|ms|s)?",
                                 o) for o in opts):
        if re.search(r"how many|what is the|maximum number", stem, re.I):
            return "calculate"
    return None


# ------------------------------------------------------------------- export
def do_export(paper_filter):
    qs = load("questions")
    if paper_filter:
        qs = [q for q in qs if q["paper"] == paper_filter]
    if not qs:
        sys.exit("FAIL: no questions matched")

    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    # Batch within a paper+unit so an agent sees related questions together and
    # can be consistent across them, which matters most for the PMBOK grid.
    groups = defaultdict(list)
    for q in qs:
        groups[(q["paper"], str(q["unit"]))].append(q)

    written = []
    for (paper, unit), rows in sorted(groups.items()):
        for bn, i in enumerate(range(0, len(rows), PER_BATCH), 1):
            chunk = rows[i:i + PER_BATCH]
            name = f"{paper}-U{unit}-{bn:02d}"
            payload = [{
                "id": q["id"], "paper": q["paper"], "unit": str(q["unit"]),
                "sub": q.get("sub"), "question": q.get("q"),
                "options": q.get("opts"), "answer": q.get("ans"),
                "explanation": q.get("exp"),
            } for q in chunk]
            with open(os.path.join(BATCHES, f"{name}.todo.json"), "w",
                      encoding="utf-8") as f:
                json.dump({"brief": "tools/system-analyst-build/CLASSIFY_BRIEF.md",
                           "count": len(chunk), "questions": payload},
                          f, indent=1, ensure_ascii=False)
            written.append((name, len(chunk)))

    for name, n in written:
        print(f"  {name:<16} {n:>4}")
    print(f"\n{len(written)} batch(es), {sum(n for _, n in written)} questions "
          f"-> {os.path.relpath(BATCHES, os.getcwd())}/")


# -------------------------------------------------------------------- merge
def do_merge():
    qs = load("questions")
    by_id = {q["id"]: q for q in qs}

    done = sorted(glob.glob(os.path.join(BATCHES, "*.done.json")))
    if not done:
        sys.exit(f"FAIL: no *.done.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    labels, problems = {}, []
    for path in done:
        name = os.path.basename(path).replace(".done.json", "")
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{name}: invalid JSON — {e}")
            continue
        if isinstance(rows, dict):          # tolerate {"labels": [...]}
            rows = rows.get("labels") or rows.get("questions") or []
        for i, r in enumerate(rows, 1):
            tag = f"{name}#{i}"
            qid = r.get("id")
            if qid not in by_id:
                problems.append(f"{tag}: id {qid!r} is not in the bank")
                continue
            if qid in labels:
                problems.append(f"{tag}: id {qid!r} labelled twice")
                continue
            if r.get("mode") not in MODES:
                problems.append(f"{tag}: mode {r.get('mode')!r} not one of {MODES}")
                continue
            if r.get("confidence") not in CONFS:
                problems.append(f"{tag}: confidence {r.get('confidence')!r} not one of {CONFS}")
                continue
            why = (r.get("why") or "").strip()
            if len(why) < 12:
                problems.append(f"{tag}: `why` missing or too short to be a reason")
                continue
            labels[qid] = {"mode": r["mode"], "conf": r["confidence"], "why": why}

    missing = [q["id"] for q in qs if q["id"] not in labels]

    if problems:
        print(f"{len(problems)} problem(s):")
        for p in problems[:40]:
            print("  " + p)
        if len(problems) > 40:
            print(f"  ... and {len(problems) - 40} more")
        sys.exit(1)

    # Cross-check against the rule pre-pass. Disagreements are reported, never
    # auto-resolved — the whole value is that a human looks at them.
    disagree = []
    for qid, lab in labels.items():
        hint = rule_hint(by_id[qid])
        if hint and hint != lab["mode"]:
            disagree.append((qid, hint, lab["mode"], lab["conf"], lab["why"]))

    out = os.path.join(APP, "modes.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* How to study each question: calculate | understand | memorise.\n"
                "   Generated by tools/system-analyst-build/classify.py --merge.\n"
                "   Keyed on question id and kept OUT of questions.js on purpose —\n"
                "   generate.py --merge rebuilds its own questions from staged files\n"
                "   and would silently drop a field added to them there. */\n")
        f.write("window.QUESTION_MODES = ")
        json.dump({k: labels[k] for k in sorted(labels)}, f, indent=1,
                  ensure_ascii=False, sort_keys=True)
        f.write(";\n")

    dist = Counter(v["mode"] for v in labels.values())
    conf = Counter(v["conf"] for v in labels.values())
    total = len(labels)
    print(f"wrote {os.path.relpath(out, os.getcwd())} — {total} labelled, "
          f"{len(missing)} unlabelled")
    for m in MODES:
        print(f"  {m:<11} {dist[m]:>5}  {100 * dist[m] / total:>5.1f}%")
    print(f"  confidence: " + ", ".join(f"{c} {conf[c]}" for c in CONFS))
    if missing:
        print(f"\n{len(missing)} question(s) have no label, e.g. {missing[:6]}")
    print(f"\nrule/agent disagreements: {len(disagree)}"
          f" ({100 * len(disagree) / total:.1f}%) — review these by hand:")
    for qid, hint, got, c, why in disagree[:25]:
        print(f"  {qid:<18} rule={hint:<10} agent={got:<10} ({c})  {why[:70]}")
    if len(disagree) > 25:
        print(f"  ... and {len(disagree) - 25} more")


# ------------------------------------------------------------------- report
def do_report():
    qs = load("questions")
    path = os.path.join(APP, "modes.js")
    if not os.path.exists(path):
        sys.exit("FAIL: modes.js not built yet — run --merge first")
    text = open(path, encoding="utf-8").read()
    labels = json.loads(re.search(r"window\.QUESTION_MODES\s*=\s*(\{.*\});\s*$",
                                  text, re.S).group(1))
    per_unit = defaultdict(Counter)
    for q in qs:
        lab = labels.get(q["id"])
        if lab:
            per_unit[(q["paper"], str(q["unit"]))][lab["mode"]] += 1

    print(f"{'unit':<12} {'n':>5} {'calc':>6} {'undr':>6} {'mem':>6}   dominant")
    for key in sorted(per_unit):
        c = per_unit[key]
        n = sum(c.values())
        top = c.most_common(1)[0][0]
        print(f"{key[0] + ' U' + key[1]:<12} {n:>5} "
              f"{c['calculate']:>6} {c['understand']:>6} {c['memorise']:>6}   {top}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--paper")
    a = ap.parse_args()
    if a.export:
        do_export(a.paper)
    elif a.merge:
        do_merge()
    elif a.report:
        do_report()
    else:
        ap.error("pass --export, --merge or --report")


if __name__ == "__main__":
    main()
