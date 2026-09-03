#!/usr/bin/env python3
"""
Phase 3 — verify the answers the bank marked `answerSource: "inferred"`.

308 questions (Computer Operator Technical Paper I x2 and General English x2)
arrive from the bank with an answer but NO explanation, NO confidence rating,
and no official key behind them. MPSC never published one. Right now they ship
badged `derived - unrated`, which is honest but not useful.

DESIGN: SOLVE BLIND, THEN COMPARE.
The export deliberately does NOT show the solver the bank's existing answer.
Rubber-stamping a wrong answer is the failure mode that matters here - a solver
shown "the answer is (b)" will tend to justify (b). Solving independently and
then diffing gives real evidence:

  agree    -> two independent derivations concur. Corroborated; keep, and the
              solver's confidence stands.
  disagree -> genuine uncertainty. Flagged for review and forced to at most
              "medium" confidence regardless of what the solver claimed, because
              one of the two derivations is definitely wrong.

That distinction is only available if the solve is blind. Don't "help" the
solver by including the bank answer.

Comprehension questions carry their recovered passage (see extract_passages.py)
- without it they are unanswerable and a solver would be guessing.

WHEN THE BANK HAS NO ANSWER AT ALL, run a SECOND blind pass.
The diff above is the only thing standing between a plausible guess and the
reader. Election Dec-2019 Paper II arrives with all 74 answers set to -1, so
there is nothing to diff against and a lone solve would ship its own
self-assessed confidence unchecked. Pass B fills that role: same .todo.json,
answers written to <name>.solved2.json instead of <name>.solved.json.

  agree        -> confidence is the LOWER of the two passes' claims
  disagree     -> capped to medium, both answers shown to the reader via `alt`
  no pass B    -> "uncorroborated", capped to medium, said plainly in the prov

Run the two passes with DIFFERENT MODELS. Two runs of one model agree without
corroborating anything - their errors correlate, so agreement measures
consistency rather than correctness.

Usage:
  python3 tools/system-manager-build/solve.py --export [--only CO2019B-P2] [--redo]
  # ...pass A agents fill staged/solving/<name>.todo.json -> .solved.json
  # ...pass B agents (different model) write            -> .solved2.json
  python3 tools/system-manager-build/solve.py --merge
"""

import argparse
import glob
import json
import os
import sys
from collections import Counter

from extracted_meta import EXTRACTED_META

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")
EXTRACTED = os.path.join(HERE, "extracted")
BATCHES = os.path.join(STAGED, "solving")
LETTERS = ["A", "B", "C", "D"]
BATCH_SIZE = 20
CONFS = {"high", "medium", "low"}


def extracted_unanswered():
    """Extracted papers that arrived with no answers at all.

    harvest.py can only see papers held in mpsc_bank_v2.json. The papers in
    extracted/ are the ones it cannot reach, and those flagged answered=False
    carry no answer of any kind — a pure text-layer transcription. They need
    the same two-blind-pass treatment as Election Dec-2019 Paper II, and for
    the same reason: with no bank answer to diff against, a lone solve ships
    its own self-assessed confidence unchecked.

    `_bank_ans` is None for every row here, which routes them down do_merge()'s
    pass-B branch rather than the bank-comparison branch.
    """
    out = []
    for key, meta in sorted(EXTRACTED_META.items()):
        if meta["answered"]:
            continue
        path = os.path.join(EXTRACTED, f"{key}.json")
        if not os.path.isfile(path):
            continue
        for r in json.load(open(path, encoding="utf-8")):
            if r.get("ans") or r.get("needs_figure"):
                continue     # already answered, or quarantine-bound anyway
            out.append({
                "id": f"{key}-{r['no']}", "srcKey": key, "no": r["no"],
                "paper": meta["paper"], "q": r["q"], "opts": r["opts"],
                "passageTitle": None, "passage": None,
                "_bank_ans": None,
            })
    return out


