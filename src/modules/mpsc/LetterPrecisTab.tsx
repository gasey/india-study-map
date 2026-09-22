import { useMemo, useState } from 'react';
import {
  compressionMoves,
  conventionDrills,
  keepCutDrills,
  letterFormats,
  oneWordSubs,
  precisDrills,
  precisRules,
  titleDrills,
  wordyPhrases,
  workedPrecis,
  type LetterBlock,
  type LetterFormat,
} from '@/data/english/letter-precis';

// ============================================
// LETTER & PRÉCIS TAB
//
// Two halves, because they are two different kinds of memory:
//  - Letters  → *placement*. Which block, in what order. Drilled by
//               rebuilding a shuffled format from scratch, not by reading it.
//  - Précis   → *judgement*. What to cut and how to compress. Drilled as
//               multiple choice ("choose the correct shortening"), because
//               writing a full précis is slow and he asked specifically not
//               to have to write one every time.
//
// Drill results persist under their own key so nothing here touches the
// question-bank or review progress in the rest of the module.
// ============================================

const STORAGE_KEY = 'letter-precis-v1';

type Half = 'letters' | 'precis';

interface Progress {
  /** formatId → best result, as "mistakes in N blocks". */
  orderBest: Record<string, number>;
  /** drillId → was it answered correctly first time. */
  answered: Record<string, boolean>;
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Progress>;
      return { orderBest: p.orderBest ?? {}, answered: p.answered ?? {} };
    }
  } catch {
    // Corrupt or absent — a fresh start is the right fallback for study progress.
  }
  return { orderBest: {}, answered: {} };
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Private-browsing quota errors must not take the tab down.
  }
}

