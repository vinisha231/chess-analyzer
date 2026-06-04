interface Props {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function MonthPicker({ year, month, onChange }: Props) {
  const now = new Date()
  const isMax = year === now.getFullYear() && month === now.getMonth() + 1
  const isMin = year <= 2012

  function prev() {
    if (isMin) return
    if (month === 1) onChange(year - 1, 12)
    else onChange(year, month - 1)
  }
  function next() {
    if (isMax) return
    if (month === 12) onChange(year + 1, 1)
    else onChange(year, month + 1)
  }

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-overlay)',
    color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    opacity: disabled ? 0.35 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 16,
    lineHeight: 1,
    transition: 'all 0.15s',
  })

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={prev}
        disabled={isMin}
        style={navBtn(isMin)}
        onMouseEnter={e => { if (!isMin) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { if (!isMin) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
        aria-label="Previous month"
      >
        ‹
      </button>

      <span
        className="flex-1 text-center text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {MONTHS[month - 1]}{' '}
        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{year}</span>
      </span>

      <button
        onClick={next}
        disabled={isMax}
        style={navBtn(isMax)}
        onMouseEnter={e => { if (!isMax) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { if (!isMax) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  )
}
