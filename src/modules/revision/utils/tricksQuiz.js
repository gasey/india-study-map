import { getAllMnemonics } from './data'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(pool, correct, count) {
  return shuffle(pool.filter((x) => x !== correct)).slice(0, count)
}

/**
 * Generates quiz questions FROM the mnemonics themselves.
 * Two question shapes, alternated:
 *  1. "The trick 'X' helps you remember what?"  → options = other trick topics
 *  2. "Which trick helps you remember 'topic'?" → options = other tricks (truncated)
 */
export function getTricksQuizQuestions(subjectId = null, limit = 20) {
  const all = getAllMnemonics(subjectId)
  if (all.length < 4) return []

  const questions = []
  const shuffled = shuffle(all)

  for (let i = 0; i < Math.min(limit, shuffled.length); i++) {
    const m = shuffled[i]
    const type = i % 2

    if (type === 0) {
      const options = shuffle([
        m.topic,
        ...pickDistractors(all.map((x) => x.topic), m.topic, 3),
      ])
      questions.push({
        question: `The trick "${m.trick.length > 90 ? m.trick.slice(0, 90) + '…' : m.trick}" helps you remember what?`,
        options,
        correct: options.indexOf(m.topic),
        explanation: m.explanation,
        topicId: m.topicId,
        topicTitle: `${m.topicTitle} — Tricks`,
      })
    } else {
      const trickPool = all.map((x) => x.trick)
      const distractors = pickDistractors(trickPool, m.trick, 3).map((t) =>
        t.length > 60 ? t.slice(0, 60) + '…' : t
      )
      const correctText = m.trick.length > 60 ? m.trick.slice(0, 60) + '…' : m.trick
      const options = shuffle([correctText, ...distractors])
      questions.push({
        question: `Which trick helps you remember "${m.topic}"?`,
        options,
        correct: options.indexOf(correctText),
        explanation: m.explanation,
        topicId: m.topicId,
        topicTitle: `${m.topicTitle} — Tricks`,
      })
    }
  }

  return questions
}
