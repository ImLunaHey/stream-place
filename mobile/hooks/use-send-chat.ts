import { useMutation } from '@tanstack/react-query'
import { getAuthedAgent } from '../lib/atp'

type Vars = { streamerDid: string; text: string }

export function useSendChat() {
  return useMutation({
    mutationFn: async ({ streamerDid, text }: Vars) => {
      const agent = await getAuthedAgent()
      if (!agent?.session) throw new Error('Not signed in')
      const res = await agent.com.atproto.repo.createRecord({
        repo: agent.session.did,
        collection: 'place.stream.chat.message',
        record: {
          $type: 'place.stream.chat.message',
          text,
          createdAt: new Date().toISOString(),
          streamer: streamerDid,
        },
      })
      return res.data
    },
  })
}
