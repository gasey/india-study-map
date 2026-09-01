#!/usr/bin/env python3
"""Parse MPSC CSE past-paper text dumps into structured questions.

v2: carries real exam metadata (filenames in the folder are wrong -
'CSE 2015' actually holds 7 sittings from 2010-2023), separates MCQ from
Section-B conventional/essay questions instead of discarding the latter,
recovers page-break-merged questions, and flags 5-option questions since
the System Analyst renderer only draws A-D.

Conservative by design: everything unparsed is written out with its raw
text so a human can see what was lost. This bank has had a silent
OCR-drop incident before (DEVLOG 2026-08-04).
"""
import re, json, os, glob

SP = os.path.dirname(os.path.abspath(__file__))
TXT = os.path.join(SP, 'txt')

# Real exam identity per source file, read off each paper's own header.
# key = text filename stem
SITTINGS = {
    'computer-scienceengg-paper-i':
        ('Inspector of Legal Metrology, December 2018', 'ILM2018', 'I'),
    'computer-scienceengg-paper-ii':
        ('Inspector of Legal Metrology, December 2018', 'ILM2018', 'II'),
    'computer-scienceengg-paper-iii':
        ('Inspector of Legal Metrology, December 2018', 'ILM2018', 'III'),
    'computer-scienceengg-paper-ii-pe':
        ('Jr. Grade of M.E.S. (P&E Dept), August 2018', 'MES2018', 'II'),
    'computer-scienceengg-paper-iii-pe':
        ('Jr. Grade of M.E.S. (P&E Dept), August 2018', 'MES2018', 'III'),
    'inspector-of-legal-metrology-2010-computer-science-engineering-i':
        ('Inspector of Legal Metrology, March 2010', 'ILM2010', 'I'),
    'inspector-of-legal-metrology-2010-computer-science-engineering-ii':
        ('Inspector of Legal Metrology, March 2010', 'ILM2010', 'II'),
    'jr-grade-of-mes-electrical-wing-under-pe-deptt-computer-engg-paper-i':
        ('Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023', 'MES2023', 'I'),
    'jr-grade-of-mes-electrical-wing-under-pe-deptt-computer-engg-paper-ii':
        ('Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023', 'MES2023', 'II'),
    'jr-grade-of-mes-electrical-wing-under-pe-deptt-computer-engg-paper-iii':
        ('Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023', 'MES2023', 'III'),
    'jr-grade-of-mizoram-engineering-service-mes-2015-computer-science-engineering-paper-i':
        ('Jr. Grade of MES, November 2015', 'MES2015_CSE', 'I'),
    'jr-grade-of-mizoram-engineering-service-mes-2015-computer-science-engineering-paper-ii':
        ('Jr. Grade of MES, November 2015', 'MES2015_CSE', 'II'),
    'jr-grade-of-mizoram-engineering-service-mes-2015-computer-science-engineering-paper-iii':
        ('Jr. Grade of MES, November 2015', 'MES2015_CSE', 'III'),
    'junior-engineer-je-contract-under-rural-development-deptt-computer-science-paper-i':
        ('Junior Engineer (JE) Contract, Rural Development, November 2016', 'JE2016', 'I'),
    'junior-engineer-je-contract-under-rural-development-deptt-computer-science-paper-ii':
        ('Junior Engineer (JE) Contract, Rural Development, November 2016', 'JE2016', 'II'),
    'computer-science-engineering-paper-i.OCR':
        ('Inspector of Legal Metrology, November 2023', 'ILM2023', 'I'),
    'computer-science-engineering-paper-ii.OCR':
        ('Inspector of Legal Metrology, November 2023', 'ILM2023', 'II'),
    'computer-science-engineering-paper-iii.OCR':
        ('Inspector of Legal Metrology, November 2023', 'ILM2023', 'III'),
}

Q_RE = re.compile(r'^\s{0,20}(\d{1,3})\s*[\.\)]\s+(.*)$')
OPT_RE = re.compile(r'\(([a-eA-E])\)\s*')
SEC_B_RE = re.compile(r'SECTION\s*-?\s*B|Conventional|Answer any', re.I)

