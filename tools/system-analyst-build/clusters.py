"""Topic clusters for the Technical Paper I study guide (Unit 1 + Unit 3).

The guide groups two sources that were tagged independently and therefore do
not share a vocabulary:

  * `concepts.js` entries, tagged by a curated `sub` (135 of them here)
  * `questions.js` entries, tagged by a much looser per-question `sub`
    (~140 distinct strings, many of them one-offs like "Graph rank and nullity")

Rather than fuzzy-matching those two tag sets against each other -- which
silently mis-files whatever it fails to match -- both are mapped explicitly
onto the clusters below. Anything not named here lands in the cluster's
catch-all via CONCEPT_FALLBACK / QUESTION_FALLBACK and is reported by
build_study_guide.py, so a new tag shows up as a build warning instead of
disappearing from the guide.

Cluster order is the reading order of the guide.
"""

# --------------------------------------------------------------------------
# Unit 1 -- Discrete Mathematics (40 marks)
# --------------------------------------------------------------------------

U1_CLUSTERS = [
    {
        "id": "sets",
        "title": "Sets, Relations and Functions",
        "blurb": "The counting formulas here (2^n, 2^(n²), n!/(n−m)!) are the "
                 "single most reused piece of arithmetic in the whole unit.",
        "concepts": [
            "Sets, subsets, power set, cardinality",
            "Set operations and their algebra",
            "Cartesian product",
            "Inclusion–exclusion principle",
            "Relations and their representation",
            "Properties of relations",
            "Closures of relations, Warshall's algorithm",
            "Equivalence relations and partitions",
            "Functions: domain, codomain, range",
            "Injective, surjective, bijective — and counting",
            "Composition and inverse functions",
        ],
        "questions": [
            "Set theory", "Set theory basics", "Power sets", "Relations",
            "Relation properties", "Equivalence relations", "Functions",
            "Functions and mappings", "Functions and relations",
            "Counting functions", "Modular arithmetic",
        ],
    },
    {
        "id": "poset",
        "title": "Posets, Lattices and Induction",
        "blurb": "Small cluster, but it reappears at every sitting — usually as "
                 "one Hasse-diagram / LUB-GLB question and one induction question.",
        "concepts": [
            "Posets, comparability, Hasse diagrams",
            "Maximal, greatest, bounds, LUB and GLB",
            "Lattices — definition, meet and join",
            "Types of lattices and Boolean algebra",
            "Mathematical induction (weak form)",
            "Strong induction and well-ordering",
        ],
        "questions": [
            "Posets, lattices and mathematical induction", "Partial orders",
            "Lattices", "Mathematical induction",
        ],
    },
    {
        "id": "logic",
        "title": "Propositional and Predicate Logic",
        "blurb": "Nearly always answerable by building a truth table or applying "
                 "one equivalence law — no cleverness required, just accuracy.",
        "concepts": [
            "Propositions, connectives, truth tables",
            "Implication: converse/inverse/contrapositive",
            "Biconditional",
            "Tautology, contradiction, contingency",
            "Logical equivalence and the equivalence laws",
            "Rules of inference",
            "Normal forms: CNF and DNF",
            "Predicate logic: quantifiers and negation",
            "Proof techniques",
        ],
        "questions": [
            "Propositional logic", "Propositional Logic", "Predicate Logic",
            "Logical equivalence", "Truth tables",
        ],
    },
    {
        "id": "boolean",
        "title": "Boolean Algebra and Simplification",
        "blurb": "Shares its laws with logic; examiners ask it as circuit-flavoured "
                 "simplification (A + A'B = A + B is asked almost verbatim).",
        "concepts": [],
        "questions": [
            "Boolean simplification", "Boolean algebra terms", "Boolean identities",
        ],
    },
    {
        "id": "counting",
        "title": "Permutations, Combinations and the Pigeonhole Principle",
        "blurb": "Pure formula work. Decide 'does order matter?' and 'is repetition "
                 "allowed?' first — those two answers pick the formula for you.",
        "concepts": [
            "Permutations, circular and with repetition",
            "Combinations and the binomial theorem",
            "Combinations with repetition: stars and bars",
            "Pigeonhole principle",
        ],
        "questions": [
            "Combinatorics", "Permutations with grouping", "Combinations (handshakes)",
        ],
    },
    {
        "id": "recurrence",
        "title": "Recurrences and Generating Functions",
        "blurb": "Two question shapes only: *formulate* a recurrence from a word "
                 "problem, or *solve* a linear homogeneous one via its characteristic "
                 "equation.",
        "concepts": [
            "Generating functions",
            "Formulating recurrence relations",
            "Solving linear homogeneous recurrences",
            "Non-homogeneous recurrences, substitution",
            "Counting digit strings by recurrence",
        ],
        "questions": ["Recurrence relations"],
    },
    {
        "id": "graphs",
        "title": "Graph Theory",
        "blurb": "The heaviest cluster in Unit 1. Almost every question is one "
                 "formula away from the answer — memorise the table, don't reason "
                 "from first principles under time pressure.",
        "concepts": [
            "Graph basics: vertices, edges, graph types",
            "Degree, handshaking lemma, degree sequence",
            "Complete, regular, bipartite and planar graphs",
            "Subgraphs, cycle graphs and complements",
            "Walks, trails, paths, circuits and cycles",
            "Connectivity, components, vertex and edge connectivity",
            "Euler paths and Euler circuits",
            "Hamiltonian paths and circuits",
            "Graph colouring and chromatic number",
            "Adjacency matrix, adjacency list, incidence matrix",
            "Graph isomorphism and invariants",
            "Graph homomorphism",
        ],
        "questions": [
            "Graph Theory", "Graph theory", "Graph coloring", "Graph connectivity",
            "Graph isomorphism", "Graph enumeration", "Graph rank and nullity",
            "Hamiltonian graphs", "Euler graphs", "Planar graphs",
            "Incidence matrix", "Graph theory problems",
        ],
    },
    {
        "id": "trees1",
        "title": "Trees, Spanning Trees and Graph Algorithms",
        "blurb": "Unit 1 asks the *properties* (n−1 edges, Cayley's formula); "
                 "Unit 3 asks the same algorithms for their *complexity*. Learn "
                 "them once, answer both.",
        "concepts": [
            "Trees: definition and properties",
            "Spanning trees and Cayley's formula",
            "Kruskal's algorithm for minimum spanning trees",
            "Prim's algorithm for minimum spanning trees",
            "Dijkstra's single-source shortest path",
            "Floyd–Warshall and Warshall's algorithm",
            "Depth-first and breadth-first search",
        ],
        "questions": [
            "Trees", "Spanning trees", "Minimum spanning tree",
        ],
    },
    {
        "id": "automata",
        "title": "Finite Automata and Regular Languages",
        "blurb": "Definition-and-table territory. The NFA→DFA state-count "
                 "question (2^n) and the Mealy-vs-Moore distinction recur every year.",
        "concepts": [
            "Alphabets, strings, languages, Kleene star",
            "DFA — the 5-tuple",
            "NFA and NFA with epsilon moves",
            "NFA to DFA: subset construction",
            "State equivalence & DFA minimization",
            "Pumping lemma & limits of DFAs",
            "Regular expressions",
            "Moore machine",
            "Mealy machine & Moore equivalence",
        ],
        "questions": [
            "Finite automata", "Finite Automata", "Automata equivalence",
            "Regular expressions", "Regular languages", "DFA design",
            "NFA to DFA conversion", "Moore and Mealy machines", "Pumping lemma",
            "Turing machines", "Finite Automata / Formal Grammars",
        ],
    },
    {
        "id": "grammars",
        "title": "Formal Grammars and the Chomsky Hierarchy",
        "blurb": "The Type 0–3 ↔ machine ↔ language table is worth memorising "
                 "cold; it alone answers most questions in this cluster.",
        "concepts": [
            "Formal grammar: the 4-tuple",
            "Chomsky hierarchy overview",
            "Type 3 regular grammars & FA link",
            "Type 2 CFG, parse trees & ambiguity",
            "PDA: deterministic vs nondeterministic",
            "Type 1/0 grammars & closure properties",
        ],
        "questions": [
            "Chomsky hierarchy", "Closure properties", "Formal Grammars",
            "Ambiguous grammars", "Context-free languages", "Context-sensitive languages",
            "Context-sensitive grammars", "Chomsky Normal Form", "Pushdown automata",
        ],
    },
    {
        "id": "fuzzy",
        "title": "Fuzzy Sets",
        "blurb": "Small, self-contained, and reliably examined — cheap marks. "
                 "max/min for union/intersection, 1−μ for complement.",
        "concepts": ["Fuzzy sets — membership & properties"],
        "questions": ["Fuzzy sets", "Fuzzy logic operations", "Fuzzy defuzzification"],
    },
    {
        "id": "groups",
        "title": "Group Theory (peripheral)",
        "blurb": "Off the printed syllabus but present in the legacy papers — "
                 "learn the four axioms and move on.",
        "concepts": [],
        "questions": ["Group theory"],
    },
]

