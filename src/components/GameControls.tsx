interface Props {
  canUndo: boolean
  onUndo: () => void
  onReset: () => void
  onFlip: () => void
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  canGoPrev: boolean
  canGoNext: boolean
  onOpenPGN: () => void
  onOpenSettings: () => void
}

export default function GameControls({
  canUndo,
  onUndo, onReset, onFlip,
  onFirst, onPrev, onNext, onLast,
  canGoPrev, canGoNext,
  onOpenPGN, onOpenSettings,
}: Props) {
  const btn = "p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
  const icon = "text-gray-300 hover:text-white hover:bg-gray-700"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-1">
        <button
          title="First move"
          onClick={onFirst}
          disabled={!canGoPrev}
          className={`${btn} ${icon}`}
        >⏮</button>
        <button
          title="Previous move"
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`${btn} ${icon}`}
        >◀</button>
        <button
          title="Next move"
          onClick={onNext}
          disabled={!canGoNext}
          className={`${btn} ${icon}`}
        >▶</button>
        <button
          title="Last move"
          onClick={onLast}
          disabled={!canGoNext}
          className={`${btn} ${icon}`}
        >⏭</button>
        <div className="w-px h-5 bg-gray-700 mx-1" />
        <button
          title="Flip board"
          onClick={onFlip}
          className={`${btn} ${icon}`}
        >⇅</button>
        <button
          title="Undo move"
          onClick={onUndo}
          disabled={!canUndo}
          className={`${btn} ${icon}`}
        >↩</button>
        <button
          title="New game"
          onClick={onReset}
          className={`${btn} ${icon}`}
        >⊕</button>
        <div className="w-px h-5 bg-gray-700 mx-1" />
        <button
          title="PGN / FEN"
          onClick={onOpenPGN}
          className={`${btn} ${icon} text-xs font-bold`}
        >PGN</button>
        <button
          title="Settings"
          onClick={onOpenSettings}
          className={`${btn} ${icon}`}
        >⚙</button>
      </div>
    </div>
  )
}
