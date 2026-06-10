import { useEffect, useState } from 'react'

export type ToastVariant = 'success' | 'info' | 'error'

interface Props {
  message: string
  onDone: () => void
  duration?: number
  variant?: ToastVariant
}

const VARIANT_STYLES: Record<ToastVariant, { icon: string; bg: string; fg: string; border: string }> = {
  success: { icon: '✓', bg: 'rgba(99,102,241,0.20)', fg: 'var(--accent-indigo)', border: 'var(--border-accent)' },
  info:    { icon: 'ℹ', bg: 'rgba(148,163,184,0.20)', fg: 'var(--text-secondary)', border: 'var(--border-muted)' },
  error:   { icon: '!', bg: 'rgba(239,68,68,0.20)', fg: '#f87171', border: 'rgba(239,68,68,0.35)' },
}

export default function Toast({ message, onDone, duration = 1800, variant = 'success' }: Props) {
  const v = VARIANT_STYLES[variant]
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
          border: `1px solid ${v.border}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.10), var(--glow-indigo)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
          style={{
            background: v.bg,
            color: v.fg,
          }}
        >{v.icon}</span>
        {message}
      </div>
    </div>
  )
}
