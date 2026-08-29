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


def load_taxonomy():
    path = os.path.join(STAGED, "taxonomy.json")
    if not os.path.isfile(path):
        return None
    rows = json.load(open(path, encoding="utf-8"))
    return {(r["paper"], r["unit"], r["sub"]) for r in rows}, \
           {r["sub"] for r in rows}


def main():
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
    # is unanswerable — fail rather than ship it.
    for r in rows:
        if re.search(r"underlined?\s+word", r["q"], re.I) and "__" not in r["q"]:
            problems.append(f"{r['id']}: asks about an underlined word but no "
                            f"__marker__ survives — unanswerable as stored")

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

    # A comprehension question with no passage is unanswerable — catch any that
    # reference one but didn't get matched, rather than shipping them silently.
    for r in rows:
        if r.get("passage"):
            continue
        if re.search(r"\bin the passage\b|\baccording to the passage\b", r["q"], re.I):
            problems.append(f"{r['id']}: references a passage but none attached")

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

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* GENERATED by tools/system-manager-build/assemble.py — do not hand-edit.\n"
                "   Sources: the 2016 Computer Operator papers (Tier 1) and authored questions.\n"
                "   No official answer key exists for the Computer Operator papers; every\n"
                "   answer here is derived and carries a `conf` rating surfaced in the UI.\n"
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

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
