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

VALID_ACTIONS = {"set_answer", "set_explanation", "note_only", "repair_text", "set_tags",
                 "remove_card"}

# Actions that may name an id which is no longer in the bank. Every other action
# FAILS on a missing id, because a typo must not read as success — but a removal
# that already ran leaves its own id absent, so it has to be exempt or the second
# run would fail on the work the first run did correctly.
ABSENT_OK_ACTIONS = {"remove_card"}


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

    unknown = [c["id"] for c in corrections
               if c["id"] not in by_id and c.get("action") not in ABSENT_OK_ACTIONS]
    if unknown:
        sys.exit(f"FAIL: {len(unknown)} correction id(s) are not in the bank: {unknown}")
    bad = [c["id"] for c in corrections if c.get("action") not in VALID_ACTIONS]
    if bad:
        sys.exit(f"FAIL: unknown action on {bad}")

    changed = 0
    already = 0
    removed_ids = set()
    for c in corrections:
        if c["action"] == "remove_card":
            # A removal deletes content, so it verifies the card is the one the
            # finding actually argued about before dropping it — a stale id that
            # now names a different question must stop the run, not be deleted.
            q = by_id.get(c["id"])
            if q is None:
                already += 1
                continue
            stem = (q.get("q") or "").strip()
            if not stem.startswith(c["stem_starts_with"]):
                sys.exit(f"FAIL {c['id']}: stem is {stem[:60]!r}, but the finding "
                         f"expected it to start {c['stem_starts_with']!r}. The card "
                         f"changed since the finding was written; re-check it rather "
                         f"than deleting blind.")
            # The whole justification for deleting this card is that another card
            # already holds the same question correctly. Verify that survivor is
            # actually present, or the removal is data loss rather than dedup.
            keeper = by_id.get(c["superseded_by"])
            if keeper is None:
                sys.exit(f"FAIL {c['id']}: the card it defers to, {c['superseded_by']!r}, "
                         f"is not in the bank. Refusing to remove the only copy.")
            removed_ids.add(c["id"])
            changed += 1
            continue

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
                old_keys, new_keys = sorted(q["opts"]), sorted(c["opts"])
                # Growing the key set is RECOVERY, not renumbering: OCR sometimes
                # glues the printed (d) onto the end of (c), so the bank stores
                # three options where the paper printed four. Restoring the lost
                # key is allowed, but only when the payload says so explicitly and
                # only if every key that already existed survives — that way a
                # genuine renumbering (which would silently move the answer to a
                # different option) still fails loudly.
                if new_keys != old_keys:
                    if not c.get("restores_option"):
                        sys.exit(f"FAIL {c['id']}: repair changes the option KEYS from "
                                 f"{old_keys} to {new_keys} — options are never "
                                 f"renumbered; option A is whatever the paper printed "
                                 f"as (a). If the paper really printed an option the "
                                 f"bank lost, set restores_option: true.")
                    dropped = [k for k in old_keys if k not in new_keys]
                    if dropped:
                        sys.exit(f"FAIL {c['id']}: restores_option may only ADD keys, "
                                 f"but this repair drops {dropped}")
                q["opts"] = c["opts"]
            if "ans" in c:
                q["ans"] = c["ans"]
            if c.get("unanswerable"):
                # Reading the source can establish that NO printed option is
                # correct — MES2015 Q23's four D-expressions reduce to AB, A, A
                # and 1, and a half subtractor needs A XOR B. The bank's way of
                # saying that is `ans: ""` plus an ALL-CAPS reason in `note`,
                # which drops the card out of ANSWERABLE (app.js keeps only
                # `q.ans.length === 1`) so it is never scored or drilled but
                # stays readable. Without this branch the check below makes that
                # state unreachable, and the only way to "repair" such a card is
                # to invent a key for it — which is how TECH1_CSE_193 came to
                # assert a confident (A) that the printed paper does not support.
                if c.get("ans", q["ans"]) != "":
                    sys.exit(f"FAIL {c['id']}: unanswerable repairs must set ans to \"\", "
                             f"got {c.get('ans')!r}")
                if not c.get("note"):
                    sys.exit(f"FAIL {c['id']}: an unanswerable card must carry a note saying "
                             f"why — an empty answer with no reason reads as missing data")
            elif q["ans"] not in q["opts"]:
                sys.exit(f"FAIL {c['id']}: after repair, answer {q['ans']!r} is not one of "
                         f"{sorted(q['opts'])}")
            if "exp" in c:
                q["exp"] = c["exp"]
            if "conf" in c:
                q["conf"] = c["conf"]
        elif c["action"] == "set_tags":
            # Re-filing a question under a different syllabus unit/leaf. Kept
            # separate from set_answer because it asserts nothing about the
            # answer — a question can be perfectly answered and still be shelved
            # in the wrong unit, which is what makes a unit-weighted mock draw
            # from the wrong pool. Guarded the same way set_answer is: the
            # payload records what the audit saw, so a card that has moved on
            # since stops the run rather than being re-filed on a stale verdict.
            if q.get("unit") not in (c["old_unit"], c["unit"]):
                sys.exit(f"FAIL {c['id']}: stored unit is {q.get('unit')!r}, but the "
                         f"audit saw {c['old_unit']!r}. Re-audit rather than re-filing blind.")
            q["unit"] = c["unit"]
            if "sub" in c:
                q["sub"] = c["sub"]

        if c.get("note"):
            q["note"] = merge_note(q.get("note"), c["note"], c["note_mode"])

        if json.dumps(q, sort_keys=True, ensure_ascii=False) == before:
            already += 1
        else:
            changed += 1

    if removed_ids:
        questions = [q for q in questions if q["id"] not in removed_ids]

    save_js(QUESTIONS_FILE, "QUESTIONS", questions)

    labels = {
        "set_answer": "answers corrected",
        "set_explanation": "explanations rewritten",
        "note_only": "flagged by note only",
        "repair_text": "stems/options repaired from source",
        "set_tags": "re-filed under a different unit/subtopic",
        "remove_card": "duplicate card(s) removed",
    }
    by_action = {a: sum(1 for c in corrections if c["action"] == a) for a in VALID_ACTIONS}
    print(f"applied {len(corrections)} corrections to {QUESTIONS_FILE.relative_to(ROOT)}")
    for action, label in labels.items():
        if by_action[action]:
            print(f"  {by_action[action]} {label}")
    print(f"  {changed} record(s) changed, {already} already up to date")


if __name__ == "__main__":
    main()
