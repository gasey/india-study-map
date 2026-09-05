#!/usr/bin/env python3
"""Apply the adversarial-review fixes to the 51 pre-existing TECH2 U2/U4 questions.

    python3 tools/system-analyst-build/apply_u2u4_review_fixes.py [--dry-run]

BACKGROUND. The 51 authored Unit 2 / Unit 4 questions came from the 2026-09-04
"close every bare leaf" pass, which was a breadth pass: 3 questions per syllabus
leaf, written to make each leaf non-empty. They went into the app unreviewed, all
self-rating `conf: high`, and were being studied in that state.

Two independent adversarial reviewers, each blind to the other, then went over
all 51. Between them they found **zero wrong keys** -- every key survived, and
reviewer B independently solved all 51 before comparing and matched every one.
What they did find was seven questions whose wording, currency or scoping was
wrong enough to mislead a well-prepared candidate. None of the fixes below
changes an answer letter or touches an option's meaning, with the single
exception of GEN-TECH2-U2-7c58be, where the keyed option's own wording had
drifted away from its explanation.

WHY FIX SINGLE-REVIEWER FLAGS AND NOT JUST THE CONVERGED ONE. Only
GEN-TECH2-U2-2e0e39 was flagged by both. But the reviewers were given different
framings on purpose -- one refutation-first, one solve-then-compare -- so
non-overlap is largely a difference in what each looked at, not disagreement:
where one flagged and the other commented, they agreed on substance (both raised
the DPDP currency point; both noticed the 412 wording, one as a flag and one as a
nit it chose not to raise). The one flag neither hedged on is the CSRF stem,
which is a genuine factual-currency defect rather than a wording preference.

Every fix records itself in the question's `reviewFix` field, so the next session
can see what was changed and why without re-deriving it from git.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"

# Each entry: field -> (exact substring to find, replacement). The find text must
# match exactly once in that field, or the script refuses to write anything --
# a silent no-op edit is how a "fixed" question ships unfixed.
FIXES = {
    # Flagged by BOTH reviewers. Option B (server-render the route) genuinely also
    # stops the 404 -- that is SSR, which is what Next/Nuxt/Remix actually do. The
    # key was only correct under the unstated assumption that the app stays a
    # client-rendered SPA, so the stem now states it.
    "GEN-TECH2-U2-2e0e39": {
        "q": ("returns 404 from the web server. What is required?",
              "returns 404 from the web server. The app is to remain a purely client-rendered "
              "SPA. What is the minimal change that fixes this?"),
        "exp": ("redirecting to the root would stop the 404 but throw away the URL the user asked for.",
                "redirecting to the root would stop the 404 but throw away the URL the user asked "
                "for. Rendering the route on the server also removes the 404, but that abandons the "
                "client-rendered model the question fixes, which is why the stem rules it out."),
        "reviewFix": (
            "Flagged by both reviewers as ambiguous. Option B, registering a server-side route "
            "that renders the report, genuinely also eliminates the 404 -- it is server-side "
            "rendering, mainstream and valid. The stem's bare 'What is required?' overstated the "
            "uniqueness of the key. The stem now pins the app as purely client-rendered and asks "
            "for the minimal change, and the explanation names the SSR route as a real but "
            "excluded alternative. Options and keyed letter unchanged."),
    },
    # The only flag either reviewer said it would insist on before shipping.
    "GEN-TECH2-U2-93ac14": {
        "q": ("An application authenticates users with a session cookie and takes no further "
              "precaution.",
              "An application authenticates users with a session cookie that is sent with "
              "SameSite=None, and takes no further precaution."),
        "exp": ("which is why an unguessable identifier does not help and why the defences are an "
                "unpredictable per-request token plus SameSite cookies.",
                "which is why an unguessable identifier does not help and why the defence is an "
                "unpredictable per-request token. Note that browsers now treat a cookie with no "
                "SameSite attribute as SameSite=Lax, so a cross-site form POST no longer carries it "
                "by default and only a top-level safe-method navigation does; that default is a "
                "partial browser-side mitigation, not a substitute for a token, and it is why this "
                "question pins the cookie to SameSite=None."),
        "reviewFix": (
            "Flagged as outdated (medium). The keyed statement was no longer unconditionally true: "
            "since 2020 Chrome, and now Edge and Firefox, default a cookie with no SameSite "
            "attribute to SameSite=Lax, so the classic cross-site POST an attacker page triggers "
            "does NOT carry the session cookie. An app that 'takes no further precaution' is "
            "therefore already largely protected by browser defaults in 2026, and a well-prepared "
            "candidate could rightly object. The mechanism the key names is still the correct one, "
            "so the stem now pins the cookie to SameSite=None and the explanation states the "
            "Lax-by-default behaviour explicitly rather than leaving it as a silent falsehood. Key "
            "unchanged."),
    },
    # The explanation taught a false rule about when 412 appears. Reviewer B saw the
    # same thing and logged it as a nit rather than a flag.
    "GEN-TECH2-U2-44c084": {
        "exp": ("and 412 reports a precondition that failed on an unsafe request.",
                "and 412 is what a failed precondition returns, such as an If-Match that no longer "
                "matches, or an If-None-Match that matches on a method other than GET or HEAD."),
        "reviewFix": (
            "Explanation fixed. It glossed 412 as reporting 'a precondition that failed on an "
            "unsafe request', which is not the rule: RFC 9110 ties 412 to a failed precondition on "
            "any method, and a safe GET carrying If-Match or If-Unmodified-Since that does not "
            "match returns 412. The real distinction is method, not safety -- If-None-Match that "
            "matches returns 304 for GET/HEAD and 412 otherwise. The key was correct; only the "
            "distractor rationale taught a false rule."),
    },
    # Option A's own wording described a mechanism the stem does not set up, and
    # drifted from its own explanation.
    "GEN-TECH2-U2-7c58be": {
        "optA": ("while the others serve the stale value",
                 "while the others wait or serve a retained stale copy"),
        "reviewFix": (
            "Keyed option reworded. It described the mitigation as one request rebuilding under a "
            "lock 'while the others serve the stale value', but the stem says the key has expired, "
            "and in a plain TTL cache there is no stale value left to serve -- serving stale during "
            "a rebuild needs a soft-TTL or stale-while-revalidate design the stem never posits. The "
            "option now reads 'wait or serve a retained stale copy', matching its own explanation, "
            "which had only ever claimed lock-plus-jitter. Key unchanged and the option is still "
            "the only correct one."),
    },
    # The stem's escape hatch did not cover everything that raises a flex item's
    # automatic minimum size, which the explanation itself half-admits.
    "GEN-TECH2-U2-70bbd5": {
        "q": ("assuming no item contains an unbreakable token wider than its share?",
              "assuming each item's min-content size is smaller than its equal share?"),
        "reviewFix": (
            "Stem caveat broadened. It excluded only 'an unbreakable token wider than its share', "
            "but a long word is not the only thing that raises a flex item's automatic minimum "
            "size: a replaced element such as an image, a fixed-width or min-width child, a table, "
            "or horizontal padding and border under content-box all break the equality the same "
            "way -- and the explanation itself concedes that true equalisation also needs "
            "min-width: 0. The caveat now names the min-content size directly, which covers all of "
            "those cases. Key unchanged."),
    },
    # The keyed option is right, but its stated mechanism is false under PHP's
    # default PDO configuration.
    "GEN-TECH2-U2-1ea42c": {
        "exp": ("Escaping and character blacklisting are both bypassable,",
                "Two caveats worth holding: with PDO this requires PDO::ATTR_EMULATE_PREPARES set "
                "to false, because the MySQL driver otherwise interpolates the bound values into "
                "the SQL string client-side rather than sending them separately; and placeholders "
                "bind values only, so identifiers such as a table, column or ORDER BY direction "
                "must still be validated against a whitelist. Escaping and character blacklisting "
                "are both bypassable,"),
        "reviewFix": (
            "Explanation tightened. Option A's phrase 'user input never becomes part of the SQL "
            "text' is literally false in the most common PHP/MySQL setup, because PDO's MySQL "
            "driver ships with PDO::ATTR_EMULATE_PREPARES = true and interpolates bound values "
            "client-side; the protection is real but the mechanism as stated describes only true "
            "server-side prepares. The explanation now states that condition and adds the standard "
            "caveat that placeholders cannot bind identifiers, which remains a live injection "
            "surface. Key unchanged."),
    },
    # Both reviewers raised the same currency point, one as a flag and one as a
    # caveat: the Act has no cookie rule, and the consent machinery is phasing in.
    "GEN-TECH2-U2-5c4506": {
        "q": ("Under the consent framework of the DPDP Act 2023, what does the portal have to get "
              "right first?",
              "Under the notice-and-consent scheme of the DPDP Act 2023, what must the portal do?"),
        "exp": ("The DPDP Act is built on notice and consent:",
                "The DPDP Act contains no cookie-specific provision at all; the duty arises because "
                "a persistent identifier tied to a visitor's journey is personal data, and the Act "
                "is built on notice and consent:"),
        "reviewFix": (
            "Stem and explanation adjusted after both reviewers raised the same currency point, one "
            "as a flag and one as a caveat. Two issues. The DPDP Act 2023 has no cookie-specific "
            "provision -- consent-before-the-identifier-is-set is an ePrivacy/GDPR construct, and "
            "the Act's duty attaches to processing digital personal data, so the answer rested on "
            "the unstated premise that a pseudonymous analytics ID is personal data. And the "
            "notice-and-consent machinery is being phased in under the DPDP Rules 2025, so 'get "
            "right first' asserted a present enforcement duty rather than describing the framework. "
            "The stem now asks what the portal must do under the scheme, and the explanation states "
            "why the duty attaches at all. Key unchanged; B, C and D remain plainly wrong."),
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    text = BANK.read_text()
    i, j = text.index("["), text.rindex("]") + 1
    bank = json.loads(text[i:j])
    by_id = {q["id"]: q for q in bank}

    problems, applied = [], []
    for qid, edits in FIXES.items():
        q = by_id.get(qid)
        if q is None:
            problems.append("%s: not in the bank" % qid)
            continue
        if q.get("reviewFix"):
            problems.append("%s: already carries a reviewFix — refusing to double-apply" % qid)
            continue
        for field, val in edits.items():
            if field == "reviewFix":
                continue
            find, repl = val
            target = q["opts"]["A"] if field == "optA" else q[field]
            if target.count(find) != 1:
                problems.append("%s.%s: found %d occurrences of the anchor text, expected exactly 1"
                                % (qid, field, target.count(find)))
                continue
            new = target.replace(find, repl)
            if field == "optA":
                q["opts"]["A"] = new
            else:
                q[field] = new
        q["reviewFix"] = edits["reviewFix"]
        applied.append(qid)

    if problems:
        print("FAIL: %d problem(s) — nothing written:" % len(problems), file=sys.stderr)
        for p in problems:
            print("  - " + p, file=sys.stderr)
        sys.exit(1)

    # No fix is allowed to change an answer letter. The reviewers found zero wrong
    # keys; if a key moved here, the edit did something it was not asked to.
    original = json.loads(text[i:j])
    for a, b in zip(original, bank):
        if a["ans"] != b["ans"]:
            print("FAIL: %s answer changed %s -> %s" % (a["id"], a["ans"], b["ans"]), file=sys.stderr)
            sys.exit(1)

    print("fixes applied to %d questions:" % len(applied))
    for qid in applied:
        print("  " + qid)
    print("answer letters changed: 0 (verified)")

    if args.dry_run:
        print("\n--dry-run: bank not written")
        return
    BANK.write_text(text[:i] + json.dumps(bank, indent=1, ensure_ascii=False) + text[j:])
    print("\nwrote %s" % BANK)


if __name__ == "__main__":
    main()
