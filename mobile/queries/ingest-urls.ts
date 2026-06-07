import { queryOptions } from '@tanstack/react-query'
import { STREAMPLACE_HOST } from '../lib/streamplace'

export type IngestUrl = { type: string; url: string }

export const ingestUrlsQuery = queryOptions({
  queryKey: ['streamplace', 'ingestUrls'],
  queryFn: async (): Promise<IngestUrl[]> => {
    const res = await fetch(
      `${STREAMPLACE_HOST}/xrpc/place.stream.ingest.getIngestUrls`,
    )
    if (!res.ok) throw new Error(`getIngestUrls failed: ${res.status}`)
    const data = (await res.json()) as { ingests: IngestUrl[] }
    return data.ingests ?? []
  },
  staleTime: 60 * 60_000,
})