def unverified():
    """Questions needing verification, with passages attached."""
    hp = os.path.join(STAGED, "harvest.json")
    if not os.path.isfile(hp):
        sys.exit("FAIL: staged/harvest.json missing — run harvest.py first")
    rows = json.load(open(hp, encoding="utf-8"))

    passages = {}
    pp = os.path.join(STAGED, "passages.json")
    if os.path.isfile(pp):
        for pid, p in json.load(open(pp, encoding="utf-8")).items():
            for qno in p["questions"]:
                passages[(p["srcKey"], qno)] = p

    out = []
    for r in rows:
        if not r.get("needs_verify"):
            continue
        p = passages.get((r["srcKey"], r["no"]))
        out.append({
            "id": r["id"], "srcKey": r["srcKey"], "no": r["no"], "paper": r["paper"],
            "q": r["q"], "opts": r["opts"],
            "passageTitle": p["title"] if p else None,
            "passage": p["text"] if p else None,
            "_bank_ans": r.get("ans"),      # stripped before export
        })
    out.extend(extracted_unanswered())
    return out


def do_export(only=None, redo=False):
    rows = unverified()

    # Don't re-export what has already been solved. Without this, adding a
    # sitting re-exports every previously verified question and invites a second
    # solve to overwrite a good answer with a worse one.
    if not redo:
        sp = os.path.join(STAGED, "solved.json")
        if os.path.isfile(sp):
            done_ids = set(json.load(open(sp, encoding="utf-8")))
            before = len(rows)
            rows = [r for r in rows if r["id"] not in done_ids]
            if before != len(rows):
                print(f"skipping {before - len(rows)} already in staged/solved.json "
                      f"(pass --redo to solve them again)")
    if only:
        rows = [r for r in rows if r["srcKey"] in only]
        print(f"restricted to {', '.join(sorted(only))}")

    if not rows:
        sys.exit("nothing to export")

    os.makedirs(BATCHES, exist_ok=True)
    # Clear only the batches we are about to rewrite. This used to wipe every
    # *.todo.json unconditionally, which meant exporting one sitting deleted the
    # other nineteen sittings' inputs — the record of exactly what each solver
    # was shown, for answers that are already merged and shipping.
    stale_keys = set(only) if only else {r["srcKey"] for r in rows}
    for stale in glob.glob(os.path.join(BATCHES, "*.todo.json")):
        base = os.path.basename(stale)
        if any(base.startswith(f"{k}-") for k in stale_keys):
            os.remove(stale)

    by_src = {}
    for r in rows:
        by_src.setdefault(r["srcKey"], []).append(r)

    written = []
    for src, qs in sorted(by_src.items()):
        qs.sort(key=lambda r: r["no"])
        for i in range(0, len(qs), BATCH_SIZE):
            chunk = qs[i:i + BATCH_SIZE]
            n = i // BATCH_SIZE + 1
            path = os.path.join(BATCHES, f"{src}-{n}.todo.json")
            # strip the bank answer — the solve must be blind
            export = [{k: v for k, v in q.items() if not k.startswith("_")} for q in chunk]
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "srcKey": src,
                    "brief": "tools/bank-rebuild/SOLVE_BRIEF.md",
                    "instructions": (
                        "Answer each question independently. Write a JSON object keyed by "
                        "question id: {\"<id>\": {\"ans\": \"A\"|\"B\"|\"C\"|\"D\", "
                        "\"conf\": \"high\"|\"medium\"|\"low\", \"exp\": \"1-3 sentences\"}} "
                        "to this filename with .todo.json replaced by .solved.json. "
                        "No official answer key exists for these papers - your answer "
                        "becomes the app's answer. Do not inflate confidence."
                    ),
                    "questions": export,
                }, f, indent=2, ensure_ascii=False)
            written.append((path, len(chunk)))

    print(f"exported {len(written)} batch(es) -> {os.path.relpath(BATCHES, os.getcwd())}/")
    for path, n in written:
        print(f"  {n:>3}  {os.path.basename(path)}")
    n_psg = sum(1 for r in rows if r["passage"])
    print(f"\n{len(rows)} questions to verify ({n_psg} carry a comprehension passage)")
    print("Bank answers are NOT included — the solve is blind, then diffed on merge.")


