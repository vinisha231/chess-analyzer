import type { GameState } from '../types'

interface Props {
  gameState: GameState
  playerNames: { white: string; black: string }
  onNewGame: () => void
  onClose: () => void
}

export default function GameResultModal({ gameState, playerNames, onNewGame, onClose }: Props) {
  if (!gameState.isGameOver) return null

  let title = 'Game Over'
  let message = ''
  let emoji = '🏁'
  let isWin = false

  if (gameState.isCheckmate) {
    const winner = gameState.turn === 'w' ? 'Black' : 'White'
    const winnerName = winner === 'White' ? playerNames.white : playerNames.black
    title = `${winnerName} wins!`
    message = 'by checkmate'
    emoji = '♟️'
    isWin = true
  } else if (gameState.isStalemate) {
    title = 'Draw'
    message = 'by stalemate'
    emoji = '🤝'
  } else if (gameState.isDraw) {
    title = 'Draw'
    message = 'by insufficient material or repetition'
    emoji = '🤝'
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="relative rounded-2xl p-8 max-w-sm w-full mx-4 text-center overflow-hidden animate-pop"
        style={{
          background: 'var(--bg-elevated)',
          border: `1px solid ${isWin ? 'rgba(245,158,11,0.35)' : 'var(--border-muted)'}`,
          boxShadow: isWin
            ? '0 24px 64px rgba(0,0,0,0.6), var(--glow-gold)'
            : '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Background shimmer for wins */}
        {isWin && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)',
            }}
          />
        )}

        <div className="relative z-10">
          {/* Emoji */}
          <div className="text-5xl mb-4">{emoji}</div>

          {/* Title */}
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: isWin ? 'var(--accent-gold)' : 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onNewGame}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: isWin
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
                color: '#fff',
                boxShadow: isWin ? 'var(--glow-gold)' : 'var(--glow-indigo)',
              }}
            >
              New Game
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-muted)'
              }}
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
