import { useQuery } from '@tanstack/react-query'
import { chatQuery } from '../queries/chat'

export function useChatMessages(streamer: string | null | undefined) {
  const { data } = useQuery(chatQuery(streamer))
  return data ?? []
}
