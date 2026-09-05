#!/usr/bin/env python3
"""Merge two independent solver passes into a staged `<sitting>-import.json`.

    python3 tools/system-analyst-build/merge_solves.py staged/pe2018-p3 \
        --coverage "Only the questions matching the 2026 syllabus were imported from this paper (20 of 50)."

WHY THIS EXISTS. The Paper III imports all follow the same rule — two solvers
who never see each other's work, `conf` = the LOWER of their two self-ratings —
but ILM Nov 2023 and ILM Dec 2018 both had that rule applied BY HAND at the
merge step. Three more papers are queued, and "take the lower of two" is
exactly the kind of one-line judgement that silently becomes "take solver A's"
when a human is tired. So it is executable here instead.

THE LOWER-OF-TWO RULE, AND WHY IT MATTERS. `conf` drives a visible badge. If a
question is stored `high` because one solver was confident and the other
hedged, the app tells the reader an uncertain answer is settled. Taking the
minimum cannot overstate; taking either solver's own rating can.

DISAGREEMENTS ARE A HARD FAILURE, NOT A VOTE. If the two solvers picked
different letters, there is no majority to appeal to with n=2, and quietly
preferring one of them would throw away the only signal the second pass exists
to produce. Those questions are written to `_disagreements.json` and the script
exits non-zero, so a human decides and records why (as the ILM Dec 2018 Q32
cross-paper contradiction was).

EXPLANATIONS COME FROM SOLVER B. Arbitrary but fixed, and it matches what the
two hand-merged papers already did (35 of ILM Dec 2018's 36 explanations are
solver B's). Recorded so the next paper does not re-decide it. `--exp-from a`
overrides.

NOTES. `--coverage` text is appended to every record's note, because the static
app finds the "N of M imported" line with an anchored `/^Only the /` test over
the sitting's questions — a sitting where NO record's note starts that way
shows a bare MCQ count that reads as the paper's full length. Optional
`notes.json` (`{"17": "text", ...}`) supplies per-question text, which is
placed BEFORE the coverage sentence so that the card keeps rendering the short
coverage line from a plain record rather than a long ambiguity essay.
"""

import argparse
import json
import sys
from pathlib import Path

RANK = {"low": 0, "medium": 1, "high": 2}
UNRANK = {v: k for k, v in RANK.items()}


