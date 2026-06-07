import { Pressable, Image, Text, View } from 'react-native'
import { formatTags } from '../lib/format-tags'
import {
  formatViewers,
  thumbUrl,
  type LivestreamView,
  type ResolvedProfile,
} from '../lib/streamplace'
import { navigate } from '../lib/navigate'

type Props = {
  stream: LivestreamView
  profile?: ResolvedProfile
}

export function StreamCard({ stream, profile }: Props) {
  const handle = stream.author.handle
  const displayName = profile?.displayName ?? handle
  const thumb = stream.record.thumb
    ? thumbUrl(stream.author.did, stream.record.thumb.ref.$link)
    : null
  const avatar = profile?.avatar
  const tags = formatTags(stream.record.tags).slice(0, 3)

  return (
    <Pressable
      onPress={() => navigate(`/channel/${handle}`)}
      className="flex-col gap-2"
    >
      <View className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800">
        {thumb ? (
          <Image source={{ uri: thumb }} className="h-full w-full" />
        ) : avatar ? (
          <Image
            source={{ uri: avatar }}
            className="h-full w-full opacity-30"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-2xl font-black text-zinc-600">
              {handle[0]?.toUpperCase()}
            </Text>
          </View>
        )}
        <View className="absolute left-2 top-2 rounded bg-rose-600 px-1.5 py-0.5">
          <Text className="text-[10px] font-bold uppercase text-white">
            Live
          </Text>
        </View>
        {stream.viewerCount && (
          <View className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5">
            <Text className="text-xs font-medium text-white">
              {formatViewers(stream.viewerCount.count)} watching
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row gap-3 px-1">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            className="h-9 w-9 shrink-0 rounded-full"
          />
        ) : (
          <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <Text className="text-xs font-semibold text-white">
              {handle[0]?.toUpperCase()}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-white"
            numberOfLines={1}
          >
            {stream.record.title}
          </Text>
          <Text className="text-xs text-zinc-400" numberOfLines={1}>
            {displayName}
          </Text>
          {tags.length > 0 && (
            <View className="mt-1 flex-row flex-wrap gap-1">
              {tags.map((t) => (
                <View key={t} className="rounded bg-white/10 px-1.5 py-0.5">
                  <Text className="text-[10px] text-zinc-300">{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}
