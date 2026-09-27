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
    "Assistant, UDC Paper-I Series A.": (
        "mpsc-asst-udc-2025oct-paper-1", "Assistant Grade & UDC (Combined)",
        "Assistant Grade / UDC", "Paper-I", 2025, "October", "ASST_UDC"),
    "Assistant, UDC Paper-II Series A.": (
        "mpsc-asst-udc-2025oct-paper-2", "Assistant Grade & UDC (Combined)",
        "Assistant Grade / UDC", "Paper-II", 2025, "October", "ASST_UDC"),
    "LDC Paper-I under Law _ Judicial Deptt..": (
        "mpsc-ldc-2026feb-paper-1", "LDC under Law & Judicial Deptt.",
        "Lower Division Clerk", "Paper-I", 2026, "February", "LDC"),
    "LDC Paper-II under Law _ Judicial Deptt..": (
        "mpsc-ldc-2026feb-paper-2", "LDC under Law & Judicial Deptt.",
        "Lower Division Clerk", "Paper-II", 2026, "February", "LDC"),
    "LDC under SW, WCD Paper - I.": (
        "mpsc-ldc-2026apr-paper-1", "LDC under Commissioner for PwD, SW & WCD",
        "Lower Division Clerk", "Paper-I", 2026, "April", "LDC"),
    "LDC under SW, WCD Paper-II.": (
        "mpsc-ldc-2026apr-paper-2", "LDC under Commissioner for PwD, SW & WCD",
        "Lower Division Clerk", "Paper-II", 2026, "April", "LDC"),
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
    """
    (paper name, question number) -> (answerIndex, source, explanation, keyRef).

    Scans EVERY key file in state/grading/ rather than naming one. The Apr-2024
    Provisional Answer Key covers Paper-I (75 answers) AND Paper-II (100) --
    an earlier version loaded only Paper-II, so the site told the reader
    "no MPSC key exists for this sitting" about a paper whose key it had
    already parsed. Each key file records its own `paper`, so the mapping is
    paper-scoped: keying on the bare question number would match every paper's
    q1..q100 against the first key loaded.
    """
    out = {}
    if not os.path.isdir(GRADING):
        return out

    solved = {}
    for root, _dirs, files in os.walk(SOLVE):
        for fn in sorted(files):
            if fn.endswith(".solved.json"):
                for s in json.load(open(os.path.join(root, fn), encoding="utf-8")):
                    solved.setdefault(os.path.basename(root), {})[s["id"]] = s

    for fn in sorted(os.listdir(GRADING)):
        if not fn.startswith("key_") or not fn.endswith(".json"):
            continue
        d = json.load(open(os.path.join(GRADING, fn)))
        paper = d["paper"]
        slug = re.sub(r"[^\w-]+", "_", paper).strip("_")
        expl = solved.get(slug, {})
        for qnum, letter in d["answers"].items():
            if letter not in "ABCD":
                continue
            s = expl.get("q" + qnum, {})
            out[(paper, int(qnum))] = (
                "ABCD".index(letter), "official", s.get("explanation", ""),
                "%s (%s)" % (d["keyFile"].rstrip(". pdf"), d.get("kind", "key")))
    return out


DERIVED = os.path.join(BANK_REPO, "state", "solve-derived")
ADJUDICATED = os.path.join(BANK_REPO, "state", "adjudicate", "_resolved.json")


def reorder_maps():
    """
    paper -> {old qnum: new qnum}, from the vision corrections.

    Needed because the solve batches were generated BEFORE the page-2
    reading-order fix on UDC Combined Paper-I, so their ids carry the old
    numbering. The ANSWERS remain valid -- a solver answered a specific set of
    options, and the reorder moved that option set to a different number -- but
    the id has to travel with it, or eleven answers land on the wrong questions.
    """
    f = os.path.join(BANK_REPO, "state", "vision-corrections.json")
    if not os.path.exists(f):
        return {}
    data = json.load(open(f, encoding="utf-8"))
    out = {}
    for paper, spec in data.items():
        if not isinstance(spec, dict):
            continue
        for e in spec.get("fixes", []):
            if isinstance(e, dict) and e.get("reorder"):
                out[paper] = {int(k): int(v) for k, v in e["reorder"].items()}
    return out


