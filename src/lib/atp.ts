import { AtpAgent, type AtpSessionData } from '@atproto/api'
import { resolvePdsForIdentifier } from './resolve-pds'

const SESSION_KEY = 'streamplace.session'
const DEFAULT_SERVICE = 'https://bsky.social'

export type Session = AtpSessionData & { service: string }

function loadSession(): Session | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

function saveSession(session: Session | null) {
  if (typeof localStorage === 'undefined') return
  if (!session) localStorage.removeItem(SESSION_KEY)
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function createAgent(service = DEFAULT_SERVICE) {
  return new AtpAgent({
    service,
    persistSession: (_evt, sess) => {
      if (sess) saveSession({ ...sess, service })
      else saveSession(null)
    },
  })
}

export async function resumeAgent(): Promise<{
  agent: AtpAgent
  session: Session
} | null> {
  const session = loadSession()
  if (!session) return null
  const agent = createAgent(session.service)
  try {
    await agent.resumeSession(session)
    return { agent, session }
  } catch {
    saveSession(null)
    return null
  }
}

export async function loginWithAppPassword(
  identifier: string,
  password: string,
  service?: string,
) {
  let resolvedService = service
  if (!resolvedService) {
    try {
      const { pds } = await resolvePdsForIdentifier(identifier)
      resolvedService = pds
    } catch {
      resolvedService = DEFAULT_SERVICE
    }
  }
  const agent = createAgent(resolvedService)
  await agent.login({ identifier, password })
  if (!agent.session) throw new Error('Login succeeded but no session returned')
  return {
    agent,
    session: { ...agent.session, service: resolvedService } satisfies Session,
  }
}

export function clearSession() {
  saveSession(null)
}

export function getStoredSession() {
  return loadSession()
}

let cachedAgent: AtpAgent | null = null

export async function getAuthedAgent(): Promise<AtpAgent | null> {
  if (cachedAgent?.hasSession) return cachedAgent
  const resumed = await resumeAgent()
  cachedAgent = resumed?.agent ?? null
  return cachedAgent
}

export function clearCachedAgent() {
  cachedAgent = null
}
