import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicData, getRelatedTopics } from '../utils/data'
import ProgressTracker from '../components/shared/ProgressTracker'
import TrickCard from '../components/revision/TrickCard'

function Section({ icon, title, count, defaultOpen = false, accent = '#3b82f6', children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 rv-fade-up">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </span>
        <span className="font-bold text-gray-800 flex-1">{title}</span>
        {count != null && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${accent}18`, color: accent }}
          >
            {count}
          </span>
        )}
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      <div className={`rv-collapse ${open ? 'open' : ''}`}>
        <div>
          <div className="px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

const POINT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

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
          ← Back to {subjectId.charAt(0).toUpperCase() + subjectId.slice(1).replace('-', ' ')}
        </Link>
        <ProgressTracker topicId={topicId} subjectId={subjectId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white rv-fade-up">
            <h1 className="text-3xl font-bold mb-1">{topic.title}</h1>
            <p className="text-blue-100">{topic.description}</p>
            <div className="flex gap-4 mt-3 text-xs text-blue-200">
              <span>📌 {topic.content.keyPoints.length} key points</span>
              <span>🧠 {topic.content.mnemonics?.length || 0} tricks</span>
              <span>❓ {topic.quiz?.length || 0} quiz questions</span>
            </div>
          </div>

          {/* Overview */}
          <Section icon="📖" title="Overview" defaultOpen accent="#3b82f6">
            <p className="text-gray-700 leading-relaxed">{topic.content.overview}</p>
          </Section>

          {/* Key Points — numbered chips, staggered */}
          <Section icon="📌" title="Key Points" count={topic.content.keyPoints.length} defaultOpen accent="#8b5cf6">
            <div className="space-y-2 rv-stagger">
              {topic.content.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: POINT_COLORS[idx % POINT_COLORS.length] }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Tricks — featured cards */}
          {topic.content.mnemonics && topic.content.mnemonics.length > 0 && (
            <Section icon="🧠" title="Tricks & Mnemonics" count={topic.content.mnemonics.length} defaultOpen accent="#f59e0b">
              <div className="grid grid-cols-1 gap-4">
                {topic.content.mnemonics.map((m, idx) => (
                  <TrickCard key={idx} mnemonic={m} index={idx} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to={`/revision/quiz/tricks`}
                  className="inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  🎯 Quiz yourself on tricks like these →
                </Link>
              </div>
            </Section>
          )}

          {/* Timeline */}
          {topic.timeline && topic.timeline.length > 0 && (
            <Section icon="📅" title="Timeline" count={topic.timeline.length} accent="#10b981">
              <div className="space-y-3">
                {topic.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-green-600 w-16 shrink-0">
                      {t.year < 0 ? `${Math.abs(t.year)} BCE` : t.year}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm text-gray-700">{t.event}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Your Notes */}
          {topic.images && topic.images.length > 0 && (
            <Section icon="🖼️" title="Your Notes" count={topic.images.length} accent="#ec4899">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Note ${idx + 1}`}
                    className="rounded-lg shadow-md w-full rv-fade-up"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    loading="lazy"
                  />
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 print:hidden">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 rv-fade-up">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Related Topics</h2>
            <div className="space-y-3">
              {relatedTopics.map((related) => (
                <Link
                  key={related.id}
                  to={`/revision/guide/${related.subject}/${related.id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">{related.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{related.subject.replace('-', ' ')}</div>
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
