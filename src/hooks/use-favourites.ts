import { useEffect, useState } from 'react'
import {
  FAVOURITES_EVENT,
  readFavourites,
  writeFavourites,
  type Favourite,
} from '../lib/favourites-storage'

export function useFavourites() {
  const [favourites, setFavourites] = useState<Favourite[]>(() => readFavourites())

  useEffect(() => {
    const refresh = () => setFavourites(readFavourites())
    window.addEventListener(FAVOURITES_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(FAVOURITES_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const toggle = (fav: Favourite) => {
    const current = readFavourites()
    const exists = current.some((f) => f.handle === fav.handle)
    const next = exists
      ? current.filter((f) => f.handle !== fav.handle)
      : [...current, fav]
    writeFavourites(next)
  }

  const isFavourite = (handle: string) =>
    favourites.some((f) => f.handle === handle)

  return { favourites, toggle, isFavourite }
}
