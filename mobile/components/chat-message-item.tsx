import { Text, View } from 'react-native'
import { ChatText } from './chat-text'
import type { ChatMessageView } from '../lib/streamplace-extra'

function colour(msg: ChatMessageView): string {
  const c = msg.chatProfile?.color
  if (!c) return '#a5b4fc'
  const r = Math.max(0, Math.min(255, c.red))
  const g = Math.max(0, Math.min(255, c.green))
  const b = Math.max(0, Math.min(255, c.blue))
  return `rgb(${r}, ${g}, ${b})`
}

export function ChatMessageItem({ message }: { message: ChatMessageView }) {
  const name = message.author.displayName || message.author.handle
  return (
    <View className="flex-row flex-wrap items-center px-3 py-1">
      <Text style={{ color: colour(message) }} className="text-sm font-semibold">
        {name}
      </Text>
      <Text className="text-sm text-zinc-500">{': '}</Text>
      <View className="flex-shrink">
        <ChatText text={message.record.text} />
      </View>
    </View>
  )
}
