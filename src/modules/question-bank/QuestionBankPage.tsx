import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { gkQuestions } from '@/data/jso-gk';

// ============================================
// QUESTION BANK — unified catalog + a live Current Affairs & GK practice
// panel pulled from the real mpsc-jso-prep Paper II data files. Additive:
// replaces nothing, every source it links to keeps working exactly as
// before (State Tax Officer stays the real native module it already is).
// ============================================

const ALL = 'all';
const ADMIN_UPLOADS_KEY = 'setu_admin_uploads';

const QUESTION_TYPES = ['MCQ', 'Match the Following', 'Fill in the Blank', 'True/False', 'Map Click', 'Descriptive'] as const;
const UPLOAD_SOURCES = ['MPSC JSO — Cyber Forensic', 'State Tax Officer', 'Labs', 'Quick Practice', 'New source'] as const;

interface AdminUpload {
  id: number;
  title: string;
  source: string;
  type: string;
  subject: string;
  count: string;
  notes: string;
  addedAt: string;
}

export function QuestionBankPage() {
  const { theme, toggleTheme } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Question Bank</span>
        </div>
        <button
          onClick={toggleTheme}
          className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
          style={{ border: '1px solid var(--border)' }}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto scroll-panel px-5 py-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <div className="text-[11px] tracking-wider uppercase font-medium mb-1.5" style={{ color: 'var(--accent)' }}>Unified catalog</div>
            <h1 className="text-2xl font-semibold mb-2">Question Bank</h1>
            <p className="text-sm max-w-[64ch]" style={{ color: 'var(--text-secondary)' }}>
              Every source in one place. When a shared question-bank DB ships, these become one queryable table
              instead of many separate files — for now, this page is a catalog plus a real, live practice panel.
            </p>
          </div>

          <CatalogRow />
          <GkPracticePanel />
          <AdminUploadSection />
        </div>
      </main>
    </div>
  );
}

