#!/usr/bin/env python3
"""Assign stable ids to the new questions and split them into triage batches."""
import json, os, math

SP = os.path.dirname(os.path.abspath(__file__))
BATCH = 70

q = json.load(open(os.path.join(SP, 'mcq_new.json')))
for i, x in enumerate(q):
    x['id'] = f"N{i:04d}"
json.dump(q, open(os.path.join(SP, 'mcq_new.json'), 'w'), indent=1)

d = json.load(open(os.path.join(SP, 'descriptive.json')))
for i, x in enumerate(d):
    x['id'] = f"D{i:03d}"
json.dump(d, open(os.path.join(SP, 'descriptive.json'), 'w'), indent=1)

os.makedirs(os.path.join(SP, 'triage'), exist_ok=True)
n = math.ceil(len(q) / BATCH)
for b in range(n):
    chunk = q[b * BATCH:(b + 1) * BATCH]
    slim = [{'id': x['id'], 'question': x['q'],
             'options': [x['opts'][k] for k in sorted(x['opts'])]}
            for x in chunk]
    json.dump(slim, open(os.path.join(SP, 'triage', f'batch{b:02d}.json'), 'w'),
              indent=1)
print(f"{len(q)} mcq -> {n} triage batches of <= {BATCH}")
print(f"{len(d)} descriptive questions ided D000..D{len(d)-1:03d}")
