import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { subjects } from '../utils/data'
import FlashcardView from '../components/revision/FlashcardView'

export default function Flashcards() {
  const { subjectId } = useParams()
  const [selectedSubject, setSelectedSubject] = useState(subjectId || 'polity')

  // Keep state in sync when arriving via a guide's "Flashcards" button
  // with a different subject while this page is already mounted
  useEffect(() => {
    if (subjectId) setSelectedSubject(subjectId)
  }, [subjectId])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/revision" className="text-blue-600 hover:underline text-sm">
          ← Back to Revision Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-4">Flashcards</h1>
        <p className="text-gray-600 mb-6">
          Review with spaced repetition. Cards are scheduled based on how well you remember them.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                selectedSubject === subject.id
                  ? { backgroundColor: subject.color }
                  : {}
              }
            >
              {subject.icon} {subject.name}
            </button>
          ))}
        </div>
      </div>

      <FlashcardView subjectId={selectedSubject} />
    </div>
  )
}
