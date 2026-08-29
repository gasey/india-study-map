#!/usr/bin/env python3
"""
Phase 1 — generate public/mpsc-system-manager/data/syllabus.js

The syllabus below is TRANSCRIBED VERBATIM from the official PDF:
  https://udpa.mizoram.gov.in/uploads/attachments/2026/08/3a5d5559798198c8427c8d275219a0d7/syllabus-for-system-manager.pdf
  local copy: ~/Downloads/syllabus-for-system-manager-MUDAL.pdf
approved by the MUDAL Board of Directors on 28.07.2026. Section and unit
titles, marks, and every leaf subtopic string are the PDF's own wording —
including its inconsistencies ("Electronic Records management" is lowercase
in the source; "UNIT IV :" uses a colon where "UNIT I –" uses a dash).

Exam metadata (pay, vacancies, eligibility, deadline) is transcribed from
  ~/Downloads/advertisement-mizoram-urban-development-agency-ltd.pdf
Paper structure from
  ~/Downloads/MUDAL-question-pattern.pdf

Re-runnable and self-verifying: asserts every per-section leaf count, every
unit mark total, and the 259 technical-subtopic grand total before writing.
Per CLAUDE.md — assert on counts, fail loudly.

Usage:  python3 tools/system-manager-build/gen_syllabus.py
"""

import json
import os
import sys

# ---------------------------------------------------------------- Paper I

TECH1_UNITS = [
    ("I", "Fundamentals of Computer", 60, [
        ("1", "Introduction to Computing", [
            "Evolution and Generations of Computers",
            "Characteristics and Applications of Computers",
            "Classification of Computers",
            "Digital Transformation and e-Governance",
            "Emerging Technologies: Artificial Intelligence (AI), Internet of Things (IoT), "
            "Blockchain, Big Data, Cloud Computing and Edge Computing",
            "Green Computing and Sustainable IT",
        ]),
        ("2", "Computer Architecture", [
            "Functional Components of a Computer",
            "CPU Architecture and Instruction Cycle",
            "Motherboard and Chipset",
            "System Bus and Expansion Slots",
            "BIOS/UEFI Firmware",
        ]),
        ("3", "Processor and Memory", [
            "Multi-core and Multi-threaded Processors",
            "Cache Memory",
            "RAM, ROM and Virtual Memory",
            "Memory Hierarchy",
            "Performance Measurement",
        ]),
        ("4", "Storage Technologies", [
            "HDD, SSD and NVMe Storage",
            "Optical and Flash Storage",
            "Network Attached Storage (NAS)",
            "Storage Area Network (SAN)",
            "Backup Concepts",
            "Disaster Recovery Concepts",
        ]),
        ("5", "Input and Output Devices", [
            "Modern Input Devices",
            "Biometric Devices",
            "Smart Card Readers",
            "Scanners",
            "Display Technologies",
            "Printers and Multifunction Devices",
            "Interactive Displays",
        ]),
        ("6", "Computer Software", [
            "System Software",
            "Application Software",
            "Open Source and Proprietary Software",
            "Software Licensing",
            "Software Development Life Cycle (SDLC)",
            "Virtualization and Containerization (Concept)",
        ]),
        ("7", "Programming Fundamentals", [
            "Programming Languages",
            "Object-Oriented Programming Concepts",
            "Scripting Languages",
            "APIs and Software Integration (Concept)",
        ]),
        ("8", "Information Technology and Society", [
            "Digital India and e-Governance",
            "Electronic Records management",
            "Data Privacy and Personal Data Protection",
            "Cyber Ethics",
            "AI Ethics",
            "Digital Inclusion and Accessibility",
        ]),
    ]),
    ("II", "Operating Systems", 25, [
        ("1", "Operating System Fundamentals", [
            "Types and Functions of Operating Systems",
            "Process Management",
            "Memory Management",
            "File Systems",
        ]),
        ("2", "Microsoft Windows", [
            "Windows Operating Systems",
            "User Accounts",
            "Windows Security",
            "Windows Terminal",
            "Registry",
            "Windows Utilities",
        ]),
        ("3", "Linux Fundamentals", [
            "Linux Architecture",
            "Linux File System",
            "Basic Linux Commands",
            "Open-source Ecosystem",
        ]),
        ("4", "File and Storage Management", [
            "Files and Folders",
            "Compression",
            "Encryption",
            "Backup and Restore",
            "File Recovery",
        ]),
        ("5", "System Administration", [
            "Device Manager",
            "Disk Management",
            "Task Manager",
            "Resource Monitor",
            "Event Viewer",
            "Services",
            "Performance Monitoring",
        ]),
        ("6", "Command Line", [
            "Command Prompt",
            "PowerShell Fundamentals",
            "Basic Batch Files",
        ]),
    ]),
    ("III", "Word Processing", 20, [
        ("1", "Microsoft Word", [
            "Document Creation",
            "Templates",
            "Styles and Themes",
            "Page Layout",
            "Tables",
            "SmartArt",
            "Graphics",
            "References",
            "Table of Contents",
            "Citations and Bibliography",
            "Review Tools",
            "Track Changes",
            "Mail Merge",
            "Accessibility Features",
            "Microsoft 365 Collaboration",
            "Integration of e-Office",
            "AI-assisted Document Creation (Microsoft Copilot - Concept)",
        ]),
    ]),
    ("IV", "Electronic Spreadsheet", 25, [
        ("1", "Microsoft Excel", [
            "Workbook Management",
            "Formulae and Functions",
            "Lookup Functions",
            "Statistical Functions",
            "Financial Functions",
            "Data Validation",
            "Sorting and Filtering",
            "Conditional Formatting",
            "Pivot Tables",
            "Pivot Charts",
            "Dashboards",
            "What-if Analysis",
            "Goal Seek",
            "Power Query (Introduction)",
            "Power Pivot (Overview)",
            "Macros (Introduction)",
            "Microsoft 365 Collaboration",
            "AI-assisted Spreadsheet Analysis",
        ]),
    ]),
    ("V", "Presentation Software", 20, [
        ("1", "Microsoft PowerPoint", [
            "Presentation Design",
            "Templates and Themes",
            "Slide Master",
            "SmartArt",
            "Charts",
            "Multimedia",
            "Animation",
            "Morph Transition",
            "Presenter View",
            "Recording Presentations",
            "Presentation Delivery",
            "Collaboration Features",
            "Accessibility Features",
            "AI-assisted Presentation Design (Microsoft Copilot - Concept)",
        ]),
    ]),
]