function CatalogRow() {
  const cards = [
    { kicker: 'Vanilla JS app', title: 'MPSC JSO — Cyber Forensic', meta: '49 units · 543 questions', to: '/embed/jso' },
    { kicker: 'Native module', title: 'MPSC State Tax Officer', meta: 'Group B Gazetted — primers, question bank, mock tests, admin review', to: '/state-tax-officer' },
    { kicker: 'In-app modules, labs & quick sets', title: 'Practice ▾ menu', meta: 'PYQ, Flashcards, Gauntlet Run, MPSC Old Questions, Labs & one-offs', to: '/pyq' },
  ];
  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg p-4 flex flex-col gap-2" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>{c.kicker}</span>
            <span className="text-sm font-semibold">{c.title}</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.meta}</span>
            <Link
              to={c.to}
              className="mt-auto self-start px-3 py-1.5 rounded-md text-xs font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Browse →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function GkPracticePanel() {
  const [topic, setTopic] = useState(ALL);
  const [exam, setExam] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [showAnswers, setShowAnswers] = useState(false);

  const topics = useMemo(() => [...new Set(gkQuestions.map((q) => q.topic))].sort(), []);
  const exams = useMemo(() => [...new Set(gkQuestions.map((q) => q.examName))].sort(), []);
  const years = useMemo(() => [...new Set(gkQuestions.map((q) => q.year).filter((y): y is string => !!y))].sort().reverse(), []);

  const filtered = useMemo(
    () =>
      gkQuestions.filter(
        (q) => (topic === ALL || q.topic === topic) && (exam === ALL || q.examName === exam) && (year === ALL || q.year === year),
      ),
    [topic, exam, year],
  );
  const visible = filtered.slice(0, 40);

  const selectCls = 'px-2.5 py-1.5 rounded-md text-sm';
  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

  return (
    <div className="rounded-lg p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold mb-1">Current Affairs &amp; GK — practice from the bank</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Live from the real MPSC JSO Paper II data files (Current Events, History &amp; Geography, Polity &amp;
        Economy, Environment &amp; Science, Mizoram, and the key-verified past-paper set) — {gkQuestions.length}{' '}
        questions total.
      </p>

      <div className="flex flex-wrap gap-2 items-center mb-3">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={exam} onChange={(e) => setExam(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All exams</option>
          {exams.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button
          onClick={() => setShowAnswers((s) => !s)}
          className="px-2.5 py-1.5 rounded-md text-sm font-medium ml-auto"
          style={{ background: showAnswers ? 'var(--accent)' : 'var(--bg-panel-elev)', color: showAnswers ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)' }}
        >
          {showAnswers ? 'Hide answers' : 'Show answers'}
        </button>
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        Showing {visible.length} of {filtered.length} questions
      </p>

      <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
        {visible.map((q) => (
          <div key={q.id} className="pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              {q.topic} · {q.examName}{q.year ? `, ${q.year}` : ''}
            </div>
            <div className="text-sm font-medium mb-1.5">{q.q}</div>
            <div className="space-y-0.5">
              {q.options.map((opt, i) => (
                <div key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {String.fromCharCode(97 + i)}) {opt}
                </div>
              ))}
            </div>
            {showAnswers && (
              <div className="text-xs font-semibold mt-1.5" style={{ color: 'var(--accent)' }}>
                Answer: {q.options[q.answerIndex]}
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--text-secondary)' }}>No questions match these filters.</p>
        )}
      </div>
    </div>
  );
}

/** Client-only stub — uploads persist to this browser, not a shared DB.
 *  "Question type" is a local string union scoped to this form only; it is
 *  NOT wired into the real BankQuestion type (src/data/banks/types.ts stays
 *  'mcq' | 'descriptive' as shipped) since there's no backend yet to accept
 *  the other 4 types as real payloads. */
function AdminUploadSection() {
  const [uploads, setUploads] = useState<AdminUpload[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', source: UPLOAD_SOURCES[0] as string, type: QUESTION_TYPES[0] as string, subject: '', count: '', notes: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_UPLOADS_KEY);
      if (raw) setUploads(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const save = (list: AdminUpload[]) => {
    setUploads(list);
    try {
      localStorage.setItem(ADMIN_UPLOADS_KEY, JSON.stringify(list));
    } catch {
      // storage full/unavailable — the in-memory list still reflects the change
    }
  };

  const submit = () => {
    if (!form.title.trim()) return;
    const entry: AdminUpload = {
      id: Date.now(),
      title: form.title,
      source: form.source,
      type: form.type,
      subject: form.subject || 'General',
      count: form.count || '0',
      notes: form.notes,
      addedAt: new Date().toLocaleDateString(),
    };
    save([entry, ...uploads]);
    setForm({ title: '', source: UPLOAD_SOURCES[0], type: QUESTION_TYPES[0], subject: '', count: '', notes: '' });
    setOpen(false);
  };

  const remove = (id: number) => save(uploads.filter((u) => u.id !== id));

  const inputCls = 'px-2.5 py-1.5 rounded-md text-sm w-full';
  const inputStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

  return (
    <div className="rounded-lg p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold">Admin — add a question set</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Prototype only: uploads save to this browser, not a shared DB yet.
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
          {open ? 'Cancel' : '+ Upload question set'}
        </button>
      </div>

      {open && (
        <div className="space-y-2.5 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. JAO Paper 1 — Grammar drill" className={inputCls} style={inputStyle} />
          <div className="flex gap-2">
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputCls} style={inputStyle}>
              {UPLOAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} style={inputStyle}>
              {QUESTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject, e.g. Grammar" className={inputCls} style={inputStyle} />
            <input value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} placeholder="# Questions" type="number" className={inputCls} style={{ ...inputStyle, maxWidth: 140 }} />
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Where this came from, source paper, etc." rows={2} className={inputCls} style={inputStyle} />
          <button onClick={submit} className="px-3 py-1.5 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>Save</button>
        </div>
      )}

      {uploads.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No admin uploads yet.</p>
      ) : (
        <div className="space-y-2">
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-sm font-medium">{u.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.source} · {u.type} · {u.subject} · {u.count} questions · added {u.addedAt}</div>
              </div>
              <button onClick={() => remove(u.id)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionBankPage;
