#!/usr/bin/env python3
"""Apply the eight reviewers' findings to the authored TECH2 U2/U4 batch.

    python3 tools/system-analyst-build/apply_u2u4_gen_review_fixes.py [--check]

Two blind passes reviewed each of the four batches (300 question-reviews over
150 questions). They returned 14 flag instances on 9 distinct questions and
**no wrong keys** — every keyed letter survives unchanged here. What they found
instead was the failure mode this bank is most exposed to: an explanation that
lands on the right letter by way of a false rule, and an option that states as
universal something true of only one cloud provider.

Four of the nine were raised independently by both blind passes (033, 006, 012,
031), which is the signal the two-method design exists to produce. One (045) was
raised by only one pass while the other pass returned zero flags for that batch
and asserted its provider-dependent items were pinned — they were not, so the
zero-flag pass is the one that was wrong.

EVERY EXTERNAL CLAIM HERE WAS CHECKED AGAINST PRIMARY SOURCE before being acted
on, because a reviewer is as capable of being confidently wrong as an author:
  - lodash 4.19.3: registry.npmjs.org shows no such version; dist-tags.latest
    is 4.18.1. The keyed answer did not exist.
  - OWASP Top 10:2025 (published 6 Nov 2025) retired the standalone SSRF
    category and folded CWE-918 into A01:2025 Broken Access Control — confirmed
    on owasp.org/Top10/2025/A01_2025-Broken_Access_Control/. The question keyed
    "SSRF is A10, not Broken Access Control", i.e. it drilled the exact answer
    the current list reverses.
  - GCS documents "No minimum object size" for every class; Archive's minimum
    storage duration is 365 days.
  - S3 Lifecycle has, since September 2024, applied a default that refuses to
    transition objects under 128 KB to any class at all.
  - NIST SP 800-145 community-cloud wording was extracted verbatim from the
    published PDF, not recalled.

Each edit asserts on a distinctive fragment of the text it is replacing, so if
an upstream file ever changes under it the script stops rather than silently
rewriting the wrong question. `--check` verifies without writing.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "system-analyst-build/staged/tech2-u2u4-gen"


def die(msg):
    sys.exit("apply_u2u4_gen_review_fixes: " + msg)


# Each entry: id -> {field: (must_contain, new_value)} plus "reviewFix".
# "opts.X" addresses a single option. must_contain is asserted before writing.
FIXES = {

    # ---- flagged by u2a-B (bad-explanation) -------------------------------
    "GEN-T2U2-018": {
        "exp": (
            "blockified away during flex item creation",
            "An auto margin on a flex item absorbs all free space on that side before "
            "justify-content is applied, so margin-left: auto pushes the item to the far end "
            "of the main axis. align-self only moves the item on the cross axis, justify-self "
            "is ignored in flex layout entirely, and float has no effect because a flex "
            "container ignores float and clear on its items: they neither float nor are taken "
            "out of flow. Blockification is a separate rule — it changes a flex item's display "
            "value — and it is not what disables the float.",
        ),
        "reviewFix": (
            "Explanation fixed. The key (margin-left: auto) and the other rebuttals were "
            "correct, but the float rebuttal gave a false mechanism: 'float has no effect on a "
            "flex item because floating is blockified away during flex item creation'. "
            "css-flexbox-1 treats these as two separate rules — a flex item's display value is "
            "blockified, and separately float and clear do not create floating or clearance for "
            "flex items and do not take them out of flow. Float is not blockified away; it is "
            "ignored while remaining a specified value. The wording also inverted the "
            "normal-flow rule, where float is what causes blockification. Key unchanged."
        ),
    },

    # ---- flagged by BOTH u2a passes (unstated-assumption) ------------------
    "GEN-T2U2-033": {
        "q": (
            "runs before another external script tag that follows it?",
            "An external script tag inside <head> runs document.querySelector('#app') and gets "
            "null, although that element exists in the body markup. Without moving the tag or "
            "wrapping the code in a DOMContentLoaded listener, which attribute fixes it while "
            "still guaranteeing this script runs before another external script tag that "
            "follows it in the document and carries the same attribute?",
        ),
        "exp": (
            "so both requirements are met",
            "defer downloads the script in parallel but delays execution until the document has "
            "been parsed, and deferred scripts run in document order, so both requirements are "
            "met. That ordering guarantee holds among deferred scripts only: a later plain "
            "classic script carries no defer or async, is parser-blocking, and would still run "
            "first — which is why the stem pins the following script to the same attribute. "
            "async also defers download but executes as soon as the file arrives, which may be "
            "before parsing finishes and in an order that depends on network timing.",
        ),
        "reviewFix": (
            "Flagged by both blind passes as resting on an unstated assumption, and they were "
            "right. defer guarantees document order only against OTHER deferred scripts; if the "
            "following external script were a plain classic script it would be parser-blocking "
            "and execute BEFORE the deferred one, inverting the ordering the stem claimed to "
            "guarantee. As literally written no option satisfied the second requirement, and a "
            "student could have generalised that defer orders a script ahead of any later tag. "
            "The stem now pins the following script to the same attribute and the explanation "
            "states the limit of the guarantee. Key D unchanged."
        ),
    },

    # ---- flagged by u2b-A (stale) — verified against owasp.org -------------
    "GEN-T2U2-063": {
        "q": (
            "In the OWASP Top 10 (2021 edition)",
            "A link-preview feature fetches any URL the user submits and returns the response "
            "body. An attacker submits a URL pointing at the cloud provider's link-local "
            "instance metadata endpoint and retrieves the instance's credentials. In the OWASP "
            "Top 10:2025, which category covers this class of flaw?",
        ),
        "opts.A": ("A01:2021", "A01:2025 - Broken Access Control"),
        "opts.B": ("A03:2021", "A05:2025 - Injection"),
        "opts.C": ("A05:2021", "A02:2025 - Security Misconfiguration"),
        "opts.D": ("A10:2021", "A10:2025 - Mishandling of Exceptional Conditions"),
        "ans": ("D", "A"),
        "exp": (
            "the 2021 edition added it as its own category at A10",
            "Server-Side Request Forgery had its own category, A10:2021, in the previous "
            "edition, but the 2025 edition retired that standalone entry and folded CWE-918 into "
            "A01:2025 Broken Access Control, on the reasoning that making a server issue "
            "attacker-chosen requests to destinations it should not reach is an access-control "
            "failure between services. Injection is the nearest miss - the attacker does supply "
            "the input - but the flaw is not that the input gets parsed as code. Note the 2025 "
            "renumbering while revising: Injection moved to A05 and Security Misconfiguration to "
            "A02, so distractor numbering carried over from the 2021 list is itself a trap.",
        ),
        "reviewFix": (
            "Re-keyed from the 2021 taxonomy to the 2025 one, and the keyed letter changed from "
            "D to A. The question pinned itself to '(2021 edition)' and so was internally "
            "consistent, but it drilled precisely the fact that has since been reversed: the "
            "OWASP Top 10:2025, published 6 November 2025, deleted SSRF as a standalone category "
            "and folded CWE-918 into A01:2025 Broken Access Control — verified on "
            "owasp.org/Top10/2025/A01_2025-Broken_Access_Control/, which names CWE-918 among its "
            "notable CWEs. The option the question taught the student to REJECT ('Broken Access "
            "Control') is the one now correct, so drilling it would have trained the wrong "
            "answer for a 2026 exam. All four options were rebuilt against the verified 2025 "
            "list rather than relabelled, since 2025 also moved Injection to A05 and Security "
            "Misconfiguration to A02."
        ),
    },

    # ---- flagged by u2b-B (bad-explanation) --------------------------------
    "GEN-T2U2-067": {
        "exp": (
            "and supplies no matching nonce or hash",
            "CSP treats inline event handler attributes as inline script, so a script-src list "
            "that omits 'unsafe-inline' refuses to execute them. A nonce cannot rescue one: a "
            "nonce is carried on a <script> element, and an event handler attribute has nowhere "
            "to put it — attribute-style inline script is governed by script-src-attr, which "
            "only 'unsafe-inline', or 'unsafe-hashes' together with a matching hash, can permit. "
            "That is exactly why a nonce-based policy without 'unsafe-inline' blunts reflected "
            "XSS: the attacker cannot attach a nonce to injected markup. Option B confuses the "
            "origin that served the HTML with the origin of the script source: 'self' only "
            "whitelists externally loaded scripts from the same origin, never inline code.",
        ),
        "reviewFix": (
            "Explanation fixed. The key and option text were correct, but the parenthetical "
            "'(and supplies no matching nonce or hash)' implied a nonce is a route to permitting "
            "an inline event handler attribute. It is not: nonces apply to elements, an onerror= "
            "attribute has no place to carry one, and attribute-style inline script is governed "
            "by script-src-attr, whose only permitting expressions are 'unsafe-inline' or "
            "'unsafe-hashes' plus a matching hash. As written it would have led a reader to "
            "write a nonce policy believing it whitelisted handlers it silently does not. Key "
            "unchanged."
        ),
    },

    # ---- flagged by u2b-A (wrong-specific) — verified against the registry --
    "GEN-T2U2-079": {
        "q": (
            "which of these published versions",
            "A Node.js project's `package.json` declares a dependency as `\"lodash\": "
            "\"^4.17.20\"` and the lockfile has been deleted. Under npm's semantic-versioning "
            "range rules, which of these versions may `npm install` resolve the dependency to?",
        ),
        "opts.B": ("4.19.3", "4.18.1"),
        "exp": (
            "so 4.19.3 is in range",
            "The caret range `^4.17.20` admits any version at or above 4.17.20 but below the "
            "next major, i.e. `>=4.17.20 <5.0.0`, so 4.18.1 is in range and npm will take the "
            "highest published match. 4.17.19 is the trap: it looks close enough to satisfy the "
            "caret, but it is lower than the stated minimum, and 5.0.1 crosses the major "
            "boundary the caret exists to hold.",
        ),
        "reviewFix": (
            "Keyed option corrected from 4.19.3 to 4.18.1. The stem named a real package and "
            "asked which 'published' version npm may resolve to, but lodash 4.19.3 has never "
            "been published — registry.npmjs.org lists no such version and dist-tags.latest is "
            "4.18.1 — so the only in-range option did not exist, and a candidate who actually "
            "knew lodash's release history had no defensible answer. 4.18.1 is both real and the "
            "version npm would in fact resolve to, so the semver rule under test is unchanged "
            "and now true. The stem no longer asserts that all four listed versions are "
            "published. KNOWN AND ACCEPTED: a reviewer also judged this mis-filed, since npm "
            "caret resolution is not 'Architecture and scale' material. Left in place "
            "deliberately — per-leaf counts are contractual against the authoring briefs and the "
            "importer enforces them, so moving it would require moving another question back the "
            "other way, and replacing it outright would ship an unreviewed question. Recorded "
            "here as a placement debt rather than silently fixed."
        ),
    },

    # ---- flagged by BOTH u4a passes (duplicate of GEN-T2U4-014) ------------
    # Rewritten against the verbatim NIST SP 800-145 community-cloud definition.
    "GEN-T2U4-006": {
        "q": (
            "which statement about the private cloud deployment model is correct",
            "Four state departments jointly commission a cloud environment that only those four "
            "may use, sharing it because they are bound by the same data-handling and compliance "
            "rules. A private vendor owns and operates it, hosted in the vendor's own data "
            "centre. Under NIST SP 800-145, which deployment model is this?",
        ),
        "opts.A": (
            "must be located on the consuming organisation",
            "Community cloud, because it is provisioned for exclusive use by a specific "
            "community of consumers from organisations that have shared concerns, and it may be "
            "owned and operated by a third party off premises",
        ),
        "opts.B": (
            "must be owned and operated by the consuming organisation",
            "Public cloud, because a commercial vendor owns the infrastructure and hosts it in "
            "its own data centre",
        ),
        "opts.C": (
            "provisioned for exclusive use by a single organisation",
            "Private cloud, because access is restricted to a named set of government "
            "departments rather than open to the general public",
        ),
        "opts.D": (
            "differs from a community cloud only in the number of virtual machines",
            "Hybrid cloud, because several distinct organisations are bound together into a "
            "single environment",
        ),
        "ans": ("C", "A"),
        "exp": (
            "NIST defines a private cloud by exclusivity of use",
            "NIST defines a community cloud as infrastructure provisioned for exclusive use by a "
            "specific community of consumers from organisations that have shared concerns — it "
            "gives mission, security requirements, policy and compliance considerations as the "
            "examples — and expressly allows it to be owned, managed and operated by a third "
            "party and to exist off premises. Private cloud is the near miss: it is equally "
            "non-public, but it is provisioned for a single organisation comprising multiple "
            "consumers, whereas here four separate departments share one environment on the "
            "strength of a common concern. Hybrid cloud means a composition of two or more "
            "distinct cloud infrastructures bound together, not several tenants of one.",
        ),
        "reviewFix": (
            "Rewritten from private cloud to community cloud. Both blind passes independently "
            "found this a duplicate of GEN-T2U4-014: the same load-bearing NIST sentence, the "
            "same trap that vendor-owned and off-premises implies public cloud, and near-verbatim "
            "the same correct-option wording — one revision card printed twice, which they slipped "
            "past because the two sit under different sub-topic tags. Both judged 014 the stronger "
            "of the pair, since it makes the candidate apply the rule to a scenario rather than "
            "recall a definition, so 014 is kept unchanged and 006 is re-pointed at the community "
            "cloud model, which nothing else in either unit tested. The new stem, options and "
            "explanation are written against the deployment-model definitions extracted verbatim "
            "from the published NIST SP 800-145 PDF, not from recall."
        ),
    },

    # ---- flagged by BOTH u4a passes (stale) --------------------------------
    "GEN-T2U4-012": {
        "opts.A": (
            "nothing is charged while no requests are being served",
            "In the default pay-per-use model, capacity is allocated per invocation and no "
            "compute is charged while no requests are being served, so there is no baseline "
            "instance count to provision",
        ),
        "exp": (
            "FaaS removes the provisioned instance entirely",
            "FaaS removes the provisioned instance from the default model: the platform creates "
            "execution capacity per event, scales to zero when idle, and bills on invocations "
            "and execution time rather than on running instances. The exception worth holding is "
            "that every major platform now sells an opt-in always-warm tier — AWS Lambda "
            "Provisioned Concurrency, Azure Functions always-ready instances, Cloud Run and "
            "Cloud Functions min-instances — which does keep initialised instances and does bill "
            "for them while idle, trading the scale-to-zero saving for the elimination of cold "
            "starts. C is the popular near-miss, since mainstream PaaS offerings have shipped "
            "autoscaling for years, so automatic scaling by itself does not separate the two "
            "models.",
        ),
        "reviewFix": (
            "Option A and the explanation qualified to the default consumption model. Both blind "
            "passes flagged that 'nothing is charged while no requests are being served, so there "
            "is no provisioned instance count at all' has not been universally true of FaaS since "
            "2019: AWS Lambda Provisioned Concurrency bills for the configured concurrency whether "
            "or not it serves a request, and Azure Functions always-ready instances and GCP "
            "min-instances behave the same way — on all three major platforms a FaaS deployment "
            "can have exactly a provisioned instance count and an idle charge. The distinction "
            "being tested is real and the key is still the only defensible option, but it is now "
            "scoped to the default model and the always-warm tiers are named as the exception. "
            "Key A unchanged."
        ),
    },

    # ---- flagged by BOTH u4a passes (bad-explanation / wrong-specific) -----
    "GEN-T2U4-031": {
        "q": (
            "even though the application never keeps more than four threads busy",
            "On a contended VMware vSphere cluster, a VM configured with 16 vCPUs performs worse "
            "than the same VM did with 8 vCPUs. The application is heavily multithreaded and "
            "keeps nearly all of its vCPUs busy, and the host's physical cores are oversubscribed "
            "across many VMs. What best explains this?",
        ),
        "opts.A": (
            "accumulates CPU ready time",
            "The VM's vCPUs must progress within a bounded skew of one another, so a vCPU that "
            "runs ahead is co-stopped until its lagging siblings can be scheduled alongside it, "
            "which on a contended host shows up as co-stop time (%CSTP)",
        ),
        "opts.D": (
            "migrating the four busy threads",
            "The guest scheduler keeps migrating threads across all 16 vCPUs, and each such "
            "migration forces a VM exit into the hypervisor",
        ),
        "exp": (
            "high CPU ready (%RDY) while the guest itself looks idle",
            "ESXi uses relaxed co-scheduling: it tracks how far each vCPU has fallen behind its "
            "siblings and co-starts the skewed ones together, so a wide VM on an oversubscribed "
            "host repeatedly waits for enough physical cores to free up at the same moment. The "
            "documented signature is co-stop time, %CSTP, and it is distinct from %RDY: %RDY "
            "counts time a vCPU was ready to run with no physical CPU available, whereas %CSTP "
            "counts time lost specifically to co-scheduling skew, which is the counter VMware's "
            "right-sizing guidance says to watch. Relaxed co-scheduling deliberately does not "
            "penalise idle vCPUs — a halted vCPU accrues no skew — so this bites a genuinely busy "
            "wide VM rather than a mostly idle one. Option C overstates the mechanism: vCPUs are "
            "time-shared against physical cores, not permanently pinned to them.",
        ),
        "reviewFix": (
            "Stem, key option and explanation all corrected; keyed letter A unchanged. Both blind "
            "passes flagged this, and their two findings compounded. First, the old stem stipulated "
            "that only four threads were ever busy and guest CPU utilisation stayed low — which is "
            "precisely the workload relaxed co-scheduling was designed NOT to penalise, since a "
            "descheduled idle vCPU accrues no skew, so the question asserted a co-start stall in "
            "the one case ESXi exempts. The stem now has the guest actually keeping its vCPUs busy, "
            "which makes co-scheduling the honest explanation. Second, the option and explanation "
            "diagnosed it with the wrong counter: %RDY is time a vCPU was ready with no physical "
            "CPU free, while %CSTP (co-stop) is the documented signature of an oversized vSMP VM "
            "and the one right-sizing guidance tells you to watch. Both now say %CSTP, and the "
            "explanation states the idle-vCPU exemption explicitly so the rule is not "
            "over-generalised."
        ),
    },

    # ---- flagged by u4b-B (bad-explanation + stale); u4b-A returned zero ---
    "GEN-T2U4-045": {
        "q": (
            "writes about five million log objects a day to a cloud object store",
            "An application writes about five million log objects a day to Google Cloud Storage; "
            "each object is roughly 20 KB and is deleted about 30 days after it is written. To "
            "cut cost the team adds a lifecycle rule that transitions every object to the Archive "
            "class 7 days after creation. The monthly bill rises instead of falling. What best "
            "explains this?",
        ),
        "opts.C": (
            "minimum billable object size",
            "The Archive class bills every object for a minimum storage duration far longer than "
            "these objects live, so each one incurs an early-deletion charge, and each lifecycle "
            "transition is itself a chargeable operation",
        ),
        "exp": (
            "price against a minimum billable object size",
            "Archive storage on Google Cloud carries a 365-day minimum storage duration, so an "
            "object deleted after 30 days is still billed as though it had been stored for a "
            "year: short-lived data is the worst possible fit for the class, and five million "
            "transitions a day are themselves billed as operations. B is the tempting misreading "
            "— a lifecycle transition changes an object's storage class in place and does not "
            "leave a second billable copy behind. The provider is named in the stem because the "
            "economics differ: Google Cloud Storage documents no minimum object size for any "
            "class, whereas S3 applies a 128 KB minimum billable object size on several classes "
            "and, since September 2024, its Lifecycle default refuses to transition objects under "
            "128 KB at all.",
        ),
        "reviewFix": (
            "Provider pinned to Google Cloud Storage, and the answer re-based on the mechanisms "
            "that actually apply. The stem named no provider while the key and explanation stated "
            "a 'minimum billable object size' as a universal property of archive classes — it is "
            "not: GCS documents 'No minimum object size' for every class and Azure defines its "
            "cool/cold/archive tiers purely by minimum retention, so a student would have "
            "memorised an AWS-only rule as general. The same pass also found the scenario's "
            "premise broken on AWS, where since September 2024 S3 Lifecycle applies a default "
            "that prevents objects under 128 KB from transitioning to any class, so a 20 KB "
            "object would not move at all and no bill rise would occur. Both were verified "
            "against the GCS storage-classes documentation and the AWS September 2024 lifecycle "
            "change before acting. The question now turns on Archive's 365-day minimum storage "
            "duration plus per-object transition operations, both true as stated for the named "
            "provider, and the explanation teaches the AWS contrast rather than hiding it. Key C "
            "unchanged. NOTE: the second reviewer of this batch returned zero flags and asserted "
            "that its provider-dependent items pinned their provider in the stem; that was false "
            "of this question, so the divergence was resolved against the zero-flag pass."
        ),
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    # id -> (path, index) across every per-leaf file
    located, files = {}, {}
    for path in sorted(GEN.glob("*.done.json")):
        batch = json.loads(path.read_text())
        files[path] = batch
        for i, q in enumerate(batch):
            if not q.get("id"):
                die("%s#%d has no id — run stamp_u2u4_ids.py first" % (path.name, i + 1))
            if q["id"] in located:
                die("duplicate id %s" % q["id"])
            located[q["id"]] = (path, i)

    missing = [qid for qid in FIXES if qid not in located]
    if missing:
        die("these flagged ids are not in any .done.json: %s" % ", ".join(missing))

    # Every flag must be covered. Read the reviews back and check.
    flagged = set()
    for rp in sorted(GEN.glob("review-*.json")):
        for fl in json.loads(rp.read_text()).get("flags", []):
            flagged.add(fl["id"])
    uncovered = sorted(flagged - set(FIXES))
    if uncovered:
        die("%d flagged question(s) have no fix defined here: %s"
            % (len(uncovered), ", ".join(uncovered)))
    spurious = sorted(set(FIXES) - flagged)
    if spurious:
        die("fix defined for %s, which no reviewer flagged" % ", ".join(spurious))

    changed = 0
    for qid, spec in sorted(FIXES.items()):
        path, idx = located[qid]
        q = files[path][idx]
        for field, val in spec.items():
            if field == "reviewFix":
                q["reviewFix"] = val
                continue
            must, new = val
            if field.startswith("opts."):
                letter = field.split(".", 1)[1]
                cur = q["opts"].get(letter)
                if cur is None:
                    die("%s: no option %s" % (qid, letter))
                if must not in cur:
                    die("%s option %s: expected to contain %r but found %r"
                        % (qid, letter, must, cur))
                q["opts"][letter] = new
            else:
                cur = q.get(field)
                if cur is None:
                    die("%s: no field %r" % (qid, field))
                if must not in str(cur):
                    die("%s field %r: expected to contain %r but found %r"
                        % (qid, field, must, str(cur)[:120]))
                q[field] = new
        # invariants that must survive any edit
        if sorted(q["opts"]) != ["A", "B", "C", "D"]:
            die("%s: options are no longer exactly A-D" % qid)
        if q["ans"] not in q["opts"]:
            die("%s: ans %r is not one of its own options" % (qid, q["ans"]))
        if len({str(v).strip().lower() for v in q["opts"].values()}) != 4:
            die("%s: options are no longer distinct" % qid)
        changed += 1

    if args.check:
        print("check ok: %d fixes apply cleanly to %d questions" % (len(FIXES), changed))
        return

    for path, batch in sorted(files.items()):
        path.write_text(json.dumps(batch, indent=1, ensure_ascii=False) + "\n")

    print("applied %d fixes across %d flagged questions" % (len(FIXES), changed))
    print("reviewer flags covered: %d/%d" % (len(flagged & set(FIXES)), len(flagged)))


if __name__ == "__main__":
    main()
