import { getTopicData } from '../../utils/data'

export default function TricksView({ subjectId, topicId }) {
  const topic = getTopicData(subjectId, topicId)

  if (!topic || !topic.content.mnemonics) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-500">No mnemonics available for this topic.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Tricks & Mnemonics
      </h1>
      <p className="text-gray-600 mb-8">{topic.title}</p>

      <div className="space-y-6">
        {topic.content.mnemonics.map((mnemonic, idx) => (
          <div
            key={idx}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
          >
            <h3 className="font-bold text-gray-800 text-lg mb-3">
              {mnemonic.topic}
            </h3>
            <div className="bg-white p-4 rounded-lg mb-3 font-mono text-sm">
              {mnemonic.trick}
            </div>
            <p className="text-gray-700">{mnemonic.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
