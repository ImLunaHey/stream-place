import type { Emote } from './types'

type FfzEmote = {
  id: number
  name: string
  height: number
  width: number
  urls: Record<string, string>
}

type FfzSet = { emoticons: FfzEmote[] }

type FfzResponse = {
  default_sets?: number[]
  sets?: Record<string, FfzSet>
}

export async function fetchFfzGlobalEmotes(): Promise<Emote[]> {
  const res = await fetch('https://api.frankerfacez.com/v1/set/global', {
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`FFZ global failed: ${res.status}`)
  const data = (await res.json()) as FfzResponse
  const includedSets = data.default_sets ?? Object.keys(data.sets ?? {}).map(Number)
  const out: Emote[] = []
  for (const setId of includedSets) {
    const set = data.sets?.[String(setId)]
    if (!set) continue
    for (const e of set.emoticons) {
      const best = e.urls['4'] ?? e.urls['2'] ?? e.urls['1']
      if (!best) continue
      out.push({
        source: 'ffz',
        id: String(e.id),
        code: e.name,
        url: best.startsWith('//') ? `https:${best}` : best,
        width: e.width,
        height: e.height,
      })
    }
  }
  return out
}
