import { Chessboard } from 'react-chessboard'
import type { ChessOpening } from '../../types/openings'
import type { UseLearnerResult } from '../../hooks/useOpeningLearner'
import OpeningMoveList from './OpeningMoveList'
import DifficultyBadge from './DifficultyBadge'
import { CATEGORY_ICONS } from '../../data/openings'

interface Props {
  opening: ChessOpening
  learner: UseLearnerResult
  boardSize?: number
  onStartQuiz: () => void
  onBack: () => void
}

export default function OpeningLesson({ opening, learner, boardSize = 360, onStartQuiz, onBack }: Props) {
  const { currentFen, currentMoveIdx, totalMoves, isComplete, nextMove, prevMove } = learner

  const currentMove = opening.moves[currentMoveIdx]
  const nextMoveData = opening.moves[currentMoveIdx + 1]

  // Highlight the last-played move
  const lastMoveSquares = () => {
    if (currentMoveIdx < 0 || !currentMove) return {}
    const uci = currentMove.uci
    return {
      [uci.slice(0, 2)]: { backgroundColor: 'rgba(99,102,241,0.4)' },
      [uci.slice(2, 4)]: { backgroundColor: 'rgba(99,102,241,0.6)' },
    }
  }

  // Highlight next move as hint
  const hintArrow = nextMoveData ? [{
    startSquare: nextMoveData.uci.slice(0, 2),
    endSquare: nextMoveData.uci.slice(2, 4),
    color: 'rgba(99,102,241,0.3)',
  }] : []

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
          title="Back to catalog"
        >←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span>{CATEGORY_ICONS[opening.category]}</span>
            <span className="text-xs font-mono text-gray-500">{opening.eco}</span>
            <DifficultyBadge difficulty={opening.difficulty} />
          </div>
          <h2 className="text-sm font-bold text-white truncate">{opening.name}</h2>
        </div>
        <button
          onClick={onStartQuiz}
          className="shrink-0 text-xs px-2.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
        >
          🧠 Quiz
        </button>
      </div>

      {/* Board */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        <Chessboard
          options={{
            position: currentFen,
            boardStyle: { width: boardSize },
            squareStyles: lastMoveSquares(),
            arrows: hintArrow,
            animationDurationInMs: 200,
          }}
        />

        {/* Progress bar below board */}
        <div className="w-full">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Move {Math.max(0, currentMoveIdx + 1)} of {totalMoves}</span>
            <span>{Math.round(((currentMoveIdx + 1) / totalMoves) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentMoveIdx + 1) / totalMoves) * 100}%` }}
            />
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={prevMove}
            disabled={currentMoveIdx < 0}
            className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded-lg text-xs font-medium transition-colors"
          >
            ← Back
          </button>
          {!isComplete ? (
            <button
              onClick={nextMove}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onStartQuiz}
              className="flex-1 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              🎓 Take Quiz!
            </button>
          )}
        </div>
      </div>

      {/* Current move explanation */}
      {currentMoveIdx >= 0 && currentMove ? (
        <div className="shrink-0 bg-gray-800/60 rounded-xl px-3 py-2.5 border border-gray-700">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-base font-bold text-white">{currentMove.san}</span>
            <span className="text-xs text-gray-500">move {currentMoveIdx + 1}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{currentMove.explanation}</p>
        </div>
      ) : (
        <div className="shrink-0 bg-gray-800/60 rounded-xl px-3 py-2.5 border border-gray-700">
          <p className="text-sm font-semibold text-white mb-1">{opening.name}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{opening.description}</p>
        </div>
      )}

      {/* Scrollable move list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <OpeningMoveList
          opening={opening}
          currentMoveIdx={currentMoveIdx}
          onJump={(i) => {
            // Jump to index by calling nextMove repeatedly or prevMove
            const diff = i - currentMoveIdx
            if (diff > 0) for (let j = 0; j < diff; j++) nextMove()
            else for (let j = 0; j > diff; j--) prevMove()
          }}
        />
        {/* Key ideas */}
        {opening.keyIdeas.length > 0 && (
          <div className="mt-3 border-t border-gray-700 pt-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold px-1 mb-2">Key Ideas</p>
            <div className="flex flex-col gap-1">
              {opening.keyIdeas.map((idea, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <span className="text-blue-400 shrink-0 mt-0.5">›</span>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {opening.commonMistakes && opening.commonMistakes.length > 0 && (
          <div className="mt-3 border-t border-gray-700 pt-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold px-1 mb-2">Common Mistakes</p>
            <div className="flex flex-col gap-1">
              {opening.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <span className="text-red-400 shrink-0 mt-0.5">⚠</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
