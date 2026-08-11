import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePapersTree } from '@/modules/mpsc/usePapersTree';
import * as api from '@/lib/mpscApi';
import type { PapersTreeExamType, PapersTreeSitting } from '@/lib/mpscApi';
import type { McqBankQuestion } from '@/data/banks/types';
import { TestPlayer } from '@/modules/mpsc/TestPlayer';
import { savePaper } from '@/modules/mpsc/useAttemptState';
import { SkeletonBar, SkeletonRows } from '@/components/states/Skeleton';
import { EmptyState } from '@/components/states/StateMessage';
import { isPostTechnical, isPaperSubjectTechnical } from '@/lib/technicalPosts';

// Per-*paper* technical/specialist-subject filter — distinct from the
// per-*sitting* post filter (isPostTechnical, shared with the Question
// Bank tab — see src/lib/technicalPosts.ts). `post` is null on 70-91% of
// papers (see DEVLOG), so it can only ever gate a sliver of the bank.
// `paperSubject` is populated far more often and, critically, varies
// *within* a sitting: a "Technical" exam still has a GS/English/Aptitude
// paper alongside its subject-specific one, and hiding the whole sitting
// by post throws out the general paper too. This filters at the paper
// level instead, so a Junior Engineer sitting's GS paper stays visible
// even with technical papers hidden.

// ============================================
// Papers browse — the Jabreeze "Browse Papers" pane, ported from the design
// mockup (designs/Jabreeze - Redesign.dc.html, `isPapers` block, lines
// 522-574): a left "Exam tree" sidebar (hue cap + count per node) driving a
// main column of *sitting cards*, each listing its papers with Read + Test.
//
// Sourced from GET /api/papers/tree/ (exam type -> year -> sitting -> papers),
// which groups on the server using the same source_file heuristic the old
// client-side sittingKey() used. The design groups its tree by exam *name*
// (Mizoram Civil Service, State Tax Officer, ...); the live bank only carries
// examName="MPSC" for nearly everything, so the tree groups by exam *type*
// (Competitive / Departmental / Technical / ...) instead — the more useful
// axis given the real data. See DEVLOG for that deviation.
//
// Deviations from the mockup that are data gaps, not oversights:
//   - No per-paper answer-source pill (Official / Derived / Model). The tree
//     rows carry no answer_source, and deriving it per paper would be a
//     facets query per row — omitted rather than faked.
//   - No month chips / "held <date>": sittings carry a year, not a date.
// ============================================

const EXAM_HUES = ['--blue', '--gold', '--forest', '--info', '--indigo', '--plum', '--brown', '--green'];
function hueForExamType(index: number): string {
  return `var(${EXAM_HUES[index % EXAM_HUES.length]})`;
}

function papersUnder(et: PapersTreeExamType): number {
  return et.years.reduce((n, y) => n + y.sittings.reduce((m, s) => m + s.papers.length, 0), 0);
}

function paperName(p: PapersTreeSitting['papers'][number]): string {
  const subject = p.paperSubject || 'Paper';
  return p.paperNumber ? `${subject} — Paper ${p.paperNumber}` : subject;
}

// Best-effort exam name recovered from a paper's `id`, which is the raw
// source-PDF filename (see DEVLOG "Papers-tree grouping fixed" 2026-08-10).
// The live bank's `examName` field is "MPSC" for nearly everything (MPSC is
// the exam-hosting department, not the exam itself) and `post` is null for
// ~70% of papers, so the filename is the only place a real exam identity
// ("UDC Direct under Fisheries Deptt", "MCS Combined Preliminary Exam", ...)
// survives. These filenames are messy OCR-batch names — inconsistent casing,
// stray numbering, ".pdf.ocr" suffixes, unbalanced parens from OCR splits —
// so this is a heuristic cleanup, not a real parse. When cleanup can't
// recover something that reads like a name, it returns null rather than
// showing a mangled fragment (see CLAUDE.md: flag/omit, don't fabricate).
const MONTH_RE = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?';
const PAPER_LABEL_RE = new RegExp(
  '(GS|Law|General Studies|General English(?:ish)?|Technical(?: Subject)?|Home Science|Engineering|Departmental|Series-[A-Z])?\\s*[-,]?\\s*Paper\\s*[-–]?\\s*[IVXLCDM]+\\b',
  'gi',
);

