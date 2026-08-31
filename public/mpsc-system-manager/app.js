/* ============================================================================
   MUDAL System Manager — Study Trainer
   Offline single-page app. Progress lives in localStorage under KEY.
   Cloned from mpsc-system-analyst/app.js. Keep the two in sync when fixing
   shared logic; the differences are KEY, shortPaper, and the copy below.
   ========================================================================== */
'use strict';

const SYL = window.SYLLABUS || { papers: [] };
const CON = window.CONCEPTS || [];
const QS  = window.QUESTIONS || [];
// Calc Lab generators. Unlike the three above these are functions, not data:
// each produces a fresh worked item from a seed, so the pool is unbounded.
const GENS = window.CALC_DRILLS || [];

// Distinct from the System Analyst app's 'mpsc_sa_v1' — both are served from
// the same origin, so a shared key would merge the two apps' progress.
const KEY = 'mpsc_sm_v1';
// No exam date has been announced for System Manager. Read it from the
// syllabus data (exam_date: null) rather than guessing one — the System
// Analyst app hardcoded '2026-11-01' here, which invents a deadline.
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
   authoring one new batch renumbered every question after it — all 363 moved
   when the id scheme was fixed. They are now derived from the question's own
   content and do not move again. Progress is keyed on question id, so without
   this the reader's Leitner boxes for those 363 would simply stop matching
   anything and their revision history would vanish with no error to notice.

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
const paperName = pid => paperById[pid]?.name || pid;
const shortPaper = pid => ({
  GE: 'General English',
  TECH1: 'Technical I · Computer Fundamentals & Office',
  TECH2: 'Technical II · Networking, DBMS, Web, Cyber & AI',
}[pid] || pid);

// Denominator for the concept-guide progress line, derived rather than
// hardcoded so it stays honest as data lands.
//
// Two sources, because the syllabus is uneven: the technical papers enumerate
// their own leaf subtopics, but the official syllabus lists General English's
// components with marks and NO subtopics — that breakdown is derived, and the
// concepts themselves define it. Counting only `u.subtopics` gave 259 while the
// guide held 296 concepts, so the dashboard read "296 of 259".
const TOTAL_SUBTOPICS = (() => {
  const official = SYL.papers.reduce(
    (n, p) => n + p.units.reduce((m, u) => m + (u.subtopics || []).length, 0), 0);
  const derived = new Set(
    CON.filter(c => !(paperById[c.paper]?.units || [])
      .some(u => (u.subtopics || []).includes(c.sub)))
      .map(c => `${c.paper}|${c.unit}|${c.sub}`)).size;
  return official + derived;
})();

/* Question stem, with __underline__ markers rendered as actual underlines.
   Several General English questions ask about "the underlined word", and the
   marker convention comes from tools/bank-rebuild/SOLVE_BRIEF.md. Escape first,
   then substitute, so the markup can only ever come from the marker and never
   from question text. */
function qText(s) {
  // The capture must exclude underscores. Blanks in these papers are long runs
  // of underscores ("preparation __________ the function"), and a permissive
  // /__(.+?)__/ matches five of them and renders a stray underlined "_".
  return esc(s).replace(/__([^_]+?)__/g, '<u>$1</u>');
}

/* Reading passage for a comprehension question, above the stem.
   The bank dropped every passage, which left 32 General English questions
   unanswerable ("Find the word in the passage which means…"); they are
   recovered from the source PDFs by tools/system-manager-build/extract_passages.py.
   Collapsible because the same 500-word passage backs up to 16 consecutive
   questions, and open by default because you cannot answer without reading it. */
function passageBlock(q) {
  if (!q.passage) return '';
  return `<details class="psg" open>
    <summary>Passage${q.passageTitle ? ' — ' + esc(q.passageTitle) : ''}</summary>
    <div class="psg-body">${esc(q.passage)}</div>
  </details>`;
}

/* Disputed answer: two independent derivations disagree, so BOTH candidates are
   shown rather than the conflict being buried in a prose provenance line. No
   official key exists for these papers — one of the two is simply wrong, and the
   reader is better placed than either to judge, so the app presents the evidence
   instead of pretending to settle it.

   The rival is NOT always the question bank. For papers the bank never answered
   at all (Election Dec-2019 Paper II is 74 such questions) the second opinion is
   a separate blind solve by a different model, and `altSrc` says which. Labelling
   that "question bank" would credit an answer to a source that never held one —
   the same provenance dishonesty the conf badge exists to prevent. */
