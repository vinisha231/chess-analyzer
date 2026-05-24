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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-white">{whiteAcc.toFixed(0)}%</p>
          <p className="text-xs text-gray-400">{playerNames.white}</p>
        </div>
        <div className="text-xs text-gray-500 self-center">accuracy</div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-white">{blackAcc.toFixed(0)}%</p>
          <p className="text-xs text-gray-400">{playerNames.black}</p>
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
