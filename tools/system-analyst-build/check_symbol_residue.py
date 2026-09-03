#!/usr/bin/env python3
"""Report Symbol-font private-use residue in the System Analyst bank.

    python3 tools/system-analyst-build/check_symbol_residue.py

Scanned PDFs in this corpus set their mathematics in a Symbol font. pdftotext
maps those glyphs into the Unicode private-use area (U+F02B '+', U+F03D '=',
U+F0AE arrow, U+F0B3 >=, U+F0C7 intersection, U+F0CC subset, U+F0D9/DA and/or,
U+F0DB iff, U+F0CE member-of, U+F061 alpha) and drops overbars and superscripts
entirely. A card carrying residue is a card whose maths the reader cannot read.

THIS FILE EXISTS BECAUSE THE COUNT KEPT COMING OUT WRONG. Written inline in a
shell heredoc or a JS string, the character class below collapses to a literal
hyphen and then matches every card containing '-'. That produced three wrong
answers in one session - 0, 1262 and 1711 out of 1764 - and the dangerous one
was 0, which reads as "the bank is clean". The range is therefore written as
backslash-u escapes and asserted against a known-good and known-bad string on every run.
Take residue counts from this file; do not retype the regex inline.

Exit status is always 0: this is a report, not a gate. Residue is a data defect
to be fixed by reading the source page, which is a human-in-the-loop job.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

PUA = re.compile("[-]")          # Unicode Private Use Area
QF = Path("public/mpsc-system-analyst/data/questions.js")

qs = json.loads(QF.read_text().split("=", 1)[1].strip()[:-1])


def fields(q):
    return [q.get("q") or "", q.get("exp") or "", q.get("note") or ""] + \
           list((q.get("opts") or {}).values())


def raw(q):
    return " ".join(fields(q))


assert PUA.search("x y") and not PUA.search("a-b-c"), "regex sanity check failed"

hits = [q for q in qs if PUA.search(raw(q))]
print(f"sanity: regex matches U+F02B, does NOT match 'a-b-c'  ->  ok")
print(f"\ncards with private-use residue, whole bank: {len(hits)} / {len(qs)}")
print("  by paper:", dict(Counter(q.get("paper") for q in hits)))
print("  by sitting:")
for s, n in Counter(q.get("sitting", "")[:50] for q in hits).most_common():
    print(f"     {n:3}  {s}")

chars = Counter(c for q in hits for c in PUA.findall(raw(q)))
print(f"\n  distinct codepoints: {len(chars)}")
print("  ", {f"U+{ord(c):04X}": n for c, n in chars.most_common(14)})

# where does it land -- stem, keyed option, other option, or only prose?
loc = Counter()
for q in hits:
    o = q.get("opts") or {}
    if PUA.search(q.get("q") or ""):
        loc["stem"] += 1
    if q.get("ans") in o and PUA.search(o[q["ans"]] or ""):
        loc["KEYED option"] += 1
    if any(PUA.search(v or "") for k, v in o.items() if k != q.get("ans")):
        loc["other option"] += 1
    if PUA.search(q.get("exp") or "") or PUA.search(q.get("note") or ""):
        loc["explanation/note only"] += 1
print("\n  residue location (cards may count in more than one):", dict(loc))

ilm = [q for q in qs if q["id"].startswith("ILM2010_P1_")]
ilm_hit = [q for q in ilm if PUA.search(raw(q))]
print(f"\nILM 2010 Paper I: {len(ilm_hit)} of {len(ilm)} cards affected")
print("  question numbers:", sorted(q.get("no") for q in ilm_hit))
