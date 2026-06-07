import { useQuery } from '@tanstack/react-query'
import { webhooksQuery } from '../queries/webhooks'
import { useSession } from './use-session'

export function useWebhooks() {
  const { session } = useSession()
  return useQuery(webhooksQuery(!!session))
}
