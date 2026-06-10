import type { GameSettings, BoardTheme } from '../types'
import { BOARD_THEMES } from '../utils/boardThemes'

interface Props {
  settings: GameSettings
  onChange: (settings: GameSettings) => void
  onClose: () => void
  onResetDefaults?: () => void
}

function Toggle({ label, value, onChange, description }: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  description?: string
}) {
  return (
    <div
      className="flex items-center justify-between py-2.5 cursor-pointer"
      onClick={() => onChange(!value)}
    >
      <div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
        {description && (
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
        )}
      </div>
      <div
        className="relative w-10 h-5 rounded-full transition-all duration-200 shrink-0 ml-4"
        style={{
          background: value
            ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))'
            : 'var(--bg-overlay)',
          border: value ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border-muted)',
          boxShadow: value ? '0 0 8px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200"
          style={{
            left: value ? 'calc(100% - 18px)' : '2px',
          }}
        />
      </div>
    </div>
  )
}

function Section({ title }: { title: string }) {
  return (
    <p
      className="text-[9px] uppercase tracking-widest font-bold pt-3 pb-1"
      style={{ color: 'var(--accent-indigo)' }}
    >
      {title}
    </p>
  )
}

export default function SettingsPanel({ settings, onChange, onClose, onResetDefaults }: Props) {
  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) =>
    onChange({ ...settings, [key]: value })

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-fade-up"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), var(--glow-indigo)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
            >⚙</div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
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

        {/* Scrollable content */}
        <div className="px-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Board theme */}
          <Section title="Board" />
          <div className="pb-2">
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Theme —{' '}
              <span style={{ color: 'var(--accent-indigo)' }}>{BOARD_THEMES[settings.boardTheme].label}</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(BOARD_THEMES) as [BoardTheme, typeof BOARD_THEMES[BoardTheme]][]).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => update('boardTheme', key)}
                  title={t.label}
                  className="flex flex-col items-center gap-1 transition-all"
                  style={{ transform: settings.boardTheme === key ? 'scale(1.10)' : 'scale(1)' }}
                >
                  <div
                    className="flex gap-0.5 rounded-lg overflow-hidden transition-all"
                    style={{
                      outline: settings.boardTheme === key
                        ? '2px solid var(--accent-indigo)'
                        : '2px solid transparent',
                      boxShadow: settings.boardTheme === key ? 'var(--glow-indigo)' : 'none',
                    }}
                  >
                    <div className="w-6 h-6" style={{ background: t.dark }} />
                    <div className="w-6 h-6" style={{ background: t.light }} />
                  </div>
                  <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <Toggle label="Show coordinates" value={settings.showCoordinates} onChange={v => update('showCoordinates', v)} />
            <Toggle label="Show legal moves" value={settings.showLegalMoves} onChange={v => update('showLegalMoves', v)} />
            <Toggle label="Show last move" value={settings.showLastMove} onChange={v => update('showLastMove', v)} />
            <Toggle label="Show best move arrow" value={settings.showBestMoveArrow} onChange={v => update('showBestMoveArrow', v)} />
          </div>

          <Section title="Analysis" />
          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <Toggle label="Auto-analysis" value={settings.autoAnalysis} onChange={v => update('autoAnalysis', v)} description="Analyze every move automatically" />
            <div className="py-2.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Analysis depth
                </label>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent-indigo)' }}>
                  {settings.analysisDepth}
                </span>
              </div>
              <input
                type="range" min={8} max={20} step={1}
                value={settings.analysisDepth}
                onChange={e => update('analysisDepth', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Capped at 2s per move</p>
            </div>
            <div className="py-2.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Analysis lines
                </label>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent-indigo)' }}>
                  {settings.multiPV}
                </span>
              </div>
              <input
                type="range" min={1} max={5} step={1}
                value={settings.multiPV}
                onChange={e => update('multiPV', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <Section title="Game" />
          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <Toggle label="Sound effects" value={settings.soundEnabled} onChange={v => update('soundEnabled', v)} />
            <Toggle label="Show material bar" value={settings.showMaterialBar} onChange={v => update('showMaterialBar', v)} />
            <Toggle label="Always promote to queen" value={settings.autoQueen} onChange={v => update('autoQueen', v)} description="Skip the promotion piece picker" />
            <Toggle label="Game timer" value={settings.enableTimer} onChange={v => update('enableTimer', v)} />
            {settings.enableTimer && (
              <div className="py-2.5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Time control
                  </label>
                  <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent-indigo)' }}>
                    {Math.floor(settings.timeControl / 60)} min
                  </span>
                </div>
                <input
                  type="range" min={60} max={600} step={60}
                  value={settings.timeControl}
                  onChange={e => update('timeControl', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="h-4" />
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex gap-2"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          {onResetDefaults && (
            <button
              onClick={onResetDefaults}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-secondary)',
              }}
              title="Restore all settings to their defaults"
            >
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
              color: '#fff',
              boxShadow: 'var(--glow-indigo)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
