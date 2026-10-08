"""Eligible general papers and adapters for existing, source-reviewed solutions.

Classification comes from the printed Group B NG headers or recruitment
advertisements. The archive's Direct_NG directory alone is not evidence:
it also contains Group A Mines and Group B Gazetted LESO papers.
"""
import importlib.util
import json
import shutil
import re
from collections import defaultdict
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT.parent / 'mpsc-question-bank' / 'pdfs' / 'Old_Questions'
HERE = Path(__file__).parent
PUBLIC = ROOT / 'public' / 'papers' / 'group-b'


def normalized(text):
    return re.sub(r'[^a-z0-9]', '', (text or '').lower())


def legacy_answers():
    result = defaultdict(set)
    for file in ['mpsc_bank_converted.json', 'mpsc_bank_v2.json']:
        bank = json.loads((ROOT.parent / 'mpsc-question-bank' / 'bank' / file).read_text())
        for q in bank['questions']:
            idx = q.get('answerIndex', -1)
            opts = q.get('options') or []
            if isinstance(idx, int) and 0 <= idx < len(opts):
                result[normalized(q.get('question'))].add(normalized(opts[idx]))
    return result

# slug, exam, sitting, subject, source filename; canonical series only.
GENERAL_PAPERS = [
 ('inspector-stats-2026-p1', 'Inspector of Statistics', 'March 2026', 'General English', 'Inspector of Statistics Paper-I (English)..pdf'),
 ('inspector-stats-2026-p2', 'Inspector of Statistics', 'March 2026', 'General Knowledge & General Mathematics', 'Inspector of Statistics Paper-II..pdf'),
 ('inspector-stats-2017-english', 'Inspector of Statistics', 'February 2017', 'General English', 'Inspector of Statistics- General English- 2017..pdf'),
 ('steno2-2015-english', 'Stenographer Grade II, DP&AR', '2015', 'General English', '1.STENOGRAPHER GRADE-II (CONTRACT) UNDER DP&AR (SSW),2015General English.pdf'),
 ('steno2-2015-gk', 'Stenographer Grade II, DP&AR', '2015', 'General Knowledge', '2.STENOGRAPHER GRADE-II (CONTRACT) UNDER DP&AR (SSW),2015General Knowledge.pdf'),
 ('technical-2024-p1', 'Group B technical common exam', 'November 2024', 'General English', 'Group B(NG) (Technical)Paper-I (General English)-2024..pdf'),
 ('aao-2024-english', 'Assistant Audit & Accounts Officer / Assistant Accounts Officer', 'September 2024', 'General English', 'Assistant Audit & Account Officer General English-2024..pdf'),
 ('aao-2024-gk', 'Assistant Audit & Accounts Officer / Assistant Accounts Officer', 'September 2024', 'General Knowledge', 'Assistant Audit & Account Officer General Knowledge-2024...pdf'),
 ('aao-2024-arithmetic', 'Assistant Audit & Accounts Officer / Assistant Accounts Officer', 'September 2024', 'Arithmetic', 'Assistant Audit & Account Officer Arithmetic-2024..pdf'),
 ('jao-2025-p1', 'District Organiser / Junior Accounts Officer', 'January 2025', 'General English', '1. Junior Accounts Officer General English Paper-I.pdf'),
 ('jao-2025-p2', 'District Organiser / Junior Accounts Officer', 'January 2025', 'General Knowledge & Reasoning', '2.Junior Accounts Officer General Knowledge & Reasoning Paper-II A.pdf'),
 ('asi-2024-p1', 'Assistant Sub-Inspector of Police (Ministerial)', 'November 2024', 'General English', 'ASI (M) General English Paper-I..pdf'),
 ('asi-2024-p2', 'Assistant Sub-Inspector of Police (Ministerial)', 'November 2024', 'General Knowledge & Reasoning', 'ASI (M) General Knowledge & Reasoning Paper-II..pdf'),
 ('steno-2024-english', 'Stenographer Grade III, DP&AR', 'November 2024', 'General English', 'Steno Grade-III General English- November, 2024..pdf'),
 ('steno-2024-gk', 'Stenographer Grade III, DP&AR', 'November 2024', 'General Knowledge', 'Steno Grade-III General Knowledge- November, 2024..pdf'),
 ('steno-2025-english', 'Stenographer Grade III, Lokayukta', 'March 2025', 'General English', 'Stenographer Grade-III General English March-2025..pdf'),
 ('steno-2025-gk', 'Stenographer Grade III, Lokayukta', 'March 2025', 'General Knowledge', 'Stenographer Grade-III General Knowledge March-2025..pdf'),
 ('steno2-2025-p1', 'Stenographer Grade II, MPSC', 'May 2025', 'General English', 'Stenographer Grade-II (Contract) under MPSC - Paper-I (General English)..pdf'),
 ('je-2016-english', 'Junior Engineer, PHE & PWD', 'April 2016', 'General English', 'Junior Engineer General English-2016..pdf'),
 ('je-2025-english', 'Junior Engineer, LAD, PWD & I&WR', 'April 2025', 'General English', 'JE under LAD& PWD Deptt. General English Paper-I April-2025..pdf'),
 ('je-2025-gk', 'Junior Engineer, LAD, PWD & I&WR', 'April 2025', 'General Knowledge', 'JE under LAD& PWD Deptt. General Knowledge Paper-II April-2025 ( A )..pdf'),
 ('je-agri-2026-p1', 'Junior Engineer, Agriculture & Farmer Welfare', 'March 2026', 'General English', 'JE under Agri&Farmer Welfare March-2026 Paper-I (Gen. English)..pdf'),
 ('si-excise-2024-p1', 'Sub-Inspector of Excise & Narcotics', 'August 2024', 'General English', 'Sub-Inspector of Excise Paper-I August-2024..pdf'),
 ('si-excise-2024-p2', 'Sub-Inspector of Excise & Narcotics', 'August 2024', 'General Knowledge', 'Sub-Inspector of Excise Paper-II August-2024..pdf'),
 ('si-excise-2025-p1', 'Sub-Inspector of Excise & Narcotics', 'April 2025', 'General English', 'Sub-Inspector of Excise General English Paper-I April-2025..pdf'),
 ('si-excise-2025-p2', 'Sub-Inspector of Excise & Narcotics', 'April 2025', 'General Knowledge & Reasoning', 'Sub-Inspector of Excise General Knowledge Paper-II April-2025 A..pdf'),
 ('si-fcs-2025-p1', 'Sub-Inspector FCS&CA / Receptionist H&FW', 'May 2025', 'General English', 'Paper-I General English (Series A)..pdf'),
 ('si-fcs-2025-p2', 'Sub-Inspector FCS&CA / Receptionist H&FW', 'May 2025', 'General Knowledge, Arithmetic & Reasoning', 'Paper-II (Series A)..pdf'),
 ('aao-2025-p1', 'AAO / AAAO / Field Facilitator', 'November 2025', 'General English', 'General English - Series A..pdf'),
 ('aao-2025-p2', 'AAO / AAAO / Field Facilitator', 'November 2025', 'General Knowledge, Arithmetic & Reasoning', 'General Knowledge - Series A..pdf'),
 ('mvi-2025-p1', 'Motor Vehicle Inspector', 'September 2025', 'General English', 'Paper-I (Gen. English), MV Sept.-2025..pdf'),
 ('mvi-2025-p2', 'Motor Vehicle Inspector', 'September 2025', 'General Knowledge', 'Paper-II (General Knowledge), MVI Sept.-2025..pdf'),
 ('hfw-2026-p1', 'Group B technical common exam, Health & Family Welfare', 'January 2026', 'General English', 'General English Paper-I 2026..pdf'),
 ('hfw-2026-p2', 'Group B technical common exam, Health & Family Welfare', 'January 2026', 'General Studies', 'General Studies Paper-II 2026..pdf'),
 ('radio-2026-p1', 'Radiotherapy Technologist', 'April 2026', 'General English', 'Radiotherapy Technologist Paper-I (English)..pdf'),
 ('radio-2026-p2', 'Radiotherapy Technologist', 'April 2026', 'General Knowledge', 'Radiotherapy Technologist Paper-II (General Knowledge)..pdf'),
 ('si-police-2026-p1', 'Sub-Inspector of Police (Un-armed Branch)', 'March 2026', 'General English', 'Sub-Inspector of Police (UB) March-2026 Paper-I.pdf'),
 ('si-police-2026-p2', 'Sub-Inspector of Police (Un-armed Branch)', 'March 2026', 'General Knowledge & Reasoning', 'Sub-Inspector of Police (UB) March-2026 Paper-II..pdf'),
]
GENERAL_ARCHIVE_FOLDERS = {
 'inspector-stats-2026-p1': 'Direct_2025-2027', 'inspector-stats-2026-p2': 'Direct_2025-2027',
 'inspector-stats-2017-english': 'Direct_2014-2018', 'steno2-2015-english': 'Direct_2014-2018', 'steno2-2015-gk': 'Direct_2014-2018',
}


