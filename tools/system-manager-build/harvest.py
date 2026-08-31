#!/usr/bin/env python3
"""
Phase 2 steps 1, 3 and 6 — harvest the model-free question sources into a single
staged JSON, in the app's schema, ready for tagging (step 5) and answer
verification (Phase 3).

Covers:
  Tier 1  ALL FIVE Computer Operator sittings MPSC has ever examined, as held in
          mpsc_bank_v2.json:
            SAD 2016            P-I, GE          (P-II via the vision pass)
            Mizoram IC 2016     P-I, GE          (P-II via the vision pass)
            MIMER Feb-2018      P-I, P-II, GE
            AH & Vety May-2019  P-I, P-II, GE
            Election Dec-2019   P-I, P-II, GE
  Tier 4  mpsc-jso-prep/data/p4u*.js authored questions (schema-converted)

WHY THE 2018/2019 SITTINGS WERE MISSING UNTIL 2026-08-31: MPSC's listing pages
put the post name in one table cell and the paper links in the next. The
question-bank scraper took the LINK TEXT as the title, so these papers are
stored as `2.Technical Paper-I.pdf`, `Paper-II(AH&Vety).pdf` and the like, with
the words "Computer Operator" appearing nowhere in the filename, the paperId or
the index. BUILD_GUIDE.md §3's Tier 1 inventory was built by grepping the bank
for "Computer Operator" and so found four papers instead of ten.

That is also why every entry below carries `header`: the filenames are
ambiguous (`2.Technical Paper-I.pdf` and `3.Technical Paper-I.pdf` are DIFFERENT
POSTS - MIMER Computer Operator and PHE Programmer respectively), so each paper
is confirmed against its own printed header before a single question is taken.

NOT covered here, deliberately:
  Tier 1  Computer Operator Technical Paper II for the two 2016 sittings - the
          bank never ingested these and OCR can't recover them; they come from
          the vision pass in tools/system-manager-build/extracted/ (see
          EXTRACT_BRIEF.md). The 2018/2019 Paper IIs ARE in the bank and are
          harvested here.
  Tier 2  General English at large. BUILD_GUIDE.md originally named 3 JE papers
          (199 q); the bank actually holds ~6,300 GE questions across ~125
          papers. That needs a selection strategy, not a bulk import - see §3.
  Tier 3/5 cherry-picks, which need a model to confirm on-syllabus. Note the
          Programmer under PHE-2018 papers (291 q) surfaced by the same audit
          are Tier 3, not Tier 1: 200-mark papers for a post requiring a degree.

Two schema traps this script handles, both of which would ship broken data:
  1. The app's `opts` is an OBJECT keyed A-D and `ans` is a LETTER. Every other
     bank in the repo uses an options array + 0-based index.
  2. app.js renders explanations with `esc(q.exp)`, so HTML is displayed
     literally. jso-prep explanations are HTML and must be flattened to text.

Usage:  python3 tools/system-manager-build/harvest.py
Output: tools/system-manager-build/staged/harvest.json  (+ a summary to stdout)
"""

import difflib
import html
import json
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
PERSONAL = os.path.expanduser("~/workspace/projects/personal")
BANK = os.path.join(PERSONAL, "mpsc-question-bank", "bank", "mpsc_bank_v2.json")
PDFS = os.path.join(PERSONAL, "mpsc-question-bank", "pdfs")
JSO = os.path.join(PERSONAL, "mpsc-jso-prep", "data")

LETTERS = ["A", "B", "C", "D"]

