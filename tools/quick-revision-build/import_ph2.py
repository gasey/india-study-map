#!/usr/bin/env python3
"""Convert Practice Hub 2's staged MCQs into Quick Revision's staged format.

Practice Hub 2 (tools/practice-hub-build/staged/*.json) and Quick Revision
(tools/quick-revision-build/staged/*.json) use different per-question shapes
for the same underlying idea (a booklet-marked MCQ). This script does the
one-time field mapping so the result can sit in staged/ next to the
hand-transcribed papers and go through the normal build.py:

  opts                    -> options            (same a/b/c/d dict, renamed)
  marked (booklet mark)   -> answer              (falls back to `answer` when
                                                   the booklet mark is blank)
  answer, when it disagrees with marked          -> dispute {verdict: "wrong",
                                                   alt, why}   (conf is dropped:
                                                   Quick Revision has no
                                                   confidence-rating concept)
  flag (reviewer's note on the source)           -> note
  direction (per-question instruction text)      -> passage   (Quick Revision
                                                   calls the instruction block
                                                   above a question "passage")
  **word** inside `q`                            -> plain `q` + a `focus`
                                                   field, matching how the
                                                   hand-transcribed papers
                                                   mark an underlined word

Practice Hub 2's `descriptive` array (essay/letter/précis prompts) has no
counterpart in Quick Revision's schema and is intentionally dropped — Quick
Revision only models MCQs.

Only the `questions` array is read; question numbers are renumbered 1..N in
source order because Practice Hub 2 reuses one printed number across a few
sub-parts (e.g. a passage's vocabulary-in-context items), which collides
with Quick Revision's use of `n` as both the display number and the row key.

Re-run after editing anything under tools/practice-hub-build/staged/:
    python3 tools/quick-revision-build/import_ph2.py
    python3 tools/quick-revision-build/build.py
"""

import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PH2_STAGED = ROOT / "tools/practice-hub-build/staged"
OUT_STAGED = HERE / "staged"

FOCUS_RE = re.compile(r"\*\*([^*]+)\*\*")

# One of each paper pair carries Part-A's descriptive prompts (essay, letter,
# précis) — dropped here since Quick Revision has nowhere to put them.
HAS_DROPPED_DESCRIPTIVE = {
    "co-2026-p1", "jao-2026-p1", "leso-2026-p1", "ri-2026-p1", "si-stats-2026-p1",
}
DESCRIPTIVE_DROPPED_NOTE = (
    "Descriptive prompts (essay, letter, précis) from this paper aren't "
    "included here — only the MCQs are."
)

PAPERS = [
    {"src": "co-2026-p1.json", "id": "co-eng", "title": "Circle Officer — General English",
     "subtitle": "Paper-I · April 2026", "glyph": "🔤"},
    {"src": "co-2026-p2.json", "id": "co-gk",
     "title": "Circle Officer — General Knowledge, Arithmetic & Reasoning",
     "subtitle": "Paper-II · April 2026", "glyph": "📘"},
    {"src": "jao-2026-p1.json", "id": "jao-eng",
     "title": "Junior Administrative Officer — General English",
     "subtitle": "Paper-I · July 2026", "glyph": "🔤"},
    {"src": "jao-2026-p2.json", "id": "jao-gk",
     "title": "Junior Administrative Officer — General Knowledge, Arithmetic & Reasoning",
     "subtitle": "Paper-II · July 2026", "glyph": "📘"},
    {"src": "leso-2026-p1.json", "id": "leso-eng", "title": "Assistant LESO — General English",
     "subtitle": "Précis, Letter, Comprehension & Grammar · April 2026", "glyph": "🔤"},
    {"src": "leso-2026-p2.json", "id": "leso-gs", "title": "Assistant LESO — General Studies",
     "subtitle": "Current Affairs, GK & Mizoram · April 2026", "glyph": "📘"},
    {"src": "ri-2026-p1.json", "id": "ri-eng", "title": "Research Investigator — General English",
     "subtitle": "Paper-I · May 2026", "glyph": "🔤"},
    {"src": "ri-2026-p2.json", "id": "ri-gk",
     "title": "Research Investigator — General Knowledge, Aptitude & Reasoning",
     "subtitle": "Paper-II · May 2026", "glyph": "📘"},
    {"src": "si-stats-2026-p1.json", "id": "sistats-eng", "title": "SI Statistics — General English",
     "subtitle": "Paper-I · January 2026", "glyph": "🔤"},
    {"src": "si-stats-2026-p2.json", "id": "sistats-gk",
     "title": "SI Statistics — General Mathematics & General Knowledge",
     "subtitle": "Paper-II · January 2026", "glyph": "📘"},
]


def convert_question(q, n):
    stem = q.get("q") or ""
    focus = None
    m = FOCUS_RE.search(stem)
    if m:
        focus = m.group(1)
        stem = stem[: m.start()] + focus + stem[m.end() :]

    marked = q.get("marked")
    answer = q.get("answer")
    rec = {
        "n": n,
        "q": stem,
        "options": q.get("opts") or {},
        "answer": marked or answer,
        "keyAnswer": None,
        "note": q.get("flag") or None,
        "passage": q.get("direction") or None,
    }
    if focus:
        rec["focus"] = focus
    if marked and answer and marked != answer:
        why = (q.get("why") or "").strip()
        if why:
            rec["dispute"] = {"verdict": "wrong", "alt": answer, "why": why}
    return rec


def convert_paper(spec):
    data = json.loads((PH2_STAGED / spec["src"]).read_text())
    paper_id = spec["src"][:-5]

    questions = [convert_question(q, i + 1) for i, q in enumerate(data["questions"])]

    note = DESCRIPTIVE_DROPPED_NOTE if paper_id in HAS_DROPPED_DESCRIPTIVE else None

    out = {
        "exam": f"{data.get('exam')} ({data.get('sitting')})",
        "paper": f"{data.get('paper')} ({data.get('paperTitle')})" if data.get("paperTitle") else data.get("paper"),
        "series": data.get("series"),
        "date": data.get("sitting"),
        "totalQuestionsStated": len(questions),
        "questions": questions,
    }
    out_path = OUT_STAGED / f"ph2-{paper_id}.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    return spec["id"], note, len(questions), out_path


def main():
    for spec in PAPERS:
        paper_id, note, count, out_path = convert_paper(spec)
        print(f"wrote {out_path.relative_to(ROOT)}  ({count} questions)")


if __name__ == "__main__":
    main()
