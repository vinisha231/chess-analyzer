import type { ChessComGame } from '../utils/chesscomApi'
import { getResultForPlayer } from '../utils/chesscomApi'

interface Props {
  games: ChessComGame[]
  username: string
}

interface Tip {
  icon: string
  title: string
  detail: string
  severity: 'info' | 'warn' | 'good'
}

function analyzeGames(games: ChessComGame[], username: string): Tip[] {
  if (games.length === 0) return []
  const tips: Tip[] = []
  const lc = username.toLowerCase()

  const results = games.map(g => getResultForPlayer(g, lc))
  const wins = results.filter(r => r === 'win').length
  const losses = results.filter(r => r === 'loss').length
  const draws = results.filter(r => r === 'draw').length
  const total = games.length
  const winRate = wins / total

  // Win rate
  if (winRate >= 0.6) {
    tips.push({ icon: '🏆', title: 'Great win rate', detail: `${Math.round(winRate * 100)}% wins in the last ${total} games.`, severity: 'good' })
  } else if (winRate < 0.35) {
    tips.push({ icon: '📉', title: 'Win rate needs work', detail: `Only ${Math.round(winRate * 100)}% of ${total} games. Focus on openings and avoiding blunders.`, severity: 'warn' })
  }

  // Accuracy
  const gamesWithAccuracy = games.filter(g => g.accuracies)
  if (gamesWithAccuracy.length >= 3) {
    const accs = gamesWithAccuracy.map(g => {
      const isWhite = g.white.username.toLowerCase() === lc
      return isWhite ? g.accuracies!.white : g.accuracies!.black
    })
    const avg = accs.reduce((a, b) => a + b, 0) / accs.length
    if (avg >= 85) {
      tips.push({ icon: '✨', title: 'High accuracy', detail: `Average accuracy ${avg.toFixed(0)}% — very consistent play.`, severity: 'good' })
    } else if (avg < 70) {
      tips.push({ icon: '⚠️', title: 'Low accuracy', detail: `Average accuracy ${avg.toFixed(0)}%. Load individual games and study the red move indicators.`, severity: 'warn' })
    } else {
      tips.push({ icon: '📊', title: `Average accuracy: ${avg.toFixed(0)}%`, detail: 'Room to improve — aim for 80%+ with dedicated opening study.', severity: 'info' })
    }
  }

  // Time controls played
  const timeClasses = games.map(g => g.time_class)
  const mostPlayed = ['bullet','blitz','rapid','daily'].find(tc => timeClasses.filter(t => t === tc).length > total * 0.4)
  if (mostPlayed === 'bullet') {
    tips.push({ icon: '⚡', title: 'Mostly bullet games', detail: 'Bullet is fun but hides mistakes. Try more rapid games to build deeper understanding.', severity: 'info' })
  }

  // Color performance
  const whiteGames = games.filter(g => g.white.username.toLowerCase() === lc)
  const blackGames = games.filter(g => g.black.username.toLowerCase() === lc)
  if (whiteGames.length >= 5 && blackGames.length >= 5) {
    const whiteWR = whiteGames.filter(g => getResultForPlayer(g, lc) === 'win').length / whiteGames.length
    const blackWR = blackGames.filter(g => getResultForPlayer(g, lc) === 'win').length / blackGames.length
    const diff = whiteWR - blackWR
    if (diff > 0.2) {
      tips.push({ icon: '♙', title: 'Stronger as White', detail: `Win rate ${Math.round(whiteWR*100)}% as White vs ${Math.round(blackWR*100)}% as Black. Study solid Black defenses.`, severity: 'info' })
    } else if (diff < -0.2) {
      tips.push({ icon: '♟', title: 'Stronger as Black', detail: `Win rate ${Math.round(blackWR*100)}% as Black vs ${Math.round(whiteWR*100)}% as White. Expand your White opening repertoire.`, severity: 'info' })
    }
  }

  // Draw rate
  const drawRate = draws / total
  if (drawRate > 0.25) {
    tips.push({ icon: '🤝', title: 'High draw rate', detail: `${Math.round(drawRate * 100)}% draws — you may be playing too defensively. Look for winning chances.`, severity: 'info' })
  }

  tips.push({ icon: '💡', title: 'How to use this analyzer', detail: 'Click "Analyze" on any game → use ← → keys to review moves → check the engine panel for better alternatives.', severity: 'info' })

  return tips
}

const SEVERITY_STYLE = {
  good: 'border-green-800/40 bg-green-900/10',
  warn: 'border-yellow-800/40 bg-yellow-900/10',
  info: 'border-gray-700/40 bg-gray-800/20',
}

export default function ImprovementTips({ games, username }: Props) {
  const tips = analyzeGames(games, username)

  if (games.length === 0) {
    return <p className="text-gray-500 text-xs text-center py-3">Load games to see improvement tips</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500">Based on {games.length} games</p>
      {tips.map((tip, i) => (
        <div key={i} className={`rounded-lg border px-3 py-2 ${SEVERITY_STYLE[tip.severity]}`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm">{tip.icon}</span>
            <span className="text-xs font-semibold text-gray-200">{tip.title}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{tip.detail}</p>
        </div>
      ))}
    </div>
  )
}
