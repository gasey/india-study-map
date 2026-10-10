"""Retain passages and source crops for the newly recovered 2018 papers.

These are transcription inputs, not answer keys. Source images preserve
fractions, diagrams and underlining that the native text parser cannot retain.
"""
import io
import re
import subprocess
import json
from pathlib import Path
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
IMAGE_DIR = ROOT / 'public/question-images/group-b/recovered-2018'
SOURCE_URLS = {
    'si-police-ub-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/7ea8b8ea1e5f539158c3b1ac7f993745/general-english-siub.pdf',
    'si-police-ub-2018-gk': 'https://mpsc.mizoram.gov.in/uploads/attachments/7477588fff161f74676d7b3d9a5f085f/general-knowledge-siub.pdf',
    'si-police-ub-2018-mathematics': 'https://mpsc.mizoram.gov.in/uploads/attachments/0a2b9b65d7cb64ad4d52df271c457d94/mathematics-siub.pdf',
    'horticulture-demonstrator-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/4c71d1bb57e66f289453d1fb9329a071/general-english-shd.pdf',
    'si-fcs-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/9ee944f0d21d17a17b70f2d39032d2d4/general-english-si.pdf',
    'si-fcs-2018-gs1': 'https://mpsc.mizoram.gov.in/uploads/attachments/84fe7a62f3e9ca4ca480a795a7dc6eba/general-studies-i-si.pdf',
    'si-fcs-2018-gs2': 'https://mpsc.mizoram.gov.in/uploads/attachments/b2f6ad6d0e4aac657e0b20723f01ceac/general-studies-ii-si.pdf',
    'programmer-phe-2018-english-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/25d5405d28f4fa769cce8f7517ca108a/general-english-paper-i-prog.pdf',
    'programmer-phe-2018-english-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/f75417f53c31602c36769e7dd4d9ab02/general-english-paper-ii-prog.pdf',
    'sericulture-seo-2018-english-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/e83fbf587c790937272231271b860b7e/general-english-i-seo.pdf',
    'sericulture-seo-2018-english-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/6fd26ad76e14aa1bd74ad52382891b48/general-english-ii-seo.pdf',
    'station-officer-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/4b54689a35e32b572b5d96f3f6052009/general-english-so.pdf',
    'station-officer-2018-gk': 'https://mpsc.mizoram.gov.in/uploads/attachments/ee60476b614bc2a5f48ddc9bf390beda/general-knowledge-so.pdf',
    'station-officer-2018-mathematics': 'https://mpsc.mizoram.gov.in/uploads/attachments/44087a9f343774575dd773f784451873/mathematics-so.pdf',
    'mes-pwd-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/31020d8a6d006e036db94568c7f7c844/general-english-pwd.pdf',
    'mes-pwd-2018-gs': 'https://mpsc.mizoram.gov.in/uploads/attachments/8026b2bc276ed79e522a02ba24a47cf4/general-studies-pwd.pdf',
    'mes-power-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/9fc635f1f2065b5f9a9244c94de4e2c4/general-english-pe.pdf',
    'mes-power-2018-gs': 'https://mpsc.mizoram.gov.in/uploads/attachments/55dbabb2d9d4fa0eb86d2890e0b89ffe/general-studies-pe.pdf',
    'veterinary-officer-2018-english-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/c6b3ab1fe0ba8ffc11990fe7e0594eda/ahvetygeneral-english-paper-i.pdf',
    'veterinary-officer-2018-english-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/927e2b542a6033a46b891e4265a50a7f/ahvetygeneral-english-paper-ii.pdf',
    'je-iwr-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/31248550a2747b5ec1865d910cd70335/general-english-.pdf',
    'assistant-jailor-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/987e035775f13ece0636d5f3576877da/general-english-1.pdf',
    'asi-home-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/252c2bc337497471874e3577dea22ca9/gen-english.pdf',
    'asi-home-2018-gk': 'https://mpsc.mizoram.gov.in/uploads/attachments/0dfe5e79a47781118ebbebadc50fb1fa/general-knowledge.pdf',
    'asi-home-2018-mathematics': 'https://mpsc.mizoram.gov.in/uploads/attachments/bb945621c2ab504ede38994393c3be7d/mathematics.pdf',
    'assistant-grade-2018-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/f48ddda4e8c5443eb9ad87d30e85b035/assistant-grade-paper-i.pdf',
    'assistant-grade-2018-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/d607eb9ce8b9d614f7b3182105066f74/assistant-grade-paper-ii.pdf',
    'acf-2018-english': 'https://mpsc.mizoram.gov.in/uploads/attachments/2022/11/5346b34df48ea93827fdc570f36227ae/acf-general-english.pdf',
    'acf-2018-gk': 'https://mpsc.mizoram.gov.in/uploads/attachments/2022/11/4383215b71170131887f678da00c1524/acf-general-knowledge.pdf',
    'asce-2021-english-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/ddea45efb2d2df1cb7eb2e00a234424e/asce-general-english-paper-i.pdf',
    'asce-2021-english-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/6166f18e72e93efccca99920fe815f5a/asce-general-english-paper-ii.pdf',
    'vety-mah-2021-english-p1': 'https://mpsc.mizoram.gov.in/uploads/attachments/7b7af9c664ce828ce7c815c8dafcae96/jr-gr-of-mah-vety-general-english-paper-i.pdf',
    'vety-mah-2021-english-p2': 'https://mpsc.mizoram.gov.in/uploads/attachments/29018a49281ddd387e32d3dba38b5fc4/jr-gr-of-mah-vety-general-english-paper-ii.pdf',
}
ENRICHMENT_VERSIONS = {slug: (2 if slug.startswith(('asce-2021-', 'vety-mah-2021-')) else 5 if slug in ('mes-pwd-2018-english', 'mes-pwd-2018-gs', 'mes-power-2018-english', 'mes-power-2018-gs', 'veterinary-officer-2018-english-p1', 'veterinary-officer-2018-english-p2', 'je-iwr-2018-english', 'assistant-jailor-2018-english', 'asi-home-2018-english', 'asi-home-2018-gk', 'asi-home-2018-mathematics', 'assistant-grade-2018-p1', 'assistant-grade-2018-p2', 'acf-2018-english', 'acf-2018-gk') else 3) for slug in SOURCE_URLS}
ARCHIVE_2023_2025 = json.loads((Path(__file__).parent / 'mpsc-archive-2023-2025.json').read_text())
SOURCE_URLS.update({row['slug']: row['url'] for row in ARCHIVE_2023_2025})
ENRICHMENT_VERSIONS.update({row['slug']: 1 for row in ARCHIVE_2023_2025})



