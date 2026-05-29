import { useCallback, useEffect } from 'react'
import { SoundEngine } from '../../utils/soundEngine'
import { Chessboard } from 'react-chessboard'
import type { ChessOpening } from '../../types/openings'
import type { UseLearnerResult } from '../../hooks/useOpeningLearner'
import DifficultyBadge from './DifficultyBadge'

interface Props {
  opening: ChessOpening
  learner: UseLearnerResult
  boardSize?: number
  onComplete: (score: number) => void
  onBack: () => void
}

export default function OpeningQuiz({ opening, learner, boardSize = 360, onComplete, onBack }: Props) {
  const {
    currentFen, currentMoveIdx, totalMoves, isComplete,
    quizFeedback, wrongMove,
    session, tryQuizMove, prevMove,
  } = learner

  const expectedMoveIdx = currentMoveIdx + 1
  const isUserTurn = expectedMoveIdx < totalMoves
  const expectedMove = isUserTurn ? opening.moves[expectedMoveIdx] : null

  // Play sounds on feedback
  useEffect(() => {
    if (quizFeedback === 'correct') SoundEngine.move()
    if (quizFeedback === 'wrong') SoundEngine.check()
  }, [quizFeedback])

  // Play game-end sound on completion
  useEffect(() => {
    if (isComplete) SoundEngine.gameEnd()
  }, [isComplete])

  const handleDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
    if (!isUserTurn || isComplete || !targetSquare) return false
    const uci = `${sourceSquare}${targetSquare}`
    tryQuizMove(uci)
    return true
  }, [isUserTurn, isComplete, tryQuizMove])

  const handleSquareClick = useCallback(({ square }: { square: string }) => {
    // No-op — quiz uses drag-and-drop
    void square
  }, [])

  const score = session
    ? session.quizTotal > 0 ? (session.quizCorrect / session.quizTotal) * 100 : 0
    : 0

  // Highlight wrong move
  const squareStyles: Record<string, object> = {}
  if (quizFeedback === 'wrong' && wrongMove) {
    squareStyles[wrongMove.slice(0, 2)] = { backgroundColor: 'rgba(239,68,68,0.5)' }
    squareStyles[wrongMove.slice(2, 4)] = { backgroundColor: 'rgba(239,68,68,0.6)' }
  }
  if (quizFeedback === 'correct' && expectedMove) {
    squareStyles[expectedMove.uci.slice(0, 2)] = { backgroundColor: 'rgba(34,197,94,0.4)' }
    squareStyles[expectedMove.uci.slice(2, 4)] = { backgroundColor: 'rgba(34,197,94,0.6)' }
  }

  if (isComplete) {
    const finalScore = Math.round(score)
    const grade = finalScore >= 90 ? '🏆 Perfect!' : finalScore >= 70 ? '⭐ Good job!' : finalScore >= 50 ? '👍 Keep practicing!' : '📖 Review the lesson first'
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full text-center">
        <div className="text-4xl">{finalScore >= 90 ? '🏆' : finalScore >= 70 ? '⭐' : '📖'}</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{grade}</h2>
          <p className="text-gray-400 text-sm">{opening.name}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl px-8 py-4">
          <p className="text-5xl font-bold font-mono text-white mb-1">{finalScore}%</p>
          <p className="text-xs text-gray-500">
            {session?.quizCorrect} / {session?.quizTotal} correct
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to catalog
          </button>
          <button
            onClick={() => onComplete(finalScore)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
        >←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <DifficultyBadge difficulty={opening.difficulty} />
            <span className="text-xs font-mono text-gray-500">{opening.eco}</span>
          </div>
          <h2 className="text-sm font-bold text-white truncate">{opening.name} — Quiz</h2>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">Score</p>
          <p className={`text-sm font-bold font-mono ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {session?.quizTotal ? `${Math.round(score)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Move {Math.max(0, currentMoveIdx + 1)} of {totalMoves}</span>
          <span>{session?.quizCorrect ?? 0} correct · {session?.quizTotal ?? 0} tried</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentMoveIdx + 1) / totalMoves) * 100}%` }}
          />
        </div>
      </div>

      {/* Board */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        <Chessboard
          options={{
            position: currentFen,
            boardStyle: { width: boardSize },
            onPieceDrop: handleDrop,
            onSquareClick: handleSquareClick,
            squareStyles,
            animationDurationInMs: 150,
          }}
        />
      </div>

      {/* Feedback */}
      <div className={`shrink-0 rounded-xl px-3 py-2.5 border transition-all ${
        quizFeedback === 'correct'
          ? 'bg-green-900/30 border-green-800/50'
          : quizFeedback === 'wrong'
          ? 'bg-red-900/30 border-red-800/50'
          : 'bg-gray-800/60 border-gray-700'
      }`}>
        {quizFeedback === 'correct' && expectedMove ? (
          <>
            <p className="text-sm font-bold text-green-400">✓ Correct! {expectedMove.san}</p>
            <p className="text-xs text-gray-400 mt-0.5">{expectedMove.explanation}</p>
          </>
        ) : quizFeedback === 'wrong' ? (
          <>
            <p className="text-sm font-bold text-red-400">✗ Wrong move!</p>
            <p className="text-xs text-gray-400 mt-0.5">Try again — think about the opening's key ideas.</p>
          </>
        ) : isUserTurn ? (
          <>
            <p className="text-xs text-gray-400 font-medium">Drag the correct piece to make the next move!</p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              {currentMoveIdx >= 0 ? `After: ${opening.moves[currentMoveIdx].san}` : 'Starting position — make the first move!'}
            </p>
          </>
        ) : (
          <p className="text-xs text-gray-500">Quiz complete!</p>
        )}
      </div>

      {/* Back button */}
      <button
        onClick={prevMove}
        disabled={currentMoveIdx < 0}
        className="shrink-0 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded-lg text-xs font-medium transition-colors"
      >
        ← Previous move
      </button>
    </div>
  )
}
