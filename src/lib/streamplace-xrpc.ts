import { STREAMPLACE_HOST } from './streamplace'
import { getServiceAuthToken } from './streamplace-auth'

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
  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers,
  }
  if (options.body != null) {
    headers['content-type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }

  const res = await fetch(url, init)
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
