import { queryOptions } from '@tanstack/react-query'
import { getProfiles } from '../lib/streamplace'

export const profilesQuery = (actors: string[]) => {
  const key = [...actors].sort()
  return queryOptions({
    queryKey: ['bsky', 'profiles', key],
    queryFn: () => getProfiles(actors),
    enabled: actors.length > 0,
    staleTime: 5 * 60_000,
  })
}
