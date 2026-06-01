import type { ChessOpening } from '../../types/openings'

interface Props {
  opening: ChessOpening
  currentMoveIdx: number
  onJump: (index: number) => void
}

export default function OpeningMoveList({ opening, currentMoveIdx, onJump }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <p
        className="text-[9px] uppercase tracking-widest font-bold px-1 mb-1"
        style={{ color: 'var(--accent-indigo)' }}
      >
        Main line
      </p>

      {opening.moves.map((move, i) => {
        const moveNumber = Math.floor(i / 2) + 1
        const isWhiteMove = i % 2 === 0
        const isCurrent = i === currentMoveIdx
        const isPast = i < currentMoveIdx
        const isFuture = i > currentMoveIdx

        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className="w-full text-left rounded-lg px-2 py-1.5 transition-all text-xs"
            style={isCurrent ? {
              background: 'var(--accent-indigo)',
              color: '#fff',
              boxShadow: '0 0 10px rgba(99,102,241,0.3)',
            } : isPast ? {
              background: 'var(--bg-overlay)',
              color: 'var(--text-secondary)',
            } : {
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              if (!isCurrent)
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
            }}
            onMouseLeave={e => {
              if (!isCurrent)
                (e.currentTarget as HTMLButtonElement).style.background = isPast ? 'var(--bg-overlay)' : 'transparent'
            }}
          >
            <div className="flex items-baseline gap-1.5">
              {isWhiteMove && (
                <span
                  className="font-mono text-[10px] shrink-0"
                  style={{ color: isCurrent ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}
                >
                  {moveNumber}.
                </span>
              )}
              {!isWhiteMove && (
                <span
                  className="font-mono text-[10px] shrink-0"
                  style={{ color: isCurrent ? 'rgba(255,255,255,0.5)' : 'var(--border-muted)' }}
                >
                  …
                </span>
              )}
              <span className="font-mono font-bold" style={{ opacity: isFuture ? 0.4 : 1 }}>
                {move.san}
              </span>
              {!isFuture && (
                <span
                  className="text-[10px] leading-relaxed truncate"
                  style={{ color: isCurrent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
                >
                  {move.explanation.slice(0, 55)}{move.explanation.length > 55 ? '…' : ''}
                </span>
              )}
            </div>
          </button>
        )
      })}

      {/* Variations */}
      {opening.variations && opening.variations.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p
            className="text-[9px] uppercase tracking-widest font-bold px-1 mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Variations
          </p>
          {opening.variations.map((variation, i) => (
            <div
              key={i}
              className="px-2.5 py-2 rounded-xl mb-1.5"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {variation.name}
              </p>
              <div className="flex gap-1 flex-wrap mb-1">
                {variation.moves.map((m, j) => (
                  <span
                    key={j}
                    className="font-mono text-xs font-bold"
                    style={{ color: 'var(--accent-indigo)' }}
                  >
                    {m.san}
                  </span>
                ))}
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {variation.tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
