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
  autoplay?: boolean
  onToggleAutoplay?: () => void
}

interface BtnProps {
  title: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  accent?: boolean
}

function Btn({ title, onClick, disabled, children, accent }: BtnProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="relative p-2 rounded-lg transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed group"
      style={{
        background: 'transparent',
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = accent
            ? 'rgba(99,102,241,0.15)'
            : 'var(--bg-overlay)'
          ;(e.currentTarget as HTMLButtonElement).style.color = accent
            ? 'var(--accent-indigo)'
            : 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
      }}
    >
      {children}
    </button>
  )
}

export default function GameControls({
  canUndo,
  onUndo, onReset, onFlip,
  onFirst, onPrev, onNext, onLast,
  canGoPrev, canGoNext,
  onOpenPGN, onOpenSettings,
  autoplay, onToggleAutoplay,
}: Props) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-xl px-2 py-1"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Navigation */}
      <Btn title="First move (↑)" onClick={onFirst} disabled={!canGoPrev}>⏮</Btn>
      <Btn title="Previous move (←)" onClick={onPrev} disabled={!canGoPrev}>◀</Btn>
      <Btn title="Next move (→)" onClick={onNext} disabled={!canGoNext}>▶</Btn>
      {onToggleAutoplay && (
        <Btn title={autoplay ? 'Pause replay (Space)' : 'Autoplay replay (Space)'} onClick={onToggleAutoplay} disabled={!canGoNext && !autoplay} accent>
          {autoplay ? '⏸' : '▶▶'}
        </Btn>
      )}
      <Btn title="Last move (↓)" onClick={onLast} disabled={!canGoNext}>⏭</Btn>

      {/* Divider */}
      <div className="w-px h-5 mx-1" style={{ background: 'var(--border-muted)' }} />

      {/* Board actions */}
      <Btn title="Flip board (F)" onClick={onFlip}>⇅</Btn>
      <Btn title="Undo move" onClick={onUndo} disabled={!canUndo}>↩</Btn>
      <Btn title="New game" onClick={onReset} accent>⊕</Btn>

      {/* Divider */}
      <div className="w-px h-5 mx-1" style={{ background: 'var(--border-muted)' }} />

      {/* Panels */}
      <Btn title="PGN / FEN import" onClick={onOpenPGN} accent>
        <span className="text-xs font-bold">PGN</span>
      </Btn>
      <Btn title="Settings" onClick={onOpenSettings}>⚙</Btn>
    </div>
  )
}
