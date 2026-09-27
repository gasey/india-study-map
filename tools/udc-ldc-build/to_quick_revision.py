"""
Convert staged clerical papers into quick-revision's staged format.

/embed/quick-revision has two modes and BOTH need an answer: "Revise" hides the
answer and reveals it on tap, "Mock test" scores you against it. A paper with no
answers cannot drive either -- it would render as a list of questions whose
reveal shows nothing, which is worse than not offering the paper at all.

So this only emits papers that actually have answers. Today that is exactly one:
Assistant Grade & UDC Paper-II, April 2024, the single clerical sitting for which
MPSC published a key. The other five papers (425 questions) are skipped and
reported, not silently written as empty drills.

Usage: python3 tools/udc-ldc-build/to_quick_revision.py
Then:  python3 tools/quick-revision-build/build.py
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
BANK_REPO = os.path.join(os.path.dirname(REPO), "mpsc-question-bank")
STAGED = os.path.join(BANK_REPO, "state", "staged")
GRADING = os.path.join(BANK_REPO, "state", "grading")
QR_STAGED = os.path.join(REPO, "tools", "quick-revision-build", "staged")

LETTERS = "abcd"

# staged paper name -> (output stem, exam line, paper label, date, series)
WANTED = {
    "Assistant UDC under MPSC paper-II.": (
        "udc-asst-2024-p2",
        "Mizoram Public Service Commission — Combined Competitive Examination for "
        "recruitment to the posts of Assistant Grade & Upper Division Clerk under "
        "Mizoram Public Service Commission, Government of Mizoram. (April, 2024)",
        "Paper-II (Computer Knowledge, Arithmetic, Reasoning)",
        "April 2024", None),
}


def load_keys():
    """
    (paper name, question number) -> letter.

    Keyed by PAPER as well as number. The key file is a bare {"1": "A", ...}
    map, so a number-only lookup matches every paper's q1..q100 -- an earlier
    version reported "100 answered" for LDC Paper-II using Assistant Paper-II's
    key, and only an unrelated allow-list stopped those answers being written
    into the wrong paper. Same family as joining on a basename instead of a
    path: the failure is silent and looks like success.
    """
    out = {}
    for fn in sorted(os.listdir(GRADING)) if os.path.isdir(GRADING) else []:
        if not fn.startswith("key_") or not fn.endswith(".json"):
            continue
        d = json.load(open(os.path.join(GRADING, fn)))
        for qnum, letter in d["answers"].items():
            out[(d["paper"], int(qnum))] = letter
    return out


def main():
    keys = load_keys()
    by_paper = {}
    for fn in sorted(os.listdir(STAGED)):
        if fn.endswith(".json"):
            j = json.load(open(os.path.join(STAGED, fn), encoding="utf-8"))
            by_paper[j["paper"]] = j

    written, skipped = [], []
    for name, d in by_paper.items():
        spec = WANTED.get(name)
        answered = sum(1 for q in d["questions"] if keys.get((name, q["qnum"])))
        if spec is None or answered == 0:
            skipped.append((name, d["parsedMcq"], answered))
            continue

        stem, exam, paper, date, series = spec
        questions = []
        for q in d["questions"]:
            opts = q.get("options") or []
            letter = keys.get((name, q["qnum"]))
            if len(opts) != 4 or not letter:
                # A question with no readable options (its printed choices are
                # figures the scan lost) cannot be revised or scored. Drop it
                # here rather than emit a drill item with nothing to reveal.
                continue
            note = None
            if q.get("printedOptionLabels"):
                note = ("The paper prints its fourth option as (c) rather than (d). "
                        "Kept as printed.")
            elif q.get("textSource") == "vision":
                note = "Text read from the page image — OCR could not recover it."
            questions.append({
                "n": q["qnum"],
                "q": q["stem"],
                "options": {LETTERS[i]: o for i, o in enumerate(opts)},
                "answer": letter.lower(),
                "keyAnswer": None,
                "note": note,
                "passage": None,
            })

        out = {
            "exam": exam,
            "paper": paper,
            "date": date,
            "totalQuestionsStated": d["expectedMcq"],
            "totalQuestionsStatedNote":
                "The syllabus sets this paper at %d MCQs (35 Computer Knowledge, "
                "30 Simple Arithmetic, 35 General Intelligence & Reasoning); the "
                "parse matched that count exactly." % d["expectedMcq"],
            "questions": questions,
        }
        if series:
            out["series"] = series
        path = os.path.join(QR_STAGED, stem + ".json")
        json.dump(out, open(path, "w"), indent=1, ensure_ascii=False)
        written.append((stem, len(questions), d["expectedMcq"]))

    for stem, n, expected in written:
        print("wrote staged/%s.json — %d of %d questions" % (stem, n, expected))
    print()
    print("skipped (no answers — cannot drive a reveal-or-score drill):")
    for name, total, answered in skipped:
        print("  %-42s %3d questions, %d answered" % (name[:42], total, answered))


if __name__ == "__main__":
    main()
