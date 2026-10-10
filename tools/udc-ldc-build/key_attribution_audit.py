#!/usr/bin/env python3
"""Key-attribution audit for the held backlog (Tier 1).

Why this exists
---------------
Several official key PDFs are already downloaded in the sibling workbench, so it
is tempting to bulk-register them and turn held questions into scored ones. That
is unsafe: one key file usually belongs to an *exam* (many subject-papers), and
filename similarity is a weak signal. Wrong keys would silently inject wrong
answers, which this project forbids.

This tool pairs each unkeyed held paper with a key section using strict evidence
(exam-token overlap + subject class + question count), enforces a one-to-one
assignment, then *validates* each pairing against the upstream solved corpus by
comparing chosen option text. A correct key agrees with the (noisy) upstream
corpus at roughly its own accuracy (~86%); a wrong key agrees near chance
(~25%). That gap cleanly separates real matches from misattributions.

Key sections come from two places:
  - already-parsed text-layer keys (``state/answer_keys_parsed.json`` upstream);
  - ``.ocr.txt`` companions for scanned keys.

Outputs
-------
  - ``tools/udc-ldc-build/key-attribution-audit.json``
  - ``KEY-ATTRIBUTION-AUDIT.md``

Read-only; never mutates the bank.

Run: python3 tools/udc-ldc-build/key_attribution_audit.py
"""
from __future__ import annotations

import collections
import json
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sys.path.insert(0, str(HERE))
import coverage_report as cr  # noqa: E402  (shared normalisation helpers)

UPSTREAM = Path(os.environ.get(
    "MPSC_QB_UPSTREAM", str(REPO.parent / "mpsc-question-bank")))
KEYS_DIR = UPSTREAM / "pdfs/Answer_Keys"
PARSED = UPSTREAM / "state/answer_keys_parsed.json"

SUBJECTS = ["general studies", "general english", "general knowledge",
            "mathematics", "arithmetic", "reasoning", "computer", "physics",
            "chemistry", "biology", "technical"]

MANUAL_NOTE = ("Tier 1 is not a bulk/automated win. Only assignments that "
               "validate (>=25 upstream comparisons and >=70% option-text "
               "agreement) are safe to register without a human eye; everything "
               "else is either contradicted (wrong paper) or unverifiable and "
               "must be confirmed against the printed key.")


def parse_ocr_sections(path: Path) -> dict[str, dict[str, str]]:
    """Parse a key ``.ocr.txt`` into {section_header: {qnum: letter}}."""
    text = path.read_text(errors="ignore")
    sections: dict[str, dict[str, str]] = {}
    cur, buf = "UNKNOWN", []

    def flush() -> None:
        seen: dict[str, str] = {}
        for n, letter in re.findall(r"(\d{1,3})\D{0,4}\(([A-Da-d])",
                                    "\n".join(buf)):
            if 1 <= int(n) <= 300 and n not in seen:
                seen[n] = letter.upper()
        if seen:
            sections.setdefault(cur, {}).update(seen)

    hdr_re = re.compile(
        r"^(General Studies|General English|General Knowledge|Mathematics|"
        r"Arithmetic|Reasoning|Computer|Psychology|Technical|Physics|"
        r"Chemistry|Biology|Electric\w*|Civil|Mechanical)[^\d]*$", re.I)
    for line in text.splitlines():
        s = line.strip()
        h = hdr_re.match(s)
        if h and len(s) < 55:
            flush()
            cur, buf = h.group(1).title(), []
            continue
        buf.append(line)
    flush()
    return sections


def subject_class(text: str | None) -> str:
    n = cr.norm(text)
    n = re.sub(r"\bpaper\s*(i{1,3}|iv|v)\b", "", n)
    n = re.sub(r"\b(i|ii|iii|iv|v)\b", "", n).strip()
    for key in SUBJECTS:
        if key in n:
            return key
    return n


def key_sections() -> dict[str, list[tuple]]:
    """{key file: [(subject_class, n_answers, {qnum: letter}, source)]}."""
    out: dict[str, list[tuple]] = {}
    if PARSED.exists():
        for entry in json.loads(PARSED.read_text()):
            secs = []
            for s in entry.get("sections", []):
                if (s.get("answers") and s.get("quality") in ("clean", "near-clean")
                        and s.get("conflictCount", 0) == 0):
                    secs.append((subject_class(s.get("subject")),
                                 len(s["answers"]), s["answers"], "pdf"))
            if secs:
                out[entry["file"]] = secs
    for ocr in KEYS_DIR.glob("*.ocr.txt"):
        fname = ocr.name[: -len(".ocr.txt")]
        if fname in out:
            continue
        secs = [(subject_class(subj), len(ans),
                 {str(k): v for k, v in ans.items()}, "ocr")
                for subj, ans in parse_ocr_sections(ocr).items() if len(ans) >= 20]
        if secs:
            out[fname] = secs
    return out


def upstream_index() -> dict[str, list[tuple]]:
    path = UPSTREAM / "bank/mpsc_bank_v2.json"
    idx: dict[str, list[tuple]] = collections.defaultdict(list)
    if not path.exists():
        return idx

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
                    idx[cr.norm(x["question"])].append(
                        (ai, x.get("answerSource"), x.get("options") or []))
            else:
                for v in x.values():
                    walk(v, depth + 1)

    walk(json.loads(path.read_text()))
    return idx


