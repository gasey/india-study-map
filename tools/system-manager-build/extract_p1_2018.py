#!/usr/bin/env python3
"""
Recover the MIMER 2018 Computer Operator Technical Paper I — the one Tier 1
paper that no other step in this pipeline can reach.

WHY THIS SCRIPT EXISTS AT ALL. harvest.py reads every Tier 1 paper out of
mpsc-question-bank's mpsc_bank_v2.json. This paper is not in there, and the
reason is a filename collision, not an extraction failure: MPSC's listing pages
put the post name in one table cell and the paper links in the next, so the
scraper (which took the LINK TEXT as the title) saved both
    MIMER 2018 Laboratory Technician  Technical Paper-I
    MIMER 2018 Computer Operator      Technical Paper-I
as `2.Technical Paper-I.pdf`, and one overwrote the other. The survivor on disk
is Laboratory Technician. See DEVLOG 2026-08-31 and harvest.py's TIER1 comment.

So this paper comes straight from MPSC's live copy instead:
    https://mpsc.mizoram.gov.in/uploads/attachments/
        963bc976d8dfb7ce26c046ac1c4dba1b/technical-paper-i-compt.pdf
kept in the repo at sources/mimer-2018-computer-operator-technical-paper-i.pdf
(328,026 bytes, sha256 77c20d33…4477). It has a clean 7-page text layer, so
this is a parser, not an OCR or vision pass — no model reads the questions and
there is nothing here that can hallucinate one.

WHY THE HEADER GUARD IS NOT OPTIONAL. The last time this sitting was touched,
a header check asking only for "MIZORAM INSTITUTE OF MEDICAL EDUCATION AND
RESEARCH" — true of every MIMER paper whatever the post — admitted 75 LABORATORY
TECHNICIAN questions (bone types, ketone bodies, Ziehl-Neelsen staining) into
staged/harvest.json carrying a `prov` string that asserted they were Computer
Operator Technical Paper I. Nothing in the pipeline caught it; two tagging
agents refused to tag anatomy against a computing syllabus and traced it back.
REQUIRE_HEADER below therefore pins the POST, and REJECT_HEADER names the exact
paper that got in last time, so the collision cannot recur silently.

Output: extracted/CO2018M-P1.json — {no, q, opts{A-D}, page, needs_figure},
UNANSWERED. Answers are a separate, later step (solve_p1_2018.py) precisely so
that a transcription bug and a wrong answer can never be introduced by the same
pass. assemble.py picks the file up via its EXTRACTED_META table.

Usage:  python3 tools/system-manager-build/extract_p1_2018.py [--write]
        Without --write it parses, validates and reports, touching nothing.
"""

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EXTRACTED = os.path.join(HERE, "extracted")
PDF = os.path.join(HERE, "sources",
                   "mimer-2018-computer-operator-technical-paper-i.pdf")
SRC_KEY = "CO2018M-P1"
EXPECT = 75          # 150 marks, "All questions carry equal marks of 2 each"
PAGES = 7
SHA256 = "77c20d338d31decfcf18545c5507f9c66b113e3905547123dfe56e979b714477"

# Every string here must appear in the paper's own printed first page. Together
# they have to pin the POST, not merely the employer — see the module docstring.
REQUIRE_HEADER = [
    "MIZORAM PUBLIC SERVICE COMMISSION",
    "COMPUTER OPERATOR",
    "MIZORAM INSTITUTE OF MEDICAL EDUCATION AND RESEARCH (MIMER) - 2018",
    "TECHNICAL PAPER",
    "Full Marks : 150",
]
# If any of these appear, we have the wrong paper for this srcKey. The first is
# the paper that actually overwrote ours on disk; the others are the remaining
# MIMER 2018 posts whose Technical Paper I shares the flattened filename.
REJECT_HEADER = [
    "LABORATORY TECHNICIAN",
    "MEDICAL RECORD TECHNICIAN",
    "PROGRAMMER",
]

