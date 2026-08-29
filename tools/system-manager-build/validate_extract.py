#!/usr/bin/env python3
"""
Phase 2 step 2 — validate a vision-extraction pass over the Computer Operator
Technical Paper II scans.

Written BEFORE the extraction ran, deliberately, so the checks aren't shaped to
fit whatever came back. Per CLAUDE.md: assert on counts, fail loudly.

Checks per paper:
  - exactly 75 questions, numbering contiguous 1-75, no duplicates
  - every question has 4 distinct options A-D, all non-empty
  - `ans` is a single letter A-D
  - `conf` is high|medium|low
  - `exp` is present, non-trivial, and does not open with "the correct answer"
  - `exp` does not name a letter other than `ans` as the answer
  - figure-dependent questions are quarantined, not shipped

Usage:
  python3 tools/system-manager-build/validate_extract.py            # validate only
  python3 tools/system-manager-build/validate_extract.py --report   # + coverage detail
"""

import argparse
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "extracted")
EXPECT = 75
LETTERS = ["A", "B", "C", "D"]
CONFS = {"high", "medium", "low"}


def check_paper(key, rows, problems, warnings):
    def bad(msg):
        problems.append(f"{key}: {msg}")

    def warn(msg):
        warnings.append(f"{key}: {msg}")

    nos = [r.get("no") for r in rows]
    if len(rows) != EXPECT:
        bad(f"{len(rows)} questions, expected {EXPECT}")
    dupes = sorted({n for n in nos if nos.count(n) > 1})
    if dupes:
        bad(f"duplicate question numbers: {dupes}")
    missing = [n for n in range(1, EXPECT + 1) if n not in nos]
    if missing:
        bad(f"missing question numbers: {missing}")
    extra = sorted(n for n in nos if not isinstance(n, int) or not 1 <= n <= EXPECT)
    if extra:
        bad(f"question numbers outside 1-{EXPECT}: {extra}")

    for r in rows:
        n = r.get("no")
        tag = f"Q{n}"

        # A very short stem is legitimate — CO2016B-P2 Q34 is literally "HTML is a",
        # verified against the source page. Only an empty/near-empty stem is a hard
        # failure; short-but-present is a warning for a human to eyeball, because
        # genuine brevity and OCR truncation look alike from here.
        q = (r.get("q") or "").strip()
        if len(q) < 5:
            bad(f"{tag}: question text missing or truncated ({q!r})")
        elif len(q) < 15:
            warn(f"{tag}: unusually short stem {q!r} — confirm against the page image")

        opts = r.get("opts") or {}
        if sorted(opts.keys()) != LETTERS:
            bad(f"{tag}: option keys {sorted(opts.keys())}, expected {LETTERS}")
        else:
            vals = [str(opts[k]).strip() for k in LETTERS]
            if any(not v for v in vals):
                bad(f"{tag}: empty option text")
            # Duplicated options happen in these papers for real; flag, don't fail hard,
            # but the question must then be low confidence and say so.
            if len(set(v.lower() for v in vals)) < 4 and r.get("conf") != "low":
                bad(f"{tag}: duplicate option text but conf is "
                    f"{r.get('conf')!r}, expected 'low'")

        ans = r.get("ans")
        if ans not in LETTERS:
            bad(f"{tag}: ans={ans!r}, expected one of {LETTERS}")

        if r.get("conf") not in CONFS:
            bad(f"{tag}: conf={r.get('conf')!r}, expected one of {sorted(CONFS)}")

        exp = (r.get("exp") or "").strip()
        if len(exp) < 25:
            bad(f"{tag}: explanation missing or too short")
        if re.match(r"(?i)^\s*(the\s+)?correct answer", exp):
            bad(f"{tag}: explanation opens with 'the correct answer' (brief forbids it)")
        # Catch an explanation that argues for a different letter than `ans`.
        named = set(re.findall(r"(?i)\boption\s*\(?([a-d])\)?\b", exp))
        if named and ans and ans.lower() not in {x.lower() for x in named} and len(named) == 1:
            bad(f"{tag}: ans={ans} but explanation names only option "
                f"({named.pop().upper()}) — possible contradiction")

        if "needs_figure" not in r:
            bad(f"{tag}: needs_figure missing")

    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    files = sorted(glob.glob(os.path.join(RAW, "*.json")))
    if not files:
        sys.exit(f"FAIL: no extraction output in {os.path.relpath(RAW, os.getcwd())}/ — "
                 f"run the vision pass first (see EXTRACT_BRIEF.md)")

    problems, warnings, papers = [], [], {}
    for path in files:
        key = os.path.splitext(os.path.basename(path))[0]
        try:
            rows = json.load(open(path, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{key}: not valid JSON — {e}")
            continue
        if not isinstance(rows, list):
            problems.append(f"{key}: top level is {type(rows).__name__}, expected a list")
            continue
        papers[key] = check_paper(key, rows, problems, warnings)

    print(f"validated {len(papers)} paper(s) from {os.path.relpath(RAW, os.getcwd())}/\n")

    total = shipped = quarantined = 0
    for key, rows in sorted(papers.items()):
        figs = [r["no"] for r in rows if r.get("needs_figure")]
        conf = {c: sum(1 for r in rows if r.get("conf") == c) for c in ("high", "medium", "low")}
        total += len(rows)
        quarantined += len(figs)
        shipped += len(rows) - len(figs)
        print(f"  {key}: {len(rows)} questions  "
              f"high {conf['high']} / medium {conf['medium']} / low {conf['low']}")
        if figs:
            print(f"      quarantined (needs_figure): {figs}")
        if args.report:
            for r in sorted(rows, key=lambda x: x.get("no") or 0):
                if r.get("conf") in ("low", "medium"):
                    print(f"      Q{r['no']:>2} [{r.get('conf')}] {(r.get('q') or '')[:70]}")

    print(f"\ntotal {total}  shippable {shipped}  quarantined {quarantined}")

    if warnings:
        print(f"\n{len(warnings)} warning(s) — worth an eyeball, not a failure:")
        for w in warnings:
            print(f"  ? {w}")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)

    print("\nall checks passed")


if __name__ == "__main__":
    main()
