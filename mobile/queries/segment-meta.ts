import { queryOptions } from '@tanstack/react-query'

export type SegmentMeta = {
  hasReceivedSegment: boolean
  contentWarnings: string[]
}

const empty: SegmentMeta = { hasReceivedSegment: false, contentWarnings: [] }

export const segmentMetaKey = (streamer: string) =>
  ['streamplace', 'segmentMeta', streamer] as const

export const segmentMetaQuery = (streamer: string | null | undefined) =>
  queryOptions({
    queryKey: streamer
      ? segmentMetaKey(streamer)
      : (['streamplace', 'segmentMeta', '_none'] as const),
    queryFn: () => Promise.resolve(empty),
    enabled: !!streamer,
    staleTime: Number.POSITIVE_INFINITY,
  })
