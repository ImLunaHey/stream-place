import { router } from 'expo-router'
import { Send } from 'lucide-react-native'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { ChatMessageItem } from './chat-message-item'
import { useChatMessages } from '../hooks/use-chat-messages'
import { type ChatStreamStatus } from '../hooks/use-chat-stream'
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

const PIN_THRESHOLD_PX = 40

export function ChatPanel({ streamer, streamerDid, status }: Props) {
  const messages = useChatMessages(streamer)
  const { session } = useSession()
  const sendChat = useSendChat()
  const [text, setText] = useState('')
  const listRef = useRef<FlatList>(null)
  const pinnedToBottomRef = useRef(true)

  const onSend = () => {
    const trimmed = text.trim()
    if (!trimmed || !streamerDid) return
    sendChat.mutate(
      { streamerDid, text: trimmed },
      { onSuccess: () => setText('') },
    )
  }

  const onKeyPress = (e: any) => {
    if (Platform.OS !== 'web') return
    const native = e.nativeEvent ?? {}
    if (native.key === 'Enter' && !native.shiftKey) {
      e.preventDefault?.()
      onSend()
    }
  }

  const onContentSizeChange = () => {
    if (!pinnedToBottomRef.current) return
    listRef.current?.scrollToEnd({ animated: false })
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const distance =
      contentSize.height - (contentOffset.y + layoutMeasurement.height)
    pinnedToBottomRef.current = distance < PIN_THRESHOLD_PX
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="h-11 flex-row items-center gap-2 border-b border-white/5 px-3">
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
        contentContainerStyle={{ paddingVertical: 8 }}
        onContentSizeChange={onContentSizeChange}
        onLayout={onContentSizeChange}
        onScroll={onScroll}
        scrollEventThrottle={100}
        maintainVisibleContentPosition={
          Platform.OS === 'web'
            ? undefined
            : { minIndexForVisible: 0, autoscrollToTopThreshold: undefined }
        }
        ListEmptyComponent={
          <Text className="px-4 py-3 text-xs text-zinc-500">
            Waiting for chat messages…
          </Text>
        }
      />

      {session ? (
        <View className="border-t border-white/5 p-2">
          <View
            className="flex-row items-end gap-2 rounded-md bg-white/5 px-2 py-1.5"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              onKeyPress={onKeyPress}
              placeholder="Send a message"
              placeholderTextColor="#71717a"
              multiline
              maxLength={300}
              className="flex-1 text-sm text-white"
              style={{
                minHeight: 24,
                maxHeight: 120,
                paddingTop: 4,
                paddingBottom: 4,
                color: '#fff',
                outlineWidth: 0,
              }}
            />
            <Pressable
              onPress={onSend}
              disabled={!text.trim() || sendChat.isPending}
              className="h-7 w-7 items-center justify-center rounded-md bg-pink-500"
              style={{
                opacity: !text.trim() || sendChat.isPending ? 0.4 : 1,
              }}
            >
              {sendChat.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Send size={12} color="#fff" />
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
            <Text className="font-semibold text-pink-400">Sign in</Text> to
            chat.
          </Text>
        </Pressable>
      )}
    </View>
  )
}
