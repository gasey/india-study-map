import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getQuizQuestions, subjects } from '../utils/data'
import { recordQuizAnswer, touchStreak } from '../utils/stats'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const { subjectId, topicId } = useParams()
  const [selectedSubject, setSelectedSubject] = useState(subjectId || 'polity')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    if (subjectId) setSelectedSubject(subjectId)
  }, [subjectId])

  useEffect(() => {
    let q
    if (selectedSubject === 'mixed') {
      const all = subjects.flatMap((s) =>
        getQuizQuestions(s.id).map((question) => ({ ...question, subject: s.id }))
      )
      q = shuffle(all).slice(0, 25)
    } else {
      q = getQuizQuestions(selectedSubject, topicId || null)
    }
    setQuestions(q)
    setCurrentQ(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowExplanation(false)
    setQuizComplete(false)
    setAnswers([])
  }, [selectedSubject, topicId])

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return
    const question = questions[currentQ]
    const isCorrect = idx === question?.correct
    setSelectedAnswer(idx)
    setShowExplanation(true)
    if (isCorrect) {
      setScore(score + 1)
    }
    // Record per-topic stats for weak-topic detection
    recordQuizAnswer(question.subject || selectedSubject, question.topicId, isCorrect)
    touchStreak()
    setAnswers([...answers, { question: currentQ, selected: idx, correct: isCorrect }])
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setQuizComplete(true)
      touchStreak()
    } else {
      setCurrentQ(currentQ + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowExplanation(false)
    setQuizComplete(false)
    setAnswers([])
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz</h1>
        <p className="text-gray-600">No quiz questions available for this subject.</p>
      </div>
    )
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <div className="text-6xl font-bold text-blue-600 mb-4">{percentage}%</div>
          <p className="text-xl text-gray-700 mb-2">
            You scored {score} out of {questions.length}
          </p>
          <p className="text-gray-600 mb-8">
            {percentage >= 80 ? 'Excellent! 🎉' : percentage >= 60 ? 'Good job! 👍' : 'Keep practicing! 📚'}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Quiz
            </button>
            <Link
              to="/revision/quiz"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Change Subject
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/revision/quiz" className="text-blue-600 hover:underline text-sm">
          ← Back to Quiz Selection
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Quiz</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="mixed">🔀 Mixed (All Subjects, 25 random)</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            Score: {score}/{currentQ + (selectedAnswer !== null ? 1 : 0)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="mb-2 text-sm text-gray-500">{question.topicTitle}</div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = 'w-full text-left p-4 rounded-lg border-2 transition-colors '
            if (selectedAnswer === null) {
              btnClass += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            } else if (idx === question.correct) {
              btnClass += 'border-green-500 bg-green-50 text-green-800'
            } else if (idx === selectedAnswer) {
              btnClass += 'border-red-500 bg-red-50 text-red-800'
            } else {
              btnClass += 'border-gray-200 opacity-50'
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={btnClass}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}

        {selectedAnswer !== null && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQ + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentQ
                ? 'bg-blue-600'
                : answers[idx]?.correct
                ? 'bg-green-500'
                : answers[idx]
                ? 'bg-red-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
