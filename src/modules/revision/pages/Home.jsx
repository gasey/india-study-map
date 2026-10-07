import { Link } from 'react-router-dom'
import { subjects, getAllTopics } from '../utils/data'
import { getProgress } from '../components/shared/ProgressTracker'
import { getDueCount } from '../components/revision/FlashcardView'
import { getStreak, getWeakTopics } from '../utils/stats'

export default function Home() {
  const allTopics = getAllTopics()
  const progress = getProgress()
  const completedCount = Object.values(progress).filter(Boolean).length
  const totalTopics = allTopics.length
  const percent = totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0
  const flashcardsDue = getDueCount()
  const streak = getStreak()
  const weakTopics = getWeakTopics(allTopics)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to India Study Map
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your comprehensive revision module for UPSC/PSC preparation.
          Study guides, quizzes, timelines, and mind maps — all connected.
        </p>
      </div>

      {/* Stats dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{percent}%</div>
          <div className="text-xs text-gray-500 mt-1">Revision Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}/{totalTopics}</div>
          <div className="text-xs text-gray-500 mt-1">Topics Completed</div>
        </div>
        <Link to="/revision/flashcards" className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
          <div className={`text-2xl font-bold ${flashcardsDue > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {flashcardsDue}
          </div>
          <div className="text-xs text-gray-500 mt-1">Flashcards Due</div>
        </Link>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-500">🔥 {streak}</div>
          <div className="text-xs text-gray-500 mt-1">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-xs text-gray-500 mt-1">Subjects</div>
        </div>
      </div>

      {/* Weak topics — needs attention */}
      {weakTopics.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-xl p-5 mb-10">
          <h2 className="font-bold text-gray-800 mb-3">⚠️ Needs Revision (weakest quiz topics)</h2>
          <div className="flex flex-wrap gap-3">
            {weakTopics.map((t) => (
              <Link
                key={`${t.subjectId}/${t.topicId}`}
                to={`/revision/${t.subjectId}/${t.topicId}`}
                className="bg-white rounded-lg shadow-sm px-4 py-2 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-800">{t.title}</div>
                <div className="text-xs text-orange-600">
                  {Math.round(t.accuracy * 100)}% ({t.correct}/{t.total})
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/revision/guide/${subject.id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4"
            style={{ borderTopColor: subject.color }}
          >
            <div className="text-4xl mb-3">{subject.icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{subject.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {subject.topics.length} topics
              </span>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: subject.color }}
              >
                Start →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link
          to="/revision/book"
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">📖</div>
          <h3 className="font-bold text-gray-800">Revision Book</h3>
          <p className="text-sm text-gray-600">Export all notes as PDF</p>
        </Link>
        <Link
          to="/revision/flashcards"
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🃏</div>
          <h3 className="font-bold text-gray-800">Flashcards</h3>
          <p className="text-sm text-gray-600">Spaced repetition review</p>
        </Link>
        <Link
          to="/revision/timeline"
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-bold text-gray-800">Master Timeline</h3>
          <p className="text-sm text-gray-600">All events from 2500 BCE to 2023</p>
        </Link>
        <Link
          to="/revision/mindmap"
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🧠</div>
          <h3 className="font-bold text-gray-800">Mind Maps</h3>
          <p className="text-sm text-gray-600">Visual connections between topics</p>
        </Link>
        <Link
          to="/revision/quiz/mixed"
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🔀</div>
          <h3 className="font-bold text-gray-800">Mixed Quiz</h3>
          <p className="text-sm text-gray-600">25 random questions, all subjects</p>
        </Link>
      </div>
    </div>
  )
}
