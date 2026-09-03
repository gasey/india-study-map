#!/usr/bin/env python3
"""Find questions MPSC has asked more than once, and emit data/repeats.js.

Why this exists: MPSC visibly recycles Technical Paper I questions between
sittings — "A graph is called a ____ if it is a connected acyclic graph"
turns up in the CSE paper, MES November 2015 and MES July 2023 with the same
answer all three times. A question that has already been reprinted twice is
the highest-yield thing in the bank, and nothing in the app surfaced that.

Pool: paper TECH1, src 'past' only. Authored questions are excluded on
purpose — a repeat count is only evidence of MPSC's behaviour if every copy
came from a real paper, and mixing in authored drill would turn "asked three
times" into "asked once, then written twice by us". A group must also span
at least two distinct sittings; two copies inside one paper are a bank
artefact, not an exam repeat.

Matching is near-identical, not exact, because MPSC retypes rather than
copy-pastes: it adds a blank, drops a hyphen, or writes "Which DOS command"
where the older paper wrote "Which command". Four guards keep that tolerance
from swallowing genuinely different questions:

  * digit multisets must agree      — "Type 1 grammars" and "Type 3 grammars"
                                      are different questions. Single-digit
                                      tokens survive tokenisation for exactly
                                      this reason.
  * character-level ratio >= 0.72   — "Operating system" and "What does an
                                      operating system do" share every content
                                      word and are still not the same question.
  * unicode is preserved            — stripping to [a-z0-9] made the three
                                      formal-language questions L={aⁿb²ⁿ},
                                      L={a²ⁱ} and L={aⁱbⁱcⁱdⁱ} identical.
  * short stems need shared options — a stem under 5 content words carries too
                                      little signal alone, so two of its
                                      options must match as well.

Identical normalised stems always group, regardless of the short-stem guard.

Output is a sidecar keyed on question id rather than a field on the question,
following data/modes.js: generate.py --merge rebuilds every GEN- question from
its staged batch files and would silently erase a field added to questions.js.

Deterministic — same input reproduces the file byte for byte. No timestamp.

Usage:  python3 tools/system-analyst-build/find_repeats.py [--check]
        --check exits 1 if the committed file is stale, for CI.
"""

import collections
import difflib
import itertools
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
QUESTIONS = ROOT / 'public/mpsc-system-analyst/data/questions.js'
OUT = ROOT / 'public/mpsc-system-analyst/data/repeats.js'

PAPER = 'TECH1'
SRC = 'past'
JACCARD_MIN = 0.85
CHAR_MIN = 0.72
SHORT_STEM = 5          # content words below which options must corroborate
SHARED_OPTS = 2

# Dropped before comparison: these vary freely between reprints and carry no
# information about whether two stems are the same question.
STOP = set("""a an the of in on for is are was were to be by with as at from
that which wotf it its this these those and or not what does do can will
called also""".split())


def load_questions():
    text = QUESTIONS.read_text(encoding='utf-8')
    start = text.index('[', text.index('window.QUESTIONS'))
    return json.loads(text[start:].rstrip().rstrip(';'))


def norm(s):
    """Lowercase, fold the stem-lead variants, drop punctuation — keep unicode."""
    s = (s or '').lower().replace('—', '-').replace('–', '-').replace('’', "'")
    s = re.sub(r'\b(which of the following|which one of the following)\b', ' wotf ', s)
    s = re.sub(r'_+', ' ', s)               # "____" blanks are not a difference
    return ' '.join(re.sub(r'[^\w]+', ' ', s, flags=re.UNICODE).split())


def content_words(s):
    # len > 1 OR a digit: "Type 1" vs "Type 3" hinges on a one-character token,
    # so dropping short tokens wholesale merged two different questions.
    return {w for w in norm(s).split() if w not in STOP and (len(w) > 1 or w.isdigit())}


def digit_sig(s):
    return tuple(sorted(re.findall(r'\d+', norm(s))))


