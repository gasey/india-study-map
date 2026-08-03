#!/usr/bin/env python3
"""
Parse the Jan-2016 / Nov-2019 / Feb-2021 papers out of their PDF text layer.

These PDFs were re-OCR'd by the original pipeline even though 14 of the 15
already carried extractable text -- which is where the corruption came from.
Reading the text layer directly is exact.

Only Jan-2016 GS-III is a genuine scan; it is transcribed by vision instead and
is not handled here.

Anything that will not parse cleanly is reported, never guessed at.
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/hruaia/Downloads/mpsc_pdfs_examination/Old_Questions"

# (paper key, path, expected question count)
PAPERS = [
    ("2016:English-II", "Direct_2014-2018/2.Inspector of Taxes 2016 General English Paper II.pdf", 100),
    ("2016:GS-I",       "Direct_2014-2018/3.Inspector of Taxes 2016 General Studies Paper I.pdf", 100),
    ("2016:GS-II",      "Direct_2014-2018/4.Inspector of Taxes 2016 General Studies Paper II.pdf", 100),
    ("2019:English-II", "Direct_2019-2020/General English Paper-II (Inspector of Excise).pdf", 100),
    ("2019:GS-I",       "Direct_2019-2020/General Studies Paper-I (Inspector of Excise).pdf", 100),
    ("2019:GS-II",      "Direct_2019-2020/General Studies Paper-II (Inspector of Excise).pdf", 100),
    ("2019:GS-III",     "Direct_2019-2020/General Studies Paper-III (Inspector of Excise).pdf", 100),
    ("2021:English-II", "Direct_2020-2021/Inspector of Excise - General English Paper-II.pdf", 100),
    ("2021:GS-I",       "Direct_2020-2021/Inspector of Excise - General Studies Paper-I.pdf", 100),
    ("2021:GS-II",      "Direct_2020-2021/Inspector of Excise - General Studies Paper-II.pdf", 100),
    ("2021:GS-III",     "Direct_2020-2021/Inspector of Excise - General Studies Paper-III.pdf", 100),
]

NOISE = re.compile(
    r"^\s*(-?\s*\d{1,3}\s*-?"                       # bare page numbers, -3-
    r"|MIZORAM PUBLIC SERVICE COMMISSION.*"
    r"|(TECHNICAL|GENERAL)\s+COMPETITIVE\s+EXAMINATION.*"
    r"|.*RECRUITMENT TO THE POST.*"
    r"|INSPECTOR OF (TAXES|EXCISE).*"
    r"|UNDER (TAXATION|EXCISE).*"
    r"|GOVERNMENT OF MIZORAM.*"
    r"|(JANUARY|NOVEMBER|FEBRUARY),?\s*20\d\d.*"
    r"|GENERAL (ENGLISH|STUDIES|KNOWLEDGE)\s*PAPER.*"
    r"|Time Allowed.*|Full Marks.*|F\.?M\.?\s*:.*"
    r"|All questions carry equal mark.*"
    r"|Attempt all questions.*"
    r"|This (Section|Paper) should be answered.*"
    r"|\*+"
    r")\s*$",
    re.IGNORECASE,
)

# Papers print this header four different ways, all of which must be caught --
# an unmatched one gets glued onto the previous question's last option:
#   "Directions (Questions 1 – 10):"
#   "Direction (Questions No. 1 - 10) :"
#   "Directions to Questions No. 87 & 88 :"
#   "Directions (Question 100):"          <- a single question, no range
DIRECTION = re.compile(
    r"^\s*Directions?\s*(?:to\s*)?\(?\s*Questions?\s*(?:No[s]?\.?)?\s*"
    r"(\d{1,3})\s*(?:(?:-|–|—|to|&)\s*(\d{1,3}))?\s*\)?\s*:\s*(.*)$",
    re.IGNORECASE,
)

OPT = re.compile(r"\((a|b|c|d)\)\s*")


def pdf_text(path):
    return subprocess.run(["pdftotext", "-layout", path, "-"],
                          capture_output=True, text=True, check=True).stdout


def clean_lines(text):
    return [ln.rstrip() for ln in text.splitlines()
            if ln.strip() and not NOISE.match(ln)]


def split_questions(lines, expected, key):
    blocks, cur, want = [], None, 1
    directions, collecting = [], None

    for ln in lines:
        d = DIRECTION.match(ln)
        if d:
            lo = int(d.group(1))
            hi = int(d.group(2)) if d.group(2) else lo   # single-question form
            collecting = [lo, hi, d.group(3).strip()]
            directions.append(collecting)
            if cur is not None:          # flush, never discard
                blocks.append(cur)
                cur = None
            continue

        # The trailing text is optional: figure questions (2019 GS-III Q89-92)
        # print the number alone on its own line with the diagrams below it, so
        # requiring content after the number silently swallows them into the
        # previous question.
        m = re.match(r"^\s*(\d{1,3})\.?\s*(.*)$", ln)
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
        print(f"    !! {key}: {len(blocks)} blocks, expected {expected}", file=sys.stderr)

    for b in blocks:
        for lo, hi, text in directions:
            if lo <= b["n"] <= hi:
                b["direction"] = re.sub(r"\s+", " ", text).strip()
    return blocks


def parse_block(b):
    body = "\n".join(b["lines"])
    norm = lambda s: re.sub(r"\s+", " ", s).strip()
    flat = norm(body)

    # Prefer a strictly ascending a,b,c,d run, so a stray "(c)" inside a stem
    # cannot be mistaken for the start of the options.
    all_hits = list(OPT.finditer(body))
    seq, want = [], "a"
    for h in all_hits:
        if h.group(1) == want:
            seq.append(h)
            want = {"a": "b", "b": "c", "c": "d", "d": None}[want]
            if want is None:
                break

    # Papers contain mislabelled options -- 2019 GS-III Q10 prints
    # "(a) (b) (b) (d)". The strict run stops dead at the repeat and loses the
    # question. When the strict scan came up short but the block holds exactly
    # four markers, fall back to their printed ORDER and ignore the letters:
    # position is what the answer key refers to, and position is still intact.
    used_positional = False
    if len(seq) < 4 and len(all_hits) == 4:
        seq, used_positional = all_hits, True

    # Some questions genuinely have three options, not four -- 2021 English-II
    # Q41-46 offer only Simple / Complex / Compound sentence. Accept a strict
    # a,b,c run rather than discarding a valid question.
    if len(seq) < 3 and len(all_hits) == 3 and [h.group(1) for h in all_hits] == ["a", "b", "c"]:
        seq = all_hits

    stem, opts = flat, []
    if len(seq) >= 3:
        stem = norm(body[: seq[0].start()])
        for k, h in enumerate(seq):
            end = seq[k + 1].start() if k + 1 < len(seq) else len(body)
            opts.append(norm(body[h.end(): end]))

    figure_ctx = re.search(r"figure|picture sequence|diagram",
                           flat + " " + b.get("direction", ""), re.I)
    # A figure question whose options are the bare numerals 1-4 pointing at four
    # pictures ("(a) 1  (b) 2  (c) 3  (d) 4") parses "successfully" but the
    # numerals mean nothing without the images. Treat it as figure-based, the
    # same as one with no parseable options at all.
    numeral_only = bool(opts) and all(re.fullmatch(r"[1-4]", o) for o in opts)

    degenerate = len(opts) < 3 or any(not re.search(r"[0-9A-Za-z]", o) for o in opts)
    if figure_ctx and (degenerate or numeral_only or not stem.strip()):
        r = {"n": b["n"], "figureBased": True,
             "stem": stem.strip() or b.get("direction", "").strip() or flat,
             "options": []}
        if b.get("direction"):
            r["direction"] = b["direction"]
        return r
    if degenerate:
        return {"n": b["n"], "error": f"{len(all_hits)} option markers, {len(opts)} usable",
                "raw": body}

    out = {"n": b["n"], "stem": stem, "options": opts}

    # Some papers really do print the same option twice -- 2016 English-II Q15
    # offers "has worked" as both (a) and (b); 2019 GS-III Q34 offers
    # "Phosphorus" as both (a) and (d). Verified against the source PDFs. The
    # extraction is faithful, so the duplicate is preserved, but the question is
    # marked defective: it cannot be answered as printed and should not count
    # against anyone in a scored run.
    norm_opts = [re.sub(r"[^a-z0-9]", "", o.lower()) for o in opts]
    dupes = {o for o in norm_opts if o and norm_opts.count(o) > 1}
    if dupes:
        out["sourceDefect"] = "duplicate-options"

    if b.get("direction"):
        out["direction"] = b["direction"]
    if used_positional:
        # Recorded so the consistency pass can re-check these by hand: the
        # letters in the source disagreed with the printed order.
        out["optionLettersMislabelled"] = True
    return out


def main():
    result, totals = {}, [0, 0, 0]
    for key, rel, expected in PAPERS:
        blocks = split_questions(clean_lines(pdf_text(f"{ROOT}/{rel}")), expected, key)
        parsed = [parse_block(b) for b in blocks]
        bad = [p for p in parsed if "error" in p]
        fig = [p for p in parsed if p.get("figureBased")]
        totals[0] += len(parsed); totals[1] += len(bad); totals[2] += len(fig)
        print(f"{key:16} {len(parsed):4} parsed, {len(bad):3} unparsed, {len(fig):2} figure-based")
        for p in bad[:6]:
            print(f"     Q{p['n']}: {p['error']}")
        result[key] = parsed

    out = os.path.join(HERE, "parsed-native.json")
    json.dump(result, open(out, "w"), indent=1, ensure_ascii=False)
    print(f"\ntotal {totals[0]} parsed, {totals[1]} unparsed, {totals[2]} figure-based")
    print("wrote", out)


if __name__ == "__main__":
    main()