# --------------------------------------------------------------- Paper II

TECH2_UNITS = [
    ("I", "Computer Networking", 35, [
        ("1", "Network Fundamentals", [
            "Types of Networks",
            "OSI Model",
            "TCP/IP Model",
            "IPv4 and IPv6",
            "IP Addressing",
            "Subnetting",
            "Routing and Switching",
        ]),
        ("2", "Network Devices", [
            "Hubs",
            "Switches",
            "Routers",
            "Gateways",
            "Firewalls",
            "Wireless Access Points",
        ]),
        ("3", "Network Services", [
            "DNS",
            "DHCP",
            "VPN",
            "NAT",
            "Proxy Servers",
        ]),
        ("4", "Wireless Networking", [
            "Wi-Fi Standards",
            "Wireless Security",
            "Mobile Networks",
        ]),
        ("5", "Windows Server Administration", [
            "Windows Server Concepts",
            "Active Directory",
            "Group Policy",
            "User and Group Management",
            "File and Printer Sharing",
            "Remote Desktop Services",
        ]),
        ("6", "Cloud Networking", [
            "Cloud Infrastructure",
            "Virtual Networks",
            "Microsoft Azure Fundamentals (Concept)",
            "Network Monitoring",
            "Network Troubleshooting",
        ]),
    ]),
    ("II", "Database Management System", 35, [
        ("1", "Database Fundamentals", [
            "Database Concepts",
            "Database Architecture",
            "Data Models",
            "ER Modelling",
            "Relational Database Management System",
        ]),
        ("2", "SQL", [
            "Data Definition Language (DDL)",
            "Data Manipulation Language (DML)",
            "Data Control Language (DCL)",
            "Transaction Control Language (TCL)",
        ]),
        ("3", "Database Administration", [
            "Tables",
            "Views",
            "Indexes",
            "Stored Procedures (Concept)",
            "Triggers (Concept)",
            "Transactions",
            "Concurrency Control",
            "Backup and Recovery",
        ]),
        ("4", "Database Security", [
            "Authentication",
            "Authorization",
            "Encryption",
            "Auditing",
        ]),
        ("5", "Modern Databases", [
            "Microsoft SQL Server (Concept)",
            "PostgreSQL (Concept)",
            "NoSQL Databases (Introduction)",
        ]),
    ]),
    ("III", "Web Technologies", 25, [
        ("1", "Internet Technologies", [
            "Internet Architecture",
            "World Wide Web",
            "Domain Name System",
            "Web Hosting",
        ]),
        ("2", "HTML5", [
            "Document Structure",
            "Text Formatting",
            "Hyperlinks",
            "Lists",
            "Tables",
            "Images",
            "Multimedia",
            "Forms",
        ]),
        ("3", "CSS3", [
            "Styling",
            "Layouts",
            "Responsive Design",
        ]),
        ("4", "JavaScript", [
            "Variables",
            "Functions",
            "Events",
            "DOM Manipulation",
            "Client-side Validation",
        ]),
        ("5", "Modern Web Concepts", [
            "REST APIs (Concept)",
            "JSON",
            "Progressive Web Applications (Introduction)",
            "Web Accessibility",
            "Search Engine Optimization (Basic)",
            "Web Security Fundamentals",
        ]),
    ]),
    ("IV", "Cyber Security, Artificial Intelligence and Emerging Technologies", 30, [
        ("A", "Cyber Security", [
            "Information Security Principles",
            "Cyber Threats and Malware",
            "Firewalls",
            "Antivirus and Endpoint Protection",
            "Multi-factor Authentication (MFA)",
            "Encryption",
            "Digital Certificates",
            "Public Key Infrastructure (PKI)",
            "Vulnerability Assessment",
            "Patch Management",
            "Incident Response",
            "Cyber Hygiene",
        ]),
        ("B", "Artificial Intelligence", [
            "Fundamentals of Artificial Intelligence",
            "Machine Learning",
            "Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Generative AI",
            "Large Language Models (LLMs)",
            "Prompt Engineering",
            "AI Ethics and Responsible AI",
            "AI Applications in Government",
            "AI-assisted System Administration",
            "AI-assisted Data Analysis",
        ]),
        ("C", "Digital Governance Systems (Emerging Technologies)", [
            "NIC eOffice",
            "e-Office Concept and Digital Office Environment",
            "Knowledge Management System (KMS)",
            "e-Office Security",
            "Digital Signature Certificate (DSC)",
            "Workflow Configuration",
            "Metadata Management",
            "Record Retention and Archival",
            "Office Procedure in Digital Environment",
        ]),
    ]),
    ("V", "IT Governance, Business Communication and Aptitude", 25, [
        ("A", "IT Governance", [
            "IT Service Management (ITSM)",
            "ITIL Fundamentals",
            "IT Asset Management",
            "Software Asset Management",
            "Business Continuity Planning",
            "Disaster Recovery Planning",
            "IT Procurement",
            "Documentation Standards",
            "Project Management Fundamentals",
        ]),
        ("B", "Business Communication", [
            "Official Correspondence",
            "Technical Report Writing",
            "Email Etiquette",
            "Presentation Skills",
            "Meeting Documentation",
        ]),
        ("C", "Aptitude and Analytical Ability", [
            "Numerical Ability",
            "Logical Reasoning",
            "Analytical Reasoning",
            "Data Interpretation",
            "Digital Reasoning",
            "Interpretation of AI-generated Outputs",
            "Cyber Safety Awareness",
        ]),
    ]),
]

