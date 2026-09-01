#!/usr/bin/env python3
"""Merge the Section-B (conventional/essay) TECH1 questions into the app.

Separate from merge.py on purpose. merge.py rebuilds questions.js from
`existing + new_q + desc_recs`, which was correct for the one-shot MCQ import
but cannot be re-run now that those 499 MCQs are already in the bank — it would
either duplicate them or (as it actually does) refuse to write on the id
collision. This script touches ONLY descriptive records.

Refuses to write if anything is unanswered or any id already exists.
"""
import json, os, subprocess, collections, shutil, sys

SP = os.path.dirname(os.path.abspath(__file__))
DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')
os.chdir(SP)
os.chdir('..')

DRY = '--write' not in sys.argv

EXQ = json.loads(subprocess.check_output(
    ['node', '-e', "global.window={};require('./questions.js');"
                   "console.log(JSON.stringify(window.QUESTIONS))"],
    cwd=DATA).decode())
ex_ids = {q['id'] for q in EXQ}

ROMAN = {'I': 1, 'II': 2, 'III': 3}
SHORT = {
    'Jr. Grade of M.E.S. (P&E Dept), August 2018': 'MES2018',
    'Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023': 'MES2023',
}

dsrc = {x['id']: x for x in json.load(open('staged/descriptive.json'))}
done = json.load(open('descriptive_done.json'))

# Section B is 20 questions per paper on every one of these papers; how many of
# those 20 are Paper-I syllabus is what the card must state, so count per paper.
sec_b_total = collections.Counter(
    (x['srcKey'], x['paper_no']) for x in dsrc.values())
taken = collections.Counter(
    (dsrc[d['id']]['srcKey'], dsrc[d['id']]['paper_no']) for d in done)

recs, unanswered = [], []
for d in done:
    i = d['id']
    if not d.get('ans', '').strip():
        unanswered.append(i)
        continue
    q = dsrc[i]
    key = SHORT.get(q['sitting'], 'SRC')
    pno = q['paper_no']
    n_taken, n_total = taken[(q['srcKey'], pno)], sec_b_total[(q['srcKey'], pno)]

    # Wording is load-bearing: provLine() badges "official key" when /official/i
    # matches and no `no|without|never official` negation does. Phrase the
    # negation as "no official ..." exactly - "not an official answer" would
    # slip past it and render a written-for-this-app answer as authoritative.
    prov = (f"{q['sitting']}, Paper {pno}, Section B Q{q['no']}; "
            'conventional short-answer question (5 marks) - model answer '
            'written for this app; no official MPSC answer exists for it')
    if d.get('recovered'):
        prov += ('; question recovered from the source scan after the '
                 'extractor dropped it')
    if d.get('repaired'):
        prov += '; OCR damage in source scan repaired against the printed page'

    note = 'Model answer'
    if n_taken < n_total:
        note += (f' — only the Paper-I-syllabus questions from this paper’s '
                 f'Section B were imported ({n_taken} of {n_total}).')
    if d.get('incomplete'):
        note += ' Source question omits data needed for a complete answer.'

    recs.append({
        'id': f"{key}_P{ROMAN.get(pno, pno)}_B{q['no']:02d}",
        'src': 'past',
        'type': 'descriptive',
        'sitting': f"{q['sitting']} · Paper {pno}",
        'srcKey': f"{key}_P{ROMAN.get(pno, pno)}",
        'no': 1000 + q['no'],           # sorts Section B after Section A
        'sectionB': True,
        'paper': 'TECH1',
        'unit': str(d['unit']),
        'sub': (d.get('sub') or '')[:40],
        'q': q['q'],
        'opts': {},
        'ans': '',                      # empty ans keeps it out of ANSWERABLE
        'model': d['ans'].strip(),
        'points': d.get('points', []),
        'exp': '',
        'conf': d.get('conf', 'medium'),
        'prov': prov,
        'note': note,
    })

ids = [r['id'] for r in recs]
dup = [i for i in ids if i in ex_ids]
dup += [i for i, n in collections.Counter(ids).items() if n > 1]

print(f"existing questions        {len(EXQ)}")
print(f"  of which descriptive    {sum(1 for q in EXQ if q.get('type') == 'descriptive')}")
print(f"Section B extracted       {len(dsrc)}")
print(f"  TECH1 answered          {len(done)}")
print(f"  records built           {len(recs)}")
print(f"  UNANSWERED              {len(unanswered)}")
print(f"  id collisions           {len(dup)}" + (f" e.g. {dup[:5]}" if dup else ""))
print(f"by unit                   "
      f"{dict(sorted(collections.Counter(r['unit'] for r in recs).items()))}")
print(f"by confidence             {dict(collections.Counter(r['conf'] for r in recs))}")
print(f"per source paper          "
      f"{dict(sorted(collections.Counter(r['srcKey'] for r in recs).items()))}")

if DRY:
    json.dump(recs, open('merged_descriptive.json', 'w'),
              indent=1, ensure_ascii=False)
    print("\n[dry run] pass --write to apply")
    sys.exit(0)

if unanswered or dup:
    print("\nREFUSING to write while questions are unanswered or ids collide.")
    sys.exit(1)

shutil.copy(f'{DATA}/questions.js', f'{DATA}/questions.js.bak2')
with open(f'{DATA}/questions.js', 'w', encoding='utf-8') as fh:
    fh.write('window.QUESTIONS = ')
    json.dump(EXQ + recs, fh, indent=1, ensure_ascii=False)
    fh.write(';\n')
print(f"\nwrote {len(EXQ) + len(recs)} questions "
      f"(+{len(recs)} descriptive); questions.js.bak2 kept")
