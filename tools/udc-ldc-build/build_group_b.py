"""Build the reviewed Group B (non-gazetted) general-paper supplement.

The upstream solved HTML transcriptions are independent answers, not MPSC keys.
Keep this bank separate from the generated clerical bank so its source and
coverage remain visible. Run from any directory with Python 3.
"""

import json
import re
from pathlib import Path
from group_b_sources import build_additional, MPSC_LANGUAGE_ARCHIVE, MPSC_NG_ARCHIVE_2024_2027, MPSC_ARCHIVE_2023_2025
from english_review_progress import english_review_progress
from subject_review_progress import load_study_taxonomy, subject_review_progress
from reviewed_study_guides import apply_reviewed_study_guides
from fix_emphasis_markers import patch as restore_emphasis

ROOT = Path(__file__).resolve().parents[2]
UPSTREAM = ROOT.parent / "mpsc-question-bank"
SOLVED = UPSTREAM / "state" / "solved-html"
OUT = ROOT / "src" / "data" / "banks" / "mpsc-group-b-general.ts"
FINAL_KEY = json.loads((Path(__file__).parent / "group-b-final-key.json").read_text())
FINAL_KEY_HREF = "/papers/group-b/mpsc-group-b-ng-2024-final-key.pdf"
RECOVERED = json.loads((Path(__file__).parent / "group-b-recovered.json").read_text())["questions"]


def compact_answers_arrays(payload):
    """Keep short response arrays inline in the generated bank."""
    decoder = json.JSONDecoder()
    pattern = re.compile(r'"answers":\s*\[')
    pieces, cursor = [], 0
    for match in pattern.finditer(payload):
        start = payload.find('[', match.start())
        values, end = decoder.raw_decode(payload, start)
        pieces.extend((payload[cursor:start], json.dumps(values, ensure_ascii=False)))
        cursor = end
    pieces.append(payload[cursor:])
    return ''.join(pieces)


PAPER_TWO_REPAIRS = {
    81: {
        "question": "The school principal has received complaints from parents about bullying in the school yard during recess. Which situation should the recess aides report? i. A girl sits alone reading. ii. Four girls surround another girl and seem to have her backpack. iii. Two boys argue during basketball. iv. Three boys play a prohibited handheld video game.",
        "options": ["i", "ii", "iii", "iv"],
    },
    82: {
        "question": "Severe drought is reported in several parts of the country. Courses of action: I. Government should immediately arrange financial assistance for those affected. II. Food, water and fodder should immediately be sent to save people and cattle. Which course follows?",
        "options": ["Only I follows", "Only II follows", "Either I or II follows", "Neither I nor II follows"],
    },
}
PAPER_ONE_BLANKS = {
 51: 'Every candidate has to poll a minimum number of votes in order to avoid _____ of his security.',
 52: 'Some people are so _____ that they would believe anything.',
 53: 'The guidelines for the examination was so _____ that the students were confused.',
 54: 'This case is so unique that we cannot find any _____ to support it.',
 55: 'Sharing heavy responsibilities with colleagues does not involve loss of prestige or _____ of the authority of an institute’s Head.',
 71: 'On the _____ occasion of laxmi Puja the Mathurs bought a new car.',
 72: 'A trader was _____ at the city airport early on sunday morning for carrying gold jewellery worth over 3 crores.',
 73: 'His direction to the driver were _____ and helped him to reach on time.',
 74: 'The _____ crowd gave the victorious team a tumultuous welcome.',
 75: 'We must _____ help the people hit by the cyclone.',
}
PAPER_ONE_WORDS = {61:'pensive',62:'paucity',63:'famished',64:'impromptu',65:'thwart',66:'nebulous',67:'altruistic',68:'debilitate',69:'churl',70:'anathema'}
PAPER_ONE_SOLUTIONS = {
 51: ('C','Forfeiture means losing the deposited security; enough votes prevent that loss.'),
 52: ('B','Credulous means readily believing things, which matches “would believe anything”.'),
 53: ('A','Vague means unclear. Unclear guidelines cause confusion.'),
 54: ('B','A precedent is an earlier case that can support a decision in a similar case.'),
 55: ('C','Diminution means a reduction; sharing responsibilities need not reduce the head’s authority.'),
 56: ('A','Keep “was to have” and change the active infinitive “opened” to “been opened”.'),
 57: ('C','“Who was it written by?” is the passive equivalent of “Who wrote it?”'),
 58: ('B','“Is to be introduced” becomes “are to introduce” with the plural subject “authorities”.'),
 59: ('D','Present continuous active “are pulling down” becomes passive “is being pulled down”.'),
 60: ('C','“Are to man” becomes “is to be manned” when the training ship is the subject.'),
 61: ('D','Pensive means thoughtful, usually with serious or sad reflection.'),
 62: ('B','Paucity means scarcity or an insufficient amount.'),
 63: ('B','Famished means extremely hungry.'),
 64: ('B','Impromptu means without preparation.'),
 65: ('C','To thwart a plan is to frustrate or prevent it.'),
 66: ('D','Nebulous means vague or unclear; the opposite requested here is very clear.'),
 67: ('A','Altruistic means concerned for others; egoistic means concerned chiefly with oneself.'),
 68: ('C','Debilitate means weaken; its opposite is strengthen.'),
 69: ('C','A churl is a rude or ill-mannered person; gentleman is the opposite among these choices.'),
 70: ('D','Anathema conveys something cursed or detested; benison means a blessing.'),
 71: ('D','Auspicious means favourable or promising success, fitting the festive occasion.'),
 72: ('D','Detained means held by the authorities, matching the airport incident.'),
 73: ('B','Explicit directions are clear and unambiguous, helping a driver arrive on time.'),
 74: ('A','A jubilant crowd is joyful and celebratory after the team’s victory.'),
 75: ('D','“Render help” means provide assistance. The other verbs do not fit this construction.'),
}

