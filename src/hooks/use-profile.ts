import { useQuery } from '@tanstack/react-query'
import { profileQuery } from '../queries/profile'
import { useSession } from './use-session'

export function useProfile(actor: string | null | undefined) {
  const { session } = useSession()
  return useQuery(profileQuery(actor, session?.did ?? null))
}