def _read_pass(paths, rows, problems, label):
    """Load one solver pass's answers, validating each row."""
    out = {}
    for path in paths:
        data = json.load(open(path, encoding="utf-8"))
        entries = data.get("answers", data) if isinstance(data, dict) else {}
        for qid, a in entries.items():
            if qid in out:
                problems.append(f"{qid}: solved twice within pass {label}")
            r = rows.get(qid)
            if not r:
                problems.append(f"{qid}: not a question awaiting verification (pass {label})")
                continue
            ans, conf, exp = a.get("ans"), a.get("conf"), (a.get("exp") or "").strip()
            if ans not in LETTERS:
                problems.append(f"{qid}: ans={ans!r} (pass {label})")
                continue
            if conf not in CONFS:
                problems.append(f"{qid}: conf={conf!r} (pass {label})")
                continue
            if len(exp) < 25:
                problems.append(f"{qid}: explanation too short (pass {label})")
                continue
            out[qid] = {"ans": ans, "conf": conf, "exp": exp}
    return out


def do_merge():
    rows = {r["id"]: r for r in unverified()}
    # Pass B lives in *.solved2.json beside pass A's *.solved.json.
    #
    # WHY A SECOND PASS EXISTS: this file's agree/disagree logic gets its
    # evidence by diffing a blind solve against the bank's inferred answer. For
    # a paper where the bank holds NO answer — Election Dec-2019 Paper II is 74
    # such questions — that evidence simply isn't there, and a lone solve would
    # ship whatever confidence it claimed for itself, unchecked. A second
    # independent blind pass restores the corroboration. Run the two passes with
    # DIFFERENT models: two runs of the same model agree without corroborating,
    # because their errors correlate.
    all_solved = sorted(glob.glob(os.path.join(BATCHES, "*.solved.json")))
    b_paths = sorted(glob.glob(os.path.join(BATCHES, "*.solved2.json")))
    a_paths = [p for p in all_solved if not p.endswith(".solved2.json")]
    if not a_paths:
        sys.exit(f"FAIL: no *.solved.json in {os.path.relpath(BATCHES, os.getcwd())}/")

    problems = []
    solved = _read_pass(a_paths, rows, problems, "A")
    passB = _read_pass(b_paths, rows, problems, "B") if b_paths else {}

    # --- the whole point: diff blind answer against a second derivation ---
    # Normally that second derivation is the bank's inferred answer. Where the
    # bank has none, pass B stands in for it.
    agree, disagree, no_bank = [], [], []
    sv_agree, sv_disagree, uncorroborated = [], [], []
    final = {}
    for qid, s in solved.items():
        bank = rows[qid]["_bank_ans"]
        if bank is None:
            b = passB.get(qid)
            if b is None:
                # Nothing to check it against. The solver does not get to claim
                # "high" on an answer no second derivation has ever seen.
                uncorroborated.append(qid)
                capped = "medium" if s["conf"] == "high" else s["conf"]
                final[qid] = {**s, "conf": capped, "agreement": "uncorroborated",
                              "prov": "Derived by a single blind solve. The bank held no "
                                      "answer and MPSC published no key, so nothing has "
                                      "checked this — treat it as the weakest class of "
                                      "answer in the app.",
                              "note": "no second derivation"}
            elif b["ans"] == s["ans"]:
                sv_agree.append(qid)
                # Two independent solves concur. Confidence is the LOWER of the
                # two claims: if either pass was unsure, the pair is unsure.
                order = {"low": 0, "medium": 1, "high": 2}
                conf = min(s["conf"], b["conf"], key=lambda c: order[c])
                final[qid] = {**s, "conf": conf, "agreement": "agree-solvers",
                              "prov": "Two independent blind solves by different models "
                                      "agree. The bank held no answer for this question and "
                                      "MPSC published no key."}
            else:
                sv_disagree.append(qid)
                capped = "medium" if s["conf"] == "high" else s["conf"]
                final[qid] = {**s, "conf": capped, "agreement": "disagree",
                              "alt_ans": b["ans"],
                              "prov": f"Two independent blind solves disagree: ({s['ans']}) "
                                      f"and ({b['ans']}). One is wrong and there is no key to "
                                      f"settle it — both are shown; judge for yourself.",
                              "note": f"second solver said ({b['ans']})"}
        elif bank == s["ans"]:
            agree.append(qid)
            final[qid] = {**s, "agreement": "agree",
                          "prov": "Two independent derivations agree (the bank's inferred "
                                  "answer and a fresh blind solve). No official MPSC key exists."}
        else:
            disagree.append(qid)
            # One of the two is wrong. Cap confidence — the solver doesn't get to
            # claim "high" on a question where an independent pass disagreed.
            capped = "medium" if s["conf"] == "high" else s["conf"]
            final[qid] = {**s, "conf": capped, "agreement": "disagree",
                          "bank_ans": bank, "alt_ans": bank,
                          "prov": f"Blind solve gives ({s['ans']}); the bank's inferred "
                                  f"answer was ({bank}). They disagree, so one derivation is "
                                  f"wrong — treat with caution. No official MPSC key exists.",
                          "note": f"conflicts with bank answer ({bank})"}

    os.makedirs(STAGED, exist_ok=True)
    with open(os.path.join(STAGED, "solved.json"), "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)

    total = len(rows)
    print(f"merged {len(final)}/{total} verified answers -> staged/solved.json\n")
    print(f"  checked against the bank's answer:")
    print(f"    agree              {len(agree):>4}"
          f"  ({100 * len(agree) // max(1, len(agree) + len(disagree))}% of those checked)")
    print(f"    DISAGREE           {len(disagree):>4}   <-- one derivation is wrong")
    if no_bank:
        print(f"    bank had no answer {len(no_bank):>4}")
    if sv_agree or sv_disagree or uncorroborated:
        print(f"\n  no bank answer — checked against a second blind solve:")
        print(f"    agree              {len(sv_agree):>4}")
        print(f"    DISAGREE           {len(sv_disagree):>4}   <-- both shown to the reader")
        if uncorroborated:
            print(f"    UNCORROBORATED     {len(uncorroborated):>4}   <-- no second pass ran; "
                  f"capped to medium")
    conf = Counter(v["conf"] for v in final.values())
    print(f"\n  confidence: " + "  ".join(f"{c} {conf.get(c, 0)}" for c in ("high", "medium", "low")))

    if disagree:
        path = os.path.join(STAGED, "disagreements.json")
        out = [{"id": q, "bank": rows[q]["_bank_ans"], "solved": final[q]["ans"],
                "conf": final[q]["conf"], "q": rows[q]["q"],
                "opts": rows[q]["opts"], "exp": final[q]["exp"]} for q in sorted(disagree)]
        json.dump(out, open(path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        print(f"\n  {len(disagree)} disagreement(s) -> staged/disagreements.json "
              f"(worth a human read — these are where the bank was probably wrong)")
        for q in sorted(disagree)[:12]:
            print(f"    {q}: bank ({rows[q]['_bank_ans']}) vs solved ({final[q]['ans']})"
                  f"  {rows[q]['q'][:58]}")

    remaining = [q for q in rows if q not in final]
    if remaining:
        print(f"\n  {len(remaining)} still unverified")

    if problems:
        print(f"\n{len(problems)} PROBLEM(S):", file=sys.stderr)
        for p in problems[:30]:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true")
    ap.add_argument("--merge", action="store_true")
    ap.add_argument("--only", action="append", metavar="SRCKEY",
                    help="restrict the export to these sittings (repeatable)")
    ap.add_argument("--redo", action="store_true",
                    help="re-export questions that already have a verified answer")
    a = ap.parse_args()
    if a.export:
        do_export(only=set(a.only) if a.only else None, redo=a.redo)
    elif a.merge:
        do_merge()
    else:
        ap.error("pass --export or --merge")


if __name__ == "__main__":
    main()
