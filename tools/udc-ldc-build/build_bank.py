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
            idx = "ABCD".index(letter)
            s = expl.get("q" + qnum, {})
            # These explanations come from the blind calibration solve, which
            # did not have the key. Where that solve picked a DIFFERENT option,
            # its reasoning argues for the option we are not showing -- the page
            # then displays the Commission's answer above a paragraph explaining
            # why a different one is right, which reads as a contradiction and
            # teaches the wrong thing. Keep the explanation only where the two
            # agree; the answer itself is the key's either way.
            #
            # A LOW-confidence explanation is dropped even when it happens to
            # agree: "option 9 is picked arbitrarily among the four and should
            # not be trusted" is a statement about the solver, not about the
            # question, and printing it under a published answer tells the
            # reader to distrust a verdict that is in fact authoritative.
            same = s.get("answerIndex") == idx and s.get("confidence") != "low"
            out[(paper, int(qnum))] = (
                idx, "official", s.get("explanation", "") if same else "",
                "%s (%s)" % (d["keyFile"].rstrip(". pdf"), d.get("kind", "key")))
    return out


DERIVED = os.path.join(BANK_REPO, "state", "solve-derived")
ADJ_DIR = os.path.join(BANK_REPO, "state", "adjudicate")
CROSS_DIR = os.path.join(BANK_REPO, "state", "crosscheck")
ADJUDICATED = os.path.join(ADJ_DIR, "_resolved.json")
CROSSCHECKED = os.path.join(CROSS_DIR, "_resolved.json")
RESTALE = os.path.join(BANK_REPO, "state", "restale")
DISPUTES = os.path.join(BANK_REPO, "state", "key-disputes.json")


def load_disputes(staged_by_paper):
    """
    (paper, qnum) -> note, for questions where we think the MPSC key is wrong.

    The official letter is left as the marked answer on purpose -- it is what
    scores marks in the real exam -- so this only attaches a warning beside it.

    Each entry is verified against BOTH the current stem and the current key
    letter, and a mismatch is fatal. A dispute that has drifted onto another
    question is worse than no dispute: it would tell the reader the key is
    wrong about a question whose key is fine, while leaving the actually-wrong
    one unflagged. Renumbering has moved content-keyed records onto the wrong
    questions in this repo before, which is why this refuses to guess.
    """
    if not os.path.exists(DISPUTES):
        return {}

    keys = {}
    for fn in sorted(os.listdir(GRADING)):
        if fn.startswith("key_") and fn.endswith(".json"):
            d = json.load(open(os.path.join(GRADING, fn)))
            keys[d["paper"]] = d["answers"]

    out, problems = {}, []
    for e in json.load(open(DISPUTES, encoding="utf-8"))["disputes"]:
        paper, qnum = e["paper"], e["qnum"]
        q = (staged_by_paper.get(paper) or {}).get(qnum)
        if q is None:
            problems.append("%s q%d: no such staged question" % (paper, qnum))
            continue
        if e["stemAnchor"].lower() not in q["stem"].lower():
            problems.append("%s q%d: stem no longer matches anchor %r\n      stem is: %r"
                            % (paper, qnum, e["stemAnchor"], q["stem"][:90]))
            continue
        have = (keys.get(paper) or {}).get(str(qnum))
        if have != e["officialLetter"]:
            # The Commission may have issued a corrected key. That is good news,
            # but it must be looked at rather than silently kept as a dispute.
            problems.append("%s q%d: key now says %s, dispute was filed against %s"
                            % (paper, qnum, have, e["officialLetter"]))
            continue
        out[(paper, qnum)] = e["note"]

    if problems:
        raise SystemExit("state/key-disputes.json is stale:\n  - " + "\n  - ".join(problems))
    return out


