"""
Generate src/data/banks/mpsc-udc-ldc.ts from the staged clerical papers.

Reads ../mpsc-question-bank/state/staged/*.json — six papers, 525 questions,
each verified against its rendered page images — plus the graded answers in
state/grading/ where an official key exists.

GENERATED FILE. Do not hand-edit the .ts; re-run this.

Provenance is carried through rather than flattened, because the whole point of
this bank is that a reader can tell what is known from what is inferred:

  answerSource 'official'  answer came from a published MPSC key
               'derived'   solved; confidence recorded
  (absent)                 no answer yet
  figureBased  the printed options are figures the scan lost — unanswerable
               from this source by anyone, kept out of scored tests
  sourceDefect the PAPER is defective (duplicate-valued options, an option
               mislabelled (c) where (d) was meant)

Usage: python3 tools/udc-ldc-build/build_bank.py
"""

import json
import os
import re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
BANK_REPO = os.path.join(os.path.dirname(REPO), "mpsc-question-bank")
STAGED = os.path.join(BANK_REPO, "state", "staged")
GRADING = os.path.join(BANK_REPO, "state", "grading")
SOLVE = os.path.join(BANK_REPO, "state", "solve")
OUT = os.path.join(REPO, "src", "data", "banks", "mpsc-udc-ldc.ts")

# staged paper name -> (slug, examName, post, paperNumber, year, month, scheme)
PAPERS = {
    "LDC under MPSC Paper-I 2025.": (
        "mpsc-ldc-2025-paper-1", "LDC under MPSC", "Lower Division Clerk",
        "Paper-I", 2025, "February", "LDC"),
    "LDC under MPSC Paper-II 2025.": (
        "mpsc-ldc-2025-paper-2", "LDC under MPSC", "Lower Division Clerk",
        "Paper-II", 2025, "February", "LDC"),
    "Assistant UDC under MPSC paper-I.": (
        "mpsc-asst-udc-2024-paper-1", "Assistant Grade & UDC under MPSC",
        "Assistant Grade / UDC", "Paper-I", 2024, "April", "ASST_UDC"),
    "Assistant UDC under MPSC paper-II.": (
        "mpsc-asst-udc-2024-paper-2", "Assistant Grade & UDC under MPSC",
        "Assistant Grade / UDC", "Paper-II", 2024, "April", "ASST_UDC"),
    "UDC Combined Paper-I (C) May-2025.": (
        "mpsc-udc-combined-2025-paper-1", "UDC Combined Examination",
        "Upper Division Clerk", "Paper-I", 2025, "May", "ASST_UDC"),
    "UDC Combined Paper-II (B) May-2025.": (
        "mpsc-udc-combined-2025-paper-2", "UDC Combined Examination",
        "Upper Division Clerk", "Paper-II", 2025, "May", "ASST_UDC"),
}

# our section id -> (bank subject, topic id, human label)
SECTION = {
    "gk":         ("gk", "gk_general", "General Knowledge"),
    "english":    ("english", "eng_general", "General English"),
    "computer":   ("science", "computer_knowledge", "Computer Knowledge"),
    "arithmetic": ("reasoning", "simple_arithmetic", "Simple Arithmetic"),
    "reasoning":  ("reasoning", "intelligence_reasoning", "General Intelligence & Reasoning"),
}

# Negative marking arrived with Gazette Ex-582/2025 (published 18 Aug 2025).
PENALTY_FROM = (2025, 8)
MONTHS = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
          "July": 7, "August": 8, "September": 9, "October": 10, "November": 11,
          "December": 12}


def ts(v):
    if v is None:
        return "undefined"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        return "[" + ", ".join(ts(x) for x in v) + "]"
    return "'" + str(v).replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"


def load_answers():
    """question-id -> (answerIndex, source, confidence, explanation, keyRef)."""
    out = {}
    key_file = os.path.join(GRADING, "key_Assistant_UDC_under_MPSC_paper_II_.json")
    key = json.load(open(key_file))["answers"] if os.path.exists(key_file) else {}
    solved = {}
    for f in sorted(os.listdir(SOLVE)) if os.path.isdir(SOLVE) else []:
        if f.endswith(".solved.json"):
            for s in json.load(open(os.path.join(SOLVE, f), encoding="utf-8")):
                solved[s["id"]] = s
    for qid, letter in key.items():
        s = solved.get("q" + qid, {})
        out[("Assistant UDC under MPSC paper-II.", int(qid))] = (
            "ABCD".index(letter), "official", None, s.get("explanation", ""),
            "Provisional Answer Key, No.ASST/1/2019-MPSC, 5 April 2024")
    return out


