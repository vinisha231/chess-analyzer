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

  useEffect(() => {
    if (quizFeedback === 'correct') SoundEngine.move()
    if (quizFeedback === 'wrong') SoundEngine.check()
  }, [quizFeedback])

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
    void square
  }, [])

  const score = session
    ? session.quizTotal > 0 ? (session.quizCorrect / session.quizTotal) * 100 : 0
    : 0

  const squareStyles: Record<string, object> = {}
  if (quizFeedback === 'wrong' && wrongMove) {
    squareStyles[wrongMove.slice(0, 2)] = { backgroundColor: 'rgba(239,68,68,0.45)' }
    squareStyles[wrongMove.slice(2, 4)] = { backgroundColor: 'rgba(239,68,68,0.60)' }
  }
  if (quizFeedback === 'correct' && expectedMove) {
    squareStyles[expectedMove.uci.slice(0, 2)] = { backgroundColor: 'rgba(34,197,94,0.35)' }
    squareStyles[expectedMove.uci.slice(2, 4)] = { backgroundColor: 'rgba(34,197,94,0.55)' }
  }

  // Completion screen
  if (isComplete) {
    const finalScore = Math.round(score)
    const isGreat = finalScore >= 90
    const isGood = finalScore >= 70
    const grade = isGreat ? '🏆 Perfect!' : isGood ? '⭐ Good job!' : finalScore >= 50 ? '👍 Keep practicing!' : '📖 Review the lesson first'

    return (
      <div
        className="flex flex-col items-center justify-center gap-5 h-full text-center px-4"
      >
        {/* Result emoji */}
        <div className="text-5xl">{isGreat ? '🏆' : isGood ? '⭐' : '📖'}</div>

        {/* Grade */}
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: isGreat ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
            {grade}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opening.name}</p>
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl px-10 py-5"
          style={{
            background: 'var(--bg-elevated)',
            border: `1px solid ${isGreat ? 'rgba(245,158,11,0.3)' : 'var(--border-muted)'}`,
            boxShadow: isGreat ? 'var(--glow-gold)' : 'none',
          }}
        >
          <p
            className="text-5xl font-bold font-mono mb-1"
            style={{ color: finalScore >= 80 ? '#4ade80' : finalScore >= 50 ? '#fbbf24' : '#f87171' }}
          >
            {finalScore}%
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {session?.quizCorrect} / {session?.quizTotal} correct
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
            }}
          >
            Back to catalog
          </button>
          <button
            onClick={() => onComplete(finalScore)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
              boxShadow: 'var(--glow-indigo)',
            }}
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
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all text-lg leading-none"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
          }}
        >←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <DifficultyBadge difficulty={opening.difficulty} />
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{opening.eco}</span>
          </div>
          <h2 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {opening.name} — Quiz
          </h2>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Score</p>
          <p
            className="text-sm font-bold font-mono"
            style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}
          >
            {session?.quizTotal ? `${Math.round(score)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="shrink-0">
        <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
          <span>Move {Math.max(0, currentMoveIdx + 1)} of {totalMoves}</span>
          <span style={{ color: 'var(--accent-indigo)' }}>
            {session?.quizCorrect ?? 0} correct · {session?.quizTotal ?? 0} tried
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentMoveIdx + 1) / totalMoves) * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-purple), #7c3aed)',
            }}
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
      <div
        className="shrink-0 rounded-xl px-3 py-2.5 transition-all"
        style={quizFeedback === 'correct' ? {
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
        } : quizFeedback === 'wrong' ? {
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
        } : {
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {quizFeedback === 'correct' && expectedMove ? (
          <>
            <p className="text-sm font-bold" style={{ color: '#4ade80' }}>✓ Correct! {expectedMove.san}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{expectedMove.explanation}</p>
          </>
        ) : quizFeedback === 'wrong' ? (
          <>
            <p className="text-sm font-bold" style={{ color: '#f87171' }}>✗ Wrong move!</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Try again — think about the opening's key ideas.
            </p>
          </>
        ) : isUserTurn ? (
          <>
            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Drag the correct piece to make the next move!
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {currentMoveIdx >= 0 ? `After: ${opening.moves[currentMoveIdx].san}` : 'Starting position — make the first move!'}
            </p>
          </>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Quiz complete!</p>
        )}
      </div>

      {/* Previous move button */}
      <button
        onClick={prevMove}
        disabled={currentMoveIdx < 0}
        className="shrink-0 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30"
        style={{
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-muted)',
          color: 'var(--text-secondary)',
        }}
      >
        ← Previous move
      </button>
    </div>
  )
}
