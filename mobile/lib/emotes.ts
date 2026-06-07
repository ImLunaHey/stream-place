export type EmoteSource = 'bttv' | 'ffz' | '7tv'

export type Emote = {
  source: EmoteSource
  id: string
  code: string
  url: string
  width?: number
  height?: number
}

export type EmoteMap = Map<string, Emote>

async function bttv(): Promise<Emote[]> {
  const res = await fetch('https://api.betterttv.net/3/cached/emotes/global')
  if (!res.ok) throw new Error(`BTTV ${res.status}`)
  const data = (await res.json()) as Array<{
    id: string
    code: string
    imageType?: string
  }>
  return data.map((e) => ({
    source: 'bttv',
    id: e.id,
    code: e.code,
    url: `https://cdn.betterttv.net/emote/${e.id}/2x.${e.imageType ?? 'webp'}`,
  }))
}

async function ffz(): Promise<Emote[]> {
  const res = await fetch('https://api.frankerfacez.com/v1/set/global')
  if (!res.ok) throw new Error(`FFZ ${res.status}`)
  const data = (await res.json()) as {
    default_sets?: number[]
    sets?: Record<
      string,
      { emoticons: Array<{ id: number; name: string; urls: Record<string, string> }> }
    >
  }
  const sets = data.default_sets ?? Object.keys(data.sets ?? {}).map(Number)
  const out: Emote[] = []
  for (const setId of sets) {
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
      })
    }
  }
  return out
}

async function seventv(): Promise<Emote[]> {
  const res = await fetch('https://7tv.io/v3/emote-sets/global')
  if (!res.ok) throw new Error(`7TV ${res.status}`)
  const data = (await res.json()) as {
    emotes: Array<{
      id: string
      name: string
      data: {
        host: {
          url: string
          files: Array<{ name: string; format: string; width: number; height: number }>
        }
      }
    }>
  }
  const out: Emote[] = []
  for (const e of data.emotes) {
    const webp = e.data.host.files
      .filter((f) => f.format === 'WEBP')
      .sort((a, b) => b.width - a.width)
    const file = webp[1] ?? webp[0]
    if (!file) continue
    const base = e.data.host.url.startsWith('//')
      ? `https:${e.data.host.url}`
      : e.data.host.url
    out.push({
      source: '7tv',
      id: e.id,
      code: e.name,
      url: `${base}/${file.name}`,
      width: file.width,
      height: file.height,
    })
  }
  return out
}

export async function fetchGlobalEmoteMap(): Promise<EmoteMap> {
  const results = await Promise.allSettled([seventv(), bttv(), ffz()])
  const map: EmoteMap = new Map()
  for (const r of results) {
    if (r.status !== 'fulfilled') continue
    for (const e of r.value) if (!map.has(e.code)) map.set(e.code, e)
  }
  return map
}