NOISE = re.compile(
    r'^\s*(-\s*\d+\s*-|\d+|Page \d+|Contd\.?|P\.?T\.?O\.?|\*+|'
    r'MIZORAM PUBLIC.*|TECHNICAL COMPETITIVE.*|COMPETITIVE EXAM.*|'
    r'Time Allowed.*|Full Marks.*|FM\s*:.*|Roll Number.*|Code Number.*|'
    r'Marks Obtained.*|INVIGILATOR.*|Date of Exam.*|'
    r'All questions carry.*|Attempt all.*|SECTION.*|This Section.*|'
    r'COMPUTER SCIENCE.*|PAPER\s*-?\s*[IVX]+.*)\s*$', re.I)


def clean(s):
    for a, b in [('’', "'"), ('‘', "'"), ('“', '"'), ('”', '"'),
                 ('–', '-'), ('—', '-')]:
        s = s.replace(a, b)
    s = re.sub(r'\.{4,}', ' ', s)      # dotted answer-rule filler (2010 booklet)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()


def split_options(blob):
    marks = [(m.start(), m.group(1).lower()) for m in OPT_RE.finditer(blob)]
    if not marks:
        return None, blob, 'no-option-markers'
    # Walk markers keeping only a strictly increasing a,b,c,d,(e) run.
    # A marker that breaks the run means the next question bled in via a
    # page break - we cut there and keep only this question's options.
    kept, expect = [], 'a'
    for pos, letter in marks:
        if letter == expect:
            kept.append((pos, letter))
            expect = chr(ord(expect) + 1)
        elif kept and letter < expect:
            break            # restart of a new question -> stop
    if len(kept) < 2:
        return None, blob, 'fewer-than-2-options'
    stem_tail = blob[:kept[0][0]]
    end_of_opts = len(blob)
    # trim anything after the last option that looks like a new question
    opts = {}
    for i, (pos, letter) in enumerate(kept):
        end = kept[i + 1][0] if i + 1 < len(kept) else end_of_opts
        t = OPT_RE.sub('', blob[pos:end], count=1)
        opts[letter] = clean(t)
    if any(not v for v in opts.values()):
        return None, blob, 'blank-option'
    return opts, stem_tail, None


def parse_file(path):
    stem = os.path.basename(path)[:-4]
    sitting, srckey, paper_no = SITTINGS.get(stem, (stem, 'UNKNOWN', '?'))
    raw = open(path, encoding='utf-8', errors='replace').read()

    # Where does Section B (conventional/essay) begin?
    mb = SEC_B_RE.search(raw)
    b_start = mb.start() if mb else len(raw)

    # Section B restarts numbering at 1, so the two sections are split apart
    # and each is walked with its own counter.
    def split_blocks(text_chunk):
        """Block splitter. Must RESYNC: a strict cur_no+1 rule silently
        swallows the whole rest of a paper the moment OCR garbles one question
        number (this cost 44 of 100 questions on the Nov-2023 scans before it
        was caught). So accept a forward jump of up to +5 and record the gap."""
        blocks, cur_no, cur, skipped = [], None, [], []
        for ln in text_chunk.split('\n'):
            if NOISE.match(ln):
                continue
            m = Q_RE.match(ln)
            newq = False
            if m:
                n = int(m.group(1))
                if cur_no is None:
                    newq = n <= 3        # a section starts at 1 (2-3 if OCR ate it)
                elif n == cur_no + 1:
                    newq = True
                elif cur_no + 1 < n <= cur_no + 5:
                    newq = True          # OCR lost a number - resync, note the gap
                    skipped += list(range(cur_no + 1, n))
            if newq:
                if cur_no is not None:
                    blocks.append((cur_no, '\n'.join(cur)))
                cur_no, cur = int(m.group(1)), [m.group(2)]
            elif cur_no is not None:
                cur.append(ln)
        if cur_no is not None:
            blocks.append((cur_no, '\n'.join(cur)))
        return blocks, skipped

    a_blocks, skip_a = split_blocks(raw[:b_start])
    b_blocks, skip_b = split_blocks(raw[b_start:])
    blocks = ([(n, t, 'A') for n, t in a_blocks] +
              [(n, t, 'B') for n, t in b_blocks])
    parse_file.skipped = skip_a + skip_b

    mcq, desc, bad = [], [], []
    for no, text, section in blocks:
        blob = clean(text.replace('\n', ' '))
        opts, stem_tail, err = split_options(blob)
        base = {'src_file': stem, 'sitting': sitting, 'srcKey': srckey,
                'paper_no': paper_no, 'section': section, 'no': no}
        if opts is None:
            # In Section B, "no options" is expected - it's an essay question.
            if err == 'no-option-markers' and (section == 'B' or len(blob) > 25):
                desc.append({**base, 'q': blob})
            else:
                bad.append({**base, 'reason': err, 'raw': blob[:400]})
            continue
        st = clean(stem_tail)
        if len(st) < 5:
            bad.append({**base, 'reason': 'empty-stem', 'raw': blob[:400]})
            continue
        mcq.append({**base, 'q': st,
                    'opts': {k.upper(): v for k, v in opts.items()},
                    'n_opts': len(opts),
                    'has_E': 'e' in opts})
    return mcq, desc, bad, blocks


