import { useState, useEffect } from 'react'
import { getSubjectTopics, getTopicData } from '../utils/data'

export function useTopics(subjectId) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getSubjectTopics(subjectId)
    setTopics(data)
    setLoading(false)
  }, [subjectId])

  return { topics, loading }
}

export function useTopic(subjectId, topicId) {
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getTopicData(subjectId, topicId)
    setTopic(data)
    setLoading(false)
  }, [subjectId, topicId])

  return { topic, loading }
}
