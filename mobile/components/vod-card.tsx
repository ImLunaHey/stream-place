import { Link } from 'expo-router'
import { Image, Pressable, Text, View } from 'react-native'
import { formatDuration } from '../lib/format-duration'
import { timeAgo } from '../lib/time-ago'
import { thumbUrl } from '../lib/streamplace'
import type { VideoRecordView } from '../lib/streamplace-extra'

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
    <Link href={`/vod/${handle}/${rkey}`} asChild>
      <Pressable className="flex-1 gap-2">
        <View className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800">
          {thumb ? (
            <Image source={{ uri: thumb }} className="h-full w-full" />
          ) : (
            <View className="h-full w-full" />
          )}
          <View className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5">
            <Text className="text-xs font-medium text-white">
              {formatDuration(video.value.durationMs)}
            </Text>
          </View>
        </View>
        <View>
          <Text className="text-sm font-semibold text-white" numberOfLines={2}>
            {video.value.title}
          </Text>
          <Text className="text-xs text-zinc-500">
            {timeAgo(video.value.createdAt)}
          </Text>
        </View>
      </Pressable>
    </Link>
  )
}
