import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import {
  acknowledge,
  hasAcknowledged,
} from '../lib/content-warning-storage'
import {
  formatViewers,
  playlistUrl,
  thumbUrl,
  type LivestreamView,
} from '../lib/streamplace'
import { useSegmentMeta } from '../hooks/use-segment-meta'
import { ContentWarningOverlay } from './content-warning-overlay'
import { Player } from './player'

type Props = {
  handle: string
  stream?: LivestreamView
}

export function ChannelPlayer({ handle, stream }: Props) {
  const isLive = !!stream
  const meta = useSegmentMeta(handle)
  const [acknowledged, setAcknowledged] = useState(false)

  const poster = stream?.record.thumb
    ? thumbUrl(stream.author.did, stream.record.thumb.ref.$link)
    : undefined

  useEffect(() => setAcknowledged(false), [handle])
  useEffect(() => {
    if (meta.contentWarnings.length === 0) return
    void hasAcknowledged(handle, meta.contentWarnings).then((ok) => {
      if (ok) setAcknowledged(true)
    })
  }, [handle, meta.contentWarnings])

  const showWarning =
    isLive && meta.contentWarnings.length > 0 && !acknowledged
  const src = isLive && !showWarning ? playlistUrl(handle) : null

  if (!isLive) {
    return (
      <View className="aspect-video w-full items-center justify-center bg-black">
        <Text className="text-sm text-zinc-400">
          @{handle} isn't live right now.
        </Text>
      </View>
    )
  }

  return (
    <View className="relative aspect-video w-full bg-black">
      <Player src={src} poster={poster} live />
      {!showWarning && (
        <View
          pointerEvents="none"
          className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded bg-rose-600 px-2 py-1"
          style={{ zIndex: 10 }}
        >
          <View className="h-1.5 w-1.5 rounded-full bg-white" />
          <Text className="text-[11px] font-bold uppercase tracking-wider text-white">
            Live
          </Text>
        </View>
      )}
      {!showWarning && stream?.viewerCount && (
        <View
          pointerEvents="none"
          className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1"
          style={{ zIndex: 10 }}
        >
          <Text className="text-xs text-white">
            {formatViewers(stream.viewerCount.count)} watching
          </Text>
        </View>
      )}
      {showWarning && (
        <ContentWarningOverlay
          warnings={meta.contentWarnings}
          onAccept={() => {
            void acknowledge(handle, meta.contentWarnings)
            setAcknowledged(true)
          }}
        />
      )}
    </View>
  )
}
