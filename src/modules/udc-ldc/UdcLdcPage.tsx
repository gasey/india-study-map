import { useEffect, useMemo, useState } from 'react';
import { getBank } from '@/data/banks/index';
import { mpscUdcLdcNegativeMarking } from '@/data/banks/mpsc-udc-ldc';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { QuestionText } from './QuestionText';
import { QuestionImage } from './QuestionImage';
import type { ProgressMap } from './useProgress';
import { isMcqQuestion } from '@/data/banks/types';
import { useProgress } from './useProgress';
import {
  BANK_ID, EMPTY_FILTERS, SECTION_COLOUR, SECTION_LABEL, applyFilters, isAnswerable,
  optionLetter, sectionOf,
  type FlagState,
  type AnswerState, type AttemptState, type Filters, type SectionId,
} from './filters';
import { QuestionReviewPanel } from '@/modules/mpsc/QuestionReviewPanel';
import * as api from '@/lib/mpscApi';
import type { Correction } from '@/lib/mpscApi';
import { useFlags, type FlagInfo } from './useFlags';
import { FilterRail } from './FilterRail';
import { PracticeView } from './PracticeView';
import { ExamView } from './ExamView';
import './udc-ldc.css';

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


type Tab = 'progress' | 'browse' | 'practice' | 'exam';

interface PaperStats {
  paper: ExamPaper;
  questions: BankQuestion[];
  total: number;
  /**
   * MCQ only, and kept apart from `total` deliberately.
   *
   * `total` counts everything in the paper including its written half, so
   * using it as the denominator for ANSWERS reported "75/77" on a paper with
   * 75 MCQ and 2 essay prompts — implying two questions were missing answers
   * when they are questions no answer key could ever cover. Anything measuring
   * answer coverage must divide by this, not by `total`.
   */
  mcqTotal: number;
  written: number;
  answered: number;
  official: number;
  derived: number;
  transcribed: number;
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
        mcqTotal: mcq.length,
        written: questions.length - mcq.length,
        answered: mcq.filter((q) => q.answerIndex >= 0).length,
        official: mcq.filter((q) => q.answerSource === 'official').length,
        derived: mcq.filter((q) => q.answerSource === 'derived').length,
        transcribed: mcq.filter((q) => q.answerSource === 'transcribed').length,
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
  if (q.answerSource === 'transcribed') {
    // A transcription of the printed paper with the answer marked. Not the
    // Commission's key, but measured at 158/159 against the one sitting where
    // both exist — so it earns its own badge rather than being lumped in with
    // answers we worked out ourselves.
    return <Pill tone="info">marked-up paper</Pill>;
  }
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

/**
 * Narrow-viewport flag, for the one place a table genuinely cannot survive
 * a phone.
 *
 * This module styles inline, which cannot express a media query, so the
 * breakpoint is read in JS. 720 is the Progress table's own minWidth — below
 * that it stops fitting and starts scrolling sideways inside its wrapper,
 * which is not broken but means reading a paper's row takes two hands.
 */
function useIsNarrow(px = 720) {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < px,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px - 1}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);
  return narrow;
}

const MONTH_ORDER: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

