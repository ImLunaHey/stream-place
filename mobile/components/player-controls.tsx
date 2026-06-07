import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import type { HlsLevel } from '../hooks/use-hls.web'
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
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 20,
        opacity: visible ? 1 : 0,
        // @ts-expect-error – web CSS gradient
        backgroundImage:
          'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%, rgba(0,0,0,0.3))',
        transitionProperty: 'opacity',
        transitionDuration: '200ms',
      }}
    >
      <View
        pointerEvents="box-none"
        className="flex-row items-center justify-between p-3"
      >
        {live ? (
          <LiveIndicator
            behindLive={behindLive}
            lagSeconds={liveLagSeconds}
            onGoLive={onGoLive}
          />
        ) : (
          <View />
        )}
        <View pointerEvents="box-none" className="flex-row items-center gap-2">
          {viewerCount !== undefined && (
            <View className="rounded bg-black/60 px-2 py-1">
              <Text className="text-xs font-medium text-white">
                {formatViewers(viewerCount)} watching
              </Text>
            </View>
          )}
          {(onReportStream || onReportUser) && (
            <PlayerKebab
              onReportStream={onReportStream ?? (() => {})}
              onReportUser={onReportUser ?? (() => {})}
            />
          )}
        </View>
      </View>

      <View pointerEvents="box-none" className="flex-col gap-2 px-3 pb-3">
        {!live && duration > 0 && (
          <PlayerProgress
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        )}
        <View pointerEvents="box-none" className="flex-row items-center gap-3">
          <Pressable
            onPress={onTogglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {playing ? (
              <Pause size={14} color="#fff" />
            ) : (
              <Play size={14} color="#fff" />
            )}
          </Pressable>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={onToggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="h-9 w-9 items-center justify-center rounded-full"
            >
              {muted || volume === 0 ? (
                <VolumeX size={14} color="#fff" />
              ) : (
                <Volume2 size={14} color="#fff" />
              )}
            </Pressable>
            {/* @ts-expect-error native input on web */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) =>
                onVolumeChange(Number((e.target as HTMLInputElement).value))
              }
              aria-label="Volume"
              style={{
                width: 96,
                height: 4,
                accentColor: '#fff',
                cursor: 'pointer',
              }}
            />
          </View>

          <View
            className="flex-row items-center gap-1"
            style={{ marginLeft: 'auto' }}
          >
            <PlayerSettingsCog
              levels={levels}
              currentLevel={currentLevel}
              lowLatency={lowLatency}
              showDebug={showDebug}
              onSetLevel={onSetLevel}
              onToggleLowLatency={onToggleLowLatency}
              onToggleDebug={onToggleDebug}
            />
            <Pressable
              onPress={onToggleFullscreen}
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="h-9 w-9 items-center justify-center rounded-full"
            >
              {fullscreen ? (
                <Minimize size={14} color="#fff" />
              ) : (
                <Maximize size={14} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}
