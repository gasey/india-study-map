#!/usr/bin/env python3
"""Build the Technical Paper I (Discrete Maths + Data Structures) study guide.

Reads the two curated data files that already back the trainer app --
`concepts.js` (definitions, facts, traps, mnemonics) and `questions.js` (the
past-question bank) -- and emits a single self-contained HTML revision guide:

    public/mpsc-system-analyst/study-guide-tech1.html

Nothing here invents exam content. Every fact card comes from concepts.js and
every question comes from questions.js, so the guide cannot drift from the bank
that the trainer quizzes from. The only hand-authored layer is
`worked_methods.py`, which holds the step-by-step drills for the question types
that need a procedure rather than a fact.

Run:  python3 tools/system-analyst-build/build_study_guide.py
"""

import html
import json
import os
import re
import sys
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from clusters import (CONCEPT_FALLBACK, DISPUTED, GENERIC_SUBS, KEYWORD_ROUTES,
                      MISFILED, QUESTION_FALLBACK, U1_CLUSTERS, U3_CLUSTERS)
from worked_methods import CRAM_SHEET, WORKED

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, "public", "mpsc-system-analyst", "data")
OUT = os.path.join(ROOT, "public", "mpsc-system-analyst", "study-guide-tech1.html")

# Networking / architecture questions that sit in the Unit 1 bucket because the
# legacy Informatics Officer paper numbered its units differently. They are real
# questions, just not Discrete Maths, so the guide leaves them out.
NON_UNIT_SUBS = {
    "Basic Networking", "TCP/IP", "Wireless Technologies", "IPv6",
    "EIGRP and OSPF", "Sub-netting", "Spanning Tree Protocol",
    "Network Address Translation", "Virtual LANs", "Security",
    "Network Devices - Switches, Router, Firewall, etc.",
    "IOS and Security Device Manager", "Internetworking", "Basic Computer System",
}


# --------------------------------------------------------------------- input

def load_js_array(filename):
    """Parse a `window.X = [ ... ];` data file into Python."""
    text = open(os.path.join(DATA, filename), encoding="utf-8").read()
    body = text[text.index("["):].rstrip().rstrip(";")
    return json.loads(body)


def route_question(q, qsub, allowed_by_unit):
    """Map a question onto a cluster id.

    Prefers the question's own `sub` tag; falls back to keyword matching for
    the ~100 questions tagged only with the unit's generic bucket name. The
    keyword pass is restricted to clusters belonging to the question's own
    unit, so a "DFS" question in Unit 1 cannot land in a Unit 3 cluster.
    """
    sub = q.get("sub") or ""
    if sub not in GENERIC_SUBS and sub in qsub:
        return qsub[sub]
    unit = q.get("unit")
    allowed = allowed_by_unit[unit]
    text = (sub + " " + q.get("q", "")).lower()
    for cid, keywords in KEYWORD_ROUTES:
        if cid in allowed and any(k in text for k in keywords):
            return cid
    return QUESTION_FALLBACK[unit]


def collect():
    concepts = load_js_array("concepts.js")
    questions = load_js_array("questions.js")

    # A mistyped id in MISFILED or DISPUTED would silently do nothing -- the
    # exclusion or the warning would just never fire, and the guide would look
    # fine while shipping the very thing the entry exists to catch.
    known = {q["id"] for q in questions}
    for name, table in (("MISFILED", MISFILED), ("DISPUTED", DISPUTED)):
        ghosts = sorted(set(table) - known)
        if ghosts:
            raise SystemExit(
                f"{name} names {len(ghosts)} question id(s) that are not in the "
                f"bank: {', '.join(ghosts)}"
            )

    clusters = U1_CLUSTERS + U3_CLUSTERS
    by_id = {c["id"]: c for c in clusters}
    allowed_by_unit = {
        "1": {c["id"] for c in U1_CLUSTERS},
        "3": {c["id"] for c in U3_CLUSTERS},
    }

    csub, qsub = {}, {}
    for c in clusters:
        for s in c["concepts"]:
            csub.setdefault(s, c["id"])
        for s in c["questions"]:
            qsub.setdefault(s, c["id"])

    grouped_concepts = defaultdict(list)
    unmapped_concepts = []
    for x in concepts:
        if x.get("paper") != "TECH1" or x.get("unit") not in ("1", "3"):
            continue
        cid = csub.get(x["sub"])
        if cid is None:
            unmapped_concepts.append(x["sub"])
            cid = CONCEPT_FALLBACK[x["unit"]]
        grouped_concepts[cid].append(x)

    grouped_questions = defaultdict(list)
    skipped_misfiled = []
    for q in questions:
        if q.get("paper") not in ("TECH1", "TECH1_LEGACY"):
            continue
        if q.get("unit") not in ("1", "3"):
            continue
        if q.get("sub") in NON_UNIT_SUBS:
            continue
        if q["id"] in MISFILED:
            skipped_misfiled.append((q["id"], MISFILED[q["id"]]))
            continue
        grouped_questions[route_question(q, qsub, allowed_by_unit)].append(q)

    # Stable, useful ordering: official-key questions first (they are the ones
    # whose answers are beyond doubt), then by id.
    for cid, qlist in grouped_questions.items():
        qlist.sort(key=lambda q: (0 if has_official_key(q) else 1, q["id"]))

    return by_id, grouped_concepts, grouped_questions, unmapped_concepts, skipped_misfiled


