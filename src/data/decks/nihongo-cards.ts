import type { FlashCard } from './types';

// Seed vocab + kanji, ported from the nihongo-app prototype's SEED_VOCAB /
// SEED_KANJI (src/NihongoLab.jsx) — real curated content, not filler.
// front = the word/kanji; back = reading + meaning together, since
// FlashCard has no separate "reading" field (same shape every other deck
// in this app uses).

export const nihongoCards: FlashCard[] = [
  // ── Vocabulary ──────────────────────────────────────────────
  { id: 'nihongo-voc-001', topic: 'vocab', topicLabel: 'Vocabulary', front: '私', back: 'わたし — I, me' },
  { id: 'nihongo-voc-002', topic: 'vocab', topicLabel: 'Vocabulary', front: '時間', back: 'じかん — time, hour' },
  { id: 'nihongo-voc-003', topic: 'vocab', topicLabel: 'Vocabulary', front: '学校', back: 'がっこう — school' },
  { id: 'nihongo-voc-004', topic: 'vocab', topicLabel: 'Vocabulary', front: '先生', back: 'せんせい — teacher' },
  { id: 'nihongo-voc-005', topic: 'vocab', topicLabel: 'Vocabulary', front: '友達', back: 'ともだち — friend' },
  { id: 'nihongo-voc-006', topic: 'vocab', topicLabel: 'Vocabulary', front: '水', back: 'みず — water' },
  { id: 'nihongo-voc-007', topic: 'vocab', topicLabel: 'Vocabulary', front: '食べる', back: 'たべる — to eat' },
  { id: 'nihongo-voc-008', topic: 'vocab', topicLabel: 'Vocabulary', front: '飲む', back: 'のむ — to drink' },
  { id: 'nihongo-voc-009', topic: 'vocab', topicLabel: 'Vocabulary', front: '行く', back: 'いく — to go' },
  { id: 'nihongo-voc-010', topic: 'vocab', topicLabel: 'Vocabulary', front: '来る', back: 'くる — to come' },
  { id: 'nihongo-voc-011', topic: 'vocab', topicLabel: 'Vocabulary', front: '見る', back: 'みる — to see, to watch' },
  { id: 'nihongo-voc-012', topic: 'vocab', topicLabel: 'Vocabulary', front: '大きい', back: 'おおきい — big' },
  { id: 'nihongo-voc-013', topic: 'vocab', topicLabel: 'Vocabulary', front: '小さい', back: 'ちいさい — small' },
  { id: 'nihongo-voc-014', topic: 'vocab', topicLabel: 'Vocabulary', front: '高い', back: 'たかい — tall, expensive' },
  { id: 'nihongo-voc-015', topic: 'vocab', topicLabel: 'Vocabulary', front: '安い', back: 'やすい — cheap' },
  { id: 'nihongo-voc-016', topic: 'vocab', topicLabel: 'Vocabulary', front: '日本', back: 'にほん — Japan' },
  { id: 'nihongo-voc-017', topic: 'vocab', topicLabel: 'Vocabulary', front: '英語', back: 'えいご — English (language)' },
  { id: 'nihongo-voc-018', topic: 'vocab', topicLabel: 'Vocabulary', front: '本', back: 'ほん — book' },
  { id: 'nihongo-voc-019', topic: 'vocab', topicLabel: 'Vocabulary', front: '車', back: 'くるま — car' },
  { id: 'nihongo-voc-020', topic: 'vocab', topicLabel: 'Vocabulary', front: '家', back: 'いえ — house, home' },
  { id: 'nihongo-voc-021', topic: 'vocab', topicLabel: 'Vocabulary', front: '今日', back: 'きょう — today' },
  { id: 'nihongo-voc-022', topic: 'vocab', topicLabel: 'Vocabulary', front: '明日', back: 'あした — tomorrow' },
  { id: 'nihongo-voc-023', topic: 'vocab', topicLabel: 'Vocabulary', front: '名前', back: 'なまえ — name' },
  { id: 'nihongo-voc-024', topic: 'vocab', topicLabel: 'Vocabulary', front: '何', back: 'なに — what' },

  // ── Kanji ────────────────────────────────────────────────────
  { id: 'nihongo-kanji-001', topic: 'kanji', topicLabel: 'Kanji', front: '日', back: 'On ニチ · Kun ひ — sun, day (4 strokes)' },
  { id: 'nihongo-kanji-002', topic: 'kanji', topicLabel: 'Kanji', front: '月', back: 'On ゲツ · Kun つき — moon, month (4 strokes)' },
  { id: 'nihongo-kanji-003', topic: 'kanji', topicLabel: 'Kanji', front: '火', back: 'On カ · Kun ひ — fire (4 strokes)' },
  { id: 'nihongo-kanji-004', topic: 'kanji', topicLabel: 'Kanji', front: '水', back: 'On スイ · Kun みず — water (4 strokes)' },
  { id: 'nihongo-kanji-005', topic: 'kanji', topicLabel: 'Kanji', front: '木', back: 'On モク · Kun き — tree, wood (4 strokes)' },
  { id: 'nihongo-kanji-006', topic: 'kanji', topicLabel: 'Kanji', front: '金', back: 'On キン · Kun かね — gold, money (8 strokes)' },
  { id: 'nihongo-kanji-007', topic: 'kanji', topicLabel: 'Kanji', front: '土', back: 'On ド · Kun つち — earth, soil (3 strokes)' },
  { id: 'nihongo-kanji-008', topic: 'kanji', topicLabel: 'Kanji', front: '山', back: 'On サン · Kun やま — mountain (3 strokes)' },
  { id: 'nihongo-kanji-009', topic: 'kanji', topicLabel: 'Kanji', front: '川', back: 'On セン · Kun かわ — river (3 strokes)' },
  { id: 'nihongo-kanji-010', topic: 'kanji', topicLabel: 'Kanji', front: '人', back: 'On ジン · Kun ひと — person (2 strokes)' },
  { id: 'nihongo-kanji-011', topic: 'kanji', topicLabel: 'Kanji', front: '大', back: 'On ダイ · Kun おお — big, large (3 strokes)' },
  { id: 'nihongo-kanji-012', topic: 'kanji', topicLabel: 'Kanji', front: '学', back: 'On ガク · Kun まな — study, learning (8 strokes)' },
];
