import type { ChessOpening } from '../../types/openings'

interface Props {
  opening: ChessOpening
  currentMoveIdx: number
  onJump: (index: number) => void
}

export default function OpeningMoveList({ opening, currentMoveIdx, onJump }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold px-1">Main line</p>

      {opening.moves.map((move, i) => {
        const moveNumber = Math.floor(i / 2) + 1
        const isWhiteMove = i % 2 === 0
        const isCurrent = i === currentMoveIdx
        const isPast = i < currentMoveIdx
        const isFuture = i > currentMoveIdx

        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`w-full text-left rounded-lg px-2 py-1.5 transition-all text-xs ${
              isCurrent
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : isPast
                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-baseline gap-1.5">
              {isWhiteMove && (
                <span className={`font-mono text-[10px] shrink-0 ${isCurrent ? 'text-blue-200' : 'text-gray-600'}`}>
                  {moveNumber}.
                </span>
              )}
              {!isWhiteMove && (
                <span className={`font-mono text-[10px] shrink-0 ${isCurrent ? 'text-blue-200' : 'text-gray-700'}`}>
                  …
                </span>
              )}
              <span className={`font-mono font-bold ${isFuture ? 'text-gray-600' : ''}`}>{move.san}</span>
              {!isFuture && (
                <span className={`text-[10px] leading-relaxed truncate ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}>
                  {move.explanation.slice(0, 60)}{move.explanation.length > 60 ? '…' : ''}
                </span>
              )}
            </div>
          </button>
        )
      })}

      {/* Variations */}
      {opening.variations && opening.variations.length > 0 && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold px-1 mb-1">Variations</p>
          {opening.variations.map((variation, i) => (
            <div key={i} className="px-2 py-1.5 bg-gray-800/40 rounded-lg mb-1">
              <p className="text-xs font-semibold text-gray-300 mb-0.5">{variation.name}</p>
              <div className="flex gap-1 flex-wrap">
                {variation.moves.map((m, j) => (
                  <span key={j} className="font-mono text-xs text-blue-300">{m.san}</span>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{variation.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
