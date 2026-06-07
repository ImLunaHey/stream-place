import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  readFavourites,
  writeFavourites,
  type Favourite,
} from '../lib/favourites-storage'

const KEY = ['streamplace', 'favourites'] as const

export function useFavourites() {
  const qc = useQueryClient()
  const { data: favourites = [] } = useQuery({
    queryKey: KEY,
    queryFn: readFavourites,
    staleTime: Number.POSITIVE_INFINITY,
  })
  const toggleMut = useMutation({
    mutationFn: async (fav: Favourite) => {
      const current = await readFavourites()
      const exists = current.some((f) => f.handle === fav.handle)
      const next = exists
        ? current.filter((f) => f.handle !== fav.handle)
        : [...current, fav]
      await writeFavourites(next)
      return next
    },
    onSuccess: (next) => {
      qc.setQueryData(KEY, next)
    },
  })
  return {
    favourites,
    toggle: (f: Favourite) => toggleMut.mutate(f),
    isFavourite: (handle: string) =>
      favourites.some((f) => f.handle === handle),
  }
}
