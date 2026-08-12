import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KanaChart } from '@/modules/nihongo/KanaChart';
import { NihongoCourse } from '@/modules/nihongo/NihongoCourse';
import { DictionarySearch } from '@/modules/nihongo/DictionarySearch';

// ============================================
// NIHONGO — kana chart+quiz and a 6-stage grammar course here; vocab/kanji
// review reuses the existing SM-2 Flashcards/Recall system via the
// "nihongo" deck (src/data/decks/nihongo-cards.ts) rather than a second
// scheduler. Course example sentences are real, pulled from the Tatoeba
// API (see src/data/nihongo/course.ts) — same "not textbook filler" bar
// as Python/Postgres, just sourced differently since there's no
// equivalent "read the user's own code" move for grammar.
//
// Dictionary search is a full offline JMdict/KANJIDIC2 dataset (see
// tools/nihongo-dict/build.mjs) searched client-side — no backend, no
// CORS proxy, fits this app's local-only design (see DEVLOG). Admin-
// authored grammar notes (as opposed to this fixed course) are still
// deferred — that implies an author/reader split this single-user app
// doesn't have a concept of yet.
// ============================================

type Tab = 'kana' | 'course' | 'dictionary';

export default function NihongoPage() {
  const [tab, setTab] = useState<Tab>('kana');

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[820px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>日本語 · Nihongo</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Kana drills and a 6-stage grammar course. Vocab and kanji review live in Flashcards, using the same SM-2 engine as every other deck.
          </p>
        </div>

        <div className="inline-flex rounded-lg p-1 gap-0.5 self-start" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
          {(['kana', 'course', 'dictionary'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-md text-sm font-medium"
              style={{ background: tab === t ? 'var(--accent-soft)' : 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {t === 'kana' ? 'Kana' : t === 'course' ? 'Grammar course' : 'Dictionary'}
            </button>
          ))}
        </div>

        {tab === 'kana' ? <KanaChart /> : tab === 'course' ? <NihongoCourse /> : <DictionarySearch />}

        <Link to="/flashcards?deck=nihongo" style={{ textDecoration: 'none' }}>
          <div className="rounded-lg p-5 flex items-center justify-between gap-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div>
              <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Vocab &amp; Kanji deck</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                24 core words + the first 12 jōyō kanji — spaced-repetition review, same as Polity Codex or any other deck. Also shows up in Recall → Due Today.
              </p>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: 20, flexShrink: 0 }}>→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
