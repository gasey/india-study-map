#!/usr/bin/env python3
"""
Phase 2 steps 1, 3 and 6 — harvest the model-free question sources into a single
staged JSON, in the app's schema, ready for tagging (step 5) and answer
verification (Phase 3).

Covers:
  Tier 1  the 2016 Computer Operator papers already in mpsc_bank_v2.json
          (Technical Paper I x2 = 150, General English x2 = 160)
  Tier 4  mpsc-jso-prep/data/p4u*.js authored questions (schema-converted)

NOT covered here, deliberately:
  Tier 1  Computer Operator Technical Paper II x2 (150 q) - the bank never
          ingested these and OCR can't recover them; they come from the vision
          pass in tools/system-manager-build/extracted/ (see EXTRACT_BRIEF.md).
  Tier 2  General English at large. BUILD_GUIDE.md originally named 3 JE papers
          (199 q); the bank actually holds ~6,300 GE questions across ~125
          papers. That needs a selection strategy, not a bulk import - see §3.
  Tier 3/5 cherry-picks, which need a model to confirm on-syllabus.

Two schema traps this script handles, both of which would ship broken data:
  1. The app's `opts` is an OBJECT keyed A-D and `ans` is a LETTER. Every other
     bank in the repo uses an options array + 0-based index.
  2. app.js renders explanations with `esc(q.exp)`, so HTML is displayed
     literally. jso-prep explanations are HTML and must be flattened to text.

Usage:  python3 tools/system-manager-build/harvest.py
Output: tools/system-manager-build/staged/harvest.json  (+ a summary to stdout)
"""

import difflib
import html
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
PERSONAL = os.path.expanduser("~/workspace/projects/personal")
BANK = os.path.join(PERSONAL, "mpsc-question-bank", "bank", "mpsc_bank_v2.json")
JSO = os.path.join(PERSONAL, "mpsc-jso-prep", "data")

LETTERS = ["A", "B", "C", "D"]

# --- Tier 1: paperId -> (srcKey, sitting label, app paper id, expected count) ---
# Filter on paperId, never on `subject` - 69,757 of 77,751 bank records are
# tagged "gk" and the field is useless (BUILD_GUIDE.md §8).
TIER1 = {
    "Old_Questions/Direct_2014-2018/2.Computer Operator (Contract) under SAD 2016 Technical Paper I.pdf": (
        "CO2016A-P1", "Computer Operator (Contract) under SAD, 2016 - Technical Paper I", "TECH1", 75),
    "Old_Questions/Direct_2014-2018/2.Computer Operator (CB) under Mizoram Information Commission 2016 Paper I.pdf": (
        "CO2016B-P1", "Computer Operator (CB) under Mizoram Information Commission, 2016 - Paper I", "TECH1", 75),
    "Old_Questions/Direct_2014-2018/1.Computer Operator (Contract) under SAD 2016 General English.pdf": (
        "CO2016A-GE", "Computer Operator (Contract) under SAD, 2016 - General English", "GE", 80),
    "Old_Questions/Direct_2014-2018/1.Computer Operator (CB) under Mizoram Information Commission 2016 General English.pdf": (
        "CO2016B-GE", "Computer Operator (CB) under Mizoram Information Commission, 2016 - General English", "GE", 80),
}

# --- Tier 4: mpsc-jso-prep unit files that are on-syllabus for System Manager ---
# Digital/multimedia/mobile forensics units are JSO-specific and off-syllabus for
# SM, so only fundamentals and DBMS are pulled. Paper assignment reflects the SM
# syllabus, not JSO's.
TIER4 = {
    "p4u1-computer-fundamentals.js": ("JSO-P4U1", "TECH1", "authored for MPSC JSO Cyber Forensic prep"),
    "p4u2-dbms.js": ("JSO-P4U2", "TECH2", "authored for MPSC JSO Cyber Forensic prep"),
}


