import type { ChatMessageView } from '../../lib/streamplace'
import { ChatText } from './chat-text'

type Props = {
  message: ChatMessageView
}

function colourFor(msg: ChatMessageView) {
  const c = msg.chatProfile?.color
  if (!c) return '#a5b4fc'
  const r = Math.max(0, Math.min(255, c.red))
  const g = Math.max(0, Math.min(255, c.green))
  const b = Math.max(0, Math.min(255, c.blue))
  return `rgb(${r}, ${g}, ${b})`
}

export function ChatMessageItem({ message }: Props) {
  const name = message.author.displayName || message.author.handle
  return (
    <li className="px-3 py-1.5 text-sm leading-relaxed">
      <span className="font-semibold" style={{ color: colourFor(message) }}>
        {name}
      </span>
      <span className="text-zinc-500">: </span>
      <ChatText text={message.record.text} />
    </li>
  )
}
