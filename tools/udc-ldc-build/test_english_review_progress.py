import unittest
from english_review_progress import english_review_progress


class EnglishProgressTests(unittest.TestCase):
    def test_mixed_paper_does_not_treat_other_subjects_as_missing_english(self):
        library = [{'id': 'mixed', 'exam': 'Example', 'sitting': '2026', 'subject': 'General Knowledge & English',
                    'sourceHref': '/example.pdf', 'expectedMcq': 100}]
        questions = [{'id': 'e1', 'paperId': 'mixed', 'subject': 'english', 'answerIndex': 0},
                     {'id': 'g1', 'paperId': 'mixed', 'subject': 'gk', 'answerIndex': 0}]
        row = english_review_progress(library, questions, [])['papers'][0]
        self.assertEqual(row['mcq'], 1)
        self.assertEqual(row['ready'], 1)
        self.assertIsNone(row['missingMcq'])
        self.assertIsNone(row['expectedMcq'])

    def test_gaps_held_items_and_written_guides_remain_distinct(self):
        library = [{'id': 'english', 'exam': 'Example', 'sitting': '2026', 'subject': 'General English',
                    'sourceHref': '/example.pdf', 'expectedMcq': 3}]
        questions = [{'id': 'e1', 'paperId': 'english', 'subject': 'english', 'answerIndex': 0, 'sourceReview': True},
                     {'id': 'e2', 'paperId': 'english', 'subject': 'english', 'questionNumber': '2',
                      'answerIndex': -1, 'sourceReview': True, 'sourceReviewed': True, 'disputeNote': 'Key conflict'},
                     {'id': 'w1', 'paperId': 'english', 'subject': 'english', 'type': 'descriptive',
                      'sourceReview': False, 'explanation': 'An independent outline'}]
        row = english_review_progress(library, questions, [])['papers'][0]
        self.assertEqual((row['ready'], row['pendingMcq'], row['heldReviewed'], row['missingMcq']), (0, 1, 1, 1))
        self.assertEqual(row['heldItems'][0]['reason'], 'Key conflict')
        self.assertEqual((row['writtenRecords'], row['writtenGuides'], row['pendingWritten']), (1, 1, 0))
        self.assertEqual(row['status'], 'needs-review')
