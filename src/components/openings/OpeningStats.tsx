import type { OpeningProgress } from '../../types/openings'
import { ALL_OPENINGS, CATEGORY_LABELS, CATEGORY_ICONS } from '../../data/openings'
import type { OpeningCategory } from '../../types/openings'

interface Props {
  progress: Record<string, OpeningProgress>
  totalLearned: number
  totalFavorites: number
  averageScore: number
  onReset: () => void
}

function StatCard({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div
      className="flex-1 flex flex-col items-center py-3 rounded-xl"
      style={{
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <p className="text-2xl font-bold leading-none mb-1" style={{ color: color ?? 'var(--text-primary)' }}>
        {value}
      </p>
      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

export default function OpeningStats({ progress, totalLearned, totalFavorites, averageScore, onReset }: Props) {
  const total = ALL_OPENINGS.length
  const completePct = total > 0 ? (totalLearned / total) * 100 : 0

  const categories: OpeningCategory[] = ['open', 'semi-open', 'closed', 'semi-closed', 'flank']
  const categoryStats = categories.map(cat => {
    const catOpenings = ALL_OPENINGS.filter(o => o.category === cat)
    const catLearned = catOpenings.filter(o => progress[o.id]?.practiceCount > 0).length
    const catAvgScore = (() => {
      const scores = catOpenings
        .map(o => progress[o.id]?.quizScore ?? 0)
        .filter(s => s > 0)
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })()
    return { cat, catOpenings, catLearned, catAvgScore }
  })

  const studied = Object.values(progress).filter(p => p.practiceCount > 0)
  const bestScore = studied.reduce((best, p) => p.quizScore > (best?.quizScore ?? 0) ? p : best, null as OpeningProgress | null)
  const worstScore = studied.reduce((worst, p) => p.quizScore < (worst?.quizScore ?? 100) ? p : worst, null as OpeningProgress | null)

  const getOpeningName = (id: string) => ALL_OPENINGS.find(o => o.id === id)?.name ?? id

  const scoreColor = averageScore >= 80 ? '#4ade80' : averageScore >= 50 ? '#fbbf24' : '#f87171'

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      {/* Overview */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p
          className="text-[9px] uppercase tracking-widest font-bold mb-3"
          style={{ color: 'var(--accent-indigo)' }}
        >
          Your Progress
        </p>
        <div className="flex gap-2 mb-4">
          <StatCard value={String(totalLearned)} label="Studied" color="var(--text-primary)" />
          <StatCard value={String(totalFavorites)} label="Favorites" color="var(--accent-gold)" />
          <StatCard value={`${averageScore.toFixed(0)}%`} label="Avg score" color={scoreColor} />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>Overall completion</span>
            <span style={{ color: 'var(--accent-indigo)' }}>{totalLearned}/{total} openings</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completePct}%`,
                background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p
          className="text-[9px] uppercase tracking-widest font-bold mb-3"
          style={{ color: 'var(--accent-indigo)' }}
        >
          By Category
        </p>
        <div className="flex flex-col gap-3">
          {categoryStats.map(({ cat, catOpenings, catLearned, catAvgScore }) => {
            const pct = catOpenings.length > 0 ? (catLearned / catOpenings.length) * 100 : 0
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span>{CATEGORY_ICONS[cat]}</span>
                    <span>{CATEGORY_LABELS[cat].split(' (')[0]}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {catAvgScore > 0 && (
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        avg {catAvgScore.toFixed(0)}%
                      </span>
                    )}
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {catLearned}/{catOpenings.length}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      {studied.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            className="text-[9px] uppercase tracking-widest font-bold mb-3"
            style={{ color: 'var(--accent-indigo)' }}
          >
            Highlights
          </p>
          {bestScore && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                🏆 <span>Best</span>
              </span>
              <span className="text-xs font-medium truncate ml-2" style={{ color: '#4ade80' }}>
                {getOpeningName(bestScore.openingId)} ({bestScore.quizScore.toFixed(0)}%)
              </span>
            </div>
          )}
          {worstScore && worstScore !== bestScore && (
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                📖 <span>Needs work</span>
              </span>
              <span className="text-xs font-medium truncate ml-2" style={{ color: '#f87171' }}>
                {getOpeningName(worstScore.openingId)} ({worstScore.quizScore.toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reset */}
      {studied.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm('Reset all opening progress? This cannot be undone.')) onReset()
          }}
          className="text-xs text-center py-2 transition-all rounded-lg"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.05)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          Reset all progress
        </button>
      )}
    </div>
  )
}
