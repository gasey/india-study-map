/* MPSC JSO (Cyber Forensic) prep — app shell.
   Data comes from data/*.js, each pushing onto window.MPSC.units. */
(function () {
  'use strict';

  var UNITS = (window.MPSC && window.MPSC.units) || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var LABELS = ['a', 'b', 'c', 'd'];

  /* ---------------- mode switching ---------------- */
  $$('.mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.mode-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      $$('.view').forEach(function (v) { v.classList.remove('is-active'); });
      $('#view-' + btn.dataset.mode).classList.add('is-active');
    });
  });

  /* ---------------- countdown ---------------- */
  (function () {
    var el = $('#countdown');
    if (!el) return;
    var close = new Date('2026-08-27T16:00:00+05:30');
    var days = Math.ceil((close - new Date()) / 864e5);
    el.innerHTML = days > 0
      ? 'Applications close 27 Aug 2026 &middot; <b>' + days + ' days left</b>'
      : 'Application window closed';
  }());

  /* ---------------- browse ---------------- */
  function buildTree(filter) {
    var tree = $('#unit-tree');
    var f = (filter || '').toLowerCase();
    var papers = {};

    UNITS.forEach(function (u, i) {
      var hay = (u.title + ' ' + u.paper + ' ' + (u.syllabus || '')).toLowerCase();
      if (f && hay.indexOf(f) === -1) return;
      (papers[u.paper] = papers[u.paper] || []).push({ u: u, i: i });
    });

    var html = '';
    Object.keys(papers).forEach(function (p) {
      html += '<div class="tree-paper">' + esc(p) + '</div>';
      papers[p].forEach(function (o) {
        html += '<div class="tree-item" data-idx="' + o.i + '">' +
                  '<span>' + esc(o.u.title) + '</span>' +
                  '<span class="mk">' + o.u.marks + '</span>' +
                '</div>';
      });
    });
    tree.innerHTML = html || '<div class="tree-paper">No match</div>';

    $$('.tree-item', tree).forEach(function (el) {
      el.addEventListener('click', function () {
        $$('.tree-item').forEach(function (t) { t.classList.remove('is-active'); });
        el.classList.add('is-active');
        renderUnit(UNITS[+el.dataset.idx]);
      });
    });
  }

  function renderUnit(u) {
    // Syllabus units carry a real mark weight; mined past-paper banks do not —
    // their "marks" field is just the size of the bank, so label it honestly.
    var h = '<div class="crumb">' + esc(u.paper) + ' &middot; ' +
            (u.bank ? u.marks + ' questions' : u.marks + ' marks') + '</div>' +
            '<h1>' + esc(u.title) + '</h1>';

    if (u.syllabus) {
      h += '<div class="syl"><h4>Official syllabus text</h4>' + esc(u.syllabus) + '</div>';
    }
    (u.notes || []).forEach(function (n) {
      h += '<h3>' + esc(n.h) + '</h3>' + n.b;
    });

    var qs = u.questions || [];
    if (qs.length) {
      h += '<h3>Practice questions (' + qs.length + ')</h3>';
      qs.forEach(function (q, i) {
        h += '<div class="q"><div class="q-head">' +
               '<span class="q-num">' + (i + 1) + '.</span>' +
               '<div class="q-text">' + esc(q.q) + '</div></div>';
        q.o.forEach(function (opt, oi) {
          h += '<div class="opt' + (oi === q.a ? ' correct' : '') + '">' +
                 '<span class="lab">(' + LABELS[oi] + ')</span><span>' + esc(opt) + '</span>' +
               '</div>';
        });
        h += '<div class="expl"><h5>Why</h5>' + q.e + '</div></div>';
      });
    }
    $('#browse-content').innerHTML = h;
    $('#browse-content').scrollTop = 0;
  }

  $('#unit-filter').addEventListener('input', function (e) { buildTree(e.target.value); });

  /* ---------------- test ---------------- */
  function buildUnitPicker() {
    $('#test-units').innerHTML = UNITS.map(function (u, i) {
      var n = (u.questions || []).length;
      return '<label class="chk"><input type="checkbox" value="' + i + '"' +
             (n ? ' checked' : ' disabled') + '>' +
             '<span>' + esc(u.title) + '</span><span class="n">' + n + '</span></label>';
    }).join('');
  }

  var state = null;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  $('#test-start').addEventListener('click', function () {
    var picked = $$('#test-units input:checked').map(function (c) { return +c.value; });
    if (!picked.length) { alert('Select at least one unit.'); return; }

    var pool = [];
    picked.forEach(function (i) {
      (UNITS[i].questions || []).forEach(function (q) {
        pool.push({ q: q, unit: UNITS[i].title });
      });
    });
    if (!pool.length) { alert('No questions in the selected units yet.'); return; }

    var count = Math.min(+$('#test-count').value || 20, pool.length);
    state = {
      items: shuffle(pool).slice(0, count),
      answers: {},
      pos: +$('#test-pos').value || 2,
      neg: +$('#test-neg').value || 0,
      endsAt: null,
      timer: null
    };

    var mins = +$('#test-time').value || 0;
    if (mins > 0) state.endsAt = Date.now() + mins * 60000;

    $('#test-setup').classList.add('hidden');
    $('#test-result').classList.add('hidden');
    $('#test-run').classList.remove('hidden');
    renderTest();
    tick();
    if (state.endsAt) state.timer = setInterval(tick, 1000);
  });

  function tick() {
    var t = $('#test-timer');
    if (!state) return;
    if (!state.endsAt) { t.textContent = ''; return; }
    var left = Math.max(0, state.endsAt - Date.now());
    var m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    t.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    t.classList.toggle('low', left < 60000);
    if (left === 0) { clearInterval(state.timer); grade(); }
  }

  function updateProgress() {
    var done = Object.keys(state.answers).length;
    $('#test-progress').textContent = done + ' of ' + state.items.length + ' answered';
  }

  function renderTest() {
    $('#test-questions').innerHTML = state.items.map(function (it, i) {
      return '<div class="q"><div class="q-head">' +
               '<span class="q-num">' + (i + 1) + '.</span>' +
               '<div class="q-text">' + esc(it.q.q) +
                 '<div class="q-unit">' + esc(it.unit) + '</div>' +
               '</div></div>' +
             it.q.o.map(function (opt, oi) {
               return '<label class="opt" data-q="' + i + '" data-o="' + oi + '">' +
                        '<input type="radio" name="q' + i + '" value="' + oi + '">' +
                        '<span class="lab">(' + LABELS[oi] + ')</span><span>' + esc(opt) + '</span>' +
                      '</label>';
             }).join('') +
             '</div>';
    }).join('');

    $$('#test-questions input[type=radio]').forEach(function (r) {
      r.addEventListener('change', function () {
        var lab = r.closest('.opt');
        state.answers[+lab.dataset.q] = +lab.dataset.o;
        updateProgress();
      });
    });
    updateProgress();
    $('#test-questions').scrollIntoView({ block: 'start' });
  }

  $('#test-submit').addEventListener('click', function () {
    var done = Object.keys(state.answers).length;
    if (done < state.items.length &&
        !confirm((state.items.length - done) + ' unanswered. Submit anyway?')) return;
    if (state.timer) clearInterval(state.timer);
    grade();
  });

  function grade() {
    var right = 0, wrong = 0, skipped = 0, byUnit = {};

    state.items.forEach(function (it, i) {
      var u = byUnit[it.unit] = byUnit[it.unit] || { right: 0, total: 0 };
      u.total++;
      var given = state.answers[i];
      if (given === undefined) skipped++;
      else if (given === it.q.a) { right++; u.right++; }
      else wrong++;
    });

    var marks = right * state.pos - wrong * state.neg;
    var max = state.items.length * state.pos;
    var pct = max ? Math.round((marks / max) * 100) : 0;

    var h = '<div class="score"><h2>Result</h2><div class="score-grid">' +
      '<div class="stat ok"><div class="v">' + right + '</div><div class="k">Correct</div></div>' +
      '<div class="stat bad"><div class="v">' + wrong + '</div><div class="k">Wrong</div></div>' +
      '<div class="stat"><div class="v">' + skipped + '</div><div class="k">Skipped</div></div>' +
      '<div class="stat"><div class="v">' + (Math.round(marks * 100) / 100) + '</div><div class="k">Marks / ' + max + '</div></div>' +
      '<div class="stat"><div class="v">' + pct + '%</div><div class="k">Score</div></div>' +
      '</div>';

    if (wrong) {
      h += '<div class="note" style="margin-bottom:0">Negative marking cost you ' +
           (Math.round(wrong * state.neg * 100) / 100) + ' marks. ' +
           'On a paper with a penalty, a guess between four options is EV-negative unless you can ' +
           'eliminate at least one option.</div>';
    }

    h += '<div class="by-unit">';
    Object.keys(byUnit).forEach(function (n) {
      var u = byUnit[n], p = Math.round((u.right / u.total) * 100);
      h += '<div class="row"><span class="nm">' + esc(n) + '</span>' +
           '<span class="bar"><i style="width:' + p + '%"></i></span>' +
           '<span class="sc">' + u.right + '/' + u.total + '</span></div>';
    });
    h += '</div></div>';

    h += '<h3 style="margin:0 0 14px">Review</h3>';
    state.items.forEach(function (it, i) {
      var given = state.answers[i];
      h += '<div class="q"><div class="q-head">' +
             '<span class="q-num">' + (i + 1) + '.</span>' +
             '<div class="q-text">' + esc(it.q.q) +
               '<div class="q-unit">' + esc(it.unit) + '</div></div></div>';
      it.q.o.forEach(function (opt, oi) {
        var cls = '';
        if (oi === it.q.a) cls = ' correct';
        else if (oi === given) cls = ' chosen-wrong';
        h += '<div class="opt' + cls + '"><span class="lab">(' + LABELS[oi] + ')</span>' +
             '<span>' + esc(opt) + '</span></div>';
      });
      h += '<div class="expl"><h5>Why</h5>' + it.q.e + '</div></div>';
    });

    h += '<button class="ghost" id="test-again">New test</button>';

    $('#test-run').classList.add('hidden');
    var box = $('#test-result');
    box.innerHTML = h;
    box.classList.remove('hidden');
    $('#test-again').addEventListener('click', function () {
      box.classList.add('hidden');
      $('#test-setup').classList.remove('hidden');
    });
    box.scrollIntoView({ block: 'start' });
  }

  /* ---------------- exam plan ---------------- */
  function renderPlan() {
    var authored = UNITS.reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
    $('#plan-content').innerHTML =
      '<div class="crumb">Official — Approved Syllabus PDF, 23 pp.</div>' +
      '<h1>Exam structure</h1>' +
      '<p>Direct Recruitment, Advertisement No.18 of 2026&ndash;2027, dated 24 July 2026. ' +
      'Junior Scientific Officer (Cyber Forensic), Directorate of Forensic Science Laboratory, ' +
      'Home Department, Government of Mizoram &mdash; <b>1 post</b>.</p>' +
      '<table><tr><th>Paper</th><th>Content</th><th>Marks</th><th>Time</th><th>Scope</th></tr>' +
      '<tr><td>I</td><td>General English &mdash; pr&eacute;cis 10, letter 10, comprehension 10, essay 10 (written); parts of speech 20, usage &amp; vocabulary 20, sentence formation 20 (MCQ)</td><td>100</td><td>3 h</td><td>Common</td></tr>' +
      '<tr><td>II</td><td>General Knowledge &mdash; current events 12, history 12, geography 12, polity 12, economy 12, environment 12, general science 12, <b>Mizo culture &amp; heritage 16</b></td><td>100</td><td>2 h</td><td>Common</td></tr>' +
      '<tr><td>III</td><td>General Science 100 (Physics 34, Chemistry 36, Biology <i>or</i> Mathematics 30) + General Forensic 100 (10 topics &times; 10)</td><td>200</td><td>2 h</td><td><b>Common</b></td></tr>' +
      '<tr><td>IV</td><td>Cyber Forensic &mdash; Computer Fundamentals/OS/File Systems 40, DBMS 40, Digital &amp; Computer Forensics 40, Multimedia Forensics 40, Mobile Forensics 40</td><td>200</td><td>2 h</td><td>Division</td></tr>' +
      '<tr><td>&mdash;</td><td>Personal Interview</td><td>75</td><td>&mdash;</td><td>&mdash;</td></tr>' +
      '<tr><th>Total</th><th></th><th>675</th><th></th><th></th></tr></table>' +

      '<div class="tip"><b>Paper III is not division-specific.</b> The syllabus marks it ' +
      '&ldquo;Common paper for all divisions&rdquo;. You sit the same 200-mark general science and ' +
      'general forensic paper as the DNA, Ballistics, Toxicology and Questioned Documents candidates. ' +
      'Within its General Forensic half, Cyber Forensic is worth only 10 marks &mdash; the other 90 ' +
      'cover ballistics, toxicology, serology, fingerprints, documents, photography, crime scene and law.</div>' +

      '<h3>Where the marks actually are</h3>' +
      '<ul>' +
      '<li><b>400 marks are technical</b> (Papers III + IV), against 200 for English and GK combined.</li>' +
      '<li><b>Only 200 of those 400</b> are cyber. The other 200 are general science and general forensic.</li>' +
      '<li><b>40 marks of Paper I are hand-written</b> &mdash; pr&eacute;cis, letter, comprehension, essay. ' +
      'Not multiple choice; needs actual writing practice under time.</li>' +
      '<li><b>16 marks on Mizo culture, heritage and society</b> is the single largest block in Paper II ' +
      'and cannot be sourced from national prep books.</li>' +
      '<li>Every objective paper carries <b>negative marking</b>. The ratio is not published in the syllabus.</li>' +
      '</ul>' +

      '<h3>Past papers</h3>' +
      '<p>No past paper exists for JSO (Cyber Forensic) &mdash; the division has never been recruited, ' +
      'so this is its first advertisement. Nobody sitting the exam has seen this Paper IV. ' +
      'The nearest real papers are JSO Chemistry and Fingerprint (2016), JSO General English (2016), ' +
      'and UDC Home (Forensic) Papers I&ndash;II (2019).</p>' +
      '<p>Papers I and II follow the standard MPSC pattern used across every post, so roughly ' +
      '179 General English and 179 General Knowledge past papers in the archive are on-pattern practice ' +
      'for them. The archive holds 120 answer keys but <b>none</b> for any JSO or forensic paper.</p>' +

      '<h3>Build status</h3>' +
      '<p>' + UNITS.length + ' units loaded &middot; ' + authored + ' explained questions authored.</p>';
  }

  /* ---------------- init ---------------- */
  buildTree('');
  buildUnitPicker();
  renderPlan();
  if (UNITS.length) {
    var first = $('.tree-item');
    if (first) { first.classList.add('is-active'); renderUnit(UNITS[+first.dataset.idx]); }
  }
}());
