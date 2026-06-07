import { useState } from 'react'
import type { LivestreamView, ResolvedProfile } from '../lib/streamplace'
import { thumbUrl } from '../lib/streamplace'
import { formatViewers, safeViewName } from '../lib/format'
import { ThumbImage } from './thumb-image'

type Props = {
  stream: LivestreamView
  profile?: ResolvedProfile
}

export function StreamThumbnail({ stream, profile }: Props) {
  const handle = stream.author.handle
  const safe = safeViewName(handle)
  const thumb = stream.record.thumb
    ? thumbUrl(stream.author.did, stream.record.thumb.ref.$link)
    : null
  const avatar = profile?.avatar
  const displayName = profile?.displayName ?? handle

  const [thumbBroken, setThumbBroken] = useState(false)
  const showImage = thumb && !thumbBroken

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 ring-1 ring-white/5 transition group-hover:ring-violet-400/60"
      style={{ viewTransitionName: `thumb-${safe}` }}
    >
      {showImage ? (
        <ThumbImage
          src={thumb}
          alt={stream.record.title}
          onError={() => setThumbBroken(true)}
        />
      ) : avatar ? (
        <>
          <img
            src={avatar}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
          />
          <div className="absolute inset-0 grid place-items-center">
            <img
              src={avatar}
              alt={displayName}
              className="h-20 w-20 rounded-full ring-2 ring-white/20"
            />
          </div>
        </>
      ) : (
        <div className="grid h-full place-items-center text-2xl font-black text-zinc-600">
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <span className="absolute left-2 top-2 z-10 rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        Live
      </span>
      {stream.viewerCount && (
        <span className="absolute bottom-2 left-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatViewers(stream.viewerCount.count)} watching
        </span>
      )}
    </div>
  )
}