OPT_RE = re.compile(r"\((a|b|c|d)\)\s*")
QNO_RE = re.compile(r"^\s*(\d{1,2})\.\s")
# Page furniture: the printed folio ("-3-") and the closing rule.
FURNITURE_RE = re.compile(r"^\s*(-\s*\d+\s*-|\*+)\s*$")
# Phrases that mean the reader cannot answer from text alone. Paper I is
# fundamentals/OS/office so we expect none, but "expect none" is a prediction,
# not a guarantee, and a figure question shipped blind is exactly the failure
# CLAUDE.md's quarantine policy exists to prevent.
FIGURE_HINT_RE = re.compile(
    r"\b(figure|diagram|shown below|following (?:figure|diagram|table)|"
    r"given below is the (?:figure|diagram))\b", re.I)


def page_text(page):
    out = subprocess.run(
        ["pdftotext", "-f", str(page), "-l", str(page), "-layout", PDF, "-"],
        capture_output=True, text=True, check=True)
    return out.stdout


def check_source():
    """Fail loudly before parsing a single question if this is not our paper."""
    if not os.path.isfile(PDF):
        sys.exit(f"missing source PDF: {PDF}\n"
                 f"fetch it from MPSC — see the module docstring for the URL")
    digest = hashlib.sha256(open(PDF, "rb").read()).hexdigest()
    if digest != SHA256:
        sys.exit(f"source PDF sha256 mismatch\n  expected {SHA256}\n"
                 f"  got      {digest}\n"
                 f"MPSC may have replaced the file. Re-verify the header by "
                 f"hand and update SHA256 deliberately — do not just paste the "
                 f"new digest in.")

    n_pages = int(re.search(r"Pages:\s+(\d+)",
                            subprocess.run(["pdfinfo", PDF], capture_output=True,
                                           text=True, check=True).stdout).group(1))
    if n_pages != PAGES:
        sys.exit(f"expected {PAGES} pages, found {n_pages}")

    head = page_text(1)
    missing = [h for h in REQUIRE_HEADER if h not in head]
    if missing:
        sys.exit("printed header does not pin this paper; missing:\n  "
                 + "\n  ".join(repr(m) for m in missing))
    wrong = [h for h in REJECT_HEADER if h in head]
    if wrong:
        sys.exit(f"this is a DIFFERENT POST's paper — header contains {wrong}.\n"
                 f"That is the 2026-08-31 filename-collision bug recurring.")
    print(f"header OK — pins COMPUTER OPERATOR / MIMER 2018 / TECHNICAL PAPER I")


def is_layout_row(line):
    """True if this stem line is column-aligned data rather than wrapped prose.

    A wrapped prose line is one long run of single-spaced words, so splitting
    it on runs of 2+ spaces yields a single field. A table row yields several
    short ones. Both tests matter: `len(fields) >= 3` alone would catch a prose
    line that happens to sit beside something, and the length cap keeps a
    sentence fragment from passing as a row.
    """
    fields = re.split(r"\s{2,}", line.strip())
    return len(fields) >= 3 and all(len(f) <= 12 for f in fields)


def assemble_stem(lines):
    """Join wrapped prose with spaces; keep column-aligned rows on their own.

    The app renders stems with `white-space: pre-wrap` (styles.css .qtext), so
    newlines and runs of spaces survive to the reader — the same mechanism that
    already carries the C program in CO2016B-P1-28's stem. Layout rows are
    dedented by their common indent so the grid sits flush.
    """
    groups = []      # ('prose', [str]) | ('rows', [str])
    for ln in lines:
        kind = "rows" if is_layout_row(ln) else "prose"
        if groups and groups[-1][0] == kind:
            groups[-1][1].append(ln)
        else:
            groups.append((kind, [ln]))

    chunks = []
    for kind, ls in groups:
        if kind == "prose":
            chunks.append(re.sub(r"\s+", " ", " ".join(ls)).strip())
        else:
            pad = min((len(l) - len(l.lstrip()) for l in ls if l.strip()),
                      default=0)
            chunks.append("\n".join(l[pad:].rstrip() for l in ls))
    return "\n".join(c for c in chunks if c).strip()


