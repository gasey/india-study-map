#!/usr/bin/env python3
"""
Recover the 2021 Informatics Officer Technical Papers II and III for the System
Analyst app.

WHAT THE BANK ACTUALLY HOLDS (audited 2026-08-29 — the labels mislead):

  Paper-II   100 questions, answerSource "derived", but answerIndex is -1 on
             every one. Nothing was ever derived. 0 usable answers.
  Paper-III  100 questions. 92 carry answerSource "inferred" WITH an answer —
             unverified, no official key. The 8 labelled "key" have NO answer.
             5 questions depend on a printed diagram.

  Neither paper has a single explanation.

So this is not a harvest — it is a derivation job for ~200 questions, the same
shape as the System Manager Phase 3 work.

DESIGN: SOLVE BLIND, THEN DIFF — same as tools/system-manager-build/solve.py.
The export withholds the bank's existing answer. Paper-III's 92 priors then act
as an independent cross-check: agreement corroborates, disagreement caps
confidence at medium and flags for review. Paper-II has no prior, so nothing
checks the solver and its answers ship as single-source.

That asymmetry is why the two papers warrant different models — see README.

  --export   write solve batches (bank answers withheld)
  --merge    validate, diff against the bank, emit staged/solved.json
  --apply    merge solved questions into the System Analyst app's questions.js

Usage:
  python3 tools/system-analyst-build/io2021.py --export
  python3 tools/system-analyst-build/io2021.py --merge
  python3 tools/system-analyst-build/io2021.py --apply
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
STAGED = os.path.join(HERE, "staged")
BATCHES = os.path.join(STAGED, "solving")
APP = os.path.join(ROOT, "public", "mpsc-system-analyst", "data", "questions.js")
BANK = os.path.expanduser(
    "~/workspace/projects/personal/mpsc-question-bank/bank/mpsc_bank_v2.json")

LETTERS = ["A", "B", "C", "D"]
CONFS = {"high", "medium", "low"}
BATCH_SIZE = 20

# paperId -> (srcKey, app paper id, sitting label, expected count)
PAPERS = {
    "Old_Questions/Direct_2020-2021/Informatics Officer - Technical Paper-II.pdf": (
        "TECH2_2021", "TECH2", "Informatics Officer, 2021 - Technical Paper II", 100),
    "Old_Questions/Direct_2020-2021/Informatics Officer - Technical Paper-III.pdf": (
        "TECH3_2021", "TECH3", "Informatics Officer, 2021 - Technical Paper III", 100),
}


def load_bank():
    if not os.path.isfile(BANK):
        sys.exit(f"FAIL: bank not found at {BANK}")
    with open(BANK, encoding="utf-8") as f:
        return json.load(f)["questions"]


def collect(problems):
    rows = load_bank()
    out = []
    for pid, (srckey, paper, sitting, expect) in PAPERS.items():
        got = sorted([r for r in rows if r.get("paperId") == pid],
                     key=lambda r: r.get("qnum") or 0)
        if len(got) != expect:
            problems.append(f"{srckey}: {len(got)} questions, expected {expect}")
        nums = [r.get("qnum") for r in got]
        gaps = [n for n in range(1, expect + 1) if n not in nums]
        if gaps:
            problems.append(f"{srckey}: missing qnum {gaps}")

        for r in got:
            raw = r.get("options") or []
            opts = [(o if o is None else str(o).strip()) for o in raw]
            opts = [o for o in opts if o not in (None, "", "None", "null")]
            if not 2 <= len(opts) <= 4:
                problems.append(f"{srckey} Q{r.get('qnum')}: {len(opts)} usable options")
                continue
            ai = r.get("answerIndex", -1)
            if 0 <= ai < len(raw):
                t = raw[ai]
                t = None if t is None else str(t).strip()
                ai = opts.index(t) if t in opts else -1
            else:
                ai = -1
            out.append({
                "id": f"{srckey}-{r['qnum']}", "srcKey": srckey, "no": r["qnum"],
                "paper": paper, "sitting": sitting,
                "q": (r.get("question") or "").strip(),
                "opts": {LETTERS[i]: o for i, o in enumerate(opts)},
                "needs_figure": bool(r.get("hasDiagram") or r.get("figureGroupId")),
                "_bank_ans": LETTERS[ai] if 0 <= ai < len(opts) else None,
            })
    return out


def do_export():
    problems = []
    rows = collect(problems)
    os.makedirs(BATCHES, exist_ok=True)
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        os.remove(stale)

    by_src = {}
    for r in rows:
        by_src.setdefault(r["srcKey"], []).append(r)

    written = []
    for src, qs in sorted(by_src.items()):
        priors = sum(1 for q in qs if q["_bank_ans"])
        for i in range(0, len(qs), BATCH_SIZE):
            chunk = qs[i:i + BATCH_SIZE]
            n = i // BATCH_SIZE + 1
            path = os.path.join(BATCHES, f"{src}-{n}.todo.json")
            export = [{k: v for k, v in q.items() if not k.startswith("_")} for q in chunk]
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "srcKey": src, "brief": "tools/bank-rebuild/SOLVE_BRIEF.md",
                    "has_prior_answers": priors > 0,
                    "instructions": (
                        "Answer each question independently. Write id -> "
                        "{\"ans\":\"A\"|\"B\"|\"C\"|\"D\", \"conf\":\"high\"|\"medium\"|\"low\", "
                        "\"exp\":\"1-3 sentences\"} to this filename with .todo.json "
                        "replaced by .solved.json. No official answer key exists for "
                        "this paper. Do not inflate confidence."),
                    "questions": export,
                }, f, indent=2, ensure_ascii=False)
            written.append((path, len(chunk)))

        note = (f"{priors} of {len(qs)} have an unverified bank answer to diff against"
                if priors else "NO prior answers — the solve is the only source")
        print(f"  {src}: {len(qs)} questions — {note}")

    print(f"\nexported {len(written)} batch(es) -> {os.path.relpath(BATCHES, os.getcwd())}/")
    figs = [r["id"] for r in rows if r["needs_figure"]]
    if figs:
        print(f"{len(figs)} figure-dependent, will be quarantined: {', '.join(figs)}")
    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


def do_merge():
    problems = []
    rows = {r["id"]: r for r in collect(problems)}
    done = sorted(glob.glob(os.path.join(BATCHES, "*.solved.json")))
    if not done:
        sys.exit(f"FAIL: no *.solved.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    solved = {}
    for path in done:
        data = json.load(open(path, encoding="utf-8"))
        for qid, a in (data.get("answers", data) if isinstance(data, dict) else {}).items():
            r = rows.get(qid)
            if not r:
                problems.append(f"{qid}: unknown question id")
                continue
            ans, conf, exp = a.get("ans"), a.get("conf"), (a.get("exp") or "").strip()
            if ans not in r["opts"]:
                problems.append(f"{qid}: ans={ans!r} not among {sorted(r['opts'])}")
                continue
            if conf not in CONFS:
                problems.append(f"{qid}: conf={conf!r}")
                continue
            if len(exp) < 25:
                problems.append(f"{qid}: explanation too short")
                continue
            solved[qid] = {"ans": ans, "conf": conf, "exp": exp}

    agree, disagree, single = [], [], []
    final = {}
    for qid, s in solved.items():
        bank = rows[qid]["_bank_ans"]
        if bank is None:
            single.append(qid)
            final[qid] = {**s, "agreement": "no-prior",
                          "prov": "Derived by a single solver — the bank held no answer for "
                                  "this question and MPSC published no key. Unverified."}
        elif bank == s["ans"]:
            agree.append(qid)
            final[qid] = {**s, "agreement": "agree",
                          "prov": "Two independent derivations agree (the bank's inferred "
                                  "answer and a fresh blind solve). No official MPSC key exists."}
        else:
            disagree.append(qid)
            final[qid] = {**s, "conf": "medium" if s["conf"] == "high" else s["conf"],
                          "agreement": "disagree", "bank_ans": bank,
                          "prov": f"Blind solve gives ({s['ans']}); the bank's inferred answer "
                                  f"was ({bank}). They disagree, so one derivation is wrong.",
                          "note": f"conflicts with bank answer ({bank})"}

    os.makedirs(STAGED, exist_ok=True)
    json.dump(final, open(os.path.join(STAGED, "solved.json"), "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)

    print(f"merged {len(final)}/{len(rows)} -> staged/solved.json\n")
    print(f"  agree with bank     {len(agree):>4}")
    print(f"  DISAGREE with bank  {len(disagree):>4}")
    print(f"  single-source       {len(single):>4}   (no prior existed)")
    conf = Counter(v["conf"] for v in final.values())
    print("\n  confidence: " + "  ".join(f"{c} {conf.get(c,0)}" for c in ("high", "medium", "low")))
    if disagree:
        out = [{"id": q, "bank": rows[q]["_bank_ans"], "solved": final[q]["ans"],
                "q": rows[q]["q"], "opts": rows[q]["opts"], "exp": final[q]["exp"]}
               for q in sorted(disagree)]
        json.dump(out, open(os.path.join(STAGED, "disagreements.json"), "w", encoding="utf-8"),
                  indent=2, ensure_ascii=False)
        print(f"\n  {len(disagree)} disagreement(s) -> staged/disagreements.json")
    remaining = [q for q in rows if q not in final]
    if remaining:
        print(f"\n  {len(remaining)} still unsolved")
    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems[:30]:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


def do_apply():
    """Append the solved questions to the System Analyst app's questions.js."""
    sp = os.path.join(STAGED, "solved.json")
    if not os.path.isfile(sp):
        sys.exit("FAIL: staged/solved.json missing — run --merge first")
    solved = json.load(open(sp, encoding="utf-8"))
    problems = []
    rows = {r["id"]: r for r in collect(problems)}

    text = open(APP, encoding="utf-8").read()
    m = re.search(r"window\.QUESTIONS\s*=\s*(\[.*\]);\s*$", text, re.S)
    if not m:
        sys.exit("FAIL: could not parse window.QUESTIONS out of the app's questions.js")
    existing = json.loads(m.group(1))
    have = {q["id"] for q in existing}

    added, quarantined = [], []
    for qid, s in sorted(solved.items()):
        r = rows[qid]
        if qid in have:
            continue
        if r["needs_figure"]:
            quarantined.append(qid)
            continue
        rec = {"id": qid, "src": "past", "sitting": r["sitting"], "srcKey": r["srcKey"],
               "no": r["no"], "paper": r["paper"], "unit": None, "sub": None,
               "q": r["q"], "opts": r["opts"], "ans": s["ans"], "conf": s["conf"],
               "exp": s["exp"], "prov": s["prov"], "note": s.get("note", "")}
        added.append(rec)

    out = existing + added
    with open(APP, "w", encoding="utf-8") as f:
        f.write("window.QUESTIONS = " + json.dumps(out, indent=1, ensure_ascii=False) + ";\n")

    print(f"appended {len(added)} questions -> {os.path.relpath(APP, os.getcwd())}")
    print(f"  app total now {len(out)} (was {len(existing)})")
    if quarantined:
        json.dump(quarantined, open(os.path.join(STAGED, "quarantine.json"), "w"), indent=2)
        print(f"  quarantined {len(quarantined)} figure-dependent: {', '.join(quarantined)}")
    print("\nNOTE: these are UNTAGGED (unit/sub null). The Study tab will not link them "
          "to concepts until a tagging pass runs.")


def main():
    ap = argparse.ArgumentParser()
    for f in ("export", "merge", "apply"):
        ap.add_argument(f"--{f}", action="store_true")
    a = ap.parse_args()
    if a.export:
        do_export()
    elif a.merge:
        do_merge()
    elif a.apply:
        do_apply()
    else:
        ap.error("pass --export, --merge or --apply")


if __name__ == "__main__":
    main()
