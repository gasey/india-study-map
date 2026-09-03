#!/usr/bin/env python3
"""Validate the two independent solver passes over the 2026 Technical Paper II batches.

    python3 tools/system-analyst-build/check_tech2_2026.py

Run this BEFORE any import script touches questions.js. Nothing else checks the
solver output, and every failure mode below is one that would otherwise land
silently in a bank the user revises from for a real exam.

WHY PARSE THE BRIEF INSTEAD OF HARDCODING THE SUBTOPICS. TECH2_2026_BRIEF.md is
what the solvers were told to copy character-for-character, so it is the only
honest source of truth for "is this subtopic real". A second hardcoded copy here
would drift from the brief, and then this checker would start approving strings
no solver was ever asked for (or rejecting ones they were). The parse is asserted
against the unit sizes the brief prints, so a brief reformat breaks the parser
loudly rather than quietly yielding an empty allow-list that passes everything.

WHAT COUNTS AS A FAILURE (exit 1), because it corrupts data:

  * a subtopic that is not character-for-character one of the brief's strings —
    including a subtopic that is real but filed under the WRONG unit, which a
    naive "is this string in the union of all subtopics" check would wave
    through and which would misfile the question in a unit-weighted mock;
  * a missing/extra/reordered/renamed id, or a count that does not match the
    todo — the silent-data-loss failure mode from DEVLOG 2026-08-04;
  * an answerIndex outside the range of that question's OWN options list (the
    todo is the authority on how many options were printed, not the solver);
  * `unit: "OFF"` with a non-empty subtopic, or an on-syllabus unit with an
    empty one;
  * a confidence outside high/medium/low.

WHAT COUNTS AS A WARNING (still exit 0), because it is a judgement call a human
should look at rather than a machine should reject:

  * an explanation that opens "The correct answer is ..." — the brief says not
    to, since the UI already highlights the right option;
  * an explanation that explicitly STATES some other letter is the answer,
    which is the "explanation contradicts answerIndex" trap the brief warns
    about twice. Note what this deliberately does NOT flag: an explanation that
    merely mentions another option in order to shoot it down. The brief asks
    for exactly that, so flagging it produced 47 warnings on the first 360
    records and every one was correct behaviour. See ASSERTS_CORRECT below.
  * `garbled: true` in the todo but `confidence: "high"` from the solver — the
    brief asks for "low" on a damaged question, so this is either an inflated
    rating or an extractor false positive, and only reading it tells you which.

DISAGREEMENTS ARE NOT FAILURES. Where A and B key different options the app
shows both rather than picking one, so this script reports the disagreement rate
and writes the per-question detail to staged/tech2-2026/disagreements.json for
the import step to consume. A disagreement rate near zero would itself be
suspicious — it would suggest the two passes were not actually independent.
"""

import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
BRIEF = HERE / "TECH2_2026_BRIEF.md"
STAGED = HERE / "staged" / "tech2-2026"
DISAGREEMENTS = STAGED / "disagreements.json"

# The brief prints this many subtopics per unit. Asserted after parsing so a
# reformatted brief fails here instead of silently emptying the allow-list.
EXPECTED_SUBTOPIC_COUNTS = {"1": 7, "2": 10, "3": 8, "4": 7}
CONFIDENCES = {"high", "medium", "low"}
LETTERS = "abcdefghijklmnopqrstuvwxyz"


def parse_brief_subtopics():
    """Map unit id -> the exact subtopic strings the brief permits for it."""
    units = {}
    current = None
    for line in BRIEF.read_text(encoding="utf-8").splitlines():
        heading = re.match(r'^\*\*Unit "(\d)" — ', line)
        if heading:
            current = heading.group(1)
            units[current] = []
            continue
        # Any other bold heading or section marker ends the current unit's list.
        # This is what keeps the prose bullets under the `"OFF"` heading (which
        # also contain backticked spans) out of unit 4.
        if line.startswith("**") or line.startswith("#"):
            current = None
            continue
        bullet = re.match(r"^- `(.+)`$", line)
        if bullet and current:
            units[current].append(bullet.group(1))

    got = {u: len(s) for u, s in units.items()}
    if got != EXPECTED_SUBTOPIC_COUNTS:
        sys.exit(f"FAIL: cannot parse {BRIEF.name} — expected subtopic counts "
                 f"{EXPECTED_SUBTOPIC_COUNTS}, parsed {got}. The brief's unit "
                 f"headings or bullet format changed; fix this parser rather "
                 f"than loosening the check.")
    return units


