#!/usr/bin/env python3
"""Read a scanned MPSC answer-key table by GEOMETRY, not by trusting OCR digits.

Why: psm6 reads this bordered table as a field of pipe characters - 63 tokens
for 200 cells. And OCR misreads the question numbers themselves (the Oct-2025
session recorded 7 as 'z', 12 as 'i2', 72 as 'i'). So:

  * find the table's horizontal borders by row darkness, giving 25 cell bands;
  * find the 4 column blocks by column darkness;
  * OCR each ANSWER cell on its own, whitelisted to ABCD, with psm 10
    (single character);
  * the question number comes from the cell's POSITION - column block index
    times 25 plus row index - so a misread digit cannot shift anything.

Output is compared against an independent by-eye transcription; they must agree.
"""
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image


def dark_profile(im, axis):
    px = im.convert("L").load()
    w, h = im.size
    if axis == "y":
        return [sum(1 for x in range(w) if px[x, y] < 128) for y in range(h)]
    return [sum(1 for y in range(h) if px[x, y] < 128) for x in range(w)]


def bands(profile, min_frac, span):
    """Indices where the profile is dark enough to be a table rule."""
    thresh = min_frac * span
    runs, cur = [], None
    for i, v in enumerate(profile):
        if v >= thresh:
            cur = (cur[0], i) if cur else (i, i)
        elif cur:
            runs.append(cur)
            cur = None
    if cur:
        runs.append(cur)
    return [(a + b) // 2 for a, b in runs]


def read_cell(im, box, tag):
    im.crop(box).resize(((box[2] - box[0]) * 3, (box[3] - box[1]) * 3)).save(f"/tmp/_c_{tag}.png")
    out = subprocess.run(
        ["tesseract", f"/tmp/_c_{tag}.png", "-", "--psm", "7",
         "-c", "tessedit_char_whitelist=ABCD()"],
        capture_output=True, text=True).stdout
    m = re.search(r"[ABCD]", out)
    return m.group(0) if m else None


def find_answer_columns(im):
    """Locate the 4 blocks' ANSWER columns from the table's vertical rules.

    Hardcoding these x-ranges silently lost blocks 3 and 4 (41 cells came back
    empty) because the guessed right edge overshot into the next block. Detect
    them: each block contributes three rules - left edge, the divider between
    Q.No and Ans, and the right edge - so the answer column is rule[i+1]..[i+2].
    """
    W, H = im.size
    tab = im.crop((0, int(H * 0.30), W, int(H * 0.845)))
    rules = bands(dark_profile(tab, "x"), 0.55, tab.size[1])
    if len(rules) % 3 or len(rules) < 12:
        sys.exit(f"expected 12 vertical rules (4 blocks x 3), found {len(rules)}: {rules}")
    cols = [(rules[i + 1], rules[i + 2]) for i in range(0, len(rules) - 2, 3)]
    print(f"vertical rules {rules} -> answer columns {cols}")
    return cols


def main(png, x_blocks=None):
    im = Image.open(png)
    W, H = im.size
    x_blocks = x_blocks or find_answer_columns(im)
    # rows: use the leftmost block's full width to find horizontal rules
    x0, x1 = x_blocks[0]
    strip = im.crop((x0, int(H * 0.28), x1, int(H * 0.88)))
    ys = bands(dark_profile(strip, "y"), 0.55, strip.size[0])
    ys = [y + int(H * 0.28) for y in ys]
    # keep only the 26 rules bounding the 25 data rows (drop the header rule)
    gaps = [(ys[i + 1] - ys[i]) for i in range(len(ys) - 1)]
    med = sorted(gaps)[len(gaps) // 2]
    keep = [ys[0]] + [ys[i + 1] for i in range(len(ys) - 1) if abs(gaps[i] - med) < med * 0.4]
    if len(keep) < 26:
        sys.exit(f"found only {len(keep)} horizontal rules (need 26); ys={ys}")
    keep = keep[-26:]
    print(f"row rules: {len(keep)}, spacing ~{med}px")

    key = {}
    for bi, (bx0, bx1) in enumerate(x_blocks):
        for ri in range(25):
            top, bot = keep[ri], keep[ri + 1]
            # inset off the rules on BOTH axes: leaving the black border bars
            # in the crop made psm10 see extra glyphs and mis-read two cells.
            pady = int((bot - top) * 0.20)
            padx = int((bx1 - bx0) * 0.12)
            letter = read_cell(im, (bx0 + padx, top + pady, bx1 - padx, bot - pady),
                               f"{bi}_{ri}")
            key[bi * 25 + ri + 1] = letter
    missing = [n for n, v in key.items() if not v]
    print(f"read {100 - len(missing)}/100 cells" + (f", MISSING {missing}" if missing else ""))
    return key


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit("usage: read_scanned_key_table.py <key-page.png> <eye-read.json> "
                 "<machine-out.json>\n\n"
                 "  key-page.png  a 300dpi render of the key's subject page "
                 "(pdftoppm -r 300 -png key.pdf out)\n"
                 "  eye-read.json {\"1\":\"B\",...} transcribed independently BY EYE - "
                 "this tool exists to check that read, not to replace it\n"
                 "  machine-out.json  where the geometry read is written\n\n"
                 "Exits non-zero if the two reads disagree anywhere. Disagreements are "
                 "NOT to be resolved by preferring either side: crop the individual "
                 "cells and enlarge them. On the July-2024 key all five conflicts were "
                 "OCR misreading B as D, and the eye read was right every time.")
    machine = main(sys.argv[1])
    import json
    eye = json.load(open(sys.argv[2]))
    dis = {n: (eye.get(str(n)), machine.get(n))
           for n in range(1, 101) if eye.get(str(n)) != machine.get(n)}
    print("\nEYE vs MACHINE:", "NONE — 100/100 agree" if not dis else dis)
    json.dump({str(n): machine[n] for n in sorted(machine)},
              open(sys.argv[3], "w"), indent=1)
    sys.exit(1 if dis else 0)
