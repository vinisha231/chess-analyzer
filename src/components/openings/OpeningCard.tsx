import type { ChessOpening } from '../../types/openings'
import type { OpeningProgress } from '../../types/openings'
import DifficultyBadge from './DifficultyBadge'
import { CATEGORY_ICONS } from '../../data/openings'

interface Props {
  opening: ChessOpening
  progress?: OpeningProgress
  isFavorite?: boolean
  onLearn: (opening: ChessOpening) => void
  onQuiz: (opening: ChessOpening) => void
  onToggleFavorite: (id: string) => void
}

export default function OpeningCard({ opening, progress, isFavorite, onLearn, onQuiz, onToggleFavorite }: Props) {
  const hasProgress = Boolean(progress?.practiceCount)
  const quizScore = progress?.quizScore ?? 0
  const practiceCount = progress?.practiceCount ?? 0

  const scoreColor = quizScore >= 80 ? 'text-green-400' : quizScore >= 50 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className={`bg-gray-800/60 border rounded-xl p-3 flex flex-col gap-2 transition-all hover:border-gray-600 ${
      hasProgress ? 'border-gray-600' : 'border-gray-700/50'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-base" title={opening.category}>{CATEGORY_ICONS[opening.category]}</span>
            <span className="text-xs font-mono text-gray-500 shrink-0">{opening.eco}</span>
          </div>
          <h3 className="text-sm font-bold text-white leading-tight truncate">{opening.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(opening.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`text-base transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <DifficultyBadge difficulty={opening.difficulty} />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{opening.description}</p>

      {/* Move count */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{opening.moves.length} moves</span>
        {opening.variations && opening.variations.length > 0 && (
          <>
            <span>·</span>
            <span>{opening.variations.length} variation{opening.variations.length !== 1 ? 's' : ''}</span>
          </>
        )}
        {opening.famousPlayers && opening.famousPlayers.length > 0 && (
          <>
            <span>·</span>
            <span className="truncate">{opening.famousPlayers.join(', ')}</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      {hasProgress && (
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-gray-500">Quiz score</span>
            <span className={`font-mono font-bold ${scoreColor}`}>{quizScore.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${quizScore >= 80 ? 'bg-green-500' : quizScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${quizScore}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-0.5">Practiced {practiceCount}×</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 mt-auto pt-1">
        <button
          onClick={() => onLearn(opening)}
          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          {hasProgress ? '📖 Review' : '📖 Learn'}
        </button>
        <button
          onClick={() => onQuiz(opening)}
          className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-medium transition-colors"
        >
          🧠 Quiz
        </button>
      </div>
    </div>
  )
}
