import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, type StruggleType } from '@/lib/store';
import { pickSitWithItQuestion, getQuestionBankTitle } from '@/lib/mindsetQueue';
import type { McqBankQuestion } from '@/data/banks/types';

// ============================================
// /mindset — "Return to Peace" interactive practice.
//
// The companion static article lives at /study-mindset (public/, no store
// access). Everything here needs live app state — the question queue,
// attempt history, struggle-type log — so it's a real route, not a static
// embed. See DEVLOG + the plan file for the full design rationale.
// ============================================

type Tab = 'practice' | 'confusion-map' | 'week' | 'settings';

const TABS: { key: Tab; label: string }[] = [
  { key: 'practice', label: 'Practice' },
  { key: 'confusion-map', label: 'Confusion Map' },
  { key: 'week', label: 'This Week' },
  { key: 'settings', label: 'Settings' },
];

const STRUGGLE_OPTIONS: { key: StruggleType; label: string }[] = [
  { key: 'knowledge-gap', label: "I didn't know the concept" },
  { key: 'retrieval', label: "I knew it but couldn't recall it" },
  { key: 'concept-confusion', label: 'I confused two concepts' },
  { key: 'misread-question', label: 'I misunderstood the question' },
  { key: 'panicked', label: 'I panicked / rushed' },
  { key: 'guessed', label: 'I guessed' },
  { key: 'gave-up-early', label: 'I gave up too quickly' },
  { key: 'distracted', label: 'I was distracted' },
];

const STRUGGLE_LABEL: Record<StruggleType, string> = Object.fromEntries(
  STRUGGLE_OPTIONS.map((o) => [o.key, o.label])
) as Record<StruggleType, string>;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

