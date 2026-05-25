import type { ChessComGame } from '../utils/chesscomApi'
import { getResultForPlayer, formatTimeControl, getOpeningFromPGN } from '../utils/chesscomApi'

interface Props {
  game: ChessComGame | null
  username: string
  onClear: () => void
}

export default function GameReviewBanner({ game, username, onClear }: Props) {
  if (!game) return null

  const lc = username.toLowerCase()
  const isWhite = game.white.username.toLowerCase() === lc
  const me = isWhite ? game.white : game.black
  const opp = isWhite ? game.black : game.white
  const result = getResultForPlayer(game, username)
  const accuracy = game.accuracies ? (isWhite ? game.accuracies.white : game.accuracies.black) : null
  const opening = getOpeningFromPGN(game.pgn)

  const resultColor = result === 'win' ? 'text-green-400' : result === 'loss' ? 'text-red-400' : 'text-gray-400'
  const resultLabel = result === 'win' ? 'Won' : result === 'loss' ? 'Lost' : 'Draw'

  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-3 text-xs shrink-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-bold ${resultColor}`}>{resultLabel}</span>
          <span className="text-gray-500">vs</span>
          <span className="text-gray-300 font-medium truncate">{opp.username} ({opp.rating})</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500">{formatTimeControl(game.time_control)} {game.time_class}</span>
          {accuracy !== null && (
            <>
              <span className="text-gray-600">·</span>
              <span className={accuracy >= 85 ? 'text-green-400' : accuracy >= 70 ? 'text-yellow-400' : 'text-red-400'}>
                {accuracy.toFixed(0)}% accuracy
              </span>
            </>
          )}
        </div>
        {opening && <p className="text-gray-500 truncate mt-0.5">{opening}</p>}
      </div>
      <button onClick={onClear} className="text-gray-600 hover:text-gray-300 transition-colors shrink-0 text-base leading-none">×</button>
    </div>
  )
}
