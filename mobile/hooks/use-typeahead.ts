import { useQuery } from '@tanstack/react-query'
import { typeaheadQuery } from '../queries/typeahead'

export function useTypeahead(q: string, limit = 10) {
  return useQuery(typeaheadQuery(q, limit))
}
