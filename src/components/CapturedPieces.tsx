interface Props {
  pieces: string[]
  color: 'w' | 'b'
  advantage: number
}

const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛',
}
const WHITE_SYMBOLS: Record<string, string> = {
  p: '♙', n: '♘', b: '♗', r: '♖', q: '♕',
}

export default function CapturedPieces({ pieces, color, advantage }: Props) {
  const sorted = [...pieces].sort()
  const symbols = sorted.map(p => color === 'w' ? PIECE_SYMBOLS[p] : WHITE_SYMBOLS[p])
  const showAdvantage = color === 'w' ? advantage > 0 : advantage < 0

  return (
    <div className="flex items-center gap-0.5 min-h-5">
      <span className="text-sm leading-none tracking-tight">
        {symbols.join('')}
      </span>
      {showAdvantage && (
        <span className="text-xs text-gray-400 ml-1">
          +{Math.abs(advantage)}
        </span>
      )}
    </div>
  )
}
