import { evalToDisplay, evalToBarPercent } from '../utils/evaluation'

interface Props {
  evaluation: number
  mate: number | null
  isCalculating: boolean
}

export default function EvaluationBar({ evaluation, mate, isCalculating }: Props) {
  const whitePercent = evalToBarPercent(evaluation, mate)
  const label = evalToDisplay(evaluation, mate)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-6 h-64 rounded overflow-hidden bg-gray-800 border border-gray-600">
        <div
          className="absolute bottom-0 w-full bg-white transition-all duration-500 ease-out"
          style={{ height: `${whitePercent}%` }}
        />
        {isCalculating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
      <span className={`text-xs font-mono font-bold ${
        mate !== null ? 'text-yellow-400' : evaluation > 50 ? 'text-white' : evaluation < -50 ? 'text-gray-400' : 'text-gray-300'
      }`}>
        {label}
      </span>
    </div>
  )
}
