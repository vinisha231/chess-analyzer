import type { ChessComGame } from '../utils/chesscomApi'
import { getResultForPlayer, formatTimeControl, getOpeningFromPGN, getECOCodeFromPGN } from '../utils/chesscomApi'

interface Props {
  game: ChessComGame | null
  username: string
  onClear: () => void
}

export default function GameReviewBanner({ game, username, onClear }: Props) {
  if (!game) return null

  const lc = username.toLowerCase()
  const isWhite = game.white.username.toLowerCase() === lc
  const opp = isWhite ? game.black : game.white
  const result = getResultForPlayer(game, username)
  const accuracy = game.accuracies ? (isWhite ? game.accuracies.white : game.accuracies.black) : null
  const oppAccuracy = game.accuracies ? (isWhite ? game.accuracies.black : game.accuracies.white) : null
  const opening = getOpeningFromPGN(game.pgn)
  const eco = getECOCodeFromPGN(game.pgn)

  const resultConfig = {
    win:  { color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.20)', label: 'Won' },
    loss: { color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.20)', label: 'Lost' },
    draw: { color: 'var(--text-muted)', bg: 'var(--bg-elevated)', border: 'var(--border-muted)', label: 'Draw' },
  }[result]

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl shrink-0"
      style={{
        background: resultConfig.bg,
        border: `1px solid ${resultConfig.border}`,
      }}
    >
      {/* Result badge */}
      <span
        className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-md"
        style={{
          color: resultConfig.color,
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        {resultConfig.label}
      </span>

      {/* Game details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span style={{ color: 'var(--text-muted)' }}>vs</span>
          <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {opp.username}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>({opp.rating})</span>
          <span style={{ color: 'var(--border-muted)' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {formatTimeControl(game.time_control)} {game.time_class}
          </span>
          {accuracy !== null && (
            <>
              <span style={{ color: 'var(--border-muted)' }}>·</span>
              <span
                className="font-mono font-bold"
                style={{ color: accuracy >= 85 ? '#4ade80' : accuracy >= 70 ? '#fbbf24' : '#f87171' }}
              >
                You {accuracy.toFixed(0)}%
              </span>
              {oppAccuracy !== null && (
                <span style={{ color: 'var(--text-muted)' }}>vs {oppAccuracy.toFixed(0)}%</span>
              )}
            </>
          )}
        </div>
        {opening && (
          <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {eco && <span className="font-mono mr-1">{eco}</span>}
            {opening}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClear}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-base leading-none transition-all shrink-0"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
        }}
      >×</button>
    </div>
  )
}
