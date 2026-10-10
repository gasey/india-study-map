"""Deterministic English review ledger; classification never changes scoring."""
from collections import defaultdict


def english_review_progress(library, questions, archive_sources, additional_sources=()):
    by_paper = defaultdict(list)
    for question in questions:
        by_paper[question['paperId']].append(question)
    archive = {row['slug']: row for row in archive_sources if 'English' in row['subject']}
    sources = {**archive, **{row['slug']: row for row in additional_sources if 'English' in row['subject']}}
    output = []
    for paper in library:
        rows = by_paper[paper['id']]
        english = [q for q in rows if q.get('studySection', q['subject']) == 'english']
        if not english and 'English' not in paper['subject']:
            continue
        slug = paper['id'].removeprefix('mpsc-group-b-')
        source = sources.get(slug, {})
        mcqs = [q for q in english if q.get('type') != 'descriptive']
        written = [q for q in english if q.get('type') == 'descriptive']
        ready = [q for q in mcqs if q.get('answerIndex', -1) >= 0
                 and not q.get('sourceReview') and not q.get('figureBased') and not q.get('compensated')]
        held = [q for q in mcqs if q.get('sourceReview') and q.get('sourceReviewed')]
        # A mixed paper's expected total includes other subjects. Do not call
        # these absent English records; report gaps only for English-only papers.
        expected = paper.get('expectedMcq') if 'English' in paper['subject'] and not any(
            word in paper['subject'] for word in ('Knowledge', 'Arithmetic', 'Reasoning', 'Computer')) else None
        missing = max(0, expected - len(mcqs)) if expected is not None else None
        pending_mcqs = len(mcqs) - len(ready) - len(held)
        pending_written = sum(bool(q.get('sourceReview')) or not q.get('explanation', '').strip() for q in written)
        status = ('needs-transcription' if not english else 'needs-review' if pending_mcqs or pending_written or missing
                  else 'ready-with-held-items' if held else 'content-ready')
        output.append({
            'paperId': paper['id'], 'exam': paper['exam'], 'sitting': paper['sitting'],
            'subject': paper['subject'], 'sourceHref': paper['sourceHref'],
            **({target: source[key] for key, target in [('url', 'sourceUrl'), ('sourceSha256', 'sourceSha256'), ('archivePage', 'archivePage')]
                if source.get(key)} if source else {}),
            'archiveBatch': ('gazetted-english' if slug in archive else 'ng-leso-2026' if slug == 'ng-april-2026-assistant-leso-general-english' else 'earlier-import'),
            'status': status, 'mcq': len(mcqs), 'ready': len(ready),
            'readyOfficial': sum(q.get('answerSource') == 'official' for q in ready),
            'sourceReviewedMcq': sum(bool(q.get('sourceReviewed')) for q in mcqs),
            'pendingMcq': pending_mcqs, 'heldReviewed': len(held),
            'expectedMcq': expected, 'missingMcq': missing,
            'writtenRecords': len(written), 'writtenGuides': len(written) - pending_written,
            'pendingWritten': pending_written, 'keyHref': paper.get('keyHref'),
            'heldItems': [{'id': q['id'], 'questionNumber': q['questionNumber'],
                           'reason': q.get('disputeNote') or q.get('sourceNote') or q.get('explanation', '')}
                          for q in held],
        })
    output.sort(key=lambda row: row['paperId'])
    return {
        'generatedBy': 'tools/udc-ldc-build/build_group_b.py',
        'scope': 'All English-bearing library papers, including mixed papers. Counts are English records only. Null expected/missing totals mean unknown, not zero. Written records may group subparts; guide counts are not exam scores.',
        'summary': {'papers': len(output), 'gazettedArchivePapers': len(archive),
                    'ready': sum(p['ready'] for p in output),
                    'pendingMcq': sum(p['pendingMcq'] for p in output),
                    'heldReviewed': sum(p['heldReviewed'] for p in output),
                    'pendingWritten': sum(p['pendingWritten'] for p in output)},
        'papers': output,
    }