def strip_html(s):
    """jso-prep explanations are HTML; app.js esc()s `exp`, so flatten to text."""
    if not s:
        return ""
    s = re.sub(r"(?i)<br\s*/?>", " ", s)
    s = re.sub(r"(?i)</(p|li|div|ul|ol)>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    """Normalised question text, for cross-source dedup."""
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def harvest_tier1(problems):
    if not os.path.isfile(BANK):
        sys.exit(f"FAIL: bank not found at {BANK}")
    with open(BANK, encoding="utf-8") as f:
        rows = json.load(f)["questions"]

    by_paper = {}
    for r in rows:
        pid = r.get("paperId")
        if pid in TIER1:
            by_paper.setdefault(pid, []).append(r)

    out = []
    for pid, (srckey, sitting, paper, expect) in TIER1.items():
        got = sorted(by_paper.get(pid, []), key=lambda r: r.get("qnum") or 0)
        if len(got) != expect:
            problems.append(f"{srckey}: {len(got)} questions in bank, expected {expect}")
        nums = [r.get("qnum") for r in got]
        gaps = [n for n in range(1, expect + 1) if n not in nums]
        if gaps:
            problems.append(f"{srckey}: missing qnum {gaps}")

        for r in got:
            # NOT every question has four options. The sentence-analysis blocks in
            # both General English papers print only (a)(b)(c), and the bank pads
            # the list to length 4 with a literal null. Passing that through
            # str() produced a bogus option D reading "None" — which looks exactly
            # like "None of these" and is pickable. Drop nulls and emit only the
            # options the paper actually prints; app.js already filters absent
            # letters at every render site.
            raw = r.get("options") or []
            opts = [(o if o is None else str(o).strip()) for o in raw]
            opts = [o for o in opts if o not in (None, "", "None", "null")]
            if not 2 <= len(opts) <= 4:
                problems.append(f"{srckey} Q{r.get('qnum')}: {len(opts)} usable options "
                                f"(raw {len(raw)}) — expected 2-4")
                continue
            ai = r.get("answerIndex", -1)
            # answerIndex points into the RAW list; remap it onto the filtered one.
            if 0 <= ai < len(raw):
                target = raw[ai]
                target = None if target is None else str(target).strip()
                ai = opts.index(target) if target in opts else -1
            else:
                ai = -1
            out.append({
                "id": f"{srckey}-{r['qnum']}",
                "src": "past",
                "srcKey": srckey,
                "sitting": sitting,
                "no": r["qnum"],
                "paper": paper,
                "unit": None,          # Phase 2 step 5 (Haiku) tags these
                "sub": None,
                "q": (r.get("question") or "").strip(),
                "opts": {LETTERS[i]: o for i, o in enumerate(opts)},
                "ans": LETTERS[ai] if 0 <= ai < len(opts) else None,
                "exp": strip_html(r.get("explanation")),
                # answerSource is "inferred" for every one of these - no official
                # key was ever published. Phase 3 must re-derive from source.
                "conf": None,
                "prov": f"Transcribed from {sitting}. MPSC published no answer key for "
                        f"this paper; answer is derived and unverified.",
                "needs_verify": True,
                "needs_figure": bool(r.get("hasDiagram") or r.get("figureGroupId")),
                "note": "",
                "_tier": 1,
                "_bank_id": r.get("id"),
                "_answer_source": r.get("answerSource"),
            })
    return out


def harvest_tier4(problems):
    out = []
    for fname, (srckey, paper, origin) in TIER4.items():
        path = os.path.join(JSO, fname)
        if not os.path.isfile(path):
            problems.append(f"{srckey}: {fname} not found")
            continue
        text = open(path, encoding="utf-8").read()

        # These are JS files, not JSON. Pull the questions array by brace matching
        # from `questions:` rather than trying to regex nested structures.
        i = text.find("questions:")
        if i < 0:
            problems.append(f"{srckey}: no `questions:` key in {fname}")
            continue
        start = text.find("[", i)
        depth, j, instr, esc, quote = 0, start, False, False, ""
        while j < len(text):
            c = text[j]
            if instr:
                if esc:
                    esc = False
                elif c == "\\":
                    esc = True
                elif c == quote:
                    instr = False
            elif c in "'\"":
                instr, quote = True, c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        block = text[start:j + 1]

        # Each record is { q:'…', o:[…], a:N, e:'…' } with JS string concatenation
        # in `e`. Evaluate the concatenations, then parse fields individually.
        records = re.findall(r"\{\s*q\s*:(.*?)\}\s*(?=,\s*\{|\s*\]$|\s*,?\s*$)", block, re.S)
        count = 0
        for rec in records:
            body = "q:" + rec

            def js_str(field):
                m = re.search(rf"{field}\s*:\s*((?:'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\")"
                              rf"(?:\s*\+\s*(?:'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"))*)",
                              body, re.S)
                if not m:
                    return None
                parts = re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", m.group(1), re.S)
                joined = "".join(a or b for a, b in parts)
                return joined.replace("\\'", "'").replace('\\"', '"').replace("\\n", " ")

            q = js_str("q")
            e = js_str("e")
            am = re.search(r"\ba\s*:\s*(\d+)", body)
            om = re.search(r"\bo\s*:\s*\[(.*?)\]", body, re.S)
            if not (q and om and am):
                continue
            opts = [(a or b).replace("\\'", "'").replace('\\"', '"')
                    for a, b in re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"",
                                           om.group(1), re.S)]
            if len(opts) != 4:
                problems.append(f"{srckey}: a question has {len(opts)} options, expected 4")
                continue
            ai = int(am.group(1))
            if not 0 <= ai < 4:
                problems.append(f"{srckey}: answer index {ai} out of range")
                continue
            count += 1
            out.append({
                "id": f"{srckey}-{count}",
                "src": "generated",
                "srcKey": srckey,
                "sitting": f"Authored ({origin})",
                "no": count,
                "paper": paper,
                "unit": None,
                "sub": None,
                "q": q.strip(),
                "opts": {L: opts[i].strip() for i, L in enumerate(LETTERS)},
                "ans": LETTERS[ai],
                "exp": strip_html(e),
                "conf": None,
                "prov": "Authored for MPSC JSO prep, reused here where the topic overlaps "
                        "the System Manager syllabus. Not a past System Manager question.",
                "needs_verify": False,
                "needs_figure": False,
                "note": "",
                "_tier": 4,
            })
        if count == 0:
            problems.append(f"{srckey}: parsed 0 questions from {fname}")
    return out


def main():
    problems = []
    rows = harvest_tier1(problems) + harvest_tier4(problems)

    # --- step 6: dedup across sources on normalised question text ---
    # The two 2016 sittings overlap substantially. Keep the first occurrence and
    # record what it collided with, so a human can audit the merge.
    seen, deduped, dropped = {}, [], []
    for r in rows:
        k = norm(r["q"])
        if not k:
            problems.append(f"{r['id']}: empty question text")
            continue
        if k in seen:
            dropped.append((r["id"], seen[k]))
            continue
        seen[k] = r["id"]
        deduped.append(r)

    os.makedirs(STAGED, exist_ok=True)
    out = os.path.join(STAGED, "harvest.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(deduped, f, indent=2, ensure_ascii=False)

    print(f"staged {len(deduped)} questions -> {os.path.relpath(out, os.getcwd())}")
    per = Counter(r["srcKey"] for r in deduped)
    for k in sorted(per):
        n_ver = sum(1 for r in deduped if r["srcKey"] == k and r["needs_verify"])
        n_ans = sum(1 for r in deduped if r["srcKey"] == k and r["ans"])
        print(f"  {per[k]:>4}  {k:<12} answered {n_ans:>3}  needing verification {n_ver:>3}")
    print(f"\ndeduped away {len(dropped)} duplicate(s) across sources")
    for dup, kept in dropped[:10]:
        print(f"    {dup} == {kept}")
    if len(dropped) > 10:
        print(f"    … and {len(dropped) - 10} more")

    # Near-duplicates: REPORTED, not dropped. Exact-text dedup above is the only
    # thing safe to do automatically. Measured 2026-08-28, the two 2016 sittings
    # are essentially disjoint (1 near-match in 75x75 for Paper I, 0 for GE), so
    # BUILD_GUIDE.md's "the two sittings overlap substantially" is wrong. A
    # genuine repeat across sittings is also useful signal - it means the
    # examiner reuses it - so a human should decide, not this script.
    near = []
    for i, a in enumerate(deduped):
        for b in deduped[i + 1:]:
            if a["srcKey"] == b["srcKey"]:
                continue
            ka, kb = norm(a["q"]), norm(b["q"])
            if abs(len(ka) - len(kb)) > 40:
                continue
            if difflib.SequenceMatcher(None, ka, kb).ratio() > 0.85:
                near.append((a["id"], b["id"], a["q"][:60]))
    if near:
        print(f"\n{len(near)} near-duplicate pair(s) across sittings — review, not auto-dropped:")
        for x, y, q in near:
            print(f"    {x} ~ {y}  {q}")

    noans = [r["id"] for r in deduped if not r["ans"]]
    if noans:
        print(f"\n{len(noans)} with no answer in source (Phase 3 must derive): "
              f"{', '.join(noans)}")
    print(f"\nstill to come: 150 from the Paper II vision pass, plus Tier 2 GE selection")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