# ---------------------------------------------------------------- provenance

def has_official_key(q):
    """True when an official MPSC answer key backs this question's answer.

    Deliberately not a bare /official/i test: most *derived* provenance strings
    end "...no official key for this sitting", and a naive substring match badges
    those as authoritative. This mirrors the `provLine()` fix recorded in
    CLAUDE.md's known-rough-edges section -- getting it backwards would let an
    agent-guessed answer read as gospel while the user revises from it.
    """
    prov = (q.get("prov") or "").lower()
    if "no official key" in prov:
        return False
    return "official" in prov and "key" in prov


def provenance_badge(q):
    if has_official_key(q):
        return '<span class="prov prov-official">official key</span>'
    conf = (q.get("conf") or "").lower()
    if conf in ("high", "medium", "low"):
        return f'<span class="prov prov-{conf}">derived · {conf}</span>'
    return '<span class="prov prov-unrated">derived · unrated</span>'


# ----------------------------------------------------------------- rendering

def esc(s):
    return html.escape(s or "", quote=True)


def rich(s):
    """Escape, then re-enable the handful of inline markers used in the copy.

    `**bold**` and `` `code` `` only -- the source strings are plain prose from
    concepts.js plus hand-written cram-sheet rows, so a full Markdown pass would
    be more machinery than the content needs.
    """
    out = esc(s)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"`(.+?)`", r"<code>\1</code>", out)
    return out


def paragraphs(text):
    blocks = [b.strip() for b in (text or "").split("\n\n") if b.strip()]
    return "".join(f"<p>{rich(b)}</p>" for b in blocks)


def render_concept(c):
    parts = [f'<article class="concept" id="c-{esc(c["id"])}">']
    parts.append(f'<h4>{esc(c["sub"])}</h4>')

    if c.get("mnem"):
        parts.append(f'<p class="mnem"><span>Remember</span>{rich(c["mnem"])}</p>')

    if c.get("def"):
        parts.append(f'<p class="cdef">{rich(c["def"])}</p>')

    facts = c.get("facts") or []
    if facts:
        items = "".join(f"<li>{rich(f)}</li>" for f in facts)
        parts.append(f'<div class="facts"><h5>Key facts &amp; formulas</h5><ul>{items}</ul></div>')

    traps = c.get("traps") or []
    if traps:
        items = "".join(f"<li>{rich(t)}</li>" for t in traps)
        parts.append(f'<div class="traps"><h5>Traps</h5><ul>{items}</ul></div>')

    if c.get("exp"):
        parts.append(
            '<details class="deeper"><summary>Full explanation</summary>'
            f'<div class="deeper-body">{paragraphs(c["exp"])}</div></details>'
        )

    parts.append("</article>")
    return "".join(parts)


def render_question(q, n):
    disputed = DISPUTED.get(q["id"])
    opts = q.get("opts") or {}
    if opts:
        rows = "".join(
            f'<li class="{"opt-right" if k == q.get("ans") else ""}">'
            f'<b>{esc(k)}</b><span>{rich(v)}</span></li>'
            for k, v in opts.items()
        )
        options_html = f'<ol class="opts">{rows}</ol>'
        # A contested key is shown struck-through rather than as "the answer" --
        # the whole risk being managed here is the user memorising a wrong letter.
        label = "Bank's answer" if disputed else "Answer"
        answer = f'<p class="ans">{label}: <b>{esc(q.get("ans") or "—")}</b></p>'
    else:
        # Descriptive / Section-B question: no options, and the bank carries no
        # single-letter answer for it.
        options_html = '<p class="descriptive">Descriptive (Section B) — write out the full working.</p>'
        answer = ""

    exp = f'<div class="exp">{paragraphs(q.get("exp"))}</div>' if q.get("exp") else ""
    note = f'<p class="qnote">{rich(q["note"])}</p>' if q.get("note") else ""

    warning = ""
    flag = ""
    if disputed:
        warning = (
            f'<div class="disputed"><h6>Do not memorise this answer</h6>'
            f"<p>{rich(disputed)}</p></div>"
        )
        flag = '<span class="flag">contested key</span>'

    return (
        f'<li class="q{" q-disputed" if disputed else ""}" data-qid="{esc(q["id"])}">'
        f'<div class="qhead"><span class="qn">{n}</span>'
        f'<div class="qtext">{rich(q.get("q"))}{flag}</div></div>'
        f"{options_html}"
        f'<details class="reveal"><summary>Show answer</summary>'
        f'<div class="reveal-body">{warning}{answer}{exp}{note}'
        f'<p class="qmeta">{provenance_badge(q)}'
        f'<span class="sitting">{esc(q.get("sitting"))}</span>'
        f'<span class="qid">{esc(q["id"])}</span></p>'
        f"</div></details></li>"
    )


