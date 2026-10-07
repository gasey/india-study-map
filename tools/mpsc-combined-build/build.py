"""Build Combined Prelims data from every archived paper; never infer answers."""
from __future__ import annotations

import csv
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT.parent / "mpsc-question-bank"
OUT = ROOT / "src/data/banks/mpsc-combined-prelims.json"
QUEUE = ROOT / "tools/mpsc-combined-build/model-queue.jsonl"
DERIVED = ROOT / "tools/mpsc-combined-build/derived-answers.jsonl"
PUBLIC = ROOT / "public/papers/mpsc-combined-prelims"
YEARS = {2014, 2016, 2021, 2023, 2024, 2025}
OPTIONS = re.compile(r"\(([a-d])\)", re.I)
SUBJECTS = {
    "History": r"\bhistory|historical|dynasty|empire|revolt|century|freedom struggle|independence movement|ancient india|medieval india|colonial\b",
    "Polity": r"\bconstitution|parliament|legislative|fundamental rights|governor|president of india|supreme court|panchayat|article \d+|amendment|election commission\b",
    "Geography": r"\bgeograph|river|mountain|climate|latitude|longitude|monsoon|forest|soil|ocean|earthquake|district\b",
    "Economy": r"\beconom|inflation|budget|taxation|gdp|banking|reserve bank|fiscal|poverty|investment|monetary\b",
    "Science & Technology": r"\bscience|scientific|biology|physics|chemistry|cell|virus|disease|computer|technology|satellite|energy|chemical\b",
    "Mizoram": r"\bmizoram|mizo|aizawl|lunglei|champhai|serchhip|kolasib|lawngtlai|saiha\b",
    "Current Affairs": r"\bcurrent affairs|recently|202[0-9]|g20|summit|award|appointed|launched\b",
}
APTITUDE = {
    "Comprehension": r"\bpassage|according to the author|according to the passage|read the following",
    "English": r"\bsynonym|antonym|grammar|sentence|idiom|word|spelling|correct usage",
    "Mathematics": r"\bpercent|ratio|average|profit|loss|interest|distance|speed|equation|calculate|how many|fraction",
    "Reasoning": r"\bseries|analogy|pattern|logical|reasoning|arrangement|code|direction|odd one",
}


def identity(filename: str):
    if "cover" in filename.lower() or not re.match(r"(?:\d+\.)?MCS\s*\(?\s*Combined", filename, re.I):
        return None
    year_match = re.search(r"\b(20\d\d)\b", filename)
    paper_match = re.search(r"Paper[- ]?(II|I)(?!I)", filename, re.I)
    series_match = re.search(r"Series\s*[- ]*['\"]?([A-D])", filename, re.I)
    if not year_match or not paper_match or int(year_match.group(1)) not in YEARS:
        return None
    return int(year_match.group(1)), paper_match.group(1).upper(), series_match.group(1).upper() if series_match else "-"


def classify(text: str, paper: str):
    for label, pattern in (APTITUDE if paper == "II" else SUBJECTS).items():
        if re.search(pattern, text, re.I):
            return label, "auto-keyword"
    return ("General Aptitude" if paper == "II" else "General Studies"), "paper-fallback"


def ocr_rows(pdf: Path):
    sidecar = pdf.with_suffix(pdf.suffix + ".ocr.txt")
    if not sidecar.is_file():
        return []
    content = sidecar.read_text(errors="replace")
    # Tesseract often reads option brackets as braces or the letter d as 4.
    # These remain low-confidence OCR items and are never answer-key matched.
    content = re.sub(r"\{\s*([abcd])\s*[}\)]", lambda m: f"({m.group(1)})", content, flags=re.I)
    content = re.sub(r"\{\s*([abcd])y\b", lambda m: f"({m.group(1)})", content, flags=re.I)
    content = re.sub(r"\(\s*4\s*\)", "(d)", content)
    if "QUESTION BOOKLET" in content.split("\f", 1)[0].upper() and "\f" in content:
        content = content.split("\f", 1)[1]
    markers = list(OPTIONS.finditer(content))
    groups, i = [], 0
    while i < len(markers):
        if markers[i].group(1).lower() != "a":
            i += 1
            continue
        run, j = [markers[i]], i + 1
        while j < len(markers) and len(run) < 4 and markers[j].start() - run[-1].start() < 550:
            letter = markers[j].group(1).lower()
            if letter == "abcd"[len(run)]:
                run.append(markers[j])
            elif letter == "a":
                break
            j += 1
        if len(run) == 4:
            groups.append(run)
            i = j
        else:
            i += 1
    rows, previous_end = [], 0
    for run in groups:
        raw_stem = content[previous_end:run[0].start()]
        printed = re.findall(r"(?m)^\s*(\d{1,3})[.,)]\s+\S", raw_stem)
        printed_number = int(printed[-1]) if printed and 1 <= int(printed[-1]) <= 100 else None
        stem = re.sub(r"\s+", " ", raw_stem).strip(" .:-")[-2500:]
        line_end = content.find("\n", run[3].end())
        if line_end < 0:
            line_end = len(content)
        options = [re.sub(r"\s+", " ", content[run[k].end():run[k + 1].start() if k < 3 else line_end]).strip(" .:-") for k in range(4)]
        previous_end = line_end
        if len(stem) >= 8 and all(options):
            rows.append({"text": stem, "options": options, "page": None, "printedNumber": printed_number})
    return rows


