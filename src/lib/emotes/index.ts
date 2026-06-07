import { fetchBttvGlobalEmotes } from './bttv'
import { fetchFfzGlobalEmotes } from './ffz'
import { fetchSeventvGlobalEmotes } from './seventv'
import type { Emote, EmoteMap } from './types'

export type { Emote, EmoteMap, EmoteSource } from './types'

export async function fetchGlobalEmoteMap(): Promise<EmoteMap> {
  const results = await Promise.allSettled([
    fetchSeventvGlobalEmotes(),
    fetchBttvGlobalEmotes(),
    fetchFfzGlobalEmotes(),
  ])
  const map: EmoteMap = new Map()
  for (const r of results) {
    if (r.status !== 'fulfilled') continue
    for (const e of r.value) {
      if (!map.has(e.code)) map.set(e.code, e)
    }
  }
  return map
}

export type { Emote as EmoteType } from './types'
