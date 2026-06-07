import { queryOptions } from '@tanstack/react-query'
import { searchActorsTypeahead } from '../lib/streamplace-extra'

export const typeaheadQuery = (q: string, limit = 10) =>
  queryOptions({
    queryKey: ['streamplace', 'typeahead', q.toLowerCase(), limit],
    queryFn: () => searchActorsTypeahead(q, limit),
    enabled: q.trim().length >= 1,
    staleTime: 30_000,
  })
