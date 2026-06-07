import { Link } from 'expo-router'
import { useMemo, useState } from 'react'
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native'
import { useDebounced } from '../hooks/use-debounced'
import { useLiveUsers } from '../hooks/use-live-users'
import { useProfilesByHandle } from '../hooks/use-profiles-by-handle'
import { useTypeahead } from '../hooks/use-typeahead'

export default function Search() {
  const [query, setQuery] = useState('')
  const debounced = useDebounced(query, 250)
  const { data: actors = [], isFetching } = useTypeahead(debounced.trim(), 25)
  const { data: liveStreams = [] } = useLiveUsers(50)
  const profiles = useProfilesByHandle(
    useMemo(() => actors.map((a) => a.handle), [actors]),
  )

  const lower = debounced.toLowerCase()
  const liveMatches = useMemo(() => {
    if (!lower) return []
    return liveStreams.filter((s) => {
      return (
        s.author.handle.toLowerCase().includes(lower) ||
        s.record.title.toLowerCase().includes(lower) ||
        (s.record.tags?.join(' ').toLowerCase() ?? '').includes(lower)
      )
    })
  }, [liveStreams, lower])

  return (
    <View className="flex-1 bg-zinc-900">
      <View className="border-b border-white/5 bg-zinc-950 p-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Search channels"
          placeholderTextColor="#71717a"
          className="rounded-md bg-white/5 px-3 py-2 text-white"
        />
      </View>

      <FlatList
        data={actors}
        keyExtractor={(a) => a.did}
        ListHeaderComponent={
          liveMatches.length > 0 ? (
            <View className="p-3">
              <Text className="mb-2 text-xs uppercase tracking-wider text-zinc-400">
                Live now ({liveMatches.length})
              </Text>
              {liveMatches.map((s) => (
                <Link
                  key={s.uri}
                  href={`/channel/${s.author.handle}`}
                  asChild
                >
                  <Pressable className="mb-2 flex-row items-center gap-3 rounded-md bg-white/5 p-2">
                    <Text className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Live
                    </Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-white">
                        @{s.author.handle}
                      </Text>
                      <Text className="text-xs text-zinc-400" numberOfLines={1}>
                        {s.record.title}
                      </Text>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          debounced.trim() === '' ? (
            <Text className="p-3 text-sm text-zinc-500">
              Type to search channels.
            </Text>
          ) : isFetching ? (
            <Text className="p-3 text-sm text-zinc-500">Searching…</Text>
          ) : (
            <Text className="p-3 text-sm text-zinc-500">No channels found.</Text>
          )
        }
        renderItem={({ item }) => {
          const p = profiles.get(item.handle)
          return (
            <Link href={`/channel/${item.handle}`} asChild>
              <Pressable className="flex-row items-center gap-3 border-b border-white/5 p-3">
                {p?.avatar ? (
                  <Image
                    source={{ uri: p.avatar }}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <Text className="text-sm font-semibold text-white">
                      {item.handle[0]?.toUpperCase()}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white">
                    {p?.displayName ?? item.handle}
                  </Text>
                  <Text className="text-xs text-zinc-500">@{item.handle}</Text>
                </View>
              </Pressable>
            </Link>
          )
        }}
      />
    </View>
  )
}
