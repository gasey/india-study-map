"""Keep previous essay prompts available even when false MCQ parents are removed."""
import json
import re


def is_essay_prompt(text):
    plain = str(text or '').replace('*', '').replace('_', '').strip()
    return bool(re.search(r'\b(?:write|compose)\s+(?:an?\s+)?(?:short\s+)?essays?\b', plain[:160], re.I))


def essay_archive(library, questions, build_dir):
    by_paper = {}
    for q in questions:
        if is_essay_prompt(q.get('question')):
            by_paper.setdefault(q['paperId'], []).append(q)
    output = []
    for paper in library:
        if paper.get('duplicateOf'):
            continue
        rows = by_paper.get(paper['id'], [])
        for q in rows:
            output.append({'id': q['id'], 'paperId': paper['id'], 'exam': paper['exam'],
                'year': int(paper['sitting'][-4:]), 'subject': paper['subject'],
                'question': q['question'],
                **({'options': q['options']} if q.get('options') else {}),
                'sourceHref': q.get('sourceHref', paper['sourceHref']),
                'sourceReviewed': bool(q.get('sourceReviewed'))})
        # Older parsers flattened essay topic lists into fake MCQs. Retain
        # their archive text when the reviewed MCQ pool removes those parents.
        source = build_dir / 'extracted' / (paper['id'].removeprefix('mpsc-group-b-') + '.json')
        if rows or not source.exists() or not re.search(r'English|Essay', paper['subject'], re.I):
            continue
        raw = json.loads(source.read_text())
        for q in raw.get('questions', []):
            if is_essay_prompt(q.get('q')):
                output.append({'id': paper['id'] + '-essay-archive-' + str(q['n']), 'paperId': paper['id'],
                    'exam': paper['exam'], 'year': int(paper['sitting'][-4:]), 'subject': paper['subject'],
                    'question': q['q'], 'options': list(q.get('opts', {}).values()),
                    'sourceHref': paper['sourceHref'] + '#page=' + str(q['page']), 'sourceReviewed': False})
        for q in raw.get('written', []):
            if is_essay_prompt(q.get('text')):
                output.append({'id': paper['id'] + '-essay-archive-written-' + str(q['n']), 'paperId': paper['id'],
                    'exam': paper['exam'], 'year': int(paper['sitting'][-4:]), 'subject': paper['subject'],
                    'question': q['text'], 'options': list(q.get('subparts', {}).values()),
                    'sourceHref': paper['sourceHref'] + '#page=' + str(q['page']), 'sourceReviewed': False})
    return output
