import CapturedPieces from './CapturedPieces'
import type { CapturedPieces as CapturedPiecesType } from '../types'

interface Props {
  name: string
  color: 'w' | 'b'
  isActive: boolean
  capturedPieces: CapturedPiecesType
  advantage: number
  timeDisplay?: string
  timeLow?: boolean
}

export default function PlayerInfo({ name, color, isActive, capturedPieces, advantage, timeDisplay, timeLow }: Props) {
  const captured = color === 'w' ? capturedPieces.b : capturedPieces.w

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-gray-700/70 ring-1 ring-blue-500/50' : 'bg-gray-800/50'
    }`}>
      <div className="flex items-center gap-2.5">
        <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
          color === 'w'
            ? 'bg-white border-gray-300'
            : 'bg-gray-900 border-gray-600'
        }`} />
        <div>
          <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
            {name}
          </p>
          <CapturedPieces pieces={captured} color={color} advantage={advantage} />
        </div>
      </div>
      {timeDisplay && (
        <div className={`font-mono text-sm font-bold px-2 py-1 rounded ${
          timeLow ? 'text-red-400 bg-red-900/30 animate-pulse' : isActive ? 'text-white' : 'text-gray-500'
        }`}>
          {timeDisplay}
        </div>
      )}
    </div>
  )
}
