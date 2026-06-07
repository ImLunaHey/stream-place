import { queryOptions } from '@tanstack/react-query'
import { resumeAgent, type Session } from '../lib/atp'

export const SESSION_KEY = ['atp', 'session'] as const

export const sessionQuery = queryOptions({
  queryKey: SESSION_KEY,
  queryFn: async (): Promise<Session | null> => {
    const resumed = await resumeAgent()
    return resumed?.session ?? null
  },
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})
