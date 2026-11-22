// ============================================
// FREE JAPANESE LEARNING APIS & BROWSER SERVICES
//
// Zero-API-key, CORS-enabled (*), open-licensed live services that
// complement our offline JMdict + KANJIDIC2 + grammar datasets:
//  1. Tatoeba REST API v1 (https://api.tatoeba.org/v1/sentences) — CC BY 2.0 FR
//  2. KanjiAPI.dev v1 (https://kanjiapi.dev/v1) — MIT / EDICT & KANJIDIC2
//  3. KanjiVG Raw SVG CDN (https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji) — CC BY-SA 3.0
//  4. Web Speech API (window.speechSynthesis, ja-JP) — Native browser TTS
// ============================================

export interface TatoebaSentence {
  id: number;
  jp: string;
  en: string;
  owner?: string;
  license?: string;
}

export interface KanjiApiDetail {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number | null;
  unicode: string;
  heisig_en: string | null;
  freq_mainichi_shinbun: number | null;
}

export interface KanjiApiCompound {
  written: string;
  pronounced: string;
  glosses: string[];
  priority: boolean;
}

const kanjiDetailCache = new Map<string, KanjiApiDetail>();
const kanjiWordsCache = new Map<string, KanjiApiCompound[]>();
const kanjiStrokeCache = new Map<string, string[]>();
const tatoebaCache = new Map<string, TatoebaSentence[]>();

/** Speak Japanese text using the browser's built-in Web Speech API (ja-JP). */
export function speakJapanese(text: string, rate = 0.95): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ja'));
    if (jpVoice) utter.voice = jpVoice;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors on unsupported browsers
  }
}

/** Query live native Japanese example sentences with English translations from Tatoeba v1 API. */
export async function fetchTatoebaSentences(
  query: string,
  opts: { audioOnly?: boolean; limit?: number } = {},
): Promise<TatoebaSentence[]> {
  const q = query.trim();
  if (!q) return [];
  const limit = opts.limit ?? 10;
  const cacheKey = `${q}|${opts.audioOnly ? '1' : '0'}|${limit}`;
  const cached = tatoebaCache.get(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    lang: 'jpn',
    q,
    'trans:lang': 'eng',
    sort: 'relevance',
    limit: String(limit),
  });
  if (opts.audioOnly) {
    params.set('has_audio', 'yes');
  }

  const res = await fetch(`https://api.tatoeba.org/v1/sentences?${params.toString()}`);
  if (!res.ok) throw new Error(`Tatoeba API returned ${res.status}`);
  const payload = await res.json();
  const rows: any[] = Array.isArray(payload?.data) ? payload.data : [];

  const parsed: TatoebaSentence[] = rows
    .map((item) => {
      const translations: any[] = Array.isArray(item.translations)
        ? item.translations.flat()
        : [];
      const direct = translations.find((t) => t && t.lang === 'eng' && t.is_direct && t.text);
      const anyEng = translations.find((t) => t && t.lang === 'eng' && t.text);
      const en = (direct ?? anyEng)?.text ?? '';
      return {
        id: Number(item.id),
        jp: String(item.text ?? ''),
        en: String(en),
        owner: item.owner ? String(item.owner) : undefined,
        license: item.license ? String(item.license) : 'CC BY 2.0 FR',
      };
    })
    .filter((s) => s.jp && s.en);

  tatoebaCache.set(cacheKey, parsed);
  return parsed;
}

/** Fetch rich kanji metadata (Heisig keyword, Mainichi frequency, nanori, readings) from KanjiAPI.dev. */
export async function fetchKanjiApiDetail(literal: string): Promise<KanjiApiDetail> {
  const char = [...literal.trim()][0];
  if (!char) throw new Error('Empty kanji');
  const cached = kanjiDetailCache.get(char);
  if (cached) return cached;

  const res = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(char)}`);
  if (!res.ok) throw new Error(`KanjiAPI returned ${res.status}`);
  const data = (await res.json()) as KanjiApiDetail;
  kanjiDetailCache.set(char, data);
  return data;
}

/** Fetch real compound words (jukugo) containing a kanji from KanjiAPI.dev, sorted by common priority. */
export async function fetchKanjiApiWords(literal: string, max = 18): Promise<KanjiApiCompound[]> {
  const char = [...literal.trim()][0];
  if (!char) return [];
  const cached = kanjiWordsCache.get(char);
  if (cached) return cached.slice(0, max);

  const res = await fetch(`https://kanjiapi.dev/v1/words/${encodeURIComponent(char)}`);
  if (!res.ok) throw new Error(`KanjiAPI words returned ${res.status}`);
  const raw: any[] = await res.json();

  const items: KanjiApiCompound[] = [];
  for (const entry of raw) {
    const variants: any[] = Array.isArray(entry.variants) ? entry.variants : [];
    const meanings: any[] = Array.isArray(entry.meanings) ? entry.meanings : [];
    const glosses = meanings.flatMap((m) => (Array.isArray(m.glosses) ? m.glosses : [])).slice(0, 4);
    if (glosses.length === 0) continue;

    for (const v of variants) {
      const priorities: string[] = Array.isArray(v.priorities) ? v.priorities : [];
      if (v.written && v.pronounced) {
        items.push({
          written: String(v.written),
          pronounced: String(v.pronounced),
          glosses,
          priority: priorities.length > 0,
        });
        break;
      }
    }
  }

  items.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    return a.written.length - b.written.length;
  });

  const deduped: KanjiApiCompound[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${item.written}|${item.pronounced}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= 60) break;
  }

  kanjiWordsCache.set(char, deduped);
  return deduped.slice(0, max);
}

