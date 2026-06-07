import { Pressable, Text, View } from 'react-native'
import { warningLabel } from '../lib/content-warnings'

type Props = {
  warnings: string[]
  onAccept: () => void
}

export function ContentWarningOverlay({ warnings, onAccept }: Props) {
  return (
    <View className="absolute inset-0 items-center justify-center bg-zinc-950/90 p-6">
      <View className="w-full max-w-sm rounded-xl bg-zinc-900 p-5">
        <Text className="text-center text-base font-bold text-white">
          Content warning
        </Text>
        <Text className="mt-2 text-center text-sm text-zinc-300">
          This stream contains content some viewers may find distressing or
          offensive.
        </Text>
        <View className="mt-3 flex-row flex-wrap justify-center gap-1.5">
          {warnings.map((w) => (
            <View
              key={w}
              className="rounded-full bg-amber-500/20 px-2.5 py-0.5"
            >
              <Text className="text-xs font-semibold text-amber-200">
                {warningLabel(w)}
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={onAccept}
          className="mt-5 rounded-md bg-pink-500 px-4 py-3"
        >
          <Text className="text-center text-sm font-semibold text-white">
            OK, show stream
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