# ---------------------------------------------------------- General English
# The official syllabus lists the six General English components with marks
# and NOTHING ELSE - no subtopic bullets. Leaving `subtopics` empty is the
# honest transcription; Phase 5 must author a derived breakdown and label it
# as derived, not pass it off as the official syllabus.

GE_UNITS = [
    ("1", "Precis Writing", 10, "handwritten"),
    ("2", "Letter Writing", 15, "handwritten"),
    ("3", "Comprehension of given passages", 15, "MCQ"),
    ("4", "Grammar: Parts of Speech", 20, "MCQ"),
    ("5", "Correct Usage and Vocabularies", 20, "MCQ"),
    ("6", "Formation of Sentence", 20, "MCQ"),
]

# ------------------------------------------------------------- expectations
# Per-section leaf counts, checked before anything is written. These are the
# numbers counted off the source PDF, NOT copied from BUILD_GUIDE.md - the
# guide's skeleton table overstates Word Processing (18 vs 17) and Electronic
# Spreadsheet (19 vs 18), giving a 261 total where the PDF has 259.

EXPECT_TECH1 = {"I": 45, "II": 29, "III": 17, "IV": 18, "V": 14}   # = 123
EXPECT_TECH2 = {"I": 32, "II": 24, "III": 26, "IV": 33, "V": 21}   # = 136
EXPECT_TOTAL = 259
EXPECT_MARKS = 150


