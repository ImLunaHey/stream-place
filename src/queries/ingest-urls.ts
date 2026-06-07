import { queryOptions } from '@tanstack/react-query'
import { getIngestUrls } from '../lib/streamplace'

export const ingestUrlsQuery = queryOptions({
  queryKey: ['streamplace', 'ingestUrls'],
  queryFn: () => getIngestUrls(),
  staleTime: 60 * 60_000,
})
