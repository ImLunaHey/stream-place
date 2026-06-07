import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { chatKey } from '../queries/chat'
import { segmentMetaKey, type SegmentMeta } from '../queries/segment-meta'
import { chatWebSocketUrl, type ChatMessageView } from '../lib/streamplace'

export type ChatStreamStatus = 'connecting' | 'open' | 'closed' | 'errored'

const MAX_MESSAGES = 250

export function useChatStream(streamer: string | null | undefined) {
  const qc = useQueryClient()
  const [viewerCount, setViewerCount] = useState<number | null>(null)
  const [status, setStatus] = useState<ChatStreamStatus>('connecting')
  const buffer = useRef<ChatMessageView[]>([])
  const flushTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!streamer) return
    const key = chatKey(streamer)
    const metaKey = segmentMetaKey(streamer)
    qc.setQueryData<ChatMessageView[]>(key, [])
    qc.setQueryData<SegmentMeta>(metaKey, {
      hasReceivedSegment: false,
      contentWarnings: [],
    })
    setViewerCount(null)
    setStatus('connecting')

    const flush = () => {
      if (buffer.current.length === 0) return
      const next = buffer.current
      buffer.current = []
      flushTimer.current = null
      qc.setQueryData<ChatMessageView[]>(key, (prev = []) => {
        const seen = new Set(prev.map((m) => m.uri))
        const additions: ChatMessageView[] = []
        for (const m of next) {
          if (seen.has(m.uri)) continue
          seen.add(m.uri)
          additions.push(m)
        }
        if (additions.length === 0) return prev
        const merged = [...prev, ...additions]
        return merged.length > MAX_MESSAGES
          ? merged.slice(merged.length - MAX_MESSAGES)
          : merged
      })
    }

    const removeByUri = (uri: string) => {
      qc.setQueryData<ChatMessageView[]>(key, (prev = []) =>
        prev.filter((m) => m.uri !== uri),
      )
    }

    const ws = new WebSocket(chatWebSocketUrl(streamer))
    ws.onopen = () => setStatus('open')
    ws.onerror = () => setStatus('errored')
    ws.onclose = () => setStatus('closed')
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data as string) as {
          $type?: string
          count?: number
        } & ChatMessageView
        if (data.$type === 'place.stream.chat.defs#messageView') {
          if (data.deleted) {
            removeByUri(data.uri)
            return
          }
          buffer.current.push(data as ChatMessageView)
          if (!flushTimer.current) {
            flushTimer.current = window.setTimeout(flush, 200)
          }
        } else if (data.$type === 'place.stream.livestream#viewerCount') {
          if (typeof data.count === 'number') setViewerCount(data.count)
        } else if (data.$type === 'place.stream.segment') {
          const seg = evt.data as unknown as string
          let warnings: string[] = []
          try {
            const parsed = JSON.parse(seg) as {
              contentWarnings?: { warnings?: string[] }
            }
            warnings = parsed.contentWarnings?.warnings ?? []
          } catch {}
          qc.setQueryData<SegmentMeta>(metaKey, (prev) => {
            const merged = new Set([...(prev?.contentWarnings ?? []), ...warnings])
            return {
              hasReceivedSegment: true,
              contentWarnings: [...merged],
            }
          })
        }
      } catch {}
    }

    return () => {
      if (flushTimer.current) window.clearTimeout(flushTimer.current)
      flushTimer.current = null
      buffer.current = []
      ws.close()
    }
  }, [streamer, qc])

  return { viewerCount, status }
}
