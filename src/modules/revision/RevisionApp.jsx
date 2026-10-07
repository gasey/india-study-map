import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Revision from './pages/Revision'
import Guide from './pages/Guide'
import Timeline from './pages/Timeline'
import MindMap from './pages/MindMap'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import Search from './pages/Search'
import Book from './pages/Book'
import Tricks from './pages/Tricks'
import './revision.css'

const tabs = [
  { path: '/revision', label: 'Home', end: true },
  { path: '/revision/tricks', label: '🧠 Tricks' },
  { path: '/revision/flashcards', label: 'Flashcards' },
  { path: '/revision/timeline', label: 'Timeline' },
  { path: '/revision/mindmap', label: 'Mind Map' },
  { path: '/revision/quiz', label: 'Quiz' },
  { path: '/revision/book', label: 'PDF Book' },
  { path: '/revision/search', label: 'Search' },
]

export default function RevisionApp() {
  const location = useLocation()

  return (
    <div className="h-full overflow-y-auto scroll-panel bg-gray-50">
      {/* Sub-navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const active = tab.end
                ? location.pathname === tab.path
                : location.pathname.startsWith(tab.path)
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <Routes>
        <Route index element={<Home />} />
        <Route path="guide/:subjectId" element={<Revision />} />
        <Route path="guide/:subjectId/:topicId" element={<Guide />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="mindmap" element={<MindMap />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="quiz/:subjectId" element={<Quiz />} />
        <Route path="quiz/:subjectId/:topicId" element={<Quiz />} />
        <Route path="tricks" element={<Tricks />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="flashcards/:subjectId" element={<Flashcards />} />
        <Route path="book" element={<Book />} />
        <Route path="search" element={<Search />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}
