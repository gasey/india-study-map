/* ============================================================================
   MPSC System Analyst — Study Trainer
   Offline single-page app. Progress lives in localStorage under KEY.
   ========================================================================== */
'use strict';

const SYL = window.SYLLABUS || { papers: [] };
const CON = window.CONCEPTS || [];
const QS  = window.QUESTIONS || [];
// Calc Lab generators. Unlike the three above these are functions, not data:
// each produces a fresh worked item from a seed, so the pool is unbounded.
const GENS = window.CALC_DRILLS || [];

// Distinct from the System Manager app's 'mpsc_sm_v1' — both are served from
// the same origin, so a shared key would merge the two apps' progress.
const KEY = 'mpsc_sa_v1';
const EXAM_HINT = '2026-11-01';      // no date announced yet; used only for the countdown
const BOX_DAYS = [0, 1, 3, 7, 21];   // Leitner intervals, box 1..5
const DAY = 864e5;

/* ------------------------------------------------------------------ store */
const blank = () => ({
  version: 1,
  concepts: {},      // "PAPER|unit|sub" -> {status, views, last}
  questions: {},     // qid -> {att, ok, last, box, due, star, lastPick}
  sessions: [],      // {id, type, paper, started, ended, score, total}
  daily: {},         // "YYYY-MM-DD" -> {score, total, ended}
  // Calc Lab accuracy, keyed by generator id. Deliberately NOT merged into
  // `questions`: drill items are generated per seed and have no stable id, so
  // Leitner scheduling cannot apply to them and would corrupt the due counts.
  calc: {},          // genId -> {att, ok, last}
  // Section-B essay self-ratings, keyed by question id. Deliberately NOT merged
  // into `questions` for the same reason `calc` isn't: these are SELF-graded.
  // Every number in `questions` is machine-scored against a known key, and the
  // accuracy the reader trusts depends on that staying true — mixing in "I
  // think I got that" would quietly turn a measurement into an opinion.
  essays: {},        // qid -> {att, good, part, miss, last, box, due, star}
  settings: { dailyCount: 25, theme: 'auto' },
});

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    const b = blank();
    return migrateIds(Object.assign(b, p, { settings: Object.assign(b.settings, p.settings || {}) }));
  } catch (e) {
    console.warn('progress unreadable, starting fresh', e);
    return blank();
  }
}

/* Generated-question ids used to be a running counter over the whole corpus, so
   authoring one new batch renumbered every question after it — 225 of 254 moved
   in a single run. They are now derived from the question's own content and do
   not move again. Progress is keyed on question id, so without this the
   reader's Leitner boxes for those 225 would simply stop matching anything and
   their revision history would vanish with no error to notice.

   Runs once, then records the fact. The old numeric ids can never collide with
   the new hashed ones, so re-running would be harmless anyway. */
function migrateIds(s) {
  const map = window.QUESTION_ID_MIGRATION;
  if (!map || s.migratedIds) return s;
  let moved = 0;
  for (const [oldId, newId] of Object.entries(map)) {
    if (s.questions[oldId] && !s.questions[newId]) {
      s.questions[newId] = s.questions[oldId];
      delete s.questions[oldId];
      moved++;
    }
  }
  s.migratedIds = true;
  if (moved) console.info(`carried ${moved} question(s) of progress across the id change`);
  return s;
}
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { toast('Could not save progress — storage may be full'); }
  }, 120);
}

/* ------------------------------------------------------------------ utils */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const todayKey = () => new Date().toISOString().slice(0, 10);
const pct = (n, d) => d ? Math.round(100 * n / d) : 0;

function toast(msg, ms = 2200) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.hidden = true; }, ms);
}

// deterministic PRNG so the daily test is stable across reloads
function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------------------------------------------------------------- lookups */
const paperById = {};
SYL.papers.forEach(p => { paperById[p.id] = p; });
const unitOf = (pid, uno) => (paperById[pid]?.units || []).find(u => String(u.no) === String(uno));
// Escaped "Unit 2 · Computer Architecture and Organization" pill text, falling
// back to the bare number if a unit somehow has no matching syllabus entry.
const unitLabel = q => {
  const u = unitOf(q.paper, q.unit);
  return u ? `Unit ${esc(q.unit)} · ${esc(u.title)}` : `Unit ${esc(q.unit)}`;
};
const paperName = pid => paperById[pid]?.name || pid;
const shortPaper = pid => ({
  GE: 'General English', GS: 'General Studies',
  TECH1: 'Technical I · IT & Communication (2026 syllabus)',
  TECH1_LEGACY: 'Technical I · Informatics Officer (legacy syllabus)',
  TECH2: 'Technical II · E-Governance',
  TECH3: 'Technical III · Project Mgmt',
}[pid] || pid);

// answerable questions only (drop voided/undetermined from tests)
// Denominator for the concept-guide progress line, derived from the syllabus
// rather than hardcoded so it cannot drift as data lands.
const TOTAL_SUBTOPICS = SYL.papers.filter(p => !p.legacy).reduce(
  (n, p) => n + p.units.reduce((m, u) => m + (u.subtopics || []).length, 0), 0);

/* Disputed answer: the blind solve and the question bank disagree, so BOTH
   candidates are shown rather than the conflict being buried in a prose
   provenance line. No official key exists for these papers — one of the two
   derivations is simply wrong, and the reader is better placed than either to
   judge, so the app presents the evidence instead of pretending to settle it. */
function disputeBlock(q) {
  if (!q.alt || !q.opts || !q.opts[q.alt]) return '';
  return `<div class="dispute">
    <h4>Disputed — two derivations disagree</h4>
    <div class="dispute-row"><span class="pill ok">this app</span>
      <span class="lab">${esc(q.ans)}</span><span>${esc(q.opts[q.ans] || '')}</span></div>
    <div class="dispute-row"><span class="pill wn">question bank</span>
      <span class="lab">${esc(q.alt)}</span><span>${esc(q.opts[q.alt])}</span></div>
    <p class="dim">No official answer key exists for this paper. Read the explanation
      and decide for yourself which is right.</p>
  </div>`;
}

/* Provenance + confidence line under an answer explanation.
   This app mixes three very different kinds of answer: 274 from MPSC's published
   final answer key, 96 agreed by two independent solvers, 4 from a single
   unverified solver, and now 195 blind-solved from the 2021 papers. Without a
   badge they all look alike, which is precisely the failure CLAUDE.md names as a
   known gap. Ported from the System Manager app. */
function provLine(q) {
  // Key on an official answer key EXISTING, not on the word appearing. Most of
  // the derived provenance strings read "...no official key for this sitting",
  // and a bare /official/i matches that negation — which would badge a derived
  // answer as authoritative, the exact inverse of the truth.
  const official = q.prov
    && /official/i.test(q.prov)
    && !/\b(?:no|without|never)\s+official/i.test(q.prov);
  const badge = official
    ? '<span class="pill acc">official key</span>'
    : ({
        high:   '<span class="pill ok">derived · high confidence</span>',
        medium: '<span class="pill wn">derived · medium confidence</span>',
        low:    '<span class="pill no">derived · low confidence</span>',
      }[q.conf] || (q.conf ? '' : '<span class="pill wn">derived · unrated</span>'));
  const text = esc(q.prov || '') + (q.note ? ' — ' + esc(q.note) : '');
  return `<div class="prov">${badge}${badge && text ? ' ' : ''}${text}</div>`;
}

const ANSWERABLE = QS.filter(q => q.ans && q.ans.length === 1);

/* Section-B conventional/essay questions. The Technical papers are half MCQ
   (100 marks) and half written answer (100 marks), so these belong in the
   bank — but they cannot be auto-scored, so they carry no single-letter `ans`
   and are therefore excluded from ANSWERABLE, and with it from every MCQ
   practice pool, mock test and accuracy statistic.

   They are still practisable: the Essays tab drills them self-graded, and that
   rating is kept in S.essays, never in S.questions. Browsing a past paper also
   shows them inline with their model answer. */
const isDescriptive = q => q.type === 'descriptive';
const DESCRIPTIVE = QS.filter(isDescriptive);

const eState = id => S.essays[id]
  || { att: 0, good: 0, part: 0, miss: 0, box: 1, due: 0, star: false };
const isEssayDue = id => {
  const st = S.essays[id];
  return !!st && !!st.att && (st.due || 0) <= Date.now();
};

/* Self-rating after reading the model answer. Same Leitner ladder as the MCQ
   boxes so "due for review" means the same thing to the reader, but written to
   its own store. "Partly" holds the box rather than promoting it — a half-
   remembered 5-mark answer is not learned, and promoting it would space the
   question out just as it needs repeating. */
function recordEssay(q, rating) {
  const st = Object.assign({ att: 0, good: 0, part: 0, miss: 0, box: 1, due: 0, star: false },
    S.essays[q.id]);
  st.att += 1;
  st[rating] += 1;
  if (rating === 'good') st.box = Math.min(5, (st.box || 1) + 1);
  else if (rating === 'miss') st.box = 1;
  st.last = Date.now();
  st.lastRating = rating;
  st.due = Date.now() + BOX_DAYS[st.box - 1] * DAY;
  S.essays[q.id] = st;
  save();
}

/* ------------------------------------------------------------ study modes */
/* How each question should be STUDIED, not what its answer is. Three modes,
   each routing to a tool this app already has: `calculate` to the Calc Lab,
   `understand` to the concept guide, `memorise` to the review boxes.

   Lives in its own file keyed on question id rather than as a field on the
   question, because generate.py --merge rebuilds every GEN- question from its
   staged batch files and would silently erase a field added here — a partial,
   invisible loss across ~425 of the 1,082. See classify.py's header. */
const MODES = window.QUESTION_MODES || {};
const modeOf = id => (MODES[id] || {}).mode || null;

const MODE_META = {
  calculate:  { pill: 'acc', short: 'calculate',  hint: 'a method gets you there — drill it' },
  understand: { pill: 'ok',  short: 'understand', hint: 'reason it from the concept' },
  memorise:   { pill: 'wn',  short: 'memorise',   hint: 'no derivation — this one has to be committed' },
};

/* Spaced-repetition multiplier per mode. An arbitrary section number decays far
   faster than a principle you actually understand, so the same Leitner box
   should not buy them the same interval. Applied to BOX_DAYS, so the box
   sequence stays recognisable and only its pace changes. */
const MODE_PACE = { calculate: 1, understand: 1.4, memorise: 0.6 };

const modeBadge = id => {
  const m = modeOf(id);
  if (!m) return '';
  const meta = MODE_META[m];
  return `<span class="pill ${meta.pill}" title="${esc(meta.hint)}">${esc(meta.short)}</span>`;
};

/* Options for the "Sitting" filter, built from whatever is actually in the pool.
   This used to be three hard-coded <option>s, which silently went stale the
   moment the CSE-2015 import added 13 more source papers: they were in the bank
   and countable everywhere else, but unreachable from the Practice filter. Any
   list of sources that is typed out by hand will drift from the data again, so
   derive it. Labelled by `sitting` (what the paper is called) and valued by
   `srcKey` (one per printed paper). */
function sittingOptions(pool) {
  const m = new Map();
  pool.forEach(q => {
    if (!q.srcKey) return;
    const cur = m.get(q.srcKey);
    if (cur) { cur.n += 1; return; }
    m.set(q.srcKey, { label: q.sitting || q.srcKey, n: 1, past: q.src === 'past' });
  });
  // Real past papers first (that is what someone filtering by sitting is after),
  // then authored banks; alphabetical within each so the order is stable.
  return [...m.entries()]
    .sort((a, b) => (b[1].past - a[1].past) || a[1].label.localeCompare(b[1].label))
    .map(([key, v]) => `<option value="${esc(key)}">${esc(v.label)} (${v.n})</option>`)
    .join('');
}

const conceptKey = c => `${c.paper}|${c.unit}|${c.sub}`;
const cState = c => S.concepts[conceptKey(c)] || { status: 'new', views: 0 };
const qState = id => S.questions[id] || { att: 0, ok: 0, box: 1, due: 0, star: false };

function isDue(id) {
  const st = S.questions[id];
  if (!st || !st.att) return false;
  return (st.due || 0) <= Date.now();
}

/* --------------------------------------------------------- record answers */
function recordAnswer(q, picked) {
  const correct = picked === q.ans;
  const st = Object.assign({ att: 0, ok: 0, box: 1, due: 0, star: false }, S.questions[q.id]);
  st.att += 1;
  if (correct) { st.ok += 1; st.box = Math.min(5, (st.box || 1) + 1); }
  else { st.box = 1; }
  st.last = Date.now();
  st.lastPick = picked;
  st.lastOk = correct;
  // Paced by study mode: a remembered section number comes back sooner than a
  // principle at the same box level. Box 1 is 0 days either way, so a question
  // you just got wrong still returns immediately whatever its mode.
  st.due = Date.now() + BOX_DAYS[st.box - 1] * DAY * (MODE_PACE[modeOf(q.id)] || 1);
  S.questions[q.id] = st;
  save();
  return correct;
}