# --- Tier 1: paperId -> how to read that paper ---
# Filter on paperId, never on `subject` - 69,757 of 77,751 bank records are
# tagged "gk" and the field is useless (BUILD_GUIDE.md §8).
#
#   key      srcKey used for question ids, and the app's sitting grouping
#   sitting  the label the reader sees
#   paper    app paper id. Paper I is fundamentals/OS/office -> TECH1;
#            Paper II is networking/DBMS/web -> TECH2. Confirmed from the
#            papers themselves, not assumed: AH&Vety P-II opens on transport
#            layer protocols, Election P-II on mesh topology.
#   expect   question count from the paper's OWN printed header
#            (150 marks / 2 each = 75; GE is 80 MCQ + a handwritten section)
#   header   EVERY string listed must appear in the paper's own printed header,
#            proving the ambiguous filename resolved to the post we think it
#            did. It has to pin the POST, not merely the employer.
#
#            The first version of this guard asked only for "MIZORAM INSTITUTE
#            OF MEDICAL EDUCATION AND RESEARCH" — true of every MIMER paper
#            whatever the post — and so admitted 75 LABORATORY TECHNICIAN
#            questions (bone types, ketone bodies, Ziehl-Neelsen staining) as
#            Computer Operator Technical Paper I. Same shape as the /official/i
#            bug in CLAUDE.md: a substring that is true of the thing you want
#            AND of the things you don't is not a test. Caught 2026-08-31 by
#            two tagging agents refusing to tag anatomy against a computing
#            syllabus, not by this pipeline.
#   fig_gaps qnums absent from the bank because the question is figure-only.
#            Recorded to quarantine rather than treated as a fatal gap.
TIER1 = {
    "Old_Questions/Direct_2014-2018/2.Computer Operator (Contract) under SAD 2016 Technical Paper I.pdf": dict(
        key="CO2016A-P1", paper="TECH1", expect=75,
        sitting="Computer Operator (Contract) under SAD, 2016 - Technical Paper I",
        header=["COMPUTER OPERATOR"]),
    "Old_Questions/Direct_2014-2018/2.Computer Operator (CB) under Mizoram Information Commission 2016 Paper I.pdf": dict(
        key="CO2016B-P1", paper="TECH1", expect=75,
        sitting="Computer Operator (CB) under Mizoram Information Commission, 2016 - Paper I",
        header=["COMPUTER OPERATOR"]),
    "Old_Questions/Direct_2014-2018/1.Computer Operator (Contract) under SAD 2016 General English.pdf": dict(
        key="CO2016A-GE", paper="GE", expect=80,
        sitting="Computer Operator (Contract) under SAD, 2016 - General English",
        header=["COMPUTER OPERATOR"]),
    "Old_Questions/Direct_2014-2018/1.Computer Operator (CB) under Mizoram Information Commission 2016 General English.pdf": dict(
        key="CO2016B-GE", paper="GE", expect=80,
        sitting="Computer Operator (CB) under Mizoram Information Commission, 2016 - General English",
        header=["COMPUTER OPERATOR"]),

    # --- MIMER, February 2018 (found 2026-08-31) ---
    # Filenames carry no post name; the leading digit is only the listing row
    # number, and rows interleave across posts. Measured, the corpus holds:
    #     1.Technical Paper-I    Medical Record Technician
    #     2.Technical Paper-I    LABORATORY TECHNICIAN   <- not Computer Operator
    #     2.Technical Paper-II   Medical Record Technician
    #     3.Technical Paper-I    PHE Programmer
    #     3.Technical Paper-II   Computer Operator       <- the one we want
    #
    # There is NO Computer Operator Technical Paper I in the local corpus. MPSC
    # does publish one — it is served from
    #   uploads/attachments/963bc976d8dfb7ce26c046ac1c4dba1b/technical-paper-i-compt.pdf
    # and its header reads "COMPUTER OPERATOR UNDER MIMER - 2018, TECHNICAL
    # PAPER - I". The scraper saved it as `2.Technical Paper-I.pdf`, the same
    # flattened name the Laboratory Technician paper got, and one overwrote the
    # other. It has a clean text layer (7 pages, no OCR needed), so recovering
    # it is cheap — but it is not in mpsc_bank_v2.json, so it cannot be
    # harvested here. Until it is parsed, MIMER 2018 contributes P-II + GE only.
    "Old_Questions/Direct_2014-2018/3.Technical Paper-II.pdf": dict(
        key="CO2018M-P2", paper="TECH2", expect=75,
        sitting="Computer Operator under MIMER, 2018 - Technical Paper II",
        header=["COMPUTER OPERATOR", "MIZORAM INSTITUTE OF MEDICAL EDUCATION AND RESEARCH"]),
    # The MIMER General English paper is sat by several posts, not just Computer
    # Operator; the syllabus is the same one System Manager's GE follows. Its
    # header says VARIOUS POSTS, so that is what pins it.
    "Old_Questions/Direct_2014-2018/1.General English Common Paper.pdf": dict(
        key="CO2018M-GE", paper="GE", expect=80,
        sitting="Various posts under MIMER, February 2018 - General English (common paper)",
        header=["VARIOUS POSTS", "MIZORAM INSTITUTE OF MEDICAL EDUCATION AND RESEARCH"]),

    # --- Computer Operator under AH & Vety Dept, May 2019 (found 2026-08-31) ---
    "Old_Questions/Direct_2019-2020/Paper-I (AH&Vety).pdf": dict(
        key="CO2019A-P1", paper="TECH1", expect=75,
        sitting="Computer Operator under AH & Vety Dept, May 2019 - Paper I",
        header=["COMPUTER OPERATOR", "ANIMAL HUSBANDRY & VETERINARY"]),
    "Old_Questions/Direct_2019-2020/Paper-II(AH&Vety).pdf": dict(
        key="CO2019A-P2", paper="TECH2", expect=75,
        sitting="Computer Operator under AH & Vety Dept, May 2019 - Paper II",
        header=["COMPUTER OPERATOR", "ANIMAL HUSBANDRY & VETERINARY"]),
    "Old_Questions/Direct_2019-2020/General English(AH&Vety).pdf": dict(
        key="CO2019A-GE", paper="GE", expect=80,
        sitting="Computer Operator under AH & Vety Dept, May 2019 - General English",
        header=["COMPUTER OPERATOR", "ANIMAL HUSBANDRY & VETERINARY"]),

    # --- Computer Operator under Election Dept, December 2019 (found 2026-08-31) ---
    "Old_Questions/Direct_2019-2020/Paper-I(Election).pdf": dict(
        key="CO2019B-P1", paper="TECH1", expect=75,
        sitting="Computer Operator under Election Dept, December 2019 - Paper I",
        header=["COMPUTER OPERATOR", "ELECTION DEPARTMENT"]),
    # 74 in the bank, numbered 1..74 with NO gap to reveal the loss. Q75 is a
    # symbol-sequence question sharing a "Questions No. 74 & 75" direction block
    # and has no text stem, so the extractor dropped it off the tail. This is the
    # exact silent-truncation shape that cost ~280 questions on 2026-08-04, and
    # it is declared here so the count check cannot pass by accident.
    "Old_Questions/Direct_2019-2020/Paper-II(Election).pdf": dict(
        key="CO2019B-P2", paper="TECH2", expect=75, fig_gaps=[75],
        sitting="Computer Operator under Election Dept, December 2019 - Paper II",
        header=["COMPUTER OPERATOR", "ELECTION DEPARTMENT"]),
    "Old_Questions/Direct_2019-2020/General English(Election).pdf": dict(
        key="CO2019B-GE", paper="GE", expect=80,
        sitting="Computer Operator under Election Dept, December 2019 - General English",
        header=["COMPUTER OPERATOR", "ELECTION DEPARTMENT"]),
}

