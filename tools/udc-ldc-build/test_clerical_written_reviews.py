import hashlib
import shutil
import tempfile
import unittest
from pathlib import Path
from clerical_written_reviews import apply_clerical_written_reviews


class WrittenSourceReviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'app'
        self.archive = Path(self.temp.name) / 'archive'
        source = self.archive / 'pdfs' / 'source.pdf'
        source.parent.mkdir(parents=True)
        fixture = Path(__file__).resolve().parents[2] / 'public/papers/group-b/ada-2014-english.pdf'
        shutil.copyfile(fixture, source)
        self.papers = [{'id': 'written-paper', 'sourceFile': 'pdfs/source.pdf'}]
        self.questions = [{'id': 'written-item', 'paperId': 'written-paper',
                           'type': 'descriptive', 'question': 'Original prompt', 'explanation': ''}]
        self.review = {'papers': {'written-paper': {
            'sourceFile': 'pdfs/source.pdf', 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'reviewedOn': '2026-10-13', 'evidence': 'Source page checked.',
            'questions': {'written-item': {'expectedQuestion': 'Original prompt',
                          'question': 'Complete checked prompt', 'page': 2, 'explanation': 'Independent writing guidance.'}}}}}

    def apply(self):
        return apply_clerical_written_reviews(self.questions, self.papers, self.review, self.root, self.archive)

    def test_guide_keeps_written_type_and_links_to_guarded_source(self):
        self.apply()
        row = self.questions[0]
        self.assertEqual(row['type'], 'descriptive')
        self.assertNotIn('answerIndex', row)
        self.assertTrue(row['sourceReviewed'])
        self.assertFalse(row['sourceReview'])
        self.assertEqual(row['sourceHref'], '/papers/clerical-review/written-paper.pdf#page=2')
        self.assertTrue((self.root / 'public/papers/clerical-review/written-paper.pdf').is_file())

    def test_stale_source_is_rejected(self):
        self.review['papers']['written-paper']['sourceSha256'] = 'wrong'
        with self.assertRaisesRegex(AssertionError, 'source hash'):
            self.apply()

    def test_changed_prompt_is_rejected(self):
        self.questions[0]['question'] = 'Different prompt'
        with self.assertRaisesRegex(AssertionError, 'question text'):
            self.apply()

    def test_mcq_cannot_be_promoted_by_a_written_guide(self):
        self.questions[0]['type'] = 'mcq'
        with self.assertRaisesRegex(AssertionError, 'alter an MCQ'):
            self.apply()

    def test_page_outside_source_is_rejected(self):
        self.review['papers']['written-paper']['questions']['written-item']['page'] = 4
        with self.assertRaisesRegex(AssertionError, 'source page'):
            self.apply()
