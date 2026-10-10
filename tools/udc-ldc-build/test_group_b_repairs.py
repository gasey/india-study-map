"""Guards for the source-reviewed OCR recovery input."""
import copy
import json
import re
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

    def test_je_2016_english_recovers_gaps_and_holds_defective_items(self):
        extracted = json.loads((HERE / 'extracted/je-2016-english.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['je-2016-english']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 81)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 81)))
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, set(range(1, 81)) - {42, 52})))
        self.assertEqual(result['questions'][44]['opts']['c'], 'conjunction')
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertTrue(all(result['questions'][n - 1]['unscored'] for n in (42, 52)))
        self.assertIn('essay', repair['written']['1']['q'])

    def test_aao_2025_english_splits_merged_written_prompt_from_mcq(self):
        extracted = json.loads((HERE / 'extracted/aao-2025-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['aao-2025-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 61)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 61)))
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, range(1, 61))))
        self.assertEqual([q['n'] for q in result['questions'] if q['part'] == 'B'], list(range(1, 61)))
        self.assertTrue(all(str(n) in repair['written'] for n in range(1, 5)))
        self.assertEqual(result['questions'][31]['opts']['b'], 'He doesn’t like noodles.')

    def test_jao_2025_english_recovers_full_mcq_set_and_written_passages(self):
        extracted = json.loads((HERE / 'extracted/jao-2025-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['jao-2025-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 61)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 61)))
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, set(range(1, 61)) - {11, 13, 36, 37, 52, 55, 58})))
        self.assertEqual(result['questions'][4]['q'], 'The clothes are still lying at where you left **them**.')
        self.assertEqual(result['questions'][36]['opts']['a'], '12 a.m.–3 a.m.')
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertEqual(repair['derivedAnswers']['7']['answerIndex'], 0)
        self.assertTrue(all(result['questions'][n - 1]['unscored'] for n in (11, 13, 36, 37, 52, 55, 58)))
        self.assertEqual(set(repair['written']), {'1', '2', '3'})
        self.assertIn('submerged', repair['written']['3']['q'])

    def test_fcs_paper_recovers_merged_first_eight_and_reviews_through_100(self):
        extracted = json.loads((HERE / 'extracted/si-fcs-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-fcs-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual(result['questions'][0]['opts']['d'], 'Kiwi')
        self.assertEqual(result['questions'][7]['q'], 'Red Fort at Delhi was built by which of the following Mughal kings?')
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, set(range(1, 101)) - {30, 100})))
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
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
        self.assertEqual(set(repair['derivedAnswers']), set(map(str, range(1, 61))))
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
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
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, set(range(1, 101)) - {82})
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertEqual(result['questions'][0]['page'], 2)
        self.assertEqual(result['questions'][98]['page'], 11)
        self.assertEqual(result['questions'][54]['opts']['a'], '100489')
        self.assertEqual(repair['derivedAnswers']['48']['answerIndex'], 0)
        self.assertTrue(all(result['questions'][n - 1]['imagePath'].endswith(f'q{n:03d}.png') for n in (96, 97, 98)))
        self.assertTrue(result['questions'][81]['unscored'])

    def test_excise_2024_paper_two_recovers_full_scan_and_flags_defective_items(self):
        extracted = json.loads((HERE / 'extracted/si-excise-2024-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-excise-2024-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual([q['n'] for q in result['questions']], list(range(1, 101)))
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, set(range(1, 101)) - {52, 91})
        self.assertTrue(all(answer['explanation'].strip() for answer in repair['derivedAnswers'].values()))
        self.assertIn('A ______ is a digital electronic device', result['questions'][0]['q'])
        self.assertEqual(result['questions'][50]['opts']['d'], '24')
        self.assertEqual(result['questions'][56]['opts']['d'], '2520')
        self.assertTrue(result['questions'][51]['unscored'])
        self.assertTrue(result['questions'][90]['unscored'])
        self.assertTrue(all(result['questions'][n - 1]['imagePath'] for n in (52, 86, 91)))

    def test_excise_2024_paper_one_scan_checks_first_half_and_restores_gaps(self):
        extracted = json.loads((HERE / 'extracted/si-excise-2024-p1.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['si-excise-2024-p1']
        result, reviewed = reviewed_extraction(extracted, repair)
        expected = set(range(1, 101))
        self.assertEqual(reviewed, expected)
        self.assertEqual(len(result['questions']), 100)
        held = {7, 33, 53, 54, 56, 66, 70, 71, 72}
        self.assertEqual(set(map(int, repair['derivedAnswers'])), expected - held)
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        self.assertEqual(result['questions'][1]['opts']['d'], 'Article 371G')
        self.assertEqual(result['questions'][19]['opts']['d'], 'Sesamum')
        self.assertEqual(result['questions'][48]['opts']['a'], 'Surat')
        self.assertEqual(result['questions'][90]['opts']['a'], 'To provide essential nutrients for muscle development and overall health')
        self.assertTrue(result['questions'][6]['unscored'])
        self.assertTrue(result['questions'][32]['unscored'])
        self.assertTrue(result['questions'][52]['unscored'])
        self.assertTrue(result['questions'][53]['unscored'])
        self.assertTrue(result['questions'][55]['unscored'])
        self.assertTrue(result['questions'][65]['unscored'])
        self.assertTrue(result['questions'][69]['unscored'])
        self.assertTrue(result['questions'][70]['unscored'])
        self.assertTrue(result['questions'][71]['unscored'])
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
        self.assertEqual(result['questions'][29]['opts']['b'], 'private investment, particularly from outside the State')
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 101)) - {6})
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
        self.assertEqual(result['questions'][96]['opts']['d'], 'Kairuma')
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 101)) - {14})
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))

    def test_steno_2024_gk_reviews_visible_pages_and_preserves_missing_page(self):
        extracted = json.loads((HERE / 'extracted/steno-2024-gk.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['steno-2024-gk']
        result, reviewed = reviewed_extraction(extracted, repair)
        expected = set(range(1, 67)) | set(range(80, 101))
        self.assertEqual(reviewed, expected)
        self.assertEqual({q['n'] for q in result['questions']}, expected)
        self.assertEqual(len(result['questions']), 87)
        self.assertEqual({int(n) for n in repair['derivedAnswers']}, expected)
        self.assertTrue(all(row['explanation'].strip() for row in repair['derivedAnswers'].values()))
        by_number = {q['n']: q for q in result['questions']}
        self.assertEqual(result['questions'][-7]['opts']['b'], 'A and B')
        self.assertTrue(repair['partialReview'])
        self.assertIn('Q67–79 are absent', repair['evidence'])

    def test_jao_2025_p2_recovers_full_scan_and_keeps_defective_items_unscored(self):
        extracted = json.loads((HERE / 'extracted/jao-2025-p2.json').read_text())
        repair = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']['jao-2025-p2']
        result, reviewed = reviewed_extraction(extracted, repair)
        self.assertEqual(reviewed, set(range(1, 101)))
        self.assertEqual(len(repair['questions']), 100)
        self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 101)) - {83})
        self.assertEqual(result['questions'][0]['q'], repair['questions']['1']['q'])
        self.assertEqual(result['questions'][22]['opts']['a'], 'The day’s business normally starts with Question Hour, followed by Zero Hour.')
        self.assertEqual(repair['questions']['32']['opts']['c'], 'North Chawilung hills')
        self.assertEqual(repair['questions']['40']['opts']['b'], 'Gekko mizoramensis')
        self.assertTrue(all(x['explanation'].strip() for x in repair['derivedAnswers'].values()))
        self.assertFalse(repair['partialReview'])
        by_number = {q['n']: q for q in result['questions']}
        # These numbered questions were absent from the geometric OCR cache.
        missing = {52, 66, 72, 75, 77, 78, 80, 93, 95}
        self.assertTrue(missing.isdisjoint({q['n'] for q in extracted['questions']}))
        self.assertTrue(missing <= set(by_number))
        self.assertEqual(by_number[51]['q'], 'Evaluate √(√100 + √36).')
        self.assertIn('a³ + b³', by_number[71]['q'])
        self.assertEqual(repair['derivedAnswers']['72']['answerIndex'], 0)
        self.assertEqual(repair['derivedAnswers']['91']['answerIndex'], 1)
        self.assertTrue(by_number[83]['unscored'])
        self.assertNotIn('83', repair['derivedAnswers'])
        for n in (65, 80, 86, 89, 94, 95, 96):
            self.assertTrue((HERE.parents[1] / 'public' / by_number[n]['imagePath'].lstrip('/')).is_file())
        broken = copy.deepcopy(repair)
        del broken['questions']['52']
        del broken['derivedAnswers']['52']
        with self.assertRaisesRegex(AssertionError, 'missing or extra'):
            reviewed_extraction(extracted, broken)

    def test_rejects_stale_source(self):
        self.repair['sourceSha256'] = 'changed source'
        with self.assertRaisesRegex(AssertionError, 'Stale'):
            reviewed_extraction(self.extracted, self.repair)

    def test_written_only_papers_remove_false_mcqs_and_recover_complete_tasks(self):
        repairs = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']
        for slug, numbers in {
            'inspector-stats-2017-english': set(range(1, 11)),
            'technical-2024-p1': {1, 2, *range(4, 12)},
            'asi-2024-p1': set(range(1, 13)),
            'mvi-2025-p1': set(range(1, 14)),
        }.items():
            with self.subTest(slug=slug):
                extracted = json.loads((HERE / f'extracted/{slug}.json').read_text())
                result, reviewed = reviewed_extraction(extracted, repairs[slug])
                self.assertEqual(result['questions'], [])
                self.assertEqual(reviewed, set())
                self.assertEqual(set(map(int, repairs[slug]['written'])), numbers)
                self.assertTrue(all(row['q'].strip() and row['explanation'].strip()
                                    for row in repairs[slug]['written'].values()))

    def test_final_scan_batches_preserve_numbering_and_held_answer_gates(self):
        repairs = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']
        for slug, count in [('je-2025-english', 60), ('steno-2024-english', 60),
                            ('je-agri-2026-p1', 32), ('asi-2024-p2', 100)]:
            with self.subTest(slug=slug):
                extracted = json.loads((HERE / f'extracted/{slug}.json').read_text())
                result, reviewed = reviewed_extraction(extracted, repairs[slug])
                self.assertEqual(reviewed, set(range(1, count+1)))
                self.assertEqual([q['n'] for q in result['questions']], list(range(1, count+1)))
                held = {str(q['n']) for q in result['questions'] if q.get('unscored')}
                self.assertEqual(set(repairs[slug]['derivedAnswers']),
                                 {str(n) for n in reviewed} - held)
        je = repairs['je-2025-english']['questions']
        self.assertEqual(je['22']['page'], 7)
        self.assertEqual(je['34']['page'], 8)
        self.assertIn('__theirs__', je['1']['q'])
        self.assertNotIn('66', repairs['steno-2024-english']['questions'])

    def test_generated_artifact_keeps_written_only_papers_and_distinguishes_held_items(self):
        root = HERE.parents[1]
        source = (root / 'src/data/banks/mpsc-group-b-general.ts').read_text()
        decoder = json.JSONDecoder()
        rows = []
        for match in re.finditer(r'const groupBQuestionsPart\d+: BankQuestion\[\] = ', source):
            rows.extend(decoder.raw_decode(source, match.end())[0])
        for q in rows:
            if (q.get('independentAnswerSource') == 'solved'
                    and len(q.get('officialAnswerCandidates', [])) == 1
                    and q['independentAnswerIndex'] != q['officialAnswerCandidates'][0]):
                self.assertEqual(q['answerIndex'], -1, q['id'])
                self.assertTrue(q['sourceReview'], q['id'])
                self.assertTrue(q['disputeNote'], q['id'])
        library = json.loads((root / 'src/data/banks/mpsc-group-b-library.json').read_text())
        self.assertEqual({p['id'] for p in library if p['imported']}, {q['paperId'] for q in rows})
        for paper in library:
            if not paper['imported']:
                self.assertTrue((root / 'public' / paper['sourceHref'].lstrip('/')).is_file())
                self.assertFalse(any(q['paperId'] == paper['id'] for q in rows))
        si_english = [q for q in rows if q['paperId'] == 'mpsc-group-b-si-excise-2014-p1']
        si_gs1 = [q for q in rows if q['paperId'] == 'mpsc-group-b-si-excise-2014-p2']
        si_gs2 = [q for q in rows if q['paperId'] == 'mpsc-group-b-si-excise-2014-p3']
        self.assertEqual(len(si_english), 9)
        self.assertTrue(all(q.get('type') == 'descriptive' and q.get('sourceReview') for q in si_english))
        self.assertEqual(len(si_gs1), 75)
        self.assertEqual(len(si_gs2), 34)
        self.assertTrue(all(q.get('sourceReview') and q['answerIndex'] == -1
                            for q in si_gs1 + si_gs2))
        self.assertEqual({p['expectedMcq'] for p in library if p['id'] == 'mpsc-group-b-si-excise-2014-p3'}, {75})
        recovered_2018 = {
            'si-police-ub-2018-english': (80, 1),
            'si-police-ub-2018-gk': (100, 0),
            'si-police-ub-2018-mathematics': (100, 0),
            'horticulture-demonstrator-2018-english': (80, 1),
            'si-fcs-2018-english': (80, 1),
            'si-fcs-2018-gs1': (75, 0),
            'si-fcs-2018-gs2': (75, 0),
            'programmer-phe-2018-english-p1': (80, 1),
            'programmer-phe-2018-english-p2': (100, 0),
            'sericulture-seo-2018-english-p1': (80, 1),
            'sericulture-seo-2018-english-p2': (100, 0),
            'station-officer-2018-english': (80, 1),
            'station-officer-2018-gk': (100, 0),
            'station-officer-2018-mathematics': (100, 0),
        }
        for slug, (mcq_count, written_count) in recovered_2018.items():
            part = [q for q in rows if q['paperId'] == 'mpsc-group-b-' + slug]
            mcq = [q for q in part if q.get('type') != 'descriptive']
            self.assertEqual(len(mcq), mcq_count)
            self.assertEqual(len(part) - len(mcq), written_count)
            self.assertEqual({int(q['questionNumber'].lstrip('B')) for q in mcq}, set(range(1, mcq_count + 1)))
            self.assertTrue(all(q.get('sourceReview') and q['answerIndex'] == -1 for q in mcq))
            self.assertTrue(all((root / 'public' / q['imagePath'].lstrip('/')).is_file()
                                for q in part if q.get('imagePath')))
            if slug == 'programmer-phe-2018-english-p1':
                self.assertTrue(all(q.get('passage') for q in mcq if 1 <= int(q['questionNumber'].lstrip('B')) <= 8 or 25 <= int(q['questionNumber'].lstrip('B')) <= 32))
                self.assertEqual(len(next(q for q in mcq if q['questionNumber'] == 'B49')['options']), 3)
            if slug == 'sericulture-seo-2018-english-p1':
                self.assertTrue(all(q.get('passage') for q in mcq if 17 <= int(q['questionNumber'].lstrip('B')) <= 32))
            if slug == 'sericulture-seo-2018-english-p2':
                self.assertTrue(next(q for q in mcq if q['questionNumber'] == '58').get('sourceReview'))
                self.assertEqual(next(q for q in mcq if q['questionNumber'] == '58')['answerIndex'], -1)
            if slug == 'station-officer-2018-english':
                self.assertTrue(all(q.get('passage') for q in mcq if 1 <= int(q['questionNumber'].lstrip('B')) <= 12))
            if slug.endswith('-english'):
                if slug in ('si-police-ub-2018-english', 'horticulture-demonstrator-2018-english', 'si-fcs-2018-english'):
                    self.assertTrue(all(q.get('passage') for q in mcq
                                        if 17 <= int(q['questionNumber'].lstrip('B')) <= 26))
        ub = [q for q in rows if q['paperId'] == 'mpsc-group-b-si-police-ub-2018-english']
        self.assertEqual(len(next(q for q in ub if q['questionNumber'] == 'B49')['options']), 3)
        for slug, count in [('inspector-stats-2017-english', 10), ('technical-2024-p1', 10),
                            ('asi-2024-p1', 12), ('mvi-2025-p1', 13)]:
            part = [q for q in rows if q['paperId'] == 'mpsc-group-b-' + slug]
            self.assertEqual(len(part), count)
            self.assertTrue(all(q.get('type') == 'descriptive' and not q.get('sourceReview') for q in part))
        asi = [q for q in rows if q['paperId'] == 'mpsc-group-b-asi-2024-p2']
        self.assertEqual(len(asi), 100)
        self.assertTrue(all(q.get('sourceReviewed') and q['answerIndex'] == -1
                            for q in asi if q.get('sourceReview')))
        self.assertTrue(all((root / 'public' / q['imagePath'].lstrip('/')).is_file()
                            for q in asi if q.get('imagePath')))
        mixed = [q for q in rows if q['paperId'] == 'mpsc-group-b-radio-2026-p1' and q.get('type') != 'descriptive']
        self.assertTrue(mixed)
        self.assertTrue(all(q.get('paperExamExcluded') for q in mixed))

    def test_rejects_missing_recovery(self):
        del self.repair['questions']['88']
        with self.assertRaisesRegex(AssertionError, 'missing or extra'):
            reviewed_extraction(self.extracted, self.repair)

    def test_leso_and_mines_complete_reviews_preserve_official_provenance(self):
        repairs = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']
        keys = json.loads((HERE / 'verified-general-keys.json').read_text())
        root = HERE.parents[1]
        source = (root / 'src/data/banks/mpsc-group-b-general.ts').read_text()
        decoder, rows = json.JSONDecoder(), []
        for match in re.finditer(r'const groupBQuestionsPart\d+: BankQuestion\[\] = ', source):
            rows.extend(decoder.raw_decode(source, match.end())[0])
        leso = 'ng-april-2026-assistant-leso-general-english'
        mines = 'archive-lang-2026-assistant-controller-of-mines-august-2026-assistant-controller-of-mines-cd36d7cc'
        for slug, written_count, ready_count in [(leso, 3, 65), (mines, 4, 66)]:
            with self.subTest(slug=slug):
                repair = repairs[slug]
                self.assertFalse(repair['partialReview'])
                self.assertEqual(set(map(int, repair['questions'])), set(range(1, 67)))
                self.assertEqual(set(map(int, repair['derivedAnswers'])), set(range(1, 67)))
                self.assertEqual(set(map(int, keys[slug]['answers'])), set(range(1, 67)))
                part = [q for q in rows if q['paperId'] == 'mpsc-group-b-' + slug]
                mcqs = [q for q in part if q.get('type') != 'descriptive']
                written = [q for q in part if q.get('type') == 'descriptive']
                self.assertEqual(len(mcqs), 66)
                self.assertEqual(len(written), written_count)
                self.assertEqual(sum(q['answerIndex'] >= 0 and not q.get('sourceReview') for q in mcqs), ready_count)
                for q in mcqs:
                    self.assertTrue(q['sourceReviewed'])
                    self.assertEqual(q['answerSource'], 'official')
                    self.assertEqual(q['independentAnswerSource'], 'solved')
                    self.assertTrue(q['direction'].strip() and q['explanation'].strip())
                    self.assertTrue(q['paperExamExcluded'])
                    self.assertTrue((root / 'public' / q['answerKeyRef'].split('#')[0].lstrip('/')).is_file())
                self.assertTrue(all(q['sourceReviewed'] and not q['sourceReview'] and q['explanation'].strip() for q in written))
                if slug == mines:
                    self.assertTrue(all(q['answerIndex'] == q['independentAnswerIndex'] for q in mcqs))
                    self.assertIn('high professional and with absolute tact', repair['questions']['11']['q'])
                    self.assertEqual(repair['derivedAnswers']['11']['answerIndex'], 2)
                    vocabulary = next(q for q in written if q['id'].endswith('-written-4'))
                    self.assertEqual(vocabulary['questionNumber'], '3.4')
                    self.assertIn('invasive', vocabulary['passage'])
                    self.assertIn('subquestion 4', vocabulary['direction'])
                else:
                    held = next(q for q in mcqs if q['questionNumber'] == 'B58')
                    self.assertEqual(held['answerIndex'], -1)
                    self.assertEqual(held['officialAnswerCandidates'], [1])
                    self.assertEqual(held['independentAnswerIndex'], 3)
                    self.assertTrue(held['sourceReview'])
                    self.assertIn('official key gives B', held['disputeNote'])
                    self.assertIn('__*Bible*__', repair['questions']['1']['q'])

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
        partial['derivedAnswers'] = {}
        del partial['questions']['3']['opts']['d']
        result, reviewed = reviewed_extraction(self.extracted, partial)
        self.assertEqual(reviewed, {3})
        question = next(q for q in result['questions'] if q['n'] == 3)
        self.assertEqual(tuple(question['opts']), ('a', 'b', 'c'))

    def test_allows_explicit_partial_review(self):
        partial = copy.deepcopy(self.repair)
        partial['partialReview'] = True
        partial['questions'] = {'3': partial['questions']['3']}
        partial['derivedAnswers'] = {}
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
