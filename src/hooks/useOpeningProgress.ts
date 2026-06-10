import { useState, useCallback } from 'react'
import type { OpeningProgress } from '../types/openings'

const STORAGE_KEY = 'chess-opening-progress'

function loadProgress(): Record<string, OpeningProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveProgress(data: Record<string, OpeningProgress>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* storage unavailable */ }
}

export function useOpeningProgress() {
  const [progress, setProgress] = useState<Record<string, OpeningProgress>>(loadProgress)

  const markLearned = useCallback((openingId: string, quizScore: number) => {
    setProgress(prev => {
      const existing = prev[openingId]
      const updated: OpeningProgress = {
        openingId,
        learnedAt: existing?.learnedAt ?? Date.now(),
        quizScore: Math.max(existing?.quizScore ?? 0, quizScore),
        practiceCount: (existing?.practiceCount ?? 0) + 1,
        isFavorite: existing?.isFavorite ?? false,
      }
      const next = { ...prev, [openingId]: updated }
      saveProgress(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((openingId: string) => {
    setProgress(prev => {
      const existing = prev[openingId]
      const updated: OpeningProgress = existing
        ? { ...existing, isFavorite: !existing.isFavorite }
        : { openingId, learnedAt: 0, quizScore: 0, practiceCount: 0, isFavorite: true }
      const next = { ...prev, [openingId]: updated }
      saveProgress(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    setProgress({})
    saveProgress({})
  }, [])

  const getProgress = useCallback((openingId: string): OpeningProgress | undefined => {
    return progress[openingId]
  }, [progress])

  const isLearned = useCallback((openingId: string): boolean => {
    return Boolean(progress[openingId]?.practiceCount)
  }, [progress])

  const isFavorite = useCallback((openingId: string): boolean => {
    return Boolean(progress[openingId]?.isFavorite)
  }, [progress])

  const totalLearned = Object.values(progress).filter(p => p.practiceCount > 0).length
  const totalFavorites = Object.values(progress).filter(p => p.isFavorite).length
  const averageScore = (() => {
    const scores = Object.values(progress).filter(p => p.quizScore > 0).map(p => p.quizScore)
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  })()

  return {
    progress,
    markLearned,
    toggleFavorite,
    resetAll,
    getProgress,
    isLearned,
    isFavorite,
    totalLearned,
    totalFavorites,
    averageScore,
  }
}
