import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { useDebounced } from '../hooks/use-debounced'
import { useLogout } from '../hooks/use-logout'
import { useProfile } from '../hooks/use-profile'
import { useSession } from '../hooks/use-session'
import { useTypeahead } from '../hooks/use-typeahead'

type Props = { mobile?: boolean }

export function TopBar({ mobile }: Props) {
  const { session } = useSession()
  return (
    <View
      className={`h-14 shrink-0 flex-row items-center gap-3 border-b border-white/5 bg-zinc-950 ${
        mobile ? 'px-3' : 'px-6 gap-4'
      }`}
      style={{ zIndex: 30 }}
    >
      <Link href="/" asChild>
        <Pressable className="flex-row items-center gap-2">
          <Image
            source={require('../assets/icon.png')}
            style={{ width: 26, height: 26, borderRadius: 4 }}
          />
          {!mobile && (
            <Text className="text-sm font-bold text-white">stream.place</Text>
          )}
        </Pressable>
      </Link>

      {!mobile && (
        <View className="ml-4 max-w-md flex-1">
          <TopbarSearch />
        </View>
      )}

      {mobile && (
        <Link href="/search" asChild>
          <Pressable className="ml-auto h-9 w-9 items-center justify-center rounded-md bg-white/5">
            <Text className="text-base text-zinc-300">🔍</Text>
          </Pressable>
        </Link>
      )}

      <View className={`flex-row items-center gap-3 ${mobile ? '' : 'ml-auto'}`}>
        {session ? <UserBadge mobile={mobile} /> : <LoginButton />}
      </View>
    </View>
  )
}

function LoginButton() {
  return (
    <Link href="/login" asChild>
      <Pressable className="rounded-md bg-violet-500 px-3 py-1.5">
        <Text className="text-sm font-semibold text-white">Log in</Text>
      </Pressable>
    </Link>
  )
}

function UserBadge({ mobile }: { mobile?: boolean }) {
  const { session } = useSession()
  const { data: profile } = useProfile(session?.handle)
  const logout = useLogout()
  const [open, setOpen] = useState(false)
  if (!session) return null
  return (
    <View>
      <View className="flex-row items-center gap-1">
        <Link href={`/channel/${session.handle}`} asChild>
          <Pressable className="h-8 w-8 overflow-hidden rounded-full">
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} className="h-full w-full" />
            ) : (
              <View className="h-full w-full items-center justify-center bg-violet-500/30">
                <Text className="text-xs font-semibold text-violet-100">
                  {session.handle[0]?.toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
        <Pressable
          onPress={() => setOpen((v) => !v)}
          className="flex-row items-center gap-1 rounded-md px-2 py-1"
        >
          {!mobile && (
            <Text className="text-sm text-zinc-300">
              {profile?.displayName ?? session.handle}
            </Text>
          )}
          <Text className="text-xs text-zinc-400">▾</Text>
        </Pressable>
      </View>
      {open && (
        <View
          className="absolute right-0 top-12 w-56 overflow-hidden rounded-lg bg-zinc-950"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            zIndex: 50,
          }}
        >
          <View className="border-b border-white/5 px-3 py-2">
            <Text className="text-xs text-zinc-500">Signed in as</Text>
            <Text className="text-xs text-zinc-300">@{session.handle}</Text>
          </View>
          <Pressable
            onPress={() => {
              setOpen(false)
              router.push('/settings')
            }}
            className="px-3 py-2"
          >
            <Text className="text-sm text-zinc-200">Settings</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false)
              router.push('/go-live')
            }}
            className="border-t border-white/5 px-3 py-2"
          >
            <Text className="text-sm text-zinc-200">Go live</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false)
              logout.mutate(undefined, {
                onSuccess: () => router.replace('/'),
              })
            }}
            className="border-t border-white/5 px-3 py-2"
          >
            <Text className="text-sm text-rose-300">Log out</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

function TopbarSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const debounced = useDebounced(query, 200)
  const { data: actors = [] } = useTypeahead(debounced.trim(), 5)

  const open = focused && query.trim().length > 0
  return (
    <View style={{ position: 'relative' }}>
      <View className="flex-row items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
        <Text className="text-zinc-500">🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onSubmitEditing={() => {
            router.push(`/search`)
            setQuery('')
          }}
          placeholder="Search channels"
          placeholderTextColor="#71717a"
          className="flex-1 text-sm text-white"
        />
      </View>
      {open && actors.length > 0 && (
        <View
          className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg bg-zinc-950"
          style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {actors.map((a) => (
            <Pressable
              key={a.did}
              onPress={() => {
                setQuery('')
                setFocused(false)
                router.push(`/channel/${a.handle}`)
              }}
              className="border-b border-white/5 px-3 py-2"
            >
              <Text className="text-sm text-white">@{a.handle}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}
