import { useQuery } from '@tanstack/react-query'
import { streamKeysQuery } from '../queries/stream-keys'

export function useStreamKeys(did: string | null | undefined) {
  return useQuery(streamKeysQuery(did))
}
