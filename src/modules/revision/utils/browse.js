import { getAllMnemonics, getTimelineEvents, getTopicData, subjects } from './data'

/**
 * Builds a browsable "story deck" from every content type:
 *  - fact  → one key point from a topic
 *  - trick → one mnemonic
 *  - event → one timeline event
 */
export function buildBrowseDeck() {
  const deck = []

  // Facts (key points)
  for (const subject of subjects) {
    for (const t of subject.topics) {
      const topic = getTopicData(subject.id, t.id)
      if (!topic) continue
      for (const point of topic.content.keyPoints || []) {
        deck.push({
          type: 'fact',
          subject: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          subjectIcon: subject.icon,
          topicId: t.id,
          topicTitle: topic.title,
          title: topic.title,
          body: point,
        })
      }
    }
  }

  // Tricks
  for (const m of getAllMnemonics()) {
    const subject = subjects.find((s) => s.id === m.subject)
    deck.push({
      type: 'trick',
      subject: m.subject,
      subjectName: subject?.name || m.subject,
      subjectColor: subject?.color || '#6B7280',
      subjectIcon: subject?.icon || '📚',
      topicId: m.topicId,
      topicTitle: m.topicTitle,
      title: m.topic,
      body: m.trick,
      extra: m.explanation,
    })
  }

  // Timeline events
  for (const e of getTimelineEvents()) {
    const subject = subjects.find((s) => s.id === e.subject)
    deck.push({
      type: 'event',
      subject: e.subject,
      subjectName: subject?.name || e.subject,
      subjectColor: subject?.color || '#6B7280',
      subjectIcon: subject?.icon || '📚',
      topicId: e.topic,
      topicTitle: e.topic,
      title: e.year < 0 ? `${Math.abs(e.year)} BCE` : `${e.year}`,
      body: e.event,
    })
  }

  return deck
}