def source_passage(text, start, first_question):
    tail = text[text.index(start):]
    end = re.search(r'^\s*' + str(first_question) + r'\.\s', tail, re.M)
    assert end, (start, first_question)
    passage = tail[:end.start()].replace('\f', '\n')
    passage = re.sub(r'^\s*-\s*\d+\s*-\s*$', '', passage, flags=re.M)
    return re.sub(r'\s+', ' ', passage).strip()


def question_crop(doc, row, slug):
    """Crop a printed question by its native page and left-margin number."""
    page = doc[row['page'] - 1]
    starts = [(int(w[4][:-1]), w[1]) for w in page.get_text('words')
              if w[0] < 85 and re.fullmatch(r'\d{1,3}\.', w[4])]
    ys = [y for n, y in starts if n == row['n']]
    assert ys, (slug, row['n'], row['page'])
    top = max(ys) - 13  # Include raised fraction numerators and exponents.
    following = [y for n, y in starts if n > row['n'] and y > top + 5]
    bottom = min(following) - 3 if following else page.rect.height - 35
    content = [w[3] for w in page.get_text('words')
               if top <= w[1] and w[3] <= bottom and not re.fullmatch(r'\*+', w[4])]
    if content:
        bottom = min(bottom, max(content) + 7)
    clip = pymupdf.Rect(38, max(0, top), page.rect.width - 30, bottom)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1.8, 1.8), clip=clip)
    image = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
    filename = f'{slug}-q{row["n"]:03d}.webp'
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    image.save(IMAGE_DIR / filename, 'WEBP', quality=88)
    row['imagePath'] = '/question-images/group-b/recovered-2018/' + filename