def validate(pid, answers, bank, idx) -> tuple[int, int]:
    agree = dis = 0
    for q in bank:
        if q["paperId"] != pid or not q.get("sourceReview"):
            continue
        letter = answers.get(str(q.get("questionNumber")))
        opts = q.get("options") or []
        if not letter or letter not in "ABCD" or len(opts) != 4:
            continue
        mine = cr.norm(opts["ABCD".index(letter)])
        for (uai, _src, uopts) in idx.get(cr.norm(q["question"]), []):
            if len(cr.opt_set(opts) & cr.opt_set(uopts)) < 2:
                continue
            theirs = cr.norm(uopts[uai]) if 0 <= uai < len(uopts) else None
            agree += mine == theirs
            dis += mine != theirs
            break
    return agree, dis


def main() -> int:
    bank = cr.load_bank()
    library = cr.load_library()
    held = collections.Counter(q["paperId"] for q in bank
                               if cr.is_held(q) and cr.is_mcq(q))
    secs = key_sections()
    idx = upstream_index()

    # scored candidate pairs
    candidates = []
    for p in library:
        if p.get("keyHref") or not held.get(p["id"]):
            continue
        exp = p.get("expectedMcq")
        psub = subject_class(p.get("subject"))
        ptok = cr.toks(f"{p.get('exam','')} {p.get('sitting','')}") - cr.STOP - cr.YEARS
        for kf, ksecs in secs.items():
            ktok = set(cr.norm(kf).split()) - cr.STOP - cr.YEARS
            overlap = len(ptok & ktok)
            if overlap < 2:
                continue
            for si, (ssub, sn, sans, src) in enumerate(ksecs):
                if exp and sn != exp:
                    continue
                if psub and ssub and ssub != psub:
                    continue
                subj_pts = 3 if (psub and ssub == psub) else 1
                candidates.append((overlap + subj_pts + 2, p["id"], kf, si, src))

    candidates.sort(reverse=True)
    used_pid: set[str] = set()
    used_sec: set[tuple[str, int]] = set()
    assigned: dict[str, tuple] = {}
    for score, pid, kf, si, src in candidates:
        if pid in used_pid or (kf, si) in used_sec:
            continue
        used_pid.add(pid)
        used_sec.add((kf, si))
        assigned[pid] = (score, kf, si, src)

    rows = []
    for pid, (score, kf, si, src) in assigned.items():
        answers = secs[kf][si][2]
        agree, dis = validate(pid, answers, bank, idx)
        total = agree + dis
        acc = round(agree / total * 100) if total else None
        if total >= 25 and acc is not None and acc >= 70:
            verdict = "validated"
        elif total >= 25 and acc is not None and acc < 60:
            verdict = "contradicted"
        else:
            verdict = "unverifiable"
        rows.append({
            "paper_id": pid, "subject": next(
                (p.get("subject") for p in library if p["id"] == pid), None),
            "held": held[pid], "key_file": kf, "section_index": si,
            "section_n": secs[kf][si][1], "source": src, "score": score,
            "upstream_n": total, "agreement": acc, "verdict": verdict,
        })

    order = {"validated": 0, "unverifiable": 1, "contradicted": 2}
    rows.sort(key=lambda r: (order[r["verdict"]], -r["held"]))
    counts = collections.Counter(r["verdict"] for r in rows)

    report = {"note": MANUAL_NOTE, "counts": dict(counts),
              "held_in_candidates": sum(r["held"] for r in rows), "papers": rows}
    (HERE / "key-attribution-audit.json").write_text(json.dumps(report, indent=1) + "\n")

    lines = ["# Key-attribution audit (Tier 1)\n", MANUAL_NOTE, "",
             "## Summary\n",
             f"- Candidate one-to-one assignments: **{len(rows)} papers "
             f"({sum(r['held'] for r in rows)} held questions)**",
             f"- `validated` (safe to register): **{counts.get('validated',0)}**",
             f"- `contradicted` (wrong paper — reject): "
             f"**{counts.get('contradicted',0)}**",
             f"- `unverifiable` (needs printed-key confirmation): "
             f"**{counts.get('unverifiable',0)}**\n",
             "Validation compares the proposed key against the upstream solved "
             "corpus by chosen option text. A correct key scores near the "
             "corpus baseline (~86%); a wrong one scores near chance (~25%).\n",
             "| verdict | paper | subject | held | key file | src | upstream n | agreement |",
             "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        acc = f"{r['agreement']}%" if r["agreement"] is not None else "—"
        lines.append(f"| {r['verdict']} | {r['paper_id']} | {r['subject']} | "
                     f"{r['held']} | {r['key_file']} | {r['source']} | "
                     f"{r['upstream_n']} | {acc} |")
    lines.append("")
    (REPO / "KEY-ATTRIBUTION-AUDIT.md").write_text("\n".join(lines) + "\n")

    print(f"candidate assignments: {len(rows)} papers "
          f"({sum(r['held'] for r in rows)} held questions)")
    print(f"  validated  : {counts.get('validated',0)}")
    print(f"  contradicted: {counts.get('contradicted',0)}")
    print(f"  unverifiable: {counts.get('unverifiable',0)}")
    print("wrote key-attribution-audit.json and KEY-ATTRIBUTION-AUDIT.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
