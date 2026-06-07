import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearSession } from '../lib/atp'
import { SESSION_KEY } from '../queries/session'

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await clearSession()
    },
    onSuccess: () => {
      qc.setQueryData(SESSION_KEY, null)
      qc.clear()
    },
  })
}
