#!/usr/bin/env python3
"""Inventory MPSC's published answer keys: which exam, which papers, which subjects.

    python3 tools/system-analyst-build/inventory_answer_keys.py
    python3 tools/system-analyst-build/inventory_answer_keys.py --keys-dir /path/to/Answer_Keys

Writes staged/answer-keys-inventory.json.

WHY THIS EXISTS. Every question whose provenance says "no official key exists for
this sitting" is an unchecked assertion, and on 2026-09-04 one turned out to be
false: MPSC had published a key for the ILM 2023 sitting and nobody had looked.
This tool answers "which of MPSC's published keys could possibly apply to this
bank" so that question never has to be re-derived by hand.

The answer, as of the 2026-09-05 sweep, is that exactly **5 of 120** keys touch a
computing subject or post — the ILM 2023 pair, the MES P&E (Electrical Wing) key,
and the Informatics Officer November 2024 pair. The other 115 are Civil,
Electrical, Mechanical, Electronics, Physics, Agriculture, Health, Law, Forestry,
Education, Cooperation, Excise or MCS general papers. Re-run this when the folder
gains files; do not redo the sweep by hand.

DISCOVERY ONLY — NEVER FOR AN ANSWER. 76 of the 120 keys are pure scans with no
text layer, so this OCRs them. OCR is good enough to read "Computer Science &
Engineering Paper - II" off a heading; it is emphatically not good enough to read
which letter MPSC marked for question 47. Any key this flags as relevant must
have its tables transcribed by parsing a real text layer, or by rendering the
pages and reading them by eye, before one answer is applied. That is how both
applied sittings were done — see apply_official_keys.py.

The keys live in the mpsc-question-bank repo, not this one, which is why the
result is staged here as JSON: the finding has to survive without the PDFs.
"""

import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_KEYS_DIR = HERE.parents[2] / "mpsc-question-bank" / "pdfs" / "Answer_Keys"
OUT = HERE / "staged" / "answer-keys-inventory.json"

# The computing subjects are the point; the rest are listed so a key that covers
# nothing relevant is positively identified as such rather than merely absent.
SUBJECT = re.compile(
    r"(General English|General Studies|General Knowledge|Computer Science|Computer Engg|"
    r"Computer Application|Information Tech|Informatics|Electrical Engineering|"
    r"Mechanical Engineering|Civil Engineering|Electronics|Physics|Technical Paper|"
    r"Paper\s*-?\s*I{1,3}V?|Chemistry|Mathematics|Statistics)", re.I)

COMPUTING = re.compile(r"computer|information tech|informatics", re.I)
TEXT_LAYER_MIN = 200          # below this, treat the PDF as a scan


def pdf_text(path):
    return subprocess.run(["pdftotext", "-layout", str(path), "-"],
                          capture_output=True, text=True).stdout


def ocr_text(path, workdir):
    """Render every page and OCR it. ~3s/page, so only used on scans."""
    stem = os.path.join(workdir, "pg")
    for f in glob.glob(stem + "*"):
        os.remove(f)
    subprocess.run(["pdftoppm", "-r", "150", "-png", str(path), stem], capture_output=True)
    chunks = []
    for img in sorted(glob.glob(stem + "*.png")):
        chunks.append(subprocess.run(["tesseract", img, "stdout", "--psm", "6"],
                                     capture_output=True, text=True).stdout)
    return "\n".join(chunks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keys-dir", default=str(DEFAULT_KEYS_DIR))
    args = ap.parse_args()

    keys_dir = Path(args.keys_dir)
    if not keys_dir.is_dir():
        sys.exit(f"FAIL: no such directory {keys_dir}\n"
                 f"The keys live in the mpsc-question-bank repo; pass --keys-dir if it moved.")
    for tool in ("pdftotext", "pdftoppm", "tesseract"):
        if not shutil.which(tool):
            sys.exit(f"FAIL: {tool} not on PATH (needed to read the scanned keys)")

    files = sorted(keys_dir.glob("*.pdf"))
    if not files:
        sys.exit(f"FAIL: no PDFs in {keys_dir}")

    out = []
    with tempfile.TemporaryDirectory() as workdir:
        for i, p in enumerate(files, 1):
            text = pdf_text(p)
            scanned = len(text) < TEXT_LAYER_MIN
            if scanned:
                text = ocr_text(p, workdir)
            post = re.findall(r"post of\s+(.{4,120}?)(?:,? held|\.|is hereby|$)",
                              text, re.S | re.I)
            held = re.findall(r"held\s+(?:during|on)\s+([^.\n]{4,60})", text, re.I)
            subjects = sorted({re.sub(r"\s+", " ", m.group(0)).strip()
                               for m in SUBJECT.finditer(text)})
            rec = {
                "file": p.name,
                "scanned": scanned,
                "chars": len(text),
                "post": [re.sub(r"\s+", " ", x).strip()[:110] for x in post[:2]],
                "held": [re.sub(r"\s+", " ", x).strip() for x in held[:2]],
                "subjects": subjects[:14],
            }
            rec["computing"] = bool(COMPUTING.search(" ".join(subjects + rec["post"])))
            out.append(rec)
            print(f"[{i}/{len(files)}] {'OCR' if scanned else 'txt'} "
                  f"{'*' if rec['computing'] else ' '} {p.name[:62]}", flush=True)

    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    comp = [r for r in out if r["computing"]]
    thin = [r for r in out if r["chars"] < 600]
    print(f"\nwrote {OUT.relative_to(HERE.parents[1])}")
    print(f"  {len(out)} keys, {sum(1 for r in out if r['scanned'])} of them scanned and OCR'd")
    print(f"  {len(comp)} touch a computing subject or post:")
    for r in comp:
        print(f"      {r['file'][:70]}")
    if thin:
        print(f"  {len(thin)} key(s) yielded thin text — worth reading by eye:")
        for r in thin:
            print(f"      {r['chars']:>5} chars  {r['file'][:64]}")


if __name__ == "__main__":
    main()
