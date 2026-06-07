import { Video } from 'lucide-react-native'
import { Text, useWindowDimensions, View } from 'react-native'
import { useUserVideos } from '../hooks/use-user-videos'
import { VodCard } from './vod-card'

type Props = { handle: string; did: string | undefined }

export function UserVods({ handle, did }: Props) {
  const { data: videos = [], isLoading } = useUserVideos(did)
  const { width } = useWindowDimensions()
  const numColumns = width >= 1024 ? 3 : width >= 640 ? 2 : 1

  if (!did) return null
  if (isLoading)
    return (
      <View className="mt-8 px-4">
        <View className="mb-3 flex-row items-center gap-2">
          <Video size={14} color="#a1a1aa" />
          <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Videos
          </Text>
        </View>
        <Text className="text-sm text-zinc-500">Loading…</Text>
      </View>
    )
  if (videos.length === 0) return null

  return (
    <View className="mt-8 px-4">
      <View className="mb-3 flex-row items-baseline justify-between">
        <View className="flex-row items-center gap-2">
          <Video size={14} color="#a1a1aa" />
          <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Videos
          </Text>
        </View>
        <Text className="text-xs text-zinc-500">{videos.length}</Text>
      </View>
      <View
        className="flex-row flex-wrap"
        style={{ marginHorizontal: -8, rowGap: 16 }}
      >
        {videos.map((v) => (
          <View
            key={v.uri}
            style={{
              width: `${100 / numColumns}%` as any,
              paddingHorizontal: 8,
            }}
          >
            <VodCard handle={handle} did={did} video={v} />
          </View>
        ))}
      </View>
    </View>
  )
}
