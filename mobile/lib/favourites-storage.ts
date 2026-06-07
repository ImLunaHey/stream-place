import { readJson, writeJson } from './storage'

const KEY = 'streamplace.favourites'

export type Favourite = {
  handle: string
  displayName?: string
  avatar?: string
}

export async function readFavourites(): Promise<Favourite[]> {
  return (await readJson<Favourite[]>(KEY)) ?? []
}

export async function writeFavourites(list: Favourite[]): Promise<void> {
  await writeJson(KEY, list)
}
