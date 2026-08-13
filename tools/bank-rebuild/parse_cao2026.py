#!/usr/bin/env python3
"""
Parse the Cooperative Audit Officer (CAO), March-2026 papers out of their PDF
text layer -- same engine as parse_native.py, but these papers print a
numbered "INSTRUCTIONS" block (1-9) on the cover page before the real
question 1, which would otherwise desync split_questions()'s running
question-number counter (real Q1 would need to match `want=10`, not 1).
Stripped here before handing off to the shared engine. Kept in a separate
output file, isolated from parsed-native.json/parsed-cao-2022.json.
"""
import json
import os
import re
from parse_native import HERE, ROOT, clean_lines, split_questions, parse_block

import subprocess


def pdf_text(path):
    return subprocess.run(["pdftotext", "-layout", path, "-"],
                          capture_output=True, text=True, check=True).stdout


INSTRUCTIONS_HEADER = re.compile(r"^\s*INSTRUCTIONS\s*$", re.IGNORECASE)


def strip_instructions_block(text):
    """Drop the numbered pre-amble instructions block, if present, so the
    real question numbering starts cleanly at 1. Detected structurally: once
    an INSTRUCTIONS header is seen, everything up to the next restart-to-1
    (after having seen a higher number) is dropped."""
    lines = text.splitlines()
    start = None
    for i, ln in enumerate(lines):
        if INSTRUCTIONS_HEADER.match(ln):
            start = i
            break
    if start is None:
        return text

    seen_higher = False
    for j in range(start + 1, len(lines)):
        m = re.match(r"^\s*(\d{1,3})\.?\s+\S", lines[j])
        if m:
            n = int(m.group(1))
            if n == 1 and seen_higher:
                return "\n".join(lines[:start] + lines[j:])
            if n > 1:
                seen_higher = True
    return text  # no restart found -- leave untouched rather than guess


# "General English" is excluded: it turns out to be a precis/letter/reading-
# comprehension paper (descriptive), not an MCQ paper -- same category as the
# English-I essay papers this project already keeps out of the MCQ pipeline.
PAPERS = [
    ("CAO2026:GS-I",    "Direct_2025-2027/CAO March-2026 General Studies Paper-I (Series A)..pdf", 100),
    ("CAO2026:GS-II",   "Direct_2025-2027/CAO March-2026 General Studies -II- Series-A..pdf", 100),
    ("CAO2026:GS-III",  "Direct_2025-2027/CAO March-2026 General Studies- III Series A..pdf", 100),
]


def main():
    result, totals = {}, [0, 0, 0]
    for key, rel, expected in PAPERS:
        raw = strip_instructions_block(pdf_text(f"{ROOT}/{rel}"))
        blocks = split_questions(clean_lines(raw), expected, key)
        parsed = [parse_block(b) for b in blocks]
        bad = [p for p in parsed if "error" in p]
        fig = [p for p in parsed if p.get("figureBased")]
        totals[0] += len(parsed); totals[1] += len(bad); totals[2] += len(fig)
        print(f"{key:16} {len(parsed):4} parsed, {len(bad):3} unparsed, {len(fig):2} figure-based")
        for p in bad[:6]:
            print(f"     Q{p['n']}: {p['error']}")
        result[key] = parsed

    out = os.path.join(HERE, "parsed-cao-2026.json")
    json.dump(result, open(out, "w"), indent=1, ensure_ascii=False)
    print(f"\ntotal {totals[0]} parsed, {totals[1]} unparsed, {totals[2]} figure-based")
    print("wrote", out)


if __name__ == "__main__":
    main()
