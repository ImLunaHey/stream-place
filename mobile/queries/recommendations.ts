import { queryOptions } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'

export type RecommendationsRecord = {
  streamers: string[]
  createdAt: string
}

export const RECOMMENDATIONS_KEY = (did: string | null | undefined) =>
  ['atp', 'recommendations', did] as const

export const recommendationsQuery = (did: string | null | undefined) =>
  queryOptions({
    queryKey: RECOMMENDATIONS_KEY(did),
    queryFn: async (): Promise<RecommendationsRecord> => {
      const agent = await getAuthedAgent()
      if (!agent?.session || !did)
        return { streamers: [], createdAt: new Date().toISOString() }
      try {
        const res = await agent.com.atproto.repo.getRecord({
          repo: did,
          collection: 'place.stream.live.recommendations',
          rkey: 'self',
        })
        const v = res.data.value as RecommendationsRecord
        return {
          streamers: v.streamers ?? [],
          createdAt: v.createdAt ?? new Date().toISOString(),
        }
      } catch {
        return { streamers: [], createdAt: new Date().toISOString() }
      }
    },
    enabled: !!did,
    staleTime: 30_000,
  })
