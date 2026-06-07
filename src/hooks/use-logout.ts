import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearCachedAgent, clearSession } from '../lib/atp'
import { clearServiceAuthCache } from '../lib/streamplace-auth'
import { SESSION_KEY } from '../queries/session'

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      clearSession()
      clearCachedAgent()
      clearServiceAuthCache()
    },
    onSuccess: () => {
      qc.setQueryData(SESSION_KEY, null)
      qc.clear()
    },
  })
}
