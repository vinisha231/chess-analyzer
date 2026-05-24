import { useState, useEffect, useRef, useCallback } from 'react'
import type { StockfishResult, AnalysisLine } from '../types'

const DEFAULT_RESULT: StockfishResult = {
  bestMove: null,
  evaluation: 0,
  mate: null,
  lines: [],
  depth: 0,
  isCalculating: false,
}

export function useStockfish(depth = 18, multiPV = 3) {
  const [result, setResult] = useState<StockfishResult>(DEFAULT_RESULT)
  const workerRef = useRef<Worker | null>(null)
  const pendingLines = useRef<Map<number, AnalysisLine>>(new Map())
  const currentFenRef = useRef<string>('')

  useEffect(() => {
    const worker = new Worker(`${import.meta.env.BASE_URL}stockfish.js`)
    workerRef.current = worker

    worker.postMessage('uci')
    worker.postMessage(`setoption name MultiPV value ${multiPV}`)
    worker.postMessage('isready')

    worker.onmessage = (e: MessageEvent<string>) => {
      const line = e.data
      if (!line) return

      if (line.startsWith('info') && line.includes('score')) {
        const depthMatch = line.match(/depth (\d+)/)
        const pvMatch = line.match(/ pv (.+)/)
        const multipvMatch = line.match(/multipv (\d+)/)
        const scoreMatch = line.match(/score cp (-?\d+)/)
        const mateMatch = line.match(/score mate (-?\d+)/)

        const lineDepth = depthMatch ? parseInt(depthMatch[1]) : 0
        const pvIndex = multipvMatch ? parseInt(multipvMatch[1]) : 1
        const moves = pvMatch ? pvMatch[1].trim().split(' ') : []
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
        const mate = mateMatch ? parseInt(mateMatch[1]) : null

        if (lineDepth > 0 && moves.length > 0) {
          const existing = pendingLines.current.get(pvIndex)
          if (!existing || lineDepth >= existing.depth) {
            pendingLines.current.set(pvIndex, { moves, score, mate, depth: lineDepth })
          }
        }
      }

      if (line.startsWith('bestmove')) {
        const parts = line.split(' ')
        const bestMove = parts[1] !== '(none)' ? parts[1] : null
        const lines = Array.from(pendingLines.current.values()).sort((a, b) =>
          b.score - a.score
        )
        const primary = lines[0]

        setResult({
          bestMove,
          evaluation: primary?.score ?? 0,
          mate: primary?.mate ?? null,
          lines,
          depth: primary?.depth ?? 0,
          isCalculating: false,
        })
      }
    }

    return () => {
      worker.postMessage('quit')
      worker.terminate()
    }
  }, [multiPV])

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage(`setoption name MultiPV value ${multiPV}`)
    }
  }, [multiPV])

  const analyze = useCallback((fen: string) => {
    if (!workerRef.current) return
    currentFenRef.current = fen
    pendingLines.current.clear()
    setResult(prev => ({ ...prev, isCalculating: true, bestMove: null, lines: [] }))
    workerRef.current.postMessage('stop')
    workerRef.current.postMessage(`position fen ${fen}`)
    workerRef.current.postMessage(`go depth ${depth}`)
  }, [depth])

  const stop = useCallback(() => {
    workerRef.current?.postMessage('stop')
  }, [])

  return { result, analyze, stop }
}
