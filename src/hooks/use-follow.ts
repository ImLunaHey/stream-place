import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'
import { profileQuery } from '../queries/profile'

type Vars = {
  targetDid: string
  targetHandle: string
  viewerDid: string
}

export function useFollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ targetDid }: Vars) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      const res = await agent.com.atproto.repo.createRecord({
        repo: agent.session.did,
        collection: 'app.bsky.graph.follow',
        record: {
          $type: 'app.bsky.graph.follow',
          subject: targetDid,
          createdAt: new Date().toISOString(),
        },
      })
      return res.data.uri
    },
    onSuccess: (_uri, vars) => {
      void qc.invalidateQueries({
        queryKey: profileQuery(vars.targetHandle, vars.viewerDid).queryKey,
      })
      void qc.invalidateQueries({ queryKey: ['bsky', 'profile'] })
    },
  })
}
