import { queryOptions } from '@tanstack/react-query'
import { getLiveUsers } from '../lib/streamplace'

export const liveUsersQuery = (limit = 50) =>
  queryOptions({
    queryKey: ['streamplace', 'liveUsers', limit],
    queryFn: () => getLiveUsers(limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
