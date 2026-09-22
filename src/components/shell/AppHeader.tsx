import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleTabs, CollectibleSubTabs } from './CollectibleTabBar';
import { useApp } from '@/lib/store';
import { useVisibleModules } from '@/lib/access';
import { chapters } from '@/data';
import { studyStreak } from '@/lib/stats';
import * as api from '@/lib/mpscApi';
import type { BankQuestion } from '@/data/banks/types';
import type { ExamPaper } from '@/data/banks/types';
import type { StaticSet } from '@/lib/mpscApi';
import { IC, IconSvg } from './icons';
import { AdminNavMenu } from './AdminNavMenu';

/** Migrated from the old CommandBar's SearchBox, then widened to the real
 *  four-group ⌘K palette (Jump to / Questions / Papers / Library) once real
 *  data existed for all four — Phase 4 (server-side question search, GIN
 *  trigram index) and Phase 5a/5c (papers tree, static-sets registry) landed
 *  after this box's original "no unified data model yet" comment was
 *  written. Kept as an anchored dropdown under the header field rather than
 *  a new centred modal overlay — this one is proven working (⌘K focus,
 *  outside-click/Escape close) and a modal rewrite risks the exact
 *  `om-pop`-scale-vs-`translateX(-50%)` centring trap the handoff calls
 *  out; not worth the risk for the same end result. */
