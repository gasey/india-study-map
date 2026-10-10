"""Adapter for the MIMER 2018 Computer Operator Technical Paper I.

The source extraction and blind solutions live in the System Manager build.
This adapter preserves that provenance while exposing the Group B bank's
``(papers, questions, meta, library)`` input contract. No answers are official.
"""

import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PAPER_ID = "mpsc-group-b-mimer-computer-operator-2018-p1"
SOURCE_PDF = ROOT / "tools" / "system-manager-build" / "sources" / "mimer-2018-computer-operator-technical-paper-i.pdf"
EXTRACTED = ROOT / "tools" / "system-manager-build" / "extracted" / "CO2018M-P1.json"
SOLVED = ROOT / "tools" / "system-manager-build" / "staged" / "solved.json"
CORRECTIONS = ROOT / "tools" / "system-manager-build" / "staged" / "audit_corrections.json"
PUBLIC_PDF = ROOT / "public" / "papers" / "group-b" / "mimer-computer-operator-2018-p1.pdf"
EXPECTED_SHA256 = "77c20d338d31decfcf18545c5507f9c66b113e3905547123dfe56e979b714477"


def build_computer_paper():
    """Return the MIMER paper in the Group B supplemental-bank schema."""
    digest = hashlib.sha256(SOURCE_PDF.read_bytes()).hexdigest()
    assert digest == EXPECTED_SHA256, f"Unexpected MIMER Computer Operator source PDF hash: {digest}"

    extracted = json.loads(EXTRACTED.read_text(encoding="utf-8"))
    assert len(extracted) == 75, f"Expected 75 source rows, found {len(extracted)}"
    assert [row["no"] for row in extracted] == list(range(1, 76)), "Question numbers must be contiguous 1-75"

    all_solutions = json.loads(SOLVED.read_text(encoding="utf-8"))
    solutions = {f"CO2018M-P1-{n}": all_solutions.get(f"CO2018M-P1-{n}") for n in range(1, 76)}
    assert all(value for value in solutions.values()), "Missing a staged dual-solve result"

    # The audit log is authoritative only when it still points at the exact
    # answer it reviewed. A stale correction must stop this import.
    corrections = json.loads(CORRECTIONS.read_text(encoding="utf-8"))
    for correction in corrections:
        if correction.get("app") != "system-manager" or not correction.get("id", "").startswith("CO2018M-P1-"):
            continue
        solved = solutions.get(correction["id"])
        assert solved is not None, f"Orphan MIMER correction: {correction['id']}"
        if correction.get("action") == "set_answer":
            assert solved.get("ans") == correction.get("old_ans"), (
                f"Stale answer correction for {correction['id']}: "
                f"expected {correction.get('old_ans')}, found {solved.get('ans')}"
            )
            solved["ans"] = correction["ans"]
            solved["exp"] = correction.get("exp", solved.get("exp", ""))
            solved["conf"] = correction.get("conf", solved.get("conf", "medium"))
            solved["agreement"] = "audited-correction"
            solved["auditNote"] = correction.get("note", "Answer corrected by the System Manager audit.")
        elif correction.get("action") == "set_explanation":
            solved["exp"] = correction["exp"]
        else:
            raise AssertionError(f"Unsupported MIMER correction: {correction['action']}")

    shutil.copy2(SOURCE_PDF, PUBLIC_PDF)
    source_href = "/papers/group-b/mimer-computer-operator-2018-p1.pdf"
    exam = "Computer Operator under MIMER"
    sitting = "February 2018"
    papers = [{
        "id": PAPER_ID,
        "examType": "Direct",
        "examName": exam,
        "post": exam,
        "paperNumber": "Technical Paper I",
        "paperSubject": "Computer Knowledge (Technical Paper I)",
        "year": 2018,
        "sourceFile": source_href,
    }]
    meta = {PAPER_ID: {
        "marksPerQuestion": 2,
        "durationMinutes": 120,
        # The cover states the duration and marks, but says nothing about
        # negative marking. False is the existing runtime's neutral value;
        # markingNote preserves the source's actual level of certainty.
        "negativeMarking": False,
        "penaltyFraction": 0,
    }}
    library = [{
        "id": PAPER_ID,
        "exam": exam,
        "sitting": sitting,
        "subject": "Computer Knowledge (Technical Paper I)",
        "sourceHref": source_href,
        "keyHref": None,
        "imported": True,
        "reviewRequired": True,
        "expectedMcq": 75,
        "sourceSha256": digest,
    }]

    questions = []
    for row in extracted:
        number = row["no"]
        sid = f"CO2018M-P1-{number}"
        solved = solutions[sid]
        answer = solved.get("ans")
        assert answer is None or answer in tuple("ABCD"), f"Invalid derived answer for {sid}: {answer!r}"
        assert solved.get("conf") in ('high', 'medium', 'low'), f"Missing confidence for {sid}"
        assert solved.get('exp', '').strip(), f"Missing explanation for {sid}"
        assert set(row["opts"]) == set("ABCD"), f"Expected A-D options for {sid}"
        assert row['q'].strip() and row['page'] > 0 and all(value.strip() for value in row['opts'].values()), f"Incomplete source row for {sid}"

        held_reasons = []
        if solved.get("conf") == "low":
            held_reasons.append("low-confidence solution")
        if solved.get("agreement") == "disagree":
            held_reasons.append("independent solvers disagree")
        if not answer:
            held_reasons.append("missing answer")
        if row.get("needs_figure"):
            held_reasons.append("depends on a figure not represented in this text import")
        held = bool(held_reasons)
        opts = [row["opts"][letter] for letter in "ABCD"]
        item = {
            "id": f"{PAPER_ID}-q{number}",
            "questionNumber": str(number),
            "paperId": PAPER_ID,
            "subject": "computer",
            "studySection": "computer",
            "topic": "computer-fundamentals",
            "topicLabel": "Computer Knowledge · Technical Paper I",
            "difficulty": "medium",
            "question": row["q"],
            "options": opts,
            "answerIndex": -1 if held else "ABCD".index(answer),
            "answerSource": "derived",
            "answerConfidence": solved.get("conf") or "low",
            "explanation": solved.get("exp") or "",
            "year": 2018,
            "source": f"{exam} · {sitting} · Technical Paper I Q{number}",
            "sourceHref": source_href + '#page=' + str(row['page']),
            "sourceNote": "Text-layer transcription of the source paper; solution reused from the System Manager independent solve passes. No verified official key is attached. The printed cover does not state a negative-marking rule.",
            # The entire source paper is excluded from mock-paper assembly;
            # these fields also keep each row safe if a consumer ignores that.
            "paperExamExcluded": True,
        }
        if held:
            item.update({
                "sourceReview": True,
                "sourceNote": "; ".join(held_reasons) + ". Candidate retained for review; not scored.",
            })
            if answer:
                item["independentAnswerIndex"] = "ABCD".index(answer)
                item["independentAnswerSource"] = "solved"
        if solved.get("alt_ans") and solved.get("alt_ans") in tuple("ABCD"):
            item["disputeNote"] = (
                f"Independent blind solutions disagree: this explanation selects {answer}; "
                f"the second solve selected {solved['alt_ans']}. No verified official key is attached."
            )
        if solved.get("auditNote"):
            item["sourceNote"] += ' ' + solved["auditNote"]
        questions.append(item)

    assert len(questions) == 75
    held = [q for q in questions if q.get("sourceReview")]
    for question in questions:
        question['paperExamExcluded'] = bool(held)
    library[0]['reviewRequired'] = bool(held)
    assert all(q["answerIndex"] == -1 for q in held)
    assert all(q["answerSource"] == "derived" for q in questions), "MIMER has no official answer key"
    return papers, questions, meta, library
