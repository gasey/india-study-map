#!/usr/bin/env python3
"""Merge solved TECH1 questions + the new concept guide into the System
Analyst app's data files.

Refuses to write if anything is unaccounted for. Prints a full reconciliation
so a silent drop cannot hide (see DEVLOG 2026-08-04).
"""
import json, os, glob, subprocess, collections, shutil, sys

SP = os.path.dirname(os.path.abspath(__file__))
DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')
os.chdir(SP)

DRY = '--write' not in sys.argv

# ---------------------------------------------------------------- existing
def node_dump(var, req):
    return json.loads(subprocess.check_output(
        ['node', '-e', f"global.window={{}};require('./{req}');"
                       f"console.log(JSON.stringify(window.{var}))"],
        cwd=DATA).decode())

EXQ = node_dump('QUESTIONS', 'questions.js')
EXC = node_dump('CONCEPTS', 'concepts.js')
ex_ids = {q['id'] for q in EXQ}
max_c = max(int(c['id'][1:]) for c in EXC if c['id'][1:].isdigit())

# ------------------------------------------------- source paper identities
# One srcKey per PRINTED paper, so the Past Papers tab (which groups by
# srcKey) shows one card per real paper instead of collapsing Paper I/II/III
# of a sitting into one mislabelled card - the bug flagged in DEVLOG.
ROMAN = {'I': 1, 'II': 2, 'III': 3}
SHORT = {
    'Inspector of Legal Metrology, December 2018': 'ILM2018',
    'Inspector of Legal Metrology, March 2010': 'ILM2010',
    'Inspector of Legal Metrology, November 2023': 'ILM2023',
    'Jr. Grade of M.E.S. (P&E Dept), August 2018': 'MES2018',
    'Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023': 'MES2023',
    'Junior Engineer (JE) Contract, Rural Development, November 2016': 'JE2016',
    'Jr. Grade of MES, November 2015': 'MES2015_CSE',
}

# totals per printed paper, for honest "n of m" provenance
tot = collections.Counter()
for x in json.load(open('mcq.json')):
    tot[(x['sitting'], x['paper_no'])] += 1

# --------------------------------------------------------------- questions
src = {q['id']: q for q in json.load(open('tech1_questions.json'))}

# The Nov-2015 Paper I scan is ALREADY cleanly in the bank (60 questions).
# What survived dedup from re-OCRing it is just OCR-mangled restatements of
# those same questions, so drop them rather than shipping garbled twins.
dropped_ocr = [i for i, q in src.items() if 'OCR' in q['sitting']]
for i in dropped_ocr:
    del src[i]

ans = {}
conflicting = []
for f in sorted(glob.glob('solve/s*.answers.json')):
    try:
        arr = json.loads(open(f, encoding='utf-8').read())
    except Exception:
        arr = json.JSONDecoder(strict=False).decode(
            open(f, encoding='utf-8').read())
    for a in arr:
        i = a.get('id')
        if i not in src:
            continue
        if i in ans and ans[i]['ans'] != a.get('ans'):
            conflicting.append(i)
        ans[i] = a

unanswered = [i for i in src if i not in ans]

# ------------------------------------------------------------- build recs
new_q = []
for i, q in sorted(src.items()):
    a = ans.get(i)
    if not a:
        continue
    letter = str(a.get('ans', '')).strip().upper()
    if letter not in q['opts']:
        unanswered.append(i)
        continue
    key = SHORT.get(q['sitting'], 'SRC')
    pno = q['paper_no']
    n_taken = sum(1 for x in src.values()
                  if x['sitting'] == q['sitting'] and x['paper_no'] == pno)
    n_total = tot[(q['sitting'], pno)]
    partial = n_taken < n_total
    prov = (f"{q['sitting']}, Paper {pno}, Q{q['no']}; "
            f"answer derived by review - no official key exists for this sitting")
    if a.get('broken'):
        prov += '; question defective as printed'
    if q.get('garbled'):
        prov += '; OCR damage in source scan'
    new_q.append({
        'id': f"{key}_P{ROMAN.get(pno, pno)}_{q['no']:03d}",
        'src': 'past',
        'sitting': f"{q['sitting']} · Paper {pno}",
        'srcKey': f"{key}_P{ROMAN.get(pno, pno)}",
        'no': q['no'],
        'paper': 'TECH1',
        'unit': str(q['unit']),
        'sub': (a.get('sub') or q.get('sub') or '')[:40],
        'q': q['q'],
        'opts': q['opts'],
        'ans': letter,
        'exp': a.get('exp', ''),
        'conf': a.get('conf', 'low'),
        'prov': prov,
        'note': ('Only the Paper-I-syllabus questions from this paper were '
                 f'imported ({n_taken} of {n_total}).' if partial else ''),
    })

