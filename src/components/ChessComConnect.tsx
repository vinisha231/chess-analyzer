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
    <div
      className="flex flex-col items-center rounded-xl px-3 py-2 min-w-0 flex-1"
      style={{
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-muted)',
      }}
    >
      <span className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
        {rating}
      </span>
      {record && total > 0 && (
        <div className="flex gap-1 mt-1 text-[10px] font-mono">
          <span style={{ color: '#4ade80' }}>{record.win}W</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: '#f87171' }}>{record.loss}L</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{record.draw}D</span>
        </div>
      )}
    </div>
  )
}

export default function ChessComConnect({ connectionState, profile, stats, error, onConnect, onDisconnect }: Props) {
  const [username, setUsername] = useState('')

  if (connectionState === 'connected' && profile) {
    return (
      <div className="flex flex-col gap-3">
        {/* Profile row */}
        <div
          className="flex items-center gap-3 rounded-xl p-3"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-muted)',
          }}
        >
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-11 h-11 rounded-full shrink-0"
              style={{ border: '2px solid var(--border-accent)' }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {profile.title && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--accent-gold)', color: '#000' }}
                >
                  {profile.title}
                </span>
              )}
              <a
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-sm transition-colors truncate"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-indigo)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'}
              >
                {profile.username}
              </a>
            </div>
            {profile.name && (
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{profile.name}</p>
            )}
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {profile.followers.toLocaleString()} followers
            </p>
          </div>
          <button
            onClick={onDisconnect}
            className="text-xs shrink-0 px-2 py-1 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'
            }}
          >
            Disconnect
          </button>
        </div>

        {/* Rating pills */}
        <div className="flex gap-2">
          <RatingPill label="Rapid"  rating={stats?.chess_rapid?.last.rating}  record={stats?.chess_rapid?.record} />
          <RatingPill label="Blitz"  rating={stats?.chess_blitz?.last.rating}  record={stats?.chess_blitz?.record} />
          <RatingPill label="Bullet" rating={stats?.chess_bullet?.last.rating} record={stats?.chess_bullet?.record} />
          <RatingPill label="Daily"  rating={stats?.chess_daily?.last.rating}  record={stats?.chess_daily?.record} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Enter your chess.com{' '}
        <strong style={{ color: 'var(--text-primary)' }}>username</strong>
        {' '}— the one in your profile URL:{' '}
        <span className="font-mono text-[10px]" style={{ color: 'var(--accent-indigo)' }}>
          chess.com/member/<em>username</em>
        </span>
      </p>
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-muted)',
            color: 'var(--text-primary)',
          }}
          placeholder="e.g. hikaru"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && username.trim() && onConnect(username.trim())}
          disabled={connectionState === 'loading'}
          onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-accent)'}
          onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-muted)'}
        />
        <button
          onClick={() => username.trim() && onConnect(username.trim())}
          disabled={!username.trim() || connectionState === 'loading'}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            boxShadow: '0 0 12px rgba(34,197,94,0.25)',
          }}
        >
          {connectionState === 'loading' ? '…' : 'Connect'}
        </button>
      </div>
      {error && (
        <div
          className="text-xs px-3 py-2.5 rounded-lg leading-relaxed"
          style={{
            color: '#fca5a5',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <p>{error}</p>
          <a
            href="https://www.chess.com/member"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block underline text-[10px]"
            style={{ color: 'var(--accent-indigo)' }}
          >
            Find your chess.com username ↗
          </a>
        </div>
      )}
    </div>
  )
}
