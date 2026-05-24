interface Props {
  color: 'w' | 'b'
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void
  onCancel: () => void
}

const PIECES: Array<{ value: 'q' | 'r' | 'b' | 'n'; label: string; symbol: string }> = [
  { value: 'q', label: 'Queen', symbol: '♛' },
  { value: 'r', label: 'Rook', symbol: '♜' },
  { value: 'b', label: 'Bishop', symbol: '♝' },
  { value: 'n', label: 'Knight', symbol: '♞' },
]

const WHITE_SYMBOLS: Record<string, string> = { q: '♕', r: '♖', b: '♗', n: '♘' }

export default function PromotionDialog({ color, onSelect, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 text-center">
        <h3 className="text-white font-bold text-lg mb-4">Promote pawn to…</h3>
        <div className="flex gap-3">
          {PIECES.map(p => (
            <button
              key={p.value}
              onClick={() => onSelect(p.value)}
              className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-blue-600 transition-colors group"
            >
              <span className="text-4xl leading-none select-none">
                {color === 'w' ? WHITE_SYMBOLS[p.value] : p.symbol}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-white">{p.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
