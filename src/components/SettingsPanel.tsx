import type { GameSettings } from '../types'

interface Props {
  settings: GameSettings
  onChange: (settings: GameSettings) => void
  onClose: () => void
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  )
}

export default function SettingsPanel({ settings, onChange, onClose }: Props) {
  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) =>
    onChange({ ...settings, [key]: value })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="divide-y divide-gray-700">
          <Toggle label="Show coordinates" value={settings.showCoordinates} onChange={v => update('showCoordinates', v)} />
          <Toggle label="Show legal moves" value={settings.showLegalMoves} onChange={v => update('showLegalMoves', v)} />
          <Toggle label="Show last move" value={settings.showLastMove} onChange={v => update('showLastMove', v)} />
          <Toggle label="Show best move arrow" value={settings.showBestMoveArrow} onChange={v => update('showBestMoveArrow', v)} />
          <Toggle label="Sound effects" value={settings.soundEnabled} onChange={v => update('soundEnabled', v)} />
          <Toggle label="Game timer" value={settings.enableTimer} onChange={v => update('enableTimer', v)} />

          <div className="py-2">
            <label className="text-sm text-gray-300 block mb-1">Analysis depth: {settings.analysisDepth}</label>
            <input
              type="range" min={8} max={24} step={2}
              value={settings.analysisDepth}
              onChange={e => update('analysisDepth', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="py-2">
            <label className="text-sm text-gray-300 block mb-1">Lines shown: {settings.multiPV}</label>
            <input
              type="range" min={1} max={5} step={1}
              value={settings.multiPV}
              onChange={e => update('multiPV', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {settings.enableTimer && (
            <div className="py-2">
              <label className="text-sm text-gray-300 block mb-1">
                Time control: {Math.floor(settings.timeControl / 60)} min
              </label>
              <input
                type="range" min={60} max={600} step={60}
                value={settings.timeControl}
                onChange={e => update('timeControl', parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
