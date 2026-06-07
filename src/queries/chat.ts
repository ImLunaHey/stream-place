import { queryOptions } from '@tanstack/react-query'
import type { ChatMessageView } from '../lib/streamplace'

export const chatKey = (streamer: string) => ['streamplace', 'chat', streamer]

export const chatQuery = (streamer: string | null | undefined) =>
  queryOptions({
    queryKey: chatKey(streamer ?? ''),
    queryFn: (): Promise<ChatMessageView[]> => Promise.resolve([]),
    enabled: !!streamer,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
