#!/usr/bin/env python3
"""Restore lost emphasis markers in the Group B bank.

Two surgical, question-text-authored fixes:

1. **Quoted-word underline (13 questions).** Questions that say
   `the underlined word "X"` (or `words "X"`) but carry no `__` marker — the
   printed page underlines X, and the quotes are standing in for the lost `__`
   marker. Fix: wrap the named word in the SENTENCE with `__X__`, leaving the
   parenthetical instruction untouched.

2. **Italic/underline mismatch (1 question).** A question that uses `__` but
   whose instruction says "italicized" — the marker style contradicts the
   wording. Fix: change `__` to `*` (italic) to match "italicized".

Applied to `src/data/banks/mpsc-group-b-general.ts` only — these are MCQ
questions, which the source-review repairs JSON does not cover. Idempotent.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
TS_FILE = ROOT / 'src' / 'data' / 'banks' / 'mpsc-group-b-general.ts'


def iter_ts_records(text: str):
    dec = json.JSONDecoder()
    for m in re.finditer(r'const groupBQuestionsPart\d+: BankQuestion\[\] = ', text):
        _, end = dec.raw_decode(text, m.end())
        cursor = m.end() + 1
        while cursor < end:
            while cursor < end and text[cursor] in ' \t\r\n,`':
                cursor += 1
            if cursor >= end or text[cursor] != '{':
                break
            row, stop = dec.raw_decode(text, cursor)
            yield row, cursor, stop
            cursor = stop


# Curated clause underlines (je-2016-english Q49–Q54, page 7). The printed
# page underlines the clause named in each explanation; the marker was lost
# during extraction. Verified against the scanned page's underline positions.
CLAUSE_FIXES = {
    'mpsc-group-b-je-2016-english-Q49': 'If you pay your bills',
    'mpsc-group-b-je-2016-english-Q50': 'that is grown organically',
    'mpsc-group-b-je-2016-english-Q51': 'That he is a cheat',
    'mpsc-group-b-je-2016-english-Q52': 'in case of emergencies',
    'mpsc-group-b-je-2016-english-Q53': 'that I would not succeed',
    'mpsc-group-b-je-2016-english-Q54': 'which most people love',
}


def patch(text: str) -> tuple[str, dict]:
    changed = {}
    out = text
    for _ in range(100):
        hit = None
        for row, start, end in iter_ts_records(out):
            q = row.get('question', '')
            new_q = None
            # Fix 1: quoted-word underline — wrap the named word in the sentence.
            m = re.search(r'underlined words? [“"]([^”"]+)[”"]', q)
            if m and '__' not in q:
                word = m.group(1)
                sentence = q[: m.start()]
                new_sentence, n = re.subn(
                    r'\b' + re.escape(word) + r'\b', '__' + word + '__', sentence, count=1
                )
                if n == 1:
                    new_q = new_sentence + q[m.start():]
            # Fix 2: `__` marker but instruction says "italicized" → use `*`.
            if new_q is None and '__' in q and re.search(r'italic', q, re.I):
                new_q = q.replace('__', '*')
            # Fix 3: curated clause underline — wrap the named clause once.
            if new_q is None and row.get('id') in CLAUSE_FIXES:
                clause = CLAUSE_FIXES[row['id']]
                if clause in q and '__' + clause + '__' not in q:
                    new_q = q.replace(clause, '__' + clause + '__', 1)
            if new_q is None or new_q == q:
                continue
            # Replace the question value span in place.
            prefix = '"question": '
            i = out.find(prefix, start, end)
            assert i >= 0, f'{row["id"]}: missing question field'
            vstart = i + len(prefix)
            _, vend = json.JSONDecoder().raw_decode(out, vstart)
            out = out[:vstart] + json.dumps(new_q, ensure_ascii=False) + out[vend:]
            changed[row['id']] = new_q
            hit = True
            break
        if not hit:
            break
    return out, changed


def main() -> int:
    text = TS_FILE.read_text()
    new_text, changed = patch(text)
    TS_FILE.write_text(new_text)
    print(f'patched {len(changed)} record(s) in {TS_FILE.name}')
    for rid in changed:
        print(f'  {rid}')
    return 0


if __name__ == '__main__':
    sys.exit(main())