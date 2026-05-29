import { useState, useMemo } from 'react'
import type { ChessOpening, OpeningCategory, OpeningDifficulty } from '../../types/openings'
import type { OpeningProgress } from '../../types/openings'
import { ALL_OPENINGS, CATEGORY_LABELS, CATEGORY_ICONS, DIFFICULTY_LABELS, getDailyOpening } from '../../data/openings'
import OpeningCard from './OpeningCard'

interface Props {
  progress: Record<string, OpeningProgress>
  onLearn: (opening: ChessOpening) => void
  onQuiz: (opening: ChessOpening) => void
  onToggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

type SortMode = 'default' | 'difficulty' | 'progress' | 'name'

export default function OpeningCatalog({ progress, onLearn, onQuiz, onToggleFavorite, isFavorite }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<OpeningCategory | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<OpeningDifficulty | 'all'>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const daily = getDailyOpening()

  const categories: Array<{ value: OpeningCategory | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'All', icon: '📚' },
    ...(['open', 'semi-open', 'closed', 'semi-closed', 'flank'] as OpeningCategory[]).map(c => ({
      value: c,
      label: CATEGORY_LABELS[c].split(' (')[0], // Shorten label
      icon: CATEGORY_ICONS[c],
    })),
  ]

  const filtered = useMemo(() => {
    let list = [...ALL_OPENINGS]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.eco.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags?.some(t => t.includes(q))
      )
    }

    if (categoryFilter !== 'all') {
      list = list.filter(o => o.category === categoryFilter)
    }

    if (difficultyFilter !== 'all') {
      list = list.filter(o => o.difficulty === difficultyFilter)
    }

    if (showFavoritesOnly) {
      list = list.filter(o => isFavorite(o.id))
    }

    if (sortMode === 'difficulty') {
      const order = { beginner: 0, intermediate: 1, advanced: 2 }
      list.sort((a, b) => order[a.difficulty] - order[b.difficulty])
    } else if (sortMode === 'progress') {
      list.sort((a, b) => (progress[b.id]?.quizScore ?? -1) - (progress[a.id]?.quizScore ?? -1))
    } else if (sortMode === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [searchQuery, categoryFilter, difficultyFilter, showFavoritesOnly, sortMode, progress, isFavorite])

  const totalLearned = Object.values(progress).filter(p => p.practiceCount > 0).length

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Stats row */}
      <div className="flex items-center gap-3 px-1 shrink-0">
        <div className="flex-1">
          <span className="text-xs text-gray-500">
            <span className="text-white font-bold">{totalLearned}</span>
            <span> / {ALL_OPENINGS.length} openings studied</span>
          </span>
          <div className="h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(totalLearned / ALL_OPENINGS.length) * 100}%` }}
            />
          </div>
        </div>
        <div
          className="bg-yellow-900/30 border border-yellow-800/50 rounded-lg px-2 py-1 cursor-pointer hover:bg-yellow-900/50 transition-colors"
          onClick={() => onLearn(daily)}
          title="Opening of the day"
        >
          <p className="text-[10px] text-yellow-400">⭐ Daily</p>
          <p className="text-xs text-yellow-300 font-medium truncate max-w-24">{daily.name}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <input
          type="text"
          placeholder="Search openings by name, ECO, or keyword…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 pr-7"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-base leading-none"
          >×</button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap shrink-0">
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium transition-colors ${
              categoryFilter === c.value
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Difficulty + Sort row */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <div className="flex gap-1">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors capitalize ${
                difficultyFilter === d
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {d === 'all' ? 'All levels' : DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFavoritesOnly(f => !f)}
          className={`ml-auto px-2 py-0.5 rounded text-xs transition-colors ${
            showFavoritesOnly ? 'text-yellow-400 bg-yellow-900/30' : 'text-gray-500 hover:text-yellow-400'
          }`}
        >
          {showFavoritesOnly ? '★ Favorites' : '☆ Favorites'}
        </button>
        <select
          value={sortMode}
          onChange={e => setSortMode(e.target.value as SortMode)}
          className="bg-gray-800 border border-gray-700 rounded text-xs text-gray-400 px-1.5 py-0.5 focus:outline-none"
        >
          <option value="default">Default</option>
          <option value="difficulty">By difficulty</option>
          <option value="progress">By score</option>
          <option value="name">By name</option>
        </select>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-6">No openings match your filters</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 pb-2">
            <p className="text-xs text-gray-600">{filtered.length} opening{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map(opening => (
              <OpeningCard
                key={opening.id}
                opening={opening}
                progress={progress[opening.id]}
                isFavorite={isFavorite(opening.id)}
                onLearn={onLearn}
                onQuiz={onQuiz}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