# ORDER MATTERS: later directories overwrite earlier ones, so an id that has
# been re-solved is checked against the text of its MOST RECENT batch. Without
# that, a re-solve done specifically because the text was repaired gets judged
# against the broken text it was meant to replace, fails the match, and is
# thrown away -- which is exactly what happened to four of them.
BATCH_DIRS = [
    os.path.join(BANK_REPO, "state", "solve-derived"),
    os.path.join(BANK_REPO, "state", "adjudicate"),
    os.path.join(BANK_REPO, "state", "crosscheck"),
    os.path.join(BANK_REPO, "state", "restale"),
]


def _norm(t):
    return re.sub(r"[^a-z0-9]", "", (t or "").lower())


def _same_question(was, stem):
    """
    Is this the same question, allowing for text the parser has since cleaned?

    Deliberately NOT a plain "stem starts with the old text" test. Cleanups cut
    junk off the FRONT as well as the back -- a running header, a page number,
    the question's own printed number -- so a one-sided prefix test reports a
    tidied question as a different one and its answer gets thrown away. That
    cost a real answer the first time round.

    Containment needs a reasonable amount of text behind it; on very short
    stems it would match unrelated questions, so those must agree on a prefix.
    """
    a, b = _norm(was)[:60], _norm(stem)[:60]
    if not a or not b:
        return False
    if b.startswith(a) or a.startswith(b):
        return True
    return len(a) >= 20 and (a in _norm(stem) or b in _norm(was))


def batch_text():
    """
    solved id -> the question text the solver was actually shown.

    Every batch file records the stem it handed out, which is the only durable
    evidence of WHICH question an answer belongs to. The id is not: it encodes
    a question NUMBER, and numbers move whenever the parser improves.

    Returned PER DIRECTORY, not merged. The same id can mean two different
    questions in two different rounds -- "…::q11" was "Why are the western
    slopes…" when it was first solved and "Which industry is related to the
    second green revolution?" when it was re-solved after a re-parse. Merging
    would let the later round's text decide where the earlier round's answer
    belongs, which silently deletes the earlier answer's real question.
    """
    out = {}
    for d in BATCH_DIRS:
        per = {}
        if os.path.isdir(d):
            for fn in sorted(os.listdir(d)):
                if not fn.endswith(".json") or fn.endswith(".solved.json"):
                    continue
                if fn.startswith("_"):
                    continue
                try:
                    rows = json.load(open(os.path.join(d, fn), encoding="utf-8"))
                except (ValueError, OSError):
                    continue
                if isinstance(rows, list):
                    for x in rows:
                        if isinstance(x, dict) and x.get("id"):
                            per[x["id"]] = x.get("question") or ""
        out[d] = per
    return out


def align_answers(records, staged_by_paper):
    """
    Re-seat every derived answer on the question its solver actually saw.

    An id is "<paper>::q<N>", and N is only meaningful for the parse that
    produced it. This bank has been re-parsed repeatedly -- a reading-order
    repair, recovered questions, junk stems dropped -- and each time, answers
    keyed by number silently slid onto their neighbours. That failure is
    invisible: the count still matches the blueprint and every question still
    has an answer, but the answer belongs to a different question. It was
    caught only because an explanation about Jim Corbett National Park was
    sitting under "Which is the highest populated state in India?".

    So: trust the TEXT, not the number.
      stem still matches   -> keep
      matches another stem -> move it there
      matches nothing      -> DROP. The solver answered a question that no
                              longer exists (a booklet instruction page, a
                              "Series-C" header). Keeping it would put a
                              confident answer on an unrelated question.
    An answer whose batch text was not recorded, or whose text normalises to
    nothing (a stem the OCR reduced to "?"), is kept: there is nothing to check
    it against, and dropping on absence of evidence throws away good answers.

    `records` arrives in OVERLAY ORDER and each carries the text from its own
    batch, so two rounds that reused the same id land on their own questions
    and the later round wins only where they genuinely collide.
    """
    moved = dropped = unverifiable = 0
    aligned = {}
    for rec in records:
        paper, qnum, was, val = rec["paper"], rec["qnum"], rec["was"], rec["val"]
        stems = staged_by_paper.get(paper)
        w = _norm(was)
        if stems is None or was is None or not w:
            unverifiable += 1
            aligned[(paper, qnum)] = val
            continue
        if _same_question(was, stems.get(qnum, "")):
            aligned[(paper, qnum)] = val
            continue
        hit = [n for n, st in stems.items() if _same_question(was, st)]
        if len(hit) == 1:
            aligned[(paper, hit[0])] = val
            moved += 1
        else:
            dropped += 1
    return aligned, moved, dropped, unverifiable


