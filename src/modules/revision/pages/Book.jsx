import { useState } from 'react'
import { subjects, getTopicData } from '../utils/data'

export default function Book() {
  const [included, setIncluded] = useState(() =>
    Object.fromEntries(subjects.map((s) => [s.id, true]))
  )

  const toggle = (id) => setIncluded((prev) => ({ ...prev, [id]: !prev[id] }))

  const activeSubjects = subjects.filter((s) => included[s.id])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 print:px-0 print:py-0">
      <div className="print:hidden mb-8 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📖 Revision Book</h1>
        <p className="text-gray-600 mb-4">
          Generate a printable revision book. Select subjects, then use your browser's
          Print → "Save as PDF" to download.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          {subjects.map((s) => (
            <label key={s.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={included[s.id]}
                onChange={() => toggle(s.id)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">
                {s.icon} {s.name}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Cover page */}
      <div className="print-page text-center py-20 hidden print:block">
        <h1 className="text-4xl font-bold mb-4">India Study Map</h1>
        <p className="text-xl text-gray-600">Comprehensive Revision Book</p>
        <p className="text-gray-500 mt-2">
          {activeSubjects.map((s) => s.name).join(' • ')}
        </p>
        <p className="text-sm text-gray-400 mt-8">
          Generated {new Date().toLocaleDateString()}
        </p>
      </div>

      {activeSubjects.map((subject) => (
        <div key={subject.id}>
          <div className="print-page">
            <h1 className="text-3xl font-bold mb-2 border-b-4 pb-2" style={{ borderColor: subject.color }}>
              {subject.icon} {subject.name}
            </h1>
          </div>

          {subject.topics.map((t) => {
            const topic = getTopicData(subject.id, t.id)
            if (!topic) return null
            return (
              <div key={t.id} className="print-page bg-white rounded-xl shadow-md p-6 mb-8 print:shadow-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{topic.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{topic.description}</p>

                <p className="text-gray-700 mb-4">{topic.content.overview}</p>

                <h3 className="font-bold text-gray-800 mb-2">Key Points</h3>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {topic.content.keyPoints.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">{p}</li>
                  ))}
                </ul>

                {topic.content.mnemonics?.length > 0 && (
                  <>
                    <h3 className="font-bold text-gray-800 mb-2">Tricks & Mnemonics</h3>
                    <div className="space-y-3">
                      {topic.content.mnemonics.map((m, i) => (
                        <div key={i} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                          <div className="font-medium text-sm text-gray-800">{m.topic}</div>
                          <div className="text-sm font-mono mt-1">{m.trick}</div>
                          <div className="text-xs text-gray-600 mt-1">{m.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