function markConcept(c, status) {
  const k = conceptKey(c);
  const st = Object.assign({ status: 'new', views: 0 }, S.concepts[k]);
  st.status = status; st.last = Date.now();
  S.concepts[k] = st; save();
}
function touchConcept(c) {
  const k = conceptKey(c);
  const st = Object.assign({ status: 'new', views: 0 }, S.concepts[k]);
  st.views += 1; st.last = Date.now();
  if (st.status === 'new') st.status = 'learning';
  S.concepts[k] = st; save();
}

/* ------------------------------------------------------------- selection */
// Weighted sampling: a unit worth 40 marks should appear twice as often as one worth 20.
function weightedPick(pool, n, rnd) {
  const groups = {};
  pool.forEach(q => {
    const k = `${q.paper}|${q.unit}`;
    (groups[k] = groups[k] || []).push(q);
  });
  const keys = Object.keys(groups);
  if (!keys.length) return [];
  const quota = {};
  let totalW = 0;
  keys.forEach(k => {
    const [pid, uno] = k.split('|');
    const w = unitOf(pid, uno)?.marks || 1;
    quota[k] = w; totalW += w;
  });
  const out = [];
  const bags = {};
  keys.forEach(k => { bags[k] = shuffle(groups[k], rnd); });
  // proportional allocation, then top up from whatever is left
  keys.forEach(k => {
    const want = Math.round(n * quota[k] / totalW);
    out.push(...bags[k].splice(0, Math.min(want, bags[k].length)));
  });
  const leftovers = shuffle(keys.flatMap(k => bags[k]), rnd);
  while (out.length < n && leftovers.length) out.push(leftovers.shift());
  return shuffle(out, rnd).slice(0, n);
}

// Priority for study value: due reviews first, then never-seen, then weakest.
// Shuffle BEFORE sorting. Array.prototype.sort is stable, so without a shuffle
// every question sharing a score keeps its bank order — and on a fresh profile
// *every* question shares a score, because they are all unseen and all score 1.
// The sort then does nothing and each caller takes the first N rows of the bank:
// Practice handed out the same questions every session, and a newly imported
// sitting stayed unreachable until everything ahead of it in the file had been
// answered. Found in the System Manager app on 2026-09-02; this file carries the
// same logic, so it carried the same bug. Unseeded on purpose — a practice set,
// unlike a mock, has no reason to be reproducible.
function studyOrder(pool, rnd) {
  const now = Date.now();
  return shuffle(pool, rnd || Math.random).sort((a, b) => score(a) - score(b));
  function score(q) {
    const st = S.questions[q.id];
    if (!st || !st.att) return 1;                       // unseen: high value
    if ((st.due || 0) <= now) return 0;                 // due: highest value
    const acc = st.ok / st.att;
    return 2 + acc;                                     // mastered: lowest value
  }
}

/* ================================================================= views */
const VIEWS = {};
let currentView = 'syllabus';

function go(v, opts) {
  currentView = v;
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  const main = $('#main');
  main.innerHTML = '';
  window.scrollTo(0, 0);
  (VIEWS[v] || VIEWS.dash)(main, opts || {});
}

/* -------------------------------------------------------------- syllabus */
/* The landing view. What a candidate needs before anything else is where the
   marks are — and for this post the shape is unusual: General English and
   General Studies are 200 marks that earn NOTHING toward merit and only need
   50% to pass, while merit is decided entirely by the three technical papers
   plus the interview. Getting that wrong means revising the wrong 200 marks.
   Everything here reads from data/syllabus.js. */
VIEWS.syllabus = (el) => {
  const merit = SYL.papers.filter(p => p.counts_for_merit && !p.legacy);
  const qual = SYL.papers.filter(p => !p.counts_for_merit && !p.legacy);
  const meritTotal = merit.reduce((a, p) => a + p.marks, 0)
    + ((SYL.interview && SYL.interview.counts_for_merit && SYL.interview.marks) || 0);
  const maxUnit = Math.max(...SYL.papers.filter(p => !p.legacy).flatMap(p => p.units.map(u => u.marks)));

  const unitRow = (p, u) => {
    const qs = ANSWERABLE.filter(q => q.paper === p.id && String(q.unit) === String(u.no)).length;
    const cs = CON.filter(c => c.paper === p.id && String(c.unit) === String(u.no));
    const known = cs.filter(c => cState(c).status === 'known').length;
    return `
      <details class="syl-unit">
        <summary>
          <span class="syl-bar" style="--w:${Math.round(100 * u.marks / maxUnit)}%"></span>
          <span class="syl-no">${esc(u.no)}</span>
          <span class="syl-title">${esc(u.title)}</span>
          <span class="syl-marks">${u.marks}<em>marks</em></span>
          <span class="syl-meta">${cs.length} concept${cs.length === 1 ? '' : 's'}${known ? ` · ${known} known` : ''} · ${qs} question${qs === 1 ? '' : 's'}</span>
        </summary>
        <div class="syl-body">
          ${(u.subtopics || []).length
            ? `<ul>${u.subtopics.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`
            : `<p class="dim">No subtopics listed for this unit.</p>`}
        </div>
      </details>`;
  };

  const paperCardSyl = p => `
    <div class="card mt">
      <div class="spread">
        <h3 style="margin:0">${esc(p.name)}</h3>
        <span class="pill ${p.counts_for_merit ? 'acc' : 'wn'}">${p.marks} marks${
          p.counts_for_merit ? ' · counts for merit'
            : ` · qualifying only, ${p.qualifying_threshold_pct || 50}% to pass`}</span>
      </div>
      <p class="dim" style="margin:.4rem 0 .2rem">${esc(p.type || '')}</p>
      ${p.scope_note ? `<p class="dim" style="margin:.2rem 0 .6rem">${esc(p.scope_note)}</p>` : ''}
      <div class="syl-units">${p.units.map(u => unitRow(p, u)).join('')}</div>
      ${p.authority ? `<p class="syl-note">Syllabus authority: ${esc(p.authority)}</p>` : ''}
    </div>`;

  el.innerHTML = `
    <h1>Syllabus and mark distribution</h1>
    <p class="muted">${esc(SYL.post)} · ${esc(SYL.employer)}</p>
    <p class="muted" style="margin-top:.4rem"><strong>${esc(SYL.scoring_note || '')}</strong></p>

    <div class="syl-split mt">
      ${merit.map(p => `
        <div class="syl-share" style="--pct:${Math.round(100 * p.marks / meritTotal)}%">
          <strong>${esc(shortPaper(p.id))}</strong>
          <span>${p.marks} marks · ${Math.round(100 * p.marks / meritTotal)}% of merit</span>
        </div>`).join('')}
      ${SYL.interview && SYL.interview.marks ? `
        <div class="syl-share" style="--pct:${Math.round(100 * SYL.interview.marks / meritTotal)}%">
          <strong>Interview</strong>
          <span>${SYL.interview.marks} marks · ${Math.round(100 * SYL.interview.marks / meritTotal)}%</span>
        </div>` : ''}
    </div>
    <p class="syl-note">Merit total ${meritTotal} marks. The ${qual.length} qualifying
      paper${qual.length === 1 ? '' : 's'} below (${qual.reduce((a, p) => a + p.marks, 0)} marks)
      earn no merit — they only have to be passed.</p>

    <h2 class="mt">Counts for merit</h2>
    ${merit.map(paperCardSyl).join('')}

    <h2 class="mt">Qualifying only</h2>
    ${qual.map(paperCardSyl).join('')}

    ${(SYL.reading || []).length ? `
    <div class="card mt">
      <h3 style="margin:0 0 .2rem">Recommended reading</h3>
      <p class="dim" style="margin:0 0 .7rem">Books and official sources for this exam.
        Check current editions before buying — where an edition matters it is called out.</p>
      ${SYL.reading.map(g => `
        <div class="read-grp">
          <h5>${esc(g.for)}</h5>
          ${g.items.map(b => `
            <div class="read">
              <div class="read-t">${esc(b.t)}</div>
              ${b.by && b.by !== '—' ? `<div class="read-by">${esc(b.by)}</div>` : ''}
              ${b.note ? `<div class="read-n">${esc(b.note)}</div>` : ''}
            </div>`).join('')}
        </div>`).join('')}
    </div>` : ''}

    <div class="card mt">
      <h3 style="margin:0 0 .5rem">The exam</h3>
      <table><tbody>
        ${[['Post', SYL.post], ['Pay', SYL.pay], ['Vacancies', SYL.vacancies],
           ['Advertisement', SYL.advertisement],
           ['Selection', (SYL.selection_stages || []).join(' → ')]]
          .filter(r => r[1]).map(r => `<tr><th style="width:9rem">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}
      </tbody></table>
      ${(SYL.eligibility || []).length ? `<h4 class="mt">Eligibility</h4>
        <ul class="syl-elig">${SYL.eligibility.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
    </div>`;
};

/* ------------------------------------------------------------- dashboard */
VIEWS.dash = (el) => {
  const seen = Object.keys(S.questions).length;
  const att = Object.values(S.questions).reduce((a, s) => a + (s.att || 0), 0);
  const ok = Object.values(S.questions).reduce((a, s) => a + (s.ok || 0), 0);
  const due = ANSWERABLE.filter(q => isDue(q.id)).length;
  const known = Object.values(S.concepts).filter(c => c.status === 'known').length;
  const dk = todayKey();
  const dailyDone = !!S.daily[dk];
  const st = streak();

  el.innerHTML = `
    <div class="spread mb">
      <div>
        <h1>Dashboard</h1>
        <p class="muted" style="margin:0">Merit is decided by Technical Papers I–III (600 marks) plus interview.
        General English and General Studies only need 50% to qualify.</p>
      </div>
    </div>

    <div class="grid g4 mb">
      ${stat('Questions seen', `${seen}`, `of ${ANSWERABLE.length} in bank`)}
      ${stat('Overall accuracy', `${pct(ok, att)}%`, `${ok} / ${att} attempts`)}
      ${stat('Due for review', `${due}`, due ? 'spaced repetition' : 'nothing due')}
      ${stat('Day streak', `${st.current}`, `best ${st.longest}`)}
    </div>

    <div class="grid g2">
      <div class="card">
        <h3>Today</h3>
        <p class="muted" style="font-size:.9rem">
          ${dailyDone
            ? `Done — you scored <strong>${S.daily[dk].score}/${S.daily[dk].total}</strong> (${pct(S.daily[dk].score, S.daily[dk].total)}%).`
            : `A fixed set of ${S.settings.dailyCount} questions, weighted to the real syllabus and biased toward what you are due to revise.`}
        </p>
        <div class="row">
          <button class="btn pri" data-go="daily">${dailyDone ? 'Review today’s test' : 'Start daily test'}</button>
          ${due ? `<button class="btn" data-go="review">Revise ${due} due</button>` : ''}
        </div>
      </div>
      <div class="card">
        <h3>Concept guide</h3>
        <p class="muted" style="font-size:.9rem">
          ${CON.length} of ${TOTAL_SUBTOPICS} syllabus sub-topics defined.
          You have marked <strong>${known}</strong> as known.
        </p>
        <div class="bar good mb"><i style="width:${pct(known, CON.length || 1)}%"></i></div>
        <button class="btn" data-go="study">Open study guide</button>
      </div>
    </div>

    <h2 class="mt">Papers</h2>
    <div class="grid g2">${SYL.papers.filter(p => !p.legacy).map(paperCard).join('')}</div>

    ${weakestBlock()}
    ${modeMixBlock()}
  `;
  el.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) go(g.dataset.go, JSON.parse(g.dataset.opts || '{}'));
  });
};

function stat(k, v, s) {
  return `<div class="stat"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`;
}

function paperCard(p) {
  const pool = ANSWERABLE.filter(q => q.paper === p.id);
  const attempted = pool.filter(q => (S.questions[q.id]?.att || 0) > 0);
  const ok = attempted.reduce((a, q) => a + (S.questions[q.id].lastOk ? 1 : 0), 0);
  const cs = CON.filter(c => c.paper === p.id);
  const known = cs.filter(c => cState(c).status === 'known').length;
  return `
    <div class="card">
      <div class="spread">
        <h3 style="margin:0">${esc(shortPaper(p.id))}</h3>
        <span class="pill ${p.counts_for_merit ? 'acc' : 'wn'}">${p.counts_for_merit ? `${p.marks} marks · merit` : 'qualifying'}</span>
      </div>
      <p class="dim" style="margin:.4rem 0 .6rem">${p.units.length} units · ${cs.length} concepts · ${pool.length} questions</p>
      <div style="font-size:.78rem;color:var(--ink-3);margin-bottom:.2rem">Questions attempted ${attempted.length}/${pool.length}${attempted.length ? ` · last-attempt accuracy ${pct(ok, attempted.length)}%` : ''}</div>
      <div class="bar mb"><i style="width:${pct(attempted.length, pool.length || 1)}%"></i></div>
      <div style="font-size:.78rem;color:var(--ink-3);margin-bottom:.2rem">Concepts known ${known}/${cs.length}</div>
      <div class="bar good mb"><i style="width:${pct(known, cs.length || 1)}%"></i></div>
      <div class="row">
        <button class="btn sm" data-go="study" data-opts='${JSON.stringify({ paper: p.id })}'>Study</button>
        <button class="btn sm" data-go="practice" data-opts='${JSON.stringify({ paper: p.id })}'>Practise</button>
        <button class="btn sm" data-go="mock" data-opts='${JSON.stringify({ paper: p.id })}'>Mock</button>
      </div>
    </div>`;
}

