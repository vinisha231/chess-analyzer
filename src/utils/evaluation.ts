import type { MoveClassification } from '../types'

export function classifyMove(evalBefore: number, evalAfter: number, bestEval: number, color: 'w' | 'b'): MoveClassification {
  const sign = color === 'w' ? 1 : -1
  const loss = sign * (evalBefore - evalAfter)
  const bestLoss = sign * (evalBefore - bestEval)

  if (Math.abs(bestLoss) < 5) {
    if (loss >= -10) return { label: 'best', emoji: '✨', color: '#4ade80' }
    if (loss >= -30) return { label: 'excellent', emoji: '!', color: '#86efac' }
    if (loss >= -60) return { label: 'good', emoji: '⊙', color: '#a3e635' }
    if (loss >= -100) return { label: 'inaccuracy', emoji: '?!', color: '#facc15' }
    if (loss >= -200) return { label: 'mistake', emoji: '?', color: '#fb923c' }
    return { label: 'blunder', emoji: '??', color: '#f87171' }
  }

  if (loss >= -10) return { label: 'best', emoji: '✨', color: '#4ade80' }
  if (loss >= -30) return { label: 'excellent', emoji: '!', color: '#86efac' }
  if (loss >= -60) return { label: 'good', emoji: '⊙', color: '#a3e635' }
  if (loss >= -100) return { label: 'inaccuracy', emoji: '?!', color: '#facc15' }
  if (loss >= -200) return { label: 'mistake', emoji: '?', color: '#fb923c' }
  return { label: 'blunder', emoji: '??', color: '#f87171' }
}

export function evalToDisplay(eval_: number, mate: number | null): string {
  if (mate !== null) {
    return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`
  }
  const pawns = eval_ / 100
  return pawns >= 0 ? `+${pawns.toFixed(1)}` : `${pawns.toFixed(1)}`
}

export function evalToBarPercent(eval_: number, mate: number | null): number {
  if (mate !== null) {
    return mate > 0 ? 95 : 5
  }
  const clamped = Math.max(-1000, Math.min(1000, eval_))
  return 50 + (clamped / 1000) * 45
}

export function calculateAccuracy(moves: Array<{ evalBefore?: number; evalAfter?: number; bestMove?: string; san: string }>): number {
  const scoredMoves = moves.filter(m => m.evalBefore !== undefined && m.evalAfter !== undefined)
  if (scoredMoves.length === 0) return 100
  const totalLoss = scoredMoves.reduce((sum, m) => sum + Math.abs((m.evalAfter ?? 0) - (m.evalBefore ?? 0)), 0)
  const avgLoss = totalLoss / scoredMoves.length
  return Math.max(0, Math.min(100, 100 - avgLoss / 10))
}
