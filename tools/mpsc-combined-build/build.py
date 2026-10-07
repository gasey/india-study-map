"""Build the Combined Prelims module from the local MPSC archive.

Run from anywhere: python3 tools/mpsc-combined-build/build.py
The sibling mpsc-question-bank checkout supplies the immutable source PDFs,
parsed questions, and independently parsed final answer keys.
"""
from __future__ import annotations

import json
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT.parent / "mpsc-question-bank"
OUT = ROOT / "src/data/banks/mpsc-combined-prelims.json"
PUBLIC = ROOT / "public/papers/mpsc-combined-prelims"
SELECT = {
    (2023, "I", "A"), (2023, "I", "B"), (2023, "I", "D"),
    (2023, "II", "A"), (2023, "II", "B"), (2023, "II", "D"),
    (2025, "I", "A"), (2025, "I", "B"), (2025, "I", "C"),
    (2025, "II", "A"), (2025, "II", "D"),
}
NAME = re.compile(r"MCS Combined (2023|2025) Preliminary Exam Paper[- ]?(I|II) Series[ -]?'?([A-D])", re.I)


def main() -> None:
    bank = json.loads((ARCHIVE / "bank/mpsc_bank_v2.json").read_text())
    keys = json.loads((ARCHIVE / "state/answer_keys_parsed.json").read_text())
    by_paper = defaultdict(list)
    for question in bank["questions"]:
        by_paper[question["paperId"]].append(question)

    papers = []
    questions = []
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for source in bank["papers"]:
        match = NAME.search(source["id"])
        if not match:
            continue
        year, number, series = match.groups()
        year = int(year)
        number, series = number.upper(), series.upper()
        if (year, number, series) not in SELECT:
            continue
        rows = sorted(by_paper[source["id"]], key=lambda item: item["qnum"])
        assert len({row["qnum"] for row in rows}) == len(rows), source["id"]
        pid = f"mcs-{year}-{number.lower()}-{series.lower()}"
        filename = f"{pid}.pdf"
        pdf = ARCHIVE / "pdfs" / source["id"]
        if not pdf.is_file():
            raise FileNotFoundError(pdf)
        shutil.copyfile(pdf, PUBLIC / filename)
        final = next((key for key in keys if year == 2023
                      and key["status"] == "final"
                      and f"2023 Preliminary Exam Final Answer Key Paper-{number} Series" in key["file"]
                      and f"'{series}'" in key["file"]), None)
        answers = final["sections"][0]["answers"] if final else {}
        if final:
            assert final["sections"][0]["quality"] == "near-clean"
            key_file = f"{pid}-final-key.pdf"
            shutil.copyfile(ARCHIVE / "pdfs/Answer_Keys" / final["file"], PUBLIC / key_file)
        else:
            key_file = None

        seen = {row["qnum"] for row in rows}
        missing = [n for n in range(1, 101) if n not in seen]
        counts = Counter()
        for row in rows:
            options = [str(value).strip() for value in row.get("options", [])]
            answer = answers.get(str(row["qnum"]))
            # The final key is the only answer authority in this module.
            # A diagram without an extracted image is visible via its PDF,
            # but cannot be safely scored from the text alone.
            valid = len(options) == 4 and len(set(options)) == 4 and all(options)
            figure = bool(row.get("hasDiagram"))
            index = "ABCD".find(answer) if answer else -1
            # Paper-II contains reading passages whose context is absent from
            # the legacy bank's `passage` field. Keep its official answers for
            # reference, but never score an isolated stem as a complete item.
            scoreable = bool(answer and index >= 0 and valid and not figure and number == "I")
            counts["scoreable" if scoreable else "review"] += 1
            questions.append({
                "id": f"{pid}-q{row['qnum']:03d}", "paperId": pid,
                "number": row["qnum"], "page": row.get("page"),
                "text": row["question"].strip(), "options": options,
                "passage": row.get("passage") or None,
                "hasDiagram": figure, "answerIndex": index if answer and index >= 0 else -1,
                "answerSource": "official-final" if answer and index >= 0 else None,
                "scoreable": scoreable,
                "reviewReason": (
                    "Diagram or table needs the source PDF" if figure else
                    "Options need review against the PDF" if not valid else
                    "Paper II needs passage and layout verification against the PDF" if number == "II" and final else
                    "No answer in the parsed final key" if final and not answer else
                    "Final key not parsed for this sitting" if not final else None
                ) if not scoreable else None,
            })
        papers.append({
            "id": pid, "year": year, "paper": number, "series": series,
            "expectedCount": 100, "parsedCount": len(rows), "missingNumbers": missing,
            "scoreableCount": counts["scoreable"], "reviewCount": counts["review"],
            "sourceHref": f"/papers/mpsc-combined-prelims/{filename}",
            "answerKeyHref": f"/papers/mpsc-combined-prelims/{key_file}" if key_file else None,
        })

    assert len(papers) == len(SELECT), f"Expected {len(SELECT)} papers, found {len(papers)}"
    papers.sort(key=lambda p: (-p["year"], p["paper"], p["series"]))
    questions.sort(key=lambda q: (next(i for i, p in enumerate(papers) if p["id"] == q["paperId"]), q["number"]))
    OUT.write_text(json.dumps({"schemaVersion": 1, "papers": papers, "questions": questions}, ensure_ascii=False, indent=2) + "\n")
    print(f"Built {len(papers)} papers, {len(questions)} questions, {sum(p['scoreableCount'] for p in papers)} with final-key answers")
    for p in papers:
        print(f"  {p['year']} {p['paper']}-{p['series']}: {p['parsedCount']}/100 parsed, {p['scoreableCount']} scoreable")


if __name__ == "__main__":
    main()
