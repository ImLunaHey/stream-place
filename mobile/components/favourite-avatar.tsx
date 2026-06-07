import { Link } from 'expo-router'
import { Image, Pressable, Text, View } from 'react-native'

type Props = {
  handle: string
  displayName?: string
  avatar?: string
  active?: boolean
  live?: boolean
}

export function FavouriteAvatar({
  handle,
  displayName,
  avatar,
  active,
  live,
}: Props) {
  return (
    <Link href={`/channel/${handle}`} asChild>
      <Pressable
        className="relative h-11 w-11 items-center justify-center rounded-xl bg-zinc-800"
        style={{
          borderWidth: live ? 2 : 1,
          borderColor: live ? '#f43f5e' : active ? '#a78bfa' : 'rgba(255,255,255,0.05)',
        }}
      >
        {active && (
          <View
            className="absolute h-6 w-1 rounded-r-full bg-violet-400"
            style={{ left: -8, top: '50%', transform: [{ translateY: -12 }] }}
          />
        )}
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
          />
        ) : (
          <Text className="text-sm font-semibold text-white">
            {(displayName ?? handle)[0]?.toUpperCase()}
          </Text>
        )}
        {live && (
          <View
            className="absolute rounded bg-rose-600 px-1 py-px"
            style={{ bottom: -6, left: '50%', transform: [{ translateX: -14 }] }}
          >
            <Text className="text-[8px] font-black uppercase text-white">
              Live
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  )
}
