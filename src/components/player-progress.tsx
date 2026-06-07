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
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function PlayerProgress({ currentTime, duration, onSeek }: Props) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs tabular-nums text-zinc-200">
        {fmt(currentTime)}
      </span>
      <div className="relative flex-1">
        <div className="h-1 w-full rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-violet-400"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Seek"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-zinc-400">
        {fmt(duration)}
      </span>
    </div>
  )
}
