import { queryOptions } from '@tanstack/react-query'
import { fetchGlobalEmoteMap } from '../lib/emotes'

export const globalEmotesQuery = queryOptions({
  queryKey: ['emotes', 'global'],
  queryFn: () => fetchGlobalEmoteMap(),
  staleTime: 6 * 60 * 60_000,
  gcTime: 24 * 60 * 60_000,
})
