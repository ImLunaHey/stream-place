import { useQuery } from '@tanstack/react-query'
import { ingestUrlsQuery } from '../queries/ingest-urls'

export function useIngestUrls() {
  return useQuery(ingestUrlsQuery)
}