function cleanExamNameCandidate(raw: string): string | null {
  let s = raw;
  const isSlug = /^[a-z0-9-]+$/.test(s);
  if (isSlug) s = s.replace(/-/g, ' ');
  s = s.replace(/(\.(pdf|ocr|pd))+\.?$/i, '');
  s = s.replace(/^\d+\.\s*/, '');
  s = s.trim().replace(/^[.\s]+|[.\s]+$/g, '');
  s = s.replace(new RegExp(`[-,]?\\s*${MONTH_RE}[-,]?\\s*\\d{4}`, 'gi'), '');
  s = s.replace(/[-,]?\s*(19|20)\d{2}/g, '');
  s = s.replace(PAPER_LABEL_RE, '');
  s = s.replace(/\bPaper\s*[-–]?\s*\d+\b/gi, '');
  s = s.replace(/\(\s*\)/g, '');
  s = s.replace(/\s{2,}/g, ' ').trim().replace(/^[\s\-.,()]+|[\s\-.,()]+$/g, '');

  const openIdx = s.indexOf('(');
  if (openIdx !== -1 && !s.slice(openIdx).includes(')')) s = s.slice(0, openIdx).trim();
  const closeIdx = s.indexOf(')');
  if (closeIdx !== -1 && !s.slice(0, closeIdx).includes('(')) s = s.slice(closeIdx + 1).trim();
  s = s.replace(/^[\s\-.,()]+|[\s\-.,()]+$/g, '');

  if (s.length < 5 || /^(paper|account)$/i.test(s)) return null;
  const words = s.split(/\s+/);
  const junkWords = words.filter((w) => w.replace(/\W/g, '').length <= 2).length;
  if (junkWords / words.length > 0.5) return null;
  if (isSlug) s = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return s;
}

// Picks the most informative candidate across the sitting's papers (longest
// valid cleanup wins — a fuller filename usually means more of the real
// title survived OCR/extraction intact).
function sittingExamName(s: PapersTreeSitting): string | null {
  let best: string | null = null;
  for (const p of s.papers) {
    const candidate = cleanExamNameCandidate(p.id);
    if (candidate && (!best || candidate.length > best.length)) best = candidate;
  }
  return best;
}

