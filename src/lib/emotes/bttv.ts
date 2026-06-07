import type { Emote } from './types'

type BttvEmote = {
  id: string
  code: string
  imageType?: string
}

export async function fetchBttvGlobalEmotes(): Promise<Emote[]> {
  const res = await fetch('https://api.betterttv.net/3/cached/emotes/global', {
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`BTTV global failed: ${res.status}`)
  const data = (await res.json()) as BttvEmote[]
  return data.map((e) => ({
    source: 'bttv',
    id: e.id,
    code: e.code,
    url: `https://cdn.betterttv.net/emote/${e.id}/2x.${e.imageType ?? 'webp'}`,
  }))
}
