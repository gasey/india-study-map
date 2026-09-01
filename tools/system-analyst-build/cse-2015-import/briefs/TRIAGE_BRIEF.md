# Triage brief — which paper does this question belong to?

You are routing real Mizoram PSC Computer Science questions against the
**2026 Informatics Officer / System Analyst syllabus**. You are NOT answering
them. Label only.

## The target: Technical Subject Paper I (200 marks)

Only these four units are Paper I. Label a question `TECH1` **only** if it
falls in one of them:

- **unit 1 — Discrete Mathematics (40m).** Set theory, mappings (bijective /
  surjective / injective), relations, equivalence, posets, lattices,
  mathematical induction, propositional logic, logical equivalence,
  permutation & combination, generating functions, recurrence relations,
  graph theory (subgraphs, cyclic graphs), trees, spanning trees, graph
  algorithms *as theory* (Kruskal, Prim, Dijkstra, Floyd, Warshall, DFS, BFS),
  isomorphism/homomorphism of graphs, finite automata (NFA/DFA construction &
  conversion, state minimisation, Mealy/Moore machines), grammars (Chomsky
  type 0/1/2/3), regular expressions, Turing machines, pushdown automata,
  fuzzy sets. Also group theory / Boolean algebra as abstract algebra.
- **unit 2 — Computer Architecture and Organization (40m).** Functional units,
  computer registers, register transfer, micro-operations, bus systems, timing
  and control signals, instruction cycle, machine & assembly language,
  assembler, subroutines, control unit (hardwired & microprogrammed), signed
  magnitude, floating point, BCD, binary arithmetic (add/sub/mul/div),
  general register & stack organisation, instruction formats, addressing modes,
  RISC, I/O organisation, peripherals, interfacing, modes of I/O transfer,
  interrupts, DMA, memory hierarchy, main memory, cache, virtual memory *as
  hardware*, pipelining, vector and parallel processing. Also digital logic
  (gates, flip-flops, K-maps, multiplexers, adders) — it feeds this unit.
- **unit 3 — Data Structures and Algorithms (60m).** Arrays, strings, packing,
  algorithm development, complexity / asymptotic analysis, recursion,
  sequential search, binary search, divide and conquer, selection / insertion /
  merge / quick / heap sort, complexity of sorting, linear lists, stacks,
  postfix notation, arithmetic expression evaluation, queues, priority queues,
  dequeues, UNION-FIND / disjoint sets, graph algorithms *as implementations*,
  optimisation, greedy method, minimum spanning tree, shortest path, trees,
  AVL trees, threaded trees, B-trees, external search, hashing.
- **unit 4 — Operating System (60m).** OS objectives and functions, evolution,
  batch / interactive / time-sharing / real-time, protection, OS structure and
  system components, system calls and services, concurrent processes, process
  concept, concurrency, producer/consumer, critical section, semaphores,
  classical concurrency problems, IPC, process generation and scheduling, CPU
  scheduling and algorithms, multiprocessor scheduling, deadlocks (model,
  characterisation, prevention, avoidance, detection, recovery), memory
  management, resident monitor, multiprogramming with fixed/variable
  partitions, paging, segmentation, virtual memory, demand paging, page
  replacement, allocation of frames, thrashing, cache organisation impact on
  performance, I/O management, disk scheduling, I/O buffering, file systems,
  file organisation and access, directories.

## Everything else

- `TECH2` — object-oriented programming (C++/classes/inheritance/polymorphism/
  operator overloading/exception handling), web technologies, HTML/CSS/JS,
  DBMS / SQL / ER models / normalisation / transactions, cloud computing.
- `TECH3` — computer networks, OSI/TCP-IP, routing, software engineering /
  SDLC / testing, artificial intelligence & machine learning, cyber security.
- `NONE` — matches no paper in this syllabus. Common in these sources:
  electrical circuit theory (RLC, Thevenin, two-port networks, three-phase
  power), computer graphics (Bresenham, Bezier, pixels, frame buffer,
  transformations), generic computer literacy / MS Office, and anything else
  off-syllabus.

## Boundary calls that matter

- **Graph algorithms** appear in both unit 1 and unit 3. If the question is
  about the *mathematics* (does an Euler circuit exist, chromatic number,
  isomorphism, counting edges) → unit 1. If it is about *running or costing an
  implementation* (time complexity of Dijkstra with an adjacency list, which
  data structure a heap-based Prim needs) → unit 3.
- **Virtual memory / cache** appear in units 2 and 4. Hardware framing
  (cache mapping, memory hierarchy latency, TLB as hardware) → unit 2.
  OS-policy framing (page replacement algorithm, thrashing, frame allocation,
  demand paging) → unit 4.
- **Boolean algebra / digital logic** → unit 2, unless the question is clearly
  abstract algebra (lattices, group axioms) → unit 1.
- **Complexity / Big-O** → unit 3.
- C or C++ *syntax/output-prediction* questions → TECH2, not unit 3, even when
  the code manipulates an array. But a question about what an algorithm *does*
  or costs → unit 3.

## OCR damage

These come from scanned papers. Mathematical symbols are frequently mangled —
`A>B` for `A→B`, `AUB` for `A∪B`, `ANB` for `A∩B`, `` for `∈`, `p  q` for
`p → q`, `` for `¬`. If a question's meaning is still recoverable, label it
normally and set `"garbled": true`. If the damage makes the question
unusable, set `"garbled": true` and still give your best label.

Do not "fix" anything — you are only labelling.

## Output

Return **only** a JSON array, one object per input question, same order, ids
copied verbatim:

```json
[{"id":"N0000","paper":"TECH1","unit":"1","sub":"Sets, mappings and relations","garbled":true}]
```

- `paper` — one of `TECH1` `TECH2` `TECH3` `NONE`.
- `unit` — `"1"`–`"4"` when paper is TECH1; otherwise `""`.
- `sub` — a short topic name in your own words (e.g. "Page replacement",
  "Addressing modes", "AVL trees"). Keep it under 40 characters.
- `garbled` — boolean, as described above.

Every input id must appear exactly once. Count before you return.
