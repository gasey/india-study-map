"""Apply guarded source reviews to clerical written English without scoring it."""
import hashlib
import re
import shutil
import subprocess
from pathlib import Path


def apply_clerical_written_reviews(questions, papers, reviews, root, archive):
    root, archive = Path(root).resolve(), Path(archive).resolve()
    by_id = {q['id']: q for q in questions}
    by_paper = {p['id']: p for p in papers}
    assert set(reviews.get('papers', {})) <= set(by_paper), 'Unknown reviewed clerical paper'
    for paper_id, review in reviews.get('papers', {}).items():
        paper = by_paper[paper_id]
        assert review.get('reviewedOn') and review.get('evidence'), 'Written review needs source evidence'
        assert review['sourceFile'] == paper['sourceFile'], 'Written source identity changed'
        source = (archive / review['sourceFile']).resolve()
        assert source.is_relative_to(archive) and source.suffix.lower() == '.pdf', 'Invalid written source path'
        assert hashlib.sha256(source.read_bytes()).hexdigest() == review['sourceSha256'], 'Stale written source hash'
        info = subprocess.check_output(['pdfinfo', str(source)], text=True)
        pages = int(re.search(r'^Pages:\s+(\d+)', info, re.M)[1])
        href = f'/papers/clerical-review/{paper_id}.pdf'
        changes = []
        for qid, checked in review['questions'].items():
            assert qid in by_id, 'Unknown reviewed written question'
            row = by_id[qid]
            assert row['paperId'] == paper_id and row.get('type') == 'descriptive', 'Written review cannot alter an MCQ'
            assert row['question'] == checked['expectedQuestion'], 'Stale written question text'
            assert checked.get('question', '').strip() and checked.get('explanation', '').strip(), 'Incomplete written guide'
            assert type(checked.get('page')) is int and 1 <= checked['page'] <= pages, 'Invalid written source page'
            assert 'answerIndex' not in checked and 'answerSource' not in checked, 'Written guides cannot carry scoring answers'
            if 'answers' in checked:
                assert isinstance(checked['answers'], list) and all(isinstance(a, str) and a.strip() for a in checked['answers']), 'Invalid written subpart answers'
            for field in ('passage', 'direction'):
                if field in checked:
                    assert isinstance(checked[field], str) and checked[field].strip(), 'Invalid written context'
            changes.append((row, checked))
        target = root / 'public' / href.lstrip('/')
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists() or target.read_bytes() != source.read_bytes():
            shutil.copyfile(source, target)
        paper['sourceFile'] = href
        for row, checked in changes:
            row.update(question=checked['question'], explanation=checked['explanation'],
                       sourceReviewed=True, sourceReview=False,
                       sourceHref=href + '#page=' + str(checked['page']),
                       sourceNote='Written prompt checked against the printed source. Independent study guidance; no official marking scheme claimed.')
            for field in ('passage', 'direction', 'answers'):
                if checked.get(field):
                    row[field] = checked[field]
    return questions, papers
