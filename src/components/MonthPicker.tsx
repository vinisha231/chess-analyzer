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
    if (month === 1) onChange(year - 1, 12)
    else onChange(year, month - 1)
  }
  function next() {
    if (isMax) return
    if (month === 12) onChange(year + 1, 1)
    else onChange(year, month + 1)
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={prev}
        disabled={isMin}
        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-lg leading-none"
      >‹</button>
      <span className="text-sm font-medium text-gray-200 flex-1 text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button
        onClick={next}
        disabled={isMax}
        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-lg leading-none"
      >›</button>
    </div>
  )
}
