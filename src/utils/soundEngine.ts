let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // audio not supported
  }
}

export const SoundEngine = {
  move() { playTone(880, 0.08, 'square', 0.1) },
  capture() { playTone(440, 0.12, 'sawtooth', 0.12) },
  check() {
    playTone(1100, 0.1, 'sine', 0.15)
    setTimeout(() => playTone(1100, 0.1, 'sine', 0.15), 150)
  },
  gameEnd() {
    playTone(523, 0.2)
    setTimeout(() => playTone(659, 0.2), 200)
    setTimeout(() => playTone(784, 0.4), 400)
  },
}
