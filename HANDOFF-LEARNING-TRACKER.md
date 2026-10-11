# My learning — UDC / LDC / Group B

Published content commit `3703c70` on 11 October 2026. Vercel deployment
`dpl_GFc5U28N775u45des4gkPsinPAPJ` is **READY** and aliased to
https://map.hawayu.in. Deployment:
https://india-study-dv6ualuhm-gaseys-projects.vercel.app.
The production build passed. Browser visual verification remains outstanding.

Implemented 11 October 2026. This is the continuation guide for the learner's
personal study history. Source/import progress remains under **Bank coverage**
and the review handoffs. Do not merge those two meanings of progress.

## Product contract

My learning is the module's default tab. It offers a short suggested session,
due reviews, unresolved mistakes, weak areas and questions not yet answered.
Subjects and topics show coverage, recent accuracy, evidence strength and trend,
with both Read and Review actions. A topic with little evidence is not labelled
weak. Explicit reading is tracked independently with **Mark studied**, including
written and held questions. Simply opening a page or revealing an answer does
not claim that the user studied or recalled it.

Practice records a marked choice immediately, including the optional confidence
and foreground response time. Feedback remains visible if the choice removes
the question from a Not attempted / Previously wrong filter. Next does not
record a second answer. The optional mistake reason annotates the same attempt.
Browse choices also record attempts; bulk reveal does not. Exams record the
final submitted choices, including automatic expiry. Blank answers and held
questions do not become wrong answers. Instant feedback saves on selection and
reuses the same event IDs at submission; its mode survives a refresh.

The existing source scoring gates still apply. The learning adapter additionally
excludes source-defect items from its scored analytics and queues. Reading them
can still be tracked. Never infer a learner weakness from missing/unverified
answer content. Existing IDs, topic classification and correction mechanisms
are preserved.

## Engine and boundaries

GPT-6 Astra implemented the reusable engine, persistence and learning adapter.
GPT-6 Luna implemented the dashboard and its styling. The parent integrated
answering paths, completed verification and fixed issues found during checks.
Use Astra for substantive future scheduler/persistence design changes; Luna is
suitable for bounded presentation work. The shipped tracker uses local rules
and makes no model/API calls to calculate learning recommendations.

- `src/lib/learning/types.ts`: generic module-scoped data/policy/selector types.
- `engine.ts`: pure attempts, reading, scheduling, migration, merge and validation.
- `indexedDb.ts`: transactional per-module metadata and per-question records.
- `storage.ts`: asynchronous store, recovery, backups and cross-tab notifications.
- `src/modules/udc-ldc/useProgress.ts`: shared React store and legacy compatibility.
- `learningModel.ts`: bank-specific subject/topic routing, analytics and queues.
- `LearningDashboard.tsx` / `learning-dashboard.css`: presentation and actions.
- `PracticeView.tsx`, `ExamView.tsx`, `SubjectStudyView.tsx`, `UdcLdcPage.tsx`:
  recording and session integration. `useAttemptState.ts` adds optional persisted
  feedback mode; other modules retain their existing behavior.

The generic core does not import bank questions, answer keys or UI components.
To expand to another module, use a distinct `moduleId`, supply its own adapter
and wire that module's scoring events. Do not copy the engine or reuse UDC's
storage namespace. The dashboard gets view data and callbacks; it does not make
scoring or scheduling decisions.

## Browser storage and migration

Primary storage is IndexedDB database `jabreeze.learning` version 1. `modules`
stores metadata/policy; `questions` stores canonical per-question source counters
and a bounded recent history. A read/merge/write operation is one transaction,
so simultaneous tabs cannot overwrite each other's attempts. Only changed
questions are written during normal single-tab activity. BroadcastChannel (or
a storage-event signal) refreshes other tabs. Read snapshots use one transaction.

The old `jabreeze.udcldc.progress.v1` map is migrated without deleting the original.
Its attempt totals and latest result survive; unavailable historical correct/wrong
counts are not invented. Legacy totals appear separately from known-answer
accuracy. A reset has a generation timestamp and migration marker so a stale tab
or the retained old key cannot resurrect cleared history.

Fallback storage is `jabreeze.learning.udc-ldc.v1` in localStorage, with the
browser source ID and recovery/signal keys alongside it. Web Locks serialize
fallback writes where supported; fallback without Web Locks has best-effort
cross-tab merging. Quota/unavailable-storage failures preserve current page data
and show a warning to export. Later actions retry saving. Corrupt localStorage
is copied before replacement; unreadable IndexedDB content is retained with a
visible recovery message and fallback storage. Never silently clear a failed
store to make the app boot.

