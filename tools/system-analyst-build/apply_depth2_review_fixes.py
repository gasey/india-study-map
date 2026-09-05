#!/usr/bin/env python3
"""Apply the eight blind reviews of the OOP and Cloud batch-2 depth passes.

    python3 tools/system-analyst-build/apply_depth2_review_fixes.py [--check]

Two blind passes over each of four batches — 168 question-reviews across 84
questions — returned 8 flag instances on 6 distinct questions and **no wrong
keys**. Two were raised independently by both passes of their batch
(GEN-T2U1B-026 and GEN-T2U4B-009), which is the signal the two-method design
exists to produce.

Every claim was verified before being acted on, and for the C++ batch that meant
compiling rather than reasoning: the reviewers compiled, and this author
re-compiled independently before changing any option text.

  GEN-T2U1B-026 (ambiguous, BOTH passes) — the only fix here that changes what
    the candidate reads rather than only the rationale. The stem asked which
    option "compiles" and listed bare prototypes; A, B and C ALL compile as
    written, because the ban on abstract types as by-value parameters and return
    types is enforced at the point of DEFINITION, not declaration. Verified
    locally with g++ -std=c++17: the three declarations compile, and both fail
    the moment a body is added. Options are now definitions, which restores
    exactly one compiling answer. Key A unchanged.

  GEN-T2U1B-013 (bad-explanation) — said a destructor-only declaration
    "suppresses the implicit move operations, forcing needless copies instead".
    Generic textbook truth, false for THIS class: Report holds a
    std::unique_ptr, so the fallback copy constructor is itself deleted. The
    reviewer compiled it — the type becomes neither movable nor copyable, a hard
    error, not a silent fallback to copying.

  GEN-T2U1B-019 (bad-explanation) — claimed group C "loses special
    evaluation-order behaviour when overloaded". True of &&, || and comma;
    meaningless for unary !, which has no sequencing guarantee to lose.

  GEN-T2U1B-010 (bad-explanation) — collapsed two different rules into one:
    const/volatile are barred because they qualify an implicit object parameter
    a static member function does not have, but `virtual` is barred for an
    unrelated reason (dispatch needs a real instance carrying a vtable pointer).
    `virtual` is not part of the function type the way cv-qualifiers are.

  GEN-T2U4B-009 (stale + unstated-assumption, BOTH passes) — named EKS, AKS and
    GKE interchangeably while asserting the customer still patches worker-node
    OS. True of EKS; GKE enables node auto-upgrade by default on Standard
    clusters, and AKS defaults its node-OS channel to NodeImage. Pinned to EKS,
    with the divergence now taught rather than hidden.

  GEN-T2U4B-032 (wrong-specific) — described S3's December 2020 strong
    consistency as applying "globally". AWS delivered it in all Regions while
    preserving regional isolation; "globally" invites the false inference that a
    write in one Region is immediately readable from another.

Each edit asserts on a distinctive fragment of the text it replaces, so the
script stops rather than rewriting the wrong record if anything shifts.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BATCHES = {
    "u1": ROOT / "tools/system-analyst-build/staged/tech2-u1-gen2",
    "u4": ROOT / "tools/system-analyst-build/staged/tech2-u4-gen2",
}


def die(msg):
    sys.exit("apply_depth2_review_fixes: " + msg)


FIXES = {
    # ---------------- OOP batch 2 ----------------
    "GEN-T2U1B-026": {
        "q": ("Which of the following compiles?",
              "Connection is an abstract class: it declares `virtual void send() = 0;` and no "
              "other pure virtual member. Which of the following definitions compiles?"),
        "opts.A": ("(parameter passed by reference)",
                   "void transmit(const Connection& c) { }   (a function taking a reference)"),
        "opts.B": ("Connection make();",
                   "Connection make() { Connection c; return c; }   (returning one by value)"),
        "opts.C": ("void transmit(Connection c);",
                   "void transmit(Connection c) { }   (a parameter taken by value)"),
        "exp": ("A reference parameter binds to an existing object",
                "A reference parameter binds to an existing object without constructing a new "
                "one, so it is unaffected by Connection being abstract. Each other option makes "
                "the compiler create a complete, independent Connection — as a return value, as "
                "a by-value parameter, or as four default-constructed array elements — and an "
                "object of an abstract class cannot be created anywhere. Note the options are "
                "definitions on purpose: a bare declaration such as `Connection make();` "
                "compiles quite happily, because the restriction on abstract return and "
                "parameter types is enforced where the function is defined, not where it is "
                "declared."),
        "reviewFix": (
            "Options rewritten as definitions; keyed letter A unchanged. Both blind passes "
            "independently found the question ambiguous, and compiling settles it: as originally "
            "written the options were bare prototypes, and A, B and C ALL compiled — only D "
            "failed. The C++ ban on abstract class types as by-value parameters or return types "
            "bites at the point of definition, not declaration, so `Connection make();` and "
            "`void transmit(Connection c);` are both legal until a body appears. Re-verified "
            "independently with g++ -std=c++17 before editing: the three declarations compile, "
            "each fails once given a body, and with the options as definitions exactly one "
            "option now compiles. The explanation additionally teaches the declaration-versus-"
            "definition distinction, which is the actual subtlety the original question tripped "
            "over."
        ),
    },
    "GEN-T2U1B-013": {
        "exp": ("forcing needless copies instead",
                "Every member here already implements RAII correctly, so the compiler-generated "
                "destructor and copy/move operations for Report do exactly the right member-wise "
                "thing — this is the Rule of Zero. Declaring only the destructor, as in C, is the "
                "classic trap: a user-declared destructor suppresses the implicit move "
                "constructor and move assignment. For this class the damage is worse than the "
                "usual silent fall back to copying, because Report holds a std::unique_ptr and "
                "its implicit copy constructor is therefore deleted too — so `Report r2 = "
                "std::move(r1);` does not copy, it fails to compile, leaving a type that is "
                "neither movable nor copyable."),
        "reviewFix": (
            "Explanation corrected. The key (Rule of Zero) was right, but the stated consequence "
            "of option C was the generic textbook one and false for this particular class: it "
            "said a destructor-only declaration suppresses the moves, 'forcing needless copies "
            "instead'. Report holds a std::unique_ptr<Logger>, so its implicit copy constructor "
            "is deleted regardless of the destructor — the reviewer compiled this exact class and "
            "`Report r2 = std::move(r1);` fails with 'use of deleted function'. The type becomes "
            "neither copyable nor movable, a hard compile error rather than a silent performance "
            "loss, which is a strictly worse outcome than the explanation described. Key A "
            "unchanged."
        ),
    },
    "GEN-T2U1B-019": {
        "exp": ("C loses special evaluation-order behaviour when overloaded",
                "The dot, pointer-to-member, scope-resolution, conditional and sizeof operators "
                "are fixed by the core language grammar itself and never route through "
                "operator-function lookup, so no class can redefine them (typeid is excluded for "
                "the same reason). A is the trap: new, delete, new[] and delete[] are among the "
                "operators a class explicitly can overload, to control its own memory allocation. "
                "C and D both name operators that can be overloaded — and C's members are a "
                "different kind of limitation, not a ban: overloading && , || or the comma "
                "operator costs their built-in short-circuit and sequencing guarantees, though "
                "unary ! has no such guarantee to lose in the first place."),
        "reviewFix": (
            "Explanation narrowed. The key was right, but the rebuttal of group C asserted that "
            "it 'loses special evaluation-order behaviour when overloaded' as a property of all "
            "four operators listed. That holds for &&, || and the comma operator, which have "
            "built-in short-circuit or sequencing guarantees that vanish once overloaded, but not "
            "for unary !, which takes a single operand and has no such guarantee to begin with. "
            "The claim is now scoped to the three operators it is true of. Key B unchanged."
        ),
    },
    "GEN-T2U1B-010": {
        "exp": ("all of which qualify an implicit object parameter they don't have",
                "Static member functions belong to the class rather than to any instance, so "
                "there is no implicit object argument to bind this to; consequently they can name "
                "only static members without qualification. Two separate rules follow, and they "
                "are worth keeping apart: const and volatile are barred because they qualify the "
                "implicit object parameter, which a static member function does not have, whereas "
                "virtual is barred for an unrelated reason — dynamic dispatch resolves through a "
                "vtable pointer stored inside a particular object, and a static member function "
                "is called without one. B invents a null this pointer the language does not "
                "provide, and C wrongly makes the rule depend on whether the class has non-static "
                "data members, when it depends only on the function's own static declaration."),
        "reviewFix": (
            "Explanation split into the two rules it had collapsed into one. It said a static "
            "member function 'cannot carry const, volatile or virtual, all of which qualify an "
            "implicit object parameter they don't have'. That is accurate for const and volatile, "
            "which genuinely are cv-qualifiers on the implicit object parameter, but virtual is "
            "not a qualifier on that parameter at all — it is not part of the function type the "
            "way cv-qualifiers are and plays no part in overload resolution. Virtual is barred "
            "because dispatch needs a real instance carrying a vtable pointer. Key A unchanged."
        ),
    },

    # ---------------- Cloud batch 2 ----------------
    "GEN-T2U4B-009": {
        "q": ("for example Amazon EKS, Azure AKS or GKE",
              "A team runs its application on Amazon EKS with standard (self-managed or managed) "
              "node groups, rather than installing Kubernetes itself on IaaS virtual machines — a "
              "model often labelled Containers as a Service (CaaS). Where does this sit relative "
              "to IaaS and PaaS in terms of what the provider patches?"),
        "opts.A": ("with standard node pools the customer stil",
                   "The provider operates and patches the Kubernetes control plane, but with "
                   "standard EKS node groups the customer remains responsible for the worker "
                   "nodes' operating system patching"),
        "opts.C": ("In all managed Kubernetes offerings",
                   "In every managed Kubernetes offering the provider automatically patches both "
                   "the control plane and every worker node's operating system, so the customer "
                   "patches nothing"),
        "exp": ("Option C overreaches by claiming this holds for every m",
                "Managed Kubernetes takes the control plane off the customer's hands, while on "
                "EKS with standard node groups the node operating system remains the customer's "
                "job unless a node-less mode such as Fargate is chosen — which is why CaaS sits "
                "between IaaS (customer patches everything) and PaaS (provider patches "
                "everything). The provider is named deliberately, because this is exactly where "
                "the three big offerings diverge: GKE enables node auto-upgrade by default on "
                "Standard clusters, and AKS defaults new clusters to the NodeImage auto-upgrade "
                "channel, so on both of those the node OS is patched for you unless you opt out. "
                "Option C is still wrong because it claims this of every offering including EKS, "
                "and claims it for the control plane and nodes alike."),
        "reviewFix": (
            "Stem pinned to Amazon EKS; the key's claim scoped to it; the explanation now teaches "
            "the divergence. Both blind passes independently flagged this, and both checked the "
            "provider documentation. The question named EKS, AKS and GKE interchangeably while "
            "asserting that the customer still patches worker-node operating systems with "
            "standard node pools — true of EKS, but GKE enables node auto-upgrade by default on "
            "Standard clusters and AKS defaults new clusters to the NodeImage channel, both of "
            "which patch the node OS automatically without any node-less mode. A student would "
            "have memorised an EKS-specific responsibility as a universal property of managed "
            "Kubernetes. This is the same defect shape as the archive-storage question in the "
            "previous round: provider-specific behaviour asserted as universal in a stem that "
            "named no single provider. Key A unchanged."
        ),
    },
    "GEN-T2U4B-032": {
        "opts.C": ("automatically and globally for all r",
                   "No — since December 2020, S3 provides strong read-after-write consistency "
                   "automatically, in every AWS Region, for all requests from any client, at no "
                   "extra cost and with no change to the application"),
        "exp": ("AWS made S3 strongly consistent for every request from every client automatically",
                "AWS made S3 strongly consistent for every request from every client "
                "automatically in December 2020 — not merely for the writer's own subsequent "
                "reads (which kills A), and not limited to listings while excluding object GETs "
                "(which kills B, and in fact has it backwards: both are covered). The guarantee "
                "is delivered in every AWS Region while preserving regional isolation, so it "
                "says nothing about a write in one Region being immediately readable from "
                "another — cross-region replication remains asynchronous. D lands on the right "
                "conclusion for the wrong reason: before the 2020 change S3 genuinely was only "
                "eventually consistent for overwrites and deletes."),
        "reviewFix": (
            "Wording tightened from 'globally' to 'in every AWS Region', and the explanation now "
            "states the regional-isolation limit explicitly. The key was correct — no retry "
            "wrapper is needed — but AWS's December 2020 announcement delivers strong "
            "read-after-write consistency in all Regions while preserving regional isolation, so "
            "'globally' could be read as promising that a write in one Region is immediately "
            "visible to a reader in another. It is not, and cross-region replication is still "
            "asynchronous. Key C unchanged."
        ),
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    located, files, flagged = {}, {}, set()
    for _, gen in BATCHES.items():
        for path in sorted(gen.glob("*.done.json")):
            batch = json.loads(path.read_text())
            files[path] = batch
            for i, q in enumerate(batch):
                if not q.get("id"):
                    die("%s#%d has no id — stamp first" % (path.name, i + 1))
                located[q["id"]] = (path, i)
        for rp in sorted(gen.glob("review-*.json")):
            for fl in json.loads(rp.read_text()).get("flags", []):
                flagged.add(fl["id"])

    if not flagged:
        die("no reviewer flags found — nothing to apply")
    if flagged - set(FIXES):
        die("flagged but unfixed: %s" % ", ".join(sorted(flagged - set(FIXES))))
    if set(FIXES) - flagged:
        die("fix defined for %s, which no reviewer flagged" % ", ".join(sorted(set(FIXES) - flagged)))

    for qid, spec in sorted(FIXES.items()):
        if qid not in located:
            die("%s is not in any .done.json" % qid)
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
                if cur is None or must not in cur:
                    die("%s option %s: expected to contain %r, found %r" % (qid, letter, must, cur))
                q["opts"][letter] = new
            else:
                if must not in str(q.get(field, "")):
                    die("%s field %r: expected to contain %r" % (qid, field, must))
                q[field] = new
        if sorted(q["opts"]) != ["A", "B", "C", "D"]:
            die("%s: options are no longer exactly A-D" % qid)
        if q["ans"] not in q["opts"]:
            die("%s: ans %r is not one of its own options" % (qid, q["ans"]))
        if len({str(v).strip().lower() for v in q["opts"].values()}) != 4:
            die("%s: options are no longer distinct" % qid)

    if args.check:
        print("check ok: %d fixes apply cleanly, covering all %d flagged questions"
              % (len(FIXES), len(flagged)))
        return

    for path, batch in sorted(files.items()):
        path.write_text(json.dumps(batch, indent=1, ensure_ascii=False) + "\n")
    print("applied %d fixes across %d flagged questions" % (len(FIXES), len(flagged)))


if __name__ == "__main__":
    main()
