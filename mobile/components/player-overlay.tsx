import { useEvent } from 'expo'
import { VideoPlayer } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { formatViewers } from '../lib/streamplace'

type Props = {
  player: VideoPlayer
  viewerCount?: number
  live?: boolean
}

function fmt(s: number): string {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const total = Math.floor(s)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function PlayerOverlay({ player, viewerCount, live = true }: Props) {
  const playing = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })
  const status = useEvent(player, 'statusChange', { status: player.status })

  const [visible, setVisible] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(player.muted)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(player.currentTime ?? 0)
      setDuration(Number.isFinite(player.duration) ? player.duration : 0)
    }, 500)
    return () => clearInterval(id)
  }, [player])

  const bump = () => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 2500)
  }

  useEffect(() => {
    bump()
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const togglePlay = () => {
    if (playing.isPlaying) player.pause()
    else player.play()
    bump()
  }

  const toggleMute = () => {
    const next = !muted
    player.muted = next
    setMuted(next)
    bump()
  }

  return (
    <Pressable
      onPress={bump}
      className="absolute inset-0"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <View
        pointerEvents="box-none"
        className="absolute inset-0 flex-col justify-between bg-black/20"
      >
        <View className="flex-row items-center justify-between p-3">
          {live ? (
            <View className="flex-row items-center gap-1.5 rounded bg-rose-600 px-2 py-1">
              <View className="h-1.5 w-1.5 rounded-full bg-white" />
              <Text className="text-[11px] font-bold uppercase tracking-wider text-white">
                Live
              </Text>
            </View>
          ) : (
            <View />
          )}
          {viewerCount !== undefined && (
            <View className="rounded bg-black/60 px-2 py-1">
              <Text className="text-xs text-white">
                {formatViewers(viewerCount)} watching
              </Text>
            </View>
          )}
        </View>

        <View className="flex-col gap-2 px-3 pb-3">
          {!live && duration > 0 && (
            <View className="flex-row items-center gap-2">
              <Text className="font-mono text-xs text-white">
                {fmt(currentTime)}
              </Text>
              <View className="flex-1 h-1 rounded-full bg-white/20">
                <View
                  className="h-full rounded-full bg-violet-400"
                  style={{
                    width: `${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%`,
                  }}
                />
              </View>
              <Text className="font-mono text-xs text-zinc-300">
                {fmt(duration)}
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={togglePlay}
              className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            >
              <Text className="text-sm text-white">
                {playing.isPlaying ? '❚❚' : '▶'}
              </Text>
            </Pressable>
            <Pressable
              onPress={toggleMute}
              className="h-9 w-9 items-center justify-center rounded-full"
            >
              <Text className="text-sm text-white">{muted ? '🔇' : '🔊'}</Text>
            </Pressable>
            <View className="ml-auto flex-row gap-1">
              <Pressable
                onPress={() => player.enterFullscreen()}
                className="h-9 w-9 items-center justify-center rounded-full"
              >
                <Text className="text-sm text-white">⛶</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
