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

// Piece values for ordering (higher value = show first)
const PIECE_ORDER: Record<string, number> = { q: 5, r: 4, b: 3, n: 2, p: 1 }

export default function CapturedPieces({ pieces, color, advantage }: Props) {
  const sorted = [...pieces].sort((a, b) => (PIECE_ORDER[b] ?? 0) - (PIECE_ORDER[a] ?? 0))
  const symbols = sorted.map(p => color === 'w' ? PIECE_SYMBOLS[p] : WHITE_SYMBOLS[p])
  const showAdvantage = color === 'w' ? advantage > 0 : advantage < 0

  if (symbols.length === 0 && !showAdvantage) {
    return <div className="min-h-4" />
  }

  return (
    <div className="flex items-center gap-0.5 min-h-4">
      <span
        className="text-xs leading-none tracking-tighter"
        style={{ color: 'var(--text-muted)', letterSpacing: '-0.05em' }}
      >
        {symbols.join('')}
      </span>
      {showAdvantage && (
        <span
          className="text-[10px] font-bold ml-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          +{Math.abs(advantage)}
        </span>
      )}
    </div>
  )
}