function SearchBox() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [questionHits, setQuestionHits] = useState<BankQuestion[]>([]);
  const [papers, setPapers] = useState<(ExamPaper & { questionCount: number })[] | null>(null);
  const [sets, setSets] = useState<StaticSet[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Papers/Library are small enough (1,750 papers, 13 sets) to fetch once
  // and filter client-side, same approach as the existing chapters/modules
  // groups — no need for a dedicated search endpoint on either.
  useEffect(() => {
    if (!open || papers) return;
    api.getBankPapers().then((r) => setPapers(r.papers)).catch(() => setPapers([]));
  }, [open, papers]);
  useEffect(() => {
    if (!open || sets) return;
    api.getStaticSets().then((r) => setSets(r.sets)).catch(() => setSets([]));
  }, [open, sets]);

  // Questions are 76K+ rows — server-side search only, debounced.
  useEffect(() => {
    const s = q.trim();
    if (s.length < 3) { setQuestionHits([]); return; }
    const t = window.setTimeout(() => {
      api.listBankQuestions({ search: s, limit: 5 }).then((r) => setQuestionHits(r.questions)).catch(() => setQuestionHits([]));
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  const visibleModules = useVisibleModules();

  const results = useMemo(() => {
    if (!q.trim()) return { chapters: [], modules: [], papers: [], sets: [] };
    const s = q.trim().toLowerCase();
    return {
      chapters: chapters.filter((c) => c.title.toLowerCase().includes(s)).slice(0, 5),
      modules: visibleModules.filter((m) => m.title.toLowerCase().includes(s)).slice(0, 5),
      papers: (papers ?? []).filter((p) => p.examName.toLowerCase().includes(s) || (p.post ?? '').toLowerCase().includes(s)).slice(0, 5),
      sets: (sets ?? []).filter((st) => st.title.toLowerCase().includes(s)).slice(0, 5),
    };
  }, [q, papers, sets, visibleModules]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQ('');
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-[420px]">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-1.5"
        style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}
      >
        <IconSvg size={14} d={IC.search} />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Jump to a chapter or module…"
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: 'var(--text-primary)' }}
        />
        <span className="text-[10px] rounded px-1 py-0.5" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>⌘K</span>
      </div>
      {open && q.trim() && (
        <div
          className="surface clb-flat absolute left-0 right-0 mt-1.5 rounded-lg shadow-lg z-[1200] overflow-hidden max-h-80 overflow-y-auto"
        >
          {results.chapters.length === 0 && results.modules.length === 0 && results.papers.length === 0 && results.sets.length === 0 && questionHits.length === 0 && (
            <div className="px-3 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>No matches</div>
          )}
          {results.chapters.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Jump to</div>
              {results.chapters.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { useApp.getState().setChapter(c.id); go('/map'); }}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
          {results.modules.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Modules</div>
              {results.modules.map((m) => (
                <button
                  key={m.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => go(m.kind === 'static' ? `/embed/${m.id}` : m.path)}
                >
                  {m.glyph} {m.title}
                </button>
              ))}
            </div>
          )}
          {questionHits.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Questions</div>
              {questionHits.map((qh) => (
                <button
                  key={qh.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors truncate"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => go(`/mpsc?tab=browser&search=${encodeURIComponent(q)}`)}
                >
                  <span className="block truncate">{qh.question}</span>
                  <span className="block text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{qh.subject} · {qh.id}</span>
                </button>
              ))}
            </div>
          )}
          {results.papers.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Papers</div>
              {results.papers.map((p) => (
                <button
                  key={p.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors truncate"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => go('/papers')}
                >
                  <span className="block truncate">{p.examName}{p.post ? ` · ${p.post}` : ''}</span>
                  <span className="block text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{p.year ?? 'undated'} · {p.questionCount} questions</span>
                </button>
              ))}
            </div>
          )}
          {results.sets.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Library</div>
              {results.sets.map((st) => (
                <button
                  key={st.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors truncate"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => go(st.route)}
                >
                  {st.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Tab {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface AppHeaderProps {
  kicker?: string;
  title: string;
  tabs?: Tab[];
}

/** Persistent kicker/title/search bar, present on every route above
 *  <Rail>+<main>. Module pages that own a local header (Study Map, PYQ,
 *  Flashcards, etc.) hide it at desktop widths (lg:hidden) now that every
 *  real route has a correct entry in AppShell.tsx's HEADER_BY_PATH — this
 *  used to stack a second, often-wrong-titled bar above theirs; fixed
 *  2026-08-09. A page whose local header carries real functional controls
 *  with no equivalent elsewhere (Study Map's basemap switcher, Chronicle's
 *  Canvas/Reading toggle, State Tax Officer's LoginPanel, Mind Maps' map
 *  selector) keeps that bar visible at desktop too, dropping only its
 *  now-redundant title text. */
export function AppHeader({ kicker, title, tabs }: AppHeaderProps) {
  const { progress, bankProgress, skin, toggleSkin } = useApp();
  const streak = studyStreak(progress, bankProgress);
  const collectible = skin === 'collectible';

  return (
    <header
      /* `app-header` is the other selector tokens.css's neon glass rule has
         always targeted without the class existing — see Rail.tsx. */
      /* Collectible's yellow band + ink rule come from collectible.css's
         `.app-header` rule; setting them inline would resolve var(--clb-*)
         before the theme attribute exists. See collectible.css. */
      className="app-header hidden lg:flex flex-col shrink-0 safe-top"
      style={collectible ? undefined : { borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
    >
      <div className={`flex items-center gap-4 px-6 ${collectible ? 'h-[62px]' : 'h-[54px]'}`}>
        {collectible ? (
          /* Frame 3e puts the mark and the four tabs where the kicker/title
             block normally sits, on one 62px band with the search and streak
             still on the right. The route title is dropped rather than
             squeezed in: the active tab and sub-tab already name the
             location, so a title would repeat them. */
          <>
            <Link to="/" aria-label="Home" className="clb-mark shrink-0 w-[30px] h-[30px] flex items-center justify-center">
              <div className="w-3 h-3 rotate-45" />
            </Link>
            <CollectibleTabs />
          </>
        ) : (
          <div className="min-w-0">
            {kicker && (
              <div
                className="text-[10px] font-mono uppercase tracking-[0.12em] truncate"
                style={{ color: 'var(--text-muted)' }}
              >
                {kicker}
              </div>
            )}
            <div className="text-[15px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{title}</div>
          </div>
        )}

        <div className="flex-1" />

        {streak > 0 && (
          <span
            className={collectible ? 'clb-chip shrink-0' : 'text-[11px] px-2.5 py-1 rounded-full shrink-0'}
            style={collectible ? undefined : { border: '1px solid var(--accent-soft)', color: 'var(--accent)' }}
          >
            {streak}-day streak
          </span>
        )}

        <SearchBox />

        {/* Account and the skin toggle live in the rail, which this skin
            hides — without these two, switching to Bright would strand you
            in it with no way back and no way to reach /account. */}
        {collectible && (
          <>
            {/* Admin's only desktop entry point was AdminNavMenu inside the
                rail, which this skin hides — it renders nothing for
                non-admins, so this costs nothing for everyone else. */}
            <AdminNavMenu placement="header" />
            <Link to="/account" aria-label="Account" className="clb-chip shrink-0" title="Account">
              <IconSvg d={IC.avatar} size={15} />
            </Link>
            <button
              onClick={toggleSkin}
              className="clb-chip shrink-0"
              title="Back to the default skin"
            >
              Default
            </button>
          </>
        )}
      </div>

      {collectible && <CollectibleSubTabs />}

      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 px-6 -mt-px">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              className="text-[13px] px-3 py-2 -mb-px border-b-2 transition-colors"
              style={{
                borderColor: t.active ? 'var(--accent)' : 'transparent',
                color: t.active ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: t.active ? 500 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
