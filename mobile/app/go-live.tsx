import * as Clipboard from 'expo-clipboard'
import { router, Stack } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { SecretText } from '../components/secret-text'
import { useSession } from '../hooks/use-session'
import { useStreamKeys } from '../hooks/use-stream-keys'
import { ingestUrlsQuery } from '../queries/ingest-urls'

export default function GoLive() {
  const { session } = useSession()
  const { data: ingests = [] } = useQuery(ingestUrlsQuery)
  const { data: keys = [] } = useStreamKeys(session?.did)

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <Stack.Screen options={{ title: 'Go live' }} />
        <Text className="text-center text-base text-zinc-300">
          Sign in to go live.
        </Text>
        <Pressable
          onPress={() => router.push('/login')}
          className="mt-4 rounded-md bg-violet-500 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-white">Sign in</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-zinc-900"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Stack.Screen options={{ title: 'Go live' }} />
      <Text className="text-2xl font-bold text-white">Go live</Text>
      <Text className="mt-1 text-sm text-zinc-400">
        Point your encoder at an ingest endpoint with a signing key.
      </Text>

      <View className="mt-6 rounded-lg bg-white/5 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Stream keys ({keys.length})
        </Text>
        {keys.length === 0 ? (
          <Text className="mt-2 text-sm text-zinc-400">
            No stream keys yet. Generate one in the official stream.place
            client.
          </Text>
        ) : (
          <View className="mt-3 gap-3">
            {keys.map((k) => (
              <View key={k.uri} className="rounded-md bg-zinc-900 p-2">
                <Text className="mb-1.5 text-xs text-zinc-500">
                  {k.value.createdBy ?? 'unknown'} ·{' '}
                  {new Date(k.value.createdAt).toLocaleString()}
                </Text>
                <SecretText value={k.value.signingKey} />
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mt-4 rounded-lg bg-white/5 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Ingest endpoints
        </Text>
        <View className="mt-3 gap-2">
          {ingests.map((i) => (
            <View
              key={`${i.type}:${i.url}`}
              className="flex-row items-center gap-2 rounded-md bg-zinc-900 p-2"
            >
              <View className="rounded bg-violet-500/20 px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-violet-200">
                  {i.type}
                </Text>
              </View>
              <Text className="flex-1 font-mono text-xs text-zinc-200">
                {i.url}
              </Text>
              <Pressable
                onPress={() => Clipboard.setStringAsync(i.url)}
                className="rounded bg-white/10 px-2 py-1"
              >
                <Text className="text-xs text-zinc-200">Copy</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