SOURCES = [
    (
        "combined-group-b-ng-dec-24.json", "Paper-I",
        "mpsc-group-b-ng-2024-paper-1-a", "Group B (non-gazetted)",
        "Paper-I", "General Knowledge & English", 75,
        "Combined Group B (NG) Paper-I December-2024 Booklet A..pdf",
    ),
    (
        "combined-group-b-ng-dec-24.json", "Paper-II",
        "mpsc-group-b-ng-2024-paper-2-a", "Group B (non-gazetted)",
        "Paper-II", "Basic Computer, Arithmetic & Reasoning", 83,
        "Combined Group B (NG) Paper-II December-2024 Booklet A..pdf",
    ),
    (
        "group-bng-technical-nov-2024.json", "Paper-II (General Knowledge)",
        "mpsc-group-b-ng-technical-2024-gk", "Group B technical (general paper)",
        "Paper-II", "General Knowledge", 100,
        "Group B(NG) (Technical)Paper-II (General Knowledge)-2024..pdf",
    ),
]


def section(part, number):
    # The first element is both the bank `subject` and the canonical section.
    # The old generator wrote cases 1-65 with subject "gk", so an arithmetic
    # attempt was logged against General Knowledge; the Group B bank now uses
    # the same subject vocabulary as the clerical bank (gk/english/computer/
    # arithmetic/reasoning).
    if part == "Paper-I":
        return ("gk", "General Knowledge") if number <= 50 else ("english", "General English")
    if part == "Paper-II":
        if number <= 35:
            return "computer", "Basic Computer Knowledge"
        if number <= 65:
            return "arithmetic", "Simple Arithmetic"
        return "reasoning", "General Intelligence & Reasoning"
    return "gk", "General Knowledge"


