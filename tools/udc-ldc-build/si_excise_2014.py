"""Import the source-backed Sub-Inspector Excise 2014 papers."""
import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent


def build_si_excise_2014():
    data = json.loads((HERE / 'extracted' / 'si-excise-2014.json').read_text())
    repairs = json.loads((HERE / 'group-b-text-repairs.json').read_text())['papers']
    papers, questions, meta, library = [], [], {}, []
    for paper in data['papers']:
        pid = paper['id']
        href = '/papers/group-b/' + paper['pdf']
        source_pdf = ROOT / 'public' / href.lstrip('/')
        assert source_pdf.is_file(), href
        assert hashlib.sha256(source_pdf.read_bytes()).hexdigest() == paper['sourceSha256'], f'Source scan changed: {pid}'
        rows = paper['questions']
        repair = repairs.get(pid) or {}
        if repair:
            assert repair['sourceSha256'] == paper['sourceSha256'], f'Stale source review: {pid}'
            assert repair.get('partialReview'), f'Expected an explicitly partial review: {pid}'
            by_number = {row['n']: row for row in rows}
            by_number.update({int(n): row for n, row in repair['questions'].items()})
            rows = [by_number[n] for n in sorted(by_number)]
        paper_id = 'mpsc-group-b-' + pid
        papers.append({
            'id': paper_id, 'examType': 'Direct',
            'examName': 'Sub-Inspector under Excise & Narcotics Department',
            'post': 'Sub-Inspector under Excise & Narcotics Department',
            'paperNumber': paper['paperNumber'], 'paperSubject': paper['subject'],
            'year': 2014, 'sourceFile': href,
        })
        entry = {
            'id': paper_id, 'exam': 'Sub-Inspector under Excise & Narcotics Department',
            'sitting': 'March 2014', 'subject': paper['subject'], 'sourceHref': href,
            'keyHref': None, 'imported': True, 'reviewRequired': True,
        }
        if paper.get('expectedMcq'):
            entry['expectedMcq'] = paper['expectedMcq']
        if repair:
            entry['expectedMcq'] = repair['expectedMcq']
            entry['reviewRequired'] = True
        library.append(entry)
        if paper.get('marksPerQuestion'):
            meta[paper_id] = {
                'marksPerQuestion': paper['marksPerQuestion'],
                'durationMinutes': paper['durationMinutes'],
                'negativeMarking': False, 'penaltyFraction': 0,
            }
        for row in rows:
            qid = paper_id + '-q' + str(row['n']).zfill(3)
            reviewed = repair.get('questions', {}).get(str(row['n'])) if repair else None
            answer = repair.get('derivedAnswers', {}).get(str(row['n'])) if repair else None
            options = [row['opts'][key] for key in 'abcd' if key in row['opts']] if reviewed else row.get('options') or []
            section, topic = paper['section'], 'general'
            if pid == 'si-excise-2014-p3':
                if 58 <= row['n'] <= 65:
                    section = 'arithmetic'
                    topic = {58:'profit_loss', 59:'simple_compound_interest', 60:'number_system',
                             61:'speed_distance_time', 62:'average', 63:'data_interpretation',
                             64:'number_system', 65:'number_system'}[row['n']]
                elif 66 <= row['n'] <= 67:
                    section, topic = 'reasoning', 'number_series'
                elif 72 <= row['n'] <= 75:
                    section = 'reasoning'
                    topic = 'paper_folding' if row['n'] == 72 else 'figure_series'
            base = {
                'id': qid, 'paperId': paper_id,
                'questionNumber': str(row['n']), 'subject': section,
                'studySection': section, 'topic': topic,
                'topicLabel': paper['subject'] if topic == 'general' else topic.replace('_', ' ').title(), 'difficulty': 'medium',
                'question': reviewed['q'] if reviewed else row['q'], 'explanation': answer['explanation'] if answer else '',
                'source': 'Sub-Inspector Excise & Narcotics · March 2014',
                'year': 2014,
                'sourceHref': href + '#page=' + str(row.get('page', 1)),
            }
            if reviewed and reviewed.get('direction'):
                base['direction'] = reviewed['direction']
            if reviewed and reviewed.get('imagePath'):
                base['imagePath'] = reviewed['imagePath']
            if row.get('type') == 'descriptive':
                base.update({
                    'type': 'descriptive', 'topic': 'written',
                    'topicLabel': 'General English · written',
                    'sourceReview': True,
                    'sourceNote': 'Written prompt transcribed from the official paper; response guidance is not yet added.',
                })
                questions.append(base)
                continue
            assert len(options) == 4 and all(o.strip() for o in options), (pid, row['n'])
            held = bool(reviewed and reviewed.get('unscored'))
            candidate = answer.get('answerIndex', -1) if answer else row.get('candidateAnswerIndex', -1)
            base.update({
                'options': options, 'answerIndex': candidate if answer and not held else -1,
                'sourceReview': held if reviewed else True,
                'paperExamExcluded': True,
                'sourceNote': (reviewed.get('reviewNote') if held else 'Text and option order checked against the available scan; answer independently derived.') if reviewed else 'Imported from the available transcription; verify text and answer against the printed paper before scoring.',
            })
            if reviewed:
                base['sourceReviewed'] = True
                if answer and not held:
                    base.update({'answerSource': 'derived', 'answerConfidence': 'high'})
            if held:
                base['disputeNote'] = reviewed['reviewNote']
            if candidate in range(4) and not answer:
                base.update({
                    'independentAnswerIndex': candidate,
                    'independentAnswerSource': 'legacy-inferred',
                    'answerConfidence': 'low',
                })
            questions.append(base)
    return papers, questions, meta, library
