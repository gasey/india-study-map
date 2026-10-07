import { useParams, Link } from 'react-router-dom'
import { getTopicData, getRelatedTopics } from '../utils/data'
import ProgressTracker from '../components/shared/ProgressTracker'

export default function Guide() {
  const { subjectId, topicId } = useParams()
  const topic = getTopicData(subjectId, topicId)

  if (!topic) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Topic not found</div>
  }

  const relatedTopics = getRelatedTopics(topicId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 print:px-0">
      <div className="mb-6 print:hidden flex items-center justify-between">
        <Link to={`/revision/guide/${subjectId}`} className="text-blue-600 hover:underline text-sm">
          ← Back to {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}
        </Link>
        <ProgressTracker topicId={topicId} subjectId={subjectId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{topic.title}</h1>
            <p className="text-gray-600 mb-6">{topic.description}</p>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{topic.content.overview}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Key Points</h2>
              <ul className="space-y-2">
                {topic.content.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {topic.content.mnemonics && topic.content.mnemonics.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Tricks & Mnemonics</h2>
                <div className="space-y-4">
                  {topic.content.mnemonics.map((mnemonic, idx) => (
                    <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <h3 className="font-bold text-gray-800 mb-1">{mnemonic.topic}</h3>
                      <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded mb-2">
                        {mnemonic.trick}
                      </p>
                      <p className="text-sm text-gray-600">{mnemonic.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topic.images && topic.images.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Your Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topic.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Note ${idx + 1}`}
                      className="rounded-lg shadow-md w-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 print:hidden">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Related Topics</h2>
            <div className="space-y-3">
              {relatedTopics.map((related) => (
                <Link
                  key={related.id}
                  to={`/revision/guide/${related.subject}/${related.id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">{related.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{related.subject}</div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={`/revision/quiz/${subjectId}/${topicId}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quiz This Topic
                </Link>
                <Link
                  to={`/revision/quiz/${subjectId}`}
                  className="block w-full text-center bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  Quiz Whole Subject
                </Link>
                <Link
                  to={`/revision/flashcards/${subjectId}`}
                  className="block w-full text-center bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  Flashcards
                </Link>
                <button
                  onClick={() => window.print()}
                  className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🖨️ Print Guide
                </button>
                <Link
                  to="/revision/timeline"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Timeline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
