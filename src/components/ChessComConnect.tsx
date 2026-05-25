import { useState } from 'react'
import type { ChessComProfile, ChessComStats } from '../utils/chesscomApi'
import type { ConnectionState } from '../hooks/useChessCom'

interface Props {
  connectionState: ConnectionState
  profile: ChessComProfile | null
  stats: ChessComStats | null
  error: string | null
  onConnect: (username: string) => void
  onDisconnect: () => void
}

function RatingPill({ label, rating, record }: {
  label: string
  rating?: number
  record?: { win: number; loss: number; draw: number }
}) {
  if (!rating) return null
  const total = (record?.win ?? 0) + (record?.loss ?? 0) + (record?.draw ?? 0)
  return (
    <div className="flex flex-col items-center bg-gray-700/60 rounded-lg px-3 py-2 min-w-0">
      <span className="text-xs text-gray-400 mb-0.5">{label}</span>
      <span className="text-lg font-bold text-white leading-none">{rating}</span>
      {record && total > 0 && (
        <span className="text-xs text-gray-500 mt-0.5">
          <span className="text-green-400">{record.win}W</span>
          {' / '}
          <span className="text-red-400">{record.loss}L</span>
          {' / '}
          <span className="text-gray-400">{record.draw}D</span>
        </span>
      )}
    </div>
  )
}

export default function ChessComConnect({ connectionState, profile, stats, error, onConnect, onDisconnect }: Props) {
  const [username, setUsername] = useState('')

  if (connectionState === 'connected' && profile) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {profile.avatar && (
            <img src={profile.avatar} alt={profile.username} className="w-12 h-12 rounded-full border-2 border-gray-600" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {profile.title && (
                <span className="text-xs bg-yellow-600 text-black font-bold px-1.5 py-0.5 rounded">{profile.title}</span>
              )}
              <a
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="text-white font-bold hover:text-blue-400 transition-colors truncate"
              >
                {profile.username}
              </a>
            </div>
            {profile.name && <p className="text-xs text-gray-400 truncate">{profile.name}</p>}
            <p className="text-xs text-gray-500">{profile.followers.toLocaleString()} followers</p>
          </div>
          <button
            onClick={onDisconnect}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors shrink-0"
          >
            Disconnect
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <RatingPill label="Rapid" rating={stats?.chess_rapid?.last.rating} record={stats?.chess_rapid?.record} />
          <RatingPill label="Blitz" rating={stats?.chess_blitz?.last.rating} record={stats?.chess_blitz?.record} />
          <RatingPill label="Bullet" rating={stats?.chess_bullet?.last.rating} record={stats?.chess_bullet?.record} />
          <RatingPill label="Daily" rating={stats?.chess_daily?.last.rating} record={stats?.chess_daily?.record} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400">
        Enter your chess.com username to load your games. No login required — uses the public API.
      </p>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm placeholder-gray-600"
          placeholder="chess.com username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && username.trim() && onConnect(username.trim())}
          disabled={connectionState === 'loading'}
        />
        <button
          onClick={() => username.trim() && onConnect(username.trim())}
          disabled={!username.trim() || connectionState === 'loading'}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          {connectionState === 'loading' ? '…' : 'Connect'}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