def flat(s):
    return ' '.join((s or '').lower().split())


def option_texts(q):
    return {norm(v) for v in (q.get('opts') or {}).values() if norm(v)}


def jaccard(a, b):
    return len(a & b) / len(a | b) if (a | b) else 0.0


def option_list(q):
    return [norm(v) for _, v in sorted((q.get('opts') or {}).items())]


def pair_mismatch(qa, qb):
    """'' | 'missing' | 'options' | 'answer' — how two copies disagree.

    Comparing answer *letters* is wrong on its own, because MPSC reorders
    options between printings: the max-heap question is 'B root' in ILM2018 and
    'C Root node' in PROG2018 — the same answer at a different letter. So the
    option text is compared instead, with a subset test to absorb retyping
    ("root" vs "root node").

    But the text is not always comparable either. An option of "=" or "A+A'B"
    normalises to nothing at all, and treating that emptiness as disagreement
    flagged three groups whose copies are in fact character-identical. When the
    text carries no signal, fall back to the letter — which is trustworthy
    precisely when both copies printed the same option list.
    """
    aa, ab = qa.get('ans') or '', qb.get('ans') or ''
    if not aa or not ab:
        return 'missing'

    ta = norm((qa.get('opts') or {}).get(aa, ''))
    tb = norm((qb.get('opts') or {}).get(ab, ''))

    if not ta or not tb:
        # Neither text survives normalisation ("=", "%"), so the letter is all
        # there is — and it only means something if the lists match.
        if option_list(qa) == option_list(qb):
            return '' if aa == ab else 'answer'
        return 'options'

    if ta == tb:
        return ''

    # Compare content words too, so "root" and "root node" agree. This is
    # checked after plain text equality because content_words() drops
    # single-character tokens: "O(n)" reduces to nothing, and testing that
    # emptiness first called two identical O(n) answers a disagreement.
    ca, cb = content_words(ta), content_words(tb)
    if ca and cb and (ca == cb or ca <= cb or cb <= ca):
        return ''

    # The answers really do differ. That is only a contradiction if the copies
    # were offering the same choices — "Process is" answers 'All of these' in
    # JE2016 and 'a program in execution' in PROG2018, but the two printings
    # share one option out of four, so each answer is right for its own list.
    oa, ob = option_texts(qa), option_texts(qb)
    if oa and ob and len(oa & ob) < 2:
        return 'options'
    return 'answer'


# Most severe first: a wrong answer matters more than a gap, which matters more
# than an incomparable option list.
SEVERITY = ['answer', 'missing', 'options']


def mismatch_kind(qs):
    """How a group's copies disagree, if at all.

    Only 'answer' justifies saying one of the copies is wrong. A group printed
    with different options is not a contradiction, and badging it as one would
    be the same overclaim provLine() exists to prevent.
    """
    kinds = {pair_mismatch(a, b) for a, b in itertools.combinations(qs, 2)}
    for kind in SEVERITY:
        if kind in kinds:
            return kind
    return ''


def same_question(qa, qb, ta, tb, oa, ob):
    if norm(qa['q']) and norm(qa['q']) == norm(qb['q']):
        # An identical stem is normally conclusive, but a contentless one is
        # not: JE2016_P2_024 and PROG2018_P1_066 both read "Process is" and
        # then offer entirely different options — two different questions
        # wearing the same stem, not a reprint. Require at least one shared
        # option whenever both option sets are comparable at all.
        if oa and ob and not (oa & ob):
            return False
        return True
    if jaccard(ta, tb) < JACCARD_MIN:
        return False
    if digit_sig(qa['q']) != digit_sig(qb['q']):
        return False
    if difflib.SequenceMatcher(None, flat(qa['q']), flat(qb['q'])).ratio() < CHAR_MIN:
        return False
    if min(len(ta), len(tb)) < SHORT_STEM and len(oa & ob) < SHARED_OPTS:
        return False
    return True


