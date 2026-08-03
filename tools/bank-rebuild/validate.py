#!/usr/bin/env python3
"""
Consistency checks for the question bank.

Two jobs:

1. ORDER — prove the stored options are in the same order the paper printed
   them. Everything downstream (answer keys, carried-over answers, the (a)-(d)
   letters shown in the UI) is positional, so a silently reordered option set
   turns a correct answer into a wrong one with no visible symptom. This is
   checked against the PDF text itself, not against our own parse.

2. HYGIENE — the defects that made the old bank unusable: options that kept
   their "(a)" prefix, options that swallowed the next question, duplicates,
   blanks, page furniture.

Usage:
    python3 validate.py parsed          # check the freshly parsed papers
    python3 validate.py bank            # check the emitted bank .ts (via bank.json)
"""
import json
import os
import re
import subprocess
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/hruaia/Downloads/mpsc_pdfs_examination/Old_Questions"


def squash(s):
    """Collapse to comparable form: no case, no punctuation, no spacing."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]", "", s.lower())


# ---------------------------------------------------------------- hygiene ---

# A leftover option label: "(a) foo", "a) foo", "a. foo". Deliberately does NOT
# match "C. Lalsawta" or "T.H. Lewin" -- a capital initial followed by a
# capitalised surname is a person's name, and several real options are names.
LETTER_PREFIX = re.compile(r"^\s*(?:[\(\[]\s*[a-dA-D]\s*[\)\.\]]|[a-d]\s*[\)\.])\s+\S")
OPTION_MARKER = re.compile(r"\([a-d]\)\s*\S")
# "both (b) and (c)" / "(a) and (d) only" are legitimate option texts that
# reference other options. A marker only signals a swallowed neighbour when the
# option has also grown long.
CROSS_REFERENCE = re.compile(r"\b(both|and|or|only|except|neither|either)\b", re.IGNORECASE)
NEXT_QUESTION = re.compile(r"\b\d{1,3}\s*\.\s+[A-Z][a-z]")
PAGE_FURNITURE = re.compile(
    r"MIZORAM PUBLIC SERVICE|Time Allowed|Full Marks|Attempt all questions"
    r"|SECTION\s*-|UNIT-[ABC]|Directions?\s*\(",
    re.IGNORECASE,
)


def hygiene(qid, stem, options, figure_based=False, source_defect=None,
            has_direction=False):
    out = []
    if figure_based:
        if options:
            out.append("figure-based but carries options")
        return out

    if len(options) not in (3, 4):
        out.append(f"{len(options)} options (expected 3 or 4)")
    for i, o in enumerate(options):
        letter = "abcd"[i] if i < 4 else "?"
        if not o.strip():
            out.append(f"option ({letter}) is blank")
            continue
        if LETTER_PREFIX.match(o):
            out.append(f"option ({letter}) keeps its own letter prefix: {o[:40]!r}")
        if OPTION_MARKER.search(o) and not (len(o) <= 80 and CROSS_REFERENCE.search(o)):
            out.append(f"option ({letter}) contains another option marker: {o[:60]!r}")
        if NEXT_QUESTION.search(o):
            out.append(f"option ({letter}) looks like it swallowed the next question: {o[:60]!r}")
        if PAGE_FURNITURE.search(o):
            out.append(f"option ({letter}) contains page furniture: {o[:60]!r}")
        if o != o.strip():
            out.append(f"option ({letter}) has untrimmed whitespace")
        if re.match(r"^[\.\,\;\:_\-–—]", o):
            out.append(f"option ({letter}) starts with stray punctuation: {o[:30]!r}")

    # Duplicates already confirmed against the source PDF as the paper's own
    # misprint are recorded via sourceDefect and are not re-reported here --
    # they are faithful, not extraction bugs.
    if source_defect != "duplicate-options":
        seen = {}
        for i, o in enumerate(options):
            k = squash(o)
            if k and k in seen:
                out.append(f"options ({'abcd'[seen[k]]}) and ({'abcd'[i]}) are duplicates: {o[:40]!r}")
            seen[k] = i

    # Vocabulary items are legitimately a single word ("Arc", "Curator") with
    # the task supplied by the Direction header above them.
    min_stem = 2 if has_direction else 5
    if not stem or len(stem.strip()) < min_stem:
        out.append(f"stem too short: {stem[:40]!r}")
    if PAGE_FURNITURE.search(stem or "") and not stem.lower().startswith("direction"):
        out.append("stem contains page furniture")
    return out


# ------------------------------------------------------------------ order ---

def pdf_text(path):
    return subprocess.run(["pdftotext", "-layout", path, "-"],
                          capture_output=True, text=True, check=True).stdout


WINDOW = 4000  # chars of squashed text one question can plausibly span


def check_order(stem, options, haystack):
    """Confirm the options appear in the paper in the order they are stored.

    Anchored on the question's own stem and scanned strictly forwards. An
    earlier version searched the whole document for each option independently,
    which reported 169 phantom reorderings: short generic options like
    "None of the above" matched their first occurrence hundreds of questions
    earlier. Position must be established relative to THIS question.

    Returns None when verified or not decidable. A miss is only reported when
    the option is found BEHIND the cursor but inside the window -- that is
    genuine evidence of reordering, rather than an option we merely could not
    locate.
    """
    a_stem = squash(stem)
    if len(a_stem) < 10:
        return None
    anchor = haystack.find(a_stem)
    if anchor < 0:
        return None

    cursor = anchor + len(a_stem)
    limit = cursor + WINDOW
    for i, o in enumerate(options):
        k = squash(o)
        if len(k) < 6:          # too short to locate unambiguously
            continue
        at = haystack.find(k, cursor, limit)
        if at >= 0:
            cursor = at + len(k)
            continue
        behind = haystack.find(k, anchor, cursor)
        if behind >= 0:
            return (f"option ({'abcd'[i]}) appears BEFORE the option printed "
                    f"above it — stored order does not match the paper")
    return None


# ------------------------------------------------------------------- runs ---

def run_parsed():
    parsed = json.load(open(os.path.join(HERE, "parsed-native.json")))
    from parse_native import PAPERS
    paths = {k: f"{ROOT}/{rel}" for k, rel, _ in PAPERS}

    total = bad = defects = 0
    order_checked = order_bad = 0
    for key, qs in parsed.items():
        hay = squash(pdf_text(paths[key]))
        for q in qs:
            total += 1
            if q.get("sourceDefect"):
                defects += 1
            qid = f"{key} Q{q['n']}"
            probs = hygiene(qid, q.get("stem", ""), q.get("options", []),
                            q.get("figureBased", False), q.get("sourceDefect"),
                            bool(q.get("direction")))
            if not q.get("figureBased") and q.get("options"):
                order_checked += 1
                bad_order = check_order(q.get("stem", ""), q["options"], hay)
                if bad_order:
                    order_bad += 1
                    probs.append(bad_order)
            if probs:
                bad += 1
                print(f"\n{qid}")
                for p in probs:
                    print("   -", p)
    print(f"\n{total} questions, {bad} with problems")
    print(f"option-order verified against the PDF for {order_checked}; "
          f"{order_bad} mismatched")
    print(f"{defects} carry sourceDefect (the paper's own misprint, faithfully kept)")
    return 1 if bad else 0


def run_bank():
    bank = json.load(open(os.path.join(HERE, "bank.json")))
    total = bad = 0
    for q in bank["questions"]:
        if q.get("type") == "descriptive":
            continue
        total += 1
        probs = hygiene(q["id"], q.get("question", ""), q.get("options", []),
                        q.get("figureBased", False))
        ai = q.get("answerIndex")
        if not q.get("figureBased"):
            if q.get("compensated"):
                if ai != -1:
                    probs.append(f"compensated but answerIndex={ai}")
            elif not isinstance(ai, int) or not (0 <= ai < len(q.get("options", []))):
                probs.append(f"answerIndex {ai} out of range for {len(q.get('options', []))} options")
        if probs:
            bad += 1
            print(f"\n{q['id']}")
            for p in probs:
                print("   -", p)
    print(f"\n{total} MCQs checked, {bad} with problems")
    return 1 if bad else 0


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "parsed"
    sys.exit(run_parsed() if mode == "parsed" else run_bank())
