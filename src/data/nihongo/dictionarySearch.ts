import { romajiToKana } from '../kana';
import type { DictWordEntry, DictWords } from './dictionary-types';

// ============================================
// Client-side search over the full JMdict word list (~218k entries).
// Deliberately not a pre-built inverted index shipped from the pipeline
// (jmdict.json is already 8.5MB gzipped, an index would add more) —
// building a headword map + lowercase search blobs once after fetch
// takes well under a second, and a full linear scan per query is single-
// digit milliseconds, so there's nothing to gain from persisting it.
// ============================================

export interface DictionaryIndex {
  words: DictWordEntry[];
  /** Kanji/kana headword -> indices into `words`. */
  byHeadword: Map<string, number[]>;
  /** Lowercased "kanji kana glosses" blob per word, parallel to `words`. */
  searchBlobs: string[];
  /** Word id -> entry, for looking up bookmarked words directly. */
  byId: Map<string, DictWordEntry>;
}

const CJK_RE = /[぀-ヿ㐀-鿿]/;

export function buildIndex(dict: DictWords): DictionaryIndex {
  const byHeadword = new Map<string, number[]>();
  const byId = new Map<string, DictWordEntry>();
  const searchBlobs = new Array<string>(dict.words.length);

  dict.words.forEach((w, i) => {
    byId.set(w.id, w);
    for (const form of [...w.kanji, ...w.kana]) {
      const hits = byHeadword.get(form);
      if (hits) hits.push(i);
      else byHeadword.set(form, [i]);
    }
    const glossText = w.senses.flatMap((s) => s.gloss).join(' ');
    searchBlobs[i] = `${w.kanji.join(' ')} ${w.kana.join(' ')} ${glossText}`.toLowerCase();
  });

  return { words: dict.words, byHeadword, searchBlobs, byId };
}

/** Rank: 0 = exact headword match, 1 = headword prefix match, 2 = gloss/meaning substring match. */
function rank(index: DictionaryIndex, query: string): Map<number, number> {
  const scores = new Map<number, number>();
  const setScore = (i: number, score: number) => {
    const existing = scores.get(i);
    if (existing === undefined || score < existing) scores.set(i, score);
  };

  const tryHeadwordMatch = (form: string) => {
    const exact = index.byHeadword.get(form);
    if (exact) for (const i of exact) setScore(i, 0);
    for (const [headword, indices] of index.byHeadword) {
      if (headword !== form && headword.startsWith(form)) {
        for (const i of indices) setScore(i, 1);
      }
    }
  };

  if (CJK_RE.test(query)) {
    tryHeadwordMatch(query);
  } else {
    const asKana = romajiToKana(query.toLowerCase());
    if (asKana && asKana !== query.toLowerCase()) tryHeadwordMatch(asKana);
  }

  if (query.length >= 2) {
    const q = query.toLowerCase();
    for (let i = 0; i < index.searchBlobs.length; i++) {
      if (index.searchBlobs[i].includes(q)) setScore(i, 2);
    }
  }

  return scores;
}

export function searchWords(index: DictionaryIndex, rawQuery: string, limit = 50): DictWordEntry[] {
  const query = rawQuery.trim();
  if (!query) return [];

  const scores = rank(index, query);
  const sorted = [...scores.entries()].sort(([ia, sa], [ib, sb]) => {
    if (sa !== sb) return sa - sb;
    const wa = index.words[ia];
    const wb = index.words[ib];
    if (wa.common !== wb.common) return wa.common ? -1 : 1;
    return 0;
  });

  return sorted.slice(0, limit).map(([i]) => index.words[i]);
}
