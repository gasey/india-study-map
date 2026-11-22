import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { loadDictionary, loadKanjiDic } from '@/data/nihongo/dictionaryLoader';
import { buildIndex, searchWords, type DictionaryIndex } from '@/data/nihongo/dictionarySearch';
import type { DictKanjiEntry, DictWordEntry, DictWords } from '@/data/nihongo/dictionary-types';
import {
  fetchTatoebaSentences,
  romajiToHiragana,
  speakJapanese,
  type TatoebaSentence,
} from '@/data/nihongo/freeApis';

type Filter = 'all' | 'saved';

function headword(w: DictWordEntry): string {
  return w.kanji[0] ?? w.kana[0] ?? w.id;
}

function KanjiPanel({ entry }: { entry: DictKanjiEntry }) {
  return (
    <div className="rounded-md p-3 flex flex-col gap-1.5 text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
      <div className="flex items-baseline gap-3">
        <span style={{ fontSize: 28, color: 'var(--text-primary)' }}>{entry.literal}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{entry.meanings.join(', ')}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {entry.onReadings.length > 0 && <span>On: {entry.onReadings.join('、')}</span>}
        {entry.kunReadings.length > 0 && <span>Kun: {entry.kunReadings.join('、')}</span>}
        {entry.strokeCount != null && <span>{entry.strokeCount} strokes</span>}
        {entry.jlpt != null && <span>JLPT N{entry.jlpt}</span>}
        {entry.grade != null && <span>Grade {entry.grade}</span>}
      </div>
    </div>
  );
}

