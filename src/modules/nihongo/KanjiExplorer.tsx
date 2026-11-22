import { useEffect, useMemo, useRef, useState } from 'react';
import { loadKanjiDic } from '@/data/nihongo/dictionaryLoader';
import type { DictKanjiEntry } from '@/data/nihongo/dictionary-types';
import {
  fetchKanjiApiDetail,
  fetchKanjiApiWords,
  fetchKanjiByReading,
  fetchKanjiVgStrokes,
   fetchTatoebaSentences,
  romajiToHiragana,
  speakJapanese,
  type KanjiApiCompound,
  type KanjiApiDetail,
  type TatoebaSentence,
} from '@/data/nihongo/freeApis';

type JlptFilter = 'all' | '5' | '4' | '3' | '2' | '1';

const JLPT_TABS: { key: JlptFilter; label: string }[] = [
  { key: '5', label: 'JLPT N5' },
  { key: '4', label: 'JLPT N4' },
  { key: '3', label: 'JLPT N3' },
  { key: '2', label: 'JLPT N2' },
  { key: '1', label: 'JLPT N1' },
  { key: 'all', label: 'All Kanji' },
];

// Old 4-level JLPT numbers in KANJIDIC2 map 4->N5, 3->N4, 2->N3/N2, 1->N1
function matchesJlpt(entry: DictKanjiEntry, filter: JlptFilter): boolean {
  if (filter === 'all') return true;
  if (entry.jlpt == null) return false;
  if (filter === '5') return entry.jlpt === 5 || (entry.jlpt === 4 && (entry.grade ?? 9) <= 2);
  if (filter === '4') return entry.jlpt === 4 || (entry.jlpt === 3 && (entry.grade ?? 9) <= 4);
  if (filter === '3') return entry.jlpt === 3 || (entry.jlpt === 2 && (entry.grade ?? 9) <= 6);
  if (filter === '2') return entry.jlpt === 2;
  if (filter === '1') return entry.jlpt === 1;
  return true;
}

function StrokeOrderAnimator({ literal }: { literal: string }) {
  const [paths, setPaths] = useState<string[] | null>(null);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let cancelled = false;
    clearTimeout(timerRef.current);
    setPaths(null);
    setError(false);
    setRevealed(0);

    fetchKanjiVgStrokes(literal)
      .then((p) => {
        if (cancelled) return;
        setPaths(p);
        setRevealed(p.length);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [literal]);

  function playAnimation(from = 0) {
    if (!paths || paths.length === 0) return;
    clearTimeout(timerRef.current);
    setRevealed(from);
    const step = (next: number) => {
      timerRef.current = setTimeout(() => {
        setRevealed(next);
        if (next < paths.length) step(next + 1);
      }, 480);
    };
    step(from + 1);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl flex items-center justify-center relative overflow-hidden"
        style={{
          width: 148,
          height: 148,
          background: 'var(--bg-app)',
          border: '1px solid var(--border)',
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '50% 50%',
          backgroundPosition: 'center',
        }}
      >
        {paths && paths.length > 0 ? (
          <svg viewBox="0 0 109 109" width={136} height={136}>
            {paths.map((d, i) => (
              <path
                key={`ghost-${i}`}
                d={d}
                fill="none"
                stroke="var(--border)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {paths.map((d, i) => (
              <path
                key={`stroke-${i}`}
                d={d}
                fill="none"
                stroke={i < revealed ? 'var(--accent)' : 'transparent'}
                strokeWidth={3.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={i < revealed ? 0 : 1}
                style={{
                  transition: i === revealed - 1 ? 'stroke-dashoffset 380ms ease-out' : 'none',
                }}
              />
            ))}
          </svg>
        ) : (
          <span className="text-6xl font-serif" style={{ color: 'var(--text-primary)' }}>
            {literal}
          </span>
        )}
      </div>

      {paths && paths.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => playAnimation(0)}
            className="px-2.5 py-1 rounded-md font-medium"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            ▶ Animate
          </button>
          <button
            type="button"
            onClick={() => {
              clearTimeout(timerRef.current);
              setRevealed((r) => (r >= paths.length ? 1 : r + 1));
            }}
            className="px-2 py-1 rounded-md"
            style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Step
          </button>
          <span className="font-mono text-[11px] ml-1" style={{ color: 'var(--text-secondary)' }}>
            {Math.min(revealed, paths.length)}/{paths.length}
          </span>
        </div>
      )}
      {error && (
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          KanjiVG stroke SVG unavailable offline
        </span>
      )}
    </div>
  );
}

