interface Props {
  white: number
  black: number
}

export default function MaterialBar({ white, black }: Props) {
  const total = white + black || 1
  const whitePercent = (white / total) * 100
  const diff = white - black

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
          Material
        </span>
        {diff !== 0 && (
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
            style={{
              color: diff > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: diff > 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
          >
            {diff > 0 ? `White +${diff}` : `Black +${Math.abs(diff)}`}
          </span>
        )}
      </div>
      <div
        className="relative h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--bg-overlay)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${whitePercent}%`,
            background: 'linear-gradient(90deg, #e2e8f0, #f8fafc)',
          }}
        />
      </div>
    </div>
  )
}
