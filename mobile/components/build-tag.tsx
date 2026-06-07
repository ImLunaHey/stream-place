import { Platform, Text, View } from 'react-native'

export function BuildTag() {
  if (Platform.OS !== 'web') return null
  const sha = process.env.EXPO_PUBLIC_GIT_SHA ?? 'dev'
  return (
    <View
      pointerEvents="none"
      style={{
        // @ts-expect-error – web-only CSS position
        position: 'fixed',
        bottom: 8,
        left: 8,
        zIndex: 9999,
      }}
    >
      <View
        className="flex-row items-center gap-1.5 rounded bg-black/70 px-2 py-1"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <View className="h-1.5 w-1.5 rounded-full bg-pink-400" />
        <Text className="font-mono text-[10px] text-zinc-300">
          mobile · expo · {sha}
        </Text>
      </View>
    </View>
  )
}
