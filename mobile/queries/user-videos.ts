import { queryOptions } from '@tanstack/react-query'
import { listUserVideos } from '../lib/streamplace-extra'

export const userVideosQuery = (did: string | null | undefined) =>
  queryOptions({
    queryKey: ['streamplace', 'userVideos', did],
    queryFn: () => listUserVideos(did as string),
    enabled: !!did,
    staleTime: 5 * 60_000,
  })