def build_units(raw, expect, label):
    units, grand = [], 0
    for no, title, marks, sections in raw:
        flat = []
        for sec_no, sec_title, subs in sections:
            if len(subs) != len(set(subs)):
                sys.exit(f"FAIL {label} unit {no} section {sec_no}: duplicate subtopic")
            flat.extend(subs)
        if len(flat) != expect[no]:
            sys.exit(f"FAIL {label} unit {no} ({title}): "
                     f"expected {expect[no]} subtopics, transcribed {len(flat)}")
        grand += len(flat)
        units.append({
            "no": no,
            "title": title,
            "marks": marks,
            "sections": [{"no": s[0], "title": s[1], "subtopics": s[2]} for s in sections],
            "subtopics": flat,
        })
    marks = sum(u["marks"] for u in units)
    if marks != EXPECT_MARKS:
        sys.exit(f"FAIL {label}: unit marks sum to {marks}, expected {EXPECT_MARKS}")
    return units, grand


def main():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out = os.path.join(root, "public", "mpsc-system-manager", "data", "syllabus.js")

    t1, n1 = build_units(TECH1_UNITS, EXPECT_TECH1, "TECH1")
    t2, n2 = build_units(TECH2_UNITS, EXPECT_TECH2, "TECH2")
    if n1 + n2 != EXPECT_TOTAL:
        sys.exit(f"FAIL: {n1 + n2} technical subtopics transcribed, expected {EXPECT_TOTAL}")

    ge_marks = sum(m for _, _, m, _ in GE_UNITS)
    if ge_marks != 100:
        sys.exit(f"FAIL GE: marks sum to {ge_marks}, expected 100")
    ge_mcq = sum(m for _, _, m, mode in GE_UNITS if mode == "MCQ")

    # MUDAL publishes marks and "All MCQ" only - no question count, no duration. But the
    # System Manager technical syllabus IS the Computer Operator syllabus at the identical
    # 150 marks per paper, and all four 2016 Computer Operator technical papers state
    # "Time Allowed: 2 hours / Full Marks: 150 / All questions carry equal marks of 2 each"
    # => 75 questions. Both Computer Operator General English papers state 3 hours /
    # 100 marks / 1 mark each. Derived from precedent, not invented - but still not official.
    derived = ("NOT published by MUDAL, which gives marks and 'All MCQ' only. Derived from the "
               "2016 Computer Operator papers, whose syllabus this post's technical papers reuse "
               "at the same 150 marks: those papers state 'Time Allowed: 2 hours, Full Marks: 150, "
               "all questions carry equal marks of 2 each' => 75 questions. Treat as a "
               "well-grounded expectation, not a guarantee.")
    derived_ge = ("NOT published by MUDAL. Both 2016 Computer Operator General English papers "
                  "state 'Time Allowed: 3 hours, Full Marks: 100, equal marks of 1 each', and each "
                  "yielded 80 MCQs in the question bank - i.e. 80 MCQ marks plus 20 handwritten. "
                  "System Manager splits 100 as 75 MCQ + 25 handwritten, so the MCQ count below "
                  "follows the marks. Treat as a well-grounded expectation, not a guarantee.")

    syl = {
        "post": "System Manager",
        "employer": "Mizoram Urban Development Agency Ltd. (MUDAL) - PSU under the Urban Development "
                    "& Poverty Alleviation Department, Govt. of Mizoram",
        "advertisement": "Advertisement No. 1 of 2026-2027, No.A.12/41/2026-UD&PA, dated Aizawl "
                         "31 July 2026",
        "pay": "Rs. 50,000 per month",
        "vacancies": 1,
        "application_deadline": "2026-08-29T16:00:00+05:30",
        "application_fee": "Rs. 200 (Rs. 150 for SC/ST)",
        "eligibility": [
            "Graduate in any stream from a Government-recognised University",
            "One-year diploma or higher in a computer-related course from a Government-recognised "
            "institution",
            "Mizo language proficiency to Middle School standard - candidates without Mizo as a "
            "Middle/High School subject need a Mizo Language Proficiency Certificate. No exam is "
            "arranged for this post for candidates who do not hold one.",
            "Age 18-35 as on 29 August 2026 (40 for SC/ST; 2 further years for those with 5 years' "
            "service in the State Govt / a Govt-controlled PSU / an Autonomous Body)",
            "Indian citizen and bona fide resident of Mizoram",
        ],
        "selection_stages": ["Written Examination", "Document Screening", "Personal Interview"],
        "syllabus_authority": {
            "all_papers": "Syllabus approved by the MUDAL Board of Directors at its first meeting, "
                          "dated 28.07.2026",
            "general_english": "Same syllabus as Junior Engineer - Prescribed Common Syllabus for "
                               "recruitment to the post of Junior Engineer under PWD and LAD, "
                               "Govt. of Mizoram",
            "technical_papers": "Prescribed Syllabus for Computer Operator under the Govt. of "
                                "Mizoram, 2019, as updated by MUDAL for this particular post",
        },
        "scoring_note": "All three papers count for merit - 400 marks total. Unlike Assistant "
                        "Engineer / System Analyst, the approved question pattern sets NO "
                        "qualifying-only paper and NO 50% cutoff clause for System Manager.",
        "syllabus_closing_note": "It may be noted that apart from the topics detailed above, "
                                 "questions from other topics prescribed for the educational "
                                 "qualification of the post may also appear in the question paper. "
                                 "There is no undertaking that all the topics above may be covered "
                                 "in the question paper.",
        "exam_date": None,
        "papers": [
            {
                "id": "GE",
                "name": "General English",
                "marks": 100,
                "questions": ge_mcq,
                "marks_per_question": 1,
                "duration_hours": 3,
                "type": "Mixed - Precis and Letter Writing are handwritten; remainder MCQ",
                "counts_for_merit": True,
                "authority": "Same as Junior Engineer General English",
                "mcq_marks": ge_mcq,
                "handwritten_marks": 100 - ge_mcq,
                "structure_note": f"{100 - ge_mcq} of the 100 marks (Precis Writing 10, Letter "
                                  f"Writing 15) are handwritten and cannot be drilled as MCQs - the "
                                  f"Study tab has to carry those, not Practice. Only the {ge_mcq} "
                                  f"MCQ marks are practisable here.",
                "pattern_note": derived_ge,
                "units": [
                    {"no": no, "title": title, "marks": marks, "mode": mode, "subtopics": [],
                     "subtopics_source": "The official syllabus lists this component with its marks "
                                         "only - it enumerates no subtopics. Any breakdown shown in "
                                         "the study guide is derived, not official."}
                    for no, title, marks, mode in GE_UNITS
                ],
            },
            {
                "id": "TECH1",
                "name": "Technical Paper I",
                "marks": 150,
                "questions": 75,
                "marks_per_question": 2,
                "duration_hours": 2,
                "type": "Objective (MCQ)",
                "counts_for_merit": True,
                "authority": "Computer Operator syllabus 2019, as updated by MUDAL",
                "pattern_note": derived,
                "units": t1,
            },
            {
                "id": "TECH2",
                "name": "Technical Paper II",
                "marks": 150,
                "questions": 75,
                "marks_per_question": 2,
                "duration_hours": 2,
                "type": "Objective (MCQ)",
                "counts_for_merit": True,
                "authority": "Computer Operator syllabus 2019, as updated by MUDAL",
                "pattern_note": derived,
                "units": t2,
            },
        ],
        "interview": {
            "marks": None,
            "counts_for_merit": None,
            "note": "A Personal Interview follows Document Screening, but no interview mark "
                    "allocation is published for System Manager. The approved question pattern "
                    "accounts for 400 written marks only.",
        },
        "past_paper_sources": {
            "note": "The System Manager technical syllabus IS the Computer Operator syllabus, so "
                    "the 2016 Computer Operator papers are the closest available past questions and "
                    "sit at the right difficulty. No official answer key was ever published for "
                    "them - every answer in this app that derives from them is agent-derived and "
                    "carries a confidence rating.",
            "sets": [
                "Computer Operator (Contract) under SAD, 2016 - General English, Technical Paper I, "
                "Technical Paper II",
                "Computer Operator (CB) under Mizoram Information Commission, 2016 - General "
                "English, Paper I, Paper II",
                "Junior Engineer General English (2019-2020 departmental, 2019-2020 direct, "
                "March 2026 Agri & Farmer Welfare)",
            ],
        },
        "counts": {
            "technical_subtopics": n1 + n2,
            "tech1_subtopics": n1,
            "tech2_subtopics": n2,
            "source": "Counted off the official syllabus PDF on 2026-08-28. BUILD_GUIDE.md's "
                      "skeleton table originally said 261 - it overstated Word Processing "
                      "(18 vs 17) and Electronic Spreadsheet (19 vs 18). Guide now corrected.",
        },
    }

    # questions x marks_per_question must equal the paper's MCQ marks - the full 150 for a
    # technical paper, only the MCQ share for the mixed General English paper.
    for p in syl["papers"]:
        want = p.get("mcq_marks", p["marks"])
        got = p["questions"] * p["marks_per_question"]
        if got != want:
            sys.exit(f"FAIL {p['id']}: {p['questions']} questions x {p['marks_per_question']} "
                     f"marks = {got}, expected {want} MCQ marks")
    total = sum(p["marks"] for p in syl["papers"])
    if total != 400:
        sys.exit(f"FAIL: papers sum to {total} marks, expected 400")

    body = json.dumps(syl, indent=2, ensure_ascii=False)
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* GENERATED by tools/system-manager-build/gen_syllabus.py - do not hand-edit.\n"
                "   Transcribed from the official MUDAL System Manager syllabus PDF\n"
                "   (approved by the Board of Directors, 28.07.2026). Edit the script, re-run it. */\n")
        f.write("window.SYLLABUS = " + body + ";\n")

    print(f"OK  {os.path.relpath(out, root)}")
    print(f"    TECH1 {n1} subtopics across {len(t1)} units")
    print(f"    TECH2 {n2} subtopics across {len(t2)} units")
    print(f"    technical total {n1 + n2}")
    print(f"    GE {len(GE_UNITS)} units, {ge_marks} marks ({ge_mcq} MCQ / {100 - ge_mcq} handwritten)")
    print(f"    concepts needed for full coverage: {n1 + n2} technical + a derived GE breakdown")


if __name__ == "__main__":
    main()