# --- Tier 4: mpsc-jso-prep unit files that are on-syllabus for System Manager ---
# Digital/multimedia/mobile forensics units are JSO-specific and off-syllabus for
# SM, so only fundamentals and DBMS are pulled. Paper assignment reflects the SM
# syllabus, not JSO's.
TIER4 = {
    "p4u1-computer-fundamentals.js": ("JSO-P4U1", "TECH1", "authored for MPSC JSO Cyber Forensic prep"),
    "p4u2-dbms.js": ("JSO-P4U2", "TECH2", "authored for MPSC JSO Cyber Forensic prep"),
}


def strip_html(s):
    """jso-prep explanations are HTML; app.js esc()s `exp`, so flatten to text."""
    if not s:
        return ""
    s = re.sub(r"(?i)<br\s*/?>", " ", s)
    s = re.sub(r"(?i)</(p|li|div|ul|ol)>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    """Normalised question text, for cross-source dedup."""
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def check_header(pid, meta, problems):
    """Prove the paperId resolved to the post we think it did.

    Several of these filenames are bare row numbers (`2.Technical Paper-I.pdf`),
    and neighbouring numbers belong to entirely different posts. Reading the
    paper's own printed header is the only cheap way to be sure, and CLAUDE.md's
    standing rule is to verify against source rather than trust the pipeline.
    """
    want = meta.get("header") or []
    if not want:
        problems.append(f"{meta['key']}: no header check declared — refusing to trust an "
                        f"unverified filename")
        return
    ocr = os.path.join(PDFS, pid + ".ocr.txt")
    if not os.path.isfile(ocr):
        problems.append(f"{meta['key']}: no OCR sidecar at {os.path.relpath(ocr, PDFS)} — "
                        f"cannot confirm this file is the paper we think it is")
        return
    head = open(ocr, encoding="utf-8", errors="replace").read(1500).upper()
    missing = [w for w in want if w.upper() not in head]
    if missing:
        printed = re.sub(r"\s+", " ", head[:220]).strip()
        problems.append(f"{meta['key']}: header check FAILED on {os.path.basename(pid)} — "
                        f"{missing} absent. The paper actually says: {printed!r}")


def collapse_qnum_dups(srckey, got, problems, notes):
    """One record per printed question number.

    MIMER Technical Paper II is in the bank twice over for 16 of its 75 numbers:
    the extractor emitted both a version that keeps the fill-in-the-blank rule
    ("based on_____") and one that strips it. Options are identical in every
    case, so the pair is genuinely the same question rather than a mis-split.

    Collapsing is only safe where the two copies also agree on the answer. For
    the 5 that disagree, picking either one would be inventing an answer with a
    50% chance of teaching the wrong thing — so the answer is cleared and the
    question goes to Phase 3 with both candidates recorded.
    """
    by_num = {}
    for r in got:
        by_num.setdefault(r.get("qnum"), []).append(r)

    out, conflicted = [], []
    for n in sorted(by_num, key=lambda x: (x is None, x)):
        group = by_num[n]
        if len(group) == 1:
            out.append(group[0])
            continue
        variants = {tuple(str(o) for o in (r.get("options") or [])) for r in group}
        if len(variants) > 1:
            problems.append(f"{srckey} Q{n}: {len(group)} copies with DIFFERENT options — "
                            f"a real mis-split, not a formatting duplicate. Not collapsed.")
            continue
        # Options agree. Keep the longest stem: it is the one that preserved the
        # printed blank, which the reader needs to see to parse the question.
        best = max(group, key=lambda r: len(r.get("question") or ""))
        answers = {r.get("answerIndex", -1) for r in group}
        if len(answers) > 1:
            best = dict(best)
            best["_answer_conflict"] = sorted(answers)
            conflicted.append(n)
        out.append(best)

    if len(out) < len(got):
        notes.append(f"{srckey}: collapsed {len(got)} bank records onto {len(out)} printed "
                     f"question numbers ({len(got) - len(out)} duplicate extractions)")
    if conflicted:
        notes.append(f"{srckey}: {len(conflicted)} collapsed pair(s) disagreed on the answer "
                     f"({', '.join('Q' + str(c) for c in conflicted)}) — answer cleared, "
                     f"sent to Phase 3 rather than guessed")
    return out


def harvest_tier1(problems, notes, quarantine):
    if not os.path.isfile(BANK):
        sys.exit(f"FAIL: bank not found at {BANK}")
    with open(BANK, encoding="utf-8") as f:
        rows = json.load(f)["questions"]

    by_paper = {}
    for r in rows:
        pid = r.get("paperId")
        if pid in TIER1:
            by_paper.setdefault(pid, []).append(r)

    out = []
    for pid, meta in TIER1.items():
        srckey, sitting = meta["key"], meta["sitting"]
        paper, expect = meta["paper"], meta["expect"]
        fig_gaps = meta.get("fig_gaps", [])

        check_header(pid, meta, problems)

        got = sorted(by_paper.get(pid, []), key=lambda r: r.get("qnum") or 0)
        if not got:
            problems.append(f"{srckey}: no questions in the bank for {pid}")
            continue
        got = collapse_qnum_dups(srckey, got, problems, notes)

        nums = [r.get("qnum") for r in got]
        gaps = [n for n in range(1, expect + 1) if n not in nums]
        # A gap we have already identified as a figure-only question is expected;
        # record it so the shortfall is visible, and don't fail the build for it.
        expected_gaps = [n for n in gaps if n in fig_gaps]
        real_gaps = [n for n in gaps if n not in fig_gaps]
        for n in expected_gaps:
            quarantine.append({
                "id": f"{srckey}-{n}", "srcKey": srckey, "no": n, "paper": paper,
                "sitting": sitting, "reason": "needs_figure",
                "why": "printed in the paper but never extracted: the question is a figure "
                       "or symbol-sequence item with no text stem the schema can carry",
            })
        if expected_gaps:
            notes.append(f"{srckey}: Q{', Q'.join(str(n) for n in expected_gaps)} absent from the "
                         f"bank as expected (figure-only) — recorded in quarantine")
        if real_gaps:
            problems.append(f"{srckey}: missing qnum {real_gaps}")
        if len(got) + len(expected_gaps) != expect:
            problems.append(f"{srckey}: {len(got)} questions + {len(expected_gaps)} quarantined "
                            f"!= {expect} printed in the paper")

        for r in got:
            # NOT every question has four options. The sentence-analysis blocks in
            # both General English papers print only (a)(b)(c), and the bank pads
            # the list to length 4 with a literal null. Passing that through
            # str() produced a bogus option D reading "None" — which looks exactly
            # like "None of these" and is pickable. Drop nulls and emit only the
            # options the paper actually prints; app.js already filters absent
            # letters at every render site.
            raw = r.get("options") or []
            opts = [(o if o is None else str(o).strip()) for o in raw]
            opts = [o for o in opts if o not in (None, "", "None", "null")]
            if not 2 <= len(opts) <= 4:
                problems.append(f"{srckey} Q{r.get('qnum')}: {len(opts)} usable options "
                                f"(raw {len(raw)}) — expected 2-4")
                continue
            ai = r.get("answerIndex", -1)
            # answerIndex points into the RAW list; remap it onto the filtered one.
            if 0 <= ai < len(raw):
                target = raw[ai]
                target = None if target is None else str(target).strip()
                ai = opts.index(target) if target in opts else -1
            else:
                ai = -1

            # A collapsed duplicate whose two copies disagreed on the answer has
            # no trustworthy answer at all. Clear it and say why, rather than
            # shipping a coin-flip the reader would read as authoritative.
            note = ""
            conflict = r.get("_answer_conflict")
            if conflict:
                cands = ", ".join(LETTERS[i] if 0 <= i < len(LETTERS) else "none"
                                  for i in conflict)
                note = (f"The bank holds this question twice and the two copies disagree on "
                        f"the answer ({cands}). Answer withheld pending Phase 3.")
                ai = -1

            out.append({
                "id": f"{srckey}-{r['qnum']}",
                "src": "past",
                "srcKey": srckey,
                "sitting": sitting,
                "no": r["qnum"],
                "paper": paper,
                "unit": None,          # Phase 2 step 5 (Haiku) tags these
                "sub": None,
                "q": (r.get("question") or "").strip(),
                "opts": {LETTERS[i]: o for i, o in enumerate(opts)},
                "ans": LETTERS[ai] if 0 <= ai < len(opts) else None,
                "exp": strip_html(r.get("explanation")),
                # answerSource is "inferred" for every one of these - no official
                # key was ever published. Phase 3 must re-derive from source.
                "conf": None,
                "prov": f"Transcribed from {sitting}. MPSC published no answer key for "
                        f"this paper; answer is derived and unverified.",
                "needs_verify": True,
                "needs_figure": bool(r.get("hasDiagram") or r.get("figureGroupId")),
                "note": note,
                "_tier": 1,
                "_bank_id": r.get("id"),
                "_answer_source": r.get("answerSource"),
            })
    return out


def harvest_tier4(problems):
    out = []
    for fname, (srckey, paper, origin) in TIER4.items():
        path = os.path.join(JSO, fname)
        if not os.path.isfile(path):
            problems.append(f"{srckey}: {fname} not found")
            continue
        text = open(path, encoding="utf-8").read()

        # These are JS files, not JSON. Pull the questions array by brace matching
        # from `questions:` rather than trying to regex nested structures.
        i = text.find("questions:")
        if i < 0:
            problems.append(f"{srckey}: no `questions:` key in {fname}")
            continue
        start = text.find("[", i)
        depth, j, instr, esc, quote = 0, start, False, False, ""
        while j < len(text):
            c = text[j]
            if instr:
                if esc:
                    esc = False
                elif c == "\\":
                    esc = True
                elif c == quote:
                    instr = False
            elif c in "'\"":
                instr, quote = True, c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        block = text[start:j + 1]

        # Each record is { q:'…', o:[…], a:N, e:'…' } with JS string concatenation
        # in `e`. Evaluate the concatenations, then parse fields individually.
        records = re.findall(r"\{\s*q\s*:(.*?)\}\s*(?=,\s*\{|\s*\]$|\s*,?\s*$)", block, re.S)
        count = 0
        for rec in records:
            body = "q:" + rec

            def js_str(field):
                m = re.search(rf"{field}\s*:\s*((?:'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\")"
                              rf"(?:\s*\+\s*(?:'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"))*)",
                              body, re.S)
                if not m:
                    return None
                parts = re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", m.group(1), re.S)
                joined = "".join(a or b for a, b in parts)
                return joined.replace("\\'", "'").replace('\\"', '"').replace("\\n", " ")

            q = js_str("q")
            e = js_str("e")
            am = re.search(r"\ba\s*:\s*(\d+)", body)
            om = re.search(r"\bo\s*:\s*\[(.*?)\]", body, re.S)
            if not (q and om and am):
                continue
            opts = [(a or b).replace("\\'", "'").replace('\\"', '"')
                    for a, b in re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"",
                                           om.group(1), re.S)]
            if len(opts) != 4:
                problems.append(f"{srckey}: a question has {len(opts)} options, expected 4")
                continue
            ai = int(am.group(1))
            if not 0 <= ai < 4:
                problems.append(f"{srckey}: answer index {ai} out of range")
                continue
            count += 1
            out.append({
                "id": f"{srckey}-{count}",
                "src": "generated",
                "srcKey": srckey,
                "sitting": f"Authored ({origin})",
                "no": count,
                "paper": paper,
                "unit": None,
                "sub": None,
                "q": q.strip(),
                "opts": {L: opts[i].strip() for i, L in enumerate(LETTERS)},
                "ans": LETTERS[ai],
                "exp": strip_html(e),
                "conf": None,
                "prov": "Authored for MPSC JSO prep, reused here where the topic overlaps "
                        "the System Manager syllabus. Not a past System Manager question.",
                "needs_verify": False,
                "needs_figure": False,
                "note": "",
                "_tier": 4,
            })
        if count == 0:
            problems.append(f"{srckey}: parsed 0 questions from {fname}")
    return out


def main():
    problems, notes, quarantine = [], [], []
    rows = harvest_tier1(problems, notes, quarantine) + harvest_tier4(problems)

    # --- step 6: dedup across sources on normalised question text ---
    # MPSC reuses questions heavily across sittings: 36 of the five sittings'
    # questions are verbatim repeats of an earlier paper.
    #
    # A repeat is NOT dropped when both copies are real past questions. Dropping
    # it would mean the Past Papers view renders "AH & Vety 2019 Paper I" with 56
    # of its 75 questions and no gap to show for it — the same silent
    # incompleteness this project has been bitten by twice, and a direct breach
    # of CLAUDE.md's rule that every browse view must let you read the paper as
    # it was actually sat. Instead the later copy keeps its place in its own
    # paper and records `dup_of`, so a reader browsing a sitting sees all 75
    # while anything building a random pool can collapse on that field.
    #
    # An AUTHORED (Tier 4) question that duplicates a real past question is
    # dropped outright — it adds nothing and is not part of any paper.
    seen, deduped, dropped, repeats = {}, [], [], []
    for r in rows:
        k = norm(r["q"])
        if not k:
            problems.append(f"{r['id']}: empty question text")
            continue
        first = seen.get(k)
        if first is None:
            seen[k] = r
            deduped.append(r)
            continue
        if r["src"] == "past" and first["src"] == "past":
            r = dict(r, dup_of=first["id"])
            repeats.append((r["id"], first["id"]))
            deduped.append(r)
        else:
            dropped.append((r["id"], first["id"]))

    os.makedirs(STAGED, exist_ok=True)
    out = os.path.join(STAGED, "harvest.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(deduped, f, indent=2, ensure_ascii=False)

    print(f"staged {len(deduped)} questions -> {os.path.relpath(out, os.getcwd())}")
    per = Counter(r["srcKey"] for r in deduped)
    for k in sorted(per):
        n_ver = sum(1 for r in deduped if r["srcKey"] == k and r["needs_verify"])
        n_ans = sum(1 for r in deduped if r["srcKey"] == k and r["ans"])
        print(f"  {per[k]:>4}  {k:<12} answered {n_ans:>3}  needing verification {n_ver:>3}")
    print(f"\ndropped {len(dropped)} authored question(s) that duplicate a real past question")
    for dup, kept in dropped[:10]:
        print(f"    {dup} == {kept}")
    if len(dropped) > 10:
        print(f"    … and {len(dropped) - 10} more")

    if repeats:
        print(f"\n{len(repeats)} verbatim repeat(s) ACROSS SITTINGS — kept, tagged `dup_of`, so "
              f"each paper still browses complete:")
        by_key = Counter(r.split("-")[0] + "-" + r.split("-")[1] for r, _ in repeats)
        for k in sorted(by_key):
            print(f"    {by_key[k]:>3}  in {k}")

    # Near-duplicates: REPORTED, not dropped. Exact-text dedup above is the only
    # thing safe to do automatically. Measured 2026-08-28, the two 2016 sittings
    # are essentially disjoint (1 near-match in 75x75 for Paper I, 0 for GE), so
    # BUILD_GUIDE.md's "the two sittings overlap substantially" is wrong. A
    # genuine repeat across sittings is also useful signal - it means the
    # examiner reuses it - so a human should decide, not this script.
    #
    # With five sittings this is ~1,150 questions and a naive all-pairs
    # SequenceMatcher is ~660k comparisons. Bucket on a cheap token signature
    # first so only plausible pairs reach the expensive ratio().
    keys = {r["id"]: norm(r["q"]) for r in deduped}
    buckets = defaultdict(list)
    for r in deduped:
        toks = [t for t in keys[r["id"]].split() if len(t) > 3]
        for t in set(toks[:12]):
            buckets[t].append(r)
    near, checked = [], set()
    for group in buckets.values():
        if len(group) < 2:
            continue
        for i, a in enumerate(group):
            for b in group[i + 1:]:
                if a["srcKey"] == b["srcKey"]:
                    continue
                pair = (a["id"], b["id"]) if a["id"] < b["id"] else (b["id"], a["id"])
                if pair in checked:
                    continue
                checked.add(pair)
                ka, kb = keys[a["id"]], keys[b["id"]]
                if abs(len(ka) - len(kb)) > 40:
                    continue
                if difflib.SequenceMatcher(None, ka, kb).ratio() > 0.85:
                    near.append((pair[0], pair[1], a["q"][:60]))
    if near:
        print(f"\n{len(near)} near-duplicate pair(s) across sittings — review, not auto-dropped:")
        for x, y, q in sorted(near)[:25]:
            print(f"    {x} ~ {y}  {q}")
        if len(near) > 25:
            print(f"    … and {len(near) - 25} more")

    noans = [r["id"] for r in deduped if not r["ans"]]
    if noans:
        shown = ", ".join(noans[:20]) + ("…" if len(noans) > 20 else "")
        print(f"\n{len(noans)} with no answer in source (Phase 3 must derive): {shown}")

    if quarantine:
        qp = os.path.join(STAGED, "harvest-quarantine.json")
        with open(qp, "w", encoding="utf-8") as f:
            json.dump(quarantine, f, indent=2, ensure_ascii=False)
        print(f"\n{len(quarantine)} question(s) printed in a paper but not extractable "
              f"-> staged/harvest-quarantine.json")
        for q in quarantine:
            print(f"    {q['id']}  {q['reason']}")

    if notes:
        print(f"\n{len(notes)} note(s):")
        for n in notes:
            print(f"  - {n}")

    print(f"\nstill to come: 150 from the 2016 Paper II vision pass, plus Tier 2 GE selection")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
