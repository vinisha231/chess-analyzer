interface Props {
  current: number
  total: number
  onJump: (index: number) => void
}

export default function MoveNavigator({ current, total, onJump }: Props) {
  if (total === 0) return null

  const moveNum = current >= 0 ? Math.floor(current / 2) + 1 : 0
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="range"
        min={-1}
        max={total - 1}
        value={current}
        onChange={e => onJump(parseInt(e.target.value))}
        className="w-full cursor-pointer"
        title={current >= 0 ? `Move ${moveNum}` : 'Start position'}
      />
      <div className="flex items-center justify-between">
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Start</span>
        <span
          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md"
          style={{
            color: 'var(--accent-indigo)',
            background: 'rgba(99,102,241,0.10)',
          }}
        >
          {current >= 0 ? `Move ${moveNum}` : 'Start'}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> · {pct}%</span>
        </span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
          {Math.floor((total - 1) / 2) + 1}
        </span>
      </div>
    </div>
  )
}
