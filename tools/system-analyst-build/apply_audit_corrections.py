#!/usr/bin/env python3
"""Apply reviewed answer-key findings to System Analyst.

    python3 tools/system-analyst-build/apply_audit_corrections.py

The bulk of the payload is the 2026-09-02 audit described below. A second,
smaller batch dated 2026-09-04 was added by the TECH1_CSE retag pass (see
retag_tech1_cse.py) and is `note_only` throughout: reading 41 mis-tagged
questions closely surfaced two contradictions that are content bugs rather than
tagging bugs, and neither can be fixed by choosing a different letter.
TECH1_CSE_140/_143 are the same FD question keyed D and C — mechanically, under
the FDs as printed, NEITHER is right and all four options are non-keys.
TECH1_CSE_149/_161 key on opposite premises about whether "rasterization" and
"scan conversion" name the same thing. Both pairs are flagged where the student
will meet them rather than silently reconciled.

WHERE THE FINDINGS CAME FROM. Every question in both apps (3,253 of them) was
re-solved from scratch by an independent agent working from tools/VERIFY_BRIEF.md,
which raised 83 findings. Each finding was then adjudicated by TWO further agents
with deliberately different lenses — one re-solving the problem from first
principles, one trying to prove the STORED answer right after all. Only findings
both lenses upheld are in this file. A finding where the two refuters agreed the
stored answer was wrong but named DIFFERENT replacements is not here; it is not
a correction, it is an open question.

WHAT IS DELIBERATELY *NOT* CORRECTED HERE:

  * Anything behind a real official MPSC answer key. Per VERIFY_BRIEF.md the key
    outranks the agent, so those become a `note` and keep their stored `ans`.
    "Real" means an official key EXISTS — most derived provenance strings end
    "...no official key for this sitting", so testing for the word `official`
    alone gets this exactly backwards. See provLine() in app.js, same trap.
  * broken_question findings. A stem the extractor damaged cannot be repaired by
    rewriting `ans`; it needs the source PDF read by eye. Handled separately.

PRESERVING WHAT WAS THERE. A corrected card records its superseded answer in
`note` — the house convention from the UDC work (DEVLOG 2026-09-03), which is
that a correction never silently erases what it replaced. Nine of these cards
already carried a note from an earlier pass saying the marked answer looked
wrong; those notes are RESOLVED by the correction and would contradict the new
key if kept, so the payload marks them `note_mode: "replace"`. A note carrying
unrelated provenance ("only 104 of 149 questions were imported") is marked
`"append"` and survives. The mode is per-card and explicit precisely because
getting it wrong in either direction is silent damage.

IDEMPOTENT. Corrections are keyed by question id and are pure field rewrites, so
re-running is a no-op: the second run finds `ans` already equal to the target and
the note already present, and reports 0 changed. It FAILS LOUDLY on an id that is
not in the bank rather than skipping it — a typo'd id must not read as success.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
QUESTIONS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "questions.js"
CORRECTIONS = HERE / "staged" / "audit-corrections.json"

VALID_ACTIONS = {"set_answer", "set_explanation", "note_only", "repair_text"}


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.search(rf"window\.{name}\s*=\s*(\[.*\])\s*;\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    # indent=1 matches import_prog2018_p1.py / import_2026_tech1.py, so the diff
    # of a 1400-record file stays reviewable.
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def merge_note(existing, new, mode):
    """Combine the audit's note with whatever the card already said.

    `set`/`replace` both end up as just `new` — the difference is only in what
    the payload is asserting (the card had no note, vs. it had one that the
    correction resolves). `append` keeps the old text and is guarded against
    re-appending, which is what makes a second run a no-op.
    """
    existing = (existing or "").strip()
    if mode in ("set", "replace"):
        return new
    if mode == "append":
        if not existing:
            return new
        return existing if new in existing else f"{existing} {new}".strip()
    raise RuntimeError(f"unknown note_mode {mode!r}")


def main():
    if not CORRECTIONS.is_file():
        sys.exit(f"FAIL: missing {CORRECTIONS}")
    corrections = json.loads(CORRECTIONS.read_text(encoding="utf-8"))

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    by_id = {q["id"]: q for q in questions}

    unknown = [c["id"] for c in corrections if c["id"] not in by_id]
    if unknown:
        sys.exit(f"FAIL: {len(unknown)} correction id(s) are not in the bank: {unknown}")
    bad = [c["id"] for c in corrections if c.get("action") not in VALID_ACTIONS]
    if bad:
        sys.exit(f"FAIL: unknown action on {bad}")

    changed = 0
    already = 0
    for c in corrections:
        q = by_id[c["id"]]
        before = json.dumps(q, sort_keys=True, ensure_ascii=False)

        if c["action"] == "set_answer":
            # The payload records what the card said when the audit ran. If the
            # bank has moved on since, this correction was written against a
            # question that no longer exists in that form — stop rather than
            # overwrite a newer answer with a stale verdict.
            if q["ans"] not in (c["old_ans"], c["ans"]):
                sys.exit(f"FAIL {c['id']}: stored answer is {q['ans']!r}, but the audit "
                         f"saw {c['old_ans']!r}. The card changed since the audit ran; "
                         f"re-audit it rather than applying this correction blind.")
            if c["ans"] not in q["opts"]:
                sys.exit(f"FAIL {c['id']}: corrected answer {c['ans']!r} is not one of "
                         f"the options {sorted(q['opts'])}")
            q["ans"] = c["ans"]
            q["exp"] = c["exp"]
            q["conf"] = c["conf"]
        elif c["action"] == "set_explanation":
            q["exp"] = c["exp"]
        elif c["action"] == "repair_text":
            # Stem/option text recovered by reading the source page (see
            # tools/RECOVER_BRIEF.md). Repairing the TEXT must never silently
            # move the ANSWER: `ans` only changes when the payload says so
            # explicitly, and the letter must still exist afterwards.
            if "q" in c:
                q["q"] = c["q"]
            if "opts" in c:
                if sorted(c["opts"]) != sorted(q["opts"]):
                    sys.exit(f"FAIL {c['id']}: repair changes the option KEYS from "
                             f"{sorted(q['opts'])} to {sorted(c['opts'])} — options are "
                             f"never renumbered; option A is whatever the paper printed as (a)")
                q["opts"] = c["opts"]
            if "ans" in c:
                q["ans"] = c["ans"]
            if q["ans"] not in q["opts"]:
                sys.exit(f"FAIL {c['id']}: after repair, answer {q['ans']!r} is not one of "
                         f"{sorted(q['opts'])}")
            if "exp" in c:
                q["exp"] = c["exp"]
            if "conf" in c:
                q["conf"] = c["conf"]

        if c.get("note"):
            q["note"] = merge_note(q.get("note"), c["note"], c["note_mode"])

        if json.dumps(q, sort_keys=True, ensure_ascii=False) == before:
            already += 1
        else:
            changed += 1

    save_js(QUESTIONS_FILE, "QUESTIONS", questions)

    labels = {
        "set_answer": "answers corrected",
        "set_explanation": "explanations rewritten",
        "note_only": "flagged by note only",
        "repair_text": "stems/options repaired from source",
    }
    by_action = {a: sum(1 for c in corrections if c["action"] == a) for a in VALID_ACTIONS}
    print(f"applied {len(corrections)} corrections to {QUESTIONS_FILE.relative_to(ROOT)}")
    for action, label in labels.items():
        if by_action[action]:
            print(f"  {by_action[action]} {label}")
    print(f"  {changed} record(s) changed, {already} already up to date")


if __name__ == "__main__":
    main()
