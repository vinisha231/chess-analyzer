import { useEffect, useState } from 'react'
import ChessComConnect from './ChessComConnect'
import GameImportCard from './GameImportCard'
import MonthPicker from './MonthPicker'
import ImprovementTips from './ImprovementTips'
import type { useChessCom } from '../hooks/useChessCom'
import { getResultForPlayer } from '../utils/chesscomApi'

type ChessComHook = ReturnType<typeof useChessCom>

interface Props extends ChessComHook {
  onImportGame: (pgn: string) => void
}

type SubTab = 'games' | 'tips'

const TIME_CLASS_FILTERS = ['all', 'bullet', 'blitz', 'rapid', 'daily'] as const
type Filter = typeof TIME_CLASS_FILTERS[number]

const RESULT_FILTERS = ['all', 'win', 'loss', 'draw'] as const
type ResultFilter = typeof RESULT_FILTERS[number]

const RESULT_ACTIVE: Record<ResultFilter, React.CSSProperties> = {
  all:  { background: 'var(--accent-indigo)', color: '#fff' },
  win:  { background: 'rgba(34,197,94,0.2)',  color: '#4ade80', border: '1px solid rgba(34,197,94,0.35)' },
  loss: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
  draw: { background: 'var(--bg-overlay)',    color: 'var(--text-secondary)', border: '1px solid var(--border-muted)' },
}

const RESULT_LABEL: Record<ResultFilter, string> = {
  all: 'All', win: '✓ Won', loss: '✗ Lost', draw: '= Draw',
}

const TIME_LABEL: Record<string, string> = {
  all: 'All', bullet: '⚡ Bullet', blitz: '🔥 Blitz', rapid: '⏱ Rapid', daily: '📅 Daily',
}

export default function ChessComPanel({
  connectionState, profile, stats, error, games, gamesLoading,
  selectedYear, selectedMonth,
  connect, loadGames, disconnect,
  onImportGame,
}: Props) {
  const [subTab, setSubTab] = useState<SubTab>('games')
  const [filter, setFilter] = useState<Filter>('all')
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all')
  const [opponentSearch, setOpponentSearch] = useState('')

  // Auto-load current month when connected
  useEffect(() => {
    if (connectionState === 'connected' && profile && games.length === 0 && !gamesLoading) {
      loadGames(profile.username, selectedYear, selectedMonth)
    }
  }, [connectionState, profile])

  const timeFiltered = filter === 'all' ? games : games.filter(g => g.time_class === filter)
  const resultFiltered = resultFilter === 'all'
    ? timeFiltered
    : timeFiltered.filter(g => profile && getResultForPlayer(g, profile.username) === resultFilter)
  const filteredGames = opponentSearch.trim()
    ? resultFiltered.filter(g => {
        const q = opponentSearch.toLowerCase()
        const opp = profile
          ? (g.white.username.toLowerCase() === profile.username.toLowerCase() ? g.black : g.white)
          : g.black
        return opp.username.toLowerCase().includes(q)
      })
    : resultFiltered

  if (connectionState !== 'connected') {
    return (
      <ChessComConnect
        connectionState={connectionState}
        profile={profile}
        stats={stats}
        error={error}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Profile header */}
      <ChessComConnect
        connectionState={connectionState}
        profile={profile}
        stats={stats}
        error={error}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {/* Sub-tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl shrink-0"
        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
      >
        {([
          { id: 'games', label: '📋 Games' },
          { id: 'tips',  label: '💡 Tips'  },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={subTab === t.id ? {
              background: 'var(--accent-indigo)',
              color: '#fff',
              boxShadow: '0 0 8px rgba(99,102,241,0.3)',
            } : {
              color: 'var(--text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tips tab */}
      {subTab === 'tips' && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <ImprovementTips games={games} username={profile!.username} />
        </div>
      )}

      {/* Games tab */}
      {subTab === 'games' && (
        <>
          {/* Month picker */}
          <div className="shrink-0">
            <MonthPicker
              year={selectedYear}
              month={selectedMonth}
              onChange={(y, m) => loadGames(profile!.username, y, m)}
            />
          </div>

          {/* Time class filter */}
          <div className="flex gap-1 flex-wrap shrink-0">
            {TIME_CLASS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
                style={filter === f ? {
                  background: 'var(--accent-indigo)',
                  color: '#fff',
                  boxShadow: '0 0 6px rgba(99,102,241,0.3)',
                } : {
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                {TIME_LABEL[f]}
              </button>
            ))}
          </div>

          {/* Result filter + game count */}
          <div className="flex gap-1 flex-wrap shrink-0 items-center">
            {RESULT_FILTERS.map(r => (
              <button
                key={r}
                onClick={() => setResultFilter(r)}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
                style={resultFilter === r ? RESULT_ACTIVE[r] : {
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                {RESULT_LABEL[r]}
              </button>
            ))}
            {games.length > 0 && (
              <span
                className="ml-auto text-[10px] font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                {filteredGames.length} / {games.length}
              </span>
            )}
          </div>

          {/* Opponent search */}
          <div className="shrink-0 relative">
            <input
              type="text"
              placeholder="Search by opponent…"
              value={opponentSearch}
              onChange={e => setOpponentSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-accent)'}
              onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-muted)'}
            />
            {opponentSearch && (
              <button
                onClick={() => setOpponentSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base leading-none transition-all"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
              >×</button>
            )}
          </div>

          {/* Games list */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-1.5">
            {gamesLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div
                  className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--accent-indigo)', borderTopColor: 'transparent' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading games…</span>
              </div>
            )}
            {!gamesLoading && filteredGames.length === 0 && (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-2xl opacity-20">♟</span>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  {games.length === 0
                    ? 'No standard chess games this month'
                    : 'No games match this filter'}
                </p>
              </div>
            )}
            {!gamesLoading && filteredGames.map((game, i) => (
              <GameImportCard
                key={game.url ?? i}
                game={game}
                username={profile!.username}
                onImport={pgn => onImportGame(pgn)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
