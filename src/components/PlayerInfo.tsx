import CapturedPieces from './CapturedPieces'
import type { CapturedPieces as CapturedPiecesType } from '../types'

interface Props {
  name: string
  color: 'w' | 'b'
  isActive: boolean
  capturedPieces: CapturedPiecesType
  advantage: number
  timeDisplay?: string
  timeLow?: boolean
}

export default function PlayerInfo({ name, color, isActive, capturedPieces, advantage, timeDisplay, timeLow }: Props) {
  const captured = color === 'w' ? capturedPieces.b : capturedPieces.w

  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300"
      style={isActive ? {
        background: 'var(--bg-elevated)',
        border: '1px solid rgba(99,102,241,0.30)',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.10), 0 2px 12px rgba(0,0,0,0.30)',
      } : {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Color indicator with glow when active */}
        <div className="relative shrink-0">
          <div
            className="w-6 h-6 rounded-full transition-all"
            style={color === 'w'
              ? { background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', border: '2px solid rgba(255,255,255,0.6)', boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.25)' : 'none' }
              : { background: 'linear-gradient(135deg, #1e2030, #0f1117)', border: '2px solid rgba(255,255,255,0.15)', boxShadow: isActive ? '0 0 10px rgba(99,102,241,0.3)' : 'none' }
            }
          />
          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-indigo-400 rounded-full border border-[var(--bg-elevated)] animate-pulse" />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold leading-tight transition-colors"
            style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {name}
          </p>
          <CapturedPieces pieces={captured} color={color} advantage={advantage} />
        </div>
      </div>

      {timeDisplay && (
        <div
          className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg transition-all"
          style={timeLow
            ? { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', animation: 'pulse 1s infinite' }
            : isActive
            ? { background: 'var(--bg-overlay)', color: 'var(--text-primary)', border: '1px solid var(--border-muted)' }
            : { color: 'var(--text-muted)' }
          }
        >
          {timeDisplay}
        </div>
      )}
    </div>
  )
}
