import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import type { HlsLevel } from '../hooks/use-hls'
import { LiveIndicator } from './live-indicator'
import { PlayerKebab } from './player-kebab'
import { PlayerProgress } from './player-progress'
import { PlayerSettingsCog } from './player-settings-cog'

type Props = {
  visible: boolean
  live: boolean
  playing: boolean
  muted: boolean
  volume: number
  fullscreen: boolean
  behindLive: boolean
  liveLagSeconds: number
  currentTime: number
  duration: number
  viewerCount?: number
  levels?: HlsLevel[]
  currentLevel: number
  lowLatency: boolean
  showDebug: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (v: number) => void
  onToggleFullscreen: () => void
  onGoLive: () => void
  onSeek: (time: number) => void
  onSetLevel: (index: number) => void
  onToggleLowLatency: () => void
  onToggleDebug: () => void
  onReportStream?: () => void
  onReportUser?: () => void
}

function formatViewers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function PlayerControls({
  visible,
  live,
  playing,
  muted,
  volume,
  fullscreen,
  behindLive,
  liveLagSeconds,
  currentTime,
  duration,
  viewerCount,
  levels,
  currentLevel,
  lowLatency,
  showDebug,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  onGoLive,
  onSeek,
  onSetLevel,
  onToggleLowLatency,
  onToggleDebug,
  onReportStream,
  onReportUser,
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-3 p-3">
        {live ? (
          <LiveIndicator
            behindLive={behindLive}
            lagSeconds={liveLagSeconds}
            onGoLive={onGoLive}
          />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {viewerCount !== undefined && (
            <div className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {formatViewers(viewerCount)} watching
            </div>
          )}
          {(onReportStream || onReportUser) && (
            <PlayerKebab
              onReportStream={onReportStream ?? (() => {})}
              onReportUser={onReportUser ?? (() => {})}
            />
          )}
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col gap-2 px-3 pb-3">
        {!live && duration > 0 && (
          <PlayerProgress
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20"
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              type="button"
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/10"
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="h-1 w-24 cursor-pointer accent-white"
              aria-label="Volume"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <PlayerSettingsCog
              levels={levels}
              currentLevel={currentLevel}
              lowLatency={lowLatency}
              showDebug={showDebug}
              onSetLevel={onSetLevel}
              onToggleLowLatency={onToggleLowLatency}
              onToggleDebug={onToggleDebug}
            />
            <button
              onClick={onToggleFullscreen}
              type="button"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/10"
            >
              {fullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
