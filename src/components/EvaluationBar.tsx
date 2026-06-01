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
  const isMate = mate !== null

  return (
    <div className="flex flex-col items-center gap-1.5 select-none" title={`Evaluation: ${label}`}>
      {/* Black label */}
      <span className="text-[10px] font-mono font-bold tracking-tight"
        style={{ color: !isPositive ? (isMate ? 'var(--accent-gold)' : 'var(--text-secondary)') : 'transparent' }}>
        {!isPositive ? label : ' '}
      </span>

      <div
        className="relative w-5 rounded-lg overflow-hidden shadow-lg"
        style={{
          height: '260px',
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Black portion (top) */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${100 - whitePercent}%`,
            background: 'linear-gradient(to bottom, #0f1117, #1a1d2e)',
            transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* White portion (bottom) */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: `${whitePercent}%`,
            background: 'linear-gradient(to top, #f8fafc, #e2e8f0)',
            transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* Center line */}
        <div
          className="absolute inset-x-0"
          style={{
            top: '50%',
            height: '1px',
            background: 'rgba(255,255,255,0.12)',
          }}
        />

        {/* Calculating indicator */}
        {isCalculating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ background: 'var(--accent-indigo)' }}
            />
          </div>
        )}
      </div>

      {/* White label */}
      <span className="text-[10px] font-mono font-bold tracking-tight"
        style={{ color: isPositive ? (isMate ? 'var(--accent-gold)' : 'var(--text-primary)') : 'transparent' }}>
        {isPositive ? label : ' '}
      </span>
    </div>
  )
}
