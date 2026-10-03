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

import glob
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
    # --- the older UDC scheme (1 mark a question; Paper-II is GK + Arithmetic,
    # Paper-I is a conventional section plus 75 General English MCQ). Dates are
    # read from each paper's own printed header, not from the filename or the
    # source page's year range, both of which disagree with it.
    "2.UDC (contract) 2016 Art& Culture Paper-II": (
        "mpsc-udc-artculture-2016-paper-2", "UDC (Contract) under Art & Culture",
        "Upper Division Clerk", "Paper-II", 2016, "October", "UDC_OLD"),
    "2.UDC under SAD Paper-II": (
        "mpsc-udc-sad-2018-paper-2", "UDC under Secretariat Administration",
        "Upper Division Clerk", "Paper-II", 2018, "February", "UDC_OLD"),
    "2.UDC Excise Deptt. Paper-II": (
        "mpsc-udc-excise-2018-paper-2", "UDC under Excise & Narcotics",
        "Upper Division Clerk", "Paper-II", 2018, "June", "UDC_OLD"),
    "UDC ARC Paper-I": (
        "mpsc-udc-arc-2020-paper-1", "UDC (Contract) under ARCS, Cooperation",
        "Upper Division Clerk", "Paper-I", 2020, "January", "UDC_OLD"),
    "UDC ARC Paper-II": (
        "mpsc-udc-arc-2020-paper-2", "UDC (Contract) under ARCS, Cooperation",
        "Upper Division Clerk", "Paper-II", 2020, "January", "UDC_OLD"),
    "UDC Direct under Taxation Deptt - Paper-II": (
        "mpsc-udc-taxation-2021-paper-2", "UDC under Taxation Deptt.",
        "Upper Division Clerk", "Paper-II", 2021, "March", "UDC_OLD"),
    "UDC Direct under Fisheries Deptt - Paper-I": (
        "mpsc-udc-fisheries-2021-paper-1", "UDC under Fisheries Deptt.",
        "Upper Division Clerk", "Paper-I", 2021, "April", "UDC_OLD"),
    "UDC Direct under Fisheries Deptt - Paper-II": (
        "mpsc-udc-fisheries-2021-paper-2", "UDC under Fisheries Deptt.",
        "Upper Division Clerk", "Paper-II", 2021, "April", "UDC_OLD"),
    # --- eleven more older-scheme UDC sittings, staged 2026-09-29. Department
    # and date are read from each paper's own printed header, never from the
    # filename: "1.UDC Paper-I" and "2.UDC Paper-II" turn out to be the two
    # halves of the SOCIAL WELFARE sitting of June 2018, which the filenames do
    # not say at all.
    "1.UDC Excise Deptt. Paper-I": (
        "mpsc-udc-excise-2018-paper-1", "UDC under Excise & Narcotics",
        "Upper Division Clerk", "Paper-I", 2018, "June", "UDC_OLD"),
    "1.UDC Paper-I": (
        "mpsc-udc-socialwelfare-2018-paper-1", "UDC under Social Welfare",
        "Upper Division Clerk", "Paper-I", 2018, "June", "UDC_OLD"),
    "2.UDC Paper-II": (
        "mpsc-udc-socialwelfare-2018-paper-2", "UDC under Social Welfare",
        "Upper Division Clerk", "Paper-II", 2018, "June", "UDC_OLD"),
    "1.UDC under Agriculture Deptt. Paper-I": (
        "mpsc-udc-agriculture-2018-paper-1", "UDC under Agriculture (Crop Husbandry)",
        "Upper Division Clerk", "Paper-I", 2018, "March", "UDC_OLD"),
    "2.UDC under Agriculture Deptt. Paper-II": (
        "mpsc-udc-agriculture-2018-paper-2", "UDC under Agriculture (Crop Husbandry)",
        "Upper Division Clerk", "Paper-II", 2018, "March", "UDC_OLD"),
    "1.UDC under SAD Paper-I": (
        "mpsc-udc-sad-2018-paper-1", "UDC under Secretariat Administration",
        "Upper Division Clerk", "Paper-I", 2018, "February", "UDC_OLD"),
    "1.UDC under Tourism Deptt.-I": (
        "mpsc-udc-tourism-2018-paper-1", "UDC under Tourism Deptt.",
        "Upper Division Clerk", "Paper-I", 2018, "June", "UDC_OLD"),
    "2.UDC under Tourism Deptt.-II": (
        "mpsc-udc-tourism-2018-paper-2", "UDC under Tourism Deptt.",
        "Upper Division Clerk", "Paper-II", 2018, "June", "UDC_OLD"),
    "2.UDC Direct-2014 Health Deptt.& Co-operation Dept.Paper-II": (
        "mpsc-udc-health-coop-2014-paper-2", "UDC under Health & Family Welfare and Co-operation",
        "Upper Division Clerk", "Paper-II", 2014, "October", "UDC_OLD"),
    "2.UDC under EF&CC Deptt. Paper-II": (
        "mpsc-udc-efcc-2018-paper-2", "UDC (Contract) under Environment, Forest & Climate Change",
        "Upper Division Clerk", "Paper-II", 2018, "February", "UDC_OLD"),
    "UDC Direct under Taxation Deptt - Paper-I": (
        "mpsc-udc-taxation-2021-paper-1", "UDC under Taxation Deptt.",
        "Upper Division Clerk", "Paper-I", 2021, "March", "UDC_OLD"),

    # --- staged 2026-09-29, completing the clerical Direct corpus.
    #
    # Three of these are the missing Paper-I of a sitting whose Paper-II was
    # already here (Art & Culture 2016, Health/Co-operation 2014, EF&CC 2018).
    #
    # ⚠️ EIGHT OF THESE PAPER-Is CONTAIN NO MCQ AT ALL. Up to Feb 2018 the
    # clerical Paper-I was a wholly written English paper -- essay, precis,
    # idioms, sentence transformation, 125 marks. They are here for their
    # DESCRIPTIVE items and contribute zero questions to any drill or mock.
    # The scheme changed between Feb and Jun 2018: EF&CC (Feb) is written
    # throughout, Excise (Jun) has the Section-A-written + 75-MCQ shape.
    "1.UDC (contract) 2016 Art& Culture Paper-I": (
        "mpsc-udc-artculture-2016-paper-1", "UDC (Contract) under Art & Culture",
        "Upper Division Clerk", "Paper-I", 2016, "October", "UDC_OLD"),
    "1.UDC (Contract) 2016-Cooperation Paper-I": (
        "mpsc-udc-cooperation-2016-paper-1", "UDC (Contract) under Co-operation",
        "Upper Division Clerk", "Paper-I", 2016, "October", "UDC_OLD"),
    "2.UDC (Contract) 2016-Cooperation Paper-II": (
        "mpsc-udc-cooperation-2016-paper-2", "UDC (Contract) under Co-operation",
        "Upper Division Clerk", "Paper-II", 2016, "October", "UDC_OLD"),
    "1.UDC Direct-2014 Health Deptt.& Co-operation Dept..Paper-I": (
        "mpsc-udc-health-coop-2014-paper-1",
        "UDC under Health & F.W. and Co-operation",
        "Upper Division Clerk", "Paper-I", 2014, "October", "UDC_OLD"),
    "1.UDC under EF&CC Deptt. Paper-I": (
        "mpsc-udc-efcc-2018-paper-1", "UDC (Contract) under EF&CC",
        "Upper Division Clerk", "Paper-I", 2018, "February", "UDC_OLD"),

    # Assistant Grade, the third post of the cadre. Paper-II is General
    # Knowledge 75 + Simple Arithmetic 50 = 125 marks, so 125 MCQ in 2018 and
    # 75 MCQ + a written Section B in 2010/2014/2015.
    "1.Assistant Grade Paper-I": (
        "mpsc-asst-dpar-2018-paper-1", "Assistant Grade under DP&AR (SSW)",
        "Assistant Grade", "Paper-I", 2018, "April", "UDC_OLD"),
    "2.Assistant Grade Paper-II": (
        "mpsc-asst-dpar-2018-paper-2", "Assistant Grade under DP&AR (SSW)",
        "Assistant Grade", "Paper-II", 2018, "April", "UDC_OLD"),
    "1.Assistant Grade-2014 under GOM Paper-I": (
        "mpsc-asst-2014-paper-1", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-I", 2014, "June", "UDC_OLD"),
    "2.Assistant Grade-2014under GOM Paper-II": (
        "mpsc-asst-2014-paper-2", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-II", 2014, "June", "UDC_OLD"),
    "1.Assistant Grade-2015 under GOM Paper-I": (
        "mpsc-asst-2015-paper-1", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-I", 2015, "January", "UDC_OLD"),
    "2.Assistant Grade-2015 under GOM Paper-II": (
        "mpsc-asst-2015-paper-2", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-II", 2015, "January", "UDC_OLD"),
    # March 2010, the oldest sitting in the bank. The Paper-II file is
    # SECTION A ONLY (General Knowledge); its Section B is a separate PDF the
    # parser cannot yet read -- see mpsc-question-bank/state/out-of-scope.json.
    "1.Assistant Grade under GOM 2010 Paper-I": (
        "mpsc-asst-2010-paper-1", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-I", 2010, "March", "UDC_OLD"),
    "2.Assistant Grade under GOM 2010 Paper-II Series A": (
        "mpsc-asst-2010-paper-2", "Assistant Grade under Govt. of Mizoram",
        "Assistant Grade", "Paper-II", 2010, "March", "UDC_OLD"),

    # Section B of the SAME March-2010 Paper-II as the entry above, which is
    # Section A. They are two PDFs of one printed 125-mark paper and there is
    # no single staged artifact for it, so they appear as two rows -- the
    # examName says which is which. paperNumber stays "Paper-II" for both,
    # because that is what the paper is and the filter chip should not grow a
    # third value. Its ten MCQ are printed as lettered sub-parts with roman
    # options; the other 40 marks are nine worked problems, carried as written
    # questions.
    "3.Assistant Grade under GOM 2010 Paper-II": (
        "mpsc-asst-2010-paper-2-arith",
        "Assistant Grade under Govt. of Mizoram (Section B: Arithmetic)",
        "Assistant Grade", "Paper-II", 2010, "March", "UDC_OLD"),

    # NO LDE PAPERS. The user scoped the bank to DIRECT recruitment on
    # 2026-09-30, as a whole category -- see
    # ../mpsc-question-bank/state/out-of-scope.json. "UDC LDE Paper-I." was
    # briefly listed here because its 30 questions are General English, which
    # the Direct exam also tests; it is unlisted rather than deleted, and its
    # staged artifact is untouched, so restoring it is one entry.
}

# Marks per MCQ, by slug. The modern clerical scheme is 2 marks a question
# (LDC Paper-I Part A: 150 marks / 75 MCQ; Paper-II: 200 / 100), but the older
# UDC sittings print "All questions carry equal marks of 1 each" with Full
# Marks 100 over 100 questions. Scoring those at 2 would show a 200-mark total
# for a 100-mark paper and double every penalty.
MARKS_PER_QUESTION = {
    "mpsc-udc-excise-2018-paper-1": 1,
    "mpsc-udc-socialwelfare-2018-paper-1": 1,
    "mpsc-udc-socialwelfare-2018-paper-2": 1,
    "mpsc-udc-agriculture-2018-paper-1": 1,
    "mpsc-udc-agriculture-2018-paper-2": 1,
    "mpsc-udc-sad-2018-paper-1": 1,
    "mpsc-udc-tourism-2018-paper-1": 1,
    "mpsc-udc-tourism-2018-paper-2": 1,
    "mpsc-udc-health-coop-2014-paper-2": 1,
    "mpsc-udc-efcc-2018-paper-2": 1,
    "mpsc-udc-taxation-2021-paper-1": 1,
    "mpsc-udc-excise-2018-paper-2": 1,
    "mpsc-udc-artculture-2016-paper-2": 1,
    "mpsc-udc-sad-2018-paper-2": 1,
    "mpsc-udc-arc-2020-paper-1": 1,
    "mpsc-udc-arc-2020-paper-2": 1,
    "mpsc-udc-fisheries-2021-paper-1": 1,
    "mpsc-udc-fisheries-2021-paper-2": 1,
    "mpsc-udc-taxation-2021-paper-2": 1,
    # Staged 2026-09-29. All old-scheme UDC/Assistant sittings: "All questions
    # carry equal marks of 1 each" over a 125-mark Paper-II.
    "mpsc-udc-artculture-2016-paper-1": 1,
    "mpsc-udc-cooperation-2016-paper-1": 1,
    "mpsc-udc-cooperation-2016-paper-2": 1,
    "mpsc-udc-health-coop-2014-paper-1": 1,
    "mpsc-udc-efcc-2018-paper-1": 1,
    "mpsc-asst-dpar-2018-paper-1": 1,
    "mpsc-asst-dpar-2018-paper-2": 1,
    "mpsc-asst-2014-paper-1": 1,
    "mpsc-asst-2014-paper-2": 1,
    "mpsc-asst-2015-paper-1": 1,
    "mpsc-asst-2015-paper-2": 1,
    "mpsc-asst-2010-paper-1": 1,
    "mpsc-asst-2010-paper-2": 1,
    "mpsc-asst-2010-paper-2-arith": 1,
    # The exception: UDC LDE Paper-I prints "All questions carry equal mark of
    # 2 each" over a 60-mark MCQ section -- 30 questions, not 60. Read from the
    # paper, which is why its blueprint came out right.
}
DEFAULT_MARKS = 2

# Sat after the Gazette date but NOT penalised.
#
# Ex-582/2025 amends Schedules I-III, which are the schedules for DIRECT
# recruitment to Assistant, UDC and LDC. mpsc-udc-lde-2025-paper-1 is a
# Limited Departmental Examination for promotion, sat in the same month, and
# the papers themselves bear this out: both post-Gazette DIRECT papers in this
# bank print "negative marking" on their cover instructions, and this one does
# not mention it at all. Scoring a candidate against a penalty their paper
# never warned them about would be inventing a rule, so the date test alone is
# not enough.
# Empty while the bank is Direct-only: the one paper this existed for was the
# Aug-2025 LDE sitting, now out of scope. Kept because the reasoning is the
# reusable part -- Gazette Ex-582/2025 amends Schedules I-III, the DIRECT
# schedules, so a date test alone does not settle whether a penalty applies.
NO_PENALTY = set()

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


# Option letters. Four is the norm in this cadre, but nothing fixes the number,
# so the a-d assumption is gone from the pipeline. The load-time checks below
# can only bound the index by this alphabet -- the question's real option count
# is not known until emission, where it IS checked against.
LETTERS = "abcdefgh"


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
ROUND4 = os.path.join(BANK_REPO, "state", "solve-round4")
SOLVED_HTML = os.path.join(BANK_REPO, "state", "solved-html", "_matched.json")
DISPUTES = os.path.join(BANK_REPO, "state", "key-disputes.json")
OPTION_DEFECTS = os.path.join(BANK_REPO, "state", "option-defects.json")
GK_KIND = os.path.join(BANK_REPO, "state", "gk-kind", "_resolved.json")

# Hand-recorded decisions about questions two overlays disagree on. Applied last,
# after solved-html, so a recorded decision cannot be silently undone by the next
# round. See the file's _README for why this exists rather than a reordering.
ARBITRATION = os.path.join(HERE, "answer-arbitration.json")

# Figures recovered from source scans, keyed by bank question id. Lives with the
# build rather than in the generated .ts because the .ts is overwritten on every
# run -- see the file's own _README for the recovery that was lost that way.
FIGURES_PATH = os.path.join(HERE, "figure-attachments.json")

# GK sub-topic per question, keyed by bank question id ("slug-qNNN").
# The staged papers carry no section finer than "gk", so a sub-topic
# can only come from the question's content -- see the file's _README
# for the classifier and its measured precision. Categories follow the
# taxonomy in PLAN-UDC-LDC.md §5, plus mizoram (a top-level subject
# there). Two guards below make this file load-bearing: every GK
# question must have an entry, and every entry must still match a
# question in the build.
SUBTOPICS = os.path.join(HERE, "gk-subtopics.json")
GK_TOPICS = {
    "current-affairs", "general", "science-tech", "polity-constitution",
    "mizoram", "economy", "geography", "general-science",
    "modern-indian-history", "art-culture",
}

# qid -> {question, options} for arbitration entries that repair text, not just
# the answer. Populated by load_arbitration_text(); see its docstring.
ARB_TEXT = {}

# The sentence that opens the disputeNote of every WITHDRAWN answer. A named
# constant because two places need it and they must not drift: the code that
# writes the withdrawal, and the guard that has to recognise one in the shipped
# record. The withdrawal happens in load_derived(), long before the question
# loop runs, so the guard cannot compare before-and-after -- it can only look at
# the artifact and ask whether this absence of an answer was the recorded kind.
WITHDRAWAL_MARK = "No answer is shipped for this question."

# (paper, qnum) -> the answerIndex that question had before its arbitration
# text/note was applied, for entries that decide no answer. Filled in during the
# question loop, read by the arbitration guard. See load_arbitration_text().
ANSWERLESS_ARB = {}


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


def load_option_defects(staged_by_paper):
    """
    (paper, qnum) -> note, for questions where the correct answer is not among
    the four PRINTED options, so the answer shown is only the nearest survivor.

    Distinct from load_disputes(): there the Commission's key looks wrong, here
    the paper itself is defective and no option is actually right. The reader is
    warned either way, because a page that looks authoritative and states a wrong
    fact is worse than one that admits the item is broken.

    Verified against the OPTION SET, not just the stem. An option lost in
    extraction and an option the Commission never printed produce the identical
    symptom, and only the second belongs in that file -- the first is our bug to
    fix. So if the staged options have since changed (a parser repair recovered
    the missing one, say), this is fatal rather than silently keeping a note that
    now libels a fine question.
    """
    if not os.path.exists(OPTION_DEFECTS):
        return {}
    out, problems = {}, []
    for e in json.load(open(OPTION_DEFECTS, encoding="utf-8"))["defects"]:
        paper, qnum = e["paper"], e["qnum"]
        q = (staged_by_paper.get(paper) or {}).get(qnum)
        if q is None:
            problems.append("%s q%d: no such staged question" % (paper, qnum))
            continue
        if e["stemAnchor"].lower() not in q["stem"].lower():
            problems.append("%s q%d: stem no longer matches anchor %r\n      stem is: %r"
                            % (paper, qnum, e["stemAnchor"], q["stem"][:90]))
            continue
        if [o.strip() for o in (q.get("options") or [])] != e["printedOptions"]:
            problems.append(
                "%s q%d: options have changed since this defect was recorded.\n"
                "      recorded: %s\n      staged  : %s\n"
                "      If a parser fix recovered %r, DELETE the entry rather than "
                "updating it -- the paper was not defective after all."
                % (paper, qnum, e["printedOptions"], q.get("options"),
                   e.get("missingAnswer")))
            continue
        out[(paper, qnum)] = (
            "This question appears to be defective as printed: the expected answer "
            "(%s) is not among the four options the Commission printed. The answer "
            "shown is the nearest of the four. %s"
            % (e["missingAnswer"], e["note"]))

    if problems:
        raise SystemExit("state/option-defects.json is stale:\n  - "
                         + "\n  - ".join(problems))
    return out


# ORDER MATTERS: later directories overwrite earlier ones, so an id that has
# been re-solved is checked against the text of its MOST RECENT batch. Without
# that, a re-solve done specifically because the text was repaired gets judged
# against the broken text it was meant to replace, fails the match, and is
# thrown away -- which is exactly what happened to four of them.
# Each later solving round gets its own directory, and they are globbed rather
# than listed so adding one cannot be half-done -- registering a round here but
# not in load_derived() (or the reverse) would silently drop or mis-seat a whole
# round's answers. They stay SEPARATE directories, never extra files in
# solve-derived, because batch_text() keys per directory: round 5 re-solves
# questions round 4 already answered, against stems that have since changed, so
# one flat directory would let the newer text decide where the older answer
# belongs.
ROUND_DIRS = sorted(glob.glob(os.path.join(BANK_REPO, "state", "solve-round*")))


def load_figures():
    """
    Recovered-figure attachments, keyed by bank question id.

    An entry naming an id this build does not produce is an ERROR, not a no-op.
    That is the whole point: when these five recoveries lived only in the
    generated .ts, the next build overwrote them and nothing said so. A stale key
    is the same failure one step earlier -- the attachment stops being applied
    while still looking present in the input.
    """
    global FIGURES
    FIGURES = {}
    if not os.path.exists(FIGURES_PATH):
        return
    raw = json.load(open(FIGURES_PATH, encoding="utf-8"))
    for k, v in raw.items():
        if not k.startswith("_"):
            FIGURES[k] = v


def load_arbitration_text():
    """
    The subset of answer-arbitration.json that also repairs QUESTION TEXT.

    answerIndex settles which option is right. It cannot settle the options
    themselves, and on the one question where the printed options were destroyed
    by OCR it did not have to: picking the right slot out of four strings of
    garbage is not picking the right answer. So an entry may also carry `question`
    and `options`, read verbatim off the scan.

    Deliberately NOT handled here: the paper stem had also absorbed a failed
    attempt to linearise the stacked-fraction options, so both halves need
    replacing together.

    It also records, in ANSWERLESS_ARB, which of these entries decide no answer,
    so the guard can check that they really did leave the answer alone. Reading
    that off the file would prove nothing: "leaves the answer alone" is a claim
    about what happened during the build, not a description of the file.

    Split from load_derived() because that runs before any question record
    exists, and these fields have to land on one.
    """
    global ARB_TEXT, ANSWERLESS_ARB
    ARB_TEXT = {}
    ANSWERLESS_ARB = {}
    if not os.path.exists(ARBITRATION):
        return
    for k, v in json.load(open(ARBITRATION, encoding="utf-8")).items():
        if k.startswith("_"):
            continue
        if v.get("question") or v.get("options") or v.get("note"):
            # Re-key to (paper, qnum) so the question loop can find it with the
            # same tuple it uses for every other answer source. The file's own
            # key is the '<paper>::q<num>' string, with num unpadded.
            paper, _, num = k.rpartition("::q")
            if paper and num.isdigit():
                ARB_TEXT[(paper, int(num))] = v
                if "answerIndex" not in v:
                    # Value filled in by the question loop, which is the only
                    # place the pre-arbitration answer exists.
                    ANSWERLESS_ARB[(paper, int(num))] = None


BATCH_DIRS = [
    os.path.join(BANK_REPO, "state", "solve-derived"),
    os.path.join(BANK_REPO, "state", "adjudicate"),
    os.path.join(BANK_REPO, "state", "crosscheck"),
    os.path.join(BANK_REPO, "state", "restale"),
] + ROUND_DIRS


def _norm(t):
    return re.sub(r"[^a-z0-9]", "", (t or "").lower())


# Recovered emphasis: __word__ for an underline, *word* for italics. Not a
# _____ blank, which is a run of underscores with nothing between them.
#
# BOTH marks, and that is not tidiness. When italics were added the check still
# only knew about underlines, so ten answers produced before the markup existed
# re-seated as though nothing had changed -- the identical failure this guard
# was written for, two hours later, because the guard named one mark instead of
# the category. Anything that makes a stem mean something new belongs here.
_UNDERLINED = re.compile(r"__[^\s_][^_]*__|\*[^\s*][^*]*\*")


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
        # An underline that has since been RECOVERED makes this a different
        # question, and _norm cannot see it: it strips underscores, so
        # "Let us move __on__" and "Let us move on" normalise identically and
        # the answer seats as though nothing changed. But the underline IS the
        # question -- without it the solver was choosing among four plausible
        # tested words, and on "The population of India is less than that of
        # China" it picked Pronoun for "that" where the paper underlines "less".
        # Drop those so they are re-solved against the marked-up stem.
        now = stems.get(qnum, "")
        if _UNDERLINED.search(now or "") and not _UNDERLINED.search(was):
            dropped += 1
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
      solved-html    a third-party transcription of the printed papers with the
                     correct option marked, matched on TEXT (its own numbering
                     is not the printed numbering). It overlays everything above
                     because it MEASURES far better than any of them: on the
                     Apr-2024 sitting, which is one of only two for which MPSC
                     published a key, it agreed 158/159 = 99.4%. Still not
                     official -- it is a transcription, and it loses to a real
                     key, which is checked before any of this.
      arbitration    a hand-recorded decision about a question two overlays
                     disagreed on. Not an automatic round, and last so a later
                     round cannot overrule it.
    """
    recs = []

    def add(qid, val, src, was=None):
        # `was` is the question text the answer was produced against, so
        # align_answers() can re-seat it by TEXT. Solve batches record it per
        # round; the solved-html source passes the staged stem it matched,
        # which is the same guarantee arrived at a different way.
        if "::q" not in qid:
            return
        paper, q = qid.rsplit("::q", 1)
        if not q.isdigit():
            return
        recs.append({"paper": paper, "qnum": int(q), "val": val,
                     "was": was if was is not None else shown.get(src, {}).get(qid)})

    for fn in sorted(os.listdir(DERIVED)) if os.path.isdir(DERIVED) else []:
        if not fn.endswith(".solved.json"):
            continue
        for s in json.load(open(os.path.join(DERIVED, fn), encoding="utf-8")):
            idx = s.get("answerIndex")
            if isinstance(idx, int) and 0 <= idx < len(LETTERS):
                add(s.get("id", ""),
                    (idx, "derived", s.get("explanation", ""), s.get("confidence"), None),
                    DERIVED)

    # Later solving ROUNDS sit here, with solve-derived, because they are the
    # same kind of thing: a first blind pass over questions that had no answer.
    # They must come BEFORE adjudicate/crosscheck/restale, which are verdicts
    # ON a first pass and have to win.
    #
    # They were briefly placed after, which silently undid an entire
    # adjudication: the 73 weak answers re-solved from rounds 4-6 were
    # overwritten by the very answers the adjudication existed to correct, and
    # the only symptom was that the bank's high/medium/low counts did not move
    # at all after a round that reported 96 answers raised to high.
    for rd in ROUND_DIRS:
        if not os.path.isdir(rd):
            continue
        for fn in sorted(os.listdir(rd)):
            if not fn.endswith(".solved.json"):
                continue
            for s in json.load(open(os.path.join(rd, fn), encoding="utf-8")):
                idx = s.get("answerIndex")
                if isinstance(idx, int) and 0 <= idx < len(LETTERS):
                    add(s.get("id", ""),
                        (idx, "derived", s.get("explanation", ""),
                         s.get("confidence"), None),
                        rd)

    if os.path.exists(ADJUDICATED):
        for qid, a in json.load(open(ADJUDICATED, encoding="utf-8")).items():
            note = None
            if a.get("agreement") == "unresolved":
                note = ("Two independent attempts at this question disagreed and both "
                        "were unsure \u2014 the printed figure or data did not survive "
                        "scanning. Treat this answer as unverified.")
            elif a.get("agreement") == "contested":
                alt = a.get("contestedAnswerIndex")
                if isinstance(alt, int) and 0 <= alt < len(LETTERS):
                    note = ("A further independent solve picked (%s) instead. It was "
                            "less confident than the answer shown, so the answer shown "
                            "was kept — but this one is worth checking against a "
                            "published key if one ever appears." % LETTERS[alt])
                else:
                    note = ("A further independent solve disagreed with this answer but "
                            "was less confident, so the answer shown was kept.")
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
                if isinstance(idx, int) and 0 <= idx < len(LETTERS):
                    add(s.get("id", ""),
                        (idx, "derived", s.get("explanation", ""),
                         s.get("confidence"), None),
                        RESTALE)

    if os.path.exists(SOLVED_HTML):
        for qid, a in json.load(open(SOLVED_HTML, encoding="utf-8")).items():
            if a.get("compensated"):
                # MPSC awarded grace marks: the question was defective and every
                # candidate scored it, so there is no correct option to teach.
                # Do not supply an answer -- say what happened instead.
                add(qid, (None, "derived", "", None,
                          "MPSC awarded grace marks for this question — it was "
                          "defective as set, and every candidate received the "
                          "mark regardless of what they chose."), SOLVED_HTML,
                    a.get("stem"))
                continue
            idx = a.get("answerIndex")
            if isinstance(idx, int) and 0 <= idx < len(LETTERS):
                add(qid, (idx, "transcribed", "", "high", a.get("note")),
                    SOLVED_HTML, a.get("stem"))

    # LAST, and outranks everything above including solved-html. These are
    # recorded decisions, not another automatic round: someone looked at two
    # overlays that disagreed and wrote down which one is right, with a reason.
    # A new solve round landing later must not be able to overrule that, or the
    # file becomes decoration.
    #
    # `answerIndex: null` WITHDRAWS the answer rather than picking a side, and
    # is the honest option when every overlay's answer was a placeholder on a
    # question whose figure never survived scanning.
    # An entry with NO `answerIndex` key at all settles only the TEXT and/or a
    # reader's note, and leaves the answer alone. That is a different thing from
    # `answerIndex: null`, which WITHDRAWS the answer: conflating the two
    # silently strips a perfectly good answer off a question whose only problem
    # was a damaged stem.
    if os.path.exists(ARBITRATION):
        for qid, a in json.load(open(ARBITRATION, encoding="utf-8")).items():
            if qid.startswith("_"):
                continue  # _README and friends
            if "answerIndex" not in a:
                continue  # text/note only; load_arbitration_text() handles it
            idx = a.get("answerIndex")
            reason = a.get("reason", "")
            if idx is None:
                add(qid, (None, "derived",
                          WITHDRAWAL_MARK + " " + reason,
                          None, reason), ARBITRATION)
                continue
            if not isinstance(idx, int) or not 0 <= idx < len(LETTERS):
                continue
            # Confidence is carried through rather than dropped. It is optional
            # here only so a WITHDRAWN answer has nothing to say, but leaving it
            # off a shipped answer silently removes the question from the bank's
            # "weak answers needing review" count, which makes an arbitrated
            # question look better-sourced than it is.
            # Explanation: use explicit 'explanation' field, fall back to 'reason'.
            add(qid, (idx, "derived", a.get("explanation", reason), a.get("confidence"), reason), ARBITRATION)
    return recs


def main():
    answers = load_answers()
    shown = batch_text()
    derived = load_derived(shown)
    load_figures()
    load_arbitration_text()
    papers, questions = [], []
    penalty_by_paper = {}
    unanswered = []
    # GK question ids, collected as the loop meets them, for the
    # sub-topic coverage guard at the end of main().
    gk_ids = []
    stats = Counter()

    # Index staged files by their own `paper` field: cross_series.py names its
    # output after the booklet it chose ("... (series C)"), not after the paper,
    # so deriving the filename from the paper name silently misses those two.
    by_paper = {}
    for fn in sorted(os.listdir(STAGED)):
        if fn.endswith(".json"):
            j = json.load(open(os.path.join(STAGED, fn), encoding="utf-8"))
            by_paper[j["paper"]] = j

    staged_index = {p: {q["qnum"]: q for q in d["questions"]}
                    for p, d in by_paper.items()}
    gk_kind = {}
    if os.path.exists(GK_KIND):
        for qid, t in json.load(open(GK_KIND, encoding="utf-8")).items():
            paper, _, num = qid.rpartition("::q")
            gk_kind[(paper, int(num))] = t
    # Keyed by bank question id already, so no (paper, qnum) split is
    # needed -- but a key that does not match a built id is exactly the
    # silent no-op the guards below exist to catch.
    subtopics = {}
    if os.path.exists(SUBTOPICS):
        for qid, t in json.load(open(SUBTOPICS, encoding="utf-8")).items():
            if not qid.startswith("_"):
                subtopics[qid] = t

    def apply_gk_topic(rec, qid):
        # Finer still: which GK sub-topic. Content-classified (the
        # staged section is only "gk"), so the checked-in table is
        # the authority and a missing entry is a build error, not a
        # default -- see the coverage guard at the end of main().
        # Shared by both record loops: a Paper-II short-answer item
        # ("Write the full form of SAARC") is minted by the
        # descriptive loop but is General Knowledge all the same.
        if qid in subtopics:
            rec["gkTopic"] = subtopics[qid]
            stats["gk_topic"] += 1

    disputes = load_disputes(staged_index)
    option_defects = load_option_defects(staged_index)

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
        penalised = ((year, MONTHS[month]) >= PENALTY_FROM
                     and slug not in NO_PENALTY)
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
            # BOUND THE ANSWER BY THIS QUESTION'S OWN OPTIONS. Every check
            # before this point can only compare the index against the option
            # ALPHABET, because the question's options are not in scope there
            # -- so an index of 0 on a question with an empty options array
            # passes all of them and ships as a real answer pointing at
            # nothing. That has happened. It is also what makes more than four
            # options safe: the limit is the question, not the number four.
            if ans and ans[0] is not None and not (0 <= ans[0] < len(opts)):
                stats["answer_out_of_range"] += 1
                print("  DROPPED out-of-range answer: %s q%d -> index %s of %d options"
                      % (name, q["qnum"], ans[0], len(opts)))
                ans = None
            rec = {
                "id": qid, "subject": bsubj, "topic": topic, "topicLabel": label,
                "difficulty": "medium", "type": "mcq",
                "question": q["stem"], "options": opts,
                # ans[0] is None for a grace-marked question: MPSC scored it for
                # everyone, so there is no correct option. Treat it as unanswered
                # rather than inventing one, but keep the note explaining why.
                "answerIndex": (ans[0] if (ans and ans[0] is not None) else -1),
                "explanation": (ans[2] if ans else "") or "",
                "source": "%s, %s %d, %s" % (exam, month, year, pno),
                "year": year, "paperId": slug,
            }
            if ans and ans[0] is None:
                rec["disputeNote"] = ans[4]
                stats["grace_marks"] += 1
            elif ans:
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
                # Dumped for the solver to pick up. This is the AUTHORITATIVE
                # unanswered set and it cannot be reproduced by diffing the
                # solve dirs against staged: derived answers are seated by TEXT,
                # so a record whose stem was later repaired does not seat and
                # its question is unanswered despite having a solve record.
                # Deriving the list any other way re-solves the wrong questions.
                # ...unless there is nothing to solve. A question already marked
                # unanswerable, or left with fewer than two readable options, is
                # not work in flight -- it is a known hole. Listing it sends a
                # solver a question with an EMPTY options array, and the only
                # thing it can return is a placeholder index. One did: q99 of
                # LDC Paper-II 2025 (a mirror-image item whose figures scanned
                # as a black block) came back with answerIndex 0, which passes
                # the build's own `0 <= idx < len(LETTERS)` guard and would have shipped
                # as a real answer pointing at no option at all.
                live_opts = [o for o in opts if (o or "").strip()]
                if not q.get("unanswerable") and len(live_opts) >= 2:
                    unanswered.append({"id": "%s::q%d" % (name, q["qnum"]),
                                       "paper": name, "qnum": q["qnum"],
                                       "section": sec, "direction": q.get("direction"),
                                       "question": q["stem"], "options": opts})
            # A list of four EMPTY STRINGS is not four options. The staging gate
            # counts list length, so nine questions passed "4opt" with blanks --
            # two of them blank in all four slots. A student cannot choose
            # between nothing and nothing, so count what is actually printable.
            live = [o for o in opts if (o or "").strip()]
            if q.get("unanswerable") or len(live) < 2:
                rec["figureBased"] = True
                stats["figureBased"] += 1
            # A figure recovered from the source scan, keyed by bank question id.
            # Applied LAST, over the figureBased verdict above, because recovery is
            # newer information than the staging that produced it.
            fig = FIGURES.get(qid)
            if fig:
                if fig.get("imagePath"):
                    rec["imagePath"] = fig["imagePath"]
                    stats["figureAttachments"] = stats.get("figureAttachments", 0) + 1
                    # The attachment has to actually exist. A missing file renders
                    # as a broken image, which is worse than the figureBased notice
                    # it replaces -- so fail loudly at build time instead.
                    fp = os.path.join(REPO, "public", "question-images",
                                      fig["imagePath"])
                    if not os.path.exists(fp):
                        raise SystemExit(
                            "figure-attachments.json: %s points at a missing file: %s"
                            % (qid, fp))
                if fig.get("question"):
                    rec["question"] = fig["question"]
                if fig.get("explanation"):
                    rec["explanation"] = fig["explanation"]
                if fig.get("figureRecovered"):
                    # The figure is legible now, so the question is answerable and
                    # must count as such. Leaving figureBased on would keep a
                    # perfectly good question out of every scored test.
                    if rec.pop("figureBased", None):
                        stats["figureRecovered"] = stats.get("figureRecovered", 0) + 1
                elif rec.get("figureBased"):
                    # Re-insert so imagePath is emitted BEFORE figureBased, which
                    # is the order the field had when these were hand-edited into
                    # the .ts. Cosmetic, but it keeps a regenerated file
                    # byte-comparable with the committed one, so a real change
                    # stands out instead of hiding in a reordering.
                    rec["figureBased"] = rec.pop("figureBased")
            # Text repaired from the source scan by a recorded arbitration. Last,
            # for the same reason the figure attachments are: this is the newest
            # information about the question and nothing staged afterwards may
            # outrank it.
            at = ARB_TEXT.get((name, q["qnum"]))
            if at:
                if (name, q["qnum"]) in ANSWERLESS_ARB:
                    ANSWERLESS_ARB[(name, q["qnum"])] = rec["answerIndex"]
                if at.get("question"):
                    rec["question"] = at["question"]
                if at.get("options"):
                    rec["options"] = at["options"]
                # A warning for the reader, on a question whose ANSWER is not
                # itself in doubt. Appended rather than assigned, for the same
                # reason the duplicate-options note is: something staged may
                # already have something true to say about the paper itself.
                if at.get("note"):
                    rec["disputeNote"] = (
                        (rec["disputeNote"] + " " + at["note"])
                        if rec.get("disputeNote") else at["note"])
                # A flagged question must not keep a confident-looking badge.
                # UdcLdcPage counts 'derived' + low/medium as the weak answers
                # needing review, so an entry saying "treat this as untested"
                # that leaves confidence at 'high' drops the one question it is
                # warning about out of the very tally meant to catch it.
                if at.get("confidence"):
                    rec["answerConfidence"] = at["confidence"]
                if at.get("question") or at.get("options"):
                    stats["arbitratedText"] = stats.get("arbitratedText", 0) + 1
                if at.get("note"):
                    stats["arbitratedNotes"] = stats.get("arbitratedNotes", 0) + 1
                # Replaced options must not leave the answer pointing past the end
                # of the new list. The range check above ran against the OLD
                # options, so it cannot have caught this.
                #
                # answerIndex -1 means NO answer is shipped, which is not the same
                # as an answer that has fallen off the end. Testing it here once
                # reported a repaired STEM on a withdrawn question as a broken
                # option list -- and, worse, told whoever hit it to go looking at
                # an options field their entry never had. A withdrawn answer is
                # allowed to sit beside a repaired stem; that is exactly what a
                # text-only entry on a withdrawn question is for.
                if rec["answerIndex"] >= 0 and rec["answerIndex"] >= len(rec["options"]):
                    raise SystemExit(
                        "answer-arbitration.json: %s: answerIndex %d does not fit "
                        "the %d options shipped for it"
                        % (qid, rec["answerIndex"], len(rec["options"])))
            # The correct answer is not among the printed options. Set last so the
            # warning survives whichever answer path ran above: it is true of the
            # PAPER, not of how we happened to answer it, and it is the thing the
            # reader most needs to know about these four questions.

            # Static knowledge vs current affairs, for GK only. This bank runs
            # 2016-2026, so a third of its GK has an answer that was true at the
            # SITTING and is not true now -- "the new chairman of UPSC" on a 2021
            # paper, Indore as cleanest city in 2018. Untagged falls back to
            # static, which is why reconcile_gk_kind.py refuses to write a
            # partial set: a missed item is shown as a bare undated fact, the
            # exact thing this tag exists to prevent.
            if sec == "gk":
                gk_ids.append(qid)
                t = gk_kind.get((name, q["qnum"]))
                if t and t["kind"] == "current":
                    rec["gkKind"] = "current"
                    # The date comes from PAPERS above, not a second copy of it.
                    rec["answerAsOf"] = "%s %d" % (month, year)
                    stats["gk_current"] += 1
                elif t:
                    rec["gkKind"] = "static"
                    stats["gk_static"] += 1
                else:
                    # NOT tagged yet. Do not default to "durable" -- that is the
                    # unsafe direction, and these newly staged 2014-2018 sittings
                    # are full of current affairs that would then ship as undated
                    # fact. Leave gkKind unset so the UI can say "not classified"
                    # rather than assert the wrong one.
                    stats["gk_untagged"] += 1
                apply_gk_topic(rec, qid)

            odef = option_defects.get((name, q["qnum"]))
            if odef:
                rec["sourceDefect"] = "answer-not-among-options"
                rec["disputeNote"] = odef
                stats["sourceDefect"] += 1
            if q.get("printedOptionLabels"):
                rec["sourceDefect"] = "duplicate-options"
                # APPEND, do not overwrite. This note is set last on purpose so a
                # mechanical defect is never lost -- but two of the arbitrated
                # questions print their fourth option as (c), and overwriting here
                # silently threw away the recorded reason for their answer, which
                # is the only thing explaining a withdrawn answer to the reader.
                # The defect is already carried structurally by sourceDefect, so
                # nothing is lost by keeping both.
                dup = ("The paper prints its fourth option as (c) rather than (d); "
                       "kept as printed.")
                rec["disputeNote"] = (
                    (rec["disputeNote"] + " " + dup) if rec.get("disputeNote")
                    else dup)
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

        # ---- the written half -------------------------------------------
        #
        # Parsed all along and thrown away until now: 156 essay, precis,
        # comprehension and worked-arithmetic prompts across 27 papers. They
        # are not decoration. The UDC/Assistant Paper-I gives Essay 20 +
        # Precis 10 + Comprehension 20 of its marks to written work and the
        # LDC Paper-I gives Essay 20 + Comprehension 30, so a bank that drops
        # them models about half of Paper-I as not existing -- and eight of
        # the papers here have NO MCQ at all, so dropping them would mean
        # staging eight papers that ship nothing.
        #
        # There is no answer to show. `modelAnswer` is null everywhere in the
        # archive and nothing here invents one: these carry the prompt, its
        # marks and its provenance, and say plainly that they are written
        # questions. A fabricated model answer would be worse than none, this
        # being the one part of the paper where a confident wrong answer
        # cannot be checked against an option list.
        #
        # SUBJECT. Every clerical Paper-I is General English by syllabus and
        # every descriptive item in all 26 Paper-Is here is an essay, precis,
        # comprehension or grammar exercise; Paper-II's written half is its
        # Section B, Simple Arithmetic. The exception is a SHORT-ANSWER item,
        # which the parser marks `kind` and which sits inside the MCQ section
        # rather than after it -- the 2010 Assistant Grade Paper-II prints
        # "Write the full form of SAARC" among its General Knowledge MCQs.
        # Those take the section they are printed in, read from the paper
        # rather than assumed, and only where that is unambiguous.
        mcq_sections = [s for s in (d.get("sectionCounts") or {}) if s]
        for i, item in enumerate(d.get("descriptiveItems") or [], 1):
            if item.get("kind") == "short-answer" and len(mcq_sections) == 1:
                sec = mcq_sections[0]
            else:
                sec = "english" if pno == "Paper-I" else "arithmetic"
            bsubj, topic, label = SECTION.get(sec, SECTION["english"])
            drec = {
                "id": "%s-d%02d" % (slug, item.get("qnum") or i),
                "subject": bsubj, "topic": topic, "topicLabel": label,
                "difficulty": "medium", "type": "descriptive",
                "question": item["prompt"], "explanation": item.get("explanation") or "",
                "source": "%s, %s %d, %s" % (exam, month, year, pno),
                "year": year, "paperId": slug,
            }
            if item.get("marks"):
                drec["marks"] = item["marks"]
            if item.get("kind") == "short-answer":
                drec["_shortAnswer"] = True
                stats["descriptive_short_answer"] += 1
            if sec == "gk":
                gk_ids.append(drec["id"])
                apply_gk_topic(drec, drec["id"])
            questions.append(drec)
            stats["descriptive"] += 1

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
        " * The modern clerical MCQ is 2 marks (LDC Paper-I Part A: 150 marks / 75",
        " * MCQ; Paper-II: 200 / 100); the pre-2022 UDC sittings are 1 mark. The",
        " * penalty, where it applies, is one third of the question's own marks.",
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
            "  %s: { marksPerQuestion: %d, durationMinutes: 180, "
            "negativeMarking: %s, penaltyFraction: %s },"
            % (ts(p["id"]), MARKS_PER_QUESTION.get(p["id"], DEFAULT_MARKS),
               "true" if pen else "false", "1 / 3" if pen else "0"))
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

    # Emitted in CHUNKS and concatenated. BankQuestion is a discriminated union,
    # and past ~1,500 object literals in one annotated array tsc gives up with
    # TS2590 "union type that is too complex to represent". Chunking keeps every
    # element type-checked; casting the whole array with `as BankQuestion[]`
    # would also silence the error but would stop checking the generated data,
    # which is the one thing here worth checking.
    CHUNK = 400
    chunks = [questions[i:i + CHUNK] for i in range(0, len(questions), CHUNK)] or [[]]
    for n, chunk in enumerate(chunks, 1):
        lines.append("const questionsPart%d: BankQuestion[] = [" % n)
        for q in chunk:
            body = {k: v for k, v in q.items() if not k.startswith("_")}
            lines.append("  {")
            for k, v in body.items():
                lines.append("    %s: %s," % (k, ts(v)))
            lines.append("  },")
        lines += ["];", ""]
    lines.append("export const mpscUdcLdcQuestions: BankQuestion[] = [")
    lines += ["  ...questionsPart%d," % n for n in range(1, len(chunks) + 1)]
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
    # NOT written yet. The integrity checks below can abort the build, and a
    # generated file that is written before them survives the abort -- so a
    # build that announces a failure still leaves its bad output on disk, and
    # the next thing anyone does is `npm run build`, which compiles it. The
    # write moved below the checks for that reason.
    print("  papers    : %d" % len(papers))
    print("  questions : %d  (%d MCQ + %d written)"
          % (stats["total"] + stats["descriptive"], stats["total"],
             stats["descriptive"]))
    print("  official  : %d" % stats["official"])
    print("  unanswered: %d" % stats["unanswered"])
    print("  figureBased/unanswerable: %d" % stats["figureBased"])
    print("  source defects          : %d" % stats["sourceDefect"])
    print("  GK static / current     : %d / %d   (untagged: %d)"
          % (stats["gk_static"], stats["gk_current"], stats["gk_untagged"]))
    print("  official key disputed   : %d" % stats["keyDisputed"])
    print("  answers re-seated by text: %d" % stats["answers_realigned"])
    print("  answers dropped as stale : %d" % stats["answers_dropped_stale"])
    print("  answers unverifiable     : %d" % stats["answers_unverifiable"])
    print("  vision-corrected        : %d" % stats["vision"])
    print("  cross-series repaired   : %d" % stats["crossSeries"])

    # Every figure attachment must have reached a question that exists.
    #
    # Same reasoning as the adjudicated-verdict check below, and the same silent
    # failure: an overlay that no longer applies is indistinguishable from one
    # that was never needed. If a slug or a question number changes upstream, the
    # id stops matching, the attachment quietly stops being applied, and the
    # recovered figure vanishes from the bank with a successful build.
    if FIGURES:
        by_id = {q["id"]: q for q in questions}
        orphans = sorted(k for k in FIGURES if k not in by_id)
        if orphans:
            raise SystemExit(
                "\n%d figure-attachments.json entries match no question in this "
                "build -- the attachment is NOT being applied:\n  - %s"
                % (len(orphans), "\n  - ".join(orphans)))
        print("  figures attached        : %d (recovered: %d)"
              % (stats["figureAttachments"], stats["figureRecovered"]))

    # Every adjudicated verdict must actually be the answer that ships.
    #
    # Adjudication is a second independent solve of the weakest answers, so if
    # a later overlay silently overwrites it, the whole round is wasted and
    # NOTHING says so -- the tool reports "96 raised to high confidence" and the
    # bank's counts do not move. That is exactly what happened when the
    # solve-round* directories were ordered after adjudicate instead of before:
    # the 73 re-solved answers were overwritten by the very answers the round
    # existed to correct. Counting overlays by hand is how that goes unnoticed;
    # asserting the outcome is how it does not.
    #
    # An id may legitimately be absent (its question was renumbered away, or a
    # published key outranks the verdict), so only MISMATCHES count.
    if os.path.exists(ADJUDICATED):
        arb = {}
        if os.path.exists(ARBITRATION):
            arb = {k: v for k, v in json.load(open(ARBITRATION, encoding="utf-8")).items()
                   if not k.startswith("_")}
        by_id = {q["id"]: q for q in questions}
        lost, checked, arbitrated = [], 0, 0
        for qid, a in json.load(open(ADJUDICATED, encoding="utf-8")).items():
            paper, _, num = qid.rpartition("::q")
            slug = (PAPERS.get(paper) or (None,))[0]
            if not slug or not num.isdigit():
                continue
            rec = by_id.get("%s-q%03d" % (slug, int(num)))
            # 'official' is a published key and 'transcribed' is the marked-up
            # paper, which agreed 158/159 with the one key we can check it
            # against -- far better than any solve. Both are MEANT to outrank a
            # verdict. A grace-marked question has no correct option at all
            # (answerIndex -1) and is also not a loss.
            #
            # A question in answer-arbitration.json is not a loss either: the
            # disagreement was resolved by hand and the decision deliberately
            # overrules the verdict. Those are checked on their own terms below,
            # not waived -- counted separately so the two numbers can be told
            # apart rather than quietly merged into one reassuring total.
            if qid in arb and "answerIndex" in arb[qid]:
                arbitrated += 1
                continue
            if rec is None or rec.get("answerSource") in ("official", "transcribed"):
                continue
            if rec["answerIndex"] == -1:
                continue
            checked += 1
            if rec["answerIndex"] != a["answerIndex"]:
                lost.append("%s: adjudicated %s, shipped %s"
                            % (qid, a["answerIndex"], rec["answerIndex"]))
        if lost:
            raise SystemExit(
                "\n%d adjudicated answers did NOT reach the bank -- a later "
                "overlay is overwriting the verdict:\n  - %s"
                % (len(lost), "\n  - ".join(lost[:10])))
        # Report the COUNT, not just "all". A check that silently verified
        # nothing would print the same reassuring word -- that has happened in
        # this project before, with a gate pointed at an empty directory.
        print("  adjudicated verdicts held : %d/%d  (%d resolved by hand)"
              % (checked, checked, arbitrated))

    # Every recorded arbitration must actually have been applied.
    #
    # Same failure mode as the figure attachments and the adjudicated verdicts,
    # and the same reason for the guard: a key that stops matching -- a renamed
    # paper, a renumbered question, a typo -- makes the entry vanish without an
    # error, and the question quietly reverts to whatever the losing overlay
    # said. Nothing else in the build would notice, because the check above
    # treats an arbitrated question as settled.
    if os.path.exists(ARBITRATION):
        by_id = {q["id"]: q for q in questions}
        dropped = []
        n = 0
        for qid, a in json.load(open(ARBITRATION, encoding="utf-8")).items():
            if qid.startswith("_"):
                continue
            paper, _, num = qid.rpartition("::q")
            slug = (PAPERS.get(paper) or (None,))[0]
            if not slug or not num.isdigit():
                dropped.append("%s: no such paper" % qid)
                continue
            rec = by_id.get("%s-q%03d" % (slug, int(num)))
            if rec is None:
                dropped.append("%s: no question %s-q%03d in the bank"
                               % (qid, slug, int(num)))
                continue
            want = a.get("answerIndex")
            if "answerIndex" in a:
                got = -1 if want is None else want
                if rec["answerIndex"] != got:
                    dropped.append("%s: arbitrated %s, shipped %s"
                                   % (qid, got, rec["answerIndex"]))
                    continue
            elif not (a.get("question") or a.get("options") or a.get("note")):
                dropped.append("%s: entry decides nothing at all" % qid)
                continue
            else:
                # The entry settles text or a note, and says nothing about the
                # answer. Two ways that can go wrong, and both are silent:
                #
                #   the answer got WITHDRAWN, because a missing answerIndex key
                #     and an explicit null were read as the same thing -- and the
                #     withdrawal lands in load_derived(), before this loop, so
                #     there is no before-value here to compare against. Ask the
                #     artifact instead: a recorded withdrawal says so in the note.
                #   the answer got RE-SEATED by something downstream. The
                #     loop's capture is the only before-value that exists.
                key = (paper, int(num))
                if key not in ANSWERLESS_ARB:
                    dropped.append("%s: entry was never applied, so the answer it "
                                   "leaves alone was never captured" % qid)
                    continue
                was = ANSWERLESS_ARB[key]
                if (rec["answerIndex"] == -1
                        and WITHDRAWAL_MARK not in (rec.get("disputeNote") or "")):
                    dropped.append("%s: entry decides no answer, yet the answer was "
                                   "withdrawn -- text-only and withdraw are "
                                   "different things" % qid)
                    continue
                if was is not None and rec["answerIndex"] != was:
                    dropped.append("%s: entry decides no answer, yet the answer "
                                   "changed %s -> %s"
                                   % (qid, was, rec["answerIndex"]))
                    continue
            # An entry that repairs question text must ALSO be checked on the
            # text. Answering this guard on answerIndex alone would let a stem
            # or option list silently revert to the OCR garbage the entry
            # exists to replace, while the guard still reported the entry as
            # applied -- the reader would be shown four strings of noise with
            # a confident-looking index pointing into them.
            if a.get("question") and rec["question"] != a["question"]:
                dropped.append("%s: arbitrated stem not applied" % qid)
                continue
            if a.get("options") and rec["options"] != a["options"]:
                dropped.append("%s: arbitrated options not applied" % qid)
                continue
            # Same for `note`, with one difference: it is APPENDED to whatever
            # was already on the question, so it is found by substring. A
            # question may have two independent things to say about the paper,
            # and demanding exact equality would report a correct build broken.
            if a.get("note") and a["note"] not in (rec.get("disputeNote") or ""):
                dropped.append("%s: arbitration note not applied" % qid)
                continue
            if a.get("confidence") and rec.get("answerConfidence") != a["confidence"]:
                dropped.append("%s: arbitrated confidence %s, shipped %s"
                               % (qid, a["confidence"], rec.get("answerConfidence")))
                continue
            n += 1
        if dropped:
            raise SystemExit(
                "\n%d recorded arbitrations did NOT take effect -- the key no "
                "longer matches, or something outranks it:\n  - %s"
                % (len(dropped), "\n  - ".join(dropped[:10])))
        print("  arbitrations applied     : %d/%d  (text repaired: %d, notes: %d)"
              % (n, n, stats.get("arbitratedText", 0),
                 stats.get("arbitratedNotes", 0)))

    # Every GK question carries a sub-topic, and every sub-topic entry
    # still matches a question in this build.
    #
    # The two halves are separate because they fail differently. A
    # MISSING entry means the classifier never saw the question (an
    # upstream renumber, a newly staged paper) and the bank would ship
    # a GK question with no gkTopic, which the UI renders as a filter
    # that can never be picked. An ORPHAN entry means the file is stale
    # -- a renamed paper or a renumbered question -- and the
    # classification quietly stopped being applied to the question it
    # was written for, which is the same silent no-op the figure and
    # arbitration guards above exist to catch. A value outside
    # GK_TOPICS would ship a label no filter knows.
    #
    # gk_ids is collected in the question loop, because the shipped
    # record carries the SECTION map's topic label, not the staged
    # section the classification was keyed on.
    if os.path.exists(SUBTOPICS):
        by_id = {q["id"]: q for q in questions}
        missing = sorted(i for i in gk_ids if i not in subtopics)
        bad_value = sorted(
            "%s: %r" % (i, subtopics[i])
            for i in gk_ids
            if i in subtopics and subtopics[i] not in GK_TOPICS)
        orphans = sorted(k for k in subtopics if k not in by_id)
        if missing or bad_value or orphans:
            problems = []
            if missing:
                problems.append("%d GK questions have no sub-topic entry:\n  - %s"
                                % (len(missing), "\n  - ".join(missing[:10])))
            if bad_value:
                problems.append("%d entries name no known sub-topic:\n  - %s"
                                % (len(bad_value), "\n  - ".join(bad_value[:10])))
            if orphans:
                problems.append("%d entries match no question in this build:\n  - %s"
                                % (len(orphans), "\n  - ".join(orphans[:10])))
            raise SystemExit(
                "\ngk-subtopics.json does not cover this build:\n  - %s"
                % "\n  - ".join(problems))
        print("  gk sub-topics applied  : %d/%d" % (stats["gk_topic"], len(gk_ids)))

    # Written LAST, after every check has passed. See the note at the old write
    # site: a build that fails must not leave its output behind for the next
    # `npm run build` to compile.
    print("wrote %s" % OUT)
    with open(OUT, "w") as f:
        f.write("\n".join(lines))
    unans_out = os.path.join(BANK_REPO, "state", "unanswered.json")
    json.dump(unanswered, open(unans_out, "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
