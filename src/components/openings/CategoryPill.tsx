import type { OpeningCategory } from '../../types/openings'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../../data/openings'

interface Props {
  category: OpeningCategory
  active?: boolean
  onClick?: () => void
}

const CATEGORY_BG: Record<OpeningCategory, string> = {
  'open':        'bg-orange-900/30 text-orange-300 border-orange-800/50',
  'semi-open':   'bg-red-900/30 text-red-300 border-red-800/50',
  'closed':      'bg-blue-900/30 text-blue-300 border-blue-800/50',
  'semi-closed': 'bg-green-900/30 text-green-300 border-green-800/50',
  'flank':       'bg-purple-900/30 text-purple-300 border-purple-800/50',
}

export default function CategoryPill({ category, active = false, onClick }: Props) {
  const colorClass = active ? 'bg-gray-600 text-white border-gray-500' : CATEGORY_BG[category]

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium transition-colors ${colorClass} ${onClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
    >
      <span>{CATEGORY_ICONS[category]}</span>
      <span>{CATEGORY_LABELS[category]}</span>
    </button>
  )
}
