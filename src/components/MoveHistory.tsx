import { useEffect, useRef } from 'react'
import type { MoveRecord } from '../types'

interface Props {
  moves: MoveRecord[]
  currentIndex: number
  onJump: (index: number) => void
}

function countClassification(moves: MoveRecord[], label: string) {
  return moves.filter(m => m.classification?.label === label).length
}

const QUALITY_SUMMARY = [
  { label: 'brilliant', emoji: '✨', colorVar: '#22d3ee', title: 'Brilliant' },
  { label: 'blunder',   emoji: '??', colorVar: '#f87171', title: 'Blunders' },
  { label: 'mistake',   emoji: '?',  colorVar: '#fb923c', title: 'Mistakes' },
  { label: 'inaccuracy',emoji: '?!', colorVar: '#fbbf24', title: 'Inaccuracies' },
]

const BAD_LABELS = new Set(['blunder', 'mistake', 'inaccuracy'])

function BlunderNav({ moves, currentIndex, onJump }: Props) {
  const badIndices = moves
    .map((m, i) => (m.classification && BAD_LABELS.has(m.classification.label) ? i : -1))
    .filter(i => i >= 0)

  if (badIndices.length === 0) return null

  const prevBad = [...badIndices].reverse().find(i => i < currentIndex)
  const nextBad = badIndices.find(i => i > currentIndex)

  const btnBase: React.CSSProperties = {
    background: 'var(--bg-overlay)',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-secondary)',
    borderRadius: '6px',
    fontSize: '10px',
    padding: '2px 8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }

  return (
    <div className="ml-auto flex items-center gap-1">
      <button
        onClick={() => prevBad !== undefined && onJump(prevBad)}
        disabled={prevBad === undefined}
        style={{ ...btnBase, opacity: prevBad === undefined ? 0.3 : 1 }}
        title="Previous mistake"
      >‹ blunder</button>
      <button
        onClick={() => nextBad !== undefined && onJump(nextBad)}
        disabled={nextBad === undefined}
        style={{ ...btnBase, opacity: nextBad === undefined ? 0.3 : 1 }}
        title="Next mistake"
      >blunder ›</button>
    </div>
  )
}

export default function MoveHistory({ moves, currentIndex, onJump }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  const pairs: Array<[MoveRecord | null, MoveRecord | null]> = []
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i] ?? null, moves[i + 1] ?? null])
  }

  const hasClassifications = moves.some(m => m.classification)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Move History
        </span>

        {hasClassifications && (
          <div className="flex items-center gap-2 ml-1">
            {QUALITY_SUMMARY.map(({ label, emoji, colorVar, title }) => {
              const count = countClassification(moves, label)
              if (count === 0) return null
              return (
                <span
                  key={label}
                  className="flex items-center gap-0.5 text-xs font-bold font-mono"
                  style={{ color: colorVar }}
                  title={title}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </span>
              )
            })}
          </div>
        )}

        {hasClassifications && (
          <BlunderNav moves={moves} currentIndex={currentIndex} onJump={onJump} />
        )}
      </div>

      {/* Move list */}
      <div className="flex-1 overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-2xl opacity-30">♟</span>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No moves yet</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <tbody>
              {pairs.map(([white, black], pairIdx) => {
                const wIdx = pairIdx * 2
                const bIdx = pairIdx * 2 + 1
                const isWhiteActive = currentIndex === wIdx
                const isBlackActive = currentIndex === bIdx

                return (
                  <tr
                    key={pairIdx}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td
                      className="w-7 text-center text-[11px] py-1 select-none"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {pairIdx + 1}
                    </td>
                    <td className="w-1/2 py-0.5 pr-0.5">
                      {white && (
                        <button
                          ref={isWhiteActive ? activeRef : undefined}
                          onClick={() => onJump(wIdx)}
                          className="w-full text-left px-2 py-1 rounded-lg text-xs font-mono transition-all duration-150"
                          style={isWhiteActive ? {
                            background: 'var(--accent-indigo)',
                            color: '#fff',
                            boxShadow: '0 0 10px rgba(99,102,241,0.3)',
                          } : {
                            color: 'var(--text-secondary)',
                          }}
                          onMouseEnter={e => {
                            if (!isWhiteActive)
                              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
                          }}
                          onMouseLeave={e => {
                            if (!isWhiteActive)
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                          }}
                        >
                          {white.san}
                          {white.classification && (
                            <span className="ml-1 text-[10px]" style={{ color: white.classification.color }}>
                              {white.classification.emoji}
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="w-1/2 py-0.5 pl-0.5">
                      {black && (
                        <button
                          ref={isBlackActive ? activeRef : undefined}
                          onClick={() => onJump(bIdx)}
                          className="w-full text-left px-2 py-1 rounded-lg text-xs font-mono transition-all duration-150"
                          style={isBlackActive ? {
                            background: 'var(--accent-indigo)',
                            color: '#fff',
                            boxShadow: '0 0 10px rgba(99,102,241,0.3)',
                          } : {
                            color: 'var(--text-secondary)',
                          }}
                          onMouseEnter={e => {
                            if (!isBlackActive)
                              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
                          }}
                          onMouseLeave={e => {
                            if (!isBlackActive)
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                          }}
                        >
                          {black.san}
                          {black.classification && (
                            <span className="ml-1 text-[10px]" style={{ color: black.classification.color }}>
                              {black.classification.emoji}
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
