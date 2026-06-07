import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'
import {
  RECOMMENDATIONS_KEY,
  recommendationsQuery,
  type RecommendationsRecord,
} from '../queries/recommendations'
import { useSession } from './use-session'

export function useRecommendations() {
  const { session } = useSession()
  return useQuery(recommendationsQuery(session?.did))
}

export function useSaveRecommendations() {
  const { session } = useSession()
  const qc = useQueryClient()
  const did = session?.did ?? null
  return useMutation({
    mutationFn: async (streamers: string[]) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      await agent.com.atproto.repo.putRecord({
        repo: agent.session.did,
        collection: 'place.stream.live.recommendations',
        rkey: 'self',
        record: {
          $type: 'place.stream.live.recommendations',
          streamers,
          createdAt: new Date().toISOString(),
        },
      })
      return streamers
    },
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: RECOMMENDATIONS_KEY(did) })
      const prev = qc.getQueryData<RecommendationsRecord>(
        RECOMMENDATIONS_KEY(did),
      )
      qc.setQueryData<RecommendationsRecord>(RECOMMENDATIONS_KEY(did), {
        streamers: next,
        createdAt: new Date().toISOString(),
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        qc.setQueryData(RECOMMENDATIONS_KEY(did), ctx.prev)
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY(did) })
    },
  })
}
