"""Hand-authored layer of the Technical Paper I study guide.

`CRAM_SHEET` is the one-page formula reference; `WORKED` holds the step-by-step
procedures for the question types that need a method rather than a fact.

Everything here was written against the actual question bank -- each row exists
because a past question needed it, not because a textbook lists it. Where the
bank's own questions are ambiguous about a convention (binary-tree height being
the worst offender), the row states both conventions rather than picking one,
because the exam has used both.

Inline markers: **bold** and `code`. Both are rendered by build_study_guide.py.
"""

# ==========================================================================
# CRAM SHEET
# ==========================================================================

CRAM_SHEET = [
    {
        "title": "Counting on a set of n elements",
        "note": "The most-reused arithmetic in Unit 1. Every one of these has "
                "been asked directly, and the wrong options are almost always "
                "the neighbouring formula in this table.",
        "cols": ["Quantity", "Formula", "Worked at small n"],
        "rows": [
            ["Subsets of A (the power set)", "`2ⁿ`", "n = 4 → 16"],
            ["Elements of A × A", "`n²`", "n = 3 → 9"],
            ["Relations on A (subsets of A × A)", "`2^(n²)`",
             "n = 3 → 2⁹ = 512 — **not** `(2ⁿ)² = 2^(2n)`"],
            ["Reflexive relations on A", "`2^(n²−n)`", "n = 3 → 2⁶ = 64"],
            ["Symmetric relations on A", "`2^(n(n+1)/2)`", "n = 3 → 2⁶ = 64"],
            ["Functions from an m-set to an n-set", "`nᵐ`",
             "m = 3, n = 2 → 2³ = 8. Reversing to `mⁿ` is the standard trap"],
            ["Injections (one-one) m-set → n-set", "`P(n,m) = n!/(n−m)!`",
             "m = 4, n = 5 → 5·4·3·2 = 120; zero if m > n"],
            ["Surjections (onto) m-set → n-set",
             "`Σₖ₌₀ⁿ (−1)ᵏ C(n,k)(n−k)ᵐ`",
             "m = 4, n = 3 → 81 − 48 + 3 = 36"],
            ["Bijections (only when m = n)", "`n!`", "n = 4 → 24"],
            ["Equivalence relations on A = partitions of A",
             "Bell number `Bₙ`",
             "**B₁=1, B₂=2, B₃=5, B₄=15, B₅=52** — memorise these five"],
            ["Largest equivalence relation (A × A)", "`n²` ordered pairs", "n = 5 → 25"],
            ["Smallest equivalence relation (identity)", "`n` ordered pairs", "n = 5 → 5"],
            ["Contiguous substrings of a length-n string", "`C(n+1,2) = n(n+1)/2`",
             "n = 4 → 10"],
        ],
    },
    {
        "title": "Permutations, combinations and arrangements",
        "note": "Decide two things before reaching for a formula: does order "
                "matter, and is repetition allowed? Those answers pick the row.",
        "cols": ["Situation", "Formula", "Worked"],
        "rows": [
            ["Order matters, no repetition (permutation)", "`P(n,r) = n!/(n−r)!`",
             "P(5,4) = 120"],
            ["Order does not matter (combination)", "`C(n,r) = n!/(r!(n−r)!)`",
             "C(7,3) = 35"],
            ["Order matters, repetition allowed", "`nʳ`", "3 letters from 4 → 64"],
            ["Order does not matter, repetition allowed (stars and bars)",
             "`C(n+r−1, r)`", "r = 3 from n = 4 types → C(6,3) = 20"],
            ["Circular arrangements of n objects", "`(n−1)!`", "n = 5 → 24"],
            ["A block of k items must stay together",
             "`(n−k+1)! × k!`",
             "'SIGNATURE' (9 distinct letters) with its 4 vowels together → "
             "**6! × 4! = 17,280**"],
            ["Everyone shakes hands once", "`C(n,2) = n(n−1)/2`", "n = 10 → **45**"],
            ["Word with repeated letters", "`n! / (p₁! p₂! …)`",
             "'LEVEL' → 5!/(2!·2!) = 30"],
        ],
    },
    {
        "title": "Summation identities (for induction questions)",
        "note": "Section-B induction proofs come from this list.",
        "cols": ["Sum", "Closed form"],
        "rows": [
            ["`1 + 2 + … + n`", "`n(n+1)/2`"],
            ["`1² + 2² + … + n²`", "`n(n+1)(2n+1)/6`"],
            ["`1³ + 2³ + … + n³`", "`[n(n+1)/2]²` — the square of the previous row"],
            ["`1 + 3 + 5 + … + (2n−1)` (odd numbers)",
             "`n²` — the trap answer is `n(n+1)/2`"],
            ["`1 + 2 + 4 + … + 2ⁿ`", "`2^(n+1) − 1`"],
        ],
    },
    {
        "title": "Graph theory — the formula block",
        "note": "The single highest-yield table in Unit 1. Note how many "
                "answers are `n − 1`; the papers offer n and n+1 every time.",
        "cols": ["Quantity", "Formula / condition"],
        "rows": [
            ["Handshaking lemma", "`Σ deg(v) = 2e` — so the number of odd-degree "
             "vertices is always even"],
            ["Edges in a complete graph `Kₙ`", "`n(n−1)/2` = `C(n,2)` — **not** `n(n+1)/2`"],
            ["Minimum edges to connect n vertices", "`n − 1`"],
            ["Edges in a tree on n vertices", "`n − 1`"],
            ["Edges in a forest, n vertices and k components", "`n − k`"],
            ["Edges in a spanning tree", "`n − 1`"],
            ["Labelled spanning trees of `Kₙ` (Cayley)", "`n^(n−2)` — n = 4 → 16"],
            ["Rank of a graph", "`n − k` (vertices − components)"],
            ["Nullity / circuit rank / cyclomatic number", "`e − n + k`"],
            ["Rank of the incidence matrix (connected)", "`n − 1`"],
            ["Edge connectivity of `Kₙ`", "`n − 1`"],
            ["Length of a Hamiltonian path on n vertices", "`n − 1` edges"],
            ["Euler **circuit** exists", "connected **and every vertex has even degree**"],
            ["Euler **path** exists", "connected and **exactly 0 or 2** odd-degree vertices"],
            ["Planar graph (Euler's formula)", "`v − e + f = 2`"],
            ["Simple planar bound (v ≥ 3)", "`e ≤ 3v − 6`; bipartite planar `e ≤ 2v − 4`"],
            ["Kuratowski's theorem", "planar ⟺ no subgraph **homeomorphic** to "
             "`K₅` or `K₃,₃` (homeomorphic, not isomorphic)"],
            ["Adding one edge to a tree", "creates **exactly one** cycle"],
            ["Paths between two vertices of a tree", "**exactly one**"],
        ],
    },
    {
        "title": "Chromatic numbers",
        "note": "χ(G) = fewest colours so no two adjacent vertices match.",
        "cols": ["Graph", "χ"],
        "rows": [
            ["Null / edgeless graph", "`1`"],
            ["Any graph with at least one edge", "`≥ 2`"],
            ["Complete graph `Kₙ`", "`n`"],
            ["Cycle `Cₙ`, n even", "`2`"],
            ["Cycle `Cₙ`, n odd", "`3`"],
            ["Any bipartite graph (includes all trees with an edge)", "`2`"],
            ["Any planar graph (Four Colour Theorem)", "`≤ 4`"],
        ],
    },
    {
        "title": "Chomsky hierarchy — memorise cold",
        "note": "Answers a whole cluster on its own. Type 0 is the most "
                "powerful and least restricted; Type 3 the most restricted. "
                "Candidates invert this under pressure.",
        "cols": ["Type", "Grammar", "Language", "Recognising machine", "Production form"],
        "rows": [
            ["**0**", "Unrestricted", "Recursively enumerable", "**Turing machine**", "α → β"],
            ["**1**", "Context-sensitive", "Context-sensitive",
             "**Linear bounded automaton (LBA)**", "αAβ → αγβ, |γ| ≥ 1"],
            ["**2**", "Context-free", "Context-free", "**Pushdown automaton (PDA)**",
             "`A → α` (single non-terminal on the left)"],
            ["**3**", "Regular / right-linear", "Regular",
             "**Finite automaton (DFA/NFA)**", "A → aB or A → a"],
        ],
    },
    {
        "title": "Closure properties",
        "note": "Regular languages are closed under everything listed. "
                "Context-free languages fail on intersection and complement — "
                "that gap is what the papers test.",
        "cols": ["Operation", "Regular", "Context-free"],
        "rows": [
            ["Union", "✅", "✅"],
            ["Concatenation", "✅", "✅"],
            ["Kleene star", "✅", "✅"],
            ["Intersection", "✅", "**❌**"],
            ["Complement", "✅", "**❌**"],
            ["CFL ∩ Regular", "—", "**✅ always context-free** (not necessarily regular)"],
        ],
    },
    {
        "title": "Automata facts that recur every sitting",
        "cols": ["Fact", "Detail"],
        "rows": [
            ["DFA is a 5-tuple", "`M = (Q, Σ, δ, q₀, F)` — no output alphabet"],
            ["Mealy and Moore are 6-tuples",
             "`(Q, Σ, Δ, δ, λ, q₀)` — **same size**; they differ only in λ"],
            ["**Moore** output", "depends on the **present state only**"],
            ["**Mealy** output", "depends on the **present state and the current input**"],
            ["NFA vs DFA", "differ **only in the transition function**; both are "
             "equally powerful in the languages they accept"],
            ["NFA → DFA (subset construction)",
             "an NFA with `k` states gives a DFA with **at most `2ᵏ`** states"],
            ["NFA acceptance", "accepts if **at least one** path reaches a final state"],
            ["Kleene's theorem", "regular ⟺ DFA ⟺ NFA ⟺ regular expression — all equivalent"],
            ["Pumping lemma", "proves **non-regularity only**; it is necessary, not sufficient"],
            ["Infinite ≠ non-regular", "`a*` is infinite and regular; `aⁿbⁿ` is not"],
            ["A PDA with **two** stacks", "is Turing-complete"],
            ["Palindromes", "accepted by an **N**PDA, not a DPDA; never by a DFA"],
            ["CNF derivation length", "a string of length n takes exactly `2n − 1` steps"],
            ["Context-sensitive languages", "are always **recursive** (membership is decidable)"],
        ],
    },
    {
        "title": "Language classification — the standard examples",
        "cols": ["Language", "Class"],
        "rows": [
            ["`(aa)*`, i.e. `{a^(2i)}`", "**Regular**"],
            ["`{aⁿbⁿ}`", "Context-free, **not** regular"],
            ["`{aⁿb²ⁿ}`", "Context-free (`S → aSbb | abb`)"],
            ["`{aⁿbⁿcⁿ}`", "Context-**sensitive**, recursive, not context-free"],
            ["`{aⁱbⁱcⁱdⁱ}`", "Context-sensitive, recursive"],
            ["Even-length palindromes", "Context-free (NPDA), not deterministic-CF"],
        ],
    },
    {
        "title": "Posets, lattices and Boolean algebra",
        "cols": ["Term", "Definition / test"],
        "rows": [
            ["Partial order", "reflexive + **antisymmetric** + transitive"],
            ["Equivalence relation", "reflexive + **symmetric** + transitive"],
            ["Lattice", "a poset in which **every pair** has both a join (LUB, ∨) "
             "and a meet (GLB, ∧)"],
            ["**Maximal** vs **maximum**",
             "maximal = nothing above it (can be several); maximum = above "
             "**everything** (at most one)"],
            ["Chain / antichain",
             "chain = every pair comparable (totally ordered); antichain = no two comparable"],
            ["Hasse diagram", "drop reflexive loops and transitive edges; keep only "
             "**covering** relations"],
            ["Distributive lattice",
             "`a ∨ (b ∧ c) = (a ∨ b) ∧ (a ∨ c)` **and** its dual. The non-distributive "
             "counterexamples are the pentagon `N₅` and the diamond `M₃`"],
            ["Holds in **every** lattice (so cannot prove distributivity)",
             "commutativity, **idempotency** `a ∧ a = a`, **absorption** `a ∨ (a ∧ b) = a`"],
            ["Complemented lattice", "bounded, and every `a` has `a′` with "
             "`a ∨ a′ = 1` and `a ∧ a′ = 0`"],
            ["Boolean algebra", "a **complemented distributive** lattice"],
            ["Bounded lattice", "has a bottom `0` (GLB of all) and a top `1` (LUB of all)"],
        ],
    },
    {
        "title": "Logic and Boolean identities",
        "cols": ["Identity", "Statement"],
        "rows": [
            ["Implication", "`p → q ≡ ¬p ∨ q`"],
            ["Contrapositive (equivalent)", "`p → q ≡ ¬q → ¬p`"],
            ["Converse / inverse (**not** equivalent)", "`q → p` / `¬p → ¬q`"],
            ["Biconditional", "`p ↔ q ≡ (p → q) ∧ (q → p)`"],
            ["De Morgan", "`¬(p ∧ q) ≡ ¬p ∨ ¬q`; `¬(p ∨ q) ≡ ¬p ∧ ¬q`"],
            ["Absorption (asked verbatim)", "`p ∧ (¬p ∨ q) ≡ p ∧ q`"],
            ["A standard tautology", "`p → (q → p)`"],
            ["Boolean absorption", "`A + A′B = A + B`  and  `A + AB = A`"],
            ["Consensus theorem", "`AB + A′C + BC = AB + A′C` (needs the complement pair)"],
            ["Half adder", "Sum `= A ⊕ B`, Carry `= AB`"],
            ["Half subtractor", "Difference `= A ⊕ B`, **Borrow `= A′B`**"],
            ["SOP vs POS", "SOP = OR of AND terms (`AB + CD`); POS = AND of OR terms"],
            ["'Some A are B'", "`∃x (A(x) ∧ B(x))` — existential pairs with **AND**"],
            ["'All A are B'", "`∀x (A(x) → B(x))` — universal pairs with **IMPLIES**"],
        ],
    },
    {
        "title": "Fuzzy sets",
        "note": "Small topic, reliably examined, entirely formula-driven — "
                "the cheapest marks in Unit 1.",
        "cols": ["Operation / term", "Definition"],
        "rows": [
            ["Membership function", "`μ_A(x) ∈ [0,1]` (a crisp set allows only {0,1})"],
            ["Union (Zadeh) — the OR analogue", "`μ_{A∪B}(x) = **max**(μ_A(x), μ_B(x))`"],
            ["Intersection (Zadeh) — the AND analogue", "`μ_{A∩B}(x) = **min**(μ_A(x), μ_B(x))`"],
            ["Complement", "`μ_{A′}(x) = 1 − μ_A(x)`"],
            ["Algebraic sum (a distractor for union)", "`μ_A + μ_B − μ_A·μ_B`"],
            ["Algebraic product (a distractor for intersection)", "`μ_A · μ_B`"],
            ["α-cut", "`A_α = { x : μ_A(x) **≥** α }` — a **crisp** set"],
            ["Height", "`h(A) = sup μ_A(x)`; A is **normal** iff `h(A) = 1`"],
            ["Support", "`{ x : μ_A(x) > 0 }`"],
            ["Core", "`{ x : μ_A(x) = 1 }`"],
            ["Cross-over point", "the x where `μ_A(x) = 0.5`"],
            ["Fuzzy logic addresses", "**vagueness**, not randomness (that is probability)"],
            ["Mamdani pipeline",
             "Fuzzification → rule evaluation → aggregation → **defuzzification**"],
        ],
    },
    {
        "title": "Group theory (peripheral but asked)",
        "cols": ["Fact", "Detail"],
        "rows": [
            ["Group axioms", "**closure, associativity, identity, inverses**. "
             "Commutativity is **not** required — that is *abelian*"],
            ["Lagrange's theorem", "the order of every element **divides** the group order"],
            ["Groups of order 4", "exactly two up to isomorphism: `ℤ₄` (element orders "
             "1,2,4,4) and the Klein four-group `ℤ₂×ℤ₂` (1,2,2,2)"],
            ["ℚ under multiplication", "**not** a group — 0 has no inverse"],
            ["Invertible n×n matrices", "form the group `GL(n)` under multiplication"],
            ["Modular inverse", "solve `a·x ≡ 1 (mod m)`; e.g. `3·5 = 15 ≡ 1 (mod 7)` → 5"],
        ],
    },

    # ------------------------------------------------------------------ U3
    {
        "title": "Sorting — the comparison table",
        "note": "The highest-yield single table in Unit 3. Learn the last two "
                "columns as carefully as the complexities; 'stable but not "
                "in-place' vs 'in-place but not stable' is the examiner's "
                "favourite distractor pair.",
        "cols": ["Algorithm", "Best", "Average", "Worst", "Space", "Stable?", "In-place?"],
        "rows": [
            ["Bubble", "`O(n)` *(only with the early-exit flag)*", "`O(n²)`", "`O(n²)`",
             "`O(1)`", "**Yes**", "Yes"],
            ["Selection", "`O(n²)`", "`O(n²)`", "`O(n²)`", "`O(1)`", "**No**", "Yes"],
            ["Insertion", "`O(n)`", "`O(n²)`", "`O(n²)`", "`O(1)`", "**Yes**", "Yes"],
            ["Merge", "`O(n log n)`", "`O(n log n)`", "`O(n log n)`", "`O(n)`",
             "**Yes**", "**No**"],
            ["Quick", "`O(n log n)`", "`O(n log n)`", "**`O(n²)`**", "`O(log n)` stack",
             "**No**", "Yes"],
            ["Heap", "`O(n log n)`", "`O(n log n)`", "`O(n log n)`", "`O(1)`", "**No**", "Yes"],
            ["Shell", "`O(n log n)`", "gap-dependent", "`O(n²)`", "`O(1)`", "**No**", "Yes"],
            ["Counting", "`O(n+k)`", "`O(n+k)`", "`O(n+k)`", "`O(k)`", "**Yes**", "**No**"],
            ["Radix", "`O(d(n+k))`", "`O(d(n+k))`", "`O(d(n+k))`", "`O(n+k)`",
             "**Yes**", "**No**"],
            ["Bucket", "`O(n+k)`", "`O(n+k)`", "`O(n²)`", "`O(n)`",
             "Yes *(if the inner sort is)*", "**No**"],
        ],
    },
    {
        "title": "Sorting — the facts behind the table",
        "cols": ["Point", "Detail"],
        "rows": [
            ["Stable set", "bubble, insertion, merge, counting, radix, bucket. "
             "**Everything else reorders equal keys.**"],
            ["Not in-place", "merge, counting, radix, bucket"],
            ["Only common O(n log n)-average sort with an O(n²) worst case", "**quick sort**"],
            ["Quick sort worst case occurs when", "the pivot is always the smallest or "
             "largest element (e.g. first-element pivot on already-sorted input)"],
            ["Selection sort **swaps**", "exactly `n − 1`, i.e. `O(n)` — its *comparisons* "
             "are `O(n²)`. Do not conflate the two"],
            ["Selection sort's best case", "still `O(n²)` — the only simple sort with no "
             "adaptive behaviour"],
            ["Bubble sort's `O(n)` best case", "**conditional on the swapped flag**; "
             "without it there is no `O(n)` case"],
            ["Heap sort is `O(n log n)` in the worst case",
             "only heap **construction** is `O(n)`"],
            ["Quick sort's `O(log n)` space", "is recursion stack, not data movement — "
             "it still counts as in-place"],
            ["Lower bound for comparison sorting", "`Ω(n log n)`. Counting/radix/bucket beat "
             "it only by not comparing keys"],
            ["Number of passes for bubble/selection on n elements", "`n − 1`"],
            ["Bubble sort comparisons, worst case", "`n(n−1)/2`"],
            ["Insertion sort comparisons, **worst** case", "`(n² + n − 2)/2`"],
            ["Radix sort cost", "`d × (n + k)` — e.g. 13 values, 10 buckets, "
             "4-digit keys → 4 × (13+10) = **92**"],
            ["Worst-case ranking, best to worst",
             "`merge = heap  <  quick = selection = bubble = insertion`"],
            ["Best on nearly-sorted input", "**insertion sort** — `O(n)`"],
            ["Use selection sort when", "records are large but keys small — it "
             "makes only n−1 swaps, so swap cost dominates"],
            ["Divide-and-conquer sorts", "**merge** and **quick**"],
        ],
    },
    {
        "title": "Searching and complexity",
        "cols": ["Operation", "Best", "Average", "Worst", "Precondition"],
        "rows": [
            ["Linear search", "`O(1)`", "`O(n)`", "`O(n)`", "none"],
            ["Binary search", "`O(1)`", "`O(log n)`", "`O(log n)`",
             "**array must be sorted**"],
            ["Binary search max comparisons", "—", "—", "`⌊log₂ n⌋ + 1`", "—"],
            ["BST search", "`O(1)`", "`O(log n)`", "**`O(n)`** (skewed tree)", "—"],
            ["Balanced BST / AVL search", "`O(1)`", "`O(log n)`", "`O(log n)`", "—"],
            ["Hash table lookup", "`O(1)`", "`O(1)`", "`O(n)` (all keys collide)", "—"],
            ["Growth ordering",
             "`O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`", "", "", ""],
        ],
    },
    {
        "title": "Array address calculation",
        "note": "Purely mechanical marks. The one thing that loses them is "
                "forgetting to subtract the lower bound when the array is not "
                "0-indexed.",
        "cols": ["Case", "Formula"],
        "rows": [
            ["1-D, `A[i]`, lower bound `lb`, element width `w`",
             "`Base + w × (i − lb)`"],
            ["2-D **row-major** `A[i][j]`, `n₂` = number of **columns**",
             "`Base + w × [ (i − lb₁) × n₂ + (j − lb₂) ]`"],
            ["2-D **column-major** `A[i][j]`, `n₁` = number of **rows**",
             "`Base + w × [ (j − lb₂) × n₁ + (i − lb₁) ]`"],
            ["k-D row-major",
             "each index is weighted by the sizes of **all dimensions to its right**"],
            ["k-D column-major",
             "each index is weighted by the sizes of **all dimensions to its left**"],
            ["3-D row-major `A[i][j][k]`, extents M, N, P",
             "`Base + w × [ (i−lb₁)·N·P + (j−lb₂)·P + (k−lb₃) ]`"],
            ["Dimension size", "`nᵢ = upperᵢ − lowerᵢ + 1`"],
            ["Total elements", "product of all the dimension sizes. `A(−1…m, 1…m)` "
             "holds `(m+2) × m` — the **negative lower bound** is the trap"],
            ["Which subscript varies fastest",
             "**row-major → the rightmost**; column-major → the leftmost"],
            ["Cost of an address computation", "`O(k)` — independent of array size"],
            ["Length of a nested list",
             "count **top-level** elements only: `((5,6), 0, (9,6,3,5))` has length **3**"],
        ],
    },
    {
        "title": "Trees — node and height relations",
        "note": "**Read the height convention first.** Counting *levels* and "
                "counting *edges* differ by one, and the papers have used both. "
                "If 'height 10' has 1023 among the options, they are counting "
                "levels; if 2047 appears, they are counting edges.",
        "cols": ["Quantity", "Formula"],
        "rows": [
            ["Max nodes at level `L` (root at level 0)", "`2ᴸ`"],
            ["Max nodes in a tree of **h levels**", "`2ʰ − 1` (h = 10 → **1023**)"],
            ["Max nodes with **edge-height h**", "`2^(h+1) − 1`"],
            ["Min height (levels) for n nodes", "`⌈log₂(n+1)⌉`"],
            ["Leaves vs degree-2 nodes in a binary tree", "`L = D₂ + 1`"],
            ["Full binary tree with `i` internal nodes",
             "has `i + 1` leaves and `2i + 1` nodes total"],
            ["Full binary tree with `L` leaves", "has `2L − 1` nodes total (L = 10 → **19**)"],
            ["Distinct binary trees with n nodes (Catalan)",
             "`C(2n,n)/(n+1)` → **1, 2, 5, 14, 42** for n = 1…5"],
            ["Minimum nodes in an AVL tree of height h",
             "`N(h) = N(h−1) + N(h−2) + 1`, N(0)=1, N(1)=2 → "
             "**1, 2, 4, 7, 12, 20, 33, 54**"],
            ["AVL balance factor", "`height(left) − height(right)` ∈ **{−1, 0, +1}**"],
            ["B-tree of order m — children", "≤ `m`, and ≥ `⌈m/2⌉` (root exempt)"],
            ["B-tree of order m — keys per node", "≤ `m − 1`, and ≥ `⌈m/2⌉ − 1`"],
            ["B-tree structural invariant", "**all leaves lie at the same level** — "
             "this is what separates it from a binary/AVL tree"],
            ["B+ tree advantage", "leaves are **chained in sequence**, so range "
             "queries are faster; internal nodes are index-only"],
            ["Height of a heap / complete tree with n nodes", "`⌊log₂ n⌋`"],
            ["Preorder = postorder implies", "the tree has exactly **one node**"],
            ["Inorder traversal of a **BST**", "yields keys in **ascending** order"],
            ["Complete vs full binary tree",
             "**complete** = every level filled except possibly the last, which "
             "fills **left to right**. **Full/strict** = every internal node has "
             "exactly 2 children. A heap is **complete**, not full"],
            ["Deleting a two-child BST node",
             "replace it with its inorder **successor** (or predecessor — both are "
             "standard)"],
        ],
    },
    {
        "title": "Heaps — index arithmetic",
        "note": "Off-by-one between the two conventions is the whole trap here. "
                "Check whether the question indexes from 0 or 1 before answering.",
        "cols": ["", "1-based array", "0-based array"],
        "rows": [
            ["Left child of `i`", "`2i`", "`2i + 1`"],
            ["Right child of `i`", "`2i + 1`", "`2i + 2`"],
            ["Parent of `i`", "`⌊i/2⌋`", "`⌊(i−1)/2⌋`"],
            ["Root", "index 1", "index 0"],
            ["Build heap from an unsorted array", "`O(n)`", "`O(n)`"],
            ["Insert / delete-root", "`O(log n)`", "`O(log n)`"],
            ["Heap sort overall", "`O(n log n)`", "`O(n log n)`"],
            ["Find max in a max-heap", "`O(1)` (the root)", "`O(1)`"],
            ["Search for an arbitrary key", "`O(n)` — a heap is **not** sorted",
             "`O(n)`"],
            ["Last non-leaf node", "`⌊n/2⌋`", "`⌊n/2⌋ − 1`"],
            ["Number of leaves", "`⌈n/2⌉`", "`⌈n/2⌉`"],
            ["Bottom-up build-heap (sift-down)", "**`O(n)`**", "**`O(n)`**"],
            ["Building by n successive inserts (sift-up)",
             "`O(n log n)` — the trap option", "`O(n log n)`"],
        ],
    },
    {
        "title": "Linked lists — the countable facts",
        "cols": ["Operation / property", "Value"],
        "rows": [
            ["Pointer fields changed to delete a node (singly)", "**1** — the "
             "predecessor's `next`"],
            ["Pointers modified to insert into a **circular** list", "**2**"],
            ["Minimum fields per node", "**2** — data, plus a pointer to the next node"],
            ["Insert at head, or after a node already in hand", "`O(1)`"],
            ["Search", "`O(n)`"],
            ["Delete the **last** node of a singly linked list",
             "`O(n)` **even with a tail pointer** — you must find the new tail"],
            ["Doubly linked list beats singly at",
             "deleting a node whose location is given: `O(1)` vs `O(n)`"],
            ["Memory-efficient doubly linked list",
             "**XOR linked list** — one field holding `prev ⊕ next`"],
            ["Circular list defining property",
             "the last node's `next` is **never NULL**"],
            ["Allocation", "**dynamic**, at run time"],
            ["Unsuitable for", "**binary search** — no `O(1)` midpoint access"],
        ],
    },
    {
        "title": "Algorithm design paradigms",
        "cols": ["Paradigm", "Signature", "Examples"],
        "rows": [
            ["**Divide and conquer**", "subproblems do **not** overlap",
             "merge sort, quick sort, binary search"],
            ["**Dynamic programming**", "**overlapping** subproblems + optimal "
             "substructure; uses **memoization**",
             "longest common subsequence `O(mn)`, Floyd–Warshall"],
            ["**Greedy**", "take the locally best choice and never revisit it",
             "Kruskal, Prim, Dijkstra, Huffman coding"],
            ["Growth ordering worth memorising",
             "`n^(log n) < 2ⁿ < n!`", "via `n^(log n) = 2^((log n)²)`"],
            ["Recursion with no reachable base case", "**stack overflow**", ""],
            ["Converting recursion to iteration", "requires an explicit **stack**", ""],
            ["Huffman coding is", "**data compression**", ""],
        ],
    },
    {
        "title": "Queues and stacks",
        "cols": ["Quantity", "Formula / rule"],
        "rows": [
            ["**Linear** queue — full", "`rear == MAX_SIZE − 1` (this is the "
             "distractor for the circular condition, and vice versa)"],
            ["Why a circular queue exists", "in a linear queue, dequeuing only "
             "advances `front`, stranding the slots behind it — the queue reads "
             "full with space free at the start"],
            ["Circular queue — advance", "`rear = (rear + 1) % n`, `front = (front + 1) % n`"],
            ["Circular queue — **full**", "`(rear + 1) % n == front`"],
            ["Circular queue — **empty**", "`front == rear`"],
            ["Circular queue — usable capacity",
             "**`n − 1`** out of an n-slot array (one slot is sacrificed to tell "
             "full from empty)"],
            ["Circular queue — element count", "`(rear − front + n) % n`"],
            ["Stack discipline", "**LIFO**; push/pop/peek are all `O(1)`"],
            ["Queue discipline", "**FIFO**; enqueue/dequeue are `O(1)`"],
            ["DFS uses a", "**stack** (or recursion)"],
            ["BFS uses a", "**queue**"],
            ["Stacks needed to simulate a queue", "exactly **2**"],
            ["Finding the max of an unordered stack", "`O(n)`"],
            ["Underflow / overflow", "pop on empty / push on full"],
            ["Deque", "insert and delete at **both ends**, never the middle"],
            ["Stack applications", "expression conversion and evaluation, parenthesis "
             "matching, function-call management (activation records), backtracking, "
             "recursion removal, undo"],
            ["Queue applications", "BFS, round-robin CPU scheduling, print/task "
             "queues, level-order traversal"],
            ["Circular **linked list** application", "round-robin resource allocation"],
        ],
    },
    {
        "title": "Graph algorithms — complexity",
        "cols": ["Algorithm", "Purpose", "Complexity"],
        "rows": [
            ["BFS / DFS", "traversal", "`O(V + E)` with adjacency **list**; "
             "`O(V²)` with adjacency **matrix**"],
            ["Prim", "MST — grows **one tree**, vertex by vertex",
             "`O(V²)` matrix; `O(E log V)` with a binary heap"],
            ["Kruskal", "MST — grows a **forest**, cheapest edge first, skipping "
             "cycle-forming edges", "`O(E log E)` ≈ `O(E log V)` (dominated by the sort)"],
            ["Dijkstra", "**single-source** shortest path (greedy, no negative weights)",
             "`O(V²)` matrix; `O((V+E) log V)` with a heap"],
            ["Bellman–Ford", "single-source, **allows negative** weights", "`O(V·E)`"],
            ["Floyd–Warshall", "**all-pairs** shortest path (dynamic programming)", "`O(V³)`"],
            ["Connected components", "adjacency list", "`O(n + e)`"],
            ["Union–Find (with path compression)", "disjoint sets; used by **Kruskal** "
             "for cycle detection", "near `O(1)` amortised"],
            ["Degree of a vertex", "from an adjacency **matrix** — scan one row", "`O(n)`"],
        ],
    },
    {
        "title": "Graph facts the bank tests directly",
        "cols": ["Fact", "Detail"],
        "rows": [
            ["Prim vs Kruskal on distinct weights",
             "they produce the **same MST** — the MST is unique when all edge "
             "weights are distinct"],
            ["Kruskal's first steps", "sort edges in increasing weight and start "
             "from an **empty subgraph**. 'One vertex at a time' is **Prim's**"],
            ["Which to prefer", "Kruskal on **sparse** graphs; matrix-based Prim on "
             "**dense** graphs"],
            ["DFS vs BFS memory",
             "**DFS uses less** — bounded by depth, whereas BFS holds an entire "
             "frontier level"],
            ["Adjacency matrix cannot represent", "**parallel (multiple) edges**"],
            ["Bipartite iff", "the graph has **no odd-length cycle**"],
            ["Cost of a spanning tree", "the sum of **its own** edge weights only"],
        ],
    },
    {
        "title": "Array vs linked list",
        "note": "Asked as a trade-off far more often than as code.",
        "cols": ["Operation / property", "Array", "Linked list"],
        "rows": [
            ["Access by index", "**`O(1)`**", "`O(n)`"],
            ["Insert / delete at the front", "`O(n)`", "**`O(1)`**"],
            ["Insert / delete after a known node", "`O(n)` (shifting)", "**`O(1)`**"],
            ["Search (unsorted)", "`O(n)`", "`O(n)`"],
            ["Binary search", "**possible**", "not practical (no random access)"],
            ["Memory layout", "contiguous", "scattered + pointer overhead"],
            ["Size", "fixed at allocation", "grows and shrinks at run time"],
            ["Memory waste", "unused allocated slots", "one pointer per node"],
        ],
    },
]


