import { Check, Cog } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { HlsLevel } from '../hooks/use-hls.web'

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
  const ref = useRef<View>(null)
  const safeLevels = levels ?? []

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const items: Array<{ index: number; label: string }> = [
    { index: -1, label: 'Auto' },
    ...safeLevels.map((l) => ({ index: l.index, label: levelLabel(l) })),
  ]

  return (
    <View ref={ref} style={{ position: 'relative' }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        aria-label="Player settings"
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: 'transparent' }}
      >
        <Cog size={16} color="#fff" />
      </Pressable>
      {open && (
        <View
          className="absolute right-0 w-56 overflow-hidden rounded-lg bg-zinc-950"
          style={{
            bottom: 40,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            zIndex: 40,
          }}
        >
          <View className="border-b border-white/5 px-3 py-2">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Quality
            </Text>
          </View>
          {items.length === 1 ? (
            <Text className="px-3 py-2 text-xs text-zinc-500">
              No quality levels yet
            </Text>
          ) : (
            <View>
              {items.map((it) => {
                const active = currentLevel === it.index
                return (
                  <Pressable
                    key={it.index}
                    onPress={() => {
                      onSetLevel(it.index)
                      setOpen(false)
                    }}
                    className="flex-row items-center justify-between px-3 py-1.5"
                    style={{
                      backgroundColor: active
                        ? 'rgba(255,255,255,0.1)'
                        : 'transparent',
                    }}
                  >
                    <Text
                      className={`text-sm ${active ? 'text-white' : 'text-zinc-200'}`}
                    >
                      {it.label}
                    </Text>
                    {active && <Check size={14} color="#fff" />}
                  </Pressable>
                )
              })}
            </View>
          )}
          <Pressable
            onPress={onToggleLowLatency}
            className="flex-row items-center justify-between border-t border-white/5 px-3 py-2"
          >
            <Text className="text-sm text-zinc-200">Low latency</Text>
            <View
              className="h-4 w-4 items-center justify-center rounded"
              style={{
                backgroundColor: lowLatency ? '#ec4899' : '#27272a',
                borderWidth: 1,
                borderColor: lowLatency ? '#f472b6' : 'rgba(255,255,255,0.1)',
              }}
            >
              {lowLatency && <Check size={10} color="#fff" />}
            </View>
          </Pressable>
          <Pressable
            onPress={onToggleDebug}
            className="flex-row items-center justify-between border-t border-white/5 px-3 py-2"
          >
            <Text className="text-sm text-zinc-200">Debug info</Text>
            <View
              className="h-4 w-4 items-center justify-center rounded"
              style={{
                backgroundColor: showDebug ? '#ec4899' : '#27272a',
                borderWidth: 1,
                borderColor: showDebug ? '#f472b6' : 'rgba(255,255,255,0.1)',
              }}
            >
              {showDebug && <Check size={10} color="#fff" />}
            </View>
          </Pressable>
        </View>
      )}
    </View>
  )
}
