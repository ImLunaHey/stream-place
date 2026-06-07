const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

export function formatTag(raw: string): string | null {
  if (raw.startsWith('cwarn:')) return null
  if (raw.startsWith('lang:')) {
    const code = raw.slice('lang:'.length)
    try {
      return languageNames.of(code) ?? code
    } catch {
      return code
    }
  }
  if (raw.includes(':')) {
    const [, value] = raw.split(':', 2)
    return value || raw
  }
  return raw
}

export function formatTags(tags: string[] | undefined): string[] {
  if (!tags) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of tags) {
    const label = formatTag(t)
    if (!label) continue
    if (seen.has(label)) continue
    seen.add(label)
    out.push(label)
  }
  return out
}
