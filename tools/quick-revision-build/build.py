#!/usr/bin/env python3
"""Build public/quick-practice/quick-revision/data.js from the staged extractions.

The staged JSON under staged/ is the transcription of the four marked August-2026
booklets (SAS-I and Staff Nurse, Paper-I English + Paper-II GK). Each question's
`answer` is the option the booklet highlighted in cyan — that is the only thing
the source actually tells us, so it is what the app shows as the answer.

Two separate things can disagree with that mark, and the app keeps them distinct:

  keyAnswer  the official MPSC key differed, per a handwritten margin note on the
             booklet itself (only Q59 of the Staff Nurse GK paper).
  dispute    a factual review found the mark doesn't survive checking. This is our
             own judgement, not the source's, so it never overwrites `answer` —
             it renders as a caution beside it.

Re-run after editing anything in staged/ or checks/:
    python3 tools/quick-revision-build/build.py
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
STAGED = HERE / "staged"
CHECKS = HERE / "checks"
OUT = ROOT / "public/quick-practice/quick-revision/data.js"

# Part-A of both English papers is descriptive (essay / letter / précis /
# comprehension) and carries no highlighted answer, so it can't drive a
# reveal-or-score drill. It is preserved in the staged JSON under `partA` and
# disclosed on the paper card rather than silently dropped.
PART_A_NOTE = "Part-B MCQs only — Part-A is descriptive (essay, letter, précis) and has no marked answer."

PAPERS = [
    {
        "src": "sas1-paper1-english.json",
        "check": "check-english.json",
        "checkPaper": "sas1-paper1-english",
        "id": "sas1-eng",
        "title": "SAS-I — General English",
        "subtitle": "Paper-I · August 2026",
        "glyph": "🔤",
        "note": PART_A_NOTE,
    },
    {
        "src": "sas1-paper2-gk.json",
        "check": "check-sas1-paper2-gk.json",
        "checkPaper": None,
        "id": "sas1-gk",
        "title": "SAS-I — General Knowledge",
        "subtitle": "Paper-II · August 2026",
        "glyph": "📘",
        "note": None,
    },
    {
        "src": "nurse-paper1-english.json",
        "check": "check-english.json",
        "checkPaper": "nurse-paper1-english",
        "id": "nurse-eng",
        "title": "Staff Nurse — General English",
        "subtitle": "Paper-I · Series A · August 2026",
        "glyph": "🔤",
        "note": PART_A_NOTE,
    },
    {
        "src": "nurse-paper2-gk.json",
        "check": "check-nurse-paper2-gk.json",
        "checkPaper": None,
        "id": "nurse-gk",
        "title": "Staff Nurse — General Knowledge",
        "subtitle": "Paper-II · Series A · August 2026",
        "glyph": "📘",
        "note": None,
    },
]

# The extractors put three different kinds of thing in one `note` field, and they
# cannot all render the same way:
#
#  focus   Which word/phrase the booklet underlined. This is part of the question
#          — "what part of speech is the underlined word?" is unanswerable without
#          it — so it must show BEFORE the answer is revealed, not after.
#  note    A real property of the source: a handwritten margin note, or a printing
#          defect. Shown on reveal.
#  (drop)  The extractor's own opinion about whether the mark is right. That job
#          belongs to the review layer, which was done independently and sometimes
#          overruled it — leaving both in means a question can show a green
#          "Answer (d)" above a note arguing for (a). Dropped by explicit id.
FOCUS_PREFIXES = ("Underlined word:", "Underlined idiom:", "Highlighted word:")

# (staged file stem, question number) -> why the note is not shown.
DROPPED_NOTES = {
    ("nurse-paper1-english", 26): "extractor content opinion; superseded by the review layer",
    ("nurse-paper1-english", 30): "extractor content opinion; the review layer overruled it and the mark stands",
    ("nurse-paper1-english", 31): "extractor content opinion; superseded by the review layer",
    ("nurse-paper2-gk", 40): "extractor content opinion; superseded by the review layer",
    ("nurse-paper2-gk", 5): "typographic trivia (missing period after the question number)",
}


def split_note(stem, n, note):
    """Return (focus, note) for one staged note string."""
    if not note:
        return None, None
    for prefix in FOCUS_PREFIXES:
        if note.startswith(prefix):
            return note[len(prefix):].strip(), None
    if (stem, n) in DROPPED_NOTES:
        return None, None
    return None, note


# Only these verdicts become a visible caution. "unverified" means the reviewer
# could not check the claim, and "void" means the finding was itself found to be
# mistaken — neither is evidence the mark is wrong, and showing either as a
# warning would train distrust of a correct answer.
DISPUTE_VERDICTS = {"wrong", "disputable"}


def load_disputes(spec, answers):
    """Return {question number: dispute dict} for one paper.

    `answers` maps question number -> the letter the booklet marked, so a review
    that disagrees with the transcription about which option was even highlighted
    can be caught here instead of silently producing a nonsense caution. That is
    not hypothetical: the first pass over the SAS-I English paper misread Q48's
    highlight and argued for the option that was in fact already marked.
    """
    path = CHECKS / spec["check"]
    if not path.exists():
        return {}
    findings = json.loads(path.read_text())["findings"]
    out = {}
    for f in findings:
        # check-english.json covers two papers, so its findings must be
        # filtered by the `paper` field or they cross-contaminate.
        if spec["checkPaper"] and f.get("paper") != spec["checkPaper"]:
            continue
        n = f["n"]
        if n not in answers:
            raise SystemExit(f"{spec['src']}: review names unknown question {n}")
        # A finding already adjudicated against the source is kept in the file as
        # a record of what was checked, but is exempt from the guards below —
        # its `marked` letter is usually the very thing that was found wrong.
        if f.get("verdict") == "void":
            if not (f.get("voidReason") or "").strip():
                raise SystemExit(f"{spec['src']} Q{n}: void finding needs a voidReason")
            continue
        if f.get("marked") and f["marked"] != answers[n]:
            raise SystemExit(
                f"{spec['src']} Q{n}: review read the mark as ({f['marked']}) but the "
                f"transcription has ({answers[n]}). Resolve against the source PDF "
                f"before this can be shown."
            )
        if f.get("verdict") not in DISPUTE_VERDICTS:
            continue
        if not (f.get("why") or "").strip():
            raise SystemExit(f"{spec['src']} Q{n}: dispute has no explanation")
        out[n] = {
            "verdict": f["verdict"],
            "alt": f.get("alt"),
            "confidence": f.get("confidence"),
            "why": f["why"],
        }
    return out


def build():
    papers = []
    stats = []
    for spec in PAPERS:
        data = json.loads((STAGED / spec["src"]).read_text())
        answers = {q["n"]: q.get("answer") for q in data["questions"]}
        disputes = load_disputes(spec, answers)
        seen = set()
        qs = []
        for q in data["questions"]:
            n = q["n"]
            assert n not in seen, f"{spec['src']}: duplicate question {n}"
            seen.add(n)
            rec = {
                "n": n,
                "q": q.get("q"),
                "options": q["options"],
                "answer": q.get("answer"),
            }
            if q.get("keyAnswer") and q["keyAnswer"] != q.get("answer"):
                rec["keyAnswer"] = q["keyAnswer"]
            focus, note = split_note(spec["src"][:-5], n, q.get("note"))
            if focus:
                # The page underlines this inside the stem, so it has to be findable
                # there. If the booklet's wording and the note ever drift apart, fail
                # loudly rather than ship a question missing its underline.
                if focus.rstrip(".") not in (q.get("q") or ""):
                    raise SystemExit(
                        f"{spec['src']} Q{n}: underlined text {focus!r} does not "
                        f"appear in the question stem"
                    )
                rec["focus"] = focus.rstrip(".")
            if note:
                rec["note"] = note
            if q.get("passage"):
                rec["passage"] = q["passage"]
            d = disputes.get(n)
            if d:
                # A dispute that just re-states the marked answer is noise.
                if d["alt"] and d["alt"] == rec["answer"]:
                    raise SystemExit(
                        f"{spec['src']} Q{n}: dispute alt == marked answer ({d['alt']})"
                    )
                rec["dispute"] = d
            qs.append(rec)

        nums = sorted(seen)
        gaps = sorted(set(range(nums[0], nums[-1] + 1)) - seen)
        assert not gaps, f"{spec['src']}: missing question numbers {gaps}"

        unresolved = sorted(set(disputes) - seen)
        assert not unresolved, f"{spec['src']}: dispute for unknown question {unresolved}"

        papers.append(
            {
                "id": spec["id"],
                "title": spec["title"],
                "subtitle": spec["subtitle"],
                "glyph": spec["glyph"],
                "note": spec["note"],
                "exam": data.get("exam"),
                "questions": qs,
            }
        )
        stats.append(
            (
                spec["id"],
                len(qs),
                sum(1 for q in qs if not q.get("answer")),
                sum(1 for q in qs if q.get("keyAnswer")),
                sum(1 for q in qs if q.get("dispute")),
                sum(1 for q in qs if q.get("focus")),
                sum(1 for q in qs if q.get("note")),
            )
        )

    payload = {"papers": papers}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* GENERATED by tools/quick-revision-build/build.py — do not edit by hand.\n"
        "   Edit the staged JSON there and re-run the script. */\n"
        "window.QR_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=1)
        + ";\n"
    )

    print(f"wrote {OUT.relative_to(ROOT)}")
    cols = ('qs', 'unmarked', 'keydiff', 'disputed', 'underlined', 'notes')
    print(f"{'paper':<12}" + ''.join(f"{c:>11}" for c in cols))
    for row in stats:
        print(f"{row[0]:<12}" + ''.join(f"{v:>11}" for v in row[1:]))
    print(f"{'total':<12}" + ''.join(
        f"{sum(r[i] for r in stats):>11}" for i in range(1, len(cols) + 1)))


if __name__ == "__main__":
    build()
