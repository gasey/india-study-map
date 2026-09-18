"""Extract MCQs + the highlighted ('marked') option from an MPSC question booklet.

Run:  python3 tools/practice-hub-build/extract.py <pdf> <blue|pink> <out.json>

Two signals have to be combined, because neither alone is enough:

* **Structure** (question numbers, stems, options, parts) comes from the text
  layer via pdfminer, which gives per-character coordinates. `pdftotext -layout`
  is not usable here: these booklets set options in two columns, and the layout
  reconstruction interleaves them in ways that are ambiguous to re-split.

* **The marked answer** comes from a *render*. The highlight is a filled
  rectangle in the content stream which pdfminer does not surface as geometry --
  it reports every path as black -- and `pdftotext` cannot see it at all. So the
  page is rasterised and the highlight colour is looked for directly.

The marked answer is read by asking, for each option marker `(a)`..`(d)`, what
fraction of its pixels carry the highlight colour. The obvious alternative --
cluster highlight pixels into boxes, then read whatever text sits underneath --
was tried first and is genuinely worse: padding loose enough to rejoin an
antialiased fragment also merges two vertically adjacent options, so it
miscounts in both directions at once and does so silently. Anchoring on the text
removes the clustering step entirely, and the coverage fraction doubles as a
confidence signal.

Coverage is sharply bimodal (see DEVLOG), so the threshold is derived from the
data -- the largest gap in the sorted coverage list -- rather than hardcoded.
Anything landing near that boundary is reported as ambiguous instead of being
rounded to a verdict.

IMPORTANT: a marked option is NOT an answer key. MPSC published no key for these
sittings; the highlights are someone's marked answers and they contain outright
errors. This script only records what the booklet shows. Solving is a separate,
human/agent-verified step -- see README.md.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import warnings
from collections import defaultdict

from PIL import Image
from pdfminer.high_level import extract_pages
from pdfminer.layout import LAParams, LTChar, LTCurve, LTRect

warnings.filterwarnings("ignore")

DPI = 150
SCALE = DPI / 72.0
PALETTE = {
    "blue": (143, 222, 249),   # .560784 .870588 .976471 rg
    "pink": (255, 204, 230),   # 1 0.8 0.9 rg
}
COLOUR_TOL = 30
# a coverage this far from the derived threshold is treated as certain; nearer
# than this and the item is reported for a human to look at.
AMBIGUOUS_BAND = 0.10

SECTION_RE = re.compile(
    r"^\s*(?:(PART|SECTION|GROUP)\s*[-–—]?\s*([AB])\b)", re.I)
QNUM_RE = re.compile(r"^(\d{1,3})\.\s*")
DIRECTION_RE = re.compile(r"^\s*Direction", re.I)
# A Direction states the questions it governs ('Question Nos. 4 - 8'). Without
# reading that range the instruction stays attached to every later question, so
# RI Paper II Q89 displayed the two-statements rubric belonging to Q75.
DIR_RANGE_RE = re.compile(r"Question\s*Nos?\.?\s*(\d+)\s*(?:[-–—]\s*(\d+))?", re.I)
# Not every conventional section says so in its heading -- LESO Paper I prints a
# bare 'PART- A (34 Marks)'. All three papers do carry this instruction, though,
# and it only ever appears over a written-answer section.
ANSWER_SHEET_RE = re.compile(r"answered only on the Answer Sheet", re.I)
# running footer: '- 3 -'. Left in place it gets appended to whatever option was
# open when the page broke, which is how '12' became '12 - 4 -'.
FOOTER_RE = re.compile(r"^\s*[-–]\s*\d{1,3}\s*[-–]\s*$")
# end-of-paper decoration '* * * * * * *'. Like the footer, it lands on the
# option that happened to be open and ships as part of the answer text.
ENDMARK_RE = re.compile(r"^[\s*]+$")

# These booklets set maths in a Symbol font whose glyphs land in the private use
# area, so the text layer carries U+F0xx where the page shows an operator. The
# low byte is the Adobe Symbol code point.
PUA = {
    0xF028: "(", 0xF029: ")", 0xF02B: "+", 0xF02D: "−", 0xF03C: "<",
    0xF03D: "=", 0xF03E: ">", 0xF06F: "°", 0xF071: "θ",
    0xF0A3: "≤", 0xF0B3: "≥", 0xF0B4: "×", 0xF0B8: "÷",
    0xF0D0: "∠", 0xF0D6: "√", 0xF0D7: "⋅", 0xF070: "π",
}
SUP = {"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
       "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
       "n": "ⁿ", "+": "⁺", "-": "⁻", "(": "⁽", ")": "⁾"}
SUB = {"0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
       "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
       "n": "ₙ", "a": "ₐ", "e": "ₑ", "i": "ᵢ", "x": "ₓ"}


def demap(ch):
    """Symbol-font private-use code point -> the character actually printed."""
    o = ord(ch)
    return PUA.get(o, ch if o < 0xE000 or o > 0xF8FF else "")


# ---------------------------------------------------------------- text layer

class GlyphPath:
    """A character the PDF draws as vector art instead of text.

    The rupee sign is stroked as a path in these booklets, so it is absent from
    the text layer entirely -- '₹800 per month' extracts as '800 per month'.
    Wrapping the path in a char-shaped object lets it flow through line building
    and rendering like any other character.
    """

    def __init__(self, ch, bbox, size):
        self.ch, self.size = ch, size
        self.x0, self.y0, self.x1, self.y1 = bbox
        self._ul = False

    def get_text(self):
        return self.ch


def page_chars(pdf):
    """Per page: every LTChar (plus vector glyphs), in pdf-space coordinates."""
    for page in extract_pages(pdf, laparams=LAParams()):
        chars, curves, rects = [], [], []

        def walk(obj):
            for e in obj:
                if isinstance(e, LTChar):
                    chars.append(e)
                elif isinstance(e, LTRect):
                    rects.append(e)
                    if getattr(e, "fill", False):
                        curves.append(e)
                elif isinstance(e, LTCurve) and getattr(e, "fill", False):
                    curves.append(e)
                if hasattr(e, "__iter__"):
                    walk(e)

        walk(page)
        # Underlines are thin filled rectangles sitting on the baseline. For a
        # parts-of-speech or "identify the underlined phrase" item the underline
        # IS the question -- 'Sawmi goes to school every day' underlines only
        # 'every', and Q51 reads "Identify the underlined phrase" with nothing
        # underlined at all once the rule is dropped. README.md's schema marks
        # these with **word**, so carry them through.
        rules = [r for r in rects
                 if (r.y1 - r.y0) < 2.5 and (r.x1 - r.x0) > 5]
        for c in chars:
            c._ul = any(c.x1 > r.x0 + 0.5 and c.x0 < r.x1 - 0.5
                        and abs(c.y0 - r.y1) < 4 for r in rules)
        for c in curves:
            w, h = c.x1 - c.x0, c.y1 - c.y0
            if not (4 < w < 9 and 7 < h < 11):      # rupee-sign sized
                continue
            # Snap to the baseline of the text it sits in. The path's box rides a
            # couple of points above the glyphs around it, which is enough to
            # make line grouping treat it as its own row -- and a stray row after
            # the options is then swallowed as a continuation, giving '32,000 ₹₹'.
            near = [t for t in chars
                    if abs(t.y0 - c.y0) < 6 and -2 < t.x0 - c.x1 < 40]
            y0 = min(near, key=lambda t: abs(t.y0 - c.y0)).y0 if near else c.y0
            chars.append(GlyphPath("₹", (c.x0, y0, c.x1, y0 + (c.y1 - c.y0)), 12.0))
        yield chars


def render_chars(cs, emphasis=True):
    """Characters -> text, mapping Symbol glyphs and raising super/subscripts.

    A superscript is a smaller glyph sitting above the line's baseline. Grouped
    naively it becomes its own line and is then either dropped or attached to the
    wrong option -- which is how 'x² − kx − 3 = 0' extracted as 'x−kx−3=0', a
    question that silently became unsolvable.
    """
    if not cs:
        return ""
    body = [c for c in cs if c.get_text().strip()]
    if not body:
        return ""
    base = sorted(c.size for c in body)[len(body) // 2]
    ybase = sorted(c.y0 for c in body)[len(body) // 2]

    # Classify first, then emit in runs. Per-character emission turns the
    # ordinal in '38th Parallel' into '38^t^h', because each raised letter is
    # mapped on its own with no idea it has a neighbour.
    tagged = []
    for c in cs:
        ch = demap(c.get_text())
        if not ch:
            continue
        small = c.size < base * 0.85
        if not ch.strip() or ch in "°′″":
            kind = "n"      # '°' is already raised; marking it up gives '28^°'
        elif small and c.y0 > ybase + base * 0.18:
            kind = "s"
        elif small and c.y0 < ybase - base * 0.12:
            kind = "b"
        else:
            kind = "n"
        tagged.append((kind, ch, bool(getattr(c, "_ul", False))))

    # Emit per character but carry the underline state across, so an underlined
    # span opens '**' once and closes it once. Trailing spaces are pushed outside
    # the markers ('**every **day' would not render).
    out = []
    i = 0
    ul_open = False
    while i < len(tagged):
        kind, ch, ul = tagged[i]
        if emphasis and ul and not ul_open and ch.strip():
            out.append("**")
            ul_open = True
        elif emphasis and ul_open and not ul:
            # Close before any trailing space, not after: '**righteous **always'
            # does not render as emphasis, '**righteous** always' does.
            held = []
            while out and out[-1].isspace():
                held.append(out.pop())
            out.append("**")
            out.extend(reversed(held))
            ul_open = False

        if kind == "n":
            out.append(ch)
            i += 1
            continue
        j = i
        while j < len(tagged) and tagged[j][0] == kind:
            j += 1
        run = "".join(t[1] for t in tagged[i:j])
        table = SUP if kind == "s" else SUB
        if kind == "s" and run.lower() in ("st", "nd", "rd", "th", "s"):
            out.append(run)          # ordinal suffix: '38th' beats '38ᵗʰ'
        else:
            out.append("".join(table.get(x, ("^" if kind == "s" else "_") + x)
                               for x in run))
        i = j
    if ul_open:
        out.append("**")
    return "".join(out).rstrip()


def build_lines(chars, ytol=2.5):
    """Group chars into visual lines, preserving x positions.

    Lines are keyed on the baseline rather than on pdfminer's own text-box
    grouping, because the two option columns are frequently split into separate
    boxes and we need them back on one row to tell (a)/(b) apart from (c)/(d).

    Super/subscripts are then folded back into the line they belong to: they sit
    off the baseline by more than any sane ytol, so they arrive here as their own
    short line and have to be re-attached by vertical overlap, not by baseline.
    """
    rows = defaultdict(list)
    for c in chars:
        key = None
        for k in rows:
            if abs(k - c.y0) <= ytol:
                key = k
                break
        rows[key if key is not None else c.y0].append(c)

    lines = []
    for y, cs in rows.items():
        body = [c for c in cs if c.get_text().strip()]
        lines.append({
            "y": y,
            "chars": cs,
            "size": (sorted(c.size for c in body)[len(body) // 2] if body else 12.0),
            "x0": min(c.x0 for c in cs),
            "x1": max(c.x1 for c in cs),
        })
    lines.sort(key=lambda l: -l["y"])

    # fold each small off-baseline fragment into the nearest full-size line whose
    # x-range it sits inside
    merged, floats = [], []
    for l in lines:
        body = [c for c in l["chars"] if c.get_text().strip()]
        if body and all(c.size < 9.5 for c in body) and len(body) <= 4:
            floats.append(l)
        else:
            merged.append(l)
    for f in floats:
        host = None
        best = 1e9
        for l in merged:
            if l["x0"] - 6 <= f["x0"] <= l["x1"] + 6:
                d = abs(f["y"] - l["y"])
                if d < best and d < l["size"] * 1.1:
                    best, host = d, l
        if host is not None:
            host["chars"].extend(f["chars"])
        else:
            merged.append(f)

    for l in merged:
        l["chars"].sort(key=lambda c: c.x0)
        l["text"] = render_chars(l["chars"])
        # Headings are underlined too, so the emphasised text reads
        # '**SECTION** **- A** ...' and no longer matches SECTION_RE. All
        # structural matching therefore runs on the un-emphasised form.
        l["plain"] = render_chars(l["chars"], emphasis=False)
        l["x0"] = min(c.x0 for c in l["chars"])
    merged.sort(key=lambda l: -l["y"])
    return [l for l in merged
            if not FOOTER_RE.match(l["plain"]) and not ENDMARK_RE.match(l["plain"])]


def find_option_markers(line):
    """Every '(a)'..'(d)' in a line, as (letter, bbox, start_idx, end_idx)."""
    cs = line["chars"]
    out = []
    for i in range(len(cs) - 2):
        a, b, d = cs[i], cs[i + 1], cs[i + 2]
        if a.get_text() == "(" and d.get_text() == ")" and b.get_text() in "abcd":
            out.append({
                "letter": b.get_text(),
                "bbox": (a.x0, min(a.y0, b.y0, d.y0), d.x1, max(a.y1, b.y1, d.y1)),
                "i0": i,
                "i1": i + 2,
            })
    return out


# ------------------------------------------------------------------ highlight

def coverage(px, W, H, bbox, target):
    x0 = max(0, int(bbox[0] * SCALE))
    x1 = min(W - 1, int(bbox[2] * SCALE))
    y0 = max(0, int(H - bbox[3] * SCALE))
    y1 = min(H - 1, int(H - bbox[1] * SCALE))
    tot = hit = 0
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            tot += 1
            c = px[x, y]
            if all(abs(p - q) <= COLOUR_TOL for p, q in zip(c, target)):
                hit += 1
    return (hit / tot) if tot else 0.0


def derive_threshold(questions):
    """Pick the coverage cut that leaves exactly one marked option per question.

    Splitting the distribution at its widest gap looks reasonable and is subtly
    wrong: highlights vary in how tightly they are drawn, so the spread *within*
    the marked population can exceed the gap separating it from the unmarked one.
    On SI Statistics Paper II the widest gap fell at 0.436->0.204 (0.232) rather
    than at 0.204->0.0 (0.204), which discarded a real, faintly-boxed mark on Q28
    and reported the question as unmarked.

    Every MCQ carries exactly one highlight, so score each candidate cut by how
    many questions it leaves with exactly one -- optimising the structure we
    actually expect instead of a property of the histogram.
    """
    vals = sorted({c for q in questions for c in q["cov"].values()})
    if len(vals) < 2:
        return 0.5
    best = None
    for i in range(len(vals) - 1):
        t = (vals[i] + vals[i + 1]) / 2
        ones = sum(1 for q in questions
                   if sum(1 for c in q["cov"].values() if c >= t) == 1)
        if best is None or ones > best[0]:
            best = (ones, t)
    return best[1]


# -------------------------------------------------------------------- parsing

def extract(pdf, colour):
    target = PALETTE[colour]
    tmp = tempfile.mkdtemp()
    subprocess.run(["pdftoppm", "-r", str(DPI), "-png", pdf,
                    os.path.join(tmp, "p")], check=True)
    pngs = sorted(os.listdir(tmp))

    pages = []
    for pno, chars in enumerate(page_chars(pdf)):
        pages.append({"n": pno + 1, "lines": build_lines(chars)})

    # --- pass 1: locate every option marker and measure its highlight coverage
    markers = []
    for p in pages:
        im = Image.open(os.path.join(tmp, pngs[p["n"] - 1])).convert("RGB")
        W, H = im.size
        px = im.load()
        for li, line in enumerate(p["lines"]):
            for m in find_option_markers(line):
                m.update({"page": p["n"], "line": li,
                          "cov": coverage(px, W, H, m["bbox"], target)})
                markers.append(m)

    by_line = defaultdict(list)
    for m in markers:
        by_line[(m["page"], m["line"])].append(m)

    # --- pass 2: walk the document, splitting into sections and questions
    questions = []
    conventional_qs = []
    passage_buf = []
    cur = None
    part = None
    conventional = False
    direction = None
    dir_range = None
    notes = []
    # A bare '^\d+\.' is not a question start: these papers print numbered
    # statement lists inside questions ('Consider the following: 1. ... 2. ...'),
    # and matching those shredded RI Paper II into questions numbered 1..200 with
    # a fresh 'Q1' on every page. So the splitter anchors on the number it is
    # actually expecting next -- the same fix the MES 2023 P3 extraction needed.
    expect = 1
    allow_restart = True

    def close():
        nonlocal cur
        if cur and cur.get("conventional"):
            # Kept, not discarded: essays, precis passages, letters and
            # comprehension items are real study material (34-50 marks a paper).
            # Emitting the text here means it is transcribed by the same tested
            # code path as the MCQs rather than retyped by hand.
            conventional_qs.append({
                "n": cur["n"], "part": cur["part"], "page": cur["page"],
                "text": " ".join(s.strip() for s in cur["stem"] if s.strip()),
                "subparts": cur["opts"],
            })
            notes.append(
                f"Q{cur['n']} (p{cur['page']}, part {cur['part']}): conventional "
                f"section, {len(cur['opts'])} sub-part(s) - not an MCQ")
        elif cur and len(cur["opts"]) == 4:
            questions.append(cur)
        elif cur:
            notes.append(
                f"Q{cur['n']} (p{cur['page']}, part {cur['part']}): only "
                f"{len(cur['opts'])} option(s) {sorted(cur['opts'])} - not emitted")
        cur = None

    for p in pages:
        for li, line in enumerate(p["lines"]):
            text = line["text"].strip()
            plain = line["plain"].strip()
            if not plain:
                continue

            sec = SECTION_RE.match(plain)
            if sec:
                close()
                part = sec.group(2).upper()
                # Conventional sections number their written sub-parts (a), (b),
                # (c)... exactly like MCQ options. Inferring type from shape
                # therefore turns a comprehension question into a bogus 4-option
                # MCQ -- the corruption this repo has already shipped once. The
                # booklet states the type in the header, so read it.
                conventional = "conventional" in plain.lower()
                direction = None
                dir_range = None
                allow_restart = True      # Part B may renumber from 1
                continue

            if ANSWER_SHEET_RE.search(plain):
                conventional = True
                continue

            opts_here = by_line[(p["n"], li)]
            qm = QNUM_RE.match(plain)

            # A question number at the left margin starts a new question, but
            # only if it is the number we are expecting (see `expect` above).
            starts = False
            if qm and line["x0"] < 120 and not plain.startswith("("):
                n = int(qm.group(1))
                if n == expect:
                    starts, expect = True, n + 1
                elif allow_restart and n == 1:
                    starts, expect, allow_restart = True, 2, False
                elif expect < n <= expect + 3 and cur and len(cur["opts"]) == 4:
                    # tolerate a question the parser failed to open, but say so
                    notes.append(f"numbering jumped {expect} -> {n} (p{p['n']}); "
                                 f"{n - expect} question(s) missed")
                    starts, expect = True, n + 1

            if starts:
                close()
                # A Direction only governs the range it names; past that it is a
                # different question's instruction and must not be shown.
                if dir_range and not (dir_range[0] <= n <= dir_range[1]):
                    direction, dir_range = None, None
                if passage_buf:
                    conventional_qs.append({
                        "n": None, "part": part, "page": p["n"],
                        "kind": "passage", "direction": direction,
                        "text": " ".join(passage_buf), "subparts": {},
                    })
                    passage_buf = []
                allow_restart = False
                cur = {
                    "n": int(qm.group(1)),
                    "page": p["n"],
                    "part": part,
                    "conventional": conventional,
                    "direction": direction,
                    "stem": [QNUM_RE.sub("", text)],
                    "opts": {},
                    "marked": None,
                    "cov": {},
                    "ambiguous": [],
                }
                if not opts_here:
                    continue

            if DIRECTION_RE.match(plain) and not opts_here:
                close()
                direction = text
                m = DIR_RANGE_RE.search(plain)
                dir_range = ((int(m.group(1)), int(m.group(2) or m.group(1)))
                             if m else None)
                continue

            if cur is None:
                # A conventional comprehension passage is introduced by a
                # Direction line and then simply runs as prose until the first
                # question. It belongs to no numbered item, so without this it is
                # dropped -- leaving RI Paper I Q4-Q8 asking about "the passage"
                # with no passage anywhere.
                if conventional and direction:
                    passage_buf.append(text)
                continue

            if opts_here:
                # Keep only markers continuing the a->b->c->d sequence. An option
                # may quote another one -- 'Both (a) and (b) are correct' -- and
                # those in-text references are shaped exactly like option
                # markers. Taken as real they overwrite the true (a)/(b) coverage
                # with the 0.0 measured at the quote, which is how SI Statistics
                # Q89 lost a highlight that is plainly on the page.
                real = []
                nxt = len(cur["opts"])
                for m in opts_here:
                    if nxt < 4 and m["letter"] == "abcd"[nxt]:
                        real.append(m)
                        nxt += 1
                cs = line["chars"]
                for k, m in enumerate(real):
                    end = real[k + 1]["i0"] if k + 1 < len(real) else len(cs)
                    val = render_chars(cs[m["i1"] + 1:end]).strip()
                    cur["opts"][m["letter"]] = val
                    cur["cov"][m["letter"]] = round(m["cov"], 3)
                if not real:
                    # every marker on this line was an in-text reference, so the
                    # line is a continuation of the option already open
                    last = sorted(cur["opts"])[-1] if cur["opts"] else None
                    if last:
                        cur["opts"][last] += " " + text
            elif not cur["opts"]:
                cur["stem"].append(text)
            elif line["x0"] > 100:
                # A wrapped continuation of the last option. The x0 guard matters:
                # without it any stray glyph run between questions (stranded
                # degree signs, a floating exponent) is swallowed by whichever
                # option happened to be open.
                last = sorted(cur["opts"])[-1]
                cur["opts"][last] += " " + text
    close()
    if passage_buf:
        conventional_qs.append({
            "n": None, "part": part, "page": pages[-1]["n"], "kind": "passage",
            "direction": direction, "text": " ".join(passage_buf), "subparts": {},
        })

    for q in questions:
        q["q"] = " ".join(s.strip() for s in q["stem"] if s.strip())
        del q["stem"]

    # Derived only now: it needs the per-question option groups, not a flat list
    # of marker coverages (see derive_threshold).
    thr = derive_threshold(questions)
    for q in questions:
        q["ambiguous"] = [l for l, c in q["cov"].items()
                          if abs(c - thr) < AMBIGUOUS_BAND]
        # Resolve the mark from coverage rather than from whichever option
        # happened to be seen last. Some highlights are drawn by hand and their
        # tail bleeds onto the marker below (RI Paper I Q40: 0.585 on (b),
        # 0.235 of spill on (c)). A clear winner is the mark; a near-tie is two
        # genuinely highlighted options and must be reported, not resolved.
        hits = sorted(((c, l) for l, c in q["cov"].items() if c >= thr),
                      reverse=True)
        q["multi"] = False
        if not hits:
            q["marked"] = None
        elif len(hits) == 1 or hits[0][0] >= hits[1][0] * 1.6:
            q["marked"] = hits[0][1]
            if len(hits) > 1:
                q["bleed"] = [l for _, l in hits[1:]]
        else:
            q["marked"] = None
            q["multi"] = True

    return questions, thr, notes, markers, conventional_qs


def main():
    pdf, colour, out = sys.argv[1], sys.argv[2], sys.argv[3]
    questions, thr, notes, markers, conventional_qs = extract(pdf, colour)

    dbl = [q for q in questions if q["multi"]]
    bleed = [q for q in questions if q.get("bleed")]
    none = [q for q in questions if q["marked"] is None and not q["multi"]]
    amb = [q for q in questions if q["ambiguous"]]
    # A stacked fraction has no reading order to recover: numerator and
    # denominator are separate runs joined by a rule the text layer never
    # mentions. These come out as blank or scrambled options and MUST be read off
    # a render instead of trusted -- so name them loudly rather than emit them.
    broken = [q for q in questions
              if any(not v.strip() for v in q["opts"].values())
              or any(re.search(r"\d\s+\d", v) for v in q["opts"].values())]

    print(f"{os.path.basename(pdf)}")
    print(f"  {len(markers)} option markers, threshold {thr:.2f}")
    print(f"  {len(questions)} questions with a full set of 4 options")
    parts = defaultdict(list)
    for q in questions:
        parts[q["part"]].append(q["n"])
    for part, ns in parts.items():
        gaps = [n for n in range(min(ns), max(ns) + 1) if n not in ns]
        print(f"  part {part}: {len(ns)} questions, n={min(ns)}..{max(ns)}"
              + (f"  GAPS {gaps}" if gaps else ""))
    for n in notes:
        print(f"  NOTE {n}")
    for q in none:
        print(f"  UNMARKED part {q['part']} Q{q['n']} (p{q['page']}): {q['q'][:60]!r}")
    for q in dbl:
        print(f"  MULTI-MARKED part {q['part']} Q{q['n']} (p{q['page']}): {q['cov']}")
    for q in bleed:
        print(f"  bleed part {q['part']} Q{q['n']} (p{q['page']}): marked "
              f"({q['marked']}), spill onto {q['bleed']} -- {q['cov']}")
    for q in amb:
        print(f"  AMBIGUOUS part {q['part']} Q{q['n']} (p{q['page']}): {q['cov']}")
    for q in broken:
        print(f"  LAYOUT part {q['part']} Q{q['n']} (p{q['page']}): needs a render"
              f" -- {q['opts']}")

    json.dump(questions, open(out, "w"), indent=1, ensure_ascii=False)
    if conventional_qs:
        cpath = out.replace(".json", ".conventional.json")
        json.dump(conventional_qs, open(cpath, "w"), indent=1, ensure_ascii=False)
        print(f"  {len(conventional_qs)} conventional item(s) -> {cpath}")
    print(f"  -> {out}")


if __name__ == "__main__":
    main()