function ProgressView({ rows: unsorted }: { rows: PaperStats[] }) {
  // Sitting order, newest or oldest first. The table was in PAPERS-table
  // order, which is the order papers happened to be staged in -- meaningless
  // to a reader. The month comes from `source` ("LDC under MPSC, February
  // 2025, Paper-I"), which build_bank writes from the paper's own printed
  // header; ExamPaper itself carries only the year.
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
  const narrow = useIsNarrow();
  const rows = useMemo(() => {
    const key = (r: PaperStats) => {
      const q = r.questions[0];
      const m = q?.source?.match(/,\s*([A-Z][a-z]+)\s+(\d{4})\s*,/);
      const year = r.paper.year ?? (m ? Number(m[2]) : 0);
      return year * 100 + (m ? MONTH_ORDER[m[1]] ?? 0 : 0);
    };
    const out = unsorted.slice().sort((a, b) => key(a) - key(b));
    return order === 'newest' ? out.reverse() : out;
  }, [unsorted, order]);

  const tot = rows.reduce(
    (a, r) => ({
      total: a.total + r.total,
      written: a.written + r.written,
      answered: a.answered + r.answered,
      unanswerable: a.unanswerable + r.unanswerable,
      defects: a.defects + r.defects,
      official: a.official + r.official,
      derived: a.derived + r.derived,
      lowConf: a.lowConf + r.lowConf,
    }),
    { total: 0, written: 0, answered: 0, unanswerable: 0, defects: 0, official: 0,
      derived: 0, lowConf: 0 },
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
          ['Questions', `${tot.total - tot.written} MCQ + ${tot.written} written`],
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

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, opacity: 0.65 }}>Order</span>
        {(['newest', 'oldest'] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOrder(o)}
            style={{ ...toolBtn, ...(order === o ? toolBtnOn : null) }}
          >
            {o === 'newest' ? 'Newest first' : 'Oldest first'}
          </button>
        ))}
      </div>
      {/* On a phone the five-column table turns into a sideways scroll, so
          each paper becomes a stacked card instead. Same numbers, same order,
          same notes — it is the LAYOUT that changes, not what is reported. */}
      {narrow ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((r) => {
            const answerable = r.mcqTotal - r.unanswerable;
            return (
              <div
                key={r.paper.id}
                style={{
                  border: '1px solid var(--border, #dcdce3)', borderRadius: 10,
                  padding: '12px 13px',
                }}
              >
                <div style={{ fontWeight: 700, lineHeight: 1.3 }}>{r.paper.examName}</div>
                <div style={{ fontSize: 12.5, opacity: 0.7, margin: '2px 0 9px' }}>
                  {r.paper.paperNumber} · {r.paper.post} · {r.paper.year}
                  {mpscUdcLdcNegativeMarking[r.paper.id] && ' · −⅓ penalty'}
                </div>
                <div style={{ fontSize: 11.5, opacity: 0.65, marginBottom: 3 }}>Text extracted</div>
                <Bar done={r.total} total={r.total} />
                <div style={{ fontSize: 11.5, opacity: 0.65, margin: '9px 0 3px' }}>Answers</div>
                <Bar done={r.answered} total={answerable} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 9 }}>
                  {r.written > 0 && (
                    <Pill tone="muted">
                      {r.mcqTotal ? `${r.mcqTotal} MCQ + ${r.written} written` : `${r.written} written`}
                    </Pill>
                  )}
                  {r.unanswerable > 0 && <Pill tone="warn">{r.unanswerable} figure lost</Pill>}
                  {r.defects > 0 && <Pill tone="muted">{r.defects} printing defect</Pill>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
              // MCQ only. The written half has no answer key anywhere and
              // never will, so counting it here reported "75/77" for a paper
              // whose 75 MCQ are all answered.
              const answerable = r.mcqTotal - r.unanswerable;
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
                      {r.written > 0 && (
                        <>
                          {' '}· {r.mcqTotal
                            ? `${r.mcqTotal} MCQ + ${r.written} written`
                            : `${r.written} written, no MCQ`}
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <Bar done={r.answered} total={answerable} />
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
                      {r.official > 0
                        ? `${r.official} from the official key`
                        : r.transcribed > 0
                          /* No MPSC key, but a transcription of the paper with
                             the answers marked — a different and much stronger
                             thing than our own solve, so say which it is. */
                          ? `${r.transcribed} from a marked-up copy of the paper${r.lowConf ? `; ${r.lowConf} worth review` : ''}`
                        : r.mcqTotal === 0
                          /* Eight of these papers are written THROUGHOUT — the
                             pre-2018 clerical Paper-I had no MCQ at all. Saying
                             "not solved yet" of a paper with nothing to solve
                             reads as a gap in the work rather than the shape of
                             the exam. */
                          ? 'nothing to answer — this paper is written throughout'
                        : r.answered === 0
                          /* Distinguish "no answers yet" from "solved without a
                             key" — both show 0 official, and calling an
                             unanswered paper "solved" is simply false. */
                          ? 'not solved yet — no MPSC key for this sitting'
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
      )}

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
            <strong>{tot.written} questions are written, not multiple choice</strong> —
            essay, précis, comprehension and worked arithmetic. They are a real part
            of the exam, not an appendix: a UDC/Assistant Paper-I gives Essay 20 +
            Précis 10 + Comprehension 20 of its marks to written work, and eight of
            the papers here have no MCQ at all. There is no answer key for any of
            them and none is invented — the prompt and its printed mark allocation
            are what is shown. Filter to them under <em>Question type → Written</em>.
          </li>
          <li>
            Every clerical Direct paper in the archive is now loaded, back to March
            2010. The older sittings needed no reconstructed blueprint in the end:
            each paper prints its own — the section headings, the marks, and whether
            a section is answered on the OMR sheet or written out longhand.
          </li>
        </ul>
      </div>
    </div>
  );
}

const toolBtn: React.CSSProperties = {
  background: 'transparent', border: '1.5px solid var(--border, #dcdce3)',
  borderRadius: 999, padding: '7px 14px', font: 'inherit', fontSize: 12.5,
  fontWeight: 700, color: 'inherit', cursor: 'pointer',
};
const toolBtnOn: React.CSSProperties = {
  borderColor: 'var(--info, #3b7dd8)', color: 'var(--info, #3b7dd8)',
  background: 'color-mix(in srgb, var(--info, #3b7dd8) 10%, transparent)',
};

function BrowseView({
  rows, questions, progress, flags,
}: {
  rows: PaperStats[]; questions: BankQuestion[]; progress: ProgressMap;
  flags: Record<string, FlagInfo>;
}) {
  const keep = useMemo(() => new Set(questions.map((q) => q.id)), [questions]);
  // Answers HIDDEN by default, which is the whole point of reading past papers
  // rather than a worked solution set: a visible answer cannot be recalled,
  // only recognised. `shown` holds the ids deliberately revealed.
  // What the reader PICKED, per question. Picking is what reveals — an answer
  // you have not committed to is one you can only recognise, and a blind
  // "reveal" button lets you skip the commitment entirely. `null` means the
  // reader used Reveal all instead of choosing, which still shows the answer
  // but records no attempt.
  const [picked, setPicked] = useState<Record<string, number | null>>({});
  const shown = useMemo(() => new Set(Object.keys(picked)), [picked]);
  const setShown = (fn: (prev: Set<string>) => Set<string>) => {
    setPicked((prev) => {
      const next: Record<string, number | null> = {};
      fn(new Set(Object.keys(prev))).forEach((id) => { next[id] = prev[id] ?? null; });
      return next;
    });
  };
  const [shuffle, setShuffle] = useState(false);
  // Re-shuffles only when this changes, so revealing an answer does not
  // reorder the list under the reader's cursor.
  const [seed, setSeed] = useState(0);

  const visible = useMemo(() => {
    const currentById = new Map(questions.map((q) => [q.id, q]));
    const out = rows
      // `rows` is the stable paper grouping from the initial bank. Resolve
      // each question through the filtered/corrected map so an admin edit is
      // visible immediately instead of leaving Browse on the old extraction.
      .map((r) => ({
        ...r,
        questions: r.questions
          .map((q) => currentById.get(q.id))
          .filter((q): q is BankQuestion => !!q && keep.has(q.id)),
      }))
      .filter((r) => r.questions.length > 0);
    if (!shuffle) return out;
    return out.map((r) => {
      // Seeded so the order is stable across re-renders; Math.random() here
      // would reshuffle on every keystroke in the search box.
      let h = seed * 2654435761 + r.paper.id.length;
      const rnd = () => ((h = (h * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
      const qs = r.questions.slice();
      for (let i = qs.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rnd() * (i + 1));
        [qs[i], qs[j]] = [qs[j], qs[i]];
      }
      return { ...r, questions: qs };
    });
  }, [rows, questions, keep, shuffle, seed]);

  const [open, setOpen] = useState<string | null>(null);
  const openId = open ?? visible[0]?.paper.id ?? null;
  const openRow = visible.find((r) => r.paper.id === openId);
  const allShown = !!openRow && openRow.questions.every((q) => shown.has(q.id));
  const toggleAll = () => setShown((prev) => {
    if (!openRow) return prev;
    const next = new Set(prev);
    openRow.questions.forEach((q) => (allShown ? next.delete(q.id) : next.add(q.id)));
    return next;
  });

  if (!visible.length) {
    return <div style={{ opacity: 0.7, padding: '20px 0' }}>No questions match these filters.</div>;
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
        <button type="button" onClick={toggleAll} disabled={!openRow} style={toolBtn}>
          {allShown ? 'Hide all answers' : 'Reveal all answers'}
        </button>
        <button
          type="button"
          onClick={() => { setShuffle((v) => !v); setSeed((n) => n + 1); }}
          style={{ ...toolBtn, ...(shuffle ? toolBtnOn : null) }}
        >
          {shuffle ? 'Shuffled' : 'Shuffle questions'}
        </button>
        {shuffle && (
          <button type="button" onClick={() => setSeed((n) => n + 1)} style={toolBtn}>
            Re-shuffle
          </button>
        )}
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          Pick an option to check it — or reveal without answering.
        </span>
      </div>
      {visible.map((r) => {
        const isOpen = openId === r.paper.id;
        // ONE note only, most-important first. A block carrying three warnings
        // reads as noise and the reader stops seeing any of them; the ranking
        // is "can I practise this at all" before "how is it scored".
        const note = r.mcqTotal === 0
          ? 'Written throughout — no multiple choice in this paper'
          : r.answered === 0
            ? 'No answers yet — MPSC published no key for this sitting'
            : mpscUdcLdcNegativeMarking[r.paper.id]
              ? 'Sat under −⅓ negative marking'
              : r.unanswerable > 0
                ? `${r.unanswerable} question${r.unanswerable === 1 ? '' : 's'} unanswerable — figures lost in the scan`
                : '';
        return (
          <div
            key={r.paper.id}
            style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10 }}
          >
            <button
              onClick={() => setOpen(isOpen ? '' : r.paper.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '13px 14px', cursor: 'pointer',
                background: isOpen ? 'color-mix(in srgb, var(--info, #3b7dd8) 9%, transparent)' : 'transparent',
                border: 0, borderRadius: 10, font: 'inherit', color: 'inherit',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background .15s',
              }}
            >
              {/* Written-throughout papers get their own glyph. Eight of these
                  contain no MCQ at all, and that is the single most useful
                  thing to know before opening one — it was previously
                  discoverable only by opening it and finding no options. */}
              <span style={{ flex: 'none', fontSize: 19, lineHeight: 1 }}>
                {r.mcqTotal === 0 ? '✍️' : '📄'}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 700, lineHeight: 1.25 }}>
                  {r.paper.examName}
                </span>
                <span style={{ display: 'block', fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>
                  {r.paper.paperNumber} · {r.paper.post} · {r.paper.year}
                </span>
                {note && (
                  <span style={{
                    display: 'block', fontSize: 11.5, marginTop: 5, lineHeight: 1.35,
                    color: 'var(--warn, #b06f1a)',
                  }}>
                    {note}
                  </span>
                )}
              </span>
              {/* The count of what is SHOWN, not what the paper holds. `visible`
                  spreads the stats row and replaces only `questions`, so `total`
                  is still the unfiltered figure -- with the Written filter on,
                  a paper listing two prompts announced itself as 77 questions. */}
              <span style={{
                flex: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                background: 'var(--bg-panel-elev, #efece2)', borderRadius: 999,
                padding: '3px 10px', opacity: 0.85,
              }}>
                {r.questions.length}{r.questions.length === r.total ? '' : `/${r.total}`}
              </span>
              <span style={{ flex: 'none', opacity: 0.45, fontSize: 12 }}>
                {isOpen ? '▾' : '▸'}
              </span>
            </button>

            {isOpen && (
              <div style={{ borderTop: '1px solid var(--border, #eee)', padding: '4px 14px 14px' }}>
                {r.questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="udc-question-card"
                    style={{
                      padding: '12px 0',
                      borderBottom: i === r.questions.length - 1
                        ? 'none' : '1px solid var(--border, #f0f0f3)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span className="udc-question-number" style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>
                        {i + 1}.
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className="udc-question-stem" style={{ marginBottom: 6, lineHeight: 1.55, overflowWrap: 'anywhere' }}><QuestionText text={q.question} /></div>
                        <QuestionImage path={q.imagePath} />
                        {q.figureBased && (
                          <div style={{
                            margin: '8px 0', padding: '12px', textAlign: 'center',
                            border: '1px dashed var(--border, #dcdce3)', borderRadius: 8,
                            color: 'var(--warn, #b06f1a)', fontSize: 12.5,
                          }}>
                            Figure from the source scan is unavailable; this question is not scored.
                          </div>
                        )}
                        {isMcqQuestion(q) && q.options.length > 0 && (() => {
                          const open = shown.has(q.id);
                          const mine = picked[q.id];
                          const accent = SECTION_COLOUR[sectionOf(q)];
                          const markable = q.answerIndex >= 0;
                          return (
                            <div style={{ display: 'grid', gap: 6, margin: '2px 0 8px' }}>
                              {q.options.map((o, oi) => {
                                const isAnswer = open && markable && oi === q.answerIndex;
                                const isBadPick = open && mine === oi && oi !== q.answerIndex;
                                const edge = isAnswer ? 'var(--ok, #2e9e5b)'
                                  : isBadPick ? 'var(--bad, #c4462f)'
                                  // Neat, not mixed into --border (#241f18,
                                  // near-black) — a mix there reads as an
                                  // ordinary dark hairline.
                                  : accent;
                                return (
                                  <button
                                    key={oi}
                                    type="button"
                                    // Picking IS the reveal. Only meaningful
                                    // while there is an answer to check against.
                                    onClick={() => markable && !open
                                      && setPicked((p) => ({ ...p, [q.id]: oi }))}
                                    disabled={!markable || open}
                                    style={{
                                      display: 'flex', gap: 10, alignItems: 'flex-start',
                                      textAlign: 'left', font: 'inherit', fontSize: 13.5,
                                      padding: '8px 11px', borderRadius: 9,
                                      border: `1.5px solid ${edge}`,
                                      background: isAnswer
                                        ? 'color-mix(in srgb, var(--ok, #2e9e5b) 12%, transparent)'
                                        : isBadPick
                                          ? 'color-mix(in srgb, var(--bad, #c4462f) 12%, transparent)'
                                          : 'var(--bg-panel, #fff)',
                                      color: 'inherit',
                                      cursor: markable && !open ? 'pointer' : 'default',
                                    }}
                                  >
                                    <span style={{
                                      flex: 'none', width: 21, height: 21, borderRadius: '50%',
                                      border: `1.5px solid ${isAnswer || isBadPick ? edge : accent}`,
                                      background: isAnswer ? 'var(--ok, #2e9e5b)'
                                        : isBadPick ? 'var(--bad, #c4462f)' : 'transparent',
                                      color: isAnswer || isBadPick ? '#fff' : accent,
                                      display: 'flex', alignItems: 'center',
                                      justifyContent: 'center', fontSize: 10.5, fontWeight: 700,
                                      textTransform: 'uppercase',
                                    }}>
                                      {optionLetter(oi)}
                                    </span>
                                    <span className="udc-option-label"><QuestionText text={o} /></span>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })()}
                        {isMcqQuestion(q) && shown.has(q.id) && picked[q.id] != null && (
                          <div style={{
                            fontSize: 12.5, fontWeight: 700, marginBottom: 6,
                            color: picked[q.id] === q.answerIndex
                              ? 'var(--ok, #2e9e5b)' : 'var(--bad, #c4462f)',
                          }}>
                            {picked[q.id] === q.answerIndex
                              ? 'Correct'
                              : `Not quite — the answer is (${optionLetter(q.answerIndex)})`}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Provenance q={q} />
                          {/* What YOU flagged and what came of it. Kept next
                              to the provenance badge because both answer the
                              same question — how much to trust this item. */}
                          {flags[q.id] && (
                            <Pill tone={flags[q.id].status === 'accepted' ? 'ok'
                              : flags[q.id].status === 'rejected' ? 'muted' : 'warn'}>
                              🚩 {flags[q.id].issueType.replace(/_/g, ' ')}
                              {flags[q.id].status !== 'pending' ? ` · ${flags[q.id].status}` : ''}
                            </Pill>
                          )}
                          {/* Say what it is. Without this a written prompt
                              reads as an MCQ whose options failed to load,
                              which is exactly the wrong impression — nothing
                              is missing, the paper asks for prose. The marks
                              are the paper's own printed allocation. */}
                          {!isMcqQuestion(q) && (
                            <Pill tone="info">
                              written answer{q.marks ? ` · ${q.marks} marks` : ''}
                            </Pill>
                          )}
                          <span style={{ fontSize: 11, opacity: 0.6 }}>{q.topicLabel}</span>
                          {progress[q.id] ? (
                            <Pill tone={progress[q.id].lastCorrect ? 'ok' : 'warn'}>
                              {progress[q.id].lastCorrect ? 'got it right' : 'got it wrong'}
                            </Pill>
                          ) : (
                            isAnswerable(q) && <Pill tone="muted">never attempted</Pill>
                          )}
                        </div>
                        {isMcqQuestion(q) && shown.has(q.id) && q.explanation && (
                          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                            {q.explanation}
                          </div>
                        )}
                        {isMcqQuestion(q) && q.answerAsOf && (
                          <div style={{ fontSize: 12, marginTop: 6, color: 'var(--warn, #b06f1a)' }}>
                            Current affairs — answer as of {q.answerAsOf}, may
                            since have changed.
                          </div>
                        )}
                        {/* 601 questions have no answer because MPSC never
                            published a key for that sitting. That is a gap a
                            reader can CLOSE: the flag form carries a
                            "what should the answer be" dropdown, which files a
                            report with suggestedAnswerIndex for an editor to
                            apply. Saying so is the difference between a dead
                            end and an invitation. */}
                        {isMcqQuestion(q) && q.answerIndex < 0 && !q.figureBased
                          && q.options.length > 0 && (
                          <div style={{
                            fontSize: 12, opacity: 0.75, margin: '2px 0 4px',
                            color: 'var(--warn, #b06f1a)',
                          }}>
                            No answer yet — use <strong>🚩 Flag</strong> below to suggest one.
                          </div>
                        )}
                        {/* Flag / private note / comments against the review
                            service. Shown on every question, not only revealed
                            ones — a garbled stem is worth reporting before you
                            can answer it, which is the commonest case here. */}
                        <QuestionReviewPanel
                          bankId={BANK_ID}
                          questionId={q.id}
                          options={isMcqQuestion(q) ? q.options : undefined}
                          compact
                          // Once the reader has committed to an option, show
                          // what everyone else said about it.
                          autoOpenComments={shown.has(q.id)}
                        />
                        {isMcqQuestion(q) && shown.has(q.id) && q.disputeNote && (
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
  const [corrections, setCorrections] = useState<Record<string, Correction>>({});
  const [tab, setTab] = useState<Tab>('progress');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  // Open on first visit so the rail is discoverable; the reader collapses it
  // once they know what is in there.
  const [filtersOpen, setFiltersOpen] = useState(true);
  const { flags, signedIn } = useFlags();
  const { progress, record, reset } = useProgress();

  useEffect(() => {
    const refresh = () => api.getCorrections(BANK_ID).then(setCorrections).catch(() => setCorrections({}));
    refresh();
    const onApplied = (event: Event) => {
      const detail = (event as CustomEvent<{ bankId?: string }>).detail;
      if (!detail?.bankId || detail.bankId === BANK_ID) refresh();
    };
    window.addEventListener('mpsc-correction-applied', onApplied);
    return () => window.removeEventListener('mpsc-correction-applied', onApplied);
  }, []);

  const correctedQuestions = useMemo(() => {
    if (!data || Object.keys(corrections).length === 0) return data?.bank.questions ?? [];
    return data.bank.questions.map((q) => {
      const c = corrections[q.id];
      if (!c) return q;
      return {
        ...q,
        question: c.stem ?? q.question,
        explanation: c.explanation ?? q.explanation,
        ...(isMcqQuestion(q)
          ? { answerIndex: c.answerIndex ?? q.answerIndex, options: c.options ?? q.options }
          : { subparts: c.subparts ?? q.subparts }),
      } as BankQuestion;
    });
  }, [data, corrections]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return applyFilters(correctedQuestions, data.bank.papers ?? [], filters, progress, flags);
  }, [data, correctedQuestions, filters, progress, flags]);

  if (!data) {
    return <div style={{ padding: 24 }}>Bank <code>{BANK_ID}</code> is not registered.</div>;
  }

  return (
    // AppShell renders <main class="flex-1 min-w-0 overflow-hidden">, so every
    // page must supply its OWN scroll container — see PyqPage/PapersPage, which
    // both use `scroll-panel ... overflow-y-auto`. Without it the page renders
    // at full height inside a clipped box and simply cannot be scrolled.
    <div className="scroll-panel h-full overflow-y-auto udc-ldc-page">
      <div className="udc-ldc-content" style={{ padding: '20px 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="udc-hero">
      <h1 style={{ margin: '0 0 4px', fontSize: 22 }}>MPSC Clerical — LDC / UDC / Assistant</h1>
      <p style={{ margin: 0, fontSize: 14 }}>
        Past papers of the Mizoram Ministerial Service clerical cadre, checked question by
        question against the printed pages.
      </p>
      </div>

      <div className="udc-tabs" style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['progress', 'browse', 'practice', 'exam'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`udc-tab ${tab === t ? 'is-active' : ''}`}
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

      {(tab === 'browse' || tab === 'practice') && (() => {
        // The rail is eight rows of chips and pushes the first question below
        // the fold on a laptop, which is the wrong thing to spend the screen
        // on once the filters are set. Collapsed it keeps a one-line summary,
        // so the reader can still see WHAT is filtered without expanding —
        // a collapsed filter that hides its own state is how you end up
        // studying a subset you forgot you chose.
        const active = [
          filters.posts.length && `${filters.posts.length} post`,
          filters.papers.length && `${filters.papers.length} paper`,
          filters.sections.length && `${filters.sections.length} section`,
          filters.type !== 'any' && (filters.type === 'mcq' ? 'multiple choice' : 'written'),
          filters.answer !== 'any' && (filters.answer === 'answered' ? 'answered' : 'unanswered'),
          filters.gkKind !== 'any' && filters.gkKind.replace('-', ' '),
          filters.attempt !== 'any' && filters.attempt,
          filters.search.trim() && `“${filters.search.trim()}”`,
        ].filter(Boolean) as string[];
        return (
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              style={{
                ...toolBtn, display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', justifyContent: 'flex-start', borderRadius: 10,
                padding: '9px 13px',
              }}
            >
              <span style={{ opacity: 0.55 }}>{filtersOpen ? '▾' : '▸'}</span>
              <span>Filters</span>
              <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 12 }}>
                {active.length ? active.join(' · ') : 'none'}
              </span>
              <span style={{ marginLeft: 'auto', fontWeight: 400, opacity: 0.7, fontSize: 12 }}>
                {filtered.length} question{filtered.length === 1 ? '' : 's'}
              </span>
            </button>
          </div>
        );
      })()}
      {(tab === 'browse' || tab === 'practice') && filtersOpen && (
        <FilterRail
          papers={data.bank.papers ?? []}
          all={correctedQuestions}
          filters={filters}
          onChange={setFilters}
          matched={filtered.length}
          progress={progress}
          onResetProgress={reset}
          flags={flags}
          signedIn={signedIn}
        />
      )}

      {tab === 'browse' && <BrowseView rows={data.rows} questions={filtered} progress={progress} flags={flags} />}
      {tab === 'practice' && (
        <PracticeView questions={filtered} progress={progress} onAnswer={record} />
      )}
      {/* The exam view deliberately ignores the filter rail: you sit the whole
          paper as printed, or it is not an exam. */}
      {tab === 'exam' && (
        <ExamView papers={data.bank.papers ?? []} questions={correctedQuestions} />
      )}
      </div>
    </div>
  );
}
