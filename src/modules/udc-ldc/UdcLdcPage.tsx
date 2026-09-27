import { useMemo, useState } from 'react';
import { getBank } from '@/data/banks/index';
import { mpscUdcLdcNegativeMarking } from '@/data/banks/mpsc-udc-ldc';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';
import { isMcqQuestion } from '@/data/banks/types';
import { useProgress } from './useProgress';
import {
  EMPTY_FILTERS, SECTION_LABEL, applyFilters, isAnswerable, sectionOf,
  type AnswerState, type AttemptState, type Filters, type SectionId,
} from './filters';
import { FilterRail } from './FilterRail';
import { PracticeView } from './PracticeView';
import { ExamView } from './ExamView';

// ============================================
// MPSC CLERICAL CADRE — LDC / UDC / ASSISTANT GRADE
//
// Two views for now:
//   Progress — what is done, what is left, and WHY each gap exists. This is
//              the view that keeps "shipped in parts" honest: a paper with
//              text but no answers must never read as ready.
//   Browse   — by paper, expandable, questions readable inline (CLAUDE.md:
//              every group-by view must let you read, not only start a test).
//
// The provenance badge is the load-bearing bit. Only the Apr-2024
// Assistant/UDC Paper-II sitting has a published MPSC key; every other
// question here has NO answer, and says so. A blank is honest, a guess
// wearing an answer's clothes is not.
// ============================================

const BANK_ID = 'mpsc-udc-ldc';

type Tab = 'progress' | 'browse' | 'practice' | 'exam';

interface PaperStats {
  paper: ExamPaper;
  questions: BankQuestion[];
  total: number;
  answered: number;
  official: number;
  derived: number;
  lowConf: number;
  unanswerable: number;
  defects: number;
}

