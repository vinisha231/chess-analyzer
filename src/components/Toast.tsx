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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="bg-gray-700 border border-gray-600 text-white text-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
        <span className="text-green-400">✓</span>
        {message}
      </div>
    </div>
  )
}
