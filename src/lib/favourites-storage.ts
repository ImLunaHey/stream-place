export type Favourite = {
  handle: string
  displayName?: string
  avatar?: string
}

const KEY = 'streamplace.favourites'
export const FAVOURITES_EVENT = 'streamplace:favourites'

export function readFavourites(): Favourite[] {
  if (typeof localStorage === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Favourite[]
  } catch {
    return []
  }
}

export function writeFavourites(list: Favourite[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(FAVOURITES_EVENT))
}