def render_cluster(cluster, concepts, questions):
    cid = cluster["id"]
    parts = [f'<section class="cluster" id="{esc(cid)}" data-cluster="{esc(cid)}">']
    parts.append(
        f'<div class="cluster-head">'
        f'<h3>{esc(cluster["title"])}</h3>'
        f'<label class="done"><input type="checkbox" data-done="{esc(cid)}"> revised</label>'
        f"</div>"
    )
    parts.append(
        f'<p class="blurb">{rich(cluster["blurb"])}</p>'
        f'<p class="counts">'
        f'<span class="pill">{len(concepts)} concept cards</span>'
        f'<span class="pill">{len(questions)} past questions</span></p>'
    )

    if cid in WORKED:
        parts.append('<div class="worked"><h4>Worked method</h4>')
        for w in WORKED[cid]:
            steps = "".join(f"<li>{rich(s)}</li>" for s in w["steps"])
            example = (
                f'<div class="wex"><h6>Worked example</h6>{paragraphs(w["example"])}</div>'
                if w.get("example") else ""
            )
            parts.append(
                f'<div class="method"><h5>{rich(w["title"])}</h5>'
                f'<ol class="steps">{steps}</ol>{example}</div>'
            )
        parts.append("</div>")

    if concepts:
        parts.append('<div class="concepts">')
        parts.extend(render_concept(c) for c in concepts)
        parts.append("</div>")

    if questions:
        items = "".join(render_question(q, i + 1) for i, q in enumerate(questions))
        parts.append(
            f'<details class="qbank"><summary>Past questions from this topic '
            f'<b>({len(questions)})</b></summary><ol class="qlist">{items}</ol></details>'
        )

    parts.append("</section>")
    return "".join(parts)


def render_cram(section):
    parts = [f'<div class="cram-block"><h3>{rich(section["title"])}</h3>']
    if section.get("note"):
        parts.append(f'<p class="cram-note">{rich(section["note"])}</p>')
    head = "".join(f"<th>{rich(h)}</th>" for h in section["cols"])
    rows = "".join(
        "<tr>" + "".join(f"<td>{rich(cell)}</td>" for cell in row) + "</tr>"
        for row in section["rows"]
    )
    parts.append(
        f'<div class="tablewrap"><table class="cram">'
        f"<thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>"
    )
    parts.append("</div>")
    return "".join(parts)


# --------------------------------------------------------------------- build

def build():
    by_id, gc, gq, unmapped, misfiled = collect()

    n_concepts = sum(len(v) for v in gc.values())
    n_questions = sum(len(v) for v in gq.values())

    def part(clusters, title, subtitle, marks):
        secs = "".join(render_cluster(c, gc.get(c["id"], []), gq.get(c["id"], []))
                       for c in clusters)
        return (
            f'<div class="part">'
            f'<h2 class="part-title">{esc(title)}'
            f'<span class="marks">{esc(marks)}</span></h2>'
            f'<p class="part-sub">{esc(subtitle)}</p>{secs}</div>'
        )

    nav_items = []
    for label, clusters in (("Discrete Maths", U1_CLUSTERS), ("Data Structures", U3_CLUSTERS)):
        links = "".join(
            f'<a href="#{esc(c["id"])}">{esc(c["title"])}'
            f'<span>{len(gq.get(c["id"], []))}</span></a>'
            for c in clusters
        )
        nav_items.append(f'<div class="navgroup"><h4>{esc(label)}</h4>{links}</div>')

    cram = "".join(render_cram(s) for s in CRAM_SHEET)

    doc = HTML_SHELL.format(
        nav="".join(nav_items),
        cram=cram,
        part1=part(U1_CLUSTERS, "Part 1 — Discrete Mathematics",
                   "Unit 1 of Technical Paper I.", "40 marks"),
        part3=part(U3_CLUSTERS, "Part 2 — Data Structures and Algorithms",
                   "Unit 3 of Technical Paper I.", "60 marks"),
        n_concepts=n_concepts,
        n_questions=n_questions,
        n_clusters=len(U1_CLUSTERS) + len(U3_CLUSTERS),
    )

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(doc)

    print(f"wrote {os.path.relpath(OUT, ROOT)}")
    print(f"  {len(U1_CLUSTERS) + len(U3_CLUSTERS)} clusters, "
          f"{n_concepts} concepts, {n_questions} questions, "
          f"{os.path.getsize(OUT) / 1024:.0f} KB")

    shown = {q["id"] for qlist in gq.values() for q in qlist}
    flagged = sorted(set(DISPUTED) & shown)
    print(f"  {len(flagged)} questions carry a contested-key warning")

    if unmapped:
        print("\n  WARNING: concept subs not named in clusters.py "
              "(they landed in the fallback cluster):")
        for sub, n in Counter(unmapped).most_common():
            print(f"    {n}x {sub}")
    if misfiled:
        print(f"\n  excluded {len(misfiled)} questions as mis-tagged "
              f"(not Unit 1/3 material):")
        for qid, why in misfiled:
            print(f"    {qid}: {why}")

    # A DISPUTED entry for a question the guide never renders is dead weight --
    # most likely it names a question that MISFILED already excluded.
    orphaned = sorted(set(DISPUTED) - shown)
    if orphaned:
        print("\n  note: DISPUTED entries for questions the guide does not show "
              "(already excluded elsewhere):")
        for qid in orphaned:
            print(f"    {qid}")


