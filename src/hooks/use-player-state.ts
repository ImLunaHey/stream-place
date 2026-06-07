import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export type PlayerState = {
  playing: boolean
  muted: boolean
  volume: number
  fullscreen: boolean
  behindLive: boolean
  liveLagSeconds: number
  currentTime: number
  duration: number
}

const LIVE_TOLERANCE_SECONDS = 4

export function usePlayerState(
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  getLiveEdge: () => number | null,
): PlayerState {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [behindLive, setBehindLive] = useState(false)
  const [liveLagSeconds, setLiveLagSeconds] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onVol = () => {
      setMuted(v.muted)
      setVolume(v.volume)
    }
    const onTime = () => setCurrentTime(v.currentTime)
    const onDuration = () => {
      setDuration(Number.isFinite(v.duration) ? v.duration : 0)
    }
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('volumechange', onVol)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('durationchange', onDuration)
    v.addEventListener('loadedmetadata', onDuration)
    onVol()
    onDuration()
    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('volumechange', onVol)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('durationchange', onDuration)
      v.removeEventListener('loadedmetadata', onDuration)
    }
  }, [videoRef])

  useEffect(() => {
    const onChange = () =>
      setFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [containerRef])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tick = () => {
      const edge = getLiveEdge()
      if (edge == null) {
        setBehindLive(false)
        setLiveLagSeconds(0)
        return
      }
      const lag = Math.max(0, edge - v.currentTime)
      setLiveLagSeconds(lag)
      setBehindLive(lag > LIVE_TOLERANCE_SECONDS)
    }
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [videoRef, getLiveEdge])

  return {
    playing,
    muted,
    volume,
    fullscreen,
    behindLive,
    liveLagSeconds,
    currentTime,
    duration,
  }
}
