"""Import the source-backed Sub-Inspector Excise 2014 papers."""
import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent


def build_si_excise_2014():
    data = json.loads((HERE / 'extracted' / 'si-excise-2014.json').read_text())
    papers, questions, meta, library = [], [], {}, []
    for paper in data['papers']:
        pid = paper['id']
        href = '/papers/group-b/' + paper['pdf']
        source_pdf = ROOT / 'public' / href.lstrip('/')
        assert source_pdf.is_file(), href
        assert hashlib.sha256(source_pdf.read_bytes()).hexdigest() == paper['sourceSha256'], f'Source scan changed: {pid}'
        rows = paper['questions']
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
        library.append(entry)
        if paper.get('marksPerQuestion'):
            meta[paper_id] = {
                'marksPerQuestion': paper['marksPerQuestion'],
                'durationMinutes': paper['durationMinutes'],
                'negativeMarking': False, 'penaltyFraction': 0,
            }
        for row in rows:
            qid = paper_id + '-q' + str(row['n']).zfill(3)
            base = {
                'id': qid, 'paperId': paper_id,
                'questionNumber': str(row['n']), 'subject': paper['section'],
                'studySection': paper['section'], 'topic': 'general',
                'topicLabel': paper['subject'], 'difficulty': 'medium',
                'question': row['q'], 'explanation': '',
                'source': 'Sub-Inspector Excise & Narcotics · March 2014',
                'year': 2014,
                'sourceHref': href + '#page=' + str(row.get('page', 1)),
            }
            if row.get('type') == 'descriptive':
                base.update({
                    'type': 'descriptive', 'topic': 'written',
                    'topicLabel': 'General English · written',
                    'sourceReview': True,
                    'sourceNote': 'Written prompt transcribed from the official paper; response guidance is not yet added.',
                })
                questions.append(base)
                continue
            options = row.get('options') or []
            assert len(options) == 4 and all(o.strip() for o in options), (pid, row['n'])
            candidate = row.get('candidateAnswerIndex', -1)
            base.update({
                'options': options, 'answerIndex': -1, 'sourceReview': True,
                'paperExamExcluded': True,
                'sourceNote': 'Imported from the available transcription; verify text and answer against the printed paper before scoring.',
            })
            if candidate in range(4):
                base.update({
                    'independentAnswerIndex': candidate,
                    'independentAnswerSource': 'legacy-inferred',
                    'answerConfidence': 'low',
                })
            questions.append(base)
    return papers, questions, meta, library
