import { useState, useCallback, useRef } from 'react'
import { downloadPGN, parseFEN } from '../utils/pgn'

interface Props {
  pgn: string
  onImportPGN: (pgn: string) => boolean
  onImportFEN: (fen: string) => boolean
  onClose: () => void
}

const TABS = [
  { id: 'export', label: 'Export PGN' },
  { id: 'pgn',    label: 'Import PGN' },
  { id: 'fen',    label: 'Import FEN' },
] as const

export default function PGNPanel({ pgn, onImportPGN, onImportFEN, onClose }: Props) {
  const [tab, setTab] = useState<'export' | 'pgn' | 'fen'>('export')
  const [importText, setImportText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    setError('')
    setSuccess('')
    file.text().then(text => {
      const ok = onImportPGN(text.trim())
      if (!ok) setError(`Could not parse ${file.name} as PGN`)
      else setSuccess(`Loaded ${file.name}`)
    }).catch(() => setError('Could not read the file'))
  }

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }, [pgn])

  const handleImport = () => {
    setError('')
    setSuccess('')
    if (tab === 'pgn') {
      const ok = onImportPGN(importText.trim())
      if (!ok) setError('Invalid PGN format')
      else { setSuccess('Game loaded!'); setImportText('') }
    } else if (tab === 'fen') {
      if (!parseFEN(importText.trim())) { setError('Invalid FEN string'); return }
      const ok = onImportFEN(importText.trim())
      if (!ok) setError('Invalid FEN position')
      else { setSuccess('Position loaded!'); setImportText('') }
    }
  }

  const textareaStyle: React.CSSProperties = {
    background: 'var(--bg-base)',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-secondary)',
    borderRadius: '12px',
    padding: '12px',
    resize: 'none',
    outline: 'none',
    width: '100%',
    fontFamily: 'monospace',
    fontSize: '11px',
    lineHeight: 1.6,
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-up"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), var(--glow-indigo)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: 'var(--accent-indigo)' }}
            >PGN</div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>PGN / FEN</h2>
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

        {/* Tab bar */}
        <div
          className="flex gap-1 p-1.5 mx-5 mt-4 mb-3 rounded-xl"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(''); setSuccess('') }}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={tab === t.id ? {
                background: 'var(--accent-indigo)',
                color: '#fff',
                boxShadow: '0 0 10px rgba(99,102,241,0.3)',
              } : {
                color: 'var(--text-muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {tab === 'export' && (
            <div className="flex flex-col gap-3">
              <textarea
                readOnly
                value={pgn || '(no moves yet)'}
                rows={8}
                style={textareaStyle}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={copied ? {
                    background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    color: '#4ade80',
                  } : {
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-muted)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadPGN(pgn, `game-${Date.now()}.pgn`)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
                    color: '#fff',
                    boxShadow: 'var(--glow-indigo)',
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {(tab === 'pgn' || tab === 'fen') && (
            <div className="flex flex-col gap-3">
              {tab === 'pgn' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pgn,.txt"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = '' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 rounded-xl text-xs font-semibold transition-all border-dashed"
                    style={{
                      background: 'var(--bg-overlay)',
                      border: '1px dashed var(--border-muted)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    📂 Upload a .pgn file
                  </button>
                </>
              )}
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={tab === 'pgn' ? 'Paste PGN here…' : 'Paste FEN string here…'}
                rows={6}
                style={textareaStyle}
                onFocus={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--border-accent)'}
                onBlur={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--border-muted)'}
              />
              {error && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: '#4ade80', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  {success}
                </p>
              )}
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
                  color: '#fff',
                  boxShadow: 'var(--glow-indigo)',
                }}
              >
                Load
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
