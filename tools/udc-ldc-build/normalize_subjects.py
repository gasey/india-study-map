"""Make `subject` agree with the canonical section across both banks.

Background
----------
The combined UDC/LDC/Group B bank is one question pool (7,048 rows), and
`subject` is what attempt logs carry into the analytics: Arena logs
`subject:` per attempt and the Mindset page breaks subjects out, so an
arithmetic question must not be logged as "gk" or "reasoning".

Until now the two generators wrote different faces of the same section:
  build_bank.py       arithmetic -> subject 'reasoning', computer -> 'science'
  build_group_b.py    Paper-II 1-65 -> subject 'gk'
  group_b_sources.py  every arithmetic/computer row -> subject 'gk'

Both generators have been fixed so a FUTURE rebuild writes `subject ==
section`. This tool applies the same canonical values to the committed
artifacts WITHOUT regenerating them (the upstream staged bank has drifted and
a regeneration pulls in unreviewed question text, so we do not want to
regenerate here).

It rewrites only the `subject:` value of each row — nothing else — and then
asserts the invariant: for every row, subject == the section `sectionOf`
would assign (studySection > topic id > topic label), so this tool and the
filter agree.

Usage:  python3 tools/udc-ldc-build/normalize_subjects.py   # idempotent
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
UDC = ROOT / "src" / "data" / "banks" / "mpsc-udc-ldc.ts"
GROUP_B = ROOT / "src" / "data" / "banks" / "mpsc-group-b-general.ts"

# topic id -> section. Must mirror TOPIC_SECTION in
# src/modules/udc-ldc/filters.ts (the runtime `sectionOf`).
TOPIC_SECTION = {
    # clerical bank
    "gk_general": "gk",
    "eng_general": "english",
    "simple_arithmetic": "arithmetic",
    "computer_knowledge": "computer",
    "intelligence_reasoning": "reasoning",
    # Group B: quantitative subtopics
    "simple-arithmetic": "arithmetic",
    "mensuration": "arithmetic",
    "algebra": "arithmetic",
    "number_system": "arithmetic",
    "speed_distance_time": "arithmetic",
    "percentage": "arithmetic",
    "profit_loss": "arithmetic",
    "ratio_proportion": "arithmetic",
    "simple_compound_interest": "arithmetic",
    "average": "arithmetic",
    "data_interpretation": "arithmetic",
    "time_work": "arithmetic",
    "probability": "arithmetic",
    "age_problems": "arithmetic",
    "pipes_cisterns": "arithmetic",
    "permutation_combination": "arithmetic",
    "mixture_alligation": "arithmetic",
    # Group B: reasoning subtopics
    "general-intelligence-&-reasoning": "reasoning",
    "coding_decoding": "reasoning",
    "calendar_clock": "reasoning",
    "alphabet_test": "reasoning",
    "direction_sense": "reasoning",
    "number_series": "reasoning",
    "analogy": "reasoning",
    "matrix_reasoning": "reasoning",
    "odd_one_out": "reasoning",
    "venn_diagram": "reasoning",
    "logical_sequence": "reasoning",
    "ranking": "reasoning",
    "figure_series": "reasoning",
    "figure_counting": "reasoning",
    "syllogism": "reasoning",
    "seating_arrangement": "reasoning",
    "blood_relation": "reasoning",
    "dice": "reasoning",
    "classification": "reasoning",
    "paper_folding": "reasoning",
    "mirror_image": "reasoning",
    # Group B: computer
    "basic-computer-knowledge": "computer",
}

VALID_SUBJECTS = {"gk", "english", "computer", "arithmetic", "reasoning"}


def section_for(row: dict) -> str:
    """Same resolution order as filters.ts sectionOf()."""
    if row.get("studySection"):
        return row["studySection"]
    mapped = TOPIC_SECTION.get(row.get("topic") or "")
    if mapped:
        return mapped
    label = (row.get("topicLabel") or "").lower()
    if "computer" in label:
        return "computer"
    if "arithmetic" in label:
        return "arithmetic"
    if "intelligence" in label or "reasoning" in label:
        return "reasoning"
    if "english" in label:
        return "english"
    return "gk"


def group_b_rows(src: str):
    """Yield (row_dict, start_offset, end_offset) for every Group B question."""
    dec = json.JSONDecoder()
    out = []
    for m in re.finditer(r"const groupBQuestionsPart\d+: BankQuestion\[\] = ", src):
        _, end = dec.raw_decode(src, m.end())  # array end offset (just past ']')
        cursor = m.end() + 1  # step past the opening '['
        while cursor < end:
            while cursor < end and src[cursor] in " \t\r\n,":
                cursor += 1
            if cursor >= end or src[cursor] != "{":
                break
            row, stop = dec.raw_decode(src, cursor)
            out.append((row, cursor, stop))
            cursor = stop
    return out


def rewrite_udc() -> int:
    src = UDC.read_text()
    # Every UDC/LDC row is  subject: 'X', <ws> topic: 'Y'  — verify that shape
    # up front so the regex rewrite can never touch a non-row occurrence.
    n_pat = len(re.findall(r"\bsubject: '[a-z_]+',[ \t]*\n[ \t]*topic: '[a-z_]+'", src))
    n_subj = len(re.findall(r"\bsubject: '[a-z_]+'", src))
    assert n_pat == n_subj == 3339, (n_pat, n_subj)

    changed = 0

    def sub(m: re.Match) -> str:
        nonlocal changed
        cur, ws, topic = m.group(1), m.group(2), m.group(3)
        want = TOPIC_SECTION.get(topic)
        if want and want != cur:
            changed += 1
            return f"subject: '{want}',{ws}topic: '{topic}'"
        return m.group(0)

    new, n = re.subn(
        r"\bsubject: '([a-z_]+)',([ \t]*\n[ \t]*)topic: '([a-z_]+)'", sub, src)
    if n != n_subj:
        raise SystemExit(f"udc: expected {n_subj} rows, matched {n}")
    if changed:
        UDC.write_text(new)
    return changed


def rewrite_group_b() -> int:
    src = GROUP_B.read_text()
    rows = group_b_rows(src)
    if not rows:
        raise SystemExit("group-b: no rows parsed")
    changed = 0
    edits = []  # (start, old_text, new_text)
    for row, start, end in rows:
        section = section_for(row)
        m = re.search(r'"subject": "([a-z_]+)"', src[start:end])
        if not m:
            raise SystemExit(f"group-b: no subject field in row at {start}: {row.get('id')}")
        cur = m.group(1)
        if section != cur:
            if section not in VALID_SUBJECTS:
                raise SystemExit(f"group-b: subject for {row.get('id')} would be {section!r}")
            edits.append((start + m.start(), m.group(0), f'"subject": "{section}"'))
            changed += 1
    if edits:
        chunks = []
        pos = 0
        for start, old, new in sorted(edits):
            chunks.append(src[pos:start])
            chunks.append(new)
            pos = start + len(old)
        chunks.append(src[pos:])
        GROUP_B.write_text("".join(chunks))
    return changed


def verify() -> None:
    # UDC: every subject/topic pair agrees with the canonical map.
    src = UDC.read_text()
    pairs = re.findall(r"\bsubject: '([a-z_]+)',[ \t]*\n[ \t]*topic: '([a-z_]+)'", src)
    bad = [(s, t) for s, t in pairs if TOPIC_SECTION.get(t) != s]
    if len(pairs) != 3339 or bad:
        raise SystemExit(f"udc invariant broken: n={len(pairs)} bad={bad[:5]}")

    # Group B: every row's subject equals `sectionOf`'s answer.
    src = GROUP_B.read_text()
    rows = group_b_rows(src)
    bad = [(r.get("id"), r.get("subject"), section_for(r))
           for r, _, _ in rows if r.get("subject") != section_for(r)]
    if bad:
        raise SystemExit(f"group-b invariant broken: {len(bad)} rows, e.g. {bad[:5]}")
    import re as _re
    subj = _re.findall(r'"subject": "([a-z_]+)"', src)
    stray = set(subj) - VALID_SUBJECTS
    if stray:
        raise SystemExit(f"group-b: unrelated subject values: {stray}")
    print(f"verified: {len(pairs)} udc rows, {len(rows)} group-b rows, subject == section")


if __name__ == "__main__":
    print(f"udc rewrites:     {rewrite_udc()}")
    print(f"group-b rewrites: {rewrite_group_b()}")
    verify()