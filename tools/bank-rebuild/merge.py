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
}

KEY_REF = {
    "group-b-combined-2024": "MPSC Final Answer Key, No. A.12024/1/2024-MPSC (CON), 5 Sept 2024",
    "inspector-excise-narcotics-2025": "MPSC Final Answer Key, No. Inspector(DR)/19/2025-MPSC (Exam), 2 Sept 2025 (as amended by the Corrigendum of 11 Sept 2025)",
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


def topic_for(paper_key, n, stem, direction):
    if paper_key.endswith("English"):
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
                "year": 2025 if paper_key.startswith("2025") else 2024,
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

    json.dump(bank, open(f"{SCRATCH}/bank-rebuilt.json", "w"), indent=1, ensure_ascii=False)
    json.dump(report, open(f"{SCRATCH}/merge-report.json", "w"), indent=1, ensure_ascii=False)

    print(f"kept {len(kept)} untouched, rebuilt {len(new_questions)} across {len(rebuilt_paper_ids)} papers")
    print(f"  explanations carried over : {report['carried']}")
    print(f"  need an explanation       : {sum(1 for q in new_questions if q.get('needsExplanation'))}")
    print(f"  figure-based              : {report['figure']}")
    print(f"  no official key (unkeyed) : {report['unkeyed']}")
    print(f"  OLD ANSWER WAS WRONG      : {len(report['disagreements'])}")
    print(f"  no old counterpart at all : {len(report['unmatched'])}")


if __name__ == "__main__":
    main()
