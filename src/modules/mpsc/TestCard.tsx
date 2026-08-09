import type { TestDefinition } from '@/lib/mpscApi';

// ============================================
// TestCard — per components.md: kind pill (own hue per kind), mono spec
// string, title, one-line blurb, dashed rule, personal best, Start button.
// ============================================

const KIND_LABEL: Record<TestDefinition['kind'], string> = {
  real_paper: 'Real paper',
  full_sitting: 'Full sitting',
  sectional: 'Sectional',
  adaptive: 'Adaptive',
  sprint: 'Sprint',
};

const KIND_TOKEN: Record<TestDefinition['kind'], string> = {
  real_paper: '--pill-real-paper',
  full_sitting: '--pill-full-sitting',
  sectional: '--pill-sectional',
  adaptive: '--pill-adaptive',
  sprint: '--pill-sprint',
};

function blurbFor(test: TestDefinition): string {
  const f = test.filter;
  const parts: string[] = [];
  if (f.subject?.length) parts.push(f.subject.join(', '));
  if (f.year?.length) parts.push(f.year.join('/'));
  if (f.difficulty?.length) parts.push(f.difficulty.join('/'));
  return parts.length > 0 ? parts.join(' · ') : 'All questions in the bank';
}

interface TestCardProps {
  test: TestDefinition;
  personalBestScore?: number;
  onStart: (test: TestDefinition) => void;
  /** True while this card's questions are being sampled. */
  busy?: boolean;
}

export function TestCard({ test, personalBestScore, onStart, busy = false }: TestCardProps) {
  const minutes = Math.round(test.durationS / 60);
  const hue = `var(${KIND_TOKEN[test.kind]})`;

  return (
    <div className="rounded-lg p-4 flex flex-col gap-2" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `color-mix(in srgb, ${hue} 16%, transparent)`, color: hue }}
        >
          {KIND_LABEL[test.kind]}
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          {test.nQuestions} Q · {minutes} min
        </span>
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{test.title}</div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{blurbFor(test)}</div>
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {personalBestScore !== undefined ? `Best: ${personalBestScore}%` : 'Not attempted yet'}
        </span>
        <button
          type="button"
          onClick={() => onStart(test)}
          disabled={busy}
          className="text-xs px-3 py-1.5 rounded-md disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {busy ? 'Loading…' : 'Start'}
        </button>
      </div>
    </div>
  );
}
