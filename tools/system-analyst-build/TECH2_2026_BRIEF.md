# Brief — classify and solve Technical Paper II (2026 syllabus) questions

You are processing real Mizoram PSC exam questions recovered from scanned MES /
Inspector of Legal Metrology / Junior Engineer papers, 2010–2023, so they can be
practised against the **new Technical Paper II syllabus** (ICT Department
notification of 30 July 2026).

**For most of these papers no official answer key exists.** Your answer becomes
the app's answer, shown to someone revising for a real exam that decides their
career. A confidently wrong answer teaches them something false. Accuracy
matters far more than speed, and honest hedging beats false certainty.

> **Correction, 2026-09-03 — this brief's original claim that NO official key
> exists for any of these papers was wrong.** Inspector of Legal Metrology,
> November 2023 **Paper II** is the paper transcribed as `cse_paper_2` in
> `staged/ilm2023-official-key.json` (MPSC Final Answer Key dated 8 March 2024).
> Established by answer agreement, not by the label: both solver passes over
> q41–70 agreed with that key 27/29 and 28/29, against 18–45% for every other
> pairing of these batches with either keyed paper. Per `tools/VERIFY_BRIEF.md`
> the official key is the **scoring authority even where it looks wrong**, so
> for those 29 questions the key supersedes the solver's answer and the
> solver's dissent is recorded as a `note` rather than as the answer. The
> November 2023 **Paper III** questions agree with neither key at better than
> chance (27% / 18%) and are genuinely unkeyed. If you are solving a fresh
> batch, still solve it honestly — do not try to guess the key — but do not
> assume your answer is final for a paper an official key covers.

Another solver is processing this same batch independently and will not see your
work. The two outputs get diffed; where you disagree, both answers are shown to
the reader rather than one being picked. So do **not** try to guess what the
other solver would say — just be right, and be honest about your uncertainty.

## Input

A JSON array. Each entry has:

- `id` — copy verbatim into your output.
- `question` — the stem. Blanks are runs of underscores.
- `options` — an array. **Index 0 is printed option (a), 1 is (b), 2 is (c),
  3 is (d).** Never reorder, never renumber.
- `hint_topic` — a short topic tag from the extraction pass. It is a *hint from
  an earlier automated pass, not ground truth* — it is sometimes wrong or
  misleadingly narrow. Use it as a starting point and overrule it when the
  question text says otherwise.
- `garbled: true` — the extractor flagged possible OCR damage. Read these
  especially carefully; see "Broken questions" below.
- `sitting`, `paper_no`, `no` — provenance, for your reference only.

## Output

A JSON array, one object per input question, **same order, ids copied verbatim**:

```json
[ { "id": "N0137", "unit": "1", "subtopic": "Classes, objects, member functions and memory allocation",
    "answerIndex": 1, "confidence": "high", "explanation": "...", "note": "" } ]
```

### `unit` and `subtopic` — where it sits in the 2026 syllabus

Pick exactly one unit, and one `subtopic` **copied character-for-character from
the list below**. A subtopic string that does not match exactly will fail the
import.

**Unit "1" — Object Oriented Programming (40 marks)**
- `OOP concepts, applications and the OOP process`
- `Classes, objects, member functions and memory allocation`
- `Constructors and destructors`
- `Polymorphism, function and operator overloading`
- `Inheritance, virtual functions and pointers to objects`
- `I/O streams and file handling in OOP`
- `Exception handling and strings`

**Unit "2" — Web Technologies (60 marks)**
- `Web architecture, client-server communication, HTTP/HTTPS, DNS and hosting`
- `HTML, semantic elements, forms, multimedia, Canvas, SVG and accessibility`
- `CSS, Flexbox, Grid and responsive web design`
- `JavaScript, the DOM, event handling, asynchronous programming, JSON and Fetch`
- `Frontend frameworks: components, routing, state management and API integration`
- `Backend development in PHP and Python: REST APIs, CRUD, middleware, auth, sessions and ORM`
- `Git version control, Docker, CI/CD, Linux administration, Nginx and deployment`
- `Web security: OWASP Top 10, SSL/TLS, CSRF, XSS and SQL injection prevention`
- `Architecture and scale: MVC, microservices, SOLID, event-driven systems, caching and queues`
- `AI-assisted web development, generative AI APIs, Model Context Protocol, analytics, ethics and law`

**Unit "3" — Database Management Systems (60 marks)**
- `Database system concepts, architecture, interfaces and data independence`
- `Data models and the relational model: keys, tuples, domains and relational algebra`
- `Entity-Relationship modelling`
- `SQL and basic query statements`
- `Database design, functional dependencies and normal forms`
- `Query processing and optimisation`
- `Transaction processing, schedules and recoverability`
- `Concurrency control, locking and time stamping`

