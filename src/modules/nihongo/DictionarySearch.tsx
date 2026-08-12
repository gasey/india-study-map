import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { loadDictionary, loadKanjiDic } from '@/data/nihongo/dictionaryLoader';
import { buildIndex, searchWords, type DictionaryIndex } from '@/data/nihongo/dictionarySearch';
import type { DictKanjiEntry, DictWordEntry, DictWords } from '@/data/nihongo/dictionary-types';

// ============================================
// Offline dictionary search — resolves the deferral called out in
// NihongoPage.tsx and DEVLOG.md: dictionary search needed either a
// backend or a CORS-proxy hack this app had no precedent for. Bundling
// JMdict+KANJIDIC2 as static data (tools/nihongo-dict/build.mjs) and
// searching client-side sidesteps that entirely — no network call at
// query time, fits the app's local-only design.
// ============================================

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

  return (
    <div className="rounded-lg p-4 flex flex-col gap-2" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
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
        <button
          onClick={onToggleSave}
          aria-label={saved ? 'Remove bookmark' : 'Bookmark word'}
          className="text-lg leading-none shrink-0"
          style={{ color: saved ? 'var(--accent)' : 'var(--text-secondary)' }}
        >
          {saved ? '★' : '☆'}
        </button>
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
        Couldn't load the dictionary data. Run <code>npm run build:dict</code> to generate it, then reload.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by kanji, kana, romaji, or English meaning..."
        className="rounded-lg px-3 py-2 text-sm outline-none"
        style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />

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
          Start typing to search {dict.words.length.toLocaleString()} words.
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No matches.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
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

      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Dictionary data from JMdict &amp; KANJIDIC2 (EDRDG), CC BY-SA 4.0.
      </p>
    </div>
  );
}