def load_derived():
    """
    (paper, qnum) -> (answerIndex, 'derived', explanation, confidence).

    Solved by model where MPSC published no key. Ids in these batches are
    "<paper>::q<N>", so the mapping is paper-scoped by construction -- the bare
    question number would collide across papers exactly as it did in the
    quick-revision converter.
    """
    out = {}
    if not os.path.isdir(DERIVED):
        return out
    for fn in sorted(os.listdir(DERIVED)):
        if not fn.endswith(".solved.json"):
            continue
        for s in json.load(open(os.path.join(DERIVED, fn), encoding="utf-8")):
            if "::" not in s.get("id", ""):
                continue
            paper, q = s["id"].rsplit("::q", 1)
            idx = s.get("answerIndex")
            if not isinstance(idx, int) or not 0 <= idx <= 3:
                continue
            out[(paper, int(q))] = (idx, "derived", s.get("explanation", ""),
                                    s.get("confidence"), None)

    # Overlay the adjudication pass. The weakest answers (the solver's own
    # 'medium' and 'low') were re-solved BLIND by a stronger model and
    # reconciled: agreement raises confidence, disagreement takes the stronger
    # answer, and a disagreement where both runs were unsure is recorded as
    # unresolved rather than dressed up as an answer.
    if os.path.exists(ADJUDICATED):
        for qid, a in json.load(open(ADJUDICATED, encoding="utf-8")).items():
            if "::" not in qid:
                continue
            paper, q = qid.rsplit("::q", 1)
            note = None
            if a.get("agreement") == "unresolved":
                note = ("Two independent attempts at this question disagreed and both "
                        "were unsure — the printed figure or data did not survive "
                        "scanning. Treat this answer as unverified.")
            out[(paper, int(q))] = (a["answerIndex"], "derived",
                                    a.get("explanation", ""), a.get("confidence"), note)

    # Apply any reading-order permutation recorded after these were solved.
    for paper, mapping in reorder_maps().items():
        moved = {}
        for old, new in mapping.items():
            if (paper, old) in out:
                moved[(paper, new)] = out.pop((paper, old))
        out.update(moved)
    return out


def main():
    answers = load_answers()
    derived = load_derived()
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
            ans = answers.get((name, q["qnum"])) or derived.get((name, q["qnum"]))
            rec = {
                "id": qid, "subject": bsubj, "topic": topic, "topicLabel": label,
                "difficulty": "medium", "type": "mcq",
                "question": q["stem"], "options": opts,
                "answerIndex": ans[0] if ans else -1,
                "explanation": (ans[2] if ans else "") or "",
                "source": "%s, %s %d, %s" % (exam, month, year, pno),
                "year": year, "paperId": slug,
            }
            if ans:
                rec["answerSource"] = ans[1]
                if ans[1] == "official":
                    rec["answerKeyRef"] = ans[3]
                    stats["official"] += 1
                else:
                    if ans[3]:
                        rec["answerConfidence"] = ans[3]
                    if len(ans) > 4 and ans[4]:
                        rec["disputeNote"] = ans[4]
                        stats["unresolved"] += 1
                    stats["derived_" + (ans[3] or "unrated")] += 1
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
        " * Exam conditions per paper, from the syllabus blueprints in §1 of",
        " * PLAN-UDC-LDC.md -- NOT invented in the UI.",
        " *",
        " * Every clerical MCQ is 2 marks (LDC Paper-I Part A: 150 marks / 75 MCQ;",
        " * Paper-II: 200 / 100). The penalty, where it applies, is one third of the",
        " * question's marks, so 0.667 on a 2-mark question.",
        " */",
        "export interface UdcLdcPaperMeta {",
        "  marksPerQuestion: number;",
        "  durationMinutes: number;",
        "  negativeMarking: boolean;",
        "  /** Fraction of the question's marks deducted for a wrong answer. */",
        "  penaltyFraction: number;",
        "}",
        "",
        "export const mpscUdcLdcPaperMeta: Record<string, UdcLdcPaperMeta> = {",
    ]
    for p in papers:
        pen = penalty_by_paper[p["id"]]
        lines.append(
            "  %s: { marksPerQuestion: 2, durationMinutes: 180, "
            "negativeMarking: %s, penaltyFraction: %s },"
            % (ts(p["id"]), "true" if pen else "false", "1 / 3" if pen else "0"))
    lines += ["};", ""]

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
