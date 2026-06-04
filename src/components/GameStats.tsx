import type { MoveRecord } from '../types'
import { calculateAccuracy } from '../utils/evaluation'

interface Props {
  moves: MoveRecord[]
  playerNames: { white: string; black: string }
}

function countClassification(moves: MoveRecord[], color: 'w' | 'b', label: string): number {
  return moves
    .filter((_, i) => (color === 'w' ? i % 2 === 0 : i % 2 === 1))
    .filter(m => m.classification?.label === label).length
}

const STATS = [
  { label: 'brilliant', display: '✨ Brilliant', color: '#22d3ee' },
  { label: 'best',      display: '★ Best',       color: '#4ade80' },
  { label: 'excellent', display: '! Excellent',  color: '#86efac' },
  { label: 'good',      display: '⊙ Good',       color: '#a3e635' },
  { label: 'inaccuracy',display: '?! Inaccuracy',color: '#fbbf24' },
  { label: 'mistake',   display: '? Mistake',    color: '#fb923c' },
  { label: 'blunder',   display: '?? Blunder',   color: '#f87171' },
] as const

function AccBar({ white, black }: { white: number; black: number }) {
  const total = white + black || 1
  const whitePct = (white / total) * 100
  return (
    <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-overlay)' }}>
      <div
        className="h-full rounded-l-full transition-all duration-700"
        style={{ width: `${whitePct}%`, background: 'linear-gradient(90deg, #f8fafc, #e2e8f0)' }}
      />
      <div className="h-full flex-1" style={{ background: 'linear-gradient(90deg, #1e2030, #0f1117)' }} />
    </div>
  )
}

const accColor = (acc: number) =>
  acc >= 90 ? '#4ade80' : acc >= 75 ? '#fbbf24' : '#f87171'

export default function GameStats({ moves, playerNames }: Props) {
  const whiteMoves = moves.filter((_, i) => i % 2 === 0)
  const blackMoves = moves.filter((_, i) => i % 2 === 1)

  const whiteAcc = calculateAccuracy(whiteMoves)
  const blackAcc = calculateAccuracy(blackMoves)

  const hasClassifications = moves.filter(m => m.classification).length > 0

  if (!hasClassifications) {
    return (
      <div className="flex flex-col items-center py-8 gap-2">
        <span className="text-2xl opacity-20">📊</span>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Stats appear after game review
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Accuracy card */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        <p
          className="text-[9px] uppercase tracking-widest font-bold mb-3"
          style={{ color: 'var(--accent-indigo)' }}
        >
          Accuracy
        </p>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 text-right">
            <span className="text-2xl font-bold font-mono leading-none" style={{ color: accColor(whiteAcc) }}>
              {whiteAcc.toFixed(0)}<span className="text-sm">%</span>
            </span>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              ♙ {playerNames.white}
            </p>
          </div>

          <div className="w-px h-10 shrink-0" style={{ background: 'var(--border-muted)' }} />

          <div className="flex-1 text-left">
            <span className="text-2xl font-bold font-mono leading-none" style={{ color: accColor(blackAcc) }}>
              {blackAcc.toFixed(0)}<span className="text-sm">%</span>
            </span>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              ♟ {playerNames.black}
            </p>
          </div>
        </div>

        <AccBar white={whiteAcc} black={blackAcc} />
        <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>White</span>
          <span>Black</span>
        </div>
      </div>

      {/* Move quality breakdown */}
      <div
        className="rounded-xl px-3 py-3"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        <p
          className="text-[9px] uppercase tracking-widest font-bold mb-2.5"
          style={{ color: 'var(--accent-indigo)' }}
        >
          Move quality
        </p>

        <div className="flex flex-col gap-2">
          {STATS.map(({ label, display, color }) => {
            const wCount = countClassification(moves, 'w', label)
            const bCount = countClassification(moves, 'b', label)
            if (wCount === 0 && bCount === 0) return null
            const maxCount = Math.max(wCount, bCount, 1)
            const wPct = (wCount / maxCount) * 100
            const bPct = (bCount / maxCount) * 100

            return (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold w-5 text-right shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  {wCount || ''}
                </span>

                <div className="flex-1 flex items-center gap-0.5 min-w-0">
                  {/* White bar — grows from center leftward */}
                  <div className="flex-1 flex justify-end">
                    <div
                      className="h-1.5 rounded-l-full transition-all duration-500"
                      style={{
                        width: `${wPct}%`,
                        background: `${color}50`,
                        minWidth: wCount > 0 ? 2 : 0,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-semibold shrink-0 text-center"
                    style={{ color, width: 80 }}
                  >
                    {display}
                  </span>
                  {/* Black bar — grows right */}
                  <div className="flex-1">
                    <div
                      className="h-1.5 rounded-r-full transition-all duration-500"
                      style={{
                        width: `${bPct}%`,
                        background: `${color}50`,
                        minWidth: bCount > 0 ? 2 : 0,
                      }}
                    />
                  </div>
                </div>

                <span className="text-xs font-mono font-bold w-5 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  {bCount || ''}
                </span>
              </div>
            )
          })}
        </div>

        <div
          className="flex items-center gap-2 mt-3 pt-2"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <span className="text-[9px] w-5 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>W</span>
          <div className="flex-1 text-center">
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
              ♙ {playerNames.white} · {playerNames.black} ♟
            </span>
          </div>
          <span className="text-[9px] w-5 shrink-0" style={{ color: 'var(--text-muted)' }}>B</span>
        </div>
      </div>
    </div>
  )
}
