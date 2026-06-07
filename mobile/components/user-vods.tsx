import { Text, View } from 'react-native'
import { useUserVideos } from '../hooks/use-user-videos'
import { VodCard } from './vod-card'

type Props = { handle: string; did: string | undefined }

export function UserVods({ handle, did }: Props) {
  const { data: videos = [], isLoading } = useUserVideos(did)
  if (!did) return null
  if (isLoading)
    return (
      <View className="mt-6 px-4">
        <Text className="text-xs uppercase tracking-wide text-zinc-400">
          Videos
        </Text>
        <Text className="mt-2 text-sm text-zinc-500">Loading…</Text>
      </View>
    )
  if (videos.length === 0) return null
  return (
    <View className="mt-6 px-4">
      <Text className="mb-3 text-xs uppercase tracking-wide text-zinc-400">
        Videos ({videos.length})
      </Text>
      <View className="gap-4">
        {videos.map((v) => (
          <VodCard key={v.uri} handle={handle} did={did} video={v} />
        ))}
      </View>
    </View>
  )
}
