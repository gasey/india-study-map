// ============================================
// NIHONGO COURSE — 6-stage grammar path, same shape as the Python/Postgres
// modules (src/data/python/lessons.ts, src/data/postgres/lessons.ts).
//
// Those modules hit "real content, not filler" by quoting the user's own
// project code. There's no equivalent artifact for Japanese grammar, so
// instead every example sentence below is a real, native sentence pulled
// live from the Tatoeba API (api.tatoeba.org) — not invented textbook
// Japanese. Tatoeba sentences are CC BY 2.0 FR; attributed per stage.
// ============================================
import type { QuizQuestion } from '@/lib/quizTypes';

export interface NihongoStage {
  id: string;
  title: string;
  blurb: string;
  notes: string[];
  example?: { label: string; source?: string; snippet: string };
  quiz: QuizQuestion[];
}

export const nihongoStages: NihongoStage[] = [
  {
    id: 'basics',
    title: '1. Sentence basics — は and です',
    blurb: 'Word order, the topic particle は, and the polite copula です.',
    notes: [
      'Basic word order is Subject – Object – Verb — the reverse of English\'s Subject-Verb-Object.',
      'は (pronounced "wa" as a particle) marks the sentence\'s topic — what the sentence is about, not necessarily its grammatical subject.',
      'です is the polite copula: roughly "is/am/are," used after nouns and na-adjectives. It never attaches directly to a verb.',
      'The verb or copula almost always sits at the very end of the sentence — everything else can move around it more freely than in English.',
    ],
    example: {
      label: 'A real sentence',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `私は学生です。\n"I am a student."`,
    },
    quiz: [
      { q: 'What does は mark in a sentence like 私は学生です?', options: ['The direct object', 'The sentence\'s topic', 'A question', 'Past tense'], answerIndex: 1, explanation: 'は marks 私 ("I") as the topic — what the sentence is about — not a grammatical object.' },
      { q: 'Where does です go in a basic sentence?', options: ['First', 'Right after the subject', 'Almost always at the end', 'It can go anywhere'], answerIndex: 2, explanation: 'The verb or copula anchors the end of a Japanese sentence; word order before it is comparatively flexible.' },
      { q: 'Can です attach directly to a verb, like 食べるです?', options: ['Yes, always', 'No — です follows nouns/na-adjectives, verbs conjugate on their own (e.g. 食べます)', 'Only in questions', 'Only in the past tense'], answerIndex: 1, explanation: 'です is for nouns and na-adjectives. Verbs carry their own politeness conjugation (the ます form, stage 3) instead of taking です.' },
    ],
  },
  {
    id: 'particles',
    title: '2. Particles — を, に, で',
    blurb: 'The three particles that show up in almost every sentence: object, destination/time, location.',
    notes: [
      'を marks the direct object of a verb — the thing being acted on.',
      'に marks a destination ("to school") or a specific point in time.',
      'で marks where an action happens, or the means/instrument used to do it (e.g. "by bus").',
      'Particles attach directly after the word they mark, with no space in real Japanese — romanized examples add spaces only for readability.',
    ],
    example: {
      label: 'Three real sentences, one per particle',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `弟はテレビを見ます。 — "My brother watches television." (を = object)\n学校に行きます。 — "I'm going to school." (に = destination)\n彼は今図書館で勉強しています。 — "He is studying in the library now." (で = location)`,
    },
    quiz: [
      { q: 'In 弟はテレビを見ます, what does を mark?', options: ['弟 (brother)', 'テレビ (television) — the thing being watched', 'The verb', 'Nothing, を is optional'], answerIndex: 1, explanation: 'を attaches to テレビ, marking it as the direct object of 見ます ("watches").' },
      { q: '学校に行きます — what role does に play?', options: ['Marks 学校 as the object', 'Marks 学校 as the destination of 行く ("go")', 'Makes the sentence a question', 'Marks past tense'], answerIndex: 1, explanation: 'に after a place marks where you\'re going — the destination of the motion verb 行く.' },
      { q: 'Which particle would you use for "studying in the library" (the location of an action)?', options: ['を', 'に', 'で', 'は'], answerIndex: 2, explanation: 'で marks the location where an action takes place — 図書館で勉強する = "study in/at the library."' },
    ],
  },
  {
    id: 'verbs',
    title: '3. Verbs — ます form & groups',
    blurb: 'The polite everyday verb form, and the three conjugation groups behind it.',
    notes: [
      'Dictionary form (行く, 食べる, 来る) is the casual/plain form; ます form is the polite form used in most everyday conversation.',
      'る-verbs (ichidan, "Group 2"): drop る, add ます — 食べる → 食べます, 見る → 見ます.',
      'う-verbs (godan, "Group 1"): change the final う-sound to its い-row equivalent, add ます — 行く → 行きます, 飲む → 飲みます.',
      '来る and する are irregular (Group 3): 来る → 来ます, する → します — just memorize these two.',
    ],
    example: {
      label: 'Real sentences, ます forms in the wild',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `弟はテレビを見ます。 — "My brother watches television." (見る → 見ます)\n学校に行きます。 — "I'm going to school." (行く → 行きます)\nトムは毎日、朝ご飯を食べます。 — "Tom eats breakfast every morning." (食べる → 食べます)`,
    },
    quiz: [
      { q: '見る is an ichidan (る-verb). What\'s its ます form?', options: ['見きます', '見ります', '見ます', '見えます'], answerIndex: 2, explanation: 'Ichidan verbs just drop る and add ます: 見る → 見ます.' },
      { q: '行く is a godan (う-verb). What\'s its ます form?', options: ['行くます', '行きます', '行がます', '行けます'], answerIndex: 1, explanation: 'Godan verbs shift the final う-sound (く) to its い-row equivalent (き) before adding ます: 行く → 行きます.' },
      { q: 'Which two verbs are irregular and just need to be memorized?', options: ['食べる and 見る', '行く and 飲む', '来る and する', 'All verbs ending in る'], answerIndex: 2, explanation: '来る (来ます) and する (します) don\'t follow either regular pattern — they\'re the only two true irregulars in Japanese.' },
    ],
  },
  {
    id: 'adjectives',
    title: '4. Adjectives — い and な types',
    blurb: 'The two adjective families, and how each one negates.',
    notes: [
      'い-adjectives end in い and conjugate directly — no copula needed to negate: 大きい (big) → 大きくない (not big).',
      'な-adjectives take な before a noun (簡単な質問 = "a simple question") but drop it before です (簡単です = "is simple").',
      'い-adjective negation: drop the final い, add くない — 高い → 高くない ("not expensive").',
      'な-adjective negation instead uses じゃない/ではない after the plain form, since な-adjectives behave more like nouns grammatically.',
    ],
    example: {
      label: 'Real sentences, both adjective types',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `この家はあまり大きくないです。 — "This house is not very big." (い-adjective, negated)\n簡単な質問をしてみた。 — "I asked a simple question." (な-adjective + noun)\nそれは高くない。 — "It isn't expensive." (い-adjective, casual negation)`,
    },
    quiz: [
      { q: 'How do you negate the い-adjective 高い ("expensive")?', options: ['高いない', '高くない', '高じゃない', '高でない'], answerIndex: 1, explanation: 'Drop the final い and add くない: 高い → 高くない.' },
      { q: 'In 簡単な質問, why does 簡単 take な?', options: ['な marks the past tense', 'な-adjectives need な when directly modifying a following noun', 'It\'s optional decoration', '質問 requires it, not 簡単'], answerIndex: 1, explanation: 'な-adjectives (unlike い-adjectives) need な inserted before the noun they modify: 簡単な質問 = "a simple question."' },
      { q: 'Would 簡単な質問です need the な before です?', options: ['Yes, always', 'No — な drops before です, giving 簡単です', 'Only in questions', 'な never appears with な-adjectives'], answerIndex: 1, explanation: 'な only appears when directly modifying a noun. Before です, the plain stem is used: 簡単です, not 簡単なです.' },
    ],
  },
  {
    id: 'questions',
    title: '5. Questions & question words',
    blurb: 'Turning any statement into a question, and the core question words.',
    notes: [
      'か at the very end of a sentence turns it into a question — no word-order change needed, unlike English.',
      '何 (なに/なん) = what, どこ = where, いつ = when, だれ = who — question words simply take the place where the answer would go.',
      'Sentence-final か alone is enough for a yes/no question; a question word plus か together asks an open-ended question.',
      'Intonation (rising pitch) can substitute for か in casual speech, but written/formal Japanese still uses か explicitly.',
    ],
    example: {
      label: 'Real questions',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `これは何ですか。 — "What is this?"\n一日何時間テレビを見ますか？ — "How many hours a day do you watch TV?"`,
    },
    quiz: [
      { q: 'What turns これは何です into a question (これは何ですか)?', options: ['Reordering the words', 'Adding か at the end', 'Changing です to だ', 'Nothing needed, it\'s already a question'], answerIndex: 1, explanation: 'Unlike English, Japanese doesn\'t reorder words for questions — sentence-final か does the whole job.' },
      { q: 'In 一日何時間テレビを見ますか, what does 何時間 ask about?', options: ['What day', 'How many hours', 'Where', 'Who'], answerIndex: 1, explanation: '何時間 = "how many hours" — 何 (what) + 時間 (hours/time), asking for a quantity of time.' },
      { q: 'Which question word would you use to ask "where"?', options: ['何', 'いつ', 'どこ', 'だれ'], answerIndex: 2, explanation: 'どこ = where. 何 = what, いつ = when, だれ = who.' },
    ],
  },
  {
    id: 'reading',
    title: '6. Read three real sentences',
    blurb: 'Everything above, applied — three more real Tatoeba sentences, unglossed, then a comprehension check.',
    notes: [
      '毎日、学校へ行きます。 — uses に/へ (destination) and the ます form from stages 2–3.',
      '私は明日の午後は暇です。 — uses は (topic) twice, and です from stage 1 — note how the second は narrows the topic to "tomorrow afternoon" specifically.',
      '今日はお忙しいですか。 — a real か question (stage 5), with お添え (the polite お- prefix) on 忙しい, which you\'ll see constantly in polite speech but haven\'t been taught yet — that\'s deliberate; not everything needs to be explained before you can read it.',
      'This is the same idea as the Python module\'s stage 6 ("go read real code") — the goal here is reading real sentences with the pieces you already have, not a fully-glossed textbook passage.',
    ],
    example: {
      label: 'Three more real sentences',
      source: 'Tatoeba (CC BY 2.0 FR)',
      snippet: `毎日、学校へ行きます。 — "I go to school every day."\n私は明日の午後は暇です。 — "I will be free tomorrow afternoon."\n今日はお忙しいですか。 — "Are you busy today?"`,
    },
    quiz: [
      { q: 'In 毎日、学校へ行きます, which stage\'s grammar lets you recognize 行きます as "go"?', options: ['Stage 1 (は/です)', 'Stage 3 (ます form) — 行く → 行きます', 'Stage 4 (adjectives)', 'Stage 5 (questions)'], answerIndex: 1, explanation: '行きます is the polite ます form of the godan verb 行く, from stage 3.' },
      { q: '私は明日の午後は暇です has は twice. What\'s happening?', options: ['A typo — は should only appear once', 'The second は narrows the topic from "I" to "tomorrow afternoon" specifically', 'Both は are direct objects', 'は has no meaning here'], answerIndex: 1, explanation: 'Multiple は in one sentence is normal — each narrows the topic further; here "as for me, as for tomorrow afternoon, (I am) free."' },
      { q: '今日はお忙しいですか — what makes this a question?', options: ['お忙しい by itself', 'The sentence-final か', 'Word order', 'It isn\'t actually a question'], answerIndex: 1, explanation: 'Same rule as stage 5 — sentence-final か marks it as a question, regardless of what else (like the polite お- prefix) appears in the sentence.' },
    ],
  },
];
