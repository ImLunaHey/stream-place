import { useQuery } from '@tanstack/react-query'
import { userVideosQuery } from '../queries/user-videos'

export function useUserVideos(did: string | null | undefined) {
  return useQuery(userVideosQuery(did))
}
