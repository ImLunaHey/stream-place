import { getAuthedAgent } from './atp'
import { STREAMPLACE_HOST } from './streamplace'

let serverDidPromise: Promise<string> | null = null

async function fetchServerDid(): Promise<string> {
  const res = await fetch(
    `${STREAMPLACE_HOST}/xrpc/place.stream.broadcast.getBroadcaster`,
    { headers: { accept: 'application/json' } },
  )
  if (!res.ok) throw new Error(`getBroadcaster failed: ${res.status}`)
  const data = (await res.json()) as {
    server?: string
    broadcaster?: string
  }
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

const tokenCache = new Map<string, { token: string; expSec: number }>()

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

export function clearServiceAuthCache() {
  tokenCache.clear()
  serverDidPromise = null
}