def main():
    M, D, B, rep = [], [], [], []
    for path in sorted(glob.glob(os.path.join(TXT, '*.txt'))):
        if os.path.getsize(path) < 500:
            continue
        mcq, desc, bad, blocks = parse_file(path)
        M += mcq; D += desc; B += bad
        # Compare Section A against the highest question number the raw text
        # shows there, so a truncated parse can never look complete.
        raw = open(path, encoding='utf-8', errors='replace').read()
        mb = SEC_B_RE.search(raw)
        a_raw = raw[:mb.start()] if mb else raw
        # Q_RE is not compiled with re.M, so scan line by line.
        seen = [int(m.group(1)) for m in
                (Q_RE.match(ln) for ln in a_raw.split('\n')) if m]
        seen = [n for n in seen if n <= 200]
        top = max(seen) if seen else 0
        a_nums = {q['no'] for q in mcq + desc if q['section'] == 'A'}
        gaps = [n for n in range(1, top + 1) if n not in a_nums] if a_nums else []
        rep.append({'file': os.path.basename(path),
                    'sitting': mcq[0]['sitting'] if mcq else (desc[0]['sitting'] if desc else '?'),
                    'paper': mcq[0]['paper_no'] if mcq else '?',
                    'blocks': len(blocks), 'mcq': len(mcq),
                    'descriptive': len(desc), 'unparsed': len(bad),
                    'highest_q_in_raw': top,
                    'resync_skips': parse_file.skipped,
                    'missing_numbers': gaps})
    for f, name in [(M, 'mcq.json'), (D, 'descriptive.json'),
                    (B, 'unparsed.json'), (rep, 'parse_report.json')]:
        json.dump(f, open(os.path.join(SP, name), 'w'), indent=1)

    for r in rep:
        flag = '  <-- MISSING' if r['missing_numbers'] else ''
        print(f"{r['mcq']:4d} mcq {r['descriptive']:3d} desc {r['unparsed']:3d} bad "
              f"top={r['highest_q_in_raw']:3d} missing={len(r['missing_numbers']):2d}"
              f"  {r['sitting']} P{r['paper']}{flag}")
    tot_missing = sum(len(r['missing_numbers']) for r in rep)
    print(f"\nTOTAL  mcq={len(M)}  descriptive={len(D)}  unparsed={len(B)}"
          f"  unaccounted-for question numbers={tot_missing}")
    print(f"5-option MCQs (renderer only draws A-D): {sum(1 for q in M if q['has_E'])}")


if __name__ == '__main__':
    main()
