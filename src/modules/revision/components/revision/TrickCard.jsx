import { useState } from 'react'

const PALETTES = [
  { bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '#fb923c', chip: '#ea580c', chipBg: '#ffedd5' },
  { bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '#60a5fa', chip: '#2563eb', chipBg: '#dbeafe' },
  { bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '#4ade80', chip: '#16a34a', chipBg: '#dcfce7' },
  { bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '#c084fc', chip: '#9333ea', chipBg: '#f3e8ff' },
  { bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '#f472b6', chip: '#db2777', chipBg: '#fce7f3' },
  { bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', border: '#facc15', chip: '#ca8a04', chipBg: '#fef9c3' },
]

export default function TrickCard({ mnemonic, index = 0 }) {
  const [open, setOpen] = useState(false)
  const palette = PALETTES[index % PALETTES.length]

  return (
    <div
      className="rv-fade-up rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{
        background: palette.bg,
        border: `2px solid ${palette.border}`,
        animationDelay: `${Math.min(index * 0.06, 0.5)}s`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: palette.chip, background: palette.chipBg }}
          >
            🧠 Trick #{index + 1}
          </span>
          <span className="text-xs font-semibold text-gray-500">{mnemonic.topic}</span>
          <span className="ml-auto text-xs text-gray-400">{open ? '▲ less' : '▼ why it works'}</span>
        </div>
        <div
          className="rv-trick-text text-lg md:text-xl font-bold"
          style={{ color: palette.chip }}
        >
          {mnemonic.trick}
        </div>
      </button>

      <div className={`rv-collapse ${open ? 'open' : ''}`}>
        <div>
          <div className="px-5 pb-5 pt-1">
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                💡 Why it works
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{mnemonic.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
