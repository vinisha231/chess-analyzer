import { useState, useCallback } from 'react'
import type { ChessOpening } from '../../types/openings'
import { useOpeningLearner } from '../../hooks/useOpeningLearner'
import { useOpeningProgress } from '../../hooks/useOpeningProgress'
import OpeningCatalog from './OpeningCatalog'
import OpeningLesson from './OpeningLesson'
import OpeningQuiz from './OpeningQuiz'
import OpeningStats from './OpeningStats'
import DailyOpeningBanner from './DailyOpeningBanner'

type View = 'catalog' | 'lesson' | 'quiz' | 'stats'
type PanelTab = 'catalog' | 'stats'

interface Props {
  boardSize?: number
  onLoadPGN?: (pgn: string) => void
}

export default function OpeningsPanel({ boardSize = 320, onLoadPGN }: Props) {
  const [view, setView] = useState<View>('catalog')
  const [activeTab, setActiveTab] = useState<PanelTab>('catalog')
  const [activeOpening, setActiveOpening] = useState<ChessOpening | null>(null)

  const learner = useOpeningLearner()
  const progress = useOpeningProgress()

  const handleLearn = useCallback((opening: ChessOpening) => {
    setActiveOpening(opening)
    learner.startLearn(opening)
    setView('lesson')
  }, [learner])

  const handleQuiz = useCallback((opening: ChessOpening) => {
    setActiveOpening(opening)
    learner.startQuiz(opening)
    setView('quiz')
  }, [learner])

  const handleStartQuiz = useCallback(() => {
    if (activeOpening) {
      learner.startQuiz(activeOpening)
      setView('quiz')
    }
  }, [activeOpening, learner])

  const handleQuizComplete = useCallback((score: number) => {
    if (activeOpening) {
      progress.markLearned(activeOpening.id, score)
    }
    setView('catalog')
    setActiveTab('catalog')
    learner.resetSession()
    setActiveOpening(null)
  }, [activeOpening, progress, learner])

  const handleBack = useCallback(() => {
    setView('catalog')
    learner.resetSession()
    setActiveOpening(null)
  }, [learner])

  if (view === 'lesson' && activeOpening) {
    return (
      <OpeningLesson
        opening={activeOpening}
        learner={learner}
        boardSize={boardSize}
        onStartQuiz={handleStartQuiz}
        onBack={handleBack}
        onLoadIntoMainBoard={onLoadPGN}
      />
    )
  }

  if (view === 'quiz' && activeOpening) {
    return (
      <OpeningQuiz
        opening={activeOpening}
        learner={learner}
        boardSize={boardSize}
        onComplete={handleQuizComplete}
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl shrink-0"
        style={{
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {([
          { id: 'catalog', label: '📚 Openings' },
          { id: 'stats',   label: '📊 My Progress' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={activeTab === tab.id ? {
              background: 'var(--accent-indigo)',
              color: '#fff',
              boxShadow: '0 0 10px rgba(99,102,241,0.3)',
            } : {
              color: 'var(--text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'catalog' && (
        <>
          <DailyOpeningBanner onLearn={handleLearn} />
          <OpeningCatalog
            progress={progress.progress}
            onLearn={handleLearn}
            onQuiz={handleQuiz}
            onToggleFavorite={progress.toggleFavorite}
            isFavorite={progress.isFavorite}
          />
        </>
      )}

      {activeTab === 'stats' && (
        <OpeningStats
          progress={progress.progress}
          totalLearned={progress.totalLearned}
          totalFavorites={progress.totalFavorites}
          averageScore={progress.averageScore}
          onReset={progress.resetAll}
        />
      )}
    </div>
  )
}
