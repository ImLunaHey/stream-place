import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'

export function useFollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { targetDid: string }) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      const res = await agent.com.atproto.repo.createRecord({
        repo: agent.session.did,
        collection: 'app.bsky.graph.follow',
        record: {
          $type: 'app.bsky.graph.follow',
          subject: vars.targetDid,
          createdAt: new Date().toISOString(),
        },
      })
      return res.data.uri
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bsky', 'profile'] })
    },
  })
}

export function useUnfollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (vars: { followUri: string }) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      const rkey = vars.followUri.split('/').pop()
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
