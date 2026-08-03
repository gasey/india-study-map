#!/usr/bin/env python3
"""
Parse the Aug-2025 Inspector of Excise & Narcotics papers straight out of the
PDF text layer. These PDFs are digital (not scans), so this is exact -- no OCR,
no vision, no inference. Anything this script cannot parse cleanly is reported
rather than guessed at.
"""
import os
import re
import subprocess
import sys
import json

BASE = "/home/hruaia/Downloads/mpsc_pdfs_examination/Old_Questions/Direct_2025-2027"

PAPERS = [
    # End markers are matched case-insensitively: GS-II prints "SECTION - II"
    # while GS-III prints "Section - II". Getting this wrong silently glues the
    # whole descriptive section onto the last option of Q50.
    ("GS-I",    "General Studies Paper-I - Inspector of Excise-2025..pdf",   50, "SECTION - I", r"section\s*-\s*II"),
    ("GS-II",   "General Studies Paper-II - Inspector of Excise-2025..pdf",  50, "SECTION - I", r"section\s*-\s*II"),
    ("GS-III",  "General Studies Paper-III - Inspector of Excise-2025..pdf", 50, "SECTION - I", r"section\s*-\s*II"),
    ("English", "General English - Inspector of Excise-2025..pdf",           36, "SECTION - B", None),
]

# Page furniture that must never end up inside a stem or an option.
NOISE = re.compile(
    r"^\s*(-\s*\d+\s*-"
    r"|MIZORAM PUBLIC SERVICE COMMISSION"
    r"|GENERAL COMPETITIVE EXAMINATION.*"
    r"|OF INSPECTOR UNDER EXCISE.*"
    r"|GOVERNMENT OF MIZORAM.*"
    r"|\(AUGUST-2025\)"
    r"|GENERAL STUDIES PAPER.*"
    r"|GENERAL ENGLISH.*"
    r"|Time Allowed.*"
    r"|FM\s*:.*"
    r"|All questions carry equal mark.*"
    r"|This Section should be answered only on the OMR.*"
    r"|SECTION\s*-\s*[AB1I].*"
    r")\s*$",
    re.IGNORECASE,
)


def pdf_text(path):
    return subprocess.run(
        ["pdftotext", "-layout", path, "-"],
        capture_output=True, text=True, check=True,
    ).stdout


def slice_section(text, start_marker, end_marker):
    i = text.find(start_marker)
    if i < 0:
        raise SystemExit(f"start marker {start_marker!r} not found")
    text = text[i + len(start_marker):]
    if end_marker:
        m = re.search(end_marker, text, re.IGNORECASE)
        if not m:
            raise SystemExit(f"end marker {end_marker!r} not found")
        text = text[: m.start()]
    return text


def clean_lines(section):
    out = []
    for ln in section.splitlines():
        if NOISE.match(ln):
            continue
        if not ln.strip():
            continue
        out.append(ln.rstrip())
    return out


# "Direction (Question Nos. 11 - 20) : Choose an appropriate Preposition..."
# These head a run of questions and carry the instruction the stems omit, so
# they are captured and attached rather than dropped -- and critically they are
# kept OUT of the preceding question's last option, which is where they
# otherwise land.
DIRECTION = re.compile(
    r"^\s*Direction[s]?\s*(?:for\s*)?\(?\s*Questions?\s*No[s]?\.?\s*"
    r"(\d{1,3})\s*(?:-|to|&)\s*(\d{1,3})\s*\)?\s*:\s*(.*)$",
    re.IGNORECASE,
)


