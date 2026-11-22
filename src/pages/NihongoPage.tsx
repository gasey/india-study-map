import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KanaChart } from '@/modules/nihongo/KanaChart';
import { NihongoCourse } from '@/modules/nihongo/NihongoCourse';
import { DictionarySearch } from '@/modules/nihongo/DictionarySearch';
import { KanjiExplorer } from '@/modules/nihongo/KanjiExplorer';
import { SentenceLab } from '@/modules/nihongo/SentenceLab';
import { NihongoGuideAndPlan } from '@/modules/nihongo/NihongoGuideAndPlan';

// ============================================
// NIHONGO WORKBENCH — Comprehensive Japanese learning desk:
//  1. Kana: Hiragana & Katakana charts + active recognition quiz
//  2. Grammar (32): 32-lesson JLPT N5–N3 curriculum + 6-stage quick drills
//  3. Kanji & Strokes: 2,230+ KANJIDIC2 browser + live KanjiVG SVG stroke
//     animator + live KanjiAPI.dev compounds, Heisig keywords & reading lookup
//  4. Dictionary: Offline JMdict search + Web Speech TTS + live Tatoeba examples
//  5. Sentence Lab: Live Tatoeba REST API v1 sentence search, Romaji-to-Kana IME,
//     slow/normal listening dojo, and SOV sentence assembly drill
//  6. Guide & Future Plan: JLPT N5→N1 blueprint, 10-form verb conjugation matrix,
//     pitch accent guide, free API directory, and 4-phase engineering roadmap
// ============================================

type Tab = 'kana' | 'course' | 'kanji' | 'dictionary' | 'sentences' | 'guide';

const TABS: { id: Tab; label: string }[] = [
  { id: 'kana', label: 'Kana' },
  { id: 'course', label: 'Grammar (32)' },
  { id: 'kanji', label: 'Kanji & Strokes' },
  { id: 'dictionary', label: 'Dictionary' },
  { id: 'sentences', label: 'Sentence Lab' },
  { id: 'guide', label: 'Guide & Future Plan' },
];

export default function NihongoPage() {
  const [tab, setTab] = useState<Tab>('course');

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[980px] mx-auto px-6 sm:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
              JLPT N5 → N3 Workbench · Offline JMdict/KANJIDIC2 + Live KanjiVG · KanjiAPI · Tatoeba v1
            </div>
            <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
              日本語 · Nihongo Learning Studio
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Kana drills, 32 grammar lessons, 2,230+ kanji with live stroke animations &amp; compound words, offline dictionary, live Tatoeba sentence listening lab, and full mastery roadmap.
            </p>
          </div>
        </div>

        <div
          className="inline-flex flex-wrap rounded-lg p-1 gap-0.5 self-start"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
              style={{
                background: tab === t.id ? 'var(--accent-soft)' : 'transparent',
                color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'kana' && <KanaChart />}
        {tab === 'course' && <NihongoCourse />}
        {tab === 'kanji' && <KanjiExplorer />}
        {tab === 'dictionary' && <DictionarySearch />}
        {tab === 'sentences' && <SentenceLab />}
        {tab === 'guide' && <NihongoGuideAndPlan />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link to="/flashcards?deck=nihongo" style={{ textDecoration: 'none' }}>
            <div className="surface rounded-lg p-4 flex items-center justify-between gap-4 h-full">
              <div>
                <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  SM-2 Vocab &amp; Kanji Flashcard Deck (100 Cards)
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  60 core JLPT N5–N4 words + 40 essential jōyō kanji — spaced-repetition review integrated with Recall → Due Today.
                </p>
              </div>
              <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0 }}>→</span>
            </div>
          </Link>

          <Link to="/embed/nihongo-lab" style={{ textDecoration: 'none' }}>
            <div className="surface rounded-lg p-4 flex items-center justify-between gap-4 h-full">
              <div>
                <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Standalone Nihongo Lab Desk
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Open the self-contained Nihongo Lab desktop environment with typing speed tests, personal notes, and custom SRS profiles.
                </p>
              </div>
              <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
