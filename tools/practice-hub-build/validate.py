#!/usr/bin/env python3
"""Fidelity gate for MPSC Practice Hub 2 staged papers.

Run this before `build.py`. It refuses to pass a paper whose shape or counts
are wrong, and it *reports* — loudly, never silently — everything a human
should look at: answers that disagree with the marked key, flagged questions,
low-confidence answers, unknown topic slugs.

Why a separate gate at all: this repo lost ~280 questions once to an extractor
that dropped them with no numbering gap to reveal it (DEVLOG 2026-08-04). The
lesson taken from that was not "be more careful" but "make the count a hard
assertion that a build cannot pass without satisfying". `expectedQuestions` in
expected.json is that assertion.

    python3 tools/practice-hub-build/validate.py            # all staged papers
    python3 tools/practice-hub-build/validate.py --strict   # warnings fail too
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from taxonomy import resolve  # noqa: E402

HERE = Path(__file__).parent
STAGED = HERE / "staged"
EXPECTED_FILE = HERE / "expected.json"

LETTERS = ("a", "b", "c", "d")
CONFS = ("high", "medium", "low")

REQUIRED_PAPER_KEYS = [
    "paperId", "exam", "examShort", "sitting", "year", "paper", "paperTitle",
    "series", "maxMarks", "durationMin", "negativeMark", "sourcePdf",
    "questions",
]
REQUIRED_Q_KEYS = ["id", "n", "q", "opts", "marked", "answer", "conf", "why", "topic"]


class Report:
    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.notes: list[str] = []

    def err(self, m):
        self.errors.append(m)

    def warn(self, m):
        self.warnings.append(m)

    def note(self, m):
        self.notes.append(m)


def check_paper(path: Path, expected: dict, rep: Report) -> dict | None:
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as e:
        rep.err(f"{path.name}: not valid JSON — {e}")
        return None

    pid = data.get("paperId", "<missing paperId>")
    tag = f"{pid}"

    for k in REQUIRED_PAPER_KEYS:
        if k not in data:
            rep.err(f"{tag}: missing top-level key '{k}'")
    if data.get("paperId") and path.stem != data["paperId"]:
        rep.err(f"{path.name}: filename does not match paperId '{data['paperId']}'")

    qs = data.get("questions") or []
    if not isinstance(qs, list):
        rep.err(f"{tag}: 'questions' is not a list")
        return None

    # ---- the hard count assertion -------------------------------------
    exp = expected.get(pid, {}).get("expectedQuestions")
    if exp is None:
        rep.warn(
            f"{tag}: no expectedQuestions entry in expected.json — the count "
            f"({len(qs)}) is unverified. Add one."
        )
    elif len(qs) != exp:
        rep.err(
            f"{tag}: question count is {len(qs)}, expected {exp}. "
            f"A paper that is short by even one question is a silent-data-loss "
            f"bug, not a rounding error — go back to {data.get('sourcePdf')}."
        )

    exp_d = expected.get(pid, {}).get("expectedDescriptive")
    ds = data.get("descriptive") or []
    if exp_d is not None and len(ds) != exp_d:
        rep.err(f"{tag}: descriptive count is {len(ds)}, expected {exp_d}")

    # ---- per-question shape -------------------------------------------
    seen_ids: dict[str, int] = {}
    numbers_by_part: dict[str, list[int]] = {}
    disagreements, flagged, lowconf, unmarked = [], [], [], []
    unknown_topics: dict[str, list[str]] = {}

    for i, q in enumerate(qs):
        qid = q.get("id", f"<index {i}>")
        where = f"{tag}/{qid}"

        for k in REQUIRED_Q_KEYS:
            if k not in q:
                rep.err(f"{where}: missing key '{k}'")

        if qid in seen_ids:
            rep.err(f"{where}: duplicate id (also at index {seen_ids[qid]})")
        seen_ids[qid] = i

        opts = q.get("opts") or {}
        if sorted(opts.keys()) != list(LETTERS):
            rep.err(f"{where}: opts keys are {sorted(opts.keys())}, expected a,b,c,d")
        for L in LETTERS:
            v = opts.get(L)
            if not isinstance(v, str) or not v.strip():
                rep.err(f"{where}: option ({L}) is empty or not a string")

        ans = q.get("answer")
        if ans not in LETTERS:
            rep.err(f"{where}: answer '{ans}' is not one of a/b/c/d")

        mk = q.get("marked")
        if mk is not None and mk not in LETTERS:
            rep.err(f"{where}: marked '{mk}' is not a/b/c/d or null")
        if mk is None:
            unmarked.append(qid)
        elif mk != ans:
            disagreements.append((qid, mk, ans, (q.get("why") or "")[:100]))

        if q.get("conf") not in CONFS:
            rep.err(f"{where}: conf '{q.get('conf')}' is not high/medium/low")
        elif q["conf"] == "low":
            lowconf.append(qid)

        why = q.get("why") or ""
        if len(why.strip()) < 15:
            rep.warn(f"{where}: 'why' is {len(why.strip())} chars — too thin to teach from")

        if q.get("flag"):
            flagged.append((qid, q["flag"]))

        topic = q.get("topic") or ""
        _, _, known = resolve(topic)
        if not known:
            unknown_topics.setdefault(topic, []).append(qid)

        part = q.get("part") or "?"
        if isinstance(q.get("n"), int):
            numbers_by_part.setdefault(part, []).append((q["n"], qid))

        # A question whose text still carries an option letter prefix, or is
        # suspiciously short, is usually a sign the extractor mis-split it.
        qt = (q.get("q") or "").strip()
        if not qt:
            rep.err(f"{where}: question text is empty")
        elif len(qt) < 8:
            rep.warn(f"{where}: question text is only {len(qt)} chars: {qt!r}")
        if re.match(r"^\([a-d]\)", qt):
            rep.warn(f"{where}: question text starts with an option letter — mis-split?")

    # ---- numbering continuity per part --------------------------------
    # A gap is an error: it is the signature of a silently dropped question,
    # which is the thing this whole file exists to prevent. A *repeated* number
    # is not — a paper may print sub-parts (Q4(e), Q4(f)) that share one
    # number. Since ids are already checked for uniqueness above, a repeated
    # `n` cannot collide with anything; it only gets a note.
    for part, pairs in numbers_by_part.items():
        nums = [n for n, _ in pairs]
        uniq = set(nums)
        repeats = sorted(n for n in uniq if nums.count(n) > 1)
        for n in repeats:
            ids = [i for m, i in pairs if m == n]
            rep.note(f"{tag}: part {part} number {n} covers sub-parts {', '.join(ids)}")
        gaps = [n for n in range(min(uniq), max(uniq) + 1) if n not in uniq]
        if gaps:
            rep.err(
                f"{tag}: part {part} numbering has gaps at {gaps} "
                f"(runs {min(uniq)}..{max(uniq)}) — questions are missing"
            )

    for slug, ids in unknown_topics.items():
        rep.warn(
            f"{tag}: topic slug '{slug}' is not in taxonomy.py "
            f"({len(ids)} question(s): {', '.join(ids[:6])}"
            f"{'…' if len(ids) > 6 else ''}). It will render under 'Other'."
        )

    rep.note(f"{tag}: {len(qs)} questions, {len(ds)} descriptive items")
    if disagreements:
        rep.note(f"{tag}: {len(disagreements)} answer(s) disagree with the marked key:")
        for qid, mk, ans, why in disagreements:
            rep.note(f"    {qid}: marked ({mk}) → solved ({ans}) — {why}")
    if unmarked:
        rep.note(f"{tag}: {len(unmarked)} question(s) with no marked answer: {', '.join(unmarked)}")
    if flagged:
        rep.note(f"{tag}: {len(flagged)} flagged question(s):")
        for qid, f in flagged:
            rep.note(f"    {qid}: {f}")
    if lowconf:
        rep.note(f"{tag}: {len(lowconf)} low-confidence answer(s): {', '.join(lowconf)}")

    return data


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    ap.add_argument("paper", nargs="*", help="paperId(s) to check; default all")
    args = ap.parse_args()

    expected = {}
    if EXPECTED_FILE.exists():
        expected = json.loads(EXPECTED_FILE.read_text())

    paths = sorted(STAGED.glob("*.json"))
    if args.paper:
        want = set(args.paper)
        paths = [p for p in paths if p.stem in want]
    if not paths:
        print("no staged papers found in", STAGED, file=sys.stderr)
        return 1

    rep = Report()
    for p in paths:
        check_paper(p, expected, rep)

    # papers declared in expected.json but absent from staged/
    for pid in expected:
        if not (STAGED / f"{pid}.json").exists():
            rep.err(f"{pid}: declared in expected.json but staged/{pid}.json is missing")

    for n in rep.notes:
        print(n)
    if rep.warnings:
        print()
        for w in rep.warnings:
            print("WARN ", w)
    if rep.errors:
        print()
        for e in rep.errors:
            print("ERROR", e)

    print()
    print(f"{len(paths)} paper(s): {len(rep.errors)} error(s), {len(rep.warnings)} warning(s)")
    if rep.errors:
        return 1
    if args.strict and rep.warnings:
        print("--strict: failing on warnings")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
