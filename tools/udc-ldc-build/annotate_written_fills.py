#!/usr/bin/env python3
"""Annotate the Group-B fill-in-the-blank written prompts with per-blank answers.

The printed grammar drills ask the reader to fill running underscores
(`_____`). The question stem only shows the prompt; the answers live in the
free-text explanation. When "Reveal model answer" runs, the reader should see
each answer dropped into its blank — the exercise completed, as it would appear
on an answer sheet.

This tool adds an `answers` array to the twelve fill-in-the-blank records (one
model answer per blank, in document order) and fixes the printed-stem
formatting that the OCR pass mangled:

  * collapsed runs of alignment spaces in instruction lines,
  * a blank jammed against its following letter ("(bad) _____than ..."),
  * hint brackets wrapped onto their own line ("(already be)"),
  * mid-sentence line breaks ("...but today he"),
  * mark allocations "(10×1=10)" spaced as "(10 × 1 = 10)".

It applies the SAME patch to:

  1. `src/data/banks/mpsc-group-b-general.ts`  — the committed bank, surgically
     (question/explanation values in place, nothing else touched), and
  2. `tools/udc-ldc-build/group-b-text-repairs.json` — the durable generator
     input, so a future rebuild keeps this curation instead of re-emerging the
     raw OCR text.

Idempotent: re-running after application is a no-op. It asserts the sync
invariants — committed stem == repair stem, and one answer per blank — and
fails loudly otherwise.

Micro-updates ONLY. This script must never regenerate or re-order the bank;
it rewrites a few quoted strings inside existing records.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
TS_FILE = ROOT / 'src' / 'data' / 'banks' / 'mpsc-group-b-general.ts'
REPAIRS_FILE = ROOT / 'tools' / 'udc-ldc-build' / 'group-b-text-repairs.json'

MARK_RE = re.compile(r'(\d+)×(\d+)=(\d+)')
BLANK_RE = re.compile(r'_{3,}')

# ---------------------------------------------------------------------------
# Curated transforms, one per fill-in-the-blank record.
#
# `q(s)` turns the printed/OCR stem into the cleaned stem (idempotent).
# `answers` is the model answer per blank, in document order.
# `explanation` (optional) replaces the free-text model answer with a more
# instructive one — always a superset of the existing guidance.
# ---------------------------------------------------------------------------

def _collapse_lines(s: str) -> str:
    return re.sub(r'\n\s+', '\n', s)


def _collapse_spaces(s: str) -> str:
    return re.sub(r' {2,}', ' ', s)


def _space_blank_gap(s: str) -> str:
    # "(bad) _____than ..." -> "(bad) _____ than ..."
    return re.sub(r'(_{3,})([A-Za-z])', r'\1 \2', s)


def _mark_spacing(s: str) -> str:
    return MARK_RE.sub(r'\1 × \2 = \3', s)


def _drill(s: str) -> str:
    """Common cleanup for the grammar-drill prompts (no retained alignment)."""
    return _mark_spacing(_collapse_spaces(_collapse_lines(_space_blank_gap(s)))).strip()


def _q_2017_5(s: str) -> str:
    # Rejoin a wrapped hint and a wrapped continuation that would otherwise be
    # misread as new sub-parts.
    s = s.replace('a few days ago.\n          (already be)', 'a few days ago. (already be)')
    s = re.sub(r'but today he\n\s+', 'but today he ', s)
    return _drill(s)


def _q_2017_6(s: str) -> str:
    return _drill(s)


def _q_2026_19(s: str) -> str:
    return _mark_spacing(s)


def _q_2026_20(s: str) -> str:
    return _mark_spacing(s)


def _q_tech_2(s: str) -> str:
    # Long comprehension passage — keep the passage byte-for-byte.
    return s


def _q_tech_5(s: str) -> str:
    return _drill(s)


def _q_tech_6(s: str) -> str:
    return _drill(s)


def _q_asi_5(s: str) -> str:
    return _drill(s)


def _q_asi_6(s: str) -> str:
    return _drill(s)


def _q_si_fcs_3(s: str) -> str:
    # Long comprehension passage — keep the passage byte-for-byte.
    return s


def _q_mvi_8(s: str) -> str:
    return _drill(s)


def _q_mvi_10(s: str) -> str:
    # The printed header runs "provided below: (5 × 1 = 5)" on one line.
    s = re.sub(r'provided\n\s*below:', 'provided below:', s)
    return _drill(s)


PATCHES = {
    # (slug, written number) -> transform, answers, optional explanation
    ('inspector-stats-2026-p1', '19'): (
        _q_2026_19,
        ['shall we', 'is he', 'will you', 'will you', 'will you'],
        None,
    ),
    ('inspector-stats-2026-p1', '20'): (
        _q_2026_20,
        ['known'],
        None,
    ),
    ('inspector-stats-2017-english', '5'): (
        _q_2017_5,
        ['saw', 'met', 'was playing', 'was writing', 'bought',
         'has lived / has been living', 'had already been', 'have not had',
         'goes', 'is taking'],
        ('Suggested verb forms: (a) saw; (b) met; (c) was playing, was writing; '
         '(d) bought; (e) has lived / has been living; (f) had already been; '
         '(g) have not had; (h) goes, is taking. A definite past time takes the '
         'simple past (saw, met, bought); two simultaneous past actions take the '
         'past continuous (was playing … was writing); a state continuing from '
         'the past until now takes the present perfect (has lived, have not had); '
         'an action completed before a past reference point takes the past perfect '
         '(had already been); habits and arrangements take the simple present '
         '(goes, is taking). The intended negative in (g) is inferred from '
         'ordinary usage, because the bracket gives only “have”.'),
    ),
    ('inspector-stats-2017-english', '6'): (
        _q_2017_6,
        ['the longest', 'worse', 'the coldest', 'hotter', 'better',
         'the most popular', 'the richest', 'poorest', 'better', 'more'],
        ('Comparative forms (with “than”): worse, hotter, better, better, more. '
         'Superlative forms (with “the” or “one of the”): the longest, the '
         'coldest, the most popular, the richest, the poorest. One-syllable '
         'adjectives take -er/-est (long → the longest; hot → hotter) and longer '
         'ones take more/most (popular → more popular / the most popular); '
         'irregulars keep their own forms (good → better, bad → worse, '
         'many → more). These complete the printed grammar exercise; its sweeping '
         'factual claims about countries and continents should not be treated as '
         'current geography or demographic facts.'),
    ),
    ('technical-2024-p1', '2'): (_q_tech_2, ['Tedious / dull', 'consequences'], None),
    ('technical-2024-p1', '5'): (
        _q_tech_5,
        ['from', 'with / by', 'with', 'in / on', 'against', 'on / upon', 'at / on'],
        None,
    ),
    ('technical-2024-p1', '6'): (
        _q_tech_6,
        ['appears', 'did not have / have not had', 'will see', 'will have finished',
         'watches', 'had seen', 'is rising'],
        None,
    ),
    ('asi-2024-p1', '5'): (
        _q_asi_5,
        ['rotates', 'are', 'have known', 'calls', 'wept'],
        None,
    ),
    ('asi-2024-p1', '6'): (
        _q_asi_6,
        ['on', 'to', 'from', 'for', 'with'],
        None,
    ),
    ('si-fcs-2025-p1', '3'): (_q_si_fcs_3, ['aerobic', 'weight'], None),
    ('mvi-2025-p1', '8'): (
        _q_mvi_8,
        ['by / near', 'for', 'truth', 'while'],
        None,
    ),
    ('mvi-2025-p1', '10'): (
        _q_mvi_10,
        ['foot the bill', 'by long odds', 'took to his heels', 'tooth and nail',
         'within a stone’s throw of'],
        None,
    ),
}


# ---------------------------------------------------------------------------
# .ts file surgical edits — rebuild the record by locating field value spans.
# ---------------------------------------------------------------------------

def iter_ts_records(text: str):
    """Yield (record dict, start, end) for every question object in the file."""
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


def field_span(text: str, record_start: int, record_end: int, name: str):
    """Locate the text span of `"name": <value>` inside a record."""
    prefix = f'"{name}": '
    i = text.find(prefix, record_start, record_end)
    if i < 0:
        return None
    value_start = i + len(prefix)
    dec = json.JSONDecoder()
    _, value_end = dec.raw_decode(text, value_start)
    return value_start, value_end


def patch_ts(text: str) -> tuple[str, dict]:
    """Apply the curated patches to the committed .ts bank, in place."""
    changed = 0
    out = text
    # Process records top-down so earlier edits shift later offsets by a known
    # amount; simplest is to rebuild spans on every mutation via a loop.
    for _ in range(200):
        hit = None
        for row, start, end in iter_ts_records(out):
            key = (row['paperId'].removeprefix('mpsc-group-b-'), row['id'].rsplit('-written-', 1)[-1])
            if key not in PATCHES:
                continue
            transform, answers, explanation = PATCHES[key]
            q_span = field_span(out, start, end, 'question')
            assert q_span is not None, f'{row["id"]}: missing question field'
            old_q = json.loads(out[q_span[0]:q_span[1]])
            new_q = transform(old_q)
            blanks = len(BLANK_RE.findall(new_q))
            assert blanks == len(answers), (
                f'{row["id"]}: {blanks} blanks but {len(answers)} answers'
            )
            patch: list[tuple[int, int, str]] = []
            if new_q != old_q:
                patch.append((q_span[0], q_span[1], json.dumps(new_q, ensure_ascii=False)))
            if 'answers' not in row:
                # Insert the answers field just before "explanation", keeping
                # the edition to a quoted field and leaving every other token
                # untouched.
                ins_start = out.find('"explanation"', start, end)
                assert ins_start >= 0, f'{row["id"]}: missing explanation field'
                patch.append((ins_start, ins_start,
                              '"answers": ' + json.dumps(answers, ensure_ascii=False) + ',\n    '))
            if explanation is not None:
                x_span = field_span(out, start, end, 'explanation')
                assert x_span is not None, f'{row["id"]}: missing explanation field'
                old_x = json.loads(out[x_span[0]:x_span[1]])
                if old_x != explanation:
                    patch.append((x_span[0], x_span[1], json.dumps(explanation, ensure_ascii=False)))
            if not patch:
                continue
            # Apply in reverse span order so earlier offsets stay valid.
            for a, b, repl in sorted(patch, reverse=True):
                out = out[:a] + repl + out[b:]
            changed += 1
            hit = True
            break
        if not hit:
            break
    return out, changed


# ---------------------------------------------------------------------------
# Repairs JSON — update the durable generator input the same way.
# ---------------------------------------------------------------------------

def patch_repairs(repairs: dict) -> int:
    changed = 0
    for (slug, num), (transform, answers, explanation) in PATCHES.items():
        rec = repairs['papers'][slug]['written'][num]
        new_q = transform(rec['q'])
        blanks = len(BLANK_RE.findall(new_q))
        assert blanks == len(answers), f'{slug}/{num}: {blanks} blanks but {len(answers)} answers'
        if rec['q'] != new_q:
            rec['q'] = new_q
            changed += 1
        if rec.get('answers') != answers:
            rec['answers'] = answers
            changed += 1
        if explanation is not None and rec.get('explanation') != explanation:
            rec['explanation'] = explanation
            changed += 1
    return changed


def main() -> int:
    ts_text = TS_FILE.read_text()
    new_ts, ts_changed = patch_ts(ts_text)
    TS_FILE.write_text(new_ts)

    repairs = json.loads(REPAIRS_FILE.read_text())
    rep_changed = patch_repairs(repairs)
    REPAIRS_FILE.write_text(json.dumps(repairs, ensure_ascii=False, indent=2) + '\n')

    # Sync invariant: committed stem must match the durable repair stem and the
    # answers must line up one-per-blank, for every patched record.
    final_ts = TS_FILE.read_text()
    rows = {r['id']: r for r, _, _ in iter_ts_records(final_ts)}
    for (slug, num), (_, answers, _) in PATCHES.items():
        rid = f'mpsc-group-b-{slug}-written-{num}'
        rec = rows[rid]
        repair = repairs['papers'][slug]['written'][num]
        assert rec['question'] == repair['q'], f'{rid}: committed stem diverged from repair stem'
        assert rec.get('answers') == repair.get('answers') == answers, f'{rid}: answers out of sync'
        assert rec.get('explanation') == repair.get('explanation'), f'{rid}: explanation out of sync'

    print(f'patched {ts_changed} record(s) in {TS_FILE.name}')
    print(f'patched {rep_changed} record(s) in {REPAIRS_FILE.name}')
    print('invariants: committed stem == repair stem; one answer per blank')
    return 0


if __name__ == '__main__':
    sys.exit(main())