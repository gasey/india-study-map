#!/usr/bin/env python3
"""Which Paper-I topics now have a concept card but little or no practice?

Answers the "find the topic which isn't there" question by matching the
concept guide (which now covers the whole syllabus) against the question
bank, per unit, and reporting where practice is thin.
"""
import json, subprocess, collections, os, sys, re

DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')

def dump(var, req):
    return json.loads(subprocess.check_output(
        ['node', '-e', f"global.window={{}};require('./{req}');"
                       f"console.log(JSON.stringify(window.{var}))"],
        cwd=DATA).decode())

Q = [q for q in dump('QUESTIONS', 'questions.js') if q['paper'] == 'TECH1']
C = [c for c in dump('CONCEPTS', 'concepts.js') if c['paper'] == 'TECH1']

STOP = {'and', 'the', 'of', 'a', 'an', 'in', 'to', 'vs', 'or', 'for', 'with',
        'its', 'their', 'by', 'on', 'as', 'is', 'are', 'be', 'using', 'from',
        'what', 'how', 'which', 'that', 'this', 'these', 'not', 'all'}

def toks(s):
    return {w for w in re.findall(r'[a-z0-9]+', (s or '').lower())
            if len(w) > 2 and w not in STOP}

# Score each concept by how many questions plausibly exercise it.
qtok = [(q, toks(q.get('sub', '')) | toks(q['q'])) for q in Q]
rows = []
for c in C:
    ct = toks(c['sub'])
    if not ct:
        continue
    n = 0
    for q, qt in qtok:
        if q['unit'] != c['unit']:
            continue
        overlap = ct & qt
        # a topic counts as practised if most of its distinctive words appear
        if len(overlap) >= max(1, len(ct) - 1):
            n += 1
    rows.append((c['unit'], c['sub'], n))

UT = {c['unit']: c['unitTitle'] for c in C}
MARKS = {'1': 40, '2': 40, '3': 60, '4': 60}

print('=' * 74)
print('PAPER I COVERAGE — concept cards vs practice questions')
print('=' * 74)
for u in '1234':
    rs = sorted([r for r in rows if r[0] == u], key=lambda r: r[2])
    qn = sum(1 for q in Q if q['unit'] == u)
    thin = [r for r in rs if r[2] == 0]
    print(f"\nUNIT {u} — {UT.get(u,'?')}  [{MARKS[u]} marks]")
    print(f"  {len(rs)} concept cards · {qn} practice questions")
    print(f"  topics with NO matching question: {len(thin)}")
    for _, sub, n in thin[:14]:
        print(f"     · {sub}")
    if len(thin) > 14:
        print(f"     … and {len(thin)-14} more")

print('\n' + '=' * 74)
print(f"TOTAL: {len(C)} concepts, {len(Q)} questions")
print("Note: keyword matching is approximate — it under-counts a topic whose")
print("questions use different wording, so treat this as a shortlist to")
print("eyeball, not a verdict.")
