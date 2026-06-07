export function formatViewers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function safeViewName(handle: string) {
  return handle.replace(/[^a-z0-9]/gi, '-')
}
