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
  const draws = results.filter(r => r === 'draw').length
  const total = games.length
  const winRate = wins / total

  if (winRate >= 0.6) {
    tips.push({ icon: '🏆', title: 'Great win rate', detail: `${Math.round(winRate * 100)}% wins in the last ${total} games.`, severity: 'good' })
  } else if (winRate < 0.35) {
    tips.push({ icon: '📉', title: 'Win rate needs work', detail: `Only ${Math.round(winRate * 100)}% of ${total} games. Focus on openings and avoiding blunders.`, severity: 'warn' })
  }

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

  const timeClasses = games.map(g => g.time_class)
  const mostPlayed = ['bullet','blitz','rapid','daily'].find(tc => timeClasses.filter(t => t === tc).length > total * 0.4)
  if (mostPlayed === 'bullet') {
    tips.push({ icon: '⚡', title: 'Mostly bullet games', detail: 'Bullet is fun but hides mistakes. Try more rapid games to build deeper understanding.', severity: 'info' })
  }

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

  const drawRate = draws / total
  if (drawRate > 0.25) {
    tips.push({ icon: '🤝', title: 'High draw rate', detail: `${Math.round(drawRate * 100)}% draws — you may be playing too defensively. Look for winning chances.`, severity: 'info' })
  }

  tips.push({ icon: '💡', title: 'How to use this analyzer', detail: 'Click "Analyze" on any game → use ← → keys to review moves → check the engine panel for better alternatives.', severity: 'info' })

  return tips
}

const SEVERITY: Record<string, { bg: string; border: string; iconBg: string }> = {
  good: {
    bg: 'rgba(34,197,94,0.05)',
    border: 'rgba(34,197,94,0.20)',
    iconBg: 'rgba(34,197,94,0.12)',
  },
  warn: {
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.20)',
    iconBg: 'rgba(245,158,11,0.12)',
  },
  info: {
    bg: 'var(--bg-elevated)',
    border: 'var(--border-subtle)',
    iconBg: 'var(--bg-overlay)',
  },
}

export default function ImprovementTips({ games, username }: Props) {
  const tips = analyzeGames(games, username)

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 gap-2">
        <span className="text-2xl opacity-20">💡</span>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Load games to see improvement tips
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
        Based on {games.length} recent games
      </p>
      {tips.map((tip, i) => {
        const s = SEVERITY[tip.severity]
        return (
          <div
            key={i}
            className="rounded-xl px-3 py-2.5 transition-all"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
            }}
          >
            <div className="flex items-start gap-2.5">
              <div
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: s.iconBg }}
              >
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  {tip.title}
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {tip.detail}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
