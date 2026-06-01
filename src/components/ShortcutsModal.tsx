interface Props {
  onClose: () => void
}

const SHORTCUTS = [
  { section: 'Main Board', keys: ['←', '→'], description: 'Navigate moves backward / forward' },
  { section: null, keys: ['↑'], description: 'Jump to the first move' },
  { section: null, keys: ['↓'], description: 'Jump to the last move' },
  { section: null, keys: ['F'], description: 'Flip the board' },
  { section: null, keys: ['?'], description: 'Open this shortcuts dialog' },
  { section: 'Opening Lesson', keys: ['←', '→'], description: 'Step through opening moves' },
  { section: null, keys: ['↑'], description: 'Go to start of opening' },
  { section: null, keys: ['↓'], description: 'Go to end of opening' },
]

export default function ShortcutsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-80 max-w-[90vw] animate-fade-up"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), var(--glow-indigo)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >⌨</div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-lg leading-none transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            }}
          >×</button>
        </div>

        {/* Shortcuts list */}
        <div className="flex flex-col gap-2.5">
          {SHORTCUTS.map(({ section, keys, description }) => (
            <div key={`${section ?? ''}-${description}`}>
              {section && (
                <p
                  className="text-[9px] uppercase tracking-widest font-bold mb-2 mt-1"
                  style={{ color: 'var(--accent-indigo)' }}
                >
                  {section}
                </p>
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {description}
                </span>
                <div className="flex gap-1 shrink-0">
                  {keys.map(k => (
                    <kbd
                      key={k}
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                      style={{
                        background: 'var(--bg-overlay)',
                        border: '1px solid var(--border-muted)',
                        color: 'var(--text-primary)',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
                      }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          className="mt-5 pt-4 text-center text-[10px]"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          Press{' '}
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono mx-0.5"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
            }}
          >?</kbd>
          {' '}any time to reopen
        </div>
      </div>
    </div>
  )
}
