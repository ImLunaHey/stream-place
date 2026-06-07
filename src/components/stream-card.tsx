import { Link } from '@tanstack/react-router'
import { formatTags } from '../lib/format-tags'
import type { LivestreamView, ResolvedProfile } from '../lib/streamplace'
import { StreamThumbnail } from './stream-thumbnail'

type Props = {
  stream: LivestreamView
  profile?: ResolvedProfile
}

export function StreamCard({ stream, profile }: Props) {
  const handle = stream.author.handle
  const displayName = profile?.displayName ?? handle
  const avatar = profile?.avatar

  return (
    <Link
      to="/channel/$handle"
      params={{ handle }}
      viewTransition
      className="group flex flex-col gap-3"
    >
      <StreamThumbnail stream={stream} profile={profile} />
      <div className="flex gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full ring-1 ring-white/10"
            loading="lazy"
          />
        ) : (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-semibold text-white ring-1 ring-white/10">
            {handle[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-violet-300">
            {stream.record.title}
          </h3>
          <p className="truncate text-xs text-zinc-400">
            <span className="text-zinc-300">{displayName}</span>{' '}
            <span>· @{handle}</span>
          </p>
          {(() => {
            const formatted = formatTags(stream.record.tags).slice(0, 3)
            if (formatted.length === 0) return null
            return (
              <div className="mt-1 flex flex-wrap gap-1">
                {formatted.map((t) => (
                  <span
                    key={t.key}
                    className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            )
          })()}
        </div>
      </div>
    </Link>
  )
}
