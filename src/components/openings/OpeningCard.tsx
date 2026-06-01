import type { ChessOpening } from '../../types/openings'
import type { OpeningProgress } from '../../types/openings'
import DifficultyBadge from './DifficultyBadge'
import { CATEGORY_ICONS } from '../../data/openings'

interface Props {
  opening: ChessOpening
  progress?: OpeningProgress
  isFavorite?: boolean
  onLearn: (opening: ChessOpening) => void
  onQuiz: (opening: ChessOpening) => void
  onToggleFavorite: (id: string) => void
}

export default function OpeningCard({ opening, progress, isFavorite, onLearn, onQuiz, onToggleFavorite }: Props) {
  const hasProgress = Boolean(progress?.practiceCount)
  const quizScore = progress?.quizScore ?? 0
  const practiceCount = progress?.practiceCount ?? 0

  const scoreColor = quizScore >= 80 ? '#4ade80' : quizScore >= 50 ? '#fbbf24' : '#f87171'
  const scoreBg = quizScore >= 80
    ? 'rgba(34,197,94,0.08)'
    : quizScore >= 50
    ? 'rgba(245,158,11,0.08)'
    : 'rgba(239,68,68,0.08)'

  return (
    <div
      className="flex flex-col gap-2.5 p-3 rounded-xl transition-all duration-200 group"
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${hasProgress ? 'var(--border-muted)' : 'var(--border-subtle)'}`,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-accent)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = hasProgress ? 'var(--border-muted)' : 'var(--border-subtle)'}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm" title={opening.category}>{CATEGORY_ICONS[opening.category]}</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
              {opening.eco}
            </span>
          </div>
          <h3 className="text-sm font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {opening.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(opening.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="text-base transition-all"
            style={{ color: isFavorite ? 'var(--accent-gold)' : 'var(--text-muted)' }}
            onMouseEnter={e => {
              if (!isFavorite)
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-gold)'
            }}
            onMouseLeave={e => {
              if (!isFavorite)
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            }}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <DifficultyBadge difficulty={opening.difficulty} />
        </div>
      </div>

      {/* Description */}
      <p
        className="text-[11px] leading-relaxed line-clamp-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        {opening.description}
      </p>

      {/* Meta */}
      <div
        className="flex items-center gap-1.5 text-[10px]"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>{opening.moves.length} moves</span>
        {opening.variations && opening.variations.length > 0 && (
          <>
            <span style={{ color: 'var(--border-muted)' }}>·</span>
            <span>{opening.variations.length} variation{opening.variations.length !== 1 ? 's' : ''}</span>
          </>
        )}
        {opening.famousPlayers && opening.famousPlayers.length > 0 && (
          <>
            <span style={{ color: 'var(--border-muted)' }}>·</span>
            <span className="truncate italic">{opening.famousPlayers.slice(0, 2).join(', ')}</span>
          </>
        )}
      </div>

      {/* Progress */}
      {hasProgress && (
        <div
          className="rounded-lg px-2.5 py-2"
          style={{ background: scoreBg, border: `1px solid ${scoreColor}33` }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Quiz score</span>
            <span className="text-xs font-mono font-bold" style={{ color: scoreColor }}>
              {quizScore.toFixed(0)}%
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${quizScore}%`, background: scoreColor }}
            />
          </div>
          <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Practiced {practiceCount}×
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 mt-auto">
        <button
          onClick={() => onLearn(opening)}
          className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
            color: '#fff',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--glow-indigo)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'}
        >
          {hasProgress ? '📖 Review' : '📖 Learn'}
        </button>
        <button
          onClick={() => onQuiz(opening)}
          className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-muted)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.4)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-muted)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
          }}
        >
          🧠 Quiz
        </button>
      </div>
    </div>
  )
}
