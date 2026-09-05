#!/usr/bin/env python3
"""Apply the four reviewers' findings to the authored TECH2 Unit 1 batch.

    python3 tools/system-analyst-build/apply_u1_gen_review_fixes.py [--check]

Two blind passes reviewed each half of the batch (136 question-reviews over 68
questions). They returned 11 flag instances on 7 distinct questions and **no
wrong keys** — every keyed letter survives unchanged here.

Four of the seven were raised independently by both blind passes of their half
(027, 029, 043, 063), which is the signal the two-method design exists to
produce. Six of the seven are the same defect shape: a correct key justified by
a rule stated more broadly than it holds. That is the third consecutive pass in
which that shape dominates, and it is why the review brief now calls it out by
name and asks for a separate read of the explanations alone.

EVERY CLAIM WAS RE-VERIFIED BEFORE BEING ACTED ON, because a reviewer is as
capable of being confidently wrong as an author. All of these were checked by
compiling under the same g++ 13.3 / -std=c++17 the reviewers used:
  - A destructor is NOT unconditionally implicitly noexcept. A class with a
    member whose destructor is noexcept(false) has is_nothrow_destructible == 0
    while a plain class has 1, so the rule needs its qualifying clause. (027)
  - <stdexcept> genuinely does not declare std::system_error: including only
    <stdexcept> and naming std::system_error is a hard compile error
    ("'system_error' in namespace 'std' does not name a type"). The stem asked
    about "the hierarchy of <stdexcept>" while offering a type that is not in
    it. (063)
  - The replacement for 015 was verified too: `W a[5]` runs five constructors,
    while `vector<W> v; v.reserve(5)` runs none and leaves size 0, capacity 5.

The two flags that are not over-broad rules:
  - 015 duplicated 028 across two different leaves — the exact failure
    make_u1_briefs.py predicted in its docstring, where two adjacent leaves land
    on the same fact from opposite sides and neither author can see the other's
    work. Both keyed the proposition "declaring any constructor suppresses the
    implicitly declared default constructor". 028 sits on the constructors leaf
    where that fact belongs, so 015 is rewritten onto ground its own leaf
    ("memory allocation for objects; array of objects") actually owns.
  - 063 is a wrong specific in an option, fixed by swapping the option rather
    than the key.

Each edit asserts on a distinctive fragment of the text it replaces, so if an
upstream file ever changes under it the script stops rather than silently
rewriting the wrong question. `--check` verifies without writing.
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "system-analyst-build/staged/tech2-u1-gen"


def die(msg):
    sys.exit("apply_u1_gen_review_fixes: " + msg)


# Each entry: id -> {field: (must_contain, new_value)} plus "reviewFix".
# "opts.X" addresses a single option. must_contain is asserted before writing.
FIXES = {

    # ---- u1a-A, bad-explanation (low) -------------------------------------
    "GEN-T2U1-009": {
        "exp": (
            "adding a member function to a class does not make its objects any bigger",
            "Member function code is generated once per class and shared by every object, which "
            "receives the address of the object it is to work on; only the non-static data members "
            "are laid out inside an object, and a static data member has a single shared definition "
            "outside every object. Option D is the classic misconception — objects do not carry "
            "copies of their member functions, which is why adding a non-virtual member function to "
            "a class does not make its objects any bigger. Adding the first virtual function is the "
            "exception, since a vtable-based implementation then has to store a pointer inside each "
            "object.",
        ),
        "reviewFix": (
            "Explanation qualified. The key was right, but the closing generalisation — \"adding a "
            "member function to a class does not make its objects any bigger\" — is false for the "
            "first virtual member function, which on a vtable-based implementation adds a pointer "
            "to every object. GEN-T2U1-018 in this same batch teaches exactly that, so the two "
            "questions contradicted each other. The sentence now says non-virtual and names the "
            "exception. Key C unchanged."
        ),
    },

    # ---- u1a-B, duplicate (medium) ----------------------------------------
    "GEN-T2U1-015": {
        "q": (
            "Item shelf[5]",
            "A Widget has a default constructor that logs each time it runs. Comparing "
            "`Widget a[5];` with `std::vector<Widget> v; v.reserve(5);`, how many times does the "
            "default constructor run in each case?",
        ),
        "opts.A": (
            "copy-initialised from a temporary",
            "Five times for the array and five times for the reserve, since both set aside room "
            "for five Widgets",
        ),
        "opts.B": (
            "Declaring any constructor of its own suppresses",
            "Five times for the array, and not at all for the reserve: reserve only acquires raw "
            "capacity, leaving the vector's size at 0 with no elements constructed",
        ),
        "opts.C": (
            "must be declared `explicit`",
            "Not at all for the array, since array elements are constructed lazily on first use, "
            "and five times for the reserve",
        ),
        "opts.D": (
            "Arrays of class type are not permitted",
            "Once for the array, which then copies that element into the other four slots, and "
            "once for the reserve",
        ),
        "exp": (
            "The implicit default constructor is declared only when the class declares no constructor",
            "An array of class type default-initialises every one of its elements at the point of "
            "declaration, so all five Widgets exist immediately. reserve() is the opposite: it only "
            "guarantees capacity for five, allocating raw storage without constructing anything, so "
            "size() stays 0 until elements are actually inserted. Option C inverts the array case — "
            "there is no lazy construction of array elements — and resize(5), not reserve(5), is the "
            "vector call that would construct five objects.",
        ),
        "reviewFix": (
            "Rewritten because it duplicated GEN-T2U1-028. Both keyed the same proposition — that "
            "declaring any constructor suppresses the implicitly declared default constructor — "
            "reached from opposite sides on two different leaves, which is precisely the "
            "cross-leaf duplication make_u1_briefs.py warned about, since neither author could see "
            "the other's batch. 028 sits on the constructors-and-destructors leaf where that fact "
            "belongs and is kept as written. This question is re-aimed at its own leaf's ground, "
            "memory allocation for objects and arrays of objects, and now contrasts array "
            "default-initialisation with vector::reserve. Verified by compiling: `W a[5]` runs five "
            "constructors, `vector<W> v; v.reserve(5)` runs none and leaves size 0, capacity 5. Key "
            "remains B."
        ),
    },

    # ---- u1a-A + u1a-B, bad-explanation (medium), independently ------------
    "GEN-T2U1-027": {
        "q": (
            "an exception escapes a destructor that carries no exception specification of its own",
            "In C++11 and later, an exception escapes the destructor of a class that has no bases "
            "or members with throwing destructors, and whose destructor carries no exception "
            "specification of its own. What happens?",
        ),
        "exp": (
            "Since C++11 a destructor with no explicit exception specification is implicitly noexcept",
            "Since C++11 a destructor with no exception specification of its own is implicitly "
            "noexcept unless one of its base or member destructors is itself potentially throwing — "
            "which the stem rules out — so an escaping exception here crosses a noexcept boundary "
            "and std::terminate runs without any enclosing handler being consulted. Option A is the "
            "pre-C++11 answer; declaring the destructor noexcept(false) restores it, but even then "
            "an exception thrown while another is already unwinding the stack terminates the "
            "program, which is the underlying reason destructors should not throw.",
        ),
        "reviewFix": (
            "Stem and explanation qualified; flagged independently by both blind reviewers of this "
            "half. The key was right for the ordinary case, but the rule was stated "
            "unconditionally: a destructor with no exception-specification of its own is implicitly "
            "noexcept only when no base or member destructor is potentially throwing. Verified by "
            "compiling — a class holding a member whose destructor is noexcept(false) reports "
            "is_nothrow_destructible == 0, where a plain class reports 1. The stem now excludes "
            "that case so the question has exactly one defensible answer, and the explanation "
            "states the qualified rule. Key C unchanged."
        ),
    },

    # ---- u1a-A + u1a-B, bad-explanation (low), independently ---------------
    "GEN-T2U1-029": {
        "exp": (
            "because each one either operates on a name or a type rather than on a value",
            "operator-> can be overloaded, and doing so is what makes smart-pointer and proxy "
            "classes usable with pointer syntax; the compiler applies the overload repeatedly until "
            "a real pointer is produced. The other three are on the short fixed list the language "
            "declines to make overloadable — ::, ., .*, ?:, sizeof, typeid and alignof — a list to "
            "be learned rather than derived, since the members do not share one reason: :: and . "
            "take a name on the right, while sizeof, typeid and alignof are resolved against a type. "
            "Option B is the tempting one: -> is overloadable while the closely related . is not, "
            "and the asymmetry is deliberate rather than an oversight.",
        ),
        "reviewFix": (
            "Explanation corrected; flagged independently by both blind reviewers of this half. The "
            "key and the list of reserved operators were both right, but the unifying rationale was "
            "false as stated — \"each one either operates on a name or a type rather than on a "
            "value\" is untrue of ?:, which takes three ordinary value operands, and of .*, whose "
            "left operand is a value. The explanation no longer offers a single false reason for a "
            "list that does not have one. Key C unchanged."
        ),
    },

    # ---- u1b-A + u1b-B, bad-explanation (medium), independently ------------
    "GEN-T2U1-043": {
        "exp": (
            "it would only become undefined if speak() were pure virtual with no definition",
            "While a base constructor is running, the object is not yet a D: its dynamic type is B, "
            "so a virtual call from inside B's constructor resolves to B::speak. The behaviour is "
            "fully defined here, which rules out the undefined-behaviour option. It would become "
            "undefined if speak() were declared pure virtual, and that holds whether or not the "
            "pure virtual function is given a definition — [class.abstract] makes a virtual call to "
            "a pure virtual function from a constructor or destructor of an abstract class "
            "undefined either way, so providing a body does not rescue it.",
        ),
        "reviewFix": (
            "Explanation corrected; flagged independently by both blind reviewers of this half. The "
            "key was right and the program's output was confirmed by compiling, but the final "
            "clause stated the undefined-behaviour condition more narrowly than the standard does: "
            "\"only ... if speak() were pure virtual with no definition, since there would then be "
            "no function to call\". [class.abstract] makes the virtual call undefined whether or not "
            "the pure virtual function has a definition, so the stated reason was wrong as well as "
            "the condition. Key A unchanged."
        ),
    },

    # ---- u1b-B, bad-explanation (low) --------------------------------------
    "GEN-T2U1-053": {
        "exp": (
            "which is also why the seek to a later record could not find anything",
            "Opening with out and neither in nor app creates-or-truncates the file, exactly like the "
            "\"w\" mode of C stdio, so the records were destroyed before the seek ever ran; combining "
            "in with out opens the existing file without truncating and allows read-modify-write in "
            "place. Option C is plausible only if you assume truncation happens at write time, "
            "whereas the file was already empty when the stream was opened.",
        ),
        "reviewFix": (
            "Explanation trimmed. The key was right and the truncation-at-open behaviour was "
            "confirmed by compiling, but the closing clause — that the file being empty is \"why the "
            "seek to a later record could not find anything\" — describes something that does not "
            "happen. Seeking past the end of an output stream is not an error and does not fail to "
            "\"find\" anything; a subsequent write simply extends the file from that offset. The "
            "clause is removed rather than reworded, since the preceding sentence already carries "
            "the whole explanation. Key A unchanged."
        ),
    },

    # ---- u1b-A + u1b-B, wrong-specific (low), independently ----------------
    "GEN-T2U1-063": {
        "opts.D": ("std::system_error", "std::underflow_error"),
        "exp": (
            "std::overflow_error and std::system_error are runtime_error descendants too",
            "std::length_error sits on the logic_error branch: it reports an attempt to produce an "
            "object beyond its own maximum size, a fault visible from the program's arguments before "
            "the operation is attempted. std::range_error is the near-miss — despite the similar "
            "name it is a runtime_error, reported for a result that cannot be represented — and "
            "std::overflow_error and std::underflow_error are runtime_error descendants too.",
        ),
        "reviewFix": (
            "Option D replaced; flagged independently by both blind reviewers of this half. The key "
            "was right, but the stem asked about \"the standard exception hierarchy of <stdexcept>\" "
            "while offering std::system_error, which that header does not declare — verified by "
            "compiling: including only <stdexcept> and naming std::system_error is a hard error, "
            "\"'system_error' in namespace 'std' does not name a type\". It lives in <system_error>. "
            "Option D is now std::underflow_error, which is in <stdexcept> and is a runtime_error, "
            "so it remains a wrong-but-plausible distractor. Key B unchanged."
        ),
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

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

    # Every flag must be covered, and every fix must answer a real flag.
    flagged = set()
    for rp in sorted(GEN.glob("review-*.json")):
        for fl in json.loads(rp.read_text()).get("flags", []):
            flagged.add(fl["id"])
    if not flagged:
        die("no reviewer flags found in %s" % GEN)
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
        if sorted(q["opts"]) != ["A", "B", "C", "D"]:
            die("%s: options are no longer exactly A-D" % qid)
        if q["ans"] not in q["opts"]:
            die("%s: ans %r is not one of its own options" % (qid, q["ans"]))
        if len({str(v).strip().lower() for v in q["opts"].values()}) != 4:
            die("%s: options are no longer distinct" % qid)
        changed += 1

    if args.check:
        print("check ok: %d fixes apply cleanly, covering all %d flagged question(s)"
              % (changed, len(flagged)))
        return

    # Preserve what the reviewers actually saw before overwriting the batch,
    # mirroring _all-as-reviewed.json in the U2/U4 directory.
    all_path = GEN / "_all.json"
    snapshot = GEN / "_all-as-reviewed.json"
    if all_path.exists() and not snapshot.exists():
        snapshot.write_text(all_path.read_text())
        print("snapshotted _all.json -> _all-as-reviewed.json")

    for path, batch in files.items():
        path.write_text(json.dumps(batch, indent=1, ensure_ascii=False) + "\n")

    print("applied %d fixes (%s)" % (changed, ", ".join(sorted(FIXES))))
    print("re-run make_review_batches.py --force to refresh _all.json, then the importer")


if __name__ == "__main__":
    main()
