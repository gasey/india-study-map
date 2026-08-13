#!/usr/bin/env python3
"""
Rebuild the 2024 + 2025 sittings of the mpsc-state-tax-officer bank from
ground truth:
  * question text/options  -> re-extracted from the source PDFs
  * answerIndex            -> the published MPSC final answer keys

Existing bank records for these papers were produced by an OCR pipeline that
mis-split multi-column pages, so they are replaced wholesale rather than
patched. Anything worth keeping from the old records (a hand-written
explanation, a topic tag) is carried across by matching on question text.

Writes a report of every disagreement between the old bank's answer and the
official key -- those are the questions that were being taught wrong.
"""
import json
import os
HERE = os.path.dirname(os.path.abspath(__file__))
import re
import unicodedata
from difflib import SequenceMatcher

SCRATCH = HERE

# paper key -> (bank paperId, answer-key section name, key bundle name)
PAPERS = {
    "2025:English": ("mpsc-inspector-of-excise-&-narcotics-2025-english", "English-Section-B", "inspector-excise-narcotics-2025"),
    "2025:GS-I":    ("mpsc-inspector-of-excise-&-narcotics-2025-gs-i",    "GS-I",              "inspector-excise-narcotics-2025"),
    "2025:GS-II":   ("mpsc-inspector-of-excise-&-narcotics-2025-gs-ii",   "GS-II",             "inspector-excise-narcotics-2025"),
    "2025:GS-III":  ("mpsc-inspector-of-excise-&-narcotics-2025-gs-iii",  "GS-III",            "inspector-excise-narcotics-2025"),
    "2024:GS-I":    ("mpsc-group-b-combined-(state-tax-officer-/-cooperative-audit-officer)-2024-gs-i",   "GS-I",   "group-b-combined-2024"),
    "2024:GS-II":   ("mpsc-group-b-combined-(state-tax-officer-/-cooperative-audit-officer)-2024-gs-ii",  "GS-II",  "group-b-combined-2024"),
    "2024:GS-III":  ("mpsc-group-b-combined-(state-tax-officer-/-cooperative-audit-officer)-2024-gs-iii", "GS-III", "group-b-combined-2024"),
    # 2024 English has no published key section -- handled as unkeyed below.
    "2024:English": ("mpsc-group-b-combined-(state-tax-officer-/-cooperative-audit-officer)-2024-english", None, None),
    "CAO2022:English-II": ("mpsc-cooperative-audit-officer-2022-english-ii", "English-II", "cao-2022"),
    "CAO2022:GS-I":        ("mpsc-cooperative-audit-officer-2022-gs-i",       "GS-I",       "cao-2022"),
    "CAO2022:GS-II":       ("mpsc-cooperative-audit-officer-2022-gs-ii",      "GS-II",      "cao-2022"),
    "CAO2022:GS-III":      ("mpsc-cooperative-audit-officer-2022-gs-iii",     "GS-III",     "cao-2022"),
    "CAO2026:GS-I":        ("mpsc-cooperative-audit-officer-2026-gs-i",       "GS-I",       "cao-2026"),
    "CAO2026:GS-II":       ("mpsc-cooperative-audit-officer-2026-gs-ii",      "GS-II",      "cao-2026"),
    "CAO2026:GS-III":      ("mpsc-cooperative-audit-officer-2026-gs-iii",     "GS-III",     "cao-2026"),
}

# New ExamPaper entries for sittings that never had a prior bank record at
# all. Neither this script nor merge_native.py otherwise ever adds to
# bank["papers"] -- that array is just carried through unchanged from
# bank.json -- so a genuinely new sitting must inject its own entries here.
NEW_PAPERS = [
    {
        "id": "mpsc-cooperative-audit-officer-2022-english-ii",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "II", "paperSubject": "English-II", "year": 2022,
        "sourceFile": "Old_Questions/Direct_2022-2023/General English Paper-II (CAO).pdf",
    },
    {
        "id": "mpsc-cooperative-audit-officer-2022-gs-i",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "I", "paperSubject": "GS-I", "year": 2022,
        "sourceFile": "Old_Questions/Direct_2022-2023/General Studies Paper-I (CAO).pdf",
    },
    {
        "id": "mpsc-cooperative-audit-officer-2022-gs-ii",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "II", "paperSubject": "GS-II", "year": 2022,
        "sourceFile": "Old_Questions/Direct_2022-2023/General Studies Paper-II (CAO).pdf",
    },
    {
        "id": "mpsc-cooperative-audit-officer-2022-gs-iii",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "III", "paperSubject": "GS-III", "year": 2022,
        "sourceFile": "Old_Questions/Direct_2022-2023/General Studies Paper-III (CAO).pdf",
    },
    # CAO-2026's English/Essay papers are descriptive (precis/letter/comprehension),
    # not MCQ, so only the 3 GS papers are represented here.
    {
        "id": "mpsc-cooperative-audit-officer-2026-gs-i",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "I", "paperSubject": "GS-I", "year": 2026,
        "sourceFile": "Old_Questions/Direct_2025-2027/CAO March-2026 General Studies Paper-I (Series A)..pdf",
    },
    {
        "id": "mpsc-cooperative-audit-officer-2026-gs-ii",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "II", "paperSubject": "GS-II", "year": 2026,
        "sourceFile": "Old_Questions/Direct_2025-2027/CAO March-2026 General Studies -II- Series-A..pdf",
    },
    {
        "id": "mpsc-cooperative-audit-officer-2026-gs-iii",
        "examType": "Direct", "examName": "Cooperative Audit Officer",
        "paperNumber": "III", "paperSubject": "GS-III", "year": 2026,
        "sourceFile": "Old_Questions/Direct_2025-2027/CAO March-2026 General Studies- III Series A..pdf",
    },
]

