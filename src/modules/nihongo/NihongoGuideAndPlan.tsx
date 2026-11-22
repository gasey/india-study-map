import { speakJapanese } from '@/data/nihongo/freeApis';

const JLPT_TIERS = [
  {
    level: 'JLPT N5',
    kanji: '~103 Kanji',
    vocab: '~800 Words',
    grammar: '~80 Patterns',
    hours: '150–250 hrs',
    goal: 'Hiragana & Katakana mastery, SOV particle foundations, polite ます/です & basic て/た/ない verb forms, daily survival phrases.',
  },
  {
    level: 'JLPT N4',
    kanji: '~300 Kanji',
    vocab: '~1,500 Words',
    grammar: '~180 Patterns',
    goal: 'Transitive vs intransitive pairs, potential/volitional/passive/causative forms, conditionals (たら/ば/と/なら), giving/receiving (あげる/もらう/くれる), basic Keigo.',
    hours: '350–500 hrs',
  },
  {
    level: 'JLPT N3',
    kanji: '~650 Kanji',
    vocab: '~3,750 Words',
    grammar: '~350 Patterns',
    hours: '700–950 hrs',
    goal: 'Bridge from textbook Japanese to native immersion (NHK News Web Easy, slice-of-life manga): formal written connectors, nuanced modality, compound verbs.',
  },
  {
    level: 'JLPT N2',
    kanji: '~1,000 Kanji',
    vocab: '~6,000 Words',
    grammar: '~550 Patterns',
    hours: '1,300–1,800 hrs',
    goal: 'Business & newspaper readiness: Mainichi/Asahi news articles, novels, formal business keigo (尊敬語・謙譲語), rapid reading comprehension.',
  },
  {
    level: 'JLPT N1',
    kanji: '2,136 Jōyō Kanji',
    vocab: '10,000+ Words',
    grammar: '750+ Patterns',
    hours: '2,200–3,000+ hrs',
    goal: 'Academic, literary, and classical-derived grammar expressions, nuanced abstract editorials, near-native listening speed.',
  },
];

const VERB_CONJUGATION_MATRIX = [
  { form: 'Dictionary (Plain Non-Past)', godan: '書く (kaku) / 飲む (nomu)', ichidan: '食べる (taberu)', kuru: '来る (kuru)', suru: 'する (suru)', use: 'Casual non-past; dictionary headword; before と/つもり/ことができる' },
  { form: 'Polite (ます Form)', godan: '書きます / 飲みます (i-stem + ます)', ichidan: '食べます (drop る + ます)', kuru: '来ます (kimasu)', suru: 'します (shimasu)', use: 'Standard polite speech; stem joins たい / ながら / やすい / にくい' },
  { form: 'Negative (ない Form)', godan: '書かない / 飲まない (a-stem + ない; う→わない)', ichidan: '食べない (drop る + ない)', kuru: '来ない (konai)', suru: 'しない (shinai)', use: 'Casual negative; stem joins ないでください / なければならない / なくてもいい' },
  { form: 'Te-Form (て / で)', godan: '書いて / 飲んで (うつる→って, むぶぬ→んで, く→いて, ぐ→いで; 行く→行って)', ichidan: '食べて', kuru: '来て (kite)', suru: 'して (shite)', use: 'Chaining actions, 〜てください, 〜ている, 〜てから, 〜てもいい, 〜てはいけない' },
  { form: 'Plain Past (た / だ)', godan: '書いた / 飲んだ (same sound change as て-form)', ichidan: '食べた', kuru: '来た (kita)', suru: 'した (shita)', use: 'Casual past; joins 〜たことがある (experience), 〜たり〜たり, 〜た方がいい, 〜たら' },
  { form: 'Potential ("can do")', godan: '書ける / 飲める (e-stem + る)', ichidan: '食べられる (drop る + られる)', kuru: '来られる (korareru)', suru: 'できる (dekiru)', use: 'Ability or possibility; object typically shifts from を to が' },
  { form: 'Volitional ("let\'s / will")', godan: '書こう / 飲もう (o-stem + う)', ichidan: '食べよう (drop る + よう)', kuru: '来よう (koyō)', suru: 'しよう (shiyō)', use: 'Casual "let\'s"; joins 〜ようと思う (intention) and 〜ようとする (attempt)' },
  { form: 'Conditional (〜ば Form)', godan: '書けば / 飲めば (e-stem + ば)', ichidan: '食べれば (drop る + れば)', kuru: '来れば (kureba)', suru: 'すれば (sureba)', use: 'Hypothetical condition ("if X, then Y"); joins 〜ばよかった' },
  { form: 'Passive (受身形)', godan: '書かれる / 飲まれる (a-stem + れる)', ichidan: '食べられる (drop る + られる)', kuru: '来られる (korareru)', suru: 'される (sareru)', use: 'Passive voice, suffering passive, and light honorific (尊敬語)' },
  { form: 'Causative (使役形)', godan: '書かせる / 飲ませる (a-stem + せる)', ichidan: '食べさせる (drop る + させる)', kuru: '来させる (kosaseru)', suru: 'させる (saseru)', use: '"Make/let someone do"; with て-form + ください ("please let me do")' },
];

