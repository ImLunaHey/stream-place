const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

const ACTIVITY_LABELS: Record<string, string> = {
  events: 'Events',
  just_chatting: 'Just Chatting',
  music: 'Music',
  art: 'Art',
  software_dev: 'Software & Dev',
  cooking: 'Cooking',
  miniatures: 'Miniatures',
  makers_crafting: 'Makers & Crafting',
  fitness: 'Fitness',
  sports: 'Sports',
}

export function formatTag(raw: string): { label: string; key: string } | null {
  if (raw.startsWith('cwarn:')) return null
  if (raw.startsWith('lang:')) {
    const code = raw.slice('lang:'.length)
    try {
      const name = languageNames.of(code) ?? code
      return { label: name, key: `lang-${code}` }
    } catch {
      return { label: code, key: `lang-${code}` }
    }
  }
  if (raw.includes(':')) {
    const [, value] = raw.split(':', 2)
    return { label: value || raw, key: raw }
  }
  return { label: raw, key: raw }
}

export function formatTags(tags: string[] | undefined): Array<{
  label: string
  key: string
}> {
  if (!tags) return []
  const out: Array<{ label: string; key: string }> = []
  const seen = new Set<string>()
  for (const t of tags) {
    const formatted = formatTag(t)
    if (!formatted) continue
    if (seen.has(formatted.key)) continue
    seen.add(formatted.key)
    out.push(formatted)
  }
  return out
}

type Activity =
  | {
      $type?: 'place.stream.defs#activityGame'
      uri?: string
      name?: string
    }
  | {
      $type?: 'place.stream.defs#activityLabel'
      label?: string
    }
  | undefined
  | null

export function formatActivity(activity: Activity): string | null {
  if (!activity) return null
  if ('name' in activity && activity.name) return activity.name
  if ('label' in activity && activity.label)
    return ACTIVITY_LABELS[activity.label] ?? activity.label
  if ('uri' in activity && activity.uri) {
    const rkey = activity.uri.split('/').pop()
    if (rkey) return rkey.replace(/[-_]/g, ' ')
  }
  return null
}
