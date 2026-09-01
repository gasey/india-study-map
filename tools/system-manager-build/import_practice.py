#!/usr/bin/env python3
"""Parse the MUDAL Technical Paper I practice MCQ volumes into staged JSON.

    python3 tools/system-manager-build/import_practice.py

Reads the two markdown volumes in `sources/` and writes
`staged/practice-tech1.json`, which assemble.py picks up as the `TECH1P`
paper (Technical Paper I - Practice Bank).

WHY THE SOURCES LIVE IN THE REPO. They were handed over as two files in
~/Downloads. Everything else in this pipeline reads from either `extracted/`
or a sibling repo, and HANDOFF-UDC.md records that two audit agents once
concluded a whole imported paper was fabricated purely because they could not
find its source. Copying the markdown into `sources/` makes this import
re-runnable and the provenance checkable in one step, by anyone, forever.

WHY THIS IS A PARSER AND NOT A HAND-TRANSCRIPTION. 334 questions is far past
the point where hand-typing into staged JSON is safe - and hand-typed question
data is exactly what nearly destroyed the UDC paper (see DEVLOG 2026-09-02).
The markdown is the source of truth; re-running this script reproduces the
staged file byte-for-byte.

The parser asserts hard on anything it does not fully understand rather than
dropping a question quietly. Silent data loss with no numbering gap to reveal
it is this project's signature failure mode (DEVLOG 2026-08-04, ~280 questions
lost); every count here is checked against the volume's own contents table.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SOURCES = os.path.join(HERE, "sources")
STAGED = os.path.join(HERE, "staged")
OUT = os.path.join(STAGED, "practice-tech1.json")

LETTERS = ["a", "b", "c", "d"]

# Roman unit -> the TECH1 unit it drills. The two volumes are written against
# the real Technical Paper I syllabus and use its exact five-unit split at its
# exact marks weighting (60/25/20/25/20), which is why these map 1:1 onto
# TECH1_UNITS in gen_syllabus.py rather than needing buckets of their own.
UNIT_TITLES = {
    "I": "Fundamentals of Computer",
    "II": "Operating Systems",
    "III": "Word Processing",
    "IV": "Electronic Spreadsheet",
    "V": "Presentation Software",
}

# Per-volume expected question counts, taken from each volume's own contents
# table. A parser that silently finds fewer is the bug this guards against.
EXPECTED = {
    "V1": {"I": 65, "II": 24, "III": 18, "IV": 24, "V": 18},
    "V2": {"I": 90, "II": 35, "III": 25, "IV": 30, "V": 20},
}

VOLUMES = [
    ("V1", "MUDALPRAC-V1", "practice-tech1-vol1.md"),
    ("V2", "MUDALPRAC-V2", "practice-tech1-vol2.md"),
]

# --- corrections to the volumes' own answer keys -----------------------------
# All 349 questions were re-derived independently, question by question, before
# the volume's key was consulted. 347 matched. These are the two that did not,
# and they are applied HERE rather than by editing the markdown, so that
# `sources/*.md` stays a byte-faithful copy of what was handed over and every
# deviation from it is declared in one auditable place.
#
# This matters more than usual for this import: unlike every other paper in the
# app, these questions have no exam authority behind them at all. Their "answer
# key" is just their author's opinion, and it was demonstrably wrong at least
# once. `note` is surfaced in the UI next to the answer, so the reader is told.
#
# (srcKey, unit, no) -> {"ans": new letter or None to keep, "conf": ..., "note": ...}
CORRECTIONS = {
    ("MUDALPRAC-V2", "IV", 10): {
        "ans": "B",
        "conf": "high",
        "note": "The source volume's key says (c) TEM. That is wrong: MID(\"SYSTEM\",3,3) "
                "takes three characters starting AT position 3 of S-Y-S-T-E-M, i.e. "
                "characters 3-4-5 = STE. The key's own note (\"starts at position 3, "
                "length 3\") describes the right computation but then picks the last "
                "three characters. Answer corrected to (b) here.",
    },
    ("MUDALPRAC-V2", "II", 24): {
        "ans": None,
        "conf": "medium",
        "note": "msconfig is the best of the four options, but the question's premise is "
                "dated: the System Configuration Startup tab was removed in Windows 8 and "
                "now only links to Task Manager, which is where startup programs are "
                "actually controlled. msconfig still governs boot options and services.",
    },
}

UNIT_RE = re.compile(r"^#\s+UNIT\s+([IV]+)\s+[—-]", re.M)
KEY_RE = re.compile(r"^##\s+UNIT\s+([IV]+)\s+[—-].*ANSWER KEY\s*$", re.M)
SECTION_RE = re.compile(r"^###\s+[A-Z]\.\s+(.+?)\s*$", re.M)
QNUM_RE = re.compile(r"^\*\*(\d+)\.\*\*\s*", re.M)


def split_options(blob, qid):
    """Split a question blob into stem + {A..D}.

    Options are printed inline as `a) ... b) ... c) ... d) ...`, on the same
    line as the stem in volume 2 and on the following line in volume 1. Both
    collapse to the same problem once newlines are normalised.

    The letter markers are located by scanning for them IN ORDER, so a literal
    "b)" occurring inside option (a)'s text cannot be mistaken for the start of
    option (b) unless it appears before the real one. Every result is then
    checked non-empty, which is the tripwire for that going wrong.
    """
    text = " ".join(blob.split())
    spans = []
    pos = 0
    for letter in LETTERS:
        m = re.compile(r"(?:^|\s)" + letter + r"\)\s").search(text, pos)
        if not m:
            sys.exit(f"FAIL {qid}: could not locate option '{letter})' in: {text[:160]!r}")
        spans.append((letter, m.start(), m.end()))
        pos = m.end()

    stem = text[: spans[0][1]].strip()
    # Tripwire for markdown structure leaking into question data. A horizontal
    # rule, a heading marker or a table pipe inside a stem or an option means the
    # blob boundaries are wrong, and a wrong boundary silently truncates or
    # extends real content rather than failing.
    if re.search(r"-{3,}|^#{1,6}\s|\|", stem):
        sys.exit(f"FAIL {qid}: markdown structure leaked into the stem: {stem[:160]!r}")
    opts = {}
    for i, (letter, _start, end) in enumerate(spans):
        stop = spans[i + 1][1] if i + 1 < len(spans) else len(text)
        value = text[end:stop].strip()
        if not value:
            sys.exit(f"FAIL {qid}: option {letter} parsed empty from: {text[:160]!r}")
        if re.search(r"-{3,}|^#{1,6}\s|\|", value):
            sys.exit(f"FAIL {qid}: markdown structure leaked into option "
                     f"{letter}: {value!r}")
        opts[letter.upper()] = value
    if not stem:
        sys.exit(f"FAIL {qid}: empty stem parsed from: {text[:160]!r}")
    return stem, opts


def parse_keys(block, unit, vol):
    """Parse `1-b (why) · 2-c · ...` into {no: (letter, explanation)}.

    The explanation is the parenthetical the author attached to some answers.
    It is the only explanation these questions ship with, so it is carried
    through to `exp` rather than discarded.
    """
    out = {}
    for m in re.finditer(r"(\d+)\s*-\s*([a-d])\b\s*(?:\(([^)]*)\))?", block):
        no = int(m.group(1))
        if no in out:
            sys.exit(f"FAIL {vol} unit {unit}: answer key lists question {no} twice")
        out[no] = (m.group(2).upper(), (m.group(3) or "").strip())
    return out


def parse_volume(vol, src_key, filename):
    path = os.path.join(SOURCES, filename)
    if not os.path.isfile(path):
        sys.exit(f"FAIL: missing source {path}")
    text = open(path, encoding="utf-8").read()

    # Carve the file into per-unit question bodies and per-unit key blocks.
    # A unit's questions run from its `# UNIT n` heading to its `## UNIT n
    # ANSWER KEY` heading; the key runs from there to the next `---`.
    unit_starts = [(m.group(1), m.start(), m.end()) for m in UNIT_RE.finditer(text)]
    key_starts = {m.group(1): (m.start(), m.end()) for m in KEY_RE.finditer(text)}
    if [u for u, _, _ in unit_starts] != list(UNIT_TITLES):
        sys.exit(f"FAIL {vol}: units found {[u for u, _, _ in unit_starts]}, "
                 f"expected {list(UNIT_TITLES)}")

    rows = []
    for unit, _u_start, u_end in unit_starts:
        if unit not in key_starts:
            sys.exit(f"FAIL {vol}: no answer key block for unit {unit}")
        k_start, k_end = key_starts[unit]
        # Drop the `---` rule(s) that separate the last question from the answer
        # key heading. Without this they land inside the LAST option of the last
        # question in every unit — ".csv ---" — which is silent corruption of
        # exactly 10 questions that no count check would ever catch. Found by
        # looking at a rendered card in the browser, not by any assertion here.
        body = re.sub(r"(?:\s*\n-{3,})+\s*$", "\n", text[u_end:k_start])

        end_of_key = text.find("\n---", k_end)
        keys = parse_keys(text[k_end:end_of_key if end_of_key != -1 else len(text)], unit, vol)

        # Map each question to the lettered section it sits under, so the
        # import can tag by topic instead of dumping 90 questions under one
        # unit. Volume 2 uses different section groupings from volume 1; both
        # are recorded verbatim rather than forced into a shared scheme.
        sections = [(m.start(), m.group(1)) for m in SECTION_RE.finditer(body)]

        marks = [(int(m.group(1)), m.start(), m.end()) for m in QNUM_RE.finditer(body)]
        want = EXPECTED[vol][unit]
        if len(marks) != want:
            sys.exit(f"FAIL {vol} unit {unit}: parsed {len(marks)} questions, "
                     f"expected {want} per the volume's contents table")

        for i, (no, q_start, q_end) in enumerate(marks):
            if no != i + 1:
                sys.exit(f"FAIL {vol} unit {unit}: question numbering jumps "
                         f"at position {i + 1} (found {no}) — a question was dropped")
            stop = marks[i + 1][1] if i + 1 < len(marks) else len(body)
            blob = body[q_end:stop]
            # Trim a trailing section heading that belongs to the NEXT block.
            blob = SECTION_RE.split(blob)[0]
            qid = f"{src_key}-{unit}-{no}"
            stem, opts = split_options(blob, qid)

            if no not in keys:
                sys.exit(f"FAIL {qid}: no entry in the unit {unit} answer key")
            ans, exp = keys[no]
            if ans not in opts:
                sys.exit(f"FAIL {qid}: key says {ans} but options are {sorted(opts)}")

            section = ""
            for s_pos, s_name in sections:
                if s_pos < q_start:
                    section = s_name

            row = {
                "srcKey": src_key,
                "unit": unit,
                "no": no,
                "section": section,
                "q": stem,
                "opts": opts,
                "ans": ans,
                "exp": exp,
                "conf": "high",
                "note": "",
            }
            fix = CORRECTIONS.get((src_key, unit, no))
            if fix:
                if fix["ans"]:
                    if fix["ans"] == ans:
                        sys.exit(f"FAIL {qid}: CORRECTIONS says the key should be "
                                 f"{fix['ans']} but the source already says that — "
                                 f"the correction is stale, remove it")
                    if fix["ans"] not in opts:
                        sys.exit(f"FAIL {qid}: CORRECTIONS answer {fix['ans']} "
                                 f"is not one of the options {sorted(opts)}")
                    row["ans"] = fix["ans"]
                    row["srcAns"] = ans   # what the volume printed, kept for audit
                row["conf"] = fix["conf"]
                row["note"] = fix["note"]
            rows.append(row)

        extra = set(keys) - {no for no, _, _ in marks}
        if extra:
            sys.exit(f"FAIL {vol} unit {unit}: answer key has entries "
                     f"{sorted(extra)} with no matching question")

    return rows


def attach_tags(rows):
    """Attach the syllabus leaf each question drills, from staged/practice-tags.json.

    The tags are a curated artifact (the same role staged/tags.json plays for the
    main bank), kept in the repo rather than regenerated, because assigning 349
    questions to syllabus leaves is a judgement call and re-deriving it on every
    run would make the output non-reproducible.

    Every tag is checked against the real TECH1 taxonomy. An untagged question is
    allowed (it ships with sub=None and simply groups under its unit); a MIS-tagged
    one is not, because a leaf that does not exist would quietly drop the question
    out of every by-subtopic view without any error.
    """
    path = os.path.join(STAGED, "practice-tags.json")
    if not os.path.isfile(path):
        print("WARN staged/practice-tags.json missing — questions ship untagged, "
              "grouped by unit only")
        return

    tax_path = os.path.join(STAGED, "taxonomy.json")
    leaves = set()
    if os.path.isfile(tax_path):
        leaves = {(str(r["unit"]), r["sub"]) for r in json.load(open(tax_path, encoding="utf-8"))
                  if r["paper"] == "TECH1"}

    tags = {(t["srcKey"], t["unit"], t["no"]): t["sub"]
            for t in json.load(open(path, encoding="utf-8"))}
    n = 0
    for r in rows:
        sub = tags.get((r["srcKey"], r["unit"], r["no"]))
        if sub is None:
            continue
        if leaves and (r["unit"], sub) not in leaves:
            sys.exit(f"FAIL {r['srcKey']}-{r['unit']}-{r['no']}: tagged {sub!r}, "
                     f"which is not a leaf of TECH1 unit {r['unit']}")
        r["sub"] = sub
        n += 1
    stale = set(tags) - {(r["srcKey"], r["unit"], r["no"]) for r in rows}
    if stale:
        sys.exit(f"FAIL: practice-tags.json has {len(stale)} tags matching no "
                 f"question, e.g. {sorted(stale)[:3]}")
    print(f"OK  tagged {n}/{len(rows)} questions to TECH1 syllabus leaves")


def main():
    all_rows = []
    for vol, src_key, filename in VOLUMES:
        rows = parse_volume(vol, src_key, filename)
        all_rows.extend(rows)
        by_unit = {u: sum(1 for r in rows if r["unit"] == u) for u in UNIT_TITLES}
        print(f"OK  {filename}: {len(rows)} questions {by_unit}")

    ids = [f"{r['srcKey']}-{r['unit']}-{r['no']}" for r in all_rows]
    if len(ids) != len(set(ids)):
        sys.exit("FAIL: duplicate question ids produced")

    # A correction that no longer matches any question is a correction that has
    # silently stopped being applied. Fail loudly rather than let the reader keep
    # seeing an answer we already know is wrong.
    seen = {(r["srcKey"], r["unit"], r["no"]) for r in all_rows}
    for k in CORRECTIONS:
        if k not in seen:
            sys.exit(f"FAIL: CORRECTIONS entry {k} matches no question in the sources")
    n_fixed = sum(1 for r in all_rows if r.get("srcAns"))
    print(f"OK  {len(CORRECTIONS)} corrections applied ({n_fixed} changed an answer)")

    attach_tags(all_rows)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(all_rows, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"OK  {os.path.relpath(OUT, ROOT)}: {len(all_rows)} questions total")


if __name__ == "__main__":
    main()