KEY_REF = {
    "group-b-combined-2024": "MPSC Final Answer Key, No. A.12024/1/2024-MPSC (CON), 5 Sept 2024",
    "inspector-excise-narcotics-2025": "MPSC Final Answer Key, No. Inspector(DR)/19/2025-MPSC (Exam), 2 Sept 2025 (as amended by the Corrigendum of 11 Sept 2025)",
    "cao-2022": "MPSC Final Answer Key of Grade V of MSCS (Cooperative Audit Officer) under Cooperation Department, Dec 2022",
    "cao-2026": "MPSC Final Answer Key of Cooperative Audit Officer (CAO) under Cooperation Department, held 23-25 March 2026",
}

# Which topic bucket each paper's questions fall into, by question number.
# Derived from the actual papers, not guessed: verified against the section
# headings and the run of subject matter in each.
TOPIC_RANGES = {
    "2025:GS-I":   [(1, 25, "gs1_history"), (26, 50, "gs1_current")],
    "2025:GS-II":  [(1, 20, "gs2_polity"), (21, 38, "gs2_economy"), (39, 50, "gs2_geography")],
    "2025:GS-III": [(1, 20, "gs3_mizoram"), (21, 40, "gs3_scitech"), (41, 50, "gs3_aptitude")],
    "2024:GS-I":   [(1, 25, "gs1_history"), (26, 50, "gs1_current")],
    "2024:GS-II":  [(1, 20, "gs2_polity"), (21, 38, "gs2_economy"), (39, 50, "gs2_geography")],
    "2024:GS-III": [(1, 20, "gs3_mizoram"), (21, 40, "gs3_scitech"), (41, 50, "gs3_aptitude")],
    # CAO-2022 boundaries were found by sampling the actual PDF at each
    # transition (see PLAN/DEVLOG), not assumed from the 2024/2025 papers'
    # proportions -- GS-III in particular orders SciTech BEFORE Mizoram,
    # the reverse of the other sittings.
    "CAO2022:GS-I":   [(1, 50, "gs1_history"), (51, 100, "gs1_current")],
    "CAO2022:GS-II":  [(1, 37, "gs2_polity"), (38, 75, "gs2_economy"), (76, 100, "gs2_geography")],
    "CAO2022:GS-III": [(1, 38, "gs3_scitech"), (39, 77, "gs3_mizoram"), (78, 100, "gs3_aptitude")],
    # CAO-2026 boundaries, likewise found by sampling the actual PDF.
    "CAO2026:GS-I":   [(1, 50, "gs1_history"), (51, 100, "gs1_current")],
    "CAO2026:GS-II":  [(1, 41, "gs2_polity"), (42, 89, "gs2_economy"), (90, 100, "gs2_geography")],
    "CAO2026:GS-III": [(1, 41, "gs3_scitech"), (42, 81, "gs3_mizoram"), (82, 100, "gs3_aptitude")],
}

TOPIC_LABELS = {
    "gs1_history": "Modern Indian History",
    "gs1_current": "Current Affairs",
    "gs2_polity": "Indian Polity & Governance",
    "gs2_economy": "Indian Economy",
    "gs2_geography": "Geography",
    "gs3_mizoram": "Mizoram GK",
    "gs3_scitech": "Science & Technology",
    "gs3_aptitude": "Reasoning & Aptitude",
    "eng_grammar": "English Grammar",
    "eng_vocab": "English Vocabulary",
    "eng_sentence": "Sentence Correction & Usage",
    "eng_comprehension": "Reading Comprehension",
}

