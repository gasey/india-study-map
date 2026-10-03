import { useMemo } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';
import {
  EMPTY_FILTERS, SECTION_LABEL, applyFilters, isAnswerable, sectionOf,
  type AnswerState, type AttemptState, type Filters, type GkKindState,
  type GkTopicState, type FlagState, type SectionId, type TypeState,
} from './filters';

// ============================================
// Filter rail.
//
// Every chip carries its own COUNT, computed with that chip's own axis
// removed — so "Computer 235" means "235 if I pick Computer now", not the
// count under the current selection, which would read 0 the moment you pick
// a second section. A chip that would yield nothing is disabled rather than
// silently returning an empty list.
// ============================================

interface Props {
  papers: ExamPaper[];
  all: BankQuestion[];
  filters: Filters;
  onChange: (f: Filters) => void;
  matched: number;
  progress: ProgressMap;
  onResetProgress: () => void;
  /** questionId -> the reader's own flag, for the Flagged axis and its counts. */
  flags: Record<string, { status: string }>;
  signedIn: boolean;
}

function Chip({
  on, count, disabled, onClick, children,
}: {
  on: boolean; count?: number; disabled?: boolean;
  onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 10px', borderRadius: 999, font: 'inherit', fontSize: 12.5,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1px solid var(--border, #dcdce3)',
        background: on ? 'var(--info, #3b7dd8)' : 'transparent',
        color: on ? '#fff' : 'inherit',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
      {count !== undefined && (
        <span style={{ opacity: 0.7, marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>
          {count}
        </span>
      )}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
      <span
        style={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em',
          opacity: 0.6, minWidth: 74, fontWeight: 700,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

export function FilterRail({
  papers, all, filters, onChange, matched, progress, onResetProgress, flags, signedIn,
}: Props) {
  const posts = useMemo(
    () => Array.from(new Set(papers.map((p) => p.post).filter(Boolean) as string[])).sort(),
    [papers],
  );
  const paperNos = useMemo(
    () => Array.from(new Set(papers.map((p) => p.paperNumber).filter(Boolean) as string[])).sort(),
    [papers],
  );
  const sections: SectionId[] = ['gk', 'english', 'computer', 'arithmetic', 'reasoning'];

  /** Count with `axis` reset, so a chip shows what picking it would give. */
  const countWith = (patch: Partial<Filters>) =>
    applyFilters(all, papers, { ...filters, ...patch }, progress, flags).length;

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const toggle = <T,>(list: T[], v: T): T[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <div
      style={{
        border: '1px solid var(--border, #dcdce3)', borderRadius: 10,
        padding: '14px 16px', marginBottom: 16, display: 'grid', gap: 10,
      }}
    >
      <Group label="Post">
        {posts.map((p) => (
          <Chip
            key={p}
            on={filters.posts.includes(p)}
            count={countWith({ posts: [p] })}
            onClick={() => set({ posts: toggle(filters.posts, p) })}
          >
            {p}
          </Chip>
        ))}
      </Group>

      <Group label="Paper">
        {paperNos.map((p) => (
          <Chip
            key={p}
            on={filters.papers.includes(p)}
            count={countWith({ papers: [p] })}
            onClick={() => set({ papers: toggle(filters.papers, p) })}
          >
            {p}
          </Chip>
        ))}
      </Group>

      <Group label="Section">
        {sections.map((s) => {
          const n = countWith({ sections: [s] });
          return (
            <Chip
              key={s}
              on={filters.sections.includes(s)}
              count={n}
              disabled={n === 0}
              onClick={() => set({ sections: toggle(filters.sections, s) })}
            >
              {SECTION_LABEL[s]}
            </Chip>
          );
        })}
      </Group>

      {/* MCQ or written. The written half is a real part of the exam, not a
          footnote: Essay 20 + Précis 10 + Comprehension 20 on a UDC/Assistant
          Paper-I, and the eight pre-2018 clerical Paper-Is are written
          THROUGHOUT. Wanted in both directions — to revise essay and précis
          prompts on their own, and to keep 156 unanswerable prompts out of an
          MCQ drill. */}
      <Group label="Question type">
        {([
          ['any', 'Any'], ['mcq', 'Multiple choice'], ['written', 'Written'],
        ] as [TypeState, string][]).map(([v, label]) => (
          <Chip
            key={v}
            on={filters.type === v}
            count={countWith({ type: v })}
            onClick={() => set({ type: v })}
          >
            {label}
          </Chip>
        ))}
      </Group>

      {/* Flag state, from the reader's OWN reports. Both directions matter:
          "flagged" is the collaborative-review view, "not flagged" keeps a
          revision drill from serving questions you have already reported as
          broken. Hidden when signed out — every option would be a no-op. */}
      {signedIn && (
        <Group label="Flagged">
          {([
            ['any', 'Any'], ['flagged', 'Flagged by me'], ['unflagged', 'Not flagged'],
            ['pending', 'Awaiting review'], ['accepted', 'Accepted'],
          ] as [FlagState, string][]).map(([v, label]) => (
            <Chip
              key={v}
              on={filters.flag === v}
              count={countWith({ flag: v })}
              onClick={() => set({ flag: v })}
            >
              {label}
            </Chip>
          ))}
        </Group>
      )}

      <Group label="Answer">
        {([
          ['any', 'Any'], ['answered', 'Has an answer'], ['unanswered', 'No answer yet'],
        ] as [AnswerState, string][]).map(([v, label]) => (
          <Chip
            key={v}
            on={filters.answer === v}
            count={countWith({ answer: v })}
            onClick={() => set({ answer: v })}
          >
            {label}
          </Chip>
        ))}
      </Group>

      {/* GK only. The bank runs 2016–2026, so a third of its General Knowledge
          is current affairs whose answer was true at the sitting and is not
          true now — worth reading as a guide to what MPSC asks, not worth
          memorising. "Durable" is the one to revise from.

          "Skip current affairs" is the one to revise from day to day; the two
          GK-only views are for studying that section deliberately. Each chip's
          count is now the real size of the pool it produces, so no chip can
          promise one thing and hand back another. */}
      <Group label="Current affairs">
        {([
          ['any', 'Include'],
          ['skip-current', 'Skip'],
          ['static', 'Durable GK only'],
          ['current', 'Current affairs only'],
        ] as [GkKindState, string][]).map(([v, label]) => (
          <Chip
            key={v}
            on={filters.gkKind === v}
            count={countWith({ gkKind: v })}
            onClick={() => set({ gkKind: v })}
          >
            {label}
          </Chip>
        ))}
      </Group>

      {/* Which GK sub-topic. The categories are the syllabus's own
          GK sub-topics plus Mizoram, content-classified at build
          time — see gk-subtopics.json's _README. GK-only, like the
          gkKind views above, and composes with them: "Mizoram,
          skip current affairs" is a drill a candidate runs. The
          counts are the real pool sizes, so a chip cannot promise
          one number and hand back another. */}
      <Group label="GK topic">
        {([
          ['any', 'Any'],
          ['mizoram', 'Mizoram'],
          ['current-affairs', 'Current affairs'],
          ['polity-constitution', 'Polity & constitution'],
          ['economy', 'Economy'],
          ['geography', 'Geography'],
          ['general-science', 'General science'],
          ['science-tech', 'Science & tech'],
          ['modern-indian-history', 'Modern Indian history'],
          ['art-culture', 'Art & culture'],
          ['general', 'General (mixed)'],
        ] as [GkTopicState, string][]).map(([v, label]) => (
          <Chip
            key={v}
            on={filters.gkTopic === v}
            count={countWith({ gkTopic: v })}
            onClick={() => set({ gkTopic: v })}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group label="Attempts">
        {([
          ['any', 'Any'], ['never', 'Never attempted'],
          ['wrong', 'Got wrong'], ['correct', 'Got right'],
        ] as [AttemptState, string][]).map(([v, label]) => (
          <Chip
            key={v}
            on={filters.attempt === v}
            count={countWith({ attempt: v })}
            onClick={() => set({ attempt: v })}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group label="Search">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="question or option text…"
          style={{
            font: 'inherit', fontSize: 13, padding: '5px 10px', borderRadius: 8,
            border: '1px solid var(--border, #dcdce3)', background: 'transparent',
            color: 'inherit', minWidth: 240,
          }}
        />
      </Group>

      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 12, borderTop: '1px solid var(--border, #eee)', paddingTop: 10,
          fontSize: 13, flexWrap: 'wrap',
        }}
      >
        <span>
          <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{matched}</strong> question
          {matched === 1 ? '' : 's'} match
          {' · '}
          <span style={{ opacity: 0.7 }}>
            {applyFilters(all, papers, { ...filters, answer: 'answered' }, progress).length} of them
            can be marked
          </span>
        </span>
        <span style={{ display: 'flex', gap: 10 }}>
          {dirty && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              style={{ font: 'inherit', fontSize: 12.5, background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline', color: 'inherit', padding: 0 }}
            >
              clear filters
            </button>
          )}
          {Object.keys(progress).length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear your attempt history for this bank? This cannot be undone.')) {
                  onResetProgress();
                }
              }}
              style={{ font: 'inherit', fontSize: 12.5, background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline', color: 'var(--bad, #c4462f)', padding: 0 }}
            >
              reset {Object.keys(progress).length} attempt{Object.keys(progress).length === 1 ? '' : 's'}
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
