export interface MusicTrack {
  id: string
  title: string
  artist?: string
  src: string
  artwork?: string
  duration?: number
  album?: string
}

export interface MusicContextValue {
  tracks: MusicTrack[]
  currentTrack: MusicTrack | null
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  loop: boolean
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
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
}
