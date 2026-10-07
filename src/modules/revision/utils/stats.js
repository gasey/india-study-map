const QUIZ_STATS_KEY = 'india-study-map-quiz-stats'
const STREAK_KEY = 'india-study-map-streak'

// ============ QUIZ STATS (per-topic accuracy) ============

export function recordQuizAnswer(subjectId, topicId, correct) {
  const stats = JSON.parse(localStorage.getItem(QUIZ_STATS_KEY) || '{}')
  const key = `${subjectId}/${topicId}`
  if (!stats[key]) stats[key] = { correct: 0, total: 0 }
  stats[key].total += 1
  if (correct) stats[key].correct += 1
  localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats))
}

export function getQuizStats() {
  return JSON.parse(localStorage.getItem(QUIZ_STATS_KEY) || '{}')
}

export function getWeakTopics(allTopics, minAttempts = 3, limit = 5) {
  const stats = getQuizStats()
  const results = []

  for (const [key, s] of Object.entries(stats)) {
    if (s.total < minAttempts) continue
    const [subjectId, topicId] = key.split('/')
    const accuracy = s.correct / s.total
    results.push({ subjectId, topicId, accuracy, correct: s.correct, total: s.total })
  }

  // Attach titles
  const topicMap = {}
  for (const t of allTopics) topicMap[`${t.subject}/${t.id}`] = t.title

  return results
    .filter((r) => topicMap[`${r.subjectId}/${r.topicId}`])
    .map((r) => ({ ...r, title: topicMap[`${r.subjectId}/${r.topicId}`] }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit)
}

// ============ STREAK COUNTER ============

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function touchStreak() {
  const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"dates":[]}')
  const today = todayStr()
  if (!data.dates.includes(today)) {
    data.dates.push(today)
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
  }
}

export function getStreak() {
  const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"dates":[]}')
  if (data.dates.length === 0) return 0

  const dates = new Set(data.dates)
  let streak = 0
  const cursor = new Date()

  // If today isn't recorded yet but yesterday is, streak still counts
  if (!dates.has(todayStr())) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
