import { useQuery } from '@tanstack/react-query'
import { globalEmotesQuery } from '../queries/emotes'

export function useGlobalEmotes() {
  return useQuery(globalEmotesQuery)
}
