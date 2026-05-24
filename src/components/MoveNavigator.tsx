interface Props {
  current: number
  total: number
  onJump: (index: number) => void
}

export default function MoveNavigator({ current, total, onJump }: Props) {
  if (total === 0) return null
  return (
    <div className="flex flex-col gap-1 px-1">
      <input
        type="range"
        min={-1}
        max={total - 1}
        value={current}
        onChange={e => onJump(parseInt(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
        style={{ height: 4 }}
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>Start</span>
        <span>{current >= 0 ? `Move ${Math.floor(current / 2) + 1}` : 'Start'}</span>
        <span>End</span>
      </div>
    </div>
  )
}
