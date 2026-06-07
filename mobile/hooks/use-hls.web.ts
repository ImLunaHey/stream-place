import Hls from 'hls.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export type HlsLevel = {
  index: number
  height: number
  width: number
  bitrate: number
  name?: string
  audioOnly: boolean
}

export type HlsStats = {
  width: number
  height: number
  bitrateKbps: number
  bufferSeconds: number
  droppedFrames: number
  currentLevel: number
}

export type HlsControls = {
  error: string | null
  seekToLive: () => void
  getLiveEdge: () => number | null
  levels: HlsLevel[]
  currentLevel: number
  setLevel: (index: number) => void
  getStats: () => HlsStats
}

export type UseHlsOptions = { lowLatency?: boolean }

export function useHls(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string | null,
  options: UseHlsOptions = {},
): HlsControls {
  const { lowLatency = true } = options
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [levels, setLevels] = useState<HlsLevel[]>([])
  const [currentLevel, setCurrentLevel] = useState(-1)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    setError(null)
    setLevels([])
    setCurrentLevel(-1)
    let hls: Hls | null = null

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    } else if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: lowLatency,
        liveSyncDurationCount: lowLatency ? 3 : 6,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!hls) return
        setLevels(
          hls.levels.map((l, i) => ({
            index: i,
            height: l.height ?? 0,
            width: l.width ?? 0,
            bitrate: l.bitrate ?? 0,
            name: l.name,
            audioOnly: !l.height && !l.width,
          })),
        )
      })
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        setCurrentLevel(data.level)
      })
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError(data.details ?? data.type)
      })
      hlsRef.current = hls
    } else {
      setError('HLS not supported in this browser')
    }

    return () => {
      hls?.destroy()
      hlsRef.current = null
      video.removeAttribute('src')
      video.load()
    }
  }, [src, lowLatency, videoRef])

  const getLiveEdge = useCallback(() => {
    if (hlsRef.current && Number.isFinite(hlsRef.current.liveSyncPosition))
      return hlsRef.current.liveSyncPosition as number
    const video = videoRef.current
    if (video && video.seekable.length > 0)
      return video.seekable.end(video.seekable.length - 1)
    return null
  }, [videoRef])

  const seekToLive = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const edge = getLiveEdge()
    if (edge != null) video.currentTime = edge
    video.play().catch(() => {})
  }, [getLiveEdge, videoRef])

  const setLevel = useCallback((index: number) => {
    const hls = hlsRef.current
    if (!hls) return
    hls.currentLevel = index
  }, [])

  const getStats = useCallback((): HlsStats => {
    const video = videoRef.current
    const hls = hlsRef.current
    const level =
      hls?.currentLevel != null && hls.currentLevel >= 0
        ? hls.levels[hls.currentLevel]
        : null
    let buffer = 0
    if (video && video.buffered.length > 0) {
      const end = video.buffered.end(video.buffered.length - 1)
      buffer = Math.max(0, end - video.currentTime)
    }
    let dropped = 0
    if (video?.getVideoPlaybackQuality) {
      dropped = video.getVideoPlaybackQuality().droppedVideoFrames ?? 0
    }
    return {
      width: video?.videoWidth ?? 0,
      height: video?.videoHeight ?? 0,
      bitrateKbps: level ? Math.round(level.bitrate / 1000) : 0,
      bufferSeconds: buffer,
      droppedFrames: dropped,
      currentLevel: hls?.currentLevel ?? -1,
    }
  }, [videoRef])

  return {
    error,
    seekToLive,
    getLiveEdge,
    levels,
    currentLevel,
    setLevel,
    getStats,
  }
}
