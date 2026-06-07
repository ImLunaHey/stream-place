import { useEffect, useState } from 'react'
import type { HlsStats } from '../hooks/use-hls'

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
    <div className="pointer-events-none absolute left-3 top-12 z-30 rounded-md bg-black/70 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-zinc-200 ring-1 ring-white/10">
      <div>
        Resolution: {stats.width}×{stats.height}
      </div>
      <div>
        Level:{' '}
        {stats.currentLevel < 0 ? 'auto' : `#${stats.currentLevel}`}
      </div>
      <div>Bitrate: {stats.bitrateKbps} kbps</div>
      <div>Buffer: {stats.bufferSeconds.toFixed(1)}s</div>
      <div>Live lag: {liveLagSeconds.toFixed(1)}s</div>
      <div>Dropped: {stats.droppedFrames}</div>
    </div>
  )
}
