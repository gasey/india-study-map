import { useEffect, useState } from 'react';
import {
  fetchKanjiApiDetail,
  fetchTatoebaSentences,
  romajiToHiragana,
  speakJapanese,
  type KanjiApiDetail,
  type TatoebaSentence,
} from '@/data/nihongo/freeApis';

const QUICK_CHIPS = [
  { label: '食べる (eat)', q: '食べる' },
  { label: '〜ている (progressive)', q: 'ている' },
  { label: '〜なければならない (must)', q: 'なければならない' },
  { label: '〜たことがある (experience)', q: 'たことがある' },
  { label: '〜ほうがいい (advice)', q: 'ほうがいい' },
  { label: '〜つもり (intention)', q: 'つもり' },
  { label: '図書館 (library)', q: '図書館' },
  { label: '電車 (train)', q: '電車' },
  { label: '仕事 (work)', q: '仕事' },
  { label: '日本語 (Japanese)', q: '日本語' },
];

const SCRAMBLE_DRILLS = [
  { tokens: ['私', 'は', '毎日', '日本語', 'を', '勉強します'], reading: 'わたしはまいにちにほんごをべんきょうします', en: 'I study Japanese every day.' },
  { tokens: ['明日', '友達', 'と', '映画', 'を', '見に行きます'], reading: 'あしたともだちとえいがをみにいきます', en: 'Tomorrow I will go to see a movie with a friend.' },
  { tokens: ['この', '図書館', 'は', 'とても', '静か', 'です'], reading: 'このとしょかんはとてもしずかです', en: 'This library is very quiet.' },
  { tokens: ['電車', 'に', '乗る', '前', 'に', '切符', 'を', '買います'], reading: 'でんしゃにのるまえにきっぷをかいます', en: 'Before boarding the train, I buy a ticket.' },
  { tokens: ['日本', 'へ', '行った', 'こと', 'が', 'ありますか'], reading: 'にほんへいったことがありますか', en: 'Have you ever been to Japan?' },
  { tokens: ['空', 'が', '暗い', 'から', '雨', 'が', '降りそうです'], reading: 'そらがくらいからあめがふりそうです', en: 'Because the sky is dark, it looks like it will rain.' },
];

function isKanjiChar(ch: string): boolean {
  return /\p{Script=Han}/u.test(ch);
}

