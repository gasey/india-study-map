/* JSO Paper IV — Real MPSC/MUDAL & Complete 5-Unit Question Bank.
   Data: window.QUESTIONS (380 questions: 305 real MPSC/MUDAL past questions + 75 authored Units III–V syllabus questions).
   Views: Bank (browse + interactive attempt or reveal + filters), Practice (build & take a test),
   Mock (timed, negative marking, 5-unit or real-only), Review (saved incorrect / marked). */
(function () {
  'use strict';

  var Q = window.QUESTIONS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var LABELS = ['A', 'B', 'C', 'D'];
  var UNIT_NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
  var STORE_KEY = 'jso-p4-bank-v1';

  /* ---------- persistence: marked + incorrect + bank attempts ---------- */
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  var store = loadStore();
  store.marked = store.marked || {};
  store.wrong = store.wrong || {};
  store.tried = store.tried || {};
  var bankInteractive = true;

  /* ---------- theme ---------- */
  var themeBtn = $('#themeBtn');
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('jso-p4-theme', t); } catch (e) {}
  }
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('jso-p4-theme'); } catch (e) {}
    if (saved) applyTheme(saved);
  })();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }

  /* ---------- tab switching ---------- */
  var tabs = $$('#tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      render(b.dataset.view);
    });
  });

  /* ---------- filters (Bank) ---------- */
  var bankFilters = { unit: '', sub: '', src: '', origin: '', conf: '', q: '' };

  function unique(arr) {
    return arr.filter(function (v, i) { return arr.indexOf(v) === i; });
  }
  function unitOf(q) { return UNIT_NUM[q.unit] ? q.unit : 'I'; }
  function unitCls(q) { return 'u' + (UNIT_NUM[unitOf(q)] || 1); }
  function ansIdx(q) { return 'ABCD'.indexOf(q.ans); }
  function isOfficial(q) { return (q.prov || '').indexOf('Official') === 0; }

  function buildFilterOptions() {
    var subs = unique(Q.map(function (q) { return q.sub; })).sort();
    var srcs = unique(Q.map(function (q) { return q.sitting; })).sort();
    var subSel = $('#f-sub'), srcSel = $('#f-src');
    if (subSel) subSel.innerHTML = '<option value="">All topics</option>' +
      subs.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    if (srcSel) srcSel.innerHTML = '<option value="">All papers / sources</option>' +
      srcs.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
  }

  function applyBankFilters() {
    var f = bankFilters;
    var term = (f.q || '').toLowerCase();
    return Q.map(function (q, i) { return { q: q, i: i }; }).filter(function (o) {
      var q = o.q;
      if (f.unit && unitOf(q) !== f.unit) return false;
      if (f.sub && q.sub !== f.sub) return false;
      if (f.src && q.sitting !== f.src) return false;
      if (f.origin === 'past' && q.src !== 'past') return false;
      if (f.origin === 'official' && !isOfficial(q)) return false;
      if (f.origin === 'authored' && q.src !== 'authored') return false;
      if (f.conf && q.conf !== f.conf) return false;
      if (term) {
        var hay = (q.q + ' ' + q.sub + ' ' + q.opts.A + ' ' + q.opts.B + ' ' +
                   q.opts.C + ' ' + q.opts.D + ' ' + q.exp).toLowerCase();
        if (hay.indexOf(term) === -1) return false;
      }
      return true;
    });
  }

  function qCard(o, opts) {
    opts = opts || {};
    var q = o.q;
    var idx = o.i;
    var right = ansIdx(q);
    var given = opts.given !== undefined ? opts.given : (bankInteractive ? store.tried[q.id] : right);
    var revealed = !bankInteractive || given != null || opts.forceReveal;
    var optsHtml = LABELS.map(function (L, i) {
      var cls = '';
      if (revealed) {
        if (i === right) cls = ' right';
        else if (given != null && i === given) cls = ' chosen-wrong';
      }
      return '<li class="' + cls.trim() + '" data-i="' + idx + '" data-id="' + esc(q.id) + '" data-o="' + i + '">' +
               '<span class="lt">(' + L + ')</span><span>' + esc(q.opts[L]) + '</span></li>';
    }).join('');
    var marked = store.marked[q.id];
    return '<div class="q" data-idx="' + idx + '">' +
      '<div class="q-head">' +
        '<span class="pill ' + unitCls(q) + '">Unit ' + unitOf(q) + '</span>' +
        '<span class="pill">' + esc(q.sub) + '</span>' +
        '<span class="pill ' + esc(q.conf) + '">' + esc(q.conf) + '</span>' +
        (isOfficial(q) ? '<span class="pill key">official key</span>' : (q.src === 'authored' ? '<span class="pill">syllabus drill</span>' : '')) +
        '<span class="q-src">' + esc(q.sitting) + (q.no ? ' · Q' + q.no : '') + '</span>' +
      '</div>' +
      '<p class="q-stem">' + (opts.showNumber ? (opts.showNumber + '. ') : '') + esc(q.q) + '</p>' +
      '<ul class="opts' + (bankInteractive && !opts.forceReveal ? ' pick' : '') + '">' + optsHtml + '</ul>' +
      (revealed
        ? '<div class="expl"><h5>Why</h5>' + q.exp +
            '<h5>Provenance</h5><p style="font-size:.85rem;color:var(--muted)">' + esc(q.prov) + '</p>' +
          '</div>'
        : '') +
      '<div style="margin-top:.6rem;display:flex;gap:.4rem">' +
        '<button class="btn sm ghost act-mark" data-id="' + esc(q.id) + '">' +
          (marked ? '★ Marked' : '☆ Mark') + '</button>' +
      '</div>' +
    '</div>';
  }

  /* ---------- Bank view ---------- */
  function renderBank() {
    var main = $('#main');
    var pastCount = Q.filter(function (q) { return q.src === 'past'; }).length;
    var officialCount = Q.filter(isOfficial).length;
    main.innerHTML =
      '<div class="crumb">Paper IV · Cyber Forensic · All 5 Units (200 Marks)</div>' +
      '<h1>Paper IV Question Bank &amp; Interactive MCQ Practice</h1>' +
      '<p class="muted">Combines <b>' + pastCount + ' real MPSC/MUDAL technical past-paper questions</b> (' + officialCount + ' with official published keys across Units I–III) ' +
      'plus <b>' + (Q.length - pastCount) + ' syllabus-complete forensic questions</b> covering Digital, Multimedia &amp; Mobile Forensics (Units III–V).</p>' +
      '<div class="statgrid">' +
        '<div class="stat"><b>' + Q.length + '</b><span>total questions</span></div>' +
        '<div class="stat"><b>' + Q.filter(function (q) { return q.unit === 'I'; }).length + '</b><span>Unit I · OS &amp; Arch</span></div>' +
        '<div class="stat"><b>' + Q.filter(function (q) { return q.unit === 'II'; }).length + '</b><span>Unit II · DBMS</span></div>' +
        '<div class="stat"><b>' + Q.filter(function (q) { return q.unit === 'III'; }).length + '</b><span>Unit III · Digital</span></div>' +
        '<div class="stat"><b>' + Q.filter(function (q) { return q.unit === 'IV'; }).length + '</b><span>Unit IV · Media</span></div>' +
        '<div class="stat"><b>' + Q.filter(function (q) { return q.unit === 'V'; }).length + '</b><span>Unit V · Mobile</span></div>' +
        '<div class="stat"><b>' + officialCount + '</b><span>official key</span></div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="filters">' +
          '<label class="fld">Unit<select id="f-unit">' +
            '<option value="">All 5 Units</option>' +
            '<option value="I">Unit I — OS, Architecture &amp; File Systems</option>' +
            '<option value="II">Unit II — DBMS &amp; SQL</option>' +
            '<option value="III">Unit III — Digital &amp; Computer Forensics</option>' +
            '<option value="IV">Unit IV — Multimedia Forensics</option>' +
            '<option value="V">Unit V — Mobile Forensics</option></select></label>' +
          '<label class="fld">Source Type<select id="f-origin">' +
            '<option value="">All (' + Q.length + ')</option>' +
            '<option value="past">Real Past Papers Only (' + pastCount + ')</option>' +
            '<option value="official">Official Key Only (' + officialCount + ')</option>' +
            '<option value="authored">Authored Syllabus Drills (' + (Q.length - pastCount) + ')</option></select></label>' +
          '<label class="fld">Topic<select id="f-sub"></select></label>' +
          '<label class="fld">Sitting<select id="f-src"></select></label>' +
          '<input type="text" id="f-q" placeholder="Search questions, options, explanations…">' +
          '<button type="button" class="btn sm ghost" id="toggle-bank-mode">' +
            (bankInteractive ? '👁️ Reveal All Answers' : '🎯 Interactive Attempt Mode') +
          '</button>' +
          '<span class="mono" id="bank-count" style="color:var(--muted);font-size:.8rem"></span>' +
        '</div>' +
        '<div id="bank-list"></div>' +
      '</div>';

    buildFilterOptions();
    ['f-unit', 'f-origin', 'f-sub', 'f-src'].forEach(function (id) {
      $('#' + id).value = bankFilters[id.slice(2)] || '';
      $('#' + id).addEventListener('change', function (e) {
        bankFilters[id.slice(2)] = e.target.value;
        drawBank();
      });
    });
    $('#f-q').value = bankFilters.q || '';
    $('#f-q').addEventListener('input', function (e) {
      bankFilters.q = e.target.value;
      drawBank();
    });
    $('#toggle-bank-mode').addEventListener('click', function () {
      bankInteractive = !bankInteractive;
      $('#toggle-bank-mode').textContent = bankInteractive ? '👁️ Reveal All Answers' : '🎯 Interactive Attempt Mode';
      drawBank();
    });
    drawBank();
  }

  function drawBank() {
    var rows = applyBankFilters();
    var host = $('#bank-list');
    if (!host) return;
    host.innerHTML = rows.length
      ? rows.map(function (o, idx) { return qCard(o, { showNumber: idx + 1 }); }).join('')
      : '<div class="empty">No questions match those filters.</div>';
    $('#bank-count').textContent = rows.length + ' of ' + Q.length;
    bindMarkButtons(host);
    if (bankInteractive) {
      $$('.opts.pick li', host).forEach(function (li) {
        li.addEventListener('click', function () {
          var id = li.dataset.id;
          var pick = +li.dataset.o;
          var idx = +li.dataset.i;
          var q = Q[idx];
          store.tried[id] = pick;
          if (pick !== ansIdx(q)) store.wrong[id] = Date.now();
          saveStore(store);
          drawBank();
        });
      });
    }
  }

  function bindMarkButtons(root) {
    $$('.act-mark', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.id;
        if (store.marked[id]) delete store.marked[id];
        else store.marked[id] = Date.now();
        saveStore(store);
        toast(store.marked[id] ? 'Marked for review' : 'Unmarked');
        $$('.act-mark').forEach(function (x) {
          if (x.dataset.id === id) x.textContent = store.marked[id] ? '★ Marked' : '☆ Mark';
        });
      });
    });
  }

  /* ---------- Practice view ---------- */
  var practice = { items: [], answers: {}, done: false };

  function renderPractice() {
    var main = $('#main');
    var subs = unique(Q.map(function (q) { return q.unit + '||' + q.sub; })).sort();
    main.innerHTML =
      '<div class="crumb">Paper IV · Cyber Forensic</div>' +
      '<h1>Practice</h1>' +
      '<p class="muted">Pick any combination of Paper IV units and topics to drill.</p>' +
      '<div class="card" id="practice-setup">' +
        '<div style="display:flex;gap:.5rem;margin-bottom:.7rem;flex-wrap:wrap">' +
          '<button type="button" class="btn sm ghost" id="p-sel-all">Select All</button>' +
          '<button type="button" class="btn sm ghost" id="p-sel-none">Clear All</button>' +
          '<button type="button" class="btn sm ghost" id="p-sel-u345">Forensics Only (Units III–V)</button>' +
        '</div>' +
        '<div class="filters" id="practice-topics">' +
          subs.map(function (key) {
            var parts = key.split('||');
            var n = Q.filter(function (q) { return q.unit === parts[0] && q.sub === parts[1]; }).length;
            return '<label class="fld" style="text-transform:none;letter-spacing:0;font-size:.88rem">' +
              '<span style="display:flex;gap:.4rem;align-items:center">' +
              '<input type="checkbox" data-unit="' + esc(parts[0]) + '" value="' + esc(key) + '" checked style="width:auto">' +
                '<b>[U-' + esc(parts[0]) + ']</b> ' + esc(parts[1]) + ' <span class="mono" style="color:var(--muted)">(' + n + ')</span>' +
              '</span></label>';
          }).join('') +
        '</div>' +
        '<div class="filters">' +
          '<label class="fld">Questions<input type="number" id="p-count" value="25" min="1" max="' + Q.length + '"></label>' +
          '<label class="fld">Marks per correct<input type="number" id="p-pos" value="2" min="1" step="0.5"></label>' +
          '<label class="fld">Penalty per wrong<input type="number" id="p-neg" value="0.5" min="0" step="0.25"></label>' +
        '</div>' +
        '<button class="btn" id="p-start">Start practice</button>' +
      '</div>' +
      '<div id="practice-run" class="hidden"></div>';

    $('#p-sel-all').addEventListener('click', function () {
      $$('#practice-topics input').forEach(function (c) { c.checked = true; });
    });
    $('#p-sel-none').addEventListener('click', function () {
      $$('#practice-topics input').forEach(function (c) { c.checked = false; });
    });
    $('#p-sel-u345').addEventListener('click', function () {
      $$('#practice-topics input').forEach(function (c) {
        c.checked = ['III', 'IV', 'V'].indexOf(c.dataset.unit) !== -1;
      });
    });

    $('#p-start').addEventListener('click', function () {
      var keys = $$('#practice-topics input:checked').map(function (c) { return c.value; });
      if (!keys.length) { toast('Select at least one topic.'); return; }
      var pool = [];
      keys.forEach(function (k) {
        var parts = k.split('||');
        Q.forEach(function (q, i) {
          if (q.unit === parts[0] && q.sub === parts[1]) pool.push({ q: q, i: i });
        });
      });
      var count = Math.min(+$('#p-count').value || 25, pool.length);
      practice = {
        items: shuffle(pool).slice(0, count),
        answers: {},
        pos: +$('#p-pos').value || 2,
        neg: +$('#p-neg').value || 0,
        done: false
      };
      $('#practice-setup').classList.add('hidden');
      $('#practice-run').classList.remove('hidden');
      drawPractice();
    });
  }

  function drawPractice() {
    var host = $('#practice-run');
    if (!host) return;
    host.innerHTML =
      '<div class="hud"><span id="p-progress" class="mono"></span><span class="spacer"></span>' +
      '<button class="btn sm" id="p-submit">Submit &amp; review</button></div>' +
      '<div id="p-score"></div>' +
      practice.items.map(function (o, i) {
        return '<div class="q"><div class="q-head">' +
          '<span class="pill ' + unitCls(o.q) + '">Unit ' + unitOf(o.q) + '</span>' +
          '<span class="pill">' + esc(o.q.sub) + '</span>' +
          '<span class="q-src">' + esc(o.q.sitting) + '</span></div>' +
          '<p class="q-stem">' + (i + 1) + '. ' + esc(o.q.q) + '</p>' +
          '<ul class="opts pick">' + LABELS.map(function (L, k) {
            return '<li data-i="' + o.i + '" data-o="' + k + '"><span class="lt">(' + L + ')</span>' +
                   '<span>' + esc(o.q.opts[L]) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="expl hidden" id="p-expl-' + o.i + '"></div></div>';
      }).join('');

    $$('#practice-run .opts.pick li').forEach(function (li) {
      li.addEventListener('click', function () {
        if (practice.done) return;
        var i = +li.dataset.i, k = +li.dataset.o;
        practice.answers[i] = (practice.answers[i] === k) ? null : k;
        $$('li[data-i="' + i + '"]').forEach(function (x) {
          x.classList.toggle('sel', +x.dataset.o === practice.answers[i]);
        });
        updatePProgress();
      });
    });
    $('#p-submit').addEventListener('click', submitPractice);
    updatePProgress();
  }

  function updatePProgress() {
    var done = Object.keys(practice.answers).filter(function (k) {
      return practice.answers[k] != null;
    }).length;
    var el = $('#p-progress');
    if (el) el.textContent = done + '/' + practice.items.length + ' answered';
  }

  function submitPractice() {
    if (practice.done) return;
    practice.done = true;
    var right = 0, wrong = 0, skip = 0;
    practice.items.forEach(function (o) {
      var given = practice.answers[o.i];
      var expl = $('#p-expl-' + o.i);
      if (given == null) skip++;
      else {
        store.tried[o.q.id] = given;
        if (given === ansIdx(o.q)) right++;
        else { wrong++; store.wrong[o.q.id] = Date.now(); }
      }

      $$('#practice-run li[data-i="' + o.i + '"]').forEach(function (x) {
        var k = +x.dataset.o;
        x.classList.remove('sel');
        if (k === ansIdx(o.q)) x.classList.add('right');
        else if (k === given) x.classList.add('chosen-wrong');
      });
      if (expl) {
        expl.classList.remove('hidden');
        expl.innerHTML = '<h5>Why</h5>' + o.q.exp +
          '<h5>Provenance</h5><p style="font-size:.85rem;color:var(--muted)">' + esc(o.q.prov) + '</p>';
      }
    });
    saveStore(store);

    var marks = right * practice.pos - wrong * practice.neg;
    var max = practice.items.length * practice.pos;
    var pct = max ? Math.round(100 * marks / max) : 0;
    var byUnit = {};
    practice.items.forEach(function (o) {
      var u = byUnit[o.q.unit] = byUnit[o.q.unit] || { n: 0, ok: 0 };
      u.n++;
      if (practice.answers[o.i] === ansIdx(o.q)) u.ok++;
    });
    var host = $('#p-score');
    host.innerHTML =
      '<div class="score"><div class="big">' + marks.toFixed(2) + ' / ' + max + '</div>' +
      '<p class="muted">' + pct + '% after a −' + practice.neg + ' penalty per wrong answer.</p>' +
      '<div class="statgrid">' +
        '<div class="stat"><b style="color:var(--ok)">' + right + '</b><span>correct</span></div>' +
        '<div class="stat"><b style="color:var(--bad)">' + wrong + '</b><span>wrong</span></div>' +
        '<div class="stat"><b>' + skip + '</b><span>skipped</span></div>' +
        '<div class="stat"><b>' + (wrong * practice.neg).toFixed(2) + '</b><span>marks lost</span></div>' +
      '</div>' +
      '<h3 style="margin:1rem 0 .4rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">By unit</h3>' +
      Object.keys(byUnit).map(function (u) {
        var v = byUnit[u];
        return '<div style="display:flex;gap:.6rem;align-items:center;margin:.3rem 0">' +
          '<span style="min-width:3.2rem" class="mono">Unit ' + u + '</span>' +
          '<span class="bar"><i style="width:' + (v.n ? Math.round(100 * v.ok / v.n) : 0) + '%"></i></span>' +
          '<span class="mono" style="font-size:.85rem">' + v.ok + '/' + v.n + '</span></div>';
      }).join('') +
      '</div>';
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Mock view ---------- */
  var mock = { items: [], answers: {}, done: false, timer: null, endsAt: null, neg: 0.5, pos: 2 };

  function renderMock() {
    var main = $('#main');
    main.innerHTML =
      '<div class="crumb">Paper IV · Cyber Forensic · 200 Marks (5 Units × 40 Marks)</div>' +
      '<h1>Paper IV Timed Mock Test</h1>' +
      '<p class="muted">Choose a <b>Full 5-Unit Balanced Paper IV Mock</b> (equal 20% weight across Units I–V) or a <b>Real Past-Papers Only Mock</b> (drawn strictly from real MPSC/MUDAL past technical papers).</p>' +
      '<div class="card">' +
        '<div class="filters">' +
          '<label class="fld">Mock Mode<select id="m-mode">' +
            '<option value="all5" selected>Full Paper IV · All 5 Units Balanced (I–V)</option>' +
            '<option value="real">Real MPSC/MUDAL Past Papers Only (Units I–III)</option>' +
            '<option value="official">2026 Official-Key Questions Only</option></select></label>' +
          '<label class="fld">Questions<select id="m-n">' +
            '<option>25</option><option selected>50</option><option>75</option><option>100</option></select></label>' +
          '<label class="fld">Time (minutes)<input type="number" id="m-time" value="90" min="0" max="240"></label>' +
          '<label class="fld">Marks per correct<input type="number" id="m-pos" value="2" min="1" step="0.5"></label>' +
          '<label class="fld">Penalty per wrong<select id="m-neg">' +
            '<option value="0.25">−0.25</option><option value="0.3333">−0.33 (1/3)</option>' +
            '<option value="0.5" selected>−0.5 (1/4 of 2m)</option><option value="0">none</option></select></label>' +
        '</div>' +
        '<button class="btn" id="m-start">Start mock</button>' +
      '</div>' +
      '<div id="mock-run" class="hidden"></div>';

    $('#m-start').addEventListener('click', function () {
      var n = +$('#m-n').value;
      var mode = $('#m-mode').value;
      var pool = [];
      if (mode === 'all5') {
        var per = Math.ceil(n / 5);
        ['I', 'II', 'III', 'IV', 'V'].forEach(function (u) {
          var sp = shuffle(Q.map(function (q, i) { return { q: q, i: i }; })
            .filter(function (o) { return o.q.unit === u; }));
          pool = pool.concat(sp.slice(0, per));
        });
      } else if (mode === 'real') {
        pool = shuffle(Q.map(function (q, i) { return { q: q, i: i }; })
          .filter(function (o) { return o.q.src === 'past'; }));
      } else {
        pool = shuffle(Q.map(function (q, i) { return { q: q, i: i }; })
          .filter(function (o) { return isOfficial(o.q); }));
      }
      pool = shuffle(pool).slice(0, Math.min(n, pool.length));
      if (!pool.length) { toast('No questions available.'); return; }
      mock = {
        items: pool, answers: {}, done: false,
        pos: +$('#m-pos').value || 2,
        neg: +$('#m-neg').value,
        endsAt: null, timer: null
      };
      var mins = +$('#m-time').value || 0;
      if (mins > 0) mock.endsAt = Date.now() + mins * 60000;
      $('#mock-run').classList.remove('hidden');
      drawMock();
      if (mock.endsAt) mock.timer = setInterval(tickMock, 1000);
    });
  }

  function tickMock() {
    if (!mock || mock.done) return;
    var left = Math.max(0, mock.endsAt - Date.now());
    var t = $('#m-timer');
    var m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    if (t) {
      t.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      t.classList.toggle('low', left < 60000);
    }
    if (left === 0) { clearInterval(mock.timer); submitMock(); }
  }

  function drawMock() {
    var host = $('#mock-run');
    host.innerHTML =
      '<div class="hud"><span class="timer" id="m-timer">--:--</span>' +
      '<span id="m-progress" class="mono" style="color:var(--muted);font-size:.85rem"></span>' +
      '<span class="spacer"></span>' +
      '<button class="btn sm" id="m-submit">Submit &amp; review</button></div>' +
      '<div id="m-score"></div>' +
      mock.items.map(function (o, i) {
        return '<div class="q"><div class="q-head">' +
          '<span class="pill ' + unitCls(o.q) + '">Unit ' + unitOf(o.q) + '</span>' +
          '<span class="pill">' + esc(o.q.sub) + '</span>' +
          '<span class="q-src">' + esc(o.q.sitting) + '</span></div>' +
          '<p class="q-stem">' + (i + 1) + '. ' + esc(o.q.q) + '</p>' +
          '<ul class="opts pick">' + LABELS.map(function (L, k) {
            return '<li data-i="' + o.i + '" data-o="' + k + '"><span class="lt">(' + L + ')</span>' +
                   '<span>' + esc(o.q.opts[L]) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="expl hidden" id="m-expl-' + o.i + '"></div></div>';
      }).join('');

    $$('#mock-run .opts.pick li').forEach(function (li) {
      li.addEventListener('click', function () {
        if (mock.done) return;
        var i = +li.dataset.i, k = +li.dataset.o;
        mock.answers[i] = (mock.answers[i] === k) ? null : k;
        $$('li[data-i="' + i + '"]').forEach(function (x) {
          x.classList.toggle('sel', +x.dataset.o === mock.answers[i]);
        });
        var done = Object.keys(mock.answers).filter(function (x) { return mock.answers[x] != null; }).length;
        $('#m-progress').textContent = done + '/' + mock.items.length + ' answered';
      });
    });
    $('#m-progress').textContent = '0/' + mock.items.length + ' answered';
    $('#m-submit').addEventListener('click', submitMock);
    tickMock();
  }

  function submitMock() {
    if (mock.done) return;
    mock.done = true;
    if (mock.timer) clearInterval(mock.timer);
    var right = 0, wrong = 0, skip = 0;
    mock.items.forEach(function (o) {
      var given = mock.answers[o.i];
      if (given == null) skip++;
      else {
        store.tried[o.q.id] = given;
        if (given === ansIdx(o.q)) right++;
        else { wrong++; store.wrong[o.q.id] = Date.now(); }
      }

      $$('#mock-run li[data-i="' + o.i + '"]').forEach(function (x) {
        var k = +x.dataset.o;
        x.classList.remove('sel');
        if (k === ansIdx(o.q)) x.classList.add('right');
        else if (k === given) x.classList.add('chosen-wrong');
      });
      var expl = $('#m-expl-' + o.i);
      if (expl) {
        expl.classList.remove('hidden');
        expl.innerHTML = '<h5>Why</h5>' + o.q.exp +
          '<h5>Provenance</h5><p style="font-size:.85rem;color:var(--muted)">' + esc(o.q.prov) + '</p>';
      }
    });
    saveStore(store);

    var marks = right * mock.pos - wrong * mock.neg;
    var max = mock.items.length * mock.pos;
    var pct = max ? Math.round(100 * marks / max) : 0;
    var byUnit = {};
    mock.items.forEach(function (o) {
      var u = byUnit[o.q.unit] = byUnit[o.q.unit] || { n: 0, ok: 0 };
      u.n++;
      if (mock.answers[o.i] === ansIdx(o.q)) u.ok++;
    });
    var host = $('#m-score');
    host.innerHTML =
      '<div class="score"><div class="big">' + marks.toFixed(2) + ' / ' + max + '</div>' +
      '<p class="muted">' + pct + '% after a −' + mock.neg + ' penalty per wrong answer.</p>' +
      '<div class="statgrid">' +
        '<div class="stat"><b style="color:var(--ok)">' + right + '</b><span>correct</span></div>' +
        '<div class="stat"><b style="color:var(--bad)">' + wrong + '</b><span>wrong</span></div>' +
        '<div class="stat"><b>' + skip + '</b><span>skipped</span></div>' +
        '<div class="stat"><b>' + (wrong * mock.neg).toFixed(2) + '</b><span>marks lost</span></div>' +
      '</div>' +
      '<h3 style="margin:1rem 0 .4rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">By unit</h3>' +
      Object.keys(byUnit).map(function (u) {
        var v = byUnit[u];
        return '<div style="display:flex;gap:.6rem;align-items:center;margin:.3rem 0">' +
          '<span style="min-width:3.2rem" class="mono">Unit ' + u + '</span>' +
          '<span class="bar"><i style="width:' + (v.n ? Math.round(100 * v.ok / v.n) : 0) + '%"></i></span>' +
          '<span class="mono" style="font-size:.85rem">' + v.ok + '/' + v.n + '</span></div>';
      }).join('') +
      '</div>';
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Review view ---------- */
  function renderReview() {
    var main = $('#main');
    var wrongIds = Object.keys(store.wrong);
    var markIds = Object.keys(store.marked);
    var byId = {};
    Q.forEach(function (q, i) { byId[q.id] = { q: q, i: i }; });

    function list(ids, emptyMsg) {
      if (!ids.length) return '<div class="empty">' + emptyMsg + '</div>';
      return ids.map(function (id) {
        var o = byId[id];
        return o ? qCard(o, { showNumber: null, forceReveal: true }) : '';
      }).join('');
    }

    main.innerHTML =
      '<div class="crumb">Paper IV · Cyber Forensic</div>' +
      '<h1>Review</h1>' +
      '<div class="card">' +
        '<h3 style="margin-top:0">Marked for review <span class="mono" style="color:var(--muted)">' + markIds.length + '</span></h3>' +
        list(markIds, 'No marked questions. Use “☆ Mark” in the bank to save questions here.') +
      '</div>' +
      '<div class="card">' +
        '<h3 style="margin-top:0">Answered incorrectly <span class="mono" style="color:var(--muted)">' + wrongIds.length + '</span></h3>' +
        list(wrongIds, 'No incorrect answers yet. They are saved automatically when you attempt questions in the bank, practice, or mock test.') +
      '</div>' +
      '<button class="btn ghost" id="clear-review">Clear saved review data</button>';

    $('#clear-review').addEventListener('click', function () {
      if (!confirm('Clear all marked, attempted, and incorrect question history?')) return;
      store.marked = {}; store.wrong = {}; store.tried = {};
      saveStore(store);
      renderReview();
      toast('Review data cleared');
    });
    bindMarkButtons(main);
  }

  /* ---------- helpers ---------- */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- router ---------- */
  function render(view) {
    if (view === 'bank') renderBank();
    else if (view === 'practice') renderPractice();
    else if (view === 'mock') renderMock();
    else if (view === 'review') renderReview();
    window.scrollTo(0, 0);
  }

  render('bank');
}());
