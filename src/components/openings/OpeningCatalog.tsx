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
      label: CATEGORY_LABELS[c].split(' (')[0],
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

    if (categoryFilter !== 'all') list = list.filter(o => o.category === categoryFilter)
    if (difficultyFilter !== 'all') list = list.filter(o => o.difficulty === difficultyFilter)
    if (showFavoritesOnly) list = list.filter(o => isFavorite(o.id))

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
    <div className="flex flex-col gap-2.5 h-full min-h-0">
      {/* Progress mini bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{totalLearned}</span>
              {' / '}{ALL_OPENINGS.length} studied
            </span>
            <span style={{ color: 'var(--accent-indigo)' }}>
              {Math.round((totalLearned / ALL_OPENINGS.length) * 100)}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(totalLearned / ALL_OPENINGS.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))',
              }}
            />
          </div>
        </div>
        <button
          onClick={() => onLearn(daily)}
          title="Opening of the day"
          className="shrink-0 px-2 py-1 rounded-lg transition-all"
          style={{
            background: 'rgba(245,158,11,0.10)',
            border: '1px solid rgba(245,158,11,0.20)',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.18)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.10)'}
        >
          <p className="text-[9px] font-bold" style={{ color: 'var(--accent-gold)' }}>⭐ Daily</p>
          <p className="text-[10px] font-medium truncate max-w-24" style={{ color: 'var(--accent-gold)' }}>
            {daily.name}
          </p>
        </button>
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <input
          type="text"
          placeholder="Search by name, ECO, or keyword…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-muted)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-accent)'}
          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-muted)'}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base leading-none transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
          >×</button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1 flex-wrap shrink-0">
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
            style={categoryFilter === c.value ? {
              background: 'var(--accent-indigo)',
              color: '#fff',
              boxShadow: '0 0 8px rgba(99,102,241,0.3)',
            } : {
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
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
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all capitalize"
              style={difficultyFilter === d ? {
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-accent)',
                color: 'var(--text-primary)',
              } : {
                color: 'var(--text-muted)',
              }}
            >
              {d === 'all' ? 'All levels' : DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFavoritesOnly(f => !f)}
          className="ml-auto px-2 py-0.5 rounded-lg text-[11px] transition-all"
          style={showFavoritesOnly ? {
            color: 'var(--accent-gold)',
            background: 'rgba(245,158,11,0.10)',
            border: '1px solid rgba(245,158,11,0.20)',
          } : {
            color: 'var(--text-muted)',
          }}
        >
          {showFavoritesOnly ? '★ Favorites' : '☆ Favorites'}
        </button>
        <select
          value={sortMode}
          onChange={e => setSortMode(e.target.value as SortMode)}
          className="rounded-lg text-[11px] px-2 py-0.5 outline-none cursor-pointer"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-muted)',
            color: 'var(--text-secondary)',
          }}
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
          <div className="flex flex-col items-center py-8 gap-2">
            <span className="text-2xl opacity-20">🔍</span>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No openings match your filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-2">
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} opening{filtered.length !== 1 ? 's' : ''}
            </p>
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