export function SentenceLab({ initialQuery = '日本語' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [useIme, setUseIme] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [sentences, setSentences] = useState<TatoebaSentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Instant Kanji popover inside any sentence
  const [inspectedKanji, setInspectedKanji] = useState<KanjiApiDetail | null>(null);
  const [kanjiLoading, setKanjiLoading] = useState(false);

  // Sentence order drill state
  const [drillIdx, setDrillIdx] = useState(0);
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const drill = SCRAMBLE_DRILLS[drillIdx];

  useEffect(() => {
    const indices = drill.tokens.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setPickedIndices([]);
  }, [drillIdx, drill.tokens]);

  async function runSearch(searchTerm: string, onlyAudio = audioOnly) {
    const raw = searchTerm.trim();
    if (!raw) return;
    const effective = useIme && /^[a-zA-Z\s-]+$/.test(raw) ? romajiToHiragana(raw) : raw;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTatoebaSentences(effective, { audioOnly: onlyAudio, limit: 12 });
      setSentences(res);
    } catch (e) {
      setError((e as Error)?.message ?? 'Could not reach Tatoeba v1 API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runSearch(initialQuery, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  async function inspectChar(ch: string) {
    setKanjiLoading(true);
    try {
      const detail = await fetchKanjiApiDetail(ch);
      setInspectedKanji(detail);
    } catch {
      setInspectedKanji(null);
    } finally {
      setKanjiLoading(false);
    }
  }

  const convertedKana = useIme && query.trim() ? romajiToHiragana(query.trim()) : '';
  const assembled = pickedIndices.map((i) => drill.tokens[i]).join('');
  const targetJoined = drill.tokens.join('');
  const isComplete = pickedIndices.length === drill.tokens.length;
  const isCorrect = isComplete && assembled === targetJoined;

  return (
    <div className="flex flex-col gap-6">
      {/* Live Tatoeba Sentence Corpus Explorer */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
              Live API · Tatoeba v1 Corpus (CC BY 2.0 FR) + Web Speech TTS
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Native Context Sentence &amp; Listening Lab
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Search real Japanese sentences by word or grammar pattern. Tap any kanji inside a sentence to inspect its readings live via KanjiAPI.dev.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
            placeholder={useIme ? 'Type romaji (e.g. taberu, densha, toshokan)…' : 'Enter Japanese word, grammar pattern, or kanji…'}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button
            type="button"
            onClick={() => runSearch(query)}
            className="px-4 py-2 rounded-lg text-xs font-semibold shrink-0"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {loading ? 'Searching…' : 'Search Tatoeba'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={useIme}
              onChange={(e) => setUseIme(e.target.checked)}
            />
            <span>Romaji → Hiragana IME input</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={audioOnly}
              onChange={(e) => {
                setAudioOnly(e.target.checked);
                void runSearch(query, e.target.checked);
              }}
            />
            <span>Verified audio sentences only</span>
          </label>
          {useIme && convertedKana && (
            <span className="px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              IME → {convertedKana}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((c) => (
            <button
              key={c.q}
              type="button"
              onClick={() => {
                setQuery(c.q);
                void runSearch(c.q);
              }}
              className="px-2.5 py-1 rounded-full text-xs transition-colors"
              style={{
                background: query === c.q ? 'var(--accent-soft)' : 'var(--bg-panel-elev)',
                color: query === c.q ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${query === c.q ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Instant Kanji Inspector Popover */}
        {(kanjiLoading || inspectedKanji) && (
          <div
            className="rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--accent)' }}
          >
            {kanjiLoading ? (
              <span style={{ color: 'var(--text-secondary)' }}>Inspecting kanji via KanjiAPI.dev…</span>
            ) : inspectedKanji ? (
              <div className="flex items-center gap-3 flex-wrap flex-1">
                <span className="text-2xl font-serif font-bold" style={{ color: 'var(--accent)' }}>
                  {inspectedKanji.kanji}
                </span>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {inspectedKanji.meanings.join(', ')}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    On: {inspectedKanji.on_readings.join('・') || '—'} &nbsp;|&nbsp; Kun: {inspectedKanji.kun_readings.join('・') || '—'} &nbsp;|&nbsp; {inspectedKanji.stroke_count} strokes
                    {inspectedKanji.jlpt ? ` · JLPT N${inspectedKanji.jlpt}` : ''}
                    {inspectedKanji.heisig_en ? ` · Heisig "${inspectedKanji.heisig_en}"` : ''}
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setInspectedKanji(null)}
              className="px-2 py-1 rounded"
              style={{ color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--bg-panel-elev)', color: 'var(--bad)' }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {sentences.map((s) => (
            <div
              key={s.id}
              className="rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-base font-medium leading-relaxed flex flex-wrap items-baseline" style={{ color: 'var(--text-primary)' }}>
                  {[...s.jp].map((ch, idx) =>
                    isKanjiChar(ch) ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => inspectChar(ch)}
                        className="hover:underline px-0.5 rounded transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        title={`Inspect kanji ${ch}`}
                      >
                        {ch}
                      </button>
                    ) : (
                      <span key={idx}>{ch}</span>
                    ),
                  )}
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {s.en}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => speakJapanese(s.jp, 0.95)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  title="Listen at normal speed (1.0×)"
                >
                  🔊 1.0×
                </button>
                <button
                  type="button"
                  onClick={() => speakJapanese(s.jp, 0.65)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium"
                  style={{ background: 'var(--bg-panel)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  title="Listen at slow study speed (0.65×)"
                >
                  🐢 0.65×
                </button>
              </div>
            </div>
          ))}
          {!loading && sentences.length === 0 && !error && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No sentences found for that query. Try a root verb or kanji (e.g. 食べる, 電車, 勉強).
            </p>
          )}
        </div>
      </div>

      {/* Interactive SOV Sentence Builder Dojo */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
              Interactive Drill · SOV Particle &amp; Word Order Dojo ({drillIdx + 1} / {SCRAMBLE_DRILLS.length})
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Assemble the Japanese sentence: &ldquo;{drill.en}&rdquo;
            </h3>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPickedIndices([])}
              className="px-2.5 py-1 rounded-md text-xs"
              style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              ↺ Reset
            </button>
            <button
              type="button"
              onClick={() => setDrillIdx((i) => (i + 1) % SCRAMBLE_DRILLS.length)}
              className="px-3 py-1 rounded-md text-xs font-medium"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Next Sentence →
            </button>
          </div>
        </div>

        {/* Assembled slots */}
        <div
          className="min-h-[52px] rounded-lg p-3 flex flex-wrap items-center gap-2"
          style={{
            background: 'var(--bg-app)',
            border: `1px solid ${isComplete ? (isCorrect ? 'var(--ok)' : 'var(--bad)') : 'var(--border)'}`,
          }}
        >
          {pickedIndices.length === 0 ? (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Tap the word &amp; particle tiles below in Subject – Object – Verb order…
            </span>
          ) : (
            pickedIndices.map((tokenIdx, pos) => (
              <button
                key={`${tokenIdx}-${pos}`}
                type="button"
                onClick={() => setPickedIndices((prev) => prev.filter((_, idx) => idx !== pos))}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
              >
                {drill.tokens[tokenIdx]}
              </button>
            ))
          )}
        </div>

        {/* Available tiles */}
        <div className="flex flex-wrap gap-2">
          {shuffledIndices.map((tokenIdx) => {
            const used = pickedIndices.includes(tokenIdx);
            return (
              <button
                key={tokenIdx}
                type="button"
                disabled={used}
                onClick={() => setPickedIndices((prev) => [...prev, tokenIdx])}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
                style={{
                  background: 'var(--bg-panel-elev)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  opacity: used ? 0.3 : 1,
                }}
              >
                {drill.tokens[tokenIdx]}
              </button>
            );
          })}
        </div>

        {isComplete && (
          <div
            className="rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
            style={{
              background: 'var(--bg-panel-elev)',
              border: `1px solid ${isCorrect ? 'var(--ok)' : 'var(--bad)'}`,
            }}
          >
            <div>
              <div className="font-semibold text-sm" style={{ color: isCorrect ? 'var(--ok)' : 'var(--bad)' }}>
                {isCorrect ? '✓ Spot on!' : `✗ Not quite — target order: ${targetJoined}`}
              </div>
              <div className="mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Reading: {drill.reading}
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakJapanese(targetJoined)}
              className="px-3 py-1.5 rounded-md text-xs font-medium shrink-0"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              🔊 Hear Sentence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
