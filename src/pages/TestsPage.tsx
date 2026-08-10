import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as api from '@/lib/mpscApi';
import type { TestDefinition, MockAttemptRecord } from '@/lib/mpscApi';
import type { McqBankQuestion } from '@/data/banks/types';
import { hasCap, useAuthStore } from '@/lib/authStore';
import { TestCard } from '@/modules/mpsc/TestCard';
import { TestBuilder, type PlayConfig } from '@/modules/mpsc/TestBuilder';
import { TestPlayer } from '@/modules/mpsc/TestPlayer';
import { loadPaper, savePaper } from '@/modules/mpsc/useAttemptState';

// ============================================
// Tests — the Jabreeze "Mock Tests" pane (designs/Jabreeze - Redesign.dc.html,
// `isMock` block, lines 443-520): a "Test library" grid of <TestCard/>s over a
// two-column row of "Build a custom test" + "Recent attempts".
//
// Everything here is real, and the honest state today is: zero published
// TestDefinitions exist server-side (`GET /api/tests/` returns []), so the
// library grid renders its empty state rather than the six sample cards the
// static mockup shows. The build panel and attempts list below it are the
// live, usable half of the screen — a learner with no admin rights can still
// sample any filter and play it now.
//
// Start samples the TestDefinition's stored filter live — the definition holds
// a filter, not a frozen question list, so the same test draws from whatever
// the bank contains today.
// ============================================

const activeCls = 'h-full overflow-y-auto scroll-panel';

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function scoreColor(score: number): string {
  if (score >= 60) return 'var(--ok)';
  if (score >= 45) return 'var(--warn)';
  return 'var(--bad)';
}

function SectionHeader({ label, tagline }: { label: string; tagline: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-3">
      <span className="text-[11px] uppercase tracking-[0.05em] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{tagline}</span>
    </div>
  );
}

