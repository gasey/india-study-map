"""Guards for the source-reviewed OCR recovery input."""
import copy
import json
import unittest
from pathlib import Path
from group_b_sources import reviewed_extraction

HERE = Path(__file__).parent


class ReviewedRepairTests(unittest.TestCase):
    def setUp(self):
        self.extracted = json.loads((HERE / 'extracted/aao-2024-gk.json').read_text())
        self.repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['aao-2024-gk']

    def test_recovers_complete_numbering_without_mutating_ocr(self):
        before = copy.deepcopy(self.extracted)
        result, reviewed = reviewed_extraction(self.extracted, self.repair)
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual(self.extracted, before)
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 88)['page'], 10)
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 2)['opts']['d'], 'Bharat Diwas')
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 11)['opts']['b'], '10 February 2020')
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 8)['opts']['d'], 'To control the receipt and issue of public money, and to ensure that the public revenue is lodged in the exchequer')
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 13)['opts']['d'], 'NFC')
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 99)['opts']['d'], 'Generally Accepted Accounting Principles')
        key = json.loads((HERE / 'verified-general-keys.json').read_text())['aao-2024-gk']
        self.assertEqual(key['answers']['73'], 'B')
        self.assertIn('corrigendum', key['correctionRefs']['73'])
        self.assertEqual(key['answers']['13'], 'B&D')

    def test_rejects_stale_source(self):
        self.repair['sourceSha256'] = 'changed source'
        with self.assertRaisesRegex(AssertionError, 'Stale'):
            reviewed_extraction(self.extracted, self.repair)

    def test_rejects_missing_recovery(self):
        del self.repair['questions']['88']
        with self.assertRaisesRegex(AssertionError, 'missing or extra'):
            reviewed_extraction(self.extracted, self.repair)

    def test_rejects_answer_override(self):
        self.repair['questions']['3']['answerIndex'] = 0
        with self.assertRaisesRegex(AssertionError, 'override answers'):
            reviewed_extraction(self.extracted, self.repair)

    def test_rejects_missing_option(self):
        del self.repair['questions']['4']['opts']['d']
        with self.assertRaisesRegex(AssertionError, 'options'):
            reviewed_extraction(self.extracted, self.repair)

    def test_allows_explicit_partial_review(self):
        partial = copy.deepcopy(self.repair)
        partial['partialReview'] = True
        partial['questions'] = {'3': partial['questions']['3']}
        before_count = len(self.extracted['questions'])
        adds_number = not any(q['n'] == 3 for q in self.extracted['questions'])
        result, reviewed = reviewed_extraction(self.extracted, partial)
        self.assertEqual(reviewed, {3})
        self.assertEqual(len(result['questions']), before_count + int(adds_number))
        self.assertEqual(next(q for q in result['questions'] if q['n'] == 3)['q'], partial['questions']['3']['q'])

    def test_rejects_unsubstantiated_derived_answer(self):
        self.repair['derivedAnswers'] = {'3': {'answerIndex': 4, 'explanation': 'invalid'}}
        with self.assertRaisesRegex(AssertionError, 'valid option'):
            reviewed_extraction(self.extracted, self.repair)


if __name__ == '__main__':
    unittest.main()