def split_questions(lines, expected):
    """Split on '<n>. ' only when n is the next number we're expecting -- this
    stops list items like '1) ...' or a year '1935.' from starting a question."""
    blocks, cur, want = [], None, 1
    directions = []          # (lo, hi, text)
    collecting = None        # direction currently absorbing continuation lines

    for ln in lines:
        d = DIRECTION.match(ln)
        if d:
            lo, hi, head = int(d.group(1)), int(d.group(2)), d.group(3).strip()
            collecting = [lo, hi, head]
            directions.append(collecting)
            # A direction ends the previous question -- but that question must
            # be FLUSHED, not discarded, or every question immediately before a
            # direction header silently disappears.
            if cur is not None:
                blocks.append(cur)
                cur = None
            continue

        # The dot is optional: GS-I Q29 is printed "29 Who was..." in the
        # original paper. Requiring int(n) == want keeps this from matching
        # list items or bare years.
        m = re.match(r"^\s*(\d{1,3})\.?\s+(.*)$", ln)
        if m and int(m.group(1)) == want:
            collecting = None
            if cur is not None:
                blocks.append(cur)
            cur = {"n": want, "lines": [m.group(2)]}
            want += 1
        elif collecting is not None:
            collecting[2] = (collecting[2] + " " + ln.strip()).strip()
        elif cur is not None:
            cur["lines"].append(ln.strip())

    if cur is not None:
        blocks.append(cur)
    if len(blocks) != expected:
        print(f"    !! got {len(blocks)} blocks, expected {expected}", file=sys.stderr)

    for b in blocks:
        for lo, hi, text in directions:
            if lo <= b["n"] <= hi:
                b["direction"] = re.sub(r"\s+", " ", text).strip()
    return blocks


OPT = re.compile(r"\((a|b|c|d)\)\s*")


def parse_block(b):
    body = "\n".join(b["lines"])
    hits = list(OPT.finditer(body))
    # Keep only a strictly a,b,c,d run -- guards against a stray "(c)" inside a stem.
    seq, want = [], "a"
    for h in hits:
        if h.group(1) == want:
            seq.append(h)
            want = {"a": "b", "b": "c", "c": "d", "d": None}[want]
            if want is None:
                break
    norm = lambda s: re.sub(r"\s+", " ", s).strip()
    flat = norm(body)

    stem, opts = flat, []
    if len(seq) == 4:
        stem = norm(body[: seq[0].start()])
        for k, h in enumerate(seq):
            end = seq[k + 1].start() if k + 1 < len(seq) else len(body)
            opts.append(norm(body[h.end(): end]))

    # Picture-sequence / figure-matrix items (GS-III Q48, Q49, Q50) print their
    # options as images, so there is nothing to extract. Q50 is the nasty case:
    # four (a)-(d) markers DO parse, but they capture only the stray punctuation
    # between the images. Treat degenerate options the same as missing ones --
    # these are real questions, not parse failures, and must not be silently
    # dropped or filled with junk.
    # "Degenerate" means an option with no letters or digits at all -- NOT
    # merely a short one. Plenty of real options are 2 chars ("of", "to", "8"):
    # a length threshold wrongly condemns every preposition and numeric item.
    degenerate = len(seq) != 4 or any(not re.search(r"[0-9A-Za-z]", o) for o in opts)
    if degenerate and re.search(r"figure|picture sequence", flat + " " + b.get("direction", ""), re.I):
        r = {"n": b["n"], "figureBased": True, "stem": flat, "options": []}
        if b.get("direction"):
            r["direction"] = b["direction"]
        return r
    if len(seq) != 4:
        return {"n": b["n"], "error": f"found {len(seq)}/4 options", "raw": body}
    if degenerate:
        return {"n": b["n"], "error": "degenerate options", "raw": body}

    out = {"n": b["n"], "stem": stem, "options": opts}
    if b.get("direction"):
        out["direction"] = b["direction"]
    return out


def main():
    result = {}
    for name, fn, expected, start, end in PAPERS:
        print(f"== {name}")
        section = slice_section(pdf_text(f"{BASE}/{fn}"), start, end)
        blocks = split_questions(clean_lines(section), expected)
        parsed = [parse_block(b) for b in blocks]
        bad = [p for p in parsed if "error" in p]
        print(f"    {len(parsed)} questions, {len(bad)} unparsed")
        for p in bad:
            print(f"    Q{p['n']}: {p['error']}")
        result[name] = parsed
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "parsed-2025.json")
    json.dump(result, open(out, "w"), indent=1, ensure_ascii=False)
    print("wrote", out)


if __name__ == "__main__":
    main()
