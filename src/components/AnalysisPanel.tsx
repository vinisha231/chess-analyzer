import { Chess } from 'chess.js'
import type { StockfishResult } from '../types'
import { evalToDisplay } from '../utils/evaluation'

interface Props {
  result: StockfishResult
  currentFen: string
  onAnalyze?: () => void
  autoAnalysis?: boolean
}

function uciLineToPretty(moves: string[], startFen: string): string {
  try {
    const chess = new Chess(startFen)
    const sanMoves: string[] = []
    for (const uci of moves.slice(0, 6)) {
      const from = uci.slice(0, 2)
      const to = uci.slice(2, 4)
      const promotion = uci.length === 5 ? uci[4] as 'q' | 'r' | 'b' | 'n' : undefined
      const move = chess.move({ from, to, promotion })
      if (!move) break
      sanMoves.push(move.san)
    }
    return sanMoves.join(' ')
  } catch {
    return moves.slice(0, 5).join(' ')
  }
}

function EvalChip({ score, mate }: { score: number; mate: number | null }) {
  const label = evalToDisplay(score, mate)
  const isMate = mate !== null
  const isGood = isMate ? mate > 0 : score > 50
  const isBad = isMate ? mate < 0 : score < -50

  return (
    <span
      className="shrink-0 text-sm font-bold font-mono w-14 text-right"
      style={{
        color: isMate
          ? 'var(--accent-gold)'
          : isGood
          ? '#4ade80'
          : isBad
          ? '#f87171'
          : 'var(--text-secondary)',
      }}
    >
      {label}
    </span>
  )
}

export default function AnalysisPanel({ result, currentFen, onAnalyze, autoAnalysis = true }: Props) {
  const { lines, isCalculating, depth } = result
  const MAX_DEPTH = 20
  const depthPct = Math.min(100, (depth / MAX_DEPTH) * 100)

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Engine Analysis
        </span>

        <div className="flex items-center gap-2">
          {isCalculating && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent-indigo)' }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent-indigo)' }}
              />
              depth {depth > 0 ? depth : '…'}
            </span>
          )}
          {!isCalculating && depth > 0 && (
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              ✓ depth {depth}
            </span>
          )}
          {!autoAnalysis && !isCalculating && onAnalyze && (
            <button
              onClick={onAnalyze}
              className="text-xs px-3 py-1 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--accent-indigo)',
                color: '#fff',
                boxShadow: '0 0 12px rgba(99,102,241,0.35)',
              }}
            >
              Analyze
            </button>
          )}
        </div>
      </div>

      {/* Depth progress bar */}
      {(isCalculating || depth > 0) && (
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-overlay)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${depthPct}%`,
              background: isCalculating
                ? 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))'
                : 'linear-gradient(90deg, #22c55e, #4ade80)',
            }}
          />
        </div>
      )}

      {/* Lines */}
      <div className="flex flex-col gap-1.5">
        {lines.length === 0 && !isCalculating && (
          <div className="flex flex-col items-center py-4 gap-2">
            <span className="text-2xl opacity-20">⚡</span>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Make a move to start analysis</p>
          </div>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2.5 py-2 rounded-xl text-xs transition-all"
            style={i === 0 ? {
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-muted)',
            } : {
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {i === 0 && (
              <span
                className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: 'var(--accent-indigo)',
                  border: '1px solid rgba(99,102,241,0.25)',
                }}
              >
                best
              </span>
            )}
            {i > 0 && (
              <span
                className="shrink-0 text-[9px] font-bold w-5 text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                {i + 1}
              </span>
            )}
            <EvalChip score={line.score} mate={line.mate} />
            <span
              className="font-mono leading-relaxed break-all flex-1"
              style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {uciLineToPretty(line.moves, currentFen)}
            </span>
          </div>
        ))}
      </div>

      {/* Best move banner */}
      {result.bestMove && (
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.20)',
          }}
        >
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Best move:{' '}
            <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              {uciLineToPretty([result.bestMove], currentFen) || result.bestMove}
            </span>
          </span>
          {result.mate !== null && (
            <span className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>
              M{Math.abs(result.mate)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
