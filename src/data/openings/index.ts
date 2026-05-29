import { openGames } from './openGames'
import { semiOpenGames } from './semiOpenGames'
import { closedGames } from './closedGames'
import { flankOpenings } from './flankOpenings'
import { moreOpenings } from './moreOpenings'
import type { ChessOpening, OpeningCategory, OpeningDifficulty } from '../../types/openings'

export const ALL_OPENINGS: ChessOpening[] = [
  ...openGames,
  ...semiOpenGames,
  ...closedGames,
  ...flankOpenings,
  ...moreOpenings,
]

export function getOpeningById(id: string): ChessOpening | undefined {
  return ALL_OPENINGS.find(o => o.id === id)
}

export function getOpeningsByCategory(category: OpeningCategory): ChessOpening[] {
  return ALL_OPENINGS.filter(o => o.category === category)
}

export function getOpeningsByDifficulty(difficulty: OpeningDifficulty): ChessOpening[] {
  return ALL_OPENINGS.filter(o => o.difficulty === difficulty)
}

export function searchOpenings(query: string): ChessOpening[] {
  const q = query.toLowerCase()
  return ALL_OPENINGS.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.eco.toLowerCase().includes(q) ||
    o.tags?.some(t => t.includes(q)) ||
    o.description.toLowerCase().includes(q)
  )
}

export const CATEGORY_LABELS: Record<OpeningCategory, string> = {
  'open':        'Open Games (1.e4 e5)',
  'semi-open':   'Semi-Open Games (1.e4)',
  'closed':      'Closed Games (1.d4 d5)',
  'semi-closed': 'Semi-Closed Games (1.d4)',
  'flank':       'Flank Openings',
}

export const CATEGORY_ICONS: Record<OpeningCategory, string> = {
  'open':        '⚔️',
  'semi-open':   '🔥',
  'closed':      '🏰',
  'semi-closed': '🌿',
  'flank':       '🌊',
}

export const DIFFICULTY_LABELS: Record<OpeningDifficulty, string> = {
  'beginner':     'Beginner',
  'intermediate': 'Intermediate',
  'advanced':     'Advanced',
}

export const DIFFICULTY_COLORS: Record<OpeningDifficulty, string> = {
  'beginner':     'text-green-400 bg-green-900/30 border-green-800/50',
  'intermediate': 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50',
  'advanced':     'text-red-400 bg-red-900/30 border-red-800/50',
}

// Returns a random opening (for "opening of the day" feature)
export function getDailyOpening(): ChessOpening {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return ALL_OPENINGS[dayOfYear % ALL_OPENINGS.length]
}