def parse_page(page):
    """Split one page into [{no, q, opts, page}] blocks.

    The paper prints options two to a line where they are short
    ("(a) Diligence      (b) Versatility") and one to a line where they are
    long, and both stems and options wrap. So this walks the page line by line
    rather than regex-matching whole questions: option markers cut the line
    into segments, and any text before the first marker of the question is
    stem. Continuation lines append to whatever was last opened.
    """
    questions, cur = [], None
    for raw in page_text(page).splitlines():
        if not raw.strip() or FURNITURE_RE.match(raw):
            continue

        m = QNO_RE.match(raw)
        if m:
            if cur:
                questions.append(cur)
            cur = {"no": int(m.group(1)), "q": "", "opts": {}, "page": page,
                   "_last": None, "_qlines": []}
            raw = raw[m.end():]
        if cur is None:
            continue        # pre-question furniture (title block, instructions)

        # Only a marker whose letter is the NEXT one this question still needs
        # counts as a marker; anything else is ordinary text. Q21 is why:
        #     21. Mouse is an example of
        #          (a) Input device        (b) Point and Draw device
        #          (c) Both (a) and (b)    (d) None of these
        # Taken naively, the "(a)" and "(b)" printed inside option (c) read as
        # fresh markers, which overwrites (a) with the word "and" and leaves
        # (b) empty. "Both (a) and (b)" is a standard MPSC option, so this is
        # not a one-off. Requiring ascending order also means a marker MPSC
        # failed to print can only ever truncate that one question — and the
        # A-D completeness check below turns that into a loud failure.
        spans = [om for om in OPT_RE.finditer(raw)]
        wanted = "ABCD"
        kept = []
        nxt = cur["_last"]
        nxt = 0 if nxt is None else wanted.index(nxt) + 1
        for om in spans:
            if nxt < len(wanted) and om.group(1).upper() == wanted[nxt]:
                kept.append(om)
                nxt += 1

        # Text before the first real marker belongs to whatever is already
        # open: the stem if no option has started yet, else the previous
        # option's wrapped continuation.
        lead_raw = raw[:kept[0].start()] if kept else raw
        if lead_raw.strip():
            if cur["_last"] is None:
                # Keep the line RAW, indentation and all. Q63 prints an Excel
                # grid in its stem and the meaning is entirely in the column
                # alignment — collapsing whitespace turns it into the
                # unreadable run "A B C D 1 20 4 5 2 10 10 5 3 10 5 8" and
                # makes an answerable question unanswerable. assemble_stem()
                # decides per line what is prose and what is layout.
                cur["_qlines"].append(lead_raw.rstrip())
            else:
                cur["opts"][cur["_last"]] = (
                    cur["opts"][cur["_last"]] + " " + lead_raw.strip()).strip()

        for i, om in enumerate(kept):
            end = kept[i + 1].start() if i + 1 < len(kept) else len(raw)
            letter = om.group(1).upper()
            cur["_last"] = letter
            cur["opts"][letter] = raw[om.end():end].strip()
    if cur:
        questions.append(cur)
    return questions


TITLE_END = "All questions carry equal marks of 2 each."


def word_bag(text):
    """Word multiset, punctuation and case discarded, for content comparison."""
    from collections import Counter
    text = (text.replace("‘", "'").replace("’", "'")
                .replace("“", '"').replace("”", '"')
                .replace("–", "-").replace("—", "-"))
    return Counter(re.findall(r"[a-z0-9]+", text.lower()))