# --------------------------------------------------- descriptive questions
desc_recs = []
if os.path.exists('descriptive_done.json'):
    draw = {x['id']: x for x in json.load(open('descriptive_done.json'))}
    dsrc = {x['id']: x for x in json.load(open('descriptive.json'))}
    for i, d in sorted(draw.items()):
        if d.get('paper') != 'TECH1' or i not in dsrc:
            continue
        q = dsrc[i]
        key = SHORT.get(q['sitting'], 'SRC')
        pno = q['paper_no']
        desc_recs.append({
            'id': f"{key}_P{ROMAN.get(pno, pno)}_B{q['no']:02d}",
            'src': 'past',
            'type': 'descriptive',
            'sitting': f"{q['sitting']} · Paper {pno}",
            'srcKey': f"{key}_P{ROMAN.get(pno, pno)}",
            'no': 1000 + q['no'],          # sort Section B after Section A
            'sectionB': True,
            'paper': 'TECH1',
            'unit': str(d.get('unit', '')),
            'sub': (d.get('sub') or '')[:40],
            'q': q['q'],
            'opts': {},
            'ans': '',                      # keeps it out of ANSWERABLE
            'model': d.get('ans', ''),
            'points': d.get('points', []),
            'exp': '',
            'conf': 'medium',
            # Wording matters: provLine() badges a question "official key" when
            # /official/i matches and no `no|without|never official` negation
            # does. "not an official answer" would slip past that and render a
            # written-for-this-app model answer as authoritative, so phrase the
            # negation as "no official ..." exactly.
            'prov': (f"{q['sitting']}, Paper {pno}, Section B Q{q['no']}; "
                     'conventional essay question - model answer written for '
                     'this app; no official MPSC answer exists for it'),
            'note': 'Model answer' + (' (source question incomplete)'
                                      if d.get('incomplete') else ''),
        })

# ---------------------------------------------------------------- concepts
new_c, cid = [], max_c
seen_sub = set()
for f in sorted(glob.glob('concepts/U*.json')):
    try:
        arr = json.loads(open(f, encoding='utf-8').read())
    except Exception:
        arr = json.JSONDecoder(strict=False).decode(
            open(f, encoding='utf-8').read())
    for c in arr:
        k = (c.get('unit'), (c.get('sub') or '').strip().lower())
        if k in seen_sub:
            continue
        seen_sub.add(k)
        cid += 1
        new_c.append({
            'id': f'c{cid}', 'paper': 'TECH1', 'unit': str(c['unit']),
            'unitTitle': c['unitTitle'], 'sub': c['sub'], 'def': c['def'],
            'exp': c['exp'], 'facts': c.get('facts', []),
            'traps': c.get('traps', []), 'mnem': c.get('mnem', ''),
            'rel': c.get('rel', []),
        })

# ------------------------------------------------------------ reconcile
print(f"existing questions      {len(EXQ)}")
print(f"existing concepts       {len(EXC)}  (max id c{max_c})")
print()
print(f"TECH1 candidates        {len(src) + len(dropped_ocr)}")
print(f"  dropped OCR twins     {len(dropped_ocr)}  (Nov-2015 P-I already in bank)")
print(f"  to solve              {len(src)}")
print(f"  solved & valid        {len(new_q)}")
print(f"  UNANSWERED            {len(set(unanswered))}")
print(f"  answer conflicts      {len(conflicting)}")
print(f"descriptive TECH1       {len(desc_recs)}")
print(f"new concepts            {len(new_c)}")
cc = collections.Counter(c['unit'] for c in new_c)
print(f"  by unit               {dict(sorted(cc.items()))}")
conf = collections.Counter(q['conf'] for q in new_q)
print(f"confidence              {dict(conf)}")

dup = [q['id'] for q in new_q + desc_recs if q['id'] in ex_ids]
ids = [q['id'] for q in new_q + desc_recs]
dup += [i for i, n in collections.Counter(ids).items() if n > 1]
if dup:
    print(f"\n!! ID COLLISIONS: {len(dup)} e.g. {dup[:5]}")

if DRY:
    print("\n[dry run] pass --write to apply")
    json.dump(new_q + desc_recs, open('merged_questions.json', 'w'), indent=1)
    json.dump(new_c, open('merged_concepts.json', 'w'), indent=1)
    sys.exit(0)

if set(unanswered) or dup:
    print("\nREFUSING to write while questions are unanswered or ids collide.")
    sys.exit(1)

shutil.copy(f'{DATA}/questions.js', f'{DATA}/questions.js.bak')
shutil.copy(f'{DATA}/concepts.js', f'{DATA}/concepts.js.bak')
with open(f'{DATA}/questions.js', 'w', encoding='utf-8') as fh:
    fh.write('window.QUESTIONS = ')
    json.dump(EXQ + new_q + desc_recs, fh, indent=1, ensure_ascii=False)
    fh.write(';\n')
with open(f'{DATA}/concepts.js', 'w', encoding='utf-8') as fh:
    fh.write('window.CONCEPTS = ')
    json.dump(EXC + new_c, fh, ensure_ascii=False)
    fh.write(';\n')
print(f"\nwrote {len(EXQ)+len(new_q)+len(desc_recs)} questions, "
      f"{len(EXC)+len(new_c)} concepts (.bak files kept)")
