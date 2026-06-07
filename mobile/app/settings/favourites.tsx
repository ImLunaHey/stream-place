import { Link } from 'expo-router'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useFavourites } from '../../hooks/use-favourites'

export default function Favourites() {
  const { favourites, toggle } = useFavourites()
  return (
    <ScrollView
      className="flex-1 bg-zinc-900"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text className="text-xl font-bold text-white">Favourite channels</Text>
      {favourites.length === 0 ? (
        <Text className="mt-3 text-sm text-zinc-400">
          No favourites yet. Tap the heart on a channel to add it.
        </Text>
      ) : (
        <View className="mt-3 gap-2">
          {favourites.map((f) => (
            <View
              key={f.handle}
              className="flex-row items-center gap-3 rounded-md bg-white/5 p-2"
            >
              {f.avatar ? (
                <Image
                  source={{ uri: f.avatar }}
                  className="h-9 w-9 rounded-full"
                />
              ) : (
                <View className="h-9 w-9 rounded-full bg-zinc-800" />
              )}
              <Link href={`/channel/${f.handle}`} className="flex-1">
                <View>
                  <Text className="text-sm font-semibold text-white">
                    {f.displayName ?? f.handle}
                  </Text>
                  <Text className="text-xs text-zinc-500">@{f.handle}</Text>
                </View>
              </Link>
              <Pressable
                onPress={() => toggle(f)}
                className="rounded-md bg-white/5 px-2 py-1"
              >
                <Text className="text-xs text-zinc-300">Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
