import { AtpAgent, type AtpSessionData } from '@atproto/api'
import { readJson, writeJson } from './storage'
import { resolvePdsForIdentifier } from './resolve-pds'

const SESSION_KEY = 'streamplace.session'
const DEFAULT_SERVICE = 'https://bsky.social'

export type Session = AtpSessionData & { service: string }

async function loadSession(): Promise<Session | null> {
  return readJson<Session>(SESSION_KEY)
}

async function saveSession(session: Session | null): Promise<void> {
  await writeJson(SESSION_KEY, session)
}

export function createAgent(service = DEFAULT_SERVICE): AtpAgent {
  return new AtpAgent({
    service,
    persistSession: (_evt, sess) => {
      if (sess) void saveSession({ ...sess, service })
      else void saveSession(null)
    },
  })
}

export async function resumeAgent(): Promise<{
  agent: AtpAgent
  session: Session
} | null> {
  const session = await loadSession()
  if (!session) return null
  const agent = createAgent(session.service)
  try {
    await agent.resumeSession(session)
    return { agent, session }
  } catch {
    await saveSession(null)
    return null
  }
}

export async function loginWithAppPassword(
  identifier: string,
  password: string,
): Promise<{ agent: AtpAgent; session: Session }> {
  let pds = DEFAULT_SERVICE
  try {
    const resolved = await resolvePdsForIdentifier(identifier)
    pds = resolved.pds
  } catch {}
  const agent = createAgent(pds)
  await agent.login({ identifier, password })
  if (!agent.session) throw new Error('Login succeeded but no session returned')
  return { agent, session: { ...agent.session, service: pds } }
}

export async function clearSession(): Promise<void> {
  await saveSession(null)
  cachedAgent = null
}

let cachedAgent: AtpAgent | null = null

export async function getAuthedAgent(): Promise<AtpAgent | null> {
  if (cachedAgent?.hasSession) return cachedAgent
  const resumed = await resumeAgent()
  cachedAgent = resumed?.agent ?? null
  return cachedAgent
}
