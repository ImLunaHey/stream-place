import { Link } from '@tanstack/react-router'
import { Send } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useMentionContext } from '../../hooks/use-mention-context'
import { useProfilesByHandle } from '../../hooks/use-profiles-by-handle'
import { useSendChat } from '../../hooks/use-send-chat'
import { useSession } from '../../hooks/use-session'
import { useTypeahead } from '../../hooks/use-typeahead'
import { MentionDropdown } from './mention-dropdown'

type Props = {
  streamerDid: string | undefined
}

const MAX_HEIGHT_PX = 160

export function ChatComposer({ streamerDid }: Props) {
  const { session } = useSession()
  const sendChat = useSendChat()
  const [text, setText] = useState('')
  const [cursor, setCursor] = useState(0)
  const [mentionIndex, setMentionIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`
  }, [text])

  const mention = useMentionContext(text, cursor)
  const { data: mentionActors = [], isFetching: mentionLoading } = useTypeahead(
    mention?.query ?? '',
    5,
  )
  const mentionProfiles = useProfilesByHandle(
    useMemo(() => mentionActors.map((a) => a.handle), [mentionActors]),
  )
  const mentionOpen = !!mention && mention.query.length >= 1

  if (!session) {
    return (
      <div className="border-t border-white/5 p-3 text-center text-xs text-zinc-400">
        <Link
          to="/login"
          viewTransition
          className="font-semibold text-violet-400 hover:underline"
        >
          Sign in
        </Link>{' '}
        to chat.
      </div>
    )
  }

  const trimmed = text.trim()
  const disabled = !streamerDid || sendChat.isPending || trimmed.length === 0

  const submit = () => {
    if (disabled || !streamerDid) return
    sendChat.mutate(
      { streamerDid, text: trimmed },
      {
        onSuccess: () => {
          setText('')
          setCursor(0)
        },
      },
    )
  }

  const insertMention = (handle: string) => {
    if (!mention) return
    const before = text.slice(0, mention.start)
    const after = text.slice(mention.end)
    const inserted = `@${handle} `
    const next = `${before}${inserted}${after}`
    const newCursor = mention.start + inserted.length
    setText(next)
    setCursor(newCursor)
    setMentionIndex(0)
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(newCursor, newCursor)
    })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen && mentionActors.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex((i) => (i + 1) % mentionActors.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex(
          (i) => (i - 1 + mentionActors.length) % mentionActors.length,
        )
        return
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault()
        insertMention(mentionActors[mentionIndex].handle)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMentionIndex(0)
        const el = textareaRef.current
        if (el) {
          setCursor(text.length + 1)
        }
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const syncCursor = () => {
    const el = textareaRef.current
    if (!el) return
    setCursor(el.selectionStart ?? text.length)
  }

  const errorMsg =
    sendChat.error instanceof Error ? sendChat.error.message : null

  return (
    <form
      onSubmit={onSubmit}
      className="relative border-t border-white/5 p-2"
    >
      {mentionOpen && (
        <MentionDropdown
          actors={mentionActors}
          profiles={mentionProfiles}
          activeIndex={mentionIndex}
          loading={mentionLoading}
          onSelect={insertMention}
        />
      )}
      <div className="flex items-end gap-2 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/5 focus-within:ring-violet-400/60">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setCursor(e.target.selectionStart ?? e.target.value.length)
            setMentionIndex(0)
          }}
          onClick={syncCursor}
          onKeyUp={syncCursor}
          onKeyDown={onKeyDown}
          rows={1}
          maxLength={300}
          placeholder="Send a message"
          className="flex-1 resize-none bg-transparent py-1 text-sm leading-snug text-white placeholder:text-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled}
          aria-label="Send"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-violet-500 text-white disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      {errorMsg && (
        <p className="mt-1 text-xs text-rose-300">{errorMsg}</p>
      )}
    </form>
  )
}
