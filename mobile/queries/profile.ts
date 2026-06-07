import { queryOptions } from '@tanstack/react-query'
import { getProfile, getProfiles } from '../lib/streamplace'

export const profileQuery = (actor: string | null | undefined) =>
  queryOptions({
    queryKey: ['bsky', 'profile', actor],
    queryFn: () => getProfile(actor as string),
    enabled: !!actor,
    staleTime: 5 * 60_000,
  })

export const profilesQuery = (actors: string[]) => {
  const key = [...actors].sort()
  return queryOptions({
    queryKey: ['bsky', 'profiles', key],
    queryFn: () => getProfiles(actors),
    enabled: actors.length > 0,
    staleTime: 5 * 60_000,
  })
}