# ==========================================================================
# WORKED METHODS, keyed by cluster id
# ==========================================================================

WORKED = {
    "counting": [
        {
            "title": "Choosing the right counting formula",
            "steps": [
                "Ask **does order matter?** 'Arrangements', 'words', 'rankings', "
                "'seating' → order matters. 'Committees', 'handshakes', "
                "'selections', 'subsets' → it does not.",
                "Ask **is repetition allowed?** Drawing with replacement, or "
                "digits/letters that may repeat → yes.",
                "Order matters + no repetition → `P(n,r) = n!/(n−r)!`. "
                "Order irrelevant + no repetition → `C(n,r) = n!/(r!(n−r)!)`. "
                "Order matters + repetition → `nʳ`. Neither → `C(n+r−1, r)`.",
                "If some items must **stay together**, glue them into one unit: "
                "arrange the `n − k + 1` units, then arrange the k glued items "
                "among themselves — multiply.",
                "If some items must be **separated**, count the total and "
                "subtract the together-case.",
            ],
            "example":
                "*'How many words can be formed from SIGNATURE so that the "
                "vowels always come together?'*\n\n"
                "SIGNATURE has 9 distinct letters; the vowels are I, A, U, E "
                "(4 of them), leaving 5 consonants.\n\n"
                "Glue the 4 vowels into one block. That leaves 5 consonants + "
                "1 block = **6 units**, arrangeable in `6! = 720` ways. The 4 "
                "vowels inside the block arrange in `4! = 24` ways.\n\n"
                "Total = `6! × 4!` = 720 × 24 = **17,280**.",
        },
    ],
    "recurrence": [
        {
            "title": "Solving a linear homogeneous recurrence",
            "steps": [
                "Write the relation as `aₙ − c₁aₙ₋₁ − c₂aₙ₋₂ = 0`.",
                "Form the **characteristic equation** by replacing `aₙ` with "
                "`r²`, `aₙ₋₁` with `r`, `aₙ₋₂` with `1`: `r² − c₁r − c₂ = 0`.",
                "Solve for the roots. **Distinct roots** r₁, r₂ → general "
                "solution `aₙ = A·r₁ⁿ + B·r₂ⁿ`. **Repeated root** r → "
                "`aₙ = (A + Bn)·rⁿ`.",
                "Substitute the given initial conditions to pin down A and B.",
                "For a **non-homogeneous** relation, solve the homogeneous part "
                "and add a particular solution guessed to match the forcing "
                "term (a polynomial for a polynomial, `k·cⁿ` for `cⁿ`).",
            ],
            "example":
                "*Solve `T(n) = 2T(n−1) + n` with `T(1) = 1`.*\n\n"
                "Homogeneous part `T(n) = 2T(n−1)` gives `C·2ⁿ`. The forcing "
                "term is the polynomial `n`, so guess a particular solution "
                "`an + b`. Substituting: `an + b = 2(a(n−1) + b) + n`, which "
                "gives `a = −1`, `b = −2` — so the particular part is `−n − 2`.\n\n"
                "General solution `T(n) = C·2ⁿ − n − 2`. Applying `T(1) = 1`: "
                "`2C − 3 = 1`, so `C = 2`.\n\n"
                "Answer: `T(n) = 2·2ⁿ − n − 2 = **2^(n+1) − n − 2**`.",
        },
        {
            "title": "Formulating a recurrence from a word problem",
            "steps": [
                "Define `aₙ` precisely — say what it counts, for a string or "
                "structure of size exactly n.",
                "Condition on the **last position** (the last digit, last "
                "letter, last move). Split into the cases that position can take.",
                "For each case, express the count of the remaining n−1 "
                "positions in terms of `aₙ₋₁` or its complement.",
                "Add the cases. Simplify using the total count of unrestricted "
                "strings, which is usually `kⁿ` for a k-symbol alphabet.",
            ],
            "example":
                "*Recurrence for the number of n-digit ternary sequences "
                "(digits 0,1,2) with an **even** number of 0s.*\n\n"
                "Let `aₙ` be that count. Look at the last digit.\n\n"
                "If it is **1 or 2** (2 choices), the first n−1 digits must "
                "still have an even number of 0s: `2aₙ₋₁`.\n\n"
                "If it is **0**, the first n−1 digits must have an **odd** "
                "number of 0s. The total number of ternary strings of length "
                "n−1 is `3^(n−1)`, so the odd count is `3^(n−1) − aₙ₋₁`.\n\n"
                "Adding: `aₙ = 2aₙ₋₁ + 3^(n−1) − aₙ₋₁` = **`aₙ₋₁ + 3^(n−1)`**.",
        },
    ],
    "graphs": [
        {
            "title": "Rank and nullity — telling them apart",
            "steps": [
                "Count `n` = vertices, `e` = edges, `k` = connected components.",
                "**Rank** `= n − k`. It counts *vertices*, so it is the "
                "spanning-forest edge count.",
                "**Nullity** (circuit rank, cyclomatic number) `= e − n + k`. "
                "It counts the *independent cycles* — the edges left over once "
                "a spanning forest is removed.",
                "Sanity check: rank + nullity = `e`. If your two numbers do not "
                "add to the edge count, one of them is wrong.",
            ],
            "example":
                "A graph with 7 vertices, 9 edges and 2 components.\n\n"
                "Rank `= n − k = 7 − 2 = 5`. Nullity `= e − n + k = 9 − 7 + 2 = 4`.\n\n"
                "Check: 5 + 4 = 9 = e. ✓",
        },
    ],
    "automata": [
        {
            "title": "NFA → DFA by subset construction",
            "steps": [
                "The DFA's states are **sets** of NFA states. Start from the "
                "ε-closure of the NFA start state.",
                "For each unprocessed DFA state (a set S) and each input symbol "
                "a, compute the union of `δ(q, a)` over all `q ∈ S`, then take "
                "the ε-closure of that union. That set is the next DFA state.",
                "Add any new set to the worklist. Repeat until no new sets appear.",
                "A DFA state is **accepting** if the set contains at least one "
                "NFA accepting state.",
                "For the *how many states* variant, you do not build anything: "
                "an NFA with `k` states has at most **`2ᵏ`** subsets, so the "
                "bound is `2ᵏ`. Count `k` carefully — if the stem says "
                "'k states **excluding** the start state', then k+1 is the total.",
            ],
            "example":
                "*An NFA has 4 states. What is the maximum number of DFA states?*\n\n"
                "`2⁴ = 16`. Note this is an upper bound — the reachable subset "
                "count is often far smaller, but the exam asks for the maximum.",
        },
    ],
    "arrays": [
        {
            "title": "Computing an element's address",
            "steps": [
                "Write down four things: **Base** address, element width **w**, "
                "the **lower bound(s)** of each dimension, and the number of "
                "**columns** (for row-major) or **rows** (for column-major).",
                "Normalise every index by subtracting its lower bound. This is "
                "the step that is skipped under time pressure and it is the one "
                "that costs the mark.",
                "Row-major (C, Pascal — rows stored end to end): "
                "`Base + w × [ (i − lb₁) × ncols + (j − lb₂) ]`.",
                "Column-major (FORTRAN — columns stored end to end): "
                "`Base + w × [ (j − lb₂) × nrows + (i − lb₁) ]`.",
                "Multiply by w only at the end, once you have the element offset.",
            ],
            "example":
                "*`A[5][4]` with lower bounds 1, base address 1000, w = 2 bytes, "
                "stored row-major. Find the address of `A[4][3]`.*\n\n"
                "Number of columns = 4. Normalised indices: `i − 1 = 3`, "
                "`j − 1 = 2`.\n\n"
                "Offset in elements `= 3 × 4 + 2 = 14`. Address "
                "`= 1000 + 2 × 14 = **1028**`.\n\n"
                "The same element column-major: rows = 5, offset "
                "`= 2 × 5 + 3 = 13`, address `= 1000 + 26 = 1026`.",
        },
    ],
    "stacks": [
        {
            "title": "Infix → postfix using a stack",
            "steps": [
                "Scan the infix expression left to right.",
                "**Operand** → append it straight to the output.",
                "**`(`** → push it. **`)`** → pop and output operators until the "
                "matching `(` is popped and discarded.",
                "**Operator** → while the operator on top of the stack has "
                "*higher or equal* precedence (for a left-associative operator), "
                "pop it to the output. Then push the new operator. For "
                "right-associative `^`, pop only on strictly higher precedence.",
                "At the end, pop everything remaining to the output.",
                "Precedence: `^` > `*` `/` > `+` `−`.",
            ],
            "example":
                "*Convert `(A + B) * (C − D)`.*\n\n"
                "`(` push · `A` output · `+` push · `B` output · `)` pop `+` → "
                "output now `AB+` · `*` push · `(` push · `C` output · `−` push · "
                "`D` output · `)` pop `−`.\n\n"
                "Output so far `AB+CD−`; finally pop `*`.\n\n"
                "Result: **`AB+CD−*`**",
        },
        {
            "title": "Infix → prefix (the order that trips people up)",
            "steps": [
                "**Reverse** the infix expression.",
                "**Swap every bracket**: each `(` becomes `)` and each `)` "
                "becomes `(`.",
                "Convert that modified expression to **postfix** by the usual method.",
                "**Reverse** the postfix result. That is the prefix form.",
                "The sequence is therefore: reverse → swap brackets → postfix → "
                "reverse. Options that put the bracket swap first are the standard trap.",
            ],
        },
        {
            "title": "Evaluating a postfix or prefix expression",
            "steps": [
                "**Postfix:** scan **left to right**. Push operands. On an "
                "operator, pop two operands — the *first* popped is the "
                "right-hand operand — apply, and push the result.",
                "**Prefix:** scan **right to left**. Push operands. On an "
                "operator, pop two — here the *first* popped is the **left**-hand "
                "operand — apply, and push.",
                "Getting the operand order backwards only matters for `−` and "
                "`/`; check those carefully.",
                "The single value left on the stack is the answer.",
            ],
            "example":
                "*Evaluate the prefix expression `* + 2 3 − 6 1`.*\n\n"
                "Scan right to left: push 1, push 6. Operator `−`: pop 6 (left), "
                "pop 1 (right) → `6 − 1 = 5`, push 5. Push 3, push 2. Operator "
                "`+`: pop 2, pop 3 → `2 + 3 = 5`, push 5. Operator `*`: pop 5, "
                "pop 5 → `25`.\n\n"
                "Answer: **25**",
        },
        {
            "title": "Parenthesis matching and peak stack depth",
            "steps": [
                "Push on every `(` and pop on every `)`; the expression is "
                "balanced iff you never pop an empty stack and the stack is "
                "empty at the end.",
                "For a 'maximum stack size' question, track the running depth: "
                "+1 per `(`, −1 per `)`.",
                "The answer is the **peak** the depth reaches, not the total "
                "number of brackets — that is the planted distractor.",
            ],
            "example":
                "*Peak stack depth while checking `(()(())(()))`.*\n\n"
                "Running depth: 1, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 0.\n\n"
                "Maximum reached is **3**, even though there are 6 opening brackets.",
        },
    ],
    "sorting": [
        {
            "title": "Tracing sorting passes (the 'after k passes' question)",
            "steps": [
                "**Bubble sort, ascending:** each pass walks the whole unsorted "
                "prefix comparing *adjacent* pairs and swapping when out of "
                "order. After pass k, the **k largest** elements are parked at "
                "the right end, in place.",
                "**Selection sort, ascending:** pass k scans the unsorted "
                "remainder for the **minimum** and swaps it into position k. "
                "After pass k, the **k smallest** are fixed at the left.",
                "**Insertion sort:** after pass k, the first `k + 1` elements "
                "are sorted **among themselves** but not necessarily in final "
                "position.",
                "To answer quickly: identify which end fills up, and how many "
                "elements are settled — then check that against the options "
                "before simulating the whole thing.",
                "Count of passes to sort n elements is `n − 1` for both bubble "
                "and selection.",
            ],
            "example":
                "*`42 29 75 11 65 58 60 18`, bubble sort ascending, after 2 passes.*\n\n"
                "Pass 1 bubbles the largest (75) to the end: "
                "`29 42 11 65 58 60 18 | 75`.\n\n"
                "Pass 2 bubbles the next largest (65) into place: "
                "`29 11 42 58 60 18 | 65 75`.\n\n"
                "Result: **`29 11 42 58 60 18 65 75`** — note the two largest "
                "are settled at the right, which alone eliminates most options.",
        },
    ],
    "trees3": [
        {
            "title": "Rebuilding a tree from two traversals",
            "steps": [
                "You need **inorder plus one of preorder/postorder**. Preorder "
                "with postorder alone does **not** determine a binary tree.",
                "**Preorder**: the *first* element is the root. **Postorder**: "
                "the *last* element is the root.",
                "Find that root inside the **inorder** sequence. Everything to "
                "its left is the left subtree; everything to its right is the "
                "right subtree.",
                "Split the other traversal into blocks of the same two sizes, "
                "and recurse on each half.",
                "Stop when a block has one element — that is a leaf.",
            ],
            "example":
                "*Inorder `D B E A F C`, postorder `D E B F C A`. Find the preorder.*\n\n"
                "Postorder's last element `A` is the root. In the inorder, "
                "`D B E` lies left of A and `F C` lies right — so those are the "
                "two subtrees.\n\n"
                "Left subtree: inorder `D B E`, postorder `D E B` → root `B`, "
                "with `D` left and `E` right. Right subtree: inorder `F C`, "
                "postorder `F C` → root `C` with `F` as its left child.\n\n"
                "Preorder (root, left, right) = **`A B D E C F`**",
        },
        {
            "title": "Spotting an impossible BST search path",
            "steps": [
                "Track a shrinking interval `(low, high)` as you walk the given "
                "sequence. Start with `(−∞, +∞)`.",
                "Each time you move to a **larger** value you have gone right, so "
                "`low` rises to the node you just left.",
                "Each time you move to a **smaller** value you have gone left, so "
                "`high` falls to the node you just left.",
                "The path is impossible the moment a node falls **outside** the "
                "current interval — a BST search could never reach it.",
            ],
            "example":
                "*Is `9, 85, 47, 68, 43, 57, 55` a valid BST search path for 55?*\n\n"
                "From 9 we go right to 85, so `low = 9`. From 85 we go left to 47, "
                "so `high = 85`. From 47 we go right to 68 → `low = 47`. From 68 "
                "we go left → `high = 68`. The interval is now `(47, 68)`.\n\n"
                "The next node is **43**, which is below the lower bound 47. "
                "Impossible — the search had already committed to values above 47.",
        },
        {
            "title": "Answering 'maximum nodes / minimum height' questions safely",
            "steps": [
                "First settle the **height convention**, because the two "
                "readings differ by one and the exam has used both.",
                "If height counts **levels** (a single node has height 1), then "
                "max nodes `= 2ʰ − 1`.",
                "If height counts **edges** (a single node has height 0), then "
                "max nodes `= 2^(h+1) − 1`.",
                "Use the options to disambiguate: for h = 10, `1023` means "
                "levels and `2047` means edges. Whichever appears tells you "
                "what the examiner intended.",
                "Minimum height for n nodes is `⌈log₂(n+1)⌉` levels — achieved "
                "by a complete tree.",
            ],
            "example":
                "*'A binary tree has height 10. Maximum number of nodes?'* with "
                "options 1000 / 1023 / 1024 / 1002.\n\n"
                "`1023 = 2¹⁰ − 1`, so the examiner is counting levels. Answer "
                "**1023**. Had 2047 been offered instead, the edge convention "
                "would have been intended.",
        },
    ],
    "heaps": [
        {
            "title": "Inserting into a heap (the 'array after insertion' question)",
            "steps": [
                "Append the new key at the **next free array slot** — the end of "
                "the array. The tree stays complete by construction.",
                "Compare it with its **parent**: index `⌊(i−1)/2⌋` if the array is "
                "0-based, `⌊i/2⌋` if 1-based. Check which convention the question "
                "uses before you start.",
                "In a **max**-heap, swap up while the new key is greater than its "
                "parent; in a min-heap, while it is smaller. This is *sift-up*.",
                "Stop as soon as the parent dominates, or you reach the root. "
                "At most `log₂ n` swaps.",
                "Read the final array left to right — that is the answer. Do not "
                "re-sort it; a heap is not a sorted array.",
            ],
            "example":
                "*Insert 35 into the max-heap `40, 30, 20, 10, 15, 16, 17, 8, 4` "
                "(0-based).*\n\n"
                "Append 35 at index 9. Parent = `⌊(9−1)/2⌋ = 4`, holding 15. "
                "35 > 15 → swap; 35 is now at index 4.\n\n"
                "Parent = `⌊(4−1)/2⌋ = 1`, holding 30. 35 > 30 → swap; 35 is now "
                "at index 1.\n\n"
                "Parent = index 0, holding 40. 35 < 40 → stop.\n\n"
                "Result: **`40, 35, 20, 10, 30, 16, 17, 8, 4, 15`**",
        },
    ],
    "queues": [
        {
            "title": "Circular queue conditions",
            "steps": [
                "Fix the array size `n` and remember that one slot is "
                "**sacrificed** so that full and empty can be told apart.",
                "Advance with modulo arithmetic on **both** pointers: "
                "`rear = (rear + 1) % n` on enqueue, `front = (front + 1) % n` "
                "on dequeue.",
                "**Full** when `(rear + 1) % n == front`. **Empty** when "
                "`front == rear`.",
                "Maximum elements actually storable is therefore **`n − 1`**, "
                "not n — this is the single most-asked point.",
                "Current element count is `(rear − front + n) % n`.",
                "The alternative convention keeps an explicit `count` variable, "
                "and then all n slots are usable. If a question says a count is "
                "maintained, the capacity is n.",
            ],
            "example":
                "*An array of size 8 is used as a circular queue with the "
                "sacrificed-slot method. How many elements can it hold?*\n\n"
                "**7**, not 8. With `front = 0`, enqueuing until "
                "`(rear + 1) % 8 == 0` stops at rear = 7, holding indices 0–6.",
        },
    ],
    "complexity": [
        {
            "title": "Reading complexity off a loop nest",
            "steps": [
                "A loop running `i` from 1 to n with a constant-work body is "
                "`O(n)`.",
                "Nested independent loops **multiply**: two nested n-loops give "
                "`O(n²)`. Sequential loops **add**, and the larger term wins.",
                "A loop whose counter is **multiplied or divided** each "
                "iteration (`i = i * 2`, `i = i / 2`) runs `O(log n)` times.",
                "An inner loop bounded by the outer counter — `for j = 1 to i` "
                "— gives `1 + 2 + … + n = n(n+1)/2`, which is `O(n²)`.",
                "Drop constants and lower-order terms: `3n² + 5n + 7` is `O(n²)`.",
                "For recursive code, write the recurrence and apply the master "
                "theorem: `T(n) = aT(n/b) + f(n)` compares `f(n)` against "
                "`n^(log_b a)`.",
            ],
            "example":
                "*`for (i = 1; i <= n; i++) for (j = 1; j <= n; j = j * 2) …`*\n\n"
                "The outer loop runs n times; the inner loop doubles j, so it "
                "runs `log₂ n` times. Total: **`O(n log n)`**.",
        },
    ],
    "sets": [
        {
            "title": "Checking relation properties fast",
            "steps": [
                "**Reflexive**: every `(a,a)` for a in the set must be present. "
                "One missing pair kills it.",
                "**Symmetric**: for every `(a,b)` present, `(b,a)` must also be "
                "present.",
                "**Antisymmetric**: if both `(a,b)` and `(b,a)` are present "
                "then `a` must equal `b`. A relation can be **neither** "
                "symmetric nor antisymmetric — that is a real option, not a trick.",
                "**Transitive**: for every `(a,b)` and `(b,c)`, check that "
                "`(a,c)` is present. Work through the pairs systematically; "
                "this is where mistakes happen.",
                "**Equivalence** = reflexive + symmetric + transitive. "
                "**Partial order** = reflexive + **anti**symmetric + transitive. "
                "The only difference is the middle word.",
            ],
            "example":
                "*`R = {(x,y), (x,z), (z,x), (z,y)}` on `{x, y, z}`.*\n\n"
                "Symmetric? `(x,y)` is present but `(y,x)` is not → **not "
                "symmetric**.\n\n"
                "Antisymmetric? Both `(x,z)` and `(z,x)` are present but "
                "`x ≠ z` → **not antisymmetric**.\n\n"
                "So it is **neither** — which is the keyed answer, and the "
                "option most candidates never consider.",
        },
    ],
}
