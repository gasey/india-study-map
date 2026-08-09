import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '@/lib/mpscApi';
import type { TestDefinition } from '@/lib/mpscApi';
import type { McqBankQuestion } from '@/data/banks/types';
import { hasCap, useAuthStore } from '@/lib/authStore';
import { TestCard } from '@/modules/mpsc/TestCard';
import { TestBuilder } from '@/modules/mpsc/TestBuilder';
import { TestPlayer } from '@/modules/mpsc/TestPlayer';
import { loadPaper, savePaper } from '@/modules/mpsc/useAttemptState';

// ============================================
// Tests — lists published TestDefinitions as <TestCard/>s; authors with the
// test.publish capability also get <TestBuilder/> plus the full (including
// unpublished) list with publish/delete controls.
//
// Start samples the TestDefinition's stored filter live — the definition
// holds a filter, not a frozen question list, so the same test draws from
// whatever the bank contains today.
// ============================================

export default function TestsPage() {
  const { user } = useAuthStore();
  const canAuthor = hasCap(user, 'test.publish');
  const [tests, setTests] = useState<TestDefinition[] | null>(null);
  const [active, setActive] = useState<{ test: TestDefinition; questions: McqBankQuestion[] } | null>(null);
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
      // A sitting already in progress resumes with its own paper — never
      // re-sample, or the saved answers would point at different questions.
      const saved = loadPaper<McqBankQuestion>(`testdef-${t.id}`);
      const questions = saved ?? (await api.sampleBankQuestions(t.filter, t.nQuestions)).questions;
      if (questions.length === 0) {
        setLaunchError(`"${t.title}" matched no questions — its filter may be too narrow for the current bank.`);
        return;
      }
      if (!saved) savePaper(`testdef-${t.id}`, questions);
      exitedRef.current = null;
      setActive({ test: t, questions });
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

  const exitPlayer = () => {
    if (active) exitedRef.current = String(active.test.id);
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
    if (exitedRef.current === takeId) return;
    const t = tests.find((x) => String(x.id) === takeId);
    if (!t) return;
    const saved = loadPaper<McqBankQuestion>(`testdef-${t.id}`);
    if (saved) setActive({ test: t, questions: saved });
  }, [active, takeId, tests]);

  if (active) {
    return (
      <TestPlayer
        title={active.test.title}
        targetId={`testdef-${active.test.id}`}
        questions={active.questions}
        durationS={active.test.durationS}
        negative={active.test.negative}
        onExit={exitPlayer}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[900px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Tests</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            A test is a saved filter, not a fixed question list — it grows as the bank grows.
          </p>
        </div>

        {launchError && (
          <div className="text-sm rounded-lg p-4" style={{ background: 'color-mix(in srgb, var(--bad) 12%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--bad)' }}>
            {launchError}{' '}
            <button type="button" onClick={() => setLaunchError(null)} className="underline">Dismiss</button>
          </div>
        )}

        {canAuthor && <TestBuilder onCreated={reload} />}

        {tests === null && <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</div>}
        {tests !== null && tests.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No tests yet.</div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {tests?.map((t) => (
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
      </div>
    </div>
  );
}
