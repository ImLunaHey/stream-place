import { useChatMessages } from '../../hooks/use-chat-messages'
import type { ChatStreamStatus } from '../../hooks/use-chat-stream'
import { ChatHeader } from './chat-header'
import { ChatMessageList } from './chat-message-list'
import { ChatComposer } from './chat-composer'

type Props = {
  streamer: string
  streamerDid: string | undefined
  status: ChatStreamStatus
  showHeader?: boolean
  onHide?: () => void
  className?: string
}

export function ChatPanel({
  streamer,
  streamerDid,
  status,
  showHeader = true,
  onHide,
  className,
}: Props) {
  const messages = useChatMessages(streamer)

  return (
    <aside className={`flex min-h-0 flex-col bg-zinc-950 ${className ?? ''}`}>
      {showHeader && <ChatHeader status={status} onHide={onHide} />}
      <ChatMessageList messages={messages} />
      <ChatComposer streamerDid={streamerDid} />
    </aside>
  )
}
