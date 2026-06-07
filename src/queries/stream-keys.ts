import { queryOptions } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'
import type { StreamKeyRecord } from '../lib/streamplace'

export const streamKeysQuery = (did: string | null | undefined) =>
  queryOptions({
    queryKey: ['atp', 'streamKeys', did],
    queryFn: async (): Promise<StreamKeyRecord[]> => {
      const agent = await getAuthedAgent()
      if (!agent?.session || !did) return []
      const res = await agent.com.atproto.repo.listRecords({
        repo: did,
        collection: 'place.stream.key',
        limit: 100,
      })
      return res.data.records as StreamKeyRecord[]
    },
    enabled: !!did,
    staleTime: 60_000,
  })
