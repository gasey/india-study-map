window.MPSC.units.push({
  id: 'p4u2',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Database Management Systems',
  marks: 40,
  syllabus: 'Database Applications; Evolution of DB & DBMS; Need for data management, Data models & Database Architecture; E-R Diagrams, Relational Model; E-R to Relational Mapping; Constraints, Keys, Dependencies; Normalization - First, Second, Third & Fourth Normal Forms; BCNF; Introduction to SQL; MySQL, SQLite; Unix Timestamp Data Constraints; Triggers; Database Security; Introduction to Transactions, System & Media Recovery, Two phase Commit Protocol.',

  notes: [
    {
      h: 'Why DBMS carries 40 marks in a Cyber Forensics paper',
      b: '<p>At first glance, classical database theory seems distant from crime scenes — until you notice <b>SQLite</b> and <b>Unix Timestamp</b> explicitly written into the MPSC syllabus. Nearly every digital artefact recovered from a smartphone or desktop browser is stored inside a <b>SQLite database</b>: WhatsApp (<code>msgstore.db</code>, <code>wa.db</code>), Android SMS/MMS (<code>mmssms.db</code>), iOS Messages (<code>sms.db</code>), Call Logs (<code>calllog.db</code> / <code>CallHistory.storedata</code>), Chrome/Firefox History (<code>History</code>, <code>places.sqlite</code>), and Location caches.</p>' +
         '<p>Therefore, treat Unit II as two tightly linked pillars: (1) <b>Classical Relational & Transaction Theory</b> (ER models, keys, functional dependencies, 1NF–4NF/BCNF, SQL, ACID, 2PC, recovery — high-scoring, deterministic questions) and (2) <b>Forensic Database Analysis</b> (SQLite internal page structure, freelist carving, `-wal` write-ahead logs, epoch timestamp conversions, triggers for audit trails, and SQL injection forensics).</p>'
    },
    {
      h: 'Evolution of DB & DBMS, and why a DBMS exists at all',
      b: '<div class="analogy"><b>💡 Analogy — Shared Notebooks vs a Central Evidence Vault:</b> A <b>traditional file-based system</b> is like five police officers each keeping their own private Excel spreadsheet of suspects on their laptops. When a suspect\'s phone number changes, Officer A updates her sheet, while Officers B, C, and D still hold the old number (<b>data redundancy &amp; inconsistency</b>). If two officers edit a file on a shared folder at the same instant, one overwrites the other (<b>concurrency anomaly</b>). A <b>DBMS</b> replaces those scattered notebooks with a single, centrally guarded, rule-enforcing Evidence Vault!</div>' +
         '<table>' +
         '<tr><th>Era</th><th>Data Model / Generation</th><th>Structure &amp; Access Style</th><th>Primary Limitation</th></tr>' +
         '<tr><td>1950s–60s</td><td><b>Flat File Systems</b> (Magnetic tape / COBOL)</td><td>Application-specific sequential/indexed files</td><td>Severe data duplication, program-data dependence, no ad-hoc queries</td></tr>' +
         '<tr><td>Late 1960s</td><td><b>Hierarchical Model</b> (IBM IMS)</td><td><b>Tree structure</b> (1:N parent-child; each child has <em>at most one parent</em>)</td><td>Cannot represent M:N relationships without duplicating records; navigational</td></tr>' +
         '<tr><td>1969</td><td><b>Network Model</b> (CODASYL DBTG)</td><td><b>Directed Graph</b> (owner-member sets; a child can have <em>multiple parents</em>)</td><td>Complex pointer chains; programmer must navigate physical access paths manually</td></tr>' +
         '<tr><td>1970</td><td><b>Relational Model</b> (E. F. Codd)</td><td><b>2D Relations (Tables)</b> of tuples and attributes</td><td>Declarative access (SQL states <em>what</em> to fetch, not <em>how</em>); struggle with massive unstructured scale</td></tr>' +
         '<tr><td>2000s+</td><td><b>NoSQL / NewSQL</b> (MongoDB, Redis, Neo4j)</td><td>Document, Key-Value, Wide-Column, Graph</td><td>Often trades strict ACID serializability for BASE / eventual consistency</td></tr>' +
         '</table>' +
         '<p><b>Five textbook reasons why a DBMS replaced file-based systems ("Need for data management"):</b></p>' +
         '<ol>' +
         '<li><b>Controlling Data Redundancy &amp; Inconsistency:</b> facts are stored once (normalised), preventing contradictory copies.</li>' +
         '<li><b>Program-Data Independence:</b> changing disk storage or adding a column does not force rewriting application code.</li>' +
         '<li><b>Centralised Integrity Constraints:</b> domain types, NOT NULL, primary keys, and foreign keys are enforced by the engine, not left to application bugs.</li>' +
         '<li><b>Concurrent Access &amp; Atomicity:</b> multi-user locking/MVCC prevents lost updates and half-written crashes.</li>' +
         '<li><b>Fine-Grained Security &amp; Backup/Recovery:</b> role/view-based `GRANT`/`REVOKE` and automated WAL crash recovery.</li>' +
         '</ol>'
    },
    {
      h: 'Database architecture and data models (ANSI-SPARC)',
      b: '<div class="stack-diagram">' +
         '<div class="stack-layer"><b>External / View Level (View 1, View 2, …)</b><span>What individual users see (e.g., a receptionist view hiding salary columns)</span></div>' +
         '<div class="stack-layer"><b>↕ Logical Data Independence</b><span>Modify conceptual schema (add table/column) without breaking external user views</span></div>' +
         '<div class="stack-layer"><b>Conceptual / Logical Level</b><span>Community-wide blueprint: all entities, data types, relationships, and constraints</span></div>' +
         '<div class="stack-layer"><b>↕ Physical Data Independence</b><span>Modify internal storage (add B+ tree index, move datafile, change compression) without touching conceptual schema</span></div>' +
         '<div class="stack-layer"><b>Internal / Physical Level</b><span>Low-level byte layout: B-tree pages, hash buckets, block offsets, encryption on disk</span></div>' +
         '</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Schema vs Instance:</b><br>' +
         '• <b>Database Schema (Intension):</b> the structural blueprint/skeleton of the database (table definitions, column names, constraints) — changes very rarely.<br>' +
         '• <b>Database Instance / State (Extension):</b> the actual snapshot of rows/tuples sitting inside the tables at a specific moment in time — changes with every `INSERT`, `UPDATE`, or `DELETE`.<br>' +
         '• <b>Logical Data Independence is harder to achieve</b> than Physical Data Independence because application queries are tightly coupled to table/column definitions.</div>'
    },
    {
      h: 'E-R Diagrams and E-R to Relational Mapping',
      b: '<p><b>Chen E-R Notation Symbols (Frequently Tested!):</b></p>' +
         '<ul>' +
         '<li><b>Rectangle:</b> Strong Entity Set &nbsp;|&nbsp; <b>Double Rectangle:</b> Weak Entity Set (depends on an identifying owner entity).</li>' +
         '<li><b>Diamond:</b> Relationship Set &nbsp;|&nbsp; <b>Double Diamond:</b> Identifying Relationship (links a weak entity to its owner).</li>' +
         '<li><b>Ellipse:</b> Attribute &nbsp;|&nbsp; <b>Double Ellipse:</b> Multi-valued attribute (e.g., `Phone_Numbers`) &nbsp;|&nbsp; <b>Dashed Ellipse:</b> Derived attribute (e.g., `Age` computed from `DOB`).</li>' +
         '<li><b>Solid Underlined Attribute:</b> Primary Key &nbsp;|&nbsp; <b>Dashed Underlined Attribute:</b> Partial Key (Discriminator) of a weak entity.</li>' +
         '<li><b>Single Line:</b> Partial Participation (optional) &nbsp;|&nbsp; <b>Double Line:</b> Total Participation (mandatory — every entity in the set must participate at least once, which is always true for a weak entity).</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Formula — Minimum Number of Relational Tables Required for an E-R Diagram:</b><br>' +
         'Suppose Strong Entities $E_1$ (key $A_1$) and $E_2$ (key $A_2$) are connected by a relationship $R$:<br>' +
         '1. <b>M:N (Many-to-Many) relationship:</b> Always requires <b>3 tables</b> ($E_1$, $E_2$, and a separate junction table $R$ with composite primary key $(A_1, A_2)$).<br>' +
         '2. <b>1:N (One-to-Many) relationship:</b> Requires <b>2 tables</b>! Post the primary key of the "1" side as a Foreign Key into the table of the <b>"N" (Many) side</b> (merging $R$ into the Many side).<br>' +
         '3. <b>1:1 relationship with Partial Participation on both sides:</b> Requires <b>2 tables</b> (post FK into either side).<br>' +
         '4. <b>1:1 relationship with Total Participation on one side:</b> Can be merged into <b>1 table</b> (or kept as 2 tables with FK on the total side).<br>' +
         '5. <b>1:1 relationship with Total Participation on BOTH sides:</b> Can be merged into just <b>1 single table</b>!<br>' +
         '6. <b>Multi-valued attribute (double ellipse):</b> Always requires <b>1 extra separate table</b> with $(PK_{\\text{entity}}, \\text{MultiValue})$ as its composite primary key.</div>'
    },
    {
      h: 'Keys and Functional Dependencies',
      b: '<div class="analogy"><b>💡 Analogy — Super Key vs Candidate Key vs Primary Key:</b> Imagine identifying a citizen in India. <code>{Aadhaar_No}</code> uniquely identifies a citizen, and <code>{PAN_No}</code> also uniquely identifies a citizen. Both are minimal — remove anything and they are empty — so both are <b>Candidate Keys</b>. If someone uses <code>{Aadhaar_No, Favourite_Colour, Shoe_Size}</code>, that combination still uniquely identifies the person, but it contains redundant baggage — so it is a <b>Super Key</b>, not a Candidate Key! When the database designer picks <code>{Aadhaar_No}</code> as the official main key (and enforces <code>NOT NULL</code>), it becomes the <b>Primary Key</b>, while the unselected candidate key <code>{PAN_No}</code> is called an <b>Alternate Key</b>.</div>' +
         '<ul>' +
         '<li><b>Super Key $\\supseteq$ Candidate Key $\\supseteq$ Primary Key:</b> Every Primary Key is a Candidate Key, and every Candidate Key is a Super Key (the converse is false).</li>' +
         '<li><b>Prime Attribute:</b> any attribute that is a member of <em>at least one</em> Candidate Key. <b>Non-Prime Attribute:</b> an attribute that does not belong to any Candidate Key.</li>' +
         '<li><b>Attribute Closure ($X^+$):</b> the set of all attributes functionally determined by $X$ using Armstrong\'s Axioms (<em>Reflexivity</em>, <em>Augmentation</em>, <em>Transitivity</em>). <b>$X$ is a Super Key of $R$ if and only if $X^+$ contains all attributes of $R$!</b></li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Example — Finding All Candidate Keys &amp; Counting Super Keys:</b><br>' +
         'Given relation $R(A, B, C, D, E)$ with Functional Dependencies: $AB \\to C$, $C \\to D$, $D \\to B$, $D \\to E$.<br>' +
         '• <b>Step 1 (Find essential attributes):</b> Notice attribute $A$ never appears on the Right-Hand Side (RHS) of any FD! Therefore, <b>$A$ MUST be part of every candidate key</b>.<br>' +
         '• <b>Step 2 (Check closure of $A$):</b> $A^+ = \\{A\\} \\neq R$, so $A$ alone is not a key.<br>' +
         '• <b>Step 3 (Try 2-attribute combinations with $A$):</b><br>' +
         '  – $(AB)^+ = \\{A, B, C, D, E\\} = R \\Rightarrow$ <b>$AB$ is a Candidate Key!</b><br>' +
         '  – Since $C \\to D$ and $D \\to B$, test $(AC)^+ = \\{A, C, D, B, E\\} = R \\Rightarrow$ <b>$AC$ is a Candidate Key!</b><br>' +
         '  – Since $D \\to B$, test $(AD)^+ = \\{A, D, B, C, E\\} = R \\Rightarrow$ <b>$AD$ is a Candidate Key!</b><br>' +
         '• <b>Prime attributes:</b> $\\{A, B, C, D\\}$. <b>Non-prime attribute:</b> $\\{E\\}$.<br>' +
         '• <b>Bonus Shortcut (Counting Super Keys):</b> If a relation with $n$ attributes has a <em>single</em> Candidate Key containing $k$ attributes, the total number of Super Keys is $2^{n - k}$!</div>'
    },
    {
      h: 'Normalisation (1NF, 2NF, 3NF, BCNF, 4NF)',
      b: '<p>Normalisation decomposes tables with redundant data to eliminate <b>Insertion, Deletion, and Update Anomalies</b> while striving for two decomposition properties: <b>1. Lossless-Join Decomposition</b> (mandatory — natural join of projections recovers exact original rows with zero spurious tuples) and <b>2. Dependency Preservation</b> (desirable — all FDs can be checked without joining tables).</p>' +
         '<div class="diagram"><div class="diag-title">The Normalisation Hierarchy (Strict Subset Ladder: 4NF ⊂ BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF)</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>1NF</b><small>Atomic values only (no multi-valued cells)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>2NF</b><small>No Partial FD (Non-prime on part of CK)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>3NF</b><small>No Transitive FD (X is SK, or Y is Prime)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>BCNF</b><small>Every determinant X is a Super Key</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>4NF</b><small>No Multi-Valued Dependency X ↠ Y</small></div>' +
         '</div></div>' +
         '<table>' +
         '<tr><th>Normal Form</th><th>Formal Test Condition (for every non-trivial FD $X \\to Y$)</th><th>Helpful Exam Shortcut</th></tr>' +
         '<tr><td><b>1NF</b></td><td>Every attribute holds only atomic (indivisible) scalar values</td><td>Disallows nested tables, arrays, or comma-separated lists in a single cell.</td></tr>' +
         '<tr><td><b>2NF</b></td><td>In 1NF + no <b>non-prime attribute</b> is partially dependent on a proper subset of any candidate key</td><td><b>If every Candidate Key is a single attribute, a 1NF table is AUTOMATICALLY in 2NF!</b></td></tr>' +
         '<tr><td><b>3NF</b></td><td>In 2NF + for every $X \\to Y$, either <b>$X$ is a Super Key</b> OR <b>$Y$ is a Prime Attribute</b></td><td>Always admits a decomposition that is <b>both Lossless-Join AND Dependency-Preserving</b>.</td></tr>' +
         '<tr><td><b>BCNF</b></td><td>For every non-trivial $X \\to Y$, <b>$X$ MUST be a Super Key</b> (no exception for prime $Y$!)</td><td>Always Lossless-Join, but <b>not always Dependency-Preserving</b>! If a table has only 2 attributes, it is automatically in BCNF.</td></tr>' +
         '<tr><td><b>4NF</b></td><td>In BCNF + for every non-trivial Multi-Valued Dependency $X \\twoheadrightarrow Y$, $X$ is a Super Key</td><td>Arises when a table mixes two independent $1:N$ multi-valued facts (e.g., `Officer ↠ Skill` and `Officer ↠ Language`).</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Step-by-Step Normalisation Walkthrough:</b><br>' +
         'Consider `CaseEvidence(CaseID, ExhibitNo, OfficerID, OfficerDept, SuspectPhoneNumbers)` with key `(CaseID, ExhibitNo)` and FDs: `CaseID, ExhibitNo → OfficerID`; `CaseID → OfficerDept`; `OfficerID → OfficerDept`.<br>' +
         '1. <b>1NF Violation:</b> `SuspectPhoneNumbers` holds multiple phone numbers in one cell. Split multi-valued phones into `CasePhones(CaseID, ExhibitNo, Phone)` $\\Rightarrow$ <b>Now in 1NF</b>.<br>' +
         '2. <b>2NF Violation:</b> `CaseID → OfficerDept` has non-prime `OfficerDept` depending on only <em>part</em> of the composite key `(CaseID, ExhibitNo)` (a <b>partial dependency</b>). Split into `Cases(CaseID, OfficerDept)` and `Exhibits(CaseID, ExhibitNo, OfficerID)` $\\Rightarrow$ <b>Now in 2NF</b>.<br>' +
         '3. <b>3NF Violation:</b> Inside `Exhibits(CaseID, ExhibitNo, OfficerID, OfficerDept)`, `OfficerID → OfficerDept` has non-prime `OfficerDept` depending on non-prime `OfficerID` (a <b>transitive dependency</b>). Split into `Officers(OfficerID, OfficerDept)` and `Exhibits(CaseID, ExhibitNo, OfficerID)` $\\Rightarrow$ <b>Now in 3NF &amp; BCNF</b>!<br>' +
         '4. <b>Lossless-Join Check ($R_1 \\cap R_2$ rule):</b> A decomposition of $R$ into $R_1$ and $R_2$ is lossless if and only if $(R_1 \\cap R_2) \\to R_1$ or $(R_1 \\cap R_2) \\to R_2$ (i.e., the common attribute is a key of at least one sub-table). Here, `Exhibits` $\\cap$ `Officers` $= \\{\\text{OfficerID}\\}$, which is the primary key of `Officers` — hence <b>Lossless</b>!</div>'
    },
    {
      h: 'Relational model: integrity constraints and relational algebra',
      b: '<ul>' +
         '<li><b>Domain Constraint:</b> attribute values must be atomic and belong to the declared data type/domain.</li>' +
         '<li><b>Entity Integrity Constraint:</b> no attribute participating in the <b>Primary Key</b> may be `NULL` (because if a key is `NULL`, we cannot uniquely identify the tuple!). Note: a `UNIQUE` key in SQL <em>can</em> allow `NULL`s, whereas `PRIMARY KEY` never can.</li>' +
         '<li><b>Referential Integrity Constraint:</b> if table $R_2$ has a Foreign Key referencing Primary Key $PK$ of $R_1$, then every value of the Foreign Key in $R_2$ must either match an existing $PK$ value in $R_1$ or be <b>wholly `NULL`</b> (if optional). Actions on delete/update of parent: `RESTRICT`/`NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT`.</li>' +
         '</ul>' +
         '<table>' +
         '<tr><th>Relational Algebra Operator</th><th>Symbol</th><th>Action &amp; Cardinality Notes</th></tr>' +
         '<tr><td><b>Selection</b> (Horizontal filter)</td><td>$\\sigma_{\\text{condition}}(R)$</td><td>Filters <b>rows (tuples)</b> satisfying predicate; degree (columns) stays identical; $0 \\le |\\sigma(R)| \\le |R|$. Commutative!</td></tr>' +
         '<tr><td><b>Projection</b> (Vertical filter)</td><td>$\\pi_{A_1, A_2}(R)$</td><td>Selects specified <b>columns (attributes)</b> and <b>automatically eliminates duplicate rows</b> (unlike SQL `SELECT`, which keeps duplicates unless `DISTINCT` is written!).</td></tr>' +
         '<tr><td><b>Cartesian Product</b></td><td>$R \\times S$</td><td>Pairs every row of $R$ ($m$ rows, $c_1$ cols) with every row of $S$ ($n$ rows, $c_2$ cols) $\\Rightarrow$ <b>$m \\times n$ rows</b> and <b>$c_1 + c_2$ columns</b>.</td></tr>' +
         '<tr><td><b>Natural Join</b></td><td>$R \\bowtie S$</td><td>Equates all common attribute names and drops duplicate columns. If $R$ and $S$ share no attributes, $R \\bowtie S = R \\times S$.</td></tr>' +
         '<tr><td><b>Set Operations</b></td><td>$R \\cup S,\\; R \\cap S,\\; R - S$</td><td>Require $R$ and $S$ to be <b>union-compatible</b> (same number of attributes and compatible corresponding domains).</td></tr>' +
         '<tr><td><b>Division</b></td><td>$R \\div S$</td><td>Finds values in $R$ associated with <b>EVERY ("FOR ALL")</b> tuple in $S$ (e.g., "Find suspects who visited <em>all</em> crime scenes listed in $S$").</td></tr>' +
         '</table>' +
         '<div class="tip"><b>⚠️ Classic Exam Trap:</b> The six <b>fundamental (primitive)</b> operators of Relational Algebra are $\\sigma, \\pi, \\cup, -, \\times, \\rho$. Operators like <b>Intersection ($\\cap$), Join ($\\bowtie$), and Division ($\\div$) are DERIVED operators</b> because $R \\cap S = R - (R - S)$ and $R \\bowtie_c S = \\sigma_c(R \\times S)$!</div>'
    },
    {
      h: 'Introduction to SQL: DDL, DML, DCL, TCL, Joins & NULL Logic',
      b: '<table>' +
         '<tr><th>Sub-language</th><th>Commands</th><th>Key Exam Properties</th></tr>' +
         '<tr><td><b>DDL</b> (Data Definition)</td><td><code>CREATE, ALTER, DROP, TRUNCATE, RENAME</code></td><td>Modifies schema catalog; <b>auto-commits</b> in most RDBMSs.</td></tr>' +
         '<tr><td><b>DML</b> (Data Manipulation)</td><td><code>SELECT (DQL), INSERT, UPDATE, DELETE</code></td><td>Operates on row data; changes can be `ROLLBACK`-ed before commit.</td></tr>' +
         '<tr><td><b>DCL</b> (Data Control)</td><td><code>GRANT, REVOKE</code></td><td>Manages privileges and access control (`WITH GRANT OPTION`).</td></tr>' +
         '<tr><td><b>TCL</b> (Transaction Control)</td><td><code>COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION</code></td><td>Controls atomic boundaries and savepoints.</td></tr>' +
         '</table>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>DELETE vs TRUNCATE vs DROP</h4><p>• <b>DELETE (DML):</b> removes rows one-by-one, supports `WHERE`, fires `DELETE` triggers, writes full row undo logs (can `ROLLBACK`), keeps table &amp; indexes.<br>• <b>TRUNCATE (DDL):</b> deallocates all data pages at once, <b>no `WHERE` clause</b>, resets auto-increment, minimal logging, keeps empty table structure.<br>• <b>DROP (DDL):</b> deletes all rows <b>AND completely removes the table definition, indexes, and triggers</b> from the catalog.</p></div>' +
         '<div class="vs-card"><h4>WHERE vs HAVING &amp; NULL Logic</h4><p>• <b>Evaluation Order:</b> `FROM` $\\to$ `JOIN` $\\to$ `WHERE` $\\to$ `GROUP BY` $\\to$ `HAVING` $\\to$ `SELECT` $\\to$ `DISTINCT` $\\to$ `ORDER BY` $\\to$ `LIMIT`.<br>• `WHERE` filters individual rows <em>before</em> grouping (cannot contain aggregates like `COUNT(*)`); `HAVING` filters groups <em>after</em> `GROUP BY`.<br>• <b>SQL `NULL` is UNKNOWN:</b> `NULL = NULL` and `NULL <> NULL` both evaluate to <b>UNKNOWN (falsy)</b>! Always use `IS NULL` / `IS NOT NULL`. Aggregate functions (`SUM, AVG, MIN, MAX, COUNT(col)`) <b>ignore `NULL` values</b>, except <b>`COUNT(*)` which counts all rows including `NULL`s</b>!</p></div>' +
         '</div>' +
         '<div class="example"><b>🔬 Worked Example — Counting Output Rows for INNER, LEFT, RIGHT &amp; FULL Joins:</b><br>' +
         'Suppose Table $R(A)$ has 4 rows: <code>1, 2, 2, 3</code> and Table $S(A)$ has 3 rows: <code>2, 2, 4</code>. Join condition: <code>R.A = S.A</code>.<br>' +
         '• <b>INNER JOIN:</b> The two <code>2</code>s in $R$ each match both <code>2</code>s in $S$ ($2 \\times 2 = 4$ matches). Output = <b>4 rows</b>.<br>' +
         '• <b>LEFT OUTER JOIN:</b> 4 matched rows for `2`, plus unmatched `1` and `3` from $R$ (padded with `NULL`) $= 4 + 2 =$ <b>6 rows</b>.<br>' +
         '• <b>RIGHT OUTER JOIN:</b> 4 matched rows for `2`, plus unmatched `4` from $S$ $= 4 + 1 =$ <b>5 rows</b>.<br>' +
         '• <b>FULL OUTER JOIN:</b> 4 matched + 2 unmatched from $R$ + 1 unmatched from $S =$ <b>7 rows</b>.</div>'
    },
    {
      h: 'ACID, Concurrency Control, Isolation Levels & Two-Phase Commit (2PC)',
      b: '<p>Every database transaction is a logical unit of work that must obey <b>ACID</b>:</p>' +
         '<ul>' +
         '<li><b>Atomicity ("All or Nothing"):</b> guaranteed by the <b>Transaction Management / Undo Log Recovery</b> subsystem.</li>' +
         '<li><b>Consistency:</b> preserves database integrity rules; guaranteed jointly by the application programmer and DBMS constraint checker.</li>' +
         '<li><b>Isolation:</b> concurrent transactions appear to run serially; guaranteed by the <b>Concurrency Control</b> subsystem (2PL, Timestamp Ordering, MVCC).</li>' +
         '<li><b>Durability:</b> committed changes survive power loss or OS crash; guaranteed by the <b>Recovery / Redo Write-Ahead Log (WAL)</b> subsystem.</li>' +
         '</ul>' +
         '<p><b>Schedules &amp; Serializability:</b> Two operations conflict if they belong to different transactions, access the same data item $Q$, and at least one is a `write(Q)`. A schedule is <b>Conflict Serializable</b> if and only if its <b>Precedence (Serialization) Graph is ACYCLIC (has no cycles)</b>! If the graph has $N$ nodes and no edges, there are $N!$ valid equivalent serial schedules.</p>' +
         '<table>' +
         '<tr><th>ANSI SQL Isolation Level</th><th>Dirty Read (Read uncommitted data)</th><th>Non-Repeatable Read (Same row changes value)</th><th>Phantom Read (New/deleted rows in range)</th></tr>' +
         '<tr><td><b>Read Uncommitted</b> (Lowest)</td><td>Possible</td><td>Possible</td><td>Possible</td></tr>' +
         '<tr><td><b>Read Committed</b> (Oracle/Postgres default)</td><td><b>Prevented</b></td><td>Possible</td><td>Possible</td></tr>' +
         '<tr><td><b>Repeatable Read</b> (MySQL InnoDB default)</td><td><b>Prevented</b></td><td><b>Prevented</b></td><td>Possible (in ANSI SQL)</td></tr>' +
         '<tr><td><b>Serializable</b> (Highest)</td><td><b>Prevented</b></td><td><b>Prevented</b></td><td><b>Prevented</b></td></tr>' +
         '</table>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Two-Phase Locking (2PL) — Concurrency Control</h4><p>• Controls <b>lock acquisition within a single database</b> to guarantee conflict serializability.<br>• <b>Phase 1 (Growing Phase):</b> transaction acquires Shared (S) and Exclusive (X) locks; cannot release any lock.<br>• <b>Phase 2 (Shrinking Phase):</b> transaction releases locks; cannot acquire any new lock.<br>• <b>Strict 2PL</b> holds all Exclusive (X) locks until commit/abort to prevent cascading rollbacks (still vulnerable to deadlocks).</p></div>' +
         '<div class="vs-card"><h4>Two-Phase Commit (2PC) — Distributed Atomicity</h4><p>• Coordinates <b>atomic commit of a distributed transaction across multiple network nodes</b>.<br>• <b>Phase 1 (Voting / Prepare):</b> Coordinator sends `PREPARE`; each participant writes its redo/undo log and replies `VOTE_COMMIT` or `VOTE_ABORT`.<br>• <b>Phase 2 (Decision):</b> If <b>ALL</b> voted commit, Coordinator logs and broadcasts `GLOBAL_COMMIT`; if <b>even ONE</b> voted abort, broadcasts `GLOBAL_ABORT`.<br>• Weakness: <b>Blocking protocol</b> if Coordinator crashes after voting.</p></div>' +
         '</div>'
    },
    {
      h: 'System & Media Recovery — WAL, Checkpoints, Undo vs Redo',
      b: '<div class="diagram"><div class="diag-title">Crash Recovery Timeline: Undo vs Redo from the Last Checkpoint</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>T1: Starts &amp; Commits</b><small>Before Checkpoint → Already flushed to disk (No action)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>[CHECKPOINT]</b><small>Dirty buffers flushed; active list recorded</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>T2: Commits before Crash</b><small>Has &lt;T2, COMMIT&gt; in log → <b>REDO T2</b> (Roll Forward)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>T3: Active at Crash!</b><small>No COMMIT in log → <b>UNDO T3</b> (Roll Backward)</small></div>' +
         '</div></div>' +
         '<ul>' +
         '<li><b>Write-Ahead Logging (WAL) Protocol:</b> Before a modified data page in RAM is written to the database file on disk, the log record $\\langle T_i, X, V_{\\text{old}}, V_{\\text{new}} \\rangle$ describing that modification <b>must first be forced to stable log storage</b>.</li>' +
         '<li><b>Deferred Database Modification (NO-UNDO / REDO):</b> buffers all writes in the log until commit; never touches disk before commit, so crashed uncommitted transactions need <b>no Undo</b>.</li>' +
         '<li><b>Immediate Database Modification (UNDO / REDO):</b> allows dirty pages to be flushed to disk before commit (steal policy); crash recovery requires <b>UNDO</b> (using old value $V_{\\text{old}}$ in reverse order) for active transactions and <b>REDO</b> (using new value $V_{\\text{new}}$ in forward order) for committed transactions.</li>' +
         '<li><b>System Recovery vs Media Recovery:</b> <b>System recovery</b> recovers from power failure/OS crash when the disk remains intact by replaying the on-disk WAL from the last checkpoint. <b>Media recovery</b> recovers from physical disk destruction (head crash, corrupted RAID) by loading the last <b>full database backup</b> from separate storage and rolling forward through <b>archived redo logs</b>.</li>' +
         '</ul>'
    },
    {
      h: 'SQLite Forensics & Unix Timestamp Data Constraints',
      b: '<p><b>Why SQLite is the #1 Mobile &amp; Browser Forensic Artefact:</b> Unlike client-server RDBMSs (MySQL, PostgreSQL, Oracle), SQLite is a <b>serverless, embedded, single-file database engine</b> with <b>dynamic type affinity</b> (any column can store any data type regardless of declared column type, except `INTEGER PRIMARY KEY`). Its 100-byte file header starts with the 16-byte ASCII magic signature:</p>' +
         '<p style="text-align:center"><code>"SQLite format 3\\0"</code> &nbsp;→&nbsp; <code>53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00</code></p>' +
         '<div class="diagram"><div class="diag-title">The Three Files of an Active SQLite Database (ALWAYS Seize All Three Together!)</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>msgstore.db</b><small>Main database divided into 4096 B B-tree pages + Freelist</small></div><span class="flow-arrow">+</span>' +
         '<div class="flow-step"><b>msgstore.db-wal</b><small>Write-Ahead Log holding the NEWEST committed messages not yet checkpointed!</small></div><span class="flow-arrow">+</span>' +
         '<div class="flow-step"><b>msgstore.db-shm</b><small>Shared-memory WAL index (RAM-mapped coordination file)</small></div>' +
         '</div></div>' +
         '<ul>' +
         '<li><b>How SQLite Deletion Works (Why Deleted Chats Survive):</b> When a user deletes a WhatsApp message or browser history item, SQLite does <b>not</b> zero out the row by default (unless `PRAGMA secure_delete = ON`). Instead, the record moves into a <b>Freeblock</b> inside the B-tree leaf page or the page is added to the database\'s <b>Freelist</b>. Forensic tools carve these unallocated cell areas and `-wal` frames to recover deleted rows!</li>' +
         '<li><b>What destroys deleted SQLite evidence?</b> Running the SQL command <code>VACUUM;</code> rebuilds the entire `.db` file from scratch into a new contiguous file, purging all freelist pages and unallocated freeblocks.</li>' +
         '</ul>' +
         '<p><b>Master Forensic Timestamp Epochs Table:</b></p>' +
         '<table>' +
         '<tr><th>Timestamp Format</th><th>Epoch Start (Zero Point)</th><th>Unit / Digits</th><th>Where Seen Forensically</th></tr>' +
         '<tr><td><b>Unix Epoch (Seconds)</b></td><td><b>1 Jan 1970 00:00:00 UTC</b></td><td>Seconds (10 digits, e.g. `1700000000`)</td><td>Linux ext4, Android system logs, iOS BSD layer</td></tr>' +
         '<tr><td><b>Unix Epoch (Milliseconds)</b></td><td><b>1 Jan 1970 00:00:00 UTC</b></td><td>Milliseconds (13 digits, e.g. `1700000000000`)</td><td>Android `mmssms.db`, WhatsApp `msgstore.db`, Java</td></tr>' +
         '<tr><td><b>Apple Cocoa / CoreData Time</b></td><td><b>1 Jan 2001 00:00:00 UTC</b></td><td>Seconds or Nanoseconds (9 or 18 digits)</td><td>iOS `sms.db`, `CallHistory.storedata`, Safari, macOS Plists</td></tr>' +
         '<tr><td><b>Google Chrome / WebKit Time</b></td><td><b>1 Jan 1601 00:00:00 UTC</b></td><td>Microseconds (17 digits)</td><td>Chrome/Edge `History`, `Cookies`, `Login Data` SQLite DBs</td></tr>' +
         '<tr><td><b>Windows FILETIME</b></td><td><b>1 Jan 1601 00:00:00 UTC</b></td><td>100-nanosecond intervals (64-bit integer)</td><td>NTFS `$MFT` (`$SI`, `$FN`), Windows Registry keys</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Worked Example — Converting Between Apple Cocoa Time and Unix Epoch Time:</b><br>' +
         'The exact offset between <b>1 Jan 1970</b> and <b>1 Jan 2001</b> (31 years, including 8 leap years: 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000) is:<br>' +
         '$$\\Delta = (31 \\times 365 + 8) \\times 86,400 = 11,323 \\text{ days} \\times 86,400\\text{ s/day} = \\mathbf{978,307,200\\text{ seconds}}$$<br>' +
         'So in SQLite on an iPhone (`sms.db`), to convert an Apple second timestamp `date` to human-readable UTC:<br>' +
         '<code>SELECT datetime(date + 978307200, \'unixepoch\') FROM message;</code><br>' +
         'If you forget to add `978307200` (31 years), a message sent in <b>November 2026</b> will falsely appear in your forensic report as <b>November 1995</b>!</div>'
    },
    {
      h: 'Database Security, SQL Injection & Audit Triggers',
      b: '<ul>' +
         '<li><b>Authentication vs Authorisation:</b> <b>Authentication</b> verifies identity (username/password, certificate, biometrics — <em>who you are</em>); <b>Authorisation</b> governs permissions on database objects via `GRANT` and `REVOKE` or restricted SQL `VIEW`s (<em>what you are allowed to read/modify</em>).</li>' +
         '<li><b>Triggers (`BEFORE` / `AFTER` / `INSTEAD OF` on `INSERT`, `UPDATE`, `DELETE`):</b> Event-Condition-Action (ECA) rules stored inside the database catalog. Forensically, an `AFTER UPDATE OR DELETE` trigger that copies `OLD.*` values, `CURRENT_USER`, and `CURRENT_TIMESTAMP` into an append-only `Audit_Log` table provides tamper-evident history of who altered a record and what it looked like beforehand.</li>' +
         '<li><b>SQL Injection (SQLi):</b> occurs when untrusted user input is concatenated directly into a dynamic SQL string, allowing an attacker to alter the query\'s syntax tree.</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Forensic Example — Anatomy of a Classic SQL Injection &amp; Its Fix:</b><br>' +
         '<b>Vulnerable code:</b> <code>SELECT * FROM Users WHERE user = \'" + inputUser + "\' AND pass = \'" + inputPass + "\';</code><br>' +
         '<b>Attacker inputs:</b> <code>admin\' OR \'1\'=\'1\' --</code><br>' +
         '<b>Resulting executed query:</b> <code>SELECT * FROM Users WHERE user = \'admin\' OR \'1\'=\'1\' --\' AND pass = \'...\';</code><br>' +
         'Because `\'1\'=\'1\'` is always TRUE and `--` comments out the password check, the attacker logs in as `admin` without knowing the password! An attacker can also append `UNION SELECT username, password_hash FROM Users` to exfiltrate the entire database.<br>' +
         '<b>The Definitive Fix:</b> Use <b>Parameterized Queries (Prepared Statements)</b> with bound placeholders (`?`). In a prepared statement, the database compiles the SQL structure <em>before</em> inserting the parameter, treating user input strictly as a literal scalar value and never as executable SQL syntax.</div>'
    }
  ],

  questions: [
    { q: 'A relation is in 2NF if it is in 1NF and',
      o: ['it has no transitive dependencies',
          'every non-prime attribute is fully functionally dependent on the whole of every candidate key',
          'every determinant is a candidate key',
          'it contains no multi-valued dependencies'], a: 1,
      e: '<p>2NF eliminates <b>partial dependency</b> — a non-prime attribute depending on only part of a composite candidate key.</p><p>(a) is 3NF, (c) is BCNF, (d) is 4NF. All four options are real definitions of <em>something</em>, which is what makes this a good discriminator.</p>' },

    { q: 'A relation R(A, B, C) has primary key A and functional dependencies A→B and B→C. R is in',
      o: ['1NF but not 2NF', '2NF but not 3NF', '3NF but not BCNF', 'BCNF'], a: 1,
      e: '<p>The key is the single attribute A, so no <em>partial</em> dependency is possible — R is automatically in 2NF.</p><p>But A→B→C makes C <b>transitively</b> dependent on the key through the non-prime attribute B. That violates 3NF. Hence <b>2NF but not 3NF</b>.</p><p>The shortcut worth remembering: a single-attribute primary key guarantees 2NF, so any such question reduces to checking for transitive dependencies.</p>' },

    { q: 'Which property of a transaction guarantees that a committed change survives a subsequent power failure?',
      o: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], a: 3,
      e: '<p><b>Durability</b> — once COMMIT returns, the change persists through crashes, normally because the write-ahead log was forced to stable storage first.</p><p>Atomicity is the all-or-nothing property, which is about partial failure <em>within</em> a transaction rather than survival after commit. The two are routinely confused.</p>' },

    { q: 'In the Two-Phase Commit protocol, the principal weakness is that',
      o: ['it cannot detect deadlock',
          'participants may block indefinitely if the coordinator fails after voting',
          'it does not guarantee atomicity across sites',
          'it requires all participants to use the same DBMS'], a: 1,
      e: '<p>2PC is a <b>blocking</b> protocol. If the coordinator crashes after collecting votes but before broadcasting the decision, a participant that voted "commit" holds its locks and cannot unilaterally decide. Three-phase commit adds a pre-commit phase to address this.</p><p>2PC does guarantee atomicity across sites — that is its entire purpose — so (c) is wrong.</p>' },

    { q: 'When examining an Android application\'s SQLite database, the file that may contain committed records not yet present in the main database file is the',
      o: ['.db-shm shared memory file', '.db-wal write-ahead log', '.db-backup file', 'The MFT record for the database'], a: 1,
      e: '<p>In WAL mode, new writes go to the <b>-wal</b> file and are only later checkpointed into the main <code>.db</code>. A database seized without its WAL can therefore be missing the most recent — often the most relevant — messages.</p><p>The <code>-shm</code> file is a shared-memory index used to coordinate access to the WAL; it holds no records itself. <b>Practical rule: always acquire <code>.db</code>, <code>-wal</code> and <code>-shm</code> together.</b></p>' },

    { q: 'A timestamp value of 0 in the Apple/Mac absolute time format corresponds to',
      o: ['1 January 1601', '1 January 1970', '1 January 2001', '1 January 1904'], a: 2,
      e: '<p>Apple\'s Core Foundation absolute time counts seconds from <b>1 January 2001 UTC</b>. Windows FILETIME counts from 1601, Unix from 1970, and classic Mac OS (pre-OS X, HFS) used 1904.</p><p>All four dates in the options are genuine epochs in use, so this must be memorised rather than reasoned out.</p>' },

    { q: 'Every candidate key is a super key, but not every super key is a candidate key, because a candidate key must additionally be',
      o: ['composite', 'minimal', 'non-null', 'indexed'], a: 1,
      e: '<p>A candidate key is a <b>minimal</b> super key — remove any attribute and it stops uniquely identifying tuples.</p><p>Non-null is a constraint on the <em>primary</em> key specifically, not on candidate keys generally. Being composite or indexed is irrelevant to the definition.</p>' },

    { q: 'A relation is in BCNF if, for every non-trivial functional dependency X → Y,',
      o: ['Y is a prime attribute', 'X is a super key', 'X is a single attribute', 'Y is not a prime attribute'], a: 1,
      e: '<p>BCNF requires the determinant of every non-trivial dependency to be a <b>super key</b>. This is strictly stronger than 3NF, which also permits the case where Y is a prime attribute.</p><p>Consequence worth knowing: every BCNF relation is in 3NF, but a 3NF relation need not be in BCNF — and unlike 3NF, a decomposition into BCNF is not always dependency-preserving.</p>' },

    { q: 'Deleted records frequently remain recoverable from a SQLite database file because',
      o: ['SQLite writes all deletions to a separate recycle table',
          'the pages holding them are marked free but their content is not immediately overwritten',
          'SQLite encrypts rather than removes deleted rows',
          'the operating system journals every deletion'], a: 1,
      e: '<p>A DELETE marks the page or cell as free for reuse; the bytes stay until something overwrites them. Carving the free pages and unallocated regions of the file therefore recovers deleted messages.</p><p>Running <code>VACUUM</code> rebuilds the file and destroys this — which is why examiners never issue a VACUUM against evidence, and why an accused\'s use of it may itself be significant.</p>' },

    { q: 'Which SQL statements belong to the Data Control Language (DCL)?',
      o: ['CREATE and DROP', 'SELECT and UPDATE', 'GRANT and REVOKE', 'COMMIT and ROLLBACK'], a: 2,
      e: '<p><b>DCL</b> = GRANT and REVOKE, which manage privileges.</p><p>CREATE/DROP/ALTER are DDL; SELECT/INSERT/UPDATE/DELETE are DML; COMMIT/ROLLBACK/SAVEPOINT are TCL (transaction control). Sorting these four families is a reliable one-mark question.</p>' },

    { q: 'A database trigger is best described as',
      o: ['an index that speeds up key lookups',
          'procedural code executed automatically in response to a specified table event',
          'a constraint that prevents duplicate primary keys',
          'a lock acquired at the start of a transaction'], a: 1,
      e: '<p>A trigger fires automatically on INSERT, UPDATE or DELETE. Forensically, triggers are the usual mechanism behind an application\'s <b>audit trail</b> table, so their presence tells you where a change history may be found.</p>' },

    { q: 'Restoring a database from backup and rolling forward through archived logs after a disk failure is called',
      o: ['System recovery', 'Media recovery', 'Cascading rollback', 'Checkpoint recovery'], a: 1,
      e: '<p><b>Media recovery</b> addresses physical loss of the storage medium and needs a backup plus archived logs. <b>System recovery</b> follows a crash where the disk survives, and only needs the log to redo committed and undo uncommitted transactions.</p><p>The syllabus names both explicitly ("System &amp; Media Recovery"), so the distinction is expected.</p>' },

    { q: 'In an E-R diagram, a diamond represents',
      o: ['An entity set', 'An attribute', 'A relationship set', 'A weak entity'], a: 2,
      e: '<p>Standard Chen notation: <b>rectangle</b> = entity set, <b>ellipse</b> = attribute, <b>diamond</b> = relationship set, <b>double rectangle</b> = weak entity, <b>double diamond</b> = identifying relationship, <b>underlined attribute</b> = primary key.</p>' },

    { q: 'In the ANSI-SPARC three-level database architecture, the ability to change the internal (storage) schema — for example adding an index — without altering the conceptual schema or any application is called',
      o: ['Logical data independence', 'Physical data independence', 'View independence', 'Referential independence'], a: 1,
      e: '<p><b>Physical data independence</b> insulates the conceptual schema from changes to storage structures and access paths at the internal level.</p><p><b>Logical data independence</b> is the harder property — insulating external views/applications from changes to the conceptual schema itself — and is the one exam questions usually ask you to identify as "harder to achieve."</p>' },

    { q: 'A weak entity set is mapped into the relational model as a table whose primary key is',
      o: ['its partial key alone',
          'the partial key combined with the primary key of its owner (identifying) entity',
          'a system-generated surrogate key, since weak entities have no primary key',
          'left undefined, since weak entity tables cannot have a primary key'], a: 1,
      e: '<p>A weak entity has no candidate key of its own — its partial key only distinguishes it <em>within</em> one owner. The table\'s primary key must therefore be the <b>partial key + the owner\'s primary key</b> (carried in as a foreign key via the identifying relationship).</p>' },

    { q: 'A many-to-many (M:N) relationship between two entity sets is implemented in the relational model by',
      o: ['adding a foreign key to the entity table on the "many" side',
          'adding a foreign key to the entity table on the "one" side',
          'creating a separate table holding foreign keys to both entities',
          'adding the same attribute to both entity tables'], a: 2,
      e: '<p>Neither entity table can hold a single foreign key for an M:N relationship without duplicating rows. The standard mapping is a <b>junction (bridge) table</b> whose primary key is the pair of foreign keys referencing both entities.</p><p>Foreign-key-on-the-many-side is the correct rule only for a <b>1:N</b> relationship — a common substitution error in this style of question.</p>' },

    { q: 'Which relational algebra operator restricts a relation to the rows satisfying a given predicate, leaving the number of columns unchanged?',
      o: ['Project (π)', 'Select (σ)', 'Join (⋈)', 'Rename (ρ)'], a: 1,
      e: '<p><b>Select (σ)</b> filters rows/tuples; the schema (columns) is untouched.</p><p><b>Project (π)</b> is the one that changes columns, and can incidentally reduce the row count if projecting drops attributes that were making rows distinct. σ and π are the most commonly swapped pair in this topic.</p>' },

    { q: 'Referential integrity is violated when',
      o: ['a foreign key column contains a value with no matching primary key value in the referenced table (and is not NULL)',
          'a primary key column contains a duplicate value',
          'a non-key attribute is functionally dependent on another non-key attribute',
          'a table has more than one candidate key'], a: 0,
      e: '<p><b>Referential integrity</b> requires every non-NULL foreign key value to match an existing primary key value in the referenced relation — a "dangling reference" breaks it.</p><p>(b) violates entity integrity/uniqueness, (c) is a transitive dependency (a normalisation concern, not integrity), and (d) is simply normal and legal.</p>' },

    { q: 'A LEFT OUTER JOIN of table Suspects (left) with table CallRecords (right), ON matching phone numbers, returns',
      o: ['only suspects who have at least one matching call record',
          'every row of Suspects, with NULLs in the CallRecords columns where no match exists',
          'every row of CallRecords, with NULLs in the Suspects columns where no match exists',
          'only rows present in both tables'], a: 1,
      e: '<p>A LEFT OUTER JOIN preserves <b>every row of the left table</b> regardless of a match, padding unmatched right-side columns with NULL. Option (a)/(d) describe an INNER JOIN; option (c) describes a RIGHT OUTER JOIN with the tables swapped.</p>' },

    { q: 'In the logical order in which a SELECT statement\'s clauses are evaluated, which of these executes first?',
      o: ['The SELECT column list', 'The WHERE clause', 'The HAVING clause', 'The ORDER BY clause'], a: 1,
      e: '<p>Logical processing order is <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</code> — not the order the clauses are typed in. WHERE runs on raw rows before any grouping or aggregation, which is exactly why WHERE cannot reference an aggregate function but HAVING can.</p>' },

    { q: 'Unlike MySQL, SQLite versions prior to 3.39 (2022) had no native support for',
      o: ['transactions', 'triggers', 'RIGHT OUTER JOIN (only LEFT JOIN was supported)', 'primary keys'], a: 2,
      e: '<p>Pre-3.39 SQLite implemented only LEFT (OUTER) JOIN; RIGHT and FULL OUTER JOIN had to be simulated by swapping table order or using UNION. MySQL has always supported RIGHT JOIN natively.</p><p>Both engines have always supported transactions, triggers and primary keys, so those are distractors.</p>' },

    { q: 'Transaction A reads a row; Transaction B then updates and commits a change to that same row; Transaction A re-reads the row within the same transaction and sees a different value. This anomaly is called',
      o: ['Dirty read', 'Non-repeatable read', 'Phantom read', 'Lost update'], a: 1,
      e: '<p><b>Non-repeatable read</b> — the same row yields different values across two reads in one transaction because a concurrent transaction committed a change in between.</p><p>A <b>dirty read</b> would require B\'s change to be read <em>before</em> B commits (or rolls back). A <b>phantom read</b> is about a changed <em>set of rows</em> from a range query, not a changed value in the same row.</p>' },

    { q: 'Which is the minimum SQL standard isolation level that guarantees phantom reads cannot occur?',
      o: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'], a: 3,
      e: '<p>On the standard ladder (Read Uncommitted → Read Committed → Repeatable Read → Serializable), phantom reads are only ruled out at <b>Serializable</b> — Repeatable Read still permits a concurrent transaction to insert/delete rows matching a range predicate.</p>' },

    { q: 'A file\'s Unix epoch timestamp (seconds since 1 Jan 1970 UTC) reads 1700000000. This corresponds approximately to',
      o: ['2015', '2019', '2023', '2027'], a: 2,
      e: '<p>1,700,000,000 seconds ≈ 53.87 years after 1 Jan 1970, landing in <b>November 2023</b>. As with all epoch conversions on this paper, the useful skill is estimating the year from the raw integer\'s magnitude, then confirming the exact date with a converter during the actual forensic exam.</p>' },

    { q: 'A SQLite database file is internally organised into fixed-size units called',
      o: ['extents', 'pages', 'blocks', 'clusters'], a: 1,
      e: '<p>SQLite divides the file into fixed-size <b>pages</b> (4096 bytes by default), each holding a B-tree node for a table or index, a freelist entry, or overflow content. Forensic carving of deleted records specifically targets pages marked free in the file\'s page inventory but not yet overwritten.</p>' },

    { q: 'A "dirty read" occurs when a transaction reads',
      o: ['data written by another transaction that has not yet committed (and might still roll back)',
          'data that was deleted and later recovered from a backup',
          'an aggregate value computed from outdated table statistics',
          'a row that is currently locked by another transaction\'s SELECT'], a: 0,
      e: '<p>A dirty read reads <b>uncommitted</b> data. If the writing transaction later rolls back, the reader has seen a value that never truly existed in the database — the most dangerous of the three standard anomalies, and the only one still possible even at Read Committed\'s neighbour, Read Uncommitted.</p><p>Plain SELECTs do not normally block each other, which is why (d) is not how relational engines behave by default.</p>' },

    { q: 'Which of the following was the principal driver behind the shift from file-based systems to database management systems?',
      o: ['Faster CPU clock speeds making file access unnecessary',
          'Data redundancy, inconsistency and lack of centralised integrity/security control in file-based systems',
          'A government mandate requiring all applications to use SQL',
          'File systems being unable to store more than a fixed number of records'], a: 1,
      e: '<p>File-based systems had each application maintain its own files, causing duplicated data, inconsistency when only one copy was updated, no centralised way to enforce integrity constraints, weak (OS-level, all-or-nothing) security, and no built-in concurrent-access or recovery control — exactly the problems a DBMS was designed to solve.</p><p>Raw hardware speed and record-count limits were never the reason; that distractor is planted specifically because it sounds plausible but is not a data-management concern.</p>' },

    { q: 'In the historical evolution of database systems, the data model that organised records in a tree structure — where every child record has exactly one parent — and preceded the relational model is the',
      o: ['Network model', 'Hierarchical model', 'Entity-Relationship model', 'Object-oriented model'], a: 1,
      e: '<p>The <b>hierarchical model</b> (e.g. IBM IMS, late 1960s) arranges records as a tree with a strict one-parent-per-child rule. The <b>network model</b> (CODASYL, 1969) generalised this into a graph, allowing a child multiple parents. Both predate Codd\'s 1970 relational model, which this syllabus otherwise assumes as the default.</p>' },

    { q: 'Which SQL command is classified as DDL (Data Definition Language) even though it removes all rows from a table, unlike DELETE which is DML?',
      o: ['UPDATE', 'SELECT', 'TRUNCATE', 'REVOKE'], a: 2,
      e: '<p><b>TRUNCATE</b> deallocates a table\'s data pages wholesale, resets any auto-increment counter, cannot take a WHERE clause, and in most engines cannot be rolled back and forces an implicit commit — so despite reading like a data-manipulation command, it is classified as <b>DDL</b> alongside CREATE/ALTER/DROP.</p><p>DELETE, by contrast, is DML: row-by-row logged and filterable.</p>' },

    { q: 'SAVEPOINT and ROLLBACK TO SAVEPOINT belong to which category of SQL commands?',
      o: ['DDL', 'DML', 'DCL', 'TCL'], a: 3,
      e: '<p><b>TCL (Transaction Control Language)</b> manages transaction boundaries: COMMIT, ROLLBACK and SAVEPOINT. A SAVEPOINT marks a point within a transaction that a later ROLLBACK TO can return to without aborting the whole transaction.</p><p>This is distinct from DCL (GRANT/REVOKE, privileges) with which it is frequently confused in option lists.</p>' },

    { q: 'The recovery principle that requires a log record describing a change to be written to stable storage before the corresponding data page is written to disk is called',
      o: ['Shadow paging', 'Write-ahead logging (WAL)', 'Two-Phase Commit', 'Checkpointing'], a: 1,
      e: '<p><b>Write-ahead logging</b> is the rule underlying both system and media recovery: the log always precedes the data write, so a crash mid-write still leaves enough log information to redo or undo the change correctly.</p><p>Checkpointing depends on WAL but is a separate mechanism (see next question); shadow paging and 2PC solve different problems entirely.</p>' },

    { q: 'A checkpoint, taken periodically during normal database operation, primarily serves to',
      o: ['permanently delete all transaction logs older than the checkpoint',
          'bound how far back the log must be scanned during recovery, by recording which transactions were active and flushing their buffered pages at that point',
          'convert a system recovery scenario into a media recovery scenario',
          'eliminate the need for periodic backups'], a: 1,
      e: '<p>A <b>checkpoint</b> records the set of active transactions and forces their dirty buffer pages to disk. On restart after a crash, recovery only needs to redo/undo from the most recent checkpoint forward — not from the beginning of the log — which is what keeps recovery time bounded.</p><p>It does not replace backups (needed for media recovery) and does not delete logs outright, since logs before a checkpoint may still be needed for media recovery.</p>' },

    { q: 'In the Two-Phase Commit protocol, the phase in which the coordinator sends a VOTE-REQUEST to every participant and each participant replies VOTE-COMMIT or VOTE-ABORT is the',
      o: ['Commit / decision phase', 'Prepare / voting phase', 'Undo phase', 'Checkpoint phase'], a: 1,
      e: '<p>The <b>prepare (voting) phase</b> is Phase 1: the coordinator polls all participants, and each participant does its work, logs it, and votes. Only if every vote is COMMIT does the coordinator move to Phase 2 and broadcast GLOBAL-COMMIT; a single ABORT vote forces GLOBAL-ABORT everywhere.</p>' },

    { q: 'A concurrency-control protocol has a "growing phase" in which a transaction may only acquire locks and a "shrinking phase" in which it may only release them, and this is used to guarantee serialisable isolation. This describes',
      o: ['Two-Phase Commit (2PC)', 'Two-Phase Locking (2PL)', 'Write-ahead logging', 'Media recovery'], a: 1,
      e: '<p>This growing/shrinking-phase description is <b>Two-Phase Locking (2PL)</b>, a per-transaction lock-management protocol for serialisability.</p><p><b>Two-Phase Commit (2PC)</b> is a different, unrelated protocol — it coordinates atomic commit of one transaction across multiple distributed sites via a prepare phase and a commit phase, with no concept of "growing/shrinking" lock acquisition. The similar names are a deliberate exam trap: look for "coordinator/sites" (2PC) versus "acquire/release locks" (2PL) to tell them apart.</p>' },

    { q: 'In Chen\'s E-R diagram notation, what do a DOUBLE ellipse, a DASHED ellipse, and a DOUBLE diamond represent respectively?',
      o: ['Multi-valued attribute, Derived attribute, and Identifying relationship for a weak entity',
          'Composite attribute, Optional attribute, and Many-to-Many relationship',
          'Derived attribute, Multi-valued attribute, and Total participation',
          'Candidate key, Foreign key, and Recursive relationship'], a: 0,
      e: '<p>In standard Chen E-R notation:<br>• <b>Double ellipse</b> = <b>Multi-valued attribute</b> (e.g., `Phone_Numbers`, which maps to its own separate relational table).<br>• <b>Dashed ellipse</b> = <b>Derived attribute</b> (e.g., `Age` computed on the fly from `Date_of_Birth`).<br>• <b>Double diamond</b> = <b>Identifying relationship</b> linking a Weak Entity Set (double rectangle) to its owner Strong Entity Set.</p>' },

    { q: 'Consider a relation R(A, B, C, D, E) with functional dependencies: AB → C, C → D, D → B, and D → E. Which of the following is the complete set of Candidate Keys for R?',
      o: ['{AB, AC, AD}', '{AB} only', '{AB, CD, DE}', '{A, B, C, D}'], a: 0,
      e: '<p>1. Attribute $A$ never appears on the right-hand side of any FD, so $A$ must belong to every candidate key.<br>2. $A^+ = \\{A\\} \\neq R$.<br>3. Testing pairs containing $A$: $(AB)^+ = \\{A,B,C,D,E\\} = R$; $(AC)^+ = \\{A,C,D,B,E\\} = R$; and $(AD)^+ = \\{A,D,B,C,E\\} = R$. Meanwhile $(AE)^+ = \\{A,E\\} \\neq R$.<br>Thus there are exactly three minimal super keys (Candidate Keys): <b><code>{AB, AC, AD}</code></b>.</p>' },

    { q: 'A relation R(A, B, C, D, E, F) has 6 attributes and a SINGLE candidate key consisting of 2 attributes {A, B}. How many distinct Super Keys does R have?',
      o: ['16', '32', '64', '4'], a: 0,
      e: '<p>Any superset of the candidate key $\\{A, B\\}$ is a super key. Since $A$ and $B$ must always be included, each of the remaining $n - k = 6 - 2 = 4$ attributes ($C, D, E, F$) can either be present or absent independently. Total super keys $= 2^{6 - 2} = 2^4 =$ <b>16</b>.</p>' },

    { q: 'Consider relation R(A, B, C) with functional dependencies AB → C and C → B. Which is the HIGHEST normal form satisfied by R?',
      o: ['3NF (but not BCNF)', '2NF (but not 3NF)', 'BCNF', '1NF (but not 2NF)'], a: 0,
      e: '<p>Let\'s find the candidate keys first: $A$ is not on any RHS, and $(AB)^+ = \\{A,B,C\\}$, $(AC)^+ = \\{A,C,B\\}$. So the Candidate Keys are <b>$AB$ and $AC$</b>, meaning the prime attributes are $\\{A, B, C\\}$ (all attributes are prime!).<br>• Check <b>3NF</b>: For $AB \\to C$, $AB$ is a super key (OK). For $C \\to B$, $C$ is not a super key, <em>but $B$ is a prime attribute</em>! Since 3NF allows $X \\to Y$ when $Y$ is prime, <b>$R$ is in 3NF</b>.<br>• Check <b>BCNF</b>: For $C \\to B$, the determinant $C$ is NOT a super key. Therefore $R$ violates BCNF! This is the classic textbook example of a relation that is in <b>3NF but not BCNF</b>.</p>' },

    { q: 'A relation R(A, B, C, D) is decomposed into R1(A, B, C) and R2(C, D). Under which functional dependency is this decomposition guaranteed to be a LOSSLESS-JOIN decomposition?',
      o: ['C → D', 'A → B', 'D → C', 'B → A'], a: 0,
      e: '<p>By the lossless-join theorem for binary decomposition, decomposing $R$ into $R_1$ and $R_2$ is lossless if and only if the common attributes $(R_1 \\cap R_2)$ functionally determine all attributes of $R_1$ or all attributes of $R_2$: $$(R_1 \\cap R_2) \\to R_1 \\quad \\text{or} \\quad (R_1 \\cap R_2) \\to R_2$$ Here, $R_1 \\cap R_2 = \\{C\\}$. If <b>$C \\to D$</b> holds, then $C$ is a super key of $R_2(C, D)$, making the join guaranteed lossless!</p>' },

    { q: 'Which relational algebra operator is used to answer queries containing the universal quantifier "FOR ALL" — such as "Find all suspect IDs who were present at EVERY crime scene in District X"?',
      o: ['Division (÷)', 'Natural Join (⋈)', 'Cartesian Product (×)', 'Set Difference (−)'], a: 0,
      e: '<p>The <b>Division operator ($R \\div S$)</b> returns tuples from the projection of $R$ that are paired with <b>every</b> tuple in $S$. Whenever an exam question asks for entities matching "all" or "every" item in another set, the relational algebra operator is <b>Division ($\\div$)</b>.</p>' },

    { q: 'Relation R has 10 tuples and 4 attributes; Relation S has 8 tuples and 3 attributes, with no common attributes. How many tuples and attributes are in the Cartesian Product R × S?',
      o: ['80 tuples and 7 attributes', '18 tuples and 7 attributes', '80 tuples and 12 attributes', '18 tuples and 12 attributes'], a: 0,
      e: '<p>For Cartesian Product $R \\times S$:<br>• <b>Cardinality (number of tuples/rows)</b> multiplies: $|R \\times S| = |R| \\times |S| = 10 \\times 8 =$ <b>80 tuples</b>.<br>• <b>Degree (number of attributes/columns)</b> adds: $\\text{deg}(R \\times S) = \\text{deg}(R) + \\text{deg}(S) = 4 + 3 =$ <b>7 attributes</b>.</p>' },

    { q: 'A table `EvidenceLogs` has 5 rows with column `FileSizeKB` containing: `100, 200, NULL, 300, NULL`. What values are returned by `SELECT COUNT(*), COUNT(FileSizeKB), AVG(FileSizeKB) FROM EvidenceLogs;`?',
      o: ['5, 3, 200', '5, 5, 120', '3, 3, 200', '5, 3, 120'], a: 0,
      e: '<p>In SQL:<br>• <b>`COUNT(*)`</b> counts every row in the table regardless of NULLs $\\Rightarrow$ <b>5</b>.<br>• <b>`COUNT(column)`</b> ignores NULLs and counts only non-null values (`100, 200, 300`) $\\Rightarrow$ <b>3</b>.<br>• <b>`AVG(column)`</b> sums the non-null values and divides by the count of <em>non-null</em> rows: $(100 + 200 + 300) / 3 =$ <b>200</b> (NOT $600 / 5 = 120$!).</p>' },

    { q: 'During crash recovery under an Immediate Database Modification (UNDO/REDO) log scheme, the recovery manager scans the log from the last checkpoint and finds `<T1, START>` and `<T1, COMMIT>`, while for T2 it finds `<T2, START>` with no commit record before the crash. What action must the recovery manager take?',
      o: ['REDO T1 and UNDO T2',
          'UNDO T1 and REDO T2',
          'REDO both T1 and T2',
          'UNDO both T1 and T2'], a: 0,
      e: '<p>Because $T_1$ has a `COMMIT` record in the log, durability requires that all its updates be present on disk $\\Rightarrow$ <b>REDO $T_1$</b> (roll forward using new values). Because $T_2$ never committed before the crash, atomicity requires that none of its dirty updates remain on disk $\\Rightarrow$ <b>UNDO $T_2$</b> (roll backward using old values).</p>' },

    { q: 'In concurrency control, a schedule S of concurrent transactions is guaranteed to be Conflict Serializable if and only if:',
      o: ['its Precedence (Serialization) Graph is acyclic (contains no directed cycles)',
          'every transaction in S commits in the exact order it started',
          'no transaction in S reads any data item written by another transaction',
          'its Precedence Graph is a single Hamiltonian cycle'], a: 0,
      e: '<p>A schedule is <b>Conflict Serializable</b> iff its <b>Precedence Graph</b> (where nodes are transactions and a directed edge $T_i \\to T_j$ means an operation in $T_i$ conflicts with and precedes an operation in $T_j$) has <b>no cycles (is a DAG)</b>. A topological sort of the acyclic graph gives the equivalent serial order.</p>' },

    { q: 'While examining a seized iPhone\'s `sms.db` SQLite database, a forensic examiner sees a timestamp value of `725846400` (Apple Cocoa/CoreData epoch seconds). Knowing that the offset between the Unix epoch (1970) and Apple epoch (2001) is 978,307,200 seconds, what is the equivalent Unix epoch timestamp and year?',
      o: ['1,704,153,600 (January 2024)',
          '725,846,400 (January 1993)',
          '252,460,800 (January 1978)',
          '1,704,153,600 (January 1993)'], a: 0,
      e: '<p>Apple CoreData timestamps count seconds from <b>1 Jan 2001 UTC</b>, which is 31 years ($978,307,200$ seconds) after the Unix epoch of 1 Jan 1970 UTC. Adding the offset: $$725,846,400 + 978,307,200 = \\mathbf{1,704,153,600}$$ which corresponds to <b>2 January 2024 00:00:00 UTC</b>. Option (b) is the notorious 31-year error caused by feeding an iOS timestamp into a Unix converter without adding 978,307,200!</p>' },

    { q: 'In a forensic examination of a suspect\'s Android phone, WhatsApp\'s `msgstore.db` shows 16-byte magic bytes `53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00` (`"SQLite format 3\\0"`). Which SQLite command, if executed by a suspect or anti-forensic app after deleting incriminating rows, permanently purges the freelist and unallocated cell areas by rebuilding the database file?',
      o: ['VACUUM;', 'TRUNCATE;', 'CHECKPOINT;', 'ROLLBACK;'], a: 0,
      e: '<p>Normally, `DELETE FROM messages` leaves deleted payloads intact inside SQLite freeblocks and freelist pages. However, executing <b><code>VACUUM;</code></b> copies only active live rows into a newly built file and replaces the original, wiping all unallocated space and freelist pages clean.</p>' },

    { q: 'A web login form builds a query as: `SELECT * FROM Accounts WHERE user = \'` + u + `\' AND pin = \'` + p + `\';`. An attacker enters `admin\' --` as the username. What is the most effective coding defence that completely prevents this SQL Injection attack?',
      o: ['Using Parameterized Queries (Prepared Statements) with bound parameters',
          'Converting the database from MySQL to SQLite',
          'Adding a client-side JavaScript max-length check on the input box',
          'Running the database in Read Uncommitted isolation mode'], a: 0,
      e: '<p><b>Parameterized Queries (Prepared Statements)</b> separate the SQL query structure from the data payload: the DBMS compiles the SQL command tree first and treats bound parameters strictly as scalar literals, making it impossible for injected quotes or `--` comments to alter query logic. Client-side JS validation is trivially bypassed with an HTTP proxy.</p>' },

    { q: 'In an E-R diagram, Strong Entity E1 and Strong Entity E2 are connected by a 1:N (One-to-Many) binary relationship R (where 1 instance of E1 is associated with many instances of E2, and no multi-valued attributes exist). What is the MINIMUM number of relational tables required to represent this schema without redundancy?',
      o: ['2 tables (by posting the primary key of the "1" side E1 as a foreign key inside the table of the "N" side E2)',
          '3 tables (E1, E2, and a separate junction table R)',
          '1 single merged table',
          '4 tables'], a: 0,
      e: '<p>For a <b>1:N relationship</b>, a separate junction table is unnecessary: the relationship $R$ (along with any relationship attributes) is absorbed into the table on the <b>"N" (Many) side</b> ($E_2$) by adding the primary key of the "1" side ($E_1$) as a Foreign Key. Thus only <b>2 tables</b> are needed. (3 tables are required only for M:N relationships!)</p>' },

    { q: 'Which Normal Form is specifically designed to eliminate non-trivial Multi-Valued Dependencies (X ↠ Y) where a table mixes two or more independent 1:N multi-valued facts about the same key?',
      o: ['Fourth Normal Form (4NF)',
          'Second Normal Form (2NF)',
          'Third Normal Form (3NF)',
          'Boyce-Codd Normal Form (BCNF)'], a: 0,
      e: '<p><b>Fourth Normal Form (4NF)</b> (introduced by Ronald Fagin) states that a relation is in 4NF if it is in BCNF and contains no non-trivial <b>Multi-Valued Dependencies ($X \\twoheadrightarrow Y$)</b> where $X$ is not a super key. For example, storing both an officer\'s multiple `Certifications` and multiple `Languages` in one table `Officer(ID, Cert, Lang)` creates Cartesian cross-product redundancy that violates 4NF even when no functional dependencies exist.</p>' },

    { q: 'Which of the following is the correct complete set of SIX fundamental (primitive) operators of Relational Algebra from which Join (⋈), Intersection (∩), and Division (÷) can all be derived?',
      o: ['Select (σ), Project (π), Union (∪), Set Difference (−), Cartesian Product (×), and Rename (ρ)',
          'Select (σ), Project (π), Natural Join (⋈), Intersection (∩), Division (÷), and Union (∪)',
          'INSERT, UPDATE, DELETE, SELECT, GRANT, and REVOKE',
          'GROUP BY, HAVING, ORDER BY, WHERE, FROM, and LIMIT'], a: 0,
      e: '<p>The six primitive operators of Codd\'s relational algebra are $\\sigma, \\pi, \\cup, -, \\times, \\rho$. Every other operator is derived:<ul><li><b>Intersection:</b> $R \\cap S = R - (R - S)$</li><li><b>Theta Join:</b> $R \\bowtie_\\theta S = \\sigma_\\theta(R \\times S)$</li><li><b>Division:</b> $R(A,B) \\div S(B) = \\pi_A(R) - \\pi_A((\\pi_A(R) \\times S) - R)$</li></ul></p>' },

    { q: 'In SQL, what is the crucial difference between a `PRIMARY KEY` constraint and a `UNIQUE` constraint on a column?',
      o: ['A table can have only ONE Primary Key and it can NEVER contain NULL values (Entity Integrity), whereas a table can have multiple UNIQUE constraints and a UNIQUE column may allow NULL values',
          'A Primary Key allows duplicate values, whereas UNIQUE does not',
          'UNIQUE automatically creates a foreign key, whereas Primary Key does not',
          'There is no difference between PRIMARY KEY and UNIQUE in standard SQL'], a: 0,
      e: '<p>By the <b>Entity Integrity Rule</b>, every attribute of a <b>Primary Key</b> must be strictly `NOT NULL`, and a table can have at most <b>one</b> Primary Key. By contrast, a table can have several <b>`UNIQUE`</b> constraints (for alternate keys), and unless `NOT NULL` is also specified, a `UNIQUE` column in standard SQL (including SQLite, PostgreSQL, and MySQL) allows `NULL` entries.</p>' },

    { q: 'Table R(A) has 4 rows with values (1, 2, 2, 3) and Table S(A) has 3 rows with values (2, 2, 4). How many rows are returned by `SELECT * FROM R LEFT OUTER JOIN S ON R.A = S.A;`?',
      o: ['6 rows', '4 rows', '5 rows', '7 rows'], a: 0,
      e: '<p>1. Both `2`s in $R$ match both `2`s in $S$, producing $2 \\times 2 = 4$ matched rows.<br>2. Because it is a <b>LEFT OUTER JOIN</b>, the two unmatched rows in the left table $R$ (`1` and `3`) are also preserved, padded with `NULL` on the right.<br>Total rows $= 4 + 2 =$ <b>6 rows</b>. (An `INNER JOIN` returns 4 rows; `RIGHT JOIN` returns 5 rows; `FULL OUTER JOIN` returns 7 rows.)</p>' },

    { q: 'When examining a Google Chrome or Microsoft Edge `History` SQLite database (`urls` or `visits` table), timestamps are stored as 17-digit WebKit/Chrome integers. What is the epoch start date and time unit of a WebKit/Chrome timestamp?',
      o: ['Microseconds since 1 January 1601 00:00:00 UTC',
          'Seconds since 1 January 2001 00:00:00 UTC',
          'Milliseconds since 1 January 1970 00:00:00 UTC',
          'Seconds since 1 January 1980 00:00:00 UTC'], a: 0,
      e: '<p>Google Chrome / Chromium / WebKit SQLite databases (`History`, `Cookies`, `Downloads`, `Login Data`) store timestamps as <b>microseconds ($10^{-6}\\text{ s}$) elapsed since 1 January 1601 UTC</b> (the same 1601 epoch as Windows FILETIME, except FILETIME uses 100-nanosecond ticks while Chrome divides by 10 to use microseconds). To convert a Chrome timestamp `t` to Unix epoch seconds in SQLite: `(t / 1000000) - 11644473600`.</p>' },

    { q: 'In database concurrency control, why do most real-world RDBMS engines implement "Strict Two-Phase Locking" (Strict 2PL) — where all Exclusive (write) locks are held until the transaction commits or aborts — rather than basic 2PL?',
      o: ['To prevent cascading rollbacks (cascading aborts) and dirty reads, ensuring the schedule is both conflict-serializable and strict/recoverable',
          'To allow transactions to read uncommitted data faster',
          'To eliminate the need for a Write-Ahead Log',
          'Because basic 2PL cannot use shared locks'], a: 0,
      e: '<p>In basic 2PL, a transaction may release a write lock during its shrinking phase <em>before</em> it commits. If another transaction $T_2$ reads that uncommitted value and $T_1$ later aborts, $T_2$ (and any $T_3$ that read from $T_2$) must also be rolled back — a <b>cascading rollback</b>! Holding all Exclusive ($X$) locks until after `COMMIT`/`ABORT` (<b>Strict 2PL</b>) completely prevents dirty reads and cascading aborts.</p>' },

    { q: 'When SQLite is operating in its classical default Rollback Journal mode (`PRAGMA journal_mode = DELETE`) rather than WAL mode, what happens if the power fails or the app crashes in the middle of an uncommitted transaction while a `-journal` file ("hot journal") is present on disk?',
      o: ['The next time any process opens the `.db` file, SQLite automatically reads the original pre-transaction pages from the `-journal` file and restores the database to its clean pre-transaction state (automatic Undo)',
          'Thus-far written changes are permanently committed',
          'The `-journal` file holds new records that are merged forward like a WAL',
          'SQLite deletes the main `.db` file'], a: 0,
      e: '<p>Understand the exact opposite directions of a <b>Rollback Journal (`.db-journal`)</b> vs a <b>Write-Ahead Log (`.db-wal`)</b>:<br>• A <b>Rollback Journal</b> copies the <em>original unmodified pages</em> into `.db-journal` before modifying `.db` in place; if a crash occurs before commit, the leftover "hot journal" is used to <b>UNDO (roll back)</b> the incomplete changes.<br>• A <b>WAL (`.db-wal`)</b> leaves `.db` untouched and appends the <em>new modified pages</em> into `.db-wal`!</p>' }
  ]
});
