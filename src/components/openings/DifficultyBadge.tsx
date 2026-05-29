import type { OpeningDifficulty } from '../../types/openings'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../data/openings'

interface Props {
  difficulty: OpeningDifficulty
  size?: 'sm' | 'md'
}

export default function DifficultyBadge({ difficulty, size = 'sm' }: Props) {
  const classes = DIFFICULTY_COLORS[difficulty]
  const label = DIFFICULTY_LABELS[difficulty]
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border font-medium ${textSize} ${classes}`}>
      {label}
    </span>
  )
}
