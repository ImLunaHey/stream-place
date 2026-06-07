import { useQuery } from '@tanstack/react-query'
import { multistreamTargetsQuery } from '../queries/multistream-targets'
import { useSession } from './use-session'

export function useMultistreamTargets() {
  const { session } = useSession()
  return useQuery(multistreamTargetsQuery(!!session))
}
