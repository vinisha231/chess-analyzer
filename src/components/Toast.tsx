import { useEffect, useState } from 'react'

interface Props {
  message: string
  onDone: () => void
  duration?: number
}

export default function Toast({ message, onDone, duration = 1800 }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), duration - 300)
    const doneTimer = setTimeout(onDone, duration)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [duration, onDone])

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      style={{
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? '0' : '6px'})`,
      }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.10), var(--glow-indigo)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(99,102,241,0.20)',
            color: 'var(--accent-indigo)',
          }}
        >✓</span>
        {message}
      </div>
    </div>
  )
}
