import { Link, router } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useLogout } from '../../hooks/use-logout'
import { useSession } from '../../hooks/use-session'

const ITEMS: Array<{ href: string; label: string }> = [
  { href: '/settings/multistream', label: 'Multistream' },
  { href: '/settings/webhooks', label: 'Webhooks' },
  { href: '/settings/recommendations', label: 'Recommends' },
  { href: '/settings/favourites', label: 'Favourites' },
  { href: '/go-live', label: 'Go live' },
]

export default function Settings() {
  const { session } = useSession()
  const logout = useLogout()

  return (
    <ScrollView
      className="flex-1 bg-zinc-900"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text className="text-2xl font-bold text-white">Settings</Text>

      {session ? (
        <View className="mt-4 rounded-md bg-white/5 p-4">
          <Text className="text-xs uppercase tracking-wider text-zinc-400">
            Account
          </Text>
          <Text className="mt-2 text-sm font-semibold text-white">
            @{session.handle}
          </Text>
          <Text className="text-xs text-zinc-500">{session.did}</Text>
          <Pressable
            onPress={() =>
              logout.mutate(undefined, {
                onSuccess: () => router.replace('/'),
              })
            }
            className="mt-3 self-start rounded-md bg-rose-500/20 px-3 py-2"
          >
            <Text className="text-sm font-semibold text-rose-300">Log out</Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-4 rounded-md bg-white/5 p-4">
          <Text className="text-sm text-zinc-300">Not signed in.</Text>
          <Pressable
            onPress={() => router.push('/login')}
            className="mt-3 self-start rounded-md bg-pink-500 px-3 py-2"
          >
            <Text className="text-sm font-semibold text-white">Sign in</Text>
          </Pressable>
        </View>
      )}

      <View className="mt-4 gap-1.5">
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href} asChild>
            <Pressable className="flex-row items-center justify-between rounded-md bg-white/5 px-3 py-3">
              <Text className="text-sm font-semibold text-zinc-200">
                {it.label}
              </Text>
              <Text className="text-zinc-500">›</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  )
}
