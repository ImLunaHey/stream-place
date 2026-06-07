import { getAuthedAgent } from './atp'
import { STREAMPLACE_HOST } from './streamplace'

let serverDidPromise: Promise<string> | null = null
const tokenCache = new Map<string, { token: string; expSec: number }>()

async function fetchServerDid(): Promise<string> {
  const res = await fetch(
    `${STREAMPLACE_HOST}/xrpc/place.stream.broadcast.getBroadcaster`,
  )
  if (!res.ok) throw new Error(`getBroadcaster failed: ${res.status}`)
  const data = (await res.json()) as { server?: string; broadcaster?: string }
  const id = data.server ?? data.broadcaster
  if (!id) throw new Error('No server DID returned')
  return id
}

async function getServerDid(): Promise<string> {
  if (!serverDidPromise) {
    serverDidPromise = fetchServerDid().catch((err) => {
      serverDidPromise = null
      throw err
    })
  }
  return serverDidPromise
}

export async function getServiceAuthToken(lxm: string): Promise<string> {
  const agent = await getAuthedAgent()
  if (!agent?.session) throw new Error('Not signed in')

  const nowSec = Math.floor(Date.now() / 1000)
  const cached = tokenCache.get(lxm)
  if (cached && cached.expSec > nowSec + 30) return cached.token

  const aud = await getServerDid()
  const expSec = nowSec + 5 * 60
  const res = await agent.com.atproto.server.getServiceAuth({
    aud,
    exp: expSec,
    lxm,
  })
  tokenCache.set(lxm, { token: res.data.token, expSec })
  return res.data.token
}

type CallOptions = {
  method?: 'GET' | 'POST'
  params?: Record<string, string | number | undefined>
  body?: unknown
}

export async function callStreamplaceXrpc<T>(
  endpoint: string,
  options: CallOptions = {},
): Promise<T> {
  const token = await getServiceAuthToken(endpoint)
  const url = new URL(`${STREAMPLACE_HOST}/xrpc/${endpoint}`)
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v == null) continue
      url.searchParams.set(k, String(v))
    }
  }
  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
    accept: 'application/json',
  }
  const init: RequestInit = { method: options.method ?? 'GET', headers }
  if (options.body != null) {
    headers['content-type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }
  const res = await fetch(url.toString(), init)
  if (!res.ok) {
    let msg = `${endpoint} failed: ${res.status}`
    try {
      const err = (await res.json()) as { message?: string; error?: string }
      if (err.message) msg = err.message
      else if (err.error) msg = err.error
    } catch {}
    throw new Error(msg)
  }
  return (await res.json()) as T
}
