window.MPSC.units.push({
  id: 'p4u2',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Database Management Systems',
  marks: 40,
  syllabus: 'Database Applications; Evolution of DB & DBMS; Need for data management, Data models & Database Architecture; E-R Diagrams, Relational Model; E-R to Relational Mapping; Constraints, Keys, Dependencies; Normalization - First, Second, Third & Fourth Normal Forms; BCNF; Introduction to SQL; MySQL, SQLite; Unix Timestamp Data Constraints; Triggers; Database Security; Introduction to Transactions, System & Media Recovery, Two phase Commit Protocol.',

  notes: [
    {
      h: 'Why DBMS carries 40 marks in a forensics paper',
      b: '<p>This unit looks out of place until you notice <b>SQLite</b> and <b>Unix Timestamp</b> named in the syllabus text. Almost every artefact you recover from a phone is a SQLite database: WhatsApp <code>msgstore.db</code>, Android contacts and SMS, iOS <code>sms.db</code>, browser history, call logs. Recovering and interpreting them <em>is</em> mobile forensics.</p>' +
         '<p>So treat this unit as two halves: classical DBMS theory (normalisation, keys, transactions — where the marks are easiest) and the forensic application of SQLite, which links directly to Unit V.</p>'
    },
    {
      h: 'Keys',
      b: '<ul>' +
         '<li><b>Super key</b> — any attribute set that uniquely identifies a tuple.</li>' +
         '<li><b>Candidate key</b> — a minimal super key (no attribute can be removed without losing uniqueness).</li>' +
         '<li><b>Primary key</b> — the candidate key chosen by the designer; cannot be NULL.</li>' +
         '<li><b>Alternate key</b> — a candidate key not chosen as primary.</li>' +
         '<li><b>Foreign key</b> — an attribute referencing the primary key of another relation; enforces <b>referential integrity</b>.</li>' +
         '<li><b>Composite key</b> — a key made of more than one attribute.</li>' +
         '</ul>' +
         '<p>Every primary key is a candidate key, and every candidate key is a super key. The reverse does not hold — a standard MCQ framing.</p>'
    },
    {
      h: 'Normalisation',
      b: '<p>Normalisation removes redundancy and the insertion, update and deletion anomalies it causes.</p>' +
         '<table>' +
         '<tr><th>Form</th><th>Requirement</th><th>Removes</th></tr>' +
         '<tr><td><b>1NF</b></td><td>All attributes atomic; no repeating groups</td><td>Multi-valued cells</td></tr>' +
         '<tr><td><b>2NF</b></td><td>1NF + no partial dependency of a non-prime attribute on part of a composite key</td><td>Partial dependencies</td></tr>' +
         '<tr><td><b>3NF</b></td><td>2NF + no transitive dependency of a non-prime attribute</td><td>Transitive dependencies</td></tr>' +
         '<tr><td><b>BCNF</b></td><td>For every non-trivial X→Y, X is a super key</td><td>Anomalies 3NF still permits</td></tr>' +
         '<tr><td><b>4NF</b></td><td>BCNF + no non-trivial multi-valued dependency</td><td>Multi-valued dependencies</td></tr>' +
         '</table>' +
         '<p>Mnemonic for the classic line: <em>every non-key attribute must depend on the key (1NF→2NF), the whole key (2NF→3NF), and nothing but the key (3NF→BCNF), so help me Codd.</em></p>' +
         '<p>Note that 2NF violations require a <b>composite</b> primary key. If the key is a single attribute, a 1NF relation is automatically in 2NF — a frequent exam point.</p>'
    },
    {
      h: 'ACID and transactions',
      b: '<ul>' +
         '<li><b>Atomicity</b> — all operations commit or none do.</li>' +
         '<li><b>Consistency</b> — a transaction moves the database from one valid state to another.</li>' +
         '<li><b>Isolation</b> — concurrent transactions do not observe each other\'s intermediate state.</li>' +
         '<li><b>Durability</b> — once committed, changes survive system failure.</li>' +
         '</ul>' +
         '<p><b>Two-Phase Commit (2PC)</b>, named in the syllabus, coordinates a distributed transaction: a <em>voting/prepare</em> phase where the coordinator asks all participants to prepare and they reply commit-or-abort, then a <em>decision</em> phase where the coordinator broadcasts the outcome. Its weakness is <b>blocking</b> — if the coordinator fails after participants vote, they wait indefinitely.</p>' +
         '<p>Do not confuse 2PC with <b>two-phase locking (2PL)</b>, a concurrency-control protocol with a growing and a shrinking phase that guarantees serialisability. The similar names are deliberately exploited in MCQs.</p>'
    },
    {
      h: 'SQLite and Unix timestamps — the forensic half',
      b: '<p><b>SQLite</b> is a serverless, zero-configuration, single-file database engine. The whole database is one file, which is exactly why it dominates mobile apps and why it matters to you.</p>' +
         '<ul>' +
         '<li>Deleted rows are often <em>not</em> erased — they remain in <b>free pages</b> and unallocated areas of the database file until vacuumed, so deleted messages are frequently recoverable.</li>' +
         '<li>Journal modes matter: a <code>-journal</code> rollback file or a <code>-wal</code> (Write-Ahead Log) file sits beside the database. <b>The WAL can hold records not yet merged into the main file</b> — seizing the <code>.db</code> alone and leaving the <code>-wal</code> behind loses evidence.</li>' +
         '</ul>' +
         '<p><b>Timestamps</b> you must be able to convert:</p>' +
         '<table>' +
         '<tr><th>Epoch</th><th>Starts at</th><th>Unit</th><th>Seen in</th></tr>' +
         '<tr><td>Unix</td><td>1 Jan 1970 UTC</td><td>seconds</td><td>Linux, Android</td></tr>' +
         '<tr><td>Unix (ms)</td><td>1 Jan 1970 UTC</td><td>milliseconds</td><td>Java, Android apps</td></tr>' +
         '<tr><td>Apple/Mac absolute</td><td>1 Jan 2001 UTC</td><td>seconds</td><td>iOS, macOS, Plists</td></tr>' +
         '<tr><td>Windows FILETIME</td><td>1 Jan 1601 UTC</td><td>100-nanosecond</td><td>NTFS, registry</td></tr>' +
         '</table>' +
         '<div class="tip"><b>Trap.</b> An iOS timestamp read as a Unix timestamp lands 31 years early. Getting the epoch wrong does not produce an obviously absurd date — it produces a plausible wrong one, which is far more dangerous in a report.</div>'
    },
    {
      h: 'Database security and triggers',
      b: '<p><b>Triggers</b> are procedural code fired automatically on INSERT, UPDATE or DELETE. They enforce complex integrity rules and, importantly here, maintain <b>audit trails</b> — a trigger writing every change to a log table is a common evidentiary source.</p>' +
         '<p>Security concepts: <b>authentication</b> (who you are) vs <b>authorisation</b> (what you may do); <code>GRANT</code> and <code>REVOKE</code> as SQL\'s Data Control Language; <b>views</b> as a means of restricting visible columns and rows; and <b>SQL injection</b>, defeated by parameterised queries rather than by input filtering.</p>' +
         '<p><b>Recovery:</b> <em>system recovery</em> handles a crash with the disk intact, replaying the log (redo committed, undo uncommitted). <em>Media recovery</em> handles physical loss of the disk, restoring from backup and rolling forward through archived logs.</p>'
    },
    {
      h: 'Database architecture and data models',
      b: '<p>The syllabus names "Data models & Database Architecture" separately from the relational model — this is the ANSI-SPARC <b>three-level architecture</b>, and it is tested as a standalone topic.</p>' +
         '<table>' +
         '<tr><th>Level</th><th>Describes</th><th>Example change</th></tr>' +
         '<tr><td><b>External</b></td><td>Individual user/application views</td><td>Adding a new report view</td></tr>' +
         '<tr><td><b>Conceptual</b></td><td>The whole logical structure — entities, relationships, constraints — for the community of users</td><td>Adding a new table or column</td></tr>' +
         '<tr><td><b>Internal</b></td><td>Physical storage — file organisation, indexes, access paths</td><td>Adding an index, changing storage engine</td></tr>' +
         '</table>' +
         '<p>Two kinds of <b>data independence</b> follow directly from this stack:</p>' +
         '<ul>' +
         '<li><b>Physical data independence</b> — change the internal schema (storage/indexing) without touching the conceptual schema. Relatively easy to achieve; this is what lets a DBA add an index with zero application changes.</li>' +
         '<li><b>Logical data independence</b> — change the conceptual schema without touching external schemas/applications. Harder, because more objects depend on the conceptual level.</li>' +
         '</ul>' +
         '<div class="tip"><b>Trap.</b> Questions often ask which independence is "harder to achieve" — it is <b>logical</b>, not physical, precisely because the conceptual schema sits between the internal level and every external view.</div>' +
         '<p>Data model families to be able to name: <b>hierarchical</b> (tree, each child has one parent — old IMS systems), <b>network</b> (graph, CODASYL owner-member sets, a child can have multiple parents), <b>relational</b> (tables/tuples — Codd, 1970), and <b>E-R</b> (a design/conceptual-modelling tool, not a storage model in itself).</p>'
    },
    {
      h: 'E-R to Relational Mapping',
      b: '<p>Converting a conceptual E-R diagram into relational tables follows fixed rules — a favourite short-answer/MCQ source.</p>' +
         '<ul>' +
         '<li><b>Strong entity</b> → its own table; entity\'s key becomes the table\'s primary key.</li>' +
         '<li><b>Weak entity</b> → its own table, but its primary key is the <b>partial key combined with the primary key of the owner (identifying) entity</b>, which is also carried in as a foreign key. A weak entity can never stand alone because it has no candidate key of its own.</li>' +
         '<li><b>1:1 relationship</b> → post the primary key of either side into the other as a foreign key (commonly placed on the side with mandatory/total participation).</li>' +
         '<li><b>1:N relationship</b> → the primary key of the "1" side is posted as a foreign key into the table on the <b>"N" (many) side</b>.</li>' +
         '<li><b>M:N relationship</b> → neither entity table gets a foreign key. Instead create a new <b>junction/bridge table</b> holding foreign keys to both entities; the pair (or the pair plus a relationship attribute) forms its primary key.</li>' +
         '<li><b>Multi-valued attribute</b> → its own table, with a foreign key back to the owning entity.</li>' +
         '</ul>' +
         '<div class="tip"><b>Trap.</b> Placing the foreign key on the wrong side of a 1:N relationship (i.e. on the "1" side instead of the "N" side) is the single most common mapping error tested.</div>'
    },
    {
      h: 'Relational model: integrity constraints and relational algebra',
      b: '<p>Three constraint types every relation must satisfy:</p>' +
         '<ul>' +
         '<li><b>Domain constraint</b> — every attribute value must come from its declared domain (type/range).</li>' +
         '<li><b>Entity integrity</b> — no attribute participating in the primary key may be NULL.</li>' +
         '<li><b>Referential integrity</b> — a foreign key value must either be NULL or match an existing primary-key value in the referenced relation; it cannot reference a non-existent row.</li>' +
         '</ul>' +
         '<p><b>Relational algebra</b> — the procedural query language the relational model is theoretically built on:</p>' +
         '<table>' +
         '<tr><th>Operator</th><th>Symbol</th><th>Acts on</th></tr>' +
         '<tr><td>Select</td><td>σ</td><td><b>Rows</b> — filters tuples matching a predicate; column count unchanged</td></tr>' +
         '<tr><td>Project</td><td>π</td><td><b>Columns</b> — keeps only specified attributes; row count may shrink if duplicates collapse</td></tr>' +
         '<tr><td>Union / Set difference</td><td>∪ / −</td><td>Two union-compatible relations</td></tr>' +
         '<tr><td>Cartesian product</td><td>×</td><td>Every tuple of R paired with every tuple of S</td></tr>' +
         '<tr><td>Rename</td><td>ρ</td><td>Renames a relation or its attributes</td></tr>' +
         '<tr><td>Join</td><td>⋈</td><td>Derived from product + select; a <b>natural join</b> auto-equates and de-duplicates common attribute names</td></tr>' +
         '</table>' +
         '<div class="tip"><b>Trap.</b> σ (select) and π (project) are constantly swapped in options — σ trims <em>rows</em>, π trims <em>columns</em>. Read the option as "acts on rows/columns" before matching it to a symbol.</div>'
    },
    {
      h: 'SQL joins and query essentials',
      b: '<p>Join semantics, tested both as theory and as "what will this query return":</p>' +
         '<ul>' +
         '<li><b>INNER JOIN</b> — only rows with a match on both sides.</li>' +
         '<li><b>LEFT (OUTER) JOIN</b> — every row from the left table; unmatched right-side columns come back NULL.</li>' +
         '<li><b>RIGHT (OUTER) JOIN</b> — the mirror image of LEFT.</li>' +
         '<li><b>FULL OUTER JOIN</b> — every row from both sides, NULL-padded where unmatched; neither MySQL nor pre-3.39 SQLite support it natively — emulate with a LEFT JOIN <code>UNION</code> a RIGHT JOIN.</li>' +
         '</ul>' +
         '<p><b>Logical order of execution</b> of a SELECT (not its written order): <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</code>. This is why you can filter on a raw column in WHERE but must filter on an aggregate in HAVING — the aggregate does not exist yet when WHERE runs.</p>' +
         '<p>Aggregates — COUNT, SUM, AVG, MIN, MAX — operate per group; WHERE filters rows <em>before</em> grouping, HAVING filters groups <em>after</em>.</p>' +
         '<p><b>MySQL vs SQLite</b>, both named in the syllabus: MySQL is client-server with strict column typing; SQLite is a serverless single embedded file with dynamic <em>type affinity</em> (a column declared INTEGER will still happily store text). Historically (pre-3.39, 2022) SQLite supported only LEFT JOIN, not RIGHT or FULL OUTER JOIN — MySQL has always supported RIGHT JOIN.</p>'
    },
    {
      h: 'Concurrency control and transaction isolation levels',
      b: '<p>Running transactions concurrently without control produces three named anomalies:</p>' +
         '<ul>' +
         '<li><b>Dirty read</b> — reading a value written by a transaction that has not yet committed (and might later roll back).</li>' +
         '<li><b>Non-repeatable read</b> — re-reading the same row within one transaction and getting a different value because another transaction committed an update in between.</li>' +
         '<li><b>Phantom read</b> — re-running the same range query within one transaction and getting a different <em>set of rows</em> because another transaction inserted or deleted a matching row in between.</li>' +
         '</ul>' +
         '<p>The SQL standard defines four isolation levels as a ladder, each preventing one more anomaly than the last:</p>' +
         '<table>' +
         '<tr><th>Level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom read</th></tr>' +
         '<tr><td>Read Uncommitted</td><td>Possible</td><td>Possible</td><td>Possible</td></tr>' +
         '<tr><td>Read Committed</td><td>Prevented</td><td>Possible</td><td>Possible</td></tr>' +
         '<tr><td>Repeatable Read</td><td>Prevented</td><td>Prevented</td><td>Possible</td></tr>' +
         '<tr><td>Serializable</td><td>Prevented</td><td>Prevented</td><td>Prevented</td></tr>' +
         '</table>' +
         '<p>This connects back to <b>two-phase locking (2PL)</b> from the ACID note: strict 2PL — holding all exclusive locks until commit — is the classic mechanism used to implement Serializable isolation.</p>' +
         '<div class="tip"><b>Trap.</b> Per the ANSI SQL standard, Repeatable Read still permits phantom reads; only Serializable rules them out. (Some engines, e.g. InnoDB\'s Repeatable Read, block most phantoms via gap locking in practice — but for exam purposes, go by the standard ladder above, not a specific engine\'s implementation.)</div>'
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
      e: '<p>A dirty read reads <b>uncommitted</b> data. If the writing transaction later rolls back, the reader has seen a value that never truly existed in the database — the most dangerous of the three standard anomalies, and the only one still possible even at Read Committed\'s neighbour, Read Uncommitted.</p><p>Plain SELECTs do not normally block each other, which is why (d) is not how relational engines behave by default.</p>' }
  ]
});
