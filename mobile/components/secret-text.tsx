import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

export function SecretText({ value }: { value: string }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <View className="flex-row items-center gap-2 rounded-md bg-zinc-900 p-2">
      <Text
        className="flex-1 font-mono text-xs text-zinc-200"
        numberOfLines={1}
      >
        {revealed ? value : value.replace(/./g, '•')}
      </Text>
      <Pressable
        onPress={() => setRevealed((v) => !v)}
        className="rounded-md px-2 py-1"
      >
        <Text className="text-xs font-semibold text-zinc-300">
          {revealed ? 'Hide' : 'Show'}
        </Text>
      </Pressable>
      <Pressable
        onPress={onCopy}
        className="rounded-md bg-white/10 px-2 py-1"
      >
        <Text className="text-xs font-semibold text-zinc-200">
          {copied ? '✓' : 'Copy'}
        </Text>
      </Pressable>
    </View>
  )
}
