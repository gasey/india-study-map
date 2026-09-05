#!/usr/bin/env python3
"""Recover MES2023 Paper I Section A Q27, the one question the import dropped.

    python3 tools/system-analyst-build/import_mes2023_p1_q27.py [--check]

WHAT WAS MISSING AND WHY IT WAS INVISIBLE. The bank held MES2023_P1_001..050
with a single hole at 027. Nothing else marked the gap: the ids either side are
correct, the count looked plausible, and every record carried a note asserting
that 50 of 51 questions had been imported — so the bank claimed a completeness
it did not have. This is the same shape as the 2026-08-04 silent-drop incident:
the artefact that would have revealed the loss was the numbering, and only a
deliberate gap check surfaces it.

THE NOTE WAS WRONG TWICE OVER. There is no 51st question. Section A of this
paper holds exactly 50 questions and Section B exactly 20 (verified with
`pdftotext -layout`; the string "51." does not occur anywhere in the file). So
"(50 of 51)" overstated the paper's size by one AND overstated what had landed
by one, and those two errors concealed each other — 49 present looked like the
50 the note promised. With Q27 restored, Section A is complete, so this script
also rewrites that sentence on every affected record rather than leaving a note
that is now wrong in a new way.

SOURCE. `Old_Questions/Direct_2023-2025/Jr. Grade of MES (Electrical Wing) under
P&E Deptt., Computer Engg Paper-I..pdf` in the recovered corpus at
`/home.old/hruaia/Downloads/mpsc_pdfs_examination/`. The question was read from
the PDF's real text layer and independently confirmed against the sidecar
`.ocr.txt`; the two agree on the stem and on all four options.

WHY THE EXTRACTOR LOST IT. Q27 is the only question in this stretch whose
options the OCR layer emitted in column-major order with a blank line through
the middle — `(a) RISC / (c) IANA / <blank> / (b) ISA / (d) CISC` — instead of
the (a)(b)(c)(d) run the parser expected. The parser found no clean option block
and skipped the record rather than failing loudly.

ANSWER PROVENANCE. Not derived. MPSC's official final answer key for this
sitting (5 September 2023) keys Section A Q27 as (a), already transcribed in
`staged/mes2023-official-key.json` — this script asserts against that file
rather than hard-coding the letter, so the key and the question cannot drift
apart.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"
KEY = ROOT / "tools/system-analyst-build/staged/mes2023-official-key.json"

QID = "MES2023_P1_027"

STALE_NOTE = "Only the Paper-I-syllabus questions from this paper were imported (50 of 51)."
FIXED_NOTE = "All 50 of this paper's Section A questions are imported."

RECORD = {
    "id": QID,
    "src": "past",
    "sitting": "Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023 · Paper I",
    "srcKey": "MES2023_P1",
    "no": 27,
    "paper": "TECH1",
    "unit": "2",
    "sub": "RISC vs CISC",
    "q": "Which of the architecture is power efficient?",
    "opts": {
        "A": "RISC",
        "B": "ISA",
        "C": "IANA",
        "D": "CISC",
    },
    "ans": "A",
    "exp": (
        "RISC keeps a small set of fixed-length instructions that need no microcode and only "
        "simple decode logic, so it does less switching work per instruction than CISC and has "
        "long been the choice where power budget matters, as in ARM-based mobile parts. Option D "
        "is the real contrast and the one worth being able to reject on demand. The other two are "
        "not architecture styles at all: ISA names the abstract instruction-set interface that "
        "both RISC and CISC designs implement, and IANA is the Internet Assigned Numbers "
        "Authority, which has nothing to do with processor design."
    ),
    "conf": "official",
    "prov": (
        "Jr. Grade of MES, P&E Cadre (Electrical Wing), July 2023, Paper I, Q27; answer from "
        "MPSC's official final answer key for this sitting, dated 5 September 2023 (Section A "
        "only; the Commission did not publish a key for Section B)"
    ),
    "note": (
        "RECOVERED FROM SOURCE. This question was dropped by the original import and the bank "
        "held 49 of Section A's 50 with a silent gap at Q27. Read from the text layer of "
        "Old_Questions/Direct_2023-2025/Jr. Grade of MES (Electrical Wing) under P&E Deptt., "
        "Computer Engg Paper-I..pdf and confirmed against that file's OCR sidecar, which agrees "
        "on the stem and all four options. The extractor lost it because the OCR layer emitted "
        "its options in column-major order across a blank line rather than as an (a)-(d) run. "
        + FIXED_NOTE
    ),
}


def die(msg):
    sys.exit("import_mes2023_p1_q27: " + msg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    official = json.loads(KEY.read_text())["cse_paper_1_section_a"].get("27")
    if official != RECORD["ans"]:
        die("official key gives Q27 = %r but this record answers %r"
            % (official, RECORD["ans"]))

    text = BANK.read_text()
    start, end = text.index("["), text.rindex("]") + 1
    prefix, bank, suffix = text[:start], json.loads(text[start:end]), text[end:]

    by_id = {q["id"]: i for i, q in enumerate(bank)}
    if QID in by_id:
        die("%s is already in the bank — nothing to recover" % QID)
    if "MES2023_P1_026" not in by_id or "MES2023_P1_028" not in by_id:
        die("the records Q27 sits between are not both present; refusing to guess a position")
    if RECORD["ans"] not in RECORD["opts"]:
        die("ans is not one of its own options")

    at = by_id["MES2023_P1_026"] + 1
    if bank[at]["id"] != "MES2023_P1_028":
        die("expected MES2023_P1_028 directly after 026, found %r" % bank[at]["id"])
    bank.insert(at, RECORD)

    # The stale sentence is embedded inside longer per-question notes as well as
    # standing alone, so replace the substring rather than whole note values.
    renoted = 0
    for q in bank:
        if q is RECORD:
            continue
        n = q.get("note")
        if n and STALE_NOTE in n:
            q["note"] = n.replace(STALE_NOTE, FIXED_NOTE)
            renoted += 1

    seca = sorted(q["no"] for q in bank if q.get("srcKey") == "MES2023_P1" and q.get("no", 0) < 1000)
    gaps = [n for n in range(1, 51) if n not in seca]
    if gaps or len(seca) != 50:
        die("Section A still not whole: %d records, gaps %s" % (len(seca), gaps))

    if args.check:
        print("check ok: would insert %s at index %d, renote %d record(s); "
              "Section A would be complete 1-50" % (QID, at, renoted))
        return

    BANK.write_text(prefix + json.dumps(bank, indent=1, ensure_ascii=False) + suffix)
    print("inserted %s (official key %s); corrected the stale count on %d record(s)"
          % (QID, official, renoted))
    print("MES2023 Paper I Section A is now complete: 50/50, no gaps")


if __name__ == "__main__":
    main()
