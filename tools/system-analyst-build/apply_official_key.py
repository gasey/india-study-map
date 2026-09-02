#!/usr/bin/env python3
"""Apply MPSC's official final answer key to the ILM November 2023 sitting.

    python3 tools/system-analyst-build/apply_official_key.py            # dry run
    python3 tools/system-analyst-build/apply_official_key.py --write

WHY THIS EXISTS AT ALL. All 136 ILM2023 records shipped with provenance ending
"no official key exists for this sitting". That was false the whole time: MPSC
published a final answer key for the Inspector of Legal Metrology technical
examination (Notification No. ILM/1/2018-MPSC, 8 March 2024) with per-paper keys
for Computer Science & Engineering Papers I-III, and it was sitting unread in
the question-bank repo. Nobody checked the pipeline's assertion. That is the
oldest rule in CLAUDE.md landing on a new surface, which is why this applier
re-verifies rather than trusting anything staged.

NOT the same thing as apply_audit_corrections.py. That script applies findings
this project ARGUED FOR. This one applies an external authority and rewrites
`prov` for every record it touches, including the 123 whose stored answer was
already right - re-provenancing is most of the work here, because it is the
difference between a blue "official key" badge and an unrated derived one on a
card the reader is revising from. Keeping the two appliers separate keeps
"MPSC says" and "we concluded" from blurring in the provenance string.

WHAT AUTHORITY MEANS HERE. Per tools/VERIFY_BRIEF.md the key outranks our own
solving even when we disagree, so `ans` follows the key without exception. But
five of these keys contradict standard theory (Q35 PMOS threshold polarity, Q46
the clockless flip-flop, Q66 BCD compactness, Q9 the combinations formula, Q6
what induction proves), and a card whose highlighted option teaches a falsehood
is exactly the harm CLAUDE.md is about. So every one of them carries a note that
states the standard result and why the key differs. The note is load-bearing,
not decoration: `ans` alone would silently teach the wrong physics.

Q29 OF PAPER I IS COMPENSATED. The key prints "(Compensated)" rather than a
letter - MPSC accepted no option and credited every candidate. Verified: the
function simplifies to y(x+z) = xy+yz and none of the four options is that. It
gets `ans: ""`, the house convention for unanswerable-as-printed (see
MES2015_PAPER1_013/015/023), which drops it out of ANSWERABLE in app.js and so
out of every mock, practice pool and accuracy statistic.

SELF-VERIFYING. The key is re-read from staged/ilm2023-official-key.json and
re-compared against the bank on every run, and the script fails if the agreement
rate falls outside a sane band - 123/135 agreeing is what proves the question
numbering lines up (random would be ~25%), so if a future edit breaks the
alignment this stops rather than silently rewriting 135 answers off a bad join.
Idempotent: pure field rewrites keyed by id, so a second run reports 0 changed.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
QUESTIONS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "questions.js"
KEY_FILE = HERE / "staged" / "ilm2023-official-key.json"
ANNOTATIONS_FILE = HERE / "staged" / "ilm2023-key-annotations.json"

SECTION_FOR_PAPER = {"1": "cse_paper_1", "2": "cse_paper_2"}
ID_RE = re.compile(r"^ILM2023_P(\d)_(\d+)$")

# The clause we are replacing, and what replaces it. Matched on the whole clause
# rather than the word "official" because the string we are removing CONTAINS
# "official" - see provLine() in app.js for the same trap in the other direction.
DERIVED_CLAUSE = re.compile(r"^answer derived by review\b.*$", re.I)

OFFICIAL_CLAUSE = (
    "answer from MPSC's official final answer key, Notification No. "
    "ILM/1/2018-MPSC dated 8 March 2024 (the 14 March 2024 corrigendum revises "
    "only the Physics papers and leaves Computer Science & Engineering Paper-I "
    "unchanged)"
)
COMPENSATED_CLAUSE = (
    "MPSC compensated this question in its official final answer key, "
    "Notification No. ILM/1/2018-MPSC dated 8 March 2024 - the key prints "
    "'(Compensated)' in place of a letter, so not one of the printed options "
    "was accepted"
)

# Sanity band on the key-vs-bank agreement rate. The point is to catch a broken
# join, not to police the exact number: a genuine mis-alignment lands near 25%.
MIN_AGREEMENT = 0.70


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.search(rf"window\.{name}\s*=\s*(\[.*\])\s*;\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    # indent=1 to match the other writers of this file, so a 1400-record diff
    # stays reviewable.
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def reprovenance(prov, compensated):
    """Swap the 'derived, no official key' clause for the official-key one.

    Trailing clauses like '; OCR damage in source scan' are real observations
    about the extraction and survive untouched - the key says nothing about
    whether the scan was clean.
    """
    replacement = COMPENSATED_CLAUSE if compensated else OFFICIAL_CLAUSE
    clauses = [c.strip() for c in (prov or "").split(";")]
    out, replaced = [], False
    for c in clauses:
        if DERIVED_CLAUSE.match(c):
            out.append(replacement)
            replaced = True
        else:
            out.append(c)
    if not replaced:
        # Already re-provenanced (idempotent re-run), or a shape we did not
        # expect. Either way do not append a second key clause.
        if replacement not in (prov or ""):
            raise RuntimeError(f"no derived clause to replace in prov: {prov!r}")
        return prov
    return "; ".join(c for c in out if c)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true",
                    help="write the changes; without it this is a dry run")
    args = ap.parse_args()

    key = json.loads(KEY_FILE.read_text(encoding="utf-8"))
    ann_doc = json.loads(ANNOTATIONS_FILE.read_text(encoding="utf-8"))
    annotations = {a["id"]: a for a in ann_doc["annotations"]}

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    records = [q for q in questions if q["id"].startswith("ILM2023_")]
    if not records:
        sys.exit("FAIL: no ILM2023 records in the bank")

    unknown = sorted(set(annotations) - {q["id"] for q in records})
    if unknown:
        sys.exit(f"FAIL: annotation id(s) not in the bank: {unknown}")

    # --- pass 1: verify the join before touching anything -------------------
    agree = disagree = 0
    compensated_ids = []
    for q in records:
        m = ID_RE.match(q["id"])
        if not m:
            sys.exit(f"FAIL: unparseable ILM2023 id {q['id']!r}")
        paper, num = m.group(1), int(m.group(2))
        if num != q.get("no"):
            sys.exit(f"FAIL {q['id']}: id number {num} != stored no {q.get('no')!r}; "
                     f"the key joins on the printed question number, so a renumbered "
                     f"record would silently take the wrong answer")
        section = SECTION_FOR_PAPER.get(paper)
        if section is None:
            sys.exit(f"FAIL {q['id']}: no official key section for paper {paper}")
        official = key[section].get(str(num))
        if official is None:
            compensated_ids.append(q["id"])
            continue
        if q.get("ans") == official:
            agree += 1
        else:
            disagree += 1

    total = agree + disagree
    rate = agree / total if total else 0
    print(f"key vs bank: {agree} agree, {disagree} disagree, "
          f"{len(compensated_ids)} compensated ({rate:.1%} agreement)")
    if rate < MIN_AGREEMENT:
        sys.exit(f"FAIL: agreement {rate:.1%} is below {MIN_AGREEMENT:.0%} - the key and "
                 f"the bank are probably not aligned on question numbering. Refusing to "
                 f"rewrite {total} answers off a suspect join.")

    # Every question whose answer the key changes must carry an annotation: an
    # answer flipping under the reader with no explanation is the failure this
    # project keeps having.
    changing = []
    for q in records:
        m = ID_RE.match(q["id"])
        num = int(m.group(2))
        official = key[SECTION_FOR_PAPER[m.group(1)]].get(str(num))
        if official is not None and q.get("ans") not in (official, "") and q["id"] not in annotations:
            changing.append(q["id"])
    if changing:
        sys.exit(f"FAIL: the key changes the answer on {len(changing)} card(s) with no "
                 f"annotation to explain it: {changing}")

    # --- pass 2: apply ------------------------------------------------------
    n_ans, n_prov, n_exp, n_note, n_opts, changed = 0, 0, 0, 0, 0, 0
    for q in records:
        before = json.dumps(q, sort_keys=True, ensure_ascii=False)
        m = ID_RE.match(q["id"])
        num = int(m.group(2))
        official = key[SECTION_FOR_PAPER[m.group(1)]].get(str(num))
        ann = annotations.get(q["id"])
        is_comp = official is None

        if ann and ann.get("derived_ans") and q.get("ans") not in (
                ann["derived_ans"], official or "", ""):
            sys.exit(f"FAIL {q['id']}: stored answer is {q.get('ans')!r} but the "
                     f"annotation was written against {ann['derived_ans']!r}. The card "
                     f"changed since; re-check it against the key rather than applying "
                     f"this blind.")

        if is_comp:
            if q.get("ans") != "":
                q["ans"] = ""
                n_ans += 1
        else:
            if q.get("ans") != official:
                q["ans"] = official
                n_ans += 1

        new_prov = reprovenance(q.get("prov"), is_comp)
        if new_prov != q.get("prov"):
            q["prov"] = new_prov
            n_prov += 1

        # `conf` grades a DERIVED answer's trustworthiness. These answers are no
        # longer derived, so leaving "high"/"medium" behind would be stale data
        # describing a superseded answer. "official" is deliberately not one of
        # provLine()'s three confidence keys: if `prov` ever stopped naming the
        # key, the badge falls back to blank rather than asserting confidence
        # this record no longer has.
        if q.get("conf") != "official":
            q["conf"] = "official"

        if ann:
            for letter, text in (ann.get("opts_repair") or {}).items():
                if letter not in q["opts"]:
                    sys.exit(f"FAIL {q['id']}: opts_repair names option {letter!r} "
                             f"which this question does not have")
                if q["opts"][letter] != text:
                    q["opts"][letter] = text
                    n_opts += 1
            if ann.get("exp") and q.get("exp") != ann["exp"]:
                q["exp"] = ann["exp"]
                n_exp += 1
            if ann.get("note"):
                existing = (q.get("note") or "").strip()
                mode = ann.get("note_mode", "append")
                if mode == "append" and existing:
                    merged = existing if ann["note"] in existing else f"{ann['note']} {existing}".strip()
                else:
                    merged = ann["note"]
                if merged != q.get("note"):
                    q["note"] = merged
                    n_note += 1

        # Post-conditions. An empty `ans` is legal only for the compensated card.
        if q["ans"] and q["ans"] not in q["opts"]:
            sys.exit(f"FAIL {q['id']}: answer {q['ans']!r} is not one of {sorted(q['opts'])}")
        if not q["ans"] and not is_comp:
            sys.exit(f"FAIL {q['id']}: blank answer on a question the key answers")

        if json.dumps(q, sort_keys=True, ensure_ascii=False) != before:
            changed += 1

    print(f"  {n_ans} answer(s) set from the key, {n_prov} re-provenanced, "
          f"{n_exp} explanation(s) rewritten, {n_note} note(s) set, "
          f"{n_opts} option(s) repaired from source")
    print(f"  {changed} record(s) changed, {len(records) - changed} already up to date")
    if compensated_ids:
        print(f"  compensated (excluded from all scoring): {', '.join(compensated_ids)}")

    if args.write:
        save_js(QUESTIONS_FILE, "QUESTIONS", questions)
        print(f"wrote {QUESTIONS_FILE.relative_to(ROOT)}")
    else:
        print("\ndry run - re-run with --write to apply")


if __name__ == "__main__":
    main()
