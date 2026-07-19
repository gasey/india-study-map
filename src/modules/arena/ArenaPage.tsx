import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp, type ArenaUpgrades } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { GauntletEngine, type Hud } from './engine';
import { coinsFor, pickGateQuestion, pickReviveQuestion, type PickedQuestion } from './questions';
import './arena.css';

// ============================================
// GAUNTLET RUN — the MCQ-gated dodge runner.
//
// Progression is knowledge-locked by design:
//  - score = metres x multiplier; the multiplier ONLY rises on
//    correct gate answers (engine.resolveGate)
//  - coins ONLY come from correct answers (coinsFor)
//  - every answer is recorded via recordBankAttempt, so the
//    PYQ mastery stats and study streak count game answers too
// ============================================

type Phase = 'menu' | 'run' | 'over';
type Ask = { kind: 'gate' | 'revive'; picked: PickedQuestion; deadline: number; total: number } | null;

const UPGRADES: {
  key: keyof ArenaUpgrades;
  name: string;
  glyph: string;
  desc: string;
  costs: number[];
}[] = [
  { key: 'shield', name: 'Shield', glyph: '🛡️', desc: 'Start each run absorbing +1 hit', costs: [150, 400, 900] },
  { key: 'revive', name: 'Second Wind', glyph: '💫', desc: '+1 revive question per run', costs: [250, 650] },
  { key: 'focus', name: 'Focus', glyph: '⏱️', desc: '+4s on every answer timer', costs: [120, 300, 700] },
  { key: 'boost', name: 'Boost', glyph: '🚀', desc: 'Start at +0.25 score multiplier', costs: [180, 450, 1000] },
];

