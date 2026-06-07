import { useVideoPlayer, VideoView } from 'expo-video'
import { Text, View } from 'react-native'
import { formatViewers, playlistUrl, type LivestreamView } from '../lib/streamplace'

type Props = {
  handle: string
  stream?: LivestreamView
}

export function ChannelPlayer({ handle, stream }: Props) {
  const isLive = !!stream
  const player = useVideoPlayer(
    isLive
      ? { uri: playlistUrl(handle), contentType: 'hls' }
      : null,
    (p) => {
      if (isLive) p.play()
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
        nativeControls
        allowsFullscreen
        allowsPictureInPicture
      />
      <View className="pointer-events-none absolute left-3 top-3 flex-row items-center gap-1.5 rounded bg-rose-600 px-2 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-white" />
        <Text className="text-[11px] font-bold uppercase tracking-wider text-white">
          Live
        </Text>
      </View>
      {stream?.viewerCount && (
        <View className="pointer-events-none absolute right-3 top-3 rounded bg-black/70 px-2 py-1">
          <Text className="text-xs text-white">
            {formatViewers(stream.viewerCount.count)} watching
          </Text>
        </View>
      )}
    </View>
  )
}
