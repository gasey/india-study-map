# Dev log

Append-only log of what got built, when, and why — written at the end of
(or when pausing) any nontrivial work session on this project. Newest
entry on top. Not a changelog for users; a memory aid for future sessions
(human or AI) so nobody has to re-derive context from git log + guesswork.

Each entry: **what shipped**, **why**, **what's still open**.

---

## 2026-08-03 — Descriptive sub-part questions, admin audit trail, versatile review workflow

**What shipped:**
- `questions` (Postgres) and `BankQuestion` (frontend) gained a `type:
  'mcq' | 'descriptive'` discriminator plus `subparts` — lettered (a..z)
  sub-questions, each independently flaggable/correctable. `isMcqQuestion()`
  / `normalizeQuestion()` helpers keep every existing static-bundle record
  valid with zero data-file rewrites (type defaults to 'mcq' when absent).
  3 of State Tax Officer's 5 essay/précis-letter records got real `subparts`
  (their garbled OCR-bled "options" were genuinely lettered sub-questions in
  disguise); the other 2 (plain essay topic-choice lists) kept `options` as
  a display-only reference list.
- New `src/modules/mpsc/DescriptiveQuestionCard.tsx` — the one global format
  for rendering a descriptive question + its sub-parts, each with its own
  flag/note/comments panel. Fixed a real bug in the same pass: the
  corrections overlay in `StateTaxOfficerEnhanced.tsx` only ever applied to
  the MCQ pool, never to descriptive questions — corrections are now merged
  onto the full pool before splitting into tabs.
- `question_audit_log` (new Postgres table): every correction, report
  status change, and comment moderation action now writes one row here —
  actor, before/after snapshot, note, timestamp. Powers a new **History**
  tab in AdminPanel; this is the actual "who changed what, when" the admin
  system was missing.
- `question_reports` gained `subpart_label` + `suggested_text` (free-text
  suggested fix, for flags with no MCQ answer index); `question_corrections`
  gained `corrected_subparts`; `question_comments` gained `parent_id` (one
  level of reply), `deleted_at`/`updated_at` (edit/soft-delete), `is_pinned`
  (admin pin). All wired into `QuestionReviewPanel.tsx`.
- AdminPanel restructured into 5 tabs: **Reports** (now filterable by issue
  type, date range, search, has-suggestion, sort, paginated — was a single
  status dropdown with a hardcoded top-500), **History** (new), **Comments**
  (new — browse/moderate every comment on a bank), **Users** (existing,
  now with per-user activity counts), **Dashboard** (new — headline stats +
  live activity feed). New shared `FilterBar.tsx` primitives back the
  Reports/Comments filter bars.
- Generalized the whole review system to `mpsc-old-questions` (6,380 Qs) —
  it had none of this before. `MpscPage.tsx` now fetches/overlays
  corrections the same way State Tax Officer does; `QuestionsTable.tsx`
  swaps its dead-end `ReportModal` popup for the shared
  `QuestionReviewPanel`; a new admin-gated Admin tab was added. Retired
  `ReportModal.tsx` and its legacy `/api/mpsc/report` write path (the old
  `reports` table stays in Postgres, untouched, just no longer written to).
- Fixed 2 live mixed-content bugs found while touching this code:
  `useMpscData.ts`'s bank fetch and (moot, since the component was deleted)
  `ReportModal.tsx`'s report submission both still hit
  `http://134.209.154.122/mpsc-api/...` — the same bug fixed for State Tax
  Officer's API client on 2026-08-02, just never applied here. Now
  `https://api.map.hawayu.in`.

**Why:** user asked for descriptive questions with lettered sub-parts,
admin change-history with attribution, more comprehensive admin filtering,
and a more versatile flag/correction/comment workflow — plus generalizing
the review system that had only ever covered one of the two banks.

**Verified live (browser + curl, not just compiled):** full round-trip on
both banks — flagged a descriptive sub-part with free text, saw it in admin
Reports with the right filter facets, applied a sub-part correction via the
new sub-parts editor, confirmed it overlaid live in the Descriptive tab
without a reload, confirmed both a `correction` and `report_status` entry
appeared in History with correct before/after, posted a comment, replied to
it, pinned it as admin, confirmed pinned-first ordering and the Comments
moderation tab. Repeated the flag → admin filter → correction round-trip on
`mpsc-old-questions` to confirm generalization and that the bank now
fetches over HTTPS (164 papers / 6,380 questions, matching the live DB).
All test data (reports/corrections/comments/audit rows) cleaned up
afterward — tables are back to empty.

**What's still open:**
- Corrections aren't threaded into `data.papers`/`sittings` inside
  `useMpscData.ts` — a paper launched from the Library tab still runs with
  uncorrected text/answers; only Browse/Practice reflects corrections.
- No bulk sub-part correction tool — each garbled sub-part is still fixed
  one report at a time, same limitation as the 2026-08-02 MCQ option fix.
