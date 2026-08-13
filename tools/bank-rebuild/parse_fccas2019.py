#!/usr/bin/env python3
"""
Parse the Grade-V of Mizoram FCS&CAS (Inspector), Mar-2019 papers out of their
PDF text layer -- same engine as parse_native.py (real single-column
text-layer PDFs, not scans). No official MPSC answer key exists for this
sitting (confirmed: no matching file anywhere under
~/Downloads/mpsc_pdfs_examination/Answer_Keys/), so every question here is
routed through merge_native.py for agent-derived solving, not merge.py.
Kept in a separate output file so it never collides with parsed-native.json's
existing 11-paper set.
"""
import json
import os
from parse_native import HERE, ROOT, pdf_text, clean_lines, split_questions, parse_block

PAPERS = [
    ("FCCAS2019:English-II", "Direct_2019-2020/Inspector under F,CS & CA Dept-2019, General English Paper II..pdf", 100),
    ("FCCAS2019:GS-I",       "Direct_2019-2020/Inspector under F,CS & CA Dept-2019, General Studies Paper I..pdf", 100),
    ("FCCAS2019:GS-II",      "Direct_2019-2020/Inspector under F,CS & CA Dept-2019, General Studies Paper II..pdf", 100),
    ("FCCAS2019:GS-III",     "Direct_2019-2020/Inspector under F,CS & CA Dept-2019, General Studies Paper III..pdf", 100),
]


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

    out = os.path.join(HERE, "parsed-fccas-2019.json")
    json.dump(result, open(out, "w"), indent=1, ensure_ascii=False)
    print(f"\ntotal {totals[0]} parsed, {totals[1]} unparsed, {totals[2]} figure-based")
    print("wrote", out)


if __name__ == "__main__":
    main()
