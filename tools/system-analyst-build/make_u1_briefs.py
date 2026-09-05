#!/usr/bin/env python3
"""Build the per-leaf authoring briefs for the TECH2 Unit 1 (OOP) depth pass.

    python3 tools/system-analyst-build/make_u1_briefs.py

Unit 1 is 40 marks of Technical Paper II across 7 syllabus leaves, and the bank
holds only 16 questions on it — unevenly, at 4/1/3/1/1/3/3 per leaf, so three
leaves sit at a single question each. Unit 4 is also 40 marks across 7 leaves
and was just taken to 12 per leaf; this brings Unit 1 to the same depth. Need
per leaf is therefore 12 minus what already exists: 68 new in total.

SOURCE OF TRUTH. `verbatim_syllabus` below is the Unit 1 paragraph as it is
actually printed in MPSC's notification (File No. A-12038/68/2025-ICT,
`~/workspace/projects/personal/syllabusex.pdf`, sha256 `8b6619681c078ea3bbd4…`,
re-verified before this run), extracted with pdftotext rather than retyped.
Its text layer has OCR damage in load-bearing places, so the damaged tokens are
listed for the authors instead of being silently corrected — an author who is
told `Polymoxphism` is the printed form of Polymorphism can write against the
syllabus; one who is left to guess may decide the word means something else.

The syllabus wording is unambiguously C++ (operator overloading, virtual
functions, pointers to object, I/O streams, file handling), and the 16 existing
questions are C++ too, so the briefs say so rather than leaving language to
chance — a Java-flavoured answer to an operator-overloading question would be
wrong for this paper.

EXISTING STEMS. Every brief carries all 16 current Unit 1 stems, not just those
on its own leaf, because the commonest duplication failure is two adjacent
leaves both landing on the same fact from opposite sides (which is exactly how
GEN-T2U4-006 duplicated GEN-T2U4-014 in the U2/U4 pass — they sat under
different sub-topic tags, so neither author could see the other's work).
"""

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "tools/system-analyst-build/staged/tech2-u1-gen"
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
SYLLABUS = ROOT / "tools/system-analyst-build/staged/pe2018-p3/_syllabus-2026.json"

TARGET_PER_LEAF = 12

# Extracted with `pdftotext syllabusex.pdf` (page holding "TECHNICAL SUBJECT
# PAPER-II"), reflowed to one paragraph. Not retyped, not corrected.
VERBATIM = (
    "Introduction of OOP; application of OOP; process of OOP; Classes and Objects; "
    "Overview of Classes and Objects; Class definition; class specifiers; defining "
    "member functions; Memory allocation for objects; array of objects; constructor; "
    "destructor; Polymoxphism; Function of Overloading; uses in program; operator "
    "overloading; defining operator overloading; limitations of operator overloading; "
    "overloading unary and binary operators; Inheritance and its types with examples; "
    "virtual functions; pointers to object; pure Virtual Functions and its "
    "implementation in program; managing I/0 operations; I/0 streams; File handling "
    "with OOP; Error handling in file operations; random file access; exception "
    "handling methods; throwing mechanism; catching mechanism; string characteristics "
    "and uses;"
)

OCR_NOTES = [
    "'Polymoxphism' is the printed form of 'Polymorphism' — OCR damage, not a term.",
    "'I/0 operations' and 'I/0 streams' use a digit zero; read them as I/O.",
    "'Function of Overloading' is the printed form of 'Function Overloading'.",
    "The page heading prints 'THCHNICAL SUBJHCT PAPER-II'; the same substitution "
    "of H for E appears elsewhere on the page and is scanner noise.",
]

LANGUAGE_NOTE = (
    "Write in C++ unless a question is genuinely language-neutral. The syllabus is "
    "explicitly C++ (operator overloading, virtual functions, pointers to object, "
    "I/O streams, file handling with OOP), and all 16 existing Unit 1 questions are "
    "C++. Do not write a question whose answer would differ in Java or Python "
    "without the stem naming the language."
)


def main():
    syl = json.loads(SYLLABUS.read_text())["TECH2"]["1"]
    leaves = syl["subtopics"]

    src = BANK.read_text()
    bank = json.loads(src[src.index("["):src.rindex("]") + 1])
    u1 = [q for q in bank if q.get("paper") == "TECH2" and str(q.get("unit")) == "1"]

    have = Counter(q["sub"] for q in u1)
    existing_stems = [
        {
            "leaf": q.get("sub"),
            "q": q["q"],
            "ans_text": (q.get("opts") or {}).get(q.get("ans"), ""),
            "src": q.get("src"),
        }
        for q in u1
    ]

    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for i, leaf in enumerate(leaves, 1):
        need = TARGET_PER_LEAF - have.get(leaf, 0)
        if need <= 0:
            print("L%02d already at %d — skipped" % (i, have.get(leaf, 0)))
            continue
        slug = "U1-L%02d" % i
        brief = {
            "slug": slug,
            "unit": "1",
            "unit_title": syl.get("title", "Object Oriented Programming"),
            "marks": syl.get("marks", 40),
            "leaf": leaf,
            "need": need,
            "already_on_this_leaf": have.get(leaf, 0),
            "target_per_leaf": TARGET_PER_LEAF,
            "language": LANGUAGE_NOTE,
            "verbatim_syllabus": VERBATIM,
            "verbatim_syllabus_ocr_notes": OCR_NOTES,
            "existing_stems": existing_stems,
        }
        (OUT / ("%s.brief.json" % slug)).write_text(
            json.dumps(brief, indent=1, ensure_ascii=False) + "\n")
        total += need
        print("%s  need %2d  (have %d)  %s" % (slug, need, have.get(leaf, 0), leaf))

    print("\n%d briefs, %d questions to author" % (len(leaves), total))
    print("bank Unit 1: %d -> %d" % (len(u1), len(u1) + total))


if __name__ == "__main__":
    main()
