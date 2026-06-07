import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { useHls } from '../hooks/use-hls.web'
import { usePlayerState } from '../hooks/use-player-state.web'
import { PlayerControls } from './player-controls'
import { PlayerDebugOverlay } from './player-debug-overlay'

type Props = {
  src: string | null
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  live?: boolean
  viewerCount?: number
  onReportStream?: () => void
  onReportUser?: () => void
}

export function Player({
  src,
  poster,
  autoPlay = true,
  muted = true,
  live = true,
  viewerCount,
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
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const bumpControls = () => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2500)
  }

  useEffect(() => {
    bumpControls()
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
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

  if (!src) return <View style={{ width: '100%', height: '100%' }} />

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* @ts-expect-error HTML video + div on web */}
      <div
        ref={containerRef}
        onMouseMove={bumpControls}
        onMouseLeave={() => state.playing && setControlsVisible(false)}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* @ts-expect-error HTML video element */}
        <video
          ref={videoRef}
          poster={poster}
          autoPlay={live ? autoPlay : false}
          playsInline
          muted={live ? muted : false}
          onClick={togglePlay}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            cursor: 'pointer',
          }}
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
          <View
            className="absolute inset-x-0 bottom-0 bg-rose-950/80 px-3 py-2"
            style={{ zIndex: 30 }}
          >
            <Text className="text-xs text-rose-200">Playback error: {error}</Text>
          </View>
        )}
      {/* @ts-expect-error – closing div */}
      </div>
    </View>
  )
}
