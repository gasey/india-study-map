#!/usr/bin/env python3
"""Import General Studies questions from MPSC engineering past papers.

    python3 tools/system-analyst-build/import_gs_past_papers.py             # dry run
    python3 tools/system-analyst-build/import_gs_past_papers.py --write

WHY. Before this, all 139 General Studies questions in the bank were AUTHORED
("Authored practice question") - not one came from a real MPSC paper. Authored
questions can cover a syllabus leaf, but they cannot teach how the Commission
actually asks: what it considers fair game, how it words options, how much of the
paper is Mizoram-specific. These papers supply that, and every sitting imported
here has a published official answer key, so every answer is authoritative
rather than agent-derived.

STATIC ONLY, BY REQUEST. A General Studies paper is roughly a fifth
current-affairs, and a 2023 or 2025 news question is worth nothing for a later
exam - worse than nothing when the answer has since changed. Each question
therefore carries an explicit keep/drop decision with a reason, staged in
<sitting>-tags.json. Dropped questions are printed on every run, never silently
discarded, so pulling one back is a one-field edit. The GS syllabus does have a
12-mark Current Affairs unit; it stays authored-only on purpose, because
past-paper current affairs is the one category that cannot be recycled.

WHAT IS VERIFIED BEFORE ANYTHING IS WRITTEN:

  * the source file's questions and key are staged as JSON with the sha256 of
    the PDFs they came from - those PDFs live in the mpsc-question-bank repo, so
    the import must not depend on them being present;
  * every kept question has all four options, none empty, and a key entry;
  * every kept question names a real leaf of the GS syllabus, checked against
    syllabus.js rather than trusted - a `sub` that is not a leaf silently breaks
    every by-topic view (DEVLOG 2026-09-04);
  * ids are new. Re-running never duplicates: existing ids are compared field by
    field and reported as unchanged.

IDEMPOTENT. Second run reports 0 added, 0 changed.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
APP = ROOT / "public" / "mpsc-system-analyst" / "data"
QUESTIONS_FILE = APP / "questions.js"
SYLLABUS_FILE = APP / "syllabus.js"
STAGED = HERE / "staged"

SITTINGS = [
    {
        "name": "MES2025_GS",
        "source": "gs-mes2025-source.json",
        "tags": "gs-mes2025-tags.json",
        "sitting": "Jr. Grade of MES (Combined), October 2025 · General Studies",
        "id_prefix": "MES2025_GS_",
        "prov": ("Jr. Grade of MES (Combined), 1-6 October 2025, General Studies, Q{no}; "
                 "answer from MPSC's official final answer key, Notification No. "
                 "Jr. Gr. of MES(DR)/25(1)-2025-MPSC (EXAM) dated 13 November 2025 "
                 "(supersedes the 7 October 2025 provisional key)"),
    },
    {
        "name": "PE2023_GS",
        "source": "gs-pe2023-source.json",
        "tags": "gs-pe2023-tags.json",
        "sitting": "Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023 · General Studies",
        "id_prefix": "PE2023_GS_",
        "prov": ("Jr. Grade of MES, P&E Cadre (Electrical Wing) under P&E Department and "
                 "Assistant Architect (Contract) under PWD, July 2023, General Studies, "
                 "Q{no}; answer from MPSC's official Final Answer Key dated 8 September 2023 "
                 "(no provisional key was published for this sitting)"),
    },
    {
        "name": "PHE2024_GS",
        "source": "gs-phe2024-source.json",
        "tags": "gs-phe2024-tags.json",
        "sitting": "Jr. Grade of MES (AE/SDO) under PHE Deptt., January 2024 · General Studies",
        "id_prefix": "PHE2024_GS_",
        "prov": ("Jr. Grade of MES (AE/SDO) under Public Health Engineering Department, "
                 "23-25 January 2024, General Studies, Q{no}; answer from MPSC's official "
                 "Final Answer Key notified 21 March 2024 under No. MES/A/2023-MPSC. The "
                 "question paper is a SCAN: its text was OCR'd twice and then read off the "
                 "rendered page by eye, while the answer key has a real text layer and was "
                 "parsed"),
    },
    {
        "name": "MES2024_GS",
        "source": "gs-mes2024-source.json",
        "tags": "gs-mes2024-tags.json",
        "sitting": "Jr. Grade of MES (Combined) under Various Deptt., July 2024 · General Studies",
        "id_prefix": "MES2024_GS_",
        "prov": ("Jr. Grade of MES (Combined) under Various Department, 3-5 July 2024, "
                 "General Studies, Q{no}; answer from MPSC's official Final Answer Key dated "
                 "12 September 2024 under No. MES/A/2023-MPSC(CON), which is identical to the "
                 "10 July 2024 provisional key on all 100 answers. BOTH key PDFs are scans, so "
                 "the answers themselves came off the page rather than out of a text layer: "
                 "three independent eye reads of the key table all agree 100/100, and a "
                 "geometry-based per-cell OCR was used to cross-check them. The question paper "
                 "is a scan too, and its transcription was verified page by page against the "
                 "rendered image"),
    },
]

# Explanations that argue with their own answer key. July-2024 was staged with Q94
# explained as "CONTESTED - the key looks wrong. It says the President..." when the key
# in fact said "Chief Justice of High Court" - the tagger had misread the key letter, so
# the card would have told the user to distrust a CORRECT answer and to believe MPSC had
# keyed the President. That is a wrong-answer-teaching bug, not a cosmetic one, and
# nothing else in the pipeline looks at whether an explanation agrees with its key.
#
# NOT a hard failure: a genuinely wrong or loose official key does happen (PE2023 Q49's
# "largest tributary of the Indus", PHE2024 Q15's broken analogy) and must stay sayable.
# These print loudly instead, the same way dropped questions do, and the operator's job
# is to re-read the key letter on the source page before believing the explanation.
#
# A bag-of-words check for "does the explanation describe the keyed option" was tried
# here and removed: it fired on 7 questions across the three earlier sittings and every
# one was a false positive, because good explanations legitimately paraphrase the option
# instead of quoting it ("Mass is the amount of matter" for "its mass will remain the
# same") and legitimately open by naming the distractors to contrast them - which is
# near-universal on NOT/EXCEPT stems. A warning that cries wolf seven times gets ignored,
# which would defeat the point. The dispute-language check below is precise: it catches
# the Q94 shape and flags only the two genuinely contested items.
DISPUTE_RE = re.compile(r"contested|key (?:looks|is|seems) wrong|do not learn|"
                        r"wrong in the key|key is in error", re.I)


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"window\.{name}\s*=\s*([\[{{].*[\]}}])\s*;\s*$", text, re.S)
    if not m:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(m.group(1))


def save_js(path, name, data):
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
                    encoding="utf-8")


def gs_leaves(syllabus):
    gs = next(p for p in syllabus["papers"] if p["id"] == "GS")
    return {u["no"]: set(u["subtopics"]) for u in gs["units"]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    by_id = {q["id"]: q for q in questions}
    leaves = gs_leaves(load_js(SYLLABUS_FILE, "SYLLABUS"))

    added = changed = 0
    for cfg in SITTINGS:
        src = json.loads((STAGED / cfg["source"]).read_text(encoding="utf-8"))
        tagdoc = json.loads((STAGED / cfg["tags"]).read_text(encoding="utf-8"))
        key = {int(k): v for k, v in src["key"].items()}
        paper = {q["no"]: q for q in src["questions"]}
        tags = {t["no"]: t for t in tagdoc["tags"]}

        print(f"\n=== {cfg['name']} — {cfg['sitting']}")
        missing_tags = sorted(set(paper) - set(tags))
        if missing_tags:
            sys.exit(f"FAIL: {len(missing_tags)} question(s) have no keep/drop decision: "
                     f"{missing_tags}. Every question must be decided explicitly; an "
                     f"undecided one would be dropped silently.")

        kept = [t for t in tagdoc["tags"] if t.get("keep")]
        dropped = [t for t in tagdoc["tags"] if not t.get("keep")]

        # --- validate before writing a single record ----------------------
        problems = []
        for t in kept:
            n = t["no"]
            q = paper.get(n)
            if q is None:
                problems.append(f"Q{n}: kept but not in the parsed paper")
                continue
            if sorted(q["opts"]) != ["A", "B", "C", "D"]:
                problems.append(f"Q{n}: options are {sorted(q['opts'])}, expected A-D")
            if any(not v.strip() for v in q["opts"].values()):
                problems.append(f"Q{n}: has an empty option — parser damage, not importable")
            if n not in key:
                problems.append(f"Q{n}: no official key entry")
            elif key[n] not in q["opts"]:
                problems.append(f"Q{n}: key says {key[n]!r}, which is not one of its options")
            unit, sub = t.get("unit"), t.get("sub")
            if unit not in leaves:
                problems.append(f"Q{n}: unit {unit!r} is not a GS unit")
            elif sub not in leaves[unit]:
                problems.append(f"Q{n}: sub {sub!r} is not a leaf of GS unit {unit}")
            if not (t.get("exp") or "").strip():
                problems.append(f"Q{n}: kept with no explanation")
        if problems:
            print(f"  {len(problems)} problem(s):")
            for p in problems[:20]:
                print(f"      {p}")
            sys.exit("FAIL: refusing to import an invalid batch")

        # --- build ---------------------------------------------------------
        for t in kept:
            n = t["no"]
            q = paper[n]
            qid = f"{cfg['id_prefix']}{n:03d}"
            rec = {
                "id": qid,
                "src": "past",
                "sitting": cfg["sitting"],
                "srcKey": cfg["name"],
                "no": n,
                "paper": "GS",
                "unit": t["unit"],
                "sub": t["sub"],
                "q": q["q"],
                "opts": dict(sorted(q["opts"].items())),
                "ans": key[n],
                "exp": t["exp"],
                "conf": "official",
                "prov": cfg["prov"].format(no=n),
                "note": "",
            }
            if qid in by_id:
                if json.dumps(by_id[qid], sort_keys=True, ensure_ascii=False) != \
                   json.dumps(rec, sort_keys=True, ensure_ascii=False):
                    by_id[qid].clear()
                    by_id[qid].update(rec)
                    changed += 1
            else:
                questions.append(rec)
                by_id[qid] = rec
                added += 1

        print(f"  {len(kept)} kept, {len(dropped)} dropped as time-bound or off-syllabus")
        for t in dropped:
            print(f"      Q{t['no']:>3} — {t['reason']}")

        # --- advisory checks on the explanations ---------------------------
        disputed = [t for t in kept if DISPUTE_RE.search(t["exp"])]
        if disputed:
            print(f"  !! {len(disputed)} explanation(s) dispute the official key — re-read the "
                  f"key letter on the source page before believing the explanation:")
            for t in disputed:
                n = t["no"]
                keyed = key.get(n)
                shown = paper[n]["opts"].get(keyed, "?") if n in paper else "?"
                print(f"      Q{n:>3} keyed {keyed} = {shown[:44]!r}")
                print(f"           {t['exp'][:110]}...")

    print(f"\n{added} question(s) added, {changed} updated")
    if args.write:
        save_js(QUESTIONS_FILE, "QUESTIONS", questions)
        print(f"wrote {QUESTIONS_FILE.relative_to(ROOT)}")
    else:
        print("dry run — re-run with --write to apply")


if __name__ == "__main__":
    main()