SUBJECT_OF_TOPIC = {
    "gs1_history": "history", "gs1_current": "current-affairs",
    "gs2_polity": "polity", "gs2_economy": "economics", "gs2_geography": "geography",
    "gs3_mizoram": "gk", "gs3_scitech": "science", "gs3_aptitude": "reasoning",
    "eng_grammar": "english", "eng_vocab": "english",
    "eng_sentence": "english", "eng_comprehension": "english",
}


def norm(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9 ]", " ", re.sub(r"\s+", " ", s.lower())).strip()


def english_topic(stem, direction):
    """Classify an English MCQ from its own Direction header where possible."""
    d = (direction or "").lower()
    if "part" in d and "speech" in d:
        return "eng_grammar"
    if "preposition" in d:
        return "eng_grammar"
    if "synonym" in d or "antonym" in d or "meaning" in d or "one word" in d:
        return "eng_vocab"
    if "correct word" in d or "complete the sentence" in d or "phrase" in d:
        return "eng_sentence"
    if "passage" in d or "comprehension" in d:
        return "eng_comprehension"
    return "eng_sentence"


def year_of(paper_key):
    """Extract the sitting year from a paper_key prefix: '2025:GS-I' -> 2025,
    'CAO2022:GS-I' -> 2022. Generic so new prefixes don't need a new branch."""
    m = re.search(r"(\d{4})$", paper_key.split(":")[0])
    return int(m.group(1)) if m else None


def topic_for(paper_key, n, stem, direction):
    if "English" in paper_key:
        return english_topic(stem, direction)
    for lo, hi, t in TOPIC_RANGES.get(paper_key, []):
        if lo <= n <= hi:
            return t
    return "other"


def load_parsed():
    """Return {paper_key: [parsed question, ...]}."""
    out = {}
    for name, qs in json.load(open(f"{SCRATCH}/parsed-2025.json")).items():
        out[f"2025:{name}"] = qs
    for name in ("GS-I", "GS-II", "GS-III", "English"):
        try:
            out[f"2024:{name}"] = json.load(open(f"{SCRATCH}/parsed-2024-{name}.json"))
        except FileNotFoundError:
            print(f"  (skipping 2024:{name} -- not transcribed yet)")
    try:
        out.update(json.load(open(f"{SCRATCH}/parsed-cao-2022.json")))
    except FileNotFoundError:
        print("  (skipping CAO2022:* -- parsed-cao-2022.json not found)")
    try:
        out.update(json.load(open(f"{SCRATCH}/parsed-cao-2026.json")))
    except FileNotFoundError:
        print("  (skipping CAO2026:* -- parsed-cao-2026.json not found)")
    try:
        out.update(json.load(open(f"{SCRATCH}/parsed-supplies-2024.json")))
    except FileNotFoundError:
        print("  (skipping Supplies2024:* -- parsed-supplies-2024.json not found)")
    try:
        out.update(json.load(open(f"{SCRATCH}/parsed-lecturer-vse-2025.json")))
    except FileNotFoundError:
        print("  (skipping LecturerVSE2025:* -- parsed-lecturer-vse-2025.json not found)")
    return out


