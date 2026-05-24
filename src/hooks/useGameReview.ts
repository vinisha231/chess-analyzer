import { useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import type { MoveRecord, MoveClassification } from '../types'
import { classifyMove } from '../utils/evaluation'

interface ReviewResult {
  annotatedMoves: MoveRecord[]
  isReviewing: boolean
  progress: number
}

export function useGameReview() {
  const [state, setState] = useState<ReviewResult>({
    annotatedMoves: [],
    isReviewing: false,
    progress: 0,
  })

  const reviewGame = useCallback(async (moves: MoveRecord[], evalHistory: number[]) => {
    if (moves.length < 2) return
    setState(prev => ({ ...prev, isReviewing: true, progress: 0 }))

    const annotated: MoveRecord[] = moves.map((move, i) => {
      const evalBefore = evalHistory[i] ?? 0
      const evalAfter = evalHistory[i + 1] ?? 0
      const color: 'w' | 'b' = i % 2 === 0 ? 'w' : 'b'
      const classification: MoveClassification = classifyMove(evalBefore, evalAfter, evalAfter, color)
      return { ...move, classification, evalBefore, evalAfter }
    })

    setState({ annotatedMoves: annotated, isReviewing: false, progress: 100 })
    return annotated
  }, [])

  return { ...state, reviewGame }
}
