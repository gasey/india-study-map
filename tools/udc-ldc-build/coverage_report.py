#!/usr/bin/env python3
"""Coverage report for the held backlog.

Answers one question: of the held ("sourceReview") MCQs, how many can be
unlocked from evidence that already exists on disk, versus how many still need
fresh derivation?

Evidence considered (all read-only):

  1. Official key PDFs already downloaded into the sibling workbench
     (``mpsc-question-bank/pdfs/Answer_Keys/``) that are not yet registered in
     this repo's ``verified-general-keys.json``.
  2. The upstream solved-answer corpora: ``bank/mpsc_bank_v2.json`` (question
     stem -> answer) and ``state/**/*.solved.json`` (paper label + qnum ->
     answer).

Outputs (written next to the tool and at the repo root):

  - ``tools/udc-ldc-build/coverage-report.json``
  - ``COVERAGE-REPORT.md``

Tiering, per held MCQ:

  Tier 1  its paper already has an official key (registered, or on disk and
          ready to register) -> mechanically scorable.
  Tier 2  a hash/option-verified upstream answer exists -> import, then verify.
  Tier 3  neither -> needs fresh derivation.

Run:  python3 tools/udc-ldc-build/coverage_report.py
Env:  MPSC_QB_UPSTREAM=/path/to/mpsc-question-bank   (override sibling path)
"""
from __future__ import annotations

import collections
import glob
import hashlib
import json
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent          # tools/udc-ldc-build
REPO = HERE.parents[1]                           # repo root
SITE_BANK = REPO / "src/data/banks/mpsc-group-b-general.ts"
LIBRARY = REPO / "src/data/banks/mpsc-group-b-library.json"
KEYS_REG = HERE / "verified-general-keys.json"
UPSTREAM = Path(os.environ.get(
    "MPSC_QB_UPSTREAM", str(REPO.parent / "mpsc-question-bank")))

STOP = {
    "pdf", "answer", "key", "final", "provisional", "corrigendum", "under",
    "dept", "deptt", "department", "departments", "of", "the", "for", "and",
    "services", "service", "exam", "examination", "general", "assistant",
    "officer", "jr", "junior", "grade", "grades", "combined", "various",
    "contract", "paper", "i", "ii", "iii", "iv", "v", "list", "result",
    "mizoram", "mpsc", "recruitment",
}
YEARS = {str(y) for y in range(2009, 2027)}

# Upstream answer sources that are safe to promote after a hash/option check.
SOLID_SOURCES = {"key", "official", "derived"}
# Sources that are useful evidence but not trustworthy enough to score on
# their own; they must be confirmed by a key or an independent derivation.
CANDIDATE_SOURCES = {"inferred"}


# --------------------------------------------------------------------------- #
# loading
# --------------------------------------------------------------------------- #
def load_bank() -> list[dict]:
    text = SITE_BANK.read_text()
    dec = json.JSONDecoder()
    rows: list[dict] = []
    for m in re.finditer(r"const groupBQuestionsPart\d+: BankQuestion\[\] = ", text):
        rows.extend(dec.raw_decode(text, m.end())[0])
    return rows


def load_library() -> list[dict]:
    raw = json.loads(LIBRARY.read_text())
    seen: set[str] = set()
    out: list[dict] = []
    for p in raw:
        if p["id"] in seen:
            continue
        seen.add(p["id"])
        out.append(p)
    return out


# --------------------------------------------------------------------------- #
# normalisation helpers
# --------------------------------------------------------------------------- #
def norm(s: str | None) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def toks(s: str | None) -> set[str]:
    return set(norm(s).split())


def stem_key(q: dict) -> str:
    """Stable normalised-stem fingerprint for cross-corpus joins."""
    return hashlib.sha1(norm(q.get("question")).encode()).hexdigest()


def opt_set(opts) -> set[str]:
    return {norm(o) for o in (opts or []) if norm(o)}


def is_mcq(q: dict) -> bool:
    return q.get("type") != "descriptive" and isinstance(q.get("options"), list)


