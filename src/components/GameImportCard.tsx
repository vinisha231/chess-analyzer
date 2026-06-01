import type { ChessComGame } from '../utils/chesscomApi'
import { getResultForPlayer, formatTimeControl, getOpeningFromPGN } from '../utils/chesscomApi'

interface Props {
  game: ChessComGame
  username: string
  onImport: (pgn: string) => void
}

const TIME_CLASS_ICON: Record<string, string> = {
  bullet: '⚡', blitz: '🔥', rapid: '⏱', daily: '📅',
}

const RESULT_STYLE: Record<string, { color: string; bg: string; border: string; bar: string }> = {
  win:  { color: '#4ade80', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)', bar: '#4ade80' },
  loss: { color: '#f87171', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)', bar: '#f87171' },
  draw: { color: 'var(--text-secondary)', bg: 'var(--bg-overlay)', border: 'var(--border-muted)', bar: 'var(--text-muted)' },
}

const RESULT_LABEL = { win: 'Won', loss: 'Lost', draw: 'Draw' }

export default function GameImportCard({ game, username, onImport }: Props) {
  const result = getResultForPlayer(game, username)
  const isWhite = game.white.username.toLowerCase() === username.toLowerCase()
  const me = isWhite ? game.white : game.black
  const opp = isWhite ? game.black : game.white
  const date = new Date(game.end_time * 1000)
  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const opening = getOpeningFromPGN(game.pgn)
  const accuracy = game.accuracies
    ? (isWhite ? game.accuracies.white : game.accuracies.black)
    : null
  const rs = RESULT_STYLE[result]

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group cursor-default"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-muted)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'}
    >
      {/* Result bar */}
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ background: rs.bar, minHeight: '36px' }}
      />

      {/* Game info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs" title={game.time_class}>{TIME_CLASS_ICON[game.time_class] ?? '♟'}</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {formatTimeControl(game.time_control)}
          </span>
          <span style={{ color: 'var(--border-muted)' }}>·</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dateStr}</span>
          {accuracy !== null && (
            <>
              <span style={{ color: 'var(--border-muted)' }}>·</span>
              <span
                className="text-[10px] font-mono font-bold"
                style={{
                  color: accuracy >= 85 ? '#4ade80' : accuracy >= 70 ? '#fbbf24' : '#f87171',
                }}
              >
                {accuracy.toFixed(0)}%
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold" style={{ color: result === 'win' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {isWhite ? '♙' : '♟'} {me.rating}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>vs</span>
          <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{opp.username}</span>
          <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>{opp.rating}</span>
        </div>
        {opening && (
          <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{opening}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="text-[10px] px-2 py-0.5 rounded-md font-bold"
          style={{
            color: rs.color,
            background: rs.bg,
            border: `1px solid ${rs.border}`,
          }}
        >
          {RESULT_LABEL[result]}
        </span>
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm leading-none transition-all opacity-0 group-hover:opacity-100"
          style={{ color: 'var(--text-muted)' }}
          title="Open on chess.com"
          onClick={e => e.stopPropagation()}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'}
        >↗</a>
        <button
          onClick={() => onImport(game.pgn)}
          className="text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all"
          style={{
            background: 'var(--accent-indigo)',
            color: '#fff',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px rgba(99,102,241,0.4)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'}
        >
          Analyze
        </button>
      </div>
    </div>
  )
}