def source_path(slug, filename):
    return ARCHIVE / GENERAL_ARCHIVE_FOLDERS.get(slug, 'Direct_NG_2024-2027') / filename
HUB_FILES = {
 'jao-2026-p1': ('Direct_2025-2027', 'Jr. Accounts Officer Paper-I (General English) - Series-A..pdf'),
 'jao-2026-p2': ('Direct_2025-2027', 'Jr. Accounts Officer Paper-II (GK, Arithmetic & Reasoning) -Series A..pdf'),
 'co-2026-p1': ('Direct_2025-2027', 'Circle Officer April-2026 Paper-I (Series A)..pdf'),
 'co-2026-p2': ('Direct_2025-2027', 'Circle Officer April-2026 Paper-II (Series A)..pdf'),
 'si-stats-2026-p1': ('Direct_NG_2024-2027', 'Sub-Inspector of Statistic Paper-I..pdf'),
 'si-stats-2026-p2': ('Direct_NG_2024-2027', 'Sub-Inspector of Statistic Paper-II..pdf'),
 'ri-2026-p1': ('Direct_NG_2024-2027', 'Research Invetigator May-2026 Paper-I..pdf'),
 'ri-2026-p2': ('Direct_NG_2024-2027', 'Research Invetigator May-2026 Paper-II..pdf'),
}