# --------------------------------------------------------------------------
# Unit 3 -- Data Structures and Algorithms (60 marks)
# --------------------------------------------------------------------------

U3_CLUSTERS = [
    {
        "id": "complexity",
        "title": "Algorithm Analysis and Asymptotic Notation",
        "blurb": "Frame the whole unit: nearly every other cluster ends in a "
                 "complexity question, so fix O / Ω / Θ and the growth "
                 "ordering first.",
        "concepts": [
            "Algorithm: definition & properties",
            "Time vs space complexity trade-off",
            "Asymptotic notation: O, Omega, Theta",
            "Best, average and worst case analysis",
            "Analysing loops for complexity",
            "Recurrence relations and the Master theorem",
            "Divide and conquer strategy",
        ],
        "questions": [
            "Algorithm development and complexity", "Algorithm Analysis",
            "Algorithm analysis", "Algorithms definition", "Algorithm design goals",
            "Algorithm efficiency measures", "Time complexity",
            "Time complexity notation", "Big O notation",
        ],
    },
    {
        "id": "arrays",
        "title": "Arrays, Addressing and Strings",
        "blurb": "The address-calculation formula is the most mechanical mark in "
                 "the paper — and the easiest to drop by forgetting the lower bound.",
        "concepts": [
            "ADT vs data structure, linear/dynamic",
            "Arrays: 1-D address formula",
            "Row-major vs column-major order",
            "Multidimensional array addressing",
            "Sparse matrices: triplet & linked form",
            "Packing and space-efficient storage",
            "Strings: representation and basic operations",
            "String pattern matching: naive and KMP",
        ],
        "questions": [
            "Arrays", "Arrays, strings and linear lists", "Multi-dimensional arrays",
            "Arrays (sentinel)", "Strings", "String operations", "Bit fields",
            "Bit packing", "Data compression", "Linear data structures",
        ],
    },
    {
        "id": "lists",
        "title": "Linked Lists",
        "blurb": "Asked as trade-off questions (array vs list) far more often than "
                 "as code — know exactly which operation each wins.",
        "concepts": [
            "Linear lists: sequential vs linked storage",
            "Singly linked list: nodes, insert, delete",
            "Doubly linked and circular linked lists",
            "Array vs linked list: full trade-off",
        ],
        "questions": [
            "Linked lists", "Circular linked lists", "Linked list properties",
            "Lists", "Lists (nested)", "Recursive lists", "Set ADT",
        ],
    },
    {
        "id": "stacks",
        "title": "Stacks and Expression Evaluation",
        "blurb": "The single densest cluster in Unit 3 (~25 questions). Infix→ "
                 "postfix conversion and postfix evaluation are guaranteed marks "
                 "once the stack drill is automatic.",
        "concepts": [
            "Stack ADT: LIFO, push, pop, peek",
            "Array vs linked implementation of a stack",
            "Infix, prefix and postfix notation",
            "Infix to postfix via stack (Shunting Yard)",
            "Evaluating postfix expressions with a stack",
            "Stack apps: parens, calls, backtracking",
            "Recursion removal using an explicit stack",
        ],
        "questions": [
            "Stacks, queues and expression evaluation", "Stacks", "Stack operations",
            "Stack applications", "Stack operations (max)", "Stacks and queues",
            "Expression conversion", "Infix to postfix",
            "Balanced expression check (stack)",
        ],
    },
    {
        "id": "queues",
        "title": "Queues, Circular Queues and Deques",
        "blurb": "One formula does most of the work: the (rear+1) mod n == front "
                 "full test, and the n−1 capacity that follows from it.",
        "concepts": [
            "Queue ADT: FIFO, enqueue, dequeue",
            "Linear queue and the false-overflow problem",
            "Circular queue: wraparound, full/empty test",
            "Deque: input- and output-restricted",
            "Priority queue: implementations, uses",
        ],
        "questions": [
            "Queues", "Queue operations", "Queue implementation", "Priority queues",
        ],
    },
    {
        "id": "recursion",
        "title": "Recursion",
        "blurb": "Tested as stack behaviour and as recurrence-solving, rarely as "
                 "code tracing.",
        "concepts": ["Recursion: base case, stack, tail call"],
        "questions": ["Recursion"],
    },
    {
        "id": "searching",
        "title": "Searching",
        "blurb": "Binary search's log₂n comparison count and its sorted-input "
                 "precondition are the two things actually asked.",
        "concepts": [
            "Sequential (linear) search",
            "Binary search",
            "Binary search: comparisons and pitfalls",
            "Interpolation and Fibonacci search",
        ],
        "questions": [
            "Searching complexity", "Binary search", "Linear search",
            "Linear search worst case", "BST search path",
        ],
    },
    {
        "id": "sorting",
        "title": "Sorting",
        "blurb": "Second-densest cluster. The comparison table (time / space / "
                 "stable / in-place) answers most of it; the rest is pass-tracing.",
        "concepts": [
            "Bubble sort", "Selection sort", "Insertion sort", "Merge sort",
            "Quick sort", "Heap sort", "Shell sort", "Counting sort",
            "Radix sort and bucket sort", "Sorting algorithm comparison table",
            "Lower bound for comparison sorting",
        ],
        "questions": [
            "Sorting", "Sorting algorithms", "Sorting complexity", "Sorting definitions",
            "Sorting stability", "Recursion, searching and sorting", "Bubble sort",
            "Bubble sort (calc)", "Selection sort", "Quick sort",
            "Quick sort complexity", "Merge sort", "Heap sort",
            "Radix sort complexity",
        ],
    },
    {
        "id": "trees3",
        "title": "Trees, BSTs, AVL and B-Trees",
        "blurb": "Height/node-count formulas plus the traversal-reconstruction "
                 "drill. The 2^(h+1)−1 vs 2^h−1 off-by-one is the classic trap.",
        "concepts": [
            "Tree terminology: nodes, height, depth",
            "Binary tree types: full, complete, perfect",
            "Binary tree representation: array vs linked",
            "Traversals: inorder, preorder, postorder",
            "Binary search tree: search, insert, delete",
            "AVL trees: balance factor and why balance",
            "AVL rotations: LL, RR, LR, RL worked",
            "Threaded binary trees: iterative inorder",
            "B-trees: order, occupancy, splitting",
            "B+ trees vs B-trees; external search",
        ],
        "questions": [
            "Trees", "Trees, AVL trees, heaps, B-trees and external search",
            "Binary trees", "Full binary trees", "Binary trees (Catalan)",
            "Tree traversal", "Tree traversal reconstruction", "Tree traversal (BFS/DFS)",
            "BST", "BST traversal", "BST complexity", "AVL trees", "AVL tree height",
            "B-trees", "B-trees applications", "B-trees vs B+trees",
        ],
    },
    {
        "id": "heaps",
        "title": "Heaps and Priority Queues",
        "blurb": "Index arithmetic (2i / 2i+1 / ⌊i/2⌋) and the build-heap "
                 "O(n) vs heap-sort O(n log n) distinction.",
        "concepts": [
            "Heaps: max-heap, min-heap, index math",
            "Heap insert, delete-max, build-heap, sort",
        ],
        "questions": [
            "Heaps", "Heap construction", "Heap insertion", "Binary heaps",
        ],
    },
    {
        "id": "hashing",
        "title": "Hashing",
        "blurb": "Compute h(k) = k mod m for a given list and spot the collisions — "
                 "that is essentially the whole cluster.",
        "concepts": ["Hashing: functions, load factor, collisions"],
        "questions": ["Hashing"],
    },
    {
        "id": "graphs3",
        "title": "Graphs, Greedy Methods and Disjoint Sets",
        "blurb": "Unit 3's angle on the Unit 1 algorithms: representation cost, "
                 "traversal data structure (DFS→stack, BFS→queue), and "
                 "complexity.",
        "concepts": [
            "Graph representation: matrix vs list",
            "Graph traversal: DFS (stack) vs BFS (queue)",
            "Disjoint sets: UNION, FIND, compression",
            "Greedy method: Kruskal's and Prim's MST",
            "Shortest path: Dijkstra, Bellman-Ford, F-W",
        ],
        "questions": [
            "Graphs, disjoint sets and greedy algorithms", "Graph Algorithms",
            "Graph theory", "Graph representation", "Spanning trees", "Shortest path",
            "Prim's algorithm complexity", "Union-Find",
        ],
    },
]

