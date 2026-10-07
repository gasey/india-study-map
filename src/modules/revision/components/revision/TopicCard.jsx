import { Link } from 'react-router-dom'

export default function TopicCard({ topic, subjectId, color }) {
  return (
    <Link
      to={`/revision/guide/${subjectId}/${topic.id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4"
      style={{ borderTopColor: color }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">{topic.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {topic.quizCount || 0} quiz questions
        </span>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          Study →
        </span>
      </div>
    </Link>
  )
}