function useStats() {
  return useMemo(() => {
    const bank = getBank(BANK_ID);
    if (!bank) return null;
    const papers = bank.papers ?? [];
    const rows: PaperStats[] = papers.map((paper) => {
      const questions = bank.questions.filter((q) => q.paperId === paper.id);
      const mcq = questions.filter(isMcqQuestion);
      return {
        paper,
        questions,
        total: questions.length,
        answered: mcq.filter((q) => q.answerIndex >= 0).length,
        official: mcq.filter((q) => q.answerSource === 'official').length,
        derived: mcq.filter((q) => q.answerSource === 'derived').length,
        lowConf: mcq.filter((q) => q.answerSource === 'derived'
          && (q.answerConfidence === 'low' || q.answerConfidence === 'medium')).length,
        unanswerable: mcq.filter((q) => q.figureBased).length,
        defects: mcq.filter((q) => q.sourceDefect).length,
      };
    });
    return { bank, rows };
  }, []);
}

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1, height: 8, minWidth: 90, borderRadius: 999,
          background: 'var(--bg-panel-elev, #e9e9ee)', overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`, height: '100%',
            background: pct === 100 ? 'var(--ok, #2e9e5b)' : 'var(--info, #3b7dd8)',
          }}
        />
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, opacity: 0.8 }}>
        {done}/{total}
      </span>
    </div>
  );
}

function Pill({ tone, children }: { tone: 'ok' | 'info' | 'warn' | 'muted'; children: React.ReactNode }) {
  const colour = {
    ok: 'var(--ok, #2e9e5b)',
    info: 'var(--info, #3b7dd8)',
    warn: 'var(--bad, #c4462f)',
    muted: 'var(--text-secondary, #6b7280)',
  }[tone];
  return (
    <span
      style={{
        display: 'inline-block', padding: '1px 8px', borderRadius: 999,
        fontSize: 11, fontWeight: 600, color: colour, border: `1px solid ${colour}`,
        background: `color-mix(in srgb, ${colour} 12%, transparent)`, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/**
 * The provenance badge.
 *
 * A derived answer is ALWAYS shown with its confidence. Graded against the one
 * official key that exists for this bank, 'high' answers were 97-98% correct
 * and 'medium' ones 44% — so "derived" alone would imply a reliability the
 * answer may not have. `CLAUDE.md` records the inverse mistake already made
 * here once: 309 derived answers badged as authoritative.
 */
function Provenance({ q }: { q: BankQuestion }) {
  if (!isMcqQuestion(q)) return null;
  if (q.figureBased) return <Pill tone="warn">figure lost — unanswerable</Pill>;
  if (q.answerSource === 'official') return <Pill tone="info">official key</Pill>;
  if (q.answerIndex < 0) return <Pill tone="muted">no answer yet</Pill>;
  if (q.answerSource === 'derived') {
    const c = q.answerConfidence;
    return (
      <Pill tone={c === 'high' ? 'ok' : c === 'low' ? 'warn' : 'muted'}>
        {c ? `solved · ${c} confidence` : 'solved · confidence unrated'}
      </Pill>
    );
  }
  return <Pill tone="muted">derived</Pill>;
}

function ProgressView({ rows }: { rows: PaperStats[] }) {
  const tot = rows.reduce(
    (a, r) => ({
      total: a.total + r.total,
      answered: a.answered + r.answered,
      unanswerable: a.unanswerable + r.unanswerable,
      defects: a.defects + r.defects,
      official: a.official + r.official,
      derived: a.derived + r.derived,
      lowConf: a.lowConf + r.lowConf,
    }),
    { total: 0, answered: 0, unanswerable: 0, defects: 0, official: 0, derived: 0, lowConf: 0 },
  );

  return (
    <div>
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12, marginBottom: 20,
        }}
      >
        {[
          ['Papers', String(rows.length)],
          ['Questions', String(tot.total)],
          ['From an official key', `${tot.official}`],
          ['Solved, needs review', `${tot.lowConf}`],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: '12px 14px', borderRadius: 10,
              border: '1px solid var(--border, #dcdce3)',
              background: 'var(--bg-panel, transparent)',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border, #dcdce3)' }}>
              <th style={{ padding: '8px 10px' }}>Paper</th>
              <th style={{ padding: '8px 10px' }}>Year</th>
              <th style={{ padding: '8px 10px', minWidth: 170 }}>Text extracted</th>
              <th style={{ padding: '8px 10px', minWidth: 170 }}>Answers</th>
              <th style={{ padding: '8px 10px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const answerable = r.total - r.unanswerable;
              return (
                <tr key={r.paper.id} style={{ borderBottom: '1px solid var(--border, #eee)' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{r.paper.examName}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {r.paper.paperNumber} · {r.paper.post}
                    </div>
                  </td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {r.paper.year}
                    {/* Gazette Ex-582/2025 took effect 18 Aug 2025, so this is a
                        year AND month test -- computed in the generator, never
                        re-derived from the year here. */}
                    {mpscUdcLdcNegativeMarking[r.paper.id] && (
                      <div style={{ marginTop: 4 }}>
                        <Pill tone="warn">−⅓ penalty</Pill>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <Bar done={r.total} total={r.total} />
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
                      verified against the printed pages
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <Bar done={r.answered} total={answerable} />
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
                      {r.official > 0
                        ? `${r.official} from the official key`
                        : `solved — no MPSC key exists${r.lowConf ? `; ${r.lowConf} worth review` : ''}`}
                    </div>
                  </td>
                  <td style={{ padding: '10px', fontSize: 12 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.unanswerable > 0 && (
                        <Pill tone="warn">{r.unanswerable} figure lost</Pill>
                      )}
                      {r.defects > 0 && <Pill tone="muted">{r.defects} printing defect</Pill>}
                      {r.unanswerable === 0 && r.defects === 0 && (
                        <span style={{ opacity: 0.5 }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 22, padding: '14px 16px', borderRadius: 10,
          border: '1px solid var(--border, #dcdce3)', fontSize: 13, lineHeight: 1.6,
        }}
      >
        <strong>What&apos;s left</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
          <li>
            <strong>{tot.official} answers come from MPSC&apos;s own key</strong> (the April
            2024 Assistant/UDC sitting — the only one the Commission published).
            Those are authoritative.
          </li>
          <li>
            <strong>{tot.derived} were worked out, not looked up.</strong> No key exists for
            those five sittings and none ever will. Graded against the one key that does
            exist, answers marked <em>high</em> confidence were 97–98% correct and
            <em> medium</em> ones 44% — so every solved answer is shown with its
            confidence, and you should treat the badge as part of the answer.
          </li>
          <li>
            <strong>{tot.lowConf} are medium or low confidence</strong> and are the ones
            worth a human check first. Filter to them under
            <em> Answer → Has an answer</em> in Browse.
          </li>
          <li>
            <strong>{tot.unanswerable} question cannot be answered from its scan</strong> —
            its printed options are figures that came through as a solid black block.
            Shown read-only and kept out of scored drills.
          </li>
          <li>
            Papers before 2024 are <strong>not loaded yet</strong>: the syllabus and paper
            structure changed over the years, so their question counts cannot be checked
            against today&apos;s blueprint without first reconstructing the blueprint that
            applied at the time.
          </li>
        </ul>
      </div>
    </div>
  );
}

function BrowseView({
  rows, questions, progress,
}: { rows: PaperStats[]; questions: BankQuestion[]; progress: ProgressMap }) {
  const keep = useMemo(() => new Set(questions.map((q) => q.id)), [questions]);
  const visible = rows
    .map((r) => ({ ...r, questions: r.questions.filter((q) => keep.has(q.id)) }))
    .filter((r) => r.questions.length > 0);
  const [open, setOpen] = useState<string | null>(null);
  const openId = open ?? visible[0]?.paper.id ?? null;

  if (!visible.length) {
    return <div style={{ opacity: 0.7, padding: '20px 0' }}>No questions match these filters.</div>;
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {visible.map((r) => {
        const isOpen = openId === r.paper.id;
        return (
          <div
            key={r.paper.id}
            style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10 }}
          >
            <button
              onClick={() => setOpen(isOpen ? '' : r.paper.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 14px', cursor: 'pointer',
                background: 'transparent', border: 0, font: 'inherit', color: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}
            >
              <span>
                <strong>{r.paper.examName}</strong>
                <span style={{ opacity: 0.7 }}>
                  {' '}· {r.paper.paperNumber} · {r.paper.year}
                </span>
              </span>
              <span style={{ fontSize: 12, opacity: 0.7, whiteSpace: 'nowrap' }}>
                {r.total} questions {isOpen ? '▾' : '▸'}
              </span>
            </button>

            {isOpen && (
              <div style={{ borderTop: '1px solid var(--border, #eee)', padding: '4px 14px 14px' }}>
                {r.questions.map((q, i) => (
                  <div
                    key={q.id}
                    style={{
                      padding: '12px 0',
                      borderBottom: i === r.questions.length - 1
                        ? 'none' : '1px solid var(--border, #f0f0f3)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>
                        {i + 1}.
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 6 }}>{q.question}</div>
                        {isMcqQuestion(q) && q.options.length > 0 && (
                          <ol type="a" style={{ margin: '0 0 6px', paddingLeft: 20, opacity: 0.9 }}>
                            {q.options.map((o, oi) => (
                              <li
                                key={oi}
                                style={{
                                  fontWeight: q.answerIndex === oi ? 700 : 400,
                                  color: q.answerIndex === oi
                                    ? 'var(--ok, #2e9e5b)' : undefined,
                                }}
                              >
                                {o}
                              </li>
                            ))}
                          </ol>
                        )}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Provenance q={q} />
                          <span style={{ fontSize: 11, opacity: 0.6 }}>{q.topicLabel}</span>
                          {progress[q.id] ? (
                            <Pill tone={progress[q.id].lastCorrect ? 'ok' : 'warn'}>
                              {progress[q.id].lastCorrect ? 'got it right' : 'got it wrong'}
                            </Pill>
                          ) : (
                            isAnswerable(q) && <Pill tone="muted">never attempted</Pill>
                          )}
                        </div>
                        {isMcqQuestion(q) && q.explanation && (
                          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                            {q.explanation}
                          </div>
                        )}
                        {isMcqQuestion(q) && q.disputeNote && (
                          <div style={{ fontSize: 12, marginTop: 6, color: 'var(--bad, #c4462f)' }}>
                            {q.disputeNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function UdcLdcPage() {
  const data = useStats();
  const [tab, setTab] = useState<Tab>('progress');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const { progress, record, reset } = useProgress();

  const filtered = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.bank.questions, data.bank.papers ?? [], filters, progress);
  }, [data, filters, progress]);

  if (!data) {
    return <div style={{ padding: 24 }}>Bank <code>{BANK_ID}</code> is not registered.</div>;
  }

  return (
    <div style={{ padding: '20px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 22 }}>MPSC Clerical — LDC / UDC / Assistant</h1>
      <p style={{ margin: '0 0 18px', opacity: 0.75, fontSize: 14 }}>
        Past papers of the Mizoram Ministerial Service clerical cadre, checked question by
        question against the printed pages.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['progress', 'browse', 'practice', 'exam'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '6px 14px', borderRadius: 999, cursor: 'pointer', font: 'inherit',
              fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
              border: '1px solid var(--border, #dcdce3)',
              background: tab === t ? 'var(--info, #3b7dd8)' : 'transparent',
              color: tab === t ? '#fff' : 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'progress' && <ProgressView rows={data.rows} />}

      {(tab === 'browse' || tab === 'practice') && (
        <FilterRail
          papers={data.bank.papers ?? []}
          all={data.bank.questions}
          filters={filters}
          onChange={setFilters}
          matched={filtered.length}
          progress={progress}
          onResetProgress={reset}
        />
      )}

      {tab === 'browse' && <BrowseView rows={data.rows} questions={filtered} progress={progress} />}
      {tab === 'practice' && (
        <PracticeView questions={filtered} progress={progress} onAnswer={record} />
      )}
      {/* The exam view deliberately ignores the filter rail: you sit the whole
          paper as printed, or it is not an exam. */}
      {tab === 'exam' && (
        <ExamView papers={data.bank.papers ?? []} questions={data.bank.questions} />
      )}
    </div>
  );
}
