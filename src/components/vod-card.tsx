import { Link } from '@tanstack/react-router'
import { Video } from 'lucide-react'
import { formatDuration } from '../lib/format-duration'
import { timeAgo } from '../lib/time-ago'
import type { VideoRecordView } from '../lib/streamplace'
import { thumbUrl } from '../lib/streamplace'

type Props = {
  handle: string
  did: string
  video: VideoRecordView
}

function rkeyFromUri(uri: string): string {
  return uri.split('/').pop() ?? ''
}

export function VodCard({ handle, did, video }: Props) {
  const rkey = rkeyFromUri(video.uri)
  const thumb = video.value.thumb
    ? thumbUrl(did, video.value.thumb.ref.$link)
    : null

  return (
    <Link
      to="/vod/$handle/$rkey"
      params={{ handle, rkey }}
      viewTransition
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/5 transition group-hover:ring-violet-400/60">
        {thumb ? (
          <img
            src={thumb}
            alt={video.value.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full place-items-center text-zinc-600">
            <Video className="h-8 w-8" />
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.value.durationMs)}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-violet-300">
          {video.value.title}
        </h3>
        <p className="text-xs text-zinc-500">
          {timeAgo(video.value.createdAt)}
        </p>
      </div>
    </Link>
  )
}
