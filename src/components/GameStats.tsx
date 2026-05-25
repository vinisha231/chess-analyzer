import type { MoveRecord } from '../types'
import { calculateAccuracy } from '../utils/evaluation'

interface Props {
  moves: MoveRecord[]
  playerNames: { white: string; black: string }
}

function countClassification(moves: MoveRecord[], color: 'w' | 'b', label: string): number {
  return moves
    .filter((_, i) => (color === 'w' ? i % 2 === 0 : i % 2 === 1))
    .filter(m => m.classification?.label === label).length
}

export default function GameStats({ moves, playerNames }: Props) {
  const whiteMoves = moves.filter((_, i) => i % 2 === 0)
  const blackMoves = moves.filter((_, i) => i % 2 === 1)

  const whiteAcc = calculateAccuracy(whiteMoves)
  const blackAcc = calculateAccuracy(blackMoves)

  const stats = ['brilliant', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder'] as const

  const statLabels: Record<string, string> = {
    brilliant: '✨ Brilliant', best: '✨ Best', excellent: '! Excellent',
    good: '⊙ Good', inaccuracy: '?! Inaccuracy', mistake: '? Mistake', blunder: '?? Blunder',
  }

  const statColors: Record<string, string> = {
    brilliant: 'text-teal-400', best: 'text-green-400', excellent: 'text-green-300',
    good: 'text-lime-400', inaccuracy: 'text-yellow-400', mistake: 'text-orange-400', blunder: 'text-red-400',
  }

  if (moves.filter(m => m.classification).length === 0) {
    return (
      <div className="text-gray-500 text-xs text-center py-4">
        Analysis stats appear after the game ends
      </div>
    )
  }

  const accColor = (acc: number) =>
    acc >= 90 ? 'text-green-400' : acc >= 75 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col gap-3">
      {/* Accuracy */}
      <div className="bg-gray-800/60 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500 text-center mb-2">Accuracy</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 text-right">
            <span className={`text-2xl font-bold font-mono ${accColor(whiteAcc)}`}>{whiteAcc.toFixed(0)}<span className="text-base">%</span></span>
            <p className="text-xs text-gray-400 mt-0.5">{playerNames.white}</p>
          </div>
          <div className="w-px h-10 bg-gray-700 shrink-0" />
          <div className="flex-1 text-left">
            <span className={`text-2xl font-bold font-mono ${accColor(blackAcc)}`}>{blackAcc.toFixed(0)}<span className="text-base">%</span></span>
            <p className="text-xs text-gray-400 mt-0.5">{playerNames.black}</p>
          </div>
        </div>
        {/* Relative accuracy bar */}
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-white transition-all duration-700"
            style={{ width: `${(whiteAcc / (whiteAcc + blackAcc)) * 100}%` }}
          />
          <div className="h-full bg-gray-500 flex-1" />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {stats.map(stat => (
          <div key={stat} className="flex items-center gap-2 text-xs">
            <span className={`w-24 ${statColors[stat]}`}>{statLabels[stat]}</span>
            <span className="text-gray-400 w-4 text-center">{countClassification(moves, 'w', stat)}</span>
            <div className="flex-1 relative h-1.5 bg-gray-700 rounded">
              <div className="absolute left-0 top-0 h-full bg-white/20 rounded"
                style={{ width: `${(countClassification(moves, 'w', stat) / Math.max(whiteMoves.length, 1)) * 100}%` }} />
              <div className="absolute right-0 top-0 h-full bg-gray-500/30 rounded"
                style={{ width: `${(countClassification(moves, 'b', stat) / Math.max(blackMoves.length, 1)) * 100}%` }} />
            </div>
            <span className="text-gray-400 w-4 text-center">{countClassification(moves, 'b', stat)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
