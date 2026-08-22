"""Parse the source HTML answer key into structured JSON.

Source: ~/Downloads/ASSISTANT CONTROLLER OF MINES - 2026.html — a "Marked
Answer Key" for a mock MPSC Assistant Controller of Mines paper (General
English Part-B + General Studies), independently numbered 1-66 and 1-100.

Structure per question: one <div class="q-block"> containing a <div class="q">
stem, one or more <ul class="opts"> (see SELF-CORRECTIONS below), and
sometimes a trailing <i> editorial note.

SELF-CORRECTIONS: 3 questions (English Q9, GS Q33, GS Q67) have TWO
<ul class="opts"> blocks — an initial marking, an <i> note reasoning about
the official key ("Wait, the provided key array... Let's fix this to match
the key exactly"), and a corrected second block. The note text makes clear
this file was authored by an LLM reasoning out loud, not transcribed from a
real government-published key — there is no independent "official key" to
verify against, only the file's own internal correction. We take the LAST
<ul> in each block as authoritative (it's what the note itself concludes),
which this parser does unconditionally — correct for all 166 questions,
since blocks with only one <ul> are unaffected by "take the last one."
"""
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

SRC = Path.home() / "Downloads" / "ASSISTANT CONTROLLER OF MINES - 2026.html"

def clean(text):
    return re.sub(r"\s+", " ", text).strip()

def parse_question_div(qdiv):
    """<div class="q">N. Stem text...</div> -> (number, stem-with-underline-markers)."""
    # Preserve <u>word</u> as __word__ before stripping tags (renderEmphasis
    # convention, already used by mpsc-state-tax-officer.ts and rendered by
    # src/lib/renderEmphasis.tsx) — several questions (word-class ID,
    # word-transformation, degree ID) have NO other way to indicate which
    # word is the operative one; the underline is load-bearing, not just
    # decoration.
    for u in qdiv.find_all("u"):
        u.replace_with(f"__{u.get_text()}__")
    # <br> -> newline, for the few multi-line stems (rank-the-following,
    # match-the-following, statement-based "which of the above" questions).
    for br in qdiv.find_all("br"):
        br.replace_with("\n")
    raw = clean(qdiv.get_text())
    m = re.match(r"^(\d+)\.\s*(.*)$", raw, re.S)
    if not m:
        raise ValueError(f"Question div doesn't start with 'N. ': {raw[:80]!r}")
    return int(m.group(1)), m.group(2).strip()

LETTER_RE = re.compile(r"^\(([a-d])\)\s*(.*)$", re.S)

def parse_opts_ul(ul):
    """Returns (options[4], answer_index)."""
    opts, answer_index = [], None
    for li in ul.find_all("li"):
        text = clean(li.get_text())
        text = text.lstrip("✔").strip()
        m = LETTER_RE.match(text)
        if not m:
            raise ValueError(f"Option doesn't start with '(a)'..'(d)': {text!r}")
        letter, body = m.group(1), m.group(2).strip()
        idx = ord(letter) - ord("a")
        if "correct" in (li.get("class") or []):
            answer_index = idx
        opts.append((idx, body))
    opts.sort(key=lambda p: p[0])
    if [i for i, _ in opts] != [0, 1, 2, 3]:
        raise ValueError(f"Expected options a-d, got indices {[i for i, _ in opts]}")
    if answer_index is None:
        raise ValueError("No option marked class=\"correct\"")
    return [body for _, body in opts], answer_index

def parse_section(h2_text, blocks):
    out = []
    for block in blocks:
        qdiv = block.find("div", class_="q")
        num, stem = parse_question_div(qdiv)
        uls = block.find_all("ul", class_="opts")
        options, answer_index = parse_opts_ul(uls[-1])  # last = corrected, if any
        note = block.find("i")
        rec = {
            "section": h2_text,
            "num": num,
            "question": stem,
            "options": options,
            "answerIndex": answer_index,
            "hadSelfCorrection": len(uls) > 1,
            "editorialNote": clean(note.get_text()) if note else None,
        }
        out.append(rec)
    return out

def main():
    soup = BeautifulSoup(SRC.read_text(encoding="utf-8"), "html.parser")
    body = soup.body

    # Split top-level children into sections by <h2>.
    sections = []  # (h2_text, [q-block divs])
    current_h2, current_blocks = None, []
    for el in body.find_all(["h2", "div"], recursive=False):
        if el.name == "h2":
            if current_h2 is not None:
                sections.append((current_h2, current_blocks))
            current_h2, current_blocks = clean(el.get_text()), []
        elif el.name == "div" and "q-block" in (el.get("class") or []):
            current_blocks.append(el)
    if current_h2 is not None:
        sections.append((current_h2, current_blocks))

    all_records = []
    for h2_text, blocks in sections:
        all_records.extend(parse_section(h2_text, blocks))

    # Sanity checks before handing off to build_bank.py.
    by_section = {}
    for r in all_records:
        by_section.setdefault(r["section"], []).append(r["num"])
    for section, nums in by_section.items():
        expected = list(range(1, len(nums) + 1))
        if sorted(nums) != expected:
            raise SystemExit(f"Section {section!r}: expected numbers 1..{len(nums)}, got {sorted(nums)}")

    corrections = [r for r in all_records if r["hadSelfCorrection"]]
    print(f"Parsed {len(all_records)} questions across {len(sections)} sections:", file=sys.stderr)
    for section, nums in by_section.items():
        print(f"  {section}: {len(nums)} questions", file=sys.stderr)
    print(f"  {len(corrections)} self-corrected in source (took the LAST <ul> as authoritative):", file=sys.stderr)
    for r in corrections:
        print(f"    {r['section']} Q{r['num']}: {r['editorialNote']}", file=sys.stderr)

    out_path = Path(__file__).parent / "parsed.json"
    out_path.write_text(json.dumps(all_records, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {out_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
