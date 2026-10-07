import { getAllTopics, getTimelineEvents } from './data'

export function searchAll(query) {
  if (!query.trim()) return { topics: [], events: [] }

  const q = query.toLowerCase()
  const allTopics = getAllTopics()
  const timelineEvents = getTimelineEvents()

  const topics = allTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
  )

  const events = timelineEvents.filter(
    (e) =>
      e.event.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.topic.toLowerCase().includes(q)
  )

  return { topics, events }
}

export function searchBySubject(query, subjectId) {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const allTopics = getAllTopics()

  return allTopics.filter(
    (t) =>
      t.subject === subjectId &&
      (t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q))
  )
}