function unitStats() {
  const rows = [];
  SYL.papers.filter(p => !p.legacy).forEach(p => p.units.forEach(u => {
    const pool = ANSWERABLE.filter(q => q.paper === p.id && q.unit === String(u.no));
    let att = 0, ok = 0;
    pool.forEach(q => { const s = S.questions[q.id]; if (s?.att) { att += s.att; ok += s.ok; } });
    rows.push({ paper: p.id, no: u.no, title: u.title, marks: u.marks, n: pool.length, att, ok, acc: pct(ok, att) });
  }));
  return rows;
}

function weakestBlock() {
  const weak = unitStats().filter(r => r.att >= 3).sort((a, b) => a.acc - b.acc).slice(0, 6);
  if (!weak.length) return '';
  return `
    <h2 class="mt">Weakest units</h2>
    <div class="card"><div class="scroll-x"><table>
      <thead><tr><th>Paper</th><th>Unit</th><th class="num">Marks</th><th class="num">Attempts</th><th class="num">Accuracy</th><th></th></tr></thead>
      <tbody>${weak.map(r => `
        <tr>
          <td class="dim">${esc(r.paper)}</td>
          <td>${esc(r.no)}. ${esc(r.title)}</td>
          <td class="num">${r.marks}</td>
          <td class="num">${r.att}</td>
          <td class="num"><span class="pill ${r.acc >= 70 ? 'ok' : r.acc >= 45 ? 'wn' : 'no'}">${r.acc}%</span></td>
          <td><button class="btn sm" data-go="practice" data-opts='${JSON.stringify({ paper: r.paper, unit: r.no })}'>Drill</button></td>
        </tr>`).join('')}</tbody>
    </table></div></div>`;
}

/* What KIND of work each unit is, before you start it. A unit that is 80%
   memorise wants flashcard time and a unit that is mostly understand wants the
   concept guide — knowing which is which is the point of the whole labelling
   pass, and it is invisible from a question count alone. */
