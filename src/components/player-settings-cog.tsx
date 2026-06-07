import { Check, Cog } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { HlsLevel } from '../hooks/use-hls'

type Props = {
  levels?: HlsLevel[]
  currentLevel: number
  lowLatency: boolean
  showDebug: boolean
  onSetLevel: (index: number) => void
  onToggleLowLatency: () => void
  onToggleDebug: () => void
}

function levelLabel(l: HlsLevel) {
  if (l.audioOnly) return 'Audio only'
  if (l.height >= 1080) return 'Source'
  if (l.height > 0) return `${l.height}p`
  if (l.name) return l.name
  return `Level ${l.index}`
}

export function PlayerSettingsCog({
  levels,
  currentLevel,
  lowLatency,
  showDebug,
  onSetLevel,
  onToggleLowLatency,
  onToggleDebug,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const safeLevels = levels ?? []

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const items: Array<{ index: number; label: string }> = [
    { index: -1, label: 'Auto' },
    ...safeLevels.map((l) => ({ index: l.index, label: levelLabel(l) })),
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Player settings"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/10"
      >
        <Cog className={`h-4 w-4 transition ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-40 mb-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-xl"
        >
          <div className="border-b border-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Quality
          </div>
          {items.length === 1 ? (
            <p className="px-3 py-2 text-xs text-zinc-500">
              No quality levels yet
            </p>
          ) : (
            <ul>
              {items.map((it) => {
                const active = currentLevel === it.index
                return (
                  <li key={it.index}>
                    <button
                      type="button"
                      onClick={() => {
                        onSetLevel(it.index)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      <span>{it.label}</span>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={onToggleLowLatency}
            className="flex w-full items-center justify-between border-t border-white/5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
          >
            <span>Low latency</span>
            <span
              className={`grid h-4 w-4 place-items-center rounded ring-1 ${
                lowLatency
                  ? 'bg-violet-500 text-white ring-violet-400'
                  : 'bg-zinc-800 ring-white/10'
              }`}
            >
              {lowLatency && <Check className="h-3 w-3" />}
            </span>
          </button>
          <button
            type="button"
            onClick={onToggleDebug}
            className="flex w-full items-center justify-between border-t border-white/5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
          >
            <span>Debug info</span>
            <span
              className={`grid h-4 w-4 place-items-center rounded ring-1 ${
                showDebug
                  ? 'bg-violet-500 text-white ring-violet-400'
                  : 'bg-zinc-800 ring-white/10'
              }`}
            >
              {showDebug && <Check className="h-3 w-3" />}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