Browser data is local to this browser/profile and origin. There is no account
sync. Export creates a JSON backup of canonical state; import validates module,
version, identifiers, counts, policy and histories, then merges additively.
Importing the same backup twice does not add attempts twice. Explicit import can
restore a backup after reset. Current policy is retained on import. The maximum
backup input is 100 million characters (the file picker checks 100 MB first).
A synthetic 20,000-question, one-attempt-per-question canonical backup was about
6.8 MiB, which is why IndexedDB is primary.

No question prose, answer keys or private server notes are copied into storage.
Recent history retains 16 events per question/source; cumulative correct/wrong
counts survive that bound. Replay protection retains 4,096 event IDs plus recent
question events. This bounds duplicate protection; it is not an unlimited event
archive. Backup merge keeps original browser-source identities. Merging two
independently modified forks of the same browser backup can lose divergent
counter detail; normal separate browser histories have distinct identities.

## Review and weakness policy

The defaults are intentionally short. They do not expose a target date or exam
countdown:

- Wrong, guessed or unsure answers: recall after 10 minutes.
- Successful scheduled recalls: 4 hours, 1 day, 2 days, 4 days, then 7 days maximum.
- Correct repeats before the due time count as attempts but do not earn longer
  intervals or spaced mastery. A lapse restarts the short review cycle.
- Suggested sessions: 15 questions, normally reserving 20% for new questions when
  available. Due recall and weaker topics get priority; new questions rotate
  across subjects. Explicit review can be started early.
- Topic/subject weakness needs at least five distinct questions with known
  answer evidence. Recent area accuracy gives each question equal weight using
  its last three attempts; repeatedly answering one item cannot dominate the
  entire subject. Under 65% is Needs review. Secure areas also need spaced
  success on at least half of evidenced questions; a single lucky answer is
  insufficient. These are transparent study heuristics, not exam predictions.
- Trend needs multiple comparable questions; insufficient history stays unknown.
  Overall accuracy uses known lifetime answers and excludes unrecoverable legacy
  counts. Secure-question count requires at least three spaced successes.
- The mistake queue shows questions whose latest answer is wrong. After a correct
  answer they leave that queue, but cumulative errors and recent history remain.
  Future work can add an optional resolved-mistakes/history view without changing
  the storage model. The UI labels unknown legacy mistake counts honestly.

Topic precision depends on existing reviewed tags. Broad or mixed material stays
broad/mixed; the dashboard does not invent fine grammar or maths classifications
from keywords. Continue improving tags through the source-review workflow.

## Future settings and expansion

`LearningPolicy` already contains wrong delay, success intervals, evidence
threshold, session size and new-item fraction. Keep current defaults until a
settings feature is deliberately designed. Future settings can add adjustable
pace, daily workload and optional target-date planning without mentioning a
specific exam date in today's UI. Define how a policy change reschedules existing
due items; do not silently rewrite history. Add versioned migrations when the
persistent schema changes.

Possible later work: resolved mistakes and richer activity history, optional
study reminders, bookmarks/private local notes, per-topic written review queues,
account sync with explicit consent, and a site-wide dashboard spanning module
adapters. No background reminder or cross-device synchronization is implemented.

Historical correctness records the key used when answering. If a source key or
option ordering is later corrected, existing history is not automatically
rescored. A future content fingerprint/reconciliation mechanism should identify
changed questions and request fresh recall without silently rewriting evidence.

## Verification and publication

Local verification passed: 26 engine/storage checks, the component integration
suite, TypeScript and the production build. A current-bank smoke check covered
27,431 records across five subjects and 88 topic groups; an untouched profile
received 15 questions and no false weak-area labels. These counts are a dated
verification snapshot, not a permanent bank-size assertion.

Run from the app root:

```sh
node tools/learning-check.mjs
node tools/learning-integration-check.mjs
npm run build
git diff --check
```

The deterministic engine/storage suite covers migration, intervals, early-repeat
behavior, guesses, replay, annotation, backup validation, weak evidence, read-only
items, queue composition, 20,000-question backup roundtrip, quota/recovery,
IndexedDB concurrent tabs/reload/reset and changed-record writes. Component
checks use React's renderer, not a browser, to exercise Practice, Browse and Exam,
including submission/expiry/instant-mode resume. Dependencies `fake-indexeddb`
and `react-test-renderer` are development-only.

Browser visual verification is outstanding under this task's existing access
restriction. Do not use an alternate browser or CDP route to bypass it. When
approved browser access is available, check mobile/desktop and dark mode,
subject/topic read and review, last-answer persistence on navigation, refresh,
backup roundtrip, two-tab updates, quota warnings and keyboard focus.

Before publication inspect the shared checkout and stage only this feature's
files. Preserve parallel question-bank work. Record the content commit and actual
READY deployment/alias after deployment; a passing build alone is not publication.
