#!/usr/bin/env python3
"""Dedup freshly-parsed MCQs against the live System Analyst bank, and
against each other (the same question recurs across sittings)."""
import json, re, os, subprocess, collections

SP = os.path.dirname(os.path.abspath(__file__))
DATA = ('/home/hruaia/workspace/projects/personal/india-study-map/'
        'public/mpsc-system-analyst/data')

existing = json.loads(subprocess.check_output(
    ['node', '-e',
     "global.window={};require('./questions.js');"
     "console.log(JSON.stringify(window.QUESTIONS))"],
    cwd=DATA).decode())


def norm(s):
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def key(q):
    """Stem + sorted option texts. Robust to option reordering across papers."""
    opts = ' | '.join(sorted(norm(v) for v in q.get('opts', {}).values()))
    return norm(q['q'])[:150] + ' || ' + opts[:250]


def stem_key(q):
    return norm(q['q'])[:120]


ex_full = {key(q) for q in existing}
ex_stem = collections.defaultdict(list)
for q in existing:
    ex_stem[stem_key(q)].append(q)

new = json.load(open(os.path.join(SP, 'mcq.json')))

kept, dup_existing, dup_internal = [], [], []
seen_full, seen_stem = set(), {}
for q in new:
    k, sk = key(q), stem_key(q)
    if k in ex_full or sk in ex_stem:
        dup_existing.append({**q, '_match': 'exact' if k in ex_full else 'stem'})
        continue
    if k in seen_full or sk in seen_stem:
        first = seen_stem.get(sk)
        dup_internal.append({**q, '_dup_of': first})
        continue
    seen_full.add(k); seen_stem[sk] = f"{q['srcKey']}-P{q['paper_no']}-Q{q['no']}"
    kept.append(q)

json.dump(kept, open(os.path.join(SP, 'mcq_new.json'), 'w'), indent=1)
json.dump(dup_existing, open(os.path.join(SP, 'dup_existing.json'), 'w'), indent=1)
json.dump(dup_internal, open(os.path.join(SP, 'dup_internal.json'), 'w'), indent=1)

print(f"parsed            {len(new)}")
print(f"already in bank   {len(dup_existing)}")
print(f"repeat across the {len(dup_internal)}  (same Q asked in >1 sitting)")
print(f"NEW & unique      {len(kept)}")
print()
c = collections.Counter(f"{q['sitting']} P{q['paper_no']}" for q in kept)
for k2, v in sorted(c.items()):
    print(f"  {v:4d}  {k2}")