const PITCH_ACCENT_PATTERNS = [
  {
    name: '平板型 (Heiban — Flat / Unaccented [0])',
    contour: 'Low → High → High (particle stays HIGH)',
    example: 'さくらが (sa-KU-RA-GA — cherry blossom)',
    speak: 'さくらが咲きました',
    note: 'Starts low on the first mora, steps up on the second mora, and stays high even onto following particles like が/は/を.',
  },
  {
    name: '頭高型 (Atamadaka — Head-High [1])',
    contour: 'High → Low → Low (drops after 1st mora)',
    example: 'いのちが (I-no-chi-ga — life)',
    speak: 'いのちを大切にする',
    note: 'Starts high on the very first mora and drops sharply on the second mora, remaining low after that.',
  },
  {
    name: '中高型 (Nakadaka — Middle-High [2..n-1])',
    contour: 'Low → High → Low (drops before final mora)',
    example: 'こころが (ko-KO-ro-ga — heart/mind)',
    speak: 'こころが温かい',
    note: 'Rises on the second mora and drops before the end of the word.',
  },
  {
    name: '尾高型 (Odaka — Tail-High [n])',
    contour: 'Low → High (word) → Low (drops on particle!)',
    example: 'おとこが (o-TO-KO-ga — man) vs かみが (ka-MI-ga — hair/paper)',
    speak: 'おとこが歩いている',
    note: 'Sounds identical to Heiban in isolation, but drops sharply as soon as a particle like が or を attaches!',
  },
];

const FREE_APIS_AND_RESOURCES = [
  {
    name: 'Tatoeba REST API v1',
    status: 'Integrated Live',
    url: 'https://api.tatoeba.org/v1/sentences',
    license: 'CC BY 2.0 FR · Zero API Key · CORS (*)',
    desc: 'Queries 200,000+ native Japanese example sentences paired with English translations and optional human audio filtering. Powers the Sentence Lab and Kanji context examples.',
  },
  {
    name: 'KanjiAPI.dev v1',
    status: 'Integrated Live',
    url: 'https://kanjiapi.dev/',
    license: 'MIT / EDICT & KANJIDIC2 · Zero API Key · CORS (*)',
    desc: 'Provides instant JSON endpoints (/v1/kanji/{char}, /v1/words/{char}, /v1/reading/{reading}) for Heisig keywords, Mainichi newspaper frequency, compound jukugo, and reverse reading search.',
  },
  {
    name: 'KanjiVG Stroke Order CDN',
    status: 'Integrated Live',
    url: 'https://kanjivg.tagaini.net/',
    license: 'CC BY-SA 3.0 (Ulrich Apel) · GitHub Raw CDN',
    desc: 'Ordered SVG vector stroke paths for 6,000+ kanji. Powers the interactive stroke-by-stroke animator in the Kanji & Strokes tab.',
  },
  {
    name: 'JMdict & KANJIDIC2 (EDRDG)',
    status: 'Bundled Offline',
    url: 'https://www.edrdg.org/',
    license: 'CC BY-SA 4.0 (Electronic Dictionary Research and Development Group)',
    desc: 'Offline client-side dictionary index covering 2,230+ kanji and common Japanese vocabulary with instant zero-latency search.',
  },
  {
    name: 'Web Speech API (ja-JP Synthesis)',
    status: 'Integrated Native',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis',
    license: 'W3C Browser Standard',
    desc: 'Native Japanese text-to-speech pronunciation on every grammar example, dictionary card, compound word, and Tatoeba sentence (1.0× and 0.65× slow speeds).',
  },
  {
    name: 'NHK News Web Easy (やさしい日本語)',
    status: 'Recommended Immersion',
    url: 'https://www3.nhk.or.jp/news/easy/',
    license: 'Free Public Broadcaster Resource',
    desc: 'Daily real Japanese news rewritten for N4–N3 learners with full furigana and native newsreader audio.',
  },
  {
    name: 'OJAD (Online Japanese Accent Dictionary)',
    status: 'Recommended Reference',
    url: 'https://www.gavo.t.u-tokyo.ac.jp/ojad/',
    license: 'University of Tokyo · Free Academic Tool',
    desc: 'Visualizes how Tokyo pitch accent shifts across all verb and adjective conjugations with downloadable native audio.',
  },
  {
    name: 'Aozora Bunko (青空文庫) & Tadoku Graded Readers',
    status: 'Recommended Reading',
    url: 'https://www.aozora.gr.jp/',
    license: 'Public Domain / Free Graded Readers (tadoku.org)',
    desc: 'Japan’s digital library of 17,000+ public-domain literary works plus free illustrated N5–N3 graded readers.',
  },
];

