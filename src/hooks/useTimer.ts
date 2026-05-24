import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialTime: number, enabled: boolean) {
  const [whiteTime, setWhiteTime] = useState(initialTime)
  const [blackTime, setBlackTime] = useState(initialTime)
  const [activeColor, setActiveColor] = useState<'w' | 'b'>('w')
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || !running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      if (activeColor === 'w') {
        setWhiteTime(t => Math.max(0, t - 1))
      } else {
        setBlackTime(t => Math.max(0, t - 1))
      }
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, running, activeColor])

  const switchColor = useCallback((color: 'w' | 'b') => {
    setActiveColor(color)
  }, [])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setWhiteTime(initialTime)
    setBlackTime(initialTime)
    setActiveColor('w')
  }, [initialTime])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    whiteTime,
    blackTime,
    activeColor,
    running,
    start,
    pause,
    reset,
    switchColor,
    formatTime,
    whiteLow: whiteTime < 30,
    blackLow: blackTime < 30,
  }
}
