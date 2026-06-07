import { EllipsisVertical, Flag, UserX } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

type Props = {
  onReportStream: () => void
  onReportUser: () => void
}

export function PlayerKebab({ onReportStream, onReportUser }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        aria-label="More options"
        className="h-9 w-9 items-center justify-center rounded-full"
      >
        <EllipsisVertical size={16} color="#fff" />
      </Pressable>
      {open && (
        <View
          className="absolute right-0 w-52 overflow-hidden rounded-lg bg-zinc-950"
          style={{
            top: 40,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            zIndex: 40,
          }}
        >
          <Pressable
            onPress={() => {
              setOpen(false)
              onReportStream()
            }}
            className="flex-row items-center gap-2 px-3 py-2"
          >
            <Flag size={14} color="#e4e4e7" />
            <Text className="text-sm text-zinc-200">Report livestream</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false)
              onReportUser()
            }}
            className="flex-row items-center gap-2 border-t border-white/5 px-3 py-2"
          >
            <UserX size={14} color="#e4e4e7" />
            <Text className="text-sm text-zinc-200">Report user</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
