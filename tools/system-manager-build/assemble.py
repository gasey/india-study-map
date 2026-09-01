#!/usr/bin/env python3
"""
Phase 2 final step — assemble every harvested source into
public/mpsc-system-manager/data/questions.js.

Inputs (whatever exists; missing ones are reported, not fatal):
  staged/harvest.json        Tier 1 bank papers + Tier 4 authored (harvest.py)
  extracted/*.json           Paper II vision pass (EXTRACT_BRIEF.md)
  staged/tags.json           {questionId: {"unit": "...", "sub": "..."}} from the
                             tagging pass. Optional - without it questions ship
                             untagged, which the app tolerates (the unit/sub
                             pills just don't render and Practice can't filter
                             by unit).

Output:
  public/mpsc-system-manager/data/questions.js    window.QUESTIONS = [...]
  staged/quarantine.json                          excluded questions + why

QUARANTINE POLICY - excluded from the app, kept in the quarantine file:
  * needs_figure  the question depends on a printed diagram the text-only schema
                  cannot carry. Shipping it would show the reader an
                  unanswerable question. Flagged, never silently dropped.
  * no answer     `ans` missing; nothing to teach.
Low-confidence answers are NOT quarantined - they ship with a visible
`derived - low confidence` badge, which is the honest presentation.

Usage:  python3 tools/system-manager-build/assemble.py
"""

import glob
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
STAGED = os.path.join(HERE, "staged")
EXTRACTED = os.path.join(HERE, "extracted")
OUT = os.path.join(ROOT, "public", "mpsc-system-manager", "data", "questions.js")

LETTERS = ["A", "B", "C", "D"]

# srcKey -> (sitting label, app paper id) for the vision-extracted papers
P2_META = {
    "CO2016A-P2": ("Computer Operator (Contract) under SAD, 2016 - Technical Paper II", "TECH2"),
    "CO2016B-P2": ("Computer Operator (CB) under Mizoram Information Commission, 2016 - Paper II", "TECH2"),
}

# --- UDC / Assistant / Group B clerical papers -------------------------------
# These sit in the app as their own `UDC` paper. They are NOT Computer Operator
# papers: they are the Basic Computer Knowledge section of the Group B
# non-gazetted clerical exams, which is easier material at the same subject
# spread, and useful as warm-up drill.
#
# `official` is the important field. Every other source in this pipeline is
# answered by derivation because MPSC never published a key for the Computer
# Operator papers — but the Commission DID publish one for the April 2024
# Assistant & UDC sitting, so those 35 answers are the only ones in the whole
# bank that are authoritative rather than inferred. provLine() in app.js decides
# the blue "official key" badge by testing the prov string, so the string built
# below must say "official" for those and must NOT say it for the rest.
#
# srcKey -> (sitting label, official-key-exists, key citation)
UDC_META = {
    "UDC2025MAY-P2": (
        "Combined UDC Examination under Various Departments, May 2025 — Paper-II "
        "(Basic Computer Knowledge), Series A, Q1-35",
        False,
        None,
    ),
    "UDCASST2024APR-P2": (
        "Assistant Grade & Upper Division Clerk under MPSC, Combined Competitive "
        "Examination, April 2024 — Paper-II (Basic Computer Knowledge), Q1-35",
        True,
        "MPSC Provisional Answer Key, notification No.ASST/1/2019-MPSC dated 5 April 2024",
    ),
}


# --- MUDAL Technical Paper I practice volumes --------------------------------
# Two authored practice question banks written against the real Technical Paper I
# syllabus, at its exact five-unit split and marks weighting. They ship as their
# own `TECH1P` paper rather than being folded into TECH1, for one reason: TECH1
# holds 75 genuine 2016 Computer Operator questions, and the Mock Test tab draws
# a simulated paper from TECH1 + TECH2. Merging 349 authored questions into TECH1
# would mean a "past paper" mock was 82% invented material.
#
# These are the LEAST authoritative questions in the app. Every other source is
# at least a paper MPSC actually set; these were authored, and their own answer
# key was wrong on at least one question that an independent re-derivation caught
# (see CORRECTIONS in import_practice.py). The prov string below therefore says
# plainly that no official key exists — which also keeps provLine()'s negation
# guard from awarding them the blue "official key" badge.
#
# srcKey -> (volume label, source filename)
PRACTICE_META = {
    "MUDALPRAC-V1": (
        "MUDAL System Manager Technical Paper I — Practice Question Bank, Volume 1",
        "sources/practice-tech1-vol1.md",
    ),
    "MUDALPRAC-V2": (
        "MUDAL System Manager Technical Paper I — Practice Question Bank, Volume 2",
        "sources/practice-tech1-vol2.md",
    ),
}


