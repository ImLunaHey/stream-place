import { useQuery } from '@tanstack/react-query'
import { sessionQuery } from '../queries/session'

export function useSession() {
  const { data, isPending } = useQuery(sessionQuery)
  return {
    session: data ?? null,
    status: isPending ? ('loading' as const) : ('ready' as const),
  }
}
