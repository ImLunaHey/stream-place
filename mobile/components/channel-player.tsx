import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { Platform, Text, useWindowDimensions, View } from 'react-native'
import {
  acknowledge,
  hasAcknowledged,
} from '../lib/content-warning-storage'
import { playlistUrl, type LivestreamView } from '../lib/streamplace'
import { useSegmentMeta } from '../hooks/use-segment-meta'
import { ContentWarningOverlay } from './content-warning-overlay'
import { PlayerOverlay } from './player-overlay'

type Props = {
  handle: string
  stream?: LivestreamView
}

export function ChannelPlayer({ handle, stream }: Props) {
  const isLive = !!stream
  const meta = useSegmentMeta(handle)
  const [acknowledged, setAcknowledged] = useState(false)
  const { width } = useWindowDimensions()
  const useCustomControls = Platform.OS === 'web' && width >= 1024

  useEffect(() => setAcknowledged(false), [handle])
  useEffect(() => {
    if (meta.contentWarnings.length === 0) return
    void hasAcknowledged(handle, meta.contentWarnings).then((ok) => {
      if (ok) setAcknowledged(true)
    })
  }, [handle, meta.contentWarnings])

  const showWarning =
    isLive && meta.contentWarnings.length > 0 && !acknowledged

  const player = useVideoPlayer(
    isLive && !showWarning
      ? { uri: playlistUrl(handle), contentType: 'hls' }
      : null,
    (p) => {
      if (isLive && !showWarning) p.play()
    },
  )

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
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        nativeControls={!useCustomControls}
        allowsFullscreen
        allowsPictureInPicture
      />
      {useCustomControls && (
        <PlayerOverlay
          player={player}
          live
          viewerCount={stream?.viewerCount?.count}
        />
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
