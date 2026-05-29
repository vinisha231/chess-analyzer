export type OpeningCategory =
  | 'open'        // 1.e4 e5
  | 'semi-open'   // 1.e4 other response
  | 'closed'      // 1.d4 d5
  | 'semi-closed' // 1.d4 non-d5
  | 'flank'       // non e4/d4 first moves

export type OpeningDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface OpeningMove {
  uci: string        // e.g. "e2e4"
  san: string        // e.g. "e4"
  explanation: string
}

export interface OpeningVariation {
  name: string
  moves: OpeningMove[]
  tip: string
}

export interface ChessOpening {
  id: string
  eco: string
  name: string
  category: OpeningCategory
  difficulty: OpeningDifficulty
  description: string
  moves: OpeningMove[]     // main line
  variations?: OpeningVariation[]
  keyIdeas: string[]
  commonMistakes?: string[]
  famousPlayers?: string[]
  tags?: string[]
}

export interface OpeningProgress {
  openingId: string
  learnedAt: number       // timestamp
  quizScore: number       // 0–100
  practiceCount: number
  isFavorite: boolean
}

export interface OpeningSession {
  openingId: string
  currentMoveIndex: number
  mode: 'learn' | 'quiz'
  quizCorrect: number
  quizTotal: number
}