- The Setu nav/design refactor (`HANDOFF-standalone.html`) and the
  PDF→OCR ingestion pipeline for new exams are deliberately out of scope
  here — recommendation for the latter (page-image + Claude vision
  extraction into a staging table, reusing this session's audit/correction
  UI for review) is recorded in chat, not yet built.

---

## 2026-08-02 (evening) — Login "Failed to fetch": mpsc-api now on HTTPS

**What shipped:**
- mpsc-api is now served over HTTPS at `https://api.map.hawayu.in`,
  replacing the plain-HTTP `http://134.209.154.122/mpsc-api` the frontend
  used before. `src/lib/mpscApi.ts`'s `API_BASE` updated accordingly.
- New DNS A record: `api.map.hawayu.in` → `134.209.154.122` (Hostinger).
- New nginx server block on the droplet, `api.map.hawayu.in`, proxying
  root path straight to the mpsc-api service on `127.0.0.1:8020` (no
  `/mpsc-api/` prefix anymore — this subdomain is dedicated to the API,
  so paths are `https://api.map.hawayu.in/health`,
  `.../api/auth/login`, etc., not prefixed). Config recorded at
  `mpsc_api/ops/nginx-api.map.hawayu.in.conf` in that repo.
- Let's Encrypt cert via certbot (`certbot --nginx -d api.map.hawayu.in`),
  auto-renews, expires 2026-10-31 (will auto-renew before then).
- The old `http://134.209.154.122/mpsc-api/` path still works (untouched,
  separate nginx server block) — not removed, just no longer used by the
  frontend. Could be torn down later if nothing else references it.

**Why:** user reported login failing with "Failed to fetch". Root cause:
the deployed site is HTTPS (Vercel), but the API was plain HTTP — browsers
silently block that as mixed active content, and the resulting error
(`TypeError: Failed to fetch`) gives no hint that HTTPS is the problem.
Confirmed by reproducing the exact error via `fetch()` from the live
`https://india-study-map.vercel.app` origin before touching anything.

The droplet's existing SSL certs are all for `*.shikshacom.com` (a
different, unrelated project) — reusing one of those would have been the
fastest fix but would mix this personal project's traffic into the
Shiksha domain's namespace. Asked the user; they had `map.hawayu.in`
already pointed at Vercel for the frontend itself, so used
`api.map.hawayu.in` as a clean, separate subdomain for the API instead.

**Verified live:** reproduced the mixed-content failure via `fetch()` from
`https://india-study-map.vercel.app`'s own origin first (confirmed root
cause before fixing), then after the nginx+certbot setup, confirmed
`https://api.map.hawayu.in/health` and a real login both succeed from
that same HTTPS origin, and ran the full login flow through the actual
UI (not just a bare fetch) against the new endpoint.

