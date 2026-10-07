import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { subjects, getAllMnemonics } from '../utils/data'
import TrickCard from '../components/revision/TrickCard'

export default function Tricks() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [query, setQuery] = useState('')

  const allTricks = useMemo(() => getAllMnemonics(), [])

  const filtered = useMemo(() => {
    let list = allTricks
    if (selectedSubject !== 'all') {
      list = list.filter((t) => t.subject === selectedSubject)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.topic.toLowerCase().includes(q) ||
          t.trick.toLowerCase().includes(q) ||
          t.explanation.toLowerCase().includes(q)
      )
    }
    return list
  }, [allTricks, selectedSubject, query])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/revision" className="text-blue-600 hover:underline text-sm">
          ← Back to Revision Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">
          <span className="rv-gradient-text">Tricks & Mnemonics</span>
        </h1>
        <p className="text-gray-600">
          {allTricks.length} memory tricks from your notes. Tap any card to see why it works.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSubject === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({allTricks.length})
        </button>
        {subjects.map((s) => {
          const count = allTricks.filter((t) => t.subject === s.id).length
          if (count === 0) return null
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === s.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedSubject === s.id ? { backgroundColor: s.color } : {}}
            >
              {s.icon} {s.name} ({count})
            </button>
          )
        })}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tricks… e.g. HMCQP, Golden Triangle, Dandi"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rv-stagger">
        {filtered.map((t, i) => (
          <TrickCard key={`${t.subject}-${t.topicId}-${i}`} mnemonic={t} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No tricks match your search.</p>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/revision/quiz/tricks"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          🎯 Test yourself on these tricks →
        </Link>
      </div>
    </div>
  )
}
