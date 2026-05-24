export type PieceColor = 'w' | 'b'
export type GameMode = 'pvp' | 'analysis'
export type ThemeMode = 'dark' | 'light'

export interface MoveClassification {
  label: 'brilliant' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'miss'
  emoji: string
  color: string
}

export interface AnalysisLine {
  moves: string[]
  score: number
  mate: number | null
  depth: number
}

export interface MoveRecord {
  san: string
  fen: string
  classification?: MoveClassification
  evalBefore?: number
  evalAfter?: number
  bestMove?: string
}

export interface GameState {
  fen: string
  pgn: string
  turn: PieceColor
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  isGameOver: boolean
  moveHistory: MoveRecord[]
  currentMoveIndex: number
}

export interface StockfishResult {
  bestMove: string | null
  evaluation: number
  mate: number | null
  lines: AnalysisLine[]
  depth: number
  isCalculating: boolean
}

export interface PlayerInfo {
  name: string
  color: PieceColor
  timeLeft: number
}

export interface GameSettings {
  theme: ThemeMode
  showCoordinates: boolean
  showLegalMoves: boolean
  showLastMove: boolean
  showBestMoveArrow: boolean
  soundEnabled: boolean
  analysisDepth: number
  multiPV: number
  enableTimer: boolean
  timeControl: number
}

export interface CapturedPieces {
  w: string[]
  b: string[]
}
