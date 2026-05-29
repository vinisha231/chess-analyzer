import { useState, useCallback } from 'react'
import type { ChessOpening } from '../../types/openings'
import { useOpeningLearner } from '../../hooks/useOpeningLearner'
import { useOpeningProgress } from '../../hooks/useOpeningProgress'
import OpeningCatalog from './OpeningCatalog'
import OpeningLesson from './OpeningLesson'
import OpeningQuiz from './OpeningQuiz'
import OpeningStats from './OpeningStats'

type View = 'catalog' | 'lesson' | 'quiz' | 'stats'
type PanelTab = 'catalog' | 'stats'

interface Props {
  boardSize?: number
}

export default function OpeningsPanel({ boardSize = 320 }: Props) {
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

  // Show lesson/quiz view
  if (view === 'lesson' && activeOpening) {
    return (
      <OpeningLesson
        opening={activeOpening}
        learner={learner}
        boardSize={boardSize}
        onStartQuiz={handleStartQuiz}
        onBack={handleBack}
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

  // Catalog/Stats tabs
  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-900/60 rounded-lg p-1 shrink-0">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'catalog' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          📚 Openings
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'stats' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          📊 My Progress
        </button>
      </div>

      {activeTab === 'catalog' && (
        <OpeningCatalog
          progress={progress.progress}
          onLearn={handleLearn}
          onQuiz={handleQuiz}
          onToggleFavorite={progress.toggleFavorite}
          isFavorite={progress.isFavorite}
        />
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
