#!/usr/bin/env python3
"""Apply the two blind reviews of the 12 pre-existing authored Unit 1 questions.

    python3 tools/system-analyst-build/apply_u1_review_fixes.py [--check]

These 12 shipped from the 2026-09-04 breadth pass with no review at all, live in
the app behind `derived · high confidence` badges. Two blind reviewers, working
with different methods, each reviewed all 12 and **both compiled and ran the
cases that turn on exact C++ library behaviour under g++ 13.3** rather than
trusting recall. Between them: no wrong keys, and one low-severity flag each, on
different questions. Both are the same shape — a correct key reached by a rule
stated too broadly — which is the defect this whole review programme exists to
catch, since nothing downstream disagrees with a plausible-sounding rationale.

Neither keyed letter changes. Both edits assert on a distinctive fragment of the
text they replace, so if the bank shifts under this script it stops rather than
rewriting the wrong record.

  GEN-TECH2-U1-47f665 — said failbit "is the bit a stream's boolean conversion
    actually reports". `std::basic_ios::operator bool` returns `!fail()`, and
    `fail()` is `(rdstate() & (failbit | badbit)) != 0`; the reviewer confirmed
    by experiment that a stream with only badbit set also converts to false. As
    written it taught that badbit does not affect the boolean test, and it sat
    directly beside a distractor about badbit.

  GEN-TECH2-U1-e01c9b — justified a correct claim with "opening for output
    without ios::in is itself what discards the contents", which would make
    `ofstream(f, ios::app)` truncate, contradicting the same sentence's own
    correct statement that ios::app never discards anything. The openmode
    mapping is out -> "w" and out|trunc -> "w", but out|app -> "a" and
    app -> "a"; ate is masked out of that decision entirely and only seeks to
    the end after opening. The reviewer verified out|app|ate preserves contents.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT.parent / "public/mpsc-system-analyst/data/questions.js"
REVIEWS = ROOT / "system-analyst-build/staged/tech2-u1-review"


def die(msg):
    sys.exit("apply_u1_review_fixes: " + msg)


FIXES = {
    "GEN-TECH2-U1-47f665": {
        "exp": (
            "which is the bit a stream's boolean conversion actually reports",
            "Reaching end of file sets eofbit, and because the extraction produced no value it "
            "also sets failbit. The stream's boolean conversion reports !fail(), which is false "
            "when failbit or badbit is set — eofbit on its own never makes a stream test false, "
            "which is why option B's \"remains usable\" is wrong. That combination is why a loop "
            "written as while (in >> x) stops at exactly the right point, whereas one controlled "
            "by while (!in.eof()) runs an extra iteration on an extraction that has already "
            "failed.",
        ),
        "reviewFix": (
            "Explanation corrected. The key (eofbit and failbit both set) was right, but the "
            "explanation claimed failbit \"is the bit a stream's boolean conversion actually "
            "reports\". std::basic_ios::operator bool returns !fail(), and fail() tests failbit "
            "OR badbit — the reviewer confirmed by experiment that a stream with only badbit set "
            "also converts to false. As written the sentence taught that badbit does not affect "
            "the boolean test, which is wrong and sat awkwardly beside distractor A, which is "
            "specifically about badbit. The explanation now states the !fail() rule and keeps the "
            "point that eofbit alone never makes a stream test false, which is what still "
            "separates the key from option B. Key D unchanged."
        ),
    },
    "GEN-TECH2-U1-e01c9b": {
        "exp": (
            "because opening for output without ios::in is itself what discards the contents",
            "Under ios::app every write is appended at the end of the file no matter where the "
            "put pointer has been moved to, while ios::ate merely seeks to the end once at open "
            "time, after which a seek can move the pointer back and overwrite existing data. "
            "Option B inverts the risk: ios::app never discards anything, whereas ios::ate does "
            "not protect the file at all — it is masked out of the truncation decision and only "
            "seeks to the end after the file is open, so an ofstream opened with ios::ate alone "
            "still truncates. What actually preserves the contents is opening with ios::in (as on "
            "an fstream) or with ios::app; opening for output with neither is what discards them.",
        ),
        "reviewFix": (
            "Explanation corrected. The key and the claim that an ofstream opened with ios::ate "
            "alone still truncates are both right — the reviewer verified it on g++ 13.3 — but "
            "the rule given to justify it was over-broad and contradicted the same sentence: "
            "\"opening for output without ios::in is itself what discards the contents\" would "
            "make ofstream(f, ios::app) truncate, immediately after the text had correctly said "
            "ios::app never discards anything. The openmode mapping is out -> \"w\" and "
            "out|trunc -> \"w\", but out|app -> \"a\" and app -> \"a\", while ate is masked out "
            "of the decision entirely and only seeks to the end afterwards; out|app|ate was "
            "verified to preserve contents. The rule now names ios::app alongside ios::in. Key A "
            "unchanged."
        ),
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    # Every flag raised by either reviewer must be covered here, and every fix
    # here must answer a real flag — a fix nobody asked for is as suspect as a
    # flag nobody answered.
    flagged = set()
    for rp in sorted(REVIEWS.glob("review-*.json")):
        for fl in json.loads(rp.read_text()).get("flags", []):
            flagged.add(fl["id"])
    if not flagged:
        die("no reviewer flags found in %s — nothing to apply" % REVIEWS)
    if flagged - set(FIXES):
        die("flagged but unfixed: %s" % ", ".join(sorted(flagged - set(FIXES))))
    if set(FIXES) - flagged:
        die("fix defined for %s, which no reviewer flagged" % ", ".join(sorted(set(FIXES) - flagged)))

    text = BANK.read_text()
    start, end = text.index("["), text.rindex("]") + 1
    prefix, bank, suffix = text[:start], json.loads(text[start:end]), text[end:]

    by_id = {q["id"]: q for q in bank}
    for qid, spec in FIXES.items():
        if qid not in by_id:
            die("%s is not in the bank" % qid)
        q = by_id[qid]
        for field, val in spec.items():
            if field == "reviewFix":
                q["reviewFix"] = val
                continue
            must, new = val
            if must not in str(q.get(field, "")):
                die("%s field %r: expected to contain %r" % (qid, field, must))
            q[field] = new
        if q["ans"] not in q["opts"]:
            die("%s: ans is not one of its own options" % qid)

    if args.check:
        print("check ok: %d fixes apply cleanly" % len(FIXES))
        return

    BANK.write_text(prefix + json.dumps(bank, indent=1, ensure_ascii=False) + suffix)
    print("applied %d fixes (%s)" % (len(FIXES), ", ".join(sorted(FIXES))))


if __name__ == "__main__":
    main()