def cluster(qs):
    toks = [content_words(q['q']) for q in qs]
    opts = [option_texts(q) for q in qs]

    # Candidate pairs via an inverted index on content words, so this stays
    # linear-ish instead of comparing all ~374k pairs. Very common words are
    # skipped as index entries; any real repeat shares a rarer word too.
    index = collections.defaultdict(list)
    for i, t in enumerate(toks):
        for w in t:
            index[w].append(i)

    parent = list(range(len(qs)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    pairs = set()
    for ids in index.values():
        if len(ids) > 80:
            continue
        pairs.update(itertools.combinations(sorted(ids), 2))

    for a, b in sorted(pairs):
        if not same_question(qs[a], qs[b], toks[a], toks[b], opts[a], opts[b]):
            continue
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    groups = collections.defaultdict(list)
    for i in range(len(qs)):
        groups[find(i)].append(i)
    return [sorted(v) for v in groups.values() if len(v) > 1]


def build():
    pool = [q for q in load_questions()
            if q.get('paper') == PAPER and q.get('src') == SRC]

    out = []
    for members in cluster(pool):
        qs = [pool[i] for i in members]
        sittings = sorted({q.get('sitting') or '' for q in qs})
        if len(sittings) < 2:
            continue        # same paper twice is a bank artefact, not a repeat
        out.append({
            'ids': [q['id'] for q in qs],
            'n': len(qs),
            'sittings': sittings,
            'unit': qs[0].get('unit') or '',
            'sub': qs[0].get('sub') or '',
            # How the copies disagree, if at all — see mismatch_kind().
            'mismatch': mismatch_kind(qs),
        })

    # Most-repeated first, then by first id: a total order, so the emitted file
    # is reproducible byte for byte.
    out.sort(key=lambda g: (-g['n'], g['ids'][0]))
    for i, g in enumerate(out, 1):
        g['gid'] = 'R%02d' % i

    by_id = {}
    for g in out:
        for qid in g['ids']:
            by_id[qid] = g['gid']

    payload = {
        'pool': {
            'paper': PAPER,
            'src': SRC,
            'questions': len(pool),
            'sittings': len({q.get('sitting') for q in pool}),
        },
        'groups': out,
        'byId': dict(sorted(by_id.items())),
    }
    header = (
        '/* Questions MPSC has asked more than once in Technical Paper I.\n'
        '   Generated by tools/system-analyst-build/find_repeats.py — do not hand-edit.\n'
        '   Pool is paper TECH1, src "past" only, and every group spans at least two\n'
        '   distinct sittings, so `n` always means "printed in a real paper n times".\n'
        '   Keyed on question id and kept OUT of questions.js on purpose, same reason\n'
        '   as data/modes.js: generate.py --merge would silently erase it. */\n'
    )
    return header + 'window.QUESTION_REPEATS = ' + json.dumps(
        payload, indent=1, ensure_ascii=False) + ';\n', payload


def main():
    text, payload = build()
    if '--check' in sys.argv:
        current = OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        if current != text:
            print('STALE: %s does not match find_repeats.py output' % OUT)
            return 1
        print('up to date: %d repeat groups' % len(payload['groups']))
        return 0

    OUT.write_text(text, encoding='utf-8')
    groups = payload['groups']
    print('%s: %d groups over %d questions (pool %d past TECH1 questions, %d sittings)'
          % (OUT.relative_to(ROOT), len(groups), sum(g['n'] for g in groups),
             payload['pool']['questions'], payload['pool']['sittings']))
    for g in groups:
        if g['mismatch']:
            print('  %-8s %s (%s)' % (g['mismatch'].upper(), g['gid'], ', '.join(g['ids'])))
    hot = collections.Counter()
    for g in groups:
        hot[g['sub'] or '(untagged)'] += g['n']
    print('  most-repeated sub-topics: %s'
          % ', '.join('%s (%d)' % kv for kv in hot.most_common(5)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