**Unit "4" — Cloud Computing (40 marks)**
- `Distributed, edge and cloud computing; NIST cloud architecture`
- `Deployment and service models: IaaS, PaaS, SaaS and serverless`
- `Cloud-native architecture, microservices, service mesh, elasticity and load balancing`
- `Virtualization: virtual machines, hypervisors, and CPU/storage/network virtualization`
- `Containers, Docker, Kubernetes orchestration, Infrastructure as Code and DevOps`
- `Cloud storage, compute, networking, managed databases, monitoring and multi-cloud`
- `Cloud security and governance: shared responsibility, IAM, Zero Trust, DevSecOps, FinOps and SLAs`

**Unit `"OFF"` — off-syllabus.** Use this, with `subtopic: ""`, when the question
genuinely does not belong to any of the four units. **This is important and you
must not avoid it.** Known cases in this material:

- **Plain procedural C** with no OOP content — `FILE*` and `fopen`/`fseek`/
  `fprintf` on C streams, storage classes, `union`, bitwise operators, sign
  bits, `sizeof`, `printf` format output, C string library functions. Unit 1 is
  *Object Oriented* Programming and its syllabus text is C++-shaped (classes,
  constructors, operator overloading, `ifstream`/`ofstream`). A question about
  the C `FILE` pointer is not an OOP question.
  - But do NOT reflexively send all file questions to `OFF`: C++ stream classes
    (`ifstream`, `ofstream`, `cin`, `cout`, file modes, `eof()`) ARE unit 1's
    "I/O streams and file handling in OOP".
- **Java-specific** trivia (bytecode, autoboxing, `RandomAccessFile`) where the
  point is a Java library detail rather than a general OOP principle. Judge on
  the substance: "what does inheritance mean" phrased with Java syntax is unit 1;
  "which Java class does X" is `OFF`.
- **Distributed databases, data warehousing, business intelligence** — the 2026
  DBMS unit stops at concurrency control and covers none of these.
- **Compiler/language-implementation** trivia (machine dependence of compilers).

Getting `OFF` right is as valuable as getting an answer right: a misfiled
question inflates a unit's apparent coverage and sends the reader to revise the
wrong topic.

### `answerIndex`

0-based, indexing `options` exactly as given. **Never reorder the options.**

### `confidence` — `"high"` | `"medium"` | `"low"`

Be honest; this drives a visible badge, and an inflated rating misleads.

- `high` — a standard, settled fact you are sure of.
- `medium` — you are fairly sure but the phrasing is loose, or two options are
  arguably defensible and you are choosing the better one.
- `low` — the printed options are defective, no option is really correct, the
  question depends on a figure or code block the OCR did not capture, or two
  answers are equally defensible.

Do not inflate to `high`. A `medium` that is right is worth far more than a
`high` that is wrong.

### `explanation` — 1–3 sentences

- Lead with the fact that makes the answer correct.
- Where a distractor is a classic trap, say why it is wrong. For key/normal-form
  and constructor/destructor questions especially, the near-miss option is
  usually the whole point.
- Do **not** begin with "The correct answer is (b)" — the UI already highlights
  the right option.
- For anything with working — a normal-form decomposition, a functional-
  dependency closure, predicting the output of a code fragment — **show the
  working**, not just the result.
- Never write an explanation that contradicts your own `answerIndex`. Check each
  one before you finish.

### `note` — usually `""`

Use it to name a specific defect or ambiguity in one short sentence: a
duplicated option, a missing code block, a stem that could be read two ways, an
answer that depends on a compiler detail. This is shown to the reader as a
caveat.

## Broken questions

These are scans of decades-old printed papers. They contain genuine printing
errors and OCR damage: duplicated options, mangled operators (`>` for `→`),
lost superscripts, code fragments that never made it into the text, and
occasionally no correct answer at all.

When a question is broken: pick the closest option, set `confidence: "low"`, say
plainly in the `explanation` what is wrong with it, and describe the defect in
`note`. **Do not pretend a broken question is fine, and do not silently invent
the missing code or table.** If a question is unanswerable as printed, say so —
that is a useful, honest result.

## Rules

1. Every input question appears exactly once in your output, in the same order.
   Count them before you finish.
2. Do not fabricate. If you cannot verify something, hedge in the explanation
   and drop the confidence.
3. Return **only** the JSON array — no prose before or after, no markdown fence.