# Questions whose `sub` is the unit's generic bucket name get routed by keyword
# instead, since the tag itself carries no topic information.
GENERIC_SUBS = {"Discrete Mathematics", "Data Structures and Algorithms"}

# Ordered (cluster_id, keywords) -- first match wins. Only consulted for
# questions whose `sub` is in GENERIC_SUBS or is otherwise unmapped.
KEYWORD_ROUTES = [
    ("fuzzy",      ["fuzzy", "membership function", "defuzzif"]),
    ("grammars",   ["chomsky", "grammar", "context-free", "context free",
                    "context-sensitive", "pushdown", "cfg", "cnf", "ambiguous",
                    "production", "terminal"]),
    ("automata",   ["automat", "dfa", "nfa", "turing", "regular expression",
                    "regular language", "is regular", "moore", "mealy",
                    "pumping lemma", "kleene", "finite state", "transition"]),
    # DFS/BFS appear here for Unit 1 and in "graphs3" for Unit 3; the router
    # only ever considers routes belonging to the question's own unit, so the
    # duplicated keywords cannot cross-file a question.
    ("trees1",     ["spanning tree", "kruskal", "prim", "dijkstra", "warshall",
                    "cayley", "dfs", "bfs", "depth-first", "breadth-first"]),
    ("graphs",     ["graph", "vertex", "vertices", "edge", "chromatic", "colour",
                    "color", "euler", "hamilton", "planar", "bipartite",
                    "adjacency", "incidence", "degree", "isomorph"]),
    ("recurrence", ["recurrence", "generating function", "characteristic equation",
                    "fibonacci sequence"]),
    ("counting",   ["permutation", "combination", "how many ways", "arrangement",
                    "pigeonhole", "binomial", "factorial", "handshake"]),
    ("boolean",    ["boolean", "karnaugh", "k-map", "minterm", "maxterm",
                    "de morgan", "demorgan"]),
    ("logic",      ["proposition", "tautology", "truth table", "contrapositive",
                    "quantifier", "predicate", "logical", "implication",
                    "conjunction", "disjunction", "inference"]),
    ("poset",      ["poset", "lattice", "hasse", "partial order", "induction",
                    "lub", "glb", "supremum", "infimum", "upper bound"]),
    ("sets",       ["set", "relation", "function", "mapping", "power set",
                    "cardinality", "subset", "injective", "surjective",
                    "bijective", "onto", "one-one", "equivalence", "reflexive",
                    "symmetric", "transitive", "cartesian"]),

    ("stacks",     ["stack", "postfix", "prefix", "infix", "polish",
                    "parenthes", "bracket", "expression"]),
    ("queues",     ["queue", "deque", "fifo", "enqueue", "dequeue", "circular queue"]),
    ("heaps",      ["heap", "heapify", "priority queue"]),
    ("hashing",    ["hash", "collision", "load factor", "probing", "bucket"]),
    ("trees3",     ["tree", "bst", "avl", "b-tree", "b+ tree", "traversal",
                    "inorder", "preorder", "postorder", "leaf", "root", "node",
                    "height", "balance factor", "rotation"]),
    ("sorting",    ["sort", "bubble", "quick", "merge", "insertion", "selection",
                    "radix", "shell", "heapsort", "stable", "pivot", "pass"]),
    ("searching",  ["search", "binary search", "linear search", "sequential search"]),
    ("graphs3",    ["dfs", "bfs", "depth-first", "breadth-first", "union-find",
                    "disjoint set", "greedy", "shortest path", "adjacency"]),
    ("lists",      ["linked list", "linked-list", "node pointer", "singly",
                    "doubly", "circular list"]),
    ("arrays",     ["array", "row-major", "column-major", "row major",
                    "column major", "address", "string", "subscript", "index",
                    "sparse", "matrix"]),
    ("recursion",  ["recursi", "base case", "tail call"]),
    ("complexity", ["complexity", "big o", "asymptotic", "o(n", "theta", "omega",
                    "running time", "worst case", "efficien", "algorithm"]),
]