def load_taxonomy():
    path = os.path.join(STAGED, "taxonomy.json")
    if not os.path.isfile(path):
        return None
    rows = json.load(open(path, encoding="utf-8"))
    return {(r["paper"], r["unit"], r["sub"]) for r in rows}, \
           {r["sub"] for r in rows}


def main(force=False):
    problems, notes = [], []
    rows = []

    # --- staged harvest (Tier 1 bank + Tier 4) ---
    hp = os.path.join(STAGED, "harvest.json")
    if os.path.isfile(hp):
        rows.extend(json.load(open(hp, encoding="utf-8")))
    else:
        notes.append("staged/harvest.json missing - run harvest.py")

    # --- vision-extracted Paper II ---
    for path in sorted(glob.glob(os.path.join(EXTRACTED, "*.json"))):
        key = os.path.splitext(os.path.basename(path))[0]
        if key not in P2_META:
            problems.append(f"{key}: unknown srcKey, not in P2_META")
            continue
        sitting, paper = P2_META[key]
        data = json.load(open(path, encoding="utf-8"))
        if len(data) != 75:
            problems.append(f"{key}: {len(data)} questions, expected 75")
        for r in data:
            rows.append({
                "id": f"{key}-{r['no']}",
                "src": "past",
                "srcKey": key,
                "sitting": sitting,
                "no": r["no"],
                "paper": paper,
                "unit": None,
                "sub": None,
                "q": r["q"],
                "opts": r["opts"],
                "ans": r.get("ans"),
                "exp": r.get("exp", ""),
                "conf": r.get("conf"),
                "prov": f"Transcribed and answered from the scanned {sitting}. "
                        f"MPSC published no answer key for this paper.",
                "needs_verify": False,   # the vision pass IS the derivation
                "needs_figure": bool(r.get("needs_figure")),
                "note": "",
                "_tier": 1,
                "_page": r.get("page"),
            })
    if not glob.glob(os.path.join(EXTRACTED, "*.json")):
        notes.append("extracted/ empty - run the Paper II vision pass")

    # --- Phase 4 authored questions for uncovered syllabus leaves ---
    # These are the only practice material for subtopics no past paper covers -
    # TECH2 Unit IV is 30 marks with zero past-paper questions. They arrive
    # pre-tagged (the generator worked from the taxonomy), so they skip the
    # tagging step below.
    gp = os.path.join(STAGED, "generated.json")
    if os.path.isfile(gp):
        gen = json.load(open(gp, encoding="utf-8"))
        for g in gen:
            rows.append({
                "id": g["id"], "src": "generated", "srcKey": f"GEN-{g['paper']}-U{g['unit']}",
                "sitting": "Authored to cover a syllabus subtopic with no past-paper coverage",
                "no": None, "paper": g["paper"], "unit": g["unit"], "sub": g["sub"],
                "q": g["q"], "opts": g["opts"], "ans": g["ans"],
                "exp": g["exp"], "conf": g.get("conf", "high"),
                "prov": "Authored from the syllabus — MUDAL added this subtopic in the "
                        "July 2026 update and no past paper covers it. Not a past question.",
                "needs_verify": False, "needs_figure": False, "note": "",
                "_tier": 4,
            })
        notes.append(f"added {len(gen)} Phase 4 authored questions")
    else:
        notes.append("staged/generated.json missing — run the Phase 4 generation pass")

    # --- UDC / Assistant / Group B clerical papers ---
    # Transcribed from the source papers in the mpsc-question-bank repo (see
    # UDC_META for the exact sitting each srcKey names). These arrive pre-tagged
    # because the tagging was done against the UDC paper's own unit list, which
    # the technical taxonomy does not contain — so they skip the tags.json step
    # below, exactly as the Phase 4 authored questions do.
    #
    # This block exists because these 70 questions previously lived as hand-typed
    # entries inside questions.js and syllabus.js, both of which carry a
    # "GENERATED — do not hand-edit" header. Nothing in the pipeline knew they
    # were there, so the next assemble.py run would have silently erased the
    # paper and every question in it — the same class of loss as the 2026-08-04
    # incident. Editing staged/udc.json is now the supported way to change them.
    up_ = os.path.join(STAGED, "udc.json")
    if os.path.isfile(up_):
        udc = json.load(open(up_, encoding="utf-8"))
        n_official = 0
        for u in udc:
            key = u["srcKey"]
            if key not in UDC_META:
                problems.append(f"{key}: unknown UDC srcKey, not in UDC_META")
                continue
            sitting, official, citation = UDC_META[key]
            if official:
                prov = (f"Answer taken from the official {citation}. "
                        f"Transcribed from {sitting}.")
                n_official += 1
            else:
                prov = (f"Transcribed from {sitting}. MPSC published no official "
                        f"answer key for this sitting; the answer is derived.")
            rows.append({
                "id": f"{key}-{u['no']}",
                "src": "past",
                "srcKey": key,
                "sitting": sitting,
                "no": u["no"],
                "paper": "UDC",
                "unit": u.get("unit"), "sub": u.get("sub"),
                "q": u["q"], "opts": u["opts"], "ans": u.get("ans"),
                "exp": u.get("exp", ""),
                # An official key is authoritative, so it is not "high confidence
                # in a guess" — but `conf` still has to be set, because provLine()
                # falls through to "derived · unrated" when it is absent.
                "conf": u.get("conf", "high"),
                "prov": prov,
                "needs_verify": False, "needs_figure": False,
                "note": u.get("note", ""),
                "_tier": 1,
            })
            # `alt` renders app.js's DISPUTED block, whose copy reads "No official
            # answer key exists for this paper — decide for yourself". That is
            # true of an unkeyed paper and false of a keyed one, so attaching it
            # to an official-key question puts a flat contradiction directly above
            # the blue "official key" badge, and invites the reader to pick the
            # option the Commission marks wrong. Where a key exists it settles the
            # answer; any residual doubt belongs in `note`, which prints as prose
            # on the same line rather than as a two-column stand-off.
            if u.get("alt") and not official:
                rows[-1]["alt"] = u["alt"]
                rows[-1]["altSrc"] = "solver"
        notes.append(f"added {len(udc)} UDC/Assistant clerical questions "
                     f"({n_official} answered from an official MPSC key)")
    else:
        notes.append("staged/udc.json missing — the UDC paper will not ship")

    # --- MUDAL Technical Paper I practice volumes ---
    # Written by import_practice.py from the markdown in sources/. Pre-tagged
    # against the real TECH1 taxonomy, so they skip the tags.json step below the
    # same way the Phase 4 authored questions and the UDC paper do.
    pp = os.path.join(STAGED, "practice-tech1.json")
    if os.path.isfile(pp):
        prac = json.load(open(pp, encoding="utf-8"))
        n_corrected = 0
        for p in prac:
            key = p["srcKey"]
            if key not in PRACTICE_META:
                problems.append(f"{key}: unknown practice srcKey, not in PRACTICE_META")
                continue
            label, source = PRACTICE_META[key]
            prov = (f"Authored practice question, {label}, Unit {p['unit']} Q{p['no']}. "
                    f"Not a past paper — no official MPSC answer key exists for it. "
                    f"Source markdown is kept in the repo at "
                    f"tools/system-manager-build/{source}; every answer was "
                    f"independently re-derived and diffed against the volume's own key "
                    f"before import.")
            if p.get("srcAns"):
                # The volume's key and the re-derivation disagreed, and the
                # re-derivation won. Say so in the provenance itself, not only in
                # the note — a reader who trusts the printed volume needs to know
                # this app deliberately departs from it here.
                prov += (f" The volume's key gives ({p['srcAns'].lower()}); that is wrong "
                         f"and the answer shown here is corrected.")
                n_corrected += 1
            rows.append({
                "id": f"{key}-{p['unit']}-{p['no']}",
                # `generated` is the existing src for authored practice material and
                # is what the Practice tab's "Authored practice only" filter selects.
                # A new src value would have been silently unreachable from that
                # dropdown, which lists only 'past' and 'generated'.
                "src": "generated",
                "srcKey": key,
                "sitting": label,
                "no": p["no"],
                "paper": "TECH1P",
                "unit": p["unit"], "sub": p.get("sub"),
                "q": p["q"], "opts": p["opts"], "ans": p.get("ans"),
                "exp": p.get("exp", ""),
                "conf": p.get("conf", "high"),
                "prov": prov,
                "needs_verify": False, "needs_figure": False,
                "note": p.get("note", ""),
                "_tier": 4,
            })
        notes.append(f"added {len(prac)} MUDAL Technical Paper I practice questions "
                     f"({n_corrected} with the volume's own answer key corrected)")
    else:
        notes.append("staged/practice-tech1.json missing — run import_practice.py")

    # --- apply Phase 3 verified answers ---
    # solve.py re-derived these blind and diffed against the bank's inferred
    # answer. Where the two agree the answer is corroborated by two independent
    # derivations; where they disagree solve.py has already capped confidence and
    # written a prov string saying so. Overwrite the bank's answer with the
    # verified one, since the bank's was never checked by anyone.
    solved = {}
    sp = os.path.join(STAGED, "solved.json")
    if os.path.isfile(sp):
        solved = json.load(open(sp, encoding="utf-8"))
    else:
        notes.append("staged/solved.json missing — the bank's unverified answers ship "
                     "as `derived · unrated`; run the Phase 3 solve pass")

    n_applied = n_flipped = 0
    for r in rows:
        s = solved.get(r["id"])
        if not s:
            continue
        if r.get("ans") and s["ans"] != r["ans"]:
            n_flipped += 1
        r["ans"] = s["ans"]
        r["conf"] = s["conf"]
        r["exp"] = s["exp"]
        r["prov"] = s["prov"]
        # Where two derivations disagree, carry the rival answer as `alt` so the
        # app can show BOTH and let a human judge, rather than burying the
        # conflict in a prose provenance line. The rival is normally the bank's
        # inferred answer; for papers the bank never answered it is a second
        # blind solve, which solve.py records as `alt_ans`. `bank_ans` is still
        # read so solved.json files written before that change keep working.
        if s.get("agreement") == "disagree":
            rival = s.get("alt_ans") or s.get("bank_ans")
            if rival:
                r["alt"] = rival
                # Tell the UI WHERE the rival came from. `bank_ans` is set only
                # when the question bank actually held an answer; where it did
                # not, the rival is a second blind solve. app.js labels the row
                # from this, so a missing altSrc would credit the bank with an
                # answer it never had.
                r["altSrc"] = "bank" if s.get("bank_ans") else "solver"
        if s.get("note"):
            r["note"] = s["note"]
        r["needs_verify"] = False
        n_applied += 1
    if n_applied:
        notes.append(f"applied {n_applied} Phase 3 verified answers "
                     f"({n_flipped} changed the bank's answer)")

    # --- apply recovered underline markers (SAD GE Q39-44) ---
    # The bank lost the underline for exactly the block where the underline IS the
    # question. Recovered by eye from a render of the source page; see
    # patch_underlines.py. Applied AFTER the Phase 3 solve so it overrides it —
    # the solver was working from an ambiguous stem and could not have known which
    # word was marked.
    up = os.path.join(STAGED, "underline_patch.json")
    if os.path.isfile(up):
        patch = json.load(open(up, encoding="utf-8"))
        n_pat = 0
        for r in rows:
            p = patch.get(r["id"])
            if not p:
                continue
            word = p["underline"]
            # Mark the word in the stem so the reader can see what is being asked.
            if f"__{word}__" not in r["q"]:
                import re as _re
                r["q"] = _re.sub(rf"\b{_re.escape(word)}\b", f"__{word}__", r["q"], count=1)
            r["ans"], r["conf"], r["exp"] = p["ans"], p["conf"], p["exp"]
            r["prov"], r["note"] = p["prov"], p["note"]
            n_pat += 1
        if n_pat:
            notes.append(f"applied {n_pat} recovered underline markers (SAD GE Q39-44)")

    # Any question still asking about "the underlined word" with no marker present
    # is unanswerable. QUARANTINE it — the reader must never see it — but do not
    # fail the build.
    #
    # This used to be a hard failure, which was right while the only GE papers
    # were the two 2016 sittings: recovery had been done for both, so any hit
    # meant a regression. With five sittings that no longer holds — a newly added
    # paper has simply not had its underline-recovery pass yet, and failing the
    # whole build blocks ~500 sound questions on a handful of unrecovered ones.
    # Quarantine is the policy this file already states for unanswerable rows:
    # flagged and excluded, never silently dropped.
    n_nomark = 0
    for r in rows:
        if re.search(r"underlined?\s+word", r["q"], re.I) and "__" not in r["q"]:
            r["_no_underline"] = True
            n_nomark += 1
    if n_nomark:
        notes.append(f"{n_nomark} question(s) ask about an underlined word whose marker the "
                     f"extractor lost — quarantined. Recovering them needs a page render "
                     f"read by eye, as patch_underlines.py did for SAD GE Q39-44.")

    # --- attach comprehension passages ---
    # The bank dropped every reading passage, leaving 32 GE comprehension
    # questions unanswerable. extract_passages.py recovers them from the source
    # PDFs; match by srcKey + question number.
    passages = {}
    pp = os.path.join(STAGED, "passages.json")
    if os.path.isfile(pp):
        for pid, p in json.load(open(pp, encoding="utf-8")).items():
            for qno in p["questions"]:
                passages[(p["srcKey"], qno)] = {"id": pid, "title": p["title"],
                                                "text": p["text"]}
    else:
        notes.append("staged/passages.json missing — run extract_passages.py, or the "
                     "32 GE comprehension questions ship unanswerable")

    for r in rows:
        p = passages.get((r["srcKey"], r["no"]))
        if p:
            r["passage"] = p["text"]
            r["passageTitle"] = p["title"]
            r["passageId"] = p["id"]

    # A comprehension question with no passage is unanswerable. Quarantine rather
    # than fail, for the same reason as the underline check above:
    # extract_passages.py has only been run over the two 2016 sittings, so a
    # newly added paper legitimately has no passages yet.
    n_nopass = 0
    for r in rows:
        if r.get("passage"):
            continue
        if re.search(r"\bin the passage\b|\baccording to the passage\b", r["q"], re.I):
            r["_no_passage"] = True
            n_nopass += 1
    if n_nopass:
        notes.append(f"{n_nopass} question(s) reference a reading passage that was never "
                     f"extracted — quarantined. extract_passages.py currently covers only "
                     f"the two 2016 sittings; it needs extending to the 2018/2019 papers.")

    # --- apply tags if the tagging pass has run ---
    tags = {}
    tp = os.path.join(STAGED, "tags.json")
    if os.path.isfile(tp):
        tags = json.load(open(tp, encoding="utf-8"))
    else:
        notes.append("staged/tags.json missing - questions will ship untagged")

    tax = load_taxonomy()
    for r in rows:
        t = tags.get(r["id"])
        if not t:
            continue
        r["unit"], r["sub"] = t.get("unit"), t.get("sub")
        if tax and r["sub"] is not None:
            if (r["paper"], str(r["unit"]), r["sub"]) not in tax[0]:
                problems.append(f"{r['id']}: tag ({r['paper']}, {r['unit']}, {r['sub']!r}) "
                                f"is not a leaf in the taxonomy")

    # --- quarantine ---
    ship, quar = [], []
    for r in rows:
        why = []
        if r.get("needs_figure"):
            why.append("depends on a printed figure the text-only schema cannot carry")
        if r.get("_no_underline"):
            why.append("asks about an underlined word but the marker was lost in extraction")
        if r.get("_no_passage"):
            why.append("references a reading passage that was never extracted")
        if not r.get("ans") or r["ans"] not in LETTERS:
            why.append(f"no usable answer (ans={r.get('ans')!r})")
        if why:
            quar.append({**r, "_quarantine": why})
        else:
            ship.append(r)

    # --- integrity checks on what ships ---
    ids = [r["id"] for r in ship]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        problems.append(f"duplicate question ids shipping: {dupes}")
    for r in ship:
        # Options must be a contiguous prefix of A-D — some questions genuinely
        # print only three (the sentence-analysis blocks in both GE papers). What
        # must NOT happen is a padded placeholder: the bank stores a literal null
        # as a 4th option there, and stringifying it produced a fabricated option
        # reading "None", indistinguishable to a reader from "None of these".
        keys = sorted((r.get("opts") or {}).keys())
        if keys not in (LETTERS[:2], LETTERS[:3], LETTERS):
            problems.append(f"{r['id']}: option keys {keys} — must be a prefix of {LETTERS}")
        for k, v in (r.get("opts") or {}).items():
            if str(v).strip() in ("None", "null", ""):
                problems.append(f"{r['id']}: option {k} is a placeholder ({v!r}) — the "
                                f"source paper does not print it")
        if r.get("ans") and r["ans"] not in keys:
            problems.append(f"{r['id']}: ans={r['ans']} but only options {keys} exist")
        if not (r.get("q") or "").strip():
            problems.append(f"{r['id']}: empty question text")
        # Detect leftover FORMATTING markup (the jso-prep `<p>…</p>` case), which
        # app.js would render as literal tags. Match only CLOSING tags: the Web
        # Technologies explanations legitimately name elements in prose ("<H1>
        # through <H6>", "<OL> creates an ordered list"), and those are correct as
        # escaped visible text. An opening-tag or bare "<[a-z]" test flags all of
        # them; a closing tag is the thing prose never writes.
        if r.get("exp") and re.search(r"</[a-z]+\s*>", r["exp"], re.I):
            problems.append(f"{r['id']}: explanation contains HTML formatting markup — "
                            f"app.js esc()s `exp`, so tags would render literally")

    # --- write ---
    public = [{k: v for k, v in r.items() if not k.startswith("_")
               and k not in ("needs_verify", "needs_figure")} for r in ship]
    n_alt = sum(1 for r in public if r.get("alt"))
    if n_alt:
        notes.append(f"{n_alt} question(s) ship with a disputed alternative answer "
                     f"(`alt`) for the reader to judge")

    # VALIDATE BEFORE WRITING. This used to write here and only report
    # `problems` at the very end, after the success summary — so a run that
    # exited 1 had already overwritten questions.js, and the exit code was the
    # only thing standing between a rejected row and the reader. That is the
    # same validate-after-write bug fixed in generate.py on 2026-08-31 (see
    # DEVLOG); it was still live in this file and shipped 1,363 questions from
    # a failing run on 2026-08-31 before being caught. Nothing is written now
    # while any row is rejected. --force still allows it, and says what it is
    # about to let through.
    if problems and not force:
        print(f"\n{len(problems)} PROBLEM(S) — NOTHING WRITTEN. "
              f"{os.path.relpath(OUT, os.getcwd())} is unchanged.", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print(f"\nFix these, or re-run with --force to ship anyway.", file=sys.stderr)
        sys.exit(1)
    if problems and force:
        print(f"\n--force: writing anyway despite {len(problems)} problem(s):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* GENERATED by tools/system-manager-build/assemble.py — do not hand-edit.\n"
                "   Sources: all five Computer Operator sittings MPSC has examined (Tier 1),\n"
                "   the UDC/Assistant clerical Basic Computer Knowledge papers, and authored\n"
                "   questions. No official answer key exists for any Computer Operator paper,\n"
                "   so those answers are derived and carry a `conf` rating surfaced in the UI.\n"
                "   The April 2024 Assistant & UDC sitting is the one exception — MPSC did\n"
                "   publish a key for it, and those answers are authoritative.\n"
                "   Re-run the pipeline to regenerate. */\n")
        f.write("window.QUESTIONS = " + json.dumps(public, indent=2, ensure_ascii=False) + ";\n")

    with open(os.path.join(STAGED, "quarantine.json"), "w", encoding="utf-8") as f:
        json.dump(quar, f, indent=2, ensure_ascii=False)

    # --- report ---
    print(f"wrote {len(public)} questions -> {os.path.relpath(OUT, os.getcwd())}")
    per = Counter(r["srcKey"] for r in ship)
    for k in sorted(per):
        confs = Counter(r.get("conf") for r in ship if r["srcKey"] == k)
        cs = " ".join(f"{c or 'unrated'}:{n}" for c, n in sorted(confs.items(), key=lambda x: str(x[0])))
        print(f"  {per[k]:>4}  {k:<12} {cs}")
    byp = Counter(r["paper"] for r in ship)
    print("\nby paper: " + "  ".join(f"{k} {v}" for k, v in sorted(byp.items())))
    tagged = sum(1 for r in ship if r.get("sub"))
    print(f"tagged to a leaf subtopic: {tagged}/{len(ship)}")
    withexp = sum(1 for r in ship if (r.get("exp") or "").strip())
    print(f"with an explanation: {withexp}/{len(ship)}")

    if quar:
        print(f"\nquarantined {len(quar)} -> staged/quarantine.json")
        for r in quar:
            print(f"    {r['id']}: {'; '.join(r['_quarantine'])}")

    for n in notes:
        print(f"\nNOTE: {n}")


if __name__ == "__main__":
    main(force="--force" in sys.argv[1:])