def copy_pdf(source, slug):
    assert source.is_file(), source
    assert 'LDE' not in source.name and 'Departmental' not in str(source)
    dest = PUBLIC / (slug + '.pdf')
    if not dest.exists() or hashlib.sha256(dest.read_bytes()).digest() != hashlib.sha256(source.read_bytes()).digest():
        shutil.copyfile(source, dest)
    return '/papers/group-b/' + dest.name


def reviewed_extraction(extracted, repair):
    """Merge visually reviewed text without changing cached OCR or answers."""
    if not repair:
        return extracted, set()
    assert repair['sourceSha256'] == extracted['sourceSha256'], 'Stale source-reviewed repairs'
    assert repair.get('evidence') and repair.get('reviewedOn'), 'Missing review evidence'
    rows = {q['n']: q for q in extracted['questions']}
    assert len(rows) == len(extracted['questions']), 'Duplicate extracted question numbers'
    reviewed = set()
    for number, q in repair['questions'].items():
        n = int(number)
        assert q['n'] == n and 1 <= n <= repair['expectedMcq'], 'Invalid repaired number'
        assert q['q'].strip() and q['page'] > 0, 'Missing repaired text or source page'
        assert set(q['opts']) == set('abcd') and all(v.strip() for v in q['opts'].values()), 'Invalid repaired options'
        assert not q.get('explanation') or q['explanation'].strip(), 'Invalid reviewed explanation'
        assert 'answerIndex' not in q and 'answer' not in q, 'Text repairs cannot override answers'
        assert not q.get('unscored') or q.get('explanation', '').strip(), 'Unscored dispute needs an explanation'
        assert not q.get('reviewNote') or q.get('reviewNote', '').strip(), 'Invalid dispute note'
        rows[n] = q
        reviewed.add(n)
    for number, solved in repair.get('derivedAnswers', {}).items():
        n = int(number)
        assert n in reviewed and 0 <= solved.get('answerIndex', -1) < 4, 'Derived answer needs a reviewed question and valid option'
        assert solved.get('explanation', '').strip(), 'Derived answer needs a worked explanation'
    expected = set(range(1, repair['expectedMcq'] + 1))
    if repair.get('partialReview'):
        assert set(rows) <= expected, 'Partial repair has extra questions'
    else:
        assert set(rows) == expected, 'Repair left missing or extra questions'
    return {**extracted, 'questions': [rows[n] for n in sorted(rows)]}, reviewed


