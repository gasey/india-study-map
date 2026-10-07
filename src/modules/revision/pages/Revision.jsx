import { useParams, Link } from 'react-router-dom'
import { subjects, getSubjectTopics, getTopicData } from '../utils/data'
import TopicCard from '../components/revision/TopicCard'

export default function Revision() {
  const { subjectId } = useParams()

  if (!subjectId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Revision Module</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/revision/guide/${subject.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4"
              style={{ borderTopColor: subject.color }}
            >
              <div className="text-4xl mb-3">{subject.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h2>
              <p className="text-sm text-gray-600">{subject.description}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const subject = subjects.find((s) => s.id === subjectId)
  if (!subject) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Subject not found</div>
  }

  const topics = getSubjectTopics(subjectId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/revision" className="text-blue-600 hover:underline text-sm">
          ← Back to Subjects
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <div className="text-5xl">{subject.icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{subject.name}</h1>
            <p className="text-gray-600">{subject.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            subjectId={subjectId}
            color={subject.color}
          />
        ))}
      </div>
    </div>
  )
}
