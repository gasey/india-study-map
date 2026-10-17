"""Golden regression cases for the Combined Prelims option parser.

The parser reads the text layer or OCR sidecar of a paper. These fixtures pin
the layouts it must recover without a PDF: standard order, two-column order,
OCR bracket/letter damage, and the boundary between adjacent questions.
"""
import unittest

from build import option_rows


class OptionParserTest(unittest.TestCase):
    def test_standard_order(self):
        rows = option_rows("1. Capital of India?\n(a) Mumbai\n(b) Delhi\n(c) Kolkata\n(d) Chennai\n")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["options"], ["Mumbai", "Delhi", "Kolkata", "Chennai"])
        self.assertEqual(rows[0]["printedNumber"], 1)

    def test_two_column_order_keeps_letter_mapping(self):
        text = (
            "8. The G20 members represent over\n"
            "(a) 87% of global GDP\n(c) 85% of global GDP\n\n"
            "(b) 75% of global GDP\n(d) 65% of global GDP\n"
        )
        rows = option_rows(text)
        self.assertEqual(len(rows), 1)
        self.assertEqual(
            rows[0]["options"],
            ["87% of global GDP", "75% of global GDP", "85% of global GDP", "65% of global GDP"],
        )

    def test_ocr_bracket_and_letter_damage(self):
        rows = option_rows("3. Pick one\n(a) one\n{b) two\n(c} three\n(4) four\n")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["options"], ["one", "two", "three", "four"])

    def test_two_columns_then_normal_question(self):
        text = (
            "15. Which Governor General abolished sati?\n"
            "(a) Wellesley\n(c) William Bentinck\n\n"
            "(b) Curzon\n(d) Dalhousie\n"
            "16. Next question?\n"
            "(a) alpha\n(b) beta\n(c) gamma\n(d) delta\n"
        )
        rows = option_rows(text)
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["options"], ["Wellesley", "Curzon", "William Bentinck", "Dalhousie"])
        self.assertEqual(rows[1]["options"], ["alpha", "beta", "gamma", "delta"])
        self.assertEqual([r["printedNumber"] for r in rows], [15, 16])

    def test_missing_option_does_not_merge_next_question(self):
        text = (
            "1. Broken question?\n(a) one\n(c) three\n(d) four\n"
            "2. Next question?\n(a) alpha\n(b) beta\n(c) gamma\n(d) delta\n"
        )
        rows = option_rows(text)
        # Question 1 has no (b); it must be dropped, not completed with 2's (b).
        self.assertEqual([r["printedNumber"] for r in rows], [2])
        self.assertEqual(rows[0]["options"], ["alpha", "beta", "gamma", "delta"])

    def test_cover_page_is_skipped(self):
        text = "MCS COMBINED QUESTION BOOKLET\ncover text\f1. Real question?\n(a) one\n(b) two\n(c) three\n(d) four\n"
        rows = option_rows(text)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["printedNumber"], 1)

    def test_incomplete_options_are_dropped(self):
        rows = option_rows("1. Only three options?\n(a) one\n(b) two\n(c) three\n")
        self.assertEqual(rows, [])


if __name__ == "__main__":
    unittest.main()
