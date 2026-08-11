// ============================================
// POSTGRES & SQL — 6-stage path, same shape as the Python module
// (src/data/python/lessons.ts). Real content, not filler: stages 2, 4, and
// 5 quote directly from the user's own mpsc-backend project
// (~/workspace/projects/personal/mpsc-backend/load_into_droplet.py and
// questions/models.py) — the exact script that loads 73,405 real questions
// into the shiksha-dev droplet's live `mpsc_study` Postgres database.
// Stages 1 and 3 are honest translations/extensions of that same schema
// (raw SQL DDL for a Django model; a join query you could run against it)
// rather than copy-pasted files, and are labelled without a `source` field
// so they don't misrepresent themselves as verbatim quotes.
// ============================================

import type { QuizQuestion } from '@/lib/quizTypes';

export interface PgStage {
  id: string;
  title: string;
  blurb: string;
  notes: string[];
  code?: { label: string; source?: string; snippet: string };
  quiz: QuizQuestion[];
}

export const pgStages: PgStage[] = [
  {
    id: 'tables-types',
    title: '1. Tables & types',
    blurb: 'CREATE TABLE and the column types that show up in almost every real schema.',
    notes: [
      'Every table needs a primary key — a column (or set of columns) guaranteed unique, used to reference a row from elsewhere.',
      '`varchar(n)` caps a string at n characters; `text` is unbounded — Postgres stores both the same way, so `text` is fine unless you specifically want the length check.',
      '`jsonb` stores JSON in a parsed binary form (indexable, queryable with `->`/`->>`), not just as a string — the right type for a column like MCQ options.',
      '`timestamptz` stores a timestamp with timezone awareness — almost always the right choice over plain `timestamp` for anything user-facing.',
    ],
    code: {
      label: 'A raw-SQL rendering of questions/models.py\'s Question model',
      snippet: `CREATE TABLE questions (\n    id            varchar(50)  PRIMARY KEY,\n    paper_id      varchar(255) REFERENCES papers(id) ON DELETE SET NULL,\n    subject       varchar(100) NOT NULL DEFAULT 'gk',\n    topic         varchar(255) NOT NULL,\n    question      text         NOT NULL,\n    options       jsonb        NOT NULL,\n    answer_index  integer      NOT NULL,\n    year          integer,\n    created_at    timestamptz  NOT NULL DEFAULT now()\n);`,
    },
    quiz: [
      { q: 'Why store MCQ options as `jsonb` instead of a comma-joined `text` column?', options: ['jsonb is always smaller on disk', 'You can query/index into individual elements; a joined string is opaque to SQL', 'text columns have a 255-char limit', 'jsonb is required for arrays'], answerIndex: 1, explanation: 'jsonb keeps the structure queryable (`options->0`, `jsonb_array_length(options)`, etc.) — a comma-joined string is just a blob you\'d have to parse in application code.' },
      { q: 'What does a PRIMARY KEY guarantee?', options: ['The column is indexed for fast reads only', 'Every value in that column is unique and not null', 'The table can have multiple primary keys', 'It auto-increments'], answerIndex: 1, explanation: 'A primary key is a uniqueness + not-null constraint, enforced by the database on every insert/update.' },
      { q: '`timestamptz` differs from `timestamp` by:', options: ['Storing extra decimal precision', 'Storing/normalizing timezone information', 'Being faster to query', 'Requiring a default value'], answerIndex: 1, explanation: '`timestamptz` converts to UTC on write and back to the session timezone on read — `timestamp` has no timezone concept at all, which causes real bugs across servers in different zones.' },
    ],
  },
  {
    id: 'keys-constraints',
    title: '2. Keys, constraints & NULL',
    blurb: 'FOREIGN KEY, NOT NULL, UNIQUE — how the database refuses to store data that breaks your own rules.',
    notes: [
      '`REFERENCES papers(id)` makes `paper_id` a foreign key — Postgres rejects any insert pointing at a paper id that doesn\'t exist.',
      '`ON DELETE SET NULL` decides what happens to a question row if its paper is deleted: the link is nulled out instead of the question row being deleted too (`ON DELETE CASCADE` would delete it).',
      '`NOT NULL` is enforced at insert/update time — the real load script below has to explicitly skip rows that would violate it, because Postgres will reject the whole batch otherwise.',
      '`UNIQUE` on `question_id` (see `models.py`\'s `unique=True`) is a second, independent guarantee from the primary key — you can have unique columns that aren\'t the PK.',
    ],
    quiz: [
      { q: 'A row tries to insert `paper_id = \'p-9999\'` but no paper with that id exists. What happens?', options: ['Postgres inserts it with a warning', 'The insert is rejected — foreign key violation', 'paper_id is silently set to NULL', 'It depends on ON DELETE'], answerIndex: 1, explanation: 'The foreign key constraint is checked on INSERT too, not just DELETE — a reference to a nonexistent row is always rejected unless you catch it in application code first (which is exactly what load_into_droplet.py does below).' },
      { q: '`ON DELETE SET NULL` on a foreign key means:', options: ['You can never delete the referenced row', 'Deleting the parent row also deletes every referencing row', 'Deleting the parent row nulls out the FK column on referencing rows instead of deleting them', 'The constraint is ignored on delete'], answerIndex: 2, explanation: 'SET NULL keeps the child row alive but severs the link — the alternative, CASCADE, would delete the questions too.' },
      { q: 'Why does the real load script below check `if year is None: continue` before inserting a paper?', options: ['Performance — skipping is faster', 'papers.year is NOT NULL, so an insert with a missing year would fail the whole batch', 'It\'s just a style preference', 'Postgres requires year to be positive'], answerIndex: 1, explanation: 'A NOT NULL column has zero tolerance — one bad row can abort an entire multi-row insert if you don\'t filter it out first in application code.' },
    ],
  },
  {
    id: 'querying',
    title: '3. Querying: SELECT, JOIN, WHERE',
    blurb: 'Reading data back out — filters, joins across the FK you just defined, grouping and ordering.',
    notes: [
      '`WHERE` filters rows before grouping; `HAVING` filters groups after — a common mix-up when a `WHERE count(*) > 5` throws a syntax error.',
      '`JOIN papers p ON p.id = q.paper_id` walks the same foreign key from stage 2, pulling paper columns onto each question row.',
      '`GROUP BY` collapses rows sharing the grouped columns into one row per group — every non-aggregated column in SELECT must appear in GROUP BY.',
      '`ORDER BY ... LIMIT n` is how you page or cap a result set — always pair LIMIT with ORDER BY, an unordered LIMIT is arbitrary.',
    ],
    code: {
      label: 'A join you could run against this exact schema',
      snippet: `SELECT p.exam_name, p.year, count(*) AS questions\nFROM questions q\nJOIN papers p ON p.id = q.paper_id\nWHERE q.subject = 'gk'\nGROUP BY p.exam_name, p.year\nORDER BY p.year DESC\nLIMIT 10;`,
    },
    quiz: [
      { q: 'In the query above, why must `p.exam_name` and `p.year` both appear in GROUP BY?', options: ['They\'re the only text columns', 'Every selected column that isn\'t wrapped in an aggregate (like count()) must be grouped', 'GROUP BY requires exactly 2 columns', 'They\'re foreign keys'], answerIndex: 1, explanation: 'Postgres needs to know how to collapse rows into groups — any plain column in SELECT has to define part of that grouping, or the database can\'t tell which row\'s value to show.' },
      { q: 'What does `WHERE q.subject = \'gk\'` do relative to the JOIN?', options: ['Filters rows after grouping', 'Filters individual question rows before they\'re grouped', 'Filters which papers exist', 'Has no effect with a GROUP BY present'], answerIndex: 1, explanation: 'WHERE runs before GROUP BY — it trims the row set the grouping then operates on.' },
      { q: 'Why pair `LIMIT 10` with `ORDER BY p.year DESC` instead of using LIMIT alone?', options: ['LIMIT requires ORDER BY syntactically', 'Without ORDER BY, which 10 rows you get back is arbitrary/unspecified', 'ORDER BY makes the query run faster', 'They must always be used together for jsonb columns'], answerIndex: 1, explanation: 'Postgres doesn\'t guarantee row order without an explicit ORDER BY — LIMIT on an unordered result just grabs whichever 10 rows the query planner happens to produce first.' },
    ],
  },
  {
    id: 'bulk-insert',
    title: '4. Bulk INSERT & upsert',
    blurb: 'Loading thousands of rows efficiently, and handling re-runs without duplicating data — from the script that actually does this.',
    notes: [
      '`execute_values()` (psycopg2) rewrites one INSERT template into a single multi-row statement — one round trip for thousands of rows instead of one query per row.',
      '`ON CONFLICT (id) DO NOTHING` makes the insert idempotent: re-running the same load twice doesn\'t error or duplicate, it just skips rows that already exist.',
      'The alternative, `ON CONFLICT (id) DO UPDATE SET ...`, would overwrite the existing row instead of skipping it — the right choice depends on whether a re-run should refresh or preserve existing data.',
      'This script filters bad rows in Python *before* the INSERT (missing year, dangling paper_id) rather than relying on the database to reject them — cheaper to catch in a loop than to have Postgres abort a 70,000-row batch on row #40,000.',
    ],
    code: {
      label: 'load_into_droplet.py, unedited',
      source: '~/workspace/projects/personal/mpsc-backend/load_into_droplet.py',
      snippet: `psycopg2.extras.execute_values(\n    cur,\n    """\n    INSERT INTO papers (id, exam_type, exam_name, post, paper_number, paper_subject, year, source_file)\n    VALUES %s\n    ON CONFLICT (id) DO NOTHING\n    """,\n    paper_rows,\n)\nprint(f"Papers inserted (or already present): {cur.rowcount}")`,
    },
    quiz: [
      { q: 'What problem does `execute_values()` solve versus a plain `for row in rows: cur.execute(insert_sql, row)` loop?', options: ['It validates data types', 'It batches all rows into one round trip instead of one query per row', 'It automatically creates the table', 'It sorts the rows first'], answerIndex: 1, explanation: 'One INSERT with thousands of VALUES tuples is dramatically faster than thousands of separate INSERT statements, each paying its own network round trip.' },
      { q: 'Re-running this script a second time on the same file — what happens to rows already loaded?', options: ['They error out and stop the script', 'They get inserted twice', 'ON CONFLICT (id) DO NOTHING skips them silently', 'They get deleted first'], answerIndex: 2, explanation: 'Because `id` is the primary key and the conflict target, a duplicate id just gets skipped — that\'s what makes the script safe to re-run.' },
      { q: 'Why does the script null out `paper_id` in Python instead of just letting the INSERT fail on a bad foreign key?', options: ['Postgres foreign keys can\'t be checked on insert', 'To keep the rest of a large batch from being rejected over a few bad references', 'It\'s required by execute_values', 'paper_id isn\'t actually a foreign key'], answerIndex: 1, explanation: 'One dangling reference shouldn\'t sink an entire multi-thousand-row batch — cleaning it up before the INSERT keeps the batch atomic and successful.' },
    ],
  },
  {
    id: 'indexes-aggregates',
    title: '5. Indexes & aggregates',
    blurb: 'Making the queries from stage 3 fast at scale, and the COUNT/GROUP BY patterns you\'ll reach for constantly.',
    notes: [
      'An index is a separate data structure Postgres maintains so it can find matching rows without scanning the whole table — the tradeoff is slower writes and extra storage.',
      '`CREATE INDEX ON questions (paper_id, topic)` is what Django\'s `models.Index(fields=["paper_id", "topic"])` actually generates — a composite index, most useful when both columns are filtered/joined on together.',
      'Aggregates (`count()`, `sum()`, `avg()`) collapse many rows into one number — `count(*)` counts rows, `count(column)` counts non-null values in that column specifically, which aren\'t always the same.',
      'A missing index doesn\'t break a query, it just makes Postgres sequentially scan the whole table — correctness and performance are separate concerns worth checking independently.',
    ],
    code: {
      label: 'The real sanity-check at the end of load_into_droplet.py',
      source: '~/workspace/projects/personal/mpsc-backend/load_into_droplet.py',
      snippet: `cur.execute("SELECT count(*) FROM papers")\nprint(f"Total papers now: {cur.fetchone()[0]}")\ncur.execute("SELECT count(*) FROM questions")\nprint(f"Total questions now: {cur.fetchone()[0]}")`,
    },
    quiz: [
      { q: 'What is the real cost of adding an index?', options: ['Nothing, indexes are free', 'Slower writes (insert/update/delete) and extra disk space, in exchange for faster reads', 'Slower reads', 'It only affects SELECT * queries'], answerIndex: 1, explanation: 'Every index has to be updated whenever the underlying data changes — more indexes means more work per write, which is why you index columns you actually filter/join on, not every column.' },
      { q: '`models.Index(fields=["paper_id", "topic"])` creates an index most useful for queries that:', options: ['Filter or join on paper_id and/or topic together', 'Filter only on unrelated columns', 'Sort by created_at', 'Never actually improve query speed'], answerIndex: 0, explanation: 'A composite index on (paper_id, topic) speeds up lookups that use paper_id alone, or paper_id + topic together — but not a query filtering on topic alone (column order in a composite index matters).' },
      { q: '`count(answer_source)` vs `count(*)` on the same table — when do they differ?', options: ['Never, they\'re identical', 'When answer_source has any NULL values — count(column) skips them, count(*) doesn\'t', 'count(column) is always faster', 'Only for jsonb columns'], answerIndex: 1, explanation: 'count(*) counts every row regardless of nulls; count(column) only counts rows where that specific column is non-null — a real source of off-by-some-N bugs if you assume they match.' },
    ],
  },
  {
    id: 'real-project',
    title: '6. Real project — read your own database',
    blurb: 'Everything above is the real schema and pipeline behind this app\'s own question bank. Go look at it directly.',
    notes: [
      '`~/workspace/projects/personal/mpsc-backend/questions/models.py` — the Django models that generate the schema you just read, including the real `Index` and `unique=True` constraints.',
      '`~/workspace/projects/personal/mpsc-backend/load_into_droplet.py` — the exact bulk-load script quoted above; run with `python3 load_into_droplet.py mpsc_bank_converted.json` on the shiksha-dev droplet.',
      'To look at the live data instead of just the code: `ssh shiksha-dev`, then `psql` into the `mpsc_study` database and run `\\dt` to list tables, `\\d questions` to see the real column types and constraints Postgres actually enforces.',
      'This is the same "read real code you already trust" idea as the Python module\'s stage 6 — the schema here isn\'t a teaching example, it\'s the database this very app\'s question bank was loaded into.',
    ],
    quiz: [],
  },
];
