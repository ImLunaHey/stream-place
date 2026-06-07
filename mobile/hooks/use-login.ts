import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginWithAppPassword } from '../lib/atp'
import { SESSION_KEY } from '../queries/session'

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { identifier: string; password: string }) => {
      const { session } = await loginWithAppPassword(
        vars.identifier,
        vars.password,
      )
      return session
    },
    onSuccess: (session) => {
      qc.setQueryData(SESSION_KEY, session)
    },
  })
}
