import { usePathname } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useFavourites } from '../hooks/use-favourites'
import { useLiveUsers } from '../hooks/use-live-users'
import { useSession } from '../hooks/use-session'
import { FavouriteAvatar } from './favourite-avatar'
import { IconButton } from './icon-button'

export function Sidebar() {
  const { favourites } = useFavourites()
  const { session } = useSession()
  const { data: live = [] } = useLiveUsers(50)
  const path = usePathname()

  const liveHandles = useMemo(
    () => new Set(live.map((s) => s.author.handle)),
    [live],
  )
  const liveFavs = favourites.filter((f) => liveHandles.has(f.handle))
  const offlineFavs = favourites.filter((f) => !liveHandles.has(f.handle))

  return (
    <View
      className="h-full w-16 shrink-0 items-center gap-2 border-r border-white/5 bg-zinc-950 py-3"
      style={{ alignItems: 'center' }}
    >
      <IconButton href="/" active={path === '/'}>
        <Text className="text-lg text-white">🏠</Text>
      </IconButton>

      {favourites.length > 0 && (
        <View className="my-2 h-px w-8 bg-white/10" />
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', gap: 12, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        {liveFavs.map((f) => (
          <FavouriteAvatar
            key={f.handle}
            handle={f.handle}
            displayName={f.displayName}
            avatar={f.avatar}
            active={path === `/channel/${f.handle}`}
            live
          />
        ))}
        {liveFavs.length > 0 && offlineFavs.length > 0 && (
          <View className="my-1 h-px w-6 bg-white/5" />
        )}
        {offlineFavs.map((f) => (
          <FavouriteAvatar
            key={f.handle}
            handle={f.handle}
            displayName={f.displayName}
            avatar={f.avatar}
            active={path === `/channel/${f.handle}`}
          />
        ))}
      </ScrollView>

      <View className="mt-auto items-center gap-1">
        {session && (
          <IconButton href="/go-live" active={path === '/go-live'}>
            <Text className="text-lg text-zinc-400">📡</Text>
          </IconButton>
        )}
        <IconButton
          href={session ? '/settings' : '/login'}
          active={path?.startsWith('/settings') || path === '/login'}
        >
          <Text className="text-lg text-zinc-400">
            {session ? '⚙' : '↪'}
          </Text>
        </IconButton>
      </View>
    </View>
  )
}
