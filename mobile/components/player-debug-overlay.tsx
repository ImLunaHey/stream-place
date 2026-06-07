import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import type { HlsStats } from '../hooks/use-hls.web'

type Props = {
  getStats: () => HlsStats
  liveLagSeconds: number
}

export function PlayerDebugOverlay({ getStats, liveLagSeconds }: Props) {
  const [stats, setStats] = useState<HlsStats>(() => getStats())

  useEffect(() => {
    const id = window.setInterval(() => setStats(getStats()), 500)
    return () => window.clearInterval(id)
  }, [getStats])

  return (
    <View
      pointerEvents="none"
      className="absolute left-3 top-12 rounded-md bg-black/70 px-2 py-1.5"
      style={{ zIndex: 30 }}
    >
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Resolution: ${stats.width}×${stats.height}`}
      </Text>
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Level: ${stats.currentLevel < 0 ? 'auto' : `#${stats.currentLevel}`}`}
      </Text>
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Bitrate: ${stats.bitrateKbps} kbps`}
      </Text>
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Buffer: ${stats.bufferSeconds.toFixed(1)}s`}
      </Text>
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Live lag: ${liveLagSeconds.toFixed(1)}s`}
      </Text>
      <Text className="font-mono text-[10px] leading-relaxed text-zinc-200">
        {`Dropped: ${stats.droppedFrames}`}
      </Text>
    </View>
  )
}
