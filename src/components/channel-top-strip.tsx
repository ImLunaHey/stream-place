import { useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useElapsedSince } from '../hooks/use-elapsed-since'
import type { LivestreamView, ResolvedProfile } from '../lib/streamplace'

type Props = {
  handle: string
  stream?: LivestreamView
  profile?: ResolvedProfile
  className?: string
}

function formatViewers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function ChannelTopStrip({ handle, stream, profile, className }: Props) {
  const router = useRouter()
  const displayName = profile?.displayName ?? handle
  const avatar = profile?.avatar
  const live = !!stream
  const elapsed = useElapsedSince(stream?.record.createdAt)

  return (
    <header
      className={`flex h-12 shrink-0 items-center gap-3 border-b border-white/5 bg-zinc-950 px-2 ${
        className ?? ''
      }`}
    >
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Back"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-zinc-300 hover:bg-white/5 hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/10"
        />
      ) : (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold ring-1 ring-white/10">
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
        <p className="flex items-center gap-2 text-[11px] text-zinc-400">
          {live && stream?.viewerCount && (
            <span>{formatViewers(stream.viewerCount.count)} watching</span>
          )}
          {live && elapsed && (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
              {elapsed}
            </span>
          )}
          {!live && <span>Offline</span>}
        </p>
      </div>
    </header>
  )
}