CONCEPT_FALLBACK = {"1": "sets", "3": "complexity"}
QUESTION_FALLBACK = {"1": "sets", "3": "complexity"}

# --------------------------------------------------------------------------
# Questions that are tagged into Unit 1/3 but are not Unit 1/3 material.
#
# EMPTY SINCE 2026-09-04, and that is the fix landing rather than the mechanism
# dying. This table used to hold 41 `TECH1_CSE_*` questions -- a long run of
# DBMS, networking, OS, graphics and OOP material carrying the generic
# "Discrete Mathematics" / "Data Structures and Algorithms" sub tag, because
# import_2026_tech1.py's classify() returns the UNIT TITLE as `sub`. A tag that
# merely restates the unit carries no information, so the keyword router had to
# fall back on question text -- and DBMS questions are full of the word
# "relation", networking of "set of rules", conics of "set of points". All
# three routed into "Sets, Relations and Functions", and the guide would have
# taught SQL syntax under a discrete-maths heading.
#
# Excluding them here only ever fixed THIS consumer; the bank stayed wrong, so
# the trainer's unit filters and generated mocks kept mis-filing them.
# `retag_tech1_cse.py` now fixes the bank itself: 4 moved to their real TECH1
# units (2 and 4), 30 to TECH1_LEGACY units 1 and 5 (DBMS and networking are in
# no unit of the 2026 syllabus, and TECH2/TECH3 are E-Governance and Project
# Management), and 7 graphics/OOP questions are parked in the non-merit OFFSYL
# paper. All 41 are now excluded from this guide STRUCTURALLY -- by paper, by
# unit, or by NON_UNIT_SUBS -- which is why emptying this table leaves the
# generated guide byte-for-byte identical.
#
# Kept rather than deleted: build_study_guide.py still imports it, hard-fails on
# a ghost id, and prints every entry on each run, so it remains the right place
# for the next mis-tagged question found before the bank can be corrected. Add
# entries here to unblock a build; fix the bank to close the issue.
# --------------------------------------------------------------------------
MISFILED = {}

