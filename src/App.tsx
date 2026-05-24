import { useState, useEffect, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { useChessGame } from './hooks/useChessGame'
import { useStockfish } from './hooks/useStockfish'
import { useTimer } from './hooks/useTimer'
import EvaluationBar from './components/EvaluationBar'
import AnalysisPanel from './components/AnalysisPanel'
import MoveHistory from './components/MoveHistory'
import GameControls from './components/GameControls'
import PlayerInfo from './components/PlayerInfo'
import GameResultModal from './components/GameResultModal'
import SettingsPanel from './components/SettingsPanel'
import PGNPanel from './components/PGNPanel'
import GameStats from './components/GameStats'
import type { GameSettings } from './types'
import { getOpeningName } from './utils/openings'

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dark',
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  showBestMoveArrow: true,
  soundEnabled: true,
  analysisDepth: 18,
  multiPV: 3,
  enableTimer: false,
  timeControl: 300,
}

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('chess-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch { return DEFAULT_SETTINGS }
  })

  const [flipped, setFlipped] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPGN, setShowPGN] = useState(false)
  const [activeTab, setActiveTab] = useState<'analysis' | 'history' | 'stats'>('analysis')
  const [playerNames] = useState({ white: 'White', black: 'Black' })
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)

  const game = useChessGame()
  const { result: sfResult, analyze, stop } = useStockfish(settings.analysisDepth, settings.multiPV)
  const timer = useTimer(settings.timeControl, settings.enableTimer)

  const { gameState, capturedPieces, makeMove, undoMove, resetGame, goToMove, loadFromFEN, loadFromPGN } = game

  useEffect(() => {
    localStorage.setItem('chess-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (gameState.isGameOver) {
      setShowResultModal(true)
      stop()
    } else {
      analyze(gameState.fen)
    }
  }, [gameState.fen, gameState.isGameOver])

  useEffect(() => {
    if (!gameState.isGameOver && settings.enableTimer && gameState.moveHistory.length > 0) {
      timer.start()
      timer.switchColor(gameState.turn)
    }
  }, [gameState.turn, gameState.moveHistory.length])

  const openingName = getOpeningName(gameState.fen)
  const material = game.getMaterialCount()

  const legalSquareStyles = useCallback((): Record<string, object> => {
    if (!selectedSquare || !settings.showLegalMoves) return {}
    const legalMoves = game.getLegalMoves(selectedSquare)
    const styles: Record<string, object> = {}
    legalMoves.forEach(sq => {
      styles[sq] = {
        background: 'radial-gradient(circle, rgba(99,102,241,0.65) 28%, transparent 30%)',
        borderRadius: '50%',
      }
    })
    return styles
  }, [selectedSquare, settings.showLegalMoves])

  const customSquareStyles = (): Record<string, object> => {
    const styles: Record<string, object> = {}
    if (selectedSquare) styles[selectedSquare] = { backgroundColor: 'rgba(99,102,241,0.45)' }
    return { ...styles, ...legalSquareStyles() }
  }

  const bestMoveArrows = useCallback(() => {
    if (!settings.showBestMoveArrow || !sfResult.bestMove || sfResult.bestMove.length < 4) return []
    return [{
      startSquare: sfResult.bestMove.slice(0, 2),
      endSquare: sfResult.bestMove.slice(2, 4),
      color: 'rgba(99,102,241,0.75)',
    }]
  }, [sfResult.bestMove, settings.showBestMoveArrow])

  function onSquareClick(square: string) {
    if (gameState.isGameOver) return
    if (selectedSquare && selectedSquare !== square) {
      const ok = makeMove(selectedSquare, square)
      setSelectedSquare(null)
      if (ok) return
    }
    const piece = game.chess.current.get(square as any)
    if (piece && piece.color === gameState.turn) {
      setSelectedSquare(square)
    } else {
      setSelectedSquare(null)
    }
  }

  function onPieceDrop(from: string, to: string | null): boolean {
    if (gameState.isGameOver || !to) return false
    const ok = makeMove(from, to, 'q')
    setSelectedSquare(null)
    return ok
  }

  function handleReset() {
    resetGame()
    timer.reset()
    setShowResultModal(false)
    setSelectedSquare(null)
    stop()
  }

  const canGoPrev = gameState.currentMoveIndex >= 0
  const canGoNext = gameState.currentMoveIndex < gameState.moveHistory.length - 1

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft' && canGoPrev) goToMove(gameState.currentMoveIndex - 1)
      if (e.key === 'ArrowRight' && canGoNext) goToMove(gameState.currentMoveIndex + 1)
      if (e.key === 'ArrowUp') goToMove(0)
      if (e.key === 'ArrowDown') goToMove(gameState.moveHistory.length - 1)
      if (e.key === 'f' || e.key === 'F') setFlipped(f => !f)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.currentMoveIndex, gameState.moveHistory.length, canGoPrev, canGoNext])

  const statusText = gameState.isCheckmate
    ? `Checkmate! ${gameState.turn === 'w' ? 'Black' : 'White'} wins`
    : gameState.isStalemate ? 'Stalemate — Draw'
    : gameState.isDraw ? 'Draw'
    : gameState.isCheck ? `${gameState.turn === 'w' ? 'White' : 'Black'} in check!`
    : openingName ?? `${gameState.turn === 'w' ? 'White' : 'Black'} to move`

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">♟</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Chess Analyzer</h1>
            <p className="text-xs text-gray-400">Stockfish 18 · Best-move analysis</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
          gameState.isCheck && !gameState.isCheckmate
            ? 'bg-red-900/60 text-red-300 animate-pulse'
            : gameState.isGameOver
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gray-800 text-gray-400'
        }`}>
          {statusText}
        </span>
      </header>

      <main className="flex-1 flex gap-4 p-4 max-w-[1200px] mx-auto w-full overflow-hidden">
        <div className="flex gap-3 items-start shrink-0">
          <EvaluationBar
            evaluation={sfResult.evaluation}
            mate={sfResult.mate}
            isCalculating={sfResult.isCalculating}
          />

          <div className="flex flex-col gap-2">
            <PlayerInfo
              name={flipped ? playerNames.white : playerNames.black}
              color={flipped ? 'w' : 'b'}
              isActive={gameState.turn === (flipped ? 'w' : 'b') && !gameState.isGameOver}
              capturedPieces={capturedPieces}
              advantage={flipped ? material.advantage : -material.advantage}
              timeDisplay={settings.enableTimer ? timer.formatTime(flipped ? timer.whiteTime : timer.blackTime) : undefined}
              timeLow={flipped ? timer.whiteLow : timer.blackLow}
            />

            <div className="relative">
              <Chessboard
                options={{
                  position: gameState.fen,
                  onPieceDrop: ({ sourceSquare, targetSquare }) =>
                    onPieceDrop(sourceSquare, targetSquare),
                  onSquareClick: ({ square }) => onSquareClick(square),
                  boardOrientation: flipped ? 'black' : 'white',
                  boardStyle: { width: 520 },
                  showNotation: settings.showCoordinates,
                  squareStyles: customSquareStyles(),
                  arrows: bestMoveArrows(),
                  darkSquareStyle: { backgroundColor: '#3d4a5c' },
                  lightSquareStyle: { backgroundColor: '#dde3ec' },
                  animationDurationInMs: 150,
                }}
              />
              {gameState.isCheck && !gameState.isCheckmate && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none">
                  CHECK
                </div>
              )}
            </div>

            <PlayerInfo
              name={flipped ? playerNames.black : playerNames.white}
              color={flipped ? 'b' : 'w'}
              isActive={gameState.turn === (flipped ? 'b' : 'w') && !gameState.isGameOver}
              capturedPieces={capturedPieces}
              advantage={flipped ? -material.advantage : material.advantage}
              timeDisplay={settings.enableTimer ? timer.formatTime(flipped ? timer.blackTime : timer.whiteTime) : undefined}
              timeLow={flipped ? timer.blackLow : timer.whiteLow}
            />

            <GameControls
              canUndo={gameState.moveHistory.length > 0}
              onUndo={undoMove}
              onReset={handleReset}
              onFlip={() => setFlipped(f => !f)}
              onFirst={() => canGoPrev && goToMove(0)}
              onPrev={() => canGoPrev && goToMove(gameState.currentMoveIndex - 1)}
              onNext={() => canGoNext && goToMove(gameState.currentMoveIndex + 1)}
              onLast={() => canGoNext && goToMove(gameState.moveHistory.length - 1)}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              onOpenPGN={() => setShowPGN(true)}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1 shrink-0">
            {(['analysis', 'history', 'stats'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'analysis' ? '⚡ Analysis' : tab === 'history' ? '📋 Moves' : '📊 Stats'}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-gray-800/50 rounded-xl p-3 overflow-hidden flex flex-col min-h-0">
            {activeTab === 'analysis' && <AnalysisPanel result={sfResult} />}
            {activeTab === 'history' && (
              <MoveHistory
                moves={gameState.moveHistory}
                currentIndex={gameState.currentMoveIndex}
                onJump={goToMove}
              />
            )}
            {activeTab === 'stats' && (
              <GameStats moves={gameState.moveHistory} playerNames={playerNames} />
            )}
          </div>

          <div className="shrink-0 bg-gray-800/30 rounded-xl px-3 py-2 text-xs text-gray-500">
            <span className="font-medium text-gray-400">Shortcuts: </span>
            ← → navigate · ↑ first · ↓ last · F flip board
          </div>
        </div>
      </main>

      {showResultModal && (
        <GameResultModal
          gameState={gameState}
          playerNames={playerNames}
          onNewGame={handleReset}
          onClose={() => setShowResultModal(false)}
        />
      )}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showPGN && (
        <PGNPanel
          pgn={gameState.pgn}
          onImportPGN={pgn => { const ok = loadFromPGN(pgn); if (ok) setShowPGN(false); return ok }}
          onImportFEN={fen => { const ok = loadFromFEN(fen); if (ok) setShowPGN(false); return ok }}
          onClose={() => setShowPGN(false)}
        />
      )}
    </div>
  )
}
