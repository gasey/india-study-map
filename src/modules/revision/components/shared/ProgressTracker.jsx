import { useState, useEffect } from 'react'

const STORAGE_KEY = 'india-study-map-progress'

export default function ProgressTracker({ topicId, subjectId }) {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    setCompleted(progress[`${subjectId}-${topicId}`] || false)
  }, [subjectId, topicId])

  const toggleComplete = () => {
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const key = `${subjectId}-${topicId}`
    progress[key] = !completed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    setCompleted(!completed)
  }

  return (
    <button
      onClick={toggleComplete}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        completed
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {completed ? '✓ Completed' : 'Mark as Revised'}
    </button>
  )
}

export function getProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
}

export function getSubjectProgress(subjectId) {
  const progress = getProgress()
  const subjectTopics = Object.keys(progress).filter(
    (key) => key.startsWith(`${subjectId}-`) && progress[key]
  )
  return subjectTopics.length
}
