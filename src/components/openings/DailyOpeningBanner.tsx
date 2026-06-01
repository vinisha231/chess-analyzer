import type { ChessOpening } from '../../types/openings'
import { getDailyOpening, CATEGORY_ICONS, DIFFICULTY_LABELS } from '../../data/openings'

interface Props {
  onLearn: (opening: ChessOpening) => void
}

export default function DailyOpeningBanner({ onLearn }: Props) {
  const daily = getDailyOpening()
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div
      className="relative overflow-hidden rounded-xl px-3 py-3 shrink-0"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(251,146,60,0.06) 100%)',
        border: '1px solid rgba(245,158,11,0.22)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ color: 'var(--accent-gold)' }} className="text-xs font-bold">⭐ Opening of the Day</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>— {today}</span>
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{CATEGORY_ICONS[daily.category]}</span>
            <h3 className="text-sm font-bold truncate" style={{ color: 'var(--accent-gold)' }}>
              {daily.name}
            </h3>
            <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
              {daily.eco}
            </span>
          </div>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {DIFFICULTY_LABELS[daily.difficulty]} · {daily.moves.length} moves
          </p>
        </div>
        <button
          onClick={() => onLearn(daily)}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(245,158,11,0.18)',
            border: '1px solid rgba(245,158,11,0.30)',
            color: 'var(--accent-gold)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.28)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--glow-gold)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.18)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
          }}
        >
          Study →
        </button>
      </div>
    </div>
  )
}
