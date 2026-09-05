#!/usr/bin/env python3
"""
Phase 2 step 2 — render the Computer Operator Technical Paper II scans to page
images for a vision transcription pass.

WHY IMAGES AND NOT THE .ocr.txt SIDECARS: measured on 2026-08-28, each paper
holds exactly 75 questions, and text extraction cannot find them all --

    existing .ocr.txt sidecar      61 / 75  (SAD),  63 / 75  (CB)
    tesseract --psm 3  @ 400dpi    58 / 75
    tesseract --psm 6  @ 400dpi    42 / 75
    tesseract --psm 4 / 11 / 12    53 / 32 / 33

The missing questions ARE in the scan; only their numbers are mangled ("» §."
for 5, "22°" for 22). These are 1-bit CCITTFax scans that emit "Bad RTC code"
stream errors, with options in two columns -- which is what defeats tesseract.
The rendered pages, however, are cleanly legible to a vision model.

See BUILD_GUIDE.md §3 for the full measurement table.

Usage:  python3 tools/system-manager-build/render_pages.py [--outdir DIR]
Then run a vision pass over the emitted pages and assert 75 questions per
paper with contiguous numbering 1-75 before writing anything downstream.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

BANK_PDFS = os.path.expanduser(
    "~/workspace/projects/personal/mpsc-question-bank/pdfs/Old_Questions/Direct_2014-2018")

# The MPSC download corpus. CLAUDE.md used to say this was deleted; it was only
# moved when the home directory was renamed, so every hardcoded "~/Downloads/..."
# path in this repo resolves to nothing and the corpus reads as gone. It is not.
MPSC_CORPUS = "/home.old/hruaia/Downloads/mpsc_pdfs_examination"

# srcKey -> (source dir, filename, sitting label, expected question count, dpi)
PAPERS = {
    "CO2016A-P2": (
        BANK_PDFS,
        "3.Computer Operator (Contract) under SAD 2016 Technical Paper II.pdf",
        "Computer Operator (Contract) under SAD, 2016 - Technical Paper II",
        75, 400,
    ),
    "CO2016B-P2": (
        BANK_PDFS,
        "3.Computer Operator (CB) under Mizoram Information Commission 2016 Paper II.pdf",
        "Computer Operator (CB) under Mizoram Information Commission, 2016 - Paper II",
        75, 400,
    ),
    # Added 2026-09-05. The only paper in this build with a published MPSC answer
    # key. 200dpi rather than the 400 the 2016 papers need: this is a clean
    # greyscale scan with a single-column option layout, not a 1-bit CCITTFax
    # fax, and 200 was verified legible end to end before the pass was run.
    "IO2024-P2": (
        os.path.join(MPSC_CORPUS, "Old_Questions", "Direct_2023-2025"),
        "Informatics Officer Technical Paper-II 2024..pdf",
        "Informatics Officer under ICT Deptt., November 2024 - Technical Paper II",
        100, 200,
    ),
}

DPI = 400  # default; per-paper override is the 5th field of PAPERS


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--outdir", default=os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                     "pages"))
    args = ap.parse_args()

    if not shutil.which("pdftoppm"):
        sys.exit("FAIL: pdftoppm not on PATH (apt install poppler-utils)")

    os.makedirs(args.outdir, exist_ok=True)
    manifest = {}

    for key, (srcdir, fname, sitting, expect, dpi) in PAPERS.items():
        src = os.path.join(srcdir, fname)
        if not os.path.isfile(src):
            sys.exit(f"FAIL: source PDF missing: {src}")

        prefix = os.path.join(args.outdir, key)
        for stale in sorted(f for f in os.listdir(args.outdir) if f.startswith(key + "-")):
            os.remove(os.path.join(args.outdir, stale))

        # pdftoppm writes CCITTFax stream warnings to stderr for these files and
        # still produces correct images - don't treat stderr as failure, check
        # the output instead.
        subprocess.run(["pdftoppm", "-r", str(dpi), "-gray", "-png", src, prefix],
                       stderr=subprocess.DEVNULL, check=True)

        pages = sorted(f for f in os.listdir(args.outdir) if f.startswith(key + "-"))
        if not pages:
            sys.exit(f"FAIL {key}: pdftoppm produced no pages")

        manifest[key] = {
            "sitting": sitting,
            "source_pdf": src,
            "expected_questions": expect,
            "dpi": dpi,
            "pages": pages,
        }
        print(f"OK  {key}: {len(pages)} pages @ {dpi}dpi -> {os.path.relpath(args.outdir)}/")

    mpath = os.path.join(args.outdir, "manifest.json")
    with open(mpath, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    total_expected = sum(p["expected_questions"] for p in manifest.values())
    print(f"\nmanifest: {os.path.relpath(mpath)}")
    print(f"expect {total_expected} questions total ("
          + " + ".join(f"{p['expected_questions']} {k}" for k, p in manifest.items()) + ")")
    print("\nNEXT: vision pass over these pages, asserting each paper's own expected\n"
          "count with contiguous numbering before anything is written downstream.\n"
          "Answers: the two CO2016 papers have no published key, so the vision pass\n"
          "derives them and absorbs Phase 3. IO2024-P2 DOES have an official MPSC key\n"
          "-- there the pass still answers blind, and the blind answer is compared\n"
          "against the key rather than replacing it, so a disagreement surfaces either\n"
          "a transcription error or a genuinely contested question instead of being\n"
          "silently overwritten.")


if __name__ == "__main__":
    main()
