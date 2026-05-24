interface Props {
  fen: string
  moveCount: number
}

function parseCastling(castling: string) {
  return {
    whiteKingside: castling.includes('K'),
    whiteQueenside: castling.includes('Q'),
    blackKingside: castling.includes('k'),
    blackQueenside: castling.includes('q'),
  }
}

export default function PositionInfo({ fen, moveCount }: Props) {
  const parts = fen.split(' ')
  const castling = parts[2] ?? '-'
  const enPassant = parts[3] ?? '-'
  const halfmoves = parseInt(parts[4] ?? '0')
  const c = parseCastling(castling)

  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-500 px-1">
      <div>
        <span className="text-gray-600 mr-1">Castling:</span>
        <span className={c.whiteKingside ? 'text-gray-300' : 'line-through opacity-40'}>K</span>
        <span className={c.whiteQueenside ? 'text-gray-300' : 'line-through opacity-40'}>Q</span>
        <span className="mx-1 text-gray-700">·</span>
        <span className={c.blackKingside ? 'text-gray-300' : 'line-through opacity-40'}>k</span>
        <span className={c.blackQueenside ? 'text-gray-300' : 'line-through opacity-40'}>q</span>
      </div>
      <div>
        <span className="text-gray-600 mr-1">En passant:</span>
        <span className="text-gray-300 font-mono">{enPassant}</span>
      </div>
      <div>
        <span className="text-gray-600 mr-1">50-move:</span>
        <span className={`font-mono ${halfmoves >= 40 ? 'text-orange-400' : 'text-gray-300'}`}>{halfmoves}/50</span>
      </div>
      <div>
        <span className="text-gray-600 mr-1">Move:</span>
        <span className="text-gray-300">{Math.floor(moveCount / 2) + 1}</span>
      </div>
    </div>
  )
}
