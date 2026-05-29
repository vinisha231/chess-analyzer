import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import type { ChessOpening, OpeningSession } from '../types/openings'

export type LearnerMode = 'learn' | 'quiz'
export type QuizFeedback = 'correct' | 'wrong' | null

export interface UseLearnerResult {
  session: OpeningSession | null
  currentFen: string
  currentMoveIdx: number
  totalMoves: number
  isComplete: boolean
  quizFeedback: QuizFeedback
  wrongMove: string | null

  startLearn: (opening: ChessOpening) => void
  startQuiz: (opening: ChessOpening) => void
  nextMove: () => void
  prevMove: () => void
  tryQuizMove: (uci: string) => boolean
  resetSession: () => void
  getLegalMoves: () => string[]
}

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function useOpeningLearner(): UseLearnerResult {
  const [session, setSession] = useState<OpeningSession | null>(null)
  const [currentFen, setCurrentFen] = useState(STARTING_FEN)
  const [quizFeedback, setQuizFeedback] = useState<QuizFeedback>(null)
  const [wrongMove, setWrongMove] = useState<string | null>(null)
  const openingRef = useRef<ChessOpening | null>(null)

  const buildFenAtIndex = useCallback((opening: ChessOpening, moveIdx: number): string => {
    const chess = new Chess()
    const moves = opening.moves.slice(0, moveIdx + 1)
    for (const m of moves) {
      try {
        chess.move({ from: m.uci.slice(0, 2), to: m.uci.slice(2, 4), promotion: m.uci[4] as 'q' | undefined })
      } catch { break }
    }
    return chess.fen()
  }, [])

  const startLearn = useCallback((opening: ChessOpening) => {
    openingRef.current = opening
    setSession({ openingId: opening.id, currentMoveIndex: -1, mode: 'learn', quizCorrect: 0, quizTotal: 0 })
    setCurrentFen(STARTING_FEN)
    setQuizFeedback(null)
    setWrongMove(null)
  }, [])

  const startQuiz = useCallback((opening: ChessOpening) => {
    openingRef.current = opening
    setSession({ openingId: opening.id, currentMoveIndex: -1, mode: 'quiz', quizCorrect: 0, quizTotal: 0 })
    setCurrentFen(STARTING_FEN)
    setQuizFeedback(null)
    setWrongMove(null)
  }, [])

  const nextMove = useCallback(() => {
    if (!session || !openingRef.current) return
    const opening = openingRef.current
    const nextIdx = session.currentMoveIndex + 1
    if (nextIdx >= opening.moves.length) return
    const fen = buildFenAtIndex(opening, nextIdx)
    setCurrentFen(fen)
    setSession(s => s ? { ...s, currentMoveIndex: nextIdx } : s)
    setQuizFeedback(null)
    setWrongMove(null)
  }, [session, buildFenAtIndex])

  const prevMove = useCallback(() => {
    if (!session || !openingRef.current) return
    const prevIdx = session.currentMoveIndex - 1
    if (prevIdx < -1) return
    const fen = prevIdx < 0 ? STARTING_FEN : buildFenAtIndex(openingRef.current, prevIdx)
    setCurrentFen(fen)
    setSession(s => s ? { ...s, currentMoveIndex: prevIdx } : s)
    setQuizFeedback(null)
    setWrongMove(null)
  }, [session, buildFenAtIndex])

  const tryQuizMove = useCallback((uci: string): boolean => {
    if (!session || !openingRef.current) return false
    const opening = openingRef.current
    const expectedIdx = session.currentMoveIndex + 1
    if (expectedIdx >= opening.moves.length) return false

    const expected = opening.moves[expectedIdx].uci
    const correct = uci.startsWith(expected.slice(0, 4))

    setSession(s => s ? {
      ...s,
      quizTotal: s.quizTotal + 1,
      quizCorrect: s.quizCorrect + (correct ? 1 : 0),
    } : s)

    if (correct) {
      setQuizFeedback('correct')
      setWrongMove(null)
      const fen = buildFenAtIndex(opening, expectedIdx)
      setCurrentFen(fen)
      setSession(s => s ? { ...s, currentMoveIndex: expectedIdx } : s)
    } else {
      setQuizFeedback('wrong')
      setWrongMove(uci)
    }

    setTimeout(() => setQuizFeedback(null), 1200)
    return correct
  }, [session, buildFenAtIndex])

  const getLegalMoves = useCallback((): string[] => {
    const chess = new Chess(currentFen)
    return chess.moves({ verbose: true }).map(m => `${m.from}${m.to}${m.promotion ?? ''}`)
  }, [currentFen])

  const resetSession = useCallback(() => {
    setSession(null)
    setCurrentFen(STARTING_FEN)
    setQuizFeedback(null)
    setWrongMove(null)
    openingRef.current = null
  }, [])

  const isComplete = Boolean(
    session && openingRef.current &&
    session.currentMoveIndex >= openingRef.current.moves.length - 1
  )

  const totalMoves = openingRef.current?.moves.length ?? 0

  return {
    session,
    currentFen,
    currentMoveIdx: session?.currentMoveIndex ?? -1,
    totalMoves,
    isComplete,
    quizFeedback,
    wrongMove,
    startLearn,
    startQuiz,
    nextMove,
    prevMove,
    tryQuizMove,
    resetSession,
    getLegalMoves,
  }
}