def is_held(q: dict) -> bool:
    return bool(q.get("sourceReview"))


# --------------------------------------------------------------------------- #
# evidence 1: official key PDFs -> papers
# --------------------------------------------------------------------------- #
def key_files() -> list[Path]:
    d = UPSTREAM / "pdfs/Answer_Keys"
    if not d.exists():
        return []
    return sorted(p for p in d.glob("*.pdf"))


def match_keys_to_papers(papers: list[dict], keys: list[Path]) -> dict:
    """Fuzzy-match each downloaded key filename to at most one library paper.

    Scoring uses *distinctive* tokens only (generic role/boilerplate words are
    stripped), so "CDPO key" cannot bind to a "JAO paper". A match is
    ``high`` confidence when >=2 distinctive tokens agree, ``medium`` when
    exactly 1 does. Only high-confidence matches are treated as Tier 1.

    Returns {matches: {paper_id: {...}}, unmapped: [...], needs_check: [...]}.
    """
    ptok = {}
    for p in papers:
        ptok[p["id"]] = toks(f"{p.get('exam','')} {p.get('sitting','')}") - STOP - YEARS
    out: dict[str, dict] = {}
    unmapped: list[str] = []
    needs_check: list[dict] = []
    for kf in keys:
        kt = toks(kf.name) - STOP - YEARS
        best_id, best_score = None, 0
        for pid, pt in ptok.items():
            score = len(kt & pt)
            if score > best_score:
                best_id, best_score = pid, score
        if best_id is None or best_score < 1:
            unmapped.append(kf.name)
            continue
        conf = "high" if best_score >= 2 else "medium"
        entry = {"key_file": kf.name, "score": best_score, "confidence": conf}
        if conf == "high":
            out.setdefault(best_id, entry)
        else:
            needs_check.append({"key_file": kf.name, "candidate_paper": best_id,
                                "matched_on": sorted(kt & ptok[best_id])})
    return {"matches": out, "unmapped": unmapped, "needs_check": needs_check}


# --------------------------------------------------------------------------- #
# evidence 2a: upstream bank_v2 stem -> answer
# --------------------------------------------------------------------------- #
def load_upstream_bank() -> dict[str, list[dict]]:
    path = UPSTREAM / "bank/mpsc_bank_v2.json"
    index: dict[str, list[dict]] = collections.defaultdict(list)
    if not path.exists():
        return index
    data = json.loads(path.read_text())

    def walk(x, depth=0):
        if depth > 6:
            return
        if isinstance(x, list):
            for i in x:
                walk(i, depth + 1)
        elif isinstance(x, dict):
            if "question" in x and "options" in x:
                ai = x.get("answerIndex")
                if isinstance(ai, int) and ai >= 0:
                    index[norm(x["question"])].append({
                        "answerIndex": ai,
                        "answerSource": x.get("answerSource"),
                        "options": x.get("options") or [],
                    })
            else:
                for v in x.values():
                    walk(v, depth + 1)

    walk(data)
    return index