/** Fisher-Yates — a fresh scramble each time the drill is started. */
function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LetterPrecisTab() {
  const [half, setHalf] = useState<Half>('letters');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const record = (patch: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = patch(prev);
      saveProgress(next);
      return next;
    });
  };

  const markAnswered = (id: string, correct: boolean) =>
    record((p) => ({ ...p, answered: { ...p.answered, [id]: correct } }));

  const totalDrills = conventionDrills.length + precisDrills.length + keepCutDrills.length + titleDrills.length;
  const answeredCount = Object.keys(progress.answered).length;
  const correctCount = Object.values(progress.answered).filter(Boolean).length;

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold mb-1">Letter writing &amp; précis</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The two descriptive tasks that are pure format. A letter is worth 10–15 marks on MPSC's General English
          papers and a précis 14–15 — and in both, a large share of the marks is for putting known things in known
          places. Drill the placement until it is automatic, so the exam hour is spent on content.
        </p>
      </div>

      <div className="flex gap-2">
        {(['letters', 'precis'] as const).map((h) => (
          <button
            key={h}
            onClick={() => setHalf(h)}
            className="px-3 py-1.5 rounded-md text-sm"
            style={{
              background: half === h ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: half === h ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              fontWeight: half === h ? 600 : 400,
            }}
          >
            {h === 'letters' ? '✉️ Letter formats' : '✂️ Précis & shortening'}
          </button>
        ))}
        {answeredCount > 0 && (
          <span className="ml-auto self-center text-xs" style={{ color: 'var(--text-secondary)' }}>
            {correctCount}/{answeredCount} right · {totalDrills} drills available
            <button
              onClick={() => record(() => ({ orderBest: {}, answered: {} }))}
              className="ml-2 underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              reset
            </button>
          </span>
        )}
      </div>

      {half === 'letters' ? (
        <LettersHalf progress={progress} record={record} markAnswered={markAnswered} />
      ) : (
        <PrecisHalf answered={progress.answered} markAnswered={markAnswered} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LETTERS
// ---------------------------------------------------------------------------

function LettersHalf({
  progress,
  record,
  markAnswered,
}: {
  progress: Progress;
  record: (patch: (p: Progress) => Progress) => void;
  markAnswered: (id: string, correct: boolean) => void;
}) {
  const [formatId, setFormatId] = useState(letterFormats[0].id);
  const [mode, setMode] = useState<'study' | 'drill'>('study');
  const format = letterFormats.find((f) => f.id === formatId) ?? letterFormats[0];

  return (
    <div className="space-y-4">
      {/* Format picker */}
      <div className="flex flex-wrap gap-2">
        {letterFormats.map((f) => {
          const best = progress.orderBest[f.id];
          const active = f.id === formatId;
          return (
            <button
              key={f.id}
              onClick={() => setFormatId(f.id)}
              className="px-2.5 py-1.5 rounded-md text-xs text-left"
              style={{
                background: active ? 'var(--bg-panel-elev)' : 'transparent',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {f.glyph} {f.name}
              {best === 0 && <span className="ml-1" title="Rebuilt with no mistakes">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {(['study', 'drill'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="text-xs px-2.5 py-1 rounded"
            style={{
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {m === 'study' ? '📖 Study the format' : '🧩 Rebuild it from memory'}
          </button>
        ))}
      </div>

      {mode === 'study' ? (
        <FormatStudy format={format} />
      ) : (
        <FormatOrderDrill
          key={format.id}
          format={format}
          onFinish={(mistakes) =>
            record((p) => ({
              ...p,
              orderBest: {
                ...p.orderBest,
                [format.id]: Math.min(mistakes, p.orderBest[format.id] ?? Infinity),
              },
            }))
          }
        />
      )}

      <ConventionDrills answered={progress.answered} markAnswered={markAnswered} />
    </div>
  );
}

function alignBadge(b: LetterBlock) {
  return b.align === 'left' ? '◀ left margin' : b.align === 'right' ? 'right margin ▶' : '▲ centred';
}

function FormatStudy({ format }: { format: LetterFormat }) {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="space-y-4">
      <div className="sto-card space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sto-pill sto-subject sto-unit-english">{format.tone}</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{format.marks}</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{format.whenAsked}</p>
        <details>
          <summary className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>
            {format.realPrompts.length} real MPSC prompts of this type
          </summary>
          <ul className="mt-2 space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {format.realPrompts.map((p, i) => (
              <li key={i} className="pl-3" style={{ borderLeft: '2px solid var(--border)' }}>{p}</li>
            ))}
          </ul>
        </details>
      </div>

      {/* The skeleton, in order */}
      <div className="space-y-2">
        {format.blocks.map((b, i) => (
          <div key={b.id} className="sto-card">
            <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
              <span
                className="text-xs font-bold w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{b.label}</span>
              <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {alignBadge(b)}
              </span>
            </div>
            <pre
              className="text-xs whitespace-pre-wrap font-mono px-2.5 py-2 rounded mb-1.5 overflow-x-auto"
              style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-primary)' }}
            >
              {b.sample}
            </pre>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.note}</p>
          </div>
        ))}
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-1.5">Opening lines worth memorising</h4>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {format.openers.map((o, i) => <li key={i}>“{o}”</li>)}
        </ul>
        <h4 className="font-semibold text-sm mt-3 mb-1.5">Correct close for this type</h4>
        <div className="flex flex-wrap gap-1.5">
          {format.closes.map((c) => (
            <span key={c} className="sto-pill">{c}</span>
          ))}
        </div>
      </div>

      <div className="sto-traps">
        <ul className="text-xs">
          {format.mistakes.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div className="sto-card">
        <button
          onClick={() => setShowExample((v) => !v)}
          className="text-sm font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          {showExample ? '▾' : '▸'} Full worked example
        </button>
        {showExample && (
          <pre
            className="mt-3 text-xs whitespace-pre-wrap font-mono px-3 py-3 rounded overflow-x-auto"
            style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', lineHeight: 1.6 }}
          >
            {format.example}
          </pre>
        )}
      </div>
    </div>
  );
}

/**
 * The placement drill he asked for: the blocks arrive shuffled and have to be
 * clicked back into order. A wrong click is counted and the block flashes,
 * but it is not accepted — so the sequence you end up looking at is always
 * the correct one, never a wrong order you have just stared at for a minute.
 */
function FormatOrderDrill({ format, onFinish }: { format: LetterFormat; onFinish: (mistakes: number) => void }) {
  const [pool, setPool] = useState(() => shuffle(format.blocks));
  const [placed, setPlaced] = useState<LetterBlock[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const done = placed.length === format.blocks.length;

  const click = (b: LetterBlock) => {
    if (done) return;
    const expected = format.blocks[placed.length];
    if (b.id === expected.id) {
      setPlaced((p) => [...p, b]);
      setPool((p) => p.filter((x) => x.id !== b.id));
      setWrongId(null);
      if (placed.length + 1 === format.blocks.length) onFinish(mistakes);
    } else {
      setMistakes((m) => m + 1);
      setWrongId(b.id);
    }
  };

  const restart = () => {
    setPool(shuffle(format.blocks));
    setPlaced([]);
    setMistakes(0);
    setWrongId(null);
  };

  return (
    <div className="space-y-3">
      <div className="sto-card">
        <p className="text-sm mb-1">
          <strong>{format.glyph} {format.name}</strong> — click the blocks in the order they appear on the page,
          from the top of the sheet down.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {placed.length}/{format.blocks.length} placed · {mistakes} wrong {mistakes === 1 ? 'click' : 'clicks'}
          {done && (mistakes === 0 ? ' · clean run ✓' : ' · try again for a clean run')}
        </p>
      </div>

      {/* Placed, in order */}
      {placed.length > 0 && (
        <div className="space-y-1.5">
          {placed.map((b, i) => (
            <div
              key={b.id}
              className="px-3 py-2 rounded text-sm flex items-baseline gap-2"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
            >
              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
              <span className="font-medium">{b.label}</span>
              <span className="text-[0.65rem] ml-auto" style={{ color: 'var(--text-secondary)' }}>{alignBadge(b)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Remaining, shuffled */}
      {!done && (
        <div className="flex flex-wrap gap-2">
          {pool.map((b) => (
            <button
              key={b.id}
              onClick={() => click(b)}
              className="px-3 py-2 rounded text-sm text-left"
              style={{
                background: 'var(--bg-panel)',
                border: `1px solid ${wrongId === b.id ? '#a33232' : 'var(--border)'}`,
                color: wrongId === b.id ? '#a33232' : 'var(--text-primary)',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      {done && (
        <div className="sto-card space-y-2">
          <p className="text-sm font-semibold" style={{ color: mistakes === 0 ? '#2e7d4f' : 'var(--text-primary)' }}>
            {mistakes === 0
              ? 'Clean run — the whole skeleton from memory, in order.'
              : `Finished with ${mistakes} wrong ${mistakes === 1 ? 'click' : 'clicks'}.`}
          </p>
          <button
            onClick={restart}
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Shuffle and go again
          </button>
        </div>
      )}
    </div>
  );
}

/** Shared MCQ card — used by the convention, shortening and title drills. */
function DrillCard({
  id,
  prompt,
  sub,
  options,
  answer,
  explain,
  whyWrong,
  answered,
  markAnswered,
  monoOptions,
}: {
  id: string;
  prompt: string;
  sub?: string;
  options: string[];
  answer: number;
  explain: string;
  whyWrong?: string[];
  answered: Record<string, boolean>;
  markAnswered: (id: string, correct: boolean) => void;
  monoOptions?: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;
  const wasAnswered = id in answered;

  const pick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    if (!wasAnswered) markAnswered(id, i === answer);
  };

  return (
    <div className="sto-card space-y-2">
      {sub && (
        <div className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{sub}</div>
      )}
      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{prompt}</p>
      <div className="space-y-1.5">
        {options.map((o, i) => {
          const isAnswer = i === answer;
          const isPicked = i === picked;
          const border = !revealed
            ? 'var(--border)'
            : isAnswer
              ? '#2e7d4f'
              : isPicked
                ? '#a33232'
                : 'var(--border)';
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              className={`w-full text-left px-3 py-2 rounded text-sm ${monoOptions ? 'font-mono text-xs' : ''}`}
              style={{
                border: `1px solid ${border}`,
                background: revealed && isAnswer ? 'var(--bg-panel-elev)' : 'transparent',
                color: 'var(--text-primary)',
                opacity: revealed && !isAnswer && !isPicked ? 0.65 : 1,
                cursor: revealed ? 'default' : 'pointer',
              }}
            >
              <span className="font-bold mr-1.5" style={{ color: 'var(--text-secondary)' }}>
                {'ABCD'[i]}.
              </span>
              {o}
              {revealed && isAnswer && <span className="ml-1.5">✓</span>}
              {revealed && isPicked && !isAnswer && <span className="ml-1.5">✗</span>}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="space-y-2 pt-1">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{explain}</p>
          {whyWrong && picked !== answer && whyWrong[picked] && (
            <div className="sto-traps">
              <p className="text-xs">
                <strong>{'ABCD'[picked]}</strong> — {whyWrong[picked]}
              </p>
            </div>
          )}
          {whyWrong && picked === answer && (
            <details>
              <summary className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>
                Why the other three fail
              </summary>
              <ul className="mt-1.5 space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {whyWrong.map((w, i) =>
                  w ? (
                    <li key={i}>
                      <strong>{'ABCD'[i]}</strong> — {w}
                    </li>
                  ) : null
                )}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function ConventionDrills({
  answered,
  markAnswered,
}: {
  answered: Record<string, boolean>;
  markAnswered: (id: string, correct: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      <button onClick={() => setOpen((v) => !v)} className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
        {open ? '▾' : '▸'} Convention drill — {conventionDrills.length} questions on salutations, closes and which
        block belongs where
      </button>
      {open && (
        <div className="space-y-3">
          {conventionDrills.map((d) => (
            <DrillCard
              key={d.id}
              id={d.id}
              prompt={d.question}
              options={d.options}
              answer={d.answer}
              explain={d.explain}
              answered={answered}
              markAnswered={markAnswered}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PRÉCIS
// ---------------------------------------------------------------------------

type PrecisSection = 'rules' | 'worked' | 'moves' | 'phrases' | 'drill';

const PRECIS_SECTIONS: { id: PrecisSection; label: string }[] = [
  { id: 'rules', label: '📏 The rules' },
  { id: 'worked', label: '🔍 Worked example' },
  { id: 'moves', label: '✂️ How to shorten' },
  { id: 'phrases', label: '🔁 Phrase → word' },
  { id: 'drill', label: '🎯 Pick the right shortening' },
];

function PrecisHalf({
  answered,
  markAnswered,
}: {
  answered: Record<string, boolean>;
  markAnswered: (id: string, correct: boolean) => void;
}) {
  const [section, setSection] = useState<PrecisSection>('rules');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {PRECIS_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="px-2.5 py-1.5 rounded-md text-xs"
            style={{
              background: section === s.id ? 'var(--bg-panel-elev)' : 'transparent',
              border: `1px solid ${section === s.id ? 'var(--accent)' : 'var(--border)'}`,
              color: section === s.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: section === s.id ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'rules' && <PrecisRules />}
      {section === 'worked' && <WorkedExample />}
      {section === 'moves' && <CompressionMoves />}
      {section === 'phrases' && <PhraseTables />}
      {section === 'drill' && <ShorteningDrills answered={answered} markAnswered={markAnswered} />}
    </div>
  );
}

function PrecisRules() {
  return (
    <div className="space-y-2">
      {precisRules.map((r) => (
        <div key={r.id} className="sto-card">
          <h4 className="font-semibold text-sm mb-1">{r.rule}</h4>
          <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{r.detail}</p>
          {r.violation && (
            <p className="text-xs" style={{ color: '#a33232' }}>
              ✗ {r.violation}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function WorkedExample() {
  const [showPassage, setShowPassage] = useState(true);
  const w = workedPrecis;

  return (
    <div className="space-y-3">
      <div className="sto-card">
        <div className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
          Real paper
        </div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{w.source}</p>
        <p className="text-sm italic">“{w.instruction}”</p>
      </div>

      <div className="sto-card">
        <button
          onClick={() => setShowPassage((v) => !v)}
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {showPassage ? '▾' : '▸'} The passage — {w.passageWords} words
        </button>
        {showPassage && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{w.passage}</p>
        )}
        <p className="text-xs mt-2 pt-2" style={{ color: 'var(--text-primary)', borderTop: '1px solid var(--border)' }}>
          <strong>Target:</strong> {w.target}
        </p>
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-2">Step 1 — the points, in the passage's own order</h4>
        <ol className="text-xs space-y-1 list-decimal pl-4" style={{ color: 'var(--text-secondary)' }}>
          {w.points.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-2">Step 2 — what went, and why</h4>
        <div className="space-y-2.5">
          {w.cuts.map((c, i) => (
            <div key={i} className="pl-3" style={{ borderLeft: '2px solid #a33232' }}>
              <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-primary)' }}>{c.cut}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-2">Step 3 — what must survive</h4>
        <ul className="text-xs space-y-1.5 list-disc pl-4" style={{ color: 'var(--text-secondary)' }}>
          {w.keeps.map((k, i) => <li key={i}>{k}</li>)}
        </ul>
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-1">Step 4 — the précis</h4>
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          {w.precisWords} words, against a target of {w.passageWords} ÷ 3 ≈ 97 — inside tolerance, and the count is
          written at the end where the examiner can see it.
        </p>
        <div
          className="px-3 py-3 rounded text-sm"
          style={{ background: 'var(--bg-panel-elev)', lineHeight: 1.7 }}
        >
          <div className="font-semibold mb-1.5">{w.title}</div>
          {w.precis} <span style={{ color: 'var(--text-secondary)' }}>({w.precisWords} words)</span>
        </div>
      </div>

      <div className="sto-card">
        <h4 className="font-semibold text-sm mb-2">Step 5 — the title, and four that would not do</h4>
        <div className="space-y-1.5">
          <div className="text-xs">
            <span style={{ color: '#2e7d4f' }}>✓ {w.title}</span>
          </div>
          {w.titleRejects.map((t, i) => (
            <div key={i} className="text-xs">
              <span style={{ color: '#a33232' }}>✗ {t.title}</span>
              <span style={{ color: 'var(--text-secondary)' }}> — {t.why}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompressionMoves() {
  return (
    <div className="space-y-2">
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Eleven mechanical operations. Every one of them is a move you can apply without thinking about the passage's
        meaning — which is the point: under time, judgement is expensive and reflexes are free.
      </p>
      {compressionMoves.map((m) => (
        <div key={m.id} className="sto-card">
          <h4 className="font-semibold text-sm mb-0.5">{m.move}</h4>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{m.how}</p>
          <div className="space-y-1.5 text-xs">
            <div className="px-2.5 py-1.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
              <span className="font-bold mr-1.5" style={{ color: '#a33232' }}>before</span>
              {m.before}{' '}
              <span style={{ color: 'var(--text-secondary)' }}>({m.before.split(/\s+/).length} words)</span>
            </div>
            <div className="px-2.5 py-1.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
              <span className="font-bold mr-1.5" style={{ color: '#2e7d4f' }}>after</span>
              {m.after}{' '}
              <span style={{ color: 'var(--text-secondary)' }}>({m.after.split(/\s+/).length} words)</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhraseTables() {
  const [hide, setHide] = useState(false);

  const table = (title: string, rows: { long: string; short: string }[], leftHead: string) => (
    <div className="sto-card">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <div className="text-xs">
        <div
          className="grid gap-2 pb-1.5 mb-1.5 font-semibold"
          style={{ gridTemplateColumns: '2fr 1fr', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <div>{leftHead}</div>
          <div>write instead</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.long}
            className="grid gap-2 py-1"
            style={{ gridTemplateColumns: '2fr 1fr', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ color: 'var(--text-secondary)' }}>{r.long}</div>
            <div style={{ color: hide ? 'transparent' : 'var(--text-primary)', fontWeight: 600 }}>
              {hide ? '•••••' : r.short}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setHide((v) => !v)}
          className="text-xs px-2.5 py-1.5 rounded"
          style={{ background: hide ? 'var(--accent)' : 'transparent', color: hide ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          {hide ? '👁 Show answers' : '🙈 Hide answers — test yourself'}
        </button>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {wordyPhrases.length + oneWordSubs.length} substitutions
        </span>
      </div>
      {table('Wordy phrase → one word', wordyPhrases, 'instead of writing')}
      {table('Many words → one precise word', oneWordSubs, 'when the passage says')}
    </div>
  );
}

function ShorteningDrills({
  answered,
  markAnswered,
}: {
  answered: Record<string, boolean>;
  markAnswered: (id: string, correct: boolean) => void;
}) {
  const [kind, setKind] = useState<'shorten' | 'keepcut' | 'title'>('shorten');
  const [skill, setSkill] = useState('all');

  const skills = useMemo(() => ['all', ...Array.from(new Set(precisDrills.map((d) => d.skill)))], []);
  const pool = useMemo(
    () => precisDrills.filter((d) => skill === 'all' || d.skill === skill),
    [skill]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {([
          ['shorten', `Choose the shortening (${precisDrills.length})`],
          ['keepcut', `Keep or cut? (${keepCutDrills.length})`],
          ['title', `Best title (${titleDrills.length})`],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className="px-2.5 py-1.5 rounded-md text-xs"
            style={{
              background: kind === k ? 'var(--accent)' : 'transparent',
              color: kind === k ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {kind === 'shorten' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <button
                key={s}
                onClick={() => setSkill(s)}
                className="px-2 py-1 rounded text-[0.68rem]"
                style={{
                  background: skill === s ? 'var(--bg-panel-elev)' : 'transparent',
                  border: `1px solid ${skill === s ? 'var(--accent)' : 'var(--border)'}`,
                  color: skill === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {s === 'all' ? `All ${precisDrills.length}` : s}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {pool.map((d) => (
              <DrillCard
                key={d.id}
                id={d.id}
                sub={d.skill}
                prompt={`Original: “${d.original}”\n\nWhich is the best shortening?`}
                options={d.options}
                answer={d.answer}
                explain={d.explain}
                whyWrong={d.whyWrong}
                answered={answered}
                markAnswered={markAnswered}
              />
            ))}
          </div>
        </>
      )}

      {kind === 'keepcut' && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            One sentence from a passage. Does it survive into the précis — in compressed form — or does it go entirely?
          </p>
          {keepCutDrills.map((d) => (
            <DrillCard
              key={d.id}
              id={d.id}
              prompt={`“${d.sentence}”`}
              options={['Keep it (compressed)', 'Cut it entirely']}
              answer={d.keep ? 0 : 1}
              explain={d.why}
              answered={answered}
              markAnswered={markAnswered}
            />
          ))}
        </div>
      )}

      {kind === 'title' && (
        <div className="space-y-3">
          {titleDrills.map((d) => (
            <DrillCard
              key={d.id}
              id={d.id}
              sub="Choose the title"
              prompt={`The passage: ${d.gist}`}
              options={d.options}
              answer={d.answer}
              explain={d.explain}
              answered={answered}
              markAnswered={markAnswered}
            />
          ))}
        </div>
      )}
    </div>
  );
}
