#!/usr/bin/env python3
"""Resolve triage votes into one final label per question.

Rules, in order:
  1. an adjudicated verdict wins outright
  2. two agents agreeing wins
  3. a single label stands
"""
import json, glob, collections, os

SP = os.path.dirname(os.path.abspath(__file__))
os.chdir(SP)

real = {q['id']: q for q in json.load(open('mcq_new.json'))}
votes = collections.defaultdict(list)
for lf in sorted(glob.glob('triage/batch*.labels.json')):
    for x in json.load(open(lf)):
        if x.get('id') in real and x.get('paper') in {'TECH1', 'TECH2', 'TECH3', 'NONE'}:
            if x['paper'] == 'TECH1' and str(x.get('unit')) not in {'1', '2', '3', '4'}:
                continue
            votes[x['id']].append(x)

adj = {x['id']: x for x in json.load(open('adjudicated.json'))}
adj.update({x['id']: x for x in json.load(open('adjudicated2.json'))})

final, source = {}, collections.Counter()
for qid in real:
    if qid in adj:
        final[qid] = adj[qid]; source['adjudicated'] += 1
    elif qid in votes:
        v = votes[qid]
        papers = {y['paper'] for y in v}
        if len(v) > 1 and len(papers) == 1:
            final[qid] = v[0]; source['agreed'] += 1
        elif len(v) == 1:
            final[qid] = v[0]; source['single'] += 1
        else:
            source['UNRESOLVED'] += 1
    else:
        source['NO LABEL'] += 1

print('resolution:', dict(source))
print('final labels:', len(final), '/', len(real))
c = collections.Counter(x['paper'] for x in final.values())
print('papers:', dict(c))
u = collections.Counter(str(x['unit']) for x in final.values() if x['paper'] == 'TECH1')
print('TECH1 units:', dict(sorted(u.items())))

# attach labels back onto the full question records
tech1, other = [], []
for qid, q in real.items():
    lab = final.get(qid)
    if not lab:
        continue
    rec = dict(q)
    rec['unit'] = str(lab['unit'])
    rec['sub'] = lab.get('sub', '')
    rec['garbled'] = bool(lab.get('garbled'))
    rec['target_paper'] = lab['paper']
    (tech1 if lab['paper'] == 'TECH1' else other).append(rec)

tech1.sort(key=lambda r: (r['unit'], r['srcKey'], r['paper_no'], r['no']))
json.dump(tech1, open('tech1_questions.json', 'w'), indent=1)
json.dump(other, open('other_papers_parked.json', 'w'), indent=1)
print(f"\nTECH1 -> tech1_questions.json  ({len(tech1)})")
print(f"parked -> other_papers_parked.json ({len(other)})")
print('garbled among TECH1:', sum(1 for r in tech1 if r['garbled']))
