import { useQuery } from '@tanstack/react-query'
import { liveUsersQuery } from '../queries/live-users'

export function useLiveUsers(limit = 50) {
  return useQuery(liveUsersQuery(limit))
}
