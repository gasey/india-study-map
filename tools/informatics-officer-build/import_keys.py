"""Extract Set A from the user-supplied MUDAL PDFs; preserve bold key evidence.

No inferred answers. Every non-compensated question must have exactly one bold
option. Other sets remain in the original PDFs and are not duplicated in drills.
"""
import json
import re
from pathlib import Path
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / 'public/mpsc-informatics-officer'
SPECS = [('technical-i', 'TECH1', 9), ('technical-ii', 'TECH2', 16), ('technical-iii', 'TECH3', 15), ('gs', 'GS', 16)]


def extract(name, paper, pages):
    doc = fitz.open(DEST / f'sources/system-analyst-{name}-key.pdf')
    rows = []
    current = None
    field = None
    for pn in range(pages):
        page = doc[pn]
        lines = [l for b in page.get_text('dict')['blocks'] for l in b.get('lines', [])]
        # Paper I is two independent reading columns; the rest are single-column.
        columns = [[l for l in lines if l['bbox'][0] < page.rect.width/2],
                   [l for l in lines if l['bbox'][0] >= page.rect.width/2]] if paper == 'TECH1' else [lines]
        for column in columns:
            for line in sorted(column, key=lambda l: (round(l['bbox'][1]), l['bbox'][0])):
                text = ''.join(s['text'] for s in line['spans']).strip()
                y = line['bbox'][1]
                if not text or (paper != 'GS' and (y < 62 or y > page.rect.height-65)):
                    continue
                if re.search(r'Series-[A-D]|Set\s*[-–:]|SYSTEM ANALYST|GENERAL STUDIES|Paper\s*-', text):
                    continue
                # Source page 9 omits the A label before WHERE in Q54.
                if paper == 'TECH2' and pn == 8 and current and current['no'] == 54 and text == 'WHERE':
                    text = 'A. WHERE'
                if paper == 'TECH2' and pn == 10 and current and current['no'] == 69 and text == 'Increasing table size':
                    text = 'A. Increasing table size'
                if paper == 'TECH2' and pn == 10 and current and current['no'] == 72 and text == 'Increase the number of intermediate tuples':
                    text = 'A. Increase the number of intermediate tuples'
                if paper == 'TECH3' and pn == 5 and current and current['no'] == 38 and text == 'A. Black-box testing':
                    text = 'B. Black-box testing'  # duplicated A label in the supplied source
                question = re.match(r'^(\d{1,3})\.\s*(.*)', text)
                option = re.match(r'^(?:\(([a-d])\)|([A-Da-d])[.)])\s*(.*)', text)
                if question and int(question[1]) == len(rows) + 1:
                    current = {'no': int(question[1]), 'q': question[2], 'opts': {}, 'keys': [], 'page': pn+1}
                    rows.append(current); field = 'q'
                elif current and option:
                    field = (option[1] or option[2]).upper()
                    assert field not in current['opts'], (paper, current['no'], 'duplicate option', field)
                    current['opts'][field] = option[3]
                    if any('bold' in s['font'].lower() and re.sub(r'^(?:\([a-d]\)|[A-Da-d][.)])\s*', '', s['text'].strip()) for s in line['spans']):
                        current['keys'].append(field)
                elif current:
                    if field == 'q': current['q'] += ' ' + text
                    elif field: current['opts'][field] += ' ' + text
    assert [q['no'] for q in rows] == list(range(1, 101)), (paper, [q['no'] for q in rows])
    for q in rows:
        assert set(q['opts']) == set('ABCD') and all(q['opts'].values()), (paper, q)
        compensated = paper == 'TECH1' and 56 <= q['no'] <= 65
        assert len(q['keys']) == 1 or compensated, (paper, q)
        q.update(id=f'MUDAL_SA_2026_{paper}_A_{q["no"]:03}', paper=paper, src='past',
                 sitting=f'MUDAL System Analyst 2026 · {paper} · Set A', srcKey=f'MUDAL_SA_2026_{paper}_A',
                 ans=None if compensated else q['keys'][0], prov='Published answer key in user-supplied MUDAL PDF (bold option)',
                 exp='', sourceUrl=f'sources/system-analyst-{name}-key.pdf#page={q["page"]}',
                 note=('Compensated for printing error by UD&PA notification dated 14 September 2026. Excluded from scored practice.' if compensated else 'Answer transcribed from the bold option in the supplied key; no independent solution is claimed.'),
                 compensated=compensated)
        if (paper, q['no']) in [('TECH2', 54), ('TECH2', 69), ('TECH2', 72), ('TECH3', 38)]:
            q['note'] += ' The source has a missing or repeated option label; labels were normalised to A-D without changing option text or the marked answer.'
        q['q'] = q['q'].strip()
        q['opts'] = {k: v.strip() for k, v in q['opts'].items()}
        del q['keys']
    return rows

if __name__ == '__main__':
    rows = [q for name, paper, pages in SPECS for q in extract(name, paper, pages)]
    (DEST / 'past-papers.js').write_text('window.IO_PAST_QUESTIONS = '+json.dumps(rows, ensure_ascii=False, indent=2)+';\n')
    print(f'Extracted {len(rows)} Set A questions; {sum(q["compensated"] for q in rows)} compensated.')
