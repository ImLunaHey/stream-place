import { queryOptions } from '@tanstack/react-query'
import { getLiveUsers } from '../lib/streamplace'

export const LIVE_USERS_KEY = ['streamplace', 'liveUsers'] as const

export const liveUsersQuery = (limit = 50) =>
  queryOptions({
    queryKey: [...LIVE_USERS_KEY, limit],
    queryFn: () => getLiveUsers(limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
