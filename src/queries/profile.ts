import { queryOptions } from '@tanstack/react-query'
import { getProfile } from '../lib/streamplace'

export const profileQuery = (
  actor: string | null | undefined,
  viewerDid: string | null = null,
) =>
  queryOptions({
    queryKey: ['bsky', 'profile', actor, viewerDid],
    queryFn: () => getProfile(actor as string),
    enabled: !!actor,
    staleTime: 5 * 60_000,
  })
