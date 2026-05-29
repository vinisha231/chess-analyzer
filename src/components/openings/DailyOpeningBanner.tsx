import type { ChessOpening } from '../../types/openings'
import { getDailyOpening, CATEGORY_ICONS, DIFFICULTY_LABELS } from '../../data/openings'

interface Props {
  onLearn: (opening: ChessOpening) => void
}

export default function DailyOpeningBanner({ onLearn }: Props) {
  const daily = getDailyOpening()
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-800/40 rounded-xl px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs text-yellow-500">⭐ Opening of the Day</span>
            <span className="text-[10px] text-gray-600">— {today}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{CATEGORY_ICONS[daily.category]}</span>
            <h3 className="text-sm font-bold text-yellow-200 truncate">{daily.name}</h3>
            <span className="text-xs font-mono text-gray-500 shrink-0">{daily.eco}</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {DIFFICULTY_LABELS[daily.difficulty]} · {daily.moves.length} moves
          </p>
        </div>
        <button
          onClick={() => onLearn(daily)}
          className="shrink-0 px-2.5 py-1.5 bg-yellow-700/60 hover:bg-yellow-600/60 text-yellow-200 rounded-lg text-xs font-medium transition-colors"
        >
          Study
        </button>
      </div>
    </div>
  )
}
