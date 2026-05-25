import { evalToDisplay, evalToBarPercent } from '../utils/evaluation'

interface Props {
  evaluation: number
  mate: number | null
  isCalculating: boolean
}

export default function EvaluationBar({ evaluation, mate, isCalculating }: Props) {
  const whitePercent = evalToBarPercent(evaluation, mate)
  const label = evalToDisplay(evaluation, mate)
  const isPositive = mate !== null ? mate > 0 : evaluation >= 0

  return (
    <div className="flex flex-col items-center gap-1 select-none" title={`Evaluation: ${label}`}>
      {/* Black side label at top */}
      <span className="text-xs font-mono text-gray-500">
        {!isPositive ? label : ''}
      </span>

      <div className="relative w-6 h-64 rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-inner">
        {/* Black side (top portion) */}
        <div className="absolute inset-0 bg-gray-800" />
        {/* White side (grows from bottom) */}
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-white to-gray-100 transition-all duration-700 ease-out"
          style={{ height: `${whitePercent}%` }}
        />
        {/* Divider at 50% (equal) */}
        <div className="absolute left-0 right-0 border-t border-gray-600/50" style={{ top: '50%' }} />
        {isCalculating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-70" />
          </div>
        )}
      </div>

      {/* White side label at bottom */}
      <span className={`text-xs font-mono font-bold ${
        mate !== null ? 'text-yellow-400' : isPositive ? 'text-white' : 'text-gray-400'
      }`}>
        {isPositive ? label : ''}
      </span>
    </div>
  )
}
