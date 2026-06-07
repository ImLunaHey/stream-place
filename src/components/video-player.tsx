import { useEffect, useRef, useState } from 'react'
import { useHls } from '../hooks/use-hls'
import { usePlayerState } from '../hooks/use-player-state'
import { PlayerControls } from './player-controls'
import { PlayerDebugOverlay } from './player-debug-overlay'

type Props = {
  src: string
  poster?: string
  viewerCount?: number
  live?: boolean
  className?: string
  onReportStream?: () => void
  onReportUser?: () => void
}

export function VideoPlayer({
  src,
  poster,
  viewerCount,
  live = true,
  className,
  onReportStream,
  onReportUser,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [lowLatency, setLowLatency] = useState(live)
  const {
    error,
    seekToLive,
    getLiveEdge,
    levels,
    currentLevel,
    setLevel,
    getStats,
  } = useHls(videoRef, src, { lowLatency: live && lowLatency })
  const state = usePlayerState(videoRef, containerRef, getLiveEdge)

  const [controlsVisible, setControlsVisible] = useState(true)
  const [showDebug, setShowDebug] = useState(false)
  const hideTimer = useRef<number | null>(null)

  const bumpControls = () => {
    setControlsVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2500)
  }

  useEffect(() => {
    bumpControls()
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
  }

  const setVolume = (val: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    v.muted = val === 0
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement === el) document.exitFullscreen()
    else el.requestFullscreen().catch(() => {})
  }

  const seek = (time: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = time
  }

  return (
    <div
      ref={containerRef}
      className={`group/player relative ${className ?? ''}`}
      onMouseMove={bumpControls}
      onMouseLeave={() => state.playing && setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={live}
        playsInline
        muted={live}
        onClick={togglePlay}
        className="h-full w-full cursor-pointer bg-black"
      />

      {showDebug && (
        <PlayerDebugOverlay
          getStats={getStats}
          liveLagSeconds={state.liveLagSeconds}
        />
      )}

      <PlayerControls
        visible={controlsVisible || !state.playing}
        live={live}
        playing={state.playing}
        muted={state.muted}
        volume={state.volume}
        fullscreen={state.fullscreen}
        behindLive={state.behindLive}
        liveLagSeconds={state.liveLagSeconds}
        currentTime={state.currentTime}
        duration={state.duration}
        viewerCount={viewerCount}
        levels={levels}
        currentLevel={currentLevel}
        lowLatency={lowLatency}
        showDebug={showDebug}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
        onToggleFullscreen={toggleFullscreen}
        onGoLive={seekToLive}
        onSeek={seek}
        onSetLevel={setLevel}
        onToggleLowLatency={() => setLowLatency((v) => !v)}
        onToggleDebug={() => setShowDebug((v) => !v)}
        onReportStream={onReportStream}
        onReportUser={onReportUser}
      />

      {error && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-rose-950/80 px-3 py-2 text-xs text-rose-200">
          Playback error: {error}
        </div>
      )}
    </div>
  )
}
