import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'

type Vars = {
  followUri: string
}

export function useUnfollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ followUri }: Vars) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      const rkey = followUri.split('/').pop()
      if (!rkey) throw new Error('Invalid follow URI')
      await agent.com.atproto.repo.deleteRecord({
        repo: agent.session.did,
        collection: 'app.bsky.graph.follow',
        rkey,
      })
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bsky', 'profile'] })
    },
  })
}
