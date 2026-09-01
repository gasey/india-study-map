#!/usr/bin/env python3
"""Resolve 10 duplicated ids in the System Analyst bank: MES2015_PAPER1_041..050.

These predate the CSE-2015 import entirely (they are in the committed bank at
HEAD, 784 questions with 10 duplicate ids). Two independent recoveries of
page 5 of the Nov-2015 Paper I scan both landed in questions.js under the same
ids, so each of these ten questions appears twice - double-weighted in every
practice pool, and in two cases actively contradictory:

  Q46 - copy A left `ans` EMPTY, calling the question unanswerable
        ("inorder alone does not determine a tree"). That is wrong: only one of
        the four printed preorders reconstructs consistently against the given
        inorder, so the question IS answerable. Verified by reconstruction.
  Q50 - the two copies give DIFFERENT answers (A vs B), so the reader was
        taught a different fact depending on which copy they hit.

Resolution: keep copy A (the curated recovery - it carries per-question
provenance notes and re-simulated answers; copy B has generic unit-level `sub`
tags, no notes, and a Q46 explanation that misquotes the inorder string as
"EACKHDBG"), then correct it against the page-5 scan where copy B's text was
the more faithful one. Every kept answer was re-derived independently before
being kept; see the session DEVLOG entry.

Idempotent: exits cleanly if the duplicates are already gone.
"""
import json, subprocess, shutil, sys, collections

DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')
DRY = '--write' not in sys.argv

Q = json.loads(subprocess.check_output(
    ['node', '-e', "global.window={};require('./questions.js');"
                   "console.log(JSON.stringify(window.QUESTIONS))"],
    cwd=DATA).decode())

TARGET = [f'MES2015_PAPER1_{n:03d}' for n in range(41, 51)]
counts = collections.Counter(q['id'] for q in Q)
dupes = [i for i in TARGET if counts[i] > 1]
if not dupes:
    print('no duplicates present - nothing to do')
    sys.exit(0)

# Corrections read off the rendered page-5 image of the source scan.
# Keys are the fields to overwrite on the kept (copy A) record.
FIX = {
    'MES2015_PAPER1_042': {
        'q': "Which of the following algorithm uses 'divide and conquer' strategy?"},
    'MES2015_PAPER1_044': {
        'q': 'A priority queue is implemented as a Max-Heap. Initially, it has 5 '
             'elements. The level-order traversal of the heap is: 10, 8, 5, 3, 2. '
             'Two new elements 1 and 7 are inserted into the heap in that order. '
             'The level-order traversal of the heap after the insertion of the '
             'elements is'},
    'MES2015_PAPER1_045': {
        'q': 'Let P be a QuickSort program to sort numbers in ascending order '
             'using the first element as pivot. Let t1 and t2 be the number of '
             'comparisons made by P for the inputs {1, 2, 3, 4, 5} and '
             '{4, 1, 5, 3, 2} respectively. Which of the following holds?'},
    'MES2015_PAPER1_046': {
        'opts': {'A': 'FAEKCDBHG', 'B': 'FAEKCDHGB',
                 'C': 'EAFKHDCBG', 'D': 'FEAKDCHBG'},
        'ans': 'B',
        'exp': 'A preorder is consistent with a given inorder only if, at every '
               'step, the elements following the root in the preorder split into '
               'exactly the left and right inorder blocks. Taking F as the root '
               '(inorder EACK | F | HDBG), only FAEKCDHGB splits as AEKC / DHGB '
               'and continues to reconstruct all the way down; the other three '
               'contradict at the first or second level. So inorder plus these '
               'four candidates does pin the answer down.',
        'note': 'Recovered from page 5 of the source PDF, which was missing from '
                'the supplied OCR text. Answer verified by running the '
                'preorder/inorder reconstruction against all four options - '
                'exactly one is consistent.',
        'conf': 'high'},
}
# Honest confidence for the ten (this sitting has no official key, and these
# records carried no `conf` at all, so they were all rendering "derived
# unrated"). Each was re-derived independently before being set.
CONF = {i: 'high' for i in TARGET}
CONF['MES2015_PAPER1_047'] = 'medium'   # option (c) is printed "Read-black Tree"
CONF['MES2015_PAPER1_050'] = 'medium'   # (a) and (b) both genuinely defensible

out, kept = [], set()
for q in Q:
    if q['id'] in TARGET:
        if q['id'] in kept:
            continue                     # drop the second copy
        kept.add(q['id'])
        q = dict(q)
        q.update(FIX.get(q['id'], {}))
        q.setdefault('conf', CONF[q['id']])
        q['conf'] = q.get('conf') or CONF[q['id']]
    out.append(q)

removed = len(Q) - len(out)
still = [i for i, n in collections.Counter(x['id'] for x in out).items() if n > 1]
blank = [x['id'] for x in out
         if x.get('type') != 'descriptive' and not str(x.get('ans', '')).strip()]

print(f'questions before      {len(Q)}')
print(f'duplicate ids found   {len(dupes)}  {dupes}')
print(f'records removed       {removed}')
print(f'questions after       {len(out)}')
print(f'remaining duplicates  {len(still)}')
print(f'MCQs with blank ans   {len(blank)}' + (f'  {blank[:5]}' if blank else ''))

if DRY:
    print('\n[dry run] pass --write to apply')
    sys.exit(0)
if still:
    print('\nREFUSING to write while duplicates remain.')
    sys.exit(1)

shutil.copy(f'{DATA}/questions.js', f'{DATA}/questions.js.bak3')
with open(f'{DATA}/questions.js', 'w', encoding='utf-8') as fh:
    fh.write('window.QUESTIONS = ')
    json.dump(out, fh, indent=1, ensure_ascii=False)
    fh.write(';\n')
print(f'\nwrote {len(out)} questions (questions.js.bak3 kept)')
