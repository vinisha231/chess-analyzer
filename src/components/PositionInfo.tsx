interface Props {
  fen: string
  moveCount: number
  onCopyFen?: () => void
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

export default function PositionInfo({ fen, moveCount, onCopyFen }: Props) {
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

  const lichessUrl = `https://lichess.org/analysis/${encodeURIComponent(fen)}`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        <InfoChip label="Castling" value={castlingStr} />
        <InfoChip label="En passant" value={enPassant} />
        <InfoChip label="50-move" value={`${halfmoves}/50`} warn={halfmoves >= 40} />
        <InfoChip label="Move" value={String(Math.floor(moveCount / 2) + 1)} />
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-1.5">
        {onCopyFen && (
          <button
            onClick={onCopyFen}
            className="flex-1 text-[10px] px-2 py-1 rounded-lg font-medium transition-all"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            }}
            title="Copy FEN to clipboard"
          >
            Copy FEN
          </button>
        )}
        <a
          href={lichessUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-[10px] px-2 py-1 rounded-lg font-medium transition-all text-center"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(186,130,89,0.35)'
            ;(e.currentTarget as HTMLAnchorElement).style.color = '#ba8259'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-subtle)'
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'
          }}
          title="Analyze this position on Lichess"
        >
          Lichess ↗
        </a>
      </div>
    </div>
  )
}
