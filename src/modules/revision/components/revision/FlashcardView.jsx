import { useState, useEffect, useCallback } from 'react'
import { getQuizQuestions } from '../../utils/data'

const STORAGE_KEY = 'india-study-map-srs'

export function getSRSData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
}

function saveSRSData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getDueCount(subjectId = null) {
  const srs = getSRSData()
  const now = new Date()
  const subjectsToCheck = subjectId ? [subjectId] : ['polity', 'history', 'geography', 'economy', 'current-affairs']
  let due = 0
  for (const sid of subjectsToCheck) {
    const questions = getQuizQuestions(sid)
    questions.forEach((_, idx) => {
      const cardId = `${sid}-${idx}`
      const data = srs[cardId]
      if (!data || new Date(data.nextReview) <= now) due++
    })
  }
  return due
}

function calculateNextReview(quality, prevData = {}) {
  const { ease = 2.5, interval = 0, repetitions = 0 } = prevData

  let newEase = ease
  let newInterval = interval
  let newRepetitions = repetitions

  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1
    } else if (repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * ease)
    }
    newRepetitions = repetitions + 1
  } else {
    newRepetitions = 0
    newInterval = 1
  }

  newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEase < 1.3) newEase = 1.3

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return { ease: newEase, interval: newInterval, repetitions: newRepetitions, nextReview: nextReview.toISOString() }
}

function buildCards(subjectId) {
  const questions = getQuizQuestions(subjectId)
  const srs = getSRSData()

  const flashcards = questions.map((q, idx) => ({
    id: `${subjectId}-${idx}`,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    topicTitle: q.topicTitle,
    srs: srs[`${subjectId}-${idx}`] || null,
  }))

  // Sort: never-reviewed first, then by next review date
  flashcards.sort((a, b) => {
    if (!a.srs && !b.srs) return 0
    if (!a.srs) return -1
    if (!b.srs) return 1
    return new Date(a.srs.nextReview) - new Date(b.srs.nextReview)
  })

  return flashcards
}

export default function FlashcardView({ subjectId }) {
  const [dueOnly, setDueOnly] = useState(false)
  // Session deck — built once per subject/mode change, NOT recomputed on rating.
  // This keeps indices stable while reviewing (the old reactive filter could
  // shrink the list mid-session and push currentIndex out of bounds).
  const [deck, setDeck] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const cards = buildCards(subjectId)
    const now = new Date()
    const session = dueOnly
      ? cards.filter((c) => !c.srs || new Date(c.srs.nextReview) <= now)
      : cards
    setDeck(session)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [subjectId, dueOnly])

  const handleQuality = useCallback((quality) => {
    setDeck((currentDeck) => {
      if (currentDeck.length === 0) return currentDeck
      const card = currentDeck[Math.min(currentIndex, currentDeck.length - 1)]
      if (!card) return currentDeck

      const newData = calculateNextReview(quality, card.srs)
      const srs = getSRSData()
      srs[card.id] = newData
      saveSRSData(srs)

      // Reflect the new schedule on the card itself for the header display
      return currentDeck.map((c) => (c.id === card.id ? { ...c, srs: newData } : c))
    })

    setCurrentIndex((i) => (i + 1 >= deck.length ? 0 : i + 1))
    setIsFlipped(false)
  }, [currentIndex, deck.length])

  const nextCard = useCallback(() => {
    setCurrentIndex((i) => (i + 1 >= deck.length ? 0 : i + 1))
    setIsFlipped(false)
  }, [deck.length])

  const prevCard = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? Math.max(deck.length - 1, 0) : i - 1))
    setIsFlipped(false)
  }, [deck.length])

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleFlip()
      } else if (e.code === 'ArrowRight') {
        nextCard()
      } else if (e.code === 'ArrowLeft') {
        prevCard()
      } else if (isFlipped && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const quality = { Digit1: 1, Digit2: 3, Digit3: 4, Digit4: 5 }[e.code]
        handleQuality(quality)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleFlip, nextCard, prevCard, isFlipped, handleQuality])

  // Due count for the current subject (for the header badge)
  const allSubjectCards = buildCards(subjectId)
  const now = new Date()
  const dueCount = allSubjectCards.filter((c) => !c.srs || new Date(c.srs.nextReview) <= now).length

  if (allSubjectCards.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-500">No flashcards available for this subject.</p>
      </div>
    )
  }

  if (deck.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">All caught up!</h2>
          <p className="text-gray-600 mb-6">No cards are due for review right now.</p>
          <button
            onClick={() => setDueOnly(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Review All Cards Anyway
          </button>
        </div>
      </div>
    )
  }

  const card = deck[Math.min(currentIndex, deck.length - 1)]
  if (!card) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Card {currentIndex + 1} of {deck.length}
            </span>
            {card.srs && (
              <span className="text-xs text-gray-500">
                Next review: {new Date(card.srs.nextReview).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-600 font-medium">
              {dueCount} due
            </span>
            <button
              onClick={() => { setDueOnly(!dueOnly) }}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                dueOnly
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dueOnly ? 'Due only ✓' : 'All cards'}
            </button>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col justify-center cursor-pointer hover:shadow-xl transition-shadow select-none"
        onClick={handleFlip}
      >
        <div className="text-sm text-gray-500 mb-4">{card.topicTitle}</div>

        {!isFlipped ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{card.question}</h2>
            <div className="space-y-2">
              {card.options.map((option, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg text-gray-700">
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">Click or press Space to reveal answer</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-green-600">
                {String.fromCharCode(65 + card.correct)}. {card.options[card.correct]}
              </span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">{card.explanation}</p>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">Rate your recall (or press 1-4):</p>
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <button
                onClick={(e) => { e.stopPropagation(); handleQuality(1) }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                1 Again
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleQuality(3) }}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
              >
                2 Hard
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleQuality(4) }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                3 Good
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleQuality(5) }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                4 Easy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          ← Previous
        </button>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Next →
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        ⌨️ Space = flip • ← → = navigate • 1-4 = rate
      </p>
    </div>
  )
}