/** Reverse-lookup all kanji that share a given On'yomi or Kun'yomi reading via KanjiAPI.dev. */
export async function fetchKanjiByReading(reading: string): Promise<{ main_kanji: string[]; name_kanji: string[] }> {
  const r = reading.trim();
  if (!r) return { main_kanji: [], name_kanji: [] };
  const res = await fetch(`https://kanjiapi.dev/v1/reading/${encodeURIComponent(r)}`);
  if (!res.ok) throw new Error(`Reading lookup returned ${res.status}`);
  const data = await res.json();
  return {
    main_kanji: Array.isArray(data?.main_kanji) ? data.main_kanji : [],
    name_kanji: Array.isArray(data?.name_kanji) ? data.name_kanji : [],
  };
}

/** Fetch and extract ordered SVG stroke paths for any kanji from the KanjiVG raw CDN. */
export async function fetchKanjiVgStrokes(literal: string): Promise<string[]> {
  const char = [...literal.trim()][0];
  if (!char) return [];
  const cached = kanjiStrokeCache.get(char);
  if (cached) return cached;

  const codePoint = char.codePointAt(0);
  if (!codePoint) return [];
  const hex5 = codePoint.toString(16).toLowerCase().padStart(5, '0');

  const res = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex5}.svg`);
  if (!res.ok) throw new Error(`KanjiVG SVG not found (${res.status})`);
  const svgText = await res.text();

  const paths: string[] = [];
  const pathRegex = /<path\b[^>]*\bd="([^"]+)"[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = pathRegex.exec(svgText)) !== null) {
    if (match[1]) paths.push(match[1]);
  }

  kanjiStrokeCache.set(char, paths);
  return paths;
}

// ── Lightweight Romaji → Hiragana converter for IME search & typing drills ──
const ROMAJI_TABLE: [string, string][] = [
  ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'], ['sya', 'しゃ'], ['syu', 'しゅ'], ['syo', 'しょ'],
  ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'], ['tya', 'ちゃ'], ['tyu', 'ちゅ'], ['tyo', 'ちょ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'],
  ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'],
  ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'],
  ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'], ['jya', 'じゃ'], ['jyu', 'じゅ'], ['jyo', 'じょ'],
  ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'],
  ['shi', 'し'], ['chi', 'ち'], ['tsu', 'つ'], ['fu', 'ふ'],
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['sa', 'さ'], ['si', 'し'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['ta', 'た'], ['ti', 'ち'], ['tu', 'つ'], ['te', 'て'], ['to', 'と'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['hu', 'ふ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wo', 'を'], ['nn', 'ん'],
  ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'], ['ge', 'げ'], ['go', 'ご'],
  ['za', 'ざ'], ['zi', 'じ'], ['ji', 'じ'], ['zu', 'ず'], ['ze', 'ぜ'], ['zo', 'ぞ'],
  ['da', 'だ'], ['di', 'ぢ'], ['du', 'づ'], ['de', 'で'], ['do', 'ど'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'],
  ['-', 'ー'],
];

export function romajiToHiragana(input: string): string {
  const s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    // Double consonant -> small tsu (っ)
    if (
      i + 1 < s.length &&
      s[i] === s[i + 1] &&
      /[bcdfghjklmnpqrstvwxyz]/.test(s[i]) &&
      s[i] !== 'n'
    ) {
      out += 'っ';
      i += 1;
      continue;
    }
    let matched = false;
    for (const [rom, kana] of ROMAJI_TABLE) {
      if (s.startsWith(rom, i)) {
        out += kana;
        i += rom.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // Standalone 'n' before consonant or end of word
    if (s[i] === 'n' && (i + 1 === s.length || !/[aiueoy]/.test(s[i + 1]))) {
      out += 'ん';
      i += 1;
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out;
}
