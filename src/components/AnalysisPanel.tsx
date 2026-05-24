import type { StockfishResult } from '../types'
import { evalToDisplay } from '../utils/evaluation'

interface Props {
  result: StockfishResult
}

function uciToSan(moves: string[]): string {
  return moves.slice(0, 5).join(' ')
}

export default function AnalysisPanel({ result }: Props) {
  const { lines, isCalculating, depth } = result

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Engine Analysis
        </span>
        <div className="flex items-center gap-2">
          {isCalculating && (
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Calculating…
            </span>
          )}
          {!isCalculating && depth > 0 && (
            <span className="text-xs text-gray-500">depth {depth}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {lines.length === 0 && !isCalculating && (
          <p className="text-gray-500 text-xs py-2">Make a move to start analysis</p>
        )}
        {lines.map((line, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-2 py-1.5 rounded text-xs ${
              i === 0 ? 'bg-gray-700' : 'bg-gray-800'
            }`}
          >
            <span
              className={`shrink-0 font-bold font-mono text-sm w-12 ${
                line.mate !== null
                  ? 'text-yellow-400'
                  : line.score > 50
                  ? 'text-green-400'
                  : line.score < -50
                  ? 'text-red-400'
                  : 'text-gray-300'
              }`}
            >
              {evalToDisplay(line.score, line.mate)}
            </span>
            <span className="text-gray-300 font-mono leading-relaxed break-all">
              {uciToSan(line.moves)}
            </span>
          </div>
        ))}
      </div>

      {result.bestMove && (
        <div className="mt-1 px-2 py-1.5 bg-blue-900/30 rounded border border-blue-800/50">
          <span className="text-xs text-blue-300">
            Best move: <span className="font-mono font-bold text-blue-200">{result.bestMove}</span>
          </span>
        </div>
      )}
    </div>
  )
}