def ocr_key_answers(key_file: Path, year: int, paper: str, series: str):
    """Read unambiguous answer cells from a scanned official final-key table."""
    sidecar = key_file.with_suffix(key_file.suffix + ".ocr.txt")
    if not sidecar.is_file() or series not in "ABCD":
        return {}
    pages = sidecar.read_text(errors="replace").split("\f")
    index = "ABCD".index(series) + (4 if year == 2025 and paper == "II" else 0)
    if index >= len(pages):
        return {}
    answers = {}
    in_table = False
    cell = re.compile(r"(?<!\d)(\d{1,3})\s*(?:\|\s*)?\(\s*(Cc|[ABCDabcd])\s*\)")
    for line in pages[index].splitlines():
        if "Q. No." in line and "Ans." in line:
            in_table = True
            continue
        if not in_table:
            continue
        start = re.match(r"\s*(\d{1,2})\b", line)
        if not start or not 1 <= int(start.group(1)) <= 25:
            continue
        row_number = int(start.group(1))
        previous = 0
        for match in cell.finditer(line):
            qnum = int(match.group(1))
            if qnum <= previous or qnum > 100 or (qnum - row_number) not in (0, 25, 50, 75):
                continue
            previous = qnum
            answers[str(qnum)] = match.group(2)[0].upper()
    return answers


