import { readJson, writeJson } from './storage'

const KEY = 'streamplace.cwAcks'

type AckMap = Record<string, string[]>

export async function hasAcknowledged(
  handle: string,
  warnings: string[],
): Promise<boolean> {
  if (warnings.length === 0) return true
  const map = (await readJson<AckMap>(KEY)) ?? {}
  const acks = map[handle] ?? []
  return warnings.every((w) => acks.includes(w))
}

export async function acknowledge(
  handle: string,
  warnings: string[],
): Promise<void> {
  const map = (await readJson<AckMap>(KEY)) ?? {}
  const merged = new Set([...(map[handle] ?? []), ...warnings])
  map[handle] = [...merged]
  await writeJson(KEY, map)
}
