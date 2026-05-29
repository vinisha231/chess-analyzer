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

  // Best and worst openings
  const studied = Object.values(progress).filter(p => p.practiceCount > 0)
  const bestScore = studied.reduce((best, p) => p.quizScore > (best?.quizScore ?? 0) ? p : best, null as OpeningProgress | null)
  const worstScore = studied.reduce((worst, p) => p.quizScore < (worst?.quizScore ?? 100) ? p : worst, null as OpeningProgress | null)

  const getOpeningName = (id: string) => ALL_OPENINGS.find(o => o.id === id)?.name ?? id

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {/* Overview */}
      <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-bold text-white mb-3">Your Progress</h3>
        <div className="flex gap-4 mb-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-white">{totalLearned}</p>
            <p className="text-xs text-gray-500">Studied</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-yellow-400">{totalFavorites}</p>
            <p className="text-xs text-gray-500">Favorites</p>
          </div>
          <div className="flex-1 text-center">
            <p className={`text-2xl font-bold ${averageScore >= 80 ? 'text-green-400' : averageScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {averageScore.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">Avg score</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Overall completion</span>
            <span>{totalLearned}/{total} openings</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
              style={{ width: `${completePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-bold text-white mb-3">By Category</h3>
        <div className="flex flex-col gap-2">
          {categoryStats.map(({ cat, catOpenings, catLearned, catAvgScore }) => (
            <div key={cat}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-gray-300 flex items-center gap-1">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{CATEGORY_LABELS[cat].split(' (')[0]}</span>
                </span>
                <span className="text-gray-500">{catLearned}/{catOpenings.length}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${catOpenings.length > 0 ? (catLearned / catOpenings.length) * 100 : 0}%` }}
                />
              </div>
              {catAvgScore > 0 && (
                <p className="text-[10px] text-gray-600 text-right">avg {catAvgScore.toFixed(0)}%</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Best/Worst */}
      {studied.length > 0 && (
        <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-bold text-white mb-3">Highlights</h3>
          {bestScore && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">🏆 Best</span>
              <span className="text-xs text-green-400 font-medium">{getOpeningName(bestScore.openingId)} ({bestScore.quizScore.toFixed(0)}%)</span>
            </div>
          )}
          {worstScore && worstScore !== bestScore && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">📖 Needs work</span>
              <span className="text-xs text-red-400 font-medium">{getOpeningName(worstScore.openingId)} ({worstScore.quizScore.toFixed(0)}%)</span>
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
          className="text-xs text-gray-600 hover:text-red-400 transition-colors text-center py-1"
        >
          Reset all progress
        </button>
      )}
    </div>
  )
}
