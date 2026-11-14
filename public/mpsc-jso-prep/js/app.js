/* MPSC JSO (Cyber Forensic) prep — upgraded interactive visual shell.
   Data comes from data/*.js, each pushing onto window.MPSC.units. */
(function () {
  'use strict';

  var UNITS = (window.MPSC && window.MPSC.units) || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var stripHtml = function (s) {
    return String(s || '').replace(/<[^>]*>/g, ' ');
  };
  var LABELS = ['a', 'b', 'c', 'd'];

  /* ---------------- Persistence (Attempts, Stars, Theme) ---------------- */
  var STORAGE_ATTEMPTS = 'mpsc_jso_attempts_v2';
  var STORAGE_STARS = 'mpsc_jso_stars_v2';
  var STORAGE_THEME = 'mpsc_jso_theme_v1';
  var STORAGE_REVEAL = 'mpsc_jso_study_reveal_v1';

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var attempts = loadJson(STORAGE_ATTEMPTS, {}); // key: "unitId:qIdx" -> chosenIndex
  var stars = loadJson(STORAGE_STARS, {});       // key: "unitId:qIdx" -> true
  var revealAllMode = loadJson(STORAGE_REVEAL, false);
  var currentUnit = null;
  var currentPaperFilter = 'all';
  var currentSearchFilter = '';
  var unitQFilter = 'all'; // 'all' | 'unanswered' | 'wrong' | 'starred'
  var unitQSearch = '';
  var peekedQuestions = {}; // temporary per-session peek

  /* ---------------- Theme Toggle ---------------- */
  (function initTheme() {
    var saved = localStorage.getItem(STORAGE_THEME);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    var btn = $('#theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme');
        var isLight = cur === 'light' || (!cur && window.matchMedia('(prefers-color-scheme: light)').matches);
        var next = isLight ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(STORAGE_THEME, next); } catch (e) {}
      });
    }
  }());

  /* ---------------- Mobile Sidebar Toggle ---------------- */
  var sidebar = $('#sidebar');
  var sidebarToggle = $('#sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('is-open');
    });
  }

  /* ---------------- Mode Switching ---------------- */
  function switchMode(mode) {
    $$('.mode-btn[data-mode]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });
    $$('.view').forEach(function (v) { v.classList.remove('is-active'); });
    var target = $('#view-' + mode);
    if (target) target.classList.add('is-active');
    if (mode === 'review') renderReview();
    if (mode === 'cheatsheet') renderCheatSheet();
    if (mode === 'plan') renderPlan();
  }

  $$('.mode-btn[data-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchMode(btn.dataset.mode);
    });
  });

  /* ---------------- Review Badge Counter ---------------- */
  function getReviewItems() {
    var list = [];
    UNITS.forEach(function (u, uIdx) {
      (u.questions || []).forEach(function (q, qIdx) {
        var key = u.id + ':' + qIdx;
        var isStarred = !!stars[key];
        var chosen = attempts[key];
        var isWrong = chosen !== undefined && chosen !== q.a;
        if (isStarred || isWrong) {
          list.push({
            key: key,
            u: u,
            uIdx: uIdx,
            q: q,
            qIdx: qIdx,
            isStarred: isStarred,
            isWrong: isWrong,
            chosen: chosen
          });
        }
      });
    });
    return list;
  }

  function updateReviewBadge() {
    var badge = $('#review-badge');
    if (!badge) return;
    var count = getReviewItems().length;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  /* ---------------- Countdown ---------------- */
  (function () {
    var el = $('#countdown');
    if (!el) return;
    var totalQs = UNITS.reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
    el.innerHTML = '<b>' + UNITS.length + ' units</b> &middot; <b>' + totalQs + ' MCQs</b>';
  }());

  /* ---------------- Sidebar Tree & Filtering ---------------- */
  function getUnitStats(u) {
    var qs = u.questions || [];
    var total = qs.length;
    var done = 0;
    var right = 0;
    for (var i = 0; i < total; i++) {
      var c = attempts[u.id + ':' + i];
      if (c !== undefined) {
        done++;
        if (c === qs[i].a) right++;
      }
    }
    return { total: total, done: done, right: right };
  }

  function buildTree() {
    var tree = $('#unit-tree');
    var f = (currentSearchFilter || '').trim().toLowerCase();
    var papers = {};

    UNITS.forEach(function (u, i) {
      if (currentPaperFilter !== 'all') {
        if (currentPaperFilter === 'Paper III —') {
          if (u.paper.indexOf('Paper III —') !== 0 || u.paper.indexOf('General Forensic') !== -1) return;
        } else if (u.paper.indexOf(currentPaperFilter) !== 0) {
          return;
        }
      }

      var matchNotes = 0;
      var matchQs = 0;
      if (f) {
        var baseHay = (u.title + ' ' + u.paper + ' ' + (u.syllabus || '')).toLowerCase();
        var baseMatch = baseHay.indexOf(f) !== -1;
        (u.notes || []).forEach(function (n) {
          if ((n.h + ' ' + stripHtml(n.b)).toLowerCase().indexOf(f) !== -1) matchNotes++;
        });
        (u.questions || []).forEach(function (q) {
          if ((q.q + ' ' + q.o.join(' ') + ' ' + stripHtml(q.e)).toLowerCase().indexOf(f) !== -1) matchQs++;
        });
        if (!baseMatch && !matchNotes && !matchQs) return;
      }

      (papers[u.paper] = papers[u.paper] || []).push({
        u: u,
        i: i,
        matchNotes: matchNotes,
        matchQs: matchQs
      });
    });

    var html = '';
    Object.keys(papers).forEach(function (p) {
      html += '<div class="tree-paper"><span>' + esc(p) + '</span><span>' + papers[p].length + '</span></div>';
      papers[p].forEach(function (o) {
        var st = getUnitStats(o.u);
        var pct = st.total ? Math.round((st.right / st.total) * 100) : 0;
        var isActive = currentUnit && currentUnit.id === o.u.id;
        var badgeText = o.u.bank ? st.total + ' Qs' : o.u.marks + 'm · ' + st.total + ' Qs';
        html += '<div class="tree-item' + (isActive ? ' is-active' : '') + '" data-idx="' + o.i + '">' +
                  '<div class="tree-item-top">' +
                    '<span class="tree-item-title">' + esc(o.u.title) + '</span>' +
                    '<span class="mk">' + esc(badgeText) + '</span>' +
                  '</div>';
        if (f && (o.matchNotes || o.matchQs)) {
          html += '<div class="tree-meta"><span>Matches: ' + o.matchNotes + ' notes, ' + o.matchQs + ' MCQs</span></div>';
        } else if (st.total > 0) {
          html += '<div class="tree-meta">' +
                    '<div class="mini-bar"><i style="width:' + pct + '%"></i></div>' +
                    '<span>' + st.right + '/' + st.total + '</span>' +
                  '</div>';
        }
        html += '</div>';
      });
    });
    tree.innerHTML = html || '<div class="tree-paper">No matching topics found</div>';

    $$('.tree-item', tree).forEach(function (el) {
      el.addEventListener('click', function () {
        $$('.tree-item', tree).forEach(function (t) { t.classList.remove('is-active'); });
        el.classList.add('is-active');
        unitQFilter = 'all';
        unitQSearch = '';
        peekedQuestions = {};
        renderUnit(UNITS[+el.dataset.idx]);
        if (sidebar) sidebar.classList.remove('is-open');
      });
    });
  }

  $('#unit-filter').addEventListener('input', function (e) {
    currentSearchFilter = e.target.value;
    buildTree();
  });

  $$('#paper-pills .p-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('#paper-pills .p-pill').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      currentPaperFilter = btn.dataset.paper;
      buildTree();
    });
  });

  /* ---------------- Render Study Unit ---------------- */
  function renderUnit(u) {
    currentUnit = u;
    var st = getUnitStats(u);
    var notes = u.notes || [];
    var qs = u.questions || [];

    var h = '<div class="unit-hero">' +
              '<div class="unit-hero-top">' +
                '<div>' +
                  '<div class="crumb">' + esc(u.paper) + '</div>' +
                  '<h1>' + esc(u.title) + '</h1>' +
                '</div>' +
                (qs.length ? '<button type="button" class="primary sm" id="unit-quick-test">🚀 Test This Unit (' + qs.length + ' Qs)</button>' : '') +
              '</div>' +
              '<div class="hero-badges">' +
                '<span class="h-badge accent">' + (u.bank ? '🗄️ Past Paper Bank' : '🎯 Official Weight: ' + u.marks + ' Marks') + '</span>' +
                '<span class="h-badge">📘 ' + notes.length + ' Concept Sections</span>' +
                '<span class="h-badge">❓ ' + qs.length + ' Practice MCQs</span>' +
                (qs.length ? '<span class="h-badge ok" id="unit-hero-score">✓ Mastery: ' + st.right + ' / ' + st.total + ' (' + (st.total ? Math.round((st.right / st.total) * 100) : 0) + '%)</span>' : '') +
              '</div>' +
            '</div>';

    if (u.syllabus) {
      h += '<div class="syl"><h4>📋 Official Approved Syllabus Scope (Verbatim)</h4>' + esc(u.syllabus) + '</div>';
    }

    if (notes.length > 1 || qs.length > 0) {
      h += '<div class="unit-toc">' +
             '<div class="unit-toc-title">🧭 Quick Jump — Sections &amp; Practice</div>' +
             '<div class="unit-toc-chips">';
      notes.forEach(function (n, idx) {
        h += '<a class="toc-chip" data-jump="note-sec-' + idx + '">' + (idx + 1) + '. ' + esc(n.h) + '</a>';
      });
      if (qs.length) {
        h += '<a class="toc-chip mcq-chip" data-jump="unit-mcq-anchor">🎯 Practice MCQs (' + qs.length + ')</a>';
      }
      h += '</div></div>';
    }

    notes.forEach(function (n, idx) {
      var numStr = (idx + 1) < 10 ? '0' + (idx + 1) : '' + (idx + 1);
      h += '<section class="note-card" id="note-sec-' + idx + '">' +
             '<div class="note-card-head">' +
               '<span class="note-num">' + numStr + '</span>' +
               '<h3>' + esc(n.h) + '</h3>' +
             '</div>' +
             '<div class="note-body">' + n.b + '</div>' +
           '</section>';
    });

    if (qs.length) {
      h += '<div id="unit-mcq-anchor"></div>' +
           '<div class="mcq-section-header">' +
             '<div class="mcq-bar-top">' +
               '<h3 id="unit-mcq-title">🎯 Practice Questions (' + qs.length + ')</h3>' +
               '<div class="mcq-controls">' +
                 '<button type="button" class="ghost sm" id="toggle-reveal-mode">' +
                   (revealAllMode ? '🎯 Switch to Interactive Attempt Mode' : '👁️ Reveal All Answers (Study Mode)') +
                 '</button>' +
                 '<button type="button" class="ghost sm" id="reset-unit-attempts">↺ Reset Unit</button>' +
               '</div>' +
             '</div>' +
             '<div class="mcq-bar-sub">' +
               '<input type="search" class="mcq-search" id="unit-q-search" placeholder="Filter questions in this unit by keyword…" value="' + esc(unitQSearch) + '">' +
               '<div class="q-filter-pills" id="unit-q-pills">' +
                 '<button type="button" class="qf-pill' + (unitQFilter === 'all' ? ' is-active' : '') + '" data-qf="all">All (' + qs.length + ')</button>' +
                 '<button type="button" class="qf-pill' + (unitQFilter === 'unanswered' ? ' is-active' : '') + '" data-qf="unanswered">Unanswered</button>' +
                 '<button type="button" class="qf-pill' + (unitQFilter === 'wrong' ? ' is-active' : '') + '" data-qf="wrong">Wrong</button>' +
                 '<button type="button" class="qf-pill' + (unitQFilter === 'starred' ? ' is-active' : '') + '" data-qf="starred">★ Saved</button>' +
               '</div>' +
             '</div>' +
           '</div>' +
           '<div id="unit-questions-list"></div>';
    }

    var box = $('#browse-content');
    box.innerHTML = h;
    box.scrollTop = 0;

    $$('.toc-chip', box).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var target = document.getElementById(chip.dataset.jump);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    var quickTestBtn = $('#unit-quick-test');
    if (quickTestBtn) {
      quickTestBtn.addEventListener('click', function () {
        var uIdx = UNITS.indexOf(u);
        switchMode('test');
        $$('#test-units input[type=checkbox]').forEach(function (chk) {
          chk.checked = (+chk.value === uIdx);
        });
        $('#test-count').value = Math.min(25, qs.length);
      });
    }

    if (qs.length) {
      bindUnitMcqControls(u);
      renderUnitQuestionsList(u);
    }
  }

  function bindUnitMcqControls(u) {
    var revBtn = $('#toggle-reveal-mode');
    if (revBtn) {
      revBtn.addEventListener('click', function () {
        revealAllMode = !revealAllMode;
        saveJson(STORAGE_REVEAL, revealAllMode);
        revBtn.textContent = revealAllMode ? '🎯 Switch to Interactive Attempt Mode' : '👁️ Reveal All Answers (Study Mode)';
        renderUnitQuestionsList(u);
      });
    }

    var resetBtn = $('#reset-unit-attempts');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!confirm('Reset all answered questions in "' + u.title + '"?')) return;
        (u.questions || []).forEach(function (_, i) {
          delete attempts[u.id + ':' + i];
        });
        peekedQuestions = {};
        saveJson(STORAGE_ATTEMPTS, attempts);
        updateUnitMasteryUI(u);
        renderUnitQuestionsList(u);
        buildTree();
        updateReviewBadge();
      });
    }

    var qSearch = $('#unit-q-search');
    if (qSearch) {
      qSearch.addEventListener('input', function (e) {
        unitQSearch = e.target.value;
        renderUnitQuestionsList(u);
      });
    }

    $$('#unit-q-pills .qf-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        $$('#unit-q-pills .qf-pill').forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        unitQFilter = pill.dataset.qf;
        renderUnitQuestionsList(u);
      });
    });
  }

  function updateUnitMasteryUI(u) {
    var st = getUnitStats(u);
    var heroScore = $('#unit-hero-score');
    if (heroScore) {
      var pct = st.total ? Math.round((st.right / st.total) * 100) : 0;
      heroScore.textContent = '✓ Mastery: ' + st.right + ' / ' + st.total + ' (' + pct + '%)';
    }
  }

  function renderUnitQuestionsList(u) {
    var listEl = $('#unit-questions-list');
    if (!listEl) return;
    var qs = u.questions || [];
    var sFilter = (unitQSearch || '').trim().toLowerCase();

    var filtered = [];
    qs.forEach(function (q, i) {
      var key = u.id + ':' + i;
      var chosen = attempts[key];
      var isStarred = !!stars[key];
      if (unitQFilter === 'unanswered' && chosen !== undefined) return;
      if (unitQFilter === 'wrong' && (chosen === undefined || chosen === q.a)) return;
      if (unitQFilter === 'starred' && !isStarred) return;
      if (sFilter) {
        var hay = (q.q + ' ' + q.o.join(' ') + ' ' + stripHtml(q.e)).toLowerCase();
        if (hay.indexOf(sFilter) === -1) return;
      }
      filtered.push({ q: q, i: i, key: key, chosen: chosen, isStarred: isStarred });
    });

    if (!filtered.length) {
      listEl.innerHTML = '<div class="card"><p class="muted">No questions match the current filter.</p></div>';
      return;
    }

    listEl.innerHTML = filtered.map(function (item) {
      var q = item.q;
      var i = item.i;
      var key = item.key;
      var chosen = item.chosen;
      var isPeeked = !!peekedQuestions[key];
      var showAnswer = revealAllMode || chosen !== undefined || isPeeked;

      var h = '<div class="q" data-qidx="' + i + '">' +
                '<div class="q-head">' +
                  '<span class="q-num">Q' + (i + 1) + '</span>' +
                  '<div class="q-text">' + esc(q.q) + '</div>' +
                  '<div class="q-actions">' +
                    (!showAnswer ? '<button type="button" class="q-reveal-btn" data-peek="' + key + '" title="Reveal answer without guessing">👁️ Peek</button>' : '') +
                    '<button type="button" class="q-star' + (item.isStarred ? ' is-starred' : '') + '" data-star="' + key + '" title="Bookmark question">' + (item.isStarred ? '★ Saved' : '☆ Save') + '</button>' +
                  '</div>' +
                '</div>';

      q.o.forEach(function (opt, oi) {
        var cls = 'opt';
        if (showAnswer) {
          if (oi === q.a) cls += ' correct';
          else if (chosen === oi && chosen !== q.a) cls += ' chosen-wrong';
        }
        h += '<div class="' + cls + '" data-pick="' + oi + '" data-qidx="' + i + '">' +
               '<span class="lab">(' + LABELS[oi] + ')</span>' +
               '<span>' + esc(opt) + '</span>' +
             '</div>';
      });

      if (showAnswer) {
        h += '<div class="expl"><h5>💡 Why &amp; Concept Breakdown</h5>' + q.e + '</div>';
      }
      h += '</div>';
      return h;
    }).join('');

    $$('.opt[data-pick]', listEl).forEach(function (optEl) {
      optEl.addEventListener('click', function () {
        var qIdx = +optEl.dataset.qidx;
        var pick = +optEl.dataset.pick;
        var key = u.id + ':' + qIdx;
        attempts[key] = pick;
        saveJson(STORAGE_ATTEMPTS, attempts);
        updateUnitMasteryUI(u);
        renderUnitQuestionsList(u);
        buildTree();
        updateReviewBadge();
      });
    });

    $$('.q-star[data-star]', listEl).forEach(function (starBtn) {
      starBtn.addEventListener('click', function () {
        var key = starBtn.dataset.star;
        if (stars[key]) delete stars[key];
        else stars[key] = true;
        saveJson(STORAGE_STARS, stars);
        renderUnitQuestionsList(u);
        updateReviewBadge();
      });
    });

    $$('.q-reveal-btn[data-peek]', listEl).forEach(function (peekBtn) {
      peekBtn.addEventListener('click', function () {
        peekedQuestions[peekBtn.dataset.peek] = true;
        renderUnitQuestionsList(u);
      });
    });
  }

  /* ---------------- Visual Lab & Cheat Sheets ---------------- */
  function renderCheatSheet() {
    var box = $('#cheatsheet-content');
    if (!box || box.dataset.rendered === '1') return;
    box.dataset.rendered = '1';

    box.innerHTML =
      '<div class="unit-hero">' +
        '<div class="crumb">Paper IV &amp; Paper III Cyber Forensics &middot; Interactive Reference</div>' +
        '<h1>⚡ Cyber Forensic Visual Lab &amp; Master Cheat Sheets</h1>' +
        '<p class="muted">Interactive byte/endianness/timestamp/Nyquist calculators + side-by-side discriminator matrices for rapid pre-exam revision.</p>' +
      '</div>' +

      '<div class="lab-grid">' +
        /* Lab 1: Endianness & Base Converter */
        '<div class="lab-card">' +
          '<h3>🔢 Number System &amp; Endianness Inspector</h3>' +
          '<p class="muted">Enter any decimal or hex value (e.g. <code>0x12345678</code> or <code>305419896</code> or <code>255</code>) to see its binary nibbles and 32-bit Little-Endian vs Big-Endian byte storage.</p>' +
          '<div class="lab-input-row">' +
            '<input type="text" id="lab-num-in" value="0x12345678" placeholder="e.g. 0x12345678 or 47">' +
          '</div>' +
          '<div class="lab-out" id="lab-num-out"></div>' +
        '</div>' +

        /* Lab 2: Forensic Timestamp & Epoch Decoder */
        '<div class="lab-card">' +
          '<h3>⏱️ Forensic Epoch &amp; Timestamp Decoder</h3>' +
          '<p class="muted">Compare how raw integers decode under Unix (1970), Apple/iOS Cocoa (2001), and Windows FILETIME (1601) — and see the 31-year iOS vs Unix trap!</p>' +
          '<div class="lab-input-row">' +
            '<input type="number" id="lab-ts-in" value="1700000000">' +
            '<select id="lab-ts-type">' +
              '<option value="unix_s">Unix Seconds (since 1 Jan 1970)</option>' +
              '<option value="unix_ms">Unix Milliseconds (Java/Android)</option>' +
              '<option value="apple">Apple / iOS Seconds (since 1 Jan 2001)</option>' +
              '<option value="filetime">Windows FILETIME (100-ns since 1601)</option>' +
            '</select>' +
          '</div>' +
          '<div class="lab-out" id="lab-ts-out"></div>' +
        '</div>' +

        /* Lab 3: Nyquist, Aliasing & Uncompressed Media Calculator */
        '<div class="lab-card">' +
          '<h3>🎙️ Nyquist Sampling &amp; Aliasing Calculator</h3>' +
          '<p class="muted">Enter highest signal frequency (kHz) and your sampling rate (kHz) to check if aliasing occurs and compute the folded alias frequency.</p>' +
          '<div class="lab-input-row">' +
            '<label style="flex:1"><small>Signal f_max (kHz)</small><input type="number" id="lab-fmax" value="5" step="0.5"></label>' +
            '<label style="flex:1"><small>Sample Rate f_s (kHz)</small><input type="number" id="lab-fs" value="8" step="0.5"></label>' +
          '</div>' +
          '<div class="lab-out" id="lab-nyq-out"></div>' +
        '</div>' +
      '</div>' +

      /* Master Matrix 1: Cross-OS Forensic Artefacts */
      '<section class="note-card">' +
        '<div class="note-card-head"><span class="note-num">M1</span><h3>Cross-Platform Forensic Artefact Equivalents (Unit I, III &amp; V)</h3></div>' +
        '<p>Examiners frequently ask "What is the Linux/macOS/Android/iOS counterpart of Windows artefact X?" Master this matrix as a single mental map:</p>' +
        '<table>' +
          '<tr><th>Forensic Need</th><th>Windows (NTFS)</th><th>Linux (ext4)</th><th>macOS (APFS / HFS+)</th><th>Android</th><th>iOS</th></tr>' +
          '<tr><td><b>File Metadata &amp; Index</b></td><td><code>$MFT</code> (1024-byte records, <code>$SI</code> &amp; <code>$FN</code>)</td><td><b>Inodes</b> (mtime, atime, ctime, crtime)</td><td>Catalog File / APFS Object Map</td><td>ext4 / F2FS inodes</td><td>APFS Copy-on-Write metadata</td></tr>' +
          '<tr><td><b>System &amp; App Config</b></td><td><b>Registry Hives</b> (<code>SAM</code>, <code>SYSTEM</code>, <code>SOFTWARE</code>, <code>NTUSER.DAT</code>)</td><td><code>/etc/</code> plain text config files</td><td><b>Plist</b> files (<code>~/Library/Preferences/*.plist</code>)</td><td><code>shared_prefs/*.xml</code> &amp; <code>settings.db</code></td><td>XML &amp; Binary <b>Plists</b></td></tr>' +
          '<tr><td><b>Virtual Memory / Swap</b></td><td><code>pagefile.sys</code> &amp; <code>swapfile.sys</code></td><td>Swap partition or <code>/swapfile</code></td><td><code>/private/var/vm/sleepimage</code> &amp; swapfiles</td><td>ZRAM (compressed RAM swap)</td><td>Encrypted swap / compressed memory</td></tr>' +
          '<tr><td><b>Authentication &amp; Event Logs</b></td><td><code>.evtx</code> (4624 logon, 4625 fail, 1102 cleared)</td><td><code>/var/log/auth.log</code>, <code>syslog</code>, <code>wtmp</code>/<code>btmp</code></td><td><b>Unified Logs</b> (queried via <code>log show</code>)</td><td><code>logcat</code> ring buffers</td><td>Unified Logs &amp; <code>KnowledgeC.db</code></td></tr>' +
          '<tr><td><b>Full-Disk Encryption</b></td><td><b>BitLocker</b> (TPM) / <b>EFS</b> (per-file)</td><td>LUKS / dm-crypt</td><td><b>FileVault 2</b></td><td><b>FBE</b> (File-Based: CE vs DE) / FDE</td><td>Hardware Per-File Classes (<b>Secure Enclave</b>)</td></tr>' +
        '</table>' +
      '</section>' +

      /* Master Matrix 2: File Signatures & Magic Numbers */
      '<section class="note-card">' +
        '<div class="note-card-head"><span class="note-num">M2</span><h3>File Signatures (Magic Bytes) &amp; Carving Cheat Sheet (Unit III)</h3></div>' +
        '<table>' +
          '<tr><th>Format</th><th>Hex Header (Start)</th><th>ASCII / Trailer</th><th>Exam &amp; Carving Trap</th></tr>' +
          '<tr><td><b>JPEG</b></td><td><code>FF D8 FF</code></td><td><code>ÿØÿ</code> &middot; Trailer: <code>FF D9</code></td><td>Lossy 8&times;8 DCT; carries EXIF &amp; embedded thumbnail</td></tr>' +
          '<tr><td><b>PNG</b></td><td><code>89 50 4E 47 0D 0A 1A 0A</code></td><td><code>.PNG....</code> &middot; Trailer: <code>IEND</code></td><td>Lossless DEFLATE compression; supports alpha transparency</td></tr>' +
          '<tr><td><b>GIF</b></td><td><code>47 49 46 38 37 61</code> / <code>39 61</code></td><td><code>GIF87a</code> or <code>GIF89a</code></td><td>Lossless LZW compression; max <b>256 colours</b> (8-bit palette)</td></tr>' +
          '<tr><td><b>PDF</b></td><td><code>25 50 44 46</code></td><td><code>%PDF</code> &middot; Trailer: <code>%%EOF</code></td><td>Frequently used as a fake extension to disguise JPEGs or EXEs</td></tr>' +
          '<tr><td><b>ZIP / DOCX / XLSX / APK / JAR</b></td><td><code>50 4B 03 04</code></td><td><code>PK..</code> (Phil Katz)</td><td><b>All Office Open XML (.docx, .xlsx, .pptx) and Android .apk files are ZIP archives!</b></td></tr>' +
          '<tr><td><b>Windows PE (.exe / .dll / .sys)</b></td><td><code>4D 5A</code></td><td><code>MZ</code> (Mark Zbikowski)</td><td>DOS stub followed by <code>PE\\0\\0</code> header</td></tr>' +
          '<tr><td><b>Linux ELF Executable</b></td><td><code>7F 45 4C 46</code></td><td><code>.ELF</code></td><td>Standard binary format on Linux and Android native libraries (<code>.so</code>)</td></tr>' +
          '<tr><td><b>SQLite 3 Database</b></td><td><code>53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00</code></td><td><code>SQLite format 3\\0</code></td><td>16-byte header; page size stored at byte offset 16 (2 bytes, big-endian)</td></tr>' +
        '</table>' +
      '</section>' +

      /* Master Matrix 3: 2023 Indian Criminal & Evidence Law Mapping */
      '<section class="note-card">' +
        '<div class="note-card-head"><span class="note-num">M3</span><h3>Indian Forensic &amp; Cyber Law Reference (Old Act vs 2023 Sanhita/Adhiniyam)</h3></div>' +
        '<table>' +
          '<tr><th>Legal Provision</th><th>Old Law (Pre-July 2024)</th><th>New Law (From 1 July 2024)</th><th>Why It Matters in the Exam</th></tr>' +
          '<tr><td><b>Admissibility of Electronic Records</b></td><td><b>Section 65B</b>, Indian Evidence Act 1872</td><td><b>Section 63</b>, Bharatiya Sakshya Adhiniyam (BSA) 2023</td><td>Mandatory certificate for secondary electronic evidence (<em>Anvar P.V.</em> &amp; <em>Arjun Panditrao</em>)</td></tr>' +
          '<tr><td><b>Opinion of Examiner of Electronic Evidence</b></td><td><b>Section 45A</b>, IEA (with s.79A IT Act)</td><td><b>Section 39(2)</b>, BSA 2023</td><td>Recognises the notified Examiner of Electronic Evidence as an expert</td></tr>' +
          '<tr><td><b>General Expert Opinion</b></td><td><b>Section 45</b>, IEA 1872</td><td><b>Section 39(1)</b>, BSA 2023</td><td>Advisory, corroborative; court is final judge of fact</td></tr>' +
          '<tr><td><b>FSL / Government Scientific Expert Report</b></td><td><b>Section 293</b>, CrPC 1973</td><td><b>Section 329</b>, BNSS 2023</td><td>FSL Director/Officer report admissible without personal appearance unless summoned</td></tr>' +
          '<tr><td><b>Mandatory Forensic Visit at Crime Scene</b></td><td>Discretionary</td><td><b>Section 176(3)</b>, BNSS 2023</td><td>Mandatory forensic expert visit &amp; videography for offences punishable with <b>7+ years</b></td></tr>' +
        '</table>' +
      '</section>';

    function updateNumLab() {
      var raw = ($('#lab-num-in').value || '').trim();
      var out = $('#lab-num-out');
      var n = raw.toLowerCase().indexOf('0x') === 0 ? parseInt(raw, 16) : parseInt(raw, 10);
      if (isNaN(n) || n < 0) {
        out.innerHTML = 'Enter a non-negative integer or hex value (e.g. <code>0x12345678</code> or <code>47</code>).';
        return;
      }
      var u32 = n >>> 0;
      var hex8 = u32.toString(16).toUpperCase().padStart(8, '0');
      var bytesBE = [hex8.slice(0, 2), hex8.slice(2, 4), hex8.slice(4, 6), hex8.slice(6, 8)];
      var bytesLE = bytesBE.slice().reverse();
      var bin32 = u32.toString(2).padStart(32, '0').replace(/(.{4})/g, '$1 ').trim();
      out.innerHTML =
        '<div><b>Decimal:</b> ' + u32 + ' &nbsp;|&nbsp; <b>Hex (32-bit):</b> 0x' + hex8 + ' &nbsp;|&nbsp; <b>Octal:</b> 0o' + u32.toString(8) + '</div>' +
        '<div><b>Binary (Nibbles):</b> ' + bin32 + '</div>' +
        '<div style="margin-top:6px"><b>Little-Endian (x86/ARM memory, lowest addr first):</b> <span style="color:var(--accent)">' + bytesLE.join(' ') + '</span></div>' +
        '<div><b>Big-Endian (Network / JPEG / PNG order):</b> <span style="color:var(--ok)">' + bytesBE.join(' ') + '</span></div>';
    }

    function updateTsLab() {
      var val = parseFloat($('#lab-ts-in').value || '0');
      var type = $('#lab-ts-type').value;
      var out = $('#lab-ts-out');
      var ms = 0;
      if (type === 'unix_s') ms = val * 1000;
      else if (type === 'unix_ms') ms = val;
      else if (type === 'apple') ms = (val + 978307200) * 1000; // 1 Jan 2001 is +978307200s from 1970
      else if (type === 'filetime') ms = (val / 10000) - 11644473600000;
      var d = new Date(ms);
      var wrongIosAsUnix = new Date(val * 1000);
      out.innerHTML =
        '<div><b>Decoded UTC:</b> <span style="color:var(--ok)">' + (isNaN(d.getTime()) ? 'Invalid date' : d.toUTCString()) + '</span></div>' +
        (type === 'apple'
          ? '<div style="margin-top:6px;color:var(--warn)"><b>⚠️ Exam Trap:</b> If misread as Unix seconds (1970 epoch), this iOS timestamp lands at <b>' + wrongIosAsUnix.toUTCString() + '</b> (31 years too early!).</div>'
          : '<div style="margin-top:4px;color:var(--fg2)">Epoch offset: Unix = 1970-01-01 &middot; Apple = 2001-01-01 (+978,307,200s) &middot; Windows = 1601-01-01.</div>');
    }

    function updateNyqLab() {
      var fmax = parseFloat($('#lab-fmax').value || '0');
      var fs = parseFloat($('#lab-fs').value || '0');
      var out = $('#lab-nyq-out');
      var nyq = 2 * fmax;
      var ok = fs > nyq;
      var alias = Math.abs(fs - fmax);
      out.innerHTML =
        '<div><b>Required Nyquist Rate (2 &times; f_max):</b> &gt; ' + nyq + ' kHz</div>' +
        '<div><b>Status at f_s = ' + fs + ' kHz:</b> ' +
          (ok
            ? '<span style="color:var(--ok)">✓ No Aliasing (f_s &gt; 2&middot;f_max)</span>'
            : '<span style="color:var(--bad)">✗ ALIASING OCCURS! High frequency folds to |' + fs + ' &minus; ' + fmax + '| = ' + alias + ' kHz</span>') +
        '</div>';
    }

    $('#lab-num-in').addEventListener('input', updateNumLab);
    $('#lab-ts-in').addEventListener('input', updateTsLab);
    $('#lab-ts-type').addEventListener('change', updateTsLab);
    $('#lab-fmax').addEventListener('input', updateNyqLab);
    $('#lab-fs').addEventListener('input', updateNyqLab);
    updateNumLab();
    updateTsLab();
    updateNyqLab();
  }

  /* ---------------- Saved & Weak Review View ---------------- */
  var reviewFilter = 'all'; // 'all' | 'starred' | 'wrong'

  function renderReview() {
    var box = $('#review-content');
    if (!box) return;
    var items = getReviewItems();
    var filtered = items.filter(function (it) {
      if (reviewFilter === 'starred') return it.isStarred;
      if (reviewFilter === 'wrong') return it.isWrong;
      return true;
    });

    var h = '<div class="unit-hero">' +
              '<div class="unit-hero-top">' +
                '<div>' +
                  '<div class="crumb">Personal Revision Bank &middot; Persisted in Browser</div>' +
                  '<h1>⭐ Saved &amp; Weak Questions (' + items.length + ')</h1>' +
                  '<p class="muted">Every question you bookmark (★) or answer wrong in Study or Mock Test mode appears here automatically.</p>' +
                '</div>' +
                (items.length ? '<button type="button" class="ghost sm" id="clear-wrong-btn">Clear Wrong History</button>' : '') +
              '</div>' +
              '<div class="hero-badges" style="margin-top:14px">' +
                '<button type="button" class="qf-pill' + (reviewFilter === 'all' ? ' is-active' : '') + '" data-rf="all">All (' + items.length + ')</button>' +
                '<button type="button" class="qf-pill' + (reviewFilter === 'starred' ? ' is-active' : '') + '" data-rf="starred">★ Saved (' + items.filter(function(x){return x.isStarred;}).length + ')</button>' +
                '<button type="button" class="qf-pill' + (reviewFilter === 'wrong' ? ' is-active' : '') + '" data-rf="wrong">❌ Answered Wrong (' + items.filter(function(x){return x.isWrong;}).length + ')</button>' +
              '</div>' +
            '</div>';

    if (!filtered.length) {
      h += '<div class="card"><p class="muted">No questions here yet! Click <b>☆ Save</b> on any question or attempt questions in Study/Test mode to populate your personal review bank.</p></div>';
    } else {
      filtered.forEach(function (it, idx) {
        h += '<div class="q">' +
               '<div class="q-head">' +
                 '<span class="q-num">#' + (idx + 1) + '</span>' +
                 '<div class="q-text">' + esc(it.q.q) +
                   '<div class="q-unit">' + esc(it.u.paper) + ' &middot; ' + esc(it.u.title) + '</div>' +
                 '</div>' +
                 '<div class="q-actions">' +
                   '<button type="button" class="q-star' + (it.isStarred ? ' is-starred' : '') + '" data-rstar="' + it.key + '">' + (it.isStarred ? '★ Saved' : '☆ Save') + '</button>' +
                 '</div>' +
               '</div>';
        it.q.o.forEach(function (opt, oi) {
          var cls = 'opt';
          if (oi === it.q.a) cls += ' correct';
          else if (it.chosen === oi && it.chosen !== it.q.a) cls += ' chosen-wrong';
          h += '<div class="' + cls + '">' +
                 '<span class="lab">(' + LABELS[oi] + ')</span>' +
                 '<span>' + esc(opt) + '</span>' +
               '</div>';
        });
        h += '<div class="expl"><h5>💡 Why &amp; Concept Breakdown</h5>' + it.q.e + '</div></div>';
      });
    }

    box.innerHTML = h;

    $$('[data-rf]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        reviewFilter = btn.dataset.rf;
        renderReview();
      });
    });

    $$('[data-rstar]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.rstar;
        if (stars[key]) delete stars[key];
        else stars[key] = true;
        saveJson(STORAGE_STARS, stars);
        updateReviewBadge();
        renderReview();
      });
    });

    var clearWrong = $('#clear-wrong-btn');
    if (clearWrong) {
      clearWrong.addEventListener('click', function () {
        if (!confirm('Clear wrong-answer flags (your ★ saved bookmarks will be kept)?')) return;
        Object.keys(attempts).forEach(function (k) {
          delete attempts[k];
        });
        saveJson(STORAGE_ATTEMPTS, attempts);
        updateReviewBadge();
        buildTree();
        renderReview();
      });
    }
  }

  /* ---------------- Test Engine ---------------- */
  function buildUnitPicker() {
    $('#test-units').innerHTML = UNITS.map(function (u, i) {
      var n = (u.questions || []).length;
      var isP4 = u.paper.indexOf('Paper IV') === 0;
      return '<label class="chk" data-paper="' + esc(u.paper) + '"><input type="checkbox" value="' + i + '"' +
             (n && isP4 ? ' checked' : '') + (n ? '' : ' disabled') + '>' +
             '<span>' + esc(u.title) + '</span><span class="n">' + n + '</span></label>';
    }).join('');
  }

  function setPreset(pred) {
    $$('#test-units input[type=checkbox]').forEach(function (chk) {
      if (chk.disabled) return;
      var u = UNITS[+chk.value];
      chk.checked = pred(u);
    });
  }

  var p4Btn = $('#preset-p4');
  if (p4Btn) p4Btn.addEventListener('click', function () { setPreset(function (u) { return u.paper.indexOf('Paper IV') === 0; }); });
  var p3gfBtn = $('#preset-p3gf');
  if (p3gfBtn) p3gfBtn.addEventListener('click', function () { setPreset(function (u) { return u.paper.indexOf('Paper III — General Forensic') === 0; }); });
  var allBtn = $('#preset-all');
  if (allBtn) allBtn.addEventListener('click', function () { setPreset(function () { return true; }); });
  var noneBtn = $('#preset-none');
  if (noneBtn) noneBtn.addEventListener('click', function () { setPreset(function () { return false; }); });

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
      var u = UNITS[i];
      (u.questions || []).forEach(function (q, qIdx) {
        pool.push({ q: q, unit: u.title, uId: u.id, qIdx: qIdx });
      });
    });
    if (!pool.length) { alert('No questions in the selected units yet.'); return; }

    var count = Math.min(+$('#test-count').value || 25, pool.length);
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

  var abortBtn = $('#test-abort');
  if (abortBtn) {
    abortBtn.addEventListener('click', function () {
      if (state && state.timer) clearInterval(state.timer);
      $('#test-run').classList.add('hidden');
      $('#test-setup').classList.remove('hidden');
    });
  }

  function tick() {
    var t = $('#test-timer');
    if (!state) return;
    if (!state.endsAt) { t.textContent = 'Untimed'; return; }
    var left = Math.max(0, state.endsAt - Date.now());
    var m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    t.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
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
               '<span class="q-num">Q' + (i + 1) + '</span>' +
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
      if (given === undefined) {
        skipped++;
      } else {
        attempts[it.uId + ':' + it.qIdx] = given;
        if (given === it.q.a) { right++; u.right++; }
        else wrong++;
      }
    });
    saveJson(STORAGE_ATTEMPTS, attempts);
    buildTree();
    updateReviewBadge();

    var marks = right * state.pos - wrong * state.neg;
    var max = state.items.length * state.pos;
    var pct = max ? Math.round((marks / max) * 100) : 0;

    var h = '<div class="score"><h2>Test Result</h2><div class="score-grid">' +
      '<div class="stat ok"><div class="v">' + right + '</div><div class="k">Correct</div></div>' +
      '<div class="stat bad"><div class="v">' + wrong + '</div><div class="k">Wrong</div></div>' +
      '<div class="stat"><div class="v">' + skipped + '</div><div class="k">Skipped</div></div>' +
      '<div class="stat"><div class="v">' + (Math.round(marks * 100) / 100) + '</div><div class="k">Marks / ' + max + '</div></div>' +
      '<div class="stat"><div class="v">' + pct + '%</div><div class="k">Net Score</div></div>' +
      '</div>';

    if (wrong) {
      h += '<div class="note" style="margin-bottom:0">Negative marking cost you ' +
           (Math.round(wrong * state.neg * 100) / 100) + ' marks. Any wrong answers have been automatically added to your <b>⭐ Saved &amp; Weak</b> tab for targeted review.</div>';
    }

    h += '<div class="by-unit">';
    Object.keys(byUnit).forEach(function (n) {
      var u = byUnit[n], p = Math.round((u.right / u.total) * 100);
      h += '<div class="row"><span class="nm">' + esc(n) + '</span>' +
           '<span class="bar"><i style="width:' + p + '%"></i></span>' +
           '<span class="sc">' + u.right + '/' + u.total + '</span></div>';
    });
    h += '</div>' +
         '<div style="margin-top:16px"><button class="primary sm" id="test-again-top">🚀 Build Another Test</button></div>' +
         '</div>';

    h += '<h3 style="margin:0 0 14px">Detailed Answer Review</h3>';
    state.items.forEach(function (it, i) {
      var given = state.answers[i];
      h += '<div class="q"><div class="q-head">' +
             '<span class="q-num">Q' + (i + 1) + '</span>' +
             '<div class="q-text">' + esc(it.q.q) +
               '<div class="q-unit">' + esc(it.unit) + '</div></div></div>';
      it.q.o.forEach(function (opt, oi) {
        var cls = '';
        if (oi === it.q.a) cls = ' correct';
        else if (oi === given) cls = ' chosen-wrong';
        h += '<div class="opt' + cls + '"><span class="lab">(' + LABELS[oi] + ')</span>' +
             '<span>' + esc(opt) + '</span></div>';
      });
      h += '<div class="expl"><h5>💡 Why</h5>' + it.q.e + '</div></div>';
    });

    h += '<button class="primary" id="test-again">🚀 Build Another Test</button>';

    $('#test-run').classList.add('hidden');
    var box = $('#test-result');
    box.innerHTML = h;
    box.classList.remove('hidden');
    var resetToSetup = function () {
      box.classList.add('hidden');
      $('#test-setup').classList.remove('hidden');
    };
    $('#test-again').addEventListener('click', resetToSetup);
    $('#test-again-top').addEventListener('click', resetToSetup);
    box.scrollIntoView({ block: 'start' });
  }

  /* ---------------- Exam Plan ---------------- */
  function renderPlan() {
    var totalQs = UNITS.reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
    var p4Qs = UNITS.filter(function (u) { return u.paper.indexOf('Paper IV') === 0; })
                    .reduce(function (n, u) { return n + (u.questions || []).length; }, 0);
    var p3gfQs = UNITS.filter(function (u) { return u.paper.indexOf('Paper III — General Forensic') === 0; })
                      .reduce(function (n, u) { return n + (u.questions || []).length; }, 0);

    $('#plan-content').innerHTML =
      '<div class="unit-hero">' +
        '<div class="crumb">Official — Approved Syllabus PDF, 23 pp. &middot; Adv. No. 18 of 2026-27</div>' +
        '<h1>🗺️ MPSC JSO (Cyber Forensic) — Exam Strategy &amp; Architecture</h1>' +
        '<p>Direct Recruitment for <b>Junior Scientific Officer (Cyber Forensic)</b>, Directorate of Forensic Science Laboratory, Home Department, Government of Mizoram &mdash; <b>1 post</b>.</p>' +
        '<div class="hero-badges">' +
          '<span class="h-badge accent">Total Written: 600 Marks + 75 Interview = 675</span>' +
          '<span class="h-badge ok">Paper IV Cyber Bank: ' + p4Qs + ' MCQs</span>' +
          '<span class="h-badge ok">Paper III Forensic Bank: ' + p3gfQs + ' MCQs</span>' +
          '<span class="h-badge">Total Loaded Pool: ' + totalQs + ' MCQs across ' + UNITS.length + ' units</span>' +
        '</div>' +
      '</div>' +

      '<section class="note-card">' +
        '<div class="note-card-head"><span class="note-num">01</span><h3>Complete 675-Mark Breakdown</h3></div>' +
        '<table><tr><th>Paper</th><th>Content &amp; Unit Weight</th><th>Marks</th><th>Time</th><th>Scope</th></tr>' +
        '<tr><td><b>Paper I</b></td><td>General English &mdash; Pr&eacute;cis 10, Letter 10, Comprehension 10, Essay 10 (<b>40m Written</b>); Parts of Speech 20, Usage &amp; Vocabulary 20, Sentence Formation 20 (<b>60m MCQ</b>)</td><td><b>100</b></td><td>3 h</td><td>Common</td></tr>' +
        '<tr><td><b>Paper II</b></td><td>General Knowledge &mdash; Current Events 12, History 12, Geography 12, Polity 12, Economy 12, Environment 12, General Science 12, <b>Mizo Culture &amp; Heritage 16</b></td><td><b>100</b></td><td>2 h</td><td>Common</td></tr>' +
        '<tr><td><b>Paper III</b></td><td><b>Part A — General Science (100m):</b> Physics 34, Chemistry 36, Biology <i>or</i> Mathematics 30<br><b>Part B — General Forensic (100m):</b> 10 Topics &times; 10 marks each (Chemistry, Fingerprints, Ballistics, Documents, DNA, Toxicology, Photography, Cyber Forensic, Crime Scene, Forensic Law)</td><td><b>200</b></td><td>2 h</td><td><b>Common</b></td></tr>' +
        '<tr><td><b>Paper IV</b></td><td><b>Cyber Forensic Specialist Paper (200m):</b><br>&bull; Unit I: Computer Fundamentals, OS &amp; File Systems (40m)<br>&bull; Unit II: Database Management Systems &amp; SQLite (40m)<br>&bull; Unit III: Digital Forensics &amp; Computer Forensics (40m)<br>&bull; Unit IV: Multimedia Forensics — Image, Video &amp; Audio (40m)<br>&bull; Unit V: Mobile Forensics — Android, iOS, SIM, JTAG/Chip-off (40m)</td><td><b>200</b></td><td>2 h</td><td><b>Division</b></td></tr>' +
        '<tr><td><b>Interview</b></td><td>Personal Interview</td><td><b>75</b></td><td>&mdash;</td><td>&mdash;</td></tr>' +
        '<tr><th>Total</th><th></th><th>675</th><th></th><th></th></tr></table>' +
      '</section>' +

      '<section class="note-card">' +
        '<div class="note-card-head"><span class="note-num">02</span><h3>Strategic Insights — Where the Marks Are Won</h3></div>' +
        '<div class="tip"><b>⚠️ Critical Insight — Paper III is common to all FSL divisions.</b> You sit the exact same 200-mark Paper III as the DNA, Ballistics, Toxicology and Questioned Documents candidates. Within its General Forensic half, Cyber Forensic is worth 10 marks — the other 90 marks cover ballistics, toxicology, serology/DNA, fingerprints, questioned documents, photography, crime scene investigation and law.</div>' +
        '<ul>' +
          '<li><b>400 of the 600 written marks are Technical</b> (Papers III + IV). Mastering Paper IV (200m) + Paper III General Forensic (100m) + Paper III Maths/Science (100m) gives you an insurmountable lead.</li>' +
          '<li><b>How the 5 Units of Paper IV Connect:</b>' +
            '<ul>' +
              '<li><b>Unit I (OS &amp; File Systems)</b> teaches <em>how</em> bytes, endianness, paging/swap, MFT, inodes and slack space work.</li>' +
              '<li><b>Unit III (Digital Forensics)</b> applies Unit I to recover deleted files, carve unallocated clusters, dump RAM/pagefiles, and detect timestomping.</li>' +
              '<li><b>Unit II (DBMS &amp; SQLite)</b> teaches relational databases, WAL recovery, Unix/Apple epochs, and SQLite free pages.</li>' +
              '<li><b>Unit V (Mobile Forensics)</b> applies Unit II + III to smartphones — extracting <code>msgstore.db</code>, <code>mmssms.db</code>, <code>-wal</code> logs, Plists, and decrypting AFU vs BFU states.</li>' +
              '<li><b>Unit IV (Multimedia Forensics)</b> covers the signal-processing side — Nyquist sampling, FFT/DCT, PRNU sensor fingerprints, ELA/double-JPEG, video GOPs, and audio ENF/formants.</li>' +
            '</ul>' +
          '</li>' +
        '</ul>' +
      '</section>';
  }

  /* ---------------- Init ---------------- */
  buildTree();
  buildUnitPicker();
  updateReviewBadge();
  renderPlan();
  if (UNITS.length) {
    // Default to Paper IV Unit I (Computer Fundamentals) or first item in tree
    var p4Idx = -1;
    for (var k = 0; k < UNITS.length; k++) {
      if (UNITS[k].id === 'p4u1') { p4Idx = k; break; }
    }
    if (p4Idx !== -1) {
      renderUnit(UNITS[p4Idx]);
      buildTree();
    } else {
      var first = $('.tree-item');
      if (first) { first.classList.add('is-active'); renderUnit(UNITS[+first.dataset.idx]); }
    }
  }
}());
