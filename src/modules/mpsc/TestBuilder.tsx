import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { TestKind } from '@/lib/mpscApi';
import { FilterRail } from './FilterRail';
import { emptyFilters, useBankFacets, type MpscFilters } from './useMpscData';

// ============================================
// TestBuilder — six label/value rows (Source, Filters, Questions, Duration,
// Marking, Order) + a live pool count that updates as filters change. Per
// components.md, the pool count is "the only feedback that the filter did
// anything" — wired to the `total` field GET /api/mpsc/questions already
// returns (not /facets, which is per-dimension, not a single pool total).
// Reuses <FilterRail/> verbatim for the Filters row rather than building a
// second filter UI.
// ============================================

const KIND_OPTIONS: { value: TestKind; label: string }[] = [
  { value: 'real_paper', label: 'Real paper' },
  { value: 'full_sitting', label: 'Full sitting' },
  { value: 'sectional', label: 'Sectional' },
  { value: 'adaptive', label: 'Adaptive' },
  { value: 'sprint', label: 'Sprint' },
];

const NEGATIVE_OPTIONS = [0, 0.25, 0.33, 0.5];

const rowLabelCls = 'text-xs font-medium w-24 shrink-0 pt-1.5';
const inputCls = 'px-2.5 py-1.5 rounded-md text-sm flex-1';
const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;

interface TestBuilderProps {
  onCreated: () => void;
}

export function TestBuilder({ onCreated }: TestBuilderProps) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<TestKind>('sprint');
  const [filters, setFilters] = useState<MpscFilters>(emptyFilters);
  const [nQuestions, setNQuestions] = useState(25);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [negative, setNegative] = useState(0);
  const [shuffle, setShuffle] = useState(true);
  const [poolCount, setPoolCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const facets = useBankFacets(filters);

  useEffect(() => {
    let cancelled = false;
    setPoolCount(null);
    api.listBankQuestions({ ...filters, limit: 1, offset: 0 })
      .then((r) => {
        if (!cancelled) setPoolCount(r.total);
      })
      .catch(() => {
        if (!cancelled) setPoolCount(0);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const patchFilters = (patch: Partial<MpscFilters>) => setFilters((f) => ({ ...f, ...patch }));

  const generate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createTest({
        title: title.trim(),
        kind,
        filter: filters,
        nQuestions,
        durationS: durationMinutes * 60,
        negative,
        shuffle,
        isPublished: false,
      });
      setTitle('');
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create test');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New test</div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Source</div>
        <div className="flex-1 text-sm pt-1.5" style={{ color: 'var(--text-primary)' }}>MPSC Old Questions</div>
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Title</div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Combined 2019 · History Sprint"
          className={inputCls}
          style={inputStyle}
        />
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Kind</div>
        <select value={kind} onChange={(e) => setKind(e.target.value as TestKind)} className={inputCls} style={inputStyle}>
          {KIND_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="flex-1">
          <FilterRail filters={filters} onChange={patchFilters} facets={facets} />
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Questions</div>
        <input
          type="number"
          min={1}
          value={nQuestions}
          onChange={(e) => setNQuestions(Math.max(1, Number(e.target.value) || 1))}
          className={inputCls}
          style={inputStyle}
        />
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Duration</div>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value) || 1))}
            className={inputCls}
            style={inputStyle}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>minutes</span>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Marking</div>
        <select value={negative} onChange={(e) => setNegative(Number(e.target.value))} className={inputCls} style={inputStyle}>
          {NEGATIVE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n === 0 ? 'No negative marking' : `-${n} per wrong answer`}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 items-start">
        <div className={rowLabelCls} style={{ color: 'var(--text-secondary)' }}>Order</div>
        <label className="flex-1 flex items-center gap-1.5 text-sm pt-1.5" style={{ color: 'var(--text-primary)' }}>
          <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
          Shuffle questions
        </label>
      </div>

      {error && <div className="text-xs" style={{ color: 'var(--bad)' }}>{error}</div>}

      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
        <div className="text-[18px] font-mono" style={{ color: 'var(--accent)' }}>
          {poolCount === null ? '…' : poolCount.toLocaleString()} in pool
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={saving || poolCount === 0}
          className="text-sm px-3 py-1.5 rounded-md disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {saving ? 'Generating…' : 'Generate test'}
        </button>
      </div>
    </div>
  );
}
