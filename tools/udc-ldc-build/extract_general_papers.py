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
from group_b_sources import ARCHIVE, ALL_GENERAL_PAPERS, DIRECT_2019_SLUGS, ROOT, HERE, source_path
from enrich_2018_papers import enrich, SOURCE_URLS, ENRICHMENT_VERSIONS

OUT = HERE / 'extracted'

# 2019-2020 written language Paper-I papers. Their numbered tasks are essays,
# precis, letters and phrase/idiom exercises, so the four-option parser drops
# them. Forcing these papers through the conventional path preserves the tasks
# as descriptive prompts (with any listed sub-parts) instead of losing them.
WRITTEN_ONLY_2019 = {
    'aap-2020-english', 'ae-civil-tourism-2020-english', 'ceo-2019-english-p1',
    'eo-2019-english-p1', 'eo-leit-2019-english-p1', 'aeo-2019-english',
    'iof-2019-english', 'fr-2019-english-1', 'inspector-excise-2019-english-p1',
    'vo-2019-english-p1', 'mes-phe-2019-english', 'sub-div-lib-2019-english',
    'tutor-mcon-2019-english', 'mes-pwd-2020-english', 'mpe-ss-2020-english',
    'seo-2020-english-p1', 'to-2020-english-p1', 'geologist-jun-nov-2020-english-p1',
    'geologist-jun-2020-english-p1', 'inspector-fcs-2019-english-p1',
}


def extract_one(row):
    slug, exam, sitting, subject, filename = row
    output = OUT / (slug + '.json')
    source = source_path(slug, filename)
    source_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    if output.exists() and '--force' not in sys.argv:
        cached = json.loads(output.read_text())
        if cached.get('sourceSha256') == source_sha and (slug not in SOURCE_URLS or cached.get('enrichmentVersion') == ENRICHMENT_VERSIONS[slug]):
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
    # Several 2018 English items intentionally print three alternatives.
    # Preserve their actual choices instead of dropping them or inventing D.
    option_counts = (3, 4) if slug.startswith(('si-police-ub-2018-', 'horticulture-demonstrator-2018-', 'si-fcs-2018-', 'programmer-phe-2018-', 'sericulture-seo-2018-', 'station-officer-2018-')) else (4,)
    if slug in DIRECT_2019_SLUGS:
        # The 2019-2020 English/General Studies sections print three-choice
        # sentence-type and idiom items; keep the printed option count.
        option_counts = (4,) if slug in WRITTEN_ONLY_2019 else (3, 4)
    if slug in WRITTEN_ONLY_2019:
        # "Attempt all questions." marks these as all-conventional papers.
        module.ANSWER_SHEET_RE = re.compile(r'attempt all questions', re.I)
    qs, threshold, notes, markers, written = module.extract(str(source), 'blue', allow_number_gaps=ocr, option_counts=option_counts)
    # A parser gap is recorded, not converted to fake questions or answers.
    numbers = {}
    for q in qs:
        numbers.setdefault(q.get('part') or '-', []).append(q['n'])
    gaps = {part: sorted(set(range(min(ns), max(ns)+1))-set(ns)) for part, ns in numbers.items()}
    result = {'slug': slug, 'exam': exam, 'sitting': sitting, 'subject': subject, 'source': filename, 'sourceSha256': source_sha,
              'ocr': ocr, 'count': len(qs), 'questions': qs, 'written': written, 'notes': notes, 'gaps': gaps}
    result = enrich(result, source)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    return slug, result['count'], 'OCR review' if ocr else 'native text'


if __name__ == '__main__':
    OUT.mkdir(exist_ok=True)
    with ProcessPoolExecutor(max_workers=4) as pool:
        for result in pool.map(extract_one, ALL_GENERAL_PAPERS):
            print(*result, flush=True)
