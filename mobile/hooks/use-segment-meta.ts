import { useQuery } from '@tanstack/react-query'
import { segmentMetaQuery } from '../queries/segment-meta'

export function useSegmentMeta(streamer: string | null | undefined) {
  const { data } = useQuery(segmentMetaQuery(streamer))
  return data ?? { hasReceivedSegment: false, contentWarnings: [] }
}
