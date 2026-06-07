import { useEffect, useState } from 'react'

function fmt(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function useElapsedSince(iso: string | undefined): string | null {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!iso) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [iso])

  if (!iso) return null
  const start = Date.parse(iso)
  if (Number.isNaN(start)) return null
  return fmt(now - start)
}