function CalmButton({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-lg text-[13px] font-medium"
      style={
        primary
          ? { background: 'var(--accent)', color: 'var(--on-accent)' }
          : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
      }
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- Practice

type PracticeStep = 'intro' | 'timing' | 'struggle' | 'reflect' | 'done';

const STAGE_PROMPTS: { at: number; text: string }[] = [
  { at: 0, text: 'Write what you know.' },
  { at: 30, text: "What's one possibility?" },
  { at: 60, text: 'What concept might this connect to?' },
  { at: 90, text: 'Make your best attempt.' },
];

const DURATION = 120;

function TimerRing({ remaining }: { remaining: number }) {
  const pct = remaining / DURATION;
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke="var(--accent)" strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

function PracticeTab() {
  const progress = useApp((s) => s.progress);
  const bankProgress = useApp((s) => s.bankProgress);
  const recordSitWithIt = useApp((s) => s.recordSitWithIt);
  const recordReflection = useApp((s) => s.recordMindsetReflection);
  const lastReflectionDay = useApp((s) => s.mindset.lastReflectionDay);

  const [item, setItem] = useState<ReturnType<typeof pickSitWithItQuestion>>(null);
  const [step, setStep] = useState<PracticeStep>('intro');
  const [remaining, setRemaining] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [bailedEarly, setBailedEarly] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function begin() {
    const q = pickSitWithItQuestion(progress, bankProgress);
    setItem(q);
    setRemaining(DURATION);
    setUnlocked(false);
    setPicked(null);
    setCorrect(null);
    setBailedEarly(false);
    setStep('timing');
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }

  function submitAnswer() {
    if (!item || picked === null) return;
    const q = item.question as McqBankQuestion;
    stopTimer();
    setCorrect(picked === q.answerIndex);
    setUnlocked(true);
    setBailedEarly(remaining > 0);
    setStep('struggle');
  }

  function iStillDontKnow() {
    stopTimer();
    setPicked(null);
    setCorrect(null);
    setUnlocked(true);
    setBailedEarly(remaining > 0);
    setStep('struggle');
  }

  function finishStruggle(struggleType: StruggleType | null) {
    if (item) {
      recordSitWithIt({
        questionId: item.question.id,
        bankId: item.bankId,
        subject: item.subject,
        at: Date.now(),
        stayedFullDuration: !bailedEarly,
        struggleType,
        correct,
      });
    }
    const todayStr = new Date().toDateString();
    setStep(lastReflectionDay === todayStr ? 'done' : 'reflect');
  }

  if (step === 'intro') {
    return (
      <Card>
        <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Sit with one question</h2>
        <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Pick one real question from your own practice queue. Try it for two minutes before
          looking anything up. You don't need to know the answer yet — you need to give your
          own reasoning a real chance to run first.
        </p>
        <CalmButton onClick={begin} primary>Start</CalmButton>
      </Card>
    );
  }

  if (step === 'timing' && item) {
    const q = item.question as McqBankQuestion;
    const stage = [...STAGE_PROMPTS].reverse().find((s) => DURATION - remaining >= s.at) ?? STAGE_PROMPTS[0];
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            {getQuestionBankTitle(item.bankId)} · {q.topicLabel}
          </span>
          <div className="relative w-[100px] h-[100px] -my-2">
            <TimerRing remaining={remaining} />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[13px]" style={{ color: 'var(--text-primary)' }}>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
            </div>
          </div>
        </div>

        {q.passage && (
          <p className="text-[13px] leading-relaxed mb-3 p-3 rounded-lg" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
            {q.passage}
          </p>
        )}
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>{q.question}</p>

        <div className="flex flex-col gap-2 mb-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className="text-left px-3.5 py-2.5 rounded-lg text-[13.5px]"
              style={
                picked === i
                  ? { background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--text-primary)' }
                  : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
              }
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Don't look it up yet</div>
          <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{stage.text}</div>
        </div>

        <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <CalmButton onClick={submitAnswer} primary>Submit answer</CalmButton>
          <CalmButton onClick={iStillDontKnow}>I still don't know</CalmButton>
        </div>
      </Card>
    );
  }

  if (step === 'struggle' && item) {
    const q = item.question as McqBankQuestion;
    return (
      <Card>
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-panel-elev)' }}>
          <div
            className="text-[12px] font-medium mb-1.5"
            style={{ color: correct === true ? 'var(--ok, var(--accent))' : 'var(--text-secondary)' }}
          >
            {correct === true ? 'Correct.' : correct === false ? 'Not quite.' : "That's fine — here's the reasoning."}
          </div>
          <div className="text-[13.5px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            {picked !== null && q.answerIndex >= 0 ? q.options[q.answerIndex] : ''}
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
        </div>

        <h3 className="text-[14px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>What happened?</h3>
        <p className="text-[12.5px] mb-3" style={{ color: 'var(--text-muted)' }}>
          This isn't scored. It's just so you can see your own pattern over time.
        </p>
        <div className="flex flex-col gap-2 mb-3">
          {STRUGGLE_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => finishStruggle(o.key)}
              className="text-left px-3.5 py-2 rounded-lg text-[13px]"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button onClick={() => finishStruggle(null)} className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          {correct === true ? 'Just correct — skip' : 'Skip'}
        </button>
      </Card>
    );
  }

  if (step === 'reflect') {
    return <ReflectionForm onDone={() => setStep('done')} recordReflection={recordReflection} questionId={item?.question.id ?? null} />;
  }

  return (
    <Card>
      <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
        You stayed with something uncertain instead of running from it. That's the whole exercise.
      </p>
      <CalmButton onClick={() => setStep('intro')} primary>Try another question</CalmButton>
    </Card>
  );
}

function ReflectionForm({
  onDone,
  recordReflection,
  questionId,
}: {
  onDone: () => void;
  recordReflection: (r: { date: string; questionId: string | null; whatConfused: string; whatLearned: string; tryNextTime: string }) => void;
  questionId: string | null;
}) {
  const [whatConfused, setWhatConfused] = useState('');
  const [whatLearned, setWhatLearned] = useState('');
  const [tryNextTime, setTryNextTime] = useState('');

  function save() {
    recordReflection({ date: new Date().toDateString(), questionId, whatConfused, whatLearned, tryNextTime });
    onDone();
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Quick reflection</h3>
        <button onClick={onDone} className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Skip</button>
      </div>
      <p className="text-[12.5px] mb-4" style={{ color: 'var(--text-muted)' }}>Optional, ~60 seconds.</p>
      <div className="flex flex-col gap-3 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>What confused me?</span>
          <input value={whatConfused} onChange={(e) => setWhatConfused(e.target.value)} className="px-3 py-2 rounded-lg text-[13px]" style={inputStyle} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>What did I learn?</span>
          <input value={whatLearned} onChange={(e) => setWhatLearned(e.target.value)} className="px-3 py-2 rounded-lg text-[13px]" style={inputStyle} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>What will I try next time?</span>
          <input value={tryNextTime} onChange={(e) => setTryNextTime(e.target.value)} className="px-3 py-2 rounded-lg text-[13px]" style={inputStyle} />
        </label>
      </div>
      <CalmButton onClick={save} primary>Save</CalmButton>
    </Card>
  );
}

// ---------------------------------------------------------------- Confusion Map

type DateRange = '7' | '30' | '90' | 'all';

function ConfusionMapTab() {
  const log = useApp((s) => s.mindset.sitWithItLog);
  const [range, setRange] = useState<DateRange>('30');
  const [subject, setSubject] = useState<string>('all');

  const subjects = useMemo(() => Array.from(new Set(log.map((a) => a.subject))).sort(), [log]);

  const filtered = useMemo(() => {
    const cutoff = range === 'all' ? 0 : Date.now() - Number(range) * 24 * 60 * 60 * 1000;
    return log.filter((a) => a.at >= cutoff && (subject === 'all' || a.subject === subject) && a.struggleType);
  }, [log, range, subject]);

  const counts = useMemo(() => {
    const m = new Map<StruggleType, number>();
    for (const a of filtered) {
      if (!a.struggleType) continue;
      m.set(a.struggleType, (m.get(a.struggleType) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const max = counts[0]?.[1] ?? 1;

  return (
    <Card>
      <h2 className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>How you get stuck</h2>
      <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>
        My problem isn't necessarily intelligence. I have specific failure modes — and they're visible here.
      </p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {(['7', '30', '90', 'all'] as DateRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="px-3 py-1 rounded-full text-[11.5px]"
            style={
              range === r
                ? { background: 'var(--accent)', color: 'var(--on-accent)' }
                : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {r === 'all' ? 'All time' : `Last ${r}d`}
          </button>
        ))}
        {subjects.length > 1 && (
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-2.5 py-1 rounded-full text-[11.5px]"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {counts.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Once you've sat with a few questions, your pattern will show up here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {counts.map(([type, n]) => (
            <div key={type} className="grid gap-3 items-center" style={{ gridTemplateColumns: 'minmax(0,1fr) 44px' }}>
              <div>
                <div className="text-[12.5px] mb-1" style={{ color: 'var(--text-primary)' }}>{STRUGGLE_LABEL[type]}</div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(n / max) * 100}%`, background: 'var(--accent)' }} />
                </div>
              </div>
              <span className="font-mono text-[11px] text-right" style={{ color: 'var(--text-secondary)' }}>{n}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- This Week

function WeekTab() {
  const log = useApp((s) => s.mindset.sitWithItLog);
  const reflections = useApp((s) => s.mindset.reflections);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = log.filter((a) => a.at >= weekAgo);
  const staying = thisWeek.filter((a) => a.stayedFullDuration).length;

  const topicCounts = new Map<string, number>();
  for (const a of thisWeek) topicCounts.set(a.subject, (topicCounts.get(a.subject) ?? 0) + 1);
  const topTopic = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1])[0];

  const struggleCounts = new Map<StruggleType, number>();
  for (const a of thisWeek) if (a.struggleType) struggleCounts.set(a.struggleType, (struggleCounts.get(a.struggleType) ?? 0) + 1);
  const topStruggle = Array.from(struggleCounts.entries()).sort((a, b) => b[1] - a[1])[0];

  const weekReflections = reflections.filter((r) => new Date(r.date).getTime() >= weekAgo);

  if (thisWeek.length === 0) {
    return (
      <Card>
        <p className="text-[13.5px]" style={{ color: 'var(--text-muted)' }}>
          No Sit-With-It sessions yet this week — nothing to summarize, and that's fine.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Your learning week</h2>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{thisWeek.length}</div>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Questions attempted</div>
        </div>
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{staying}</div>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Times you stayed with uncertainty</div>
        </div>
      </div>
      {topStruggle && (
        <p className="text-[13.5px] mb-2" style={{ color: 'var(--text-secondary)' }}>
          Most common difficulty: <span style={{ color: 'var(--text-primary)' }}>{STRUGGLE_LABEL[topStruggle[0]]}</span>
        </p>
      )}
      {topTopic && (
        <p className="text-[13.5px] mb-4" style={{ color: 'var(--text-secondary)' }}>
          Most attempted subject: <span style={{ color: 'var(--text-primary)' }}>{topTopic[0]}</span>
        </p>
      )}
      {weekReflections.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {weekReflections.slice(0, 3).map((r, i) => (
            <div key={i} className="p-3 rounded-lg text-[12.5px]" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
              {r.whatLearned || r.whatConfused || r.tryNextTime}
            </div>
          ))}
        </div>
      )}
      <p className="text-[14px] leading-relaxed pt-3" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}>
        You don't need to eliminate confusion.<br />Look how much you've learned by staying with it.
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------- Settings

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function SettingsTab() {
  const mindset = useApp((s) => s.mindset);
  const setEnabled = useApp((s) => s.setMindsetEnabled);
  const setHour = useApp((s) => s.setMindsetPreferredHour);
  const setQuietDays = useApp((s) => s.setMindsetQuietDays);

  function toggleDay(d: number) {
    setQuietDays(mindset.quietDays.includes(d) ? mindset.quietDays.filter((x) => x !== d) : [...mindset.quietDays, d]);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Daily "Return to Learning" card</div>
          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Shows on Home, at most once a day.</div>
        </div>
        <button
          onClick={() => setEnabled(!mindset.enabled)}
          className="px-3 py-1.5 rounded-full text-[12px]"
          style={
            mindset.enabled
              ? { background: 'var(--accent)', color: 'var(--on-accent)' }
              : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
          }
        >
          {mindset.enabled ? 'On' : 'Off'}
        </button>
      </div>

      <label className="flex items-center justify-between mb-4">
        <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Show it no earlier than</span>
        <select
          value={mindset.preferredHour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="px-2.5 py-1.5 rounded-lg text-[13px]"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
          ))}
        </select>
      </label>

      <div>
        <span className="text-[13px] block mb-2" style={{ color: 'var(--text-secondary)' }}>Quiet days — never show on</span>
        <div className="flex gap-1.5 flex-wrap">
          {WEEKDAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => toggleDay(i)}
              className="w-9 h-9 rounded-full text-[11.5px]"
              style={
                mindset.quietDays.includes(i)
                  ? { background: 'var(--accent)', color: 'var(--on-accent)' }
                  : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {d[0]}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- Page

export default function MindsetPage() {
  const [tab, setTab] = useState<Tab>('practice');

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[640px] mx-auto px-6 py-8 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Return to Peace</h1>
          <p className="text-[13.5px]" style={{ color: 'var(--text-secondary)' }}>
            I do not need to eliminate confusion. I need to become comfortable thinking while confused.
          </p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-panel-elev)' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2 rounded-lg text-[12.5px] font-medium"
              style={
                tab === t.key
                  ? { background: 'var(--bg-panel)', color: 'var(--text-primary)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'practice' && <PracticeTab />}
        {tab === 'confusion-map' && <ConfusionMapTab />}
        {tab === 'week' && <WeekTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
