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

function InfoChip({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{
        background: warn ? 'rgba(245,158,11,0.08)' : 'var(--bg-overlay)',
        border: `1px solid ${warn ? 'rgba(245,158,11,0.2)' : 'var(--border-subtle)'}`,
      }}
    >
      <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span
        className="text-[10px] font-mono font-bold"
        style={{ color: warn ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
      >
        {value}
      </span>
    </div>
  )
}

export default function PositionInfo({ fen, moveCount }: Props) {
  const parts = fen.split(' ')
  const castling = parts[2] ?? '-'
  const enPassant = parts[3] ?? '-'
  const halfmoves = parseInt(parts[4] ?? '0')
  const c = parseCastling(castling)
  const castlingStr =
    (c.whiteKingside ? 'K' : '—') +
    (c.whiteQueenside ? 'Q' : '—') +
    ' / ' +
    (c.blackKingside ? 'k' : '—') +
    (c.blackQueenside ? 'q' : '—')

  return (
    <div className="flex flex-wrap gap-1.5">
      <InfoChip label="Castling" value={castlingStr} />
      <InfoChip label="En passant" value={enPassant} />
      <InfoChip label="50-move" value={`${halfmoves}/50`} warn={halfmoves >= 40} />
      <InfoChip label="Move" value={String(Math.floor(moveCount / 2) + 1)} />
    </div>
  )
}