function modeMixBlock() {
  const rows = [];
  SYL.papers.filter(p => !p.legacy).forEach(p => p.units.forEach(u => {
    const pool = ANSWERABLE.filter(q => q.paper === p.id && q.unit === String(u.no));
    const mix = pool.reduce((a, q) => { const m = modeOf(q.id); if (m) a[m] = (a[m] || 0) + 1; return a; }, {});
    const labelled = Object.values(mix).reduce((a, b) => a + b, 0);
    if (labelled < 5) return;   // too few to say anything honest about the mix
    rows.push({ paper: p.id, no: u.no, title: u.title, marks: u.marks, n: labelled, mix });
  }));
  if (!rows.length) return '';
  // Grind first — the units where there is most to commit to memory are the
  // ones worth knowing about early, because they need calendar time, not insight.
  rows.sort((a, b) => (b.mix.memorise || 0) / b.n - (a.mix.memorise || 0) / a.n);
  const bar = r => Object.keys(MODE_META).filter(m => r.mix[m]).map(m =>
    `<i class="seg ${m}" style="width:${100 * r.mix[m] / r.n}%" title="${r.mix[m]} ${MODE_META[m].short}"></i>`).join('');
  return `
    <h2 class="mt">What kind of work each unit is</h2>
    <p class="muted" style="margin-top:-.4rem">Sorted by how much of it has to be committed to
    memory. ${Object.keys(MODE_META).map(m =>
      `<span class="pill ${MODE_META[m].pill}">${esc(MODE_META[m].short)}</span>`).join(' ')}</p>
    <div class="card"><div class="scroll-x"><table>
      <thead><tr><th>Paper</th><th>Unit</th><th class="num">Marks</th><th class="num">Qs</th>
        <th style="min-width:160px">Mix</th><th class="num">By heart</th><th></th></tr></thead>
      <tbody>${rows.map(r => {
        const memPct = pct(r.mix.memorise || 0, r.n);
        return `<tr>
          <td class="dim">${esc(r.paper)}</td>
          <td>${esc(r.no)}. ${esc(r.title)}</td>
          <td class="num">${r.marks}</td>
          <td class="num">${r.n}</td>
          <td><div class="mixbar">${bar(r)}</div></td>
          <td class="num"><span class="pill ${memPct >= 60 ? 'no' : memPct >= 30 ? 'wn' : 'ok'}">${memPct}%</span></td>
          <td><button class="btn sm" data-go="practice" data-opts='${JSON.stringify({ paper: r.paper, unit: r.no })}'>Drill</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div></div>`;
}

function streak() {
  const days = Object.keys(S.daily).sort();
  if (!days.length) return { current: 0, longest: 0 };
  let longest = 0, run = 0, prev = null;
  days.forEach(d => {
    const t = Date.parse(d);
    run = (prev !== null && t - prev === DAY) ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  });
  const last = Date.parse(days[days.length - 1]);
  const today = Date.parse(todayKey());
  const current = (today - last <= DAY) ? run : 0;
  return { current, longest };
}

/* ----------------------------------------------------------------- study */
VIEWS.study = (el, opts) => {
  if (!CON.length) {
    el.innerHTML = `<div class="empty"><h2>Concept guide not built yet</h2>
      <p>Run <code>python3 build/build.py</code> after the authoring pass finishes.</p></div>`;
    return;
  }
  el.innerHTML = `
    <div class="spread mb">
      <h1 style="margin:0">Study guide</h1>
      <input type="text" id="cSearch" placeholder="Search concepts…" style="min-width:220px">
    </div>
    <div class="study-wrap">
      <div class="card tree" id="tree"></div>
      <div class="card" id="pane"></div>
    </div>`;

  const state = { paper: opts.paper || SYL.papers.find(p => CON.some(c => c.paper === p.id))?.id, sel: opts.sub || null, q: '' };

  // Which branches the reader has opened. The tree is re-rendered from scratch
  // on every selection, so without this every open unit snapped shut the moment
  // you picked a concept from it — making the list unbrowsable, since getting
  // back to the next concept meant reopening the paper and the unit each time.
  state.open = state.open || new Set([`p:${state.paper}`]);

  function drawTree() {
    const t = $('#tree');
    const q = state.q.toLowerCase();
    const isOpen = k => !!q || state.open.has(k);
    let html = '';
    SYL.papers.forEach(p => {
      const cs = CON.filter(c => c.paper === p.id && (!q || matches(c, q)));
      if (!cs.length) return;
      const pk = `p:${p.id}`;
      html += `<details data-k="${pk}" ${isOpen(pk) ? 'open' : ''}><summary>${esc(shortPaper(p.id))} <span class="dim">${cs.length}</span></summary>`;
      p.units.forEach(u => {
        const us = cs.filter(c => c.unit === String(u.no));
        if (!us.length) return;
        const uk = `u:${p.id}:${u.no}`;
        html += `<details class="u" data-k="${uk}" ${isOpen(uk) ? 'open' : ''}><summary>${esc(u.no)}. ${esc(u.title)} <span class="dim">${u.marks}m</span></summary>`;
        us.forEach(c => {
          const st = cState(c);
          html += `<a href="#" data-id="${c.id}" class="${state.sel === c.id ? 'on' : ''} ${st.status}">${esc(c.sub)}</a>`;
        });
        html += `</details>`;
      });
      html += `</details>`;
    });
    t.innerHTML = html || `<p class="dim">No matches.</p>`;
    // `toggle` does not bubble, so bind per element rather than delegating.
    $$('details[data-k]', t).forEach(d => {
      d.ontoggle = () => {
        if (d.open) state.open.add(d.dataset.k); else state.open.delete(d.dataset.k);
      };
    });
  }
  function matches(c, q) {
    return (c.sub + ' ' + c.def + ' ' + c.exp + ' ' + (c.facts || []).join(' ')).toLowerCase().includes(q);
  }

  function drawPane() {
    const pane = $('#pane');
    const c = CON.find(x => x.id === state.sel);
    if (!c) {
      const p = paperById[state.paper];
      pane.innerHTML = `
        <h2>${esc(shortPaper(state.paper))}</h2>
        <p class="muted">${esc(p?.name || '')} — ${p?.marks} marks, ${p?.type || ''}.
        ${p?.counts_for_merit ? 'Counts toward merit.' : 'Qualifying only: you need 50%.'}</p>
        ${p?.structure_note ? `<p class="dim">${esc(p.structure_note)}</p>` : ''}
        <hr class="sep">
        <p class="dim">Pick a sub-topic on the left. Units are shown with their mark weighting so you can see where the marks actually are.</p>
        <div class="scroll-x"><table>
          <thead><tr><th class="num">Marks</th><th>Unit</th><th class="num">Concepts</th><th class="num">Known</th><th class="num">Questions</th></tr></thead>
          <tbody>${(p?.units || []).map(u => {
            const cs = CON.filter(x => x.paper === p.id && x.unit === String(u.no));
            const kn = cs.filter(x => cState(x).status === 'known').length;
            const qn = ANSWERABLE.filter(x => x.paper === p.id && x.unit === String(u.no)).length;
            return `<tr><td class="num"><strong>${u.marks}</strong></td><td>${esc(u.no)}. ${esc(u.title)}</td>
              <td class="num">${cs.length}</td><td class="num">${kn}</td><td class="num">${qn}</td></tr>`;
          }).join('')}</tbody>
        </table></div>`;
      return;
    }
    touchConcept(c);
    const st = cState(c);
    // Resolve nearest-first, and match questions on the full paper|unit|sub
    // triple — the same key conceptKey() uses. Matching paper+sub alone
    // cross-links wherever a leaf name repeats across units (TECH1 reuses
    // "Threading"), so a question would surface under the wrong concept.
    const rel = (c.rel || []).map(r =>
      CON.find(x => x.sub === r && x.paper === c.paper && x.unit === c.unit)
      || CON.find(x => x.sub === r && x.paper === c.paper)
      || CON.find(x => x.sub === r)).filter(Boolean);
    const qn = ANSWERABLE.filter(x => x.paper === c.paper
      && String(x.unit) === String(c.unit) && x.sub === c.sub);
    pane.innerHTML = `
      <div class="concept">
        <div class="qmeta mb">
          <span class="pill">${esc(shortPaper(c.paper))}</span>
          <span class="pill">Unit ${esc(c.unit)} · ${esc(c.unitTitle)}</span>
          <span class="pill ${st.status === 'known' ? 'ok' : st.status === 'learning' ? 'wn' : ''}">${esc(st.status)}</span>
          ${c.derived ? '<span class="pill wn">derived — not in the official syllabus</span>' : ''}
        </div>
        <h2>${esc(c.sub)}</h2>
        ${c.derived && c.prov ? `<div class="trapbox">${esc(c.prov)}</div>` : ''}
        <div class="def">${esc(c.def)}</div>
        <div class="exp">${c.exp.split(/\n\n+/).map(x => `<p>${esc(x)}</p>`).join('')}</div>
        ${(c.facts || []).length ? `<div class="blk facts"><h4>Examinable facts</h4><ul>${c.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
        ${(c.traps || []).length ? `<div class="blk traps"><h4>Exam traps</h4><ul>${c.traps.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
        ${c.mnem ? `<div class="blk"><h4>Mnemonic</h4><div class="mnem">${esc(c.mnem)}</div></div>` : ''}
        ${rel.length ? `<div class="blk"><h4>Study alongside</h4><div class="chips">${rel.map(r => `<button class="chip" data-jump="${r.id}">${esc(r.sub)}</button>`).join('')}</div></div>` : ''}
        <hr class="sep">
        <div class="row">
          <button class="btn ${st.status === 'known' ? 'pri' : ''}" data-mark="known">Mark known</button>
          <button class="btn" data-mark="learning">Still learning</button>
          ${qn.length ? `<button class="btn" data-drill="1">Practise ${qn.length} question${qn.length > 1 ? 's' : ''}</button>` : `<span class="dim">No questions tagged to this sub-topic yet.</span>`}
        </div>
      </div>`;
    pane.onclick = e => {
      const m = e.target.closest('[data-mark]');
      if (m) { markConcept(c, m.dataset.mark); drawTree(); drawPane(); return; }
      const j = e.target.closest('[data-jump]');
      if (j) { state.sel = j.dataset.jump; drawTree(); drawPane(); return; }
      if (e.target.closest('[data-drill]')) {
        startQuiz({ title: c.sub, questions: studyOrder(qn), mode: 'practice', back: () => go('study', { paper: c.paper, sub: c.id }) });
      }
    };
  }

  $('#tree').addEventListener('click', e => {
    const a = e.target.closest('a[data-id]');
    if (!a) return;
    e.preventDefault();
    state.sel = a.dataset.id;
    const c = CON.find(x => x.id === state.sel);
    if (c) state.paper = c.paper;
    drawTree(); drawPane();
  });
  $('#cSearch').addEventListener('input', e => { state.q = e.target.value.trim(); drawTree(); });

  drawTree(); drawPane();
};

/* ------------------------------------------------------------ daily test */
function dailySet() {
  const dk = todayKey();
  const rnd = mulberry(hash32('daily' + dk));
  const n = S.settings.dailyCount;
  // 60% from what is due or unseen, 40% weighted across the whole merit syllabus
  const merit = ANSWERABLE.filter(q => paperById[q.paper]?.counts_for_merit);
  const pool = merit.length ? merit : ANSWERABLE;
  const priority = studyOrder(pool).slice(0, Math.ceil(n * 0.6));
  const rest = pool.filter(q => !priority.includes(q));
  const filler = weightedPick(rest, n - priority.length, rnd);
  return shuffle(priority.concat(filler), rnd).slice(0, n);
}

VIEWS.daily = (el) => {
  const dk = todayKey();
  const rec = S.daily[dk];
  const set = dailySet();
  if (!set.length) { el.innerHTML = emptyBank(); return; }
  if (rec) {
    el.innerHTML = `
      <h1>Daily test — ${dk}</h1>
      <div class="card mb">
        <div class="spread"><h3 style="margin:0">Already completed</h3>
        <span class="pill ${pct(rec.score, rec.total) >= 60 ? 'ok' : 'no'}">${rec.score}/${rec.total} · ${pct(rec.score, rec.total)}%</span></div>
        <p class="muted" style="margin:.6rem 0 0">The daily set is fixed for the date, so it will not reshuffle. Come back tomorrow for a new one, or use Practice for unlimited drilling.</p>
        <div class="row mt">
          <button class="btn" id="again">Retake for practice</button>
          <button class="btn" data-go2="practice">Practice mode</button>
        </div>
      </div>`;
    $('#again').onclick = () => startQuiz({ title: `Daily retake — ${dk}`, questions: set, mode: 'practice', back: () => go('daily') });
    $('[data-go2]').onclick = () => go('practice');
    return;
  }
  el.innerHTML = `
    <h1>Daily test — ${dk}</h1>
    <div class="card">
      <p><strong>${set.length} questions.</strong> Weighted to the real mark distribution and biased toward
      items you have never seen or are due to revise. Immediate feedback after each answer.</p>
      <p class="dim">Same set all day — refreshing will not reroll it.</p>
      <button class="btn pri" id="start">Start</button>
    </div>`;
  $('#start').onclick = () => startQuiz({
    title: `Daily test — ${dk}`, questions: set, mode: 'practice',
    onFinish: (score, total) => { S.daily[dk] = { score, total, ended: Date.now() }; save(); },
    back: () => go('daily'),
  });
};

/* -------------------------------------------------------------- practice */
VIEWS.practice = (el, opts) => {
  if (!ANSWERABLE.length) { el.innerHTML = emptyBank(); return; }
  const f = { paper: opts.paper || '', unit: opts.unit || '', src: '', only: '' };

  el.innerHTML = `
    <h1>Practice</h1>
    <div class="card mb">
      <div class="row">
        <label class="fld">Paper<select id="fPaper"><option value="">All</option>
          ${SYL.papers.filter(p => ANSWERABLE.some(q => q.paper === p.id)).map(p => `<option value="${p.id}">${esc(shortPaper(p.id))}</option>`).join('')}
        </select></label>
        <label class="fld">Unit<select id="fUnit"><option value="">All</option></select></label>
        <label class="fld">Sitting<select id="fSrc"><option value="">All</option></select></label>
        <label class="fld">Filter<select id="fOnly">
          <option value="">Everything</option>
          <option value="due">Due for review</option>
          <option value="unseen">Never attempted</option>
          <option value="wrong">Previously wrong</option>
          <option value="star">Starred</option>
        </select></label>
        <label class="fld">Study mode<select id="fMode">
          <option value="">Any</option>
          <option value="calculate">Calculate — a method gets you there</option>
          <option value="understand">Understand — reason from the concept</option>
          <option value="memorise">Memorise — no derivation available</option>
        </select></label>
        <label class="fld">Count<input type="number" id="fN" value="20" min="1" max="200" style="width:80px"></label>
      </div>
      <hr class="sep">
      <div class="spread">
        <div id="poolInfo" class="dim"></div>
        <button class="btn pri" id="startP">Start practice</button>
      </div>
      <hr class="sep">
      <div class="row">
        <span class="dim">Straight to a mode:</span>
        <button class="btn sm" data-mode-drill="memorise">Drill the by-heart ones</button>
        <button class="btn sm" data-mode-drill="calculate">Drill the calculations</button>
        <button class="btn sm" data-mode-drill="understand">Drill the concepts</button>
      </div>
      <p class="dim" style="margin:.5rem 0 0">These respect the paper and unit above, ignore the other
      filters, and pull the whole matching pool in review order.</p>
    </div>`;

  const sel = { paper: $('#fPaper'), unit: $('#fUnit'), src: $('#fSrc'), only: $('#fOnly'),
    mode: $('#fMode'), n: $('#fN') };
  sel.paper.value = f.paper;

  function fillUnits() {
    const pid = sel.paper.value;
    const us = pid ? (paperById[pid]?.units || []) : [];
    sel.unit.innerHTML = `<option value="">All</option>` + us
      .filter(u => ANSWERABLE.some(q => q.paper === pid && q.unit === String(u.no)))
      .map(u => `<option value="${esc(u.no)}">${esc(u.no)}. ${esc(u.title)} (${u.marks}m)</option>`).join('');
    if (f.unit) sel.unit.value = f.unit;
  }
  // Sittings depend on the chosen paper, so rebuild them with the units. Keep
  // the current selection if it still exists in the new list, rather than
  // silently resetting to All and widening the pool under the reader.
  function fillSittings() {
    const pid = sel.paper.value;
    const keep = sel.src.value;
    sel.src.innerHTML = `<option value="">All</option>`
      + sittingOptions(ANSWERABLE.filter(q => !pid || q.paper === pid));
    sel.src.value = [...sel.src.options].some(o => o.value === keep) ? keep : '';
  }
  function pool() {
    return ANSWERABLE.filter(q => {
      if (sel.paper.value && q.paper !== sel.paper.value) return false;
      if (sel.unit.value && q.unit !== sel.unit.value) return false;
      if (sel.src.value && q.srcKey !== sel.src.value) return false;
      if (sel.mode.value && modeOf(q.id) !== sel.mode.value) return false;
      const st = S.questions[q.id];
      switch (sel.only.value) {
        case 'due': return isDue(q.id);
        case 'unseen': return !st || !st.att;
        case 'wrong': return st && st.att && st.ok < st.att;
        case 'star': return st && st.star;
        default: return true;
      }
    });
  }
  function refresh() {
    const p = pool();
    // Show the mode mix of whatever is currently selected, so the split is
    // visible before you commit to a session rather than only afterwards.
    const mix = p.reduce((a, q) => { const m = modeOf(q.id); if (m) a[m] = (a[m] || 0) + 1; return a; }, {});
    const parts = Object.keys(MODE_META).filter(m => mix[m])
      .map(m => `${mix[m]} ${MODE_META[m].short}`);
    $('#poolInfo').innerHTML = `${p.length} question${p.length === 1 ? '' : 's'} match`
      + (parts.length > 1 ? ` <span class="dim">— ${esc(parts.join(' · '))}</span>` : '');
    $('#startP').disabled = !p.length;
  }
  fillUnits(); fillSittings(); refresh();
  sel.paper.onchange = () => { fillUnits(); fillSittings(); refresh(); };
  [sel.unit, sel.src, sel.only, sel.mode].forEach(s => { s.onchange = refresh; });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-mode-drill]');
    if (!b) return;
    const m = b.dataset.modeDrill;
    const qs = ANSWERABLE.filter(q => modeOf(q.id) === m
      && (!sel.paper.value || q.paper === sel.paper.value)
      && (!sel.unit.value || q.unit === sel.unit.value));
    if (!qs.length) { toast(`No ${m} questions in that selection`); return; }
    startQuiz({
      title: `${MODE_META[m].short} — ${qs.length} question${qs.length === 1 ? '' : 's'}`,
      questions: studyOrder(qs), mode: 'practice', back: () => go('practice'),
    });
  });
  $('#startP').onclick = () => {
    const n = Math.max(1, Math.min(200, parseInt(sel.n.value, 10) || 20));
    const qs = studyOrder(pool()).slice(0, n);
    startQuiz({ title: 'Practice', questions: qs, mode: 'practice', back: () => go('practice', { paper: sel.paper.value, unit: sel.unit.value }) });
  };
};

/* --------------------------------------------------------------- essays */
/* Section B is 100 of Paper I's 200 marks, so these have to be drillable and
   not merely readable. They cannot be machine-scored, so the loop is: read the
   prompt, write your answer on paper, then reveal the model answer and marking
   points and rate yourself against them.

   That rating is an opinion, not a measurement, and it is stored and reported
   as one — S.essays, never S.questions, and labelled "self-rated" everywhere it
   is shown. The MCQ accuracy figures stay machine-scored and therefore stay
   worth trusting. */
VIEWS.essays = (el, opts) => {
  if (!DESCRIPTIVE.length) {
    el.innerHTML = `<h1>Essay practice</h1><div class="card"><p class="dim">
      No conventional/essay questions in the bank yet.</p></div>`;
    return;
  }
  const papers = SYL.papers.filter(p => DESCRIPTIVE.some(q => q.paper === p.id));

  el.innerHTML = `
    <h1>Essay practice</h1>
    <p class="muted">Section B — conventional short answers, 5 marks each. Write your answer out
    first, then reveal the model answer and marking points and rate yourself honestly.
    <strong>These ratings are self-graded</strong>, so they are kept separate from your MCQ accuracy
    and never counted into it.</p>
    <div class="card mb">
      <div class="row">
        <label class="fld">Paper<select id="ePaper"><option value="">All</option>
          ${papers.map(p => `<option value="${esc(p.id)}">${esc(shortPaper(p.id))}</option>`).join('')}
        </select></label>
        <label class="fld">Unit<select id="eUnit"><option value="">All</option></select></label>
        <label class="fld">Sitting<select id="eSrc"><option value="">All</option></select></label>
        <label class="fld">Filter<select id="eOnly">
          <option value="">Everything</option>
          <option value="due">Due for review</option>
          <option value="unseen">Never attempted</option>
          <option value="weak">Rated partly / missed</option>
          <option value="star">Starred</option>
        </select></label>
        <label class="fld">Count<input type="number" id="eN" value="10" min="1" max="100" style="width:80px"></label>
      </div>
      <hr class="sep">
      <div class="spread">
        <div id="ePoolInfo" class="dim"></div>
        <button class="btn pri" id="startE">Start essay practice</button>
      </div>
    </div>
    <div id="eStats"></div>`;

  const sel = { paper: $('#ePaper'), unit: $('#eUnit'), src: $('#eSrc'),
    only: $('#eOnly'), n: $('#eN') };
  if (opts.paper) sel.paper.value = opts.paper;

  function fillDependent() {
    const pid = sel.paper.value;
    const scoped = DESCRIPTIVE.filter(q => !pid || q.paper === pid);
    const us = pid ? (paperById[pid]?.units || []) : [];
    const keepU = sel.unit.value, keepS = sel.src.value;
    sel.unit.innerHTML = `<option value="">All</option>` + us
      .filter(u => scoped.some(q => q.unit === String(u.no)))
      .map(u => `<option value="${esc(u.no)}">${esc(u.no)}. ${esc(u.title)}</option>`).join('');
    sel.unit.value = [...sel.unit.options].some(o => o.value === keepU) ? keepU : '';
    sel.src.innerHTML = `<option value="">All</option>` + sittingOptions(scoped);
    sel.src.value = [...sel.src.options].some(o => o.value === keepS) ? keepS : '';
  }
  function pool() {
    return DESCRIPTIVE.filter(q => {
      if (sel.paper.value && q.paper !== sel.paper.value) return false;
      if (sel.unit.value && q.unit !== sel.unit.value) return false;
      if (sel.src.value && q.srcKey !== sel.src.value) return false;
      const st = S.essays[q.id];
      switch (sel.only.value) {
        case 'due': return isEssayDue(q.id);
        case 'unseen': return !st || !st.att;
        case 'weak': return !!st && (st.lastRating === 'part' || st.lastRating === 'miss');
        case 'star': return !!st && st.star;
        default: return true;
      }
    });
  }
  function refresh() {
    const p = pool();
    const seen = p.filter(q => (S.essays[q.id] || {}).att).length;
    $('#ePoolInfo').innerHTML = `${p.length} essay question${p.length === 1 ? '' : 's'} match`
      + (p.length ? ` <span class="dim">— ${seen} attempted, ${p.length - seen} never seen</span>` : '');
    $('#startE').disabled = !p.length;

    const all = DESCRIPTIVE;
    const att = all.filter(q => (S.essays[q.id] || {}).att);
    const tally = att.reduce((a, q) => { a[S.essays[q.id].lastRating] = (a[S.essays[q.id].lastRating] || 0) + 1; return a; }, {});
    const due = all.filter(q => isEssayDue(q.id)).length;
    $('#eStats').innerHTML = `
      <div class="card">
        <div class="spread mb"><strong>Your essay progress</strong>
          <span class="pill wn">self-rated</span></div>
        <div class="grid g2">
          ${stat('Attempted', `${att.length}`, `of ${all.length} in bank`)}
          ${stat('Due for review', `${due}`, 'by your own last rating')}
          ${stat('Last rated “got it”', `${tally.good || 0}`, 'most recent attempt')}
          ${stat('Last rated partly / missed', `${(tally.part || 0) + (tally.miss || 0)}`, 'worth another pass')}
        </div>
        <p class="dim" style="margin:.6rem 0 0">Self-ratings are your own judgement against the model
        answer, so they are reported here only — they are not mixed into the accuracy figures on
        Dashboard or Progress, which are scored against a known key.</p>
      </div>`;
  }
  fillDependent(); refresh();
  sel.paper.onchange = () => { fillDependent(); refresh(); };
  [sel.unit, sel.src, sel.only].forEach(s => { s.onchange = refresh; });
  $('#startE').onclick = () => {
    const n = Math.max(1, Math.min(100, parseInt(sel.n.value, 10) || 10));
    // Never-seen first, then the ones you rated worst, then by how long ago.
    const rank = q => {
      const st = S.essays[q.id];
      if (!st || !st.att) return 0;
      return ({ miss: 1, part: 2, good: 3 })[st.lastRating] || 2;
    };
    const qs = pool().slice()
      .sort((a, b) => rank(a) - rank(b) || (S.essays[a.id]?.last || 0) - (S.essays[b.id]?.last || 0))
      .slice(0, n);
    startEssaySession({ questions: qs, back: () => go('essays', { paper: sel.paper.value }) });
  };
};

/* ----------------------------------------------------------- past papers */
VIEWS.papers = (el) => {
  const groups = {};
  QS.filter(q => q.src === 'past').forEach(q => { (groups[q.srcKey] = groups[q.srcKey] || []).push(q); });
  const keys = Object.keys(groups).sort();
  if (!keys.length) { el.innerHTML = emptyBank(); return; }
  el.innerHTML = `
    <h1>Past papers</h1>
    <p class="muted">Real past papers, grouped by sitting. The Nov-2024 Informatics Officer sitting predates the
    30 July 2026 syllabus change — practice it under "Technical I · Informatics Officer (legacy syllabus)" in
    Study/Practice, not as a preview of the current Technical Paper I. Answers for that sitting come from MPSC's
    published final answer key.</p>
    <div class="grid g2 mt">
      ${keys.map(k => {
        const qs = groups[k].slice().sort((a, b) => a.no - b.no);
        // Only MCQs can be scored, so counts, marks and progress are all
        // reckoned on them; the essay questions are shown as a separate count.
        const mcq = qs.filter(q => !isDescriptive(q));
        const essay = qs.length - mcq.length;
        const att = mcq.filter(q => S.questions[q.id]?.att).length;
        const ok = mcq.filter(q => S.questions[q.id]?.lastOk).length;
        const off = qs.some(q => q.prov && /\bofficial\b/i.test(q.prov)
                                 && !/\b(?:no|without|never)\s+official/i.test(q.prov));
        const partial = qs.find(q => q.note && q.note.startsWith('Only the Paper-I'));
        return `<div class="card">
          <div class="spread"><h3 style="margin:0">${esc(qs[0].sitting)}</h3>
          <span class="pill ${off ? 'ok' : 'wn'}">${off ? 'official key' : 'derived answers'}</span></div>
          <p class="dim" style="margin:.35rem 0 .6rem">${esc(shortPaper(qs[0].paper))} · ${mcq.length} MCQ · ${mcq.length * 2} marks${essay ? ` · ${essay} essay` : ''}</p>
          ${partial ? `<p class="dim" style="margin:-.3rem 0 .6rem;font-size:.75rem">${esc(partial.note)}</p>` : ''}
          <div style="font-size:.78rem;color:var(--ink-3)">Attempted ${att}/${mcq.length}${att ? ` · last-attempt ${pct(ok, att)}%` : ''}</div>
          <div class="bar mb"><i style="width:${pct(att, mcq.length)}%"></i></div>
          <div class="row">
            <button class="btn pri sm" data-run="${esc(k)}">Attempt as exam</button>
            <button class="btn sm" data-browse="${esc(k)}">Browse${essay ? ' + essay Qs' : ' with answers'}</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  el.onclick = e => {
    const r = e.target.closest('[data-run]');
    if (r) {
      // Essay questions cannot be auto-scored, so a timed attempt runs the
      // MCQ section only. They remain available under "Browse".
      const qs = groups[r.dataset.run].filter(q => !isDescriptive(q))
        .slice().sort((a, b) => a.no - b.no);
      if (!qs.length) { toast('This paper has no auto-scorable questions'); return; }
      startQuiz({ title: qs[0].sitting + ' — ' + shortPaper(qs[0].paper), questions: qs, mode: 'exam',
        seconds: 2 * 3600, back: () => go('papers') });
      return;
    }
    const b = e.target.closest('[data-browse]');
    if (b) browsePaper(groups[b.dataset.browse]);
  };
};

function browsePaper(qs) {
  const list = qs.slice().sort((a, b) => a.no - b.no);
  const el = $('#main');
  el.innerHTML = `
    <div class="spread mb">
      <div><h1 style="margin:0">${esc(list[0].sitting)}</h1>
        <p class="dim" style="margin:0">${esc(shortPaper(list[0].paper))} — all ${list.length} questions</p></div>
      <div class="row">
        <button class="btn sm" id="revealAll">${S.settings.hideAnswers ? 'Reveal all answers' : 'Hide all answers'}</button>
        <button class="btn" id="back">Back</button>
      </div>
    </div>
    ${list.map(q => `
      <div class="card mb">
        <div class="qmeta mb">
          <strong style="color:var(--ink)">${isDescriptive(q) ? 'Section B · Q' + (q.no - 1000) : 'Q' + q.no}</strong>
          ${isDescriptive(q) ? `<span class="pill acc">conventional / essay</span>` : ''}
          ${q.unit ? `<span class="pill">${unitLabel(q)}</span>` : ''}
          ${q.sub ? `<span class="pill">${esc(q.sub)}</span>` : ''}
          ${isDescriptive(q) ? '' : modeBadge(q.id)}
          ${q.ans === 'COMPENSATED' ? `<span class="pill wn">voided by MPSC</span>` : ''}
        </div>
        <div class="qtext">${esc(q.q)}</div>
        ${isDescriptive(q) ? `
        <div class="opts" data-opts="${q.id}">
          <div class="model-answer">
            <div class="model-head">Model answer</div>
            ${(q.model || '').split(/\n\s*\n/).filter(p => p.trim())
              .map(p => `<p>${esc(p.trim())}</p>`).join('')}
            ${(q.points || []).length ? `<div class="model-head">Marking points</div>
            <ul>${q.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
          </div>
        </div>
        <button class="btn sm reveal-one" data-reveal="${q.id}">Show model answer</button>`
        : `
        <div class="opts" data-opts="${q.id}">${['A', 'B', 'C', 'D', 'E'].filter(k => q.opts[k] != null).map(k => `
          <div class="opt ${q.ans === k ? 'right' : ''}" style="cursor:default">
            <span class="lab">${k}</span><span>${esc(q.opts[k])}</span></div>`).join('')}</div>
        <button class="btn sm reveal-one" data-reveal="${q.id}">Show answer</button>`}
        ${q.exp || q.prov ? `<div class="expl">${q.exp ? esc(q.exp) : ''}${disputeBlock(q)}${provLine(q)}</div>` : ''}
      </div>`).join('')}
    <button class="btn" id="back2">Back to papers</button>`;
  // Hide/reveal answers. Browsing a past paper is only a self-test if the
  // answer is not already highlighted — so the answer key and explanation can be
  // collapsed per question or for the whole paper, and the choice persists.
  const paintHidden = () => {
    const hidden = !!S.settings.hideAnswers;
    el.classList.toggle('answers-hidden', hidden);
    $$('.reveal-one', el).forEach(b => {
      b.hidden = !hidden || el.querySelector(`[data-opts="${b.dataset.reveal}"]`)?.classList.contains('shown');
    });
    const rb = $('#revealAll');
    if (rb) rb.textContent = hidden ? 'Reveal all answers' : 'Hide all answers';
  };
  $('#revealAll').onclick = () => {
    S.settings.hideAnswers = !S.settings.hideAnswers;
    if (!S.settings.hideAnswers) $$('[data-opts]', el).forEach(o => o.classList.remove('shown'));
    save(); paintHidden();
  };
  el.addEventListener('click', e => {
    const r = e.target.closest('[data-reveal]');
    if (!r) return;
    el.querySelector(`[data-opts="${r.dataset.reveal}"]`)?.classList.add('shown');
    r.closest('.card')?.classList.add('shown');
    r.hidden = true;
  });
  paintHidden();
  $('#back').onclick = $('#back2').onclick = () => go('papers');
  window.scrollTo(0, 0);
}

/* ------------------------------------------------------------- mock test */
VIEWS.mock = (el, opts) => {
  if (!ANSWERABLE.length) { el.innerHTML = emptyBank(); return; }
  const merit = SYL.papers.filter(p => p.counts_for_merit && ANSWERABLE.some(q => q.paper === p.id));
  el.innerHTML = `
    <h1>Mock test</h1>
    <p class="muted">Timed, exam-conditions simulation. Questions are sampled across units in proportion to their real mark
    weighting, so a 40-mark unit gets twice the airtime of a 20-mark one. No feedback until you submit.</p>
    <div class="grid g2 mt">
      ${merit.map(p => {
        const n = ANSWERABLE.filter(q => q.paper === p.id).length;
        const want = p.questions || 100;
        return `<div class="card">
          <h3 style="margin:0">${esc(shortPaper(p.id))}</h3>
          <p class="dim" style="margin:.35rem 0 .7rem">${want} questions · ${p.marks} marks · ${p.duration_hours || 2} hours<br>
          bank holds ${n}${n < want ? ` <span style="color:var(--warn)">(short of ${want} — sampled with what exists)</span>` : ''}</p>
          <button class="btn pri sm" data-mock="${p.id}">Start ${p.duration_hours || 2}-hour mock</button>
        </div>`;
      }).join('')}
      <div class="card">
        <h3 style="margin:0">Quick mock</h3>
        <p class="dim" style="margin:.35rem 0 .7rem">50 questions across all three technical papers · 60 minutes</p>
        <button class="btn sm" data-mock="QUICK">Start quick mock</button>
      </div>
      ${SYL.papers.filter(p => !p.counts_for_merit && !p.legacy && ANSWERABLE.some(q => q.paper === p.id)).map(p => {
        const n = ANSWERABLE.filter(q => q.paper === p.id).length;
        return `<div class="card">
          <div class="spread"><h3 style="margin:0">${esc(shortPaper(p.id))}</h3><span class="pill wn">qualifying</span></div>
          <p class="dim" style="margin:.35rem 0 .7rem">You need 50% to stay in the race. Bank holds ${n} questions.</p>
          <button class="btn sm" data-mock="${p.id}">Start qualifying mock</button>
        </div>`;
      }).join('')}
      ${SYL.papers.filter(p => p.legacy && ANSWERABLE.some(q => q.paper === p.id)).map(p => {
        const n = ANSWERABLE.filter(q => q.paper === p.id).length;
        return `<div class="card">
          <div class="spread"><h3 style="margin:0">${esc(shortPaper(p.id))}</h3><span class="pill dim">legacy practice</span></div>
          <p class="dim" style="margin:.35rem 0 .7rem">Superseded syllabus — does not count toward the current exam. Bank holds ${n} questions.</p>
          <button class="btn sm" data-mock="${p.id}">Start practice mock</button>
        </div>`;
      }).join('')}
    </div>`;
  el.onclick = e => {
    const m = e.target.closest('[data-mock]');
    if (!m) return;
    const id = m.dataset.mock;
    const rnd = mulberry(hash32('mock' + Date.now()));
    let qs, title, secs;
    if (id === 'QUICK') {
      qs = weightedPick(ANSWERABLE.filter(q => paperById[q.paper]?.counts_for_merit), 50, rnd);
      title = 'Quick mock — all technical papers'; secs = 3600;
    } else {
      const p = paperById[id];
      qs = weightedPick(ANSWERABLE.filter(q => q.paper === id), p.questions || 100, rnd);
      title = 'Mock — ' + shortPaper(id);
      secs = (p.duration_hours || 2) * 3600;
    }
    if (!qs.length) { toast('No questions available for that paper yet'); return; }
    startQuiz({ title, questions: qs, mode: 'exam', seconds: secs, back: () => go('mock') });
  };
};

/* ---------------------------------------------------------------- review */
VIEWS.review = (el) => {
  const due = ANSWERABLE.filter(q => isDue(q.id));
  const wrong = ANSWERABLE.filter(q => { const s = S.questions[q.id]; return s && s.att && s.ok < s.att; });
  const starred = ANSWERABLE.filter(q => S.questions[q.id]?.star);
  const never = ANSWERABLE.filter(q => !S.questions[q.id]?.att);
  const dueByMode = due.reduce((a, q) => {
    const m = modeOf(q.id); if (m) a[m] = (a[m] || 0) + 1; return a;
  }, {});

  el.innerHTML = `
    <h1>Review</h1>
    <p class="muted">Spaced repetition: a question you get right moves to a longer interval
    (${BOX_DAYS.slice(1).map(d => d + 'd').join(' → ')}); a question you get wrong drops back to daily.
    Those intervals are now <strong>paced by study mode</strong> — a <em>memorise</em> question comes
    back at ${Math.round(MODE_PACE.memorise * 100)}% of the interval and an <em>understand</em> one at
    ${Math.round(MODE_PACE.understand * 100)}%, because an arbitrary section number decays a great deal
    faster than a principle you actually follow.</p>
    <div class="grid g4 mt mb">
      ${stat('Due now', String(due.length), 'scheduled revision')}
      ${stat('Ever wrong', String(wrong.length), 'your mistake log')}
      ${stat('Starred', String(starred.length), 'flagged by you')}
      ${stat('Untouched', String(never.length), 'never attempted')}
    </div>
    <div class="row">
      ${due.length ? `<button class="btn pri" data-set="due">Revise ${due.length} due</button>` : ''}
      ${wrong.length ? `<button class="btn" data-set="wrong">Drill ${wrong.length} mistakes</button>` : ''}
      ${starred.length ? `<button class="btn" data-set="star">Starred (${starred.length})</button>` : ''}
      ${never.length ? `<button class="btn" data-set="never">New questions (${never.length})</button>` : ''}
    </div>
    ${Object.keys(MODE_META).some(m => dueByMode[m]) ? `
      <div class="row mt">
        <span class="dim">Due, by study mode:</span>
        ${Object.keys(MODE_META).filter(m => dueByMode[m]).map(m =>
          `<button class="btn sm" data-set="mode:${m}">${esc(MODE_META[m].short)} (${dueByMode[m]})</button>`).join('')}
      </div>` : ''}
    ${wrong.length ? `
      <h2 class="mt">Mistake log</h2>
      <div class="card"><div class="scroll-x"><table>
        <thead><tr><th>Paper</th><th>Question</th><th class="num">Right</th><th class="num">Tries</th><th>Box</th></tr></thead>
        <tbody>${wrong.slice(0, 60).map(q => {
          const s = S.questions[q.id];
          return `<tr>
            <td class="dim">${esc(q.paper)}</td>
            <td>${esc(q.q.slice(0, 110))}${q.q.length > 110 ? '…' : ''}</td>
            <td class="num">${s.ok}</td><td class="num">${s.att}</td>
            <td><span class="pill ${s.box >= 4 ? 'ok' : s.box >= 2 ? 'wn' : 'no'}">${s.box}</span></td>
          </tr>`;
        }).join('')}</tbody></table></div>
        ${wrong.length > 60 ? `<p class="dim mt">Showing 60 of ${wrong.length}.</p>` : ''}
      </div>` : ''}`;

  el.onclick = e => {
    const b = e.target.closest('[data-set]');
    if (!b) return;
    const key = b.dataset.set;
    const m = key.startsWith('mode:') ? key.slice(5) : null;
    const map = { due, wrong, star: starred, never };
    const src = m ? due.filter(q => modeOf(q.id) === m) : map[key];
    const qs = studyOrder(src).slice(0, 40);
    startQuiz({
      title: 'Review — ' + (m ? `due · ${MODE_META[m].short}` : key),
      questions: qs, mode: 'practice', back: () => go('review'),
    });
  };
};

/* -------------------------------------------------------------- progress */
VIEWS.progress = (el) => {
  const att = Object.values(S.questions).reduce((a, s) => a + (s.att || 0), 0);
  const ok = Object.values(S.questions).reduce((a, s) => a + (s.ok || 0), 0);
  const st = streak();
  const rows = unitStats().filter(r => r.n > 0);
  const boxes = [1, 2, 3, 4, 5].map(b => Object.values(S.questions).filter(s => s.box === b && s.att).length);

  el.innerHTML = `
    <h1>Progress</h1>
    <div class="grid g4 mb">
      ${stat('Total attempts', String(att), `${ok} correct`)}
      ${stat('Accuracy', `${pct(ok, att)}%`, 'all time')}
      ${stat('Streak', String(st.current), `best ${st.longest}`)}
      ${stat('Sessions', String(S.sessions.length), 'tests taken')}
    </div>

    <div class="grid g2">
      <div class="card">
        <h3>Retention boxes</h3>
        <p class="dim">Box 5 means you have got it right five times running and will not see it again for three weeks.</p>
        <table><tbody>${boxes.map((n, i) => `
          <tr><td style="width:60px">Box ${i + 1}</td>
          <td><div class="bar ${i >= 3 ? 'good' : i >= 1 ? 'warn' : 'bad'}"><i style="width:${pct(n, Math.max(...boxes, 1))}%"></i></div></td>
          <td class="num" style="width:50px">${n}</td></tr>`).join('')}</tbody></table>
      </div>
      <div class="card">
        <h3>Activity</h3>
        <p class="dim">Daily tests completed over the last 12 weeks.</p>
        <div class="heat">${heatCells(84)}</div>
      </div>
    </div>

    <h2 class="mt">Unit-by-unit</h2>
    <div class="card"><div class="scroll-x"><table>
      <thead><tr><th>Paper</th><th>Unit</th><th class="num">Marks</th><th class="num">Bank</th><th class="num">Attempts</th><th class="num">Accuracy</th><th></th></tr></thead>
      <tbody>${rows.map(r => `
        <tr>
          <td class="dim">${esc(r.paper)}</td>
          <td>${esc(r.no)}. ${esc(r.title)}</td>
          <td class="num">${r.marks}</td>
          <td class="num">${r.n}</td>
          <td class="num">${r.att}</td>
          <td class="num">${r.att ? `<span class="pill ${r.acc >= 70 ? 'ok' : r.acc >= 45 ? 'wn' : 'no'}">${r.acc}%</span>` : '<span class="dim">—</span>'}</td>
          <td><button class="btn sm" data-go="practice" data-opts='${JSON.stringify({ paper: r.paper, unit: r.no })}'>Drill</button></td>
        </tr>`).join('')}</tbody>
    </table></div></div>

    ${S.sessions.length ? `
      <h2 class="mt">Recent sessions</h2>
      <div class="card"><div class="scroll-x"><table>
        <thead><tr><th>When</th><th>Test</th><th class="num">Score</th><th class="num">%</th></tr></thead>
        <tbody>${S.sessions.slice(-25).reverse().map(s => `
          <tr><td class="dim">${new Date(s.ended).toLocaleString()}</td>
          <td>${esc(s.title || s.type)}</td>
          <td class="num">${s.score}/${s.total}</td>
          <td class="num"><span class="pill ${pct(s.score, s.total) >= 60 ? 'ok' : 'no'}">${pct(s.score, s.total)}%</span></td></tr>`).join('')}
        </tbody></table></div></div>` : ''}`;

  el.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) go(g.dataset.go, JSON.parse(g.dataset.opts || '{}'));
  });
};

function heatCells(n) {
  const out = [];
  const start = Date.parse(todayKey()) - (n - 1) * DAY;
  for (let i = 0; i < n; i++) {
    const d = new Date(start + i * DAY).toISOString().slice(0, 10);
    const r = S.daily[d];
    let lvl = '';
    if (r) {
      const p = pct(r.score, r.total);
      lvl = p >= 80 ? 'l4' : p >= 60 ? 'l3' : p >= 40 ? 'l2' : 'l1';
    }
    out.push(`<i class="${lvl}" title="${d}${r ? ` — ${r.score}/${r.total}` : ''}"></i>`);
  }
  return out.join('');
}

function emptyBank() {
  return `<div class="empty"><h2>Question bank is empty</h2>
    <p>Run <code>python3 build/build.py</code> once the solving pass has written its output.</p></div>`;
}

/* ================================================================ calc lab */
/* Forked from the System Manager app's Calc Lab, not shared with it — see
   BUILD_GUIDE.md §4 for why the two app.js files are deliberate duplicates. */
/* Procedural topics — subnetting, OSPF cost, STP elections, base conversion,
   normalisation — are not learned by reading a concept card once. They are
   learned by working the method repeatedly until it is automatic. The question
   bank cannot supply that: measured when this was built, all 1,082 questions
   held just 40 across the seventeen leaves of TECH1 Unit 1, of which exactly ONE
   is a genuine subnetting calculation, and six of those leaves had nothing at
   all to drill against.

   So these items are generated rather than stored. The pool is unbounded, and
   every item shows its full worked solution after you answer — the method is
   what is being taught, not the answer letter. */

const calcStat = id => S.calc[id] || { att: 0, ok: 0 };

/* Resolve a generator's target subtopic to its concept record.
   VIEWS.study takes `sub` but actually reads it as a concept ID (see the
   existing callers, which pass `sub: c.id`) — passing the subtopic string
   silently lands on the paper overview instead of the concept. Matching on the
   full paper|unit|sub triple, not on `sub` alone, because six leaf names are
   reused across units in this syllabus. */
const conceptFor = g => CON.find(c =>
  c.paper === g.paper && String(c.unit) === String(g.unit) && c.sub === g.sub);

function recordDrill(id, correct) {
  const st = Object.assign({ att: 0, ok: 0 }, S.calc[id]);
  st.att += 1; if (correct) st.ok += 1;
  st.last = Date.now();
  S.calc[id] = st; save();
}

/* Drill stems carry hard line breaks — code listings, ER scenarios, dependency
   lists. Escape first, then convert the newlines, so markup can only ever come
   from this function and never from generated text. */
const blockText = s => esc(s).replace(/\n/g, '<br>');

const calcGroups = () => {
  const g = new Map();
  GENS.forEach(d => { if (!g.has(d.group)) g.set(d.group, []); g.get(d.group).push(d); });
  return g;
};

VIEWS.calc = (el) => {
  if (!GENS.length) {
    el.innerHTML = `<div class="empty"><h2>Calc Lab not loaded</h2>
      <p><code>data/calc.js</code> is missing or failed to parse — check the browser console.</p></div>`;
    return;
  }
  const groups = calcGroups();
  const totalAtt = Object.values(S.calc).reduce((a, s) => a + (s.att || 0), 0);
  const totalOk = Object.values(S.calc).reduce((a, s) => a + (s.ok || 0), 0);

  el.innerHTML = `
    <h1>Calc Lab</h1>
    <div class="card mb">
      <p><strong>${GENS.length} generators across ${groups.size} topics, producing unlimited items.</strong>
      Every question is worked out from scratch each time, and answering reveals the full
      step-by-step method rather than just the correct letter.</p>
      <p class="dim">These are the calculation and procedure topics — subnetting, OSPF and EIGRP
      metrics, STP and DR elections, VLAN tagging, NAT, base conversion, normalisation, and the
      language traps where the arithmetic is trivial and the catch is the whole question.
      Separate from the Practice tab, which drills real past-paper questions. Progress here is
      tracked per generator and does not affect your question-bank review schedule.</p>
      <hr class="sep">
      <div class="spread">
        <div class="row">
          <label class="fld">Questions<input type="number" id="cN" value="15" min="5" max="60" style="width:80px"></label>
          ${totalAtt ? `<span class="dim">Lifetime: ${totalOk}/${totalAtt} correct · ${pct(totalOk, totalAtt)}%</span>` : ''}
        </div>
        <button class="btn pri" id="mixAll">Mixed drill — everything</button>
      </div>
    </div>

    ${[...groups.entries()].map(([name, ds]) => {
      const att = ds.reduce((a, d) => a + calcStat(d.id).att, 0);
      const ok = ds.reduce((a, d) => a + calcStat(d.id).ok, 0);
      return `<div class="card mb">
        <div class="spread">
          <h3 style="margin:0">${esc(name)}</h3>
          <div class="row">
            ${att ? `<span class="pill ${pct(ok, att) >= 70 ? 'ok' : pct(ok, att) >= 45 ? 'wn' : 'no'}">${ok}/${att} · ${pct(ok, att)}%</span>` : '<span class="pill">not started</span>'}
            <button class="btn sm" data-group="${esc(name)}">Drill this topic</button>
          </div>
        </div>
        <hr class="sep">
        ${ds.map(d => {
          const st = calcStat(d.id);
          return `<div class="drill-row">
            <div class="drill-main">
              <strong>${esc(d.title)}</strong>
              <span class="dim">${esc(d.blurb)}</span>
            </div>
            <div class="row">
              ${st.att ? `<span class="pill ${pct(st.ok, st.att) >= 70 ? 'ok' : pct(st.ok, st.att) >= 45 ? 'wn' : 'no'}">${st.ok}/${st.att}</span>` : ''}
              <button class="btn sm" data-gen="${esc(d.id)}">Practice</button>
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }).join('')}`;

  const count = () => Math.max(5, Math.min(60, parseInt($('#cN').value, 10) || 15));
  $('#mixAll').onclick = () => startDrill({ title: 'Mixed drill', gens: GENS, count: count() });
  el.addEventListener('click', e => {
    const g = e.target.closest('[data-group]');
    if (g) {
      const ds = groups.get(g.dataset.group);
      startDrill({ title: g.dataset.group, gens: ds, count: count() });
      return;
    }
    const d = e.target.closest('[data-gen]');
    if (d) {
      const gen = GENS.find(x => x.id === d.dataset.gen);
      if (gen) startDrill({ title: gen.title, gens: [gen], count: count() });
    }
  });
};

/* Generated-item runner. Deliberately not startQuiz(): drill items have no
   stable id, so they cannot carry a Leitner box, a star, or a place in the
   review pool. What they have instead is a worked solution. */
function startDrill({ title, gens, count, seed }) {
  const el = $('#main');
  // A drill set is fully reproducible from its seed. Shown on the results
  // screen so an item that caught you out can be revisited exactly.
  const s0 = seed != null ? seed : (Math.floor(Math.random() * 1e9) | 0);
  const pickRnd = mulberry(s0);
  const items = [];
  for (let i = 0; i < count; i++) {
    const g = gens[Math.floor(pickRnd() * gens.length)];
    try {
      items.push({ g, it: g.gen(mulberry(hash32(`${s0}|${i}|${g.id}`))) });
    } catch (err) {
      // One broken generator must not take the whole set down with it.
      console.error('drill generator failed', g.id, err);
    }
  }
  if (!items.length) { toast('Could not build a drill set'); go('calc'); return; }

  const picks = new Array(items.length).fill(null);
  const graded = new Array(items.length).fill(false);
  let i = 0;

  const scoreNow = () => items.reduce((a, x, k) => a + (picks[k] === x.it.ans ? 1 : 0), 0);

  function draw() {
    const { g, it } = items[i];
    const shown = graded[i];
    const st = calcStat(g.id);
    el.innerHTML = `
      <div class="quiz">
        <div class="quiz-head">
          <div>
            <h1 style="margin:0;font-size:1.15rem">${esc(title)}</h1>
            <span class="dim">Item ${i + 1} of ${items.length} · generated, not from a past paper</span>
          </div>
          <div class="row"><button class="btn sm" id="quit">Quit</button></div>
        </div>

        <div class="card">
          <div class="qmeta mb">
            <span class="pill">${esc(shortPaper(g.paper))}</span>
            <span class="pill">Unit ${esc(g.unit)}</span>
            <span class="pill acc">${esc(g.title)}</span>
            ${st.att ? `<span class="dim">${st.ok}/${st.att} on this generator</span>` : ''}
          </div>
          <div class="qtext">${blockText(it.q)}</div>
          <div class="opts" id="opts">
            ${['A', 'B', 'C', 'D', 'E'].filter(k => it.opts[k] != null).map(k => {
              let cls = '';
              if (shown) { if (k === it.ans) cls = 'right'; else if (k === picks[i]) cls = 'wrong'; }
              else if (picks[i] === k) cls = 'sel';
              return `<button class="opt ${cls}" data-k="${k}" ${shown ? 'disabled' : ''}>
                <span class="lab">${k}</span><span>${esc(it.opts[k])}</span></button>`;
            }).join('')}
          </div>
          ${shown ? `<div class="expl">
            <strong>${picks[i] === it.ans ? 'Correct' : `Not quite — the answer is ${it.ans}`}.</strong>
            <ol class="steps">${it.steps.map(x => `<li>${blockText(x)}</li>`).join('')}</ol>
            ${it.trap ? `<div class="trapbox"><strong>Watch for:</strong> ${esc(it.trap)}</div>` : ''}
            ${conceptFor(g) ? `<div class="row mt"><button class="btn sm" id="toConcept">Read the concept: ${esc(g.sub)} →</button></div>` : ''}
          </div>` : ''}
          <div class="row mt">
            <button class="btn" id="prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
            <button class="btn ${shown ? 'pri' : ''}" id="next">${i === items.length - 1 ? 'Finish' : 'Next →'}</button>
          </div>
        </div>

        <div class="pager" id="pager">${items.map((_, k) => {
          let cls = k === i ? 'on' : '';
          if (graded[k]) cls += picks[k] === items[k].it.ans ? ' ok' : ' no';
          return `<button class="${cls}" data-i="${k}">${k + 1}</button>`;
        }).join('')}</div>
      </div>`;

    $('#opts').onclick = e => {
      const b = e.target.closest('.opt[data-k]');
      if (!b || b.disabled) return;
      picks[i] = b.dataset.k;
      graded[i] = true;
      recordDrill(g.id, picks[i] === it.ans);
      draw();
    };
    $('#prev').onclick = () => { if (i > 0) { i--; draw(); } };
    $('#next').onclick = () => { if (i === items.length - 1) finish(); else { i++; draw(); } };
    $('#pager').onclick = e => { const b = e.target.closest('button[data-i]'); if (b) { i = +b.dataset.i; draw(); } };
    $('#quit').onclick = () => go('calc');
    const tc = $('#toConcept');
    if (tc) tc.onclick = () => {
      const c = conceptFor(g);
      if (c) go('study', { paper: c.paper, sub: c.id });
    };
  }

  function finish() {
    const score = scoreNow();
    const answered = graded.filter(Boolean).length;
    // Per-generator breakdown, so a weak method is named rather than buried in
    // an overall percentage.
    const per = new Map();
    items.forEach((x, k) => {
      if (!graded[k]) return;
      const e = per.get(x.g.id) || { title: x.g.title, att: 0, ok: 0 };
      e.att++; if (picks[k] === x.it.ans) e.ok++;
      per.set(x.g.id, e);
    });
    const weak = [...per.values()].filter(e => e.ok < e.att).sort((a, b) => (a.ok / a.att) - (b.ok / b.att));
    el.innerHTML = `
      <h1>${esc(title)} — done</h1>
      <div class="card mb">
        <div class="spread">
          <h3 style="margin:0">${score} / ${answered || items.length}</h3>
          <span class="pill ${pct(score, answered || items.length) >= 60 ? 'ok' : 'no'}">${pct(score, answered || items.length)}%</span>
        </div>
        ${answered < items.length ? `<p class="dim">${items.length - answered} item${items.length - answered === 1 ? '' : 's'} left unanswered.</p>` : ''}
        <div class="row mt">
          <button class="btn pri" id="again">Another set</button>
          <button class="btn" id="replay">Replay this exact set</button>
          <button class="btn" id="back">Back to Calc Lab</button>
        </div>
        <p class="dim mt">Seed ${s0} — the same seed always rebuilds the same items.</p>
      </div>
      ${weak.length ? `<div class="card">
        <h3 style="margin-top:0">Where it went wrong</h3>
        ${weak.map(e => `<div class="drill-row"><div class="drill-main"><strong>${esc(e.title)}</strong></div>
          <span class="pill ${e.ok === 0 ? 'no' : 'wn'}">${e.ok}/${e.att}</span></div>`).join('')}
        <p class="dim" style="margin-bottom:0">Method problems repeat. Drill these individually before mixing again.</p>
      </div>` : `<div class="card"><p style="margin:0">Every method you attempted came out right.</p></div>`}`;
    $('#again').onclick = () => startDrill({ title, gens, count });
    $('#replay').onclick = () => startDrill({ title, gens, count, seed: s0 });
    $('#back').onclick = () => go('calc');
  }

  draw();
}

/* ==================================================== essay session engine */
/* Separate from startQuiz rather than a mode of it. startQuiz is built around
   picking an option and being told if it matched the key: it scores, it paces
   by Leitner box, it reports a percentage. None of that is true here — there is
   nothing to click and nothing to be right about, and bolting a "mode" onto it
   would mean threading `if (essay)` through the option grid, the scorer, the
   timer and the results screen. */
function startEssaySession({ questions, back }) {
  if (!questions || !questions.length) { toast('No essay questions to show'); return; }
  const Q = questions.slice();
  const rated = new Array(Q.length).fill(null);
  let i = 0, shown = false;
  const el = $('#main');

  const RATINGS = [
    ['good', 'Got it', 'I covered the marking points'],
    ['part', 'Partly', 'I missed some points'],
    ['miss', 'Missed it', "I couldn't answer this"],
  ];

  function draw() {
    const q = Q[i];
    const st = eState(q.id);
    el.innerHTML = `
      <div class="quiz">
        <div class="quiz-head">
          <div>
            <h1 style="margin:0;font-size:1.15rem">Essay practice</h1>
            <span class="dim">Question ${i + 1} of ${Q.length} · self-graded</span>
          </div>
          <div class="row">
            <button class="btn sm" id="starBtn" title="Flag for later">${st.star ? '★' : '☆'}</button>
            <button class="btn sm" id="quit">Quit</button>
          </div>
        </div>

        <div class="card">
          <div class="qmeta mb">
            <span class="pill">${esc(shortPaper(q.paper))}</span>
            ${q.unit ? `<span class="pill">${unitLabel(q)}</span>` : ''}
            <span class="pill acc">conventional / essay · 5 marks</span>
            ${q.sub ? `<span class="pill">${esc(q.sub)}</span>` : ''}
            ${st.att ? `<span class="dim">seen ${st.att}× · last: ${esc(
              ({ good: 'got it', part: 'partly', miss: 'missed it' })[st.lastRating] || '—')} · box ${st.box}</span>` : ''}
          </div>
          <div class="qtext">${esc(q.q)}</div>

          ${shown ? `
            <div class="model-answer mt">
              <div class="model-head">Model answer</div>
              ${(q.model || '').split(/\n\s*\n/).filter(p => p.trim())
                .map(p => `<p>${esc(p.trim())}</p>`).join('')}
              ${(q.points || []).length ? `<div class="model-head">Marking points</div>
              <ul>${q.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
            </div>
            ${provLine(q)}
            <div class="self-rate mt">
              <div class="model-head">How did your answer compare?</div>
              <div class="row">
                ${RATINGS.map(([k, label, hint]) => `
                  <button class="btn rate-${k} ${rated[i] === k ? 'on' : ''}" data-rate="${k}"
                    title="${esc(hint)}">${esc(label)}</button>`).join('')}
              </div>
            </div>`
          : `<p class="dim mt">Write your answer out first — then reveal the model answer and
             compare. Peeking first is the whole way to fool yourself on a written paper.</p>
             <button class="btn pri mt" id="reveal">Show model answer</button>`}

          <div class="row mt">
            <button class="btn" id="prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
            <button class="btn ${rated[i] ? 'pri' : ''}" id="next">
              ${i === Q.length - 1 ? 'Finish' : 'Next →'}</button>
            <span class="dim">${rated.filter(Boolean).length}/${Q.length} rated</span>
          </div>
        </div>
      </div>`;

    const rv = $('#reveal');
    if (rv) rv.onclick = () => { shown = true; draw(); };
    $$('[data-rate]').forEach(b => {
      b.onclick = () => {
        const k = b.dataset.rate;
        // Re-rating the same question in one session replaces the rating rather
        // than recording a second attempt, so the count stays a count of
        // questions practised and not of button presses.
        if (rated[i] === k) return;
        if (rated[i]) { const st = S.essays[q.id]; if (st) { st.att -= 1; st[rated[i]] -= 1; } }
        rated[i] = k;
        recordEssay(q, k);
        draw();
      };
    });
    $('#starBtn').onclick = () => {
      const s = Object.assign({ att: 0, good: 0, part: 0, miss: 0, box: 1, due: 0, star: false },
        S.essays[q.id]);
      s.star = !s.star; S.essays[q.id] = s; save(); draw();
    };
    $('#quit').onclick = () => back();
    $('#prev').onclick = () => { if (i > 0) { i -= 1; shown = !!rated[i]; draw(); } };
    $('#next').onclick = () => {
      if (i === Q.length - 1) return finish();
      i += 1; shown = !!rated[i]; draw();
    };
  }

  function finish() {
    const t = rated.reduce((a, r) => { if (r) a[r] = (a[r] || 0) + 1; return a; }, {});
    const done = rated.filter(Boolean).length;
    el.innerHTML = `
      <div class="card">
        <div class="spread mb"><h1 style="margin:0">Essay session done</h1>
          <span class="pill wn">self-rated</span></div>
        <div class="grid g2">
          ${stat('Questions practised', `${done}`, `of ${Q.length} shown`)}
          ${stat('Got it', `${t.good || 0}`, 'covered the marking points')}
          ${stat('Partly', `${t.part || 0}`, 'missed some points')}
          ${stat('Missed it', `${t.miss || 0}`, 'come back to these')}
        </div>
        <p class="dim mt">This is your own judgement against the model answer, not a score — it is
        kept out of your MCQ accuracy for that reason. Anything rated partly or missed comes back
        sooner under "Due for review".</p>
        <div class="row mt">
          <button class="btn pri" id="again">Back to essay practice</button>
          <button class="btn" id="toPapers">Browse a full past paper</button>
        </div>
      </div>`;
    $('#again').onclick = () => back();
    $('#toPapers').onclick = () => go('papers');
  }

  draw();
}

/* ============================================================ quiz engine */
function startQuiz({ title, questions, mode, seconds, onFinish, back }) {
  if (!questions || !questions.length) { toast('No questions to show'); return; }
  const Q = questions.slice();
  const picks = new Array(Q.length).fill(null);
  const graded = new Array(Q.length).fill(false);
  let i = 0, endAt = seconds ? Date.now() + seconds * 1000 : null, tick = null, finished = false;
  const el = $('#main');

  function scoreNow() { return Q.reduce((a, q, k) => a + (picks[k] === q.ans ? 1 : 0), 0); }

  function draw() {
    const q = Q[i];
    const showAns = mode === 'practice' && graded[i];
    const stq = qState(q.id);
    el.innerHTML = `
      <div class="quiz">
        <div class="quiz-head">
          <div>
            <h1 style="margin:0;font-size:1.15rem">${esc(title)}</h1>
            <span class="dim">Question ${i + 1} of ${Q.length}${mode === 'exam' ? ' · exam mode, no feedback until you submit' : ''}</span>
          </div>
          <div class="row">
            ${endAt ? `<span class="timer" id="timer">--:--</span>` : ''}
            <button class="btn sm" id="starBtn" title="Flag for later">${stq.star ? '★' : '☆'}</button>
            <button class="btn sm" id="quit">Quit</button>
          </div>
        </div>

        <div class="card">
          <div class="qmeta mb">
            <span class="pill">${esc(shortPaper(q.paper))}</span>
            ${q.unit ? `<span class="pill">${unitLabel(q)}</span>` : ''}
            ${q.src === 'past' ? `<span class="pill acc">${esc(q.sitting)} Q${q.no}</span>` : `<span class="pill">practice</span>`}
            ${modeBadge(q.id)}
            ${stq.att ? `<span class="dim">seen ${stq.att}× · ${stq.ok}/${stq.att} right · box ${stq.box}</span>` : ''}
          </div>
          <div class="qtext">${esc(q.q)}</div>
          <div class="opts" id="opts">
            ${['A', 'B', 'C', 'D', 'E'].filter(k => q.opts[k] != null).map(k => {
              let cls = '';
              if (showAns) {
                if (k === q.ans) cls = 'right';
                else if (k === picks[i]) cls = 'wrong';
              } else if (picks[i] === k) cls = 'sel';
              return `<button class="opt ${cls}" data-k="${k}" ${showAns ? 'disabled' : ''}>
                <span class="lab">${k}</span><span>${esc(q.opts[k])}</span></button>`;
            }).join('')}
          </div>
          ${showAns ? `<div class="expl">
            <strong>${picks[i] === q.ans ? 'Correct' : `Incorrect — the answer is ${q.ans}`}.</strong>
            ${q.exp ? ' ' + esc(q.exp) : ''}
            ${disputeBlock(q)}${provLine(q)}
          </div>` : ''}
          <div class="row mt">
            <button class="btn" id="prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
            <button class="btn ${showAns || mode === 'exam' ? 'pri' : ''}" id="next">
              ${i === Q.length - 1 ? (mode === 'exam' ? 'Submit' : 'Finish') : 'Next →'}</button>
            ${mode === 'exam' ? `<span class="dim">${picks.filter(Boolean).length}/${Q.length} answered</span>` : ''}
          </div>
        </div>

        <div class="pager" id="pager">${Q.map((_, k) => {
          let cls = k === i ? 'on' : '';
          if (picks[k]) cls += mode === 'practice' && graded[k] ? (picks[k] === Q[k].ans ? ' ok' : ' no') : ' done';
          return `<button class="${cls}" data-i="${k}">${k + 1}</button>`;
        }).join('')}</div>
      </div>`;

    $('#opts').onclick = e => {
      const b = e.target.closest('.opt[data-k]');
      if (!b || b.disabled) return;
      picks[i] = b.dataset.k;
      if (mode === 'practice') { graded[i] = true; recordAnswer(Q[i], picks[i]); }
      draw();
    };
    $('#prev').onclick = () => { if (i > 0) { i--; draw(); } };
    $('#next').onclick = () => {
      if (i === Q.length - 1) finish();
      else { i++; draw(); }
    };
    $('#pager').onclick = e => {
      const b = e.target.closest('button[data-i]');
      if (b) { i = +b.dataset.i; draw(); }
    };
    $('#starBtn').onclick = () => {
      const s = Object.assign({ att: 0, ok: 0, box: 1, due: 0, star: false }, S.questions[q.id]);
      s.star = !s.star; S.questions[q.id] = s; save(); draw();
    };
    $('#quit').onclick = () => {
      if (mode === 'exam' && picks.some(Boolean) && !confirm('Quit this mock? Your answers will not be scored.')) return;
      stop(); (back || (() => go('dash')))();
    };
    if (endAt) paintTimer();
  }

  function paintTimer() {
    const t = $('#timer');
    if (!t) return;
    const left = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
    const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60;
    t.textContent = (h ? `${h}:` : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    t.classList.toggle('low', left < 300);
    if (left <= 0) { toast('Time is up — submitting'); finish(); }
  }

  function stop() { clearInterval(tick); tick = null; }

  function finish() {
    if (finished) return;
    finished = true;
    stop();
    // exam mode defers grading, so record everything now
    if (mode === 'exam') Q.forEach((q, k) => { if (picks[k]) recordAnswer(q, picks[k]); });
    const score = scoreNow();
    S.sessions.push({ id: 'ses' + Date.now(), type: mode, title, started: 0, ended: Date.now(), score, total: Q.length });
    if (S.sessions.length > 200) S.sessions = S.sessions.slice(-200);
    save();
    if (onFinish) onFinish(score, Q.length);
    results(score);
  }

  function results(score) {
    const p = pct(score, Q.length);
    const marks = score * 2;
    const byUnit = {};
    Q.forEach((q, k) => {
      const key = `${q.paper}|${q.unit}`;
      byUnit[key] = byUnit[key] || { n: 0, ok: 0, title: unitOf(q.paper, q.unit)?.title || '—', paper: q.paper, no: q.unit };
      byUnit[key].n++;
      if (picks[k] === q.ans) byUnit[key].ok++;
    });
    const units = Object.values(byUnit).sort((a, b) => (a.ok / a.n) - (b.ok / b.n));
    const wrongIdx = Q.map((q, k) => k).filter(k => picks[k] !== Q[k].ans);

    el.innerHTML = `
      <div class="quiz">
        <h1>${esc(title)} — result</h1>
        <div class="grid g4 mb">
          ${stat('Score', `${score}/${Q.length}`, `${p}%`)}
          ${stat('Marks', `${marks}`, `of ${Q.length * 2} at 2 each`)}
          ${stat('Unanswered', String(picks.filter(x => !x).length), 'no negative marking')}
          ${stat('Verdict', p >= 60 ? 'Strong' : p >= 45 ? 'Fair' : 'Weak', p >= 50 ? 'above qualifying line' : 'below 50%')}
        </div>
        <div class="card mb">
          <div class="bar ${p >= 60 ? 'good' : p >= 45 ? 'warn' : 'bad'}" style="height:12px"><i style="width:${p}%"></i></div>
        </div>

        <div class="card mb">
          <h3>Where you lost marks</h3>
          <div class="scroll-x"><table>
            <thead><tr><th>Unit</th><th class="num">Asked</th><th class="num">Right</th><th class="num">Accuracy</th></tr></thead>
            <tbody>${units.map(u => `<tr>
              <td>${esc(u.paper)} · ${esc(u.no)}. ${esc(u.title)}</td>
              <td class="num">${u.n}</td><td class="num">${u.ok}</td>
              <td class="num"><span class="pill ${pct(u.ok, u.n) >= 70 ? 'ok' : pct(u.ok, u.n) >= 45 ? 'wn' : 'no'}">${pct(u.ok, u.n)}%</span></td>
            </tr>`).join('')}</tbody>
          </table></div>
        </div>

        <div class="row mb">
          ${wrongIdx.length ? `<button class="btn pri" id="drillWrong">Drill the ${wrongIdx.length} you missed</button>` : ''}
          <button class="btn" id="reviewAll">Review every question</button>
          <button class="btn" id="done">Done</button>
        </div>
        <div id="reviewPane"></div>
      </div>`;

    if (wrongIdx.length) $('#drillWrong').onclick = () =>
      startQuiz({ title: 'Drill missed — ' + title, questions: wrongIdx.map(k => Q[k]), mode: 'practice', back });
    $('#done').onclick = () => (back || (() => go('dash')))();
    $('#reviewAll').onclick = () => {
      $('#reviewPane').innerHTML = Q.map((q, k) => `
        <div class="card mb">
          <div class="qmeta mb"><strong style="color:var(--ink)">${k + 1}.</strong>
            ${picks[k] === q.ans ? '<span class="pill ok">correct</span>' : picks[k] ? '<span class="pill no">wrong</span>' : '<span class="pill wn">skipped</span>'}
            ${q.src === 'past' ? `<span class="pill acc">${esc(q.sitting)} Q${q.no}</span>` : ''}
            ${modeBadge(q.id)}
          </div>
          <div class="qtext">${esc(q.q)}</div>
          <div class="opts">${['A', 'B', 'C', 'D', 'E'].filter(x => q.opts[x] != null).map(x => `
            <div class="opt ${x === q.ans ? 'right' : x === picks[k] ? 'wrong' : ''}" style="cursor:default">
              <span class="lab">${x}</span><span>${esc(q.opts[x])}</span></div>`).join('')}</div>
          ${q.exp || q.prov ? `<div class="expl">${q.exp ? esc(q.exp) : ''}${disputeBlock(q)}${provLine(q)}</div>` : ''}
        </div>`).join('');
      $('#reviewAll').disabled = true;
    };
    window.scrollTo(0, 0);
  }

  draw();
  if (endAt) tick = setInterval(paintTimer, 1000);
}

/* ============================================================ chrome/boot */
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-view]');
  if (b) go(b.dataset.view);
});

$('#themeBtn').onclick = () => {
  const order = ['auto', 'light', 'dark'];
  const cur = document.documentElement.dataset.theme || 'auto';
  const next = order[(order.indexOf(cur) + 1) % 3];
  document.documentElement.dataset.theme = next;
  S.settings.theme = next; save();
  toast('Theme: ' + next);
};

$('#dataBtn').onclick = () => {
  const body = $('#modalBody');
  body.innerHTML = `
    <h2>Progress data</h2>
    <p class="muted" style="font-size:.9rem">Everything is stored in this browser only. Copy the text below to back it up,
    or paste a previous backup in and press Restore.</p>
    <textarea id="dump" rows="9">${esc(JSON.stringify(S))}</textarea>
    <div class="row mt">
      <button class="btn" id="copyBtn">Copy</button>
      <button class="btn pri" id="restoreBtn">Restore from box</button>
      <button class="btn danger" id="wipeBtn">Erase all progress</button>
    </div>
    <hr class="sep">
    <p class="dim">Daily question count</p>
    <div class="row">
      <input type="number" id="dCount" min="5" max="100" value="${S.settings.dailyCount}" style="width:90px">
      <button class="btn sm" id="setCount">Set</button>
    </div>`;
  $('#modal').hidden = false;
  $('#copyBtn').onclick = () => {
    const t = $('#dump'); t.select();
    navigator.clipboard?.writeText(t.value).then(() => toast('Copied'), () => toast('Select and copy manually'));
  };
  $('#restoreBtn').onclick = () => {
    try {
      const p = JSON.parse($('#dump').value);
      if (!p || typeof p !== 'object') throw new Error('not an object');
      S = Object.assign(blank(), p);
      localStorage.setItem(KEY, JSON.stringify(S));
      $('#modal').hidden = true; toast('Progress restored'); go(currentView);
    } catch (err) { toast('That is not valid progress data'); }
  };
  $('#wipeBtn').onclick = () => {
    if (!confirm('Erase all progress, scores and streaks? This cannot be undone.')) return;
    S = blank(); localStorage.removeItem(KEY);
    $('#modal').hidden = true; toast('Progress erased'); go('dash');
  };
  $('#setCount').onclick = () => {
    S.settings.dailyCount = Math.max(5, Math.min(100, parseInt($('#dCount').value, 10) || 25));
    save(); toast('Daily test set to ' + S.settings.dailyCount); $('#modal').hidden = true;
  };
};
$('#modalX').onclick = () => { $('#modal').hidden = true; };
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').hidden = true; };

function paintCountdown() {
  const d = Math.ceil((Date.parse(EXAM_HINT) - Date.now()) / DAY);
  const el = $('#countdown');
  const apply = new Date('2026-08-29T16:00:00+05:30') - Date.now();
  const applyDays = Math.ceil(apply / DAY);
  el.textContent = applyDays > 0
    ? `Apply within ${applyDays} day${applyDays === 1 ? '' : 's'} · ${d > 0 ? `~${d}d to exam` : 'exam window'}`
    : (d > 0 ? `~${d} days to exam` : 'exam window');
}

document.documentElement.dataset.theme = S.settings.theme || 'auto';
paintCountdown();
go('syllabus');   // landing view: where the marks are, before anything else