def main():
    bank = json.loads((ARCHIVE / "bank/mpsc_bank_v2.json").read_text())
    keys = json.loads((ARCHIVE / "state/answer_keys_parsed.json").read_text())
    by_paper = defaultdict(list)
    for row in bank["questions"]:
        by_paper[row["paperId"]].append(row)
    derived = {}
    if DERIVED.is_file():
        for line_no, line in enumerate(DERIVED.read_text().splitlines(), 1):
            if not line.strip():
                continue
            item = json.loads(line)
            if item.get("id") in derived or item.get("answer") not in ("A", "B", "C", "D") or not item.get("model"):
                raise ValueError(f"Invalid or duplicate derived answer at line {line_no}")
            derived[item["id"]] = item
    with (ARCHIVE / "pdfs/index.csv").open(newline="") as stream:
        sources = list(csv.DictReader(stream))
    papers, questions, queue, seen = [], [], [], set()
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for source in sources:
        if not source["category"].startswith("Old_Questions"):
            continue
        parsed = identity(source["filename"])
        if not parsed:
            continue
        year, number, series = parsed
        rel = f'{source["category"]}/{source["filename"]}'
        if rel in seen:
            continue
        seen.add(rel)
        pdf = ARCHIVE / "pdfs" / rel
        if not pdf.is_file():
            raise FileNotFoundError(pdf)
        pid = f"mcs-{year}-{number.lower()}" + (f"-{series.lower()}" if series != "-" else "")
        pdf_name = f"{pid}.pdf"
        shutil.copyfile(pdf, PUBLIC / pdf_name)
        official = next((key for key in keys if key.get("status") == "final" and re.match(r"MCS\s*\(?\s*Combined", key["file"], re.I) and str(year) in key["file"] and (year != 2023 or f"Paper-{number}" in key["file"] and f"'{series}'" in key["file"]) and (year != 2024 or f"Paper-{number}" in key["file"])), None)
        parsed_answers = official["sections"][0]["answers"] if official and official.get("sections") and year == 2023 else {}
        ocr_answers = ocr_key_answers(ARCHIVE / "pdfs/Answer_Keys" / official["file"], year, number, series) if official and year >= 2024 else {}
        answers = parsed_answers or ocr_answers
        key_status = "matched_final" if parsed_answers else "official_key_ocr" if ocr_answers else "official_key_unparsed" if official else "no_official_key"
        key_name = (f"mcs-{year}-{'combined' if year == 2025 else number.lower()}-final-key.pdf" if year >= 2024 else f"{pid}-final-key.pdf") if official else None
        if official:
            shutil.copyfile(ARCHIVE / "pdfs/Answer_Keys" / official["file"], PUBLIC / key_name)
        legacy = {}
        for row in by_paper[rel]:
            n = row.get("qnum")
            if isinstance(n, int) and 1 <= n <= 100 and (n not in legacy or len(row.get("question", "")) > len(legacy[n].get("question", ""))):
                legacy[n] = row
        extracted = ocr_rows(pdf) if len(legacy) < 80 else []
        use_ocr = len(extracted) > len(legacy)
        rows = extracted if use_ocr else [legacy[n] for n in sorted(legacy)]
        paper_rows = []
        for position, row in enumerate(rows, 1):
            n = position if use_ocr else row["qnum"]
            text = row["text"] if use_ocr else str(row["question"]).strip()
            options = [str(v).strip() for v in row.get("options", [])]
            answer = answers.get(str(n)) if not use_ocr else None
            candidate = answers.get(str(row.get("printedNumber"))) if use_ocr and row.get("printedNumber") else None
            answer_index = "ABCD".find(answer) if answer else -1
            figure = False if use_ocr else bool(row.get("hasDiagram"))
            valid = len(options) == 4 and all(options) and len(set(options)) == 4
            scoreable = bool(answer_index >= 0 and valid and not figure and number == "I" and not use_ocr and key_status == "matched_final")
            subject, subject_source = classify(text, number)
            qid = f"{pid}-{'ocr' if use_ocr else 'q'}{n:03d}"
            model_answer = derived.get(qid)
            reason = None if scoreable else (
                "OCR extraction; printed question number and text need PDF review" if use_ocr else
                "Diagram or table needs the source PDF" if figure else
                "Options need review against the PDF" if not valid else
                "Paper II needs passage and layout verification against the PDF" if number == "II" and answers else
                "Official key answer comes from OCR; verify the key PDF before scoring" if answer_index >= 0 and key_status == "official_key_ocr" else
                "Official key OCR cell is missing or unclear" if key_status == "official_key_ocr" else
                "Official key PDF exists; answers not matched" if official and not answers else
                "No official answer key found in the local archive" if not official else
                "No answer in the parsed final key"
            )
            item = {
                "id": qid, "paperId": pid,
                "number": n, "numberVerified": not use_ocr, "page": row.get("page"),
                "printedNumberCandidate": row.get("printedNumber") if use_ocr else None,
                "officialAnswerCandidateIndex": "ABCD".find(candidate) if candidate else -1,
                "text": text, "options": options, "passage": None if use_ocr else row.get("passage") or None,
                "hasDiagram": figure, "answerIndex": answer_index,
                "answerSource": ("official-final-ocr" if key_status == "official_key_ocr" else "official-final") if answer_index >= 0 else None,
                "answerStatus": key_status if answer_index < 0 else "official_final_ocr" if key_status == "official_key_ocr" else "official_final",
                "derivedAnswerIndex": "ABCD".index(model_answer["answer"]) if model_answer else -1,
                "derivedAnswerSource": model_answer["model"] if model_answer else None,
                "derivedExplanation": model_answer.get("explanation") if model_answer else None,
                "scoreable": scoreable, "reviewReason": reason,
                "subject": subject, "subjectSource": subject_source,
                "parseConfidence": 0.45 if use_ocr else 0.8,
            }
            questions.append(item)
            paper_rows.append(item)
            queue.append({"id": item["id"], "paperId": pid, "number": n, "numberVerified": not use_ocr, "printedNumberCandidate": item["printedNumberCandidate"], "question": text, "options": options, "sourcePdf": f"/papers/mpsc-combined-prelims/{pdf_name}", "requiresSourceReview": use_ocr or not valid or figure, "answerStatus": item["answerStatus"]})
        numbers = {q["number"] for q in paper_rows} if not use_ocr else set()
        papers.append({
            "id": pid, "year": year, "paper": number, "series": series,
            "expectedCount": 100, "parsedCount": len(paper_rows),
            "missingNumbers": sorted(set(range(1, 101)) - numbers) if not use_ocr else [],
            "numberingVerified": not use_ocr, "extractionMethod": "ocr-sidecar" if use_ocr else "legacy-bank",
            "keyStatus": key_status, "scoreableCount": sum(q["scoreable"] for q in paper_rows),
            "reviewCount": sum(not q["scoreable"] for q in paper_rows),
            "sourceHref": f"/papers/mpsc-combined-prelims/{pdf_name}",
            "answerKeyHref": f"/papers/mpsc-combined-prelims/{key_name}" if key_name else None,
        })
    if len({p["id"] for p in papers}) != len(papers):
        raise ValueError("Duplicate paper identities in archive")
    unknown = set(derived) - {q["id"] for q in questions}
    if unknown:
        raise ValueError(f"Derived answers reference unknown IDs: {sorted(unknown)[:5]}")
    papers.sort(key=lambda p: (-p["year"], p["paper"], p["series"]))
    order = {p["id"]: i for i, p in enumerate(papers)}
    questions.sort(key=lambda q: (order[q["paperId"]], q["number"]))
    OUT.write_text(json.dumps({"schemaVersion": 2, "papers": papers, "questions": questions}, ensure_ascii=False, indent=2) + "\n")
    QUEUE.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in queue))
    print(f"Built {len(papers)} papers, {len(questions)} extracted questions, {sum(p['scoreableCount'] for p in papers)} scoreable, {len(queue)} queued for model review")
    for paper in papers:
        print(f"  {paper['year']} {paper['paper']}-{paper['series']}: {paper['parsedCount']}/100 ({paper['extractionMethod']}, {paper['keyStatus']})")


if __name__ == "__main__":
    main()
