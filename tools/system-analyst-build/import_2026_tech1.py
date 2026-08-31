#!/usr/bin/env python3
"""Replace the obsolete System Analyst Technical Paper I with the July 2026 IO syllabus.

The source is deliberately the directly relevant CSE Paper-I sittings in the
live mpsc_study bank.  It does not pull in CSE Paper II/III merely because they
are labelled Computer Science: those questions belong to the later papers and
would make a Technical Paper I mock misleading.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "public" / "mpsc-system-analyst" / "data"
SYLLABUS_FILE = DATA / "syllabus.js"
QUESTIONS_FILE = DATA / "questions.js"

TECH1_UNITS = [
    {"no": "1", "title": "Discrete Mathematics", "marks": 40, "subtopics": [
        "Sets, mappings and relations", "Posets, lattices and mathematical induction",
        "Propositional logic and logical equivalence", "Permutation, combination, generating functions and recurrences",
        "Graph theory, trees and graph algorithms", "Finite automata and formal grammars", "Fuzzy sets"
    ]},
    {"no": "2", "title": "Computer Architecture and Organization", "marks": 40, "subtopics": [
        "Computer organization, registers and instruction cycle", "Control unit, machine language and assembly language",
        "Number representation and computer arithmetic", "Instruction formats, addressing modes and RISC",
        "Input/output organization and peripherals", "Memory hierarchy, virtual memory and cache",
        "Pipelining, vector and parallel processing"
    ]},
    {"no": "3", "title": "Data Structures and Algorithms", "marks": 60, "subtopics": [
        "Arrays, strings and linear lists", "Algorithm development and complexity", "Recursion, searching and sorting",
        "Stacks, queues and expression evaluation", "Graphs, disjoint sets and greedy algorithms",
        "Trees, AVL trees, heaps, B-trees and external search"
    ]},
    {"no": "4", "title": "Operating System", "marks": 60, "subtopics": [
        "OS concepts, structure and services", "Processes, concurrency and synchronization", "CPU and multiprocessor scheduling",
        "Deadlocks", "Memory management and virtual memory", "I/O management and disk scheduling", "File systems"
    ]},
]

def load_js(path, name):
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(rf"window\.{name}\s*=\s*(.*);\s*", text, re.S)
    if not match:
        raise RuntimeError(f"Cannot parse {path}")
    return json.loads(match.group(1))

def save_js(path, name, data):
    # These two legacy assets use different established indentation levels.
    # Preserving them keeps the generated diff reviewable.
    indent = 2 if name == "SYLLABUS" else 1
    path.write_text(f"window.{name} = " + json.dumps(data, ensure_ascii=False, indent=indent) + ";\n", encoding="utf-8")

def fetch_questions():
    sql = (
        "SELECT json_build_object("
        "'id',q.id,'paper_id',q.paper_id,'question',q.question,'options',q.options,"
        "'answer_index',q.answer_index,'explanation',q.explanation,'year',q.year) "
        "FROM questions q JOIN papers p ON p.id=q.paper_id "
        "WHERE p.paper_subject ILIKE '%Computer Science%' OR p.post ILIKE '%Computer Science%' "
        "ORDER BY q.paper_id,q.id"
    )
    command = [
        "ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", "shiksha-dev",
        f"sudo -n -u postgres psql -d mpsc_study -Atc \"{sql}\"",
    ]
    result = subprocess.run(command, check=True, text=True, capture_output=True)
    return [json.loads(line) for line in result.stdout.splitlines() if line.strip()]

def classify(text):
    t = " " + text.lower() + " "
    def has(pattern): return re.search(pattern, t, re.I) is not None
    # Test OS first: its memory/process terms overlap with architecture and algorithms.
    if has(r"\b(process|semaphore|mutex|critical section|producer|consumer|deadlock|scheduler|scheduling|thread|page fault|paging|segmentation|thrashing|belady|file system|directory|disk scheduling|multiprogram|monitor|system call|kernel|shell|synchronization|mutual exclusion|memory allocation|resident monitor|partition|interprocess|concurrency|concurrent|starvation|wait state)\b"):
        return "4", "Processes, concurrency and synchronization"
    if has(r"\b(array|linked list|linear list|stack|queue|deque|priority queue|recursion|binary search|sequential search|merge sort|quick sort|heap sort|insertion sort|selection sort|algorithm complexity|time complexity|union[- ]find|avl|b-tree|external search|hashing)\b"):
        return "3", "Recursion, searching and sorting"
    if has(r"\b(set|relation|poset|lattice|induction|proposition|logical|permutation|combination|recurrence|generating function|graph|spanning tree|kruskal|dijkstra|floyd|warshall|bfs|dfs|isomorph|homomorph|finite autom|\bnfa\b|\bdfa\b|mealy|moore|grammar|regular expression|fuzzy|chomsky|language)\b"):
        return "1", "Graph theory, trees and graph algorithms"
    if has(r"\b(register|instruction|addressing mode|address lines?|control unit|microprogram|machine language|assembly|assembler|\bbcd\b|signed magnitude|floating point|cache|\bprom\b|\bdram\b|\bsram\b|\bram\b|\brom\b|processor|\bcpu\b|\balu\b|bus system|pipeline|vector processing|parallel processing|peripheral|input/output|i/o|risc|binary|two'?s complement|memory hierarchy|program counter|microprocessor|digital logic|boolean algebra|logic gate|shift register|flip-flop|\bnand\b|\bnor\b|\band gate\b|\bor gate\b|d/a converter|a/d converter|magnetic disk|track|sector|hit ratio|octal)\b"):
        return "2", "Computer organization, registers and instruction cycle"
    return None

def normalise(stem):
    return re.sub(r"[^a-z0-9]+", "", stem.lower())

def main():
    raw = fetch_questions()
    selected, excluded, seen = [], [], set()
    for row in raw:
        stem = (row.get("question") or "").strip()
        options = row.get("options") or []
        answer = row.get("answer_index")
        label = classify(stem)
        # Invalid or off-syllabus imports never enter a scored mock.
        if not label or len(options) != 4 or not isinstance(answer, int) or not 0 <= answer < 4 or normalise(stem) in seen:
            excluded.append(row)
            continue
        seen.add(normalise(stem))
        unit, sub = label
        no = len(selected) + 1
        selected.append({
            "id": f"TECH1_CSE_{no:03d}", "src": "past",
            "sitting": f"MPSC CSE Paper I ({row.get('year') or 'year not recorded'})",
            "srcKey": "CSE_TECH1", "no": no, "paper": "TECH1", "unit": unit, "sub": sub,
            "q": stem, "opts": dict(zip("ABCD", options)), "ans": "ABCD"[answer],
            "exp": (row.get("explanation") or "").strip(),
            "prov": "MPSC CSE Paper I question bank; extracted answer (not final-key verified)",
            "note": "",
        })

    syllabus = load_js(SYLLABUS_FILE, "SYLLABUS")
    tech1 = next(p for p in syllabus["papers"] if p["id"] == "TECH1")
    tech1.update({
        "name": "Technical Subject Paper I", "marks": 200, "questions": 50,
        "marks_per_question": 2, "duration_hours": 3,
        "type": "MCQ (100 marks) + conventional/essay (100 marks)", "counts_for_merit": True,
        "authority": "ICT Department Informatics Officer syllabus, 30 July 2026", "units": TECH1_UNITS,
    })
    save_js(SYLLABUS_FILE, "SYLLABUS", syllabus)

    questions = load_js(QUESTIONS_FILE, "QUESTIONS")
    # Technical Paper I has historically been the first paper in this asset;
    # retain that order rather than making an unrelated, whole-file move.
    questions = selected + [q for q in questions if q.get("paper") != "TECH1"]
    save_js(QUESTIONS_FILE, "QUESTIONS", questions)

    report = {
        "source_records": len(raw), "imported": len(selected), "excluded": len(excluded),
        "exclusion_reason": "off-syllabus, duplicate, or not a complete 4-option MCQ",
        "by_unit": {str(n): sum(q["unit"] == str(n) for q in selected) for n in range(1, 5)},
    }
    report_path = ROOT / "tools" / "system-analyst-build" / "tech1-2026-import-report.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
