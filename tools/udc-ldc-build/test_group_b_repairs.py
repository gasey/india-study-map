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

    def test_hfw_english_paper_is_fully_reviewed_with_defective_items_held(self):
        extracted = json.loads((HERE / 'extracted/hfw-2026-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['hfw-2026-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 51)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 51)))
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, range(1, 51))) - {'22', '25'})
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
        self.assertTrue(result['questions'][21]['unscored'])
        self.assertTrue(result['questions'][24]['unscored'])
        self.assertEqual(result['questions'][30]['opts']['b'], 'invested, shipped')

    def test_fcs_paper_recovers_merged_first_eight_and_reviews_through_100(self):
        extracted = json.loads((HERE / 'extracted/si-fcs-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-fcs-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual(result['questions'][0]['opts']['d'], 'Kiwi')
        self.assertEqual(result['questions'][7]['q'], 'Red Fort at Delhi was built by which of the following Mughal kings?')
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, list(range(1, 30)) + list(range(31, 42)) + list(range(43, 51)) + list(range(52, 68)) + list(range(69, 91)) + list(range(92, 96)) + [98])))
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
        self.assertTrue(result['questions'][29]['unscored'])
        self.assertTrue(result['questions'][41]['unscored'])
        self.assertTrue(result['questions'][50]['unscored'])
        self.assertTrue(result['questions'][67]['unscored'])
        self.assertEqual(result['questions'][68]['opts']['a'], '±9')
        self.assertEqual(result['questions'][54]['opts']['d'], '25 km/hr')
        self.assertIn('Violet and blue light get scattered', result['questions'][37]['opts']['c'])
        self.assertEqual(result['questions'][23]['opts']['a'], 'Articles 25-28')

    def test_fcs_english_paper_reviews_all_mcqs_and_restores_written_prompts(self):
        extracted = json.loads((HERE / 'extracted/si-fcs-2025-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-fcs-2025-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 61)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 61)))
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, set(range(1, 61)) - {47, 49, 50})))
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
        self.assertTrue(result['questions'][46]['unscored'])
        self.assertTrue(result['questions'][48]['unscored'])
        self.assertTrue(result['questions'][49]['unscored'])
        self.assertEqual(result['questions'][38]['opts']['b'], 'Precipituous')
        self.assertIn('A. She loved painting landscapes.', result['questions'][42]['q'])
        self.assertEqual(set(repair['written']), {'1', '2', '3'})
        self.assertIn('(j) What role do governments', repair['written']['3']['q'])
        self.assertIn('ensure(s)', repair['written']['3']['explanation'])

    def test_excise_2025_paper_two_restores_all_questions_and_holds_uncertain_items(self):
        extracted = json.loads((HERE / 'extracted/si-excise-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-excise-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, set(range(1, 101)) - {30, 81, 82, 96, 97})
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertEqual(result['questions'][0]['page'], 2)
        self.assertEqual(result['questions'][98]['page'], 11)
        self.assertEqual(result['questions'][54]['opts']['a'], '100489')
        self.assertEqual(repair['derivedAnswers']['48']['answerIndex'], 0)
        self.assertTrue(all(result['questions'][n - 1]['imagePath'].endswith(f'q{n:03d}.png') for n in (96, 97, 98)))
        self.assertTrue(result['questions'][29]['unscored'])
        self.assertTrue(result['questions'][80]['unscored'])
        self.assertTrue(result['questions'][96]['unscored'])

    def test_excise_2024_paper_two_recovers_full_scan_and_flags_defective_items(self):
        extracted = json.loads((HERE / 'extracted/si-excise-2024-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-excise-2024-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, set(range(1, 101)) - {52, 76, 86, 91, 94})
        self.assertTrue(all(answer['explanation'].strip() for answer in repair['derivedAnswers'].values()))
        self.assertIn('A ______ is a digital electronic device', result['questions'][0]['q'])
        self.assertEqual(result['questions'][50]['opts']['d'], '24')
        self.assertEqual(result['questions'][56]['opts']['d'], '2520')
        self.assertTrue(result['questions'][75]['unscored'])
        self.assertTrue(result['questions'][93]['unscored'])
        self.assertTrue(all(result['questions'][n - 1]['imagePath'] for n in (52, 86, 91)))

    def test_excise_2024_paper_one_scan_checks_first_half_and_restores_gaps(self):
        extracted = json.loads((HERE / 'extracted/si-excise-2024-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-excise-2024-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        expected = set(range(1, 101))
        self.assertEqual(reviewed, expected)
        self.assertEqual(len(result['questions']), 100)
        held = {7, 30, 33, 53, 54, 56, 66, 70, 71, 72, 77, 78, 79, 96}
        self.assertEqual(set(map(int, repair['derivedAnswers'])), expected - held)
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertEqual(result['questions'][1]['opts']['d'], 'Article 371G')
        self.assertEqual(result['questions'][19]['opts']['d'], 'Sesamum')
        self.assertEqual(result['questions'][48]['opts']['a'], 'Surat')
        self.assertEqual(result['questions'][90]['opts']['a'], 'To provide essential nutrients for muscle development and overall health')
        self.assertTrue(result['questions'][6]['unscored'])
        self.assertTrue(result['questions'][29]['unscored'])
        self.assertTrue(result['questions'][32]['unscored'])
        self.assertTrue(result['questions'][52]['unscored'])
        self.assertTrue(result['questions'][65]['unscored'])
        self.assertTrue(result['questions'][69]['unscored'])
        self.assertTrue(result['questions'][70]['unscored'])
        self.assertTrue(result['questions'][76]['unscored'])
        self.assertTrue(result['questions'][77]['unscored'])
        self.assertTrue(result['questions'][78]['unscored'])
        self.assertTrue(result['questions'][95]['unscored'])
        self.assertTrue(all(result['questions'][n - 1]['unscored'] for n in held))
        self.assertIn('staring out at the rain like a Dickensian orphan', result['questions'][75]['direction'])
        self.assertIn('Hooker covertly moved 70,000', result['questions'][80]['direction'])
        self.assertIn('ethos, pathos, and logos', result['questions'][85]['direction'])
        self.assertIn('sulphur compounds in onion and garlic', result['questions'][90]['direction'])
        self.assertEqual(result['questions'][0]['opts']['c'], '1951–56')
        self.assertEqual(result['questions'][26]['opts']['b'], '1935')
        self.assertEqual(result['questions'][97]['opts']['c'].count('flavors'), 1)
        self.assertIn('sulfur compounds', result['questions'][98]['opts']['a'])

    def test_aao_2025_paper_two_recovers_merged_first_eight_questions(self):
        extracted = json.loads((HERE / 'extracted/aao-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['aao-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual(len(result['questions']), 100)
        self.assertIn('NISAR', result['questions'][0]['q'])
        self.assertIn('tariff', result['questions'][1]['q'])
        self.assertIn('Poona Pact', result['questions'][7]['q'])
        self.assertTrue(result['questions'][5]['unscored'])
        self.assertTrue(result['questions'][28]['unscored'])
        self.assertTrue(result['questions'][49]['unscored'])
        self.assertTrue(result['questions'][91]['unscored'])
        self.assertEqual(result['questions'][29]['opts']['b'], 'private investment, particularly from outside the State')
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 101)) - {6, 29, 50, 92})
        self.assertEqual(result['questions'][51]['opts']['d'], '99370')
        self.assertEqual(result['questions'][55]['opts']['d'], '√3:1')
        self.assertIn('√3:1', repair['derivedAnswers']['56']['explanation'])
        self.assertIn('Questions 99–100', result['questions'][98]['direction'])
        self.assertIn('Figure (d)', result['questions'][97]['opts']['d'])
        self.assertIn('Questions 83–84', result['questions'][82]['direction'])
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))

    def test_je_2025_gk_recovers_opening_questions_and_holds_duplicate_choice(self):
        extracted = json.loads((HERE / 'extracted/je-2025-gk.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['je-2025-gk']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual(len(result['questions']), 100)
        self.assertIn('first skywalk in Mizoram', result['questions'][0]['q'])
        self.assertEqual(result['questions'][7]['opts']['c'], '6.7%')
        self.assertEqual(result['questions'][12]['opts']['d'], '24th')
        self.assertTrue(result['questions'][13]['unscored'])
        self.assertEqual(result['questions'][25]['opts']['b'], 'Kangchenjunga')
        self.assertEqual(result['questions'][54]['opts']['c'], 'International Food Policy Research Institute (IFPRI)')
        self.assertEqual(result['questions'][59]['opts']['c'], 'Networks of relationships among people in a society')
        self.assertTrue(result['questions'][83]['unscored'])
        self.assertTrue(result['questions'][97]['unscored'])
        self.assertTrue(result['questions'][99]['unscored'])
        self.assertEqual(result['questions'][96]['opts']['d'], 'Kairuma')
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 101)) - {14, 32, 47, 51, 55, 56, 84, 98, 100})
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))

    def test_steno_2024_gk_reviews_visible_pages_and_preserves_missing_page(self):
        extracted = json.loads((HERE / 'extracted/steno-2024-gk.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['steno-2024-gk']
        result, reviewed = reviewed_extraction(extracted, repair)
        expected = set(range(1, 67)) | set(range(80, 101))
        self.assertEqual(reviewed, expected)
        self.assertEqual({q['n'] for q in result['questions']}, expected)
        self.assertEqual(len(result['questions']), 87)
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, expected - {4, 33, 83})
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        by_number = {q['n']: q for q in result['questions']}
        self.assertTrue(all(by_number[n]['unscored'] for n in (4, 33, 83)))
        self.assertEqual(result['questions'][-7]['opts']['b'], 'A and B')
        self.assertTrue(repair['partialReview'])
        self.assertIn('Q67–79 are absent', repair['evidence'])

    def test_jao_2025_p2_reviews_opening_scan_pages_as_a_partial_batch(self):
        extracted = json.loads((HERE / 'extracted/jao-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['jao-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 24)))
        self.assertEqual(len(repair['questions']), 23)
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 24)))
        self.assertEqual(result['questions'][0]['q'], repair['questions']['1']['q'])
        self.assertEqual(result['questions'][22]['opts']['a'], 'The day’s business normally starts with Question Hour, followed by Zero Hour.')
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
        self.assertTrue(repair['partialReview'])

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
        del self.repair['questions']['4']['opts']['c']
        with self.assertRaisesRegex(AssertionError, 'options'):
            reviewed_extraction(self.extracted, self.repair)

    def test_accepts_three_printed_options(self):
        partial = copy.deepcopy(self.repair)
        partial['partialReview'] = True
        partial['questions'] = {'3': partial['questions']['3']}
        del partial['questions']['3']['opts']['d']
        result, reviewed = reviewed_extraction(self.extracted, partial)
        self.assertEqual(reviewed, {3})
        question = next(q for q in result['questions'] if q['n'] == 3)
        self.assertEqual(tuple(question['opts']), ('a', 'b', 'c'))

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
