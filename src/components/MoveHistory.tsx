import { useEffect, useRef } from 'react'
import type { MoveRecord } from '../types'

interface Props {
  moves: MoveRecord[]
  currentIndex: number
  onJump: (index: number) => void
}

export default function MoveHistory({ moves, currentIndex, onJump }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  const pairs: Array<[MoveRecord | null, MoveRecord | null]> = []
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i] ?? null, moves[i + 1] ?? null])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5 border-b border-gray-700">
        Move History
      </div>
      <div className="flex-1 overflow-y-auto">
        {pairs.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">No moves yet</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {pairs.map(([white, black], pairIdx) => {
                const wIdx = pairIdx * 2
                const bIdx = pairIdx * 2 + 1
                return (
                  <tr key={pairIdx} className="border-b border-gray-800">
                    <td className="w-8 text-center text-gray-500 text-xs py-1 select-none">
                      {pairIdx + 1}.
                    </td>
                    <td className="w-1/2 py-0.5 pr-1">
                      {white && (
                        <button
                          ref={currentIndex === wIdx ? activeRef : undefined}
                          onClick={() => onJump(wIdx)}
                          className={`w-full text-left px-2 py-0.5 rounded text-sm font-mono transition-colors ${
                            currentIndex === wIdx
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-200 hover:bg-gray-700'
                          }`}
                        >
                          {white.san}
                          {white.classification && (
                            <span className="ml-1 text-xs" style={{ color: white.classification.color }}>
                              {white.classification.emoji}
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="w-1/2 py-0.5 pl-1">
                      {black && (
                        <button
                          ref={currentIndex === bIdx ? activeRef : undefined}
                          onClick={() => onJump(bIdx)}
                          className={`w-full text-left px-2 py-0.5 rounded text-sm font-mono transition-colors ${
                            currentIndex === bIdx
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-200 hover:bg-gray-700'
                          }`}
                        >
                          {black.san}
                          {black.classification && (
                            <span className="ml-1 text-xs" style={{ color: black.classification.color }}>
                              {black.classification.emoji}
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
