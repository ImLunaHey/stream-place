import { useSuspenseQuery } from '@tanstack/react-query'
import { liveUsersQuery } from '../queries/live-users'

export function useLiveUsers(limit = 50) {
  return useSuspenseQuery(liveUsersQuery(limit))
}
