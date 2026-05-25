interface Props {
  onClose: () => void
}

const SHORTCUTS = [
  { keys: ['←', '→'], description: 'Navigate moves backward / forward' },
  { keys: ['↑'], description: 'Jump to the first move' },
  { keys: ['↓'], description: 'Jump to the last move' },
  { keys: ['F'], description: 'Flip the board' },
  { keys: ['?'], description: 'Open this shortcuts dialog' },
]

export default function ShortcutsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 w-80 max-w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {SHORTCUTS.map(({ keys, description }) => (
            <div key={description} className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-300">{description}</span>
              <div className="flex gap-1 shrink-0">
                {keys.map(k => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-gray-500 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-gray-300 font-mono">?</kbd> any time to reopen this dialog
        </p>
      </div>
    </div>
  )
}
