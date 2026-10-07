import { useState, useMemo } from 'react'
import { searchAll } from '../utils/search'

export function useSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    return searchAll(query)
  }, [query])

  return {
    query,
    setQuery,
    results,
    hasResults: results.topics.length > 0 || results.events.length > 0,
  }
}
