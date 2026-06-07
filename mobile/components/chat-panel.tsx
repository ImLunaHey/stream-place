import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { ChatMessageItem } from './chat-message-item'
import { useChatMessages } from '../hooks/use-chat-messages'
import { useChatStream, type ChatStreamStatus } from '../hooks/use-chat-stream'
import { useSendChat } from '../hooks/use-send-chat'
import { useSession } from '../hooks/use-session'

type Props = {
  streamer: string
  streamerDid?: string
  status: ChatStreamStatus
}

const statusColour: Record<ChatStreamStatus, string> = {
  connecting: '#fbbf24',
  open: '#10b981',
  closed: '#71717a',
  errored: '#f43f5e',
}

export function ChatPanel({ streamer, streamerDid, status }: Props) {
  const messages = useChatMessages(streamer)
  const { session } = useSession()
  const sendChat = useSendChat()
  const [text, setText] = useState('')
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    if (messages.length > 0)
      listRef.current?.scrollToEnd({ animated: true })
  }, [messages.length])

  const onSend = () => {
    const trimmed = text.trim()
    if (!trimmed || !streamerDid) return
    sendChat.mutate(
      { streamerDid, text: trimmed },
      { onSuccess: () => setText('') },
    )
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="h-10 flex-row items-center gap-2 border-b border-white/5 px-3">
        <Text className="text-sm font-semibold text-white">Chat</Text>
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: statusColour[status],
          }}
        />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.uri}
        renderItem={({ item }) => <ChatMessageItem message={item} />}
        contentContainerStyle={{ paddingVertical: 4 }}
        ListEmptyComponent={
          <Text className="px-4 py-3 text-xs text-zinc-500">
            Waiting for chat messages…
          </Text>
        }
      />

      {session ? (
        <View className="border-t border-white/5 p-2">
          <View className="flex-row items-center gap-2 rounded-md bg-white/5 px-2 py-1">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Send a message"
              placeholderTextColor="#71717a"
              multiline
              maxLength={300}
              className="flex-1 py-1 text-sm text-white"
              style={{ minHeight: 28, color: '#fff' }}
            />
            <Pressable
              onPress={onSend}
              disabled={!text.trim() || sendChat.isPending}
              className="h-7 w-7 items-center justify-center rounded-md bg-violet-500"
              style={{
                opacity: !text.trim() || sendChat.isPending ? 0.4 : 1,
              }}
            >
              {sendChat.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-xs font-bold text-white">→</Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => router.push('/login')}
          className="border-t border-white/5 p-3"
        >
          <Text className="text-center text-xs text-zinc-400">
            <Text className="font-semibold text-violet-400">Sign in</Text> to
            chat.
          </Text>
        </Pressable>
      )}
    </View>
  )
}
