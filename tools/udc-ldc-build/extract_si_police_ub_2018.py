"""Re-extract the three official Sub Inspector (UB) 2018 PDFs to JSON."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent
PUBLIC = ROOT / 'public' / 'papers' / 'group-b'
OUT = HERE / 'extracted' / 'si-police-ub-2018.json'

PAPERS = [
    ('si-police-ub-2018-english', 'si-police-ub-2018-english.pdf', 'General English', 80, True),
    ('si-police-ub-2018-gk', 'si-police-ub-2018-gk.pdf', 'General Knowledge', 100, False),
    ('si-police-ub-2018-mathematics', 'si-police-ub-2018-mathematics.pdf', 'Mathematics', 100, False),
]

# PDF text extraction lays out these four fraction choices in two columns and
# separates their labels from numerator/denominator. Preserve the printed values.
OPTION_REPAIRS = {
    ('si-police-ub-2018-mathematics', 14): ['4/11', '4/25', '5/11', '5/9'],
    ('si-police-ub-2018-mathematics', 27): ['7/15', '4/11', '8/15', '3/11'],
    ('si-police-ub-2018-mathematics', 38): ['2/9', '3/7', '4/7', '2/5'],
    ('si-police-ub-2018-mathematics', 97): ['2/13', '4/13', '1/26', 'None of these'],
}

OPTION_MARKER = re.compile(r'(?m)(?:^[ \t]*| {2,})\(([a-d])\s*\)\s*')
QUESTION_START = re.compile(r'^\s*(\d{1,3})\.\s+', re.M)


def clean(text):
    text = re.sub(r'\f\s*-\s*\d+\s*-', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip(' \t-')


def read_pdf(path):
    result = subprocess.run(['pdftotext', '-layout', str(path), '-'], check=True,
                            capture_output=True, text=True)
    return result.stdout


def parse_paper(pid, filename, subject, expected, has_essay):
    pdf = PUBLIC / filename
    text = read_pdf(pdf)
    if has_essay:
        text = text[text.find('SECTION - B'):]
        if not text:
            raise ValueError('English Section B was not found')
    matches = list(QUESTION_START.finditer(text))
    chunks = {}
    for index, match in enumerate(matches):
        number = int(match.group(1))
        if number < 1 or number > expected or number in chunks:
            continue
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        chunks[number] = text[match.start():end]
    if set(chunks) != set(range(1, expected + 1)):
        raise ValueError(f'{pid}: question numbering mismatch: {sorted(chunks)}')

    rows = []
    for number, chunk in sorted(chunks.items()):
        # Directions between adjacent question ranges are not part of the last
        # option in the preceding item.
        chunk = re.split(r'(?im)^\s*Directions?\s*\(\s*Questions?\b', chunk)[0]
        markers = list(OPTION_MARKER.finditer(chunk))
        if has_essay:
            markers = [m for m in markers if m.group(1).lower() in 'abcd']
        labels = ''.join(m.group(1).lower() for m in markers)
        repaired_options = OPTION_REPAIRS.get((pid, number))
        if labels not in ('abcd', 'abc') and not repaired_options:
            raise ValueError(f'{pid} Q{number}: unexpected option labels {labels!r}')
        if not markers:
            raise ValueError(f'{pid} Q{number}: no options found')
        stem = clean(chunk[:markers[0].start()])
        stem = re.sub(r'^\d{1,3}\.\s*', '', stem)
        options = [clean(chunk[m.end():markers[i + 1].start() if i + 1 < len(markers) else len(chunk)])
                   for i, m in enumerate(markers)]
        if repaired_options:
            options = repaired_options
        if not stem or any(not option for option in options):
            raise ValueError(f'{pid} Q{number}: empty stem or option')
        page = text.count('\f', 0, matches[number - 1].start()) + 1
        rows.append({'n': number, 'q': stem, 'options': options, 'page': page})

    directions = {}
    if pid.endswith('-english'):
        passage_one = re.search(r'Direction\s*\(Question No\.\s*17\s*-\s*26\).*?(?=^\s*17\.)', text, re.M | re.S)
        passage_two = re.search(r'Direction\s*\(Questions? No\.\s*27\s*-\s*32\).*?(?=^\s*27\.)', text, re.M | re.S)
        if not passage_one or not passage_two:
            raise ValueError('English comprehension passages were not found')
        p1_context = clean(re.sub(r'Direction\s*\(Question No\.\s*17\s*-\s*26\)\s*:\s*Read the passage carefully and choose the correct answers from the options given\.', '', passage_one.group(0), flags=re.I))
        p2_context = clean(re.sub(r'Direction\s*\(Questions? No\.\s*27\s*-\s*32\)\s*:\s*Read the passage carefully and answer the questions that follow it\s*:', '', passage_two.group(0), flags=re.I))
        directions.update({n: 'Choose the correct alternative for the idiom or phrase.' for n in range(1, 17)})
        directions.update({n: 'Read the passage below, then answer.\n\n' + p1_context for n in range(17, 21)})
        directions.update({n: 'Choose the synonym of a word from the passage.\n\n' + p1_context for n in range(21, 24)})
        directions.update({n: 'Choose the antonym of a word from the passage.\n\n' + p1_context for n in range(24, 27)})
        directions.update({n: 'Read the passage below, then answer.\n\n' + p2_context for n in range(27, 33)})
        directions.update({n: 'Identify the part of speech of the underlined word. The underline is visible in the linked source PDF.' for n in range(33, 41)})
        directions.update({n: 'Identify the sentence type or follow the transformation instruction in the source PDF.' for n in range(41, 65)})
        directions.update({n: 'Choose the one-word substitution.' for n in range(65, 71)})
        directions.update({n: 'Choose the correct word or the requested meaning as stated in the source PDF.' for n in range(71, 81)})
        rows = [dict(row, direction=directions[row['n']]) for row in rows]

    return {
        'id': pid, 'pdf': filename, 'subject': subject, 'expectedMcq': expected,
        'durationMinutes': 180, 'marksPerQuestion': 1,
        'sourceSha256': hashlib.sha256(pdf.read_bytes()).hexdigest(),
        'questions': rows,
        'essay': ('Write an essay of no more than 300 words on one of: Corruption in everyday life; '
                  'The Role of Politics in Socio-Economic development of a country; Science and Religion.'
                  if has_essay else None),
    }


def main():
    data = {'papers': [parse_paper(*paper) for paper in PAPERS]}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'Wrote {sum(len(p["questions"]) for p in data["papers"])} MCQs and 1 essay prompt to {OUT}')


if __name__ == '__main__':
    main()