const OPT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ArenaPage() {
  const {
    theme, toggleTheme,
    arena, arenaFinishRun, arenaBuyUpgrade,
    bankProgress, recordBankAttempt,
  } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');

  const [phase, setPhase] = useState<Phase>('menu');
  const [hud, setHud] = useState<Hud>({ metres: 0, score: 0, multiplier: 1, tier: 1, shields: 0, streak: 0 });
  const [ask, setAsk] = useState<Ask>(null);
  const [chosen, setChosen] = useState<number | null>(null); // display index picked
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState({ score: 0, metres: 0, coins: 0, answered: 0, correct: 0, streak: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GauntletEngine | null>(null);
  // per-run tallies live in refs — they change every answer without re-rendering the canvas
  const run = useRef({ coins: 0, answered: 0, correct: 0, maxStreak: 0, revivesLeft: 1, used: new Set<string>() });
  const timerRef = useRef<number>(0);

  const answerSeconds = useCallback(
    (kind: 'gate' | 'revive') => (kind === 'gate' ? 18 : 12) + arena.upgrades.focus * 4,
    [arena.upgrades.focus],
  );

  // ---------- run lifecycle ----------

  const startRun = useCallback(() => {
    run.current = { coins: 0, answered: 0, correct: 0, maxStreak: 0, revivesLeft: 1 + arena.upgrades.revive, used: new Set() };
    setAsk(null);
    setChosen(null);
    setPhase('run');
  }, [arena.upgrades.revive]);

  const finishRun = useCallback(() => {
    const eng = engineRef.current;
    const r = eng ? eng.getResult() : { score: 0, metres: 0 };
    eng?.endRun();
    const out = {
      score: r.score,
      metres: r.metres,
      coins: run.current.coins,
      answered: run.current.answered,
      correct: run.current.correct,
      streak: run.current.maxStreak,
    };
    setResult(out);
    arenaFinishRun(out);
    setPhase('over');
    setAsk(null);
  }, [arenaFinishRun]);

  // Build/destroy the engine with the run phase.
  useEffect(() => {
    if (phase !== 'run') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const eng = new GauntletEngine(
      canvas,
      {
        startShields: arena.upgrades.shield,
        startMultiplier: 1 + arena.upgrades.boost * 0.25,
      },
      {
        onHud: (h) => {
          run.current.maxStreak = Math.max(run.current.maxStreak, h.streak);
          setHud(h);
        },
        onGate: (tier) => {
          const picked = pickGateQuestion(tier, run.current.used, bankProgress);
          run.current.used.add(picked.q.id);
          const total = answerSeconds('gate');
          setChosen(null);
          setAsk({ kind: 'gate', picked, deadline: Date.now() + total * 1000, total });
        },
        onDeath: () => {
          if (run.current.revivesLeft > 0) {
            const picked = pickReviveQuestion(run.current.used, bankProgress);
            run.current.used.add(picked.q.id);
            const total = answerSeconds('revive');
            setChosen(null);
            setAsk({ kind: 'revive', picked, deadline: Date.now() + total * 1000, total });
          } else {
            finishRun();
          }
        },
      },
    );
    engineRef.current = eng;
    eng.start();
    const ro = new ResizeObserver(() => eng.resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      eng.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Repaint the engine palette when the theme flips mid-run.
  useEffect(() => {
    engineRef.current?.refreshTheme();
  }, [theme]);

  // ---------- question timing ----------

  useEffect(() => {
    if (!ask || chosen !== null) return;
    const tick = () => {
      const left = Math.max(0, (ask.deadline - Date.now()) / 1000);
      setTimeLeft(left);
      if (left <= 0) answer(-1); // timeout = wrong
    };
    tick();
    timerRef.current = window.setInterval(tick, 100);
    return () => window.clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask, chosen]);

  const answer = useCallback((displayIdx: number) => {
    if (!ask || chosen !== null) return;
    window.clearInterval(timerRef.current);
    const correct = displayIdx === ask.picked.answerAt;
    setChosen(displayIdx === -1 ? -1 : displayIdx);
    run.current.answered += 1;
    if (correct) {
      run.current.correct += 1;
      const streakNow = ask.kind === 'gate' ? (engineRef.current?.streak ?? 0) : 0;
      run.current.coins += coinsFor(ask.picked.q.difficulty, streakNow);
    }
    recordBankAttempt(ask.picked.bankId, ask.picked.q.id, correct);
  }, [ask, chosen, recordBankAttempt]);

  const proceed = useCallback(() => {
    if (!ask || chosen === null) return;
    const correct = chosen === ask.picked.answerAt;
    if (ask.kind === 'gate') {
      engineRef.current?.resolveGate(correct);
      setAsk(null);
    } else if (correct) {
      run.current.revivesLeft -= 1;
      engineRef.current?.revive();
      setAsk(null);
    } else {
      finishRun();
    }
  }, [ask, chosen, finishRun]);

  // Enter advances past the explanation.
  useEffect(() => {
    if (chosen === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') proceed(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chosen, proceed]);

  // ---------- derived ----------

  const accuracy = useMemo(
    () => (arena.answered > 0 ? Math.round((arena.correct / arena.answered) * 100) : null),
    [arena.answered, arena.correct],
  );

  // ---------- render ----------

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Gauntlet Run</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            🪙 {arena.coins}
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            Best {arena.highScore.toLocaleString()}
          </span>
          <button
            onClick={toggleTheme}
            className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
            style={{ border: '1px solid var(--border)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {phase === 'menu' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 py-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🏃</div>
              <h1 className="text-2xl font-bold mb-1">Gauntlet Run</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Dodge is survival. <b>Answers are progress.</b> Every gate asks an MCQ — correct opens it,
                raises your speed tier and score multiplier. Wrong counts as a crash. Coins come only from
                correct answers, and every answer counts toward your PYQ mastery.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              {[
                { label: 'High score', value: arena.highScore.toLocaleString() },
                { label: 'Best streak', value: `${arena.bestStreak}✓` },
                { label: 'Accuracy', value: accuracy === null ? '—' : `${accuracy}%` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startRun}
              className="w-full py-3.5 rounded-xl text-base font-semibold mb-8 transition-transform active:scale-[0.99]"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Start run
            </button>

            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Upgrade shop <span className="font-normal" style={{ color: 'var(--text-muted)' }}>— paid for in correct answers</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {UPGRADES.map((u) => {
                const level = arena.upgrades[u.key];
                const maxed = level >= u.costs.length;
                const cost = maxed ? 0 : u.costs[level];
                const afford = !maxed && arena.coins >= cost;
                return (
                  <div key={u.key} className="rounded-xl border p-4 flex flex-col gap-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{u.glyph} {u.name}</span>
                      <span className="flex gap-1">
                        {u.costs.map((_, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ background: i < level ? 'var(--accent)' : 'var(--border)' }}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.desc}</p>
                    <button
                      onClick={() => arenaBuyUpgrade(u.key, cost, u.costs.length)}
                      disabled={!afford}
                      className="mt-auto py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-45"
                      style={afford
                        ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                        : { border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                    >
                      {maxed ? 'Maxed' : `Buy — 🪙 ${cost}`}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] mt-6" style={{ color: 'var(--text-muted)' }}>
              Controls: ← → / A D on keyboard, or tap the left / right half of the track. Questions you miss
              come back sooner — the game quietly runs your revision queue.
            </p>
          </div>
        </div>
      )}

      {phase === 'run' && (
        <div className="flex-1 relative overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />

          {/* HUD */}
          <div className="absolute top-3 left-0 right-0 px-4 flex items-start justify-between pointer-events-none">
            <div className="rounded-lg px-3 py-1.5 text-xs font-medium border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)' }}>
              <span className="text-base font-bold">{hud.score.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)' }}> · {hud.metres}m</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="rounded-lg px-3 py-1.5 text-xs font-semibold border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                ×{hud.multiplier.toFixed(2)} · Tier {hud.tier}
              </div>
              <div className="rounded-lg px-3 py-1 text-[11px] border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {'🛡️'.repeat(Math.min(hud.shields, 4)) || '—'} · {hud.streak}✓ streak
              </div>
            </div>
          </div>

          {/* Question overlay — the signature moment: the run freezes, knowledge decides */}
          {ask && (
            <div className="arena-overlay">
              <div className={`arena-card p-5 ${chosen !== null && chosen !== ask.picked.answerAt ? 'arena-shake' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: ask.kind === 'gate' ? 'var(--accent)' : '#e35d6a' }}>
                    {ask.kind === 'gate' ? `Gate — Tier ${hud.tier} → ${hud.tier + 1}` : `Second wind — ${run.current.revivesLeft} left`}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {ask.picked.q.topicLabel} · {ask.picked.q.difficulty}
                  </span>
                </div>

                {chosen === null && (
                  <div className={`arena-timer mb-3 ${timeLeft < 5 ? 'low' : ''}`}>
                    <div style={{ width: `${(timeLeft / ask.total) * 100}%` }} />
                  </div>
                )}

                <p className="text-sm font-medium mb-3 leading-snug">{ask.picked.q.question}</p>

                <div className="flex flex-col gap-2">
                  {ask.picked.order.map((optIdx, displayIdx) => {
                    const cls =
                      chosen === null ? '' :
                      displayIdx === ask.picked.answerAt ? 'correct' :
                      displayIdx === chosen ? 'wrong' : '';
                    return (
                      <button
                        key={optIdx}
                        className={`arena-opt ${cls}`}
                        disabled={chosen !== null}
                        onClick={() => answer(displayIdx)}
                      >
                        <span className="font-semibold shrink-0" style={{ color: 'var(--text-muted)' }}>{OPT_LETTERS[displayIdx]}</span>
                        <span>{ask.picked.q.options[optIdx]}</span>
                      </button>
                    );
                  })}
                </div>

                {chosen !== null && (
                  <div className="mt-3">
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {chosen === ask.picked.answerAt
                        ? <b style={{ color: '#3fa66b' }}>Correct{ask.kind === 'gate' ? ' — gate open, tier up.' : ' — back in the run.'} </b>
                        : <b style={{ color: '#e35d6a' }}>{chosen === -1 ? 'Time up. ' : 'Wrong. '}</b>}
                      {ask.picked.q.explanation}
                    </p>
                    <button
                      onClick={proceed}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      {ask.kind === 'gate' || chosen === ask.picked.answerAt ? 'Continue (Enter)' : 'End run (Enter)'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'over' && (
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-sm text-center">
            <div className="text-4xl mb-2">{result.score >= arena.highScore && result.score > 0 ? '🏆' : '💥'}</div>
            <h2 className="text-xl font-bold mb-1">
              {result.score >= arena.highScore && result.score > 0 ? 'New high score!' : 'Run over'}
            </h2>
            <div className="text-3xl font-bold mb-4" style={{ color: 'var(--accent)' }}>{result.score.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              {[
                ['Distance', `${result.metres}m`],
                ['Coins earned', `🪙 ${result.coins}`],
                ['Answers', `${result.correct}/${result.answered}`],
                ['Best streak', `${result.streak}✓`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border py-2.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
                  <div className="font-semibold">{v}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{k}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={startRun}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Run again
              </button>
              <button
                onClick={() => setPhase('menu')}
                className="flex-1 py-3 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border)' }}
              >
                Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
