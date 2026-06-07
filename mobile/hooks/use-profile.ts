import { useQuery } from '@tanstack/react-query'
import { profileQuery } from '../queries/profile'

export function useProfile(actor: string | null | undefined) {
  return useQuery(profileQuery(actor))
}