function disputeBlock(q) {
  if (!q.alt || !q.opts || !q.opts[q.alt]) return '';
  const rival = q.altSrc === 'solver' ? 'second solver' : 'question bank';
  return `<div class="dispute">
    <h4>Disputed — two derivations disagree</h4>
    <div class="dispute-row"><span class="pill ok">this app</span>
      <span class="lab">${esc(q.ans)}</span><span>${esc(q.opts[q.ans] || '')}</span></div>
    <div class="dispute-row"><span class="pill wn">${esc(rival)}</span>
      <span class="lab">${esc(q.alt)}</span><span>${esc(q.opts[q.alt])}</span></div>
    <p class="dim">No official answer key exists for this paper. Read the explanation
      and decide for yourself which is right.</p>
  </div>`;
}

/* Provenance + confidence line under an answer explanation.
   No official answer key exists for the 2016 Computer Operator papers, so most
   answers in this app are derived. `conf` is set honestly at derivation time and
   this is where the reader gets to see it — an unbadged derived answer reads as
   authoritative, which is exactly the failure this app must not have.
   CLAUDE.md flags the missing badge as a known gap in the System Analyst app;
   fixed here. Used by every site that renders an explanation. */
function provLine(q) {
  // The badge must key on an official key EXISTING, not on the word appearing.
  // Most provenance strings here end "...No official MPSC key exists", and a bare
  // /official/i matched that negation — 309 derived answers were rendering the
  // blue "official key" badge, the exact inverse of the truth, on the one control
  // that tells a reader which answers to distrust.
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

// answerable questions only (drop voided/undetermined from tests)
const ANSWERABLE = QS.filter(q => q.ans && q.ans.length === 1);

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
  st.due = Date.now() + BOX_DAYS[st.box - 1] * DAY;
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
function studyOrder(pool) {
  const now = Date.now();
  return pool.slice().sort((a, b) => score(a) - score(b));
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
   marks actually are — 400 of them, unevenly spread, and the unevenness is the
   whole revision strategy. Unit I of Technical Paper I alone is 60 marks, more
   than the entire Presentation Software and Word Processing units combined.
   Everything here comes from data/syllabus.js, which is transcribed from the
   official PDF; nothing is hardcoded. */
VIEWS.syllabus = (el) => {
  const total = SYL.papers.reduce((a, p) => a + p.marks, 0);
  const maxUnit = Math.max(...SYL.papers.flatMap(p => p.units.map(u => u.marks)));

  const unitRow = (p, u) => {
    const qs = ANSWERABLE.filter(q => q.paper === p.id && String(q.unit) === String(u.no)).length;
    const cs = CON.filter(c => c.paper === p.id && String(c.unit) === String(u.no)).length;
    const known = CON.filter(c => c.paper === p.id && String(c.unit) === String(u.no)
      && cState(c).status === 'known').length;
    const subs = (u.subtopics || []).length;
    return `
      <details class="syl-unit">
        <summary>
          <span class="syl-bar" style="--w:${Math.round(100 * u.marks / maxUnit)}%"></span>
          <span class="syl-no">${esc(u.no)}</span>
          <span class="syl-title">${esc(u.title)}</span>
          <span class="syl-marks">${u.marks}<em>marks</em></span>
          ${u.mode ? `<span class="pill ${u.mode === 'handwritten' ? 'wn' : ''}">${esc(u.mode)}</span>` : ''}
          <span class="syl-meta">${cs} concept${cs === 1 ? '' : 's'}${known ? ` · ${known} known` : ''} · ${qs} question${qs === 1 ? '' : 's'}</span>
        </summary>
        <div class="syl-body">
          ${subs ? (u.sections || []).map(sec => `
            <div class="syl-sec"><h5>${esc(sec.title)}</h5>
              <ul>${sec.subtopics.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>`).join('')
            : `<p class="dim">${esc(u.subtopics_source
                || 'The official syllabus lists no subtopics for this component.')}</p>`}
        </div>
      </details>`;
  };

  el.innerHTML = `
    <h1>Syllabus and mark distribution</h1>
    <p class="muted">${esc(SYL.post)} · ${esc(SYL.employer)}</p>
    <p class="muted" style="margin-top:.4rem">${esc(SYL.scoring_note || '')}</p>

    <div class="syl-split mt">
      ${SYL.papers.map(p => `
        <div class="syl-share" style="--pct:${Math.round(100 * p.marks / total)}%">
          <strong>${esc(shortPaper(p.id))}</strong>
          <span>${p.marks} marks · ${Math.round(100 * p.marks / total)}%</span>
        </div>`).join('')}
    </div>

    ${SYL.papers.map(p => `
      <div class="card mt">
        <div class="spread">
          <h3 style="margin:0">${esc(p.name)}</h3>
          <span class="pill ${p.counts_for_merit ? 'acc' : 'wn'}">${p.marks} marks${p.counts_for_merit ? ' · counts for merit' : ' · qualifying'}</span>
        </div>
        <p class="dim" style="margin:.4rem 0 .2rem">${esc(p.type)}</p>
        ${p.structure_note ? `<p class="dim" style="margin:.2rem 0 .6rem">${esc(p.structure_note)}</p>` : ''}
        <div class="syl-units">${p.units.map(u => unitRow(p, u)).join('')}</div>
        ${p.pattern_note ? `<p class="syl-note">${esc(p.pattern_note)}</p>` : ''}
      </div>`).join('')}

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
           ['Exam date', SYL.exam_date || 'not announced'],
           ['Selection', (SYL.selection_stages || []).join(' → ')],
           ['Syllabus authority', (SYL.syllabus_authority || {}).all_papers || '']]
          .filter(r => r[1]).map(r => `<tr><th style="width:9rem">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}
      </tbody></table>
      ${(SYL.eligibility || []).length ? `<h4 class="mt">Eligibility</h4>
        <ul class="syl-elig">${SYL.eligibility.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${SYL.syllabus_closing_note ? `<p class="syl-note mt">${esc(SYL.syllabus_closing_note)}</p>` : ''}
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
        <p class="muted" style="margin:0">${esc(SYL.scoring_note || '')}</p>
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
    <div class="grid g2">${SYL.papers.map(paperCard).join('')}</div>

    ${weakestBlock()}
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
  SYL.papers.forEach(p => p.units.forEach(u => {
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
      <p>Phase 5 of <code>tools/system-manager-build/BUILD_GUIDE.md</code> writes
      <code>data/concepts.js</code> — 259 subtopics, one concept each.</p></div>`;
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
    // Resolve cross-links nearest-first: same unit, then same paper, then anywhere.
    // Six leaf names are reused across units (see the note below), so a bare
    // sub-string match can resolve "Encryption" to Cyber Security when the author
    // meant Database Security.
    const rel = (c.rel || []).map(r =>
      CON.find(x => x.sub === r && x.paper === c.paper && x.unit === c.unit)
      || CON.find(x => x.sub === r && x.paper === c.paper)
      || CON.find(x => x.sub === r)).filter(Boolean);
    // Match on the full paper|unit|sub triple, the same key conceptKey() uses.
    // Matching paper+sub alone cross-links unrelated topics, because six leaf
    // names are reused across units: TECH2 "Tables" is both Database
    // Administration and HTML5, "Encryption" is both Database Security and Cyber
    // Security, "Firewalls" is both Network Devices and Cyber Security; TECH1
    // reuses "SmartArt" and "Accessibility Features" (Word/PowerPoint) and
    // "Microsoft 365 Collaboration" (Word/Excel). Without the unit check a DBMS
    // Tables question shows up under the HTML5 Tables concept.
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
        <label class="fld">Source<select id="fSrc">
          <option value="">All</option><option value="past">Past papers only</option><option value="generated">Authored practice only</option>
        </select></label>
        <label class="fld">Filter<select id="fOnly">
          <option value="">Everything</option>
          <option value="due">Due for review</option>
          <option value="unseen">Never attempted</option>
          <option value="wrong">Previously wrong</option>
          <option value="star">Starred</option>
        </select></label>
        <label class="fld">Count<input type="number" id="fN" value="20" min="1" max="200" style="width:80px"></label>
      </div>
      <hr class="sep">
      <div class="spread">
        <div id="poolInfo" class="dim"></div>
        <button class="btn pri" id="startP">Start practice</button>
      </div>
    </div>`;

  const sel = { paper: $('#fPaper'), unit: $('#fUnit'), src: $('#fSrc'), only: $('#fOnly'), n: $('#fN') };
  sel.paper.value = f.paper;

  function fillUnits() {
    const pid = sel.paper.value;
    const us = pid ? (paperById[pid]?.units || []) : [];
    sel.unit.innerHTML = `<option value="">All</option>` + us
      .filter(u => ANSWERABLE.some(q => q.paper === pid && q.unit === String(u.no)))
      .map(u => `<option value="${esc(u.no)}">${esc(u.no)}. ${esc(u.title)} (${u.marks}m)</option>`).join('');
    if (f.unit) sel.unit.value = f.unit;
  }
  function pool() {
    return ANSWERABLE.filter(q => {
      if (sel.paper.value && q.paper !== sel.paper.value) return false;
      if (sel.unit.value && q.unit !== sel.unit.value) return false;
      if (sel.src.value && q.src !== sel.src.value) return false;
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
    $('#poolInfo').textContent = `${p.length} question${p.length === 1 ? '' : 's'} match`;
    $('#startP').disabled = !p.length;
  }
  fillUnits(); refresh();
  sel.paper.onchange = () => { fillUnits(); refresh(); };
  [sel.unit, sel.src, sel.only].forEach(s => { s.onchange = refresh; });
  $('#startP').onclick = () => {
    const n = Math.max(1, Math.min(200, parseInt(sel.n.value, 10) || 20));
    const qs = studyOrder(pool()).slice(0, n);
    startQuiz({ title: 'Practice', questions: qs, mode: 'practice', back: () => go('practice', { paper: sel.paper.value, unit: sel.unit.value }) });
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
    <p class="muted">The System Manager technical papers use the Computer Operator syllabus, so these are the closest
    thing to your actual exam that exists — every Computer Operator sitting MPSC has ever examined: SAD and Mizoram
    Information Commission (2016), MIMER (2018), AH &amp; Vety (May 2019) and Election Dept (December 2019). MPSC never
    published an answer key for any of them — every answer here was derived and carries a confidence rating. Check the
    provenance line under any answer you doubt, and treat the <em>unrated</em> papers with the most suspicion: those
    answers came from the question bank and have not yet been independently re-derived.</p>
    <div class="grid g2 mt">
      ${keys.map(k => {
        const qs = groups[k].slice().sort((a, b) => a.no - b.no);
        const att = qs.filter(q => S.questions[q.id]?.att).length;
        const ok = qs.filter(q => S.questions[q.id]?.lastOk).length;
        const off = qs.some(q => q.prov && q.prov.includes('Official'));
        return `<div class="card">
          <div class="spread"><h3 style="margin:0">${esc(qs[0].sitting)}</h3>
          <span class="pill ${off ? 'ok' : 'wn'}">${off ? 'official key' : 'derived answers'}</span></div>
          <p class="dim" style="margin:.35rem 0 .6rem">${esc(shortPaper(qs[0].paper))} · ${qs.length} questions · ${qs.length * 2} marks</p>
          <div style="font-size:.78rem;color:var(--ink-3)">Attempted ${att}/${qs.length}${att ? ` · last-attempt ${pct(ok, att)}%` : ''}</div>
          <div class="bar mb"><i style="width:${pct(att, qs.length)}%"></i></div>
          <div class="row">
            <button class="btn pri sm" data-run="${esc(k)}">Attempt as exam</button>
            <button class="btn sm" data-browse="${esc(k)}">Browse with answers</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  el.onclick = e => {
    const r = e.target.closest('[data-run]');
    if (r) {
      const qs = groups[r.dataset.run].slice().sort((a, b) => a.no - b.no);
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
          <strong style="color:var(--ink)">Q${q.no}</strong>
          ${q.unit ? `<span class="pill">Unit ${esc(q.unit)}</span>` : ''}
          ${q.sub ? `<span class="pill">${esc(q.sub)}</span>` : ''}
          ${q.ans === 'COMPENSATED' ? `<span class="pill wn">voided by MPSC</span>` : ''}
        </div>
        ${passageBlock(q)}<div class="qtext">${qText(q.q)}</div>
        <div class="opts" data-opts="${q.id}">${['A', 'B', 'C', 'D'].filter(k => q.opts[k] != null).map(k => `
          <div class="opt ${q.ans === k ? 'right' : ''}" style="cursor:default">
            <span class="lab">${k}</span><span>${esc(q.opts[k])}</span></div>`).join('')}</div>
        <button class="btn sm reveal-one" data-reveal="${q.id}">Show answer</button>
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
    weighting, so a 60-mark unit gets three times the airtime of a 20-mark one. No feedback until you submit.
    MUDAL has not published a question count or duration for System Manager — the targets below follow the 2016 Computer
    Operator papers, whose syllabus this post reuses at the same marks (75 questions × 2 marks, 2 hours per technical
    paper).</p>
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
        <p class="dim" style="margin:.35rem 0 .7rem">50 questions across both technical papers · 60 minutes</p>
        <button class="btn sm" data-mock="QUICK">Start quick mock</button>
      </div>
      ${SYL.papers.filter(p => !p.counts_for_merit && ANSWERABLE.some(q => q.paper === p.id)).map(p => {
        const n = ANSWERABLE.filter(q => q.paper === p.id).length;
        return `<div class="card">
          <div class="spread"><h3 style="margin:0">${esc(shortPaper(p.id))}</h3><span class="pill wn">qualifying</span></div>
          <p class="dim" style="margin:.35rem 0 .7rem">You need 50% to stay in the race. Bank holds ${n} questions.</p>
          <button class="btn sm" data-mock="${p.id}">Start qualifying mock</button>
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
      // Filter on the technical papers explicitly. The System Analyst app used
      // counts_for_merit as a stand-in for "technical", but every System Manager
      // paper counts for merit — that proxy would drag General English in here.
      qs = weightedPick(ANSWERABLE.filter(q => q.paper === 'TECH1' || q.paper === 'TECH2'), 50, rnd);
      title = 'Quick mock — both technical papers'; secs = 3600;
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

  el.innerHTML = `
    <h1>Review</h1>
    <p class="muted">Spaced repetition: a question you get right moves to a longer interval
    (${BOX_DAYS.slice(1).map(d => d + 'd').join(' → ')}); a question you get wrong drops back to daily.</p>
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
    const map = { due, wrong, star: starred, never };
    const qs = studyOrder(map[b.dataset.set]).slice(0, 40);
    startQuiz({ title: 'Review — ' + b.dataset.set, questions: qs, mode: 'practice', back: () => go('review') });
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
    <p>Phases 2–4 of <code>tools/system-manager-build/BUILD_GUIDE.md</code> write
    <code>data/questions.js</code> — harvest, verify, then fill the coverage gaps.</p></div>`;
}

/* ================================================================ calc lab */
/* Procedural topics — subnetting, base conversion, memory allocation,
   normalisation — are not learned by reading a concept card once. They are
   learned by working the method repeatedly until it is automatic. The question
   bank cannot supply that: measured when this was built, all 843 questions held
   ONE genuine subnetting calculation and ONE hex conversion (and that one was
   borrowed from the JSO set, not a System Manager paper).

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
      <p class="dim">These are the calculation topics — subnetting, base conversion, memory
      allocation, normalisation, and the language traps where the arithmetic is trivial and the
      catch is the whole question. Separate from the Practice tab, which drills real past-paper
      questions. Progress here is tracked per generator and does not affect your question-bank
      review schedule.</p>
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
            ${['A', 'B', 'C', 'D'].filter(k => it.opts[k] != null).map(k => {
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
            ${q.unit ? `<span class="pill">Unit ${esc(q.unit)}</span>` : ''}
            ${q.src === 'past' ? `<span class="pill acc">${esc(q.sitting)} Q${q.no}</span>` : `<span class="pill">practice</span>`}
            ${stq.att ? `<span class="dim">seen ${stq.att}× · ${stq.ok}/${stq.att} right · box ${stq.box}</span>` : ''}
          </div>
          ${passageBlock(q)}<div class="qtext">${qText(q.q)}</div>
          <div class="opts" id="opts">
            ${['A', 'B', 'C', 'D'].filter(k => q.opts[k] != null).map(k => {
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
          </div>
          ${passageBlock(q)}<div class="qtext">${qText(q.q)}</div>
          <div class="opts">${['A', 'B', 'C', 'D'].filter(x => q.opts[x] != null).map(x => `
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
    $('#modal').hidden = true; toast('Progress erased'); go('syllabus');   // syllabus is the landing view — marks first
  };
  $('#setCount').onclick = () => {
    S.settings.dailyCount = Math.max(5, Math.min(100, parseInt($('#dCount').value, 10) || 25));
    save(); toast('Daily test set to ' + S.settings.dailyCount); $('#modal').hidden = true;
  };
};
$('#modalX').onclick = () => { $('#modal').hidden = true; };
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').hidden = true; };

function paintCountdown() {
  const el = $('#countdown');
  const parts = [];

  if (SYL.application_deadline) {
    const days = Math.ceil((Date.parse(SYL.application_deadline) - Date.now()) / DAY);
    if (days > 0) parts.push(`Apply within ${days} day${days === 1 ? '' : 's'}`);
  }
  if (SYL.exam_date) {
    const days = Math.ceil((Date.parse(SYL.exam_date) - Date.now()) / DAY);
    parts.push(days > 0 ? `~${days}d to exam` : 'exam window');
  } else {
    parts.push('exam date not announced');
  }
  el.textContent = parts.join(' · ');
}

document.documentElement.dataset.theme = S.settings.theme || 'auto';
paintCountdown();
go('syllabus');   // landing view: where the marks are, before anything else
