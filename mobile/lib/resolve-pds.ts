type DidService = { id?: string; type?: string; serviceEndpoint?: string }
type DidDoc = { service?: DidService[] }

async function fetchDidDoc(did: string): Promise<DidDoc> {
  if (did.startsWith('did:plc:')) {
    const res = await fetch(`https://plc.directory/${did}`)
    if (!res.ok) throw new Error(`PLC directory: ${res.status}`)
    return (await res.json()) as DidDoc
  }
  if (did.startsWith('did:web:')) {
    const tail = did.slice('did:web:'.length)
    const [domain, ...path] = tail.split(':')
    const target = path.length
      ? `https://${domain}/${path.join('/')}/did.json`
      : `https://${domain}/.well-known/did.json`
    const res = await fetch(target)
    if (!res.ok) throw new Error(`did:web doc: ${res.status}`)
    return (await res.json()) as DidDoc
  }
  throw new Error(`Unsupported DID method: ${did}`)
}

async function resolveHandle(handle: string): Promise<string> {
  const url = new URL(
    'https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle',
  )
  url.searchParams.set('handle', handle.replace(/^@/, ''))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Couldn't resolve handle (${res.status})`)
  const data = (await res.json()) as { did?: string }
  if (!data.did) throw new Error('No DID returned for handle')
  return data.did
}

export async function resolvePdsForIdentifier(
  identifier: string,
): Promise<{ did: string; pds: string }> {
  const trimmed = identifier.trim().replace(/^@/, '')
  if (!trimmed) throw new Error('Handle is required')
  const did = trimmed.startsWith('did:') ? trimmed : await resolveHandle(trimmed)
  const doc = await fetchDidDoc(did)
  const svc = doc.service?.find(
    (s) =>
      s.type === 'AtprotoPersonalDataServer' ||
      s.id === '#atproto_pds' ||
      s.id?.endsWith('#atproto_pds'),
  )
  if (!svc?.serviceEndpoint)
    throw new Error('No PDS service entry in DID document')
  return { did, pds: svc.serviceEndpoint }
}
