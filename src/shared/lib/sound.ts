/**
 * Web Audio API synthesized audio utilities.
 * Generates lightweight, zero-latency micro-interaction sound effects using oscillators.
 */

const MUTE_KEY = "sound-muted"
const MUTE_EVENT = "sound-mute-change"

let muted = false
if (typeof window !== "undefined") {
  try {
    muted = localStorage.getItem(MUTE_KEY) === "1"
  } catch {
    // Ignore storage errors in private browsing or constrained environments
  }
}

export function isSoundMuted(): boolean {
  return muted
}

export function setSoundMuted(value: boolean): void {
  muted = value
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MUTE_KEY, value ? "1" : "0")
    } catch {
      // Ignore storage errors
    }
    window.dispatchEvent(new CustomEvent(MUTE_EVENT))
  }
}

export function toggleSoundMuted(): boolean {
  setSoundMuted(!muted)
  return muted
}

export function subscribeSoundMuted(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(MUTE_EVENT, callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === MUTE_KEY) callback()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(MUTE_EVENT, callback)
    window.removeEventListener("storage", onStorage)
  }
}

let audioCtx: AudioContext | null = null

function initAudio(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

if (typeof window !== "undefined") {
  const unlock = () => {
    initAudio()
    window.removeEventListener("pointerdown", unlock)
    window.removeEventListener("keydown", unlock)
    window.removeEventListener("touchstart", unlock)
  }
  window.addEventListener("pointerdown", unlock, { passive: true })
  window.addEventListener("keydown", unlock, { passive: true })
  window.addEventListener("touchstart", unlock, { passive: true })
}

export function getAudioContext(): AudioContext | null {
  return initAudio()
}

export function playHoverSound(volume = 0.08, pitch = 1.2): void {
  if (muted) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(1400 * pitch, now)
    osc.frequency.exponentialRampToValueAtTime(350 * pitch, now + 0.012)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.012)
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function playClickSound(volume = 0.15, pitch = 1.0): void {
  if (muted) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "triangle"
    osc.frequency.setValueAtTime(850 * pitch, now)
    osc.frequency.exponentialRampToValueAtTime(160 * pitch, now + 0.02)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.02)
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function playTickSound(volume = 0.08, pitch = 1.5): void {
  if (muted) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(1800 * pitch, now)
    osc.frequency.exponentialRampToValueAtTime(450 * pitch, now + 0.01)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.01)
  } catch {
    // AudioContext blocked or unsupported
  }
}