**What's still open:**
- The Vercel deployment needs to actually pick up this commit and
  redeploy before the live site is fixed — should happen automatically
  on push to `main`, but worth confirming the deploy succeeds (this repo
  has had silent auto-deploy failures before — see the courses-navigation
  entry pattern from the india-study-map sibling projects' history).
- Old IP-based `http://134.209.154.122/mpsc-api/` nginx block is now
  dead weight (nothing points at it) but wasn't removed — low priority
  cleanup.

---

## 2026-08-02 (later same day) — Non-MCQ questions: descriptive viewer + stem/option correction

**What shipped:**
- 2 more accounts seeded: `user1`/`user2`, role=`user` (not admin) — recorded
  in `mpsc_api/seed_accounts.py`.
- `question_corrections` gained two columns: `corrected_stem` and
  `corrected_options` (jsonb). Admin corrections can now rewrite the
  question text and all 4 option strings, not just the answer index.
  - **Underlined-word fix:** many ENG-GRAMMAR questions ask to identify
    the part of speech / voice / error of "the underlined word" in a
    sentence, but OCR extraction lost the original underline — the target
    word is unrecoverable from context. Admin can now retype the stem
    wrapping the target word in `__double_underscores__`; the frontend
    (`renderEmphasis()` in `StateTaxOfficerEnhanced.tsx`) renders that as
    `<u>`. Wired into every place a question stem is shown (Question
    Bank, Descriptive tab, mock runner, mock review).
  - **Garbled-options fix:** two-column OCR bleed regularly merges a
    question's real options with fragments of the next/previous question
    (e.g. `"preposition (c) noun"` instead of just `"Noun"`). Admin's
    correction form now has 4 editable option inputs, and the "correct
    answer" dropdown reads from the *live edited* option text, not the
    original — so admin can clean up the options first, then pick which
    one is right.
- New 📄 **Descriptive & Essay tab**: the ~5 essay/précis-letter prompts
  that were being silently dropped from the Question Bank (they have no
  single correct answer, so they can't be scored as MCQs) are now shown
  read-only, in original order, with study-pointer framing instead of a
  worked answer — same Flag/Note/Comments panel as scored questions.

**Why:** user flagged that some questions "aren't suitable for direct
MCQ" two ways — genuinely descriptive prompts (essay/précis) that were
invisible, and structurally-MCQ questions where OCR corrupted either the
stem's formatting (lost underline) or the options text (column bleed).
Both needed different fixes; conflating them would have under-served one
or the other.

**Verified live:** submitted a real report against a genuine underlined-
word question, fixed both its stem (`__Honesty__`) and its 4 garbled
options through the admin form, confirmed the Question Bank renders
"Honesty" underlined, shows the 4 clean options, and highlights the
correct one (a — Noun) — all without a page reload.

**What's still open:**
- No bulk "these 40 questions are all missing underlines" workflow —
  each stem/option fix is still one report at a time through the admin
  form. Fine at current volume (single low-hundreds), would need a batch
  tool if this scales to thousands of flagged items.
- `renderEmphasis()`'s `__word__` convention isn't documented anywhere
  a reviewer would see it except the correction form's placeholder text.

---

## 2026-08-02 — Question review system (State Tax Officer)

**What shipped:**
- New backend on the `shiksha-dev` droplet, extending the existing
  `mpsc-api` FastAPI service (chosen over Supabase — already had Postgres +
  a working service there; see reasoning in chat, not re-derived here).
  - 6 new Postgres tables in the `mpsc_study` DB: `users`,
    `question_reports`, `question_corrections`, `question_comments`,
    `question_notes`, `mock_attempts`. All keyed by `(bank_id, question_id)`
    — bank-agnostic by design, so this covers State Tax Officer today and
    any future bank without a schema change.
  - Simple username+password auth (bcrypt + JWT, 30-day tokens). Closed/
    invite-only — no public signup endpoint exists on purpose.
  - Endpoints: login/me, submit/list-my report (complaint), public
    corrections read, comments CRUD, personal notes CRUD, mock-attempt
    history, and admin-only bulk-status + per-question correction +
    user list.
  - 4 accounts seeded: `gasey` (owner) + `admin1`/`admin2`/`admin3`
    (reviewers), all role=admin. Credentials were shown once in chat,
    not stored in any repo — ask the user if they need to be rotated.
  - Backend code now under git at `~/mpsc_api` on the droplet (wasn't
    before — no history prior to this session, see that repo's first
    commit message for why).
- Frontend (`src/lib/mpscApi.ts`, `src/lib/authStore.ts`,
  `src/modules/mpsc/{LoginPanel,QuestionReviewPanel,AdminPanel}.tsx`,
  changes to `StateTaxOfficerEnhanced.tsx` / `StateTaxOfficerPage.tsx`):
  - Login control in the State Tax Officer header.
  - Every question in the Question Bank tab: 🚩 Flag (submit a complaint,
    optionally suggest the right answer), 📝 My note (private), 💬
    Comments (public thread).
  - Admin-authored corrections overlay the static bundled answer/
    explanation everywhere a question is shown or scored — Question Bank,
    mock test setup/running/scoring, By Exam/Year — via one
    `getCorrections()` fetch merged into `correctedQuestions` in the
    parent component.
  - New 🛡️ Admin tab (role-gated): filter reports by status, bulk
    accept/reject with a shared note, or expand one report to set the
    corrected answer/explanation/public note and accept it in one action.
  - Progress tab now shows real mock-test history + flagged-question
    status, fetched from the API (was a "coming soon" stub before).

**Why:** user wants every question eventually reviewable (not just State
Tax Officer), with a real admin workflow — bulk triage plus per-question
correction — and users able to see whether their flag was accepted or
rejected, with the admin's note.

**Bugs found and fixed during this session (verified live in-browser, not
just compiled):**
- JWT `sub` claim must be a string per RFC 7519 — PyJWT silently rejected
  int user IDs with "Invalid or expired token", which looked like a CORS/
  header problem until traced with a bare decode/encode roundtrip.
- Admin corrections weren't reflected in the Question Bank until a full
  page reload — the parent's `corrections` state was fetched once on
  mount and never invalidated after `AdminPanel` applied a new one. Fixed
  by threading an `onCorrectionApplied` callback down to `ReportRow`.

**What's still open / not built:**
- Corrections only affect *answer/explanation* — they don't yet let an
  admin fix the question stem or options text (only the standalone HTML
  guide's static data can do that, via re-running the solve pipeline).
- No UI yet to browse *all* comments/notes across questions (only
  per-question, from inside that question's card).
- Not generalized to other banks yet (`mpsc-old-questions`, Polity Codex,
  etc.) — the schema supports it (bank_id is already a column everywhere)
  but no other module's UI has the Flag/Note/Comments panel wired in.
- No password reset flow — if an account's password is lost, it has to be
  reset directly in Postgres (`UPDATE users SET password_hash = ...`)
  using `mpsc_api/seed_accounts.py`'s `hash_password()` helper.
- `mock_attempts`/`question_notes`/etc. have no admin-facing "delete my
  data" or GDPR-style export — fine for a closed personal tool, would need
  attention before ever opening signup to the public.