# --------------------------------------------------------------------------- #
# evidence 2b: upstream solved-json (paper label + qnum -> answer)
# --------------------------------------------------------------------------- #
def load_solved(papers: list[dict]) -> dict:
    """Returns {"by_paper": {paper_id: {qnum: {answerIndex,confidence}}},
                "labels_mapped": n, "labels_unmapped": [...]}"""
    files = [f for f in glob.glob(str(UPSTREAM / "state/**/*.solved.json"),
                                  recursive=True) if "/.claude/" not in f]
    by_label: dict[str, dict[str, dict]] = collections.defaultdict(dict)
    for f in files:
        try:
            d = json.loads(Path(f).read_text())
        except Exception:
            continue
        items = d if isinstance(d, list) else d.get("items") or []
        for it in items:
            if not isinstance(it, dict):
                continue
            rid = str(it.get("id") or "")
            ai = it.get("answerIndex", it.get("answer_index"))
            if "::q" not in rid or not isinstance(ai, int) or ai < 0:
                continue
            label, qnum = rid.split("::q", 1)
            label = norm(re.sub(r"^\d+\.", "", label))
            by_label[label][qnum] = {
                "answerIndex": ai,
                "confidence": it.get("confidence"),
                "explanation": it.get("explanation") or "",
            }

    # map labels -> paper ids by token overlap
    ptok = {p["id"]: toks(f"{p.get('exam','')} {p.get('sitting','')}") for p in papers}
    label_to_pid: dict[str, str] = {}
    unmapped: list[str] = []
    for label in by_label:
        lt = set(label.split()) - STOP
        best_id, best = None, 0
        for pid, pt in ptok.items():
            s = len(lt & pt)
            if s > best:
                best_id, best = pid, s
        if best_id and best >= 2:
            label_to_pid[label] = best_id
        else:
            unmapped.append(label)

    by_paper: dict[str, dict[str, dict]] = collections.defaultdict(dict)
    for label, pid in label_to_pid.items():
        by_paper[pid].update(by_label[label])
    return {"by_paper": dict(by_paper), "labels_mapped": len(label_to_pid),
            "labels_total": len(by_label), "labels_unmapped": unmapped[:30]}


# --------------------------------------------------------------------------- #
# validation: how accurate is the upstream corpus on our official answers?
# --------------------------------------------------------------------------- #
def validate_against_official(bank: list[dict], up_bank: dict) -> dict:
    """Compare upstream answers to our official-keyed answers by option text.

    Joins on the normalised stem, requires >=2 shared options, then compares the
    *chosen option text* (not the index, since MPSC reorders options across
    booklet series). Returns {source: {"agree": n, "disagree": n}}.
    """
    out: dict[str, dict[str, int]] = collections.defaultdict(
        lambda: {"agree": 0, "disagree": 0})
    for q in bank:
        ai = q.get("answerIndex")
        if not isinstance(ai, int) or ai < 0 or not is_mcq(q):
            continue
        opts = q.get("options") or []
        mine = norm(opts[ai]) if 0 <= ai < len(opts) else None
        for cand in up_bank.get(norm(q.get("question")), []):
            if len(opt_set(opts) & opt_set(cand["options"])) < 2:
                continue
            uopts = cand["options"]
            uai = cand["answerIndex"]
            theirs = norm(uopts[uai]) if 0 <= uai < len(uopts) else None
            key = "agree" if (mine and mine == theirs) else "disagree"
            out[str(cand["answerSource"])][key] += 1
            break
    return {k: dict(v) for k, v in out.items()}


