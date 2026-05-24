import { useState } from 'react'

interface Props {
  names: { white: string; black: string }
  onChange: (names: { white: string; black: string }) => void
  onClose: () => void
}

export default function PlayerNameEditor({ names, onChange, onClose }: Props) {
  const [white, setWhite] = useState(names.white)
  const [black, setBlack] = useState(names.black)

  function handleSave() {
    onChange({
      white: white.trim() || 'White',
      black: black.trim() || 'Black',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Player Names</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">White player</label>
            <input
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
              value={white}
              onChange={e => setWhite(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={30}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Black player</label>
            <input
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
              value={black}
              onChange={e => setBlack(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={30}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
