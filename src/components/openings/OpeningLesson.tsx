import { useEffect } from 'react'
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
  onLoadIntoMainBoard?: (pgn: string) => void
}

export default function OpeningLesson({ opening, learner, boardSize = 360, onStartQuiz, onBack, onLoadIntoMainBoard }: Props) {
  const { currentFen, currentMoveIdx, totalMoves, isComplete, nextMove, prevMove, jumpToMove } = learner

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') nextMove()
      if (e.key === 'ArrowLeft') prevMove()
      if (e.key === 'ArrowUp') jumpToMove(-1)
      if (e.key === 'ArrowDown') jumpToMove(totalMoves - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [nextMove, prevMove, jumpToMove, totalMoves])

  const currentMove = opening.moves[currentMoveIdx]
  const nextMoveData = opening.moves[currentMoveIdx + 1]

  const lastMoveSquares = () => {
    if (currentMoveIdx < 0 || !currentMove) return {}
    const uci = currentMove.uci
    return {
      [uci.slice(0, 2)]: { backgroundColor: 'rgba(99,102,241,0.35)' },
      [uci.slice(2, 4)]: { backgroundColor: 'rgba(99,102,241,0.55)' },
    }
  }

  const hintArrow = nextMoveData ? [{
    startSquare: nextMoveData.uci.slice(0, 2),
    endSquare: nextMoveData.uci.slice(2, 4),
    color: 'rgba(99,102,241,0.28)',
  }] : []

  const progressPct = Math.round(((currentMoveIdx + 1) / totalMoves) * 100)

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
          title="Back to catalog"
        >←</button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span>{CATEGORY_ICONS[opening.category]}</span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{opening.eco}</span>
            <DifficultyBadge difficulty={opening.difficulty} />
          </div>
          <h2 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{opening.name}</h2>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {onLoadIntoMainBoard && (
            <button
              onClick={() => {
                const pgn = opening.moves.map((m, i) => {
                  const num = Math.floor(i / 2) + 1
                  return i % 2 === 0 ? `${num}. ${m.san}` : m.san
                }).join(' ')
                onLoadIntoMainBoard(pgn)
              }}
              title="Load into main board for analysis"
              className="text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-muted)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
              }}
            >
              ♟ Analyze
            </button>
          )}
          <button
            onClick={onStartQuiz}
            className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-all text-white"
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple), #7c3aed)',
              boxShadow: '0 0 10px rgba(139,92,246,0.25)',
            }}
          >
            🧠 Quiz
          </button>
        </div>
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

        {/* Progress bar */}
        <div className="w-full">
          <div
            className="flex items-center justify-between text-[10px] mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>Move {Math.max(0, currentMoveIdx + 1)} of {totalMoves}</span>
            <span style={{ color: progressPct >= 100 ? '#4ade80' : 'var(--accent-indigo)' }}>
              {progressPct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPct}%`,
                background: isComplete
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))',
              }}
            />
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={prevMove}
            disabled={currentMoveIdx < 0}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
            }}
          >
            ← Back
          </button>
          {!isComplete ? (
            <button
              onClick={nextMove}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-white"
              style={{
                background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
                boxShadow: '0 0 8px rgba(99,102,241,0.2)',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onStartQuiz}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-white"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 0 8px rgba(34,197,94,0.25)',
              }}
            >
              🎓 Take Quiz!
            </button>
          )}
        </div>
      </div>

      {/* Current move explanation */}
      {currentMoveIdx >= 0 && currentMove ? (
        <div
          className="shrink-0 rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-base font-bold" style={{ color: 'var(--accent-indigo)' }}>
              {currentMove.san}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              move {currentMoveIdx + 1}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {currentMove.explanation}
          </p>
        </div>
      ) : (
        <div
          className="shrink-0 rounded-xl px-3 py-2.5"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {opening.name}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {opening.description}
          </p>
        </div>
      )}

      {/* Scrollable move list + ideas */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <OpeningMoveList
          opening={opening}
          currentMoveIdx={currentMoveIdx}
          onJump={jumpToMove}
        />

        {opening.keyIdeas.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p
              className="text-[9px] uppercase tracking-widest font-bold px-1 mb-2"
              style={{ color: 'var(--accent-indigo)' }}
            >
              Key Ideas
            </p>
            <div className="flex flex-col gap-1.5">
              {opening.keyIdeas.map((idea, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <span style={{ color: 'var(--accent-indigo)' }} className="shrink-0 mt-0.5">›</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {opening.commonMistakes && opening.commonMistakes.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p
              className="text-[9px] uppercase tracking-widest font-bold px-1 mb-2"
              style={{ color: '#f87171' }}
            >
              Common Mistakes
            </p>
            <div className="flex flex-col gap-1.5">
              {opening.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <span style={{ color: '#f87171' }} className="shrink-0 mt-0.5">⚠</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
