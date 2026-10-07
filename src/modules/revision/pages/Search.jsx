import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllTopics, getTimelineEvents } from '../utils/data'

export default function Search() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('all')

  const allTopics = getAllTopics()
  const timelineEvents = getTimelineEvents()

  const results = useMemo(() => {
    if (!query.trim()) return { topics: [], events: [] }

    const q = query.toLowerCase()

    const matchedTopics = allTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    )

    const matchedEvents = timelineEvents.filter(
      (e) =>
        e.event.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.topic.toLowerCase().includes(q)
    )

    return { topics: matchedTopics, events: matchedEvents }
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search</h1>
        <p className="text-gray-600 mb-6">
          Search across all topics, events, and content.
        </p>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, events, subjects..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="topics">Topics</option>
            <option value="events">Events</option>
          </select>
        </div>
      </div>

      {query && (
        <div className="space-y-8">
          {(searchType === 'all' || searchType === 'topics') && results.topics.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Topics ({results.topics.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.topics.map((topic) => (
                  <Link
                    key={`${topic.subject}-${topic.id}`}
                    to={`/revision/guide/${topic.subject}/${topic.id}`}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="font-medium text-gray-800">{topic.title}</div>
                    <div className="text-sm text-gray-600">{topic.description}</div>
                    <div className="text-xs text-gray-500 mt-2 capitalize">
                      {topic.subject.replace('-', ' ')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(searchType === 'all' || searchType === 'events') && results.events.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Timeline Events ({results.events.length})
              </h2>
              <div className="space-y-2">
                {results.events.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                  >
                    <span className="text-lg font-bold text-blue-600">
                      {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}
                    </span>
                    <div>
                      <div className="font-medium text-gray-800">{event.event}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {event.subject.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.topics.length === 0 && results.events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-500">Enter a search query to find topics and events</p>
        </div>
      )}
    </div>
  )
}