export function KanjiExplorer() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [kanjiList, setKanjiList] = useState<DictKanjiEntry[]>([]);
  const [jlptFilter, setJlptFilter] = useState<JlptFilter>('5');
  const [query, setQuery] = useState('');
  const [readingQuery, setReadingQuery] = useState('');
  const [readingMatches, setReadingMatches] = useState<string[] | null>(null);
  const [readingLoading, setReadingLoading] = useState(false);

  const [selected, setSelected] = useState<DictKanjiEntry | null>(null);
  const [liveDetail, setLiveDetail] = useState<KanjiApiDetail | null>(null);
  const [compounds, setCompounds] = useState<KanjiApiCompound[]>([]);
  const [sentences, setSentences] = useState<TatoebaSentence[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKanjiDic()
      .then((dic) => {
        if (cancelled) return;
        setKanjiList(dic.kanji);
        const first = dic.kanji.find((k) => k.literal === '日') ?? dic.kanji[0] ?? null;
        setSelected(first);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLiveLoading(true);
    setLiveDetail(null);
    setCompounds([]);
    setSentences([]);

    Promise.allSettled([
      fetchKanjiApiDetail(selected.literal),
      fetchKanjiApiWords(selected.literal, 12),
      fetchTatoebaSentences(selected.literal, { limit: 4 }),
    ]).then(([detailRes, wordsRes, sentRes]) => {
      if (cancelled) return;
      if (detailRes.status === 'fulfilled') setLiveDetail(detailRes.value);
      if (wordsRes.status === 'fulfilled') setCompounds(wordsRes.value);
      if (sentRes.status === 'fulfilled') setSentences(sentRes.value);
      setLiveLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selected]);

  async function runReadingLookup() {
    const raw = readingQuery.trim();
    if (!raw) {
      setReadingMatches(null);
      return;
    }
    const kana = /^[a-zA-Z]+$/.test(raw) ? romajiToHiragana(raw) : raw;
    setReadingLoading(true);
    try {
      const res = await fetchKanjiByReading(kana);
      setReadingMatches([...new Set([...res.main_kanji, ...res.name_kanji])]);
    } catch {
      setReadingMatches([]);
    } finally {
      setReadingLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qKana = /^[a-z]+$/.test(q) ? romajiToHiragana(q) : '';
    const readingSet = readingMatches ? new Set(readingMatches) : null;

    return kanjiList.filter((k) => {
      if (readingSet && !readingSet.has(k.literal)) return false;
      if (!readingSet && !matchesJlpt(k, jlptFilter)) return false;
      if (!q) return true;
      if (k.literal === q) return true;
      if (k.meanings.some((m) => m.toLowerCase().includes(q))) return true;
      if (k.onReadings.some((r) => r.toLowerCase().includes(q) || (qKana && r.includes(qKana)))) return true;
      if (k.kunReadings.some((r) => r.toLowerCase().includes(q) || (qKana && r.includes(qKana)))) return true;
      return false;
    });
  }, [kanjiList, jlptFilter, query, readingMatches]);

  if (status === 'loading') {
    return (
      <div className="surface rounded-lg p-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Loading KANJIDIC2 reference library…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="surface rounded-lg p-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Could not load KANJIDIC2 dataset.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Selected Kanji Studio Inspector */}
      {selected && (
        <div className="surface rounded-xl p-5 flex flex-col gap-4" style={{ border: '1px solid var(--accent)' }}>
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <StrokeOrderAnimator literal={selected.literal} />

            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selected.literal} — {selected.meanings.join(', ')}
                  </h2>
                  <button
                    type="button"
                    onClick={() => speakJapanese(selected.kunReadings[0]?.replace(/[.-]/g, '') || selected.onReadings[0] || selected.literal)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    title="Hear pronunciation (Web Speech API)"
                  >
                    🔊 Speak
                  </button>
                </div>
                <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  KanjiVG + KanjiAPI.dev + Tatoeba v1
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {selected.strokeCount != null && (
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                    {selected.strokeCount} strokes
                  </span>
                )}
                {(liveDetail?.jlpt ?? selected.jlpt) != null && (
                  <span className="px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    JLPT N{liveDetail?.jlpt ?? selected.jlpt}
                  </span>
                )}
                {(liveDetail?.grade ?? selected.grade) != null && (
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                    Grade {liveDetail?.grade ?? selected.grade}
                  </span>
                )}
                {liveDetail?.heisig_en && (
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-primary)' }}>
                    Heisig keyword: <b>{liveDetail.heisig_en}</b>
                  </span>
                )}
                {liveDetail?.freq_mainichi_shinbun && (
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                    Newspaper freq #{liveDetail.freq_mainichi_shinbun}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-1">
                <div className="p-2.5 rounded-lg" style={{ background: 'var(--bg-panel-elev)' }}>
                  <div className="font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                    On’yomi (音読み · Chinese-derived)
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selected.onReadings.length > 0 ? selected.onReadings.join(' ・ ') : '—'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: 'var(--bg-panel-elev)' }}>
                  <div className="font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                    Kun’yomi (訓読み · Native Japanese)
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selected.kunReadings.length > 0 ? selected.kunReadings.join(' ・ ') : '—'}
                  </div>
                </div>
              </div>

              {liveDetail && liveDetail.name_readings.length > 0 && (
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <b>Nanori (名乗り · Name readings):</b> {liveDetail.name_readings.slice(0, 10).join('、')}
                </div>
              )}
            </div>
          </div>

          {/* Live Compounds (Jukugo) from KanjiAPI.dev */}
          <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Live Compound Words (熟語 · KanjiAPI.dev)
              </span>
              {liveLoading && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Fetching live API data…
                </span>
              )}
            </div>
            {compounds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {compounds.map((c, idx) => (
                  <div
                    key={`${c.written}-${idx}`}
                    className="rounded-lg px-3 py-2 flex items-start justify-between gap-2"
                    style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {c.written}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--accent)' }}>
                          {c.pronounced}
                        </span>
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }} title={c.glosses.join('; ')}>
                        {c.glosses.join('; ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakJapanese(c.written)}
                      className="text-xs px-1.5 py-1 rounded shrink-0"
                      style={{ color: 'var(--text-secondary)' }}
                      title="Pronounce word"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            ) : !liveLoading ? (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                No compound words returned.
              </p>
            ) : null}
          </div>

          {/* Live Tatoeba Sentences containing this Kanji */}
          {sentences.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="font-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Live Native Context Sentences (Tatoeba API v1)
              </div>
              <div className="flex flex-col gap-1.5">
                {sentences.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-xs"
                    style={{ background: 'var(--bg-panel-elev)' }}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {s.jp}
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>{s.en}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakJapanese(s.jp)}
                      className="px-2 py-1 rounded text-xs shrink-0"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {JLPT_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setReadingMatches(null);
                setReadingQuery('');
                setJlptFilter(t.key);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: !readingMatches && jlptFilter === t.key ? 'var(--accent-soft)' : 'var(--bg-panel)',
                color: !readingMatches && jlptFilter === t.key ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${!readingMatches && jlptFilter === t.key ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by meaning, kanji, or reading (e.g. sun, 水, みず, mizu)…"
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-2">
            <input
              value={readingQuery}
              onChange={(e) => setReadingQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runReadingLookup()}
              placeholder="Live KanjiAPI reading lookup (e.g. こう or kou)…"
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={runReadingLookup}
              className="px-3 py-2 rounded-lg text-xs font-semibold shrink-0"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              {readingLoading ? '…' : 'Lookup Reading'}
            </button>
            {readingMatches && (
              <button
                type="button"
                onClick={() => {
                  setReadingMatches(null);
                  setReadingQuery('');
                }}
                className="px-2.5 py-2 rounded-lg text-xs"
                style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          Showing {Math.min(filtered.length, 160)} of {filtered.length} matching kanji (click any tile to animate strokes &amp; fetch live compounds)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {filtered.slice(0, 160).map((k) => {
            const isSel = selected?.literal === k.literal;
            return (
              <button
                key={k.literal}
                type="button"
                onClick={() => setSelected(k)}
                className="surface rounded-xl p-3 text-left flex items-start gap-3 transition-transform hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSel ? 'var(--accent-soft)' : 'var(--bg-panel)',
                }}
              >
                <span className="text-3xl font-serif leading-none shrink-0" style={{ color: 'var(--text-primary)' }}>
                  {k.literal}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {k.meanings[0] ?? '—'}
                  </div>
                  <div className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {k.onReadings[0] || k.kunReadings[0] || ''}
                  </div>
                  <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                    {k.strokeCount ?? '?'} str{k.jlpt ? ` · N${k.jlpt}` : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
