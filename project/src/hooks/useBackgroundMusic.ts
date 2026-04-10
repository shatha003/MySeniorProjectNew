import { useCallback, useEffect, useRef, useState } from 'react'

const SONGS = [
  'Avicii - The Nights.mp3',
  'Daft Punk - Harder, Better, Faster, Stronger (Official Video).mp3',
  'Daft Punk - Technologic (Official Video).mp3',
  'Pharrell Williams - Happy (Official Video).mp3',
  'Sara Bareilles - Brave (Official Video).mp3',
  'Taylor Swift - Shake It Off.mp3',
  'The Chainsmokers & Coldplay - Something Just Like This (Official Lyric Video).mp3',
]

const VOLUME_KEY = 'chea-music-volume'

function getSavedVolume(): number {
  try {
    const v = localStorage.getItem(VOLUME_KEY)
    return v ? parseFloat(v) : 0.5
  } catch {
    return 0.5
  }
}

export interface SongInfo {
  title: string
  artist: string
}

function parseSongName(filename: string): SongInfo {
  const name = filename.replace(/\.mp3$/, '')
  const dashIdx = name.indexOf(' - ')
  if (dashIdx !== -1) {
    return {
      artist: name.slice(0, dashIdx).trim(),
      title: name.slice(dashIdx + 3).replace(/\(.*\)$/, '').trim(),
    }
  }
  return { title: name, artist: '' }
}

export interface UseBackgroundMusicReturn {
  isPlaying: boolean
  currentIndex: number
  volume: number
  song: SongInfo
  playlist: SongInfo[]
  toggle: () => void
  play: () => void
  pause: () => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
}

export function useBackgroundMusic(): UseBackgroundMusicReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [volume, setVolumeState] = useState(getSavedVolume)

  const playlist = SONGS.map(parseSongName)
  const song = playlist[currentIndex]

  useEffect(() => {
    const audio = new Audio(`/songs/${encodeURIComponent(SONGS[currentIndex])}`)
    audio.volume = volume
    audio.preload = 'auto'
    audioRef.current = audio

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % SONGS.length)
    }

    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audio.src = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = `/songs/${encodeURIComponent(SONGS[currentIndex])}`
    audio.volume = volume
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    try {
      localStorage.setItem(VOLUME_KEY, String(volume))
    } catch {}
  }, [volume])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SONGS.length)
  }, [])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length)
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)))
  }, [])

  return {
    isPlaying,
    currentIndex,
    volume,
    song,
    playlist,
    toggle,
    play,
    pause,
    next,
    prev,
    setVolume,
  }
}
