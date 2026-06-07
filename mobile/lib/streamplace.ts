export const STREAMPLACE_HOST = 'https://stream.place'

export type LiveAuthor = {
  did: string
  handle: string
  displayName?: string
  avatar?: string
}

export type LiveRecord = {
  $type: 'place.stream.livestream'
  title: string
  createdAt: string
  lastSeenAt?: string
  tags?: string[]
  thumb?: {
    $type: 'blob'
    ref: { $link: string }
    mimeType: string
    size: number
  }
}

export type LivestreamView = {
  uri: string
  cid: string
  author: LiveAuthor
  record: LiveRecord
  indexedAt: string
  viewerCount?: { count: number }
}

export type ResolvedProfile = {
  did: string
  handle: string
  displayName?: string
  avatar?: string
  description?: string
}

export async function getLiveUsers(limit = 50): Promise<LivestreamView[]> {
  const url = new URL(`${STREAMPLACE_HOST}/xrpc/place.stream.live.getLiveUsers`)
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`getLiveUsers failed: ${res.status}`)
  const data = (await res.json()) as { streams: LivestreamView[] }
  return data.streams ?? []
}

export async function getProfiles(actors: string[]): Promise<ResolvedProfile[]> {
  if (actors.length === 0) return []
  const out: ResolvedProfile[] = []
  for (let i = 0; i < actors.length; i += 25) {
    const chunk = actors.slice(i, i + 25)
    const url = new URL(
      'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfiles',
    )
    for (const a of chunk) url.searchParams.append('actors', a)
    const res = await fetch(url.toString())
    if (!res.ok) continue
    const data = (await res.json()) as { profiles: ResolvedProfile[] }
    out.push(...data.profiles)
  }
  return out
}

export async function getProfile(actor: string): Promise<ResolvedProfile> {
  const url = new URL(
    'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile',
  )
  url.searchParams.set('actor', actor)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`getProfile failed: ${res.status}`)
  return (await res.json()) as ResolvedProfile
}

export function thumbUrl(did: string, cidLink: string): string {
  return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cidLink}@jpeg`
}

export function playlistUrl(streamer: string): string {
  const url = new URL(
    `${STREAMPLACE_HOST}/xrpc/place.stream.playback.getLivePlaylist`,
  )
  url.searchParams.set('streamer', streamer)
  return url.toString()
}

export function formatViewers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}