def check_roundtrip(rows):
    """Prove the parse neither dropped nor invented content.

    Every count check above can pass on mangled data: 75 questions each with
    four options is exactly what a parser that quietly truncates long stems
    produces. So this compares the SOURCE's words against the PARSE's words as
    multisets. If any word of the paper failed to land in a question, or any
    word appears in the output that the paper never printed, it shows up here.
    This bank has shipped a silent 280-question loss and a silently garbled
    question before (CLAUDE.md, DEVLOG 2026-08-04); a count is not evidence.
    """
    src = "".join(page_text(p) for p in range(1, PAGES + 1))
    src = src.split(TITLE_END, 1)[1]           # drop the title/instruction block
    src = "\n".join(l for l in src.splitlines() if not FURNITURE_RE.match(l))
    src = QNO_RE.sub(" ", src)                 # question numbers are structure,
    src = re.sub(r"^\s*\d{1,2}\.\s", " ", src, flags=re.M)
    src = OPT_RE.sub(" ", src)                 # as are option markers
    src_bag = word_bag(src)

    got = " ".join(r["q"] + " " + " ".join(r["opts"].values()) for r in rows)
    # "Both (a) and (b)" survives as option text, so its markers are words in
    # the parse but were stripped as structure from the source side above.
    got_bag = word_bag(OPT_RE.sub(" ", got))

    out = []
    lost = src_bag - got_bag
    made = got_bag - src_bag
    if lost:
        out.append(f"words in the PDF that reached no question: "
                   f"{dict(lost.most_common(12))}")
    if made:
        out.append(f"words in the output the PDF never printed: "
                   f"{dict(made.most_common(12))}")
    if not out:
        print(f"round-trip OK — all {sum(src_bag.values())} source words "
              f"accounted for, none invented")
    return out


def main(write=False):
    check_source()

    rows = []
    for p in range(1, PAGES + 1):
        rows.extend(parse_page(p))
    for r in rows:
        r.pop("_last", None)
        r["q"] = assemble_stem(r.pop("_qlines"))
        r["opts"] = {k: re.sub(r"\s+", " ", v).strip() for k, v in r["opts"].items()}
        r["needs_figure"] = bool(FIGURE_HINT_RE.search(r["q"]))

    problems = []
    nos = [r["no"] for r in rows]
    if len(rows) != EXPECT:
        problems.append(f"parsed {len(rows)} questions, the paper prints {EXPECT}")
    if nos != list(range(1, EXPECT + 1)):
        missing = [n for n in range(1, EXPECT + 1) if n not in nos]
        dupes = sorted({n for n in nos if nos.count(n) > 1})
        problems.append(f"numbering not 1..{EXPECT} in order "
                        f"(missing={missing}, duplicated={dupes})")
    for r in rows:
        if not r["q"]:
            problems.append(f"Q{r['no']}: empty stem")
        have = sorted(r["opts"])
        if have != ["A", "B", "C", "D"]:
            problems.append(f"Q{r['no']}: options {have}, expected A-D")
        for k, v in sorted(r["opts"].items()):
            if not v:
                problems.append(f"Q{r['no']}: option ({k.lower()}) is empty")
        if len({v.lower() for v in r["opts"].values()}) != len(r["opts"]):
            problems.append(f"Q{r['no']}: duplicate option text — likely a "
                            f"parse error, since MPSC does not print two "
                            f"identical choices")

    problems.extend(check_roundtrip(rows))

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)

    figs = [r["no"] for r in rows if r["needs_figure"]]
    multi = [r["no"] for r in rows if "\n" in r["q"]]
    print(f"parsed {len(rows)} questions, numbering 1..{EXPECT} complete")
    print(f"stems carrying preserved layout (grids/code): {multi or 'none'}")
    print(f"stem length: min {min(len(r['q']) for r in rows)}, "
          f"max {max(len(r['q']) for r in rows)} chars")
    print(f"figure-dependent (flagged for quarantine): {figs or 'none'}")

    if not write:
        print("\n(dry run — pass --write to save)")
        return
    os.makedirs(EXTRACTED, exist_ok=True)
    out = os.path.join(EXTRACTED, f"{SRC_KEY}.json")
    json.dump(rows, open(out, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"\nwrote {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    main(**vars(ap.parse_args()))