# --------------------------------------------------------------------------- #
# reporting
# --------------------------------------------------------------------------- #
def main() -> int:
    papers = load_library()
    bank = load_bank()
    registered = {p["id"] for p in papers if p.get("keyHref")}
    reg_keys = json.loads(KEYS_REG.read_text()) if KEYS_REG.exists() else {}

    keys = key_files()
    keymatch = match_keys_to_papers(papers, keys)
    on_disk = set(keymatch["matches"])

    up_bank = load_upstream_bank()
    solved = load_solved(papers)
    solved_by_paper = solved["by_paper"]

    by_pid: dict[str, dict] = {}
    for p in papers:
        status = ("registered" if p["id"] in registered
                  else "on_disk" if p["id"] in on_disk else "none")
        by_pid[p["id"]] = {
            "paper_id": p["id"], "exam": p.get("exam"), "subject": p.get("subject"),
            "key_status": status,
            "key_file": (keymatch["matches"].get(p["id"], {}) or {}).get("key_file"),
            "held": 0, "tier1": 0, "tier2": 0, "tier3": 0,
            "tier2_bank": 0, "tier2_solved": 0,
            "tier2_solid": 0, "tier2_candidate": 0,
        }

    src_breakdown: collections.Counter = collections.Counter()
    samples: list[dict] = []

    for q in bank:
        if not is_held(q) or not is_mcq(q):
            continue
        pid = q.get("paperId")
        rec = by_pid.setdefault(pid, {
            "paper_id": pid, "exam": None, "subject": q.get("subject"),
            "key_status": "none", "key_file": None,
            "held": 0, "tier1": 0, "tier2": 0, "tier3": 0,
            "tier2_bank": 0, "tier2_solved": 0,
            "tier2_solid": 0, "tier2_candidate": 0,
        })
        rec["held"] += 1

        if rec["key_status"] in ("registered", "on_disk"):
            rec["tier1"] += 1
            continue

        # bank_v2 stem join (verify option overlap)
        matched = None
        for cand in up_bank.get(norm(q.get("question")), []):
            overlap = len(opt_set(q.get("options")) & opt_set(cand["options"]))
            if overlap >= 2 or not cand["options"]:
                matched = cand
                break
        solved_hit = solved_by_paper.get(pid, {}).get(str(q.get("questionNumber")))

        if matched or solved_hit:
            rec["tier2"] += 1
            solid = False
            if solved_hit:
                rec["tier2_solved"] += 1
                conf = str(solved_hit.get("confidence"))
                src_breakdown["solved-json:" + conf] += 1
                if conf in ("high", "medium"):
                    solid = True
            if matched:
                rec["tier2_bank"] += 1
                asrc = str(matched.get("answerSource"))
                src_breakdown["bank_v2:" + asrc] += 1
                if asrc in SOLID_SOURCES:
                    solid = True
            if solid:
                rec["tier2_solid"] += 1
            else:
                rec["tier2_candidate"] += 1
            if len(samples) < 6:
                samples.append({
                    "paperId": pid, "q": q.get("questionNumber"),
                    "stem": (q.get("question") or "")[:90],
                    "bank": matched and matched["answerIndex"],
                    "solved": solved_hit and solved_hit["answerIndex"],
                })
        else:
            rec["tier3"] += 1

    paper_rows = sorted(by_pid.values(),
                        key=lambda r: (r["tier1"] + r["tier2"], r["held"]),
                        reverse=True)
    held_total = sum(r["held"] for r in paper_rows)
    t1 = sum(r["tier1"] for r in paper_rows)
    t2 = sum(r["tier2"] for r in paper_rows)
    t2s = sum(r["tier2_solid"] for r in paper_rows)
    t2c = sum(r["tier2_candidate"] for r in paper_rows)
    t3 = sum(r["tier3"] for r in paper_rows)

    validation = validate_against_official(bank, up_bank)

    report = {
        "generated_from": {
            "site_bank": str(SITE_BANK), "upstream": str(UPSTREAM),
            "key_pdfs_found": len(keys), "registered_keys": len(reg_keys),
            "upstream_bank_answered_stems": len(up_bank),
            "solved_labels_mapped": solved["labels_mapped"],
            "solved_labels_total": solved["labels_total"],
        },
        "totals": {
            "papers": len(papers), "held_mcq": held_total,
            "tier1_key_scorable": t1,
            "tier2_solid_importable": t2s,
            "tier2_candidate_needs_verify": t2c,
            "tier3_needs_derivation": t3,
        },
        "validation_upstream_vs_official": validation,
        "key_match": {
            "high_confidence": len(keymatch["matches"]),
            "needs_attribution_check": keymatch["needs_check"],
            "unmapped_key_files": keymatch["unmapped"],
        },
        "tier2_sources": dict(src_breakdown),
        "papers": paper_rows,
    }
    (HERE / "coverage-report.json").write_text(json.dumps(report, indent=1) + "\n")

    # markdown
    lines = []
    lines.append("# Coverage report — held backlog\n")
    lines.append(f"Evidence scanned: {len(keys)} official key PDFs on disk "
                 f"({len(reg_keys)} registered), upstream "
                 f"`mpsc_bank_v2.json` ({len(up_bank):,} answered stems), "
                 f"{solved['labels_total']} solved-json labels "
                 f"({solved['labels_mapped']} mapped).\n")
    lines.append("## Totals\n")
    lines.append(f"- Held MCQs: **{held_total:,}**")
    lines.append(f"- Tier 1 — official key available (scorable mechanically): **{t1:,}**")
    lines.append(f"- Tier 2a — upstream answer solid, import then score: **{t2s:,}**")
    lines.append(f"- Tier 2b — upstream *inferred* candidate, **must be verified** "
                 f"before scoring: **{t2c:,}**")
    lines.append(f"- Tier 3 — needs fresh derivation: **{t3:,}**\n")
    lines.append("## Validation — how trustworthy is the upstream corpus?\n")
    lines.append("Upstream answers joined to *your* official-keyed questions and "
                 "compared by chosen option text:\n")
    lines.append("| upstream source | n | agree | disagree | accuracy |")
    lines.append("|---|---|---|---|---|")
    for src, st in sorted(validation.items()):
        n = st["agree"] + st["disagree"]
        if n:
            lines.append(f"| {src} | {n} | {st['agree']} | {st['disagree']} | "
                         f"{st['agree']/n*100:.1f}% |")
    lines.append("")
    lines.append("### Tier 2 sources\n")
    for k, v in sorted(src_breakdown.items(), key=lambda kv: -kv[1]):
        lines.append(f"- {k}: {v:,}")
    lines.append("")
    lines.append("## Key attribution\n")
    lines.append(f"- {len(keys)} key PDFs on disk; {len(reg_keys)} already registered.")
    lines.append(f"- High-confidence auto-attributions: **{len(keymatch['matches'])}** "
                 f"(~{t1:,} held questions). Confirm each by eye before registering.")
    lines.append(f"- Single-token candidates to inspect: "
                 f"**{len(keymatch['needs_check'])}**")
    lines.append(f"- Unattributed key files: **{len(keymatch['unmapped'])}**")
    lines.append("")
    lines.append("### Single-token candidates (key file -> best paper)\n")
    lines.append("| key file | candidate paper | matched on |")
    lines.append("|---|---|---|")
    for c in keymatch["needs_check"]:
        lines.append(f"| {c['key_file']} | {c['candidate_paper']} | "
                     f"{', '.join(c['matched_on'])} |")
    lines.append("")
    lines.append(f"Unattributed: {', '.join(keymatch['unmapped']) or '—'}\n")
    lines.append(f"## Papers with evidence (top 40 of "
                 f"{sum(1 for r in paper_rows if r['tier1']+r['tier2']>0)})\n")
    lines.append("| paper | subject | key | held | T1 | T2solid | T2cand | T3 |")
    lines.append("|---|---|---|---|---|---|---|---|")
    for r in paper_rows:
        if r["tier1"] + r["tier2"] == 0:
            continue
        lines.append(f"| {r['paper_id']} | {r['subject']} | {r['key_status']} | "
                     f"{r['held']} | {r['tier1']} | {r['tier2_solid']} | "
                     f"{r['tier2_candidate']} | {r['tier3']} |")
    lines.append("")
    (REPO / "COVERAGE-REPORT.md").write_text("\n".join(lines) + "\n")

    print(f"held MCQs: {held_total:,}")
    print(f"  Tier 1 (key on disk/registered): {t1:,}")
    print(f"  Tier 2a (upstream solid): {t2s:,}")
    print(f"  Tier 2b (upstream inferred, verify): {t2c:,}")
    print(f"  Tier 3 (needs derivation): {t3:,}")
    print(f"tier2 sources: {dict(src_breakdown)}")
    print("validation (upstream vs our official, by option text):")
    for src, st in sorted(validation.items()):
        n = st["agree"] + st["disagree"]
        if n:
            print(f"   {src:10} n={n:5} accuracy={st['agree']/n*100:.1f}%")
    print(f"key PDFs found: {len(keys)} | high-confidence key attributions: "
          f"{len(keymatch['matches'])} | needs check: "
          f"{len(keymatch['needs_check'])} | unmapped: "
          f"{len(keymatch['unmapped'])}")
    print(f"solved labels mapped {solved['labels_mapped']}/{solved['labels_total']}")
    print("\nsample tier2 matches:")
    for s in samples:
        print("  ", s)
    print("\nwrote coverage-report.json and COVERAGE-REPORT.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