# --------------------------------------------------------------------------
# Questions whose stored answer is contested, and why.
#
# The bank's answers for the non-official sittings were derived rather than
# taken from a published MPSC key, and a handful are demonstrably wrong or rest
# on a broken option list. This project's whole point is revision, so a wrong
# key here does real damage -- it teaches a false fact for a real exam. The
# guide therefore renders these with a visible warning next to the answer
# instead of dropping them (they are still worth practising) or showing them
# unqualified (which is what teaches the falsehood).
#
# Every entry below was verified against the question text and options.
# --------------------------------------------------------------------------
DISPUTED = {
    "TECH1_CSE_108":
        "The key says 64 (2⁶), but the stem says 6 states **excluding** the "
        "initial state — 7 states in all, so the subset-construction bound is "
        "2⁷ = 128, which is offered as option C. The stored explanation itself "
        "says 2^(number of states). Learn the **rule** (2^k for k total NFA "
        "states), not this question's letter.",
    # TECH1_CSE_207 was here — options A/C and B/D were printed identically and
    # the keyed O(n²) was the comparison count, not the swap count. Both were
    # repaired from page 5 q.43 of the source paper on 2026-09-02, so the card
    # now reads (a) O(log n) / (b) O(n) / (c) O(n log n) / (d) O(n²) keyed (b),
    # matching its PDF-verified twin MES2015_PAPER1_043. Nothing left to warn
    # about; the selection-sort swaps-vs-comparisons point now lives in the
    # card's own explanation, where it teaches instead of just cautioning.
    "TECH1_CSE_192":
        "Options C and D are printed identically (`y=A+B`), so no single letter "
        "is selectable. The mathematics is sound: A + A′B = A + B.",
    "TECH1_CSE_193":
        "Options A and C are printed identically. The half-subtractor result "
        "itself is right: D = A ⊕ B, Borrow = A′B.",
    "MES2023_P1_045":
        "The stem does not describe stability. Stability means **equal keys keep "
        "their relative order**, not that an element stays in the same location. "
        "Learn the real definition; the keyed option label is the only correct "
        "part of this question.",
    "ILM2023_P1_014":
        "Describes an **Euler circuit** (every edge once, return to start), which "
        "is not among the options. The keyed Travelling Salesman Problem is a "
        "*vertex* tour. The bank's own note admits no option is correct.",
    "ILM2010_P1_047":
        "No abelian group of order 4 has element orders 2, 2, 4: ℤ₄ gives 2, 4, 4 "
        "and the Klein four-group gives 2, 2, 2. Lagrange only rules out the "
        "options containing 3. The keyed multiset is not realisable.",
    "ILM2023_P1_009":
        "None of the four options is the combinations formula n!/(r!(n−r)!); the "
        "keyed option is the **permutations** formula. Learn both formulas rather "
        "than this question's letter.",
    "MES2023_P1_007":
        "Ambiguous as worded. P(∅) = {∅} has **one element** but **two subsets** "
        "(∅ and {∅}). The question says 'subset' but the key answers for elements.",
    "TECH1_CSE_031":
        "The pivots returned depend on the partition scheme (first / last / "
        "Lomuto / Hoare), which the question never states. Not reliably answerable.",
    "ILM2010_P1_037":
        "OCR destroyed the complement bars: the expression prints as ABCD + ABCD "
        "and options A and B are identical. Unanswerable as printed.",
    "ILM2010_P1_041":
        "All four options print as `x + y`. Unanswerable as printed; the identity "
        "x̄y + xȳ + xy = x + y is still worth knowing.",
    "ILM2010_P1_051":
        "Both option C, p ∨ (p → q), and option D, p → (q → p), are tautologies. "
        "Two valid answers.",
    "MES2015_PAPER1_013":
        "The pool sizes are missing from the stem, so no option is derivable. The "
        "method is still the point: C(reds, 2) × C(blacks, 3).",
    "ILM2018_P1_007":
        "The real criterion for state equivalence — no string distinguishes the "
        "two states — appears in none of the options. The keyed 'both are final "
        "states' is false.",

    # ---- Unit 3 ----
    "ILM2010_P2_087":
        "The stem says **3** nodes, for which the Catalan number is C₃ = **5** — "
        "not among the options. The keyed 14 is C₄, the answer for **4** nodes. "
        "Learn the sequence (1, 2, 5, 14, 42) and read the node count carefully.",
    "PROG2018_P1_032":
        "The list `1, 2, 3, …, n` is **already sorted**, so insertion sort makes "
        "only **n − 1** comparisons. The keyed `(n² + n − 2)/2` is insertion "
        "sort's **worst** case, which this input is the opposite of.",
    "ILM2023_P1_094":
        "Union–Find's canonical use is **Kruskal's MST** (cycle detection), which "
        "is not among the options. The keyed DFS is not where Union–Find belongs.",
    "PROG2018_P1_027":
        "Both replacements are standard and correct: the **inorder successor** "
        "(keyed) and the **inorder predecessor** are equally valid for deleting a "
        "two-child BST node. Circulating keys for this question pick option B.",
    "PROG2018_P1_020":
        "Loose. Preorder is the usual answer, but **inorder and postorder are "
        "also depth-first** orders — only level-order is not. The distinguishing "
        "fact worth learning is DFS→stack, BFS→queue.",
    "ILM2010_P2_009":
        "True only for a **balanced** BST. The question does not say balanced, and "
        "a skewed BST degenerates to a linked list, giving **O(n)** — which is "
        "offered as option C. Know both cases.",
    "ILM2010_P2_020":
        "O(n²) holds for Dijkstra with an **adjacency matrix**. With a binary heap "
        "it is O((V+E) log V). The question never states the representation.",
    "MES2023_P1_B020":
        "Two options are valid: (a) `1, 3, 2, 4, 6, 5` is a legitimate **min**-heap "
        "and (b) `6, 5, 3, 4, 2, 1` a legitimate **max**-heap. The question asks "
        "you to identify 'the' heap when there are two.",
}
