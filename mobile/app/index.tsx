import {
  FlatList,
  Platform,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useMemo } from 'react'
import { StreamCard } from '../components/stream-card'
import { useLiveUsers } from '../hooks/use-live-users'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'

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

  const { width } = useWindowDimensions()
  const isDesktop = Platform.OS === 'web' && width >= 1024
  const numColumns = isDesktop
    ? width >= 1536
      ? 4
      : width >= 1280
      ? 3
      : 2
    : 1

  return (
    <FlatList
      key={`cols-${numColumns}`}
      data={sorted}
      keyExtractor={(s) => s.uri}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? { gap: 16 } : undefined}
      contentContainerStyle={{
        padding: isDesktop ? 24 : 12,
        gap: 16,
        maxWidth: 1400,
        ...(isDesktop ? { marginHorizontal: 'auto', width: '100%' as any } : {}),
      }}
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
        <View
          style={
            numColumns > 1
              ? { flex: 1, maxWidth: `${100 / numColumns}%` as any }
              : undefined
          }
        >
          <StreamCard
            stream={item}
            profile={profiles.get(item.author.handle)}
          />
        </View>
      )}
    />
  )
}
