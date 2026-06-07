import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useMemo } from 'react'
import { StreamCard } from '../../components/stream-card'
import { useLiveUsers } from '../../hooks/use-live-users'
import { useProfilesByHandle } from '../../hooks/use-profiles-by-handle'

export default function Home() {
  const { data: streams = [], isLoading, refetch, isRefetching } =
    useLiveUsers(50)

  const sorted = useMemo(
    () =>
      [...streams].sort(
        (a, b) => (b.viewerCount?.count ?? 0) - (a.viewerCount?.count ?? 0),
      ),
    [streams],
  )
  const handles = useMemo(() => sorted.map((s) => s.author.handle), [sorted])
  const profiles = useProfilesByHandle(handles)

  return (
    <FlatList
      data={sorted}
      keyExtractor={(s) => s.uri}
      contentContainerStyle={{ padding: 12, gap: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="#fff"
        />
      }
      ListHeaderComponent={
        <View className="mb-2 flex-row items-baseline justify-between">
          <Text className="text-2xl font-bold text-white">Live now</Text>
          <Text className="text-sm text-zinc-500">
            {sorted.length} streaming
          </Text>
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
          <Text className="px-2 py-4 text-sm text-zinc-400">
            Loading live streams…
          </Text>
        ) : (
          <Text className="px-2 py-4 text-sm text-zinc-400">
            No streams live right now.
          </Text>
        )
      }
      renderItem={({ item }) => (
        <StreamCard stream={item} profile={profiles.get(item.author.handle)} />
      )}
    />
  )
}