const FUTURE_ROADMAP = [
  {
    phase: 'Phase 1 · Next Up',
    title: 'FSRS v5 Spaced-Repetition Upgrade & Pitch Accent Contours',
    items: [
      'Upgrade the SM-2 flashcard scheduler to FSRS v5 (Free Spaced Repetition Scheduler) with target retention slider (85%–95%) and 30% fewer redundant reviews.',
      'Embed Kanjium open-source pitch-accent numbers ([0], [1], [2]) and inline SVG pitch contour lines directly on every dictionary card and vocab flashcard.',
      'One-click "+ Add to SRS Deck" from any Tatoeba sentence or KanjiAPI compound word so users can mine sentences straight into their daily review queue.',
    ],
  },
  {
    phase: 'Phase 2 · Immersion Reader',
    title: 'In-Browser Morphological Tokenizer (Kuromoji.js / BudouX) & Furigana Reader',
    items: [
      'Run a client-side WebWorker morphological analyzer (Kuromoji.js + IPADIC) so pasting any raw Japanese paragraph (news, lyrics, light novels) segments words, attaches furigana, and shows instant hover definitions.',
      'Highlight known vs unknown words in pasted texts based on the user’s SRS mastery history ("i+1 sentence finder").',
    ],
  },
  {
    phase: 'Phase 3 · Active Output Lab',
    title: 'HTML5 Canvas Kanji Handwriting Grading & WebAudio Pitch Shadowing',
    items: [
      'Interactive HTML5 Canvas drawing pad that compares user-drawn stroke order, direction, and bounding boxes against KanjiVG vector paths.',
      'Microphone shadowing recorder using WebAudio autocorrelation (YIN pitch tracker) to plot the learner’s spoken pitch curve against the target Japanese word.',
    ],
  },
  {
    phase: 'Phase 4 · Cross-App Sync',
    title: 'Unified Progress Sync Across India Study Map, Personal Website & Mobile',
    items: [
      'Optional JSON export/import and background sync with the self-hosted /api/learn backend so grammar bookmarks, mined Tatoeba sentences, and SRS reviews stay in sync across all three apps.',
    ],
  },
];

