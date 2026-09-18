"""Turn extract.py output into staged/<paperId>.json skeletons.

Fills everything the booklet itself can tell us -- metadata, question text,
options, the marked highlight -- and leaves `answer`, `why`, `conf` and `topic`
as null for the verification pass to fill in.

The nulls are deliberate. A staged file that already carried `answer = marked`
would make the verification pass look finished before it had run, and the whole
point is that the highlights are *not* an answer key: MPSC published none for
these sittings, and the four papers already in the hub turned up six highlights
that are simply wrong. validate.py refuses to build while answers are null, so
the gap cannot be shipped by accident.

Mark schemes below were read off each booklet's cover page, not guessed. Note
that only the two Research Investigator papers carry a negative-marking clause;
the LESO and Sub-Inspector papers state none, so theirs is 0 and their mock
scores must not deduct.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SECTIONS = {k: v for k, v in
            json.load(open(os.path.join(HERE, "conventional-sections.json"))).items()
            if not k.startswith("_")}

PAPERS = {
    "leso-2026-p1": {
        "src": "leso-p1",
        "exam": "Assistant Labour, Employment, Skill Development & Entrepreneurship Officer",
        "examShort": "Assistant LESO",
        "dept": "Labour, Employment, Skill Development & Entrepreneurship Department, Govt. of Mizoram",
        "sitting": "April 2026", "year": 2026,
        "paper": "General English", "paperTitle": "Précis, Letter, Comprehension & Grammar",
        "series": None, "maxMarks": 100, "durationMin": 180,
        "negativeMark": 0, "markPerQuestion": 1,
        "sourcePdf": "assistant-leso-2026-general-english.pdf",
    },
    "leso-2026-p2": {
        "src": "leso-p2",
        "exam": "Assistant Labour, Employment, Skill Development & Entrepreneurship Officer",
        "examShort": "Assistant LESO",
        "dept": "Labour, Employment, Skill Development & Entrepreneurship Department, Govt. of Mizoram",
        "sitting": "April 2026", "year": 2026,
        "paper": "General Studies", "paperTitle": "Current Affairs, General Knowledge & Mizoram",
        "series": None, "maxMarks": 100, "durationMin": 120,
        "negativeMark": 0, "markPerQuestion": 1,
        "sourcePdf": "assistant-leso-2026-general-studies.pdf",
    },
    "si-stats-2026-p1": {
        "src": "si-p1",
        "exam": "Sub-Inspector of Statistics",
        "examShort": "SI Statistics",
        "dept": "Planning & Programme Implementation Department, Govt. of Mizoram",
        "sitting": "January 2026", "year": 2026,
        "paper": "Paper I", "paperTitle": "General English",
        "series": None, "maxMarks": 150, "durationMin": 180,
        "negativeMark": 0, "markPerQuestion": 2,
        "sourcePdf": "marked sub-inspector-of-statistic-paper-i.pdf",
    },
    "si-stats-2026-p2": {
        "src": "si-p2",
        "exam": "Sub-Inspector of Statistics",
        "examShort": "SI Statistics",
        "dept": "Planning & Programme Implementation Department, Govt. of Mizoram",
        "sitting": "January 2026", "year": 2026,
        "paper": "Paper II", "paperTitle": "General Mathematics & General Knowledge",
        "series": None, "maxMarks": 100, "durationMin": 120,
        "negativeMark": 0, "markPerQuestion": 1,
        "sourcePdf": "marked sub-inspector-of-statistic-paper-ii.pdf",
    },
    "ri-2026-p1": {
        "src": "ri-p1",
        "exam": "Research Investigator",
        "examShort": "Research Investigator",
        "dept": "Art & Culture Department, Govt. of Mizoram",
        "sitting": "May 2026", "year": 2026,
        "paper": "Paper I", "paperTitle": "General English",
        "series": None, "maxMarks": 100, "durationMin": 180,
        "negativeMark": 0.33, "markPerQuestion": 1,
        "sourcePdf": "research-invetigator-may-2026-paper-i.pdf",
    },
    "ri-2026-p2": {
        "src": "ri-p2",
        "exam": "Research Investigator",
        "examShort": "Research Investigator",
        "dept": "Art & Culture Department, Govt. of Mizoram",
        "sitting": "May 2026", "year": 2026,
        "paper": "Paper II", "paperTitle": "General Knowledge, Aptitude & Reasoning",
        "series": None, "maxMarks": 200, "durationMin": 120,
        "negativeMark": 0.33, "markPerQuestion": 2,
        "sourcePdf": "research-invetigator-may-2026-paper-ii.pdf",
    },
}


def load_verified(paper_id):
    """Verified answers for a paper, or {} if the pass has not run yet.

    These live in answers/<paperId>.json as a committed pipeline input rather
    than being written into staged/*.json, so re-running this script re-applies
    them instead of wiping 476 hand-verified answers.
    """
    path = os.path.join(HERE, "answers", paper_id + ".json")
    return json.load(open(path)) if os.path.exists(path) else {}


def build(paper_id, meta, srcdir, fixes):
    raw = json.load(open(os.path.join(srcdir, meta["src"] + ".json")))
    verified = load_verified(paper_id)
    out = {k: v for k, v in meta.items() if k != "src"}
    out["paperId"] = paper_id
    pfix = fixes.get(paper_id, {})
    applied = []
    qs = []
    for q in raw:
        part = q["part"] or "B"
        qid = f"{part}{q['n']}"
        rec = {
            "id": qid,
            "n": q["n"],
            "part": part,
            "direction": q["direction"],
            "passageRef": None,
            "q": q["q"],
            "opts": q["opts"],
            "marked": q["marked"],
            "answer": None,
            "conf": None,
            "why": None,
            "topic": None,
            "flag": None,
            "_cov": q["cov"],
        }
        fx = pfix.get(qid)
        if fx:
            for k, v in fx.items():
                if not k.startswith("_"):
                    rec[k] = v
            applied.append(qid)
        ans = verified.get(qid)
        if ans:
            rec.update({k: ans[k] for k in ("answer", "conf", "why", "topic", "flag")})
        qs.append(rec)
    missing = [k for k in pfix if k not in applied]
    if missing:
        # a fix that matches nothing is a silent no-op otherwise, and this repo
        # has been bitten by exactly that shape of failure before
        raise SystemExit(f"{paper_id}: visual fixes matched no question: {missing}")
    out["questions"] = qs
    out["descriptive"] = build_descriptive(paper_id, meta, srcdir)
    return out, applied


def build_descriptive(paper_id, meta, srcdir):
    """Essays, precis passages, letters and comprehension items from Part A.

    Passage bodies are sliced out of what extract.py already read, not retyped:
    `from` names the conventional item and the markers to cut between. Retyping
    a 400-word passage by hand is exactly the kind of step that introduces
    silent transcription drift between the app and the source PDF.
    """
    spec = SECTIONS.get(paper_id)
    if not spec:
        return []
    path = os.path.join(srcdir, meta["src"] + ".conventional.json")
    if not os.path.exists(path):
        raise SystemExit(f"{paper_id}: {path} missing - re-run extract.py")
    raw = json.load(open(path))

    out = []
    for item in spec:
        rec = {k: v for k, v in item.items() if k != "from"}
        src = item.get("from")
        if src:
            if "kind" in src:
                cand = [c for c in raw if c.get("kind") == src["kind"]]
            else:
                cand = [c for c in raw if c.get("n") == src["n"]]
            if not cand:
                raise SystemExit(f"{paper_id}/{item['id']}: no conventional item matches {src}")
            text = cand[0]["text"]
            if "after" in src:
                i = text.find(src["after"])
                if i < 0:
                    raise SystemExit(
                        f"{paper_id}/{item['id']}: marker {src['after']!r} not found")
                text = text[i + len(src["after"]):]
            if "before" in src:
                j = text.find(src["before"])
                if j < 0:
                    raise SystemExit(
                        f"{paper_id}/{item['id']}: marker {src['before']!r} not found")
                text = text[:j]
            rec["body"] = text.strip()
        out.append(rec)
    return out


def main():
    srcdir = sys.argv[1]
    outdir = os.path.join(HERE, "staged")
    fixes = {k: v for k, v in
             json.load(open(os.path.join(HERE, "visual-fixes.json"))).items()
             if not k.startswith("_")}
    for pid, meta in PAPERS.items():
        doc, applied = build(pid, meta, srcdir, fixes)
        path = os.path.join(outdir, pid + ".json")
        json.dump(doc, open(path, "w"), indent=1, ensure_ascii=False)
        n = len(doc["questions"])
        marked = sum(1 for q in doc["questions"] if q["marked"])
        print(f"{pid}: {n} questions, {marked} marked, "
              f"{n - marked} unmarked"
              + (f", {len(applied)} visual fix(es) {applied}" if applied else "")
              + (f", {len(doc['descriptive'])} descriptive" if doc["descriptive"] else "")
              + (f", {sum(1 for q in doc['questions'] if q['answer'])} verified"
                 if any(q["answer"] for q in doc["questions"]) else ", UNVERIFIED"))


if __name__ == "__main__":
    main()