def load_pass(staged: Path, which: str) -> dict:
    """Read solve<which>.json, or the solve<which>-1.json.. split form."""
    single = staged / f"solve{which}.json"
    parts = sorted(staged.glob(f"solve{which}-*.json"))
    files = [single] if single.is_file() else parts
    if not files:
        sys.exit(f"FAIL: no solve{which}.json or solve{which}-*.json in {staged}")

    out = {}
    for f in files:
        for rec in json.loads(f.read_text(encoding="utf-8")):
            no = rec["no"]
            if no in out:
                sys.exit(f"FAIL: solver {which} answers Q{no} more than once "
                         f"(duplicate found in {f.name})")
            out[no] = rec
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("staged", type=Path, help="staged dir, e.g. staged/pe2018-p3")
    ap.add_argument("--coverage", required=True,
                    help='must start with "Only the " — see module docstring')
    ap.add_argument("--notes", type=Path, default=None,
                    help='JSON object {"<no>": "note text"} for per-question notes')
    ap.add_argument("--exp-from", choices=("a", "b"), default="b")
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    staged = args.staged if args.staged.is_absolute() else Path.cwd() / args.staged
    if not staged.is_dir():
        sys.exit(f"FAIL: {staged} is not a directory")

    if not args.coverage.startswith("Only the "):
        sys.exit('FAIL: --coverage must start with "Only the " or the static '
                 "app's anchored /^Only the / test will never match it, and the "
                 "sitting card will show a bare MCQ count that reads as the "
                 "paper's full length.")

    src = json.loads((staged / "_solve-input.json").read_text(encoding="utf-8"))
    inp = {q["no"]: q for q in src}
    A = load_pass(staged, "A")
    B = load_pass(staged, "B")

    for label, got in (("A", A), ("B", B)):
        missing = sorted(set(inp) - set(got))
        extra = sorted(set(got) - set(inp))
        if missing or extra:
            sys.exit(f"FAIL: solver {label} question set does not match the input"
                     + (f"; missing {missing}" if missing else "")
                     + (f"; unexpected {extra}" if extra else ""))

    # An answer letter that is not one of that question's own options means the
    # solver was reading a different option list than the one being imported.
    for label, got in (("A", A), ("B", B)):
        for no in sorted(inp):
            if got[no]["ans"] not in inp[no]["opts"]:
                sys.exit(f"FAIL: solver {label} answered Q{no} with "
                         f"{got[no]['ans']!r}, which is not one of its options "
                         f"{sorted(inp[no]['opts'])}")
            if got[no]["conf"] not in RANK:
                sys.exit(f"FAIL: solver {label} Q{no} conf {got[no]['conf']!r} "
                         f"is not high/medium/low")

    disagree = [no for no in sorted(inp) if A[no]["ans"] != B[no]["ans"]]
    if disagree:
        path = staged / "_disagreements.json"
        path.write_text(json.dumps(
            [{"no": no, "q": inp[no]["q"], "opts": inp[no]["opts"],
              "A": {k: A[no][k] for k in ("ans", "conf", "exp")},
              "B": {k: B[no][k] for k in ("ans", "conf", "exp")}}
             for no in disagree], ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"{len(disagree)} disagreement(s): "
              + ", ".join(f"Q{no} (A={A[no]['ans']}/B={B[no]['ans']})"
                          for no in disagree), file=sys.stderr)
        sys.exit(f"FAIL: wrote {path.name}. With two solvers there is no majority "
                 f"to break a tie, so resolve these by hand and record why.")

    notes = {}
    if args.notes:
        notes = {int(k): v for k, v in
                 json.loads(args.notes.read_text(encoding="utf-8")).items()}
        unknown = sorted(set(notes) - set(inp))
        if unknown:
            sys.exit(f"FAIL: --notes has entries for questions not being "
                     f"imported: {unknown}")

    exp_src = A if args.exp_from == "a" else B
    records, downgraded = [], []
    for no in sorted(inp):
        q = inp[no]
        lo = UNRANK[min(RANK[A[no]["conf"]], RANK[B[no]["conf"]])]
        if lo != A[no]["conf"] or lo != B[no]["conf"]:
            downgraded.append((no, A[no]["conf"], B[no]["conf"], lo))
        note = f"{notes[no].strip()} {args.coverage}" if no in notes else args.coverage
        records.append({
            "no": no,
            "paper": q["paper"],
            "unit": q["unit"],
            "sub": q["sub"],
            "q": q["q"],
            "opts": q["opts"],
            "ans": A[no]["ans"],
            "exp": exp_src[no]["exp"],
            "conf": lo,
            "note": note,
        })

    out = args.out or staged.parent / f"{staged.name}-import.json"
    out.write_text(json.dumps(records, ensure_ascii=False, indent=1) + "\n",
                   encoding="utf-8")

    counts = {c: sum(1 for r in records if r["conf"] == c)
              for c in ("high", "medium", "low")}
    print(f"{len(records)} questions merged -> {out}")
    print(f"  agreement: {len(inp)}/{len(inp)} (0 disagreements)")
    print(f"  conf (lower of two): {counts}")
    print(f"  explanations from solver {args.exp_from.upper()}")
    if downgraded:
        print("  conf downgraded by the lower-of-two rule:")
        for no, a, b, lo in downgraded:
            print(f"    Q{no}: A={a} B={b} -> {lo}")
    if notes:
        print(f"  per-question notes on: {sorted(notes)}")


if __name__ == "__main__":
    main()
