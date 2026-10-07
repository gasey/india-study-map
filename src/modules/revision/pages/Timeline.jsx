import { useState } from 'react'
import { getTimelineEvents } from '../utils/data'
import { subjects } from '../utils/data'

export default function Timeline() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const events = getTimelineEvents()

  const filteredEvents = selectedSubject === 'all'
    ? events
    : events.filter((e) => e.subject === selectedSubject)

  const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Master Timeline</h1>
        <p className="text-gray-600 mb-6">
          All major events from 1757 to 2026, connected across subjects.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                selectedSubject === subject.id
                  ? { backgroundColor: subject.color }
                  : {}
              }
            >
              {subject.icon} {subject.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform md:-translate-x-1/2" />

        <div className="space-y-6">
          {sortedEvents.map((event, idx) => {
            const subject = subjects.find((s) => s.id === event.subject)
            const isLeft = idx % 2 === 0

            return (
              <div
                key={idx}
                className={`relative flex items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow transform -translate-x-1/2 z-10" />

                <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}
                      </span>
                      {subject && (
                        <span
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.icon} {subject.name}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium">{event.event}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
