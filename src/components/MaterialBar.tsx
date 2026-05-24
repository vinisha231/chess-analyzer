interface Props {
  white: number
  black: number
}

export default function MaterialBar({ white, black }: Props) {
  const total = white + black || 1
  const whitePercent = (white / total) * 100
  const diff = white - black

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Material</span>
        {diff !== 0 && (
          <span className={diff > 0 ? 'text-gray-300' : 'text-gray-400'}>
            {diff > 0 ? `White +${diff}` : `Black +${Math.abs(diff)}`}
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-200 transition-all duration-300"
          style={{ width: `${whitePercent}%` }}
        />
      </div>
    </div>
  )
}