function AttemptsPanel() {
  const [attempts, setAttempts] = useState<MockAttemptRecord[] | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { setAttempts([]); return; }
    api.getHistory().then((r) => setAttempts(r.attempts)).catch(() => setAttempts([]));
  }, [user]);

  return (
    <div className="rounded-xl p-[18px_20px]" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="text-[15px] font-semibold mb-3.5" style={{ color: 'var(--text-primary)' }}>Recent attempts</div>
      {attempts === null && <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</div>}
      {attempts !== null && attempts.length === 0 && (
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {user ? 'No attempts yet — finish a test and it lands here.' : 'Sign in to keep a history of your attempts across devices.'}
        </div>
      )}
      {attempts && attempts.length > 0 && (
        <div className="flex flex-col">
          {attempts.map((a) => (
            <div
              key={a.id}
              className="grid items-center gap-2.5 py-[9px]"
              style={{ gridTemplateColumns: 'minmax(0, 1fr) 52px 64px 44px', borderBottom: '1px solid var(--border)' }}
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{a.testLabel}</span>
                <span className="block text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtWhen(a.takenAt)}</span>
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{a.total} Q</span>
              <span className="h-1.5 rounded-full overflow-hidden block" style={{ background: 'var(--bg-panel-elev)' }}>
                <span className="block h-full" style={{ width: `${a.score}%`, background: scoreColor(a.score) }} />
              </span>
              <span className="text-xs font-mono font-semibold text-right" style={{ color: scoreColor(a.score) }}>{a.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TestsPage() {
  const { user } = useAuthStore();
  const canAuthor = hasCap(user, 'test.publish');
  const [tests, setTests] = useState<TestDefinition[] | null>(null);
  const [active, setActive] = useState<{ title: string; targetId: string; questions: McqBankQuestion[]; durationS: number; negative: number } | null>(null);
  const [launching, setLaunching] = useState<number | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const takeId = searchParams.get('take');
  /**
   * The sitting the candidate deliberately left. `setActive(null)` and the
   * `?take` removal are not applied in the same commit, so without this the
   * resume effect below sees `active === null` while `takeId` is still set
   * and immediately re-enters the player — Exit would do nothing.
   */
  const exitedRef = useRef<string | null>(null);

  const reload = () => {
    const fetcher = canAuthor ? api.getAdminTests() : api.getTests();
    fetcher.then((r) => setTests(r.tests)).catch(() => setTests([]));
  };

  useEffect(reload, [canAuthor]);

  const togglePublish = async (t: TestDefinition) => {
    await api.updateTest(t.id, { isPublished: !t.isPublished });
    reload();
  };

  const remove = async (t: TestDefinition) => {
    await api.deleteTest(t.id);
    reload();
  };

  const start = async (t: TestDefinition) => {
    setLaunching(t.id);
    setLaunchError(null);
    try {
      const targetId = `testdef-${t.id}`;
      // A sitting already in progress resumes with its own paper — never
      // re-sample, or the saved answers would point at different questions.
      const saved = loadPaper<McqBankQuestion>(targetId);
      const questions = saved ?? (await api.sampleBankQuestions(t.filter, t.nQuestions)).questions;
      if (questions.length === 0) {
        setLaunchError(`"${t.title}" matched no questions — its filter may be too narrow for the current bank.`);
        return;
      }
      if (!saved) savePaper(targetId, questions);
      exitedRef.current = null;
      setActive({ title: t.title, targetId, questions, durationS: t.durationS, negative: t.negative });
      // Put the sitting in the URL so a refresh re-enters the player rather
      // than dumping the candidate back on the list mid-test.
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('take', String(t.id));
        return next;
      });
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : 'Could not load this test');
    } finally {
      setLaunching(null);
    }
  };

  // Learner build path: sample the filter and play it now, no persistence.
  const play = async (cfg: PlayConfig) => {
    setLaunchError(null);
    try {
      const { questions } = await api.sampleBankQuestions(cfg.filter, cfg.nQuestions);
      if (questions.length === 0) {
        setLaunchError('That filter matched no questions — widen it and try again.');
        return;
      }
      const targetId = `adhoc-${Date.now()}`;
      savePaper(targetId, questions);
      exitedRef.current = null;
      setActive({ title: cfg.title, targetId, questions, durationS: cfg.durationS, negative: cfg.negative });
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : 'Could not build that test');
    }
  };

  const exitPlayer = () => {
    if (active) exitedRef.current = active.targetId;
    setActive(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('take');
      return next;
    });
  };

  // Re-enter the player after a reload: `?take=<id>` plus a locally stored
  // paper is enough to rebuild the sitting with no network at all.
  useEffect(() => {
    if (active || !takeId || tests === null) return;
    const targetId = `testdef-${takeId}`;
    if (exitedRef.current === targetId) return;
    const t = tests.find((x) => String(x.id) === takeId);
    if (!t) return;
    const saved = loadPaper<McqBankQuestion>(targetId);
    if (saved) setActive({ title: t.title, targetId, questions: saved, durationS: t.durationS, negative: t.negative });
  }, [active, takeId, tests]);

  if (active) {
    return (
      <TestPlayer
        title={active.title}
        targetId={active.targetId}
        questions={active.questions}
        durationS={active.durationS}
        negative={active.negative}
        onExit={exitPlayer}
      />
    );
  }

  return (
    <div className={activeCls}>
      <div className="max-w-[1180px] mx-auto px-6 py-[22px] flex flex-col gap-6">
        {launchError && (
          <div className="text-sm rounded-lg p-4" style={{ background: 'color-mix(in srgb, var(--bad) 12%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--bad)' }}>
            {launchError}{' '}
            <button type="button" onClick={() => setLaunchError(null)} className="underline">Dismiss</button>
          </div>
        )}

        <section>
          <SectionHeader label="Test library" tagline="Every real paper is one test; every filter can become one" />
          {tests === null && <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</div>}
          {tests !== null && tests.length === 0 && (
            <div
              className="rounded-xl p-5 text-sm"
              style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              No published tests yet. Build one from any filter below, or open a real paper from{' '}
              <Link to="/papers" className="underline" style={{ color: 'var(--accent)' }}>Papers</Link> and hit Test.
            </div>
          )}
          {tests !== null && tests.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tests.map((t) => (
                <div key={t.id} className="flex flex-col gap-1.5">
                  <TestCard test={t} onStart={start} busy={launching === t.id} />
                  {canAuthor && (
                    <div className="flex items-center gap-2 text-xs px-1" style={{ color: 'var(--text-secondary)' }}>
                      <span>{t.isPublished ? 'Published' : 'Draft'}</span>
                      <button type="button" onClick={() => togglePublish(t)} className="underline">
                        {t.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button type="button" onClick={() => remove(t)} className="underline" style={{ color: 'var(--bad)' }}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {canAuthor
            ? <TestBuilder onCreated={reload} />
            : <TestBuilder onPlay={play} />}
          <AttemptsPanel />
        </div>
      </div>
    </div>
  );
}
