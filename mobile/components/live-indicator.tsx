import { Pressable, Text, View } from 'react-native'

type Props = {
  behindLive: boolean
  lagSeconds: number
  onGoLive: () => void
}

export function LiveIndicator({ behindLive, lagSeconds, onGoLive }: Props) {
  if (behindLive) {
    return (
      <Pressable
        onPress={onGoLive}
        className="flex-row items-center gap-1.5 rounded bg-zinc-700/80 px-2 py-1"
      >
        <View className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        <Text className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
          -{Math.round(lagSeconds)}s · Go live
        </Text>
      </Pressable>
    )
  }
  return (
    <View className="flex-row items-center gap-1.5 rounded bg-rose-600 px-2 py-1">
      <View className="h-1.5 w-1.5 rounded-full bg-white" />
      <Text className="text-[11px] font-bold uppercase tracking-wider text-white">
        Live
      </Text>
    </View>
  )
}
