import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchAll } from '../../utils/search'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  const handleSearch = (value) => {
    setQuery(value)
    if (value.trim()) {
      setResults(searchAll(value))
    } else {
      setResults(null)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search topics, events..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {results && query && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
          {results.topics.length === 0 && results.events.length === 0 ? (
            <div className="p-4 text-gray-500">No results found</div>
          ) : (
            <>
              {results.topics.length > 0 && (
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 py-1">Topics</div>
                  {results.topics.slice(0, 5).map((topic) => (
                    <button
                      key={`${topic.subject}-${topic.id}`}
                      onClick={() => {
                        navigate(`/revision/guide/${topic.subject}/${topic.id}`)
                        setQuery('')
                        setResults(null)
                      }}
                      className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                    >
                      <div className="font-medium text-gray-800">{topic.title}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {topic.subject.replace('-', ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.events.length > 0 && (
                <div className="p-2 border-t">
                  <div className="text-xs text-gray-500 px-2 py-1">Events</div>
                  {results.events.slice(0, 5).map((event, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate('/revision/timeline')
                        setQuery('')
                        setResults(null)
                      }}
                      className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                    >
                      <div className="font-medium text-gray-800">
                        {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}: {event.event}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