# An explanation that merely NAMES another option is not a contradiction — the
# brief specifically asks solvers to call out the near-miss distractor and say
# why it is wrong ("Option (c) is the classic trap...", "so (d) is the near-miss
# trap", "Option (d) inverts the rule"). An earlier version of this check
# flagged any lone letter mention and produced 47 warnings on 360 records, all
# of them that exact requested behaviour — noise that would bury the one real
# contradiction it exists to catch. So match only an explicit assertion that
# some letter IS the answer, and let distractor discussion pass silently.
ASSERTS_CORRECT = [
    re.compile(r"\(([a-z])\)\s+is\s+(?:the\s+)?(?:correct|right|answer|only correct)", re.I),
    re.compile(r"(?:answer|correct option|correct choice|correct answer)\s+is\s+\(?([a-z])\)?\b", re.I),
    re.compile(r"\bmakes\s+\(?([a-z])\)?\)?\s+(?:the\s+)?correct\b", re.I),
    re.compile(r"\boption\s+\(?([a-z])\)?\s+is\s+(?:the\s+)?(?:correct|right|answer)\b", re.I),
]


def asserted_letter(explanation, n_opts):
    """The option letter an explanation explicitly claims is correct, if any.

    Returns None when the explanation makes no such claim (the normal case) or
    names more than one, which is too ambiguous to flag on.
    """
    found = set()
    for pattern in ASSERTS_CORRECT:
        for m in pattern.finditer(explanation):
            letter = m.group(1).lower()
            if letter in LETTERS[:n_opts]:
                found.add(letter)
    return found.pop() if len(found) == 1 else None


def check_batch(name, todo, solved, subtopics, failures, warnings):
    if len(solved) != len(todo):
        failures.append(f"{name}: {len(solved)} records but the todo has {len(todo)}")
        return

    for i, (t, s) in enumerate(zip(todo, solved)):
        where = f"{name}[{i}] {t['id']}"
        if s.get("id") != t["id"]:
            failures.append(f"{where}: id is {s.get('id')!r} — order/ids must match the todo verbatim")
            continue

        unit = s.get("unit")
        sub = s.get("subtopic", "")
        if unit == "OFF":
            if sub != "":
                failures.append(f"{where}: unit OFF must carry subtopic \"\", got {sub!r}")
        elif unit in subtopics:
            if sub not in subtopics[unit]:
                owner = next((u for u, v in subtopics.items() if sub in v), None)
                if owner:
                    failures.append(f"{where}: subtopic {sub!r} belongs to unit {owner}, "
                                    f"not the unit {unit} it was filed under")
                else:
                    failures.append(f"{where}: subtopic {sub!r} is not one of unit {unit}'s "
                                    f"strings in the brief")
        else:
            failures.append(f"{where}: unit {unit!r} is not 1/2/3/4/OFF")

        n_opts = len(t["options"])
        ai = s.get("answerIndex")
        if not isinstance(ai, int) or not 0 <= ai < n_opts:
            failures.append(f"{where}: answerIndex {ai!r} is outside 0..{n_opts - 1}")

        if s.get("confidence") not in CONFIDENCES:
            failures.append(f"{where}: confidence {s.get('confidence')!r} is not high/medium/low")

        exp = (s.get("explanation") or "").strip()
        if not exp:
            failures.append(f"{where}: empty explanation")
            continue

        if re.match(r"^the correct answer is", exp, re.I):
            warnings.append(f"{where}: explanation opens \"The correct answer is\" — "
                            f"the brief asks not to; the UI already highlights it")
        if isinstance(ai, int) and 0 <= ai < n_opts:
            asserted = asserted_letter(exp, n_opts)
            if asserted and asserted != LETTERS[ai]:
                warnings.append(f"{where}: keyed ({LETTERS[ai]}) but the explanation "
                                f"states ({asserted}) is the answer — one of the two is wrong")
        if t.get("garbled") and s.get("confidence") == "high":
            warnings.append(f"{where}: extractor flagged it garbled but the solver rated "
                            f"it high — either an inflated rating or a false positive")


