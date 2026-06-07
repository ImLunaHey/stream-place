import { STREAMPLACE_HOST } from './streamplace'
import { resolvePdsForIdentifier } from './resolve-pds'

export function chatWebSocketUrl(streamer: string): string {
  const u = new URL(STREAMPLACE_HOST)
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${u.origin}/api/websocket/${encodeURIComponent(streamer)}`
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
  chatProfile?: { color?: { red: number; green: number; blue: number } }
  record: {
    $type: 'place.stream.chat.message'
    text: string
    createdAt: string
    streamer: string
  }
  indexedAt: string
  deleted?: boolean
}

export type TypeaheadActor = { did: string; handle: string }

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
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`searchActorsTypeahead failed: ${res.status}`)
  const data = (await res.json()) as { actors: TypeaheadActor[] }
  return data.actors ?? []
}

export type VideoRecord = {
  title: string
  createdAt: string
  description?: string
  durationMs: number
  thumb?: { ref: { $link: string } }
  tags?: string[]
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
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`listUserVideos failed: ${res.status}`)
  const data = (await res.json()) as { records?: VideoRecordView[] }
  return data.records ?? []
}

export function videoPlaylistUrl(uri: string): string {
  const url = new URL(
    `${STREAMPLACE_HOST}/xrpc/place.stream.playback.getVideoPlaylist`,
  )
  url.searchParams.set('uri', uri)
  return url.toString()
}
