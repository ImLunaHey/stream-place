import { useMemo } from 'react'
import { Image, Text, View } from 'react-native'
import { useGlobalEmotes } from '../hooks/use-global-emotes'
import type { Emote } from '../lib/emotes'

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'emote'; emote: Emote }

function tokenize(text: string, emotes: Map<string, Emote>): Token[] {
  if (emotes.size === 0) return [{ kind: 'text', value: text }]
  const parts = text.split(/(\s+)/)
  const out: Token[] = []
  let buf = ''
  for (const part of parts) {
    const hit = emotes.get(part)
    if (hit) {
      if (buf) {
        out.push({ kind: 'text', value: buf })
        buf = ''
      }
      out.push({ kind: 'emote', emote: hit })
    } else {
      buf += part
    }
  }
  if (buf) out.push({ kind: 'text', value: buf })
  return out
}

export function ChatText({ text }: { text: string }) {
  const { data: emotes } = useGlobalEmotes()
  const tokens = useMemo(
    () => tokenize(text, emotes ?? new Map()),
    [text, emotes],
  )

  return (
    <View className="flex-row flex-wrap items-center">
      {tokens.map((t, i) =>
        t.kind === 'text' ? (
          <Text key={i} className="text-sm text-zinc-100">
            {t.value}
          </Text>
        ) : (
          <Image
            key={i}
            source={{ uri: t.emote.url }}
            style={{ width: 24, height: 24, marginHorizontal: 1 }}
            resizeMode="contain"
          />
        ),
      )}
    </View>
  )
}
