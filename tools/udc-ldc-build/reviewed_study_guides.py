"""Add checked guides to existing keyed adapter records without clearing holds."""
import hashlib


def checked_pdf(root, href, digest):
    public = (root / 'public').resolve()
    path = (public / href.split('#')[0].lstrip('/')).resolve()
    assert path.is_relative_to(public) and path.suffix == '.pdf' and path.is_file(), 'Invalid guide PDF'
    assert hashlib.sha256(path.read_bytes()).hexdigest() == digest, 'Stale guide PDF'


def apply_reviewed_study_guides(root, questions, manifest):
    by_id = {q['id']: q for q in questions}
    for batch in manifest['batches']:
        assert batch.get('reviewedOn') and batch.get('evidence'), 'Guide needs source-review evidence'
        checked_pdf(root, batch['sourceHref'], batch['sourceSha256'])
        checked_pdf(root, batch['keyHref'], batch['keySha256'])
        for identifier, guide in batch['questions'].items():
            q = by_id[identifier]
            assert q['paperId'] == batch['paperId'], 'Wrong guide paper'
            assert q['question'] == guide['expectedQuestion'] and q['options'] == guide['expectedOptions'], 'Stale guide stem/options'
            assert q['answerSource'] == 'official', 'Guide adapter expects a matched official key'
            official = guide['expectedOfficialAnswerIndex']
            candidates = q.get('officialAnswerCandidates') or ([q['answerIndex']] if q['answerIndex'] >= 0 else [])
            assert candidates == [official], 'Guide official key changed'
            assert q['answerKeyRef'].split('#')[0] == batch['keyHref'].split('#')[0], 'Wrong guide key'
            independent = guide['independentAnswerIndex']
            assert 0 <= independent < len(q['options']) and guide['explanation'].strip() and guide['page'] > 0, 'Invalid worked guide'
            q.update({'explanation': guide['explanation'], 'sourceReviewed': True,
                      'independentAnswerIndex': independent, 'independentAnswerSource': 'solved',
                      'answerConfidence': 'high', 'officialAnswerCandidates': [official],
                      'answerKeyRef': batch['keyHref'],
                      'sourceHref': batch['sourceHref'] + '#page=' + str(guide['page']),
                      'sourceNote': 'Printed stem and option order checked; independent worked guide compared with the official final key.'})
            if independent != official:
                q.update({'sourceReview': True, 'answerIndex': -1,
                          'disputeNote': f"Independent solution gives {'ABCD'[independent]}; official key gives {'ABCD'[official]}. Held unscored until resolved."})
            # Existing sourceReview/compensated/figure gates are never cleared.
