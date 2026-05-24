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

  if (gameState.isCheckmate) {
    const winner = gameState.turn === 'w' ? 'Black' : 'White'
    const winnerName = winner === 'White' ? playerNames.white : playerNames.black
    title = `${winnerName} wins!`
    message = 'by checkmate'
    emoji = '♟️'
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center border border-gray-700">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onNewGame}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            New Game
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  )
}
