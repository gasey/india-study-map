#!/usr/bin/env python3
"""Replace Technical Paper II with the 30 July 2026 syllabus, keeping the old one as legacy.

    python3 tools/system-analyst-build/migrate_tech2_2026.py

WHY. `TECH2` in this app was still the E-Governance paper from the 2018
Informatics Officer syllabus -- 19 units, and zero questions ever imported
against it. The ICT Department's notification No. A-12038/68/2025-ICT dated
30 July 2026 (source PDF: ~/workspace/projects/personal/syllabusex.pdf, the
same document TECH1 was already migrated to) replaces Paper II wholesale with
four units: Object Oriented Programming 40, Web Technologies 60, Database
Management Systems 60, Cloud Computing 40 = 200 marks.

There is no unit-to-unit correspondence between E-Governance and those four --
not one topic survives -- so this follows the TECH1 precedent set by commit
249d96b rather than trying to merge the two syllabi under one paper name. The
old paper becomes a first-class `TECH2_LEGACY` with `legacy: true` and
`counts_for_merit: false`, so it stays revisable in Practice/Study/Mock while
every `!p.legacy` view in app.js keeps reporting the actual 2026 exam.

QUESTIONS MOVED IN. Two pockets of already-solved questions cover new TECH2
units and are retagged here (no re-solving, no re-extraction):

  * `TECH1_LEGACY` unit 5 "Database Management System" -- 55 real Informatics
    Officer / CSE questions. 51 map onto the new DBMS unit. The other 4 do not:
    two are data-warehousing, one distributed databases, one business
    information systems, and the 2026 DBMS unit covers none of the three. They
    STAY in TECH1_LEGACY. Forcing them into the nearest new subtopic would
    misfile them and inflate that subtopic's apparent coverage, which is the
    failure mode CLAUDE.md records for July-2023 Q82.
  * `OFFSYL` unit 2 "Object-Oriented Programming (language level)" -- 3
    questions parked as off-syllabus under the old syllabus. The 2026 Paper II
    makes OOP a 40-mark unit, so they are on-syllabus now.

`src` / `sitting` / `srcKey` / `no` / `ans` / `exp` / `conf` / `prov` are all
carried across untouched, so the Past papers view still shows each question
under the sitting it was actually printed in. Only `paper`, `unit` and `sub`
change.

WHY THE RELATIONAL MODEL GETS ITS OWN SUBTOPIC. 14 of the 51 DBMS questions are
about keys, tuples, domains, foreign-key integrity and relational algebra, and
were tagged "The Relational Model and Normalization" under the old syllabus.
Exactly one of them is about normalization. The 2026 text does not name the
relational model, but it does say "data models", which the relational model is,
so subtopic 2 exists to hold them. The alternative -- filing 14 relational-model
questions under "functional dependencies and normal forms" -- would teach the
wrong index of the syllabus.

IDEMPOTENT. Both `.js` files are mutated in place (System Analyst convention --
see HANDOFF-PROGRAMMER-2018.md; do NOT switch this app to whole-file
regeneration). The new TECH2 is rebuilt from the hardcoded spec below every
run, the legacy paper is located under either id, and the retag is keyed on
question id, so re-running changes nothing.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DATA = ROOT / "public" / "mpsc-system-analyst" / "data"
QUESTIONS_FILE = DATA / "questions.js"
SYLLABUS_FILE = DATA / "syllabus.js"
CONCEPTS_FILE = DATA / "concepts.js"

AUTHORITY = "ICT Department Informatics Officer syllabus, 30 July 2026"

# ---------------------------------------------------------------------------
# The new paper, transcribed from THCHNICAL SUBJHCT PAPER-II of the 30 July
# 2026 notification (the PDF's own text layer mangles that heading; the marks
# and topic lists below are read off the same pages).
#
# Subtopic granularity follows what TECH1 already established for this
# syllabus: 6-9 broad leaves per unit, each tracking one clause-group of the
# printed text, NOT one leaf per named technology. The printed text for units 2
# and 4 is a single unbroken 15-line sentence apiece; the groupings below are
# where its semicolons and internal headings fall.
#
# OCR NOTE. The notification's text layer is badly degraded and several terms
# arrive mangled: "Kubemetes", "Apls", "Polymoxphism", "CSRE", "Iaas/Paas/Saas",
# "Devops", "Finops", "Openstack", "Leaming", "Ethemet", "sparming". These are
# corrected to their real spellings below -- they are OCR damage, not the
# Department's spelling. (Contrast the General Studies banks, where the paper's
# OWN misspellings are preserved on purpose because there the artefact is the
# question text a candidate actually sat.)
# ---------------------------------------------------------------------------
NEW_TECH2 = {
    "id": "TECH2",
    "name": "Technical Subject Paper II",
    "marks": 200,
    "questions": 50,
    "marks_per_question": 2,
    "duration_hours": 3,
    "type": "MCQ (100 marks) + conventional/essay (100 marks)",
    "counts_for_merit": True,
    "authority": AUTHORITY,
    "coverage_note": (
        "Units 2 (Web Technologies) and 4 (Cloud Computing) are new in the 30 "
        "July 2026 syllabus and carry 100 of this paper's 200 marks between "
        "them. No past MPSC paper tests them: a sweep of all 712 questions "
        "extracted from the seven 2010-2023 MES/ILM/JE sittings and all 1764 "
        "already in this bank found 5 basic HTML/ASP questions and zero on "
        "cloud computing. The unit breakdown here is complete, but the "
        "question bank behind these two units is not, and no past paper can "
        "fill it."
    ),
    "units": [
        {
            "no": "1",
            "title": "Object Oriented Programming",
            "marks": 40,
            "subtopics": [
                "OOP concepts, applications and the OOP process",
                "Classes, objects, member functions and memory allocation",
                "Constructors and destructors",
                "Polymorphism, function and operator overloading",
                "Inheritance, virtual functions and pointers to objects",
                "I/O streams and file handling in OOP",
                "Exception handling and strings",
            ],
        },
        {
            "no": "2",
            "title": "Web Technologies",
            "marks": 60,
            "subtopics": [
                "Web architecture, client-server communication, HTTP/HTTPS, DNS and hosting",
                "HTML, semantic elements, forms, multimedia, Canvas, SVG and accessibility",
                "CSS, Flexbox, Grid and responsive web design",
                "JavaScript, the DOM, event handling, asynchronous programming, JSON and Fetch",
                "Frontend frameworks: components, routing, state management and API integration",
                "Backend development in PHP and Python: REST APIs, CRUD, middleware, auth, sessions and ORM",
                "Git version control, Docker, CI/CD, Linux administration, Nginx and deployment",
                "Web security: OWASP Top 10, SSL/TLS, CSRF, XSS and SQL injection prevention",
                "Architecture and scale: MVC, microservices, SOLID, event-driven systems, caching and queues",
                "AI-assisted web development, generative AI APIs, Model Context Protocol, analytics, ethics and law",
            ],
        },
        {
            "no": "3",
            "title": "Database Management Systems",
            "marks": 60,
            "subtopics": [
                "Database system concepts, architecture, interfaces and data independence",
                "Data models and the relational model: keys, tuples, domains and relational algebra",
                "Entity-Relationship modelling",
                "SQL and basic query statements",
                "Database design, functional dependencies and normal forms",
                "Query processing and optimisation",
                "Transaction processing, schedules and recoverability",
                "Concurrency control, locking and time stamping",
            ],
        },
        {
            "no": "4",
            "title": "Cloud Computing",
            "marks": 40,
            "subtopics": [
                "Distributed, edge and cloud computing; NIST cloud architecture",
                "Deployment and service models: IaaS, PaaS, SaaS and serverless",
                "Cloud-native architecture, microservices, service mesh, elasticity and load balancing",
                "Virtualization: virtual machines, hypervisors, and CPU/storage/network virtualization",
                "Containers, Docker, Kubernetes orchestration, Infrastructure as Code and DevOps",
                "Cloud storage, compute, networking, managed databases, monitoring and multi-cloud",
                "Cloud security and governance: shared responsibility, IAM, Zero Trust, DevSecOps, FinOps and SLAs",
            ],
        },
    ],
}

# ---------------------------------------------------------------------------
# Recommended reading. The Syllabus tab renders `SYLLABUS.reading` under a
# heading per group, and its "Technical Paper II — E-Governance" group would
# otherwise keep recommending Prabhu and Bhatnagar for a paper that no longer
# examines e-governance at all -- the most misleading kind of staleness,
# because a reader acts on it by buying a book.
#
# Every title below is a genuinely standard text for its unit, chosen because
# the syllabus wording tracks its chapter order:
#   * the OOP unit's phrasing ("class specifiers", "limitations of operator
#     overloading", "managing I/O operations", "ifstream") is C++-shaped and
#     follows Balagurusamy's chapter sequence;
#   * the DBMS unit reads almost verbatim off Elmasri & Navathe's contents
#     page -- "schemes and instances", "data independence", "Query Processing
#     and Optimisation", "Schedules and Recoverability", "Time Stamping";
#   * the syllabus itself names "NIST Cloud Architecture" and "OWASP Top 10",
#     so those primary sources are cited directly rather than via a textbook.
# No title is invented, and where no single standard text covers a unit (Web
# Technologies) that is said plainly instead of padding the list.
# ---------------------------------------------------------------------------
NEW_TECH2_READING = {
    "for": "Technical Paper II — OOP, Web Technologies, DBMS and Cloud",
    "items": [
        {
            "t": "Object Oriented Programming with C++",
            "by": "E. Balagurusamy, McGraw Hill",
            "note": "Unit 1. The syllabus is written against C++ specifically — "
                    "class specifiers, the limitations of operator overloading, "
                    "pure virtual functions, ifstream/ofstream file modes — and "
                    "this book's chapter order matches the unit's clause order "
                    "closely enough to use as the unit's spine.",
        },
        {
            "t": "Fundamentals of Database Systems",
            "by": "Elmasri and Navathe, Pearson",
            "note": "Unit 3, and the closest thing this paper has to a source "
                    "text: the unit's wording tracks this book's contents page "
                    "almost phrase for phrase, including 'schemas and instances', "
                    "data independence, query processing and optimisation, "
                    "recoverability and serializability, and time stamping.",
        },
        {
            "t": "Database System Concepts",
            "by": "Silberschatz, Korth and Sudarshan, McGraw Hill",
            "note": "Unit 3, alternative. Stronger than Elmasri on concurrency "
                    "control and recovery, which is the unit's last two clauses.",
        },
        {
            "t": "MDN Web Docs",
            "by": "Mozilla — developer.mozilla.org",
            "note": "Unit 2. Free, and the reference the unit's own vocabulary "
                    "comes from (semantic elements, Canvas, SVG, Flexbox, Grid, "
                    "the DOM, Fetch, accessibility standards). No single Indian "
                    "exam textbook covers this unit's 60 marks — it spans "
                    "frontend, backend, DevOps and web security — so read it "
                    "topic by topic against the unit's subtopic list rather than "
                    "looking for one book.",
        },
        {
            "t": "OWASP Top 10",
            "by": "OWASP Foundation — owasp.org/Top10",
            "note": "Unit 2, web security. Free, and named explicitly in the "
                    "syllabus text alongside CSRF, XSS and SQL injection "
                    "prevention, so it is a primary source rather than a "
                    "commentary.",
        },
        {
            "t": "Cloud Computing: Concepts, Technology & Architecture",
            "by": "Thomas Erl, Pearson",
            "note": "Unit 4. Covers the service and deployment models, "
                    "virtualization, and the shared-responsibility and SLA "
                    "material the unit ends on.",
        },
        {
            "t": "NIST Cloud Computing Reference Architecture (SP 500-292) and "
                 "The NIST Definition of Cloud Computing (SP 800-145)",
            "by": "National Institute of Standards and Technology",
            "note": "Unit 4. Free, short, and cited by name in the syllabus "
                    "('NIST Cloud Architecture'), which makes the five essential "
                    "characteristics and the IaaS/PaaS/SaaS definitions "
                    "examinable in their original wording.",
        },
    ],
}

LEGACY_READING_FOR = "Technical Paper II — E-Governance (superseded syllabus)"
LEGACY_READING_NOTE = (
    "This group is kept for TECH2_LEGACY. E-Governance was removed from "
    "Technical Paper II by the notification of 30 July 2026 — do not buy these "
    "for the current exam."
)

LEGACY_NAME = "Technical Paper II — E-Governance (superseded syllabus)"
LEGACY_AUTHORITY = (
    "Informatics Officer syllabus of the ICT Department, Govt. of Mizoram, as "
    "published by MPSC for the Informatics Officer Examination 2018 — "
    "SUPERSEDED for Paper II by the notification of 30 July 2026, which "
    "replaced E-Governance with Object Oriented Programming, Web Technologies, "
    "Database Management Systems and Cloud Computing. Kept because it is a "
    "coherent body of e-governance material worth revising, not because it is "
    "still examined."
)

# ---------------------------------------------------------------------------
# Retag plan, decided by reading all 58 question stems rather than by matching
# on the old sub-tag string -- the old tags do not partition cleanly onto the
# new units (see the module docstring on the relational model).
#
#   question id -> new subtopic INDEX within its new unit (0-based)
# ---------------------------------------------------------------------------
DBMS_RETAG = {
    # 1. concepts, architecture, interfaces, data independence
    "TECH1_2024-79": 0,   # data about relations / the data dictionary
    "TECH1_2024-84": 0,   # responsibilities of the DBA
    "TECH1_OLD-84": 0,    # data about relations / the data dictionary
    "TECH1_CSE_130": 0,   # schema vs instance
    "TECH1_CSE_177": 0,   # logical data independence
    "TECH1_2024-76": 0,   # logical vs physical design focus
    # 2. data models and the relational model
    "TECH1_2024-74": 1, "TECH1_2024-75": 1, "TECH1_OLD-71": 1,
    "TECH1_OLD-83": 1, "TECH1_CSE_131": 1, "TECH1_CSE_137": 1,
    "TECH1_CSE_138": 1, "TECH1_CSE_142": 1, "TECH1_CSE_167": 1,
    "TECH1_CSE_168": 1, "TECH1_CSE_171": 1, "TECH1_CSE_173": 1,
    "TECH1_CSE_210": 1, "TECH1_CSE_215": 1,
    # 3. Entity-Relationship modelling
    "TECH1_2024-81": 2, "TECH1_OLD-78": 2, "TECH1_OLD-85": 2,
    "TECH1_CSE_133": 2, "TECH1_CSE_169": 2, "TECH1_CSE_174": 2,
    "TECH1_OLD-73": 2,    # business rules, an ER-modelling input
    "TECH1_2024-85": 2,   # derived attribute
    # 4. SQL and basic query statements
    "TECH1_2024-72": 3, "TECH1_2024-82": 3, "TECH1_OLD-79": 3,
    "TECH1_CSE_141": 3, "TECH1_CSE_148": 3, "TECH1_2024-80": 3,
    "TECH1_OLD-76": 3, "TECH1_OLD-82": 3, "TECH1_CSE_132": 3,
    "TECH1_CSE_217": 3, "TECH1_CSE_135": 3, "TECH1_CSE_136": 3,
    "TECH1_CSE_144": 3, "TECH1_2024-78": 3,
    # 5. database design, functional dependencies, normal forms
    "TECH1_OLD-77": 4,    # transitive dependency
    "TECH1_2024-77": 4,   # what normalization achieves
    "TECH1_CSE_140": 4, "TECH1_CSE_143": 4, "TECH1_CSE_147": 4,
    "TECH1_2024-71": 4,   # foreign key constraint during design
    # 6. query processing and optimisation -- nothing in the bank reaches it
    # 7. transaction processing, schedules, recoverability
    "TECH1_OLD-81": 6,    # committed transaction rolled back
    # 8. concurrency control, locking, time stamping
    "TECH1_OLD-72": 7,    # exclusive lock
    "TECH1_OLD-80": 7,    # deadlock among waiting transactions
}

# Stay in TECH1_LEGACY unit 5: the 2026 DBMS unit covers none of these.
DBMS_KEEP = {
    "TECH1_2024-73": "data warehousing",
    "TECH1_OLD-74": "data warehousing",
    "TECH1_OLD-75": "distributed databases",
    "TECH1_2024-83": "business information systems / data integration",
}

# OFFSYL unit 2 -> TECH2 unit 1. Keyed on id, not on the old sub-tag, so a
# re-run still resolves them after the tag has been rewritten.
OOP_RETAG = {
    "TECH1_CSE_100": 4,   # inheritance and its forms
    "TECH1_CSE_101": 3,   # operator overloading
    "TECH1_CSE_096": 1,   # the this pointer and open recursion
}


def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(rf"window\.{name}\s*=\s*(.*);\s*", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))


def save_js(path, name, data):
    indent = 2 if name == "SYLLABUS" else 1
    path.write_text(
        f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=indent) + ";\n",
        encoding="utf-8",
    )


def migrate_syllabus(syllabus):
    papers = syllabus["papers"]
    by_id = {p["id"]: p for p in papers}

    # The E-Governance paper may still be sitting under `TECH2` (first run) or
    # already under `TECH2_LEGACY` (re-run).
    old = by_id.get("TECH2_LEGACY")
    if old is None:
        candidate = by_id.get("TECH2")
        if candidate is None:
            sys.exit("FAIL: no TECH2 paper found at all")
        # Identify it by content, not by id: if TECH2 is already the new paper
        # and no TECH2_LEGACY exists, the E-Governance units are simply gone
        # and this script must not invent them.
        titles = {u["title"] for u in candidate["units"]}
        if "Understanding Government and Governance" not in titles:
            sys.exit(
                "FAIL: TECH2 is not the E-Governance paper and there is no "
                "TECH2_LEGACY. Refusing to run: the old units would be lost. "
                "Restore them from git first."
            )
        old = candidate

    legacy = dict(old)
    legacy["id"] = "TECH2_LEGACY"
    legacy["name"] = LEGACY_NAME
    legacy["counts_for_merit"] = False
    legacy["legacy"] = True
    legacy["authority"] = LEGACY_AUTHORITY
    # The old paper's units sum to 200 as printed, which is right for what it
    # was, and it no longer contributes to any merit total anyway.

    new = json.loads(json.dumps(NEW_TECH2))
    total = sum(u["marks"] for u in new["units"])
    if total != new["marks"]:
        sys.exit(f"FAIL: new TECH2 units sum to {total}, not {new['marks']}")

    # Order: keep each paper where it was, put the new TECH2 in the old TECH2's
    # slot and TECH2_LEGACY straight after it, mirroring TECH1/TECH1_LEGACY.
    rebuilt = []
    for p in papers:
        if p["id"] in ("TECH2", "TECH2_LEGACY"):
            if not any(x["id"] == "TECH2" for x in rebuilt):
                rebuilt.append(new)
                rebuilt.append(legacy)
            continue
        rebuilt.append(p)
    if not any(x["id"] == "TECH2" for x in rebuilt):
        sys.exit("FAIL: lost TECH2 while reordering")
    syllabus["papers"] = rebuilt

    migrate_reading(syllabus)

    syllabus.setdefault("syllabus_authority", {})["technical_papers"] = (
        "Informatics Officer syllabus of the Information & Communication "
        "Technology (ICT) Department, Govt. of Mizoram, notification No. "
        "A-12038/68/2025-ICT dated 30 July 2026. Papers I and II both follow "
        "this document; the superseded 2018 syllabus is retained as "
        "TECH1_LEGACY and TECH2_LEGACY."
    )
    return new, legacy


def retag_questions(questions, new_tech2):
    """Move the planned questions into TECH2. Driven by id, so re-running is a no-op.

    Each id is looked up directly rather than reached by scanning for its OLD
    paper/unit, because after the first run that old location no longer exists.
    An earlier version scanned instead and refused to run a second time, which
    breaks this app's in-place-mutation convention.
    """
    units = {u["no"]: u["subtopics"] for u in new_tech2["units"]}
    by_id = {}
    for q in questions:
        by_id.setdefault(q["id"], []).append(q)

    dupes = sorted(i for i, v in by_id.items() if len(v) > 1)
    if dupes:
        sys.exit(f"FAIL: duplicate question ids in the bank: {dupes[:5]}")

    moved = {"1": 0, "3": 0}
    for plan, unit_no in ((DBMS_RETAG, "3"), (OOP_RETAG, "1")):
        for qid, idx in plan.items():
            if qid not in by_id:
                sys.exit(f"FAIL: {qid} is in the retag plan but not in the bank. "
                         "The plan is stale -- check git history before editing it.")
            q = by_id[qid][0]
            here = (q["paper"], str(q["unit"]))
            expected_from = ("TECH1_LEGACY", "5") if unit_no == "3" else ("OFFSYL", "2")
            if here not in (expected_from, ("TECH2", unit_no)):
                sys.exit(
                    f"FAIL {qid}: expected it in {expected_from[0]} unit "
                    f"{expected_from[1]} (first run) or TECH2 unit {unit_no} "
                    f"(re-run), found {here[0]} unit {here[1]}. Something else "
                    "moved it; resolve by hand rather than overwriting."
                )
            q["paper"], q["unit"], q["sub"] = "TECH2", unit_no, units[unit_no][idx]
            moved[unit_no] += 1

    # Anything still sitting in the two source units must be a deliberate keep.
    kept_legacy = 0
    for q in questions:
        if q["paper"] == "TECH1_LEGACY" and str(q["unit"]) == "5":
            if q["id"] not in DBMS_KEEP:
                sys.exit(
                    f"FAIL {q['id']}: a TECH1_LEGACY unit-5 question is in "
                    "neither DBMS_RETAG nor DBMS_KEEP. A question was added to "
                    "that unit after this plan was written -- decide where it "
                    "goes rather than letting it fall through."
                )
            kept_legacy += 1
        elif q["paper"] == "OFFSYL" and str(q["unit"]) == "2":
            sys.exit(f"FAIL {q['id']}: left behind in OFFSYL unit 2 with no retag target")

    stranded = sorted(set(DBMS_KEEP) - set(by_id))
    if stranded:
        sys.exit(f"FAIL: DBMS_KEEP names ids not in the bank: {stranded}")
    return moved, kept_legacy


def migrate_reading(syllabus):
    """Retitle the E-Governance reading group and add one for the new Paper II."""
    reading = syllabus.get("reading")
    if not reading:
        return
    out = []
    added = False
    for group in reading:
        if group["for"] == "Technical Paper II — E-Governance":
            group = dict(group, **{"for": LEGACY_READING_FOR, "note": LEGACY_READING_NOTE})
        elif group["for"] == LEGACY_READING_FOR:
            group = dict(group, note=LEGACY_READING_NOTE)
        elif group["for"] == NEW_TECH2_READING["for"]:
            continue  # rebuilt from the spec below, so a re-run cannot duplicate it
        out.append(group)
        if not added and group["for"] in (LEGACY_READING_FOR,):
            # Put the current paper's list immediately BEFORE the superseded
            # one, so the first Paper II heading a reader meets is the live one.
            out.insert(len(out) - 1, json.loads(json.dumps(NEW_TECH2_READING)))
            added = True
    if not added:
        out.append(json.loads(json.dumps(NEW_TECH2_READING)))
    syllabus["reading"] = out


def retag_concepts(concepts, legacy_unit_titles, new_unit_titles):
    """Point the 212 E-Governance Study-tab concepts at TECH2_LEGACY.

    This is the failure commit 026ca04 documents for TECH1, and it would have
    repeated here exactly. The concepts carry `unit` "1".."19" from the old
    19-unit E-Governance syllabus. Leaving them on `paper: "TECH2"` after TECH2
    became a 4-unit paper does two different kinds of damage at once:

      * units 1-4 (44 concepts) COLLIDE with the new units, so `unitOf()`
        resolves them to the new titles and the Study tree files
        "Introduction to Government and Governance" under "Object Oriented
        Programming";
      * units 5-19 (168 concepts) have no matching unit definition at all and
        vanish from the tree silently -- no gap, no error.

    Each concept stores its own `unitTitle`, and all 19 still read as the
    E-Governance titles, so moving the paper id is the whole fix. Identify them
    by unitTitle rather than by paper id so a re-run is a no-op and so a future
    genuine TECH2 concept is never dragged along.
    """
    moved = 0
    for c in concepts:
        if c["paper"] not in ("TECH2", "TECH2_LEGACY"):
            continue
        title = c.get("unitTitle", "")
        if title in legacy_unit_titles:
            if c["paper"] != "TECH2_LEGACY":
                moved += 1
            c["paper"] = "TECH2_LEGACY"
        elif title in new_unit_titles:
            c["paper"] = "TECH2"
        else:
            sys.exit(
                f"FAIL concept {c['id']}: unitTitle {title!r} matches neither "
                "the new TECH2 units nor the legacy E-Governance units, so "
                "there is no way to tell which paper it belongs to."
            )
    return moved


def validate(questions, syllabus):
    """Every question must name a unit and subtopic its paper actually has.

    A tag that misses drops the question out of every by-unit view silently,
    which is exactly how the 2026 TECH1 unit-ID collision hid for a while.
    """
    valid = {
        p["id"]: {u["no"]: set(u.get("subtopics", [])) for u in p["units"]}
        for p in syllabus["papers"]
    }
    bad = []
    for q in questions:
        pid, uno = q["paper"], str(q["unit"])
        if pid not in valid:
            bad.append(f"{q['id']}: paper {pid!r} is not in the syllabus")
        elif uno not in valid[pid]:
            bad.append(f"{q['id']}: {pid} has no unit {uno!r}")
        elif q["sub"] and q["sub"] not in valid[pid][uno]:
            bad.append(f"{q['id']}: {q['sub']!r} is not a subtopic of {pid} unit {uno}")
    return bad


def main():
    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    concepts = load_js(CONCEPTS_FILE, "CONCEPTS")

    new, legacy = migrate_syllabus(syllabus)
    moved, kept_legacy = retag_questions(questions, new)
    concepts_moved = retag_concepts(
        concepts,
        {u["title"] for u in legacy["units"]},
        {u["title"] for u in new["units"]},
    )

    bad = validate(questions, syllabus)
    # Pre-existing tag drift in OTHER papers is not this script's to fix, but a
    # break it introduced in TECH2 is fatal.
    ours = [b for b in bad if "TECH2" in b or "OFFSYL" in b]
    if ours:
        for b in ours[:10]:
            print("FAIL", b, file=sys.stderr)
        sys.exit(f"FAIL: {len(ours)} questions carry tags TECH2 does not define")

    save_js(SYLLABUS_FILE, "SYLLABUS", syllabus)
    save_js(QUESTIONS_FILE, "QUESTIONS", questions)
    save_js(CONCEPTS_FILE, "CONCEPTS", concepts)

    per_unit = {}
    for q in questions:
        if q["paper"] == "TECH2":
            per_unit[q["unit"]] = per_unit.get(q["unit"], 0) + 1

    print(f"OK  {SYLLABUS_FILE.relative_to(ROOT)}")
    print(f"    TECH2 -> {new['name']}: "
          + ", ".join(f"u{u['no']} {u['title']} ({u['marks']})" for u in new["units"]))
    print(f"    TECH2_LEGACY: {len(legacy['units'])} E-Governance units, "
          f"legacy={legacy['legacy']}, counts_for_merit={legacy['counts_for_merit']}")
    print(f"OK  {QUESTIONS_FILE.relative_to(ROOT)}")
    print(f"    moved into TECH2: {moved['3']} DBMS (from TECH1_LEGACY u5), "
          f"{moved['1']} OOP (from OFFSYL u2)")
    print(f"    left in TECH1_LEGACY u5 as off-new-syllabus: {kept_legacy} "
          f"({', '.join(sorted(set(DBMS_KEEP.values())))})")
    print(f"    TECH2 questions per unit: {dict(sorted(per_unit.items()))}")
    print(f"OK  {CONCEPTS_FILE.relative_to(ROOT)}")
    print(f"    {concepts_moved} E-Governance concepts -> TECH2_LEGACY "
          "(they carry units 1-19; leaving them on TECH2 would file 44 under "
          "the new units' titles and hide the other 168 entirely)")
    print("    units 2 (Web) and 4 (Cloud) are deliberately empty — no past "
          "MPSC paper tests them; see coverage_note")
    if bad:
        print(f"NOTE {len(bad)} pre-existing tag mismatches in other papers "
              "(not introduced here)")


if __name__ == "__main__":
    main()
