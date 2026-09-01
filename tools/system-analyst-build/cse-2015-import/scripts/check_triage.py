#!/usr/bin/env python3
"""Verify triage labels against the batch inputs.

Agents self-report counts; those reports have already proved unreliable
(one claimed '128 in' for a 70-question batch). Trust only this check.
"""
import json, os, glob, collections

SP = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(SP, 'triage')

VALID_PAPER = {'TECH1', 'TECH2', 'TECH3', 'NONE'}
all_labels, problems = {}, []

src_all = json.load(open(os.path.join(SP, 'mcq_new.json')))
real_ids = {q['id'] for q in src_all}

# Pool every label object from every label file and match by its own id.
# Two agents wrote correct labels into off-by-one filenames; keying on the
# id rather than the filename recovers that work instead of discarding it.
for lf in sorted(glob.glob(os.path.join(T, 'batch*.labels.json'))):
    name = os.path.basename(lf)
    try:
        lab = json.load(open(lf))
    except Exception as e:
        problems.append(f"{name}: unparseable JSON - {e}")
        continue
    for x in lab:
        i = x.get('id')
        if i not in real_ids:
            problems.append(f"{name}: id {i!r} is not a real question id")
            continue
        p = x.get('paper')
        if p not in VALID_PAPER:
            problems.append(f"{name}/{i}: bad paper {p!r}")
            continue
        if p == 'TECH1' and str(x.get('unit')) not in {'1', '2', '3', '4'}:
            problems.append(f"{name}/{i}: TECH1 with bad unit {x.get('unit')!r}")
            continue
        if i in all_labels and all_labels[i]['paper'] != p:
            problems.append(f"{i}: CONFLICTING labels "
                            f"{all_labels[i]['paper']} vs {p}")
            continue
        all_labels[i] = x

unlabelled = [q['id'] for q in src_all if q['id'] not in all_labels]

print(f"questions total     {len(src_all)}")
print(f"validly labelled    {len(all_labels)}")
print(f"UNLABELLED          {len(unlabelled)}")
print()
c = collections.Counter(x['paper'] for x in all_labels.values())
for k in ['TECH1', 'TECH2', 'TECH3', 'NONE']:
    print(f"  {c.get(k,0):5d}  {k}")
u = collections.Counter(x['unit'] for x in all_labels.values()
                        if x['paper'] == 'TECH1')
print("\nTECH1 by unit:", dict(sorted(u.items())))
print("garbled:", sum(1 for x in all_labels.values() if x.get('garbled')))

if problems:
    print("\n!! PROBLEMS")
    for p in problems:
        print("  -", p)
else:
    print("\nno structural problems")

json.dump(all_labels, open(os.path.join(SP, 'labels.json'), 'w'), indent=1)
json.dump(unlabelled, open(os.path.join(SP, 'unlabelled.json'), 'w'), indent=1)
