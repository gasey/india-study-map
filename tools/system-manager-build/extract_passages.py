#!/usr/bin/env python3
"""
Recover the comprehension passages the bank's extractor dropped.

THE BUG THIS FIXES: 32 of the 160 General English questions are comprehension
items attached to a reading passage, and `mpsc_bank_v2.json` holds none of the
passages (every Tier-1 record has an empty `passage`/`passageId`). Shipped as
they were, questions like "Find the word in the passage which means 'intruding
beyond acceptable limits'" and the five consecutive "Which of the following
statements is correct?" items in the MIC paper are simply unanswerable.

Per CLAUDE.md - when something looks off, go to the original source PDF rather
than patch around the symptom in the UI. The passages are present in both PDFs;
these are text-layer PDFs, so pdftotext recovers them cleanly (unlike the
Paper II scans, which needed a vision pass).

Emits staged/passages.json:
  { "<passageId>": {"srcKey", "questions": [nos], "title", "text"} }
assemble.py attaches `passage` to each matching question and app.js renders it
in a collapsible block above the question.

Usage:  python3 tools/system-manager-build/extract_passages.py
"""

import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
PDFS = os.path.expanduser(
    "~/workspace/projects/personal/mpsc-question-bank/pdfs/Old_Questions/Direct_2014-2018")

# srcKey -> (pdf filename, [(passageId, title, start_regex, end_regex, [question nos])])
SPECS = {
    "CO2016A-GE": ("1.Computer Operator (Contract) under SAD 2016 General English.pdf", [
        ("CO2016A-GE-psg1", "Manners and civilised society",
         r"answer to each of the questions out of the four alternatives\s*:",
         r"^\s*17\.\s", list(range(17, 33))),
    ]),
    "CO2016B-GE": ("1.Computer Operator (CB) under Mizoram Information Commission 2016 General English.pdf", [
        ("CO2016B-GE-psg1", "Religious thought and human need",
         r"Passage\s*-\s*1\s*:", r"^\s*17\.\s", list(range(17, 22))),
        ("CO2016B-GE-psg2", "The jester and the king",
         r"PASSAGE\s*-\s*2\s*:", r"^\s*22\.\s", list(range(22, 28))),
        ("CO2016B-GE-psg3", "Wave energy as a power source", r"Passage\s*-\s*3\s*:",
         r"^\s*28\.\s", list(range(28, 33))),
    ]),
}


def pdf_lines(path):
    out = subprocess.run(["pdftotext", "-layout", path, "-"],
                         capture_output=True, text=True, check=True)
    return out.stdout.splitlines()


def clean(lines):
    """Drop page-break artifacts and normalise whitespace into paragraphs."""
    keep = []
    for ln in lines:
        s = ln.strip()
        if not s:
            keep.append("")
            continue
        if re.fullmatch(r"-\s*\d+\s*-", s):        # "-3-" page markers
            continue
        if re.fullmatch(r"\d+", s):                 # bare page numbers
            continue
        keep.append(s)
    # join wrapped lines into paragraphs on blank-line boundaries
    paras, cur = [], []
    for s in keep:
        if s:
            cur.append(s)
        elif cur:
            paras.append(" ".join(cur))
            cur = []
    if cur:
        paras.append(" ".join(cur))
    text = "\n\n".join(paras)
    text = text.replace("’", "'").replace("‘", "'")
    text = text.replace("“", '"').replace("”", '"')
    return re.sub(r"[ \t]{2,}", " ", text).strip()


def main():
    problems = []
    out = {}

    for srckey, (fname, specs) in SPECS.items():
        path = os.path.join(PDFS, fname)
        if not os.path.isfile(path):
            problems.append(f"{srckey}: source PDF missing at {path}")
            continue
        lines = pdf_lines(path)

        for pid, title, start_re, end_re, qnos in specs:
            si = next((i for i, l in enumerate(lines) if re.search(start_re, l)), None)
            if si is None:
                problems.append(f"{pid}: start marker /{start_re}/ not found")
                continue
            ei = next((i for i in range(si + 1, len(lines))
                       if re.search(end_re, lines[i])), None)
            if ei is None:
                problems.append(f"{pid}: end marker /{end_re}/ not found after line {si}")
                continue
            text = clean(lines[si + 1:ei])
            if len(text) < 300:
                problems.append(f"{pid}: extracted only {len(text)} chars — "
                                f"markers probably wrong")
                continue
            out[pid] = {"srcKey": srckey, "questions": qnos, "title": title, "text": text}
            print(f"OK  {pid}: {len(text):>5} chars, {len(text.split()):>4} words, "
                  f"Q{qnos[0]}-{qnos[-1]} ({len(qnos)} questions)")

    os.makedirs(STAGED, exist_ok=True)
    with open(os.path.join(STAGED, "passages.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    total_q = sum(len(v["questions"]) for v in out.values())
    print(f"\n{len(out)} passage(s) covering {total_q} questions "
          f"-> staged/passages.json")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
