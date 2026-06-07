import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { profilesQuery } from '../queries/profiles'
import type { ResolvedProfile } from '../lib/streamplace'

export function useProfilesByHandle(actors: string[]) {
  const stable = useMemo(() => [...actors].sort(), [actors.join('|')])
  const { data } = useQuery(profilesQuery(stable))
  return useMemo(() => {
    const map = new Map<string, ResolvedProfile>()
    for (const p of data ?? []) map.set(p.handle, p)
    return map
  }, [data])
}
