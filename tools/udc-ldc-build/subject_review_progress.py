"""Read-only progress for every Group B subject; never changes readiness."""
import re
from collections import defaultdict

SECTIONS = ('english', 'arithmetic', 'computer', 'gk', 'reasoning')


def load_study_taxonomy(root):
    """Read the same explicit routing/catalog tables the module uses."""
    filters = (root / 'src/modules/udc-ldc/filters.ts').read_text()
    table = filters.split('const TOPIC_SECTION: Record<string, SectionId> = {', 1)[1].split('\n};', 1)[0]
    mappings = {}
    for quoted, bare, section in re.findall(r"(?:'([^']+)'|\b([a-z_]+)):\s*'([^']+)'", table):
        mappings[quoted or bare] = section
    catalog = (root / 'src/modules/udc-ldc/studyTopics.ts').read_text()
    topics = {}
    for section, constant in [('arithmetic', 'MATH_TOPICS'), ('computer', 'COMPUTER_TOPICS')]:
        part = catalog.split(f'export const {constant} = [', 1)[1].split('] as const;', 1)[0]
        topics[section] = set(re.findall(r"\['([^']+)',", part))
    return mappings, topics


def section_of(q, mappings):
    if q.get('studySection'):
        assert q['studySection'] in SECTIONS, f"Unknown section: {q['id']}"
        return q['studySection']
    if q.get('topic') in mappings:
        return mappings[q['topic']]
    label = q.get('topicLabel', '').lower()
    if 'computer' in label:
        return 'computer'
    if 'arithmetic' in label:
        return 'arithmetic'
    if 'intelligence' in label or 'reasoning' in label:
        return 'reasoning'
    if 'english' in label:
        return 'english'
    return 'gk'


def ready(q):
    return (q.get('type') != 'descriptive' and 0 <= q.get('answerIndex', -1) < len(q.get('options', []))
            and not q.get('sourceReview') and not q.get('figureBased') and not q.get('compensated'))


def key_only(q):
    text = q.get('explanation', '').strip()
    return not text or text.startswith('The official final key marks option ') or text in (
        'Official MPSC final key, compared with an independent solved transcription.',
        'Independent study transcription; official key not yet matched.')


def counts(rows):
    mcqs = [q for q in rows if q.get('type') != 'descriptive']
    written = [q for q in rows if q.get('type') == 'descriptive']
    scored = [q for q in mcqs if ready(q)]
    held = [q for q in mcqs if q.get('sourceReview') and q.get('sourceReviewed')]
    reviewed_guides = [q for q in mcqs if q.get('sourceReviewed') and not key_only(q)]
    written_guides = [q for q in written if q.get('sourceReviewed') and not q.get('sourceReview')
                      and q.get('explanation', '').strip()]
    return {'records': len(rows), 'mcq': len(mcqs), 'writtenRecords': len(written),
            'ready': len(scored), 'readyOfficial': sum(q.get('answerSource') == 'official' for q in scored),
            'pendingMcq': len(mcqs) - len(scored) - len(held), 'heldReviewed': len(held),
            'workedGuidesReviewed': len(reviewed_guides), 'pendingMcqGuides': len(mcqs) - len(reviewed_guides),
            'keyOnlyFeedback': sum(q.get('answerSource') == 'official' and key_only(q) for q in mcqs),
            'writtenGuidesReviewed': len(written_guides), 'pendingWrittenGuides': len(written) - len(written_guides)}


def declared_sections(subject):
    text = subject.lower()
    sections = []
    for section, terms in [('english', ('english',)), ('arithmetic', ('arithmetic', 'mathematics')),
                           ('computer', ('computer',)), ('gk', ('knowledge', 'studies', 'science')),
                           ('reasoning', ('reasoning', 'intelligence', 'aptitude'))]:
        if any(term in text for term in terms):
            sections.append(section)
    return sections


def subject_review_progress(library, questions, mappings, topics, tags, sources=()):
    by_paper, by_section = defaultdict(list), defaultdict(list)
    source_by_slug = {s['slug']: s for s in sources}
    for q in questions:
        by_paper[q['paperId']].append(q)
        by_section[section_of(q, mappings)].append(q)
    output = []
    for paper in sorted(library, key=lambda p: p['id']):
        rows = by_paper[paper['id']]
        sections = defaultdict(list)
        for q in rows:
            sections[section_of(q, mappings)].append(q)
        for section in declared_sections(paper['subject']):
            sections.setdefault(section, [])
        expected = paper.get('expectedMcq')
        missing = max(0, expected - sum(q.get('type') != 'descriptive' for q in rows)) if expected is not None else None
        section_reports = {}
        for section, section_rows in sorted(sections.items()):
            report = counts(section_rows)
            if section in topics:
                resolved = [(tags.get(q['id'], q.get('topic', '')).replace('-', '_')) for q in section_rows]
                report['mixedTopicRecords'] = sum(t not in topics[section] or t == 'mixed' for t in resolved)
            section_reports[section] = report
        source = source_by_slug.get(paper['id'].removeprefix('mpsc-group-b-'), {})
        output.append({'paperId': paper['id'], 'exam': paper['exam'], 'sitting': paper['sitting'],
                       'subject': paper['subject'], 'sourceHref': paper['sourceHref'], 'keyHref': paper.get('keyHref'),
                       **{target: source[key] for key, target in [('url', 'sourceUrl'), ('sourceSha256', 'sourceSha256'), ('archivePage', 'archivePage')] if source.get(key)},
                       'imported': bool(paper.get('imported')), 'expectedMcq': expected, 'missingMcq': missing,
                       **counts(rows), 'sections': section_reports,
                       'heldItems': [{'id': q['id'], 'questionNumber': q.get('questionNumber'),
                                      'section': section_of(q, mappings),
                                      'reason': q.get('disputeNote') or q.get('sourceNote') or q.get('explanation', '')}
                                     for q in rows if q.get('sourceReview') and q.get('sourceReviewed')]})
    return {'generatedBy': 'tools/udc-ldc-build/build_group_b.py',
            'scope': 'Group B supplement/source library only; the separate clerical generator is not included. Section counts use the UI routing table. A ready keyed answer is not a verified worked guide. Mixed-paper gaps are counted once at paper level; null means unknown. Written records can group subparts.',
            'summary': {'librarySources': len(library), 'questionBearingPapers': len(by_paper), **counts(questions),
                        'missingMcq': sum(p['missingMcq'] or 0 for p in output)},
            'sections': {section: {**counts(by_section[section]),
                                    **({'mixedTopicRecords': sum((tags.get(q['id'], q.get('topic', '')).replace('-', '_') not in topics[section]
                                         or tags.get(q['id'], q.get('topic', '')).replace('-', '_') == 'mixed') for q in by_section[section])} if section in topics else {})}
                         for section in SECTIONS},
            'papers': output}
