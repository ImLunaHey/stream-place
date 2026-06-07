import { queryOptions } from '@tanstack/react-query'
import type { ChatMessageView } from '../lib/streamplace-extra'

export const chatKey = (streamer: string) =>
  ['streamplace', 'chat', streamer] as const

export const chatQuery = (streamer: string | null | undefined) =>
  queryOptions({
    queryKey: chatKey(streamer ?? ''),
    queryFn: (): Promise<ChatMessageView[]> => Promise.resolve([]),
    enabled: !!streamer,
    staleTime: Number.POSITIVE_INFINITY,
  })
