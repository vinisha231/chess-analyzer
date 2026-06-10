import { useEffect, useRef, useCallback, useState } from 'react'

export type BotLevel = 1 | 2 | 3 | 4 | 5

/** Maps a friendly bot level to Stockfish skill + search limits. */
export const BOT_LEVELS: Record<BotLevel, { label: string; skill: number; depth: number; movetime: number; elo: string }> = {
  1: { label: 'Beginner',     skill: 1,  depth: 2,  movetime: 120, elo: '~800' },
  2: { label: 'Casual',       skill: 5,  depth: 4,  movetime: 200, elo: '~1200' },
  3: { label: 'Intermediate', skill: 10, depth: 8,  movetime: 350, elo: '~1600' },
  4: { label: 'Advanced',     skill: 15, depth: 12, movetime: 600, elo: '~2000' },
  5: { label: 'Master',       skill: 20, depth: 16, movetime: 900, elo: '~2400+' },
}

/**
 * A dedicated Stockfish worker that plays moves as an opponent,
 * independent of the analysis engine so both can run side by side.
 */
export function useEngineOpponent(level: BotLevel) {
  const workerRef = useRef<Worker | null>(null)
  const resolveRef = useRef<((move: string | null) => void) | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    const worker = new Worker(`${import.meta.env.BASE_URL}stockfish.js`)
    workerRef.current = worker
    worker.postMessage('uci')
    worker.postMessage('isready')

    worker.onmessage = (e: MessageEvent<string>) => {
      const line = e.data
      if (typeof line !== 'string' || !line.startsWith('bestmove')) return
      const move = line.split(' ')[1]
      setIsThinking(false)
      resolveRef.current?.(move && move !== '(none)' ? move : null)
      resolveRef.current = null
    }

    return () => {
      worker.postMessage('quit')
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    workerRef.current?.postMessage(`setoption name Skill Level value ${BOT_LEVELS[level].skill}`)
  }, [level])

  const requestMove = useCallback((fen: string): Promise<string | null> => {
    const worker = workerRef.current
    if (!worker) return Promise.resolve(null)
    return new Promise(resolve => {
      resolveRef.current = resolve
      setIsThinking(true)
      const { depth, movetime } = BOT_LEVELS[level]
      worker.postMessage(`position fen ${fen}`)
      worker.postMessage(`go depth ${depth} movetime ${movetime}`)
    })
  }, [level])

  return { requestMove, isThinking }
}