def enrich(result, source):
    slug = result['slug']
    if slug not in SOURCE_URLS:
        return result
    result['sourceUrl'] = SOURCE_URLS[slug]
    if slug in {row['slug'] for row in ARCHIVE_2023_2025}:
        result['enrichmentVersion'] = ENRICHMENT_VERSIONS[slug]
        result['answerStatus'] = 'No verified key or worked solutions attached; unscored source transcription.'
        return result
    result['enrichmentVersion'] = ENRICHMENT_VERSIONS[slug]
    result['answerStatus'] = 'No verified key or worked solutions attached; unscored source transcription.'
    rows = {q['n']: q for q in result['questions']}
    written_only = ('mes-pwd-2018-english', 'mes-power-2018-english', 'veterinary-officer-2018-english-p1', 'assistant-grade-2018-p1', 'asce-2021-english-p1', 'vety-mah-2021-english-p1')
    if slug in written_only:
        # These are written language papers. The generic parser can mistake
        # subparts for MCQs, so leave them unscored until separately transcribed.
        rows = {}
    if slug == 'horticulture-demonstrator-2018-english':
        assert result['sourceSha256'] == 'cd686973b1e79f802c33c1838962828c46709f1a4ffc53bdfe03d005c646f998', 'Recheck changed SHD source before applying Q24 repair'
        # The source prints (a), (b), (d), (d). Preserve the four alternatives
        # in their visual order and keep this defective label item unscored.
        rows[24] = {'n': 24, 'page': 4, 'part': 'B',
                    'q': 'Which of the following conveys the same meaning as the word “mark” as used in the passage?',
                    'opts': {'a': 'Symbol', 'b': 'Sign', 'c': 'Distinguish', 'd': 'Notice'},
                    'unscored': True,
                    'reviewNote': 'The source labels both lower options (d). Alternatives are displayed in their printed visual order; no answer is scored.'}
    if slug == 'si-police-ub-2018-mathematics':
        assert result['sourceSha256'] == '7b2e6c54c18657b2b22b82ecfc19659343a921b3aae30c0bda7ec3ee22b5af87', 'Recheck changed Mathematics source before applying Q46 repair'
        # Q46 prints “(d )”, which the option-marker parser fails to recognize.
        rows[46]['q'] = 'The length and breadth of a rectangular hall are 40 m and 30 m respectively. The distance between the two opposite corners of the hall is —'
        rows[46]['opts'] = {'a': '50 m', 'b': '60 m', 'c': '70 m', 'd': '80 m'}
    if slug == 'sericulture-seo-2018-english-p2':
        source_hash = __import__('hashlib').sha256(source.read_bytes()).hexdigest()
        assert source_hash == 'eca292bd3eabc70ae7e3aae4bb485f33a61327bc593fd77796045ca76687c5e0', 'Recheck changed Sericulture Paper-II source before applying Q58 repair'
        rows[58] = {'n': 58, 'page': 5,
                    'q': 'I have some duties. I must perform them. (use infinitive)',
                    'opts': {'a': 'I must perform some duties.',
                             'b': 'I have some duties to perform.',
                             'c': 'I am performing some duties.',
                             'd': 'I have performed some duties.'},
                    'unscored': True,
                    'reviewNote': 'The printed source labels both the second and third choices (b). Choices are displayed in visual order; no answer is scored.'}
    text = subprocess.check_output(['pdftotext', '-layout', str(source), '-'], text=True)
    passages = []
    if slug == 'si-police-ub-2018-english':
        passages = [(17, 26, 'Modern technology is increasingly', 17),
                    (27, 32, 'Since the world has become industrialised', 27)]
    elif slug == 'programmer-phe-2018-english-p1':
        passages = [(1, 8, 'Though the U.S prides itself on being a leader', 1),
                    (25, 32, 'Though the U.S prides itself on being a leader', 25)]
    elif slug == 'sericulture-seo-2018-english-p1':
        passages = [(17, 26, 'I designed, after my first voyage', 17),
                    (27, 32, 'Many men and women are so money minded', 27)]
    elif slug == 'horticulture-demonstrator-2018-english':
        passages = [(17, 28, 'A recent report titled', 17)]
    elif slug == 'si-fcs-2018-english':
        passages = [(17, 28, '“My God, it speaks”', 17)]
    elif slug == 'station-officer-2018-english':
        passages = [(1, 12, 'Rights and duties are two sides of the same coin', 1)]
    for lo, hi, start, first in passages:
        passage = source_passage(text, start, first)
        for n in range(lo, hi + 1):
            rows[n]['passage'] = passage
    image_numbers = {
        'si-police-ub-2018-english': set(range(33, 41)) | set(range(71, 76)),
        'horticulture-demonstrator-2018-english': {24} | set(range(35, 41)) | set(range(54, 59)) | set(range(73, 81)),
        'si-fcs-2018-english': set(range(1, 17)) | set(range(37, 43)) | set(range(54, 60)) | set(range(73, 81)),
        'programmer-phe-2018-english-p1': set(range(33, 41)) | set(range(73, 81)),
        'programmer-phe-2018-english-p2': set(range(1, 11)) | set(range(50, 64)) | set(range(81, 94)),
        'sericulture-seo-2018-english-p1': set(range(33, 41)),
        'sericulture-seo-2018-english-p2': set(range(1, 11)),
        'station-officer-2018-english': set(range(29, 39)) | set(range(64, 69)),
    }.get(slug, set())
    if slug in ('si-police-ub-2018-mathematics', 'si-fcs-2018-gs2'):
        image_numbers = set(rows)
        for row in rows.values():
            row['unscored'] = True
            row['reviewNote'] = 'The original question image preserves mathematical notation and any diagrams. Text, option order and answers require source review; this item is not scored.'
    if image_numbers:
        with pymupdf.open(source) as doc:
            for n in sorted(image_numbers):
                question_crop(doc, rows[n], slug)
    expected = (0 if slug in written_only else
                125 if slug == 'assistant-grade-2018-p2' else
                100 if slug in ('asce-2021-english-p2', 'vety-mah-2021-english-p2') else
                75 if slug.startswith('si-fcs-') and 'English' not in result['subject'] else
                80 if 'English' in result['subject'] and not slug.endswith('-p2') else 100)
    partial_source = slug.startswith(('mes-pwd-2018-', 'mes-power-2018-', 'veterinary-officer-2018-', 'je-iwr-2018-', 'assistant-jailor-2018-', 'asi-home-2018-', 'assistant-grade-2018-', 'acf-2018-', 'asce-2021-', 'vety-mah-2021-'))
    if partial_source:
        # Preserve native text-layer gaps. The paper PDF remains authoritative;
        # missing questions are not synthesized from numbering alone.
        assert set(rows) <= set(range(1, expected + 1)), slug
    else:
        assert set(rows) == set(range(1, expected + 1)), (slug, sorted(set(range(1, expected + 1)) - set(rows)))
    result['questions'] = [rows[n] for n in sorted(rows)]
    result['count'] = len(rows)
    if not partial_source:
        result['gaps'] = {next(iter(result['gaps']), '-'): []}
    return result
