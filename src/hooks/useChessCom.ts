import { useState, useCallback, useEffect } from 'react'
import {
  fetchProfile, fetchStats, fetchGames,
  type ChessComProfile, type ChessComStats, type ChessComGame,
} from '../utils/chesscomApi'

export type ConnectionState = 'idle' | 'loading' | 'connected' | 'error'

export interface ChessComState {
  connectionState: ConnectionState
  error: string | null
  profile: ChessComProfile | null
  stats: ChessComStats | null
  games: ChessComGame[]
  gamesLoading: boolean
  selectedYear: number
  selectedMonth: number
}

const now = new Date()

export function useChessCom() {
  const [state, setState] = useState<ChessComState>({
    connectionState: 'idle',
    error: null,
    profile: null,
    stats: null,
    games: [],
    gamesLoading: false,
    selectedYear: now.getFullYear(),
    selectedMonth: now.getMonth() + 1,
  })

  // Auto-reconnect if username was saved from last session
  useEffect(() => {
    const saved = localStorage.getItem('chesscom-username')
    if (saved) connect(saved)
  }, [])

  const connect = useCallback(async (username: string) => {
    setState(prev => ({ ...prev, connectionState: 'loading', error: null }))
    try {
      const [profile, stats] = await Promise.all([
        fetchProfile(username),
        fetchStats(username),
      ])
      localStorage.setItem('chesscom-username', username.toLowerCase())
      setState(prev => ({
        ...prev,
        connectionState: 'connected',
        profile,
        stats,
        error: null,
      }))
      return true
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      const friendly = msg.includes('404')
        ? `Player "${username}" not found on chess.com`
        : 'Could not connect to chess.com. Check your username and try again.'
      setState(prev => ({ ...prev, connectionState: 'error', error: friendly }))
      return false
    }
  }, [])

  const loadGames = useCallback(async (username: string, year: number, month: number) => {
    setState(prev => ({ ...prev, gamesLoading: true, games: [], selectedYear: year, selectedMonth: month }))
    try {
      const games = await fetchGames(username, year, month)
      // Most recent first
      games.sort((a, b) => b.end_time - a.end_time)
      setState(prev => ({ ...prev, games, gamesLoading: false }))
    } catch {
      setState(prev => ({ ...prev, games: [], gamesLoading: false }))
    }
  }, [])

  const disconnect = useCallback(() => {
    localStorage.removeItem('chesscom-username')
    setState({
      connectionState: 'idle',
      error: null,
      profile: null,
      stats: null,
      games: [],
      gamesLoading: false,
      selectedYear: now.getFullYear(),
      selectedMonth: now.getMonth() + 1,
    })
  }, [])

  return { ...state, connect, loadGames, disconnect }
}
