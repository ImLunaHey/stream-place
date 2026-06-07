import { Pressable, Text } from 'react-native'
import { useFavourites } from '../hooks/use-favourites'

type Props = {
  handle: string
  displayName?: string
  avatar?: string
}

export function FavouriteButton({ handle, displayName, avatar }: Props) {
  const { toggle, isFavourite } = useFavourites()
  const fav = isFavourite(handle)
  return (
    <Pressable
      onPress={() => toggle({ handle, displayName, avatar })}
      className={`flex-row items-center gap-2 rounded-md px-3 py-2 ${
        fav ? 'bg-rose-500/20' : 'bg-white/5'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${
          fav ? 'text-rose-300' : 'text-zinc-200'
        }`}
      >
        {fav ? '♥ Favourited' : '♡ Favourite'}
      </Text>
    </Pressable>
  )
}
