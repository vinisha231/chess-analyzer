export type GamePhase = 'opening' | 'middlegame' | 'endgame'

export function detectGamePhase(fen: string, moveCount: number): GamePhase {
  if (moveCount < 10) return 'opening'
  const board = fen.split(' ')[0]
  const pieces = board.replace(/[^a-zA-Z]/g, '')
  const queens = (pieces.match(/[qQ]/g) ?? []).length
  const minorPieces = (pieces.match(/[nNbB]/g) ?? []).length
  const rooks = (pieces.match(/[rR]/g) ?? []).length
  const totalMaterial = queens * 9 + rooks * 5 + minorPieces * 3
  if (queens === 0 || totalMaterial < 20) return 'endgame'
  return 'middlegame'
}

export function phaseLabel(phase: GamePhase): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1)
}
