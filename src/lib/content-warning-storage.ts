const KEY = 'streamplace.cwAcks'

type AckMap = Record<string, string[]>

function read(): AckMap {
  if (typeof localStorage === 'undefined') return {}
  const raw = localStorage.getItem(KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as AckMap
  } catch {
    return {}
  }
}

export function hasAcknowledged(handle: string, warnings: string[]): boolean {
  if (warnings.length === 0) return true
  const acks = read()[handle] ?? []
  return warnings.every((w) => acks.includes(w))
}

export function acknowledge(handle: string, warnings: string[]) {
  if (typeof localStorage === 'undefined') return
  const map = read()
  const merged = new Set([...(map[handle] ?? []), ...warnings])
  map[handle] = [...merged]
  localStorage.setItem(KEY, JSON.stringify(map))
}
