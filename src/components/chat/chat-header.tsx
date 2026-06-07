import { MessageSquare, PanelRightClose } from 'lucide-react'
import type { ChatStreamStatus } from '../../hooks/use-chat-stream'

type Props = {
  status: ChatStreamStatus
  onHide?: () => void
}

const statusColour: Record<ChatStreamStatus, string> = {
  connecting: 'bg-amber-400',
  open: 'bg-emerald-500',
  closed: 'bg-zinc-500',
  errored: 'bg-rose-500',
}

const statusLabel: Record<ChatStreamStatus, string> = {
  connecting: 'Connecting…',
  open: 'Connected',
  closed: 'Disconnected',
  errored: 'Connection error',
}

export function ChatHeader({ status, onHide }: Props) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-white/5 px-3">
      <MessageSquare className="h-4 w-4 text-zinc-400" />
      <span className="text-sm font-semibold">Chat</span>
      <span
        className={`ml-2 h-1.5 w-1.5 rounded-full ${statusColour[status]}`}
        aria-label={statusLabel[status]}
        title={statusLabel[status]}
      />
      {onHide && (
        <button
          type="button"
          onClick={onHide}
          aria-label="Hide chat"
          className="ml-auto grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      )}
    </header>
  )
}