HTML_SHELL = """<!DOCTYPE html>
<html lang="en" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Technical Paper I — Discrete Maths &amp; Data Structures | Study Guide</title>
<link rel="stylesheet" href="study-guide.css">
</head>
<body>

<header class="gtop">
  <div class="gtop-in">
    <div class="gbrand">
      <strong>Technical Paper I — Study Guide</strong>
      <em>Discrete Mathematics &amp; Data Structures · MPSC System Analyst</em>
    </div>
    <div class="gtools">
      <input id="search" type="search" placeholder="Search formulas, facts, questions…" autocomplete="off">
      <button id="themeBtn" class="icon-btn" title="Toggle theme">&#9686;</button>
      <button id="printBtn" class="icon-btn" title="Print / save as PDF">&#9113;</button>
    </div>
  </div>
  <div class="gstats">
    <span><b>100</b> of 200 marks</span>
    <span><b>{n_clusters}</b> topics</span>
    <span><b>{n_concepts}</b> concept cards</span>
    <span><b>{n_questions}</b> past questions</span>
    <span class="prog"><b id="progCount">0</b> revised</span>
  </div>
</header>

<div class="glayout">
  <aside class="gnav" id="gnav">
    <a class="navtop" href="#cram">Formula cram sheet</a>
    {nav}
    <button id="resetProg" class="reset">Reset revised ticks</button>
  </aside>

  <main class="gmain">
    <section class="intro">
      <h1>The two units that decide this paper</h1>
      <p>Technical Paper I is 200 marks. Discrete Mathematics (40) and Data
      Structures &amp; Algorithms (60) are <strong>half of it</strong> — more than
      Computer Architecture or Operating Systems alone. They are also the two
      most formula-driven units, which makes them the most reliably scoreable:
      a question you can answer with a memorised formula costs you fifteen
      seconds, not two minutes.</p>
      <p>This guide is built from the same question bank the trainer app quizzes
      you from — {n_questions} real past questions from the MPSC sittings,
      grouped into the {n_clusters} topics they actually cluster into. Each topic
      gives you the formulas first, the traps second, and the real questions
      last, so you can check immediately whether the formula stuck.</p>
      <p class="howto"><b>How to use it:</b> read the cram sheet until the
      formulas are cold, then work one topic at a time — method, cards, then the
      past questions with answers hidden. Tick <em>revised</em> as you clear each
      topic; the ticks persist in this browser.</p>
    </section>

    <section class="cramsheet" id="cram">
      <h2 class="part-title">Formula cram sheet<span class="marks">print this</span></h2>
      <p class="part-sub">Everything the past papers have actually required you
      to recall, on one page. If you learn nothing else, learn this.</p>
      {cram}
    </section>

    {part1}
    {part3}

    <footer class="gfoot">
      <p>Generated from <code>data/concepts.js</code> and <code>data/questions.js</code>
      by <code>tools/system-analyst-build/build_study_guide.py</code>. Edit those
      sources and rebuild — do not hand-edit this file.</p>
      <p class="warn">Answers marked <span class="prov prov-official">official key</span>
      come from a published MPSC answer key. Answers marked
      <span class="prov prov-high">derived</span> were worked out for sittings with
      no published key and can be wrong — check anything that surprises you against
      the source paper before you commit it to memory.</p>
    </footer>
  </main>
</div>

<script src="study-guide.js"></script>
</body>
</html>
"""


if __name__ == "__main__":
    build()