def build():
    papers, questions = [], []
    cache = {}
    for file, part, slug, post, paper_no, subject, expected, pdf in SOURCES:
        source = cache.setdefault(file, json.loads((SOLVED / file).read_text()))
        rows = [q for q in source["questions"] if q["part"] == part]
        assert len(rows) == expected, (file, part, len(rows))
        assert len({q["htmlNum"] for q in rows}) == len(rows)
        if part == "Paper-I":
            assert sorted(q["htmlNum"] for q in rows) == list(range(1, 76))
        if part == "Paper-II":
            assert sorted(q["htmlNum"] for q in rows) == list(range(1, 84))
            rows.extend(RECOVERED)
            assert sorted(q["htmlNum"] for q in rows) == list(range(1, 101))
        if part == "Paper-II (General Knowledge)":
            assert sorted(q["htmlNum"] for q in rows) == list(range(1, 101))
        source_pdf = UPSTREAM / "pdfs" / "Old_Questions" / "Direct_NG_2024-2027" / pdf
        assert source_pdf.is_file(), source_pdf
        papers.append({
            "id": slug, "examType": "Direct_NG", "examName": "MPSC Group B (non-gazetted)",
            "post": post, "paperNumber": paper_no, "paperSubject": subject, "year": 2024,
            "sourceFile": f"/papers/group-b/{source_pdf.name}",
        })
        for q in rows:
            q = dict(q)
            n = q["htmlNum"]
            if part == 'Paper-I' and n >= 51:
                if n in PAPER_ONE_BLANKS:
                    q['question'] = PAPER_ONE_BLANKS[n]
                if n in PAPER_ONE_WORDS:
                    word = PAPER_ONE_WORDS[n]
                    q['question'] = re.sub(r'\b' + word + r'\b', '**' + word + '**', q['question'], count=1)
                q['answerIndex'] = 'ABCD'.index(PAPER_ONE_SOLUTIONS[n][0])
                q['explanation'] = PAPER_ONE_SOLUTIONS[n][1]
                q['answerConfidence'] = 'high'
                q['direction'] = ('Complete the sentence using the most suitable alternative.' if n <= 55 or n >= 71 else
                                  'Select the equivalent sentence in passive / active voice.' if n <= 60 else
                                  'Choose the nearest meaning of the highlighted word.' if n <= 65 else
                                  'Choose the ANTONYM of the highlighted word.')
            independent = q.get("answerIndex", -1)
            if part == "Paper-II" and n == 82:
                # The solved HTML replaced the printed option D with "Both I
                # and II follow". Its index cannot be compared to the real D.
                independent = -1
            assert len(q["options"]) == 4 and -1 <= independent < 4, (slug, n)
            key_letter = FINAL_KEY["paper1" if part == "Paper-I" else "paper2"][str(n)] if part in ("Paper-I", "Paper-II") else None
            keyed = part in ("Paper-I", "Paper-II")
            official = "ABCD".index(key_letter) if key_letter else -1
            figure = part == "Paper-II" and n in (75, 78, 79, 80, 87, 91)
            answer = -1 if keyed and key_letter is None else official if keyed else independent
            topic, label = section(part, n)
            questions.append({
                "id": f"{slug}-q{n:03d}", "questionNumber": str(n), "subject": topic, "topic": label.lower().replace(" ", "-"),
                "topicLabel": label, "difficulty": "medium",
                "question": PAPER_TWO_REPAIRS[n]["question"] if part == "Paper-II" and n in PAPER_TWO_REPAIRS else q["question"].strip(),
                "options": PAPER_TWO_REPAIRS[n]["options"] if part == "Paper-II" and n in PAPER_TWO_REPAIRS else q["options"],
                "answerIndex": answer,
                **({'direction': q['direction']} if q.get('direction') else {}),
                **({'answerConfidence': q['answerConfidence']} if q.get('answerConfidence') else {}),
                "explanation": q.get("explanation") or ("Official MPSC final key, compared with an independent solved transcription." if keyed else "Independent study transcription; official key not yet matched."),
                **({"answerSource": "official", "answerKeyRef": FINAL_KEY_HREF} if keyed else {}),
                **({"answerSource": "derived", "answerConfidence": "low"} if not keyed and answer >= 0 else {}),
                **({"independentAnswerIndex": independent} if independent >= 0 and keyed else {}),
                **({"independentAnswerSource": "solved" if q.get("explanation") else "transcribed"} if independent >= 0 else {}),
                **({"disputeNote": f"Independent solution chooses {'ABCD'[independent]}; the final MPSC key chooses {key_letter}."}
                   if keyed and independent >= 0 and official >= 0 and independent != official else {}),
                **({"disputeNote": "Independent transcription replaced printed option D with a different answer. The final MPSC key gives B (Only II follows)."} if part == "Paper-II" and n == 82 else {}),
                **({"compensated": True} if keyed and key_letter is None else {}),
                **({"imagePath": f"/question-images/group-b/2024-paper2-q{n:03d}.webp"} if figure else {}),
                **({"sourceHref": "/papers/group-b/Combined Group B (NG) Paper-II December-2024 Booklet B..pdf#page=" + str(q["sourcePage"]),
                    "sourceNote": f"Recovered from complete Series B Q{n-35}; its final key agrees with Series A Q{n}."} if part == "Paper-II" and n >= 84 else {}),
                "source": "MPSC Group B (non-gazetted), 2024 · Booklet Series A" if keyed else "MPSC Group B (non-gazetted) technical, 2024 · general paper",
                "year": 2024, "paperId": slug,
            })
    assert len(questions) == 275
    extra_papers, extra_questions, meta, library = build_additional()
    for p in papers:
        meta[p['id']] = {'marksPerQuestion': 1 if p['id'].endswith('-gk') else 2,
                         'durationMinutes': 120 if p['id'].endswith('-gk') else 180,
                         'negativeMarking': False, 'penaltyFraction': 0}
        library.insert(0, {'id': p['id'], 'exam': p['post'], 'sitting': 'November 2024' if p['id'].endswith('-gk') else 'December 2024',
                           'subject': p['paperSubject'], 'sourceHref': p['sourceFile'],
                           'keyHref': None if p['id'].endswith('-gk') else FINAL_KEY_HREF, 'imported': True,
                           'expectedMcq': 75 if p['id'].endswith('-1-a') else 100})
    papers.extend(extra_papers)
    questions.extend(extra_questions)
    apply_reviewed_study_guides(ROOT, questions, json.loads((Path(__file__).parent / 'reviewed-study-guides.json').read_text()))
    assert len({q['id'] for q in questions}) == len(questions)
    assert all(q['paperId'] in {p['id'] for p in papers} for q in questions)
    # Keep answer feedback useful and honest when the source provides only a
    # key: explicitly identify the keyed option instead of presenting a
    # generic bank-wide placeholder as reasoning.
    for q in questions:
        if q.get('answerSource') != 'official' or q.get('answerIndex', -1) < 0:
            continue
        existing = (q.get('explanation') or '').strip()
        if not existing or existing == 'Official MPSC final key, compared with an independent solved transcription.':
            options = q.get('options') or []
            index = q['answerIndex']
            option_text = options[index].strip() if index < len(options) and isinstance(options[index], str) else ''
            label = 'ABCD'[index]
            q['explanation'] = (f'The official final key marks option {label}: “{option_text}”. '
                                'This is the key reference for the answer; it is not a worked derivation.')
    payload = "// Generated by tools/udc-ldc-build/build_group_b.py. Do not hand-edit.\n"
    payload += "import type { BankQuestion, ExamPaper } from './types';\n\n"
    payload += "import type { UdcLdcPaperMeta } from './mpsc-udc-ldc';\n\n"
    payload += "export const groupBGeneralPapers: ExamPaper[] = " + json.dumps(papers, ensure_ascii=False, indent=2) + ";\n\n"
    chunks = [questions[i:i+300] for i in range(0, len(questions), 300)]
    for i, chunk in enumerate(chunks):
        payload += f"const groupBQuestionsPart{i+1}: BankQuestion[] = " + json.dumps(chunk, ensure_ascii=False, indent=2) + ";\n"
    payload += "export const groupBGeneralQuestions: BankQuestion[] = [" + ','.join(f'...groupBQuestionsPart{i+1}' for i in range(len(chunks))) + "];\n"
    payload += "export const groupBPaperMeta: Record<string, UdcLdcPaperMeta> = " + json.dumps(meta, indent=2) + ";\n"
    payload += "export const groupBExpectedMcq: Record<string, number> = " + json.dumps({p['id']: p['expectedMcq'] for p in library if p.get('expectedMcq')}, indent=2) + ";\n"
    assert all(q.get('answerIndex', -1) < 0 for q in questions if q.get('sourceReview') or q.get('compensated'))
    assert all(q.get('explanation', '').strip() for q in questions
               if q.get('answerSource') == 'official' and q.get('answerIndex', -1) >= 0)
    ready = [q for q in questions if q.get('type') != 'descriptive' and q.get('answerIndex', -1) >= 0 and not q.get('sourceReview') and not q.get('figureBased')]
    assert all(q['paperId'] in meta for q in ready)
    assert all(q.get('answerKeyRef') for q in ready if q.get('answerSource') == 'official')
    report = {'papers': len(papers), 'items': len(questions), 'mcq': sum(q.get('type') != 'descriptive' for q in questions),
              'written': sum(q.get('type') == 'descriptive' for q in questions), 'ready': len(ready),
              'readyOfficial': sum(q.get('answerSource') == 'official' for q in ready), 'sourceReview': sum(bool(q.get('sourceReview')) for q in questions),
              'unreviewed': sum(bool(q.get('sourceReview')) and not q.get('sourceReviewed') for q in questions),
              'heldReviewed': sum(bool(q.get('sourceReview')) and bool(q.get('sourceReviewed')) for q in questions),
              'missingMcq': sum(max(0, p.get('expectedMcq', 0) - sum(q['paperId'] == p['id'] and q.get('type') != 'descriptive' for q in questions)) for p in library),
              'keyDisagreements': sum(q.get('independentAnswerIndex', -1) >= 0 and q.get('answerIndex', -1) >= 0 and q['independentAnswerIndex'] != q['answerIndex'] for q in questions),
              'heldKeyConflicts': sum(q.get('sourceReview', False) and q.get('independentAnswerSource') == 'solved'
                                      and len(q.get('officialAnswerCandidates', [])) == 1
                                      and q['independentAnswerIndex'] != q['officialAnswerCandidates'][0] for q in questions),
              'compensated': sum(bool(q.get('compensated')) for q in questions)}
    (Path(__file__).parent / 'build-report.json').write_text(json.dumps(report, indent=2) + '\n')
    (Path(__file__).parent / 'english-review-progress.json').write_text(
        json.dumps(english_review_progress(library, questions, MPSC_LANGUAGE_ARCHIVE, MPSC_NG_ARCHIVE_2024_2027), ensure_ascii=False, indent=2) + '\n')
    mappings, topics = load_study_taxonomy(ROOT)
    tags = json.loads((ROOT / 'src/data/banks/mpsc-study-topic-tags.json').read_text())['tags']
    subject_progress = subject_review_progress(library, questions, mappings, topics, tags,
        MPSC_LANGUAGE_ARCHIVE + MPSC_NG_ARCHIVE_2024_2027 + MPSC_ARCHIVE_2023_2025)
    assert subject_progress['summary']['records'] == report['items'] and subject_progress['summary']['ready'] == report['ready']
    (Path(__file__).parent / 'subject-review-progress.json').write_text(json.dumps(subject_progress, ensure_ascii=False, indent=2) + '\n')
    payload, _ = restore_emphasis(compact_answers_arrays(payload))
    OUT.write_text(payload)
    (ROOT / 'src' / 'data' / 'banks' / 'mpsc-group-b-library.json').write_text(json.dumps(library, ensure_ascii=False, indent=2) + '\n')
    print(f"Wrote {len(questions)} questions from {len(papers)} papers to {OUT}")


if __name__ == "__main__":
    build()