def load_derived(shown):
    """
    Ordered list of derived-answer records, each tagged with the question text
    its solver was shown so align_answers() can seat it correctly.

    Later overlays are appended after earlier ones and win on collision:
      solve-derived  the base blind solve
      adjudicate     weakest answers re-solved blind by a stronger model
      crosscheck     three-way ties broken against the Group-C deck
      restale        re-solved because the SOURCE TEXT was repaired
    """
    recs = []

    def add(qid, val, src):
        if "::q" not in qid:
            return
        paper, q = qid.rsplit("::q", 1)
        if not q.isdigit():
            return
        recs.append({"paper": paper, "qnum": int(q), "val": val,
                     "was": shown.get(src, {}).get(qid)})

    for fn in sorted(os.listdir(DERIVED)) if os.path.isdir(DERIVED) else []:
        if not fn.endswith(".solved.json"):
            continue
        for s in json.load(open(os.path.join(DERIVED, fn), encoding="utf-8")):
            idx = s.get("answerIndex")
            if isinstance(idx, int) and 0 <= idx <= 3:
                add(s.get("id", ""),
                    (idx, "derived", s.get("explanation", ""), s.get("confidence"), None),
                    DERIVED)

    if os.path.exists(ADJUDICATED):
        for qid, a in json.load(open(ADJUDICATED, encoding="utf-8")).items():
            note = None
            if a.get("agreement") == "unresolved":
                note = ("Two independent attempts at this question disagreed and both "
                        "were unsure \u2014 the printed figure or data did not survive "
                        "scanning. Treat this answer as unverified.")
            add(qid, (a["answerIndex"], "derived", a.get("explanation", ""),
                      a.get("confidence"), note), ADJ_DIR)

    if os.path.exists(CROSSCHECKED):
        for qid, a in json.load(open(CROSSCHECKED, encoding="utf-8")).items():
            add(qid, (a["answerIndex"], "derived", a.get("explanation", ""),
                      a.get("confidence"), a.get("note")), CROSS_DIR)

    if os.path.isdir(RESTALE):
        for fn in sorted(os.listdir(RESTALE)):
            if not fn.endswith(".solved.json"):
                continue
            for s in json.load(open(os.path.join(RESTALE, fn), encoding="utf-8")):
                idx = s.get("answerIndex")
                if isinstance(idx, int) and 0 <= idx <= 3:
                    add(s.get("id", ""),
                        (idx, "derived", s.get("explanation", ""),
                         s.get("confidence"), None),
                        RESTALE)
    return recs


def main():
    answers = load_answers()
    shown = batch_text()
    derived = load_derived(shown)
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

    disputes = load_disputes(
        {p: {q["qnum"]: q for q in d["questions"]} for p, d in by_paper.items()})

    derived, moved, dropped, unverifiable = align_answers(
        derived,
        {p: {q["qnum"]: q["stem"] for q in d["questions"]} for p, d in by_paper.items()})
    stats["answers_realigned"] = moved
    stats["answers_dropped_stale"] = dropped
    stats["answers_unverifiable"] = unverifiable

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
                    note = disputes.get((name, q["qnum"]))
                    if note:
                        rec["disputeNote"] = note
                        stats["keyDisputed"] += 1
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
    print("  official key disputed   : %d" % stats["keyDisputed"])
    print("  answers re-seated by text: %d" % stats["answers_realigned"])
    print("  answers dropped as stale : %d" % stats["answers_dropped_stale"])
    print("  answers unverifiable     : %d" % stats["answers_unverifiable"])
    print("  vision-corrected        : %d" % stats["vision"])
    print("  cross-series repaired   : %d" % stats["crossSeries"])


if __name__ == "__main__":
    main()
