import { Text, View } from 'react-native'

type Props = {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
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

export function PlayerProgress({ currentTime, duration, onSeek }: Props) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-xs font-mono text-white">{fmt(currentTime)}</Text>
      <View className="relative flex-1">
        <View className="h-1 w-full overflow-hidden rounded-full bg-white/20">
          <View
            className="h-full rounded-full bg-pink-400"
            style={{ width: `${pct}%` as any }}
          />
        </View>
        {/* @ts-expect-error native input on web */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
          aria-label="Seek"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </View>
      <Text className="text-xs font-mono text-zinc-300">{fmt(duration)}</Text>
    </View>
  )
}
