import { getAuthedAgent } from './atp'
import { resolvePdsForIdentifier } from './resolve-pds'

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
  endedAt?: string
  url?: string
  canonicalUrl?: string
  tags?: string[]
  agent?: string
  thumb?: {
    $type: 'blob'
    ref: { $link: string }
    mimeType: string
    size: number
  }
}

export type LivestreamView = {
  $type: 'place.stream.livestream#livestreamView'
  uri: string
  cid: string
  author: LiveAuthor
  record: LiveRecord
  indexedAt: string
  viewerCount?: { count: number }
}

export type GetLiveUsersResponse = {
  streams: LivestreamView[]
}

export async function getLiveUsers(limit = 50): Promise<LivestreamView[]> {
  const url = new URL(
    `${STREAMPLACE_HOST}/xrpc/place.stream.live.getLiveUsers`,
  )
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`getLiveUsers failed: ${res.status}`)
  const data = (await res.json()) as GetLiveUsersResponse
  return data.streams ?? []
}

export type ViewerState = {
  muted?: boolean
  blockedBy?: boolean
  blocking?: string
  following?: string
  followedBy?: string
}

export type ResolvedProfile = {
  did: string
  handle: string
  displayName?: string
  avatar?: string
  description?: string
  viewer?: ViewerState
}

export async function getProfile(actor: string): Promise<ResolvedProfile> {
  const agent = await getAuthedAgent().catch(() => null)
  if (agent?.session) {
    const res = await agent.app.bsky.actor.getProfile({ actor })
    return res.data as ResolvedProfile
  }
  const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile')
  url.searchParams.set('actor', actor)
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`getProfile failed: ${res.status}`)
  return (await res.json()) as ResolvedProfile
}

export async function getProfiles(actors: string[]): Promise<ResolvedProfile[]> {
  if (actors.length === 0) return []
  const chunks: string[][] = []
  for (let i = 0; i < actors.length; i += 25) chunks.push(actors.slice(i, i + 25))
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const url = new URL(
        'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfiles',
      )
      for (const a of chunk) url.searchParams.append('actors', a)
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`getProfiles failed: ${res.status}`)
      const data = (await res.json()) as { profiles: ResolvedProfile[] }
      return data.profiles
    }),
  )
  return results.flat()
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

export function videoPlaylistUrl(uri: string): string {
  const url = new URL(
    `${STREAMPLACE_HOST}/xrpc/place.stream.playback.getVideoPlaylist`,
  )
  url.searchParams.set('uri', uri)
  return url.toString()
}

export type VideoRecord = {
  $type?: 'place.stream.video'
  title: string
  createdAt: string
  description?: string
  durationMs: number
  thumb?: {
    $type: 'blob'
    ref: { $link: string }
    mimeType: string
    size: number
  }
  tags?: string[]
  activity?: unknown
}

export type VideoRecordView = {
  uri: string
  cid: string
  value: VideoRecord
}

export async function listUserVideos(
  did: string,
  limit = 50,
): Promise<VideoRecordView[]> {
  const { pds } = await resolvePdsForIdentifier(did)
  const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`)
  url.searchParams.set('repo', did)
  url.searchParams.set('collection', 'place.stream.video')
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`listUserVideos failed: ${res.status}`)
  const data = (await res.json()) as { records?: VideoRecordView[] }
  return data.records ?? []
}

export function chatWebSocketUrl(streamer: string): string {
  const u = new URL(STREAMPLACE_HOST)
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${u.origin}/api/websocket/${encodeURIComponent(streamer)}`
}

export type IngestUrl = {
  $type: 'place.stream.ingest.defs#ingest'
  type: string
  url: string
}

export type TypeaheadActor = {
  did: string
  handle: string
}

export async function searchActorsTypeahead(
  q: string,
  limit = 10,
): Promise<TypeaheadActor[]> {
  if (q.trim().length === 0) return []
  const url = new URL(
    `${STREAMPLACE_HOST}/xrpc/place.stream.live.searchActorsTypeahead`,
  )
  url.searchParams.set('q', q)
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`searchActorsTypeahead failed: ${res.status}`)
  const data = (await res.json()) as { actors: TypeaheadActor[] }
  return data.actors ?? []
}

export async function getIngestUrls(): Promise<IngestUrl[]> {
  const res = await fetch(
    `${STREAMPLACE_HOST}/xrpc/place.stream.ingest.getIngestUrls`,
    { headers: { accept: 'application/json' } },
  )
  if (!res.ok) throw new Error(`getIngestUrls failed: ${res.status}`)
  const data = (await res.json()) as { ingests: IngestUrl[] }
  return data.ingests ?? []
}

export type StreamKeyRecord = {
  uri: string
  cid: string
  value: {
    $type?: string
    signingKey: string
    createdAt: string
    createdBy?: string
  }
}

export type ChatMessageView = {
  $type: 'place.stream.chat.defs#messageView'
  uri: string
  cid: string
  author: {
    did: string
    handle: string
    displayName?: string
    avatar?: string
  }
  chatProfile?: {
    color?: { red: number; green: number; blue: number }
  }
  record: {
    $type: 'place.stream.chat.message'
    text: string
    createdAt: string
    streamer: string
  }
  indexedAt: string
  deleted?: boolean
}
