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
        if batch.get('keyHref'):
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
            # A hold can be cleared only by an explicit item-level resolution
            # whose independently solved answer agrees with the official key.
            if guide.get('resolveSourceReview'):
                assert identifier == 'mpsc-group-b-archive-lang-2025-jr-accounts-officer-jr-accounts-officer-paper-ii-gk-arithmetic-reasoning-0ea2ba29-Q41', 'Unexpected source-review resolution'
                assert q.get('sourceReview') and independent == official and not q.get('compensated'), 'Source-review resolution lacks matching source/key evidence'
                q.update({'answerIndex': official, 'sourceReview': False})
                q.pop('disputeNote', None)
            # Otherwise existing sourceReview/compensated/figure gates are never cleared.
        # Source-checked questions that cannot receive one unique answer have
        # reviewed explanations too. Keep them outside the scored question
        # adapter so the review can never clear their hold gate.
        for identifier, guide in batch.get('heldQuestions', {}).items():
            q = by_id[identifier]
            assert q['paperId'] == batch['paperId'], 'Wrong held guide paper'
            assert q['question'] == guide['expectedQuestion'] and q['options'] == guide['expectedOptions'], 'Stale held guide stem/options'
            if batch.get('keyHref'):
                assert q.get('answerSource') == 'official' and q.get('answerKeyRef', '').split('#')[0] == batch['keyHref'].split('#')[0], 'Wrong held guide key'
            else:
                assert guide.get('expectedNoOfficialKey') is True and not q.get('answerSource') and q.get('answerIndex', -1) < 0, 'Unexpected official key on held-only guide'
            assert guide.get('holdReason','').strip() and guide.get('explanation','').strip() and guide.get('page',0)>0, 'Invalid held guide'
            official = guide.get('expectedOfficialAnswerIndex')
            candidates = q.get('officialAnswerCandidates') or ([q['answerIndex']] if q['answerIndex'] >= 0 else [])
            if official is None:
                assert ((guide.get('expectedCompensated') is True and q.get('compensated') is True and not candidates)
                        or (guide.get('expectedNoOfficialKey') is True and not candidates)), 'Expected a compensated or unkeyed held item'
            else:
                assert candidates == [official], 'Held guide official key changed'
            q.update({'explanation': guide['explanation'], 'sourceReviewed': True,
                      'independentAnswerIndex': -1, 'independentAnswerSource': 'ambiguous',
                      'answerConfidence': 'low', **({'answerKeyRef': batch['keyHref']} if batch.get('keyHref') else {}),
                      'sourceHref': batch['sourceHref'] + '#page=' + str(guide['page']),
                      'sourceNote': guide['holdReason'], 'sourceReview': True,
                      'answerIndex': -1, 'disputeNote': guide['holdReason']})
