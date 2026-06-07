import { useEffect, useState } from 'react'
import type { LivestreamView, ResolvedProfile } from '../lib/streamplace'
import { playlistUrl, thumbUrl } from '../lib/streamplace'
import { safeViewName } from '../lib/format'
import {
  acknowledge,
  hasAcknowledged,
} from '../lib/content-warning-storage'
import { useSegmentMeta } from '../hooks/use-segment-meta'
import { ContentWarningOverlay } from './content-warning-overlay'
import { VideoPlayer } from './video-player'

type Props = {
  handle: string
  stream?: LivestreamView
  profile?: ResolvedProfile
}

export function ChannelPlayer({ handle, stream, profile }: Props) {
  const safe = safeViewName(handle)
  const isLive = !!stream
  const poster = stream?.record.thumb
    ? thumbUrl(stream.author.did, stream.record.thumb.ref.$link)
    : profile?.avatar
  const src = isLive ? playlistUrl(handle) : null

  const meta = useSegmentMeta(handle)
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    setAcknowledged(false)
  }, [handle])

  useEffect(() => {
    if (meta.contentWarnings.length === 0) return
    if (hasAcknowledged(handle, meta.contentWarnings)) setAcknowledged(true)
  }, [handle, meta.contentWarnings])

  const showWarning =
    isLive && meta.contentWarnings.length > 0 && !acknowledged

  return (
    <div
      className="relative aspect-video w-full overflow-hidden bg-black"
      style={{ viewTransitionName: `thumb-${safe}` }}
    >
      {src && !showWarning ? (
        <VideoPlayer
          src={src}
          poster={poster}
          viewerCount={stream?.viewerCount?.count}
          className="h-full w-full"
          onReportStream={() => {
            if (stream)
              window.open(
                `https://bsky.app/profile/${stream.author.handle}`,
                '_blank',
              )
          }}
          onReportUser={() => {
            window.open(`https://bsky.app/profile/${handle}`, '_blank')
          }}
        />
      ) : !src ? (
        <div className="grid h-full place-items-center text-sm text-zinc-400">
          @{handle} isn't live right now.
        </div>
      ) : (
        poster && (
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover opacity-50"
          />
        )
      )}

      {showWarning && (
        <ContentWarningOverlay
          warnings={meta.contentWarnings}
          onAccept={() => {
            acknowledge(handle, meta.contentWarnings)
            setAcknowledged(true)
          }}
        />
      )}
    </div>
  )
}
