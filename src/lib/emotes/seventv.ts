import type { Emote } from './types'

type SevenTvFile = {
  name: string
  format: string
  width: number
  height: number
}

type SevenTvHost = {
  url: string
  files: SevenTvFile[]
}

type SevenTvEmote = {
  id: string
  name: string
  flags?: number
  data: {
    id: string
    name: string
    flags?: number
    host: SevenTvHost
  }
}

type SevenTvEmoteSet = {
  emotes: SevenTvEmote[]
}

const ZERO_WIDTH_FLAG = 1

export async function fetchSeventvGlobalEmotes(): Promise<Emote[]> {
  const res = await fetch('https://7tv.io/v3/emote-sets/global', {
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`7TV global failed: ${res.status}`)
  const data = (await res.json()) as SevenTvEmoteSet
  const out: Emote[] = []
  for (const e of data.emotes) {
    const host = e.data?.host
    if (!host) continue
    const webp = host.files
      .filter((f) => f.format === 'WEBP')
      .sort((a, b) => b.width - a.width)
    const file = webp[1] ?? webp[0]
    if (!file) continue
    const base = host.url.startsWith('//') ? `https:${host.url}` : host.url
    const flags = e.data.flags ?? e.flags ?? 0
    out.push({
      source: '7tv',
      id: e.id,
      code: e.name,
      url: `${base}/${file.name}`,
      width: file.width,
      height: file.height,
      zeroWidth: (flags & ZERO_WIDTH_FLAG) === ZERO_WIDTH_FLAG,
    })
  }
  return out
}
