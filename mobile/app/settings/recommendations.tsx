import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDebounced } from '../../hooks/use-debounced'
import { useProfilesByHandle } from '../../hooks/use-profiles-by-handle'
import {
  useRecommendations,
  useSaveRecommendations,
} from '../../hooks/use-recommendations'
import { useSession } from '../../hooks/use-session'
import { useTypeahead } from '../../hooks/use-typeahead'

const MAX = 8

export default function RecommendationsSettings() {
  const { session } = useSession()
  const { data, isLoading } = useRecommendations()
  const saveMut = useSaveRecommendations()
  const streamers = data?.streamers ?? []
  const profileByDid = useProfileMap(streamers)

  const [query, setQuery] = useState('')
  const debounced = useDebounced(query, 250)
  const { data: actors = [], isFetching } = useTypeahead(debounced.trim(), 10)
  const actorProfiles = useProfilesByHandle(
    useMemo(() => actors.map((a) => a.handle), [actors]),
  )

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-sm text-zinc-400">
          Sign in to manage recommendations.
        </Text>
      </View>
    )
  }

  const atMax = streamers.length >= MAX
  const save = (next: string[]) => saveMut.mutate(next)

  const addStreamer = (did: string) => {
    if (atMax || streamers.includes(did)) return
    save([...streamers, did])
    setQuery('')
  }
  const moveUp = (i: number) => {
    if (i <= 0) return
    const n = [...streamers]
    ;[n[i - 1], n[i]] = [n[i], n[i - 1]]
    save(n)
  }
  const moveDown = (i: number) => {
    if (i >= streamers.length - 1) return
    const n = [...streamers]
    ;[n[i], n[i + 1]] = [n[i + 1], n[i]]
    save(n)
  }
  const remove = (i: number) => {
    Alert.alert('Remove recommendation', 'Remove this streamer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => save(streamers.filter((_, idx) => idx !== i)),
      },
    ])
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-zinc-900"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <Text className="text-xl font-bold text-white">
          Recommended to others
        </Text>
        <Text className="mt-1 text-xs text-zinc-500">
          Up to {MAX} channels you surface as recommendations.
        </Text>

        {!atMax && (
          <View className="mt-4 rounded-md bg-white/5">
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Search streamers"
              placeholderTextColor="#71717a"
              className="px-3 py-2 text-white"
            />
            {debounced.trim() !== '' && (
              <View className="border-t border-white/5">
                {isFetching ? (
                  <Text className="px-3 py-2 text-xs text-zinc-500">
                    Searching…
                  </Text>
                ) : actors.length === 0 ? (
                  <Text className="px-3 py-2 text-xs text-zinc-500">
                    No results.
                  </Text>
                ) : (
                  actors.map((a) => {
                    const p = actorProfiles.get(a.handle)
                    const added = streamers.includes(a.did)
                    return (
                      <Pressable
                        key={a.did}
                        onPress={() => !added && addStreamer(a.did)}
                        disabled={added}
                        className="flex-row items-center gap-3 border-t border-white/5 px-3 py-2"
                        style={{ opacity: added ? 0.5 : 1 }}
                      >
                        {p?.avatar ? (
                          <Image
                            source={{ uri: p.avatar }}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <View className="h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                            <Text className="text-xs font-semibold text-white">
                              {a.handle[0]?.toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-white">
                            {p?.displayName ?? a.handle}
                          </Text>
                          <Text className="text-xs text-zinc-500">
                            @{a.handle}
                          </Text>
                        </View>
                        {added && (
                          <Text className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Added
                          </Text>
                        )}
                      </Pressable>
                    )
                  })
                )}
              </View>
            )}
          </View>
        )}

        {isLoading && (
          <View className="mt-4 flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-sm text-zinc-400">Loading…</Text>
          </View>
        )}

        {streamers.length === 0 && !isLoading && (
          <Text className="mt-4 text-sm text-zinc-400">
            No recommendations yet.
          </Text>
        )}

        <View className="mt-4 gap-2">
          {streamers.map((did, i) => {
            const p = profileByDid.get(did)
            return (
              <View
                key={did + i}
                className="flex-row items-center gap-2 rounded-md bg-white/5 p-2"
              >
                <Text className="w-5 text-center text-xs text-zinc-500">
                  {i + 1}
                </Text>
                {p?.avatar ? (
                  <Image
                    source={{ uri: p.avatar }}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <View className="h-8 w-8 rounded-full bg-zinc-800" />
                )}
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-white"
                    numberOfLines={1}
                  >
                    {p?.displayName ?? p?.handle ?? did}
                  </Text>
                  {p?.handle && (
                    <Text className="text-xs text-zinc-500">@{p.handle}</Text>
                  )}
                </View>
                <Pressable
                  onPress={() => moveUp(i)}
                  disabled={i === 0}
                  className="p-1"
                  style={{ opacity: i === 0 ? 0.3 : 1 }}
                >
                  <Text className="text-zinc-300">↑</Text>
                </Pressable>
                <Pressable
                  onPress={() => moveDown(i)}
                  disabled={i === streamers.length - 1}
                  className="p-1"
                  style={{ opacity: i === streamers.length - 1 ? 0.3 : 1 }}
                >
                  <Text className="text-zinc-300">↓</Text>
                </Pressable>
                <Pressable onPress={() => remove(i)} className="p-1">
                  <Text className="text-rose-300">✕</Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        <Text className="mt-4 text-xs text-zinc-500">
          {streamers.length} / {MAX} used
        </Text>
      </ScrollView>
    </>
  )
}

function useProfileMap(dids: string[]) {
  const profiles = useProfilesByHandle(dids)
  return useMemo(() => {
    const m = new Map<string, ReturnType<typeof profiles.get>>()
    for (const p of profiles.values()) m.set(p.did, p)
    return m
  }, [profiles])
}
