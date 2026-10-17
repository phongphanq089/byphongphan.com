import { create } from "zustand"

import { DEFAULT_TRACKS } from "../data/tracks"
import type { MusicTrack } from "../types"

export interface MusicState {
  tracks: MusicTrack[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  loop: boolean
  isOpen: boolean
  isPlaylistCollapsed: boolean

  // Computed helper
  getCurrentTrack: () => MusicTrack | null

  // Actions
  play: () => void
  pause: () => void
  togglePlay: () => void
  nextTrack: (autoPlay?: boolean) => void
  prevTrack: (autoPlay?: boolean) => void
  selectTrack: (index: number) => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleLoop: () => void
  setIsOpen: (isOpen: boolean) => void
  toggleOpen: () => void
  togglePlaylistCollapsed: () => void
  setIsPlaylistCollapsed: (isPlaylistCollapsed: boolean) => void
}

let audioInstance: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null
  if (!audioInstance) {
    audioInstance = new Audio()
    audioInstance.preload = "metadata"
    audioInstance.volume = 0.5

    audioInstance.addEventListener("play", () => {
      useMusicStore.setState({ isPlaying: true })
    })

    audioInstance.addEventListener("pause", () => {
      useMusicStore.setState({ isPlaying: false })
    })

    audioInstance.addEventListener("timeupdate", () => {
      if (audioInstance) {
        useMusicStore.setState({ currentTime: audioInstance.currentTime })
      }
    })

    audioInstance.addEventListener("loadedmetadata", () => {
      if (audioInstance) {
        useMusicStore.setState({ duration: audioInstance.duration || 0 })
      }
    })

    audioInstance.addEventListener("ended", () => {
      const state = useMusicStore.getState()
      if (state.tracks.length === 0) return

      // Automatically advance to next track and play when current song ends
      if (state.loop || state.currentIndex < state.tracks.length - 1) {
        state.nextTrack(true)
      } else {
        useMusicStore.setState({ isPlaying: false, currentTime: 0 })
      }
    })

    // Load initial track source
    const initialTrack = DEFAULT_TRACKS[0]
    if (initialTrack) {
      audioInstance.src = initialTrack.src
    }
  }
  return audioInstance
}

function loadAndPlayTrack(src: string, autoPlay: boolean) {
  const audio = getAudio()
  if (!audio) return
  audio.src = src
  audio.load()
  useMusicStore.setState({ currentTime: 0 })
  if (autoPlay) {
    audio.play().catch(() => {
      // Browser autoplay may be blocked before user interaction
    })
  }
}

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: DEFAULT_TRACKS,
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  isMuted: false,
  loop: true,
  isOpen: false,
  isPlaylistCollapsed: true,

  getCurrentTrack: () => {
    const { tracks, currentIndex } = get()
    return tracks[currentIndex] ?? null
  },

  play: () => {
    const audio = getAudio()
    if (!audio) return
    const { tracks, currentIndex } = get()
    const currentTrack = tracks[currentIndex]
    if (currentTrack && (!audio.src || !audio.src.includes(currentTrack.src))) {
      audio.src = currentTrack.src
    }
    audio.play().catch(() => {})
  },

  pause: () => {
    const audio = getAudio()
    if (!audio) return
    audio.pause()
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get()
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  },

  nextTrack: (autoPlay?: boolean) => {
    const { tracks, currentIndex, isPlaying } = get()
    if (tracks.length === 0) return
    const shouldPlay = autoPlay !== undefined ? autoPlay : isPlaying
    const nextIndex = (currentIndex + 1) % tracks.length
    set({ currentIndex: nextIndex })
    const nextTrack = tracks[nextIndex]
    if (nextTrack) {
      loadAndPlayTrack(nextTrack.src, shouldPlay)
    }
  },

  prevTrack: (autoPlay?: boolean) => {
    const { tracks, currentIndex, isPlaying } = get()
    if (tracks.length === 0) return
    const shouldPlay = autoPlay !== undefined ? autoPlay : isPlaying
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
    set({ currentIndex: prevIndex })
    const prevTrack = tracks[prevIndex]
    if (prevTrack) {
      loadAndPlayTrack(prevTrack.src, shouldPlay)
    }
  },

  selectTrack: (index: number) => {
    const { tracks } = get()
    if (index >= 0 && index < tracks.length) {
      set({ currentIndex: index })
      const track = tracks[index]
      if (track) {
        loadAndPlayTrack(track.src, true)
      }
    }
  },

  seek: (time: number) => {
    const audio = getAudio()
    if (!audio) return
    audio.currentTime = time
    set({ currentTime: time })
  },

  setVolume: (vol: number) => {
    const clamped = Math.min(Math.max(vol, 0), 1)
    const audio = getAudio()
    if (audio) {
      audio.volume = clamped
      if (clamped > 0 && audio.muted) {
        audio.muted = false
        set({ isMuted: false })
      }
    }
    set({ volume: clamped })
  },

  toggleMute: () => {
    const audio = getAudio()
    if (!audio) return
    const nextMuted = !audio.muted
    audio.muted = nextMuted
    set({ isMuted: nextMuted })
  },

  toggleLoop: () => {
    set((state) => ({ loop: !state.loop }))
  },

  setIsOpen: (isOpen: boolean) => {
    set({ isOpen })
  },

  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  togglePlaylistCollapsed: () => {
    set((state) => ({ isPlaylistCollapsed: !state.isPlaylistCollapsed }))
  },

  setIsPlaylistCollapsed: (isPlaylistCollapsed: boolean) => {
    set({ isPlaylistCollapsed })
  },
}))

// Backward compatibility hook
export function useMusic() {
  const store = useMusicStore()
  const currentTrack = store.tracks[store.currentIndex] ?? null
  return {
    ...store,
    currentTrack,
    selectTrack: store.selectTrack,
    nextTrack: store.nextTrack,
    prevTrack: store.prevTrack,
  }
}
