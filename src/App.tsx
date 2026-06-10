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
import ShortcutsModal from './components/ShortcutsModal'
import Toast from './components/Toast'
import OpeningsPanel from './components/openings/OpeningsPanel'
import EvalChart from './components/EvalChart'
import { useChessCom } from './hooks/useChessCom'
import { useEngineOpponent, BOT_LEVELS, type BotLevel } from './hooks/useEngineOpponent'
import type { ChessComGame } from './utils/chesscomApi'
import type { GameSettings } from './types'
import { getOpeningName } from './utils/openings'
import { getBoardColors } from './utils/boardThemes'
import { detectGamePhase, phaseLabel } from './utils/gamePhase'
import { SoundEngine } from './utils/soundEngine'
import { buildShareUrl, readSharedFen, clearShareHash } from './utils/share'
import { downloadPGN } from './utils/pgn'

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
  autoQueen: false,
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
  type Tab = 'analysis' | 'history' | 'stats' | 'chesscom' | 'openings'
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('chess-active-tab')
    return (['analysis', 'history', 'stats', 'chesscom', 'openings'] as const).includes(saved as Tab)
      ? (saved as Tab) : 'analysis'
  })

  useEffect(() => {
    localStorage.setItem('chess-active-tab', activeTab)
  }, [activeTab])
  const [playerNames, setPlayerNames] = useState(() => {
    try {
      const saved = localStorage.getItem('chess-player-names')
      return saved ? JSON.parse(saved) : { white: 'White', black: 'Black' }
    } catch { return { white: 'White', black: 'Black' } }
  })
  const [showNameEditor, setShowNameEditor] = useState(false)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null)
  const [gameMode, setGameMode] = useState<'pvp' | 'bot' | 'analysis'>('pvp')
  const [botLevel, setBotLevel] = useState<BotLevel>(() => {
    const saved = Number(localStorage.getItem('chess-bot-level'))
    return (saved >= 1 && saved <= 5 ? saved : 3) as BotLevel
  })
  const [botColor, setBotColor] = useState<'w' | 'b'>('b')
  const [reviewingGame, setReviewingGame] = useState<ChessComGame | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [autoplay, setAutoplay] = useState(false)
  const [autoplaySpeed, setAutoplaySpeed] = useState(1000)

  const game = useChessGame()
  const { result: sfResult, analyze, stop } = useStockfish(settings.analysisDepth, settings.multiPV)
  const timer = useTimer(settings.timeControl, settings.enableTimer)
  const chessCom = useChessCom()
  const bot = useEngineOpponent(botLevel)

  const { gameState, capturedPieces, makeMove, undoMove, resetGame, goToMove, loadFromFEN, loadFromPGN } = game

  useEffect(() => {
    localStorage.setItem('chess-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('chess-player-names', JSON.stringify(playerNames))
  }, [playerNames])

  useEffect(() => {
    localStorage.setItem('chess-bot-level', String(botLevel))
  }, [botLevel])

  // Bot mode: when it's the engine's turn, ask Stockfish for a reply
  useEffect(() => {
    if (gameMode !== 'bot' || gameState.isGameOver || gameState.turn !== botColor) return
    if (gameState.currentMoveIndex !== gameState.moveHistory.length - 1) return
    let cancelled = false
    bot.requestMove(gameState.fen).then(uci => {
      if (cancelled || !uci || uci.length < 4) return
      makeMove(uci.slice(0, 2), uci.slice(2, 4), (uci[4] as 'q' | 'r' | 'b' | 'n') ?? 'q')
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode, gameState.fen, gameState.turn, gameState.isGameOver, botColor])

  // Load a shared position from the URL hash on first mount
  useEffect(() => {
    const sharedFen = readSharedFen()
    if (sharedFen && loadFromFEN(sharedFen)) {
      setToast('Shared position loaded')
      clearShareHash()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    else if (lastMove?.san.includes('=')) SoundEngine.promote()
    else if (lastMove?.san.startsWith('O-O')) SoundEngine.castle()
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

  const isBotTurn = gameMode === 'bot' && gameState.turn === botColor

  function onSquareClick(square: string) {
    if (gameState.isGameOver || isBotTurn) return
    if (selectedSquare && selectedSquare !== square) {
      if (isPromotionMove(selectedSquare, square) && !settings.autoQueen) {
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
    if (gameState.isGameOver || isBotTurn || !to) return false
    if (isPromotionMove(from, to) && !settings.autoQueen) {
      setPendingPromotion({ from, to })
      return true
    }
    const ok = makeMove(from, to, 'q')
    if (!ok && settings.soundEnabled) SoundEngine.illegal()
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

  // Autoplay: step forward through the move list on a timer
  useEffect(() => {
    if (!autoplay) return
    if (!canGoNext) { setAutoplay(false); return }
    const id = setInterval(() => {
      goToMove(gameState.currentMoveIndex + 1)
    }, autoplaySpeed)
    return () => clearInterval(id)
  }, [autoplay, canGoNext, gameState.currentMoveIndex, autoplaySpeed, goToMove])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft' && canGoPrev) goToMove(gameState.currentMoveIndex - 1)
      if (e.key === 'ArrowRight' && canGoNext) goToMove(gameState.currentMoveIndex + 1)
      if (e.key === 'ArrowUp') goToMove(0)
      if (e.key === 'ArrowDown') goToMove(gameState.moveHistory.length - 1)
      if (e.key === 'f' || e.key === 'F') setFlipped(f => !f)
      if (e.key === '?') setShowShortcuts(s => !s)
      if (e.key === ' ') { e.preventDefault(); setAutoplay(a => !a) }
      if (e.key === 'Home' && canGoPrev) goToMove(0)
      if (e.key === 'End' && canGoNext) goToMove(gameState.moveHistory.length - 1)
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
    navigator.clipboard.writeText(gameState.fen).then(() => setToast('FEN copied to clipboard'))
  }

  function copyShareLink() {
    navigator.clipboard.writeText(buildShareUrl(gameState.fen)).then(() => setToast('Share link copied'))
  }

  function copyPGN() {
    if (!gameState.pgn) { setToast('No moves to copy yet'); return }
    navigator.clipboard.writeText(gameState.pgn).then(() => setToast('PGN copied to clipboard'))
  }

  function exportPGN() {
    if (!gameState.pgn) { setToast('No moves to export yet'); return }
    const date = new Date().toISOString().slice(0, 10)
    downloadPGN(gameState.pgn, `chess-analyzer-${date}.pgn`)
    setToast('PGN downloaded')
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="shrink-0 px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl select-none shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
            ♟
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight tracking-tight">Chess Analyzer</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Stockfish 18 · Engine analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex p-0.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            {(['pvp', 'bot', 'analysis'] as const).map(mode => (
              <button key={mode}
                onClick={() => setGameMode(mode)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={gameMode === mode ? {
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  boxShadow: '0 0 12px rgba(99,102,241,0.35)',
                } : { color: 'var(--text-muted)' }}
              >
                {mode === 'pvp' ? 'vs Player' : mode === 'bot' ? 'vs Computer' : 'Analysis'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNameEditor(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            title="Edit player names"
          >
            ✏ Names
          </button>

          {/* Status badge */}
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            gameState.isCheck && !gameState.isCheckmate ? 'animate-pulse' : ''
          }`} style={
            gameState.isCheck && !gameState.isCheckmate
              ? { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
              : gameState.isGameOver
              ? { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }
              : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
          }>
            {statusText}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-[1280px] mx-auto w-full overflow-auto lg:overflow-hidden">
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

            {gameMode === 'bot' && (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>Bot</span>
                <select
                  value={botLevel}
                  onChange={e => setBotLevel(Number(e.target.value) as BotLevel)}
                  className="flex-1 text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-muted)', color: 'var(--text-primary)' }}
                  title="Bot difficulty"
                >
                  {(Object.entries(BOT_LEVELS)).map(([lvl, cfg]) => (
                    <option key={lvl} value={lvl}>{cfg.label} ({cfg.elo})</option>
                  ))}
                </select>
                <button
                  onClick={() => { setBotColor(c => (c === 'w' ? 'b' : 'w')); setFlipped(botColor !== 'w') }}
                  className="text-xs px-2 py-1 rounded-lg transition-all"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-muted)', color: 'var(--text-secondary)' }}
                  title="Switch which side the bot plays"
                >
                  Bot plays {botColor === 'w' ? '⚪' : '⚫'}
                </button>
                {bot.isThinking && (
                  <span className="text-[10px] animate-pulse font-medium" style={{ color: 'var(--accent-indigo)' }}>
                    thinking…
                  </span>
                )}
              </div>
            )}

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
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full pointer-events-none animate-pulse"
                  style={{
                    background: 'rgba(239,68,68,0.90)',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(239,68,68,0.6), 0 2px 8px rgba(0,0,0,0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  ⚠ CHECK
                </div>
              )}
            </div>

            {/* Opening name badge */}
            {openingName && !gameState.isGameOver && (
              <div
                className="text-[10px] px-2.5 py-1 rounded-lg font-medium truncate text-center"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.18)',
                  color: 'var(--accent-indigo)',
                }}
                title={openingName}
              >
                📖 {openingName}
              </div>
            )}

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
            {autoplay && (
              <button
                onClick={() => setAutoplaySpeed(s => (s === 2000 ? 1000 : s === 1000 ? 500 : 2000))}
                className="text-[10px] px-2 py-1 rounded-lg font-medium self-center transition-all"
                style={{
                  background: 'rgba(99,102,241,0.10)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: 'var(--accent-indigo)',
                }}
                title="Change autoplay speed"
              >
                ▶▶ Replay speed: {autoplaySpeed === 2000 ? '0.5×' : autoplaySpeed === 1000 ? '1×' : '2×'}
              </button>
            )}
            <PositionInfo
              fen={gameState.fen}
              moveCount={gameState.moveHistory.length}
              onCopyFen={copyFEN}
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
              autoplay={autoplay}
              onToggleAutoplay={() => setAutoplay(a => !a)}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Tab navigation */}
          <div className="flex p-1 rounded-xl shrink-0 flex-wrap gap-0.5"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            {([
              ['analysis', '⚡', 'Analysis'],
              ['history',  '📋', 'Moves'],
              ['stats',    '📊', 'Stats'],
              ['openings', '📖', 'Openings'],
              ['chesscom', '♟', 'chess.com'],
            ] as const).map(([tab, icon, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1"
                style={activeTab === tab ? {
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                } : { color: 'var(--text-muted)' }}
              >
                <span>{icon}</span>
                <span>{label}</span>
                {tab === 'chesscom' && chessCom.connectionState === 'connected' && (
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
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

          <div className="flex-1 rounded-xl p-3 overflow-hidden flex flex-col min-h-0"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            {activeTab === 'analysis' && (
              <AnalysisPanel
                result={sfResult}
                currentFen={gameState.fen}
                autoAnalysis={settings.autoAnalysis}
                onAnalyze={() => analyze(gameState.fen)}
              />
            )}
            {activeTab === 'history' && (
              <MoveHistory
                moves={gameState.moveHistory}
                currentIndex={gameState.currentMoveIndex}
                onJump={goToMove}
              />
            )}
            {activeTab === 'stats' && (
              <div className="flex flex-col gap-3 overflow-y-auto">
                <EvalChart
                  moves={gameState.moveHistory}
                  currentIndex={gameState.currentMoveIndex}
                  onJump={goToMove}
                />
                <GameStats moves={gameState.moveHistory} playerNames={playerNames} />
              </div>
            )}
            {activeTab === 'openings' && (
              <OpeningsPanel
                boardSize={480}
                onLoadPGN={pgn => {
                  loadFromPGN(pgn)
                  setToast('Opening loaded into main board')
                  setActiveTab('history')
                }}
              />
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

          {/* Footer bar */}
          <div className="shrink-0 rounded-xl px-3 py-2 text-xs flex items-center justify-between"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(true)}
                className="font-medium transition-colors hover:text-white"
                title="View all keyboard shortcuts"
                style={{ color: 'var(--text-secondary)' }}
              >
                ⌨ Shortcuts
              </button>
              <span style={{ color: 'var(--border-muted)' }}>·</span>
              <span>← → navigate · F flip · ? help</span>
            </div>
            <div className="flex items-center gap-2">
              {(['Share', 'Copy PGN', 'Save PGN'] as const).map(action => (
                <button
                  key={action}
                  onClick={action === 'Share' ? copyShareLink : action === 'Copy PGN' ? copyPGN : exportPGN}
                  className="text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors hover:text-white"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                  title={action === 'Share' ? 'Copy a link to this position' : action === 'Copy PGN' ? 'Copy game PGN to clipboard' : 'Download game as .pgn file'}
                >
                  {action === 'Share' ? '🔗 Share' : action === 'Copy PGN' ? '📋 PGN' : '💾 Save'}
                </button>
              ))}
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                {phaseLabel(gamePhase)}
              </span>
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
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showPGN && (
        <PGNPanel
          pgn={gameState.pgn}
          onImportPGN={pgn => { const ok = loadFromPGN(pgn); if (ok) { setShowPGN(false); setToast('PGN loaded') } return ok }}
          onImportFEN={fen => { const ok = loadFromFEN(fen); if (ok) { setShowPGN(false); setToast('Position loaded from FEN') } return ok }}
          onClose={() => setShowPGN(false)}
        />
      )}
    </div>
  )
}
