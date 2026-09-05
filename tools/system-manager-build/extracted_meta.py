#!/usr/bin/env python3
"""
The one table describing the papers in `extracted/` — those Tier 1 papers that
mpsc_bank_v2.json does not hold, so harvest.py cannot reach them.

WHY THIS IS ITS OWN MODULE. Two scripts need this table: assemble.py (to build
the app records) and solve.py (to know which extracted questions still need an
answer). It started as a dict named P2_META inside assemble.py. Copying it into
solve.py would create exactly the failure this repo keeps re-learning — the JSO
snapshot that harvest.py's docstring describes was two copies of one dataset
where only one got updated, and it silently capped Tier 4 at 14 questions per
unit for weeks because the count stayed internally consistent. One table, two
importers.

`answered` is the field that matters:

  True   the extraction pass also derived the answers, so the records arrive
         complete and skip solving. The 2016 Paper II vision pass works this
         way — a model read the scan and answered in one go.
  False  the extraction was a pure text-layer parse with NO answers. These MUST
         go through solve.py's two-blind-pass route before they can ship, and
         until they do, assemble.py quarantines them for having no answer.
         CO2018M-P1 is this case, deliberately: separating transcription from
         answering means a parse bug and a wrong answer cannot be introduced by
         the same pass, and it lets the blind-solve diff do real work.

`key_file` is optional and rarer. It names a staged JSON holding MPSC's own
published answer key for the paper. Where it is set, that key — not the
extraction pass's answer — becomes the shipped answer, and the extraction's
blind answer is kept only to be compared against it. Only IO2024-P2 has one;
MPSC published no key for any Computer Operator sitting, which is why every
other answer in this app is derived. Do NOT set this field speculatively: an
answer that claims official backing it does not have is the single worst
failure mode this bank has, and provLine() in app.js renders it as a blue
"official key" badge that tells the reader to stop doubting it.
"""

EXTRACTED_META = {
    "CO2016A-P2": dict(
        sitting="Computer Operator (Contract) under SAD, 2016 - Technical Paper II",
        paper="TECH2", expect=75, answered=True,
        source="scanned paper, vision extraction pass (EXTRACT_BRIEF.md)",
    ),
    "CO2016B-P2": dict(
        sitting="Computer Operator (CB) under Mizoram Information Commission, 2016 - Paper II",
        paper="TECH2", expect=75, answered=True,
        source="scanned paper, vision extraction pass (EXTRACT_BRIEF.md)",
    ),
    # Recovered 2026-09-03. Not in the bank because MPSC's listing pages put the
    # post name in a different table cell from the paper link, so the scraper
    # saved this and the MIMER Laboratory Technician paper under the same
    # flattened name and one overwrote the other. Fetched from MPSC's live copy
    # and parsed from its clean text layer by extract_p1_2018.py.
    "CO2018M-P1": dict(
        sitting="Computer Operator under MIMER, 2018 - Technical Paper I",
        paper="TECH1", expect=75, answered=False,
        source="MPSC live PDF, text-layer parse (extract_p1_2018.py)",
    ),
    # Added 2026-09-05. The first paper in this app carrying a published MPSC
    # answer key, and the only non-Computer-Operator past paper here.
    #
    # WHY AN INFORMATICS OFFICER PAPER IS IN A COMPUTER OPERATOR BUILD.
    # BUILD_GUIDE.md §2 says Informatics Officer papers "are too hard" for this
    # post. That is true of Technical Paper I, which is CS theory — addressing
    # modes, OSPF, UML, spanning tree. It is NOT true of Technical Paper II,
    # which is an e-Governance / IT-governance / IT-procurement paper at
    # conceptual difficulty, and which lands on TECH2 Units IV and V — the two
    # thinnest sections in the build, where every question was authored because
    # no past paper covered them. The guide's verdict was written from the
    # post's name, not from this paper's contents.
    #
    # `expect` is the count in the extracted file AFTER the syllabus filter, not
    # the 100 questions the paper holds. import_io2024_p2.py writes both that
    # file and staged/io2024-p2-manifest.json, which records every question left
    # out and why — the count here moves only when that script is re-run.
    "IO2024-P2": dict(
        sitting="Informatics Officer under ICT Deptt., November 2024 - Technical Paper II",
        paper="TECH2", expect=None, answered=True,
        source="scanned paper, vision extraction pass (EXTRACT_BRIEF_IO2024.md)",
        key_file="io2024-p2-key.json",
    ),
}
