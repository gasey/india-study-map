#!/usr/bin/env python3
"""Correct 5 mis-tagged unit labels on MES2023 Paper I, Q1-Q5.

Found while driving the exam flow in the browser: Q1 ("How many injections are
defined from set A to set B...") rendered under the badge "Unit 4 · Operating
System". Q1-Q5 are Discrete Mathematics - injections, injective functions, sets,
group properties, binary relations - and their own `sub` tags already said so
("Functions and relations", "Set theory", "Group theory", "Relations"). Only the
`unit` field was wrong, so Study-by-unit and every unit filter put them under
Operating System.

Scope was checked before fixing rather than assumed: grouping every TECH1 `sub`
label by the units it appears under yields only 6 labels spanning >1 unit, four
of which are the legitimate boundary cases TRIAGE_BRIEF.md documents (trees and
graph theory are unit 1 as theory / unit 3 as implementations; boolean
simplification unit 1 / unit 2). The remaining two - "group theory" {1:4, 4:1}
and "relations" {1:1, 4:1} - are exactly Q4 and Q5 here. The error is confined
to these five records.

Idempotent.
"""
import json, subprocess, shutil, sys

DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')
DRY = '--write' not in sys.argv

Q = json.loads(subprocess.check_output(
    ['node', '-e', "global.window={};require('./questions.js');"
                   "console.log(JSON.stringify(window.QUESTIONS))"],
    cwd=DATA).decode())

TARGET = {f'MES2023_P1_{n:03d}' for n in range(1, 6)}
changed = []
for q in Q:
    if q['id'] in TARGET and q.get('unit') != '1':
        changed.append((q['id'], q.get('unit'), q['sub'], q['q'][:60]))
        q['unit'] = '1'

print(f'records retagged unit -> 1:  {len(changed)}')
for i, old, sub, txt in changed:
    print(f'  {i}  was unit {old}  [{sub}]  {txt}')
if not changed:
    print('  (already correct - nothing to do)')
    sys.exit(0)

if DRY:
    print('\n[dry run] pass --write to apply')
    sys.exit(0)

shutil.copy(f'{DATA}/questions.js', f'{DATA}/questions.js.bak4')
with open(f'{DATA}/questions.js', 'w', encoding='utf-8') as fh:
    fh.write('window.QUESTIONS = ')
    json.dump(Q, fh, indent=1, ensure_ascii=False)
    fh.write(';\n')
print(f'\nwrote {len(Q)} questions (questions.js.bak4 kept)')
