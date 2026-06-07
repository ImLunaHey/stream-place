import { useMemo } from 'react'
import { useGlobalEmotes } from '../../hooks/use-global-emotes'
import type { Emote } from '../../lib/emotes'

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'emote'; emote: Emote }

function tokenize(text: string, emotes: Map<string, Emote>): Token[] {
  if (emotes.size === 0) return [{ kind: 'text', value: text }]
  const parts = text.split(/(\s+)/)
  const out: Token[] = []
  let textBuf = ''
  for (const part of parts) {
    const hit = emotes.get(part)
    if (hit) {
      if (textBuf) {
        out.push({ kind: 'text', value: textBuf })
        textBuf = ''
      }
      out.push({ kind: 'emote', emote: hit })
    } else {
      textBuf += part
    }
  }
  if (textBuf) out.push({ kind: 'text', value: textBuf })
  return out
}

export function ChatText({ text }: { text: string }) {
  const { data: emotes } = useGlobalEmotes()
  const tokens = useMemo(
    () => tokenize(text, emotes ?? new Map()),
    [text, emotes],
  )

  return (
    <span className="break-words text-zinc-100">
      {tokens.map((t, i) =>
        t.kind === 'text' ? (
          <span key={i}>{t.value}</span>
        ) : (
          <img
            key={i}
            src={t.emote.url}
            alt={t.emote.code}
            title={`${t.emote.code} (${t.emote.source.toUpperCase()})`}
            className="-my-1 inline-block h-7 align-middle"
            loading="lazy"
          />
        ),
      )}
    </span>
  )
}