def build_additional():
    spec = importlib.util.spec_from_file_location('group_b_taxonomy', ROOT / 'tools' / 'practice-hub-build' / 'taxonomy.py')
    taxonomy = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(taxonomy)
    verified = json.loads((HERE / 'verified-general-keys.json').read_text()) if (HERE / 'verified-general-keys.json').exists() else {}
    repairs = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']
    assert set(repairs) <= {row[0] for row in GENERAL_PAPERS}, 'Orphan source-reviewed repair paper'
    papers, questions, meta, library = [], [], {}, []
    legacy = legacy_answers()
    for slug, exam, sitting, subject, file in GENERAL_PAPERS:
        href = copy_pdf(source_path(slug, file), slug)
        entry = {'id': 'mpsc-group-b-' + slug, 'exam': exam, 'sitting': sitting,
                 'subject': subject, 'sourceHref': href, 'keyHref': None, 'imported': False}
        if slug.startswith('aao-2024-'):
            entry['keyHref'] = '/papers/group-b/keys/final-answer-key-of-assistant-audit-accounts-officer-and-assistant-accounts-officer-under-finance-dept.pdf'
            entry['correctionHref'] = '/papers/group-b/keys/corrigendum-of-final-answer-key-for-assistant-audit-accounts-officer-and-assistant-accounts-officer-under-finance-dept.pdf'
        if slug.startswith('si-excise-2025-'):
            entry['keyHref'] = '/papers/group-b/keys/final-answer-key-for-sub-inspector-of-excise-under-exise-narcotics-department.pdf'
        if slug.startswith('si-police-2026-'):
            entry['keyHref'] = '/papers/group-b/keys/si-police-2026-final-key.pdf'
        if slug.startswith('radio-2026-'):
            entry['keyHref'] = '/papers/group-b/keys/provisional-answer-key-of-radiotherapy-technologist-contract-under-hfw-deptt.pdf'
        library.append(entry)
        extraction_path = HERE / 'extracted' / (slug + '.json')
        if not extraction_path.exists():
            continue
        extracted = json.loads(extraction_path.read_text())
        assert extracted.get('sourceSha256') == hashlib.sha256(source_path(slug, file).read_bytes()).hexdigest(), f'Re-extract changed source: {slug}'
        extracted, reviewed_numbers = reviewed_extraction(extracted, repairs.get(slug))
        reviewed_written = repairs.get(slug, {}).get('written') or {}
        if not extracted['questions'] and not extracted['written']:
            continue
        paper_id = entry['id']
        key = verified.get(slug)
        if key:
            entry['keyHref'] = key['href']
            entry['expectedMcq'] = len(key['answers'])
        complete_source_review = (bool(key)
                                  and reviewed_numbers == {int(n) for n in key['answers']}
                                  and not any(q.get('unscored') for q in (repairs.get(slug, {}).get('questions') or {}).values())
                                  # This English paper also has a written Section A;
                                  # its prompts are not yet recovered in the bank.
                                  and slug not in ('steno-2025-english', 'si-excise-2025-p1')
                                  and all(isinstance(answer, str) and answer in 'ABCD'
                                          for answer in key['answers'].values()))
        entry['imported'] = True
        entry['reviewRequired'] = not complete_source_review
        papers.append({'id': paper_id, 'examType': 'Direct_NG', 'examName': exam, 'post': exam,
                       'paperNumber': 'Paper-I' if slug.endswith('-p1') else 'Paper-II' if slug.endswith('-p2') else subject,
                       'paperSubject': subject, 'year': int(sitting[-4:]), 'sourceFile': href})
        part_questions = [q for q in extracted['questions'] if not ('English' in subject and q.get('part') == 'A')]
        # Only the native key-backed sections whose full numbering is verified
        # enter scoring. OCR and malformed options stay visible for review.
        complete_native = bool(key) and not extracted['ocr'] and {q['n'] for q in part_questions} == {int(n) for n in key['answers']}
        if slug == 'aao-2024-gk' and reviewed_numbers:
            # Printed page 1: 100 marks, one per question, three hours.
            meta[paper_id] = {'marksPerQuestion': 1, 'durationMinutes': 180,
                             'negativeMarking': False, 'penaltyFraction': 0}
        if slug in ('steno-2025-gk', 'steno-2025-english') and reviewed_numbers:
            # Printed cover: one mark per question, three hours; no penalty is
            # stated in the instructions.
            meta[paper_id] = {'marksPerQuestion': 1, 'durationMinutes': 180,
                             'negativeMarking': False, 'penaltyFraction': 0}
        if slug == 'si-excise-2025-p1' and reviewed_numbers:
            # Printed cover/instructions: two marks per MCQ, three hours; no
            # negative marking is stated. The separate written section remains
            # incomplete, so these MCQs are excluded from full-paper Exam mode.
            meta[paper_id] = {'marksPerQuestion': 2, 'durationMinutes': 180,
                             'negativeMarking': False, 'penaltyFraction': 0}
        if slug in ('aao-2024-english', 'aao-2024-arithmetic') and reviewed_numbers:
            # The AAO paper instructions specify 100 one-mark questions and
            # three hours; this metadata supports practice for reviewed items.
            meta[paper_id] = {'marksPerQuestion': 1, 'durationMinutes': 180,
                             'negativeMarking': False, 'penaltyFraction': 0}
        if slug == 'inspector-stats-2026-p2' and repairs.get(slug, {}).get('derivedAnswers'):
            # Printed cover: 100 one-mark questions in two hours.
            meta[paper_id] = {'marksPerQuestion': 1, 'durationMinutes': 120,
                             'negativeMarking': False, 'penaltyFraction': 0}
        if slug == 'aao-2025-p2' and repairs.get(slug, {}).get('derivedAnswers'):
            # Printed cover: 100 two-mark questions in two hours, with negative marking.
            meta[paper_id] = {'marksPerQuestion': 2, 'durationMinutes': 120,
                             'negativeMarking': True, 'penaltyFraction': 1/3}
        if complete_native and slug.startswith(('radio-', 'si-police-')):
            meta[paper_id] = {'marksPerQuestion': 2 if slug == 'si-police-2026-p2' else 1,
                             'durationMinutes': 180 if 'English' in subject else 120, 'negativeMarking': True, 'penaltyFraction': 1/3}
        for q in extracted['questions']:
            if 'English' in subject and q.get('part') == 'A':
                questions.append({'id': paper_id + '-conventional-' + str(q['n']), 'paperId': paper_id, 'type': 'descriptive',
                                  'questionNumber': 'A' + str(q['n']), 'subject': 'english', 'studySection': 'english', 'topic': 'written',
                                  'topicLabel': 'General English · written', 'difficulty': 'medium', 'question': q['q'] + '\n' + '\n'.join(f"{k}. {v}" for k,v in q['opts'].items()),
                                  'explanation': '', 'sourceReview': True, 'sourceNote': 'Conventional response; transcription awaiting review.',
                                  'source': exam + ' · ' + sitting, 'year': int(sitting[-4:]), 'sourceHref': href + '#page=' + str(q['page'])})
                continue
            opts = [q['opts'][x] for x in 'abcd']
            candidates = legacy.get(normalized(q['q']), set())
            matching = [i for i, option in enumerate(opts) if normalized(option) in candidates]
            independent = matching[0] if len(matching) == 1 else -1
            conventional = 'English' in subject and q.get('part') == 'A'
            cell = key['answers'].get(str(q['n']), 'unmatched') if key and not conventional else 'unmatched'
            key_ref = key.get('correctionRefs', {}).get(str(q['n']), key['href']) if key else None
            key_choices = ['ABCD'.index(x) for x in cell.split('&')] if isinstance(cell, str) and cell != 'unmatched' else []
            derived = (repairs.get(slug, {}).get('derivedAnswers') or {}).get(str(q['n']))
            layout = bool(re.search(r'\b(figure|diagram|matrix|List\s*[-–]?\s*I|underlined)\b', q['q'] + ' ' + (q.get('direction') or ''), re.I) and '**' not in q['q'])
            bad_text = bool(re.search(r'[\ue000-\uf8ff�]', q['q'])) or any(not option.strip() or len(option) > 600 or re.search(r'[\ue000-\uf8ff�]', option) for option in opts)
            text_reviewed = q['n'] in reviewed_numbers
            source_review = ((extracted['ocr'] or not complete_native or layout) and not text_reviewed) or bad_text or (len(key_choices) != 1 and not derived) or bool(q.get('unscored'))
            answer = key_choices[0] if key_choices and not source_review else derived['answerIndex'] if derived and not source_review else -1
            note = 'Text extraction needs comparison with the printed paper; candidate answers are not scored.' if source_review else ''
            if q.get('unscored'):
                note = q.get('reviewNote') or 'The official key conflicts with the grammar of the printed conditional; held out from scoring pending clarification.'
            if text_reviewed and not source_review:
                note = ('Text and option order checked against the printed scan; scored using the official key.'
                        if key_choices else 'Text and option order checked against the printed scan; scored from a worked derivation.')
            if len(key_choices) > 1:
                note = 'The official key accepts ' + ' and '.join('ABCD'[x] for x in key_choices) + '; this item is kept out of the single-answer drill.'
            if independent >= 0 and not (derived and text_reviewed):
                note += ' The independent candidate came from the legacy inferred bank and still needs reasoning review.'
            section = 'english' if 'English' in subject else 'arithmetic' if subject == 'Arithmetic' else 'gk'
            if slug == 'inspector-stats-2026-p2' and q['n'] > 50:
                section = 'arithmetic'
            questions.append({'id': paper_id + '-' + (q.get('part') or 'Q') + str(q['n']), 'paperId': paper_id,
                              'questionNumber': (q.get('part') or '') + str(q['n']), 'subject': 'english' if section == 'english' else 'gk',
                              'studySection': section, 'topic': 'general', 'topicLabel': subject, 'difficulty': 'medium',
                              'question': q['q'], 'options': opts, 'answerIndex': answer,
                              'explanation': q.get('explanation', ''),
                              'source': exam + ' · ' + sitting, 'year': int(sitting[-4:]), 'sourceHref': href + '#page=' + str(q['page']),
                              **({'independentAnswerIndex': independent, 'independentAnswerSource': 'legacy-inferred', 'answerConfidence': 'low'} if independent >= 0 and not (derived and text_reviewed) else {}),
                              **({'officialAnswerCandidates': key_choices, 'answerSource': 'official', 'answerKeyRef': key_ref} if key_choices else {}),
                              **({'answerSource': 'derived', 'answerConfidence': 'high', 'explanation': derived['explanation']} if derived and answer >= 0 else {}),
                              **({'imagePath': q['imagePath']} if q.get('imagePath') else {}),
                              **({'answerSource': 'official', 'answerKeyRef': key_ref, 'compensated': True} if cell is None else {}),
                              **({'sourceReview': True, 'paperExamExcluded': True} if source_review else {}),
                              **({'paperExamExcluded': True} if text_reviewed and not complete_native and not complete_source_review else {}),
                              **({'sourceNote': note.strip()} if note else {}),
                              **({'direction': q['direction']} if q.get('direction') else {}),
                              **({'disputeNote': f"Legacy inferred candidate gives {'ABCD'[independent]}; the final key gives {'ABCD'[key_choices[0]]}. Verify the printed item."} if independent >= 0 and len(key_choices) == 1 and independent != key_choices[0] else {})})
        written_rows = {str(q.get('n') or i+1): q for i, q in enumerate(extracted['written'])}
        for number, written_review in reviewed_written.items():
            if number not in written_rows:
                written_rows[number] = {'n': int(number), 'page': written_review.get('page', 0), 'text': '', 'subparts': {}}
        for i, (number, q) in enumerate(sorted(written_rows.items(), key=lambda pair: int(pair[0]))):
            written_review = reviewed_written.get(number)
            if not q.get('text', '').strip():
                if not written_review:
                    continue
            if written_review:
                assert written_review.get('q', '').strip() and written_review.get('explanation', '').strip() and written_review.get('page', q.get('page', 0)) > 0
            prompt = written_review['q'] if written_review else q['text'] + ('\n' + '\n'.join(f"{k}. {v}" for k,v in q['subparts'].items()) if q.get('subparts') else '')
            n = q.get('n') or i+1
            questions.append({'id': paper_id + '-written-' + str(n), 'paperId': paper_id, 'type': 'descriptive',
                              'questionNumber': str(n), 'subject': 'english', 'studySection': 'english',
                              'topic': 'written', 'topicLabel': 'General English · written', 'difficulty': 'medium',
                              'question': prompt,
                              'explanation': written_review.get('explanation', '') if written_review else '',
                              'sourceReview': not bool(written_review), 'sourceNote': '' if written_review else 'Written response and transcription awaiting source review.',
                              'source': exam + ' · ' + sitting, 'year': int(sitting[-4:]), 'sourceHref': href + '#page=' + str(written_review.get('page', q['page']) if written_review else q['page'])})
    for hub_id, (folder, file) in HUB_FILES.items():
        d = json.loads((ROOT / 'tools' / 'practice-hub-build' / 'staged' / (hub_id + '.json')).read_text())
        slug = 'mpsc-group-b-' + hub_id
        href = copy_pdf(ARCHIVE / folder / file, hub_id)
        key = verified.get(hub_id)
        papers.append({'id': slug, 'examType': 'Direct_NG', 'examName': d['exam'], 'post': d['examShort'],
                       'paperNumber': d['paper'], 'paperSubject': d['paperTitle'], 'year': d['year'], 'sourceFile': href})
        meta[slug] = {'marksPerQuestion': d['markPerQuestion'], 'durationMinutes': d['durationMin'],
                      'negativeMarking': bool(d['negativeMark']), 'penaltyFraction': 1/3 if d['negativeMark'] else 0}
        library.append({'id': slug, 'exam': d['exam'], 'sitting': d['sitting'], 'subject': d['paperTitle'],
                        'sourceHref': href, 'keyHref': key['href'] if key else None, 'imported': True, 'expectedMcq': len(d['questions'])})
        passages = {x['id']: x.get('passage') or x.get('text') or x.get('prompt', '') for x in d.get('descriptive', [])}
        for q in d['questions']:
            group, label, known = taxonomy.resolve(q.get('topic') or '')
            section = 'english' if group == 'english' or 'English' in d['paperTitle'] else 'arithmetic' if group == 'aptitude' else 'reasoning' if group == 'reasoning' else 'gk'
            if hub_id == 'si-stats-2026-p2' and q.get('part') == 'A':
                section = 'arithmetic'
            independent = 'abcd'.index(q['answer']) if q.get('answer') in list('abcd') else -1
            answer = independent
            conventional_mcq = q.get('part') == 'A' and 'English' in d['paperTitle']
            key_cell = key['answers'].get(str(q['n']), 'unmatched') if key and not conventional_mcq else 'unmatched'
            compensated = key_cell is None
            if key_cell != 'unmatched':
                answer = 'ABCD'.index(key_cell) if key_cell else -1
            flag = q.get('flag')
            questions.append({
                'id': slug + '-' + q['id'], 'questionNumber': q.get('part', '') + str(q['n']), 'paperId': slug, 'subject': 'english' if section == 'english' else 'reasoning' if section == 'reasoning' else 'gk',
                'studySection': section, 'topic': q.get('topic') or 'general', 'topicLabel': label, 'difficulty': 'medium',
                'question': q['q'] + ('\n' + q['figure'] if q.get('figure') else ''), 'options': [q['opts'][x] for x in 'abcd'],
                'answerIndex': answer, 'explanation': q.get('why') or '', 'answerConfidence': q.get('conf') or 'low',
                'answerSource': 'official' if key_cell != 'unmatched' else 'derived',
                **({'answerKeyRef': key['href'], 'independentAnswerIndex': independent} if key_cell != 'unmatched' and independent >= 0 else {}),
                **({'compensated': True} if compensated else {}),
                **({'direction': q['direction']} if q.get('direction') else {}),
                **({'passage': passages[q['passageRef']]} if q.get('passageRef') in passages else {}),
                **({'disputeNote': f"Independent solution gives {'ABCD'[independent]}; MPSC final key gives {key_cell}. " + (flag or '')}
                   if key_cell not in ('unmatched', None) and independent >= 0 and answer != independent else {'sourceNote': flag} if flag else {}),
                **({'paperExamExcluded': True} if conventional_mcq else {}),
                **({'gkKind': 'current', 'answerAsOf': d['sitting'], 'gkTopic': 'current-affairs'} if q.get('topic') == 'current_affairs' else {}),
                'year': d['year'], 'source': d['exam'] + ' · ' + d['sitting'] + ' · ' + q.get('part', '') + str(q['n']),
                'sourceHref': href,
            })
        for q in d.get('descriptive', []):
            if q.get('kind') == 'passage':
                continue
            questions.append({'id': slug + '-written-' + q['id'], 'paperId': slug, 'type': 'descriptive',
                              'subject': 'english', 'studySection': 'english', 'topic': q['kind'], 'topicLabel': 'General English · written',
                              'difficulty': 'medium', 'question': q.get('prompt', '') + ('\n' + '\n'.join(q['choices']) if q.get('choices') else ''),
                              **({'passage': q['passage']} if q.get('passage') else {}), 'explanation': q.get('guidance') or '', 'guidance': q.get('guidance') or '',
                              **({'marks': q['marks']} if q.get('marks') else {}), 'year': d['year'], 'source': d['exam'] + ' · ' + d['sitting'], 'sourceHref': href})
    return papers, questions, meta, library