def main():
    answers = load_answers()
    papers, questions = [], []
    penalty_by_paper = {}
    stats = Counter()

    # Index staged files by their own `paper` field: cross_series.py names its
    # output after the booklet it chose ("... (series C)"), not after the paper,
    # so deriving the filename from the paper name silently misses those two.
    by_paper = {}
    for fn in sorted(os.listdir(STAGED)):
        if fn.endswith(".json"):
            j = json.load(open(os.path.join(STAGED, fn), encoding="utf-8"))
            by_paper[j["paper"]] = j

    for name, (slug, exam, post, pno, year, month, scheme) in PAPERS.items():
        d = by_paper.get(name)
        if d is None:
            print("  MISSING staged paper %r (have: %s)" % (name, list(by_paper)))
            continue
        penalised = (year, MONTHS[month]) >= PENALTY_FROM
        penalty_by_paper[slug] = penalised
        subj = "General Studies" if pno == "Paper-I" else "Aptitude & Computer"
        papers.append({
            "id": slug, "examType": "Direct", "examName": exam, "post": post,
            "paperNumber": pno, "paperSubject": subj, "year": year,
            "sourceFile": d.get("sourceOcr", "").replace(".ocr.txt", ""),
        })
        for q in d["questions"]:
            sec = q.get("section") or "gk"
            bsubj, topic, label = SECTION.get(sec, SECTION["gk"])
            qid = "%s-q%03d" % (slug, q["qnum"])
            opts = q.get("options") or []
            ans = answers.get((name, q["qnum"]))
            rec = {
                "id": qid, "subject": bsubj, "topic": topic, "topicLabel": label,
                "difficulty": "medium", "type": "mcq",
                "question": q["stem"], "options": opts,
                "answerIndex": ans[0] if ans else -1,
                "explanation": (ans[3] if ans else "") or "",
                "source": "%s, %s %d, %s" % (exam, month, year, pno),
                "year": year, "paperId": slug,
            }
            if ans:
                rec["answerSource"] = ans[1]
                rec["answerKeyRef"] = ans[4]
                stats["official"] += 1
            else:
                stats["unanswered"] += 1
            if q.get("unanswerable") or not opts:
                rec["figureBased"] = True
                stats["figureBased"] += 1
            if q.get("printedOptionLabels"):
                rec["sourceDefect"] = "duplicate-options"
                rec["disputeNote"] = (
                    "The paper prints its fourth option as (c) rather than (d); "
                    "kept as printed.")
                stats["sourceDefect"] += 1
            if q.get("textSource") == "vision":
                rec["_vision"] = True
                stats["vision"] += 1
            if q.get("optionsFromSeries"):
                rec["_series"] = q["optionsFromSeries"]
                stats["crossSeries"] += 1
            rec["_penalised"] = penalised
            questions.append(rec)
            stats["total"] += 1

    lines = ["import type { BankQuestion, ExamPaper, QuestionBank } from './types';", "",
             "// " + "=" * 58,
             "// MPSC CLERICAL CADRE (LDC / UDC / ASSISTANT GRADE) — QUESTION BANK",
             "//",
             "// GENERATED FILE — do not hand-edit.",
             "// Re-run: python3 tools/udc-ldc-build/build_bank.py",
             "//",
             "// Source: ../mpsc-question-bank/state/staged/ — six papers whose",
             "// question counts were checked against the official syllabus blueprints",
             "// and whose numbering was verified against the rendered page images.",
             "//",
             "// ANSWERS: only the Apr-2024 Assistant/UDC Paper-II sitting has a",
             "// published MPSC key, so it is the ONLY paper here with answers, and they",
             "// are answerSource 'official'. Every other question carries",
             "// answerIndex -1 and NO answer — MPSC never published keys for these",
             "// sittings, and a guess badged as an answer is worse than a blank.",
             "//",
             "// NEGATIVE MARKING: Gazette Ex-582/2025 (published 18 Aug 2025) applies",
             "// -1/3 per wrong MCQ to LDC, UDC and Assistant Grade. Papers sat BEFORE",
             "// that date carry no penalty. Scoring must follow each paper's own rule.",
             "// " + "=" * 58, ""]

    lines += [
        "/**",
        " * Whether each paper was sat under negative marking.",
        " *",
        " * Gazette Ex-582/2025 published 18 Aug 2025 -- so this is a YEAR AND MONTH",
        " * test, not a year test. All six papers here (Feb-2025, Apr-2024, May-2025)",
        " * predate it and carry NO penalty. Exported rather than re-derived in the UI,",
        " * because a `year >= 2025` shortcut marked the February and May 2025 papers as",
        " * penalised and would have taught a wrong exam rule.",
        " */",
        "export const mpscUdcLdcNegativeMarking: Record<string, boolean> = {",
    ]
    for p in papers:
        lines.append("  %s: %s," % (ts(p["id"]), ts(penalty_by_paper[p["id"]])))
    lines.append("};")
    lines.append("")
    lines.append("export const mpscUdcLdcPapers: ExamPaper[] = [")
    for p in papers:
        lines.append("  { " + ", ".join("%s: %s" % (k, ts(v)) for k, v in p.items()) + " },")
    lines += ["];", ""]

    lines.append("export const mpscUdcLdcQuestions: BankQuestion[] = [")
    for q in questions:
        body = {k: v for k, v in q.items() if not k.startswith("_")}
        lines.append("  {")
        for k, v in body.items():
            lines.append("    %s: %s," % (k, ts(v)))
        lines.append("  },")
    lines += ["];", ""]

    lines += [
        "export const mpscUdcLdc: QuestionBank = {",
        "  id: 'mpsc-udc-ldc',",
        "  title: 'MPSC Clerical — LDC / UDC / Assistant',",
        "  description:",
        "    '%d questions from %d past papers of the Mizoram Ministerial Service "
        "clerical cadre, verified against the printed pages.'," % (len(questions), len(papers)),
        "  questions: mpscUdcLdcQuestions,",
        "  papers: mpscUdcLdcPapers,",
        "};",
        "",
    ]
    with open(OUT, "w") as f:
        f.write("\n".join(lines))

    print("wrote %s" % OUT)
    print("  papers    : %d" % len(papers))
    print("  questions : %d" % stats["total"])
    print("  official  : %d" % stats["official"])
    print("  unanswered: %d" % stats["unanswered"])
    print("  figureBased/unanswerable: %d" % stats["figureBased"])
    print("  source defects          : %d" % stats["sourceDefect"])
    print("  vision-corrected        : %d" % stats["vision"])
    print("  cross-series repaired   : %d" % stats["crossSeries"])


if __name__ == "__main__":
    main()
