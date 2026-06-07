import { useEffect, useRef } from 'react'
import type { ChatMessageView } from '../../lib/streamplace'
import { ChatMessageItem } from './chat-message-item'

type Props = {
  messages: ChatMessageView[]
}

export function ChatMessageList({ messages }: Props) {
  const ref = useRef<HTMLOListElement>(null)
  const pinnedToBottomRef = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !pinnedToBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const onScroll = (e: React.UIEvent<HTMLOListElement>) => {
    const el = e.currentTarget
    pinnedToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-xs text-zinc-500">
        Waiting for chat messages…
      </div>
    )
  }

  return (
    <ol
      ref={ref}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto py-2"
    >
      {messages.map((m) => (
        <ChatMessageItem key={m.uri} message={m} />
      ))}
    </ol>
  )
}
