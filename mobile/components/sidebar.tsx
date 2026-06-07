import { usePathname } from 'expo-router'
import { HelpCircle, Home, LogIn, RadioTower, Settings } from 'lucide-react-native'
import { useMemo } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useFavourites } from '../hooks/use-favourites'
import { useLiveUsers } from '../hooks/use-live-users'
import { useSession } from '../hooks/use-session'
import { navigate } from '../lib/navigate'
import { FavouriteAvatar } from './favourite-avatar'

type IconLinkProps = {
  href: string
  active?: boolean
  children: React.ReactNode
}

function IconLink({ href, active, children }: IconLinkProps) {
  return (
    <Pressable
      onPress={() => navigate(href)}
      className="relative h-11 w-11 items-center justify-center rounded-xl"
      style={{
        backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
    >
      {active && (
        <View
          className="absolute h-6 w-1 rounded-r-full bg-pink-400"
          style={{ left: -8, top: '50%', transform: [{ translateY: -12 }] }}
        />
      )}
      {children}
    </Pressable>
  )
}

export function Sidebar() {
  const { favourites } = useFavourites()
  const { session } = useSession()
  const { data: live = [] } = useLiveUsers(50)
  const path = usePathname() ?? '/'

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
      <IconLink href="/" active={path === '/'}>
        <Home size={20} color={path === '/' ? '#fff' : '#a1a1aa'} />
      </IconLink>

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
          <IconLink href="/go-live" active={path === '/go-live'}>
            <RadioTower
              size={20}
              color={path === '/go-live' ? '#fff' : '#a1a1aa'}
            />
          </IconLink>
        )}
        {session ? (
          <IconLink
            href="/settings"
            active={path.startsWith('/settings')}
          >
            <Settings
              size={20}
              color={path.startsWith('/settings') ? '#fff' : '#a1a1aa'}
            />
          </IconLink>
        ) : (
          <IconLink href="/login" active={path === '/login'}>
            <LogIn size={20} color={path === '/login' ? '#fff' : '#a1a1aa'} />
          </IconLink>
        )}
        <Pressable
          onPress={() => {
            if (typeof window !== 'undefined')
              window.open('https://stream.place/docs', '_blank')
          }}
          className="h-11 w-11 items-center justify-center rounded-xl"
        >
          <HelpCircle size={20} color="#a1a1aa" />
        </Pressable>
      </View>
    </View>
  )
}
