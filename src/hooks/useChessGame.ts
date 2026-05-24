import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import type { GameState, MoveRecord, CapturedPieces } from '../types'

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function buildInitialState(): GameState {
  const chess = new Chess()
  return {
    fen: chess.fen(),
    pgn: '',
    turn: 'w',
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isGameOver: false,
    moveHistory: [],
    currentMoveIndex: -1,
  }
}

export function useChessGame() {
  const chessRef = useRef(new Chess())
  const [gameState, setGameState] = useState<GameState>(buildInitialState)
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ w: [], b: [] })

  const makeMove = useCallback((from: string, to: string, promotion = 'q'): boolean => {
    const chess = chessRef.current
    try {
      const move = chess.move({ from, to, promotion })
      if (!move) return false

      const captured = move.captured
        ? [...(capturedPieces[move.color === 'w' ? 'b' : 'w'] ?? []), move.captured]
        : undefined

      if (captured) {
        setCapturedPieces(prev => ({
          ...prev,
          [move.color === 'w' ? 'b' : 'w']: captured,
        }))
      }

      const record: MoveRecord = {
        san: move.san,
        fen: chess.fen(),
        evalBefore: undefined,
        evalAfter: undefined,
      }

      setGameState(prev => {
        const history = prev.moveHistory.slice(0, prev.currentMoveIndex + 1)
        const newHistory = [...history, record]
        return {
          ...prev,
          fen: chess.fen(),
          pgn: chess.pgn(),
          turn: chess.turn(),
          isCheck: chess.inCheck(),
          isCheckmate: chess.isCheckmate(),
          isStalemate: chess.isStalemate(),
          isDraw: chess.isDraw(),
          isGameOver: chess.isGameOver(),
          moveHistory: newHistory,
          currentMoveIndex: newHistory.length - 1,
        }
      })

      return true
    } catch {
      return false
    }
  }, [capturedPieces])

  const undoMove = useCallback(() => {
    const chess = chessRef.current
    const move = chess.undo()
    if (!move) return

    setGameState(prev => {
      const newHistory = prev.moveHistory.slice(0, -1)
      return {
        ...prev,
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn(),
        isCheck: chess.inCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        isGameOver: chess.isGameOver(),
        moveHistory: newHistory,
        currentMoveIndex: newHistory.length - 1,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    chessRef.current = new Chess()
    setCapturedPieces({ w: [], b: [] })
    setGameState(buildInitialState())
  }, [])

  const goToMove = useCallback((index: number) => {
    const chess = new Chess()
    setGameState(prev => {
      const targetHistory = prev.moveHistory.slice(0, index + 1)
      for (let i = 0; i < targetHistory.length; i++) {
        chess.move(targetHistory[i].san)
      }
      chessRef.current = chess
      return {
        ...prev,
        fen: chess.fen(),
        turn: chess.turn(),
        isCheck: chess.inCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        isGameOver: chess.isGameOver(),
        currentMoveIndex: index,
      }
    })
  }, [])

  const loadFromFEN = useCallback((fen: string): boolean => {
    try {
      const chess = new Chess(fen)
      chessRef.current = chess
      setCapturedPieces({ w: [], b: [] })
      setGameState({
        fen: chess.fen(),
        pgn: '',
        turn: chess.turn(),
        isCheck: chess.inCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        isGameOver: chess.isGameOver(),
        moveHistory: [],
        currentMoveIndex: -1,
      })
      return true
    } catch {
      return false
    }
  }, [])

  const loadFromPGN = useCallback((pgn: string): boolean => {
    try {
      const chess = new Chess()
      chess.loadPgn(pgn)
      const history = chess.history({ verbose: true })
      const moveRecords: MoveRecord[] = []
      const tempChess = new Chess()
      for (const move of history) {
        tempChess.move(move.san)
        moveRecords.push({ san: move.san, fen: tempChess.fen() })
      }
      chessRef.current = chess
      setCapturedPieces({ w: [], b: [] })
      setGameState({
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn(),
        isCheck: chess.inCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        isGameOver: chess.isGameOver(),
        moveHistory: moveRecords,
        currentMoveIndex: moveRecords.length - 1,
      })
      return true
    } catch {
      return false
    }
  }, [])

  const getMaterialCount = useCallback(() => {
    const fen = chessRef.current.fen().split(' ')[0]
    let white = 0, black = 0
    for (const ch of fen) {
      if (ch === ch.toUpperCase() && ch in PIECE_VALUES) white += PIECE_VALUES[ch.toLowerCase()]
      else if (ch === ch.toLowerCase() && ch in PIECE_VALUES) black += PIECE_VALUES[ch]
    }
    return { white, black, advantage: white - black }
  }, [])

  const getLegalMoves = useCallback((square: string): string[] => {
    try {
      return chessRef.current.moves({ square: square as any, verbose: true }).map((m: any) => m.to)
    } catch {
      return []
    }
  }, [])

  const updateMoveEval = useCallback((index: number, evalBefore: number, evalAfter: number, bestMove?: string) => {
    setGameState(prev => {
      const newHistory = [...prev.moveHistory]
      if (newHistory[index]) {
        newHistory[index] = { ...newHistory[index], evalBefore, evalAfter, bestMove }
      }
      return { ...prev, moveHistory: newHistory }
    })
  }, [])

  return {
    gameState,
    capturedPieces,
    makeMove,
    undoMove,
    resetGame,
    goToMove,
    loadFromFEN,
    loadFromPGN,
    getMaterialCount,
    getLegalMoves,
    updateMoveEval,
    chess: chessRef,
  }
}
