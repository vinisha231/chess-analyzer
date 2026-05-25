import { useState, useCallback } from 'react'
import { downloadPGN, parseFEN } from '../utils/pgn'

interface Props {
  pgn: string
  onImportPGN: (pgn: string) => boolean
  onImportFEN: (fen: string) => boolean
  onClose: () => void
}

export default function PGNPanel({ pgn, onImportPGN, onImportFEN, onClose }: Props) {
  const [tab, setTab] = useState<'export' | 'pgn' | 'fen'>('export')
  const [importText, setImportText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }, [pgn])

  const handleImport = () => {
    setError('')
    setSuccess('')
    let ok = false
    if (tab === 'pgn') {
      ok = onImportPGN(importText.trim())
      if (!ok) setError('Invalid PGN format')
      else { setSuccess('Game loaded!'); setImportText('') }
    } else if (tab === 'fen') {
      if (!parseFEN(importText.trim())) { setError('Invalid FEN string'); return }
      ok = onImportFEN(importText.trim())
      if (!ok) setError('Invalid FEN position')
      else { setSuccess('Position loaded!'); setImportText('') }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">PGN / FEN</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
          {(['export', 'pgn', 'fen'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'export' ? 'Export PGN' : t === 'pgn' ? 'Import PGN' : 'Import FEN'}
            </button>
          ))}
        </div>

        {tab === 'export' && (
          <div>
            <textarea
              readOnly
              value={pgn || '(no moves yet)'}
              className="w-full h-40 bg-gray-900 text-gray-300 text-xs font-mono p-3 rounded-lg resize-none border border-gray-700 focus:outline-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied ? 'bg-green-700 text-green-200' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => downloadPGN(pgn, `game-${Date.now()}.pgn`)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {(tab === 'pgn' || tab === 'fen') && (
          <div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={tab === 'pgn' ? 'Paste PGN here…' : 'Paste FEN string here…'}
              className="w-full h-32 bg-gray-900 text-gray-300 text-xs font-mono p-3 rounded-lg resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            {success && <p className="text-green-400 text-xs mt-1">{success}</p>}
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Load
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