def main():
    bank = json.load(open(f"{SCRATCH}/bank.json"))
    keys = json.load(open(f"{SCRATCH}/official-answer-keys.json"))
    parsed = load_parsed()

    old_by_paper = {}
    for q in bank["questions"]:
        old_by_paper.setdefault(q.get("paperId"), []).append(q)

    rebuilt_paper_ids = set()
    new_questions = []
    report = {"disagreements": [], "unmatched": [], "carried": 0, "figure": 0, "unkeyed": 0}

    for paper_key, qs in sorted(parsed.items()):
        paper_id, key_section, key_bundle = PAPERS[paper_key]
        rebuilt_paper_ids.add(paper_id)
        answers = keys[key_bundle][key_section].split() if key_section else None
        olds = old_by_paper.get(paper_id, [])

        for q in qs:
            n = q["n"]
            topic = topic_for(paper_key, n, q.get("stem", ""), q.get("direction"))
            rec = {
                "id": f"{paper_id}-q{n:03d}",
                "subject": SUBJECT_OF_TOPIC.get(topic, "gk"),
                "topic": topic,
                "topicLabel": TOPIC_LABELS.get(topic, "General"),
                "difficulty": "medium",
                "question": q.get("stem", ""),
                "options": q.get("options", []),
                "explanation": "",
                "source": "MPSC State Tax Officer / Group B Gazetted",
                "year": year_of(paper_key),
                "paperId": paper_id,
            }
            if q.get("direction"):
                rec["passage"] = q["direction"]
            if q.get("figureBased"):
                rec["figureBased"] = True
                report["figure"] += 1

            # --- answer ---
            if answers and n <= len(answers):
                a = answers[n - 1]
                if a.upper().startswith("COMPENSAT"):
                    # MPSC voided this question and awarded the mark to all
                    # candidates. There is no correct option.
                    rec["answerIndex"] = -1
                    rec["answerSource"] = "official"
                    rec["answerKeyRef"] = KEY_REF[key_bundle] + " — question COMPENSATED (mark awarded to all candidates)"
                    rec["compensated"] = True
                elif "&" in a:
                    # MPSC accepted more than one option as correct (e.g.
                    # "A&D") rather than voiding the question outright. The
                    # schema takes a single answerIndex, so the first listed
                    # letter is recorded as the shown answer and the
                    # disagreement is preserved in a disputeNote rather than
                    # silently dropped.
                    letters = a.replace(" ", "").split("&")
                    rec["answerIndex"] = "ABCD".index(letters[0].upper())
                    rec["answerSource"] = "official"
                    rec["answerKeyRef"] = KEY_REF[key_bundle]
                    rec["disputeNote"] = (
                        f"The official key accepted both ({'/'.join('abcd'['ABCD'.index(l.upper())] for l in letters)}) "
                        "as correct for this question."
                    )
                else:
                    rec["answerIndex"] = "ABCD".index(a.upper())
                    rec["answerSource"] = "official"
                    rec["answerKeyRef"] = KEY_REF[key_bundle]
            else:
                rec["answerIndex"] = 0
                rec["answerSource"] = "derived"
                rec["needsSolving"] = True
                report["unkeyed"] += 1

            # --- carry over anything salvageable from the old record ---
            best, score = None, 0.0
            nq = norm(rec["question"])
            if nq:
                for o in olds:
                    s = SequenceMatcher(None, nq, norm(o.get("question", ""))).ratio()
                    if s > score:
                        best, score = o, s
            if best and score >= 0.75:
                if best.get("explanation"):
                    rec["explanation"] = best["explanation"]
                    report["carried"] += 1
                if best.get("tags"):
                    rec["tags"] = best["tags"]
                old_ans = best.get("answerIndex")
                if (rec.get("answerSource") == "official" and not rec.get("compensated")
                        and isinstance(old_ans, int) and 0 <= old_ans <= 3
                        and old_ans != rec["answerIndex"]):
                    report["disagreements"].append({
                        "id": rec["id"],
                        "question": rec["question"][:100],
                        "oldAnswer": best.get("options", [None] * 4)[old_ans] if old_ans < len(best.get("options", [])) else None,
                        "officialAnswer": rec["options"][rec["answerIndex"]] if rec["answerIndex"] < len(rec["options"]) else "(figure)",
                        "match": round(score, 2),
                    })
                    # The carried explanation argues for the OLD answer, so it
                    # is now actively misleading. Drop it.
                    rec["explanation"] = ""
                    rec["needsExplanation"] = True
            else:
                report["unmatched"].append(rec["id"])
                rec["needsExplanation"] = True

            if not rec["explanation"]:
                rec["needsExplanation"] = True
            new_questions.append(rec)

    kept = [q for q in bank["questions"] if q.get("paperId") not in rebuilt_paper_ids]
    bank["questions"] = kept + new_questions

    # Genuinely new sittings (no prior bank record at all) need their
    # ExamPaper entries injected -- idempotent, so re-running this script on
    # an already-rebuilt bank stays a no-op.
    existing_paper_ids = {p["id"] for p in bank.get("papers", [])}
    added_papers = [p for p in NEW_PAPERS if p["id"] not in existing_paper_ids]
    bank.setdefault("papers", []).extend(added_papers)

    json.dump(bank, open(f"{SCRATCH}/bank-rebuilt.json", "w"), indent=1, ensure_ascii=False)
    json.dump(report, open(f"{SCRATCH}/merge-report.json", "w"), indent=1, ensure_ascii=False)

    print(f"kept {len(kept)} untouched, rebuilt {len(new_questions)} across {len(rebuilt_paper_ids)} papers")
    print(f"  explanations carried over : {report['carried']}")
    print(f"  need an explanation       : {sum(1 for q in new_questions if q.get('needsExplanation'))}")
    print(f"  figure-based              : {report['figure']}")
    print(f"  no official key (unkeyed) : {report['unkeyed']}")
    print(f"  OLD ANSWER WAS WRONG      : {len(report['disagreements'])}")
    print(f"  no old counterpart at all : {len(report['unmatched'])}")
    print(f"  new ExamPaper entries added: {len(added_papers)}")


if __name__ == "__main__":
    main()