def main():
    subtopics = parse_brief_subtopics()
    todos = sorted(STAGED.glob("batch-*.todo.json"))
    if not todos:
        sys.exit(f"FAIL: no batch-*.todo.json in {STAGED}")

    failures, warnings, missing = [], [], []
    disagreements = []
    stats = Counter()
    unit_tally = Counter()
    conf_tally = Counter()
    compared = 0

    for todo_path in todos:
        batch = todo_path.name.replace(".todo.json", "")
        todo = json.loads(todo_path.read_text(encoding="utf-8"))
        stats["todo"] += len(todo)
        passes = {}
        for solver in ("A", "B"):
            path = STAGED / f"{batch}.solver{solver}.json"
            if not path.is_file():
                missing.append(path.name)
                continue
            solved = json.loads(path.read_text(encoding="utf-8"))
            passes[solver] = solved
            stats[f"solver{solver}"] += len(solved)
            check_batch(path.name, todo, solved, subtopics, failures, warnings)
            for s in solved:
                unit_tally[s.get("unit")] += 1
                conf_tally[s.get("confidence")] += 1

        if len(passes) == 2 and not failures:
            a_by_id = {s["id"]: s for s in passes["A"]}
            b_by_id = {s["id"]: s for s in passes["B"]}
            for t in todo:
                a, b = a_by_id.get(t["id"]), b_by_id.get(t["id"])
                if not a or not b:
                    continue
                compared += 1
                same_ans = a["answerIndex"] == b["answerIndex"]
                same_unit = a["unit"] == b["unit"]
                if same_ans and same_unit:
                    continue
                disagreements.append({
                    "id": t["id"],
                    "batch": batch,
                    "sitting": t["sitting"],
                    "no": t["no"],
                    "question": t["question"],
                    "options": t["options"],
                    "answer_disagreement": not same_ans,
                    "unit_disagreement": not same_unit,
                    "A": {k: a.get(k) for k in ("unit", "subtopic", "answerIndex",
                                                "confidence", "explanation", "note")},
                    "B": {k: b.get(k) for k in ("unit", "subtopic", "answerIndex",
                                                "confidence", "explanation", "note")},
                })

    print(f"todo: {stats['todo']} questions across {len(todos)} batches")
    print(f"solver A: {stats['solverA']} solved   solver B: {stats['solverB']} solved")
    if missing:
        print(f"\nNOT YET SOLVED ({len(missing)}): {', '.join(missing)}")

    if unit_tally:
        print("\nby unit:      " + "  ".join(f"{u}={n}" for u, n in sorted(
            unit_tally.items(), key=lambda kv: str(kv[0]))))
        print("by confidence: " + "  ".join(f"{c}={n}" for c, n in sorted(
            conf_tally.items(), key=lambda kv: str(kv[0]))))

    if warnings:
        print(f"\n{len(warnings)} WARNING(S) — worth reading, not fatal:")
        for w in warnings:
            print(f"  ! {w}")

    if failures:
        print(f"\n{len(failures)} FAILURE(S):")
        for f in failures:
            print(f"  x {f}")
        sys.exit(1)

    if compared:
        rate = 100 * len(disagreements) / compared
        DISAGREEMENTS.write_text(
            json.dumps(disagreements, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        ans = sum(1 for d in disagreements if d["answer_disagreement"])
        unit = sum(1 for d in disagreements if d["unit_disagreement"])
        print(f"\ndouble-solved: {compared} questions, {len(disagreements)} disagree "
              f"({rate:.1f}%) — {ans} on the answer, {unit} on the unit")
        print(f"detail written to {DISAGREEMENTS.relative_to(ROOT)}")
        if rate < 1 and compared > 50:
            print("  ! a disagreement rate this low is suspicious — check the two "
                  "passes were actually independent")

    print("\nno structural failures" + (" (batches still outstanding)" if missing else ""))


if __name__ == "__main__":
    main()
