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

const RESULT_STYLE = {
  win:  'text-green-400 bg-green-900/30 border-green-800/50',
  loss: 'text-red-400 bg-red-900/30 border-red-800/50',
  draw: 'text-gray-400 bg-gray-700/30 border-gray-700',
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

  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-700/50 transition-colors group">
      <div className={`w-1 self-stretch rounded-full shrink-0 ${
        result === 'win' ? 'bg-green-500' : result === 'loss' ? 'bg-red-500' : 'bg-gray-600'
      }`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs" title={game.time_class}>{TIME_CLASS_ICON[game.time_class] ?? '♟'}</span>
          <span className="text-xs font-mono text-gray-400">{formatTimeControl(game.time_control)}</span>
          <span className="text-gray-600">·</span>
          <span className="text-xs text-gray-500">{dateStr}</span>
          {accuracy !== null && (
            <>
              <span className="text-gray-600">·</span>
              <span className={`text-xs font-mono ${accuracy >= 85 ? 'text-green-400' : accuracy >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {accuracy.toFixed(0)}%
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className={`font-medium ${result === 'win' ? 'text-white' : 'text-gray-400'}`}>
            {isWhite ? '♙' : '♟'} {me.rating}
          </span>
          <span className="text-gray-600">vs</span>
          <span className="text-gray-300 truncate">{opp.username}</span>
          <span className="text-gray-500 shrink-0">{opp.rating}</span>
        </div>
        {opening && (
          <p className="text-xs text-gray-600 truncate mt-0.5">{opening}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${RESULT_STYLE[result]}`}>
          {RESULT_LABEL[result]}
        </span>
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100 text-base leading-none"
          title="Open on chess.com"
          onClick={e => e.stopPropagation()}
        >
          ↗
        </a>
        <button
          onClick={() => onImport(game.pgn)}
          className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors font-medium"
        >
          Analyze
        </button>
      </div>
    </div>
  )
}
