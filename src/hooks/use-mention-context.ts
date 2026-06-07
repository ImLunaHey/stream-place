import { useMemo } from 'react'

export type MentionContext = {
  query: string
  start: number
  end: number
}

export function useMentionContext(
  text: string,
  cursor: number,
): MentionContext | null {
  return useMemo(() => {
    if (cursor <= 0) return null
    const before = text.slice(0, cursor)
    const match = before.match(/(?:^|\s)@([a-z0-9._-]*)$/i)
    if (!match) return null
    const query = match[1]
    const start = cursor - query.length - 1
    return { query, start, end: cursor }
  }, [text, cursor])
}