function WordCard({
  word,
  posTags,
  kanjiByLiteral,
  saved,
  onToggleSave,
}: {
  word: DictWordEntry;
  posTags: Record<string, string>;
  kanjiByLiteral: Map<string, DictKanjiEntry>;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const singleKanji = word.kanji.length === 1 && [...word.kanji[0]].length === 1 ? kanjiByLiteral.get(word.kanji[0]) : undefined;
  const hw = headword(word);
  const [examples, setExamples] = useState<TatoebaSentence[] | null>(null);
  const [loadingExamples, setLoadingExamples] = useState(false);

  async function toggleExamples() {
    if (examples !== null) {
      setExamples(null);
      return;
    }
    setLoadingExamples(true);
    try {
      const res = await fetchTatoebaSentences(hw, { limit: 4 });
      setExamples(res);
    } catch {
      setExamples([]);
    } finally {
      setLoadingExamples(false);
    }
  }

  return (
    <div className="surface rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span style={{ fontSize: 20, color: 'var(--text-primary)' }}>{word.kanji.length > 0 ? word.kanji.join('・') : word.kana.join('・')}</span>
          {word.kanji.length > 0 && (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {word.kana.join('・')}
            </span>
          )}
          {word.common && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              common
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => speakJapanese(word.kana[0] || hw)}
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            title="Hear pronunciation"
          >
            🔊
          </button>
          <button
            type="button"
            onClick={toggleExamples}
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ background: 'var(--bg-panel-elev)', color: 'var(--accent)', border: '1px solid var(--border)' }}
            title="Fetch live Tatoeba example sentences"
          >
            {loadingExamples ? '…' : examples !== null ? 'Hide Examples' : '🌐 Examples'}
          </button>
          <button
            onClick={onToggleSave}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark word'}
            className="text-lg leading-none px-1"
            style={{ color: saved ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            {saved ? '★' : '☆'}
          </button>
        </div>
      </div>

      <ol className="flex flex-col gap-1 text-sm" style={{ color: 'var(--text-primary)' }}>
        {word.senses.slice(0, 8).map((sense, i) => (
          <li key={i} className="flex gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>{i + 1}.</span>
            <span>
              {sense.gloss.join('; ')}
              {sense.tags.length > 0 && (
                <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
                  ({sense.tags.map((t) => posTags[t] ?? t).join(', ')})
                </span>
              )}
            </span>
          </li>
        ))}
        {word.senses.length > 8 && <li style={{ color: 'var(--text-secondary)' }}>+{word.senses.length - 8} more senses</li>}
      </ol>

      {singleKanji && <KanjiPanel entry={singleKanji} />}

      {examples !== null && (
        <div className="mt-1 pt-2 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            Live Tatoeba v1 Examples for {hw}
          </div>
          {examples.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              No live sentences found for {hw}.
            </p>
          ) : (
            examples.map((s) => (
              <div
                key={s.id}
                className="rounded px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs"
                style={{ background: 'var(--bg-panel-elev)' }}
              >
                <div className="min-w-0">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {s.jp}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{s.en}</div>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(s.jp)}
                  className="px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: 'var(--accent)' }}
                >
                  🔊
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function DictionarySearch() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [dict, setDict] = useState<DictWords | null>(null);
  const [index, setIndex] = useState<DictionaryIndex | null>(null);
  const [kanjiByLiteral, setKanjiByLiteral] = useState<Map<string, DictKanjiEntry>>(new Map());
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const savedWords = useApp((s) => s.nihongoDict.savedWords);
  const toggleSavedWord = useApp((s) => s.toggleSavedWord);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadDictionary(), loadKanjiDic()])
      .then(([words, kanjiDic]) => {
        if (cancelled) return;
        setDict(words);
        setIndex(buildIndex(words));
        setKanjiByLiteral(new Map(kanjiDic.kanji.map((k) => [k.literal, k])));
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const results = useMemo(() => {
    if (!index) return [];
    if (filter === 'saved') {
      const saved = savedWords.map((id) => index.byId.get(id)).filter((w): w is DictWordEntry => !!w);
      if (!debouncedQuery.trim()) return saved;
      const ids = new Set(searchWords(index, debouncedQuery, 500).map((w) => w.id));
      return saved.filter((w) => ids.has(w.id));
    }
    return searchWords(index, debouncedQuery, 50);
  }, [index, debouncedQuery, filter, savedWords]);

  if (status === 'loading') {
    return (
      <div className="rounded-lg p-5 text-sm" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        Loading dictionary (~9MB, one-time — cached after this)...
      </div>
    );
  }

  if (status === 'error' || !dict) {
    return (
      <div className="rounded-lg p-5 text-sm" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        Couldn&apos;t load the dictionary data. Run <code>npm run build:dict</code> to generate it, then reload.
      </div>
    );
  }

  const kanaPreview = /^[a-zA-Z]+$/.test(query.trim()) ? romajiToHiragana(query.trim()) : '';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by kanji, kana, romaji, or English meaning (e.g. taberu, 食べる, library)..."
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
        {kanaPreview && (
          <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span>Romaji → Kana:</span>
            <button
              type="button"
              onClick={() => setQuery(kanaPreview)}
              className="px-2 py-0.5 rounded font-medium"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {kanaPreview} (click to search kana)
            </button>
          </div>
        )}
      </div>

      <div className="inline-flex rounded-lg p-1 gap-0.5 self-start" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
        {(['all', 'saved'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-md text-xs font-medium"
            style={{ background: filter === f ? 'var(--accent-soft)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            {f === 'all' ? 'All' : `Saved (${savedWords.length})`}
          </button>
        ))}
      </div>

      {filter === 'saved' && savedWords.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No bookmarked words yet — tap the star on any result to save it.
        </p>
      ) : filter === 'all' && !debouncedQuery.trim() ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Start typing to search {dict.words.length.toLocaleString()} words. Tap 🔊 to hear pronunciation or 🌐 Examples to fetch live Tatoeba context sentences.
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No matches.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {results.length === 50 ? 'Top 50 matches' : `${results.length} ${results.length === 1 ? 'match' : 'matches'}`}
          </p>
          {results.map((w) => (
            <WordCard
              key={w.id}
              word={w}
              posTags={dict.posTags}
              kanjiByLiteral={kanjiByLiteral}
              saved={savedWords.includes(w.id)}
              onToggleSave={() => toggleSavedWord(w.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
