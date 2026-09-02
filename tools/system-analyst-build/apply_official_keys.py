#!/usr/bin/env python3
"""Apply MPSC official answer keys to the System Analyst bank, one sitting per
registry entry.

    python3 tools/system-analyst-build/apply_official_keys.py                # dry run, all
    python3 tools/system-analyst-build/apply_official_keys.py --write
    python3 tools/system-analyst-build/apply_official_keys.py --sitting MES2023 --write

Supersedes the single-sitting `apply_official_key.py`. The generalisation is the
point of the Answer_Keys sweep: 120 published MPSC keys sit in the
mpsc-question-bank repo, most of them for exams that have nothing to do with
this bank, but every one that DOES match is the same job - overturn the answers
the key contradicts, and re-provenance the ones it merely confirms.

WHY RE-PROVENANCING IS MOST OF THE WORK. A sitting whose answers were derived by
an agent ships a badge saying so. When a key turns up, the answers that were
already right do not change - but the card stops saying "no official key exists
for this sitting", which was a false statement about the world, and starts saying
which notification backs it. On ILM2023 that was 123 of 135 records.

AUTHORITY. tools/VERIFY_BRIEF.md: an official key outranks our own solving even
where we disagree, so `ans` follows the key without exception. But keys ARE
wrong - 8 of 62 on MES2023, 12 of 135 on ILM2023, and proportionally more of the
MES2023 ones are indefensible rather than merely arguable. So every overturned
card must carry an annotation, and the script REFUSES to run if one is missing.
That refusal is the safety property: without it, a key error becomes a card that
teaches a falsehood under an authoritative blue badge, to someone revising for a
real exam with negative marking.

TRANSCRIPTIONS ARE STAGED, NOT READ FROM PDF. The key PDFs live in a different
repo, so each sitting's key is transcribed into staged/<sitting>-official-key.json
and that is what this script consumes. Every transcription is verified against
its PDF before being staged - by parsing the text layer where there is one, and
by rendering the pages and reading them by eye where there is not. OCR is used
for DISCOVERY (which exam, which papers) and never for a letter.

SELF-VERIFYING. The key is re-joined to the bank on every run and the script
aborts if agreement drops below a floor: a high agreement rate is what proves the
key's question numbering lines up with the bank's, since a mis-aligned join lands
near 25% on four-option questions. Idempotent - pure field rewrites keyed by id,
so a second run reports 0 changed.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
QUESTIONS_FILE = ROOT / "public" / "mpsc-system-analyst" / "data" / "questions.js"
STAGED = HERE / "staged"

# A mis-aligned join lands near 25% on four-option questions, so anything this
# high can only mean the numbering matches. Not a quality bar on the key.
MIN_AGREEMENT = 0.70

SITTINGS = {
    "ILM2023": {
        "label": "Inspector of Legal Metrology, November 2023",
        "key": "ilm2023-official-key.json",
        "annotations": "ilm2023-key-annotations.json",
        # Section-A-style flat numbering; no Section B records exist for this sitting.
        "id_re": r"^ILM2023_P(\d)_(\d+)$",
        "sections": {"1": "cse_paper_1", "2": "cse_paper_2"},
        "official_clause": (
            "answer from MPSC's official final answer key, Notification No. "
            "ILM/1/2018-MPSC dated 8 March 2024 (the 14 March 2024 corrigendum revises "
            "only the Physics papers and leaves Computer Science & Engineering Paper-I "
            "unchanged)"),
        "compensated_clause": (
            "MPSC compensated this question in its official final answer key, "
            "Notification No. ILM/1/2018-MPSC dated 8 March 2024 - the key prints "
            "'(Compensated)' in place of a letter, so not one of the printed options "
            "was accepted"),
    },
    "MES2023": {
        "label": "Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023",
        "key": "mes2023-official-key.json",
        "annotations": "mes2023-key-annotations.json",
        # `\d+` deliberately excludes the Section B ids (MES2023_P1_B020 and
        # friends). Section B is conventional/descriptive, the Commission
        # published no key for it, and B020 carries `no: 20` - so a looser
        # pattern would join it to Section A's Q20 and overwrite a Section B
        # answer with a Section A key. That is not hypothetical: an earlier
        # draft of this comparison did exactly that.
        "id_re": r"^MES2023_P(\d)_(\d+)$",
        "sections": {"1": "cse_paper_1_section_a", "2": "cse_paper_2_section_a"},
        "official_clause": (
            "answer from MPSC's official final answer key for this sitting, dated "
            "5 September 2023 (Section A only; the Commission did not publish a key "
            "for Section B)"),
        "compensated_clause": (
            "MPSC compensated this question in its official final answer key for this "
            "sitting, dated 5 September 2023 - the key prints no letter for it, so not "
            "one of the printed options was accepted"),
    },
}

DERIVED_CLAUSE = re.compile(r"^answer derived by review\b.*$", re.I)
# Matches the two shapes already-applied provenance can take, so a re-run is a
# no-op instead of appending a second key clause.
APPLIED_HINT = re.compile(r"official final answer key|compensated this question", re.I)


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"window\.{name}\s*=\s*(\[.*\])\s*;\s*$", text, re.S)
    if not m:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(m.group(1))


def save_js(path, name, data):
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def reprovenance(prov, clause):
    """Swap the 'derived, no official key' clause for the key's clause.

    Trailing clauses like '; OCR damage in source scan' are observations about
    the extraction and survive untouched - a key says nothing about whether the
    scan was clean.
    """
    clauses = [c.strip() for c in (prov or "").split(";")]
    out, replaced = [], False
    for c in clauses:
        if DERIVED_CLAUSE.match(c):
            out.append(clause)
            replaced = True
        else:
            out.append(c)
    if not replaced:
        if APPLIED_HINT.search(prov or ""):
            return prov          # already applied
        raise RuntimeError(f"no derived clause to replace, and no key clause present: {prov!r}")
    return "; ".join(c for c in out if c)


def run_sitting(name, cfg, questions, write):
    key = json.loads((STAGED / cfg["key"]).read_text(encoding="utf-8"))
    ann_doc = json.loads((STAGED / cfg["annotations"]).read_text(encoding="utf-8"))
    ann = {a["id"]: a for a in ann_doc["annotations"]}
    id_re = re.compile(cfg["id_re"])

    recs = [q for q in questions if id_re.match(q["id"])]
    print(f"\n=== {name} — {cfg['label']}")
    if not recs:
        print("  no matching records in the bank; nothing to do")
        return 0
    unknown = sorted(set(ann) - {q["id"] for q in recs})
    if unknown:
        sys.exit(f"FAIL {name}: annotation id(s) match no record this pattern selects: {unknown}")

    def official_for(q):
        m = id_re.match(q["id"])
        paper, num = m.group(1), int(m.group(2))
        if num != q.get("no"):
            sys.exit(f"FAIL {q['id']}: id number {num} != stored no {q.get('no')!r}. The key "
                     f"joins on the printed question number; a renumbered record would take "
                     f"the wrong answer.")
        sec = cfg["sections"].get(paper)
        if sec is None:
            return None, True     # paper the key does not cover
        return key[sec].get(str(num)), False

    # --- verify the join, and that every overturn is explained -------------
    agree = disagree = 0
    uncovered, compensated, unexplained = [], [], []
    for q in recs:
        off, no_section = official_for(q)
        if no_section:
            uncovered.append(q["id"]); continue
        if off is None:
            compensated.append(q["id"]); continue
        if q.get("ans") == off:
            agree += 1
        else:
            disagree += 1
            if q["id"] not in ann and q.get("ans") != "":
                unexplained.append((q["id"], q.get("ans"), off))

    total = agree + disagree
    rate = agree / total if total else 0
    print(f"  key vs bank: {agree} agree, {disagree} disagree, {len(compensated)} compensated, "
          f"{len(uncovered)} in papers the key does not cover  ({rate:.1%} agreement)")
    if total and rate < MIN_AGREEMENT:
        sys.exit(f"FAIL {name}: agreement {rate:.1%} below {MIN_AGREEMENT:.0%} — key and bank are "
                 f"probably not aligned on numbering. Refusing to rewrite {total} answers.")
    if unexplained:
        sys.exit(f"FAIL {name}: the key overturns {len(unexplained)} answer(s) with no annotation "
                 f"explaining it: {unexplained}. An answer that flips under the reader with no "
                 f"note is how a key error becomes a memorised falsehood.")

    # --- apply -------------------------------------------------------------
    n_ans = n_prov = n_exp = n_note = n_opts = changed = 0
    for q in recs:
        before = json.dumps(q, sort_keys=True, ensure_ascii=False)
        off, no_section = official_for(q)
        if no_section:
            continue
        a = ann.get(q["id"])
        is_comp = off is None

        if a and a.get("derived_ans") and q.get("ans") not in (a["derived_ans"], off or "", ""):
            sys.exit(f"FAIL {q['id']}: stored answer {q.get('ans')!r} but the annotation was "
                     f"written against {a['derived_ans']!r}; re-check against the key rather "
                     f"than applying a stale verdict.")

        target = "" if is_comp else off
        if q.get("ans") != target:
            q["ans"] = target
            n_ans += 1

        new_prov = reprovenance(q.get("prov"),
                                cfg["compensated_clause"] if is_comp else cfg["official_clause"])
        if new_prov != q.get("prov"):
            q["prov"] = new_prov
            n_prov += 1

        # `conf` grades a DERIVED answer. These are no longer derived, so a
        # leftover "high" would describe a superseded answer. "official" is
        # deliberately NOT one of provLine()'s confidence keys: if `prov` ever
        # stopped naming a key, the badge falls back to blank rather than
        # asserting a confidence this record no longer has.
        q["conf"] = "official"

        if a:
            for letter, text in (a.get("opts_repair") or {}).items():
                if letter not in q["opts"]:
                    sys.exit(f"FAIL {q['id']}: opts_repair names option {letter!r}, which this "
                             f"question does not have")
                if q["opts"][letter] != text:
                    q["opts"][letter] = text
                    n_opts += 1
            if a.get("exp") and q.get("exp") != a["exp"]:
                q["exp"] = a["exp"]
                n_exp += 1
            if a.get("note"):
                old = (q.get("note") or "").strip()
                if a.get("note_mode", "append") == "append" and old:
                    merged = old if a["note"] in old else f"{a['note']} {old}".strip()
                else:
                    merged = a["note"]
                if merged != q.get("note"):
                    q["note"] = merged
                    n_note += 1

        if q["ans"] and q["ans"] not in q["opts"]:
            sys.exit(f"FAIL {q['id']}: answer {q['ans']!r} is not one of {sorted(q['opts'])}")
        if not q["ans"] and not is_comp:
            sys.exit(f"FAIL {q['id']}: blank answer on a question the key answers")

        if json.dumps(q, sort_keys=True, ensure_ascii=False) != before:
            changed += 1

    print(f"  {n_ans} answer(s) set, {n_prov} re-provenanced, {n_exp} explanation(s) rewritten, "
          f"{n_note} note(s) set, {n_opts} option(s) repaired")
    print(f"  {changed} record(s) changed, {len(recs) - len(uncovered) - changed} already up to date")
    if compensated:
        print(f"  compensated, excluded from all scoring: {', '.join(compensated)}")
    if uncovered:
        print(f"  untouched ({len(uncovered)} records in papers this key does not cover)")
    return changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="write changes; omit for a dry run")
    ap.add_argument("--sitting", help="apply only this registry entry")
    args = ap.parse_args()

    todo = {args.sitting: SITTINGS[args.sitting]} if args.sitting else SITTINGS
    if args.sitting and args.sitting not in SITTINGS:
        sys.exit(f"FAIL: unknown sitting {args.sitting!r}; known: {sorted(SITTINGS)}")

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    total = sum(run_sitting(n, c, questions, args.write) for n, c in todo.items())

    print(f"\n{total} record(s) changed across {len(todo)} sitting(s)")
    if args.write:
        save_js(QUESTIONS_FILE, "QUESTIONS", questions)
        print(f"wrote {QUESTIONS_FILE.relative_to(ROOT)}")
    else:
        print("dry run — re-run with --write to apply")


if __name__ == "__main__":
    main()
