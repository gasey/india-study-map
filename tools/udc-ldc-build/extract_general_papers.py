"""Extract all scoped general papers; preserve uncertain OCR for review.

Reuses the existing geometric native-PDF parser. Scans use Tesseract word boxes
with the same option/number parser, and are explicitly marked as OCR review.
Answers are never guessed by this extraction step.
"""
import csv
import importlib.util
import io
import json
import re
import subprocess
import sys
import hashlib
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from PIL import Image
from group_b_sources import ARCHIVE, GENERAL_PAPERS, ROOT, HERE, source_path

OUT = HERE / 'extracted'


def extract_one(row):
    slug, exam, sitting, subject, filename = row
    output = OUT / (slug + '.json')
    source = source_path(slug, filename)
    source_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    if output.exists() and '--force' not in sys.argv:
        cached = json.loads(output.read_text())
        if cached.get('sourceSha256') == source_sha:
            return slug, cached['count'], 'cached'
    native = subprocess.check_output(['pdftotext', '-layout', str(source), '-'], text=True)
    ocr = len(native.strip()) < 100
    spec = importlib.util.spec_from_file_location('general_paper_extract', ROOT / 'tools' / 'practice-hub-build' / 'extract.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.QNUM_RE = re.compile(r'^(\d{1,3})(?:\s*[.,]\s*|\s+(?=[A-Za-z])|(?=[A-Z]))')
    images = Path('/tmp/group-b-paper-extraction') / slug
    images.mkdir(parents=True, exist_ok=True)
    module.tempfile.mkdtemp = lambda: str(images)
    if ocr:
        module.QNUM_RE = re.compile(r'^(\d{1,3})[.,]\s*')
        def page_chars(_):
            for image in sorted(images.glob('p-*.png')):
                width, height = Image.open(image).size
                tsv = subprocess.check_output(['tesseract', str(image), 'stdout', '--psm', '6', 'tsv'], text=True, stderr=subprocess.DEVNULL)
                rows = [r for r in csv.DictReader(io.StringIO(tsv), delimiter='\t') if r['text'].strip()]
                baselines = {}
                for r in rows:
                    line = (r['block_num'], r['par_num'], r['line_num'])
                    baselines[line] = max(baselines.get(line, 0), int(r['top']) + int(r['height']))
                chars = []
                for r in rows:
                    text = r['text']
                    if re.fullmatch(r'[({][a-dA-D][)}]', text):
                        text = '(' + text[1].lower() + ')'
                    left, w = int(r['left']), int(r['width'])
                    line = (r['block_num'], r['par_num'], r['line_num'])
                    y0 = (height - baselines[line]) / module.SCALE
                    for i, char in enumerate(text):
                        chars.append(module.GlyphPath(char, ((left + w*i/len(text))/module.SCALE, y0,
                                                            (left+w*(i+1)/len(text))/module.SCALE, y0+12), 12))
                yield chars
        module.page_chars = page_chars
    qs, threshold, notes, markers, written = module.extract(str(source), 'blue', allow_number_gaps=ocr)
    # A parser gap is recorded, not converted to fake questions or answers.
    numbers = {}
    for q in qs:
        numbers.setdefault(q.get('part') or '-', []).append(q['n'])
    gaps = {part: sorted(set(range(min(ns), max(ns)+1))-set(ns)) for part, ns in numbers.items()}
    result = {'slug': slug, 'exam': exam, 'sitting': sitting, 'subject': subject, 'source': filename, 'sourceSha256': source_sha,
              'ocr': ocr, 'count': len(qs), 'questions': qs, 'written': written, 'notes': notes, 'gaps': gaps}
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    return slug, len(qs), 'OCR review' if ocr else 'native text'


if __name__ == '__main__':
    OUT.mkdir(exist_ok=True)
    with ProcessPoolExecutor(max_workers=4) as pool:
        for result in pool.map(extract_one, GENERAL_PAPERS):
            print(*result, flush=True)
