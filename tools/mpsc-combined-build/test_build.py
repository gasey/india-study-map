import json
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / "src/data/banks/mpsc-combined-prelims.json").read_text())


class CombinedPrelimsBankTest(unittest.TestCase):
    def test_archive_scope_and_pdf_links(self):
        papers = DATA["papers"]
        self.assertEqual(len(papers), 36)
        self.assertEqual({p["year"] for p in papers}, {2014, 2016, 2021, 2023, 2024, 2025})
        self.assertEqual(len({p["id"] for p in papers}), len(papers))
        self.assertEqual(len({q["id"] for q in DATA["questions"]}), len(DATA["questions"]))
        counts = Counter(q["paperId"] for q in DATA["questions"])
        for paper in papers:
            self.assertEqual(counts[paper["id"]], paper["parsedCount"])
            self.assertTrue((ROOT / "public" / paper["sourceHref"].lstrip("/")).is_file())
            if paper["answerKeyHref"]:
                self.assertTrue((ROOT / "public" / paper["answerKeyHref"].lstrip("/")).is_file())
            if paper["extractionMethod"] == "ocr-sidecar":
                self.assertFalse(paper["numberingVerified"])
                self.assertEqual(paper["scoreableCount"], 0)

    def test_answer_provenance_and_model_queue(self):
        by_id = {p["id"]: p for p in DATA["papers"]}
        queue = [json.loads(line) for line in (ROOT / "tools/mpsc-combined-build/model-queue.jsonl").read_text().splitlines()]
        self.assertEqual({row["id"] for row in queue}, {q["id"] for q in DATA["questions"]})
        for q in DATA["questions"]:
            paper = by_id[q["paperId"]]
            self.assertTrue(q["subject"])
            self.assertIn(q["subjectSource"], ("auto-keyword", "paper-fallback"))
            self.assertEqual(q["derivedAnswerIndex"], -1)
            if q["scoreable"]:
                self.assertEqual((paper["year"], paper["paper"]), (2023, "I"))
                self.assertEqual(q["answerSource"], "official-final")
                self.assertIn(q["answerIndex"], range(4))
            if not q["numberVerified"]:
                self.assertEqual(q["answerIndex"], -1)
            if paper["keyStatus"] == "no_official_key":
                self.assertEqual(q["answerIndex"], -1)
            if q["answerSource"] == "official-final-ocr":
                self.assertFalse(q["scoreable"])

    def test_scanned_key_is_labeled_and_not_scored(self):
        questions = {q["id"]: q for q in DATA["questions"]}
        self.assertEqual(questions["mcs-2025-i-a-q001"]["answerIndex"], 2)
        self.assertEqual(questions["mcs-2025-i-a-q001"]["answerSource"], "official-final-ocr")
        self.assertFalse(questions["mcs-2025-i-a-q001"]["scoreable"])
        paper = next(p for p in DATA["papers"] if p["id"] == "mcs-2025-i-a")
        self.assertEqual(paper["answerKeyHref"], "/papers/mpsc-combined-prelims/mcs-2025-combined-final-key.pdf")


if __name__ == "__main__":
    unittest.main()
