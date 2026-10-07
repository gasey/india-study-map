import { useState, useEffect } from 'react'
import { getQuizQuestions } from '../utils/data'

export function useQuiz(subjectId) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const q = getQuizQuestions(subjectId)
    setQuestions(q)
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setIsComplete(false)
  }, [subjectId])

  const answerQuestion = (selectedIndex) => {
    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedIndex === currentQuestion.correct

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentIndex,
        selected: selectedIndex,
        correct: isCorrect,
      },
    ])

    return isCorrect
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setIsComplete(false)
  }

  return {
    questions,
    currentIndex,
    score,
    answers,
    isComplete,
    answerQuestion,
    nextQuestion,
    resetQuiz,
  }
}
