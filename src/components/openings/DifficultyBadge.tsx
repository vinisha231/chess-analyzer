import type { OpeningDifficulty } from '../../types/openings'
import { DIFFICULTY_LABELS } from '../../data/openings'

interface Props {
  difficulty: OpeningDifficulty
  size?: 'sm' | 'md'
}

const BADGE_STYLE: Record<OpeningDifficulty, { color: string; bg: string; border: string }> = {
  beginner:     { color: '#4ade80', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.25)' },
  intermediate: { color: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)' },
  advanced:     { color: '#f87171', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.25)' },
}

export default function DifficultyBadge({ difficulty, size = 'sm' }: Props) {
  const style = BADGE_STYLE[difficulty]
  const label = DIFFICULTY_LABELS[difficulty]
  const fontSize = size === 'sm' ? '9px' : '10px'

  return (
    <span
      className="inline-flex items-center rounded-md font-bold"
      style={{
        fontSize,
        padding: size === 'sm' ? '1px 6px' : '2px 8px',
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </span>
  )
}
