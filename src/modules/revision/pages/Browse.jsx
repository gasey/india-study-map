import { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subjects } from '../utils/data'
import { buildBrowseDeck } from '../utils/browse'

const TYPE_META = {
  fact: { label: '📌 Fact', gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#60a5fa', text: '#1d4ed8' },
  trick: { label: '🧠 Trick', gradient: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '#fb923c', text: '#c2410c' },
  event: { label: '📅 Event', gradient: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '#4ade80', text: '#15803d' },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Browse() {
  const fullDeck = useMemo(() => buildBrowseDeck(), [])
  const [subject, setSubject] = useState('all')
  const [type, setType] = useState('all')
  const [shuffled, setShuffled] = useState(true)
  const [index, setIndex] = useState(0)
  const [seed, setSeed] = useState(0)

  const deck = useMemo(() => {
    let d = fullDeck
    if (subject !== 'all') d = d.filter((c) => c.subject === subject)
    if (type !== 'all') d = d.filter((c) => c.type === type)
    return shuffled ? shuffle(d) : d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullDeck, subject, type, shuffled, seed])

  useEffect(() => {
    setIndex(0)
  }, [subject, type, shuffled, seed])

  const next = useCallback(() => setIndex((i) => (i + 1) % deck.length), [deck.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + deck.length) % deck.length), [deck.length])
  const reshuffle = useCallback(() => { setSeed((s) => s + 1); setIndex(0) }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return
      if (e.code === 'ArrowRight' || e.code === 'Space') { e.preventDefault(); next() }
      else if (e.code === 'ArrowLeft') { prev() }
      else if (e.code === 'KeyS') { reshuffle() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, reshuffle])

  const card = deck[index]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-bold">
          <span className="rv-gradient-text">Browse</span>
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Flip through facts, tricks & events — like scrolling your notes feed.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        <button
          onClick={() => setSubject('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${subject === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubject(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${subject === s.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            style={subject === s.id ? { backgroundColor: s.color } : {}}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {['all', 'fact', 'trick', 'event'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t === 'all' ? '✨ Everything' : TYPE_META[t].label + 's'}
          </button>
        ))}
        <button
          onClick={() => setShuffled(!shuffled)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${shuffled ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          🔀 Shuffle {shuffled ? 'on' : 'off'}
        </button>
      </div>

      {/* Card */}
      {card ? (
        <div key={`${index}-${card.type}-${card.body.slice(0, 12)}`} className="rv-pop">
          <div
            className="rounded-3xl shadow-xl p-8 md:p-10 min-h-[320px] flex flex-col"
            style={{ background: TYPE_META[card.type].gradient, border: `2px solid ${TYPE_META[card.type].border}` }}
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/70"
                style={{ color: TYPE_META[card.type].text }}
              >
                {TYPE_META[card.type].label}
              </span>
              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: card.subjectColor }}
              >
                {card.subjectIcon} {card.subjectName}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="text-sm font-semibold mb-2" style={{ color: TYPE_META[card.type].text }}>
                {card.title}
              </div>
              <p className={`font-bold leading-snug ${card.type === 'trick' ? 'rv-trick-text text-xl md:text-2xl' : 'text-lg md:text-xl'} text-gray-800`}>
                {card.body}
              </p>
              {card.extra && (
                <p className="text-sm text-gray-600 mt-4 leading-relaxed border-t border-black/10 pt-3">
                  💡 {card.extra}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {index + 1} / {deck.length}
              </span>
              <Link
                to={`/revision/guide/${card.subject}/${card.topicId}`}
                className="text-xs font-semibold hover:underline"
                style={{ color: TYPE_META[card.type].text }}
              >
                Open full guide →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">No cards match these filters.</div>
      )}

      {/* Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button onClick={prev} className="w-12 h-12 rounded-full bg-white shadow-md text-xl hover:shadow-lg hover:scale-105 transition-all">
          ←
        </button>
        <button onClick={reshuffle} className="w-12 h-12 rounded-full bg-purple-600 text-white shadow-md text-xl hover:shadow-lg hover:scale-105 transition-all" title="Shuffle (S)">
          🔀
        </button>
        <button onClick={next} className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-md text-xl hover:shadow-lg hover:scale-105 transition-all">
          →
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        ⌨️ ← → or Space = flip • S = shuffle
      </p>
    </div>
  )
}
