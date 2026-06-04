import type { MoveRecord } from '../types'

interface Props {
  moves: MoveRecord[]
  currentIndex: number
  onJump: (index: number) => void
}

const W = 320
const H = 64
const CLAMP = 500 // centipawns (±5 pawns)

function evalToY(ev: number): number {
  const clamped = Math.max(-CLAMP, Math.min(CLAMP, ev))
  return H / 2 - (clamped / CLAMP) * (H / 2 - 4)
}

/** Build a smooth SVG cubic-bezier path through points */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpx = (prev.x + curr.x) / 2
    d += ` C${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`
  }
  return d
}

export default function EvalChart({ moves, currentIndex, onJump }: Props) {
  const evalsRaw = moves.map(m => m.evalAfter ?? null)
  const hasData = evalsRaw.filter(e => e !== null).length >= 2
  if (!hasData) return null

  // Fill gaps with last known value so the line is continuous
  let last = 0
  const evals = evalsRaw.map(e => {
    if (e !== null) { last = e; return e }
    return last
  })

  const n = evals.length
  const pts = evals.map((ev, i) => ({
    x: n <= 1 ? W / 2 : (i / (n - 1)) * W,
    y: evalToY(ev),
  }))

  const mid = H / 2
  const linePath = smoothPath(pts)

  // White-advantage fill (above midline)
  const whiteFill =
    `M${pts[0].x.toFixed(1)},${mid} ` +
    linePath.slice(linePath.indexOf(' ') + 1) +
    ` L${pts[n - 1].x.toFixed(1)},${mid} Z`

  // Current-move x position
  const curX = currentIndex >= 0 && currentIndex < pts.length
    ? pts[currentIndex].x
    : null

  const curEval = curX !== null && currentIndex < evals.length ? evals[currentIndex] : null
  const curLabel = curEval !== null
    ? curEval > 0 ? `+${(curEval / 100).toFixed(1)}` : (curEval / 100).toFixed(1)
    : null

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
          Eval graph
        </span>
        {curLabel && (
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: Number(curLabel) > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            {curLabel}
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        style={{ display: 'block', cursor: 'crosshair' }}
        onClick={e => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const relX = (e.clientX - rect.left) / rect.width
          const idx = Math.round(relX * (n - 1))
          onJump(Math.max(0, Math.min(n - 1, idx)))
        }}
      >
        {/* Background: black advantage (bottom half default fill) */}
        <rect x={0} y={0} width={W} height={H} fill="#0f1117" />

        {/* White advantage fill */}
        <path d={whiteFill} fill="rgba(248,250,252,0.12)" />

        {/* Slight gradient overlay for depth */}
        <defs>
          <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.18)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
        </defs>
        <path d={whiteFill} fill="url(#evalGrad)" />

        {/* Zero line */}
        <line
          x1={0} y1={mid} x2={W} y2={mid}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />

        {/* Eval curve */}
        <path
          d={linePath}
          fill="none"
          stroke="rgba(148,163,184,0.7)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Current move indicator */}
        {curX !== null && (
          <>
            <line
              x1={curX} y1={0} x2={curX} y2={H}
              stroke="var(--accent-indigo)"
              strokeWidth={1.5}
              strokeDasharray="3,2"
              opacity={0.8}
            />
            {currentIndex < pts.length && (
              <circle
                cx={pts[currentIndex].x}
                cy={pts[currentIndex].y}
                r={3}
                fill="var(--accent-indigo)"
                stroke="#fff"
                strokeWidth={1}
              />
            )}
          </>
        )}

        {/* Move markers every 10 moves (subtle ticks) */}
        {evals.map((_, i) => {
          if (i === 0 || i % 10 !== 0) return null
          const x = pts[i].x
          return (
            <line
              key={i}
              x1={x} y1={H - 4} x2={x} y2={H}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
            />
          )
        })}
      </svg>

      {/* Move count footer */}
      <div
        className="flex items-center justify-between px-3 py-1"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>1</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
          {Math.floor(n / 2) + 1} moves · click to jump
        </span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{Math.floor(n / 2) + 1}</span>
      </div>
    </div>
  )
}
