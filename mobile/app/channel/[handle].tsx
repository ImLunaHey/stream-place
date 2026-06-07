import { useLocalSearchParams, Stack } from 'expo-router'
import { Image, ScrollView, Text, View } from 'react-native'
import { ChannelPlayer } from '../../components/channel-player'
import { formatTags } from '../../lib/format-tags'
import { useLiveUsers } from '../../hooks/use-live-users'
import { useProfile } from '../../hooks/use-profile'

export default function Channel() {
  const { handle } = useLocalSearchParams<{ handle: string }>()
  const { data: profile } = useProfile(handle)
  const { data: streams = [] } = useLiveUsers(50)
  const stream = streams.find((s) => s.author.handle === handle)
  const tags = formatTags(stream?.record.tags)

  return (
    <>
      <Stack.Screen options={{ title: `@${handle}` }} />
      <ScrollView className="flex-1 bg-zinc-900" contentContainerStyle={{ paddingBottom: 24 }}>
        <ChannelPlayer handle={handle} stream={stream} />
        <View className="px-4 py-4">
          <View className="flex-row gap-3">
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                className="h-14 w-14 shrink-0 rounded-full"
              />
            ) : (
              <View className="h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                <Text className="text-lg font-bold text-white">
                  {handle?.[0]?.toUpperCase()}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {stream?.record.title ?? profile?.displayName ?? handle}
              </Text>
              <Text className="mt-0.5 text-sm text-zinc-300">
                {profile?.displayName ?? handle}{' '}
                <Text className="text-zinc-500">@{handle}</Text>
              </Text>
            </View>
          </View>

          {tags.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-1.5">
              {tags.map((t) => (
                <View key={t} className="rounded bg-white/10 px-2 py-0.5">
                  <Text className="text-xs text-zinc-300">{t}</Text>
                </View>
              ))}
            </View>
          )}

          {profile?.description && (
            <Text className="mt-4 text-sm text-zinc-300">
              {profile.description}
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  )
}
