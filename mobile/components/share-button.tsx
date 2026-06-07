import { useState } from 'react'
import { Pressable, Share, Text } from 'react-native'

type Props = { handle: string; title?: string }

export function ShareButton({ handle, title }: Props) {
  const [copied, setCopied] = useState(false)

  const onPress = async () => {
    const url = `https://stream.place/channel/${handle}`
    try {
      await Share.share({
        message: title ? `${title}\n${url}` : url,
        url,
      })
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 rounded-md bg-white/5 px-3 py-2"
    >
      <Text className="text-sm font-semibold text-zinc-200">
        {copied ? 'Copied' : 'Share'}
      </Text>
    </Pressable>
  )
}