export default function PapersPage() {
  const { tree, loading } = usePapersTree();
  const examTypes = useMemo(() => tree?.examTypes ?? [], [tree]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Selection is a year within an exam type — the mockup's tree selects a year
  // node and the main pane shows every sitting held that year.
  const [selected, setSelected] = useState<{ examType: string; year: number | null } | null>(null);
  // Filter by Technical / Non-Technical posts
  const [postFilter, setPostFilter] = useState<'all' | 'technical' | 'non-technical'>('all');
  // Hide technical/specialist-*subject* papers (Engineering, Veterinary, Law,
  // Rules...) while keeping GK/GS/English/Maths/Aptitude papers, even within
  // an otherwise-technical sitting. See isPaperSubjectTechnical() above for
  // why this is a separate axis from postFilter.
  const [hideTechnicalPapers, setHideTechnicalPapers] = useState(false);

  // An inline sitting launched from a paper's "Test" button — sampled live,
  // played in the same shell as the Tests page's player.
  const [player, setPlayer] = useState<{ title: string; targetId: string; questions: McqBankQuestion[]; durationS: number } | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Auto-open + select the first exam type / year so the pane is never a bare
  // "select something" placeholder (the whole point of this rebuild).
  useMemo(() => {
    if (examTypes.length > 0 && selected === null) {
      // Land on the richest exam type, not whatever the API returns first
      // (which is the empty "Unspecified" bucket with a single paper).
      const first = [...examTypes].sort((a, b) => papersUnder(b) - papersUnder(a))[0];
      setExpanded(new Set([first.examType]));
      if (first.years.length > 0) {
        setSelected({ examType: first.examType, year: first.years[0].year });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examTypes.length]);

  const toggle = (examType: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(examType)) next.delete(examType);
      else next.add(examType);
      return next;
    });

  const selectedExamType = selected ? examTypes.find((e) => e.examType === selected.examType) ?? null : null;
  const selectedYear = selectedExamType && selected
    ? selectedExamType.years.find((y) => y.year === selected.year) ?? null
    : null;

  // The papers actually shown for a sitting once the subject filter applies —
  // used both to render rows and to decide whether a sitting has anything
  // left to show at all.
  const visiblePapers = (s: PapersTreeSitting) =>
    hideTechnicalPapers ? s.papers.filter((p) => !isPaperSubjectTechnical(p.paperSubject)) : s.papers;

  // Filter sittings based on post filter + subject filter
  const filterSittings = (sittings: PapersTreeSitting[]) =>
    sittings.filter((s) => {
      if (postFilter !== 'all') {
        const isTechnical = isPostTechnical(s.post);
        if ((postFilter === 'technical') !== isTechnical) return false;
      }
      if (hideTechnicalPapers && visiblePapers(s).length === 0) return false;
      return true;
    });

  const startPaperTest = async (p: PapersTreeSitting['papers'][number]) => {
    setTesting(p.id);
    setTestError(null);
    try {
      const targetId = `paper-${p.id}`;
      const { questions } = await api.sampleBankQuestions({ paperId: [p.id] }, p.questionCount || 100);
      if (questions.length === 0) {
        setTestError(`"${paperName(p)}" has no MCQ questions to test — it may be a descriptive paper.`);
        return;
      }
      savePaper(targetId, questions);
      setPlayer({ title: paperName(p), targetId, questions, durationS: questions.length * 60 });
    } catch (e) {
      setTestError(e instanceof Error ? e.message : 'Could not load this paper');
    } finally {
      setTesting(null);
    }
  };

  if (player) {
    return (
      <TestPlayer
        title={player.title}
        targetId={player.targetId}
        questions={player.questions}
        durationS={player.durationS}
        negative={0}
        onExit={() => setPlayer(null)}
      />
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      <aside
        className="w-[250px] shrink-0 overflow-y-auto scroll-panel px-4 py-[18px]"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="mb-3">
          <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Post type
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'technical', 'non-technical'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setPostFilter(filter as typeof postFilter)}
                className="text-[11px] px-2 py-1.5 rounded-[5px] font-medium transition-colors"
                style={{
                  background: postFilter === filter ? 'var(--accent)' : 'transparent',
                  color: postFilter === filter ? 'var(--on-accent)' : 'var(--text-secondary)',
                  border: postFilter === filter ? 'none' : '1px solid var(--border)',
                }}
              >
                {filter === 'all' ? 'All' : filter === 'technical' ? 'Technical' : 'Non-Tech'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={hideTechnicalPapers}
              onChange={(e) => setHideTechnicalPapers(e.target.checked)}
            />
            Hide technical-subject papers
          </label>
          <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Keeps GK / GS / English / Maths / Aptitude papers even in a technical sitting
          </div>
        </div>

        <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Exam tree
        </div>
        {loading && (
          <div className="flex flex-col gap-2.5" aria-label="Loading exam tree">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonBar key={i} w={`${88 - i * 6}%`} h={15} delay={i * 0.08} />
            ))}
          </div>
        )}
        {!loading && examTypes.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No papers found.</div>
        )}
        <div className="flex flex-col gap-[3px]">
          {examTypes.map((et, i) => {
            const hue = hueForExamType(i);
            const open = expanded.has(et.examType);
            return (
              <div key={et.examType || '(none)'}>
                <button
                  type="button"
                  onClick={() => toggle(et.examType)}
                  className="w-full flex items-center gap-2 px-[9px] py-[7px] rounded-[7px]"
                >
                  <span className="w-[3px] h-[15px] rounded-sm shrink-0" style={{ background: hue }} />
                  <span className="text-xs font-semibold flex-1 min-w-0 truncate text-left" style={{ color: 'var(--text-primary)' }}>
                    {et.examType || 'Unspecified'}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{papersUnder(et)}</span>
                </button>
                {open &&
                  et.years.map((y) => {
                    const isSel = selected?.examType === et.examType && selected?.year === y.year;
                    const count = y.sittings.reduce((m, s) => m + s.papers.length, 0);
                    return (
                      <button
                        key={`${et.examType}|${y.year}`}
                        type="button"
                        onClick={() => setSelected({ examType: et.examType, year: y.year })}
                        className="w-full flex items-center gap-2 pl-[22px] pr-[9px] py-[6px] rounded-[7px]"
                        style={{ background: isSel ? 'var(--accent-soft)' : 'transparent' }}
                      >
                        <span
                          className="text-xs flex-1 min-w-0 truncate text-left"
                          style={{ color: isSel ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isSel ? 600 : 400 }}
                        >
                          {y.year ?? 'Undated'}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{count}</span>
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto scroll-panel px-6 py-5">
        {testError && (
          <div
            className="text-sm rounded-lg p-3 mb-4"
            style={{ background: 'color-mix(in srgb, var(--bad) 12%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--bad)' }}
          >
            {testError}{' '}
            <button type="button" onClick={() => setTestError(null)} className="underline">Dismiss</button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-3" aria-label="Loading papers">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-xl p-[16px_18px]"
                style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
              >
                <SkeletonRows rows={2} />
              </div>
            ))}
          </div>
        )}

        {!loading && examTypes.length === 0 && (
          <EmptyState
            heading="No papers found"
            body="The papers tree came back empty. If this looks wrong, it's worth checking the source rather than assuming there are no papers."
          />
        )}

        {!selectedYear && !loading && examTypes.length > 0 && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Pick an exam and year from the tree to see its papers.
          </div>
        )}

        {selectedYear && (
          <>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {selected?.examType || 'Unspecified'} →
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedYear.year ?? 'Undated'}
              </span>
              <div className="flex-1" />
              <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {selectedYear.sittings.length} sitting{selectedYear.sittings.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {filterSittings(selectedYear.sittings).map((s) => {
                const examName = sittingExamName(s);
                const fallbackName = s.post || s.examName;
                const secondary = examName && s.post && !examName.toLowerCase().includes(s.post.toLowerCase())
                  ? s.post
                  : null;
                const papers = visiblePapers(s);
                const hiddenCount = s.papers.length - papers.length;
                const totalQuestions = hideTechnicalPapers
                  ? papers.reduce((n, p) => n + p.questionCount, 0)
                  : s.totalQuestions;
                return (
                <div
                  key={s.key}
                  className="rounded-xl p-[16px_18px]"
                  style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-[9px] flex-wrap mb-2.5">
                    {s.examType && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.04em] px-[7px] py-0.5 rounded-[5px]"
                        style={{ border: `1px solid ${hueForExamType(examTypes.findIndex((e) => e.examType === s.examType))}`, color: hueForExamType(examTypes.findIndex((e) => e.examType === s.examType)) }}
                      >
                        {s.examType}
                      </span>
                    )}
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {examName ?? fallbackName}
                    </span>
                    {secondary && (
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>· {secondary}</span>
                    )}
                    {s.year != null && (
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>· {s.year}</span>
                    )}
                    <span className="ml-auto text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {totalQuestions} Qs
                    </span>
                  </div>
                  {hiddenCount > 0 && (
                    <div className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                      {hiddenCount} technical-subject paper{hiddenCount === 1 ? '' : 's'} hidden
                    </div>
                  )}
                  <div className="flex flex-col">
                    {papers.map((p) => (
                      <div
                        key={p.id}
                        className="grid items-center gap-3 py-[9px]"
                        style={{
                          gridTemplateColumns: 'minmax(0, 1fr) 72px auto',
                          borderTop: '1px dashed var(--border)',
                        }}
                      >
                        <span className="text-[13px] font-medium min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>
                          {paperName(p)}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {p.questionCount} Qs
                        </span>
                        <span className="flex gap-1.5 justify-end">
                          <Link
                            to={`/mpsc?tab=browser&paperId=${encodeURIComponent(p.id)}`}
                            className="text-[11px] px-2.5 py-[5px] rounded-[7px]"
                            style={{ border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-primary)' }}
                          >
                            Read
                          </Link>
                          <button
                            type="button"
                            onClick={() => startPaperTest(p)}
                            disabled={testing === p.id}
                            className="text-[11px] px-2.5 py-[5px] rounded-[7px] disabled:opacity-50"
                            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                          >
                            {testing === p.id ? '…' : 'Test'}
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
