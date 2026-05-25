const BASE = 'https://api.chess.com/pub'
const HEADERS = { 'User-Agent': 'chess-analyzer-app' }

export interface ChessComProfile {
  username: string
  name?: string
  avatar?: string
  title?: string
  followers: number
  joined: number
  status: string
  url: string
}

export interface ChessComRating {
  last: { rating: number; date: number }
  best?: { rating: number; date: number }
  record: { win: number; loss: number; draw: number }
}

export interface ChessComStats {
  chess_rapid?: ChessComRating
  chess_blitz?: ChessComRating
  chess_bullet?: ChessComRating
  chess_daily?: ChessComRating
}

export interface ChessComGamePlayer {
  username: string
  rating: number
  result: string
}

export interface ChessComGame {
  url: string
  pgn: string
  time_control: string
  time_class: 'bullet' | 'blitz' | 'rapid' | 'daily'
  end_time: number
  rated: boolean
  rules: string
  white: ChessComGamePlayer
  black: ChessComGamePlayer
  accuracies?: { white: number; black: number }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`chess.com API ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export async function fetchProfile(username: string): Promise<ChessComProfile> {
  return get<ChessComProfile>(`/player/${encodeURIComponent(username.toLowerCase())}`)
}

export async function fetchStats(username: string): Promise<ChessComStats> {
  return get<ChessComStats>(`/player/${encodeURIComponent(username.toLowerCase())}/stats`)
}

export async function fetchGames(username: string, year: number, month: number): Promise<ChessComGame[]> {
  const mm = String(month).padStart(2, '0')
  const data = await get<{ games: ChessComGame[] }>(
    `/player/${encodeURIComponent(username.toLowerCase())}/games/${year}/${mm}`
  )
  // Only standard chess, with PGN
  return (data.games ?? []).filter(g => g.rules === 'chess' && g.pgn)
}

export function getResultForPlayer(game: ChessComGame, username: string): 'win' | 'loss' | 'draw' {
  const lc = username.toLowerCase()
  const side = game.white.username.toLowerCase() === lc ? game.white : game.black
  if (side.result === 'win') return 'win'
  if (['checkmated', 'resigned', 'timeout', 'abandoned', 'lose', 'threecheck'].includes(side.result)) return 'loss'
  return 'draw'
}

export function formatTimeControl(tc: string): string {
  const parts = tc.split('+')
  const base = parseInt(parts[0])
  const inc = parts[1] ? parseInt(parts[1]) : 0
  if (base >= 1800) return `${base / 60}m`
  const mins = Math.floor(base / 60)
  const secs = base % 60
  const label = secs ? `${mins}:${String(secs).padStart(2, '0')}` : `${mins}m`
  return inc ? `${label}+${inc}` : label
}

export function getOpeningFromPGN(pgn: string): string {
  const match = pgn.match(/\[ECOUrl "[^"]*\/([^"]+)"\]/)
  if (!match) return ''
  return match[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
