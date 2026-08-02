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
      e: '<p>Standard Chen notation: <b>rectangle</b> = entity set, <b>ellipse</b> = attribute, <b>diamond</b> = relationship set, <b>double rectangle</b> = weak entity, <b>double diamond</b> = identifying relationship, <b>underlined attribute</b> = primary key.</p>' }
  ]
});
