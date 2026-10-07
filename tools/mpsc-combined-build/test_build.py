import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / "src/data/banks/mpsc-combined-prelims.json").read_text())


class CombinedPrelimsBankTest(unittest.TestCase):
    def test_paper_scope_and_coverage(self):
        papers = DATA["papers"]
        self.assertEqual(len(papers), 11)
        self.assertEqual({p["year"] for p in papers}, {2023, 2025})
        self.assertEqual(len(DATA["questions"]), 1094)
        self.assertEqual(len({q["id"] for q in DATA["questions"]}), 1094)
        for paper in papers:
            rows = [q for q in DATA["questions"] if q["paperId"] == paper["id"]]
            self.assertEqual(len(rows), paper["parsedCount"])
            self.assertEqual(sorted(set(range(1, 101)) - {q["number"] for q in rows}), paper["missingNumbers"])
            self.assertEqual(sum(q["scoreable"] for q in rows), paper["scoreableCount"])
            self.assertTrue((ROOT / "public" / paper["sourceHref"].lstrip("/")).is_file())
            if paper["answerKeyHref"]:
                self.assertTrue((ROOT / "public" / paper["answerKeyHref"].lstrip("/")).is_file())

    def test_only_verified_complete_paper_i_is_scored(self):
        scored = [q for q in DATA["questions"] if q["scoreable"]]
        self.assertEqual(len(scored), 297)
        by_id = {p["id"]: p for p in DATA["papers"]}
        for q in scored:
            paper = by_id[q["paperId"]]
            self.assertEqual((paper["year"], paper["paper"]), (2023, "I"))
            self.assertEqual(q["answerSource"], "official-final")
            self.assertIn(q["answerIndex"], range(4))
            self.assertEqual(len(set(q["options"])), 4)
            self.assertFalse(q["hasDiagram"])
        self.assertTrue(all(q["answerIndex"] == -1 for q in DATA["questions"] if by_id[q["paperId"]]["year"] == 2025))


if __name__ == "__main__":
    unittest.main()