export function NihongoGuideAndPlan() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: JLPT N5 -> N1 Roadmap */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            Mastery Blueprint · JLPT N5 → N1
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Comprehensive Japanese Learning Guide &amp; Daily Protocol
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Japanese combines three writing scripts — <b>Hiragana</b> (grammatical inflections, particles, native words), <b>Katakana</b> (loanwords, emphasis, onomatopoeia), and <b>Kanji</b> (meaning-bearing logographs with Chinese-derived <em>On’yomi</em> and native <em>Kun’yomi</em> readings). Follow a balanced <b>45-minute daily loop</b>: <b>15 min SRS Recall</b> (Kanji + Vocab in context) → <b>15 min Grammar &amp; Conjugation</b> (1 lesson + quiz) → <b>15 min Active Listening &amp; Sentence Mining</b> (Tatoeba / NHK Easy).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th className="py-2 pr-3 font-semibold">Level</th>
                <th className="py-2 px-3 font-semibold">Kanji</th>
                <th className="py-2 px-3 font-semibold">Vocabulary</th>
                <th className="py-2 px-3 font-semibold">Grammar</th>
                <th className="py-2 px-3 font-semibold">Study Hours</th>
                <th className="py-2 pl-3 font-semibold">Core Milestone</th>
              </tr>
            </thead>
            <tbody>
              {JLPT_TIERS.map((t) => (
                <tr key={t.level} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2.5 pr-3 font-semibold whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                    {t.level}
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {t.kanji}
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {t.vocab}
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {t.grammar}
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    {t.hours}
                  </td>
                  <td className="py-2.5 pl-3 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {t.goal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Master Verb Conjugation Matrix */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            Grammar Engine · All 10 Essential Verb Forms
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Master Verb Conjugation Reference (Godan · Ichidan · Irregulars)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th className="py-2 pr-3 font-semibold">Form</th>
                <th className="py-2 px-2 font-semibold">Godan (Group 1: う-verbs)</th>
                <th className="py-2 px-2 font-semibold">Ichidan (Group 2: る-verbs)</th>
                <th className="py-2 px-2 font-semibold">来る (kuru)</th>
                <th className="py-2 px-2 font-semibold">する (suru)</th>
                <th className="py-2 pl-2 font-semibold">Core Grammatical Role</th>
              </tr>
            </thead>
            <tbody>
              {VERB_CONJUGATION_MATRIX.map((row) => (
                <tr key={row.form} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-2.5 pr-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {row.form}
                  </td>
                  <td className="py-2.5 px-2" style={{ color: 'var(--text-primary)' }}>{row.godan}</td>
                  <td className="py-2.5 px-2" style={{ color: 'var(--text-primary)' }}>{row.ichidan}</td>
                  <td className="py-2.5 px-2 whitespace-nowrap" style={{ color: 'var(--accent)' }}>{row.kuru}</td>
                  <td className="py-2.5 px-2 whitespace-nowrap" style={{ color: 'var(--accent)' }}>{row.suru}</td>
                  <td className="py-2.5 pl-2" style={{ color: 'var(--text-secondary)' }}>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Pitch Accent Guide */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            Pronunciation &amp; Prosody · 高低アクセント
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            The 4 Japanese Pitch-Accent Patterns
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Unlike English stress accent (loudness/duration), Japanese uses <b>mora-timed high/low pitch accent</b>. Once the pitch drops in a word, it never rises again within that same phonological word!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PITCH_ACCENT_PATTERNS.map((p) => (
            <div
              key={p.name}
              className="rounded-lg p-3.5 flex flex-col gap-1.5"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {p.name}
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese(p.speak)}
                  className="px-2 py-1 rounded text-xs font-medium shrink-0"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  🔊 Hear
                </button>
              </div>
              <div className="font-mono text-[11px]" style={{ color: 'var(--accent)' }}>
                {p.contour}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                Example: {p.example}
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {p.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Free APIs & Open Resources Directory */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            Free APIs &amp; Open-Source Ecosystem
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Integrated Free APIs &amp; External Immersion Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FREE_APIS_AND_RESOURCES.map((r) => (
            <div
              key={r.name}
              className="rounded-lg p-3.5 flex flex-col gap-1.5"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {r.name} ↗
                </a>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0"
                  style={{
                    background: r.status.startsWith('Integrated') || r.status.startsWith('Bundled') ? 'var(--accent-soft)' : 'var(--bg-panel)',
                    color: r.status.startsWith('Integrated') || r.status.startsWith('Bundled') ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  {r.status}
                </span>
              </div>
              <div className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {r.license}
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Future Engineering & Product Roadmap */}
      <div className="surface rounded-xl p-5 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
            Future Plan &amp; Architecture Roadmap
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Next-Generation Japanese Workbench Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {FUTURE_ROADMAP.map((phase) => (
            <div
              key={phase.phase}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                {phase.phase}
              </div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {phase.title}
              </h3>
              <ul className="flex flex-col gap-1.5 text-xs leading-relaxed pl-4 list-disc" style={{ color: 'var(--text-secondary)' }}>
                {phase.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
