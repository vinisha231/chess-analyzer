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
import PromotionDialog from './components/PromotionDialog'
import PlayerNameEditor from './components/PlayerNameEditor'
import PositionInfo from './components/PositionInfo'
import MaterialBar from './components/MaterialBar'
import MoveNavigator from './components/MoveNavigator'
import ChessComPanel from './components/ChessComPanel'
import GameReviewBanner from './components/GameReviewBanner'
import { useChessCom } from './hooks/useChessCom'
import type { ChessComGame } from './utils/chesscomApi'
import type { GameSettings } from './types'
import { getOpeningName } from './utils/openings'
import { getBoardColors } from './utils/boardThemes'
import { detectGamePhase, phaseLabel } from './utils/gamePhase'
import { SoundEngine } from './utils/soundEngine'

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dark',
  boardTheme: 'classic',
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  showBestMoveArrow: true,
  soundEnabled: true,
  analysisDepth: 15,
  multiPV: 3,
  enableTimer: false,
  timeControl: 300,
  autoAnalysis: true,
  showMaterialBar: true,
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'history' | 'stats' | 'chesscom'>('analysis')
  const [playerNames, setPlayerNames] = useState({ white: 'White', black: 'Black' })
  const [showNameEditor, setShowNameEditor] = useState(false)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null)
  const [gameMode, setGameMode] = useState<'pvp' | 'analysis'>('pvp')
  const [reviewingGame, setReviewingGame] = useState<ChessComGame | null>(null)

  const game = useChessGame()
  const { result: sfResult, analyze, stop } = useStockfish(settings.analysisDepth, settings.multiPV)
  const timer = useTimer(settings.timeControl, settings.enableTimer)
  const chessCom = useChessCom()

  const { gameState, capturedPieces, makeMove, undoMove, resetGame, goToMove, loadFromFEN, loadFromPGN } = game

  useEffect(() => {
    localStorage.setItem('chess-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (gameState.isGameOver) {
      setShowResultModal(true)
      stop()
      if (settings.soundEnabled) SoundEngine.gameEnd()
    } else if (settings.autoAnalysis) {
      analyze(gameState.fen)
    }
  }, [gameState.fen, gameState.isGameOver, settings.autoAnalysis])

  useEffect(() => {
    if (gameState.moveHistory.length === 0) return
    if (!settings.soundEnabled) return
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1]
    if (gameState.isCheck) SoundEngine.check()
    else if (lastMove?.san.includes('x')) SoundEngine.capture()
    else SoundEngine.move()
  }, [gameState.moveHistory.length])

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
      const target = game.chess.current.get(sq as any)
      if (target) {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(239,68,68,0.5) 60%, transparent 62%)',
          boxShadow: 'inset 0 0 0 3px rgba(239,68,68,0.6)',
        }
      } else {
        styles[sq] = {
          background: 'radial-gradient(circle, rgba(99,102,241,0.65) 28%, transparent 30%)',
        }
      }
    })
    return styles
  }, [selectedSquare, settings.showLegalMoves])

  const lastMoveSquares = useCallback((): Record<string, object> => {
    if (!settings.showLastMove) return {}
    const lastMove = gameState.moveHistory[gameState.currentMoveIndex]
    if (!lastMove) return {}
    const chess = game.chess.current
    const history = chess.history({ verbose: true })
    const last = history[history.length - 1]
    if (!last) return {}
    return {
      [last.from]: { backgroundColor: 'rgba(255, 214, 10, 0.35)' },
      [last.to]: { backgroundColor: 'rgba(255, 214, 10, 0.5)' },
    }
  }, [gameState.currentMoveIndex, gameState.moveHistory, settings.showLastMove])

  const customSquareStyles = (): Record<string, object> => {
    const styles: Record<string, object> = {}
    if (selectedSquare) styles[selectedSquare] = { backgroundColor: 'rgba(99,102,241,0.45)' }
    return { ...lastMoveSquares(), ...styles, ...legalSquareStyles() }
  }

  const bestMoveArrows = useCallback(() => {
    if (!settings.showBestMoveArrow) return []
    const arrowColors = [
      'rgba(99,102,241,0.80)',   // indigo — best move
      'rgba(34,197,94,0.55)',    // green — 2nd best
      'rgba(251,191,36,0.45)',   // amber — 3rd best
    ]
    return sfResult.lines
      .slice(0, 3)
      .filter(line => line.moves[0] && line.moves[0].length >= 4)
      .map((line, i) => ({
        startSquare: line.moves[0].slice(0, 2),
        endSquare: line.moves[0].slice(2, 4),
        color: arrowColors[i],
      }))
  }, [sfResult.lines, settings.showBestMoveArrow])

  function isPromotionMove(from: string, to: string): boolean {
    const piece = game.chess.current.get(from as any)
    if (!piece || piece.type !== 'p') return false
    const toRank = to[1]
    return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')
  }

  function onSquareClick(square: string) {
    if (gameState.isGameOver) return
    if (selectedSquare && selectedSquare !== square) {
      if (isPromotionMove(selectedSquare, square)) {
        setPendingPromotion({ from: selectedSquare, to: square })
        setSelectedSquare(null)
        return
      }
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
    if (isPromotionMove(from, to)) {
      setPendingPromotion({ from, to })
      return true
    }
    const ok = makeMove(from, to, 'q')
    setSelectedSquare(null)
    return ok
  }

  function handlePromotion(piece: 'q' | 'r' | 'b' | 'n') {
    if (!pendingPromotion) return
    makeMove(pendingPromotion.from, pendingPromotion.to, piece)
    setPendingPromotion(null)
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

  const gamePhase = detectGamePhase(gameState.fen, gameState.moveHistory.length)

  function copyFEN() {
    navigator.clipboard.writeText(gameState.fen)
  }

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
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setGameMode('pvp')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${gameMode === 'pvp' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Player vs Player
            </button>
            <button
              onClick={() => setGameMode('analysis')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${gameMode === 'analysis' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Analysis Mode
            </button>
          </div>
          <button
            onClick={() => setShowNameEditor(true)}
            className="text-xs px-2 py-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            title="Edit player names"
          >
            ✏ Names
          </button>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            gameState.isCheck && !gameState.isCheckmate
              ? 'bg-red-900/60 text-red-300 animate-pulse'
              : gameState.isGameOver
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-800 text-gray-400'
          }`}>
            {statusText}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-[1200px] mx-auto w-full overflow-auto lg:overflow-hidden">
        <div className="flex gap-3 items-start shrink-0 mx-auto lg:mx-0">
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
                  darkSquareStyle: { backgroundColor: getBoardColors(settings.boardTheme).dark },
                  lightSquareStyle: { backgroundColor: getBoardColors(settings.boardTheme).light },
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

            {settings.showMaterialBar && <MaterialBar white={material.white} black={material.black} />}
            <MoveNavigator
              current={gameState.currentMoveIndex}
              total={gameState.moveHistory.length}
              onJump={goToMove}
            />
            <PositionInfo fen={gameState.fen} moveCount={gameState.moveHistory.length} />

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
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1 shrink-0 flex-wrap">
            {([
              ['analysis', '⚡ Analysis'],
              ['history',  '📋 Moves'],
              ['stats',    '📊 Stats'],
              ['chesscom', '♟ chess.com'],
            ] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
                {tab === 'chesscom' && chessCom.connectionState === 'connected' && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {reviewingGame && chessCom.profile && (
            <GameReviewBanner
              game={reviewingGame}
              username={chessCom.profile.username}
              onClear={() => setReviewingGame(null)}
            />
          )}

          <div className="flex-1 bg-gray-800/50 rounded-xl p-3 overflow-hidden flex flex-col min-h-0">
            {activeTab === 'analysis' && <AnalysisPanel result={sfResult} currentFen={gameState.fen} />}
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
            {activeTab === 'chesscom' && (
              <ChessComPanel
                {...chessCom}
                onImportGame={pgn => {
                  loadFromPGN(pgn)
                  const imported = chessCom.games.find(g => g.pgn === pgn) ?? null
                  setReviewingGame(imported)
                  // Auto-flip board so the user's color is always on the bottom
                  if (imported && chessCom.profile) {
                    const userIsBlack = imported.black.username.toLowerCase() === chessCom.profile.username.toLowerCase()
                    setFlipped(userIsBlack)
                  }
                  setActiveTab('history')
                }}
              />
            )}
          </div>

          <div className="shrink-0 bg-gray-800/30 rounded-xl px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-400">Shortcuts: </span>
              ← → navigate · ↑↓ first/last · F flip
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{phaseLabel(gamePhase)}</span>
              <button
                onClick={copyFEN}
                className="text-gray-500 hover:text-gray-300 transition-colors font-mono text-xs"
                title="Copy FEN to clipboard"
              >
                Copy FEN
              </button>
            </div>
          </div>
        </div>
      </main>

      {showNameEditor && (
        <PlayerNameEditor
          names={playerNames}
          onChange={setPlayerNames}
          onClose={() => setShowNameEditor(false)}
        />
      )}
      {pendingPromotion && (
        <PromotionDialog
          color={gameState.turn}
          onSelect={handlePromotion}
          onCancel={() => setPendingPromotion(null)}
        />
      )}
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
