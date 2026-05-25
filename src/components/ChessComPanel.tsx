import { useEffect, useState } from 'react'
import ChessComConnect from './ChessComConnect'
import GameImportCard from './GameImportCard'
import MonthPicker from './MonthPicker'
import ImprovementTips from './ImprovementTips'
import type { useChessCom } from '../hooks/useChessCom'

type ChessComHook = ReturnType<typeof useChessCom>

interface Props extends ChessComHook {
  onImportGame: (pgn: string) => void
}

type SubTab = 'games' | 'tips'

const TIME_CLASS_FILTERS = ['all', 'bullet', 'blitz', 'rapid', 'daily'] as const
type Filter = typeof TIME_CLASS_FILTERS[number]

export default function ChessComPanel({
  connectionState, profile, stats, error, games, gamesLoading,
  selectedYear, selectedMonth,
  connect, loadGames, disconnect,
  onImportGame,
}: Props) {
  const [subTab, setSubTab] = useState<SubTab>('games')
  const [filter, setFilter] = useState<Filter>('all')

  // Auto-load current month when connected
  useEffect(() => {
    if (connectionState === 'connected' && profile && games.length === 0 && !gamesLoading) {
      loadGames(profile.username, selectedYear, selectedMonth)
    }
  }, [connectionState, profile])

  const filteredGames = filter === 'all' ? games : games.filter(g => g.time_class === filter)

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
      <ChessComConnect
        connectionState={connectionState}
        profile={profile}
        stats={stats}
        error={error}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <div className="flex gap-1 bg-gray-900/60 rounded-lg p-1 shrink-0">
        <button
          onClick={() => setSubTab('games')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${subTab === 'games' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          📋 Games
        </button>
        <button
          onClick={() => setSubTab('tips')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition-colors ${subTab === 'tips' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          💡 Tips
        </button>
      </div>

      {subTab === 'tips' && <div className="overflow-y-auto flex-1"><ImprovementTips games={games} username={profile!.username} /></div>}

      {subTab === 'games' && (
        <>
          <div className="shrink-0">
            <MonthPicker
              year={selectedYear}
              month={selectedMonth}
              onChange={(y, m) => loadGames(profile!.username, y, m)}
            />
          </div>

          <div className="flex gap-1 flex-wrap shrink-0">
            {TIME_CLASS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors capitalize ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
            {games.length > 0 && (
              <span className="ml-auto text-xs text-gray-500 self-center">
                {filteredGames.length} games
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {gamesLoading && (
              <div className="flex items-center justify-center py-8 gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400">Loading games…</span>
              </div>
            )}
            {!gamesLoading && filteredGames.length === 0 && (
              <p className="text-gray-500 text-xs text-center py-6">
                {games.length === 0 ? 'No standard chess games this month' : 'No games match this filter'}
              </p>
            )}
            {!gamesLoading && filteredGames.map((game, i) => (
              <GameImportCard
                key={game.url ?? i}
                game={game}
                username={profile!.username}
                onImport={pgn => { onImportGame(pgn) }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
